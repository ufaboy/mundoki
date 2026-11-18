// Server-side check of answers given inside a mission, for POST /api/progress/sync.
// Two kinds arrive from the client:
//   source "practice"  a generated "new numbers" exercise — re-created here from (skill, seed)
//   source "mission"   the mission's own authored question — looked up in the answer key
// Nothing the client says about correctness is used.

import type { TopicId } from '../../math/core/types';
import { findMissionCheck } from '../../content/missionChecks';
import { findSecondaryItem } from '../../content/secondary';
import { checkSecondaryAnswer, MAX_SECONDARY_ANSWER } from '../../math/core/secondaryAnswer';
import { SECONDARY_LESSON_ID } from '../../game/core/gameState';
import { generatePractice, isPracticeSkill, PRACTICE_TOPIC } from '../../math/practice/generators';

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

  if (!/^\d$/.test(answerText)) return null;
  const answer = Number(answerText);

  if (item.source === 'practice') {
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
    return {
      source: 'mission',
      isCorrect: answer === key.answer,
      topicId: key.topicId,
      exerciseId: `mission-${lessonId}-c${checkIndex}`,
      seed: checkIndex,
      creditId: `mission:${userId}:${lessonId}:${checkIndex}`,
      lessonId,
      checkIndex,
    };
  }

  return null;
}
