// Loads a Grade 1–7 mission (story course) for the mission page route, with what its
// template needs: neighbours in the course, package position and scene layout flags.
import { getCollection } from 'astro:content';
import type { Locale } from '../math/core/types';
import { getGradeSlug } from '../i18n/routes';
import { SCHOOL_COURSES, getCourseForPackage, getSchoolPackage } from './schoolCourses';

const HORIZONTAL_SCENES = ['G01-03-L02', 'G01-03-L03', 'G01-04-L01', 'G01-04-L02', 'G01-05-L03', 'G01-06-L03', 'G01-08-L01', 'G01-09-L01', 'G01-10-L01', 'G01-10-L02'];

/** The mission behind a grade slug and a lesson id from the URL, or null. */
export async function loadSchoolLesson(locale: Locale, gradeSlug: string | undefined, lessonParam: string) {
  const urlCourse = SCHOOL_COURSES.find((item) => getGradeSlug(item.gradeId, locale) === gradeSlug);
  const entry = urlCourse
    ? (await getCollection(urlCourse.collection)).find((item) => item.id.toLowerCase() === lessonParam.toLowerCase())
    : undefined;
  if (!entry) return null;
  const lesson = entry.data;
  const course = getCourseForPackage(lesson.packageId);
  const pack = getSchoolPackage(lesson.packageId);
  const all = (await getCollection(course.collection)).sort((a, b) => a.data.order - b.data.order);
  const position = all.findIndex((item) => item.id === entry.id);
  const previous = all[position - 1];
  const next = all[position + 1];
  return {
    entry, lesson, course, pack, all, position, previous, next,
    isLastInPackage: !next || next.data.packageId !== lesson.packageId,
    horizontalScene: lesson.scene.layout === 'row' || HORIZONTAL_SCENES.includes(entry.id),
    // Grade 1 ("A day with {name}") runs on the design system: content/grade1/day.ts.
    onDayPage: course.gradeNumber === 1,
    alignedScene: lesson.scene.layout === 'aligned' || lesson.packageId === 'G01-11' || entry.id === 'G01-09-L02',
  };
}

export type SchoolLesson = NonNullable<Awaited<ReturnType<typeof loadSchoolLesson>>>;
