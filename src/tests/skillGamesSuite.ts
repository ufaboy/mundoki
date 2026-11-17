import assert from 'node:assert/strict';
import {
  evaluateSkillAnswer,
  generateSkillChallenge,
  resolveSkillFromSlug,
  SKILL_GAMES_META,
  type SkillDifficulty,
  type SkillGameId,
} from '../math/arcade/skillGames';
import { buildTrainHubUrl, buildTrainSkillUrl } from '../i18n/routes';

const skills: SkillGameId[] = ['addition', 'subtraction', 'multiplication', 'division'];
const difficulties: SkillDifficulty[] = [1, 2, 3];

for (const skill of skills) {
  for (const diff of difficulties) {
    for (let seed = 1; seed <= 200; seed++) {
      const c = generateSkillChallenge(skill, diff, seed);
      assert.equal(c.skill, skill);
      assert.equal(c.difficulty, diff);
      assert.ok(Number.isSafeInteger(c.answer), `Expected integer answer for ${c.id}`);

      if (skill === 'addition') {
        assert.equal(c.answer, c.a + c.b);
      } else if (skill === 'subtraction') {
        assert.equal(c.answer, c.a - c.b);
        assert.ok(c.answer >= 1, `Subtraction answer must be positive (${c.id})`);
      } else if (skill === 'multiplication') {
        assert.equal(c.answer, c.a * c.b);
      } else if (skill === 'division') {
        assert.ok(c.b >= 2, `Division divisor must be >= 2 (${c.id})`);
        assert.equal(c.a, c.b * c.answer);
      }

      const right = evaluateSkillAnswer(c, String(c.answer));
      assert.equal(right.valid, true);
      assert.equal(right.isCorrect, true);
      assert.equal(right.delta, 0);

      const wrong = evaluateSkillAnswer(c, String(c.answer + 1));
      assert.equal(wrong.valid, true);
      assert.equal(wrong.isCorrect, false);
      assert.equal(wrong.delta, 1);

      const invalid = evaluateSkillAnswer(c, 'abc');
      assert.equal(invalid.valid, false);
      assert.equal(invalid.isCorrect, false);
    }
  }
}

for (const meta of SKILL_GAMES_META) {
  assert.equal(resolveSkillFromSlug(meta.slugEs), meta.id);
  assert.equal(resolveSkillFromSlug(meta.slugEn), meta.id);
}
assert.equal(buildTrainHubUrl('es-AR'), '/es-ar/entrenar/');
assert.equal(buildTrainHubUrl('en-US'), '/en-us/train/');
assert.equal(buildTrainSkillUrl('es-AR', 'addition'), '/es-ar/entrenar/suma/');
assert.equal(buildTrainSkillUrl('en-US', 'multiplication'), '/en-us/train/multiplication/');

console.log(
  'PASS [Skill Games] 4 operations × 3 difficulties × 200 seeds (2,400 challenges), exact evaluation, and bilingual routes'
);
