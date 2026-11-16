// Server-side check of answers given inside a mission, for POST /api/progress/sync.
// Two kinds arrive from the client:
//   source "practice"  a generated "new numbers" exercise — re-created here from (skill, seed)
//   source "mission"   the mission's own authored question — looked up in the answer key
// Nothing the client says about correctness is used.

import type { TopicId } from '../../math/core/types';
import { findMissionCheck } from '../../content/missionChecks';
import { generatePractice, isPracticeSkill, PRACTICE_TOPIC } from '../../math/practice/generators';

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

/** Returns null when the payload is malformed or names an unknown skill, lesson or question. */
export function resolveMissionAttempt(item: Record<string, unknown>, userId: string): ResolvedMissionAttempt | null {
  const answerText = String(item.userAnswer ?? '');
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
