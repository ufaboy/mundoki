import assert from 'node:assert/strict';
import { GRADE_ONE_LESSONS, GRADE_ONE_PACKAGES } from '../content/grade1';
import { GRADE_ONE_ASSESSMENTS, hasGradeOneEvidence } from '../content/grade1/assessments';
import { buildGradeOneLessonUrl } from '../i18n/routes';
import { getGradeById } from '../math/curriculum';
import { GRADE_ONE_ADVENTURES } from '../content/grade1/adventures';
import { getGradeOneHints } from '../content/grade1/hints';
import { moveOnStoryMap } from '../scripts/tomiStoryMovement';

export function runGradeOneTests() {
  const counts = [3, 3, 3, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2];
  assert.equal(GRADE_ONE_LESSONS.length, 35);
  assert.equal(new Set(GRADE_ONE_LESSONS.map(l => l.id)).size, 35);
  assert.equal(GRADE_ONE_PACKAGES.length, 14);
  assert.equal(getGradeById('grade-1').lessons.length, 35);
  for (const [index, pack] of GRADE_ONE_PACKAGES.entries()) {
    const lessons = GRADE_ONE_LESSONS.filter(l => l.packageId === pack.id);
    assert.equal(lessons.length, counts[index], `Plan coverage for ${pack.id}`);
    for (const prerequisite of pack.prerequisites) {
      assert(GRADE_ONE_PACKAGES.slice(0, index).some(p => p.id === prerequisite), 'Prerequisites must exist and be acyclic');
    }
    const assessment = GRADE_ONE_ASSESSMENTS[pack.id];
    assert.equal(assessment.length, 5);
    assert.equal(new Set(assessment.map(q => q.prompt['en-US'])).size, 5);
    const guided = new Set(lessons.flatMap(l => l.checks.map(q => q.prompt['en-US'])));
    for (const item of assessment) assert(!guided.has(item.prompt['en-US']), 'Assessment must use a fresh prompt');
  }
  const checks = [...GRADE_ONE_LESSONS.flatMap(l => l.checks), ...Object.values(GRADE_ONE_ASSESSMENTS).flat()];
  assert.equal(checks.length, 140);
  for (const check of checks) {
    assert(Number.isInteger(check.answer) && check.answer >= 0 && check.answer < check.options.length);
    for (const locale of ['es-AR', 'en-US'] as const) {
      assert.equal(new Set(check.options.map(o => o[locale])).size, check.options.length);
    }
  }
  const visit = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    if ('es-AR' in value || 'en-US' in value) {
      for (const locale of ['es-AR', 'en-US']) {
        assert(typeof value[locale] === 'string' && value[locale].trim().length > 0, `Missing ${locale}`);
        assert(!value[locale].includes('|'), 'Unparsed localization separator');
      }
    }
    for (const child of Object.values(value)) visit(child);
  };
  visit(GRADE_ONE_LESSONS);
  visit(GRADE_ONE_ASSESSMENTS);
  visit(GRADE_ONE_ADVENTURES);
  assert.deepEqual(GRADE_ONE_ADVENTURES.map(a => a.id), GRADE_ONE_LESSONS.slice(5).map(l => l.id), 'Every remaining lesson has exactly one ordered story');
  for (const adventure of GRADE_ONE_ADVENTURES) {
    const hints = getGradeOneHints(adventure.id);
    assert.equal(hints.length, adventure.steps.length, 'Each story question needs an action hint');
    visit(hints);
    const lesson = GRADE_ONE_LESSONS.find(item => item.id === adventure.id)!;
    hints.forEach((hint, index) => {
      for (const locale of ['es-AR', 'en-US'] as const) {
        assert.notEqual(hint[locale], lesson.checks[index].explanation[locale], 'Hints must be separate from worked answers');
      }
    });
    assert.equal(adventure.steps.length, 2);
    for (const step of adventure.steps) {
      assert(step.rows.length > 0);
      if (step.kind === 'route') assert.equal(step.rows[0].items.length, 9);
      if (step.kind === 'track') {
        const numbers = step.rows[0].items.map(i => Number(i['en-US']));
        assert(numbers.every(Number.isFinite));
        assert(numbers.every((n, i) => i === 0 || n > numbers[i - 1]), 'Track must increase from left to right');
      }
      if (['sorting', 'people', 'cards'].includes(step.kind) && step.after && !adventure.id.startsWith('G01-08')) {
        const values = (rows: typeof step.rows) => rows.flatMap(r => r.items.map(i => i['en-US'])).sort();
        assert.deepEqual(values(step.rows), values(step.after), 'Rearranging must preserve objects');
      }
    }
  }
  for (const route of [['up','up','right','right'], ['right','right','up','up']]) {
    assert.equal(route.reduce(moveOnStoryMap, 6), 2, 'Both routes reach the same garden');
  }
  for (let position = 0; position < 9; position++) {
    for (const direction of ['up','down','left','right']) {
      const next = moveOnStoryMap(position, direction);
      assert(next >= 0 && next < 9);
      assert(Math.abs(Math.floor(next / 3) - Math.floor(position / 3)) + Math.abs(next % 3 - position % 3) <= 1, 'No wrapping across map edges');
    }
  }
  for (const lesson of GRADE_ONE_LESSONS) {
    assert.equal(lesson.steps.length, 3);
    assert.equal(lesson.checks.length, 2);
    assert(lesson.scene.items.length > 0);
    assert.equal(buildGradeOneLessonUrl('es-AR', lesson.id), `/es-ar/matematicas/grado/1-grado/${lesson.id.toLowerCase()}/`);
    assert.equal(buildGradeOneLessonUrl('en-US', lesson.id), `/en-us/mathematics/grade/grade-1/${lesson.id.toLowerCase()}/`);
  }
  assert(hasGradeOneEvidence([true, true, false, true, true]));
  assert(!hasGradeOneEvidence([true, true, true, true, false]), 'Reasoning cannot be skipped');
  assert(!hasGradeOneEvidence([true, true, true, false, true]), 'Transfer cannot be skipped');
  assert(!hasGradeOneEvidence([false, false, true, true, true]), 'Three correct is below the threshold');
  assert(!hasGradeOneEvidence([]));
  console.log('PASS [Grade 1] 35 lessons, 14 packages, 140 bilingual checks, prerequisites, routes, and assessment threshold');
}
