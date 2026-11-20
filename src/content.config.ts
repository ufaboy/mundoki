import { GRADE_SEVEN_LESSONS } from './content/grade7';
import { GRADE_SIX_LESSONS } from './content/grade6';
import { GRADE_FIVE_LESSONS } from './content/grade5';
import { GRADE_THREE_LESSONS } from './content/grade3';
import { GRADE_FOUR_LESSONS } from './content/grade4';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { GRADE_ONE_LESSONS } from './content/grade1';
import { GRADE_TWO_LESSONS } from './content/grade2';

const localized = z.object({ 'es-AR': z.string().min(1), 'en-US': z.string().min(1) });
const schoolLessonSchema = z.object({
    packageId: z.string(), order: z.number(), title: localized, objective: localized,
    warmup: localized, story: localized, steps: z.array(localized).min(3),
    scene: z.object({ kind: z.enum(['tokens', 'cards']), items: z.array(z.string()), caption: localized, layout: z.enum(['row', 'aligned']).optional() }),
    misconception: localized, exit: localized,
    checks: z.array(z.object({
      prompt: localized, options: z.array(localized), answer: z.number(), explanation: localized,
      input: z.enum(['number', 'rational']).optional(), value: z.string().optional(), unit: localized.optional(),
    }).refine(check => check.input ? check.options.length === 0 && (check.input !== 'rational' || !!check.value) : check.options.length >= 2,
      'A check either takes a typed answer or offers at least two options')).min(2),
  });
const gradeOneLessons = defineCollection({ loader: async () => GRADE_ONE_LESSONS, schema: schoolLessonSchema });
const gradeTwoLessons = defineCollection({ loader: async () => GRADE_TWO_LESSONS, schema: schoolLessonSchema });

const gradeThreeLessons = defineCollection({ loader: async () => GRADE_THREE_LESSONS, schema: schoolLessonSchema });

const gradeFourLessons = defineCollection({ loader: async () => GRADE_FOUR_LESSONS, schema: schoolLessonSchema });

const gradeFiveLessons = defineCollection({ loader: async () => GRADE_FIVE_LESSONS, schema: schoolLessonSchema });

const gradeSevenLessons = defineCollection({ loader: async () => GRADE_SEVEN_LESSONS, schema: schoolLessonSchema });
const gradeSixLessons = defineCollection({ loader: async () => GRADE_SIX_LESSONS, schema: schoolLessonSchema });

const lessonsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/lessons' }),
  schema: z.object({
    subject: z.literal('mathematics'),
    stage: z.enum(['primary', 'middle']),
    topic: z.enum([
      'addition-subtraction',
      'multiplication-division',
      'fractions',
      'negative-numbers',
      'percentages-proportions',
    ]),
    locale: z.enum(['es-AR', 'en-US']),
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    accessLevel: z.enum(['free', 'premium']),
    visualInteractiveHint: z.string(),
    workedExampleTitle: z.string(),
    workedSteps: z.array(
      z.object({
        title: z.string(),
        explanation: z.string(),
        mathExpression: z.string(),
      })
    ),
    whyItWorks: z.string(),
    commonMistake: z.object({
      wrongExample: z.string(),
      correction: z.string(),
    }),
    deepDiveExtra: z.string(),
    quickChecks: z.array(
      z.object({
        id: z.string(),
        question: z.string(),
        options: z.array(
          z.object({
            label: z.string(),
            value: z.string(),
            isCorrect: z.boolean(),
          })
        ),
        explanation: z.string(),
      })
    ),
  }),
});

export const collections = {
  gradeThreeLessons,
  gradeFourLessons,
  gradeFiveLessons,
  gradeSixLessons,
  gradeSevenLessons,
  lessons: lessonsCollection,
  gradeOneLessons,
  gradeTwoLessons,
};
