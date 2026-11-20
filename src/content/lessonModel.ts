import type { LocalizedText } from '../math/core/types';

export const text = (value: string): LocalizedText => {
  const [es, en] = value.split('|');
  if (!es || !en) throw new Error(`Missing translation: ${value}`);
  return { 'es-AR': es, 'en-US': en };
};

export interface GradeOneCheck {
  prompt: LocalizedText;
  /** Choice options; empty when the learner types a number (`input: 'number'`). */
  options: LocalizedText[];
  /** Index of the right option, or the expected number when `input` is 'number'. */
  answer: number;
  explanation: LocalizedText;
  /** Typed answer instead of choosing an option (Grade 2). */
  input?: 'number';
  /** Unit shown after the typed number, e.g. "cm" or "gemas". */
  unit?: LocalizedText;
}

// Alternate the answer position; the author always supplies the correct option first.
export function check(prompt: string, correct: string, wrong: string, explanation: string): GradeOneCheck {
  const options = [text(correct), text(wrong)];
  const answer = prompt.length % 2;
  if (answer === 1) options.reverse();
  return { prompt: text(prompt), options, answer, explanation: text(explanation) };
}

export interface GradeOneLesson {
  id: string;
  packageId: string;
  order: number;
  title: LocalizedText;
  objective: LocalizedText;
  warmup: LocalizedText;
  story: LocalizedText;
  steps: LocalizedText[];
  scene: { kind: 'tokens' | 'cards'; items: string[]; caption: LocalizedText; layout?: 'row' | 'aligned' };
  misconception: LocalizedText;
  exit: LocalizedText;
  checks: GradeOneCheck[];
}

export function createLessonFactory(grade: number) {
return function lesson(
  packageNumber: number, lessonNumber: number, title: string, objective: string,
  warmup: string, story: string, steps: string[], items: string[], caption: string,
  misconception: string, exit: string, checks: GradeOneCheck[],
  kind: 'tokens' | 'cards' = 'cards',
): GradeOneLesson {
  const packageId = `G${String(grade).padStart(2, '0')}-${String(packageNumber).padStart(2, '0')}`;
  return {
    id: `${packageId}-L${String(lessonNumber).padStart(2, '0')}`, packageId,
    order: packageNumber * 10 + lessonNumber,
    title: text(title), objective: text(objective), warmup: text(warmup), story: text(story),
    steps: steps.map(text), scene: { kind, items, caption: text(caption) },
    misconception: text(misconception), exit: text(exit), checks,
  };
}

}
export const lesson = createLessonFactory(1);
