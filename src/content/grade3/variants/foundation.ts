// Chapter 2 — The foundation (G03-02, G03-03): blocks in the trench, buckets in
// the mixer, water in the tank, iron rods; written addition and subtraction,
// estimates, and checking a subtraction with an addition.
import { T, choose, chooseNumber, typed, es, en, L, oneOf, type Generator } from './kit';

const digits3 = (n: number) => ({ h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 });
const nearest100 = (n: number) => Math.round(n / 100) * 100;

export const foundation: Record<string, [Generator, Generator]> = {
  'G03-02-L01': [
    r => {
      // No carrying: each column stays under 10.
      const a = r.int(1, 8) * 100 + r.int(0, 6) * 10 + r.int(0, 6);
      const { t, o } = digits3(a);
      const b = r.int(1, 9 - t) * 10 + r.int(0, 9 - o);
      const sum = a + b;
      return typed(
        T(`El lado largo de la zanja lleva ${a} bloques. La esquina lleva ${b} más. ¿Cuántos bloques en total?`, `The long side of the trench takes ${a} blocks. The corner takes ${b} more. How many blocks in all?`),
        sum,
        T(`${a} + ${Math.floor(b / 10) * 10} + ${b % 10} = ${sum} bloques.`, `${a} + ${Math.floor(b / 10) * 10} + ${b % 10} = ${sum} blocks.`),
        T(`A ${a} bloques sumale primero ${Math.floor(b / 10)} decenas y después ${b % 10} unidades.`, `Add ${Math.floor(b / 10)} tens to ${a} blocks first, then ${b % 10} ones.`),
        { unit: T('bloques', 'blocks'), reward: T(`Las carretillas llevan justo ${sum} bloques.`, `The wheelbarrows carry exactly ${sum} blocks.`) },
      );
    },
    r => oneOf(r, [
      () => {
        // Which digit of the big number does the ones digit of the small one go under?
        const [h, t, o] = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
        const a = h * 100 + t * 10 + o, b = r.int(1, 9) * 10 + r.int(1, 9);
        const under = (d: number) => T(`Debajo del ${d}`, `Under the ${d}`);
        return choose(r,
          T(`Escribís ${a} + ${b} en columnas en la libreta. ¿Debajo de qué cifra de ${a} va el ${b % 10} de ${b}?`, `You write ${a} + ${b} in columns in the notebook. Under which digit of ${a} does the ${b % 10} of ${b} go?`),
          under(o), [under(t), under(h)],
          T(`El ${b % 10} son unidades: va debajo de las unidades de ${a}, el ${o}.`, `The ${b % 10} is ones: it goes under the ones of ${a}, the ${o}.`),
          T(`Mirá qué lugar ocupa el ${b % 10} en ${b}. Buscá el mismo lugar en ${a}.`, `Look at which place the ${b % 10} has in ${b}. Find the same place in ${a}.`));
      },
      () => {
        // Átomo shifted the small number one column to the left.
        const a = r.int(1, 6) * 100 + r.int(0, 9) * 10 + r.int(0, 9), b = r.int(1, 9) * 10 + r.int(1, 9);
        return chooseNumber(r,
          T(`Átomo escribió ${b} corrido: el ${Math.floor(b / 10)} quedó debajo de las centenas de ${a}. ¿Qué sumó en realidad?`, `Átomo wrote ${b} shifted: the ${Math.floor(b / 10)} ended up under the hundreds of ${a}. What did he really add?`),
          a + b * 10, [a + b, a + b * 100, a + Math.floor(b / 10)],
          T(`Corrido una columna, ${b} vale ${b * 10}: ${a} + ${b * 10} = ${a + b * 10}. Por eso unidades van debajo de unidades.`, `Shifted one column, ${b} is worth ${b * 10}: ${a} + ${b * 10} = ${a + b * 10}. That is why ones go under ones.`),
          T(`Si el ${Math.floor(b / 10)} está en las centenas, ¿cuánto vale ahora ${b}?`, `If the ${Math.floor(b / 10)} is in the hundreds, how much is ${b} worth now?`));
      },
    ]),
  ],
  'G03-02-L02': [
    r => {
      // Carrying in the ones and in the tens.
      const ao = r.int(2, 9), bo = r.int(11 - ao, 9), at = r.int(2, 9), bt = r.int(Math.max(0, 10 - at), 9);
      const ah = r.int(1, 4), bh = r.int(1, 4);
      const a = ah * 100 + at * 10 + ao, b = bh * 100 + bt * 10 + bo, sum = a + b;
      return typed(
        T(`A la hormigonera van ${a} baldes de arena y ${b} de piedra. ¿Cuántos baldes en total?`, `The mixer gets ${a} buckets of sand and ${b} of gravel. How many buckets in all?`),
        sum,
        T(`${ao} + ${bo} = ${ao + bo}; ${at} + ${bt} + 1 = ${at + bt + 1}; ${ah} + ${bh} + 1 = ${ah + bh + 1}. Son ${sum} baldes.`, `${ao} + ${bo} = ${ao + bo}; ${at} + ${bt} + 1 = ${at + bt + 1}; ${ah} + ${bh} + 1 = ${ah + bh + 1}. That is ${sum} buckets.`),
        T('Sumá primero las unidades de baldes. Si pasan de 9, llevá una decena.', 'Add the bucket ones first. If they go past 9, carry a ten.'),
        { unit: T('baldes', 'buckets'), reward: T(`Entran ${sum} baldes. ¡La hormigonera gira!`, `${sum} buckets go in. The mixer turns!`) },
      );
    },
    r => {
      const ones = r.int(0, 1) === 0;
      const x = r.int(2, 9), y = r.int(11 - x, 9);
      const TEN_ONES = L('Diez unidades|Ten ones'), TEN_TENS = L('Diez decenas|Ten tens'), ONE = L('Una unidad|One one');
      return choose(r,
        ones
          ? T(`Al sumar baldes, las unidades dan ${x} + ${y} = ${x + y}. Átomo pasa un 1 a las decenas. ¿Cuánto vale ese 1?`, `Adding buckets, the ones make ${x} + ${y} = ${x + y}. Átomo carries a 1 to the tens. What is that 1 worth?`)
          : T(`Al sumar baldes, las decenas dan ${x} + ${y} = ${x + y}. Átomo pasa un 1 a las centenas. ¿Cuánto vale ese 1?`, `Adding buckets, the tens make ${x} + ${y} = ${x + y}. Átomo carries a 1 to the hundreds. What is that 1 worth?`),
        ones ? TEN_ONES : TEN_TENS, ones ? [TEN_TENS, ONE] : [TEN_ONES, ONE],
        ones
          ? T(`${x + y} unidades son una decena y ${x + y - 10} unidades: pasan diez unidades.`, `${x + y} ones are one ten and ${x + y - 10} ones: ten ones are carried.`)
          : T(`${x + y} decenas son una centena y ${x + y - 10} decenas: pasan diez decenas.`, `${x + y} tens are one hundred and ${x + y - 10} tens: ten tens are carried.`),
        T('Pensá cuántos baldes de esa columna hacen falta para armar el 1 de la columna siguiente.', 'Think how many buckets of that column make the 1 in the next column.'));
    },
  ],
  'G03-02-L03': [
    r => {
      let a = 0, b = 0, est = 0;
      do {
        a = r.int(2, 6) * 100 + r.pick([-3, -2, -1, 1, 2, 3, 4]);
        b = r.int(1, 3) * 100 + r.pick([-4, -3, -2, -1, 1, 2, 3]);
        est = nearest100(a) + nearest100(b);
      } while (est > 900 || nearest100(a) === nearest100(b));
      return chooseNumber(r,
        T(`El tanque tiene 1.000 litros. Hoy la hormigonera usa ${a} litros a la mañana y ${b} a la tarde. ¿Qué estimación conviene?`, `The tank holds 1,000 litres. Today the mixer uses ${a} litres in the morning and ${b} in the afternoon. Which estimate fits?`),
        est, [nearest100(a) - nearest100(b), est + 200, est - 200],
        T(`${nearest100(a)} + ${nearest100(b)} = ${est}. Menos de 1.000: el tanque alcanza.`, `${nearest100(a)} + ${nearest100(b)} = ${est}. Less than 1,000: the tank is enough.`),
        T(`Buscá las centenas más cercanas a ${a} y a ${b} y sumalas.`, `Find the hundreds closest to ${a} and ${b} and add them.`),
        { unit: ['litros', 'litres'], reward: T(`Unos ${est} litros: el tanque alcanza para hoy.`, `About ${est} litres: the tank is enough for today.`) });
    },
    r => {
      const a = r.int(2, 5) * 100 + r.int(1, 9) * 10 + r.int(1, 9), b = r.int(1, 3) * 100 + r.int(1, 9) * 10 + r.int(1, 9);
      const exact = a + b, est = nearest100(a) + nearest100(b);
      const far = r.int(0, 1) === 0;
      const written = far ? exact + r.pick([-300, 300, 200, -200]) : exact + r.pick([-10, 10, -1, 1, 0]);
      const FAR = L('Está mal: queda lejos de la estimación|It is wrong: it is far from the estimate');
      const NEAR = L('Está cerca: para saber si es exacto hay que comprobar|It is close: to know if it is exact we must check');
      const ROUND = L('Está bien porque la estimación siempre es exacta|It is right because an estimate is always exact');
      return choose(r,
        T(`Átomo sumó ${a} + ${b} litros y anotó ${written}. La estimación da unos ${est}. ¿Qué podés decir?`, `Átomo added ${a} + ${b} litres and wrote ${written}. The estimate is about ${est}. What can you say?`),
        far ? FAR : NEAR, far ? [NEAR, ROUND] : [FAR, ROUND],
        far
          ? T(`${written} está lejos de ${est}: la cuenta tiene un error grande. El total exacto es ${exact}.`, `${written} is far from ${est}: the sum has a big mistake. The exact total is ${exact}.`)
          : T(`La estimación no descubre errores chicos. Restando, ${exact} − ${b} = ${a}: el total exacto es ${exact}.`, `An estimate does not catch small mistakes. Subtracting, ${exact} − ${b} = ${a}: the exact total is ${exact}.`),
        T(`Compará ${written} con ${est}. ¿Están cerca o lejos?`, `Compare ${written} with ${est}. Are they close or far apart?`));
    },
  ],
  'G03-03-L01': [
    r => {
      const at = r.int(4, 9), ao = r.int(0, 7), bo = r.int(ao + 1, 9), bt = r.int(1, at - 1);
      const a = at * 10 + ao, b = bt * 10 + bo, d = a - b;
      return typed(
        T(`Había ${a} hierros. ${b} quedaron en los cimientos. ¿Cuántos hierros quedan?`, `There were ${a} rods. ${b} went into the foundation. How many rods are left?`),
        d,
        T(`${a} = ${(at - 1) * 10} + ${10 + ao}; ${10 + ao} − ${bo} = ${10 + ao - bo} y ${(at - 1) * 10} − ${bt * 10} = ${(at - 1 - bt) * 10}. Quedan ${d} hierros.`, `${a} = ${(at - 1) * 10} + ${10 + ao}; ${10 + ao} − ${bo} = ${10 + ao - bo} and ${(at - 1) * 10} − ${bt * 10} = ${(at - 1 - bt) * 10}. ${d} rods are left.`),
        T(`Desatá un atado de 10 hierros antes de sacar ${bo} sueltos.`, `Untie a bundle of 10 rods before taking away ${bo} loose ones.`),
        { unit: T('hierros', 'rods'), reward: T(`Quedan ${d} hierros para las columnas.`, `${d} rods are left for the columns.`) },
      );
    },
    r => {
      const exchange = r.int(0, 1) === 0;
      const at = r.int(4, 9), bt = r.int(1, at - 1);
      const ao = exchange ? r.int(0, 6) : r.int(3, 9);
      const bo = exchange ? r.int(ao + 1, 9) : r.int(0, ao);
      const a = at * 10 + ao, b = bt * 10 + bo;
      const atomo = (at - bt) * 10 + Math.abs(ao - bo);
      const WRONG = L('Está mal: había que desarmar una decena|It is wrong: a ten had to be split');
      const RIGHT = L('Esta vez da bien: no hacía falta desarmar|This time it is right: nothing had to be split');
      const SWAP = L('Está mal: hay que restar al revés|It is wrong: you must subtract the other way round');
      return choose(r,
        T(`Átomo resta ${a} − ${b} hierros tomando siempre la cifra menor de la mayor. Le da ${atomo}. ¿Qué pasó?`, `Átomo subtracts ${a} − ${b} rods, always taking the smaller digit from the larger one. He gets ${atomo}. What happened?`),
        exchange ? WRONG : RIGHT, exchange ? [RIGHT, SWAP] : [WRONG, SWAP],
        exchange
          ? T(`En las unidades, ${ao} es menos que ${bo}: hay que desarmar una decena. ${a} − ${b} = ${a - b}.`, `In the ones, ${ao} is less than ${bo}: a ten must be split. ${a} − ${b} = ${a - b}.`)
          : T(`En cada columna la cifra de arriba ya es mayor: ${a} − ${b} = ${a - b}.`, `In each column the top digit is already bigger: ${a} − ${b} = ${a - b}.`),
        T(`Mirá las unidades: ¿alcanzan los ${ao} hierros sueltos para sacar ${bo}?`, `Look at the ones: are ${ao} loose rods enough to take away ${bo}?`));
    },
  ],
  'G03-03-L02': [
    r => {
      // A zero in the tens: exchange across it.
      const ah = r.int(3, 9), ao = r.int(0, 7);
      const bh = r.int(1, ah - 1), bt = r.int(1, 9), bo = r.int(ao + 1, 9);
      const a = ah * 100 + ao, b = bh * 100 + bt * 10 + bo, d = a - b;
      return typed(
        T(`Llegaron ${a} bloques. ${b} quedaron en los cimientos. ¿Cuántos bloques quedan para las paredes?`, `${a} blocks arrived. ${b} went into the foundation. How many blocks are left for the walls?`),
        d,
        T(`${a} = ${(ah - 1) * 100} + 90 + ${10 + ao}. Restar ${bh * 100} + ${bt * 10} + ${bo} deja ${d} bloques.`, `${a} = ${(ah - 1) * 100} + 90 + ${10 + ao}. Taking away ${bh * 100} + ${bt * 10} + ${bo} leaves ${d} blocks.`),
        T(`En ${a} no hay decenas. Cambiá una centena por decenas y después una decena por unidades.`, `${a} has no tens. Change a hundred into tens, then a ten into ones.`),
        { unit: T('bloques', 'blocks'), reward: T(`Quedan ${d} bloques apilados para las paredes.`, `${d} blocks are stacked for the walls.`) },
      );
    },
    r => {
      const h = r.int(3, 9), used = r.int(1, h - 1) * 100 + r.int(1, 9) * 10 + r.int(1, 9);
      const total = h * 100;
      return choose(r,
        T(`El tanque tiene ${total} litros. Lavar las herramientas usa ${used}. ¿Qué forma de partir ${total} ayuda a restar?`, `The tank has ${total} litres. Washing the tools uses ${used}. Which way of splitting ${total} helps you subtract?`),
        T(`${total - 100} + 90 + 10`, `${total - 100} + 90 + 10`),
        [T(`${total - 100} + 100 + 10`, `${total - 100} + 100 + 10`), T(`${total} + 90 + 10`, `${total} + 90 + 10`), T(`${(h - 1) * 10} + 90 + 10`, `${(h - 1) * 10} + 90 + 10`)],
        T(`${total - 100} + 90 + 10 sigue siendo ${total}, y cada parte alcanza para restar ${used}: quedan ${total - used} litros.`, `${total - 100} + 90 + 10 is still ${total}, and each part is big enough to take away ${used}: ${total - used} litres are left.`),
        T(`Sumá las partes de cada opción. ¿Cuál sigue dando ${total} litros?`, `Add the parts of each option. Which one still makes ${total} litres?`));
    },
  ],
  'G03-03-L03': [
    r => {
      let a = 0, b = 0;
      do {
        a = r.int(4, 9) * 100 + r.pick([0, 0, r.int(1, 9) * 10]);
        b = r.int(1, Math.floor(a / 100) - 1) * 100 + r.int(1, 9) * 10 + r.int(1, 9);
      } while (a === 2 * b);
      const c = a - b;
      return choose(r,
        T(`Rosa anotó: ${a} − ${b} = ${c} ladrillos quedan. ¿Qué suma lo comprueba?`, `Rosa wrote: ${a} − ${b} = ${c} bricks left. Which addition checks it?`),
        T(`${c} + ${b} = ${a}`, `${c} + ${b} = ${a}`),
        [T(`${a} + ${b} = ${a + b}`, `${a} + ${b} = ${a + b}`), T(`${a} + ${c} = ${a + c}`, `${a} + ${c} = ${a + c}`), T(`${Math.max(b, c)} − ${Math.min(b, c)} = ${Math.abs(b - c)}`, `${Math.max(b, c)} − ${Math.min(b, c)} = ${Math.abs(b - c)}`)],
        T(`Los ${c} ladrillos que quedan y los ${b} usados forman los ${a} del comienzo.`, `The ${c} bricks left and the ${b} used make the ${a} we started with.`),
        T(`Juntá los ladrillos que quedan con los que se usaron. ¿Volvés a ${a}?`, `Put the bricks left together with the bricks used. Do you get back to ${a}?`));
    },
    r => {
      const a = r.int(4, 9) * 100, b = r.int(1, Math.floor(a / 100) - 1) * 100 + r.int(1, 9) * 10 + r.int(1, 9);
      const ok = r.int(0, 1) === 0;
      const c = ok ? a - b : a - b + r.pick([-100, 100, -10, 10]);
      const TICK = L('Pone la tilde ✔: la resta está bien|She adds the tick ✔: the subtraction is right');
      const REVIEW = L('Revisa la resta y también la suma de comprobación|She checks both the subtraction and the checking sum');
      const SWAP = L('Cambia el resultado por el de la suma|She swaps the result for the one from the sum');
      return choose(r,
        T(`Rosa anotó ${a} − ${b} = ${c}. Comprueba con ${c} + ${b} y le da ${c + b}. ¿Qué hace Rosa?`, `Rosa wrote ${a} − ${b} = ${c}. She checks with ${c} + ${b} and gets ${c + b}. What does Rosa do?`),
        ok ? TICK : REVIEW, ok ? [REVIEW, SWAP] : [TICK, SWAP],
        ok
          ? T(`${c} + ${b} = ${a}: volvió al total del comienzo. La resta está bien.`, `${c} + ${b} = ${a}: it is back to the starting total. The subtraction is right.`)
          : T(`${c + b} no es ${a}. El error puede estar en cualquiera de las dos cuentas: ${a} − ${b} = ${a - b}.`, `${c + b} is not ${a}. The mistake can be in either calculation: ${a} − ${b} = ${a - b}.`),
        T(`Compará el resultado de la suma con ${a}, el número del comienzo.`, `Compare the result of the sum with ${a}, the starting number.`));
    },
  ],
};
