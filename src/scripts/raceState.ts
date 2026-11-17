// Grade 6 Math Racing: mission progress inside one lesson page and the
// browser-only team look (team name, car color, helmet emblem).
export interface RaceState { current: number; solved: number; count: number }

export function initialRaceState(count: number): RaceState {
 if (!Number.isInteger(count) || count < 1) throw new Error('A race mission needs checks');
 return { current: 0, solved: 0, count };
}
export function answerRace(state: RaceState, question: number, correct: boolean): RaceState {
 if (!correct || question !== state.current || state.solved !== state.current) return state;
 return { ...state, solved: state.solved + 1 };
}
export function nextRace(state: RaceState): RaceState {
 return state.solved === state.current + 1 && state.solved < state.count ? { ...state, current: state.current + 1 } : state;
}
export function raceStage(state: RaceState): 'start' | 'building' | 'complete' {
 return state.solved === state.count ? 'complete' : state.solved > 0 ? 'building' : 'start';
}

export const RACE_COLORS = { red: '#d4453b', teal: '#1f8a87', gold: '#d79a1d' } as const;
export const RACE_EMBLEMS = { star: '★', bolt: '⚡', flag: '🏁' } as const;
export type RaceColor = keyof typeof RACE_COLORS;
export type RaceEmblem = keyof typeof RACE_EMBLEMS;
export interface RacePreferences { name: string; color: RaceColor; emblem: RaceEmblem }

export function cleanRacePreferences(value: unknown): RacePreferences {
 const v = value && typeof value === 'object' ? value as Record<string, unknown> : {};
 return {
  name: typeof v.name === 'string' ? v.name.trim().slice(0, 24) : '',
  color: typeof v.color === 'string' && Object.hasOwn(RACE_COLORS, v.color) ? v.color as RaceColor : 'red',
  emblem: typeof v.emblem === 'string' && Object.hasOwn(RACE_EMBLEMS, v.emblem) ? v.emblem as RaceEmblem : 'star',
 };
}
