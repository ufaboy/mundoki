import { GRADE_SEVEN_LESSONS, GRADE_SEVEN_PACKAGES, GRADE_SEVEN_PROJECT } from './grade7';
import { GRADE_SEVEN_ASSESSMENTS } from './grade7/assessments';
import { GRADE_SIX_LESSONS, GRADE_SIX_PACKAGES, GRADE_SIX_PROJECT } from './grade6';
import { GRADE_SIX_ASSESSMENTS } from './grade6/assessments';
import { GRADE_FIVE_LESSONS, GRADE_FIVE_PACKAGES, GRADE_FIVE_PROJECT } from './grade5';
import { GRADE_FIVE_ASSESSMENTS } from './grade5/assessments';
import { GRADE_THREE_LESSONS, GRADE_THREE_PACKAGES, GRADE_THREE_PROJECT } from './grade3';
import { GRADE_THREE_ASSESSMENTS } from './grade3/assessments';
import { GRADE_FOUR_LESSONS, GRADE_FOUR_PACKAGES, GRADE_FOUR_PROJECT } from './grade4';
import { GRADE_FOUR_ASSESSMENTS } from './grade4/assessments';
import { GRADE_ONE_LESSONS, GRADE_ONE_PACKAGES, GRADE_ONE_PROJECT } from './grade1';
import { GRADE_ONE_ASSESSMENTS } from './grade1/assessments';
import { GRADE_TWO_LESSONS, GRADE_TWO_PACKAGES, GRADE_TWO_PROJECT } from './grade2';
import { GRADE_TWO_ASSESSMENTS } from './grade2/assessments';
import { text } from './lessonModel';

export const SCHOOL_COURSES = [
  {
    gradeId: 'grade-1' as const, gradeNumber: 1, collection: 'gradeOneLessons' as const,
    lessons: GRADE_ONE_LESSONS, packages: GRADE_ONE_PACKAGES, assessments: GRADE_ONE_ASSESSMENTS, project: GRADE_ONE_PROJECT,
    label: text('1.° grado · 6–7 años|Grade 1 · Ages 6–7'),
    title: text('Números, formas y nuestro mundo|Numbers, shapes, and our world'),
    startLabel: text('Empezar a contar|Start counting'),
  },
  {
    gradeId: 'grade-2' as const, gradeNumber: 2, collection: 'gradeTwoLessons' as const,
    lessons: GRADE_TWO_LESSONS, packages: GRADE_TWO_PACKAGES, assessments: GRADE_TWO_ASSESSMENTS, project: GRADE_TWO_PROJECT,
    label: text('2.° grado · 7–8 años|Grade 2 · Ages 7–8'),
    title: text('Números hasta mil y grupos iguales|Numbers up to one thousand and equal groups'),
    startLabel: text('Empezar con centenas y decenas|Start with hundreds and tens'),
  },
  {
    gradeId: 'grade-3' as const, gradeNumber: 3, collection: 'gradeThreeLessons' as const,
    lessons: GRADE_THREE_LESSONS, packages: GRADE_THREE_PACKAGES, assessments: GRADE_THREE_ASSESSMENTS, project: GRADE_THREE_PROJECT,
    label: text('3.° grado · 8–9 años|Grade 3 · Ages 8–9'),
    title: text('Cuatro operaciones, estrategias y nuestro entorno|Four operations, strategies, and our surroundings'), startLabel: text('Empezar con los miles|Start with thousands'),
  },
  {
    gradeId: 'grade-4' as const, gradeNumber: 4, collection: 'gradeFourLessons' as const,
    lessons: GRADE_FOUR_LESSONS, packages: GRADE_FOUR_PACKAGES, assessments: GRADE_FOUR_ASSESSMENTS, project: GRADE_FOUR_PROJECT,
    label: text('4.° grado · 9–10 años|Grade 4 · Ages 9–10'),
    title: text('Números grandes, fracciones y datos|Large numbers, fractions, and data'), startLabel: text('Empezar con números grandes|Start with large numbers'),
  },
  {
    gradeId: 'grade-5' as const, gradeNumber: 5, collection: 'gradeFiveLessons' as const,
    lessons: GRADE_FIVE_LESSONS, packages: GRADE_FIVE_PACKAGES, assessments: GRADE_FIVE_ASSESSMENTS, project: GRADE_FIVE_PROJECT,
    label: text('5.° grado de primaria · CABA · 10–11 años|Grade 5 · CABA primary school · Ages 10–11'),
    title: text('Fracciones, decimales, medidas y datos|Fractions, decimals, measurement, and data'),
    startLabel: text('Empezar con estrategias de cálculo|Start with calculation strategies'),
  },
  {
    gradeId:'grade-6' as const,gradeNumber:6,collection:'gradeSixLessons' as const,
    lessons:GRADE_SIX_LESSONS,packages:GRADE_SIX_PACKAGES,assessments:GRADE_SIX_ASSESSMENTS,project:GRADE_SIX_PROJECT,
    label:text('6.° grado de primaria · CABA · 11–12 años|Grade 6 · CABA primary school · Ages 11–12'),
    title:text('Proporciones, porcentajes, medidas y datos|Proportions, percentages, measurement, and data'),
    startLabel:text('Empezar con el sistema decimal|Start with the decimal system'),
  },
  {
    gradeId:'grade-7' as const,gradeNumber:7,collection:'gradeSevenLessons' as const,
    lessons:GRADE_SEVEN_LESSONS,packages:GRADE_SEVEN_PACKAGES,assessments:GRADE_SEVEN_ASSESSMENTS,project:GRADE_SEVEN_PROJECT,
    label:text('7.° grado de primaria · CABA · 12–13 años|Grade 7 · CABA primary school · Ages 12–13'),
    title:text('Argumentos, relaciones, geometría y datos|Arguments, relationships, geometry, and data'),
    startLabel:text('Empezar con propiedades de los números|Start with number properties'),
  },
];
export type SchoolCourse = typeof SCHOOL_COURSES[number];

export function getCourseForPackage(packageId: string): SchoolCourse {
  const course = SCHOOL_COURSES.find(c => c.packages.some(p => p.id === packageId));
  if (!course) throw new Error(`Unknown lesson package: ${packageId}`);
  return course;
}

export function getSchoolPackage(packageId: string) {
  return getCourseForPackage(packageId).packages.find(p => p.id === packageId)!;
}
