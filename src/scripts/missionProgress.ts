// Counts answers given inside a mission towards the child's results ("Estrellas").
// They go into the same local game state as the "Jugar" trainer and, for a
// signed-in family, are sent to POST /api/progress/sync, where the server
// re-checks every answer itself before it counts.

import { applyExerciseOutcome, type AttemptRecord } from '../game/core/gameState';
import { reconcileSyncedState } from '../game/core/syncState';
import type { TopicId } from '../math/core/types';
import { loadLocalGameState, saveLocalGameState } from './gameStateStorage';

// Authored mission questions never change, so each one counts once per browser.
const COUNTED_KEY = 'mundoki_mission_checks_v1';

function isPremium(): boolean {
  try {
    return window.localStorage.getItem('mundoki_premium') === 'true';
  } catch {
    return false;
  }
}

/** Mission questions (`lessonId:checkIndex`) already answered right in this browser. */
export function readCounted(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(COUNTED_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
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
 * The mission's own question, answered correctly. Returns the star total, or
 * null when this question was already counted in this browser.
 */
export function recordMissionCheck(input: {
  lessonId: string;
  checkIndex: number;
  optionIndex: number;
  topicId: TopicId;
}): number | null {
  const key = `${input.lessonId}:${input.checkIndex}`;
  const counted = readCounted();
  if (counted.includes(key)) return null;
  try {
    window.localStorage.setItem(COUNTED_KEY, JSON.stringify([...counted, key]));
  } catch {
    // Storage blocked: count it for this visit anyway.
  }
  return record({
    attemptId: newAttemptId(),
    exerciseId: `mission-${input.lessonId}-c${input.checkIndex}`,
    topicId: input.topicId,
    seed: input.checkIndex,
    difficulty: 1,
    userAnswer: String(input.optionIndex),
    isCorrect: true,
    timestamp: new Date().toISOString(),
    syncedToServer: false,
    source: 'mission',
    lessonId: input.lessonId,
    checkIndex: input.checkIndex,
  });
}
