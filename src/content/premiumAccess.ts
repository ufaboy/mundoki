// What is free and what needs Premium (decided 2026-11-17; secundaria 2026-11-18):
//   free     the first chapter (package) of every grade, training games on level 1
//   Premium  every other mission of grades 1–7, game levels 2 and 3,
//            every secundaria package after the first one of its year (content/secondary)
// Server-only: it reads the course catalogue, which must never reach client bundles.
// Client code uses LOCKED_LESSON_PATH in src/lib/access/lockedLessonPath.ts instead;
// premiumAccessSuite.ts keeps the two in step.
import { SCHOOL_COURSES } from './schoolCourses';
import { isFreeSecondaryLesson } from './secondary';

export const FREE_SKILL_LEVEL = 1;

const FREE_PACKAGES = new Set<string>(SCHOOL_COURSES.map((course) => course.packages[0].id));
const LESSON_PACKAGE = new Map<string, string>(
  SCHOOL_COURSES.flatMap((course) =>
    (course.lessons as readonly { id: string; packageId: string }[]).map((lesson) => [lesson.id, lesson.packageId] as const)
  )
);

/** True for missions of a grade's first chapter. Unknown ids are treated as locked. */
export function isFreeLesson(lessonId: string): boolean {
  if (isFreeSecondaryLesson(lessonId)) return true;
  const packageId = LESSON_PACKAGE.get(lessonId);
  return packageId !== undefined && FREE_PACKAGES.has(packageId);
}

/** Missions of grades 1–7 and how many of them are free, for pages that describe the offer. */
export function countMissions(): { total: number; free: number } {
  let free = 0;
  for (const lessonId of LESSON_PACKAGE.keys()) if (isFreeLesson(lessonId)) free += 1;
  return { total: LESSON_PACKAGE.size, free };
}
