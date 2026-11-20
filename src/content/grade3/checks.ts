// Grade 3 challenge builders. A two-option question can be passed by pressing
// both buttons, so Grade 3 uses (like Grade 2):
//   entry()  — the child types the number (most answers that are a number);
//   choice() — three or four options, each wrong one a typical error.
// After a wrong answer the mission page shows generated versions with new
// numbers (variants/, "Rosa writes another calculation").
import { text, type GradeOneCheck } from '../lessonModel';

/** Largest typed answer in Grade 3: numbers go up to 10,000. */
export const GRADE_THREE_MAX = 10000;

const hash = (value: string) => {
  let h = 2166136261;
  for (const char of value) h = Math.imul(h ^ char.codePointAt(0)!, 16777619) >>> 0;
  return h;
};

/** Options: the correct one first, then 2–3 typical errors. Its position is spread by a prompt hash. */
export function choice(prompt: string, correct: string, wrong: string[], explanation: string): GradeOneCheck {
  if (wrong.length < 2 || wrong.length > 3) throw new Error(`Grade 3 choices need 3 or 4 options: ${prompt}`);
  const options = wrong.map(text);
  const answer = hash(prompt) % (wrong.length + 1);
  options.splice(answer, 0, text(correct));
  return { prompt: text(prompt), options, answer, explanation: text(explanation) };
}

/** Typed answer: `value` is the number the child must write; `unit` is shown after the box. */
export function entry(prompt: string, value: number, explanation: string, unit?: string): GradeOneCheck {
  if (!Number.isInteger(value) || value < 0 || value > GRADE_THREE_MAX) throw new Error(`Grade 3 typed answers are whole numbers to 10,000: ${prompt}`);
  return { prompt: text(prompt), options: [], answer: value, explanation: text(explanation), input: 'number', ...(unit ? { unit: text(unit) } : {}) };
}
