// "New numbers": the same kind of exercise as a mission's question, with fresh
// numbers each time.
// Everything is made in the browser from a seed — pure and deterministic, so
// the same (skill, seed) always gives the same exercise and the same answer.
// The server re-creates the exercise from (skill, seed) to check an answer
// before it counts towards results (POST /api/progress/sync).

import { createSeededRng, type LocalizedText, type TopicId } from '../core/types';
import { G6_MAKERS, G6_MISSION_PRACTICE, type GradeSixSkillId } from './gradeSix';

export type PracticeSkillId =
  | 'place-value-digit'
  | 'write-number'
  | 'regroup-decomposition'
  | 'add-no-carry'
  | 'add-with-carry'
  | 'estimate-sum'
  | 'subtract-with-exchange'
  | 'subtract-across-zeros'
  | 'check-subtraction'
  // Grade 1, place 1 ("getting ready"): each one re-creates its mission's story
  // question and the picture the child counts.
  | 'g1-count-toys'
  | 'g1-zero-pocket'
  | 'g1-spread-molds'
  | 'g1-label-numeral'
  | 'g1-teen-gift'
  | 'g1-tens-label'
  | 'g1-compare-pairs'
  | 'g1-next-page'
  | 'g1-order-cards'
  | 'g1-count-line'
  | 'g1-place-in-line'
  | 'g1-birds-arrive'
  | 'g1-join-signs'
  | 'g1-hop-forward'
  | 'g1-take-away'
  | 'g1-missing-stickers'
  | 'g1-step-back'
  | 'g1-two-baskets'
  | 'g1-fill-ten'
  | 'g1-make-ten-add'
  | 'g1-garland-next'
  | 'g1-skip-count'
  | 'g1-dance-next'
  | 'g1-between'
  | 'g1-shape-for'
  | 'g1-solid-like'
  | 'g1-longer-ribbon'
  | 'g1-measure-blocks'
  | 'g1-next-day'
  | 'g1-more-votes'
  | 'g1-choose-operation'
  | 'g1-check-sum'
  // Grade 6 Math Racing: see gradeSix.ts.
  | GradeSixSkillId;

/** A row of the picture shown with a generated question (Grade 1 counts pictures, not symbols). */
export interface PracticeSceneRow {
  label: LocalizedText;
  /** One string per object; the same in both languages (emoji, digits, "10" for a sheet of ten). */
  items: (string | LocalizedText)[];
}

export interface PracticeScene {
  kind: 'groups' | 'tens' | 'track' | 'cards' | 'bars';
  rows: PracticeSceneRow[];
  /** Same objects rearranged (spread out or put in order). */
  after?: PracticeSceneRow[];
  spread?: boolean;
  track?: { start: number; target: number; direction: 1 | -1; unit?: 'page' | 'step' | 'day' };
  /** What the hero says before this question. */
  intro?: LocalizedText;
  /** What the right answer makes happen in the story. */
  reward?: LocalizedText;
}

export interface PracticeExercise {
  skill: PracticeSkillId;
  seed: number;
  prompt: LocalizedText;
  /** Always three options, already shuffled. */
  options: LocalizedText[];
  answerIndex: number;
  hint: LocalizedText;
  explanation: LocalizedText;
  scene?: PracticeScene;
}

/** Which question of a mission gets new numbers (the others are "why" questions with nothing to vary). */
export const MISSION_PRACTICE_CHECK = 0;

/** Where solved practice is counted in the child's results. */
export const PRACTICE_TOPIC: Record<PracticeSkillId, TopicId> = {
  'place-value-digit': 'addition-subtraction',
  'write-number': 'addition-subtraction',
  'regroup-decomposition': 'addition-subtraction',
  'add-no-carry': 'addition-subtraction',
  'add-with-carry': 'addition-subtraction',
  'estimate-sum': 'addition-subtraction',
  'subtract-with-exchange': 'addition-subtraction',
  'subtract-across-zeros': 'addition-subtraction',
  'check-subtraction': 'addition-subtraction',
  'g1-count-toys': 'addition-subtraction',
  'g1-zero-pocket': 'addition-subtraction',
  'g1-spread-molds': 'addition-subtraction',
  'g1-label-numeral': 'addition-subtraction',
  'g1-teen-gift': 'addition-subtraction',
  'g1-tens-label': 'addition-subtraction',
  'g1-compare-pairs': 'addition-subtraction',
  'g1-next-page': 'addition-subtraction',
  'g1-order-cards': 'addition-subtraction',
  'g1-count-line': 'addition-subtraction',
  'g1-place-in-line': 'addition-subtraction',
  'g1-birds-arrive': 'addition-subtraction',
  'g1-join-signs': 'addition-subtraction',
  'g1-hop-forward': 'addition-subtraction',
  'g1-take-away': 'addition-subtraction',
  'g1-missing-stickers': 'addition-subtraction',
  'g1-step-back': 'addition-subtraction',
  'g1-two-baskets': 'addition-subtraction',
  'g1-fill-ten': 'addition-subtraction',
  'g1-make-ten-add': 'addition-subtraction',
  'g1-garland-next': 'addition-subtraction',
  'g1-skip-count': 'addition-subtraction',
  'g1-dance-next': 'addition-subtraction',
  'g1-between': 'addition-subtraction',
  'g1-shape-for': 'addition-subtraction',
  'g1-solid-like': 'addition-subtraction',
  'g1-longer-ribbon': 'addition-subtraction',
  'g1-measure-blocks': 'addition-subtraction',
  'g1-next-day': 'addition-subtraction',
  'g1-more-votes': 'addition-subtraction',
  'g1-choose-operation': 'addition-subtraction',
  'g1-check-sum': 'addition-subtraction',
  // Grade 6: the grade's results bucket (GRADES_CATALOG grade-6 primaryTopicId).
  ...(Object.fromEntries(Object.keys(G6_MAKERS).map((skill) => [skill, 'percentages-proportions'])) as Record<GradeSixSkillId, TopicId>),
};

/** Which mission question each skill re-creates. Missions not listed have no new-numbers button yet. */
export const MISSION_PRACTICE: Record<string, PracticeSkillId> = {
  'G03-01-L01': 'place-value-digit',
  'G03-01-L02': 'write-number',
  'G03-01-L03': 'regroup-decomposition',
  'G03-02-L01': 'add-no-carry',
  'G03-02-L02': 'add-with-carry',
  'G03-02-L03': 'estimate-sum',
  'G03-03-L01': 'subtract-with-exchange',
  'G03-03-L02': 'subtract-across-zeros',
  'G03-03-L03': 'check-subtraction',
  'G01-01-L01': 'g1-count-toys',
  'G01-01-L02': 'g1-zero-pocket',
  'G01-01-L03': 'g1-spread-molds',
  'G01-02-L01': 'g1-label-numeral',
  'G01-02-L02': 'g1-teen-gift',
  'G01-02-L03': 'g1-tens-label',
  'G01-03-L01': 'g1-compare-pairs',
  'G01-03-L02': 'g1-next-page',
  'G01-03-L03': 'g1-order-cards',
  'G01-04-L01': 'g1-count-line',
  'G01-04-L02': 'g1-place-in-line',
  'G01-05-L01': 'g1-birds-arrive',
  'G01-05-L02': 'g1-join-signs',
  'G01-05-L03': 'g1-hop-forward',
  'G01-06-L01': 'g1-take-away',
  'G01-06-L02': 'g1-missing-stickers',
  'G01-06-L03': 'g1-step-back',
  'G01-07-L01': 'g1-two-baskets',
  'G01-07-L02': 'g1-fill-ten',
  'G01-07-L03': 'g1-make-ten-add',
  'G01-08-L01': 'g1-garland-next',
  'G01-08-L02': 'g1-skip-count',
  'G01-08-L03': 'g1-dance-next',
  'G01-09-L01': 'g1-between',
  'G01-10-L01': 'g1-shape-for',
  'G01-10-L02': 'g1-solid-like',
  'G01-11-L01': 'g1-longer-ribbon',
  'G01-11-L02': 'g1-measure-blocks',
  'G01-12-L02': 'g1-next-day',
  'G01-13-L02': 'g1-more-votes',
  'G01-14-L01': 'g1-choose-operation',
  'G01-14-L02': 'g1-check-sum',
  ...G6_MISSION_PRACTICE,
};

type Rng = ReturnType<typeof createSeededRng>;

const both = (es: string, en: string): LocalizedText => ({ 'es-AR': es, 'en-US': en });
const same = (value: string | number): LocalizedText => both(String(value), String(value));

interface Draft {
  prompt: LocalizedText;
  correct: LocalizedText;
  /** Wrong options, most instructive first; duplicates of the correct one are dropped. */
  wrong: LocalizedText[];
  hint: LocalizedText;
  explanation: LocalizedText;
  scene?: PracticeScene;
}

function build(skill: PracticeSkillId, seed: number, rng: Rng, draft: Draft): PracticeExercise {
  const seen = new Set([draft.correct['es-AR']]);
  const wrong: LocalizedText[] = [];
  for (const option of draft.wrong) {
    if (wrong.length === 2) break;
    if (seen.has(option['es-AR'])) continue;
    seen.add(option['es-AR']);
    wrong.push(option);
  }
  if (wrong.length < 2) throw new Error(`Practice "${skill}" (seed ${seed}) needs two distinct wrong options.`);

  const answerIndex = rng.nextInt(0, 2);
  const options = [...wrong];
  options.splice(answerIndex, 0, draft.correct);
  return {
    skill, seed, prompt: draft.prompt, options, answerIndex, hint: draft.hint, explanation: draft.explanation,
    ...(draft.scene ? { scene: draft.scene } : {}),
  };
}

// ---------- Grade 1 helpers ----------

// Emoji every common phone and computer can draw (no recent additions).
const TOY_POOL = ['🚗', '🧸', '⚽', '🤖', '⛵', '🦖', '🎲', '🎈', '🐻'];
const FRIENDS = ['Ana', 'Leo', 'Sol', 'Paz', 'Teo'];
const repeat = (count: number, item: string) => Array.from({ length: count }, () => item);
const sceneRow = (es: string, en: string, items: (string | LocalizedText)[]): PracticeSceneRow => ({ label: both(es, en), items });

function shuffled<T>(rng: Rng, items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const other = rng.nextInt(0, index);
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

const NAMES = ['Ana', 'Leo', 'Sol', 'Paz', 'Teo', 'Mía', 'Juan', 'Lu', 'Tito'];
const ORDINALS = [both('primer', 'first'), both('segundo', 'second'), both('tercer', 'third'), both('cuarto', 'fourth'), both('quinto', 'fifth')];
const SHAPES = ['○', '□', '△'];
const GARLAND_UNITS = [['○', '□'], ['△', '○'], ['□', '△'], ['○', '○', '□'], ['△', '△', '○'], ['□', '○', '○']];
const PICNIC = [
  { emoji: '📖', es: 'el libro', en: 'the book' },
  { emoji: '🥤', es: 'el vaso', en: 'the cup' },
  { emoji: '⚽', es: 'la pelota', en: 'the ball' },
  { emoji: '🍎', es: 'la manzana', en: 'the apple' },
  { emoji: '🧢', es: 'el gorro', en: 'the hat' },
  { emoji: '🍪', es: 'la galletita', en: 'the cookie' },
];
const SIGN_NEEDS = [
  { es: 'un techo de 3 lados rectos', en: 'a roof with 3 straight sides', shape: both('El triángulo', 'The triangle'), why: both('El triángulo tiene tres lados rectos.', 'A triangle has three straight sides.') },
  { es: 'un sol con el borde curvo', en: 'a sun with a curved edge', shape: both('El círculo', 'The circle'), why: both('El círculo tiene el borde curvo, sin lados rectos.', 'A circle has a curved edge and no straight sides.') },
  { es: 'una ventana de 4 lados iguales', en: 'a window with 4 equal sides', shape: both('El cuadrado', 'The square'), why: both('El cuadrado tiene cuatro lados iguales.', 'A square has four equal sides.') },
  { es: 'una puerta de 4 lados, dos largos y dos cortos', en: 'a door with 4 sides, two long and two short', shape: both('El rectángulo', 'The rectangle'), why: both('El rectángulo tiene dos lados largos y dos cortos.', 'A rectangle has two long sides and two short ones.') },
];
const SOLIDS = [
  { emoji: '⚽', es: 'la pelota', en: 'the ball', solid: both('Una esfera', 'A sphere'), flat: both('Un círculo', 'A circle'), why: both('La pelota es redonda por todos lados y rueda: una esfera.', 'The ball is round all over and rolls: a sphere.') },
  { emoji: '🎲', es: 'el dado', en: 'the die', solid: both('Un cubo', 'A cube'), flat: both('Un cuadrado', 'A square'), why: both('El dado tiene seis caras cuadradas y ocupa lugar: un cubo.', 'The die has six square faces and takes up space: a cube.') },
  { emoji: '🥫', es: 'la lata', en: 'the can', solid: both('Un cilindro', 'A cylinder'), flat: both('Un rectángulo', 'A rectangle'), why: both('La lata tiene dos bases redondas y una parte curva: un cilindro.', 'The can has two round bases and a curved side: a cylinder.') },
];
const WEEK = [
  { long: both('lunes', 'Monday'), short: both('Lun', 'Mon') },
  { long: both('martes', 'Tuesday'), short: both('Mar', 'Tue') },
  { long: both('miércoles', 'Wednesday'), short: both('Mié', 'Wed') },
  { long: both('jueves', 'Thursday'), short: both('Jue', 'Thu') },
  { long: both('viernes', 'Friday'), short: both('Vie', 'Fri') },
  { long: both('sábado', 'Saturday'), short: both('Sáb', 'Sat') },
  { long: both('domingo', 'Sunday'), short: both('Dom', 'Sun') },
];

const G1_MAKERS = {
  // "How many toys go in the backpack?" — tap each toy once.
  'g1-count-toys': (rng: Rng): Draft => {
    const count = rng.nextInt(3, 9);
    const toys = Array.from({ length: count }, () => rng.pick(TOY_POOL));
    return {
      prompt: both('¿Cuántos juguetes van a la mochila?', 'How many toys go in the backpack?'),
      correct: same(count),
      // Counting one toy twice is the mission's own slip.
      wrong: [same(count + 1), same(count - 1), same(count + 2)],
      hint: both('Tocá un juguete por cada número que decís.', 'Tap one toy for each number you say.'),
      explanation: both(`Cada juguete recibe un número: son ${count}.`, `Each toy gets one number: there are ${count}.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('En el estante', 'On the shelf', toys)],
        intro: both('Más juguetes para la mochila. Tocá cada uno una vez.', 'More toys for the backpack. Tap each one once.'),
        reward: both(`La lista de la mochila dice: ${count} juguetes.`, `The backpack list says: ${count} toys.`),
      },
    };
  },

  // "How many toys are inside the pocket?" — only the pocket counts; it may be empty.
  'g1-zero-pocket': (rng: Rng): Draft => {
    const inside = rng.nextInt(0, 2) === 0 ? 0 : rng.nextInt(1, 4);
    let outside = rng.nextInt(1, 4);
    if (outside === inside) outside = inside + 1;
    const sand = ['🐚', '⭐', '🦀', '🏐'];
    return {
      prompt: both('¿Cuántos juguetes hay dentro del bolsillo?', 'How many toys are inside the pocket?'),
      correct: same(inside),
      // Counting the toys outside is the likely slip.
      wrong: [same(outside), same(inside + outside), same(inside + 1), same(inside + 2)],
      hint: both('Mirá solo la fila «Dentro del bolsillo».', 'Look only at the “Inside the pocket” row.'),
      explanation: inside === 0
        ? both('El bolsillo está vacío: hay 0 juguetes adentro.', 'The pocket is empty: there are 0 toys inside.')
        : both(`Adentro hay ${inside}. Los de afuera no cuentan.`, `There are ${inside} inside. The ones outside do not count.`),
      scene: {
        kind: 'groups',
        rows: [
          sceneRow('Dentro del bolsillo', 'Inside the pocket', Array.from({ length: inside }, (_, index) => sand[index % sand.length])),
          sceneRow('Afuera', 'Outside', Array.from({ length: outside }, (_, index) => sand[(index + 1) % sand.length])),
        ],
        intro: both('Otro bolsillo. Mirá solo adentro.', 'Another pocket. Look only inside.'),
        reward: both(`La etiqueta del bolsillo dice ${inside}.`, `The pocket label says ${inside}.`),
      },
    };
  },

  // "{n} molds spread out: how many now?" — spreading out does not add.
  'g1-spread-molds': (rng: Rng): Draft => {
    const count = rng.nextInt(2, 8);
    const molds = repeat(count, '⭐');
    return {
      prompt: both(`Separamos los ${count} moldes. ¿Cuántos moldes hay ahora?`, `We spread out the ${count} molds. How many molds are there now?`),
      correct: same(count),
      // "The row is longer, so there are more."
      wrong: [same(count * 2), same(count + 1), same(count + 2)],
      hint: both('Tocá «Separar». Después tocá cada molde mientras contás.', 'Tap “Spread out.” Then tap each mold as you count.'),
      explanation: both(`Separar no agrega moldes: siguen siendo ${count}.`, `Spreading out does not add molds: there are still ${count}.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Moldes juntos', 'Molds together', molds)],
        after: [sceneRow('Moldes separados', 'Molds spread out', molds)],
        spread: true,
        intro: both('Más moldes para la bolsa. Separalos y contalos.', 'More molds for the bag. Spread them out and count them.'),
        reward: both(`La bolsa de arena lleva ${count} moldes.`, `The sand bag takes ${count} molds.`),
      },
    };
  },

  // "Which number goes on the crayon label?" — one dot per crayon.
  'g1-label-numeral': (rng: Rng): Draft => {
    const count = rng.nextInt(2, 9);
    return {
      prompt: both('¿Qué número va en la etiqueta de los crayones?', 'Which number goes on the crayon label?'),
      correct: same(count),
      wrong: [same(count + 1), same(count - 1), same(count + 2)],
      hint: both('Tocá cada crayón y su punto. Contá los puntos.', 'Tap each crayon and its dot. Count the dots.'),
      explanation: both(`Hay ${count} crayones y ${count} puntos: escribimos ${count}.`, `There are ${count} crayons and ${count} dots: we write ${count}.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Caja de crayones', 'Crayon box', repeat(count, '🖍️')), sceneRow('Dibujo', 'Picture', repeat(count, '●'))],
        intro: both('Otra caja de crayones necesita su etiqueta.', 'Another crayon box needs its label.'),
        reward: both(`La caja tiene su etiqueta: ${count}.`, `The box has its label: ${count}.`),
      },
    };
  },

  // "One sheet of ten and {k} loose: how many stickers?"
  'g1-teen-gift': (rng: Rng): Draft => {
    const loose = rng.nextInt(1, 9);
    const friend = rng.pick(FRIENDS);
    const total = 10 + loose;
    return {
      prompt: both(
        `Para ${friend} hay una hoja de diez y ${loose} ${loose === 1 ? 'suelta' : 'sueltas'}. ¿Cuántas figuritas son?`,
        `For ${friend} there is one sheet of ten and ${loose} loose. How many stickers is that?`
      ),
      correct: same(total),
      // Forgetting the sheet of ten is the mission's own slip.
      wrong: [same(loose), same(total + 1), same(total - 1)],
      hint: both('Decí «diez» por la hoja y seguí contando las sueltas.', 'Say “ten” for the sheet and count on with the loose ones.'),
      explanation: both(`10 + ${loose} = ${total}.`, `10 + ${loose} = ${total}.`),
      scene: {
        kind: 'tens',
        rows: [sceneRow('Hoja', 'Sheet', ['10']), sceneRow('Sueltas', 'Loose', repeat(loose, '★'))],
        intro: both(`Otro regalo, ahora para ${friend}.`, `Another gift, this time for ${friend}.`),
        reward: both(`El regalo de ${friend} dice ${total}.`, `${friend}’s gift says ${total}.`),
      },
    };
  },

  // "{t} sheets and {u} loose: which number goes on the label?"
  'g1-tens-label': (rng: Rng): Draft => {
    const tens = rng.nextInt(1, 9);
    let ones = rng.nextInt(0, 9);
    if (ones === tens) ones = (ones + 1) % 10;
    const total = tens * 10 + ones;
    const swapped = ones * 10 + tens;
    const sheetsEs = `${tens} ${tens === 1 ? 'hoja' : 'hojas'}`;
    const sheetsEn = `${tens} ${tens === 1 ? 'sheet' : 'sheets'}`;
    const looseEs = ones === 0 ? 'ninguna suelta' : `${ones} ${ones === 1 ? 'suelta' : 'sueltas'}`;
    const looseEn = ones === 0 ? 'none loose' : `${ones} loose`;
    return {
      prompt: both(
        `La caja tiene ${sheetsEs} de diez y ${looseEs}. ¿Qué número va en la etiqueta?`,
        `The box has ${sheetsEn} of ten and ${looseEn}. Which number goes on the label?`
      ),
      correct: same(total),
      // Swapping tens and ones, or adding the digits, are the usual slips.
      wrong: [same(swapped), same(tens + ones), same(total + 10)],
      hint: both('Contá las hojas de diez en diez. Después sumá las sueltas.', 'Count the sheets by tens. Then add the loose ones.'),
      explanation: both(`${sheetsEs} de diez: ${tens * 10}; ${tens * 10} + ${ones} = ${total}.`, `${sheetsEn} of ten: ${tens * 10}; ${tens * 10} + ${ones} = ${total}.`),
      scene: {
        kind: 'tens',
        rows: [sceneRow('Hojas', 'Sheets', repeat(tens, '10')), sceneRow(ones ? 'Sueltas' : 'Sueltas: ninguna', ones ? 'Loose' : 'Loose: none', repeat(ones, '★'))],
        intro: both('Otra caja de figuritas para etiquetar.', 'Another sticker box to label.'),
        reward: both(`La caja recibe su etiqueta: ${total}.`, `The box gets its label: ${total}.`),
      },
    };
  },

  // "{a} balloons, {b} friends: which is fewer?" — pair them one to one.
  'g1-compare-pairs': (rng: Rng): Draft => {
    const balloons = rng.nextInt(2, 8);
    let friends = rng.nextInt(2, 8);
    if (friends === balloons) friends = balloons === 2 ? 3 : balloons - 1;
    const balloonText = both(`Globos: ${balloons}`, `Balloons: ${balloons}`);
    const friendText = both(`Amigos: ${friends}`, `Friends: ${friends}`);
    const fewerIsBalloons = balloons < friends;
    return {
      prompt: both(`Hay ${balloons} globos y ${friends} amigos. ¿Qué hay menos?`, `There are ${balloons} balloons and ${friends} friends. Which is fewer?`),
      correct: fewerIsBalloons ? balloonText : friendText,
      wrong: [fewerIsBalloons ? friendText : balloonText, both('Hay la misma cantidad', 'They are the same')],
      hint: both('Tocá un globo y un amigo a la vez. ¿Qué fila se termina primero?', 'Tap one balloon and one friend at a time. Which row runs out first?'),
      explanation: fewerIsBalloons
        ? both(`Al emparejar, quedan ${friends - balloons} amigos sin globo.`, `After pairing, ${friends - balloons} friends have no balloon.`)
        : both(`Al emparejar, sobran ${balloons - friends} globos.`, `After pairing, ${balloons - friends} balloons are left over.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Globos', 'Balloons', repeat(balloons, '🎈')), sceneRow('Amigos', 'Friends', repeat(friends, '🙂'))],
        intro: both('Llega otro grupo de amigos. ¿Alcanzan los globos?', 'Another group of friends arrives. Are there enough balloons?'),
        reward: fewerIsBalloons
          ? both(`{name} infla ${friends - balloons} globos más.`, `{name} blows up ${friends - balloons} more balloons.`)
          : both(`Sobran ${balloons - friends} globos: alcanzan para todos.`, `${balloons - friends} balloons are left over: enough for everyone.`),
      },
    };
  },

  // "The numbers are on the page after {n}: which page?"
  'g1-next-page': (rng: Rng): Draft => {
    const page = rng.nextInt(5, 89);
    return {
      prompt: both(`Los teléfonos están en la página que sigue a la ${page}. ¿Qué página abrimos?`, `The phone numbers are on the page after ${page}. Which page do we open?`),
      correct: same(page + 1),
      // Going back a page, or jumping ten, are the usual slips.
      wrong: [same(page - 1), same(page + 10), same(page + 2)],
      hint: both(`Empezá en la página ${page}. Tocá «Pasar una página».`, `Start on page ${page}. Tap “Turn one page.”`),
      explanation: both(`Una página después de la ${page} está la ${page + 1}.`, `One page after ${page} is page ${page + 1}.`),
      scene: {
        kind: 'track',
        rows: [sceneRow('Páginas', 'Pages', [page - 1, page, page + 1, page + 2].map(String))],
        track: { start: 1, target: 2, direction: 1, unit: 'page' },
        intro: both('Buscamos otro teléfono en la libreta.', 'We look for another number in the notebook.'),
        reward: both(`{name} abre la página ${page + 1}.`, `{name} opens page ${page + 1}.`),
      },
    };
  },

  // "Which row of call cards is in order?"
  'g1-order-cards': (rng: Rng): Draft => {
    const pool = shuffled(rng, Array.from({ length: 19 }, (_, index) => index + 1)).slice(0, 3);
    const sorted = [...pool].sort((a, b) => a - b);
    const mixed = sorted.join(',') === pool.join(',') ? [sorted[2], sorted[0], sorted[1]] : pool;
    const row = (values: number[]) => same(values.join(', '));
    return {
      prompt: both(`Las tarjetas dicen ${mixed.join(', ')}. ¿Qué fila está ordenada para llamar?`, `The cards say ${mixed.join(', ')}. Which row is in order for calling?`),
      correct: row(sorted),
      // Copying the order the cards came in, or going largest first.
      wrong: [row(mixed), row([...sorted].reverse()), row([sorted[1], sorted[0], sorted[2]])],
      hint: both('Buscá primero el número más chico de las tres tarjetas.', 'First find the smallest number on the three cards.'),
      explanation: both(`${sorted[0]} es menor que ${sorted[1]} y ${sorted[1]} es menor que ${sorted[2]}.`, `${sorted[0]} is less than ${sorted[1]} and ${sorted[1]} is less than ${sorted[2]}.`),
      scene: {
        kind: 'cards',
        rows: [sceneRow('Tarjetas', 'Cards', mixed.map(String))],
        after: [sceneRow('En orden', 'In order', sorted.map(String))],
        intro: both('Llegan tres tarjetas nuevas. ¿A quién llamamos primero?', 'Three new cards arrive. Whom do we call first?'),
        reward: both(`{name} llama en orden: ${sorted.join(', ')}.`, `{name} calls in order: ${sorted.join(', ')}.`),
      },
    };
  },
  // ---------- Places 2–5 ----------

  // "How many friends are waiting at the gate?" — a number, not the last name.
  'g1-count-line': (rng: Rng): Draft => {
    const count = rng.nextInt(3, 9);
    const line = shuffled(rng, NAMES).slice(0, count);
    return {
      prompt: both('¿Cuántos amigos esperan en la puerta de la plaza?', 'How many friends are waiting at the park gate?'),
      correct: same(count),
      // Answering with the last friend's name is the mission's own slip.
      wrong: [same(line[count - 1]), same(count + 1), same(count - 1)],
      hint: both('Tocá a cada amigo una vez mientras contás.', 'Tap each friend once as you count.'),
      explanation: both(`Contamos a todos: son ${count} amigos.`, `We count everyone: there are ${count} friends.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Esperan en la puerta', 'Waiting at the gate', line)],
        intro: both('Llegan otros amigos a la puerta. Tocá a cada uno una vez.', 'Other friends arrive at the gate. Tap each one once.'),
        reward: both(`La abuela compra ${count} jugos, uno para cada amigo.`, `Grandma buys ${count} juices, one for each friend.`),
      },
    };
  },

  // "The flag goes to the friend in fourth place, counting from Ana. Who?"
  'g1-place-in-line': (rng: Rng): Draft => {
    const line = shuffled(rng, NAMES).slice(0, 5);
    const place = rng.nextInt(2, 5);
    const pick = (index: number) => (index >= 0 && index < line.length ? [same(line[index])] : []);
    return {
      prompt: both(
        `La bandera la lleva el amigo del ${ORDINALS[place - 1]['es-AR']} lugar, contando desde ${line[0]}. ¿Quién la lleva?`,
        `The flag goes to the friend in ${ORDINALS[place - 1]['en-US']} place, counting from ${line[0]}. Who carries it?`
      ),
      correct: same(line[place - 1]),
      // Counting from the other end, or one place short, are the usual slips.
      wrong: [...pick(line.length - place), ...pick(place - 2), ...pick(place)],
      hint: both(`Empezá por ${line[0]} y decí los lugares: primero, segundo…`, `Start with ${line[0]} and say the places: first, second…`),
      explanation: both(`${line.slice(0, place).join(', ')}: ${line[place - 1]} está en ese lugar.`, `${line.slice(0, place).join(', ')}: ${line[place - 1]} is in that place.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow(`Fila: empieza en ${line[0]} →`, `Line: starts with ${line[0]} →`, line)],
        intro: both('Otra fila para el paseo. Contá los lugares desde la izquierda.', 'Another line for the walk. Count the places from the left.'),
        reward: both(`${line[place - 1]} lleva la bandera.`, `${line[place - 1]} carries the flag.`),
      },
    };
  },

  // "There were 5 birds and 1 arrives. How many piles of seed?"
  'g1-birds-arrive': (rng: Rng): Draft => {
    const here = rng.nextInt(2, 8);
    const arriving = rng.nextInt(1, 3);
    const total = here + arriving;
    return {
      prompt: both(
        `Había ${here} pájaros y ${arriving === 1 ? 'llega 1' : `llegan ${arriving}`}. ¿Cuántos montoncitos de alpiste hacen falta?`,
        `There were ${here} birds and ${arriving} ${arriving === 1 ? 'arrives' : 'arrive'}. How many piles of seed are needed?`
      ),
      correct: same(total),
      // Forgetting the ones arriving is the usual slip.
      wrong: [same(here), same(total + 1), same(total - 1)],
      hint: both('Contá los que ya estaban y seguí con los que llegan.', 'Count the birds already there and keep going with the ones arriving.'),
      explanation: both(`${here} + ${arriving} = ${total}: un montoncito por pájaro.`, `${here} + ${arriving} = ${total}: one pile for each bird.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Ya estaban', 'Already here', repeat(here, '🐦')), sceneRow('Llegan', 'Arriving', repeat(arriving, '🐦'))],
        after: [sceneRow('Ahora juntos', 'Now together', repeat(total, '🐦'))],
        intro: both('Llegan más pájaros a la plaza.', 'More birds come to the park.'),
        reward: both(`{name} pone ${total} montoncitos de alpiste.`, `{name} puts down ${total} piles of seed.`),
      },
    };
  },

  // "Sol brings 3 signs and Leo brings 4. How many signs for the town?"
  'g1-join-signs': (rng: Rng): Draft => {
    const first = rng.nextInt(1, 6);
    const second = rng.nextInt(1, 6);
    const total = first + second;
    return {
      prompt: both(
        `Sol trae ${first} ${first === 1 ? 'señal' : 'señales'} y Leo trae ${second}. ¿Cuántas señales hay para la ciudad?`,
        `Sol brings ${first} ${first === 1 ? 'sign' : 'signs'} and Leo brings ${second}. How many signs are there for the town?`
      ),
      correct: same(total),
      // Taking only the bigger group is the usual slip.
      wrong: [same(Math.max(first, second)), same(total + 1), same(total - 1)],
      hint: both('Contá las señales de Sol y seguí con las de Leo.', 'Count Sol’s signs and keep going with Leo’s.'),
      explanation: both(`${first} + ${second} = ${total}.`, `${first} + ${second} = ${total}.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('De Sol', 'Sol’s', repeat(first, '🚩')), sceneRow('De Leo', 'Leo’s', repeat(second, '🚩'))],
        after: [sceneRow('Ciudad', 'Town', repeat(total, '🚩'))],
        intro: both('La ciudad de arena crece: llegan más señales.', 'The sand town grows: more signs arrive.'),
        reward: both(`Hacen ${total} pozos en la arena, uno por señal.`, `They dig ${total} holes in the sand, one for each sign.`),
      },
    };
  },

  // "Leo is on 3 and hops 4 squares. Which square?"
  'g1-hop-forward': (rng: Rng): Draft => {
    const start = rng.nextInt(1, 12);
    const hops = rng.nextInt(2, 5);
    const end = start + hops;
    return {
      prompt: both(`Leo está en el ${start} de la rayuela y salta ${hops} casillas. ¿A qué casilla llega?`, `Leo is on ${start} on the hopscotch and hops ${hops} squares. Which square is that?`),
      correct: same(end),
      // Counting the starting square as a hop lands one short.
      wrong: [same(end - 1), same(end + 1), same(end + 2)],
      hint: both(`Empezá en el ${start}. Tocá «Avanzar» ${hops} veces.`, `Start on ${start}. Tap “Move forward” ${hops} times.`),
      explanation: both(`${start} + ${hops} = ${end}.`, `${start} + ${hops} = ${end}.`),
      scene: {
        kind: 'track',
        rows: [sceneRow('Rayuela', 'Hopscotch', Array.from({ length: hops + 2 }, (_, index) => String(start + index)))],
        track: { start: 0, target: hops, direction: 1, unit: 'step' },
        intro: both('Otra piedrita cayó en la rayuela.', 'Another pebble landed on the hopscotch.'),
        reward: both(`Leo llega al ${end} y junta la piedrita.`, `Leo reaches ${end} and picks up the pebble.`),
      },
    };
  },

  // "There are 6 barriers and we take away 2. How many are left?"
  'g1-take-away': (rng: Rng): Draft => {
    const all = rng.nextInt(4, 10);
    const away = rng.nextInt(1, all - 1);
    const left = all - away;
    return {
      prompt: both(`Hay ${all} vallas en la calle y sacamos ${away}. ¿Cuántas quedan?`, `There are ${all} barriers on the road and we take away ${away}. How many are left?`),
      correct: same(left),
      // Answering with the ones taken away is the mission's own slip.
      wrong: [same(away), same(all + away), same(left + 1)],
      hint: both('Tocá «Ver el cambio». Contá solo las que quedan en la calle.', 'Tap “See the change.” Count only the ones left on the road.'),
      explanation: both(`${all} − ${away} = ${left}.`, `${all} − ${away} = ${left}.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('En la calle', 'On the road', repeat(all, '🚧'))],
        after: [sceneRow('Quedan', 'Left', repeat(left, '🚧')), sceneRow('Guardadas', 'Put away', repeat(away, '×'))],
        intro: both('Otra calle de juguete está llena de vallas.', 'Another toy road is full of barriers.'),
        reward: both(`Quedan ${left} vallas y el autito pasa.`, `${left} barriers are left and the toy car gets through.`),
      },
    };
  },

  // "The album row has 7 spaces and there are 4 stickers. How many are missing?"
  'g1-missing-stickers': (rng: Rng): Draft => {
    const spaces = rng.nextInt(5, 10);
    const have = rng.nextInt(1, spaces - 1);
    const missing = spaces - have;
    return {
      prompt: both(`La fila del álbum tiene ${spaces} lugares y hay ${have} figuritas. ¿Cuántas faltan?`, `The album row has ${spaces} spaces and there are ${have} stickers. How many are missing?`),
      correct: same(missing),
      // Adding both numbers is the mission's own slip.
      wrong: [same(spaces + have), same(have), same(missing + 1)],
      hint: both('Contá los lugares vacíos de la fila.', 'Count the empty spaces in the row.'),
      explanation: both(`${have} + ${missing} = ${spaces}: faltan ${missing}.`, `${have} + ${missing} = ${spaces}: ${missing} are missing.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Fila del álbum', 'Album row', [...repeat(have, '★'), ...repeat(missing, '□')])],
        after: [sceneRow('Fila completa', 'Complete row', repeat(spaces, '★'))],
        intro: both('Otra fila del álbum para completar.', 'Another album row to fill in.'),
        reward: both(`Con ${missing} figuritas más, la fila queda completa.`, `With ${missing} more stickers, the row is complete.`),
      },
    };
  },

  // "The ball is 2 tiles back from 8. Which tile?"
  'g1-step-back': (rng: Rng): Draft => {
    const from = rng.nextInt(4, 15);
    const back = rng.nextInt(1, 3);
    const ball = from - back;
    return {
      prompt: both(
        `La pelota está ${back} ${back === 1 ? 'baldosa' : 'baldosas'} atrás de la ${from}. ¿En qué baldosa está?`,
        `The ball is ${back} ${back === 1 ? 'tile' : 'tiles'} back from ${from}. Which tile is it on?`
      ),
      correct: same(ball),
      // Moving forward instead of back is the usual slip.
      wrong: [same(from + back), same(ball + 1), same(ball - 1)],
      hint: both(`Empezá en la ${from}. Tocá «Retroceder» ${back} ${back === 1 ? 'vez' : 'veces'}.`, `Start on ${from}. Tap “Move back” ${back} ${back === 1 ? 'time' : 'times'}.`),
      explanation: both(`${from} − ${back} = ${ball}.`, `${from} − ${back} = ${ball}.`),
      scene: {
        kind: 'track',
        rows: [sceneRow('Baldosas', 'Tiles', Array.from({ length: back + 1 }, (_, index) => String(ball + index)))],
        track: { start: back, target: 0, direction: -1, unit: 'step' },
        intro: both('La pelota rodó otra vez hacia atrás.', 'The ball rolled back again.'),
        reward: both(`{name} llega a la ${ball} y agarra la pelota.`, `{name} reaches ${ball} and grabs the ball.`),
      },
    };
  },

  // "There are 8 balls for two baskets. Which pair works?"
  'g1-two-baskets': (rng: Rng): Draft => {
    const total = rng.nextInt(5, 10);
    const first = rng.nextInt(1, total - 1);
    const pair = (a: number, b: number) => both(`${a} y ${b}`, `${a} and ${b}`);
    return {
      prompt: both(`Hay ${total} pelotitas para dos canastas. ¿Qué par sirve?`, `There are ${total} balls for two baskets. Which pair works?`),
      correct: pair(first, total - first),
      wrong: [pair(first, total - first + 1), ...(total - first > 1 ? [pair(first, total - first - 1)] : []), pair(first + 1, total - first + 1)],
      hint: both('Sumá los dos números de cada par y compará con las pelotitas.', 'Add the two numbers in each pair and compare with the balls.'),
      explanation: both(`${first} + ${total - first} = ${total}: entran todas.`, `${first} + ${total - first} = ${total}: they all fit.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Pelotitas', 'Balls', repeat(total, '🎾'))],
        after: [sceneRow('Canasta A', 'Basket A', repeat(first, '🎾')), sceneRow('Canasta B', 'Basket B', repeat(total - first, '🎾'))],
        intro: both('Otro juego de embocar con dos canastas.', 'Another toss game with two baskets.'),
        reward: both(`Canasta A: ${first}, canasta B: ${total - first}. ¡Entran todas!`, `Basket A: ${first}, basket B: ${total - first}. They all fit!`),
      },
    };
  },

  // "The ten-board has 6 counters. How many more fill it?"
  'g1-fill-ten': (rng: Rng): Draft => {
    const filled = rng.nextInt(1, 9);
    const empty = 10 - filled;
    return {
      prompt: both(`El tablero de diez tiene ${filled} fichas. ¿Cuántas faltan para llenarlo?`, `The ten-board has ${filled} counters. How many more fill it?`),
      correct: same(empty),
      wrong: [same(empty + 1), same(empty - 1), same(filled)],
      hint: both('Tocá los lugares vacíos del tablero, uno por uno.', 'Tap the empty spaces on the board, one at a time.'),
      explanation: both(`${filled} + ${empty} = 10.`, `${filled} + ${empty} = 10.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Tablero de diez', 'Ten-board', [...repeat(filled, '●'), ...repeat(empty, '□')])],
        after: [sceneRow('Tablero lleno', 'Full board', repeat(10, '●'))],
        intro: both('Otro turno en el tablero de diez.', 'Another turn on the ten-board.'),
        reward: both(`Con ${empty} fichas más el tablero está lleno.`, `With ${empty} more counters the board is full.`),
      },
    };
  },

  // "The 10-box has 9 counters and 3 arrive. How many in all?" — fill ten first.
  'g1-make-ten-add': (rng: Rng): Draft => {
    const inBox = rng.nextInt(6, 9);
    const arriving = rng.nextInt(11 - inBox, 9);
    const total = inBox + arriving;
    return {
      prompt: both(`En la caja de 10 hay ${inBox} fichas y llegan ${arriving}. ¿Cuántas fichas hay en total?`, `The 10-box has ${inBox} counters and ${arriving} arrive. How many counters are there in all?`),
      correct: same(total),
      wrong: [same(total + 1), same(total - 1), same(10 + arriving)],
      hint: both(`Al ${inBox} le faltan ${10 - inBox} para llenar la caja. Contá las que quedan afuera.`, `${inBox} needs ${10 - inBox} to fill the box. Count the ones left outside.`),
      explanation: both(`${inBox} + ${10 - inBox} = 10, y quedan ${total - 10}: ${total}.`, `${inBox} + ${10 - inBox} = 10, with ${total - 10} left: ${total}.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Caja', 'Box', [...repeat(inBox, '●'), ...repeat(10 - inBox, '□')]), sceneRow('Llegan', 'Arriving', repeat(arriving, '●'))],
        after: [sceneRow('Caja llena', 'Full box', repeat(10, '●')), sceneRow('Al lado', 'Beside it', repeat(total - 10, '●'))],
        intro: both('Otra ronda del juego de la caja de 10.', 'Another round of the 10-box game.'),
        reward: both(`10 en la caja y ${total - 10} al lado: ${total} fichas.`, `10 in the box and ${total - 10} beside it: ${total} counters.`),
      },
    };
  },

  // "The garland goes ○ □ ○ □ ○. Which piece is next?"
  'g1-garland-next': (rng: Rng): Draft => {
    const unit = rng.pick(GARLAND_UNITS);
    const extra = rng.nextInt(0, unit.length - 1);
    const shown = [...unit, ...unit, ...unit.slice(0, extra)];
    const next = unit[extra];
    return {
      prompt: both(`La guirnalda va ${shown.join(' ')}. ¿Qué pieza sigue?`, `The garland goes ${shown.join(' ')}. Which piece comes next?`),
      correct: same(next),
      wrong: SHAPES.filter((shape) => shape !== next).map(same),
      hint: both('Buscá el grupo que se repite y decilo en voz alta.', 'Find the group that repeats and say it aloud.'),
      explanation: both(`El grupo ${unit.join(' ')} se repite: sigue ${next}.`, `The group ${unit.join(' ')} repeats: ${next} comes next.`),
      scene: {
        kind: 'cards',
        rows: [sceneRow('Guirnalda', 'Garland', [...shown, '?'])],
        after: [sceneRow('Guirnalda', 'Garland', [...shown, next])],
        intro: both('Otra guirnalda para la fiesta de la ciudad.', 'Another garland for the town party.'),
        reward: both(`{name} cuelga ${next}.`, `{name} hangs ${next}.`),
      },
    };
  },

  // "The frog hops by 5s and is on 15. Which stone next?"
  'g1-skip-count': (rng: Rng): Draft => {
    const step = rng.pick([2, 5, 10]);
    const first = rng.nextInt(0, step === 2 ? 6 : 4) * step;
    const stones = Array.from({ length: 5 }, (_, index) => first + index * step);
    const last = stones[3];
    return {
      prompt: both(`La rana salta de ${step} en ${step} y está en la piedra ${last}. ¿A qué piedra salta?`, `The frog hops by ${step}s and is on stone ${last}. Which stone does it hop to?`),
      correct: same(last + step),
      // Adding one instead of the agreed hop is the mission's own slip.
      wrong: [same(last + 1), same(last + 2 * step), same(last + step + 1)],
      hint: both(`La rana está en el ${last}. Sumá ${step}.`, `The frog is on ${last}. Add ${step}.`),
      explanation: both(`${last} + ${step} = ${last + step}.`, `${last} + ${step} = ${last + step}.`),
      scene: {
        kind: 'track',
        rows: [sceneRow('Piedras', 'Stones', stones.map(String))],
        track: { start: 3, target: 4, direction: 1, unit: 'step' },
        intro: both(`Ahora la regla es +${step}.`, `Now the rule is +${step}.`),
        reward: both(`La rana salta a la piedra ${last + step}.`, `The frog hops to stone ${last + step}.`),
      },
    };
  },

  // "The dance repeats 1, 2, 3, 4. They did 1, 2, 3, 4, 1. Which step next?"
  'g1-dance-next': (rng: Rng): Draft => {
    const length = rng.nextInt(2, 4);
    const unit = Array.from({ length }, (_, index) => index + 1);
    const extra = rng.nextInt(0, length - 1);
    const shown = [...unit, ...unit.slice(0, extra)];
    const next = unit[extra];
    return {
      prompt: both(
        `El baile repite los pasos ${unit.join(', ')}. Ya bailaron ${shown.join(', ')}. ¿Qué paso viene?`,
        `The dance repeats steps ${unit.join(', ')}. They have danced ${shown.join(', ')}. Which step comes next?`
      ),
      correct: same(next),
      // "Add one" instead of repeating is the mission's own slip.
      wrong: [same(shown[shown.length - 1] + 1), same(length + 1), same((extra + 1) % length + 1)],
      hint: both('Cuando termina el grupo, volvé al primer paso.', 'When the group ends, go back to the first step.'),
      explanation: both(`El grupo ${unit.join(', ')} se repite: sigue el ${next}.`, `The group ${unit.join(', ')} repeats: ${next} comes next.`),
      scene: {
        kind: 'cards',
        rows: [sceneRow('Baile', 'Dance', [...shown.map(String), '?'])],
        after: [sceneRow('Baile', 'Dance', [...shown, next].map(String))],
        intro: both('Inventan otro baile.', 'They invent another dance.'),
        reward: both(`Todos hacen el paso ${next}.`, `Everyone does step ${next}.`),
      },
    };
  },

  // "What is between the book and the ball?" — the picture shows the order.
  'g1-between': (rng: Rng): Draft => {
    const [left, middle, right] = shuffled(rng, PICNIC).slice(0, 3);
    const name = (thing: (typeof PICNIC)[number]) => both(thing.es, thing.en);
    const capital = (thing: (typeof PICNIC)[number]) => both(thing.es[0].toUpperCase() + thing.es.slice(1), thing.en[0].toUpperCase() + thing.en.slice(1));
    return {
      prompt: both(`¿Qué hay entre ${name(left)['es-AR']} y ${name(right)['es-AR']}?`, `What is between ${name(left)['en-US']} and ${name(right)['en-US']}?`),
      correct: capital(middle),
      wrong: [capital(left), capital(right)],
      hint: both('Buscá las dos cosas de la pregunta. Mirá lo que está en el medio.', 'Find the two things in the question. Look at what is in the middle.'),
      explanation: both(`${capital(middle)['es-AR']} tiene una cosa a cada lado.`, `${capital(middle)['en-US']} has one thing on each side.`),
      scene: {
        kind: 'cards',
        rows: [sceneRow('Vista de frente →', 'Front view →', [left.emoji, middle.emoji, right.emoji])],
        intro: both('La abuela acomoda otras cosas en la mesa del picnic.', 'Grandma sets other things on the picnic table.'),
        reward: both(`{name} encuentra ${name(middle)['es-AR']}.`, `{name} finds ${name(middle)['en-US']}.`),
      },
    };
  },

  // "The sign needs a roof with 3 straight sides. Which piece?"
  'g1-shape-for': (rng: Rng): Draft => {
    const need = rng.pick(SIGN_NEEDS);
    return {
      prompt: both(`El cartel necesita ${need.es}. ¿Qué pieza sirve?`, `The sign needs ${need.en}. Which piece works?`),
      correct: need.shape,
      wrong: SIGN_NEEDS.filter((other) => other !== need).map((other) => other.shape),
      hint: both('Recorré el borde de cada pieza y contá sus lados rectos.', 'Trace the edge of each piece and count its straight sides.'),
      explanation: need.why,
      scene: {
        kind: 'groups',
        rows: [sceneRow('Piezas', 'Pieces', shuffled(rng, ['○', '△', '□', '▭']))],
        intro: both('Al cartel le falta otra pieza.', 'The sign needs another piece.'),
        reward: both('La pieza queda pegada en el cartel.', 'The piece is stuck onto the sign.'),
      },
    };
  },

  // "Which solid does the can look like?"
  'g1-solid-like': (rng: Rng): Draft => {
    const thing = rng.pick(SOLIDS);
    return {
      prompt: both(`¿A qué cuerpo se parece ${thing.es}?`, `Which solid does ${thing.en} look like?`),
      correct: thing.solid,
      // The flat shape of one face is the mission's own slip.
      wrong: [thing.flat, ...SOLIDS.filter((other) => other !== thing).map((other) => other.solid)],
      hint: both('Pensá si se puede agarrar y si rueda o se apoya.', 'Think whether you can hold it, and whether it rolls or stands.'),
      explanation: thing.why,
      scene: {
        kind: 'groups',
        rows: [sceneRow('Objeto', 'Object', [thing.emoji])],
        intro: both('Otro objeto para la ciudad del jardín.', 'Another object for the garden town.'),
        reward: both(`${thing.es[0].toUpperCase()}${thing.es.slice(1)} entra en la ciudad.`, `${thing.en[0].toUpperCase()}${thing.en.slice(1)} joins the town.`),
      },
    };
  },

  // "Which ribbon is longer?" — both start at the same mark.
  'g1-longer-ribbon': (rng: Rng): Draft => {
    const a = rng.nextInt(2, 8);
    let b = rng.nextInt(2, 8);
    if (b === a) b = a === 8 ? 7 : a + 1;
    const ribbonA = both('La cinta A', 'Ribbon A');
    const ribbonB = both('La cinta B', 'Ribbon B');
    return {
      prompt: both('Las dos cintas empiezan en la misma marca. ¿Cuál es más larga?', 'Both ribbons start at the same mark. Which is longer?'),
      correct: a > b ? ribbonA : ribbonB,
      wrong: [a > b ? ribbonB : ribbonA, both('Miden lo mismo', 'They are the same')],
      hint: both('Mirá cuál llega más lejos a la derecha.', 'See which one reaches farther to the right.'),
      explanation: both('Con los comienzos alineados, es más larga la que llega más lejos.', 'With the starts lined up, the one reaching farther is longer.'),
      scene: {
        kind: 'bars',
        rows: [sceneRow('A', 'A', repeat(a, '━')), sceneRow('B', 'B', repeat(b, '━'))],
        intro: both('Otro regalo, otras dos cintas.', 'Another gift, two more ribbons.'),
        reward: both(`{name} usa la cinta ${a > b ? 'A' : 'B'} para el regalo grande.`, `{name} uses ribbon ${a > b ? 'A' : 'B'} for the big gift.`),
      },
    };
  },

  // "The strip is covered by equal blocks, no gaps. How long is it?"
  'g1-measure-blocks': (rng: Rng): Draft => {
    const blocks = rng.nextInt(3, 9);
    const length = (count: number) => both(`${count} bloques`, `${count} blocks`);
    return {
      prompt: both('La tira del puente se cubre con bloques iguales, sin huecos. ¿Cuánto mide?', 'The bridge strip is covered by equal blocks, with no gaps. How long is it?'),
      correct: length(blocks),
      wrong: [length(blocks - 1), length(blocks + 1), length(blocks + 2)],
      hint: both('Tocá cada bloque una vez y contá de punta a punta.', 'Tap each block once and count from end to end.'),
      explanation: both(`Cada bloque es una unidad de largo: ${blocks}.`, `Each block is one unit of length: ${blocks}.`),
      scene: {
        kind: 'bars',
        rows: [sceneRow('La tira', 'The strip', repeat(blocks, '▢'))],
        intro: both('Otro arroyito necesita un puente.', 'Another stream needs a bridge.'),
        reward: both(`La tira de ${blocks} bloques es el puente.`, `The ${blocks}-block strip becomes the bridge.`),
      },
    };
  },

  // "We come back the day after Wednesday. Which day?"
  'g1-next-day': (rng: Rng): Draft => {
    const day = rng.nextInt(0, 6);
    const at = (offset: number) => WEEK[(day + offset + 7) % 7];
    const capital = (name: LocalizedText) => both(name['es-AR'][0].toUpperCase() + name['es-AR'].slice(1), name['en-US']);
    return {
      prompt: both(`Volvemos al jardín el día que sigue al ${at(0).long['es-AR']}. ¿Qué día es?`, `We come back to the garden the day after ${at(0).long['en-US']}. Which day is it?`),
      correct: capital(at(1).long),
      // The day before is the usual slip.
      wrong: [capital(at(-1).long), capital(at(2).long)],
      hint: both(`Empezá en el ${at(0).long['es-AR']}. Tocá «Día siguiente».`, `Start on ${at(0).long['en-US']}. Tap “Next day.”`),
      explanation: both(`Después del ${at(0).long['es-AR']} viene el ${at(1).long['es-AR']}.`, `After ${at(0).long['en-US']} comes ${at(1).long['en-US']}.`),
      scene: {
        kind: 'track',
        rows: [sceneRow('Semana de ejemplo', 'Example week', [at(-1).short, at(0).short, at(1).short, at(2).short])],
        track: { start: 1, target: 2, direction: 1, unit: 'day' },
        intro: both('Elegimos otro día para volver.', 'We choose another day to come back.'),
        reward: both(`{name} marca el ${at(1).long['es-AR']} en el calendario.`, `{name} marks ${at(1).long['en-US']} on the calendar.`),
      },
    };
  },

  // "Which decoration has more votes?"
  'g1-more-votes': (rng: Rng): Draft => {
    const circles = rng.nextInt(1, 8);
    let triangles = rng.nextInt(1, 8);
    if (triangles === circles) triangles = circles === 8 ? 7 : circles + 1;
    const circle = both('El círculo', 'The circle');
    const triangle = both('El triángulo', 'The triangle');
    return {
      prompt: both('Los amigos votan el adorno de la foto. ¿Qué opción tiene más votos?', 'The friends vote for the photo decoration. Which option has more votes?'),
      correct: circles > triangles ? circle : triangle,
      wrong: [circles > triangles ? triangle : circle, both('Empatan', 'It is a tie')],
      hint: both('Tocá cada voto una vez. Compará las dos filas.', 'Tap each vote once. Compare the two rows.'),
      explanation: both(`${Math.max(circles, triangles)} votos son más que ${Math.min(circles, triangles)}.`, `${Math.max(circles, triangles)} votes are more than ${Math.min(circles, triangles)}.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Círculo', 'Circle', repeat(circles, '○')), sceneRow('Triángulo', 'Triangle', repeat(triangles, '△'))],
        intro: both('Otro grupo vota para su foto.', 'Another group votes for their photo.'),
        reward: both(`${circles > triangles ? 'El círculo' : 'El triángulo'} decora la foto.`, `${circles > triangles ? 'The circle' : 'The triangle'} decorates the photo.`),
      },
    };
  },

  // "Leo had 7 stickers and gives away 2. Which calculation tells how many are left?"
  'g1-choose-operation': (rng: Rng): Draft => {
    const had = rng.nextInt(5, 9);
    const change = rng.nextInt(1, 4);
    const friend = rng.pick(FRIENDS);
    const gives = rng.nextInt(0, 1) === 0;
    const minus = same(`${had} − ${change} = ${had - change}`);
    const plus = same(`${had} + ${change} = ${had + change}`);
    return {
      prompt: gives
        ? both(`${friend} tenía ${had} figuritas y regala ${change}. ¿Qué cuenta dice cuántas le quedan?`, `${friend} had ${had} stickers and gives away ${change}. Which calculation tells how many are left?`)
        : both(`${friend} tenía ${had} figuritas y recibe ${change}. ¿Qué cuenta dice cuántas tiene ahora?`, `${friend} had ${had} stickers and receives ${change}. Which calculation tells how many there are now?`),
      correct: gives ? minus : plus,
      // Picking the other operation just because there are two numbers.
      wrong: [gives ? plus : minus, same(`${change} + ${change} = ${change * 2}`)],
      hint: gives
        ? both('Regalar saca figuritas. Separá las que se van.', 'Giving away takes stickers out. Set aside the ones that leave.')
        : both('Recibir agrega figuritas. Juntá las que llegan.', 'Receiving adds stickers. Put together the ones that arrive.'),
      explanation: gives
        ? both(`Se van ${change}: ${had} − ${change} = ${had - change}.`, `${change} leave: ${had} − ${change} = ${had - change}.`)
        : both(`Llegan ${change}: ${had} + ${change} = ${had + change}.`, `${change} arrive: ${had} + ${change} = ${had + change}.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Tenía', 'Had', repeat(had, '★')), sceneRow(gives ? 'Regala' : 'Recibe', gives ? 'Gives away' : 'Receives', repeat(change, '☆'))],
        intro: both('Otra historia para el álbum.', 'Another story for the album.'),
        reward: gives
          ? both(`A ${friend} le quedan ${had - change}.`, `${friend} has ${had - change} left.`)
          : both(`${friend} tiene ${had + change} al final.`, `${friend} has ${had + change} at the end.`),
      },
    };
  },

  // "7 and 4 more make 11. Which calculation checks it?"
  'g1-check-sum': (rng: Rng): Draft => {
    const start = rng.nextInt(3, 9);
    const added = rng.nextInt(2, 6);
    const total = start + added;
    return {
      prompt: both(`${start} figuritas y ${added} más son ${total}. ¿Qué cuenta lo comprueba?`, `${start} stickers and ${added} more make ${total}. Which calculation checks it?`),
      correct: same(`${total} − ${added} = ${start}`),
      // Adding again instead of undoing is the mission's own slip.
      wrong: [same(`${total} + ${added} = ${total + added}`), same(`${total} + ${start} = ${total + start}`), same(`${added} + ${start} = ${total}`)],
      hint: both('Sacá las que llegaron. ¿Volvés al principio?', 'Take away the ones that arrived. Are you back at the start?'),
      explanation: both(`Si sacamos las ${added} que llegaron, volvemos a ${start}.`, `Taking away the ${added} that arrived brings us back to ${start}.`),
      scene: {
        kind: 'groups',
        rows: [sceneRow('Al principio', 'At the start', repeat(start, '★')), sceneRow('Llegaron', 'Arrived', repeat(added, '☆'))],
        after: [sceneRow('Volvemos al principio', 'Back to the start', repeat(start, '★')), sceneRow('Sacamos las que llegaron', 'Took away the new ones', repeat(added, '×'))],
        intro: both('Otra cuenta del álbum para revisar.', 'Another album sum to check.'),
        reward: both(`Volvemos a ${start}: ¡la cuenta está bien!`, `We are back at ${start}: the sum is right!`),
      },
    };
  },
} satisfies Partial<Record<PracticeSkillId, (rng: Rng) => Draft>>;

const PLACE_NAMES = [
  both('los miles', 'the thousands'),
  both('las centenas', 'the hundreds'),
  both('las decenas', 'the tens'),
  both('las unidades', 'the ones'),
];

// Words for 1–9, 10–90 and 100–900, to build "eight thousand ninety".
const NUMBER_WORDS: LocalizedText[][] = [
  [both('uno', 'one'), both('dos', 'two'), both('tres', 'three'), both('cuatro', 'four'), both('cinco', 'five'), both('seis', 'six'), both('siete', 'seven'), both('ocho', 'eight'), both('nueve', 'nine')],
  [both('diez', 'ten'), both('veinte', 'twenty'), both('treinta', 'thirty'), both('cuarenta', 'forty'), both('cincuenta', 'fifty'), both('sesenta', 'sixty'), both('setenta', 'seventy'), both('ochenta', 'eighty'), both('noventa', 'ninety')],
  [both('cien', 'one hundred'), both('doscientos', 'two hundred'), both('trescientos', 'three hundred'), both('cuatrocientos', 'four hundred'), both('quinientos', 'five hundred'), both('seiscientos', 'six hundred'), both('setecientos', 'seven hundred'), both('ochocientos', 'eight hundred'), both('novecientos', 'nine hundred')],
];

function distinctDigits(rng: Rng, count: number): number[] {
  const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const picked: number[] = [];
  while (picked.length < count) {
    picked.push(pool.splice(rng.nextInt(0, pool.length - 1), 1)[0]);
  }
  return picked;
}

const MAKERS: Record<PracticeSkillId, (rng: Rng) => Draft> = {
  ...G1_MAKERS,
  ...G6_MAKERS,
  // "What is the value of 5 in 3528?"
  'place-value-digit': (rng) => {
    const digits = distinctDigits(rng, 4);
    const number = Number(digits.join(''));
    const place = rng.nextInt(0, 3);
    const digit = digits[place];
    const powers = [1000, 100, 10, 1];
    const value = digit * powers[place];
    const others = powers.filter((_, index) => index !== place).map((power) => same(digit * power));
    // Nearest places first: those are the likeliest mix-ups.
    others.sort((a, b) => Math.abs(Math.log10(Number(a['es-AR']) / value)) - Math.abs(Math.log10(Number(b['es-AR']) / value)));
    return {
      prompt: both(`¿Cuánto vale el ${digit} en ${number}?`, `What is the value of ${digit} in ${number}?`),
      correct: same(value),
      wrong: others,
      hint: both(`Buscá el ${digit} y mirá el nombre de su columna.`, `Find ${digit} and look at its column name.`),
      explanation: both(
        `Está en ${PLACE_NAMES[place]['es-AR']}: ${digit} × ${powers[place]} = ${value}.`,
        `It is in ${PLACE_NAMES[place]['en-US']}: ${digit} × ${powers[place]} = ${value}.`
      ),
    };
  },

  // "How do you write eight thousand nine?"
  'write-number': (rng) => {
    const thousands = rng.nextInt(2, 9);
    const digit = rng.nextInt(1, 9);
    const place = rng.nextInt(0, 2); // 0 = ones, 1 = tens, 2 = hundreds
    const value = (position: number) => thousands * 1000 + digit * 10 ** position;
    const words = NUMBER_WORDS[place][digit - 1];
    const thousandWords = NUMBER_WORDS[0][thousands - 1];
    return {
      prompt: both(
        `¿Cómo escribís ${thousandWords['es-AR']} mil ${words['es-AR']}?`,
        `How do you write ${thousandWords['en-US']} thousand ${words['en-US']}?`
      ),
      correct: same(value(place)),
      wrong: [0, 1, 2].filter((position) => position !== place).map((position) => same(value(position))),
      hint: both(
        'Escribí las cuatro posiciones: miles, centenas, decenas y unidades. Usá cero donde no hay grupos.',
        'Write the four places: thousands, hundreds, tens, and ones. Use zero where there are no groups.'
      ),
      explanation: both(
        `${value(place)}: ${thousands} miles y ${digit} en ${PLACE_NAMES[3 - place]['es-AR']}. Los ceros guardan los otros lugares.`,
        `${value(place)}: ${thousands} thousands and ${digit} in ${PLACE_NAMES[3 - place]['en-US']}. Zeros hold the other places.`
      ),
    };
  },

  // "Which expression also equals 4512?" — one thousand exchanged for ten hundreds
  'regroup-decomposition': (rng) => {
    const thousands = rng.nextInt(2, 9);
    const hundreds = rng.nextInt(1, 8);
    const rest = rng.nextInt(1, 99);
    const number = thousands * 1000 + hundreds * 100 + rest;
    const lower = (thousands - 1) * 1000;
    return {
      prompt: both(`¿Qué expresión también vale ${number}?`, `Which expression also equals ${number}?`),
      correct: same(`${lower} + ${hundreds * 100 + 1000} + ${rest}`),
      wrong: [same(`${lower} + ${hundreds * 100} + ${rest}`), same(`${thousands * 1000} + ${hundreds * 100 + 1000} + ${rest}`)],
      hint: both(`Sumá las partes de cada opción y compará con ${number}.`, `Add the parts of each option and compare with ${number}.`),
      explanation: both(
        `Un millar pasó a ser diez centenas: el total sigue siendo ${number}.`,
        `One thousand became ten hundreds: the total is still ${number}.`
      ),
    };
  },

  // "What is 421 + 36?" — no regrouping
  'add-no-carry': (rng) => {
    const a = rng.nextInt(1, 8) * 100 + rng.nextInt(1, 5) * 10 + rng.nextInt(1, 5);
    const b = rng.nextInt(1, 9 - (Math.floor(a / 10) % 10)) * 10 + rng.nextInt(1, 9 - (a % 10));
    const sum = a + b;
    return {
      prompt: both(`¿Cuánto es ${a} + ${b}?`, `What is ${a} + ${b}?`),
      correct: same(sum),
      wrong: [same(a + b * 10), same(sum + 10), same(sum - 10)],
      hint: both(`Escribí ${a} y ${b} en columnas. Sumá primero las unidades.`, `Write ${a} and ${b} in columns. Add the ones first.`),
      explanation: both(`${a} + ${b} = ${sum}.`, `${a} + ${b} = ${sum}.`),
    };
  },

  // "What is 185 + 237?" — ten ones make one ten
  'add-with-carry': (rng) => {
    const aOnes = rng.nextInt(3, 9);
    const bOnes = rng.nextInt(10 - aOnes, 9);
    const aTens = rng.nextInt(1, 6);
    const bTens = rng.nextInt(1, 7 - aTens);
    const aHundreds = rng.nextInt(1, 5);
    const bHundreds = rng.nextInt(1, 8 - aHundreds);
    const a = aHundreds * 100 + aTens * 10 + aOnes;
    const b = bHundreds * 100 + bTens * 10 + bOnes;
    const sum = a + b;
    return {
      prompt: both(`¿Cuánto es ${a} + ${b}?`, `What is ${a} + ${b}?`),
      correct: same(sum),
      wrong: [same(sum - 10), same(sum + 10)],
      hint: both(
        `${aOnes} + ${bOnes} son más de diez unidades. Armá una decena nueva.`,
        `${aOnes} + ${bOnes} is more than ten ones. Make a new ten.`
      ),
      explanation: both(
        `${aOnes} + ${bOnes} = ${aOnes + bOnes}: una decena pasa a la columna siguiente. ${a} + ${b} = ${sum}.`,
        `${aOnes} + ${bOnes} = ${aOnes + bOnes}: one ten moves to the next column. ${a} + ${b} = ${sum}.`
      ),
    };
  },

  // "Which estimate is reasonable for 602 + 197?"
  'estimate-sum': (rng) => {
    const aHundreds = rng.nextInt(2, 6);
    const bHundreds = rng.nextInt(1, 3);
    const a = aHundreds * 100 + rng.pick([-4, -3, -2, 2, 3, 4]);
    const b = bHundreds * 100 + rng.pick([-4, -3, -2, 2, 3, 4]);
    const estimate = (aHundreds + bHundreds) * 100;
    const near = (value: number) => both(`Alrededor de ${value}`, `About ${value}`);
    return {
      prompt: both(`¿Qué estimación conviene para ${a} + ${b}?`, `Which estimate works for ${a} + ${b}?`),
      correct: near(estimate),
      // First the mission's own trap: subtracting the hundreds instead of adding them.
      wrong: [near(Math.abs(aHundreds - bHundreds) * 100 || estimate + 200), near(estimate + 100), near(estimate - 100)],
      hint: both(`Buscá centenas cercanas a ${a} y ${b} y sumalas.`, `Find hundreds close to ${a} and ${b} and add them.`),
      explanation: both(
        `${aHundreds * 100} + ${bHundreds * 100} = ${estimate}.`,
        `${aHundreds * 100} + ${bHundreds * 100} = ${estimate}.`
      ),
    };
  },

  // "What is 52 − 28?" — exchange a ten for ten ones
  'subtract-with-exchange': (rng) => {
    const aOnes = rng.nextInt(0, 6);
    const bOnes = rng.nextInt(aOnes + 2, 9);
    const bTens = rng.nextInt(1, 6);
    const aTens = rng.nextInt(bTens + 2, 9);
    const a = aTens * 10 + aOnes;
    const b = bTens * 10 + bOnes;
    const difference = a - b;
    // The classic slip: taking the smaller digit from the larger one in each column.
    const slip = (aTens - bTens) * 10 + (bOnes - aOnes);
    return {
      prompt: both(`¿Cuánto es ${a} − ${b}?`, `What is ${a} − ${b}?`),
      correct: same(difference),
      wrong: [same(slip), same(difference + 10), same(difference - 1)],
      hint: both(
        `No alcanzan ${aOnes} unidades para quitar ${bOnes}. Cambiá una decena por diez unidades.`,
        `${aOnes} ones are not enough to take away ${bOnes}. Exchange one ten for ten ones.`
      ),
      explanation: both(
        `Con el cambio: ${aOnes + 10} − ${bOnes} = ${aOnes + 10 - bOnes} unidades y ${aTens - 1} − ${bTens} = ${aTens - 1 - bTens} decenas. ${a} − ${b} = ${difference}.`,
        `After the exchange: ${aOnes + 10} − ${bOnes} = ${aOnes + 10 - bOnes} ones and ${aTens - 1} − ${bTens} = ${aTens - 1 - bTens} tens. ${a} − ${b} = ${difference}.`
      ),
    };
  },

  // "What is 503 − 286?" — regroup through a zero
  'subtract-across-zeros': (rng) => {
    const aHundreds = rng.nextInt(4, 9);
    const aOnes = rng.nextInt(1, 5);
    const bHundreds = rng.nextInt(1, aHundreds - 2);
    const bTens = rng.nextInt(2, 8);
    const bOnes = rng.nextInt(aOnes + 1, 9);
    const a = aHundreds * 100 + aOnes;
    const b = bHundreds * 100 + bTens * 10 + bOnes;
    const difference = a - b;
    // The classic slip: taking the smaller digit from the larger one in each column.
    const slip = (aHundreds - bHundreds) * 100 + bTens * 10 + (bOnes - aOnes);
    return {
      prompt: both(`¿Cuánto es ${a} − ${b}?`, `What is ${a} − ${b}?`),
      correct: same(difference),
      wrong: [same(slip), same(difference + 100), same(difference + 10)],
      hint: both(
        'No hay decenas sueltas. Cambiá una centena por diez decenas y una decena por diez unidades.',
        'There are no loose tens. Exchange one hundred for ten tens and one ten for ten ones.'
      ),
      explanation: both(
        `${a} − ${b} = ${difference}. Comprobá: ${difference} + ${b} = ${a}.`,
        `${a} − ${b} = ${difference}. Check: ${difference} + ${b} = ${a}.`
      ),
    };
  },

  // "Which addition checks 900 − 275 = 625?"
  'check-subtraction': (rng) => {
    const a = rng.nextInt(4, 9) * 100;
    const drawn = Math.min(rng.nextInt(1, 4) * 100 + rng.nextInt(3, 19) * 5, a - 105);
    // Equal parts would make two of the options read the same.
    const b = drawn * 2 === a ? drawn + 5 : drawn;
    const difference = a - b;
    return {
      prompt: both(`¿Qué suma comprueba ${a} − ${b} = ${difference}?`, `Which addition checks ${a} − ${b} = ${difference}?`),
      correct: same(`${difference} + ${b} = ${a}`),
      wrong: [same(`${a} + ${b} = ${a + b}`), same(`${a} + ${difference} = ${a + difference}`)],
      hint: both(
        'La suma tiene que volver al número del principio.',
        'The addition has to get back to the starting number.'
      ),
      explanation: both(
        `${difference} + ${b} = ${a}: volvemos al total inicial.`,
        `${difference} + ${b} = ${a}: we are back at the starting total.`
      ),
    };
  },
};

export function isPracticeSkill(value: unknown): value is PracticeSkillId {
  return typeof value === 'string' && value in MAKERS;
}

/**
 * A mission question shows two answers. From the three generated options this
 * keeps the right one and the most instructive wrong one, in their original
 * order, and returns their indices in `exercise.options`.
 */
export function missionOptionIndices(exercise: PracticeExercise): [number, number] {
  const wrong = exercise.options.findIndex((_, index) => index !== exercise.answerIndex);
  return exercise.answerIndex < wrong ? [exercise.answerIndex, wrong] : [wrong, exercise.answerIndex];
}

export function generatePractice(skill: PracticeSkillId, seed: number): PracticeExercise {
  const normalizedSeed = Math.abs(Math.trunc(seed)) || 101;
  const rng = createSeededRng(normalizedSeed);
  return build(skill, normalizedSeed, rng, MAKERS[skill](rng));
}
