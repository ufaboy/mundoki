// Server-side check of answers given inside a mission, for POST /api/progress/sync.
// Two kinds arrive from the client:
//   source "practice"  a generated "new numbers" exercise — re-created here from (skill, seed)
//   source "mission"   the mission's own question — looked up in the answer key, or, for a
//                      Grade 3 version shown after a wrong answer, re-created from
//                      (lesson, check, variantSeed)
// Nothing the client says about correctness is used.

import type { TopicId } from '../../math/core/types';
import { findMissionCheck } from '../../content/missionChecks';
import { findSecondaryItem } from '../../content/secondary';
import { checkSecondaryAnswer, MAX_SECONDARY_ANSWER } from '../../math/core/secondaryAnswer';
import { SECONDARY_LESSON_ID } from '../../game/core/gameState';
import { generatePractice, isPracticeSkill, PRACTICE_TOPIC } from '../../math/practice/generators';
import { GRADE_THREE_GENERATORS, gradeThreeVariant, MAX_VARIANT_SEED } from '../../content/grade3/variants';

/** Secundaria lesson ids: G08-07-L01 … G12-xx-Lxx. */
export function isSecondaryLessonId(value: unknown): boolean {
  return typeof value === 'string' && SECONDARY_LESSON_ID.test(value);
}

export interface ResolvedMissionAttempt {
  source: 'practice' | 'mission';
  isCorrect: boolean;
  topicId: TopicId;
  exerciseId: string;
  seed: number;
  /**
   * Id a correct answer is stored under. It is the same for every repeat of the
   * same exercise by the same child, so one exercise earns credit only once.
   */
  creditId: string;
  skill?: string;
  lessonId?: string;
  checkIndex?: number;
}

/**
 * Results bucket for secundaria lessons (Grades 8–12). It reuses the old linear-equations
 * topic id (a row in the D1 `topics` table, so no migration is needed); that trainer topic
 * is gone, so the bucket holds secundaria answers only, and applyExerciseOutcome gives
 * them no world rewards (ships, guardians, outfits, planets).
 * A dedicated topic id would need a `topics` row first: every progress save upserts
 * user_progress for each topic, so deploying it before the migration would break saving.
 */
export const SECONDARY_TOPIC: TopicId = 'linear-equations';

/** Returns null when the payload is malformed or names an unknown skill, lesson or question. */
export function resolveMissionAttempt(item: Record<string, unknown>, userId: string): ResolvedMissionAttempt | null {
  const answerText = String(item.userAnswer ?? '');

  // Secundaria lessons: typed answers (a number or an "x;y" pair) or a choice index.
  if (item.source === 'mission' && isSecondaryLessonId(item.lessonId)) {
    const lessonId = String(item.lessonId).toUpperCase();
    const checkIndex = Number(item.checkIndex);
    if (answerText.length > MAX_SECONDARY_ANSWER) return null;
    // Bounds come from the lesson itself: an index without an item resolves to null.
    const secondary = findSecondaryItem(lessonId, checkIndex);
    if (!secondary) return null;
    const verdict = checkSecondaryAnswer(secondary.answer, answerText);
    if (verdict === 'invalid') return null;
    return {
      source: 'mission',
      isCorrect: verdict === 'correct',
      topicId: SECONDARY_TOPIC,
      exerciseId: `mission-${lessonId}-c${checkIndex}`,
      seed: checkIndex,
      creditId: `mission:${userId}:${lessonId}:${checkIndex}`,
      lessonId,
      checkIndex,
    };
  }

  if (item.source === 'practice') {
    if (!/^\d$/.test(answerText)) return null;
    const answer = Number(answerText);
    const skill = item.skill;
    const seed = Number(item.seed);
    if (!isPracticeSkill(skill) || !Number.isSafeInteger(seed) || seed <= 0 || answer > 2) return null;
    const exercise = generatePractice(skill, seed);
    return {
      source: 'practice',
      isCorrect: answer === exercise.answerIndex,
      topicId: PRACTICE_TOPIC[skill],
      exerciseId: `practice-${skill}-s${exercise.seed}`,
      seed: exercise.seed,
      creditId: `practice:${userId}:${skill}:${exercise.seed}`,
      skill,
    };
  }

  if (item.source === 'mission') {
    const lessonId = String(item.lessonId ?? '');
    const checkIndex = Number(item.checkIndex);
    if (!/^[A-Za-z0-9-]{3,32}$/.test(lessonId) || !Number.isInteger(checkIndex) || checkIndex < 0 || checkIndex > 20) return null;
    const key = findMissionCheck(lessonId, checkIndex);
    if (!key) return null;
    // A Grade 3 version shown after a wrong answer: rebuild it from its seed.
    let expected = { answer: key.answer, input: key.input };
    const variantSeed = item.variantSeed === undefined || item.variantSeed === null ? 0 : Number(item.variantSeed);
    if (!Number.isSafeInteger(variantSeed) || variantSeed < 0 || variantSeed >= MAX_VARIANT_SEED) return null;
    if (variantSeed > 0) {
      if (!GRADE_THREE_GENERATORS[lessonId]?.[checkIndex]) return null;
      try {
        const variant = gradeThreeVariant(lessonId, checkIndex, variantSeed);
        expected = { answer: variant.answer, input: variant.input };
      } catch {
        return null;
      }
    }
    // A typed number (up to 10,000) or a single option index.
    if (!(expected.input === 'number' ? /^\d{1,5}$/ : /^\d$/).test(answerText)) return null;
    return {
      source: 'mission',
      isCorrect: Number(answerText) === expected.answer,
      topicId: key.topicId,
      exerciseId: `mission-${lessonId}-c${checkIndex}${variantSeed ? `-v${variantSeed}` : ''}`,
      seed: variantSeed || checkIndex,
      creditId: `mission:${userId}:${lessonId}:${checkIndex}`,
      lessonId,
      checkIndex,
    };
  }

  return null;
}
