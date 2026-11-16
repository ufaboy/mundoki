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

  for (const raw of incomingAttempts.slice(0, 50)) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Record<string, unknown>;
    const attemptId = String(item.attemptId || '').trim();
    const topicId = item.topicId as TopicId;
    const seed = Number(item.seed);
    const difficulty = (Number(item.difficulty) || 1) as 1 | 2 | 3;
    const userAnswer = String(item.userAnswer ?? '');

    if (!attemptId || attemptId.length > 200 || seen.has(attemptId)) continue;
    seen.add(attemptId);
    if (await isAttemptProcessedInStore(attemptId, env)) {
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
