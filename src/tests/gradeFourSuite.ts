// Grade 4 challenges: no two-button guessing. Typed exact answers (whole numbers,
// fractions, decimals) or 3–4 options, and generated versions (shown after a
// wrong answer) for every mission challenge.
import assert from 'node:assert/strict';
import { GRADE_FOUR_LESSONS } from '../content/grade4';
import { GRADE_FOUR_ASSESSMENTS } from '../content/grade4/assessments';
import { GRADE_FOUR_GENERATORS, gradeFourVariant, gradeFourVariants } from '../content/grade4/variants';
import { checkSecondaryAnswer, readRational } from '../math/core/secondaryAnswer';
import type { GradeOneCheck } from '../content/lessonModel';
import type { LocalizedText } from '../math/core/types';

const LOCALES = ['es-AR', 'en-US'] as const;
// Thousands may be grouped with a dot, a comma or a space («200 000» in the unit checks).
const TOKEN = /\d+(?: \d{3}(?!\d)|[.,]\d+)*(?:\/\d+)?/g;

/** Numbers in a text, normalized per locale: «3.702.040» and “3,702,040” → 3702040; «2,08» and “2.08” → 2.08. */
export function numbersIn(text: string, locale: (typeof LOCALES)[number]): string[] {
  return (text.match(TOKEN) ?? []).map(token => {
    const [whole, den] = token.replace(/ /g, '').split('/');
    const normal = locale === 'es-AR'
      ? (/^\d{1,3}(\.\d{3})+$/.test(whole) ? whole.replace(/\./g, '') : whole.replace(',', '.'))
      : whole.replace(/,(?=\d{3}(\D|$))/g, '');
    return den ? `${Number(normal)}/${den}` : String(Number(normal));
  }).sort();
}

/** True when some number written in the text equals the expected value (equal fractions count). */
const shows = (text: string, value: string) => (text.match(TOKEN) ?? []).some(token => checkSecondaryAnswer({ kind: 'number', value }, token.replace(/ /g, '')) === 'correct');

function validCheck(check: GradeOneCheck, where: string) {
  if (check.input === 'rational') {
    assert.equal(check.options.length, 0, `Typed checks have no options: ${where}`);
    assert(check.value && readRational(check.value), `Typed answer is an exact number: ${where}`);
    for (const locale of LOCALES) assert(shows(check.explanation[locale], check.value!), `The explanation shows the typed answer: ${where} ${check.explanation[locale]}`);
  } else {
    assert.equal(check.input, undefined, `Grade 4 typed answers use exact values: ${where}`);
    assert(check.options.length >= 3 && check.options.length <= 4, `Grade 4 choices offer 3–4 options: ${where}`);
    assert(Number.isInteger(check.answer) && check.answer >= 0 && check.answer < check.options.length, `Answer index in range: ${where}`);
    for (const locale of LOCALES) assert.equal(new Set(check.options.map(o => o[locale])).size, check.options.length, `Options differ: ${where}`);
  }
}

function localized(value: LocalizedText, where: string) {
  for (const locale of LOCALES) {
    assert(typeof value[locale] === 'string' && value[locale].trim().length > 0, `Missing ${locale}: ${where}`);
    assert(!value[locale].includes('|'), `Unparsed translation: ${where}`);
    assert(!/undefined|NaN|\[object/.test(value[locale]), `Broken text: ${where} ${value[locale]}`);
  }
}

export function runGradeFourTests() {
  const checks = [...GRADE_FOUR_LESSONS.flatMap(l => l.checks), ...Object.values(GRADE_FOUR_ASSESSMENTS).flat()];
  assert.equal(checks.length, 152);
  checks.forEach((check, i) => validCheck(check, check.prompt['en-US'] || String(i)));
  assert(new Set(checks.filter(c => !c.input).map(c => c.answer)).size >= 3, 'The right option moves between positions');
  assert(checks.filter(c => c.input === 'rational').length >= 60, 'Number answers are typed, not picked');
  assert(checks.some(c => c.value?.includes('/')) && checks.some(c => c.value?.includes(',')), 'Fractions and decimals are typed too');
  // Equal values count, in either locale's way of writing them.
  assert.equal(checkSecondaryAnswer({ kind: 'number', value: '2/4' }, '1/2'), 'correct');
  assert.equal(checkSecondaryAnswer({ kind: 'number', value: '2,08' }, '2.08'), 'correct');
  assert.equal(checkSecondaryAnswer({ kind: 'number', value: '700000' }, '700.000'), 'correct');
  assert.equal(checkSecondaryAnswer({ kind: 'number', value: '2,08' }, '2,8'), 'incorrect');

  assert.deepEqual(Object.keys(GRADE_FOUR_GENERATORS).sort(), GRADE_FOUR_LESSONS.map(l => l.id).sort(), 'Every mission has generators');
  let versions = 0;
  for (const lesson of GRADE_FOUR_LESSONS) {
    lesson.checks.forEach((main, i) => {
      const where = `${lesson.id} #${i + 1}`;
      const answers = new Set<string>(), prompts = new Set<string>();
      for (let seed = 1; seed <= 400; seed++) {
        const v = gradeFourVariant(lesson.id, i, seed);
        versions++;
        assert.deepEqual(gradeFourVariant(lesson.id, i, seed), v, `Same seed, same version: ${where}`);
        validCheck(v, `${where} seed ${seed}`);
        assert.equal(v.input, main.input, `A version keeps the answer format: ${where}`);
        for (const value of [v.prompt, v.explanation, v.hint, ...v.options, ...(v.reward ? [v.reward] : []), ...(v.unit ? [v.unit] : [])]) localized(value, where);
        for (const locale of LOCALES) {
          for (const value of [v.prompt, v.explanation, v.hint, ...v.options]) assert(!value[locale].includes('{'), `Version text is not personalized: ${where}`);
          assert.notEqual(v.hint[locale], v.explanation[locale], `A hint is an action, not the answer: ${where}`);
          assert(numbersIn(v.prompt[locale], locale).every(n => Number(n.split('/')[0]) <= 10_000_000), `Numbers stay within ten million: ${where}`);
        }
        assert.deepEqual(numbersIn(v.prompt['es-AR'], 'es-AR'), numbersIn(v.prompt['en-US'], 'en-US'), `Both languages use the same numbers: ${where} ${v.prompt['en-US']}`);
        if (!v.input) assert.deepEqual(v.options.map(o => numbersIn(o['es-AR'], 'es-AR')), v.options.map(o => numbersIn(o['en-US'], 'en-US')), `Options use the same numbers: ${where} ${v.prompt['en-US']}`);
        answers.add(v.input ? v.value! : v.options[v.answer]['en-US']);
        prompts.add(v.prompt['en-US']);
      }
      assert(answers.size >= 2, `The right answer changes between versions: ${where}`);
      assert(prompts.size >= 2, `Versions change the question: ${where}`);
      const shown = gradeFourVariants(lesson.id, i, main.prompt['en-US'], 4, 12345);
      assert(shown.length >= 2 && shown.every(v => v.prompt['en-US'] !== main.prompt['en-US']), `Versions differ from the authored challenge: ${where}`);
      assert.equal(new Set(shown.map(v => v.prompt['en-US'])).size, shown.length, `Versions on one page differ: ${where}`);
    });
  }
  console.log(`PASS [Grade 4] 152 bilingual checks (typed whole numbers, fractions and decimals, or 3–4 options) and ${versions} generated versions for all 82 challenges`);
}
