// Chapter 1 — The lot and the supply yard (G03-01): bricks in pallets of 1,000,
// stacks of 100, packs of 10 and loose bricks; writing and comparing numbers to
// 10,000; the same amount split in different ways.
import { numberWords } from '../../grade2/variants/kit';
import type { LocalizedText } from '../../../math/core/types';
import { T, choose, typed, es, en, type Generator, type Rng } from './kit';

const PLACE_ES = ['palés', 'pilas', 'paquetes', 'ladrillos sueltos'];
const PLACE_EN = ['pallets', 'stacks', 'packs', 'loose bricks'];
const ONE_ES = ['palé', 'pila', 'paquete', 'ladrillo suelto'];
const ONE_EN = ['pallet', 'stack', 'pack', 'loose brick'];
/** «3 palés», «1 pila» / “3 pallets”, “1 stack”. */
const countEs = (place: number, k: number) => `${k} ${k === 1 ? ONE_ES[place] : PLACE_ES[place]}`;
const countEn = (place: number, k: number) => `${k} ${k === 1 ? ONE_EN[place] : PLACE_EN[place]}`;
/** «las pilas», «la pila» / “the stacks”, “the stack”. */
const theEs = (place: number, k: number) => k === 1 ? `${['el', 'la', 'el', 'el'][place]} ${ONE_ES[place]}` : `${['los', 'las', 'los', 'los'][place]} ${PLACE_ES[place]}`;
const theEn = (place: number, k: number) => `the ${k === 1 ? ONE_EN[place] : PLACE_EN[place]}`;
const VALUE = [1000, 100, 10, 1];
const digitsOf = (n: number) => [Math.floor(n / 1000), Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10];

/** Number words to 9,999 as Rosa says them on the phone. */
function words(n: number): LocalizedText {
  const k = Math.floor(n / 1000), rest = n % 1000;
  const restWords = rest ? numberWords(rest) : T('', '');
  const thousandEs = k === 1 ? 'mil' : `${numberWords(k)['es-AR']} mil`;
  const thousandEn = `${numberWords(k)['en-US']} thousand`;
  // Before a noun Spanish shortens «uno»: «siete mil un ladrillos», «veintiún ladrillos».
  const restEs = restWords['es-AR'].replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un');
  return T(`${thousandEs}${rest ? ` ${restEs}` : ''}`, `${thousandEn}${rest ? ` ${restWords['en-US']}` : ''}`);
}

/** A four-digit number whose digits are all different and not zero. */
function distinctDigits(r: Rng): number {
  const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
  return digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3];
}

export const lot: Record<string, [Generator, Generator]> = {
  'G03-01-L01': [
    r => {
      const n = distinctDigits(r), d = digitsOf(n);
      const place = r.int(0, 2), value = d[place] * VALUE[place];
      return typed(
        T(`El corralón tiene ${es(n)} ladrillos: ${countEs(0, d[0])}, ${countEs(1, d[1])}, ${countEs(2, d[2])} y ${d[3]} ${d[3] === 1 ? 'suelto' : 'sueltos'}. ¿Cuántos ladrillos hay en ${theEs(place, d[place])}?`,
          `The yard has ${en(n)} bricks: ${countEn(0, d[0])}, ${countEn(1, d[1])}, ${countEn(2, d[2])}, and ${d[3]} loose. How many bricks are in ${theEn(place, d[place])}?`),
        value,
        T(`${countEs(place, d[place])} de ${es(VALUE[place])}: ${d[place]} × ${VALUE[place]} = ${value} ladrillos.`, `${countEn(place, d[place])} of ${en(VALUE[place])}: ${d[place]} × ${VALUE[place]} = ${value} bricks.`),
        T(`Buscá el ${d[place]} en el número. ¿Cuántos ladrillos tiene ${place === 1 ? 'una' : 'un'} ${ONE_ES[place]}?`, `Find the ${d[place]} in the number. How many bricks does one ${ONE_EN[place]} hold?`),
        { unit: T('ladrillos', 'bricks'), model: n, reward: T(`Rosa reserva ${d[place] === 1 ? theEs(place, 1) : `${['los', 'las', 'los'][place]} ${countEs(place, d[place])}`}: ${es(value)} ladrillos.`, `Rosa reserves the ${countEn(place, d[place])}: ${en(value)} bricks.`) },
      );
    },
    r => {
      // 10 packs = 1 stack, 10 stacks = 1 pallet; sometimes two or three at once. (Loose bricks
      // are left out: there «10 loose bricks hold 10 bricks» would be true, not a mistake.)
      const kind = r.int(0, 1), times = r.int(1, 3);
      const small = [10, 100, 1][kind], smallEs = ['paquetes', 'pilas', 'ladrillos sueltos'][kind], smallEn = ['packs', 'stacks', 'loose bricks'][kind];
      const bigEs = ['pila', 'palé', 'paquete'][kind], bigEn = ['stack', 'pallet', 'pack'][kind];
      const big = small * 10, count = 10 * times, total = big * times;
      const bigsEs = times === 1 ? `${bigEs === 'pila' ? 'una' : 'un'} ${bigEs}` : `${times} ${bigEs === 'palé' ? 'palés' : bigEs + 's'}`;
      const bigsEn = times === 1 ? `one ${bigEn}` : `${times} ${bigEn}s`;
      return choose(r,
        T(`Rosa junta ${count} ${smallEs} de ${small} ladrillos. ¿Por qué forman ${bigsEs}?`, `Rosa puts together ${count} ${smallEn} of ${small} bricks. Why do they make ${bigsEn}?`),
        T(`Porque ${count} × ${small} = ${total}`, `Because ${count} × ${small} = ${total}`),
        [T(`Porque ${count} + ${small} = ${total}`, `Because ${count} + ${small} = ${total}`), T(`Porque ${count} ${smallEs} tienen ${count} ladrillos`, `Because ${count} ${smallEn} hold ${count} bricks`)],
        T(`${count} grupos de ${small} ladrillos son ${es(total)} ladrillos: ${bigsEs}.`, `${count} groups of ${small} bricks are ${en(total)} bricks: ${bigsEn}.`),
        T(`Contá los ${smallEs} de ${small} en ${small}. ¿A cuántos ladrillos llegás?`, `Count the ${smallEn} in ${small}s. How many bricks do you reach?`));
    },
  ],
  'G03-01-L02': [
    r => {
      // Numbers with zeros: the order form needs them.
      const k = r.int(1, 9);
      const rest = r.pick([r.int(1, 9), r.int(1, 9) * 10, r.int(1, 9) * 100 + r.int(1, 9), r.int(1, 9) * 100 + r.int(1, 9) * 10]);
      const n = k * 1000 + rest, d = digitsOf(n), w = words(n);
      return typed(
        T(`Rosa dice por teléfono: «${w['es-AR']} ladrillos». ¿Qué número va en la hoja de pedido?`, `Rosa says on the phone: “${w['en-US']} bricks.” Which number goes on the order form?`),
        n,
        T(`${d[0]} palés, ${d[1]} pilas, ${d[2]} paquetes y ${d[3]} sueltos: ${n}.`, `${d[0]} pallets, ${d[1]} stacks, ${d[2]} packs, and ${d[3]} loose: ${n}.`),
        T('Anotá cuatro lugares: palés, pilas, paquetes y sueltos. Poné cero donde no hay nada.', 'Write four places: pallets, stacks, packs, and loose. Put zero where there is nothing.'),
        { reward: T(`La hoja de pedido dice ${es(n)}. ¡Está bien escrita!`, `The order form says ${en(n)}. It is written correctly!`) },
      );
    },
    r => {
      // Greater and smaller differ first at `p`; later, at `q`, the smaller one has the bigger digit.
      const p = r.int(0, 2), q = r.int(p + 1, 3);
      const g = [r.int(1, 9), r.int(0, 9), r.int(0, 9), r.int(0, 9)];
      if (g[p] === 0) g[p] = r.int(1, 9);
      if (p === 0 && g[0] === 1) g[0] = r.int(2, 9);
      const s = [...g];
      s[p] = p === 0 ? r.int(1, g[0] - 1) : r.int(0, g[p] - 1);
      g[q] = r.int(0, 8); s[q] = r.int(g[q] + 1, 9);
      const num = (d: number[]) => d[0] * 1000 + d[1] * 100 + d[2] * 10 + d[3];
      const G = num(g), S = num(s);
      const [first, second] = r.int(0, 1) ? [G, S] : [S, G];
      return choose(r,
        T(`El corralón tiene ${es(first)} ladrillos y la obra pide ${es(second)}. ¿Qué número es mayor y por qué?`, `The yard has ${en(first)} bricks and the site asks for ${en(second)}. Which number is greater, and why?`),
        T(`${es(G)}: tiene más ${PLACE_ES[p]}`, `${en(G)}: it has more ${PLACE_EN[p]}`),
        [T(`${es(S)}: tiene más ${PLACE_ES[q]}`, `${en(S)}: it has more ${PLACE_EN[q]}`), T('Son iguales: los dos tienen cuatro cifras', 'They are equal: both have four digits')],
        T(`Miramos primero los lugares más grandes. En ${theEs(p, 2)}, ${g[p]} es más que ${s[p]}: ${es(G)} es mayor.`, `We look at the biggest places first. In the ${PLACE_EN[p]}, ${g[p]} is more than ${s[p]}: ${en(G)} is greater.`),
        T('Compará los palés primero. Si son iguales, pasá a las pilas, y así.', 'Compare the pallets first. If they are equal, move on to the stacks, and so on.'),
        { reward: T(`El pedido de ${es(G)} ladrillos queda bien anotado.`, `The order for ${en(G)} bricks is written down correctly.`) });
    },
  ],
  'G03-01-L03': [
    r => {
      const a = r.int(2, 9), b = r.int(1, 8), rest = r.int(11, 99), n = a * 1000 + b * 100 + rest;
      return choose(r,
        T(`El remito dice ${es(n)} ladrillos. Un palé llegó desarmado en pilas. ¿Qué descarga también da ${es(n)}?`, `The delivery note says ${en(n)} bricks. One pallet arrived split into stacks. Which unloading also gives ${en(n)}?`),
        T(`${(a - 1) * 1000} + ${1000 + b * 100} + ${rest}`, `${(a - 1) * 1000} + ${1000 + b * 100} + ${rest}`),
        [T(`${(a - 1) * 1000} + ${b * 100} + ${rest}`, `${(a - 1) * 1000} + ${b * 100} + ${rest}`),
          T(`${a * 1000} + ${1000 + b * 100} + ${rest}`, `${a * 1000} + ${1000 + b * 100} + ${rest}`),
          T(`${(a - 1) * 1000} + ${(10 + b) * 10} + ${rest}`, `${(a - 1) * 1000} + ${(10 + b) * 10} + ${rest}`)],
        T(`${es((a - 1) * 1000)} + ${es(1000 + b * 100)} + ${rest} = ${es(n)}: el palé desarmado está en las ${10 + b} pilas.`, `${en((a - 1) * 1000)} + ${en(1000 + b * 100)} + ${rest} = ${en(n)}: the split pallet is in the ${10 + b} stacks.`),
        T(`Sumá las partes de cada opción y compará con ${es(n)}.`, `Add the parts of each option and compare with ${en(n)}.`),
        { reward: T(`Llegaron los ${es(n)} ladrillos. Rosa firma el remito.`, `All ${en(n)} bricks arrived. Rosa signs the delivery note.`) });
    },
    r => {
      const a = r.int(2, 8), b = r.int(1, 9) * 10 + r.int(0, 9) * 100, note = a * 1000 + b;
      const kind = r.pick(['same', 'fewer', 'more'] as const);
      const arrived = kind === 'same' ? [(a - 1) * 1000, 1000 + b] : kind === 'fewer' ? [(a - 1) * 1000, b] : [a * 1000, 1000 + b];
      const total = arrived[0] + arrived[1];
      const SAME = T('Sí: mil baldosas pasaron de una parte a la otra', 'Yes: one thousand tiles moved from one part to the other');
      const FEWER = T('No: llegaron mil baldosas menos', 'No: one thousand fewer tiles arrived');
      const MORE = T('No: llegaron mil baldosas más', 'No: one thousand more tiles arrived');
      const right = kind === 'same' ? SAME : kind === 'fewer' ? FEWER : MORE;
      return choose(r,
        T(`Las baldosas: el remito dice ${es(a * 1000)} + ${b} y llegó ${es(arrived[0])} + ${es(arrived[1])}. ¿Es la misma cantidad?`, `The tiles: the note says ${en(a * 1000)} + ${b} and ${en(arrived[0])} + ${en(arrived[1])} arrived. Is it the same amount?`),
        right, [SAME, FEWER, MORE].filter(o => o !== right),
        T(`El remito suma ${es(note)} baldosas y llegaron ${es(total)}.`, `The note adds up to ${en(note)} tiles and ${en(total)} arrived.`),
        T('Mirá cuánto cambia la primera parte y cuánto cambia la segunda.', 'Look at how much the first part changes and how much the second part changes.'));
    },
  ],
};
