// Lesson model for secundaria (Grades 8–12): exam-prep mode, no story or child heroes.
// Design: docs/secundaria-exam-prep-design.md. Each lesson follows the plan's structure
// (docs/lesson-creation-plan.md §14): readiness check → situation → visual exploration →
// worked example → typical mistake → practice → exit ticket.
// Practice items carry one hint (a nudge, never the computation) and no worked solution:
// the worked example at the top of the lesson is the only full solution (decided 2026-11-18).
//
// Answers are typed (a number, or an x/y pair) or chosen from four options.
// The same answer key is used in the browser and on the server (src/math/core/secondaryAnswer.ts).

import type { GradeId, LocalizedText } from '../../math/core/types';
import type { SecondaryAnswerSpec } from '../../math/core/secondaryAnswer';
import { text } from '../lessonModel';

export { text as tx };

/** Item types of the plan's mastery model: recognise, do, apply, explain / find the error. */
export type ItemType = 'A' | 'B' | 'C' | 'D';

export interface SolutionStep {
  text: LocalizedText;
  latex?: string;
}

export interface KnownError {
  /** A typical wrong answer, written like an answer ("13", "3;7"). */
  value: string;
  note: LocalizedText;
}

export interface SecondaryItem {
  type: ItemType;
  prompt: LocalizedText;
  /** Equation(s) shown large under the prompt. */
  latex?: string;
  answer: SecondaryAnswerSpec;
  /** Four options for a choice item; the answer index is in `answer`. */
  options?: LocalizedText[];
  /** Input labels for a pair answer (default x and y). */
  labels?: [LocalizedText, LocalizedText];
  /**
   * The letter a number answer stands for, shown before the box ("y = [ ]"). Without it the
   * card uses the only letter of an equation, or a plain "Your answer" label.
   */
  unknown?: string;
  /** One nudge: what to notice or which rule applies. Never the computation or the result. */
  hint: LocalizedText;
  errors?: KnownError[];
}

export type Explorer =
  | { kind: 'balance'; examples: [number, number, number][] }
  /** Forward chain start → ops → result; `back[i]` is the value after undoing i + 1 operations. */
  | { kind: 'chain'; start: string; ops: { forward: LocalizedText; inverse: LocalizedText }[]; result: string; back: string[] }
  | { kind: 'substitute'; latex: string; left: [number, number]; right: [number, number]; tries: number[] }
  /** Two lines (fixed + movable), or one movable line when `fixed` is null. */
  | { kind: 'lines'; fixed: [number, number] | null; start: [number, number]; xLabel?: LocalizedText; yLabel?: LocalizedText }
  /** a + b as a jump on the number line; `start` is [a, b]. */
  | { kind: 'numberline'; start: [number, number] }
  /** Right triangle with squares on its sides; `start` is the two legs. */
  | { kind: 'triangle'; start: [number, number] }
  /** Two parallel lines cut by a transversal at `start` degrees; `pair` is highlighted first. */
  | { kind: 'parallels'; start: number; pair: 'corresponding' | 'alternate' | 'cointerior' }
  /**
   * A movable point P on a grid and the points it is compared with: a circle of radius 5
   * around O, the segment A(−2, −1)–B(2, 3) and its perpendicular bisector, or a right angle
   * at O whose bisector is y = x. `start` is P.
   */
  | { kind: 'locus'; mode: 'circle' | 'bisector' | 'angle'; start: [number, number] }
  /** A frequency table the learner can change with − / +, drawn as a bar chart with relative frequencies. */
  | { kind: 'frequency'; categories: LocalizedText[]; counts: number[] }
  /**
   * Simulated coin tosses or die rolls (not graded): the relative frequency of the event
   * (heads, or the `target` face) is plotted against the number of trials, with the probability dashed.
   */
  | { kind: 'trials'; experiment: 'coin' | 'die'; target?: number };

export interface SecondaryLesson {
  id: string;
  packageId: string;
  order: number;
  title: LocalizedText;
  objective: LocalizedText;
  ready: SecondaryItem;
  situation: LocalizedText;
  explorer: Explorer | null;
  explorerNote?: LocalizedText;
  worked: { title: LocalizedText; steps: SolutionStep[] };
  mistake: { wrong: LocalizedText; right: LocalizedText };
  practice: SecondaryItem[];
  exit: SecondaryItem;
}

export interface SecondaryPackage {
  id: string;
  title: LocalizedText;
  goal: LocalizedText;
  lessons: SecondaryLesson[];
}

export interface SecondaryCourse {
  gradeId: GradeId;
  gradeNumber: 8 | 9 | 10 | 11 | 12;
  label: LocalizedText;
  title: LocalizedText;
  intro: LocalizedText;
  /** Packages with lessons, in course order. The first one is free. */
  packages: SecondaryPackage[];
  /** The whole year from the plan; ids without lessons show as "coming soon". */
  plan: { id: string; title: LocalizedText }[];
}

/** Every checkable item of a lesson in a fixed order; the index is the server's check index. */
export function lessonItems(lesson: SecondaryLesson): SecondaryItem[] {
  return [lesson.ready, ...lesson.practice, lesson.exit];
}

// ---------- Authoring helpers ----------

type Steps = (string | [string, string])[];

const steps = (list: Steps): SolutionStep[] =>
  list.map((step) => (Array.isArray(step) ? { text: text(step[0]), latex: step[1] } : { text: text(step) }));

/** A typed number answer. */
export function num(
  type: ItemType, prompt: string, latex: string | undefined, value: string,
  hint: string, errors: [string, string][] = [],
): SecondaryItem {
  return {
    type, prompt: text(prompt), latex, answer: { kind: 'number', value },
    hint: text(hint),
    errors: errors.map(([v, note]) => ({ value: v, note: text(note) })),
  };
}

/** Names the letter a number answer stands for: ask('y', num(...)) shows "y = [ ]". */
export function ask(letter: string, item: SecondaryItem): SecondaryItem {
  return { ...item, unknown: letter };
}

/** A typed x/y pair answer. */
export function pair(
  type: ItemType, prompt: string, latex: string | undefined, x: string, y: string,
  hint: string, errors: [string, string][] = [], labels?: [string, string],
): SecondaryItem {
  return {
    type, prompt: text(prompt), latex, answer: { kind: 'pair', x, y },
    labels: labels ? [text(labels[0]), text(labels[1])] : undefined,
    hint: text(hint),
    errors: errors.map(([v, note]) => ({ value: v, note: text(note) })),
  };
}

/**
 * Four options; the author writes the correct one first. Its position is moved by the
 * prompt length, so it is not always in the same place.
 */
export function pick(
  type: ItemType, prompt: string, latex: string | undefined, options: [string, string, string, string],
  hint: string,
): SecondaryItem {
  const shift = prompt.length % 4;
  const order = [0, 1, 2, 3].map((i) => (i + shift) % 4);
  const placed = order.map((i) => text(options[i]));
  return {
    type, prompt: text(prompt), latex,
    answer: { kind: 'choice', answer: order.indexOf(0), count: 4 },
    options: placed, hint: text(hint),
  };
}

export function worked(title: string, list: Steps) {
  return { title: text(title), steps: steps(list) };
}
