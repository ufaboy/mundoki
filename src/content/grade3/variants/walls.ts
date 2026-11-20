// Chapter 3 — The walls (G03-04, G03-05): brick walls as rows × columns,
// turning a drawing, one more row, doubling, cutting a wall into parts, and
// written one-digit multiplication with carrying.
import { T, choose, typed, L, oneOf, twoDifferent, type Generator } from './kit';

export const walls: Record<string, [Generator, Generator]> = {
  'G03-04-L01': [
    r => {
      const rows = r.int(3, 9), cols = r.int(3, 9), n = rows * cols;
      return typed(
        T(`La ventana del baño tiene ${rows} filas de ${cols} bloques de vidrio. ¿Cuántos bloques hay?`, `The bathroom window has ${rows} rows of ${cols} glass blocks. How many blocks are there?`),
        n,
        T(`${rows} filas de ${cols}: ${rows} × ${cols} = ${n} bloques.`, `${rows} rows of ${cols}: ${rows} × ${cols} = ${n} blocks.`),
        T(`Dibujá ${rows} filas de ${cols} bloques. Contá de ${cols} en ${cols}.`, `Draw ${rows} rows of ${cols} blocks. Count by ${cols}s.`),
        { unit: T('bloques', 'blocks'), reward: T(`La ventana de vidrio brilla con sus ${n} bloques.`, `The glass window shines with its ${n} blocks.`) },
      );
    },
    r => {
      const rows = r.int(3, 7), cols = r.int(3, 8), full = r.int(0, 1) === 0;
      const COMPLETE = T(`Sí: todas las filas tienen ${cols} bloques`, `Yes: every row has ${cols} blocks`);
      const MISSING = T(`No: hay ${rows * cols - 1} bloques, falta uno`, `No: there are ${rows * cols - 1} blocks, one is missing`);
      const ALWAYS = T(`Sí: siempre es ${rows} × ${cols}, aunque falte uno`, `Yes: it is always ${rows} × ${cols}, even if one is missing`);
      return choose(r,
        full
          ? T(`Rosa dibuja ${rows} filas de ${cols} bloques, todas completas. ¿Podemos contar ${rows} × ${cols} = ${rows * cols}?`, `Rosa draws ${rows} rows of ${cols} blocks, all complete. Can we count ${rows} × ${cols} = ${rows * cols}?`)
          : T(`Rosa dibuja ${rows} filas de ${cols} bloques, pero en una fila falta un bloque. ¿Podemos contar ${rows} × ${cols} = ${rows * cols}?`, `Rosa draws ${rows} rows of ${cols} blocks, but one row is missing a block. Can we count ${rows} × ${cols} = ${rows * cols}?`),
        full ? COMPLETE : MISSING, full ? [MISSING, ALWAYS] : [COMPLETE, ALWAYS],
        full
          ? T('La multiplicación cuenta todos los lugares de un rectángulo completo.', 'Multiplication counts every place in a complete rectangle.')
          : T(`Con un hueco ya no es un rectángulo completo: ${rows * cols} − 1 = ${rows * cols - 1} bloques.`, `With a gap it is no longer a complete rectangle: ${rows * cols} − 1 = ${rows * cols - 1} blocks.`),
        T('Revisá fila por fila. ¿Todas tienen la misma cantidad de bloques?', 'Check row by row. Do all of them have the same number of blocks?'));
    },
  ],
  'G03-04-L02': [
    r => {
      const [a, b] = twoDifferent(r, 3, 9), n = a * b;
      return typed(
        T(`Una pared tiene ${a} filas de ${b} ladrillos: ${a} × ${b} = ${n}. Giramos el dibujo: ${b} filas de ${a}. ¿Cuántos ladrillos hay?`, `A wall has ${a} rows of ${b} bricks: ${a} × ${b} = ${n}. We turn the drawing: ${b} rows of ${a}. How many bricks are there?`),
        n,
        T(`Al girar no cambia ningún ladrillo: siguen siendo ${n}.`, `Turning changes no bricks: there are still ${n}.`),
        T('Imaginá girar el dibujo de la pared. ¿Se agregó o se quitó algún ladrillo?', 'Imagine turning the drawing of the wall. Was any brick added or removed?'),
        { unit: T('ladrillos', 'bricks'), reward: T(`Son ${n} ladrillos igual. El pedido no cambia.`, `It is still ${n} bricks. The order does not change.`) },
      );
    },
    r => {
      const YES = L('Sí: da lo mismo|Yes: it gives the same result');
      const NO = L('No: cambia la cuenta|No: it changes the calculation');
      const SMALL = L('Solo si los números son chicos|Only if the numbers are small');
      const reward = L('La libreta queda bien anotada.|The notebook is written correctly.');
      return oneOf(r, [
        () => {
          const [a, b] = twoDifferent(r, 2, 9), big = Math.max(a, b), small = Math.min(a, b);
          return choose(r,
            T(`Había ${big} marcos de ventana y se colocaron ${small}. Átomo anota ${small} − ${big}. ¿Se puede cambiar el orden en una resta?`, `There were ${big} window frames and ${small} were fitted. Átomo writes ${small} − ${big}. Can you swap the order in a subtraction?`),
            NO, [YES, SMALL],
            T(`Quedan ${big} − ${small} = ${big - small} marcos. ${small} − ${big} no sirve: no se pueden quitar ${big} de ${small}.`, `${big} − ${small} = ${big - small} frames are left. ${small} − ${big} does not work: you cannot take ${big} away from ${small}.`),
            T(`Probá con los marcos: ¿podés sacar ${big} marcos si solo hay ${small}?`, `Try it with the frames: can you take away ${big} frames if there are only ${small}?`), { reward });
        },
        () => {
          const [a, b] = twoDifferent(r, 3, 9);
          return choose(r,
            T(`Una pared tiene ${a} filas de ${b} ladrillos. Átomo anota ${b} × ${a}. ¿Se puede cambiar el orden en una multiplicación?`, `A wall has ${a} rows of ${b} bricks. Átomo writes ${b} × ${a}. Can you swap the order in a multiplication?`),
            YES, [NO, SMALL],
            T(`Girar la pared no cambia los ladrillos: ${a} × ${b} = ${b} × ${a} = ${a * b}.`, `Turning the wall changes no bricks: ${a} × ${b} = ${b} × ${a} = ${a * b}.`),
            T('Imaginá girar el dibujo de la pared. ¿Cambia algún ladrillo?', 'Imagine turning the drawing of the wall. Does any brick change?'), { reward });
        },
        () => {
          const [a, b] = twoDifferent(r, 12, 60);
          return choose(r,
            T(`Llegaron ${a} tejas y después ${b} más. Átomo anota ${b} + ${a}. ¿Se puede cambiar el orden en una suma?`, `${a} tiles arrived, then ${b} more. Átomo writes ${b} + ${a}. Can you swap the order in an addition?`),
            YES, [NO, SMALL],
            T(`Juntar tejas da lo mismo en cualquier orden: ${a} + ${b} = ${b} + ${a} = ${a + b}.`, `Putting tiles together gives the same in any order: ${a} + ${b} = ${b} + ${a} = ${a + b}.`),
            T('Pensá en dos pilas de tejas. ¿Importa cuál ponés primero?', 'Think of two piles of tiles. Does it matter which one you put first?'), { reward });
        },
        () => {
          const k = r.int(2, 6), each = r.int(3, 9), total = k * each;
          return choose(r,
            T(`Repartimos ${total} tornillos en ${k} cajitas iguales. Átomo anota ${k} ÷ ${total}. ¿Se puede cambiar el orden en una división?`, `We share ${total} screws into ${k} equal boxes. Átomo writes ${k} ÷ ${total}. Can you swap the order in a division?`),
            NO, [YES, SMALL],
            T(`Se reparten los ${total} tornillos: ${total} ÷ ${k} = ${each}. ${k} ÷ ${total} es otra cuenta.`, `The ${total} screws are shared: ${total} ÷ ${k} = ${each}. ${k} ÷ ${total} is another calculation.`),
            T(`¿Qué se reparte: ${total} tornillos o ${k} cajitas?`, `What is being shared: ${total} screws or ${k} boxes?`), { reward });
        },
      ]);
    },
  ],
  'G03-04-L03': [
    r => {
      const rows = r.int(3, 8), cols = r.int(4, 9), n = rows * cols, more = r.int(0, 1) === 0;
      const result = more ? n + cols : n - cols;
      return typed(
        more
          ? T(`La pared de la cocina tiene ${rows} filas de ${cols} ladrillos: ${n}. Se agrega una fila más. ¿Cuántos ladrillos hay ahora?`, `The kitchen wall has ${rows} rows of ${cols} bricks: ${n}. One more row is added. How many bricks are there now?`)
          : T(`La pared de la cocina tiene ${rows} filas de ${cols} ladrillos: ${n}. Rosa saca la fila de arriba para la ventana. ¿Cuántos ladrillos quedan?`, `The kitchen wall has ${rows} rows of ${cols} bricks: ${n}. Rosa removes the top row for the window. How many bricks are left?`),
        result,
        more ? T(`Una fila más trae ${cols} ladrillos: ${n} + ${cols} = ${result}.`, `One more row brings ${cols} bricks: ${n} + ${cols} = ${result}.`)
          : T(`Una fila menos son ${cols} ladrillos menos: ${n} − ${cols} = ${result}.`, `One row fewer is ${cols} fewer bricks: ${n} − ${cols} = ${result}.`),
        T(`Partí de ${rows} filas de ${cols} ladrillos. ¿Cuántos ladrillos tiene una fila?`, `Start from ${rows} rows of ${cols} bricks. How many bricks does one row have?`),
        { unit: T('ladrillos', 'bricks') },
      );
    },
    r => {
      const a = r.int(2, 5), b = r.int(3, 9);
      return choose(r,
        T(`El cuarto tiene dos paredes iguales de ${a} filas de ${b}. ¿Por qué ${2 * a} × ${b} es el doble de ${a} × ${b}?`, `The children’s room has two equal walls of ${a} rows of ${b}. Why is ${2 * a} × ${b} double ${a} × ${b}?`),
        T(`Las ${2 * a} filas se separan en dos grupos de ${a} filas`, `The ${2 * a} rows split into two groups of ${a} rows`),
        [T(`Porque se suman ${b} ladrillos más`, `Because ${b} more bricks are added`), T(`Porque ${2 * a} filas y ${a} filas son lo mismo`, `Because ${2 * a} rows and ${a} rows are the same`)],
        T(`Dos paredes de ${a} filas de ${b} tienen ${2 * a} filas de ${b}: ${a * b} + ${a * b} = ${2 * a * b}.`, `Two walls of ${a} rows of ${b} have ${2 * a} rows of ${b}: ${a * b} + ${a * b} = ${2 * a * b}.`),
        T(`Dibujá las dos paredes del cuarto juntas. ¿Cuántas filas de ${b} ves?`, `Draw the two walls of the room together. How many rows of ${b} do you see?`));
    },
  ],
  'G03-05-L01': [
    r => {
      const rows = r.int(3, 6), n = r.int(13, 29), tens = Math.floor(n / 10) * 10, ones = n % 10, total = rows * n;
      return typed(
        T(`La pared del frente tiene ${rows} filas de ${n} ladrillos. ¿Cuántos ladrillos tiene?`, `The front wall has ${rows} rows of ${n} bricks. How many bricks does it have?`),
        total,
        T(`${rows} × ${tens} + ${rows} × ${ones} = ${rows * tens} + ${rows * ones} = ${total} ladrillos.`, `${rows} × ${tens} + ${rows} × ${ones} = ${rows * tens} + ${rows * ones} = ${total} bricks.`),
        T(`Partí ${n} en ${tens} y ${ones}. Repetí cada parte en las ${rows} filas.`, `Split ${n} into ${tens} and ${ones}. Repeat each part in the ${rows} rows.`),
        { unit: T('ladrillos', 'bricks') },
      );
    },
    r => {
      const rows = r.int(3, 6), n = r.int(1, 2) * 10 + r.int(4, 9), kind = r.pick(['exact', 'twice', 'gap'] as const);
      const left = Math.floor(n / 10) * 10, right = kind === 'exact' ? n - left : kind === 'twice' ? n - left + r.int(1, 3) : n - left - r.int(1, Math.min(3, n - left - 1));
      const EXACT = L('Sí: las partes cubren justo la pared|Yes: the parts cover exactly the wall');
      const TWICE = L('No: cuenta ladrillos dos veces|No: it counts some bricks twice');
      const GAP = L('No: deja ladrillos afuera|No: it leaves some bricks out');
      const right_ = kind === 'exact' ? EXACT : kind === 'twice' ? TWICE : GAP;
      return choose(r,
        T(`La pared tiene ${rows} filas de ${n} ladrillos. Rosa corta el dibujo en ${rows} × ${left} y ${rows} × ${right}. ¿Está bien cortado?`, `The wall has ${rows} rows of ${n} bricks. Rosa cuts the drawing into ${rows} × ${left} and ${rows} × ${right}. Is it cut correctly?`),
        right_, [EXACT, TWICE, GAP].filter(o => o !== right_),
        kind === 'exact'
          ? T(`${left} + ${right} = ${n}: cada ladrillo está en una sola parte.`, `${left} + ${right} = ${n}: every brick is in exactly one part.`)
          : T(`${left} + ${right} = ${left + right}, no ${n}. Las partes deben cubrir justo la pared entera.`, `${left} + ${right} = ${left + right}, not ${n}. The parts must cover exactly the whole wall.`),
        T(`Sumá los largos de las dos partes y compará con ${n}.`, `Add the lengths of the two parts and compare with ${n}.`));
    },
  ],
  'G03-05-L02': [
    r => {
      const k = r.int(3, 6), tens = r.int(2, 8) * 10, ones = r.int(2, 9), n = tens + ones;
      return choose(r,
        T(`Cada una de las ${k} paredes del dormitorio lleva ${n} ladrillos. ¿Qué cuenta da ${n} × ${k}?`, `Each of the ${k} bedroom walls takes ${n} bricks. Which calculation gives ${n} × ${k}?`),
        T(`${tens} × ${k} + ${ones} × ${k}`, `${tens} × ${k} + ${ones} × ${k}`),
        [T(`${tens} × ${k} + ${ones}`, `${tens} × ${k} + ${ones}`), T(`${tens} + ${ones} × ${k}`, `${tens} + ${ones} × ${k}`), T(`${tens / 10} × ${k} + ${ones} × ${k}`, `${tens / 10} × ${k} + ${ones} × ${k}`)],
        T(`Las decenas y las unidades se repiten en las ${k} paredes: ${tens * k} + ${ones * k} = ${n * k}.`, `Both the tens and the ones are repeated for all ${k} walls: ${tens * k} + ${ones * k} = ${n * k}.`),
        T(`Partí ${n} en decenas y unidades. Las dos partes van en las ${k} paredes.`, `Split ${n} into tens and ones. Both parts go on all ${k} walls.`),
        { reward: T(`Suben las ${k} paredes del dormitorio.`, `The ${k} bedroom walls rise.`) });
    },
    r => {
      const k = r.int(3, 5), n = r.int(3, 8) * 10 + r.int(2, 9), tens = Math.floor(n / 10) * 10, ones = n % 10;
      const other = tens - 10, both = r.int(0, 1) === 0;
      const atomo = both ? [other, ones + 10] : [other, ones];
      const BOTH = T(`Sirven las dos: las partes suman ${n} y se repiten ${k} veces`, `Both work: the parts add up to ${n} and are repeated ${k} times`);
      const ONLY = L('Solo la de la abuela: las partes de Átomo no suman lo mismo|Only Abuela’s: Átomo’s parts do not add up to the same');
      const ANY = L('Sirven las dos: el resultado no depende de los números|Both work: the result does not depend on the numbers');
      return choose(r,
        T(`Para ${n} × ${k}, la abuela Tita usa ${tens} + ${ones} y Átomo usa ${atomo[0]} + ${atomo[1]}. ¿Qué cuentas sirven?`, `For ${n} × ${k}, Abuela Tita uses ${tens} + ${ones} and Átomo uses ${atomo[0]} + ${atomo[1]}. Which ones work?`),
        both ? BOTH : ONLY, both ? [ONLY, ANY] : [BOTH, ANY],
        both
          ? T(`${tens} + ${ones} y ${atomo[0]} + ${atomo[1]} forman ${n}. Repetir cualquiera ${k} veces da ${n * k}.`, `${tens} + ${ones} and ${atomo[0]} + ${atomo[1]} both make ${n}. Repeating either ${k} times gives ${n * k}.`)
          : T(`${atomo[0]} + ${atomo[1]} = ${atomo[0] + atomo[1]}, no ${n}: a Átomo le faltan 10 ladrillos por pared.`, `${atomo[0]} + ${atomo[1]} = ${atomo[0] + atomo[1]}, not ${n}: Átomo is 10 bricks short on each wall.`),
        T(`Sumá las partes de la abuela y las de Átomo. ¿Las dos dan ${n}?`, `Add Abuela’s parts and Átomo’s parts. Do both make ${n}?`),
        { reward: L('Las paredes de la cocina están listas.|The kitchen walls are ready.') });
    },
  ],
  'G03-05-L03': [
    r => {
      let n = 0, k = 0;
      do { n = r.int(23, 89); k = r.int(3, 6); } while ((n % 10) * k < 10 || n % 10 === 0);
      const tens = Math.floor(n / 10) * 10, ones = n % 10, total = n * k;
      return typed(
        T(`La última pared tiene ${k} partes de ${n} ladrillos. ¿Cuántos ladrillos son ${n} × ${k}?`, `The last wall has ${k} parts of ${n} bricks. How many bricks is ${n} × ${k}?`),
        total,
        T(`${tens} × ${k} + ${ones} × ${k} = ${tens * k} + ${ones * k} = ${total} ladrillos.`, `${tens} × ${k} + ${ones} × ${k} = ${tens * k} + ${ones * k} = ${total} bricks.`),
        T(`Calculá ${k} grupos de ${tens} y ${k} grupos de ${ones}. Juntá los resultados.`, `Work out ${k} groups of ${tens} and ${k} groups of ${ones}. Put the results together.`),
        { unit: T('ladrillos', 'bricks') },
      );
    },
    r => {
      let n = 0, k = 0;
      do { n = r.int(23, 89); k = r.int(3, 6); } while ((n % 10) * k < 10 || Math.floor(n / 10) * k + Math.floor((n % 10) * k / 10) < 10);
      const t = Math.floor(n / 10), o = n % 10, onesStep = o * k, carry1 = Math.floor(onesStep / 10);
      const tensStep = t * k + carry1, carry2 = Math.floor(tensStep / 10);
      const atOnes = r.int(0, 1) === 0, d = atOnes ? carry1 : carry2;
      const unit = (es_: [string, string], en_: [string, string]) => T(`${d} ${es_[d === 1 ? 0 : 1]}`, `${d} ${en_[d === 1 ? 0 : 1]}`);
      const TENS = unit(['decena', 'decenas'], ['ten', 'tens']), ONES = unit(['unidad suelta', 'unidades sueltas'], ['loose one', 'loose ones']), HUNDREDS = unit(['centena', 'centenas'], ['hundred', 'hundreds']);
      const right = atOnes ? TENS : HUNDREDS;
      return choose(r,
        atOnes
          ? T(`En ${n} × ${k}, después de ${o} × ${k} = ${onesStep}, Rosa guarda un ${d}. ¿Qué representa ese ${d}?`, `In ${n} × ${k}, after ${o} × ${k} = ${onesStep}, Rosa carries a ${d}. What does that ${d} stand for?`)
          : T(`En ${n} × ${k}, las decenas dan ${t} × ${k} + ${carry1} = ${tensStep}. Rosa escribe el ${tensStep % 10} y pasa un ${d}. ¿Qué representa ese ${d}?`, `In ${n} × ${k}, the tens make ${t} × ${k} + ${carry1} = ${tensStep}. Rosa writes the ${tensStep % 10} and carries a ${d}. What does that ${d} stand for?`),
        right, [TENS, ONES, HUNDREDS].filter(x => x !== right),
        atOnes
          ? T(`${onesStep} unidades son ${carry1} decenas y ${onesStep % 10} unidades.`, `${onesStep} ones are ${carry1} tens and ${onesStep % 10} ones.`)
          : T(`${tensStep} decenas son ${carry2} centenas y ${tensStep % 10} decenas: ${n} × ${k} = ${n * k}.`, `${tensStep} tens are ${carry2} hundreds and ${tensStep % 10} tens: ${n} × ${k} = ${n * k}.`),
        T(`Mirá en qué columna estás. ¿Cuánto valen diez de esa columna?`, `Look at which column you are in. What are ten of that column worth?`));
    },
  ],
};
