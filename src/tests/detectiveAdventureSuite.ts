import assert from 'node:assert/strict';
import { PARK_MODELS } from '../content/grade7/parkModels';
import { GRADE_SEVEN_LESSONS, GRADE_SEVEN_PACKAGES } from '../content/grade7';
import { getGradeSevenHints } from '../content/grade7/hints';
import {
  DETECTIVE_CHAPTERS, DETECTIVE_MISSIONS, nextDetectiveMission, CIPHER_SEQUENCE,
  CIPHER_PUZZLE, DEDUCTION_PUZZLE, CANDIDATES, CANDIDATE_CLUES,
} from '../content/grade7/detectiveStory';

const locales = ['es-AR', 'en-US'] as const;

export function runDetectiveAdventureTests() {
  assert.deepEqual(DETECTIVE_MISSIONS.map((m) => m.id), GRADE_SEVEN_LESSONS.map((l) => l.id));
  assert.deepEqual(DETECTIVE_CHAPTERS.map((c) => c.id), GRADE_SEVEN_PACKAGES.map((p) => p.id));
  for (const [i, m] of DETECTIVE_MISSIONS.entries()) {
    assert.equal(m.checks, GRADE_SEVEN_LESSONS[i].checks, 'Missions use the authored lesson checks');
    assert.equal(m.rewards.length, m.checks.length, `One reward per check: ${m.id}`);
    assert.equal(PARK_MODELS[m.id].length, m.checks.length);
    assert.equal(getGradeSevenHints(m.id).length, m.checks.length);
    for (const t of [m.title, m.introduction, ...m.rewards]) for (const locale of locales) assert(t[locale].trim() && !t[locale].includes('|'), `Bilingual story text: ${m.id}`);
    // The worked example must not be the challenge: no prompt may repeat the example story.
    for (const c of m.checks) for (const locale of locales) assert.notEqual(c.prompt[locale], GRADE_SEVEN_LESSONS[i].story[locale]);
    // Lesson text never names the hero; only story intros and rewards do.
    const lesson = GRADE_SEVEN_LESSONS[i];
    for (const t of [lesson.story, ...lesson.checks.map((c) => c.prompt)]) for (const locale of locales) assert(!t[locale].includes('{name}'));
  }
  // Side cases never block the main case.
  assert.deepEqual(DETECTIVE_CHAPTERS.filter((c) => c.optional).map((c) => c.id), ['G07-05', 'G07-10']);
  assert.equal(nextDetectiveMission('G07-04-L03')?.id, 'G07-06-L01');
  assert.equal(nextDetectiveMission('G07-09-L03')?.id, 'G07-11-L01');
  assert.equal(nextDetectiveMission('G07-05-L01')?.id, 'G07-05-L02');
  assert.equal(nextDetectiveMission('G07-05-L03')?.id, 'G07-06-L01');
  assert.equal(nextDetectiveMission('G07-10-L03')?.id, 'G07-11-L01');
  assert.equal(nextDetectiveMission(DETECTIVE_MISSIONS.at(-1)!.id), undefined);
  assert.equal(nextDetectiveMission('missing'), undefined);

  // Torn-map cipher: 8 pieces from main chapters only, piece k shows 1 + … + k, the lock needs the next one.
  assert(DETECTIVE_CHAPTERS.every((c) => !c.optional || c.cipher === undefined));
  assert.deepEqual(CIPHER_SEQUENCE, [1, 3, 6, 10, 15, 21, 28, 36]);
  assert.equal(CIPHER_PUZZLE.options[CIPHER_PUZZLE.answer]['en-US'], String(CIPHER_SEQUENCE.at(-1)! + CIPHER_SEQUENCE.length + 1));

  // Every chapter but the finale has an optional riddle; the finale's riddle is the deduction.
  for (const c of DETECTIVE_CHAPTERS) assert.equal(Boolean(c.riddle), c.id !== 'G07-11', `Riddle for ${c.id}`);
  for (const p of [...DETECTIVE_CHAPTERS.flatMap((c) => (c.riddle ? [c.riddle] : [])), CIPHER_PUZZLE, DEDUCTION_PUZZLE]) {
    assert(Number.isInteger(p.answer) && p.answer >= 0 && p.answer < p.options.length);
    for (const locale of locales) {
      assert.equal(new Set(p.options.map((o) => o[locale])).size, p.options.length);
      for (const t of [p.title, p.prompt, p.explanation, ...p.options]) assert(t[locale].trim() && !t[locale].includes('|') && !t[locale].includes('{name}'));
    }
  }

  // Candidate board: the deduction is forced by the evidence, and no clue names the Sphinx before the archive.
  const sphinx = DEDUCTION_PUZZLE.options[DEDUCTION_PUZZLE.answer]['es-AR'];
  const ruledOut = new Set(CANDIDATE_CLUES.filter((c) => c.mark === 'ruledOut').map((c) => c.candidate));
  const remaining = CANDIDATES.filter((c) => !ruledOut.has(c.id));
  assert.deepEqual(remaining.map((c) => c.name), [sphinx]);
  assert.equal(DEDUCTION_PUZZLE.options.length, CANDIDATES.length);
  for (const clue of CANDIDATE_CLUES) {
    assert(DETECTIVE_CHAPTERS.some((c) => c.id === clue.chapter && !c.optional), 'Clues come from main chapters');
    if (clue.chapter < 'G07-09') for (const locale of locales) assert(!clue.note[locale].includes('Ríos'), 'The name appears only in the archive');
  }
  console.log('PASS [Detective adventure] 33 missions, 66 rewards, 10 riddles, cipher 1…36→45, forced deduction, optional side cases');
}
