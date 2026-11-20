// Chapter 4 — Crystal Mine (G02-07, G02-08): equal groups, multiplication as
// repeated addition, and the two meanings of division (sharing and grouping).
import { T, choose, typed, type Generator } from './kit';

const repeat = (part: number, times: number) => Array(times).fill(part).join(' + ');

export const mine: Record<string, [Generator, Generator]> = {
  'G02-07-L01': [
    r => {
      const carts = r.int(2, 6), each = r.int(2, 6);
      return typed(
        T(`Hay ${carts} carritos con ${each} cristales cada uno. ¿Cuántos cristales hay?`, `There are ${carts} carts with ${each} crystals each. How many crystals are there?`),
        carts * each,
        T(`${repeat(each, carts)} = ${carts * each}.`, `${repeat(each, carts)} = ${carts * each}.`),
        T(`Dibujá ${carts} carritos. Poné ${each} puntos en cada uno y contalos.`, `Draw ${carts} carts. Put ${each} dots in each and count them.`),
        { unit: T('cristales', 'crystals') },
      );
    },
    r => {
      const a = r.int(2, 6), equal = r.int(0, 1) === 0;
      const [b, c] = equal ? [a, a] : r.shuffle([1, 2, 3, 4, 5, 6, 7].filter(n => n !== a)).slice(0, 2);
      const options = equal
        ? [T(`Sí, todos tienen ${a}`, `Yes, they all have ${a}`), T('No, los carritos no tienen lo mismo', 'No, the carts do not have the same amount'), T('No, nunca se puede', 'No, we never can')]
        : [T('No, los carritos no tienen lo mismo', 'No, the carts do not have the same amount'), T('Sí, porque son 3 carritos', 'Yes, because there are 3 carts'), T('Sí, siempre se puede', 'Yes, we always can')];
      return choose(r,
        T(`Un carrito tiene ${a} cristales, otro ${b} y otro ${c}. ¿Podemos contar «${a} en cada carrito»?`, `One cart has ${a} crystals, another ${b}, and another ${c}. Can we count “${a} in each cart”?`),
        options[0], options.slice(1),
        T('Solo con grupos iguales repetimos la misma cantidad.', 'Only with equal groups do we repeat the same amount.'),
        T('Mirá cada carrito. ¿Tienen todos la misma cantidad?', 'Look at each cart. Do they all have the same amount?'));
    },
  ],
  'G02-07-L02': [
    r => {
      const [groups, each] = r.shuffle([2, 3, 4, 5, 6]).slice(0, 2);
      return choose(r,
        T(`¿Qué multiplicación es ${repeat(each, groups)}?`, `Which multiplication is ${repeat(each, groups)}?`),
        T(`${groups} × ${each}`, `${groups} × ${each}`),
        [T(`${groups} + ${each}`, `${groups} + ${each}`), T(`${each} × ${each}`, `${each} × ${each}`)],
        T(`El ${each} aparece ${groups} veces: son ${groups} grupos de ${each}.`, `${each} appears ${groups} times: that is ${groups} groups of ${each}.`),
        T(`Contá cuántas veces aparece el ${each}. Ese número cuenta los grupos.`, `Count how many times ${each} appears. That number counts the groups.`));
    },
    r => {
      const [rows, each] = r.shuffle([2, 3, 4, 5, 6, 7, 8]).slice(0, 2), askRows = r.int(0, 1) === 0, asked = askRows ? rows : each;
      const ROWS = T('Las filas', 'The rows'), ONE_ROW = T('Los faroles de una fila', 'The lanterns in one row');
      return choose(r,
        T(`En el techo hay ${rows} filas de ${each} faroles: ${rows} × ${each}. ¿Qué cuenta el ${asked}?`, `On the ceiling there are ${rows} rows of ${each} lanterns: ${rows} × ${each}. What does the ${asked} count?`),
        askRows ? ROWS : ONE_ROW, [askRows ? ONE_ROW : ROWS, T('Todos los faroles', 'All the lanterns')],
        T(`El ${rows} cuenta filas. El ${each} cuenta los faroles de cada fila.`, `The ${rows} counts rows. The ${each} counts the lanterns in each row.`),
        T(`Dibujá ${rows} filas con ${each} faroles cada una. Señalá qué cuenta el ${asked}.`, `Draw ${rows} rows with ${each} lanterns each. Point to what the ${asked} counts.`));
    },
  ],
  'G02-07-L03': [
    r => {
      const per = r.pick([2, 5, 10]), boxes = r.int(2, 9);
      return typed(
        T(`Cada caja trae ${per} cristales. ¿Cuántos hay en ${boxes} cajas?`, `Each box holds ${per} crystals. How many are in ${boxes} boxes?`),
        per * boxes,
        T(`${boxes} × ${per} = ${per * boxes}: contamos de ${per} en ${per}.`, `${boxes} × ${per} = ${per * boxes}: we count by ${per}s.`),
        T(`Dibujá ${boxes} cajas con ${per} cristales cada una. Contá de ${per} en ${per}.`, `Draw ${boxes} boxes with ${per} crystals each. Count by ${per}s.`),
        { unit: T('cristales', 'crystals') },
      );
    },
    r => {
      const per = r.pick([2, 3, 4, 5]), boxes = r.int(2, 4);
      return choose(r,
        T(`Con ${boxes} cajas de ${per} hay ${boxes * per} cristales. ¿Por qué con ${2 * boxes} cajas hay ${2 * boxes * per}?`, `With ${boxes} boxes of ${per} there are ${boxes * per} crystals. Why are there ${2 * boxes * per} with ${2 * boxes} boxes?`),
        T(`Hay el doble de cajas y cada una tiene ${per}`, `There are twice as many boxes and each holds ${per}`),
        [T('En las tablas siempre pasa eso', 'That always happens in tables'), T(`Porque sumamos ${boxes} cristales más`, `Because we add ${boxes} more crystals`)],
        T('Dos veces las mismas cajas tienen dos veces los mismos cristales.', 'Twice the same boxes hold twice the same crystals.'),
        T(`Copiá las ${boxes} cajas una vez más. ¿También copiaste sus cristales?`, `Copy the ${boxes} boxes once more. Did you also copy their crystals?`));
    },
  ],
  'G02-08-L01': [
    r => {
      const flies = r.int(2, 5), each = r.int(2, 8);
      return typed(
        T(`Hay ${flies * each} cristales para ${flies} luciérnagas. ¿Cuántos recibe cada una?`, `There are ${flies * each} crystals for ${flies} fireflies. How many does each get?`),
        each,
        T(`${flies} grupos de ${each} forman ${flies * each}.`, `${flies} groups of ${each} make ${flies * each}.`),
        T(`Prepará ${flies} lugares. Repartí los ${flies * each} cristales de a uno en cada lugar.`, `Make ${flies} places. Share the ${flies * each} crystals, one at a time in each place.`),
        { unit: T('cristales', 'crystals') },
      );
    },
    r => {
      const [flies, each] = r.shuffle([2, 3, 4, 5, 6]).slice(0, 2), total = flies * each, ask = r.int(0, 2);
      const meanings = [T('Los cristales de cada luciérnaga', 'The crystals each firefly gets'), T('La cantidad de luciérnagas', 'The number of fireflies'), T('Todos los cristales', 'All the crystals')];
      const asked = [each, flies, total][ask];
      return choose(r,
        T(`Repartimos ${total} cristales entre ${flies} luciérnagas: ${total} ÷ ${flies} = ${each}. ¿Qué cuenta el ${asked}?`, `We share ${total} crystals among ${flies} fireflies: ${total} ÷ ${flies} = ${each}. What does the ${asked} count?`),
        meanings[ask], meanings.filter((_, i) => i !== ask),
        T(`${total} son todos los cristales, ${flies} son las luciérnagas y ${each} es la parte de cada una.`, `${total} is all the crystals, ${flies} is the fireflies, and ${each} is each one’s share.`),
        T('Leé la historia otra vez. Buscá dónde aparece ese número.', 'Read the story again. Find where that number appears.'));
    },
  ],
  'G02-08-L02': [
    r => {
      const per = r.pick([2, 3, 4, 5]), carts = r.int(2, 8);
      return typed(
        T(`Hay ${per * carts} cristales. En cada carrito van ${per}. ¿Cuántos carritos llenamos?`, `There are ${per * carts} crystals. ${per} go in each cart. How many carts do we fill?`),
        carts,
        T(`${carts} grupos de ${per} usan los ${per * carts} cristales.`, `${carts} groups of ${per} use all ${per * carts} crystals.`),
        T(`Separá ${per} cristales para cada carrito hasta usar los ${per * carts}.`, `Set aside ${per} crystals for each cart until all ${per * carts} are used.`),
        { unit: T('carritos', 'carts') },
      );
    },
    r => {
      const [per, carts] = r.shuffle([2, 3, 4, 5, 6]).slice(0, 2), askCarts = r.int(0, 1) === 0, asked = askCarts ? carts : per;
      const CARTS = T('Los carritos llenos', 'The full carts'), ONE = T('Los cristales de un carrito', 'The crystals in one cart');
      return choose(r,
        T(`Hay ${per * carts} cristales. Van ${per} en cada carrito y llenamos ${carts}. ¿Qué cuenta el ${asked}?`, `There are ${per * carts} crystals. ${per} go in each cart, and we fill ${carts}. What does the ${asked} count?`),
        askCarts ? CARTS : ONE, [askCarts ? ONE : CARTS, T('Todos los cristales', 'All the crystals')],
        T(`El ${carts} cuenta carritos. El ${per} cuenta lo que entra en cada uno.`, `The ${carts} counts carts. The ${per} counts what fits in each one.`),
        T('Señalá un solo carrito. ¿Cuántos cristales tiene?', 'Point to just one cart. How many crystals does it have?'));
    },
  ],
  'G02-08-L03': [
    r => {
      const [per, bags] = r.shuffle([2, 3, 4, 6, 8]).slice(0, 2), total = per * bags, askBags = r.int(0, 1) === 0, asked = askBags ? bags : per;
      const options = askBags
        ? [T(`${bags} bolsitas`, `${bags} bags`), T(`${bags} cristales en cada bolsita`, `${bags} crystals in each bag`), T(`${bags} cristales en total`, `${bags} crystals in all`)]
        : [T(`${per} cristales en cada bolsita`, `${per} crystals in each bag`), T(`${per} bolsitas`, `${per} bags`), T(`${per} cristales en total`, `${per} crystals in all`)];
      return choose(r,
        T(`Primera cerradura: ${total} cristales en bolsitas de ${per}. Salen ${bags} bolsitas. ¿Qué significa el ${asked}?`, `First lock: ${total} crystals in bags of ${per}. We get ${bags} bags. What does the ${asked} mean?`),
        options[0], options.slice(1),
        T(`Van ${per} en cada bolsita y salen ${bags} bolsitas: ${bags} × ${per} = ${total}.`, `${per} go in each bag, and we get ${bags} bags: ${bags} × ${per} = ${total}.`),
        T(`Poné ${per} cristales en cada bolsita. Al final, contá las bolsitas.`, `Put ${per} crystals in each bag. At the end, count the bags.`));
    },
    r => {
      const [gnomes, each] = r.shuffle([2, 3, 4, 6, 8]).slice(0, 2), total = gnomes * each, askEach = r.int(0, 1) === 0, asked = askEach ? each : gnomes;
      const EACH = T('Lo que recibe cada gnomo', 'What each gnome gets'), GNOMES = T('Los gnomos', 'The gnomes');
      return choose(r,
        T(`Segunda cerradura: ${total} cristales para ${gnomes} gnomos. Cada uno recibe ${each}. ¿Qué cuenta el ${asked}?`, `Second lock: ${total} crystals for ${gnomes} gnomes. Each gets ${each}. What does the ${asked} count?`),
        askEach ? EACH : GNOMES, [askEach ? GNOMES : EACH, T('Las bolsitas', 'The bags')],
        T(`Ya sabíamos que eran ${gnomes} gnomos. El ${each} es la parte de cada uno.`, `We already knew there were ${gnomes} gnomes. The ${each} is each one’s share.`),
        T(`Leé la cerradura. ¿El ${asked} cuenta gnomos o cristales?`, `Read the lock. Does the ${asked} count gnomes or crystals?`));
    },
  ],
};
