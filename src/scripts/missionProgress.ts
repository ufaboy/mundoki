// Counts answers given inside a mission towards the child's results ("Estrellas").
// They go into the same local game state as the "Jugar" trainer and, for a
// signed-in family, are sent to POST /api/progress/sync, where the server
// re-checks every answer itself before it counts.

import { applyExerciseOutcome, type AttemptRecord } from '../game/core/gameState';
import { reconcileSyncedState } from '../game/core/syncState';
import type { TopicId } from '../math/core/types';
import { loadLocalGameState, saveLocalGameState } from './gameStateStorage';

// Authored mission questions never change, so each one counts once per account (once per
// browser while signed out). Two students sharing a device each get their own list.
const COUNTED_KEY = 'mundoki_mission_checks_v1';

function isPremium(): boolean {
  try {
    return window.localStorage.getItem('mundoki_premium') === 'true';
  } catch {
    return false;
  }
}

/** The signed-in account's list, or the browser's list when signed out. */
function countedKey(): string {
  try {
    const user: unknown = JSON.parse(window.localStorage.getItem('mundoki_user') ?? 'null');
    const id = user && typeof user === 'object' ? (user as { id?: unknown }).id : undefined;
    return typeof id === 'string' && id ? `${COUNTED_KEY}:${id}` : COUNTED_KEY;
  } catch {
    return COUNTED_KEY;
  }
}

/** Mission questions (`lessonId:checkIndex`) this account (or this signed-out browser) answered right. */
export function readCounted(): string[] {
  try {
    const key = countedKey();
    let raw = window.localStorage.getItem(key);
    if (raw === null && key !== COUNTED_KEY) {
      // An account without a list yet takes over the browser's list once: answers given
      // while signed out, or by everyone on this browser before 2.3.0. Moving (not copying)
      // it means a second account on the same device starts with its own empty list.
      raw = window.localStorage.getItem(COUNTED_KEY);
      if (raw !== null) {
        window.localStorage.setItem(key, raw);
        window.localStorage.removeItem(COUNTED_KEY);
      }
    }
    const parsed: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/** Marks a question as counted; false when it already was. */
function markCounted(lessonId: string, checkIndex: number): boolean {
  const key = `${lessonId}:${checkIndex}`;
  const counted = readCounted();
  if (counted.includes(key)) return false;
  try {
    window.localStorage.setItem(countedKey(), JSON.stringify([...counted, key]));
  } catch {
    // Storage blocked: count it for this visit anyway.
  }
  return true;
}

function newAttemptId(): string {
  return `att_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

let syncing = false;

/** Sends answers still waiting for the server. Safe to call any time; does nothing when signed out. */
export async function syncNow(): Promise<void> {
  if (syncing) return;
  let token: string | null = null;
  try {
    token = window.localStorage.getItem('mundoki_token');
  } catch {
    return;
  }
  const pending = loadLocalGameState().pendingSyncAttempts;
  if (!token || !pending.length) return;

  syncing = true;
  try {
    const response = await fetch('/api/progress/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ attempts: pending }),
    });
    if (!response.ok) return;
    const data = await response.json();
    if (data.gameState) {
      // Re-read: the child may have answered again while the request was in flight.
      const merged = reconcileSyncedState(loadLocalGameState(), data.gameState, data.syncedAttemptIds || [], Boolean(data.isPremiumEntitled));
      saveLocalGameState(merged);
    }
  } catch {
    // Offline or server error: the answers stay pending and go with the next one.
  } finally {
    syncing = false;
  }
}

function record(attempt: AttemptRecord): number {
  const { nextState } = applyExerciseOutcome(loadLocalGameState(), attempt, isPremium());
  saveLocalGameState(nextState);
  void syncNow();
  return nextState.stars;
}

/** A generated "new numbers" exercise. Returns the child's star total. */
export function recordPracticeAnswer(input: {
  skill: string;
  seed: number;
  optionIndex: number;
  isCorrect: boolean;
  topicId: TopicId;
}): number {
  return record({
    attemptId: newAttemptId(),
    exerciseId: `practice-${input.skill}-s${input.seed}`,
    topicId: input.topicId,
    seed: input.seed,
    difficulty: 1,
    userAnswer: String(input.optionIndex),
    isCorrect: input.isCorrect,
    timestamp: new Date().toISOString(),
    syncedToServer: false,
    source: 'practice',
    skill: input.skill,
  });
}

/**
 * A secundaria lesson item answered correctly: `answer` is the typed text (a number,
 * an "x;y" pair) or the chosen option index. The server re-checks it. Returns the
 * star total, or null when this item was already counted for this account.
 */
export function recordSecondaryAnswer(input: { lessonId: string; checkIndex: number; answer: string; topicId: TopicId }): number | null {
  if (!markCounted(input.lessonId, input.checkIndex)) return null;
  return record({
    attemptId: newAttemptId(),
    exerciseId: `mission-${input.lessonId}-c${input.checkIndex}`,
    topicId: input.topicId,
    seed: input.checkIndex,
    difficulty: 1,
    userAnswer: input.answer,
    isCorrect: true,
    timestamp: new Date().toISOString(),
    syncedToServer: false,
    source: 'mission',
    lessonId: input.lessonId,
    checkIndex: input.checkIndex,
  });
}

/**
 * The mission's own question, answered correctly. Returns the star total, or
 * null when this question was already counted in this browser.
 * `optionIndex` is the chosen option; Grade 3 sends `answer` instead (an option
 * index or a typed number) and, for a generated version, its `variantSeed`.
 */
export function recordMissionCheck(input: {
  lessonId: string;
  checkIndex: number;
  optionIndex?: number;
  answer?: string;
  variantSeed?: number;
  topicId: TopicId;
}): number | null {
  if (!markCounted(input.lessonId, input.checkIndex)) return null;
  return record({
    attemptId: newAttemptId(),
    exerciseId: `mission-${input.lessonId}-c${input.checkIndex}${input.variantSeed ? `-v${input.variantSeed}` : ''}`,
    topicId: input.topicId,
    seed: input.checkIndex,
    difficulty: 1,
    userAnswer: input.answer ?? String(input.optionIndex),
    ...(input.variantSeed ? { variantSeed: input.variantSeed } : {}),
    isCorrect: true,
    timestamp: new Date().toISOString(),
    syncedToServer: false,
    source: 'mission',
    lessonId: input.lessonId,
    checkIndex: input.checkIndex,
  });
}
