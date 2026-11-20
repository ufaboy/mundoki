// Grade 4 challenge builders. A two-option question can be passed by pressing
// both buttons, so Grade 4 uses (like Grades 2–3):
//   entry()  — the child types the answer: a whole number, a fraction («3/4») or a
//              decimal («2,08»). Equal values count (2/4 = 1/2, 2.08 = 2,08);
//   choice() — three or four options, each wrong one a typical error.
// After a wrong answer the mission page shows generated versions with new
// numbers (variants/, "Nina works the route out again").
import { text, type GradeOneCheck } from '../lessonModel';
import { readRational } from '../../math/core/secondaryAnswer';

const hash = (value: string) => {
  let h = 2166136261;
  for (const char of value) h = Math.imul(h ^ char.codePointAt(0)!, 16777619) >>> 0;
  return h;
};

/** Options: the correct one first, then 2–3 typical errors. Its position is spread by a prompt hash. */
export function choice(prompt: string, correct: string, wrong: string[], explanation: string): GradeOneCheck {
  if (wrong.length < 2 || wrong.length > 3) throw new Error(`Grade 4 choices need 3 or 4 options: ${prompt}`);
  const options = wrong.map(text);
  const answer = hash(prompt) % (wrong.length + 1);
  options.splice(answer, 0, text(correct));
  return { prompt: text(prompt), options, answer, explanation: text(explanation) };
}

/** Typed answer: `value` is what the child must write (700000, '3/4', '2,08'); `unit` is shown after the box. */
export function entry(prompt: string, value: number | string, explanation: string, unit?: string): GradeOneCheck {
  const written = String(value);
  if (!readRational(written)) throw new Error(`Grade 4 typed answers are exact numbers: ${prompt}`);
  return { prompt: text(prompt), options: [], answer: 0, explanation: text(explanation), input: 'rational', value: written, ...(unit ? { unit: text(unit) } : {}) };
}
