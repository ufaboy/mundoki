// Chapter 1 — Gem Market (G02-01, G02-02): place value with boxes of 100,
// bags of 10, and loose gems.
import { T, choose, chooseNumber, count, digits, numberWords, typed, type Generator, type Rng } from './kit';

const GEMS = T('gemas', 'gems');
const boxes = (n: number) => count(n, ['caja', 'cajas'], ['box', 'boxes']);
const bags = (n: number) => count(n, ['bolsita', 'bolsitas'], ['bag', 'bags']);
const loose = (n: number) => count(n, ['gema suelta', 'gemas sueltas'], ['loose gem', 'loose gems']);

const ITEMS = [
  { costs: T('La soga cuesta', 'The rope costs'), price: T('el precio de la soga', 'The rope’s price') },
  { costs: T('La canasta cuesta', 'The basket costs'), price: T('el precio de la canasta', 'The basket’s price') },
  { costs: T('El sombrero cuesta', 'The hat costs'), price: T('el precio del sombrero', 'The hat’s price') },
  { costs: T('El mapa cuesta', 'The map costs'), price: T('el precio del mapa', 'The map’s price') },
];

/** Three different digits 2–9, so every digit appears once and plurals stay regular. */
const threeDigits = (r: Rng) => { const [h, t, o] = r.shuffle([2, 3, 4, 5, 6, 7, 8, 9]); return { h, t, o, n: h * 100 + t * 10 + o }; };

const PLACES = [
  { at: 'h' as const, unit: 100, es: 'cajas de cien', en: 'boxes of one hundred', esOne: 'cajas', enOne: 'boxes' },
  { at: 't' as const, unit: 10, es: 'bolsitas de diez', en: 'bags of ten', esOne: 'bolsitas', enOne: 'bags' },
  { at: 'o' as const, unit: 1, es: 'gemas sueltas', en: 'loose gems', esOne: 'gemas sueltas', enOne: 'loose gems' },
];

export const market: Record<string, [Generator, Generator]> = {
  'G02-01-L01': [
    r => {
      const item = r.pick(ITEMS), num = threeDigits(r), place = r.pick(PLACES), d = num[place.at];
      return typed(
        T(`${item.costs['es-AR']} ${num.n} gemas. ¿Cuánto vale el ${d}?`, `${item.costs['en-US']} ${num.n} gems. What is the ${d} worth?`),
        d * place.unit,
        place.unit === 1
          ? T(`El ${d} cuenta gemas sueltas: son ${d} gemas.`, `The ${d} counts loose gems: that is ${d} gems.`)
          : T(`El ${d} cuenta ${place.es}: ${d} ${place.esOne} son ${d * place.unit} gemas.`, `The ${d} counts ${place.en}: ${d} ${place.enOne} are ${d * place.unit} gems.`),
        T(`Buscá la columna del ${d} en ${num.n}. ¿Cuenta cajas, bolsitas o gemas sueltas?`, `Find the column with the ${d} in ${num.n}. Does it count boxes, bags, or loose gems?`),
        { unit: GEMS, model: num.n, reward: T(`Se ve ${item.price['es-AR']}: ${num.h * 100} + ${num.t * 10} + ${num.o}.`, `${item.price['en-US']} shows again: ${num.h * 100} + ${num.t * 10} + ${num.o}.`) },
      );
    },
    r => {
      const d = r.int(2, 9), n = d * 111, form = r.int(0, 3);
      const hint = T(`Tocá cada ${d} de ${n}. Mirá en qué columna está.`, `Tap each ${d} in ${n}. Look at which column it is in.`);
      const prompt = (es: string, en: string) => T(`El mapa cuesta ${n} gemas. ${es}`, `The map costs ${n} gems. ${en}`);
      if (form === 0) return choose(r,
        prompt(`¿Por qué un ${d} vale ${d * 100}, otro ${d * 10} y otro ${d}?`, `Why is one ${d} worth ${d * 100}, another ${d * 10}, and another ${d}?`),
        T('Porque importa el lugar de la cifra', 'Because the digit’s place matters'),
        [T(`Porque todos los ${d} valen lo mismo`, `Because all the ${d}s are worth the same`), T(`Porque se suman: ${d} + ${d} + ${d} = ${3 * d}`, `Because they add up: ${d} + ${d} + ${d} = ${3 * d}`)],
        T(`Un ${d} cuenta cajas, otro bolsitas y otro gemas sueltas: ${d * 100}, ${d * 10} y ${d}.`, `One ${d} counts boxes, one counts bags, and one counts loose gems: ${d * 100}, ${d * 10}, and ${d}.`),
        hint, { model: n });
      const place = PLACES[form - 1];
      const where = [T('de la izquierda', 'on the left'), T('del medio', 'in the middle'), T('de la derecha', 'on the right')][form - 1];
      return chooseNumber(r,
        prompt(`¿Cuánto vale el ${d} ${where['es-AR']}?`, `What is the ${d} ${where['en-US']} worth?`),
        d * place.unit, [d * 100, d * 10, d],
        T(`El ${d} ${where['es-AR']} cuenta ${place.es}: vale ${d * place.unit}.`, `The ${d} ${where['en-US']} counts ${place.en}: it is worth ${d * place.unit}.`),
        hint, { model: n });
    },
  ],
  'G02-01-L02': [
    r => {
      const h = r.int(7, 9), zero = r.int(0, 2);
      const t = zero === 0 ? 0 : r.int(1, 9), o = zero === 1 ? 0 : r.int(1, 9), n = h * 100 + t * 10 + o;
      const words = numberWords(n);
      return typed(
        T(`El vendedor de llaves dice: «${words['es-AR']}». ¿Cómo se escribe?`, `The key seller says: “${words['en-US']}.” How do you write it?`),
        n,
        T(`Son ${boxes(h)['es-AR']}, ${bags(t)['es-AR']} y ${loose(o)['es-AR']}: ${n}.`, `It is ${boxes(h)['en-US']}, ${bags(t)['en-US']}, and ${loose(o)['en-US']}: ${n}.`),
        T('Escribí primero las cajas, después las bolsitas y al final las sueltas. Si no hay, escribí 0.', 'Write the boxes first, then the bags, then the loose gems. If there are none, write 0.'),
        { reward: T(`La llave cuesta ${n}. Es más que 700: no alcanza.`, `The key costs ${n}. That is more than 700: not enough.`) },
      );
    },
    r => {
      const h = r.int(2, 9), noBags = r.int(0, 1) === 0;
      const t = noBags ? 0 : r.int(1, 9), o = noBags ? r.int(1, 9) : 0, n = h * 100 + t * 10 + o;
      const NO_BAGS = T('Que no hay bolsitas', 'That there are no bags'), NO_LOOSE = T('Que no hay gemas sueltas', 'That there are no loose gems');
      const correct = noBags ? NO_BAGS : NO_LOOSE;
      const without = noBags ? h * 10 + o : h * 10 + t;
      const paid = noBags
        ? T(`{name} paga ${boxes(h)['es-AR']} y ${loose(o)['es-AR']}.`, `{name} pays ${boxes(h)['en-US']} and ${loose(o)['en-US']}.`)
        : T(`{name} paga ${boxes(h)['es-AR']} y ${bags(t)['es-AR']}.`, `{name} pays ${boxes(h)['en-US']} and ${bags(t)['en-US']}.`);
      return choose(r,
        T(`El farol mágico cuesta ${n} gemas. ¿Qué indica el 0?`, `The magic lantern costs ${n} gems. What does the 0 show?`),
        correct, [noBags ? NO_LOOSE : NO_BAGS, T('Que no hay cajas', 'That there are no boxes'), T('Nada, se puede borrar', 'Nothing, it can be erased')],
        T(`${n} = ${h * 100} + ${t * 10} + ${o}. Sin el 0 sería ${without}.`, `${n} = ${h * 100} + ${t * 10} + ${o}. Without the 0 it would be ${without}.`),
        T(`Separá ${n} en cajas, bolsitas y sueltas. ¿Dónde está el 0?`, `Split ${n} into boxes, bags, and loose gems. Where is the 0?`),
        { reward: T(`${paid['es-AR']} El farol muestra un candado en la jaula.`, `${paid['en-US']} The lantern shows a lock on the cage.`) },
      );
    },
  ],
  'G02-01-L03': [
    r => {
      const h = r.int(1, 9), [a, b, c] = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]), d = r.int(0, 9);
      const numbers = [h * 100 + a * 10 + b, h * 100 + b * 10 + a, h * 100 + c * 10 + d];
      const greatest = r.int(0, 1) === 0;
      const target = greatest ? Math.max(...numbers) : Math.min(...numbers);
      const tens = digits(target).t;
      return chooseNumber(r,
        T(`El candado muestra ${numbers.join(', ')}. ¿Cuál es el ${greatest ? 'mayor' : 'menor'}?`, `The lock shows ${numbers.join(', ')}. Which is the ${greatest ? 'greatest' : 'smallest'}?`),
        target, numbers,
        T(`Las cajas son iguales: ${h}. Después miramos las bolsitas: ${tens} es lo que ${greatest ? 'más' : 'menos'} hay.`, `The boxes are equal: ${h}. Then we look at the bags: ${tens} is the ${greatest ? 'most' : 'fewest'}.`),
        T('Las cajas son iguales. Ahora compará las bolsitas de los tres números.', 'The boxes are equal. Now compare the bags of all three numbers.'),
      );
    },
    r => {
      const x = r.int(2, 8), low = x * 100 + 99, high = (x + 1) * 100, form = r.int(0, 2);
      if (form === 0) return choose(r,
        T(`El mago pide un número menor que ${high}. ¿Por qué ${low} es menor que ${high}?`, `The wizard asks for a number less than ${high}. Why is ${low} less than ${high}?`),
        T(`${low} tiene ${x} cajas y ${high} tiene ${x + 1}`, `${low} has ${x} boxes and ${high} has ${x + 1}`),
        [T(`${low} tiene más nueves`, `${low} has more nines`), T(`Porque ${high} termina en 0`, `Because ${high} ends in 0`)],
        T(`Primero miramos las cajas: ${x} es menos que ${x + 1}.`, `We look at the boxes first: ${x} is less than ${x + 1}.`),
        T(`Contá una gema más después de ${low}. ¿Qué número sale?`, `Count one more gem after ${low}. What number do you get?`));
      if (form === 1) return chooseNumber(r,
        T(`El mago pide un número menor que ${high}. ¿Cuál sirve?`, `The wizard asks for a number less than ${high}. Which one works?`),
        low, [high + 1, high + 10, high + 9],
        T(`${low} tiene ${x} cajas. Los otros tienen ${x + 1}: son mayores.`, `${low} has ${x} boxes. The others have ${x + 1}: they are greater.`),
        T('Mirá primero las cajas de cada número.', 'Look at the boxes of each number first.'));
      return chooseNumber(r,
        T(`¿Qué número viene justo después de ${low}?`, `Which number comes right after ${low}?`),
        high, [x * 1000 + 100, x * 100 + 90, low + 10],
        T(`${low} + 1 = ${high}. Las 9 bolsitas y 9 sueltas forman otra caja.`, `${low} + 1 = ${high}. The 9 bags and 9 loose gems make another box.`),
        T(`Contá una gema más después de ${low}. ¿Qué número sale?`, `Count one more gem after ${low}. What number do you get?`));
    },
  ],
  'G02-02-L01': [
    r => {
      const { h, t, o, n } = threeDigits(r);
      if (r.int(0, 1) === 0) return choose(r,
        T(`La caja pide ${n} gemas. ¿Qué suma es ${n}?`, `The box asks for ${n} gems. Which sum is ${n}?`),
        T(`${h * 100} + ${t * 10} + ${o}`, `${h * 100} + ${t * 10} + ${o}`),
        [T(`${h * 10} + ${t * 10} + ${o}`, `${h * 10} + ${t * 10} + ${o}`), T(`${h} + ${t} + ${o}`, `${h} + ${t} + ${o}`), T(`${h * 100} + ${t} + ${o}`, `${h * 100} + ${t} + ${o}`)],
        T(`${boxes(h)['es-AR']} son ${h * 100}, ${bags(t)['es-AR']} son ${t * 10} y hay ${o} sueltas.`, `${boxes(h)['en-US']} are ${h * 100}, ${bags(t)['en-US']} are ${t * 10}, and ${o} are loose.`),
        T(`En ${n}, mirá cuánto vale cada cifra antes de sumar.`, `In ${n}, look at what each digit is worth before adding.`));
      return chooseNumber(r,
        T(`Las ventanitas muestran ${h * 100} + ${t * 10} + ${o}. ¿Cuántas gemas son?`, `The windows show ${h * 100} + ${t * 10} + ${o}. How many gems is that?`),
        n, [h * 100 + o * 10 + t, h + t + o, h * 100 + t + o],
        T(`${h} cajas, ${t} bolsitas y ${o} sueltas: ${n}.`, `${h} boxes, ${t} bags, and ${o} loose: ${n}.`),
        T('Escribí las cajas, después las bolsitas y al final las sueltas.', 'Write the boxes, then the bags, then the loose gems.'), { unit: ['gemas', 'gems'] });
    },
    r => {
      const h = r.int(2, 9), noBags = r.int(0, 1) === 0, d = r.int(1, 9);
      const n = noBags ? h * 100 + d : h * 100 + d * 10, part = noBags ? d : d * 10;
      const NO_BAGS = T('Porque no hay bolsitas', 'Because there are no bags'), NO_LOOSE = T('Porque no hay gemas sueltas', 'Because there are no loose gems');
      return choose(r,
        T(`Ahora pide ${n} gemas. ¿Por qué es ${h * 100} + ${part}?`, `Now it asks for ${n} gems. Why is it ${h * 100} + ${part}?`),
        noBags ? NO_BAGS : NO_LOOSE,
        [noBags ? NO_LOOSE : NO_BAGS, T('Porque no hay cajas', 'Because there are no boxes'), T(`Porque hay que poner ${h * 10} + ${d}`, `Because you must put ${h * 10} + ${d}`)],
        noBags ? T(`El 0 dice que hay 0 bolsitas: ${h * 100} + 0 + ${d}.`, `The 0 says there are 0 bags: ${h * 100} + 0 + ${d}.`) : T(`El 0 dice que hay 0 sueltas: ${h * 100} + ${d * 10} + 0.`, `The 0 says there are 0 loose gems: ${h * 100} + ${d * 10} + 0.`),
        T(`Armá ${n} con cajas, bolsitas y sueltas. ¿Qué no necesitás?`, `Build ${n} with boxes, bags, and loose gems. What do you not need?`),
        { reward: noBags ? T('La segunda ventanita se cierra. No hizo falta abrir ninguna bolsita.', 'The second little window closes. No bag had to be opened.') : T('La segunda ventanita se cierra. No hizo falta ninguna gema suelta.', 'The second little window closes. No loose gems were needed.') });
    },
  ],
  'G02-02-L02': [
    r => {
      const k = r.int(2, 9);
      return typed(
        T(`En el mercado cambian ${k} cajas de 100. ¿Cuántas bolsitas de 10 dan?`, `At the market they trade ${k} boxes of 100. How many bags of 10 do they give?`),
        k * 10,
        T(`Cada caja son 10 bolsitas. ${k} cajas son ${k * 10} bolsitas.`, `Each box is 10 bags. ${k} boxes are ${k * 10} bags.`),
        T(`Contá de 10 en 10 hasta ${k * 100}. Marcá una bolsita en cada paso.`, `Count by 10s up to ${k * 100}. Mark one bag at each step.`),
        { unit: T('bolsitas', 'bags'), reward: T(`{name} recibe ${k * 10} bolsitas por ${k} cajas.`, `{name} gets ${k * 10} bags for ${k} boxes.`) },
      );
    },
    r => {
      const h = r.int(2, 9), t = r.int(1, 8), total = h * 100 + t * 10, form = r.int(0, 2);
      const second = [(t + 10) * 10, t * 10, (t + 20) * 10][form];
      const now = (h - 1) * 100 + second;
      const options = [T('Sí, una caja se volvió 10 bolsitas', 'Yes, one box became 10 bags'), T('No, se perdieron 100', 'No, 100 got lost'), T('No, ahora hay 100 más', 'No, now there are 100 more')];
      return choose(r,
        T(`Antes había ${h * 100} + ${t * 10}. Ahora hay ${(h - 1) * 100} + ${second}. ¿Siguen siendo ${total}?`, `Before there were ${h * 100} + ${t * 10}. Now there are ${(h - 1) * 100} + ${second}. Is it still ${total}?`),
        options[form], options.filter((_, i) => i !== form),
        T(`${h * 100} + ${t * 10} = ${total} y ${(h - 1) * 100} + ${second} = ${now}.`, `${h * 100} + ${t * 10} = ${total} and ${(h - 1) * 100} + ${second} = ${now}.`),
        T(`Juntá ${(h - 1) * 100} y ${second}. Compará con ${total}.`, `Put ${(h - 1) * 100} and ${second} together. Compare with ${total}.`));
    },
  ],
  'G02-02-L03': [
    r => {
      const h = r.int(2, 9), t = r.int(1, 8), o = r.int(1, 9), n = h * 100 + t * 10 + o;
      return choose(r,
        T(`El espejo izquierdo dice ${n} = ${h * 100} + ${t * 10} + ${o}. ¿Qué va en el derecho?`, `The left mirror says ${n} = ${h * 100} + ${t * 10} + ${o}. What goes in the right one?`),
        T(`${(h - 1) * 100} + ${t * 10 + 100} + ${o}`, `${(h - 1) * 100} + ${t * 10 + 100} + ${o}`),
        [T(`${(h - 1) * 100} + ${t * 10} + ${o}`, `${(h - 1) * 100} + ${t * 10} + ${o}`), T(`${h * 100} + ${t * 10 + 100} + ${o}`, `${h * 100} + ${t * 10 + 100} + ${o}`), T(`${(h - 1) * 100} + ${t + 10} + ${o}`, `${(h - 1) * 100} + ${t + 10} + ${o}`)],
        T(`Una caja pasó a las bolsitas: ${t * 10} + 100 = ${t * 10 + 100}.`, `One box moved to the bags: ${t * 10} + 100 = ${t * 10 + 100}.`),
        T(`Abrí una de las ${h} cajas de ${n}. ¿Adónde van sus 10 bolsitas?`, `Open one of the ${h} boxes in ${n}. Where do its 10 bags go?`));
    },
    r => {
      const h = r.int(2, 9), t = r.int(1, 8), o = r.int(1, 9), n = h * 100 + t * 10 + o, form = r.int(0, 2);
      const second = [t * 10 + 100, t * 10, t * 10 + 200][form];
      const other = (h - 1) * 100 + second + o;
      const options = [T(`Sí, los dos son ${n}`, `Yes, both are ${n}`), T('No, el segundo tiene 100 menos', 'No, the second has 100 fewer'), T('No, el segundo tiene 100 más', 'No, the second has 100 more')];
      return choose(r,
        T(`¿${h * 100} + ${t * 10} + ${o} y ${(h - 1) * 100} + ${second} + ${o} son el mismo número?`, `Are ${h * 100} + ${t * 10} + ${o} and ${(h - 1) * 100} + ${second} + ${o} the same number?`),
        options[form], options.filter((_, i) => i !== form),
        T(`El primero es ${n} y el segundo es ${other}.`, `The first is ${n} and the second is ${other}.`),
        T('Mirá cuánto baja la primera parte y cuánto sube la segunda.', 'Look at how much the first part goes down and the second goes up.'));
    },
  ],
};
