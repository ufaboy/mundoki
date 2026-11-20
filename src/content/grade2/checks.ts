// Grade 2 challenge builders. A two-option question can be passed by pressing
// both buttons, so Grade 2 uses:
//   entry()  — the child types the number (most answers that are a number);
//   choice() — three or four options, each wrong one a typical error;
// After a wrong answer the page shows generated versions with new numbers
// (variants/, the wizard "changes the numbers").
import { text, type GradeOneCheck } from '../lessonModel';
import type { LocalizedText } from '../../math/core/types';

const hash = (value: string) => {
  let h = 2166136261;
  for (const char of value) h = Math.imul(h ^ char.codePointAt(0)!, 16777619) >>> 0;
  return h;
};

/** Options: the correct one first, then 2–3 typical errors. Its position is spread by a prompt hash. */
export function choice(prompt: string, correct: string, wrong: string[], explanation: string): GradeOneCheck {
  if (wrong.length < 2 || wrong.length > 3) throw new Error(`Grade 2 choices need 3 or 4 options: ${prompt}`);
  const options = wrong.map(text);
  const answer = hash(prompt) % (wrong.length + 1);
  options.splice(answer, 0, text(correct));
  return { prompt: text(prompt), options, answer, explanation: text(explanation) };
}

/** Typed answer: `value` is the number the child must write; `unit` is shown after the box. */
export function entry(prompt: string, value: number, explanation: string, unit?: string): GradeOneCheck {
  if (!Number.isInteger(value) || value < 0 || value > 1000) throw new Error(`Grade 2 typed answers are whole numbers to 1,000: ${prompt}`);
  return { prompt: text(prompt), options: [], answer: value, explanation: text(explanation), input: 'number', ...(unit ? { unit: text(unit) } : {}) };
}
