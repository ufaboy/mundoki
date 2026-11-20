// Building blocks for Grade 3 challenge generators. The seeded random source,
// bilingual text and the typed/choice builders come from the Grade 2 kit; this
// file adds Grade 3 number formatting (to 10,000) and a few helpers.
// A generator returns one fresh version of a mission challenge: same skill and
// same building-site object, new numbers. In "why" questions it also changes
// which option is right, so remembering a wrong button never helps.
import { rng, T, typed, choose, type Rng, type GradeTwoVariant } from '../../grade2/variants/kit';
import type { LocalizedText } from '../../../math/core/types';
import { GRADE_THREE_MAX } from '../checks';

export { rng, T, typed, choose, type Rng };
export type GradeThreeVariant = GradeTwoVariant;
export type Generator = (r: Rng) => GradeThreeVariant;

/** «3.528» (es-AR) — numbers from 1,000 get a thousands separator, as in the lessons. */
export const es = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/** “3,528” (en-US). */
export const en = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Choice between numbers: drops repeated or out-of-range distractors, keeps up to 3. */
export function chooseNumber(r: Rng, prompt: LocalizedText, correct: number, candidates: number[], explanation: LocalizedText, hint: LocalizedText, extra: { reward?: LocalizedText; unit?: [string, string]; model?: number } = {}): GradeThreeVariant {
  const wrong = [...new Set(candidates)].filter(n => n !== correct && n >= 0 && n <= GRADE_THREE_MAX).slice(0, 3);
  if (wrong.length < 2) throw new Error(`chooseNumber needs two distractors: ${prompt['en-US']}`);
  const label = (n: number) => extra.unit ? T(`${es(n)} ${extra.unit[0]}`, `${en(n)} ${extra.unit[1]}`) : T(es(n), en(n));
  return choose(r, prompt, label(correct), wrong.map(label), explanation, hint, { reward: extra.reward, model: extra.model });
}

/** Text option written once per language: «es|en». */
export const L = (value: string): LocalizedText => {
  const [a, b] = value.split('|');
  if (!a || !b) throw new Error(`Missing translation: ${value}`);
  return T(a, b);
};

/** One of several hand-written versions (for questions whose right answer must change). */
export const oneOf = (r: Rng, versions: (() => GradeThreeVariant)[]) => r.pick(versions)();

/** Two different integers from a range. */
export function twoDifferent(r: Rng, min: number, max: number): [number, number] {
  const a = r.int(min, max);
  let b = r.int(min, max - 1);
  if (b >= a) b++;
  return [a, b];
}
