// Secundaria lessons (Grades 8–12, exam-prep mode): the answer checker, the content
// rules every lesson must follow, and the server's re-check in POST /api/progress/sync.
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { checkSecondaryAnswer, matchesValue, readsAsNumber } from '../math/core/secondaryAnswer';
import { applyExerciseOutcome, INITIAL_GAME_STATE, PLANET_DESTINATIONS, VEHICLE_TIERS, type AttemptRecord } from '../game/core/gameState';
import { SECONDARY_COURSES, findSecondaryItem, findSecondaryLesson, isFreeSecondaryLesson, lessonItems } from '../content/secondary';
import { isFreeLesson } from '../content/premiumAccess';
import { buildSchoolLessonUrl } from '../i18n/routes';
import { LOCKED_LESSON_PATH } from '../lib/access/lockedLessonPath';
import { TOPICS_CATALOG } from '../math/topics/generators';

// ---------- Answer checker ----------
const n = (value: string) => ({ kind: 'number' as const, value });
assert.equal(checkSecondaryAnswer(n('-4'), '-4'), 'correct');
assert.equal(checkSecondaryAnswer(n('-4'), '−4'), 'correct', 'typographic minus');
assert.equal(checkSecondaryAnswer(n('-4'), 'x = -4'), 'correct', '"x =" prefix');
assert.equal(checkSecondaryAnswer(n('5/2'), '2,5'), 'correct', 'decimal comma equals fraction');
assert.equal(checkSecondaryAnswer(n('5/2'), '10/4'), 'correct', 'equivalent fraction');
assert.equal(checkSecondaryAnswer(n('7'), '8'), 'incorrect');
assert.equal(checkSecondaryAnswer(n('50'), '50°'), 'correct', 'a degree sign is allowed');
assert.equal(checkSecondaryAnswer(n('6200'), '6,200'), 'correct', 'en-US thousands separator');
assert.equal(checkSecondaryAnswer(n('13500'), '13.500'), 'correct', 'es-AR thousands separator');
assert.equal(checkSecondaryAnswer(n('1500000'), '1.500.000'), 'correct', 'several groups');
assert.equal(checkSecondaryAnswer(n('3/2'), '1,500'), 'correct', '"1,500" still reads as a decimal 1.5');
assert.equal(checkSecondaryAnswer(n('250'), '0,250'), 'incorrect', 'a leading 0 is never a thousands group');
assert.equal(checkSecondaryAnswer(n('6200'), '6,20'), 'incorrect', 'groups have three digits');
assert.equal(checkSecondaryAnswer(n('6200'), '6.200,5'), 'invalid', 'mixed separators are not read');
assert.equal(checkSecondaryAnswer({ kind: 'pair', x: '1500', y: '2' }, '1.500;2'), 'correct', 'pairs read groups too');
assert.equal(checkSecondaryAnswer({ kind: 'pair', x: '1500000', y: '2' }, '1.500.000;2'), 'correct', 'pairs read several groups');
assert.equal(checkSecondaryAnswer({ kind: 'pair', x: '1', y: '2' }, ';2'), 'invalid', 'an empty box makes the pair invalid');
assert.ok(readsAsNumber('1.500.000') && readsAsNumber('−2,5') && !readsAsNumber('dos') && !readsAsNumber(''), 'readsAsNumber follows the checker');
assert.equal(checkSecondaryAnswer(n('7'), 'siete'), 'invalid');
assert.equal(checkSecondaryAnswer(n('7'), '3+4'), 'invalid', 'expressions are not evaluated');
assert.equal(checkSecondaryAnswer(n('7'), '1/0'), 'invalid');
assert.equal(checkSecondaryAnswer(n('7'), ''), 'invalid');
assert.equal(checkSecondaryAnswer(n('7'), '7'.repeat(50)), 'invalid', 'too long');
const p = { kind: 'pair' as const, x: '3', y: '5' };
assert.equal(checkSecondaryAnswer(p, '3;5'), 'correct');
assert.equal(checkSecondaryAnswer(p, 'x=3; y=5'), 'correct');
assert.equal(checkSecondaryAnswer(p, '5;3'), 'incorrect');
assert.equal(checkSecondaryAnswer(p, '3'), 'invalid');
const c = { kind: 'choice' as const, answer: 2, count: 4 };
assert.equal(checkSecondaryAnswer(c, '2'), 'correct');
assert.equal(checkSecondaryAnswer(c, '1'), 'incorrect');
assert.equal(checkSecondaryAnswer(c, '4'), 'invalid');
assert.equal(checkSecondaryAnswer(c, 'a'), 'invalid');
assert.ok(matchesValue('number', '7,5', '7.5'));
assert.ok(matchesValue('pair', '5;3', '5;3'));

// ---------- Content rules ----------
const ids = new Set<string>();
let itemCount = 0;
for (const course of SECONDARY_COURSES) {
  assert.ok(course.packages.length > 0, `${course.gradeId}: at least one package`);
  const planIds = course.plan.map((row) => row.id);
  const order = course.packages.map((pack) => planIds.indexOf(pack.id));
  assert.ok(order.every((i) => i >= 0), `${course.gradeId}: every package is in the year plan`);
  assert.deepEqual(order, [...order].sort((a, b) => a - b), `${course.gradeId}: packages follow plan order (the first one is free)`);
  for (const pack of course.packages) {
    for (const lesson of pack.lessons) {
      assert.ok(!ids.has(lesson.id), `${lesson.id}: unique id`);
      ids.add(lesson.id);
      assert.equal(lesson.packageId, pack.id);
      assert.match(lesson.id, new RegExp(`^${pack.id}-L\\d{2}$`));
      assert.ok(lesson.practice.length >= 4, `${lesson.id}: at least four practice items`);
      const items = lessonItems(lesson);
      const types = new Set(lesson.practice.map((item) => item.type));
      for (const t of ['A', 'B', 'C', 'D'] as const) assert.ok(types.has(t), `${lesson.id}: practice covers type ${t}`);
      items.forEach((item, i) => {
        itemCount += 1;
        const where = `${lesson.id} item ${i}`;
        for (const locale of ['es-AR', 'en-US'] as const) {
          assert.ok(item.prompt[locale].trim(), `${where}: prompt in ${locale}`);
          assert.ok(item.hint[locale].trim(), `${where}: one hint in ${locale}`);
        }
        // The hint is a nudge, not the result: it must not contain the expected answer.
        if (item.answer.kind === 'number' && /^-?\d+$/.test(item.answer.value) && Math.abs(Number(item.answer.value)) >= 10) {
          const value = item.answer.value.replace('-', '');
          assert.ok(!new RegExp(`(^|[^\\d.,])${value}([^\\d.,]|$)`).test(item.hint['en-US']), `${where}: the hint gives away the answer ${item.answer.value}`);
        }
        if (item.unknown) {
          assert.equal(item.answer.kind, 'number', `${where}: an answer letter only labels a number answer`);
          assert.match(item.unknown, /^[a-zA-Z]$/, `${where}: the answer letter is one letter`);
          assert.ok(`${item.latex ?? ''} ${item.prompt['en-US']}`.includes(item.unknown), `${where}: the answer letter appears in the formula or the question`);
        }
        if (item.answer.kind === 'choice') {
          assert.equal(item.options?.length, 4, `${where}: four options`);
          assert.equal(item.answer.count, 4);
          assert.ok(item.answer.answer >= 0 && item.answer.answer < 4);
          assert.equal(new Set(item.options!.map((o) => o['es-AR'])).size, 4, `${where}: distinct options`);
        } else {
          const right = item.answer.kind === 'number' ? item.answer.value : `${item.answer.x};${item.answer.y}`;
          assert.equal(checkSecondaryAnswer(item.answer, right), 'correct', `${where}: the key checks as correct`);
          for (const error of item.errors ?? []) {
            assert.equal(checkSecondaryAnswer(item.answer, error.value), 'incorrect', `${where}: typical error ${error.value} is a wrong answer`);
          }
        }
        assert.deepEqual(findSecondaryItem(lesson.id, i), item, `${where}: server finds the same item`);
      });
      assert.equal(findSecondaryItem(lesson.id, items.length), null, `${lesson.id}: no item past the end`);
    }
  }
}

// Free = first package of each year; badges on secundaria pages come from the page, not the URL pattern.
for (const course of SECONDARY_COURSES) {
  for (const pack of course.packages) {
    for (const lesson of pack.lessons) {
      const free = pack.id === course.packages[0].id;
      assert.equal(isFreeSecondaryLesson(lesson.id), free);
      assert.equal(isFreeLesson(lesson.id), free, `${lesson.id}: premium rule includes secundaria`);
      assert.equal(LOCKED_LESSON_PATH.test(buildSchoolLessonUrl('es-AR', course.gradeId, lesson.id)), false);
    }
  }
}
assert.equal(isFreeLesson('G09-01-L01'), false, 'unknown secundaria ids are locked');
assert.equal(findSecondaryLesson('g08-07-l01')?.lesson.id, 'G08-07-L01', 'URL ids are case-insensitive');
assert.ok(!TOPICS_CATALOG.some((topic) => topic.id === 'linear-equations'), 'the old linear-equations topic page is gone');

// ---------- Server re-check ----------
process.chdir(mkdtempSync(path.join(tmpdir(), 'mundoki-secondary-')));
for (const key of ['DB', 'BETTER_AUTH_SECRET']) delete process.env[key];
process.env.BETTER_AUTH_SECRET = 'isolated-test-secret-with-at-least-32-characters';
const store = await import('../lib/db/d1Store');
const { POST: sync } = await import('../pages/api/progress/sync');
const db = store.loadDb();
db.users.push({ id: 's1', email: 's1@example.invalid', name: 's1', emailVerified: true } as any);
db.sessions.push({ token: 'session-s1', userId: 's1', expiresAt: '2099-01-01T00:00:00Z' });
store.saveDb(db);

const post = async (attempts: unknown[]) => {
  const response = (await sync({
    request: new Request('http://localhost:3333/api/progress/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: 'Bearer session-s1' },
      body: JSON.stringify({ attempts }),
    }),
  } as any)) as Response;
  assert.equal(response.status, 200);
  return response.json();
};
const answer = (attemptId: string, lessonId: string, checkIndex: number, userAnswer: string) => ({
  attemptId, source: 'mission', lessonId, checkIndex, userAnswer, isCorrect: true,
});

// Free package G08-01: L01 item 2 is the diver at −12 m; item 3 counts floors from −4 to 6 (10).
assert.ok(isFreeSecondaryLesson('G08-01-L01') && !isFreeSecondaryLesson('G08-02-L01') && !isFreeSecondaryLesson('G08-07-L01'), 'plan order: G08-01 is the free package');
let result = await post([answer('s-wrong', 'G08-01-L01', 2, '12')]);
assert.equal(result.gameState.totalSolved, 0, 'a wrong typed answer with a forged flag does not count');
result = await post([answer('s-right', 'G08-01-L01', 2, '-12'), answer('s-second', 'G08-01-L01', 3, '10')]);
assert.equal(result.gameState.totalSolved, 2, 'free secundaria lesson counts without Premium');
result = await post([answer('s-repeat', 'g08-01-l01', 2, '−12,0')]);
assert.equal(result.gameState.totalSolved, 2, 'the same item counts once, whatever the spelling');

// A Premium package does not count without Premium. G08-07-L01 item 2 is "x + 9 = 23" (14).
result = await post([answer('s-locked', 'G08-07-L01', 2, '14')]);
assert.equal(result.gameState.totalSolved, 2, 'a Premium secundaria lesson does not count without Premium');
assert.deepEqual(result.syncedAttemptIds, []);
const premiumDb = store.loadDb();
premiumDb.subscriptions.s1 = {
  id: 'sub-s1', userId: 's1', provider: 'mercadopago', providerSubscriptionId: 'test', planCode: 'monthly_ars',
  currency: 'ARS', amountArs: 4500, status: 'active', currentPeriodEnd: null, isDevMock: true, updatedAt: new Date().toISOString(),
};
store.saveDb(premiumDb);
result = await post([answer('s-unlocked', 'G08-07-L01', 2, '14')]);
assert.equal(result.gameState.totalSolved, 3, 'with Premium it counts');

// A pair answer (G09-06-L01 item 2: y = 2x − 1, y = x + 2 → 3;5) and a choice.
result = await post([answer('s-pair-swapped', 'G09-06-L01', 2, '5;3')]);
assert.equal(result.gameState.totalSolved, 3);
result = await post([answer('s-pair', 'G09-06-L01', 2, 'x=3;y=5')]);
assert.equal(result.gameState.totalSolved, 4);
const choiceItem = findSecondaryItem('G09-06-L01', 1)!;
assert.equal(choiceItem.answer.kind, 'choice');
const choiceIndex = choiceItem.answer.kind === 'choice' ? choiceItem.answer.answer : -1;
result = await post([answer('s-choice', 'G09-06-L01', 1, String(choiceIndex))]);
assert.equal(result.gameState.totalSolved, 5);

// Malformed: text answer, unknown lesson, index past the end.
result = await post([
  answer('s-text', 'G08-07-L01', 3, 'siete'),
  answer('s-unknown', 'G09-01-L01', 0, '1'),
  answer('s-past', 'G08-07-L01', 99, '1'),
  answer('s-negative', 'G08-07-L01', -1, '1'),
]);
assert.equal(result.gameState.totalSolved, 5);
assert.deepEqual(result.syncedAttemptIds, []);

// Five secundaria answers (with Premium) earn stars but no world rewards from the old
// linear-equations trainer topic, which is only the results bucket now.
assert.equal(result.gameState.topicMastery['linear-equations'].solved, 5);
assert.equal(result.gameState.topicMastery['linear-equations'].guardianDefeated, false, 'no planet guardian for secundaria');
assert.ok(!result.gameState.unlockedCosmetics.includes('acc-math-visor'), 'no topic cosmetic for secundaria');

// No world rewards for secundaria: an answer that would unlock a planet, an outfit and a
// new ship for a Grade 1–7 child unlocks none of them for a secundaria student.
{
  const planet = PLANET_DESTINATIONS.find((p) => p.requiredSolvedCount > 0)!;
  const tier = VEHICLE_TIERS.find((t) => t.requiredEnergy > 0)!;
  const edge = { ...INITIAL_GAME_STATE, totalSolved: planet.requiredSolvedCount - 1, stars: 999, energy: tier.requiredEnergy - 1, unlockedCosmetics: [], unlockedPlanets: [] };
  const base: AttemptRecord = { attemptId: 'w', exerciseId: 'w', topicId: 'linear-equations', seed: 0, difficulty: 1, userAnswer: '1', isCorrect: true, timestamp: '', syncedToServer: true, source: 'mission', checkIndex: 0 };
  const kinds = (lessonId: string) => applyExerciseOutcome(edge, { ...base, lessonId }, true).events.map((e) => e.type);
  const kid = kinds('G03-02-L01');
  assert.ok(kid.includes('PLANET_UNLOCKED') && kid.includes('OUTFIT_UNLOCKED') && kid.includes('VEHICLE_UPGRADED'), 'the edge state does unlock world rewards for a child');
  const teen = kinds('G08-07-L01');
  assert.deepEqual(teen.filter((t) => t !== 'ENERGY_EARNED'), [], 'secundaria earns no planet, outfit, ship or guardian');
  assert.equal(applyExerciseOutcome(edge, { ...base, lessonId: 'G08-07-L01' }, true).nextState.stars, 1000, 'but still earns a star');
}

console.log(`PASS [Secundaria] ${ids.size} lessons, ${itemCount} items: answer checker, content rules, free first package, typed/pair/choice answers re-checked on the server once each`);
