// Grade 6 "new numbers": every generated race challenge is recomputed here from
// its own prompt text, independently of the generator, and the server resolver
// accepts exactly the marked answer.
import assert from 'node:assert/strict';
import { generatePractice, MISSION_PRACTICE, MISSION_PRACTICE_CHECK, PRACTICE_TOPIC } from '../math/practice/generators';
import { G6_MAKERS, G6_MISSION_PRACTICE, type GradeSixSkillId } from '../math/practice/gradeSix';
import { resolveMissionAttempt } from '../lib/server/missionAttempts';
import { GRADE_SIX_LESSONS } from '../content/grade6';

const SEEDS = 500;
const nums = (text: string) => (text.match(/\d+(?:[.,]\d+)*/g) ?? []).map(n => n);
const esNum = (value: number) => {
  const rounded = Math.round(value * 1000) / 1000;
  const [whole, dec] = String(rounded).split('.');
  return (whole.length >= 4 ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : whole) + (dec ? `,${dec}` : '');
};
const int = (s: string) => Number(s.replace(/\./g, ''));
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Expected Spanish answer, from the prompt alone. */
const EXPECTED: Partial<Record<GradeSixSkillId, (p: string) => string>> = {
  'g6-chip-value': (p) => {
    const [, total, digit] = p.match(/tiene ([\d.]+) créditos.*vale el (\d)\?/)!;
    const digits = total.replace(/\./g, '');
    return `${esNum(Number(digit) * 10 ** (digits.length - 1 - digits.indexOf(digit)))} créditos`;
  },
  'g6-roman-box': (p) => {
    const roman = p.match(/box ([XVI]+)/)![1];
    const v: Record<string, number> = { I: 1, V: 5, X: 10 };
    return String([...roman].reduce((sum, ch, i) => sum + (v[ch] < (v[roman[i + 1]] ?? 0) ? -v[ch] : v[ch]), 0));
  },
  'g6-crews': (p) => {
    const [total, size] = nums(p).map(Number);
    const r = total % size;
    return r === 0 ? `Sí: ${total / size} equipos` : r === 1 ? 'No: sobra 1 persona' : `No: sobran ${r} personas`;
  },
  'g6-digit-sum-three': (p) => {
    const bolts = nums(p)[0];
    const sum = [...bolts].reduce((a, d) => a + Number(d), 0);
    return Number(bolts) % 3 === 0 ? `Sí: ${sum} es múltiplo de 3` : `No: ${sum} no es múltiplo de 3`;
  },
  'g6-kits-gcd': (p) => { const [a, b] = nums(p).map(Number); return String(gcd(a, b)); },
  'g6-coincide-lcm': (p) => { const [a, b] = nums(p).map(Number); return `Vuelta ${(a * b) / gcd(a, b)}`; },
  'g6-share-packs': (p) => { const [a, b] = nums(p); return `${a}/${b} de paquete`; },
  'g6-share-coolant': (p) => { const [a, b] = nums(p); return `${a}/${b} L`; },
  'g6-exact-decimal': (p) => { const [a, b] = nums(p).map(Number); return esNum(a / b); },
  'g6-fraction-of': (p) => { const [total, take, parts] = nums(p).map(Number); return `${(total / parts) * take} km`; },
  'g6-decimal-product': (p) => { const [used, share] = nums(p).map(s => Number(s.replace(',', '.'))); return `${esNum(Math.round(used * share * 100) / 100)} kWh`; },
  'g6-unit-cost': (p) => { const [price, fins] = nums(p).map(Number); return `${price * fins} créditos`; },
  'g6-unit-value': (p) => { const [known, cost, wanted] = nums(p).map(Number); return `${(cost / known) * wanted} créditos`; },
  'g6-energy-km': (p) => { const [rate, km] = nums(p).map(s => Number(s.replace(',', '.'))); return esNum(rate * km); },
  'g6-workers': (p) => { const [hours, people] = nums(p).map(Number); return `${hours / people} horas`; },
  'g6-energy-laps': (p) => { const [laps, per, longer] = nums(p).map(Number); return `${(laps * per) / longer} unidades`; },
  'g6-percent-decimal': (p) => esNum(Number(nums(p)[0]) / 100),
  'g6-percent-speed': (p) => { const [speed, percent] = nums(p).map(Number); return `${(speed * percent) / 100} km/h`; },
  'g6-discount': (p) => { const [price, percent] = nums(p).map(Number); return `${price - (price * percent) / 100} créditos`; },
  'g6-composite-area': (p) => { const [w, h, c] = nums(p).map(Number); return `${w * h - c * c} m²`; },
  'g6-square-area': (p) => { const side = Number(nums(p)[1]); return `${side * side} m²`; },
  'g6-scale-unit': (p) => `${nums(p)[1]} cm reales`,
  'g6-map-distance': (p) => { const cm = Number(nums(p)[2]); return `${esNum(cm * 100)} m`; },
  'g6-plan-width': (p) => { const m = Number(nums(p)[2]); return `${(m * 100) / 200} cm`; },
  'g6-blocks': (p) => { const [each, laps] = nums(p).map(Number); return String(laps / each); },
  'g6-mean-three': (p) => { const v = nums(p).slice(0, 3).map(Number); return String((v[0] + v[1] + v[2]) / 3); },
  'g6-mean-zero': (p) => { const v = nums(p).slice(0, 4).map(Number); return `${v.reduce((a, b) => a + b, 0) / 4} décimas`; },
  'g6-mean-mode': (p) => { const v = nums(p).slice(0, 4).map(Number); return `Media ${v.reduce((a, b) => a + b, 0) / 4} s; moda ${v[0]} s`; },
  'g6-percent-of-battery': (p) => { const [total, percent] = nums(p).map(Number); return String((total * percent) / 100); },
  'g6-area-left': (p) => { const [, , area, percent] = nums(p).map(Number); return `${area - (area * percent) / 100} m²`; },
  'g6-mean-check': (p) => { const v = nums(p).slice(0, 4).map(Number); const m = v.reduce((a, b) => a + b, 0) / 4; return `${m} × 4 = ${m * 4}, el total`; },
};

export function runGradeSixPracticeTests() {
  // Every computational first challenge of the course has new numbers; the others are conceptual.
  for (const lesson of GRADE_SIX_LESSONS) {
    const skill = MISSION_PRACTICE[lesson.id];
    assert.equal(skill, G6_MISSION_PRACTICE[lesson.id]);
    if (!skill) assert(['G06-09-L01', 'G06-11-L01', 'G06-11-L03'].includes(lesson.id), `${lesson.id} needs new numbers`);
  }
  assert.equal(MISSION_PRACTICE_CHECK, 0);
  for (const skill of Object.keys(G6_MAKERS) as GradeSixSkillId[]) {
    assert.equal(PRACTICE_TOPIC[skill], 'percentages-proportions');
    for (let seed = 1; seed <= SEEDS; seed++) {
      const exercise = generatePractice(skill, seed);
      const marked = exercise.options[exercise.answerIndex]['es-AR'];
      const expected = EXPECTED[skill]?.(exercise.prompt['es-AR']);
      if (expected !== undefined) assert.equal(marked, expected, `${skill} seed ${seed}: "${exercise.prompt['es-AR']}"`);
      // The server re-creates the exercise and accepts only the marked option.
      for (let option = 0; option < 3; option++) {
        const resolved = resolveMissionAttempt({ source: 'practice', skill, seed, userAnswer: String(option) }, 'u-test');
        assert(resolved && resolved.isCorrect === (option === exercise.answerIndex) && resolved.topicId === 'percentages-proportions');
      }
    }
  }
  const covered = Object.keys(EXPECTED).length;
  console.log(`PASS [Grade 6 new numbers] ${Object.keys(G6_MAKERS).length} race generators × ${SEEDS} seeds, ${covered} answers recomputed from the prompt, server accepts only the marked option`);
}
