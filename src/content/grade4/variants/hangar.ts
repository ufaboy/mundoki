// Chapters 1–2 — The old hangar and the fuselage (G04-01, G04-02): rivets and
// engines with numbers to millions, comparing and rounding, and planning
// several steps with the right operation and unit.
import { T, choose, chooseNumber, typed, es, en, L, oneOf, type Generator, type Rng } from './kit';

const PLACE_ES = ['unidades de millón', 'centenas de mil', 'decenas de mil', 'unidades de mil', 'centenas', 'decenas', 'unidades'];
const PLACE_EN = ['millions', 'hundred thousands', 'ten thousands', 'thousands', 'hundreds', 'tens', 'ones'];

/** A seven-digit number with some zeros in the middle; its non-zero digits are all different. */
function millions(r: Rng): number[] {
  const free = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const d = [free[0], free[1], 0, free[2], 0, free[3], 0];
  [2, 4, 6].forEach((i, j) => { if (r.int(0, 2) === 0) d[i] = free[4 + j]; });
  return d;
}
const num = (d: number[]) => Number(d.join(''));

export const hangar: Record<string, [Generator, Generator]> = {
  'G04-01-L01': [
    r => {
      const d = millions(r);
      const options = [1, 2, 3, 4, 5].filter(i => d[i] !== 0);
      const p = r.pick(options), value = d[p] * 10 ** (6 - p), n = num(d);
      return typed(
        T(`El registro dice: ${es(n)} remaches. ¿Cuánto vale el ${d[p]}?`, `The register says: ${en(n)} rivets. What is the ${d[p]} worth?`),
        value,
        T(`El ${d[p]} está en las ${PLACE_ES[p]}: vale ${es(value)} remaches.`, `The ${d[p]} is in the ${PLACE_EN[p]} place: it is worth ${en(value)} rivets.`),
        T(`Contá los lugares desde la derecha: unidades, decenas, centenas… ¿En cuál está el ${d[p]}?`, `Count the places from the right: ones, tens, hundreds… Which one holds the ${d[p]}?`),
        { unit: T('remaches', 'rivets'), model: { place: String(n) }, reward: T(`Nina anota en el registro: el ${d[p]} vale ${es(value)} remaches.`, `Nina writes in the register: the ${d[p]} is worth ${en(value)} rivets.`) },
      );
    },
    r => {
      const d = millions(r);
      d[2] = 0; d[4] = 0;
      const n = num(d), parts = d.map((x, i) => x * 10 ** (6 - i)).filter(x => x > 0);
      const squeezed = Number(d.filter(x => x !== 0).join(''));
      const shifted = Number([d[0], d[1], d[3], 0, d[5], 0, d[6]].join(''));
      return chooseNumber(r,
        T(`Nina dicta las partes: ${parts.map(es).join(' + ')}. ¿Qué número va en el registro?`, `Nina reads out the parts: ${parts.map(en).join(' + ')}. Which number goes in the register?`),
        n, [squeezed, shifted, n * 10],
        T(`Los ceros guardan los lugares vacíos: ${parts.map(es).join(' + ')} = ${es(n)}.`, `The zeros keep the empty places: ${parts.map(en).join(' + ')} = ${en(n)}.`),
        L('Escribí siete lugares, desde las unidades de millón hasta las unidades. Poné cero donde no hay nada.|Write seven places, from the millions down to the ones. Put zero where there is nothing.'),
        { reward: L('El registro queda bien copiado. Nina tacha la primera línea de la lista de reparación.|The register is copied correctly. Nina ticks the first line of the repair list.') });
    },
  ],
  'G04-01-L02': [
    r => {
      const k = r.int(1, 9), big = k * 100000, small = big - 1;
      const [a, b] = r.int(0, 1) ? [small, big] : [big, small];
      return choose(r,
        T(`Dos motores más: un contador marca ${es(a)} km y el otro ${es(b)} km. ¿Cuál voló más?`, `Two more engines: one counter shows ${en(a)} km and the other ${en(b)} km. Which one has flown more?`),
        T(`${es(big)} km`, `${en(big)} km`), [T(`${es(small)} km`, `${en(small)} km`), L('Volaron lo mismo|They have flown the same')],
        T(`${es(small)} + 1 = ${es(big)}: le falta 1 km para llegar.`, `${en(small)} + 1 = ${en(big)}: it is 1 km short.`),
        T(`Sumale 1 km a ${es(small)}. ¿A qué número llegás?`, `Add 1 km to ${en(small)}. What number do you reach?`),
        { reward: T(`El motor de ${es(big)} km va al estante del museo del aeroclub.`, `The ${en(big)} km engine goes on the aeroclub museum shelf.`) });
    },
    r => {
      // Same digits in a different order: the first different place decides.
      const [x, y, z] = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, q) => p - q);
      const values = [z * 100000 + x * 10000 + y * 100, z * 100000 + y * 10000 + x * 100, z * 100000 + y * 10000 + x * 10];
      const least = Math.min(...values), shown = r.shuffle(values);
      return choose(r,
        T(`Nina quiere el motor que menos voló: ${shown.map(v => `${es(v)} km`).join(', ')}. ¿Cuál elige?`, `Nina wants the engine that has flown least: ${shown.map(v => `${en(v)} km`).join(', ')}. Which one does she choose?`),
        T(`${es(least)} km`, `${en(least)} km`), values.filter(v => v !== least).map(v => T(`${es(v)} km`, `${en(v)} km`)),
        T(`Comparamos desde la izquierda y paramos en el primer lugar distinto: ${es(least)} es el menor.`, `We compare from the left and stop at the first different place: ${en(least)} is the smallest.`),
        L('Compará los números lugar por lugar desde la izquierda. ¿Dónde aparece la primera diferencia?|Compare the numbers place by place from the left. Where is the first difference?'),
        { reward: T(`¡El motor de ${es(least)} km queda montado en la nariz de La Golondrina!`, `The ${en(least)} km engine is mounted in La Golondrina’s nose!`) });
    },
  ],
  'G04-01-L03': [
    r => {
      const k = r.int(2, 9), rest = r.pick([r.int(1, 4) * 100 + r.int(1, 9) * 10, r.int(6, 9) * 100 + r.int(1, 9) * 10]), n = k * 1000 + rest;
      const near = rest < 500 ? k * 1000 : (k + 1) * 1000;
      return typed(
        T(`Las alas necesitan ${es(n)} remaches. En la recta, de ${es(k * 1000)} a ${es((k + 1) * 1000)}, ¿a qué millar está más cerca ${es(n)}?`, `The wings need ${en(n)} rivets. On the line from ${en(k * 1000)} to ${en((k + 1) * 1000)}, which thousand is ${en(n)} nearer to?`),
        near,
        T(`Está a ${rest} de ${es(k * 1000)} y a ${1000 - rest} de ${es((k + 1) * 1000)}: el más cercano es ${es(near)}.`, `It is ${rest} from ${en(k * 1000)} and ${1000 - rest} from ${en((k + 1) * 1000)}: the nearer one is ${en(near)}.`),
        T(`Mirá si ${es(n)} pasó la mitad del camino, ${es(k * 1000 + 500)}.`, `Check whether ${en(n)} is past the halfway point, ${en(k * 1000 + 500)}.`),
        { reward: T(`La marca de ${es(n)} queda en la recta. Nina escribe en el plano: «unos ${es(near)} remaches».`, `The ${en(n)} mark is on the line. Nina writes on the plan: “about ${en(near)} rivets.”`) },
      );
    },
    r => {
      const k = r.int(2, 9), h = r.pick([1, 2, 3, 4]), t = r.int(1, 4), n = k * 1000 + h * 100 + t * 10;
      const thousand = k * 1000, hundred = k * 1000 + h * 100, ok = r.int(0, 1) === 0;
      const atomo = ok ? hundred : hundred + 200;
      const BOTH = L('Las dos sirven: redondean a millares y a centenas|Both work: they round to thousands and to hundreds');
      const ONLY = L('Solo la de Nina: Átomo no usó la centena más cercana|Only Nina’s: Átomo did not use the nearest hundred');
      const EXACT = L('Las dos son el número exacto|Both are the exact number');
      return choose(r,
        T(`Hacen falta ${es(n)} remaches. Nina anota «unos ${es(thousand)}» y Átomo «unos ${es(atomo)}». ¿Qué aproximaciones sirven?`, `${en(n)} rivets are needed. Nina writes “about ${en(thousand)}” and Átomo “about ${en(atomo)}”. Which approximations work?`),
        ok ? BOTH : ONLY, ok ? [ONLY, EXACT] : [BOTH, EXACT],
        ok
          ? T(`${es(thousand)} es el millar más cercano y ${es(hundred)} la centena más cercana. El dato exacto sigue siendo ${es(n)}.`, `${en(thousand)} is the nearest thousand and ${en(hundred)} the nearest hundred. The exact figure is still ${en(n)}.`)
          : T(`La centena más cercana a ${es(n)} es ${es(hundred)}, no ${es(atomo)}.`, `The nearest hundred to ${en(n)} is ${en(hundred)}, not ${en(atomo)}.`),
        T(`Ubicá ${es(n)} entre dos centenas. ¿Cuál está más cerca?`, `Place ${en(n)} between two hundreds. Which one is nearer?`));
    },
  ],
  'G04-02-L01': [
    r => {
      const boxes = r.int(12, 29), per = r.int(2, 6) * 100 + r.int(1, 9) * 5;
      const ALL = L('Todos los remaches|All the rivets'), BOXES = L('Las cajas|The boxes'), ONE = L('Los remaches de una caja|The rivets in one box');
      const ask = r.pick(['product', 'boxes', 'per'] as const);
      const right = ask === 'product' ? ALL : ask === 'boxes' ? BOXES : ONE;
      const what = ask === 'product' ? `${boxes} × ${per}` : ask === 'boxes' ? `${boxes}` : `${per}`;
      return choose(r,
        T(`Llegan ${boxes} cajas con ${per} remaches cada una. ¿Qué cuenta ${what}?`, `${boxes} boxes arrive with ${per} rivets each. What does ${what} count?`),
        right, [ALL, BOXES, ONE].filter(o => o !== right),
        T(`${boxes} son las cajas, ${per} los remaches de cada caja y ${boxes} × ${per} todos los remaches.`, `${boxes} is the boxes, ${per} the rivets in each box, and ${boxes} × ${per} all the rivets.`),
        L('Leé qué cuenta cada número: ¿cajas o remaches?|Read what each number counts: boxes or rivets?'),
        { reward: T(`En el pizarrón, el esquema dice: «${boxes} × ${per} = remaches».`, `On the board, the diagram says: “${boxes} × ${per} = rivets.”`) });
    },
    r => {
      const boxes = r.int(6, 19), per = r.int(2, 5) * 100 + r.int(1, 9) * 5, extra = r.int(2, 9) * 50, used = r.int(0, 1) === 0;
      const plus = T(`[${boxes} × ${per}] + [${extra}]`, `[${boxes} × ${per}] + [${extra}]`), minus = T(`[${boxes} × ${per}] − [${extra}]`, `[${boxes} × ${per}] − [${extra}]`);
      const add = T(`[${boxes} + ${per}] + [${extra}]`, `[${boxes} + ${per}] + [${extra}]`), swap = T(`[${boxes} × ${extra}] + [${per}]`, `[${boxes} × ${extra}] + [${per}]`);
      return choose(r,
        used
          ? T(`Llegan ${boxes} cajas de ${per} remaches y se usan ${extra}. ¿Qué esquema muestra los remaches que quedan?`, `${boxes} boxes of ${per} rivets arrive and ${extra} are used. Which diagram shows the rivets left?`)
          : T(`Llegan ${boxes} cajas de ${per} remaches y ya había ${extra} sueltos. ¿Qué esquema muestra todos los remaches?`, `${boxes} boxes of ${per} rivets arrive and there were already ${extra} loose. Which diagram shows all the rivets?`),
        used ? minus : plus, used ? [plus, add, swap] : [minus, add, swap],
        used
          ? T(`Multiplicamos las cajas por los remaches de cada una y restamos los ${extra} usados.`, `We multiply the boxes by the rivets in each and subtract the ${extra} used.`)
          : T(`Multiplicamos las cajas por los remaches de cada una y sumamos los ${extra} que ya había.`, `We multiply the boxes by the rivets in each and add the ${extra} already there.`),
        L('Pensá qué pasa con los remaches sueltos: ¿se agregan o se van?|Think about the loose rivets: are they added or taken away?'));
    },
  ],
  'G04-02-L02': [
    r => {
      const bags = r.int(3, 9), per = r.pick([100, 120, 150, 200, 250]), loose = r.int(1, 9) * 10, used = r.int(2, 9) * 10;
      const inBags = bags * per, all = inBags + loose, left = all - used;
      return typed(
        T(`Hay ${bags} bolsas de ${per} tornillos y ${loose} tornillos sueltos. Los paneles usan ${used} tornillos. ¿Cuántos quedan?`, `There are ${bags} bags of ${per} screws and ${loose} loose screws. The panels use ${used} screws. How many are left?`),
        left,
        T(`${bags} × ${per} = ${es(inBags)}; ${es(inBags)} + ${loose} = ${es(all)}; ${es(all)} − ${used} = ${es(left)} tornillos.`, `${bags} × ${per} = ${en(inBags)}; ${en(inBags)} + ${loose} = ${en(all)}; ${en(all)} − ${used} = ${en(left)} screws.`),
        L('Primero los tornillos de las bolsas, después todos los tornillos y al final lo que queda.|First the screws in the bags, then all the screws, and last what is left.'),
        { unit: T('tornillos', 'screws'), reward: T(`Los ${es(left)} tornillos que sobran vuelven al cajón con su etiqueta.`, `The ${en(left)} spare screws go back into the drawer with their label.`) },
      );
    },
    r => {
      const bags = r.int(3, 9), per = r.pick([100, 120, 150, 200]), loose = r.int(1, 9) * 10, used = r.int(2, 9) * 10;
      const a = bags * per, b = a + loose, c = b - used;
      const ask = r.pick([0, 1, 2]), n = [a, b, c][ask];
      const BAGS = L('Los tornillos de las bolsas|The screws in the bags'), ALL = L('Todos los tornillos|All the screws'), LEFT = L('Los tornillos que quedan|The screws that are left');
      const right = [BAGS, ALL, LEFT][ask];
      return choose(r,
        T(`Hay ${bags} bolsas de ${per} tornillos y ${loose} sueltos; se usan ${used}. Nina escribe ${es(a)}, después ${es(b)} y después ${es(c)}. ¿Qué cuenta el ${es(n)}?`, `There are ${bags} bags of ${per} screws and ${loose} loose; ${used} are used. Nina writes ${en(a)}, then ${en(b)}, then ${en(c)}. What does the ${en(n)} count?`),
        right, [BAGS, ALL, LEFT].filter(o => o !== right),
        T(`${es(a)}: los de las bolsas; ${es(b)}: todos; ${es(c)}: los que quedan. Por eso se anota cada paso.`, `${en(a)}: the ones in the bags; ${en(b)}: all of them; ${en(c)}: those left. That is why each step is written down.`),
        T(`Buscá qué cuenta da ${es(n)}: ¿multiplicar, sumar o restar?`, `Find which calculation gives ${en(n)}: multiplying, adding, or subtracting?`));
    },
  ],
  'G04-02-L03': [
    r => {
      const had = r.int(4, 9) * 100, used = r.int(2, 9) * 10 + r.pick([0, 5]), left = had - used;
      return choose(r,
        T(`Había ${had} mL de pintura y la franja usó ${used} mL. Átomo escribió ${had} − ${used} = ${left}. ¿Qué cuenta lo comprueba?`, `There were ${had} mL of paint and the stripe used ${used} mL. Átomo wrote ${had} − ${used} = ${left}. Which calculation checks it?`),
        T(`${left} + ${used} = ${had}`, `${left} + ${used} = ${had}`),
        [T(`${left} − ${used} = ${left - used}`, `${left} − ${used} = ${left - used}`), T(`${had} + ${used} = ${had + used}`, `${had} + ${used} = ${had + used}`), T(`${had} + ${left} = ${had + left}`, `${had} + ${left} = ${had + left}`)],
        T(`Volvemos a poner los ${used} mL usados: si llegamos a ${had} mL, la resta está bien.`, `We put back the ${used} mL used: if we get ${had} mL, the subtraction is right.`),
        T(`¿Qué pasa si juntás la pintura que quedó con la que se usó?`, `What happens if you put the paint left together with the paint used?`));
    },
    r => {
      const n = r.int(120, 980);
      const contexts = [
        { es: `Átomo contó los tornillos que sobran y escribió «${n} cajas».`, en: `Átomo counted the spare screws and wrote “${n} boxes”.`, right: L('La unidad: contamos tornillos|The unit: we counted screws') },
        { es: `Átomo midió la pintura que queda y escribió «${n} kg».`, en: `Átomo measured the paint left and wrote “${n} kg”.`, right: L('La unidad: medimos mililitros|The unit: we measured milliliters') },
        { es: `Átomo contó los remaches del panel y escribió «${n} tornillos».`, en: `Átomo counted the rivets on the panel and wrote “${n} screws”.`, right: L('La unidad: contamos remaches|The unit: we counted rivets') },
      ];
      const pick = r.int(0, 2), c = contexts[pick];
      const others = contexts.filter((_, i) => i !== pick).map(x => x.right);
      return choose(r,
        T(`${c.es} ¿Qué hay que corregir?`, `${c.en} What must be corrected?`),
        c.right, [...others.slice(0, 1), L('Nada: la unidad no importa|Nothing: the unit does not matter')],
        T(`El número ${n} está bien, pero la respuesta tiene que decir qué cuenta o qué mide.`, `The number ${n} is right, but the answer must say what it counts or measures.`),
        L('Leé otra vez qué se contó o se midió. ¿Coincide con la palabra que escribió Átomo?|Read again what was counted or measured. Does it match the word Átomo wrote?'));
    },
  ],
};
