import { applyExerciseOutcome, PlayerGameState } from './gameState';

/** Rebase answers not acknowledged by the server, including answers made during the request. */
export function reconcileSyncedState(local: PlayerGameState, server: PlayerGameState,
  acknowledged: string[], premium: boolean): PlayerGameState {
  const ids = new Set(acknowledged);
  let state = { ...server, reducedMotion: local.reducedMotion, pendingSyncAttempts: [] };
  for (const attempt of local.pendingSyncAttempts) {
    if (!ids.has(attempt.attemptId)) {
      state = applyExerciseOutcome(state, attempt, premium).nextState;
      ids.add(attempt.attemptId);
    }
  }
  return state;
}
