// Answer key lookup for the authored questions of school missions (grades 1–7).
// Used on the server to check a mission answer before it counts towards
// results — the client's own "correct" flag is never trusted.

import type { TopicId } from '../math/core/types';
import { GRADES_CATALOG } from '../math/curriculum';
import { SCHOOL_COURSES } from './schoolCourses';

export interface MissionCheckKey {
  /** Index of the right option. */
  answer: number;
  /** Results bucket: the grade's main topic. */
  topicId: TopicId;
}

export function findMissionCheck(lessonId: string, checkIndex: number): MissionCheckKey | null {
  for (const course of SCHOOL_COURSES) {
    const lessons = course.lessons as readonly { id: string; checks?: readonly { answer: number }[] }[];
    const lesson = lessons.find((item) => item.id === lessonId);
    if (!lesson) continue;
    const check = lesson.checks?.[checkIndex];
    const grade = GRADES_CATALOG.find((item) => item.id === course.gradeId);
    if (!check || !grade) return null;
    return { answer: check.answer, topicId: grade.primaryTopicId };
  }
  return null;
}
