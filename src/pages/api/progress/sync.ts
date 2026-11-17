import type { APIRoute } from 'astro';
import { applyExerciseOutcome, AttemptRecord } from '../../../game/core/gameState';
import {
  getAuthenticatedSessionUser,
  getGameStateFromStore,
  getGameStateRevision,
  getSubscriptionFromStore,
  isAttemptProcessedInStore,
  isSubscriptionActive,
  jsonResponse,
  saveGameStateInStore,
} from '../../../lib/db/d1Store';
import { resolveMissionAttempt } from '../../../lib/server/missionAttempts';
import { isFreeLesson } from '../../../content/premiumAccess';
import { getRuntimeEnv } from '../../../lib/server/runtimeEnv';
import { TopicId } from '../../../math/core/types';
import { validateMathAnswer } from '../../../math/core/validator';
import { generateMathExercise, TOPICS_CATALOG } from '../../../math/topics/generators';

export const prerender = false;

/**
 * Batched, idempotent progress synchronization endpoint (`POST /api/progress/sync`).
 * - Never trusts client-submitted `isCorrect: true`.
 * - Recomputes every exercise deterministically on the server from `(topicId, difficulty, seed)`
 *   and validates `userAnswer` before awarding energy, stars, or rewards.
 * - Enforces deduplication via `attemptId`.
 * - Answers given inside a mission (`source: "practice" | "mission"`) are checked the same
 *   way: a generated exercise is re-created from `(skill, seed)`, an authored question is
 *   looked up in the answer key. Each such exercise earns credit once per child.
 */
export const POST: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  const user = await getAuthenticatedSessionUser(request, env);
  if (!user) {
    return jsonResponse({ error: 'Authentication required to sync progress.' }, 401);
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!body || typeof body !== 'object') return jsonResponse({ error: 'Invalid body' }, 400);
  const revision = await getGameStateRevision(user.id, env);
  const incomingAttempts = Array.isArray(body.attempts) ? body.attempts : [];
  const [subscription, initialState] = await Promise.all([
    getSubscriptionFromStore(user.id, env),
    getGameStateFromStore(user.id, env),
  ]);
  const isPremium = isSubscriptionActive(subscription);
  let currentState = initialState;
  const newlyProcessedIds: string[] = [];
  const verifiedAttempts: AttemptRecord[] = [];
  const seen = new Set<string>();
  const credited = new Set<string>();

  for (const raw of incomingAttempts.slice(0, 50)) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Record<string, unknown>;
    const attemptId = String(item.attemptId || '').trim();
    const topicId = item.topicId as TopicId;
    const seed = Number(item.seed);
    const difficulty = (Number(item.difficulty) || 1) as 1 | 2 | 3;
    const userAnswer = String(item.userAnswer ?? '');

    // "practice:" / "mission:" ids are minted here only (see creditId), never accepted from a client.
    if (!attemptId || attemptId.length > 200 || seen.has(attemptId) || /^(practice|mission):/.test(attemptId)) continue;
    seen.add(attemptId);
    if (await isAttemptProcessedInStore(attemptId, env)) {
      newlyProcessedIds.push(attemptId);
      continue;
    }

    if (item.source === 'practice' || item.source === 'mission') {
      const resolved = resolveMissionAttempt(item, user.id);
      if (!resolved) continue;
      const missionTopic = TOPICS_CATALOG.find((t) => t.id === resolved.topicId);
      if (!missionTopic || (missionTopic.accessLevel === 'premium' && !isPremium)) continue;
      // Missions after a grade's first chapter need Premium (see content/premiumAccess.ts).
      if (resolved.source === 'mission' && resolved.lessonId && !isFreeLesson(resolved.lessonId) && !isPremium) continue;

      // An authored question only counts when solved; a miss there is not recorded.
      if (!resolved.isCorrect && resolved.source === 'mission') {
        newlyProcessedIds.push(attemptId);
        continue;
      }
      // A right answer is stored under an id fixed by the exercise, so repeating
      // the same exercise (whose answer is now known) earns nothing more.
      const storedId = resolved.isCorrect ? resolved.creditId : attemptId;
      if (resolved.isCorrect && (credited.has(storedId) || (await isAttemptProcessedInStore(storedId, env)))) {
        newlyProcessedIds.push(attemptId);
        continue;
      }
      credited.add(storedId);

      const missionAttempt: AttemptRecord = {
        attemptId: storedId,
        exerciseId: resolved.exerciseId,
        topicId: resolved.topicId,
        seed: resolved.seed,
        difficulty: 1,
        userAnswer,
        isCorrect: resolved.isCorrect,
        timestamp: new Date().toISOString(),
        syncedToServer: true,
        source: resolved.source,
        skill: resolved.skill,
        lessonId: resolved.lessonId,
        checkIndex: resolved.checkIndex,
      };
      currentState = {
        ...applyExerciseOutcome(currentState, missionAttempt, isPremium).nextState,
        pendingSyncAttempts: [],
      };
      verifiedAttempts.push(missionAttempt);
      newlyProcessedIds.push(attemptId);
      continue;
    }

    const topicMeta = TOPICS_CATALOG.find((t) => t.id === topicId);
    if (!topicMeta || !Number.isSafeInteger(seed) || ![1, 2, 3].includes(difficulty)) continue;

    if (topicMeta.accessLevel === 'premium' && !isPremium) {
      continue;
    }

    const serverExercise = generateMathExercise(topicId, difficulty, seed);
    const validation = validateMathAnswer(serverExercise, userAnswer);

    const verifiedAttempt: AttemptRecord = {
      attemptId,
      exerciseId: serverExercise.id,
      topicId,
      seed,
      difficulty,
      userAnswer,
      isCorrect: validation.status === 'correct',
      timestamp: new Date().toISOString(),
      syncedToServer: true,
    };

    const outcome = applyExerciseOutcome(currentState, verifiedAttempt, isPremium);
    currentState = {
      ...outcome.nextState,
      pendingSyncAttempts: [],
    };
    verifiedAttempts.push(verifiedAttempt);
    newlyProcessedIds.push(attemptId);
  }

  try {
    await saveGameStateInStore(user.id, currentState, env, verifiedAttempts, revision);
  } catch {
    return jsonResponse({ error: 'Progress changed. Retry synchronization.' }, 409);
  }

  return jsonResponse({
    syncedAttemptIds: newlyProcessedIds,
    gameState: currentState,
    isPremiumEntitled: isPremium,
  });
};
