// Checks every practice generator over many seeds: shape, determinism, and —
// for the arithmetic skills — that the marked answer really is the right one.

import { generatePractice, isPracticeSkill, MISSION_PRACTICE, missionOptionIndices, type PracticeSkillId } from '../math/practice/generators';

const SEEDS = 2000;
const skills = [...new Set(Object.values(MISSION_PRACTICE))];

function fail(message: string): never {
  console.error(`FAIL [Practice generators] ${message}`);
  process.exit(1);
}

/** Independent re-computation of the right answer, from the prompt text alone. */
const EXPECTED: Partial<Record<PracticeSkillId, (prompt: string) => string>> = {
  'place-value-digit': (prompt) => {
    const [, digit, number] = prompt.match(/el (\d) en (\d{4})/) ?? fail(`unreadable prompt: ${prompt}`);
    return String(Number(digit) * 10 ** (3 - number.indexOf(digit)));
  },
  'add-no-carry': (prompt) => {
    const [, a, b] = prompt.match(/(\d+) \+ (\d+)/) ?? fail(`unreadable prompt: ${prompt}`);
    return String(Number(a) + Number(b));
  },
  'add-with-carry': (prompt) => {
    const [, a, b] = prompt.match(/(\d+) \+ (\d+)/) ?? fail(`unreadable prompt: ${prompt}`);
    return String(Number(a) + Number(b));
  },
  'subtract-with-exchange': (prompt) => {
    const [, a, b] = prompt.match(/(\d+) − (\d+)/) ?? fail(`unreadable prompt: ${prompt}`);
    return String(Number(a) - Number(b));
  },
  'subtract-across-zeros': (prompt) => {
    const [, a, b] = prompt.match(/(\d+) − (\d+)/) ?? fail(`unreadable prompt: ${prompt}`);
    return String(Number(a) - Number(b));
  },
  'estimate-sum': (prompt) => {
    const [, a, b] = prompt.match(/(\d+) \+ (\d+)/) ?? fail(`unreadable prompt: ${prompt}`);
    return `Alrededor de ${Math.round(Number(a) / 100) * 100 + Math.round(Number(b) / 100) * 100}`;
  },
  'g1-spread-molds': (prompt) => (prompt.match(/los (\d+) moldes/) ?? fail(`unreadable prompt: ${prompt}`))[1],
  'g1-teen-gift': (prompt) => String(10 + Number((prompt.match(/y (\d+) sueltas?\./) ?? fail(`unreadable prompt: ${prompt}`))[1])),
  'g1-tens-label': (prompt) => {
    const [, tens, ones] = prompt.match(/tiene (\d+) hojas? de diez y (?:(\d+) sueltas?|ninguna suelta)/) ?? fail(`unreadable prompt: ${prompt}`);
    return String(Number(tens) * 10 + Number(ones ?? 0));
  },
  'g1-next-page': (prompt) => String(Number((prompt.match(/sigue a la (\d+)/) ?? fail(`unreadable prompt: ${prompt}`))[1]) + 1),
  'g1-choose-operation': (prompt) => {
    const [, had, verb, change] = prompt.match(/tenía (\d+) figuritas y (regala|recibe) (\d+)/) ?? fail(`unreadable prompt: ${prompt}`);
    const [a, b] = [Number(had), Number(change)];
    return verb === 'regala' ? `${a} − ${b} = ${a - b}` : `${a} + ${b} = ${a + b}`;
  },
  'g1-check-sum': (prompt) => {
    const [, start, added, total] = prompt.match(/^(\d+) figuritas y (\d+) más son (\d+)/) ?? fail(`unreadable prompt: ${prompt}`);
    if (Number(start) + Number(added) !== Number(total)) fail(`wrong sum in prompt: ${prompt}`);
    return `${total} − ${added} = ${start}`;
  },
  'g1-order-cards': (prompt) => {
    const [, cards] = prompt.match(/dicen ([\d, ]+)\./) ?? fail(`unreadable prompt: ${prompt}`);
    return cards.split(', ').map(Number).sort((a, b) => a - b).join(', ');
  },
};

/** Grade 1 children count the picture: the marked answer must match what the picture shows. */
const PICTURE_ANSWER: Partial<Record<PracticeSkillId, (scene: NonNullable<ReturnType<typeof generatePractice>['scene']>) => string>> = {
  'g1-count-toys': (scene) => String(scene.rows[0].items.length),
  'g1-zero-pocket': (scene) => String(scene.rows[0].items.length),
  'g1-label-numeral': (scene) => String(scene.rows[0].items.length),
  'g1-teen-gift': (scene) => String(10 + scene.rows[1].items.length),
  'g1-tens-label': (scene) => String(scene.rows[0].items.length * 10 + scene.rows[1].items.length),
  'g1-compare-pairs': (scene) => {
    const [balloons, friends] = scene.rows.map((row) => row.items.length);
    return balloons < friends ? `Globos: ${balloons}` : `Amigos: ${friends}`;
  },
  'g1-next-page': (scene) => text(scene.rows[0].items[scene.track!.target]),
  'g1-count-line': (scene) => String(scene.rows[0].items.length),
  'g1-birds-arrive': (scene) => String(scene.rows[0].items.length + scene.rows[1].items.length),
  'g1-join-signs': (scene) => String(scene.rows[0].items.length + scene.rows[1].items.length),
  'g1-hop-forward': (scene) => text(scene.rows[0].items[scene.track!.target]),
  'g1-take-away': (scene) => String(scene.after![0].items.length),
  'g1-missing-stickers': (scene) => String(count(scene.rows[0].items, '□')),
  'g1-step-back': (scene) => text(scene.rows[0].items[scene.track!.target]),
  'g1-fill-ten': (scene) => String(count(scene.rows[0].items, '□')),
  'g1-make-ten-add': (scene) => String(count(scene.rows[0].items, '●') + scene.rows[1].items.length),
  'g1-skip-count': (scene) => text(scene.rows[0].items[scene.track!.target]),
  'g1-measure-blocks': (scene) => `${scene.rows[0].items.length} bloques`,
  'g1-longer-ribbon': (scene) => (scene.rows[0].items.length > scene.rows[1].items.length ? 'La cinta A' : 'La cinta B'),
  'g1-more-votes': (scene) => (scene.rows[0].items.length > scene.rows[1].items.length ? 'El círculo' : 'El triángulo'),
  'g1-two-baskets': (scene) => {
    const [a, b] = scene.after!.map((row) => row.items.length);
    return `${a} y ${b}`;
  },
  'g1-garland-next': (scene) => text(scene.after![0].items[scene.after![0].items.length - 1]),
  'g1-dance-next': (scene) => text(scene.after![0].items[scene.after![0].items.length - 1]),
};

function text(item: string | { 'es-AR': string }): string {
  return typeof item === 'string' ? item : item['es-AR'];
}

function count(items: (string | { 'es-AR': string })[], value: string): number {
  return items.filter((item) => text(item) === value).length;
}

const sum = (expression: string) => expression.split('+').reduce((total, part) => total + Number(part), 0);

for (const skill of skills) {
  if (!isPracticeSkill(skill)) fail(`unknown skill in MISSION_PRACTICE: ${skill}`);

  for (let seed = 1; seed <= SEEDS; seed++) {
    const exercise = generatePractice(skill, seed);
    const where = `${skill} seed ${seed}`;
    const es = exercise.options.map((option) => option['es-AR']);
    const answer = es[exercise.answerIndex];

    if (exercise.options.length !== 3) fail(`${where}: expected 3 options`);
    if (new Set(es).size !== 3) fail(`${where}: options are not distinct (${es.join(' | ')})`);
    if (answer === undefined) fail(`${where}: answerIndex out of range`);
    for (const text of [exercise.prompt, exercise.hint, exercise.explanation, ...exercise.options]) {
      if (!text['es-AR'] || !text['en-US']) fail(`${where}: missing translation`);
      if (/NaN|undefined|-\d/.test(text['es-AR'])) fail(`${where}: broken text "${text['es-AR']}"`);
    }
    if (JSON.stringify(generatePractice(skill, seed)) !== JSON.stringify(exercise)) fail(`${where}: not deterministic`);

    const prompt = exercise.prompt['es-AR'];
    const expected = EXPECTED[skill]?.(prompt);
    if (expected !== undefined && expected !== answer) fail(`${where}: "${prompt}" marks ${answer}, expected ${expected}`);
    if (skill.startsWith('g1-') && !exercise.scene) fail(`${where}: Grade 1 practice needs a picture`);
    const pictured = exercise.scene && PICTURE_ANSWER[skill]?.(exercise.scene);
    if (pictured !== undefined && pictured !== answer) fail(`${where}: the picture shows ${pictured}, but ${answer} is marked`);

    if (skill === 'write-number') {
      const digits = es.map((option) => option.replace(/0/g, ''));
      if (es.some((option) => !/^\d{4}$/.test(option)) || new Set(digits).size !== 1) {
        fail(`${where}: options must be the same digits in different places (${es.join(', ')})`);
      }
    }
    if (skill === 'regroup-decomposition') {
      const target = Number(prompt.match(/vale (\d+)/)?.[1]);
      const equal = es.filter((option) => sum(option) === target);
      if (equal.length !== 1 || equal[0] !== answer) fail(`${where}: exactly the marked option must equal ${target} (${es.join(' | ')})`);
    }
    if (skill === 'check-subtraction') {
      const total = Number(prompt.match(/comprueba (\d+)/)?.[1]);
      const rebuilds = es.filter((option) => {
        const [left, right] = option.split('=');
        return sum(left) === Number(right) && Number(right) === total;
      });
      if (rebuilds.length !== 1 || rebuilds[0] !== answer) fail(`${where}: exactly the marked option must rebuild ${total} (${es.join(' | ')})`);
    }

    const [first, second] = missionOptionIndices(exercise);
    if (first >= second || ![first, second].includes(exercise.answerIndex)) fail(`${where}: mission options must keep order and include the answer`);
  }
}

console.log(`PASS [Practice generators] ${skills.length} skills × ${SEEDS} seeds: 3 distinct options, both locales, deterministic, answers re-computed`);
