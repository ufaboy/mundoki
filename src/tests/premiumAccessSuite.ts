// Free vs Premium: the server rule, the client URL pattern and the split-out
// modules that keep locked mission texts out of browser bundles.
import assert from 'node:assert/strict';
import { countMissions, isFreeLesson } from '../content/premiumAccess';
import { SCHOOL_COURSES } from '../content/schoolCourses';
import { QUEST_MISSIONS } from '../content/grade2/wizardQuest';
import { QUEST_MISSION_COUNT } from '../content/grade2/questScene';
import { buildSchoolLessonUrl } from '../i18n/routes';
import { LOCKED_LESSON_PATH } from '../lib/access/lockedLessonPath';

let free = 0;
for (const course of SCHOOL_COURSES) {
  const firstPackage = course.packages[0].id;
  assert.match(firstPackage, /^G0\d-01$/, `${course.gradeId}: the first chapter is package 01`);
  for (const lesson of course.lessons as readonly { id: string; packageId: string }[]) {
    const expectedFree = lesson.packageId === firstPackage;
    assert.equal(isFreeLesson(lesson.id), expectedFree, `${lesson.id}: free only in the first chapter`);
    if (expectedFree) free += 1;
    for (const locale of ['es-AR', 'en-US'] as const) {
      const path = buildSchoolLessonUrl(locale, course.gradeId, lesson.id);
      assert.equal(LOCKED_LESSON_PATH.test(path), !expectedFree, `${path}: badge pattern agrees with the server rule`);
    }
  }
}
assert.equal(isFreeLesson('G99-01-L01'), false, 'unknown missions are locked');
assert.deepEqual(countMissions(), { total: SCHOOL_COURSES.reduce((n, c) => n + c.lessons.length, 0), free });
assert.equal(free, 21, 'three free missions in each of grades 1–7');
assert.equal(QUEST_MISSION_COUNT, QUEST_MISSIONS.length, 'Grade 2 quest length matches its story');

console.log(`PASS [Premium access] ${free} free missions, server rule and badge pattern agree on every mission URL in both locales`);
