export type Locale = 'es-AR' | 'en-US';

export type SchoolStageId = 'primary' | 'middle' | 'high';

export type GradeNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type GradeId =
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'grade-4'
  | 'grade-5'
  | 'grade-6'
  | 'grade-7'
  | 'grade-8'
  | 'grade-9'
  | 'grade-10'
  | 'grade-11'
  | 'grade-12';

export type TopicId =
  | 'addition-subtraction'
  | 'multiplication-division'
  | 'fractions'
  | 'negative-numbers'
  | 'percentages-proportions'
  | 'linear-equations';

export type AccessLevel = 'free' | 'premium';

export type ExerciseAnswerType =
  | 'numeric'
  | 'fraction'
  | 'multiple-choice'
  | 'visual-choice'
  | 'equation';

export interface LocalizedText {
  'es-AR': string;
  'en-US': string;
}

export interface VisualRepresentation {
  kind:
    | 'counters-combine'
    | 'array-grid'
    | 'fraction-slices'
    | 'number-line'
    | 'percent-bar'
    | 'balance-scale';
  params: Record<string, number | string | number[]>;
}

export interface ChoiceOption {
  id: string;
  label: LocalizedText;
  value: string;
  visualFraction?: { numerator: number; denominator: number };
}

export interface MathExercise {
  id: string;
  seed: number;
  subject: 'mathematics';
  stage: SchoolStageId;
  topic: TopicId;
  difficulty: 1 | 2 | 3;
  answerType: ExerciseAnswerType;
  prompt: LocalizedText;
  expressionLatex: string;
  correctAnswer: string;
  acceptEquivalentFractions?: boolean;
  numericTolerance?: number;
  choices?: ChoiceOption[];
  visual?: VisualRepresentation;
  hints: [LocalizedText, LocalizedText, LocalizedText];
  solutionSteps: LocalizedText[];
}

export interface ValidationResult {
  status: 'correct' | 'incorrect' | 'invalid_input';
  normalizedUserAnswer: string;
  expectedCanonicalAnswer: string;
  isEquivalentUnreduced?: boolean;
  feedback: LocalizedText;
  hintToDisplay?: LocalizedText;
}

/**
 * Deterministic 32-bit PRNG (Mulberry32) so client and server
 * generate identical exercises from the same numeric seed.
 */
export function createSeededRng(seed: number) {
  let state = seed >>> 0;
  return {
    nextFloat(): number {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    nextInt(min: number, max: number): number {
      const r = this.nextFloat();
      return Math.floor(r * (max - min + 1)) + min;
    },
    pick<T>(items: readonly T[]): T {
      return items[this.nextInt(0, items.length - 1)];
    },
  };
}
