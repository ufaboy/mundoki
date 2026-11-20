// Chapter 5 — Water, light, and colour (G03-07, G03-08): cables and water with
// mental strategies (round and compensate), estimates of products, choosing the
// operation, multi-step plans, and a table of equal boxes.
import { T, choose, chooseNumber, typed, L, oneOf, type Generator } from './kit';

export const services: Record<string, [Generator, Generator]> = {
  'G03-07-L01': [
    r => {
      const d = r.int(1, 2), round = r.pick([r.int(3, 9) * 10, r.int(1, 4) * 100]), a = round - d, b = r.int(12, 68), sum = a + b;
      return typed(
        T(`Una habitación necesita ${a} m de cable y la siguiente ${b} m. ¿Cuántos metros son en total?`, `One room needs ${a} m of cable and the next ${b} m. How many metres is that in all?`),
        sum,
        T(`${a} + ${d} = ${round} y ${b} − ${d} = ${b - d}: ${round} + ${b - d} = ${sum} m.`, `${a} + ${d} = ${round} and ${b} − ${d} = ${b - d}: ${round} + ${b - d} = ${sum} m.`),
        T(`Pasá ${d} m de ${b} a ${a} para llegar a ${round}.`, `Move ${d} m from ${b} to ${a} to reach ${round}.`),
        { unit: T('m', 'm'), reward: T(`El cable de ${sum} m queda cortado a medida.`, `The ${sum} m cable is cut to size.`) },
      );
    },
    r => {
      const d = r.int(1, 3), round = r.int(2, 6) * 100, a = round - d, b = r.int(21, 79);
      const kind = r.pick(['pass', 'add', 'take'] as const);
      const other = kind === 'pass' ? b - d : kind === 'add' ? b : b - 2 * d;
      const PASS = T(`Da lo mismo: pasan ${d} m de una parte a la otra`, `It is the same: ${d} m move from one part to the other`);
      const ADD = T(`No da lo mismo: se agregan ${d} m al total`, `It is not the same: ${d} m are added to the total`);
      const TAKE = T(`No da lo mismo: se quitan ${d} m del total`, `It is not the same: ${d} m are taken from the total`);
      const right = kind === 'pass' ? PASS : kind === 'add' ? ADD : TAKE;
      return choose(r,
        T(`Rosa calcula ${a} m + ${b} m como ${round} m + ${other} m. ¿Da lo mismo?`, `Rosa calculates ${a} m + ${b} m as ${round} m + ${other} m. Is it the same?`),
        right, [PASS, ADD, TAKE].filter(o => o !== right),
        T(`${a} gana ${d}. ${b} pasa a ${other}. El total era ${a + b} m y ahora es ${round + other} m.`, `${a} gains ${d}. ${b} becomes ${other}. The total was ${a + b} m and now it is ${round + other} m.`),
        T(`Mirá qué pasa con ${a} y qué pasa con ${b}. ¿El total cambia?`, `Look at what happens to ${a} and to ${b}. Does the total change?`));
    },
  ],
  'G03-07-L02': [
    r => {
      const n = r.int(2, 9) * 10 + r.pick([-1, 1]), k = r.int(3, 9), round = Math.round(n / 10) * 10, est = round * k;
      return chooseNumber(r,
        T(`Cada uno de los ${k} cuartos necesita ${n} m de cable. ¿Qué estimación sirve para ${n} × ${k}?`, `Each of the ${k} rooms needs ${n} m of cable. Which estimate works for ${n} × ${k}?`),
        est, [est * 10, n + k, round + k],
        T(`${n} está cerca de ${round}, y ${round} × ${k} = ${est} m.`, `${n} is close to ${round}, and ${round} × ${k} = ${est} m.`),
        T(`Usá ${round} m en lugar de ${n} m y repetilo ${k} veces.`, `Use ${round} m instead of ${n} m and repeat it ${k} times.`),
        { unit: ['m', 'm'], reward: T(`Unos ${est} m de cable: ya sabemos cuánto comprar.`, `About ${est} m of cable: now we know how much to buy.`) });
    },
    r => {
      const shift = r.pick([-2, -1, 1, 2]), round = r.int(3, 9) * 10, n = round + shift, k = r.int(3, 9), est = round * k;
      const above = round > n;
      const ABOVE = L('Por encima|Above'), BELOW = L('Por debajo|Below'), SAME = L('Justo igual|Exactly the same');
      return choose(r,
        T(`Para estimar ${n} × ${k} usamos ${round} en lugar de ${n}. ¿La estimación queda por encima o por debajo de lo que hace falta?`, `To estimate ${n} × ${k} we used ${round} instead of ${n}. Is the estimate above or below what is needed?`),
        above ? ABOVE : BELOW, above ? [BELOW, SAME] : [ABOVE, SAME],
        above
          ? T(`${round} es más que ${n}, así que hace falta menos de ${est} m.`, `${round} is more than ${n}, so less than ${est} m is needed.`)
          : T(`${round} es menos que ${n}, así que hace falta un poco más de ${est} m.`, `${round} is less than ${n}, so a little more than ${est} m is needed.`),
        T(`Compará ${n} con ${round}. ¿Cuál es más grande?`, `Compare ${n} with ${round}. Which is bigger?`),
        { reward: above ? T(`Hacen falta menos de ${est} m de cable.`, `Less than ${est} m of cable is needed.`) : T(`Hacen falta un poco más de ${est} m de cable.`, `A little more than ${est} m of cable is needed.`) });
    },
  ],
  'G03-07-L03': [
    r => {
      const d = r.int(1, 3), hundreds = r.int(1, 3), used = hundreds * 100 - d, tank = r.int(hundreds + 1, 9) * 100, left = tank - used;
      return typed(
        T(`El tanque tiene ${tank} litros. El baño usa ${used}. Calculá ${tank} − ${used} con el truco de restar ${hundreds * 100}. ¿Cuántos litros quedan?`, `The tank has ${tank} litres. The bathroom uses ${used}. Work out ${tank} − ${used} with the take-away-${hundreds * 100} trick. How many litres are left?`),
        left,
        T(`${tank} − ${hundreds * 100} = ${tank - hundreds * 100}. Quitamos ${d} de más, así que los devolvemos: ${left} litros.`, `${tank} − ${hundreds * 100} = ${tank - hundreds * 100}. We took ${d} too many, so we give them back: ${left} litres.`),
        T(`Sacá ${hundreds * 100} litros de ${tank}. ¿Cuánto sacaste de más?`, `Take ${hundreds * 100} litres away from ${tank}. How much did you take too many?`),
        { unit: T('litros', 'litres'), reward: T(`¡El agua corre! Quedan ${left} litros en el tanque.`, `The water runs! ${left} litres are left in the tank.`) },
      );
    },
    r => {
      const d = r.int(1, 3), round = r.int(1, 3) * 100, on = round - d, total = r.int(4, 9) * 100, right = r.int(0, 1) === 0;
      const sign = right ? '+' : '−';
      const GIVE = T(`Sirve: quita ${d} de más y después los devuelve`, `It works: she takes ${d} too many and then gives them back`);
      const WRONG = T(`No sirve: tenía que devolver los ${d}, no quitarlos`, `It does not work: she had to give the ${d} back, not take them away`);
      const ANY = L('Sirve: se puede cambiar cualquier número para terminar antes|It works: any number can be changed to finish faster');
      return choose(r,
        T(`Había ${total} azulejos y ${on} ya están en la pared. La abuela Tita calcula ${total} − ${round} ${sign} ${d}. ¿Sirve?`, `There were ${total} tiles and ${on} are already on the wall. Abuela Tita calculates ${total} − ${round} ${sign} ${d}. Does it work?`),
        right ? GIVE : WRONG, right ? [WRONG, ANY] : [GIVE, ANY],
        T(`${round} es ${d} más que ${on}. Hay que devolver ${d}: ${total} − ${round} + ${d} = ${total - on} azulejos.`, `${round} is ${d} more than ${on}. We must give ${d} back: ${total} − ${round} + ${d} = ${total - on} tiles.`),
        T(`Compará ${round} con ${on}. ¿Cuántos azulejos de más quita la abuela?`, `Compare ${round} with ${on}. How many tiles too many does Abuela take?`));
    },
  ],
  'G03-08-L01': [
    r => {
      const reward = L('La cuenta de los azulejos queda anotada.|The tile calculation is written down.');
      const ops = (a: number, b: number) => ({ div: T(`${a} ÷ ${b}`, `${a} ÷ ${b}`), mul: T(`${a} × ${b}`, `${a} × ${b}`), add: T(`${a} + ${b}`, `${a} + ${b}`), sub: T(`${a} − ${b}`, `${a} − ${b}`) });
      return oneOf(r, [
        () => {
          const per = r.int(4, 9), boxes = r.int(6, 15), total = per * boxes, o = ops(total, per);
          return choose(r, T(`Hay ${total} azulejos. Se guardan ${per} en cada caja. ¿Qué cuenta da la cantidad de cajas?`, `There are ${total} tiles. ${per} go in each box. Which calculation gives the number of boxes?`),
            o.div, [o.add, o.mul, o.sub], T(`Armamos grupos de ${per} azulejos: ${total} ÷ ${per} = ${boxes} cajas.`, `We make groups of ${per} tiles: ${total} ÷ ${per} = ${boxes} boxes.`),
            T(`Imaginá armar cajas de ${per} azulejos hasta usar los ${total}.`, `Imagine filling boxes of ${per} tiles until all ${total} are used.`), { reward });
        },
        () => {
          const boxes = r.int(3, 9), per = r.int(12, 30), o = ops(boxes, per);
          return choose(r, T(`Llegan ${boxes} cajas con ${per} azulejos cada una. ¿Qué cuenta da los azulejos en total?`, `${boxes} boxes arrive with ${per} tiles each. Which calculation gives the tiles in all?`),
            o.mul, [o.add, o.div, o.sub], T(`${boxes} grupos de ${per}: ${boxes} × ${per} = ${boxes * per} azulejos.`, `${boxes} groups of ${per}: ${boxes} × ${per} = ${boxes * per} tiles.`),
            T(`Dibujá ${boxes} cajas y escribí ${per} en cada una.`, `Draw ${boxes} boxes and write ${per} in each.`), { reward });
        },
        () => {
          const total = r.int(60, 150), used = r.int(12, 48), o = ops(total, used);
          return choose(r, T(`Había ${total} azulejos y ya se pegaron ${used}. ¿Qué cuenta da los azulejos que quedan?`, `There were ${total} tiles and ${used} are already stuck on. Which calculation gives the tiles left?`),
            o.sub, [o.add, o.div, o.mul], T(`Quitamos los pegados: ${total} − ${used} = ${total - used} azulejos.`, `We take away the ones stuck on: ${total} − ${used} = ${total - used} tiles.`),
            T(`¿Los azulejos de la pared siguen en la pila o se fueron?`, `Are the tiles on the wall still in the pile, or are they gone?`), { reward });
        },
        () => {
          const total = r.int(40, 120), more = r.int(12, 48), o = ops(total, more);
          return choose(r, T(`Hay ${total} azulejos y llegan ${more} más. ¿Qué cuenta da los azulejos que hay ahora?`, `There are ${total} tiles and ${more} more arrive. Which calculation gives the tiles there are now?`),
            o.add, [o.sub, o.div, o.mul], T(`Juntamos los dos grupos: ${total} + ${more} = ${total + more} azulejos.`, `We put the two groups together: ${total} + ${more} = ${total + more} tiles.`),
            T(`¿Los azulejos que llegan se suman a la pila o salen de ella?`, `Do the arriving tiles join the pile or leave it?`), { reward });
        },
      ]);
    },
    r => {
      const TOTAL = L('Los azulejos en total|The tiles in all'), BOXES = L('La cantidad de cajas|The number of boxes'), ONE = L('Los azulejos de una caja|The tiles in one box');
      const boxes = r.int(3, 9), per = r.int(12, 30), total = boxes * per;
      const kind = r.pick(['mul', 'boxes', 'per'] as const);
      const right = kind === 'mul' ? TOTAL : kind === 'boxes' ? BOXES : ONE;
      return choose(r,
        kind === 'mul'
          ? T(`Llegan ${boxes} cajas con ${per} azulejos cada una. ¿Qué cuenta ${boxes} × ${per}?`, `${boxes} boxes arrive with ${per} tiles each. What does ${boxes} × ${per} count?`)
          : kind === 'boxes'
            ? T(`Hay ${total} azulejos y cada caja lleva ${per}. ¿Qué cuenta ${total} ÷ ${per}?`, `There are ${total} tiles and each box takes ${per}. What does ${total} ÷ ${per} count?`)
            : T(`Hay ${total} azulejos repartidos por igual en ${boxes} cajas. ¿Qué cuenta ${total} ÷ ${boxes}?`, `There are ${total} tiles shared equally into ${boxes} boxes. What does ${total} ÷ ${boxes} count?`),
        right, [TOTAL, BOXES, ONE].filter(o => o !== right),
        kind === 'mul'
          ? T(`${boxes} grupos de ${per} azulejos: ${total} azulejos en total.`, `${boxes} groups of ${per} tiles: ${total} tiles in all.`)
          : kind === 'boxes'
            ? T(`Armamos grupos de ${per}: salen ${boxes} cajas.`, `We make groups of ${per}: that makes ${boxes} boxes.`)
            : T(`Repartimos en ${boxes} cajas: cada caja lleva ${per} azulejos.`, `We share into ${boxes} boxes: each box takes ${per} tiles.`),
        T('Leé qué cuenta cada número: ¿cajas o azulejos?', 'Read what each number counts: boxes or tiles?'),
        { reward: L('El pedido de azulejos queda hecho.|The tile order is placed.') });
    },
  ],
  'G03-08-L02': [
    r => {
      let boxes = 0, shelves = 0, per = 0, hidden = 0;
      do { boxes = r.int(4, 9); shelves = r.int(3, 9); per = r.int(3, 9); hidden = boxes * 10 - shelves * per; } while (hidden < 2 || hidden > 9);
      const total = boxes * 10, left = total - hidden;
      return typed(
        T(`Hay ${boxes} cajas de 10 tornillos. Canela escondió ${hidden} en el pasto. Los demás van por igual en ${shelves} estantes. ¿Cuántos tornillos lleva cada estante?`, `There are ${boxes} boxes of 10 screws. Canela hid ${hidden} in the grass. The rest go equally on ${shelves} shelves. How many screws does each shelf get?`),
        per,
        T(`${boxes} × 10 = ${total}; ${total} − ${hidden} = ${left}; ${left} ÷ ${shelves} = ${per} tornillos.`, `${boxes} × 10 = ${total}; ${total} − ${hidden} = ${left}; ${left} ÷ ${shelves} = ${per} screws.`),
        T(`Contá todos los tornillos. Sacá los escondidos. Repartí el resto en ${shelves} estantes.`, `Count all the screws. Take away the hidden ones. Share the rest across ${shelves} shelves.`),
        { unit: T('tornillos', 'screws'), reward: T(`Cada estante recibe sus ${per} tornillos.`, `Every shelf gets its ${per} screws.`) },
      );
    },
    r => {
      let boxes = 0, shelves = 0, per = 0, hidden = 0;
      do { boxes = r.int(4, 9); shelves = r.int(3, 9); per = r.int(3, 9); hidden = boxes * 10 - shelves * per; } while (hidden < 2 || hidden > 9 || per === shelves || per === hidden || per === boxes);
      const total = boxes * 10, left = total - hidden;
      const ask = r.pick(['total', 'left', 'per'] as const), n = ask === 'total' ? total : ask === 'left' ? left : per;
      const TOTAL = L('Todos los tornillos que había|All the screws there were'), LEFT = L('Los tornillos que quedan|The screws that are left'), PER = L('Los tornillos de cada estante|The screws on each shelf');
      const right = ask === 'total' ? TOTAL : ask === 'left' ? LEFT : PER;
      return choose(r,
        T(`Plan de Rosa: ${boxes} × 10 = ${total}; ${total} − ${hidden} = ${left}; ${left} ÷ ${shelves} = ${per}. ¿Qué cuenta el ${n}?`, `Rosa’s plan: ${boxes} × 10 = ${total}; ${total} − ${hidden} = ${left}; ${left} ÷ ${shelves} = ${per}. What does the ${n} count?`),
        right, [TOTAL, LEFT, PER].filter(o => o !== right),
        T(`${total}: todos los tornillos. ${left}: los que quedan sin los de Canela. ${per}: los de cada estante.`, `${total}: all the screws. ${left}: the ones left without Canela’s. ${per}: the ones on each shelf.`),
        T(`Buscá en qué paso aparece el ${n}. ¿Qué cuenta hace ese paso?`, `Find the step where ${n} appears. What does that step work out?`));
    },
  ],
  'G03-08-L03': [
    r => {
      const per = r.int(6, 9), known = r.int(2, 5), times = r.pick([2, 3]), ask = known * times;
      return typed(
        T(`Cada caja trae ${per} azulejos para el pasillo. ${known} cajas traen ${known * per}. ¿Cuántos azulejos traen ${ask} cajas?`, `Each box holds ${per} tiles for the hall. ${known} boxes hold ${known * per}. How many tiles do ${ask} boxes hold?`),
        ask * per,
        T(`${ask} cajas son ${times} veces ${known} cajas: ${times} × ${known * per} = ${ask * per} azulejos.`, `${ask} boxes are ${times} times ${known} boxes: ${times} × ${known * per} = ${ask * per} tiles.`),
        T(`Compará ${ask} cajas con ${known} cajas. ¿Cuántas veces tenés las mismas cajas?`, `Compare ${ask} boxes with ${known} boxes. How many times do you have the same boxes?`),
        { unit: T('azulejos', 'tiles'), reward: T(`El piso del pasillo queda cubierto con ${ask * per} azulejos.`, `The hall floor is covered with ${ask * per} tiles.`) },
      );
    },
    r => {
      const per = r.int(5, 9), a = r.int(2, 4), b = r.int(2, 4), equal = r.int(0, 1) === 0;
      const other = per - r.int(2, 4);
      const YES = L('Sí: todas las cajas traen la misma cantidad|Yes: every box holds the same number');
      const NO = L('No: las cajas traen cantidades distintas|No: the boxes hold different numbers');
      const ALWAYS = L('Sí: las filas de una tabla siempre se pueden sumar|Yes: rows of a table can always be added');
      return choose(r,
        equal
          ? T(`Todas las cajas traen ${per} azulejos. La tabla dice: ${a} cajas → ${a * per}; ${b} cajas → ${b * per}. ¿Podemos sumar las filas para saber ${a + b} cajas?`, `Every box holds ${per} tiles. The table says: ${a} boxes → ${a * per}; ${b} boxes → ${b * per}. Can we add the rows to know ${a + b} boxes?`)
          : T(`Algunas cajas traen ${per} azulejos y otras ${other}. La tabla dice: ${a} cajas → ${a * per}; ${b} cajas → ${b * other}. ¿Podemos sumar las filas para saber ${a + b} cajas cualesquiera?`, `Some boxes hold ${per} tiles and others ${other}. The table says: ${a} boxes → ${a * per}; ${b} boxes → ${b * other}. Can we add the rows to know any ${a + b} boxes?`),
        equal ? YES : NO, equal ? [NO, ALWAYS] : [YES, ALWAYS],
        equal
          ? T(`Si cada caja trae ${per}, juntar cajas es juntar sus azulejos: ${a * per} + ${b * per} = ${(a + b) * per}.`, `If every box holds ${per}, putting boxes together puts their tiles together: ${a * per} + ${b * per} = ${(a + b) * per}.`)
          : T(`Con cajas de ${per} y de ${other}, otras ${a + b} cajas pueden traer otra cantidad.`, `With boxes of ${per} and of ${other}, another ${a + b} boxes can hold a different number.`),
        T(`Imaginá una caja con ${per} azulejos y otra con ${other}. ¿Se puede seguir sumando filas?`, `Imagine one box with ${per} tiles and another with ${other}. Can you keep adding rows?`));
    },
  ],
};
