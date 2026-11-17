// Grade 6 "new numbers" (Math Racing, docs/grade-6-racing-scenario.md): each
// generator re-creates the first challenge of one race mission with fresh
// numbers, in the same race situation and with the same typical error as the
// first wrong option. Plugged into generators.ts (MAKERS, MISSION_PRACTICE).
// Conceptual first challenges (G06-09-L01, G06-11-L01, G06-11-L03) have none.

import type { LocalizedText } from '../core/types';

interface Rng { nextInt(min: number, max: number): number; pick<T>(items: readonly T[]): T }
interface Draft { prompt: LocalizedText; correct: LocalizedText; wrong: LocalizedText[]; hint: LocalizedText; explanation: LocalizedText }

const both = (es: string, en: string): LocalizedText => ({ 'es-AR': es, 'en-US': en });

/** es-AR: 10.000 and 3,5 · en-US: 10,000 and 3.5 (grouping from four digits). */
function fmt(value: number, es: boolean): string {
  const rounded = Math.round(value * 1000) / 1000;
  const [whole, decimals] = String(rounded).split('.');
  const grouped = whole.length >= 4 ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, es ? '.' : ',') : whole;
  return decimals ? `${grouped}${es ? ',' : '.'}${decimals}` : grouped;
}
const N = (value: number) => ({ es: fmt(value, true), en: fmt(value, false) });
const withUnit = (value: number, es: string, en: string) => both(`${fmt(value, true)} ${es}`, `${fmt(value, false)} ${en}`);
const plain = (value: string | number) => both(String(value), String(value));
const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const power = (n: number) => `10${String(n).split('').map(d => SUPER[Number(d)]).join('')}`;
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const PLACES = [both('decenas de mil', 'ten thousands'), both('unidades de mil', 'thousands'), both('centenas', 'hundreds'), both('decenas', 'tens'), both('unidades', 'ones')];
const ROMAN_ONES = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
const ROMAN_ONES_PARTS = ['', '1', '1 + 1', '1 + 1 + 1', '(5 − 1)', '5', '5 + 1', '5 + 1 + 1', '5 + 1 + 1 + 1', '(10 − 1)'];
const ODD_COMPOSITES = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 77, 81, 85, 87, 91];

export type GradeSixSkillId =
  | 'g6-chip-value' | 'g6-roman-box' | 'g6-power-ten'
  | 'g6-crews' | 'g6-stint' | 'g6-digit-sum-three'
  | 'g6-odd-composite' | 'g6-kits-gcd' | 'g6-coincide-lcm'
  | 'g6-share-packs' | 'g6-share-coolant' | 'g6-exact-decimal'
  | 'g6-fraction-of' | 'g6-half-fraction' | 'g6-decimal-product'
  | 'g6-unit-cost' | 'g6-unit-value' | 'g6-energy-km'
  | 'g6-workers' | 'g6-energy-laps' | 'g6-product-pairs'
  | 'g6-percent-decimal' | 'g6-percent-speed' | 'g6-discount'
  | 'g6-composite-area' | 'g6-square-area'
  | 'g6-scale-unit' | 'g6-map-distance' | 'g6-plan-width'
  | 'g6-blocks'
  | 'g6-mean-three' | 'g6-mean-zero' | 'g6-mean-mode'
  | 'g6-percent-of-battery' | 'g6-area-left' | 'g6-mean-check';

export const G6_MISSION_PRACTICE: Record<string, GradeSixSkillId> = {
  'G06-01-L01': 'g6-chip-value', 'G06-01-L02': 'g6-roman-box', 'G06-01-L03': 'g6-power-ten',
  'G06-02-L01': 'g6-crews', 'G06-02-L02': 'g6-stint', 'G06-02-L03': 'g6-digit-sum-three',
  'G06-03-L01': 'g6-odd-composite', 'G06-03-L02': 'g6-kits-gcd', 'G06-03-L03': 'g6-coincide-lcm',
  'G06-04-L01': 'g6-share-packs', 'G06-04-L02': 'g6-share-coolant', 'G06-04-L03': 'g6-exact-decimal',
  'G06-05-L01': 'g6-fraction-of', 'G06-05-L02': 'g6-half-fraction', 'G06-05-L03': 'g6-decimal-product',
  'G06-06-L01': 'g6-unit-cost', 'G06-06-L02': 'g6-unit-value', 'G06-06-L03': 'g6-energy-km',
  'G06-07-L01': 'g6-workers', 'G06-07-L02': 'g6-energy-laps', 'G06-07-L03': 'g6-product-pairs',
  'G06-08-L01': 'g6-percent-decimal', 'G06-08-L02': 'g6-percent-speed', 'G06-08-L03': 'g6-discount',
  'G06-09-L02': 'g6-composite-area', 'G06-09-L03': 'g6-square-area',
  'G06-10-L01': 'g6-scale-unit', 'G06-10-L02': 'g6-map-distance', 'G06-10-L03': 'g6-plan-width',
  'G06-11-L02': 'g6-blocks',
  'G06-12-L01': 'g6-mean-three', 'G06-12-L02': 'g6-mean-zero', 'G06-12-L03': 'g6-mean-mode',
  'G06-13-L01': 'g6-percent-of-battery', 'G06-13-L02': 'g6-area-left', 'G06-13-L03': 'g6-mean-check',
};

export const G6_MAKERS: Record<GradeSixSkillId, (rng: Rng) => Draft> = {
  'g6-chip-value': (rng) => {
    const digit = rng.nextInt(1, 9);
    const place = rng.nextInt(0, 4);
    const digits = Array.from({ length: 5 }, (_, i) => {
      if (i === place) return digit;
      let d = rng.nextInt(i === 0 ? 1 : 0, 9);
      while (d === digit) d = (d + 1) % 10 || (i === 0 ? 1 : 0);
      return d;
    });
    const total = Number(digits.join(''));
    const value = digit * 10 ** (4 - place);
    const neighbours = [place + 1, place - 1, place + 2, place - 2].filter(p => p >= 0 && p <= 4).map(p => withUnit(digit * 10 ** (4 - p), 'créditos', 'credits'));
    const t = N(total);
    return {
      prompt: both(`El equipo tiene ${t.es} créditos en fichas de 10.000, 1.000, 100, 10 y 1. ¿Cuánto vale el ${digit}?`, `The team has ${t.en} credits in chips of 10,000, 1,000, 100, 10, and 1. What is the ${digit} worth?`),
      correct: withUnit(value, 'créditos', 'credits'),
      wrong: neighbours,
      hint: both(`Buscá el ${digit} en ${t.es} y leé el nombre de su columna.`, `Find the ${digit} in ${t.en} and read its column name.`),
      explanation: both(`El ${digit} está en las ${PLACES[place]['es-AR']}: vale ${N(value).es} créditos.`, `The ${digit} is in the ${PLACES[place]['en-US']} place: it is worth ${N(value).en} credits.`),
    };
  },

  'g6-roman-box': (rng) => {
    const value = rng.nextInt(11, 39);
    const tens = Math.floor(value / 10), ones = value % 10;
    const roman = 'X'.repeat(tens) + ROMAN_ONES[ones];
    const additive = 10 * tens + (ones === 4 ? 6 : ones === 9 ? 11 : ones);
    const parts = [...Array(tens).fill('10'), ROMAN_ONES_PARTS[ones]].filter(Boolean).join(' + ');
    return {
      prompt: both(`Al equipo le toca el box ${roman} del paddock histórico. ¿Qué número es?`, `The team gets pit box ${roman} in the historic paddock. Which number is it?`),
      correct: plain(value),
      wrong: [plain(additive), plain(value + 10), plain(value - 10), plain(value + 1)],
      hint: both('Sumá cada X, V e I. Si I está antes de V o de X, se resta.', 'Add each X, V, and I. If I comes before V or X, it is subtracted.'),
      explanation: both(`${roman} = ${parts} = ${value}.`, `${roman} = ${parts} = ${value}.`),
    };
  },

  'g6-power-ten': (rng) => {
    const n = rng.nextInt(2, 6);
    const value = 10 ** n;
    return {
      prompt: both(`La radio de Chispa envía ${power(n)} datos por vuelta. ¿Cuántos datos son?`, `Chispa’s radio sends ${power(n)} data points per lap. How many data points is that?`),
      correct: both(N(value).es, N(value).en),
      wrong: [plain(10 * n), both(N(value / 10).es, N(value / 10).en), both(N(value * 10).es, N(value * 10).en)],
      hint: both(`Escribí ${n} factores iguales a diez y multiplicalos.`, `Write ${n} factors of ten and multiply them.`),
      explanation: both(`${power(n)} = ${Array(n).fill('10').join(' × ')}: son ${n} factores diez.`, `${power(n)} = ${Array(n).fill('10').join(' × ')}: ${n} factors of ten.`),
    };
  },

  'g6-crews': (rng) => {
    const size = rng.nextInt(4, 9), crews = rng.nextInt(3, 8);
    const exact = rng.nextInt(0, 1) === 1;
    const left = exact ? 0 : rng.nextInt(1, size - 1);
    const total = size * crews + left;
    const yes = (n: number) => both(`Sí: ${n} equipos`, `Yes: ${n} crews`);
    const no = (r: number) => r === 1 ? both('No: sobra 1 persona', 'No: 1 person is left over') : both(`No: sobran ${r} personas`, `No: ${r} people are left over`);
    return {
      prompt: both(`${total} voluntarios quieren formar equipos de boxes de ${size} personas, sin que nadie quede afuera. ¿Se puede?`, `${total} volunteers want to form pit crews of ${size} people, with nobody left out. Is it possible?`),
      correct: exact ? yes(crews) : no(left),
      wrong: exact ? [no(1), yes(crews + 1)] : [yes(crews), yes(crews + 1)],
      hint: both(`Formá equipos de ${size} hasta no pasar ${total} y mirá si queda alguien.`, `Form crews of ${size} without passing ${total} and see if anyone remains.`),
      explanation: exact
        ? both(`${size} × ${crews} = ${total}: no sobra nadie.`, `${size} × ${crews} = ${total}: nobody is left over.`)
        : both(`${total} = ${size} × ${crews} + ${left}: ${size} no divide a ${total}.`, `${total} = ${size} × ${crews} + ${left}: ${size} does not divide ${total}.`),
    };
  },

  'g6-stint': (rng) => {
    const laps = rng.pick([12, 18, 20, 24, 28, 30, 36, 40]);
    const divisors = Array.from({ length: laps - 3 }, (_, i) => i + 2).filter(d => laps % d === 0 && d < laps);
    const others = Array.from({ length: laps - 3 }, (_, i) => i + 2).filter(d => laps % d !== 0);
    const length = rng.pick(divisors);
    // Nearest non-divisors first: they look like plausible stints.
    others.sort((a, b) => Math.abs(a - length) - Math.abs(b - length));
    const stint = (d: number) => both(`${d} vueltas`, `${d} laps`);
    return {
      prompt: both(`La carrera tiene ${laps} vueltas. Marga quiere tandas con la misma cantidad de vueltas, sin tandas incompletas. ¿Qué largo de tanda sirve?`, `The race has ${laps} laps. Marga wants stints with the same number of laps, with no incomplete stint. Which stint length works?`),
      correct: stint(length),
      wrong: others.slice(0, 3).map(stint),
      hint: both(`Probá dividir las ${laps} vueltas en tandas de cada largo propuesto.`, `Try splitting the ${laps} laps into stints of each proposed length.`),
      explanation: both(`${length} × ${laps / length} = ${laps}: ${length} es divisor de ${laps}.`, `${length} × ${laps / length} = ${laps}: ${length} is a divisor of ${laps}.`),
    };
  },

  'g6-digit-sum-three': (rng) => {
    const bolts = rng.nextInt(102, 998);
    const digits = String(bolts).split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);
    const last = digits[2];
    const divisible = sum % 3 === 0;
    const isMultiple = both(`Sí: ${sum} es múltiplo de 3`, `Yes: ${sum} is a multiple of 3`);
    const notMultiple = both(`No: ${sum} no es múltiplo de 3`, `No: ${sum} is not a multiple of 3`);
    return {
      prompt: both(`Llegan ${bolts} tornillos para los calentadores, que se colocan en grupos de 3. Sin calculadora: ¿se pueden usar todos?`, `${bolts} bolts arrive for the tire warmers, which are fitted in groups of 3. Without a calculator: can they all be used?`),
      correct: divisible ? isMultiple : notMultiple,
      wrong: divisible
        ? [both(`No: termina en ${last}`, `No: it ends in ${last}`), notMultiple]
        : [both(`Sí: termina en ${last}`, `Yes: it ends in ${last}`), isMultiple],
      hint: both(`Sumá las cifras de ${bolts} y fijate si el total es múltiplo de tres.`, `Add the digits of ${bolts} and check whether the total is a multiple of three.`),
      explanation: both(`${digits.join(' + ')} = ${sum}. ${divisible ? 'Es' : 'No es'} múltiplo de tres, así que ${bolts} ${divisible ? 'es' : 'no es'} divisible por tres.`, `${digits.join(' + ')} = ${sum}. It is ${divisible ? '' : 'not '}a multiple of three, so ${bolts} is ${divisible ? '' : 'not '}divisible by three.`),
    };
  },

  'g6-odd-composite': (rng) => {
    const number = rng.pick(ODD_COMPOSITES);
    const factor = [3, 5, 7].find(p => number % p === 0)!;
    return {
      prompt: both(`En el auto de un novato solo se permiten números primos. Alguien propone el ${number}. ¿Es ${number} primo?`, `Only prime numbers are allowed on a rookie car. Someone suggests ${number}. Is ${number} prime?`),
      correct: both(`No: ${factor} × ${number / factor} = ${number}`, `No: ${factor} × ${number / factor} = ${number}`),
      wrong: [both('Sí: es impar', 'Yes: it is odd'), both(`Sí: solo se divide por 1 y por ${number}`, `Yes: it divides only by 1 and ${number}`)],
      hint: both(`Buscá una multiplicación que dé ${number} sin usar el uno.`, `Find a multiplication making ${number} without using one.`),
      explanation: both(`${number} tiene el divisor ${factor}, además de 1 y ${number}: es compuesto.`, `${number} has the divisor ${factor}, besides 1 and ${number}: it is composite.`),
    };
  },

  'g6-kits-gcd': (rng) => {
    const [a, b] = rng.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [3, 7], [2, 7], [4, 7]] as const);
    const kits = rng.nextInt(2, 8);
    const bottles = kits * a, bars = kits * b;
    return {
      prompt: both(`Hay ${bottles} botellas de agua y ${bars} barras de cereal para kits idénticos del equipo, usando todo. ¿Cuál es la mayor cantidad de kits?`, `There are ${bottles} water bottles and ${bars} cereal bars for identical team kits, using everything. What is the greatest number of kits?`),
      correct: plain(kits),
      wrong: [plain(kits * a * b), plain(bottles)],
      hint: both(`Listá los divisores de ${bottles} y de ${bars} y marcá los que se repiten.`, `List the divisors of ${bottles} and ${bars} and mark those in both lists.`),
      explanation: both(`${kits} divide a ${bottles} y a ${bars}, y ningún divisor común es mayor: cada kit lleva ${a} botellas y ${b} barras.`, `${kits} divides ${bottles} and ${bars}, and no common divisor is greater: each kit has ${a} bottles and ${b} bars.`),
    };
  },

  'g6-coincide-lcm': (rng) => {
    const [a, b] = rng.pick([[4, 6], [6, 8], [6, 9], [4, 10], [6, 10], [8, 12], [9, 12], [10, 15], [6, 15], [4, 14]] as const);
    const lcm = (a * b) / gcd(a, b);
    const lap = (n: number) => both(`Vuelta ${n}`, `Lap ${n}`);
    return {
      prompt: both(`La batería se carga cada ${a} vueltas y el sensor de rebufo cada ${b}. Los dos estaban listos en la largada. ¿En qué vuelta vuelven a estar listos juntos?`, `The battery charges every ${a} laps and the slipstream sensor every ${b}. Both were ready at the start. On which lap are both ready together again?`),
      correct: lap(lcm),
      wrong: [lap(a * b), lap(a + b), lap(lcm + a)],
      hint: both(`Escribí las vueltas de ${a} en ${a} y de ${b} en ${b}. Buscá la primera que comparten.`, `Write the laps by ${a}s and by ${b}s. Find the first one they share.`),
      explanation: both(`${lcm} es el primer número de las dos listas. ${a * b} = ${a} × ${b} también es común, pero llega después.`, `${lcm} is the first number on both lists. ${a * b} = ${a} × ${b} is also common, but it comes later.`),
    };
  },

  'g6-share-packs': (rng) => {
    const sections = rng.nextInt(3, 9);
    const packs = rng.nextInt(2, sections - 1);
    const pack = (f: string) => both(`${f} de paquete`, `${f} of a pack`);
    return {
      prompt: both(`${packs} paquetes de batería llenos se reparten por igual entre ${sections} tramos de montaña. ¿Cuánta energía recibe cada tramo?`, `${packs} full battery packs are shared equally among ${sections} mountain sections. How much energy does each section get?`),
      correct: pack(`${packs}/${sections}`),
      wrong: [pack(`${sections}/${packs}`), pack(`1/${sections}`)],
      hint: both(`Dividí cada paquete en ${sections} partes iguales. Dale una parte de cada paquete a cada tramo.`, `Split each pack into ${sections} equal parts. Give each section one part of each pack.`),
      explanation: both(`${packs} ÷ ${sections} = ${packs}/${sections}: cada tramo recibe ${packs} partes de 1/${sections}.`, `${packs} ÷ ${sections} = ${packs}/${sections}: each section gets ${packs} parts of 1/${sections}.`),
    };
  },

  'g6-share-coolant': (rng) => {
    const radiators = rng.nextInt(2, 5);
    let liters = rng.nextInt(radiators + 1, 11);
    if (liters % radiators === 0) liters += 1;
    return {
      prompt: both(`Se reparten ${liters} L de refrigerante por igual entre ${radiators} radiadores. ¿Cuánto recibe cada radiador?`, `${liters} L of coolant are shared equally among ${radiators} radiators. How much does each radiator get?`),
      correct: plain(`${liters}/${radiators} L`),
      wrong: [plain(`${radiators}/${liters} L`), plain(`${Math.floor(liters / radiators)} L`)],
      hint: both('Escribí primero los litros totales y dividilos por la cantidad de radiadores.', 'Write the total liters first and divide by the number of radiators.'),
      explanation: both(`${liters} ÷ ${radiators} = ${liters}/${radiators} L. Comprobación: ${radiators} × ${liters}/${radiators} = ${liters} L.`, `${liters} ÷ ${radiators} = ${liters}/${radiators} L. Check: ${radiators} × ${liters}/${radiators} = ${liters} L.`),
    };
  },

  'g6-exact-decimal': (rng) => {
    const denominator = rng.pick([4, 5, 8, 20, 25]);
    const numerator = rng.nextInt(1, denominator - 1);
    const value = numerator / denominator;
    return {
      prompt: both(`La batería está a ${numerator}/${denominator} de su carga. ¿Qué decimal exacto debe mostrar el tablero?`, `The battery is at ${numerator}/${denominator} of its charge. Which exact decimal should the dashboard show?`),
      correct: both(fmt(value, true), fmt(value, false)),
      wrong: [both(`0,${numerator}${denominator}`, `0.${numerator}${denominator}`), both(fmt(value * 10, true), fmt(value * 10, false))],
      hint: both(`Dividí ${numerator} por ${denominator}: pasá los enteros a décimos, centésimos o milésimos.`, `Divide ${numerator} by ${denominator}: change the wholes to tenths, hundredths, or thousandths.`),
      explanation: both(`${numerator} ÷ ${denominator} = ${fmt(value, true)}. Comprobación: ${fmt(value, true)} × ${denominator} = ${numerator}.`, `${numerator} ÷ ${denominator} = ${fmt(value, false)}. Check: ${fmt(value, false)} × ${denominator} = ${numerator}.`),
    };
  },

  'g6-fraction-of': (rng) => {
    const parts = rng.nextInt(3, 8), take = rng.nextInt(2, parts - 1), unit = rng.nextInt(3, 9);
    const total = parts * unit;
    return {
      prompt: both(`La etapa de montaña mide ${total} km y ${take}/${parts} de ella es la subida empinada. ¿Cuántos km mide la subida?`, `The mountain stage is ${total} km long and ${take}/${parts} of it is the steep climb. How long is the climb?`),
      correct: plain(`${take * unit} km`),
      wrong: [plain(`${unit} km`), plain(`${total - take * unit} km`), plain(`${total} km`)],
      hint: both(`Dividí los ${total} km en ${parts} partes iguales y tomá ${take}.`, `Split the ${total} km into ${parts} equal parts and take ${take}.`),
      explanation: both(`${total} ÷ ${parts} = ${unit} km es una parte; ${take} partes son ${take * unit} km.`, `${total} ÷ ${parts} = ${unit} km is one part; ${take} parts are ${take * unit} km.`),
    };
  },

  'g6-half-fraction': (rng) => {
    const denominator = rng.nextInt(3, 9);
    const numerator = 2 * rng.nextInt(1, Math.floor((denominator - 1) / 2));
    return {
      prompt: both(`El tanque tiene ${numerator}/${denominator} L de líquido de turbo y el reglamento permite usar la mitad. ¿Cuánto es la mitad de ${numerator}/${denominator} L?`, `The tank holds ${numerator}/${denominator} L of turbo fluid and the rules allow using half of it. What is half of ${numerator}/${denominator} L?`),
      correct: plain(`${numerator / 2}/${denominator} L`),
      wrong: [plain(`${numerator * 2}/${denominator} L`), plain(`${numerator}/${denominator} L`)],
      hint: both(`Pensá en ${numerator} partes de 1/${denominator} L y tomá la mitad de esas partes.`, `Think of ${numerator} parts of 1/${denominator} L and take half of those parts.`),
      explanation: both(`La mitad de ${numerator} partes de 1/${denominator} son ${numerator / 2} partes: ${numerator / 2}/${denominator} L.`, `Half of ${numerator} parts of 1/${denominator} is ${numerator / 2} parts: ${numerator / 2}/${denominator} L.`),
    };
  },

  'g6-decimal-product': (rng) => {
    const share = rng.nextInt(2, 9), used = rng.nextInt(2, 9);
    const value = (share * used) / 100;
    const kwh = (v: number) => both(`${fmt(v, true)} kWh`, `${fmt(v, false)} kWh`);
    return {
      prompt: both(`Cada frenada usa 0,${used} kWh y los frenos recuperan 0,${share} de esa energía. ¿Cuánto recuperan por frenada?`, `Each braking uses 0.${used} kWh and the brakes recover 0.${share} of that energy. How much do they recover per braking?`),
      correct: kwh(value),
      wrong: [kwh(value * 10), kwh(value * 100)],
      hint: both(`${used} décimos por ${share} décimos dan centésimos. Estimá: el resultado es menor que 0,${used}.`, `${used} tenths times ${share} tenths gives hundredths. Estimate: the result is less than 0.${used}.`),
      explanation: both(`0,${share} × 0,${used} = ${share * used}/100 = ${fmt(value, true)} kWh.`, `0.${share} × 0.${used} = ${share * used}/100 = ${fmt(value, false)} kWh.`),
    };
  },

  'g6-unit-cost': (rng) => {
    const price = rng.nextInt(3, 9), fins = rng.nextInt(4, 9);
    const credits = (n: number) => both(`${n} créditos`, `${n} credits`);
    return {
      prompt: both(`Cada aleta del alerón cuesta ${price} créditos, sin cargos extra. Chispa necesita ${fins} aletas. ¿Cuánto cuestan?`, `Each wing fin costs ${price} credits, with no extra charges. Chispa needs ${fins} fins. How much do they cost?`),
      correct: credits(price * fins),
      wrong: [credits(price + fins), credits(price * fins + price)],
      hint: both(`Repetí el precio de una aleta ${fins} veces.`, `Repeat the price of one fin ${fins} times.`),
      explanation: both(`Costo = cantidad × precio unitario: ${fins} × ${price} = ${price * fins}.`, `Cost = quantity × unit price: ${fins} × ${price} = ${price * fins}.`),
    };
  },

  'g6-unit-value': (rng) => {
    const unit = rng.nextInt(3, 9), known = rng.nextInt(2, 4), wanted = known + rng.nextInt(1, 4);
    const credits = (n: number) => both(`${n} créditos`, `${n} credits`);
    return {
      prompt: both(`${known} juegos de pastillas de freno cuestan ${known * unit} créditos, a precio constante. El equipo necesita ${wanted} juegos. ¿Cuánto cuestan?`, `${known} sets of brake pads cost ${known * unit} credits at a constant price. The team needs ${wanted} sets. How much do they cost?`),
      correct: credits(wanted * unit),
      wrong: [credits(known * unit + (wanted - known)), credits(wanted * unit + unit)],
      hint: both(`Buscá primero el precio de un juego dividiendo ${known * unit} entre ${known}.`, `First find the price of one set by dividing ${known * unit} by ${known}.`),
      explanation: both(`Cada juego cuesta ${known * unit} ÷ ${known} = ${unit}; ${wanted} juegos cuestan ${wanted * unit}.`, `Each set costs ${known * unit} ÷ ${known} = ${unit}; ${wanted} sets cost ${wanted * unit}.`),
    };
  },

  'g6-energy-km': (rng) => {
    const rate = rng.nextInt(2, 5), km = rng.nextInt(1, 4) + 0.5;
    const value = rate * km;
    const n = (v: number) => both(fmt(v, true), fmt(v, false));
    return {
      prompt: both(`Chispa gasta ${rate} unidades de energía por km, sin gasto fijo. ¿Cuánta energía gasta en un sprint de ${fmt(km, true)} km?`, `Chispa uses ${rate} energy units per km, with no fixed use. How much energy does a ${fmt(km, false)} km sprint use?`),
      correct: n(value),
      wrong: [n(rate + km), n(rate * Math.floor(km)), n(value + rate)],
      hint: both(`Cada km gasta ${rate} unidades. Multiplicá por ${fmt(km, true)} km.`, `Each km uses ${rate} units. Multiply by ${fmt(km, false)} km.`),
      explanation: both(`${fmt(km, true)} × ${rate} = ${fmt(value, true)}.`, `${fmt(km, false)} × ${rate} = ${fmt(value, false)}.`),
    };
  },

  'g6-workers': (rng) => {
    const hours = rng.pick([12, 24, 36, 48, 60]);
    const people = rng.pick([2, 3, 4, 6].filter(p => hours % p === 0));
    const h = (n: number) => both(`${n} horas`, `${n} hours`);
    return {
      prompt: both(`Reconstruir el motor le lleva ${hours} horas a un mecánico. Con igual ritmo y trabajo repartible sin esperas, ¿cuánto tardan ${people} mecánicos?`, `Rebuilding the engine takes one mechanic ${hours} hours. With equal rates and work shared without waiting, how long do ${people} mechanics take?`),
      correct: h(hours / people),
      wrong: [h(hours * people), h(hours - people)],
      hint: both(`Repartí las ${hours} horas de trabajo entre ${people} mecánicos del mismo ritmo.`, `Share the ${hours} hours of work among ${people} mechanics working at the same rate.`),
      explanation: both(`${hours} ÷ ${people} = ${hours / people}: más mecánicos, menos tiempo.`, `${hours} ÷ ${people} = ${hours / people}: more mechanics, less time.`),
    };
  },

  'g6-energy-laps': (rng) => {
    const laps = rng.nextInt(2, 6), factor = rng.nextInt(2, 3), perLap = factor * rng.nextInt(1, 4);
    const longer = laps * factor;
    const units = (n: number) => both(`${n} unidades`, `${n} units`);
    return {
      prompt: both(`El plan era ${laps} vueltas con ${perLap} unidades de energía cada una. La carrera se alarga a ${longer} vueltas con la misma energía total. ¿Cuánto toca por vuelta?`, `The plan was ${laps} laps with ${perLap} energy units each. The race is extended to ${longer} laps with the same total energy. How much does each lap get?`),
      correct: units(perLap / factor),
      wrong: [units(perLap * factor), units(perLap + longer - laps), units(perLap)],
      hint: both(`Hallá la energía total del plan y repartila entre ${longer} vueltas.`, `Find the plan’s total energy and share it among ${longer} laps.`),
      explanation: both(`El total es ${laps} × ${perLap} = ${laps * perLap}; ${laps * perLap} ÷ ${longer} = ${perLap / factor}.`, `The total is ${laps} × ${perLap} = ${laps * perLap}; ${laps * perLap} ÷ ${longer} = ${perLap / factor}.`),
    };
  },

  'g6-product-pairs': (rng) => {
    const product = rng.pick([12, 18, 24, 30, 36, 40, 48, 60]);
    const divisors = Array.from({ length: product - 2 }, (_, i) => i + 2).filter(d => product % d === 0 && d < product);
    const picked: number[] = [];
    while (picked.length < 3) { const d = rng.pick(divisors); if (!picked.includes(d)) picked.push(d); }
    picked.sort((a, b) => a - b);
    const pairs = picked.map(x => `(${x}, ${product / x})`);
    const list = (and: string) => `${pairs[0]}, ${pairs[1]} ${and} ${pairs[2]}`;
    return {
      prompt: both(`Para una etapa, Marga anota pares (ritmo en km por minuto, minutos): ${list('y')}. Estos pares tienen…`, `For one stage, Marga records pairs (pace in km per minute, minutes): ${list('and')}. These pairs have…`),
      correct: both(`Producto constante ${product}`, `Constant product ${product}`),
      wrong: [both(`Razón constante ${product}`, `Constant ratio ${product}`), both(`Suma constante ${product}`, `Constant sum ${product}`)],
      hint: both('Multiplicá los dos números de cada pareja y compará los resultados.', 'Multiply the two numbers in each pair and compare the results.'),
      explanation: both(`${picked.map(x => `${x} × ${product / x}`).join(', ')}: siempre ${product}. La etapa mide ${product} km.`, `${picked.map(x => `${x} × ${product / x}`).join(', ')}: always ${product}. The stage is ${product} km.`),
    };
  },

  'g6-percent-decimal': (rng) => {
    const percent = 5 * rng.nextInt(1, 19);
    const n = (v: number) => both(fmt(v, true), fmt(v, false));
    return {
      prompt: both(`La batería marca ${percent} %. El programa de estrategia necesita un número decimal. ¿Cuál?`, `The battery shows ${percent}%. The strategy program needs a decimal number. Which one?`),
      correct: n(percent / 100),
      wrong: [n(percent), n(percent / 10)],
      hint: both(`Escribí ${percent} de cien como fracción decimal.`, `Write ${percent} out of one hundred as a decimal fraction.`),
      explanation: both(`${percent} % = ${percent}/100 = ${fmt(percent / 100, true)}.`, `${percent}% = ${percent}/100 = ${fmt(percent / 100, false)}.`),
    };
  },

  'g6-percent-speed': (rng) => {
    let speed = 0, percent = 0;
    do { speed = rng.pick([120, 140, 150, 160, 180, 200]); percent = rng.pick([10, 20, 25, 30, 50]); } while ((speed * percent) % 100 !== 0);
    const extra = (speed * percent) / 100;
    const kmh = (n: number) => plain(`${n} km/h`);
    return {
      prompt: both(`Chispa va a ${speed} km/h y el turbo suma el ${percent} % de esa velocidad. ¿Cuántos km/h suma el turbo?`, `Chispa runs at ${speed} km/h and the turbo adds ${percent}% of that speed. How many km/h does the turbo add?`),
      correct: kmh(extra),
      wrong: [kmh(percent), kmh(speed + extra)],
      hint: both(`Buscá el 10 % de ${speed} km/h y usalo para llegar al ${percent} %.`, `Find 10% of ${speed} km/h and use it to reach ${percent}%.`),
      explanation: both(`${percent} % de ${speed} = ${speed} × ${percent}/100 = ${extra}.`, `${percent}% of ${speed} = ${speed} × ${percent}/100 = ${extra}.`),
    };
  },

  'g6-discount': (rng) => {
    const price = rng.pick([40, 60, 80, 100, 120, 200]), percent = rng.pick([10, 20, 25]);
    const discount = (price * percent) / 100;
    const credits = (n: number) => both(`${n} créditos`, `${n} credits`);
    return {
      prompt: both(`Los neumáticos de lluvia cuestan ${price} créditos y tienen ${percent} % de descuento. ¿Cuánto paga el equipo?`, `Rain tires cost ${price} credits and have a ${percent}% discount. How much does the team pay?`),
      correct: credits(price - discount),
      wrong: [credits(discount), credits(price - percent), credits(price + discount)],
      hint: both(`Calculá el ${percent} % de ${price} y restalo del precio inicial.`, `Calculate ${percent}% of ${price} and subtract it from the original price.`),
      explanation: both(`El descuento es ${discount}; se pagan ${price} − ${discount} = ${price - discount}.`, `The discount is ${discount}; the team pays ${price} − ${discount} = ${price - discount}.`),
    };
  },

  'g6-composite-area': (rng) => {
    const width = rng.nextInt(5, 9), height = rng.nextInt(4, 7), corner = rng.nextInt(2, 3);
    const area = width * height - corner * corner;
    const m2 = (n: number) => plain(`${n} m²`);
    return {
      prompt: both(`El piso de la carpa mide ${width} m por ${height} m. En una esquina de ${corner} m por ${corner} m va el armario. ¿Cuánto piso hay que cubrir con alfombras?`, `The tent floor measures ${width} m by ${height} m. The cabinet stands in a ${corner} m by ${corner} m corner. How much floor must be covered with mats?`),
      correct: m2(area),
      wrong: [m2(width * height - corner), m2(width * height)],
      hint: both('Calculá el área completa de la carpa y quitá el área de la esquina del armario.', 'Calculate the tent’s full area and subtract the cabinet corner’s area.'),
      explanation: both(`${width * height} − ${corner} × ${corner} = ${area} m².`, `${width * height} − ${corner} × ${corner} = ${area} m².`),
    };
  },

  'g6-square-area': (rng) => {
    const side = rng.pick([3, 5, 6, 7, 8, 9]);
    const m2 = (n: number) => plain(`${n} m²`);
    return {
      prompt: both(`El cargador solar se bordea con ${4 * side} m de cable. Es un cuadrado de ${side} m de lado. ¿Qué área tiene?`, `The solar charger is edged with ${4 * side} m of cable. It is a square with ${side} m sides. What is its area?`),
      correct: m2(side * side),
      wrong: [m2(4 * side), m2(2 * side)],
      hint: both('El área cuenta cuadrados. Multiplicá el lado por el lado.', 'Area counts squares. Multiply side by side.'),
      explanation: both(`${side} × ${side} = ${side * side}. Los ${4 * side} m son el perímetro, no el área.`, `${side} × ${side} = ${side * side}. The ${4 * side} m is the perimeter, not the area.`),
    };
  },

  'g6-scale-unit': (rng) => {
    const factor = rng.pick([20, 25, 50, 100, 200, 500]);
    return {
      prompt: both(`Una maqueta de Chispa está a escala 1:${factor}. ¿Qué representa 1 cm de la maqueta?`, `A model of Chispa is at scale 1:${factor}. What does 1 cm on the model represent?`),
      correct: both(`${factor} cm reales`, `${factor} real cm`),
      wrong: [both(`${factor} m reales`, `${factor} real m`), both(`1 cm real`, `1 real cm`)],
      hint: both('La escala compara la misma unidad en la maqueta y en el auto real.', 'Scale compares the same unit on the model and on the real car.'),
      explanation: both(`1:${factor} significa 1 cm en la maqueta por ${factor} cm en el auto real.`, `1:${factor} means 1 cm on the model for ${factor} cm on the real car.`),
    };
  },

  'g6-map-distance': (rng) => {
    const cm = rng.nextInt(2, 9);
    const meters = (n: number) => both(`${fmt(n, true)} m`, `${fmt(n, false)} m`);
    return {
      prompt: both(`En el mapa a escala 1:10.000, la ruta alternativa mide ${cm} cm. ¿Cuánto mide en la realidad?`, `On the map at scale 1:10,000, the alternative route measures ${cm} cm. How long is it in reality?`),
      correct: meters(cm * 100),
      wrong: [meters(cm * 10000), meters(cm * 10)],
      hint: both('Multiplicá los centímetros del mapa por 10.000. Después pasá a metros.', 'Multiply the map centimeters by 10,000. Then convert to meters.'),
      explanation: both(`${cm} × 10.000 = ${fmt(cm * 10000, true)} cm = ${fmt(cm * 100, true)} m.`, `${cm} × 10,000 = ${fmt(cm * 10000, false)} cm = ${fmt(cm * 100, false)} m.`),
    };
  },

  'g6-plan-width': (rng) => {
    const meters = 2 * rng.nextInt(1, 8);
    const cm = (n: number) => plain(`${n} cm`);
    return {
      prompt: both(`En el plano del box a escala 1:200, ¿qué ancho tiene una entrada de ${meters} m?`, `On the pit-box plan at a scale of 1:200, how wide is a ${meters} m entrance?`),
      correct: cm(meters / 2),
      wrong: [cm(meters), cm(meters * 2)],
      hint: both(`Pasá ${meters} m a centímetros y dividí por 200.`, `Change ${meters} m to centimeters and divide by 200.`),
      explanation: both(`${meters * 100} cm ÷ 200 = ${meters / 2} cm.`, `${meters * 100} cm ÷ 200 = ${meters / 2} cm.`),
    };
  },

  'g6-blocks': (rng) => {
    const each = rng.nextInt(2, 5), blocks = rng.nextInt(3, 8);
    const laps = each * blocks;
    return {
      prompt: both(`En el tablero grande, cada bloque vale ${each} vueltas en punta. Chispa estuvo ${laps} vueltas en punta. ¿Cuántos bloques se pintan?`, `On the big board, each block is worth ${each} laps in the lead. Chispa led for ${laps} laps. How many blocks are filled?`),
      correct: plain(blocks),
      wrong: [plain(laps), plain(each), plain(blocks + 1)],
      hint: both(`Contá de ${each} en ${each} hasta ${laps}. Anotá cuántos saltos hiciste.`, `Count by ${each}s to ${laps}. Record how many jumps you made.`),
      explanation: both(`${laps} ÷ ${each} = ${blocks}.`, `${laps} ÷ ${each} = ${blocks}.`),
    };
  },

  'g6-mean-three': (rng) => {
    let values: number[] = [];
    let mean = 0;
    do {
      values = [rng.nextInt(1, 4), rng.nextInt(2, 6), rng.nextInt(6, 12)].sort((a, b) => a - b);
      mean = (values[0] + values[1] + values[2]) / 3;
    } while (!Number.isInteger(mean) || mean === values[1] || values[0] === values[1]);
    return {
      prompt: both(`Tres módulos de batería tienen ${values[0]}, ${values[1]} y ${values[2]} unidades. El equilibrador los nivela sin perder energía. ¿Cuánto queda en cada módulo?`, `Three battery modules hold ${values[0]}, ${values[1]}, and ${values[2]} units. The balancer levels them without losing energy. How much ends up in each module?`),
      correct: plain(mean),
      wrong: [plain(values[1]), plain(values[2] - values[0]), plain(values[2]), plain(mean + 1), plain(mean + 2)],
      hint: both('Sumá las tres cantidades y repartí el total en tres módulos iguales.', 'Add the three amounts and split the total into three equal modules.'),
      explanation: both(`Suman ${mean * 3} y hay tres módulos: ${mean * 3} ÷ 3 = ${mean}.`, `They total ${mean * 3} and there are three modules: ${mean * 3} ÷ 3 = ${mean}.`),
    };
  },

  'g6-mean-zero': (rng) => {
    let values: number[] = [];
    let total = 0;
    do {
      values = [0, rng.nextInt(2, 6), rng.nextInt(2, 6), rng.nextInt(5, 10)];
      total = values.reduce((a, b) => a + b, 0);
    } while (total % 4 !== 0 || total % 3 === 0);
    const tenths = (v: string) => both(`${v} décimas`, `${v} tenths`);
    return {
      prompt: both(`El turbo ganó ${values.slice(0, 3).join(', ')} y ${values[3]} décimas de segundo en cuatro vueltas; en la primera falló. ¿Cuál es la ganancia media?`, `The turbo gained ${values.slice(0, 3).join(', ')}, and ${values[3]} tenths of a second in four laps; it failed in the first. What is the mean gain?`),
      correct: tenths(String(total / 4)),
      wrong: [tenths(`${total}/3`), tenths(String(Math.max(...values)))],
      hint: both('Sumá las ganancias. Contá también el cero al decidir entre cuántos dividir.', 'Add the gains. Include zero when counting how many values to divide by.'),
      explanation: both(`${total} ÷ 4 = ${total / 4}: el cero cuenta como uno de los cuatro datos.`, `${total} ÷ 4 = ${total / 4}: zero counts as one of the four data points.`),
    };
  },

  'g6-mean-mode': (rng) => {
    const mode = rng.nextInt(1, 4), mean = mode + rng.nextInt(1, 3);
    const outlier = 4 * mean - 3 * mode;
    const pair = (m: number, o: number) => both(`Media ${m} s; moda ${o} s`, `Mean ${m} s; mode ${o} s`);
    return {
      prompt: both(`Las paradas de Viento Sur duraron ${mode}, ${mode}, ${mode} y ${outlier} segundos. ¿Cuáles son la media y la moda?`, `Viento Sur’s stops took ${mode}, ${mode}, ${mode}, and ${outlier} seconds. What are the mean and the mode?`),
      correct: pair(mean, mode),
      wrong: [pair(mode, mean), pair(outlier, mode)],
      hint: both('Para la media, sumá y dividí entre cuatro. Para la moda, contá repeticiones.', 'For the mean, add and divide by four. For the mode, count occurrences.'),
      explanation: both(`${4 * mean} ÷ 4 = ${mean}; ${mode} es el valor más frecuente.`, `${4 * mean} ÷ 4 = ${mean}; ${mode} is the most frequent value.`),
    };
  },

  'g6-percent-of-battery': (rng) => {
    const percent = rng.pick([10, 20, 25, 50]);
    const total = 20 * rng.nextInt(2, 10);
    const used = (total * percent) / 100;
    return {
      prompt: both(`La batería guarda ${total} unidades y el turbo final usa el ${percent} %. ¿Cuántas unidades usa?`, `The battery holds ${total} units and the final turbo uses ${percent}%. How many units does it use?`),
      correct: plain(used),
      wrong: [plain(percent), plain(total - used), plain(used + percent), plain(total), plain(used + 10)],
      hint: both(`Buscá el ${percent} % de ${total}: empezá por el 10 % o por una fracción.`, `Find ${percent}% of ${total}: start from 10% or from a fraction.`),
      explanation: both(`${percent} % de ${total} = ${total} × ${percent}/100 = ${used}.`, `${percent}% of ${total} = ${total} × ${percent}/100 = ${used}.`),
    };
  },

  'g6-area-left': (rng) => {
    let width = 0, height = 0, percent = 0;
    do { width = rng.pick([10, 12, 15, 20]); height = rng.pick([8, 10, 12]); percent = rng.pick([10, 20, 25, 50]); } while ((width * height * percent) % 100 !== 0);
    const area = width * height, reserved = (area * percent) / 100;
    const m2 = (n: number) => plain(`${n} m²`);
    return {
      prompt: both(`La zona de boxes mide ${width} m por ${height} m, o ${area} m². La zona de fans ocupa el ${percent} %. ¿Qué área queda para el equipo?`, `The pit area measures ${width} m by ${height} m, or ${area} m². The fan zone takes ${percent}%. What area is left for the team?`),
      correct: m2(area - reserved),
      wrong: [m2(area - percent), m2(reserved), m2(area), m2(area + reserved)],
      hint: both(`Hallá el ${percent} % de ${area} m² y quitalo del área total.`, `Find ${percent}% of ${area} m² and subtract it from the total area.`),
      explanation: both(`${percent} % de ${area} es ${reserved}; ${area} − ${reserved} = ${area - reserved}.`, `${percent}% of ${area} is ${reserved}; ${area} − ${reserved} = ${area - reserved}.`),
    };
  },

  'g6-mean-check': (rng) => {
    const mean = rng.nextInt(8, 20), far = rng.nextInt(3, 6), near = rng.nextInt(1, 2);
    const values = [mean - far, mean - near, mean + near, mean + far];
    const max = mean + far;
    return {
      prompt: both(`En cuatro vueltas, Chispa recuperó ${values.slice(0, 3).join(', ')} y ${values[3]} unidades de energía. ¿Qué cálculo comprueba que la media es ${mean}?`, `In four laps, Chispa recovered ${values.slice(0, 3).join(', ')}, and ${values[3]} energy units. Which calculation checks that the mean is ${mean}?`),
      correct: both(`${mean} × 4 = ${mean * 4}, el total`, `${mean} × 4 = ${mean * 4}, the total`),
      wrong: [both(`${mean} es el mayor dato`, `${mean} is the greatest value`), both(`${max} × 4 = ${max * 4}, el total`, `${max} × 4 = ${max * 4}, the total`)],
      hint: both(`Si cada una de las cuatro vueltas hubiera dado ${mean}, ¿qué total obtendrías?`, `If each of the four laps had given ${mean}, what total would you get?`),
      explanation: both(`${values.join(' + ')} = ${mean * 4} y ${mean} × 4 = ${mean * 4}: el reparto parejo conserva el total.`, `${values.join(' + ')} = ${mean * 4} and ${mean} × 4 = ${mean * 4}: equal sharing keeps the total.`),
    };
  },
};
