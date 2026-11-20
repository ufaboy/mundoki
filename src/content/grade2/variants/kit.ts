// Building blocks for Grade 2 challenge generators: a seeded random source,
// bilingual text, number words, and builders for typed and choice variants.
// A generator returns one fresh version of a mission challenge (same skill and
// story object, new numbers); the page shows another one after each mistake.
import type { LocalizedText } from '../../../math/core/types';
import type { GradeOneCheck } from '../../lessonModel';

export interface GradeTwoVariant extends GradeOneCheck {
  /** Átomo's hint for this version's numbers. */
  hint: LocalizedText;
  /** Reward when the mission's own reward names other numbers. May use {name}. */
  reward?: LocalizedText;
  /** Mission 1 only: the price shown in the place-value model. */
  model?: number;
}

export interface Rng {
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  shuffle<T>(items: readonly T[]): T[];
}

/** mulberry32: small, deterministic, good enough to vary numbers. */
export function rng(seed: number): Rng {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  return {
    int,
    pick: items => items[int(0, items.length - 1)],
    shuffle: items => {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i--) { const j = int(0, i); [copy[i], copy[j]] = [copy[j], copy[i]]; }
      return copy;
    },
  };
}

/** Bilingual text. */
export const T = (es: string, en: string): LocalizedText => ({ 'es-AR': es, 'en-US': en });

const ES_UNITS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const ES_TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const ES_HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
const EN_UNITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const esBelow100 = (n: number) => n < 30 ? ES_UNITS[n] : ES_TENS[Math.floor(n / 10)] + (n % 10 ? ` y ${ES_UNITS[n % 10]}` : '');
const enBelow100 = (n: number) => n < 20 ? EN_UNITS[n] : EN_TENS[Math.floor(n / 10)] + (n % 10 ? `-${EN_UNITS[n % 10]}` : '');

/** Number words as a seller says them, 0–1000 («novecientos treinta», “nine hundred thirty”). */
export function numberWords(n: number): LocalizedText {
  if (!Number.isInteger(n) || n < 0 || n > 1000) throw new Error(`numberWords: ${n}`);
  if (n === 1000) return T('mil', 'one thousand');
  const h = Math.floor(n / 100), rest = n % 100;
  const es = h === 0 ? esBelow100(rest) : h === 1 && rest === 0 ? 'cien' : ES_HUNDREDS[h] + (rest ? ` ${esBelow100(rest)}` : '');
  const en = h === 0 ? enBelow100(rest) : `${EN_UNITS[h]} hundred` + (rest ? ` ${enBelow100(rest)}` : '');
  return T(es, en);
}

/** «3 cajas» / «1 caja» in both languages. */
export const count = (n: number, es: [string, string], en: [string, string]) =>
  T(`${n} ${n === 1 ? es[0] : es[1]}`, `${n} ${n === 1 ? en[0] : en[1]}`);

export const digits = (n: number) => ({ h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 });

/** Typed answer. */
export function typed(prompt: LocalizedText, value: number, explanation: LocalizedText, hint: LocalizedText, extra: { unit?: LocalizedText; reward?: LocalizedText; model?: number } = {}): GradeTwoVariant {
  return { prompt, options: [], answer: value, explanation, hint, input: 'number', ...extra };
}

/** Choice: the correct option and 2–3 wrong ones, placed in a random order. */
export function choose(r: Rng, prompt: LocalizedText, correct: LocalizedText, wrong: LocalizedText[], explanation: LocalizedText, hint: LocalizedText, extra: { reward?: LocalizedText; model?: number } = {}): GradeTwoVariant {
  const options = r.shuffle([correct, ...wrong]);
  return { prompt, options, answer: options.indexOf(correct), explanation, hint, ...extra };
}

/** Choice between numbers: drops repeated or out-of-range distractors, keeps up to 3. */
export function chooseNumber(r: Rng, prompt: LocalizedText, correct: number, candidates: number[], explanation: LocalizedText, hint: LocalizedText, extra: { reward?: LocalizedText; unit?: [string, string]; model?: number } = {}): GradeTwoVariant {
  const wrong = [...new Set(candidates)].filter(n => n !== correct && n >= 0 && n <= 1000).slice(0, 3);
  if (wrong.length < 2) throw new Error(`chooseNumber needs two distractors: ${prompt['en-US']}`);
  const label = (n: number) => extra.unit ? T(`${n} ${extra.unit[0]}`, `${n} ${extra.unit[1]}`) : T(String(n), String(n));
  return choose(r, prompt, label(correct), wrong.map(label), explanation, hint, { reward: extra.reward, model: extra.model });
}

export type Generator = (r: Rng) => GradeTwoVariant;
