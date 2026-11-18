// Secundaria courses (Grades 8–12) in exam-prep mode. Design: docs/secundaria-exam-prep-design.md.
// Grade 8: all twelve packages (2026-11-18); Grade 9: the four pilot packages. Listed in plan order;
// `packages[0]` is the free one.
import type { GradeId } from '../../math/core/types';
import { G08_INTEGERS_ORDER } from './g08IntegersOrder';
import { G08_INTEGERS } from './g08Integers';
import { G08_RATIONALS } from './g08Rationals';
import { G08_EXPRESSIONS } from './g08Expressions';
import { G08_RELATIONS } from './g08Relations';
import { G08_PROPORTION } from './g08Proportion';
import { G08_EQUATIONS } from './g08Equations';
import { G08_PARALLELS } from './g08Parallels';
import { G08_LOCI } from './g08Loci';
import { G08_FREQUENCIES } from './g08Frequencies';
import { G08_PROBABILITY } from './g08Probability';
import { G08_MODELLING } from './g08Modelling';
import { G09_LINEAR } from './g09Linear';
import { G09_EQUATIONS } from './g09Equations';
import { G09_SYSTEMS } from './g09Systems';
import { G09_PYTHAGORAS } from './g09Pythagoras';
import { lessonItems, tx, type SecondaryCourse, type SecondaryItem, type SecondaryLesson, type SecondaryPackage } from './model';

const plan = (rows: [string, string][]) => rows.map(([id, title]) => ({ id, title: tx(title) }));

export const SECONDARY_COURSES: SecondaryCourse[] = [
  {
    gradeId: 'grade-8', gradeNumber: 8,
    label: tx('1.º año de secundaria · CABA|Secondary Year 1 · CABA'),
    title: tx('Enteros, expresiones y primeras ecuaciones|Integers, expressions, and first equations'),
    intro: tx('Cada tema: una explicación visual, un ejemplo resuelto, práctica con pistas y un control final. Escribís tus respuestas y, si aparece un error típico, te mostramos dónde está.|Each topic: a visual explanation, a worked example, practice with hints, and an exit check. You type your answers and, if a typical mistake shows up, we show you where it is.'),
    packages: [G08_INTEGERS_ORDER, G08_INTEGERS, G08_RATIONALS, G08_EXPRESSIONS, G08_RELATIONS, G08_PROPORTION, G08_EQUATIONS, G08_PARALLELS, G08_LOCI, G08_FREQUENCIES, G08_PROBABILITY, G08_MODELLING],
    plan: plan([
      ['G08-01', 'Números enteros: representar y comparar|Integers: represent and compare'],
      ['G08-02', 'Operaciones con enteros|Operations with integers'],
      ['G08-03', 'Racionales como cocientes de enteros|Rationals as quotients of integers'],
      ['G08-04', 'Expresiones algebraicas|Algebraic expressions'],
      ['G08-05', 'Tabla, gráfico y fórmula|Table, graph, and formula'],
      ['G08-06', 'Proporcionalidad directa e inversa|Direct and inverse proportion'],
      ['G08-07', 'Primeras ecuaciones lineales|First linear equations'],
      ['G08-08', 'Ángulos entre paralelas|Angles between parallel lines'],
      ['G08-09', 'Lugares geométricos|Geometric loci'],
      ['G08-10', 'Frecuencias|Frequencies'],
      ['G08-11', 'Probabilidad por experimentos|Probability through experiments'],
      ['G08-12', 'Modelizar una situación|Modelling a situation'],
    ]),
  },
  {
    gradeId: 'grade-9', gradeNumber: 9,
    label: tx('2.º año de secundaria · CABA|Secondary Year 2 · CABA'),
    title: tx('Funciones lineales, sistemas, Pitágoras y datos|Linear functions, systems, Pythagoras, and data'),
    intro: tx('Cada tema: una explicación visual, un ejemplo resuelto, práctica con pistas y un control final. Escribís tus respuestas y, si aparece un error típico, te mostramos dónde está.|Each topic: a visual explanation, a worked example, practice with hints, and an exit check. You type your answers and, if a typical mistake shows up, we show you where it is.'),
    packages: [G09_LINEAR, G09_EQUATIONS, G09_SYSTEMS, G09_PYTHAGORAS],
    plan: plan([
      ['G09-01', 'Los conjuntos Z y Q|The sets Z and Q'],
      ['G09-02', 'Potencias de racionales|Powers of rationals'],
      ['G09-03', 'Función lineal|Linear functions'],
      ['G09-04', 'Ecuaciones lineales|Linear equations'],
      ['G09-05', 'Ecuaciones con dos variables|Equations in two variables'],
      ['G09-06', 'Sistemas de ecuaciones lineales|Systems of linear equations'],
      ['G09-07', 'Semejanza|Similarity'],
      ['G09-08', 'Teorema de Pitágoras|Pythagorean theorem'],
      ['G09-09', 'Diseñar una recolección de datos|Designing data collection'],
      ['G09-10', 'Tablas de frecuencias|Frequency tables'],
      ['G09-11', 'Media, mediana y moda|Mean, median, and mode'],
      ['G09-12', 'Probabilidades simples|Simple probability'],
      ['G09-13', 'Construir y validar un modelo|Building and testing a model'],
    ]),
  },
];

export function getSecondaryCourse(gradeId: GradeId): SecondaryCourse | undefined {
  return SECONDARY_COURSES.find((course) => course.gradeId === gradeId);
}

export interface SecondaryLessonRef {
  course: SecondaryCourse;
  pack: SecondaryPackage;
  lesson: SecondaryLesson;
  /** Position among all lessons of the course (0-based). */
  index: number;
  all: SecondaryLesson[];
}

// Built once: isFreeLesson asks about every lesson id (Grades 1–7 too) on each sync
// attempt and mission page, so lookups must not scan the courses.
const LESSONS_BY_ID = new Map<string, SecondaryLessonRef>(
  SECONDARY_COURSES.flatMap((course) => {
    const all = course.packages.flatMap((pack) => pack.lessons);
    return all.map((lesson, index): [string, SecondaryLessonRef] => [
      lesson.id,
      { course, pack: course.packages.find((p) => p.id === lesson.packageId)!, lesson, index, all },
    ]);
  }),
);

/** Case-insensitive, as lesson ids appear lower-case in URLs. */
export function findSecondaryLesson(lessonId: string): SecondaryLessonRef | null {
  return LESSONS_BY_ID.get(lessonId.toUpperCase()) ?? null;
}

/** The item behind a server check index, or null. */
export function findSecondaryItem(lessonId: string, checkIndex: number): SecondaryItem | null {
  const ref = findSecondaryLesson(lessonId);
  if (!ref || !Number.isInteger(checkIndex)) return null;
  return lessonItems(ref.lesson)[checkIndex] ?? null;
}

/** First package of every secundaria year is free (decided 2026-11-18). */
export function isFreeSecondaryLesson(lessonId: string): boolean {
  const ref = findSecondaryLesson(lessonId);
  return ref !== null && ref.course.packages[0].id === ref.lesson.packageId;
}

export { lessonItems };
