// Server checks for answers given inside a mission (POST /api/progress/sync):
// a generated "new numbers" exercise and the mission's own authored question.
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Import the local store only after isolating its working directory. No real credentials or data.
process.chdir(mkdtempSync(path.join(tmpdir(), 'mundoki-mission-')));
for (const key of ['DB', 'BETTER_AUTH_SECRET']) delete process.env[key];
process.env.BETTER_AUTH_SECRET = 'isolated-test-secret-with-at-least-32-characters';
const store = await import('../lib/db/d1Store');
const { POST: sync } = await import('../pages/api/progress/sync');
const { generatePractice } = await import('../math/practice/generators');
const { findMissionCheck } = await import('../content/missionChecks');

const db = store.loadDb();
for (const id of ['u1', 'u2']) {
  db.users.push({ id, email: `${id}@example.invalid`, name: id, emailVerified: true } as any);
  db.sessions.push({ token: `session-${id}`, userId: id, expiresAt: '2099-01-01T00:00:00Z' });
}
store.saveDb(db);

const post = async (attempts: unknown[], user = 'u1') => {
  const response = (await sync({
    request: new Request('http://localhost:3333/api/progress/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer session-${user}` },
      body: JSON.stringify({ attempts }),
    }),
  } as any)) as Response;
  assert.equal(response.status, 200);
  return response.json();
};

const skill = 'add-with-carry';
const seed = 987654;
const exercise = generatePractice(skill, seed);
const wrongIndex = (exercise.answerIndex + 1) % 3;
const practice = (attemptId: string, optionIndex: number, extra: Record<string, unknown> = {}) => ({
  attemptId, source: 'practice', skill, seed, userAnswer: String(optionIndex), isCorrect: true, ...extra,
});

// A wrong answer sent with a forged "isCorrect: true" is recorded as wrong.
let result = await post([practice('p-wrong', wrongIndex)]);
assert.equal(result.gameState.totalSolved, 0, 'forged isCorrect must not count');
assert.equal(result.gameState.totalAttempts, 1);
assert.deepEqual(result.syncedAttemptIds, ['p-wrong']);

// The right answer counts once.
result = await post([practice('p-right', exercise.answerIndex)]);
assert.equal(result.gameState.totalSolved, 1);
assert.equal(result.gameState.stars, 2);

// The same exercise again, under new attempt ids and in one batch: no extra credit.
result = await post([practice('p-again-1', exercise.answerIndex), practice('p-again-2', exercise.answerIndex)]);
assert.equal(result.gameState.totalSolved, 1, 'a known answer must not be replayed for credit');
assert.deepEqual(result.syncedAttemptIds, ['p-again-1', 'p-again-2']);

// A different exercise of the same skill counts.
const other = generatePractice(skill, seed + 1);
result = await post([{ ...practice('p-other', other.answerIndex), seed: seed + 1 }]);
assert.equal(result.gameState.totalSolved, 2);

// Malformed payloads are ignored.
result = await post([
  practice('bad-skill', 0, { skill: 'not-a-skill' }),
  practice('bad-answer', 7),
  practice('bad-seed', 0, { seed: 'abc' }),
  { attemptId: 'bad-lesson', source: 'mission', lessonId: 'G99-99-L99', checkIndex: 0, userAnswer: '0' },
]);
assert.equal(result.gameState.totalSolved, 2);
assert.deepEqual(result.syncedAttemptIds, []);

// The mission's own question: checked against the answer key, counted once per child.
const lessonId = 'G03-01-L02'; // first chapter: free
const key = findMissionCheck(lessonId, 0);
assert.ok(key, 'grade 3 mission must be in the answer key');
const mission = (attemptId: string, optionIndex: number) => ({
  attemptId, source: 'mission', lessonId, checkIndex: 0, userAnswer: String(optionIndex), isCorrect: true,
});
result = await post([mission('m-wrong', 1 - key.answer)]);
assert.equal(result.gameState.totalSolved, 2, 'a wrong mission answer must not count');
assert.equal(result.gameState.totalAttempts, 3, 'a wrong mission answer is not recorded as an attempt');
result = await post([mission('m-right', key.answer)]);
assert.equal(result.gameState.totalSolved, 3);
result = await post([mission('m-repeat', key.answer)]);
assert.equal(result.gameState.totalSolved, 3, 'the same mission question counts once');

// Credit is per child: another child solving the same exercises gets their own.
result = await post([practice('p-right', exercise.answerIndex), mission('m-right-u2', key.answer)], 'u2');
assert.equal(result.gameState.totalSolved, 2, 'another child earns their own credit for the same exercises');
result = await post([practice('p-u2', exercise.answerIndex)], 'u2');
assert.equal(result.gameState.totalSolved, 2, 'and only once each');

// Missions after a grade's first chapter need Premium (content/premiumAccess.ts).
const lockedId = 'G03-02-L02';
const lockedKey = findMissionCheck(lockedId, 0)!;
const locked = (attemptId: string) => ({
  attemptId, source: 'mission', lessonId: lockedId, checkIndex: 0, userAnswer: String(lockedKey.answer), isCorrect: true,
});
result = await post([locked('locked-no-premium')]);
assert.equal(result.gameState.totalSolved, 3, 'a Premium mission does not count without Premium');
assert.deepEqual(result.syncedAttemptIds, []);
const premiumDb = store.loadDb();
premiumDb.subscriptions.u1 = {
  id: 'sub-u1', userId: 'u1', provider: 'mercadopago', providerSubscriptionId: 'test', planCode: 'monthly_ars',
  currency: 'ARS', amountArs: 4500, status: 'active', currentPeriodEnd: null, isDevMock: true, updatedAt: new Date().toISOString(),
};
store.saveDb(premiumDb);
result = await post([locked('locked-premium')]);
assert.equal(result.gameState.totalSolved, 4, 'with Premium the same mission counts');

// Ids in the server's own credit namespace are refused from a client, so nobody
// can pre-register another child's credit.
result = await post([{ attemptId: `mission:u1:G03-03-L01:0`, topicId: 'addition-subtraction', seed: 5, difficulty: 1, userAnswer: '0' }], 'u2');
assert.deepEqual(result.syncedAttemptIds, []);

console.log('PASS [Mission progress] forged flag rejected, generated and authored answers verified on the server, one credit per exercise per child, malformed payloads ignored');
