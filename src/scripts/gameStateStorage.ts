import { INITIAL_GAME_STATE, PlayerGameState } from '../game/core/gameState';

const STORAGE_KEY = 'mundoki_game_state_v1';

export function loadLocalGameState(): PlayerGameState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlayerGameState>;
      return {
        ...INITIAL_GAME_STATE,
        ...parsed,
        topicMastery: { ...INITIAL_GAME_STATE.topicMastery, ...(parsed.topicMastery || {}) },
        equippedCosmetics: { ...INITIAL_GAME_STATE.equippedCosmetics, ...(parsed.equippedCosmetics || {}) },
        unlockedCosmetics: parsed.unlockedCosmetics || INITIAL_GAME_STATE.unlockedCosmetics,
        unlockedPlanets: parsed.unlockedPlanets || INITIAL_GAME_STATE.unlockedPlanets,
        pendingSyncAttempts: parsed.pendingSyncAttempts || [],
      };
    }
  } catch {
    // Ignore storage errors.
  }
  return { ...INITIAL_GAME_STATE };
}

export function saveLocalGameState(state: PlayerGameState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors.
  }
}
