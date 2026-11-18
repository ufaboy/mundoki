// Checks a typed or chosen answer to a secundaria lesson item (Grades 8–12).
// Runs in the browser for instant feedback and on the server in POST /api/progress/sync,
// so both always agree. Only exact rational arithmetic is used.

import { parseRationalInput, type Rational } from './fraction';

export type SecondaryAnswerSpec =
  | { kind: 'number'; value: string }
  | { kind: 'pair'; x: string; y: string }
  | { kind: 'choice'; answer: number; count: number };

export type SecondaryVerdict = 'correct' | 'incorrect' | 'invalid';

/** Longest answer text accepted anywhere (input, sync payload). */
export const MAX_SECONDARY_ANSWER = 40;

/** Reads "−3", "x = 5/2", "2,5" as an exact rational; null when it is not a number. */
export function readRational(raw: string): Rational | null {
  const cleaned = raw
    .trim()
    .replace(/[−‒–—]/g, '-')
    .replace(/^[a-zA-Z]\s*=\s*/, '')
    .replace(/°/g, '') // angles may be typed as "50°"
    .replace(/\s+/g, '');
  if (!cleaned || cleaned.length > MAX_SECONDARY_ANSWER || !/^-?[0-9.,]+(\/-?[0-9.,]+)?$/.test(cleaned)) return null;
  const parsed = parseRationalInput(cleaned);
  return parsed.valid && parsed.rational ? parsed.rational : null;
}

const same = (a: Rational, b: Rational) => a.numerator === b.numerator && a.denominator === b.denominator;

/** Pair answers travel as "x;y". */
export function joinPair(x: string, y: string): string {
  return `${x.trim()};${y.trim()}`;
}

export function checkSecondaryAnswer(spec: SecondaryAnswerSpec, raw: string): SecondaryVerdict {
  const text = String(raw ?? '');
  if (!text.trim() || text.length > MAX_SECONDARY_ANSWER) return 'invalid';

  if (spec.kind === 'choice') {
    if (!/^\d$/.test(text)) return 'invalid';
    const index = Number(text);
    if (index >= spec.count) return 'invalid';
    return index === spec.answer ? 'correct' : 'incorrect';
  }

  if (spec.kind === 'number') {
    const given = readRational(text);
    const expected = readRational(spec.value);
    if (!given || !expected) return 'invalid';
    return same(given, expected) ? 'correct' : 'incorrect';
  }

  const parts = text.split(';');
  if (parts.length !== 2) return 'invalid';
  const gx = readRational(parts[0]);
  const gy = readRational(parts[1]);
  const ex = readRational(spec.x);
  const ey = readRational(spec.y);
  if (!gx || !gy || !ex || !ey) return 'invalid';
  return same(gx, ex) && same(gy, ey) ? 'correct' : 'incorrect';
}

/** True when the typed answer equals a listed typical wrong value (same rules as the check). */
export function matchesValue(kind: 'number' | 'pair', raw: string, value: string): boolean {
  if (kind === 'number') {
    return checkSecondaryAnswer({ kind: 'number', value }, raw) === 'correct';
  }
  const [x, y] = value.split(';');
  return checkSecondaryAnswer({ kind: 'pair', x: x ?? '', y: y ?? '' }, raw) === 'correct';
}
