// Grade 3 challenges: no two-button guessing. Typed numbers or 3–4 options, and
// generated versions (shown after a wrong answer) for every mission challenge.
import assert from 'node:assert/strict';
import { GRADE_THREE_LESSONS } from '../content/grade3';
import { GRADE_THREE_ASSESSMENTS } from '../content/grade3/assessments';
import { GRADE_THREE_MAX } from '../content/grade3/checks';
import { GRADE_THREE_GENERATORS, gradeThreeVariant, gradeThreeVariants } from '../content/grade3/variants';
import type { GradeOneCheck } from '../content/lessonModel';

const LOCALES = ['es-AR', 'en-US'] as const;

/** Whole numbers in a text; «4.512» and “4,512” both read as 4512. */
export const integersIn = (text: string) =>
  (text.match(/\d{1,3}(?:[.,]\d{3})+(?!\d)|\d+/g) ?? []).map(n => Number(n.replace(/[.,]/g, ''))).sort((a, b) => a - b);

function validCheck(check: GradeOneCheck, where: string) {
  if (check.input === 'number') {
    assert.equal(check.options.length, 0, `Typed checks have no options: ${where}`);
    assert(Number.isInteger(check.answer) && check.answer >= 0 && check.answer <= GRADE_THREE_MAX, `Typed answer within 10,000: ${where}`);
  } else {
    assert(check.options.length >= 3 && check.options.length <= 4, `Grade 3 choices offer 3–4 options: ${where}`);
    assert(Number.isInteger(check.answer) && check.answer >= 0 && check.answer < check.options.length, `Answer index in range: ${where}`);
    for (const locale of LOCALES) assert.equal(new Set(check.options.map(o => o[locale])).size, check.options.length, `Options differ: ${where}`);
  }
}

function localized(value: { 'es-AR': string; 'en-US': string }, where: string) {
  for (const locale of LOCALES) {
    assert(typeof value[locale] === 'string' && value[locale].trim().length > 0, `Missing ${locale}: ${where}`);
    assert(!value[locale].includes('|'), `Unparsed translation: ${where}`);
    assert(!value[locale].includes('undefined') && !value[locale].includes('NaN'), `Broken text: ${where} ${value[locale]}`);
  }
}

export function runGradeThreeTests() {
  const checks = [...GRADE_THREE_LESSONS.flatMap(l => l.checks), ...Object.values(GRADE_THREE_ASSESSMENTS).flat()];
  assert.equal(checks.length, 152);
  checks.forEach((check, i) => validCheck(check, check.prompt['en-US'] || String(i)));
  const choicePositions = new Set(checks.filter(c => c.input !== 'number').map(c => c.answer));
  assert(choicePositions.size >= 3, 'The right option moves between positions');
  assert(checks.filter(c => c.input === 'number').length >= 40, 'Number answers are typed, not picked');

  assert.deepEqual(Object.keys(GRADE_THREE_GENERATORS).sort(), GRADE_THREE_LESSONS.map(l => l.id).sort(), 'Every mission has generators');
  let versions = 0;
  for (const lesson of GRADE_THREE_LESSONS) {
    lesson.checks.forEach((main, i) => {
      const where = `${lesson.id} #${i + 1}`;
      const answers = new Set<string>(), prompts = new Set<string>();
      for (let seed = 1; seed <= 400; seed++) {
        const v = gradeThreeVariant(lesson.id, i, seed);
        versions++;
        assert.deepEqual(gradeThreeVariant(lesson.id, i, seed), v, `Same seed, same version: ${where}`);
        validCheck(v, `${where} seed ${seed}`);
        assert.equal(v.input, main.input, `A version keeps the answer format: ${where}`);
        for (const value of [v.prompt, v.explanation, v.hint, ...v.options, ...(v.reward ? [v.reward] : []), ...(v.unit ? [v.unit] : [])]) localized(value, where);
        for (const locale of LOCALES) {
          for (const value of [v.prompt, v.explanation, v.hint, ...v.options]) assert(!value[locale].includes('{'), `Version text is not personalized: ${where}`);
          assert.notEqual(v.hint[locale], v.explanation[locale], `A hint is an action, not the answer: ${where}`);
          assert(integersIn(v.prompt[locale]).every(n => n <= GRADE_THREE_MAX), `Numbers stay within 10,000: ${where} ${v.prompt[locale]}`);
        }
        assert.deepEqual(integersIn(v.prompt['es-AR']), integersIn(v.prompt['en-US']), `Both languages use the same numbers: ${where} ${v.prompt['en-US']}`);
        if (v.input !== 'number') assert.deepEqual(v.options.map(o => integersIn(o['es-AR'])), v.options.map(o => integersIn(o['en-US'])), `Options use the same numbers: ${where} ${v.prompt['en-US']}`);
        if (v.input === 'number') assert(integersIn(v.explanation['es-AR']).includes(v.answer) && integersIn(v.explanation['en-US']).includes(v.answer), `The explanation shows the typed answer: ${where} ${v.prompt['en-US']}`);
        answers.add(v.input === 'number' ? String(v.answer) : v.options[v.answer]['en-US']);
        prompts.add(v.prompt['en-US']);
      }
      assert(answers.size >= 2, `The right answer changes between versions: ${where}`);
      assert(prompts.size >= 2, `Versions change the question: ${where}`);
      const shown = gradeThreeVariants(lesson.id, i, main.prompt['en-US'], 4, 12345);
      assert(shown.length >= 2 && shown.every(v => v.prompt['en-US'] !== main.prompt['en-US']), `Versions differ from the authored challenge: ${where}`);
      assert.equal(new Set(shown.map(v => v.prompt['en-US'])).size, shown.length, `Versions on one page differ: ${where}`);
      for (const v of shown) assert.deepEqual(gradeThreeVariant(lesson.id, i, v.seed).prompt, v.prompt, `A shown version can be rebuilt from its seed: ${where}`);
    });
  }
  // Authored typed answers appear in their explanations too.
  for (const check of checks.filter(c => c.input === 'number')) {
    for (const locale of LOCALES) assert(integersIn(check.explanation[locale]).includes(check.answer), `The explanation shows the typed answer: ${check.prompt['en-US']}`);
  }
  console.log(`PASS [Grade 3] 152 bilingual checks (typed or 3–4 options) and ${versions} generated versions for all 82 challenges`);
}
