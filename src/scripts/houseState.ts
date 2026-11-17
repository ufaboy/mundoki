// Pure state for the Grade 3 house story (tested in houseAdventureSuite.ts).
export type HouseColor = 'terracotta' | 'sage' | 'blue';
export interface HousePreferences { name: string; color: HouseColor }

export const HOUSE_COLORS: HouseColor[] = ['terracotta', 'sage', 'blue'];
export const HOUSE_TOTAL_PIECES = 82;
const LAST_MISSION = HOUSE_TOTAL_PIECES / 2 - 1;

export function cleanHousePreferences(value: unknown): HousePreferences {
  const v = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  return {
    name: typeof v.name === 'string' ? v.name.trim().slice(0, 24) : '',
    color: HOUSE_COLORS.includes(v.color as HouseColor) ? v.color as HouseColor : 'terracotta',
  };
}

/** Each correct answer adds one piece: mission i with s solved challenges shows i × 2 + s pieces. */
export function houseSceneState(index: number, solved: number) {
  const mission = Math.max(0, Math.min(LAST_MISSION, Number.isFinite(index) ? Math.floor(index) : 0));
  const steps = Math.max(0, Math.min(2, Number.isFinite(solved) ? Math.floor(solved) : 0));
  return { steps, pieces: mission * 2 + steps, complete: mission === LAST_MISSION && steps === 2 };
}

/** Piece n shows once built, unless it is removed later (`until`: materials used up, truck gone). */
export function housePieceVisible(piece: number, progress: number, until?: number) {
  return piece <= progress && (until === undefined || progress < until);
}
