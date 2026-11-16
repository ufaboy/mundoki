import assert from 'node:assert/strict';
import { GRADE_TWO_LESSONS, GRADE_TWO_PACKAGES, GRADE_TWO_PROJECT } from '../content/grade2';
import { GRADE_TWO_ASSESSMENTS } from '../content/grade2/assessments';
import { getGradeTwoHints } from '../content/grade2/hints';
import { SCHOOL_COURSES, getCourseForPackage, getSchoolPackage } from '../content/schoolCourses';
import { getGradeById } from '../math/curriculum';
import { buildSchoolLessonUrl } from '../i18n/routes';
import { equalGroupModel, placeValueParts } from '../math/primaryModels';
import { ROAD_MISSIONS, ROAD_CHAPTERS, roadSceneState } from '../content/grade2/roadTrip';

export function runGradeTwoTests() {
  const expectedCounts = [3,3,3,3,3,3,3,3,3,2,3,2,2];
  assert.equal(GRADE_TWO_LESSONS.length, 36);
  assert.deepEqual(ROAD_MISSIONS.map(m=>m.id),GRADE_TWO_LESSONS.map(l=>l.id), 'Every lesson has one ordered road mission');
  assert.deepEqual(ROAD_CHAPTERS.flatMap(c=>ROAD_MISSIONS.slice(c.start,c.end).map(m=>m.id)),ROAD_MISSIONS.map(m=>m.id), 'Chapters cover the full trip without gaps or repeats');
  for(const mission of ROAD_MISSIONS) {
    assert.equal(mission.rewards.length,2);
    for(const value of [mission.title,mission.introduction,...mission.rewards]) {
      for(const locale of ['es-AR','en-US'] as const) assert(value[locale].trim() && !value[locale].includes('|'));
    }
  }
  assert.equal(roadSceneState(0,0).scene,'shop');
  assert.equal(roadSceneState(5,1).purchased,false);
  assert.equal(roadSceneState(5,2).purchased,true);
  assert.equal(roadSceneState(6,0).scene,'repair');
  assert.equal(roadSceneState(12,0).scene,'upgrade');
  assert.equal(roadSceneState(13,2).upgrades,4);
  assert.equal(roadSceneState(21,0).scene,'ferry');
  assert.equal(roadSceneState(21,0).ferryProgress,0);
  assert.equal(roadSceneState(21,2).ferryProgress,33);
  assert.equal(roadSceneState(23,2).ferryProgress,100);
  assert.equal(roadSceneState(24,0).scene,'island');
  assert.equal(roadSceneState(29,0).scene,'bridge');
  assert.equal(roadSceneState(32,1).vanAvailable,false);
  assert.equal(roadSceneState(32,2).vanAvailable,true);
  assert.equal(roadSceneState(33,0).vanAvailable,true);
  assert.equal(roadSceneState(17,2).parts,36,'Car is finished before departure');
  assert.equal(roadSceneState(18,0).driving,true);
  assert.equal(roadSceneState(35,2).distance,100,'Last answer reaches the destination');
  for(let i=0;i<36;i++) {
    const a=roadSceneState(i,0),b=roadSceneState(i,1),c=roadSceneState(i,2);
    assert(a.parts<=b.parts && b.parts<=c.parts);
    assert(a.distance<=b.distance && b.distance<=c.distance && c.distance<=100);
    if(i<35) assert.equal(c.distance,roadSceneState(i+1,0).distance,'Travel distance continues into the next episode');
  }
  assert.equal(GRADE_TWO_PACKAGES.length, 13);
  assert.equal(getGradeById('grade-2').lessons.length, 36);
  const allLessons = SCHOOL_COURSES.filter(c => c.gradeNumber <= 2).flatMap(c => c.lessons);
  assert.equal(new Set(allLessons.map(l => l.id)).size, 71, 'IDs must not collide with Grade 1');
  const complete = new Set<string>();
  const checkGraph = (id: string, visiting = new Set<string>()) => {
    assert(!visiting.has(id), `Prerequisite cycle: ${id}`);
    if (complete.has(id)) return;
    visiting.add(id);
    for (const prerequisite of getSchoolPackage(id).prerequisites) checkGraph(prerequisite, visiting);
    visiting.delete(id); complete.add(id);
  };
  for (const [index, pack] of GRADE_TWO_PACKAGES.entries()) {
    checkGraph(pack.id);
    assert.equal(getCourseForPackage(pack.id).gradeId, 'grade-2');
    const lessons = GRADE_TWO_LESSONS.filter(l => l.packageId === pack.id);
    assert.equal(lessons.length, expectedCounts[index], `Plan coverage: ${pack.id}`);
    assert.deepEqual(lessons.map(l => l.id), Array.from({length: expectedCounts[index]}, (_, i) => `${pack.id}-L0${i+1}`));
    const assessment = GRADE_TWO_ASSESSMENTS[pack.id];
    assert.equal(assessment.length, 5);
    const practice = new Set(lessons.flatMap(l => l.checks.map(c => c.prompt['en-US'])));
    for (const check of assessment) assert(!practice.has(check.prompt['en-US']), 'Assessments need fresh prompts');
    assert.equal(new Set(assessment.map(c => c.prompt['en-US'])).size, 5);
  }
  assert.equal(getCourseForPackage('G01-02').gradeId, 'grade-1', 'Review links must retain Grade 1');
  assert.throws(() => getCourseForPackage('G02-99'));
  const checks = [...GRADE_TWO_LESSONS.flatMap(l => l.checks), ...Object.values(GRADE_TWO_ASSESSMENTS).flat()];
  assert.equal(checks.length, 137);
  for (const check of checks) {
    assert(Number.isInteger(check.answer) && check.answer >= 0 && check.answer < check.options.length);
    for (const locale of ['es-AR', 'en-US'] as const) assert.equal(new Set(check.options.map(o => o[locale])).size, check.options.length);
  }
  const visit = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    if ('es-AR' in value || 'en-US' in value) {
      for (const locale of ['es-AR', 'en-US']) {
        assert(typeof value[locale] === 'string' && value[locale].trim().length > 0, `Missing ${locale}`);
        assert(!value[locale].includes('|'), 'Unparsed translation');
      }
    }
    Object.values(value).forEach(visit);
  };
  visit([GRADE_TWO_LESSONS, GRADE_TWO_PACKAGES, GRADE_TWO_ASSESSMENTS, GRADE_TWO_PROJECT]);
  for (const lesson of GRADE_TWO_LESSONS) {
    const hints = getGradeTwoHints(lesson.id);
    assert.equal(hints.length, lesson.checks.length, 'Every challenge needs its own hint');
    visit(hints);
    hints.forEach((hint, index) => {
      for (const locale of ['es-AR', 'en-US'] as const) {
        assert.notEqual(hint[locale], lesson.checks[index].explanation[locale], 'An action hint must not reuse the worked answer');
      }
    });
    if (lesson.packageId === 'G02-10') {
      const rows = lesson.scene.items.slice(0, 3).map(row => row.split(' '));
      assert.equal(rows.length, 3);
      assert(rows.every(row => row.length === rows[0].length), 'Question maps must be rectangular');
      assert.equal(rows.flat().filter(cell => cell === '★').length, 1, 'Each question map needs a start');
      assert.equal(rows.flat().filter(cell => cell === '🏫' || cell === '🏁').length, 1, 'Each question map needs a goal');
    }
    assert.equal(lesson.steps.length, 3); assert.equal(lesson.checks.length, 2);
    assert.equal(buildSchoolLessonUrl('es-AR', 'grade-2', lesson.id), `/es-ar/matematicas/grado/2-grado/${lesson.id.toLowerCase()}/`);
    assert.equal(buildSchoolLessonUrl('en-US', 'grade-2', lesson.id), `/en-us/mathematics/grade/grade-2/${lesson.id.toLowerCase()}/`);
  }
  for (let value = 0; value <= 1000; value++) {
    for (const exchange of [false, true]) {
      const p = placeValueParts(value, exchange);
      assert.equal(p.hundreds * 100 + p.tens * 10 + p.ones, value, 'Regrouping preserves quantity');
      assert(p.hundreds >= 0 && p.tens >= 0 && p.ones >= 0);
    }
  }
  assert.deepEqual(placeValueParts(347, true), { hundreds: 2, tens: 14, ones: 7 });
  assert.deepEqual(placeValueParts(1000, true), { hundreds: 9, tens: 10, ones: 0 });
  for (const value of [-1, 1001, 2.5, NaN]) assert.throws(() => placeValueParts(value));
  for (const mode of ['share', 'pack'] as const) {
    for (let total = 0; total <= 36; total++) for (let divisor = 1; divisor <= 6; divisor++) {
      const result = equalGroupModel(mode, total, divisor);
      assert.equal(result.groups * result.each + result.remainder, total);
      assert(result.remainder >= 0 && result.remainder < divisor);
      assert.equal(mode === 'share' ? result.groups : result.each, divisor);
    }
  }
  assert.deepEqual(equalGroupModel('multiply', 4, 6), {groups: 4, each: 6, remainder: 0, total: 24});
  assert.deepEqual(equalGroupModel('share', 18, 3), {groups: 3, each: 6, remainder: 0, total: 18});
  assert.deepEqual(equalGroupModel('pack', 18, 3), {groups: 6, each: 3, remainder: 0, total: 18});
  assert.throws(() => equalGroupModel('share', 18, 0));
  assert.throws(() => equalGroupModel('multiply', 7, 6));
  console.log('PASS [Grade 2] 36 lessons, 13 packages, 137 bilingual checks, cross-grade prerequisites, routes, and exhaustive visual-model invariants');
}
