// Building blocks for Grade 4 challenge generators. The seeded random source and
// bilingual text come from the Grade 2 kit; this file adds typed exact answers
// (whole numbers, fractions, decimals), number formatting to millions, and the
// optional data for the question model shown above a version (fraction strips,
// an angle, a place-value table…).
// A generator returns one fresh version of a mission challenge: same skill and
// same story object, new numbers. In "why" questions it also changes which
// option is right, so remembering a wrong button never helps.
import { rng, T, type Rng } from '../../grade2/variants/kit';
import type { LocalizedText } from '../../../math/core/types';
import type { GradeOneCheck } from '../../lessonModel';

export { rng, T, type Rng };

/** Data for the question model (IslandModel.astro) drawn above a generated version. */
export interface IslandModelData {
  /** Digits of a number in the place-value table, millions first («3702040»). */
  place?: string;
  /** Fraction strips: [shaded, parts] for each whole. */
  strips?: [number, number][];
  /** An angle in degrees, with an optional label. */
  angle?: number;
  angleLabel?: LocalizedText;
  /** A number line from 0 to 1 split into this many equal intervals. */
  line?: number;
  /** A rectangular array: [columns, rows]. */
  array?: [number, number];
  /** Pictograph: number of stars and votes per star. */
  stars?: [number, number];
}

export interface GradeFourVariant extends GradeOneCheck {
  /** Hint for this version's numbers. */
  hint: LocalizedText;
  /** Reward when the mission's own reward names other numbers. May use {name}. */
  reward?: LocalizedText;
  model?: IslandModelData;
}
export type Generator = (r: Rng) => GradeFourVariant;
type Extra = { unit?: LocalizedText; reward?: LocalizedText; model?: IslandModelData };

/** Whole numbers with a thousands separator, as in the lessons: «3.702.040» / “3,702,040”. */
export const es = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const en = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
/** Decimals: «2,08» / “2.08”. `hundredths` is the value × 100. */
export const decEs = (hundredths: number, places = 2) => (hundredths / 100).toFixed(places).replace('.', ',');
export const decEn = (hundredths: number, places = 2) => (hundredths / 100).toFixed(places);

/** Text option written once per language: «es|en». */
export const L = (value: string): LocalizedText => {
  const [a, b] = value.split('|');
  if (!a || !b) throw new Error(`Missing translation: ${value}`);
  return T(a, b);
};

/** Typed exact answer: «700000», «3/4», «2,08». */
export function typed(prompt: LocalizedText, value: number | string, explanation: LocalizedText, hint: LocalizedText, extra: Extra = {}): GradeFourVariant {
  return { prompt, options: [], answer: 0, input: 'rational', value: String(value), explanation, hint, ...extra };
}

/** Choice: the correct option and 2–3 wrong ones, placed in a random order. */
export function choose(r: Rng, prompt: LocalizedText, correct: LocalizedText, wrong: LocalizedText[], explanation: LocalizedText, hint: LocalizedText, extra: Omit<Extra, 'unit'> = {}): GradeFourVariant {
  const options = r.shuffle([correct, ...wrong]);
  return { prompt, options, answer: options.indexOf(correct), explanation, hint, ...extra };
}

/** Choice between whole numbers: drops repeated or negative distractors, keeps up to 3. */
export function chooseNumber(r: Rng, prompt: LocalizedText, correct: number, candidates: number[], explanation: LocalizedText, hint: LocalizedText, extra: Omit<Extra, 'unit'> & { unit?: [string, string] } = {}): GradeFourVariant {
  const wrong = [...new Set(candidates)].filter(n => n !== correct && n >= 0 && Number.isInteger(n)).slice(0, 3);
  if (wrong.length < 2) throw new Error(`chooseNumber needs two distractors: ${prompt['en-US']}`);
  const label = (n: number) => extra.unit ? T(`${es(n)} ${extra.unit[0]}`, `${en(n)} ${extra.unit[1]}`) : T(es(n), en(n));
  return choose(r, prompt, label(correct), wrong.map(label), explanation, hint, { reward: extra.reward, model: extra.model });
}

/** One of several hand-written versions (for questions whose right answer must change). */
export const oneOf = (r: Rng, versions: (() => GradeFourVariant)[]) => r.pick(versions)();

/** Two different integers from a range. */
export function twoDifferent(r: Rng, min: number, max: number): [number, number] {
  const a = r.int(min, max);
  let b = r.int(min, max - 1);
  if (b >= a) b++;
  return [a, b];
}
