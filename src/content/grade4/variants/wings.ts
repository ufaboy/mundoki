// Chapters 3–4 — The wings, the instrument panel and the first flight
// (G04-03, G04-04, G04-05): rivet panels as arrays, partial products,
// estimates of products, dividing in batches, zeros in the quotient, remainders,
// mental shortcuts and checking a calculator result.
import { T, choose, chooseNumber, typed, es, en, L, oneOf, type Generator } from './kit';

export const wings: Record<string, [Generator, Generator]> = {
  'G04-03-L01': [
    r => {
      const cols = r.int(2, 9), rows = r.int(2, 9), n = cols * rows;
      return typed(
        T(`Nina corta el dibujo del panel en cuatro partes. La parte de la esquina tiene ${cols} columnas y ${rows} filas. ¿Cuántos remaches lleva?`, `Nina cuts the drawing of the panel into four parts. The corner part has ${cols} columns and ${rows} rows. How many rivets does it take?`),
        n,
        T(`${cols} columnas y ${rows} filas: ${cols} × ${rows} = ${n} remaches.`, `${cols} columns and ${rows} rows: ${cols} × ${rows} = ${n} rivets.`),
        T(`Contá una fila de ${cols} remaches y repetila ${rows} veces.`, `Count one row of ${cols} rivets and repeat it ${rows} times.`),
        { unit: T('remaches', 'rivets'), model: { array: [cols, rows] }, reward: T(`Los ${n} remaches de la esquina quedan puestos.`, `The ${n} corner rivets are in place.`) },
      );
    },
    r => {
      const c = r.int(12, 39), w = r.int(12, 29);
      const ct = Math.floor(c / 10) * 10, co = c % 10, wt = Math.floor(w / 10) * 10, wo = w % 10;
      const parts = [ct * wt, co * wt, ct * wo, co * wo], total = c * w;
      return chooseNumber(r,
        T(`El panel tiene ${c} columnas y ${w} filas. Nina lo corta en cuatro partes: ${parts.join(', ')}. ¿Cuántos remaches lleva el panel?`, `The panel has ${c} columns and ${w} rows. Nina cuts it into four parts: ${parts.join(', ')}. How many rivets does the panel take?`),
        total, [parts[0] + parts[3], c + w, total + parts[3], parts[0] + parts[1] + parts[2]],
        T(`Las cuatro partes cubren el panel sin superponerse: ${parts.join(' + ')} = ${es(total)}.`, `The four parts cover the panel without overlapping: ${parts.join(' + ')} = ${en(total)}.`),
        L('Cada remache está en una sola parte. ¿Qué partes hay que juntar?|Every rivet is in exactly one part. Which parts must be put together?'),
        { reward: T(`¡El panel está remachado: ${es(total)} remaches!`, `The panel is riveted: ${en(total)} rivets!`) });
    },
  ],
  'G04-03-L02': [
    r => {
      const c = r.int(12, 49), t = r.int(1, 4) * 10, rows = t + r.int(1, 9), n = c * t;
      return typed(
        T(`El panel del ala tiene ${c} columnas y ${rows} filas. ¿Cuánto vale la parte de las ${t / 10} decenas de filas, ${c} × ${t}?`, `The wing panel has ${c} columns and ${rows} rows. What is the part for the ${t / 10} tens of rows, ${c} × ${t}?`),
        n,
        T(`${c} × ${t} = ${n} remaches: el ${t / 10} de ${rows} cuenta decenas.`, `${c} × ${t} = ${n} rivets: the ${t / 10} in ${rows} counts tens.`),
        T(`Calculá ${c} × ${t / 10} y después pensá en las decenas.`, `Work out ${c} × ${t / 10}, then think about the tens.`),
        { unit: T('remaches', 'rivets'), reward: T(`Las ${t} filas de ${c} remaches, ${n} en total, quedan puestas.`, `The ${t} rows of ${c} rivets, ${n} in all, are in place.`) },
      );
    },
    r => {
      const c = r.int(12, 39), t = r.int(1, 3), o = r.int(2, 9), w = t * 10 + o, wrong = r.int(0, 1) === 0;
      const first = wrong ? c * t : c * t * 10, second = c * o;
      const WRONG = L('Usa una unidad donde corresponde una decena|It uses ones where it should be tens');
      const OK = T(`Está bien: ${first} + ${second} = ${c * w}`, `It is right: ${first} + ${second} = ${c * w}`);
      const CALC = T(`Está mal: ${c} × ${o} no es ${second}`, `It is wrong: ${c} × ${o} is not ${second}`);
      return choose(r,
        T(`Para revisar el panel de ${c} × ${w}, Átomo escribe ${first} + ${second}. ¿Qué pasa?`, `To check the ${c} × ${w} panel, Átomo writes ${first} + ${second}. What is going on?`),
        wrong ? WRONG : OK, wrong ? [OK, CALC] : [WRONG, CALC],
        wrong
          ? T(`El ${t} de ${w} vale ${t * 10}: el primer producto es ${c} × ${t * 10} = ${c * t * 10}, y ${c * t * 10} + ${second} = ${c * w}.`, `The ${t} in ${w} is worth ${t * 10}: the first product is ${c} × ${t * 10} = ${c * t * 10}, and ${c * t * 10} + ${second} = ${c * w}.`)
          : T(`${c} × ${t * 10} = ${first} y ${c} × ${o} = ${second}: juntos dan ${c * w}.`, `${c} × ${t * 10} = ${first} and ${c} × ${o} = ${second}: together they make ${c * w}.`),
        T(`Mirá el ${t} de ${w}. ¿Cuánto vale?`, `Look at the ${t} in ${w}. What is it worth?`),
        { reward: L('Las cuentas de los paneles cierran y Nina remacha las últimas filas.|The panel calculations add up and Nina rivets the last rows.') });
    },
  ],
  'G04-03-L03': [
    r => {
      const rows = r.int(21, 45), per = r.int(12, 19), n = rows * per;
      return typed(
        T(`El alerón tiene ${rows} filas de ${per} remaches. ¿Cuántos remaches lleva?`, `The aileron has ${rows} rows of ${per} rivets. How many rivets does it take?`),
        n,
        T(`${rows} × 10 = ${rows * 10} y ${rows} × ${per - 10} = ${rows * (per - 10)}: ${rows * 10} + ${rows * (per - 10)} = ${n}.`, `${rows} × 10 = ${rows * 10} and ${rows} × ${per - 10} = ${rows * (per - 10)}: ${rows * 10} + ${rows * (per - 10)} = ${n}.`),
        T(`Partí ${per} en 10 y ${per - 10}. Multiplicá ${rows} por cada parte.`, `Split ${per} into 10 and ${per - 10}. Multiply ${rows} by each part.`),
        { unit: T('remaches', 'rivets'), reward: T(`El primer alerón queda remachado: ${n} remaches.`, `The first aileron is riveted: ${n} rivets.`) },
      );
    },
    r => {
      const a = r.int(3, 6) * 10 + r.pick([-2, -1, 1, 2]), b = r.int(2, 3) * 10 + r.pick([-1, 1, 2]);
      const exact = a * b, est = Math.round(a / 10) * 10 * Math.round(b / 10) * 10;
      const kind = r.pick(['big', 'small', 'ok'] as const), shown = kind === 'big' ? exact * 10 : kind === 'small' ? Math.round(exact / 10) : exact;
      const BIG = T(`Es demasiado grande: esperamos cerca de ${es(est)}`, `It is too large: we expect about ${en(est)}`);
      const SMALL = T(`Es demasiado chico: esperamos cerca de ${es(est)}`, `It is too small: we expect about ${en(est)}`);
      const OK = T(`Está cerca de ${es(est)}: puede estar bien`, `It is near ${en(est)}: it may be right`);
      const right = kind === 'big' ? BIG : kind === 'small' ? SMALL : OK;
      return choose(r,
        T(`Para el otro alerón, Átomo calcula ${a} × ${b} y obtiene ${es(shown)}. ¿Qué dice la estimación?`, `For the other aileron, Átomo calculates ${a} × ${b} and gets ${en(shown)}. What does the estimate say?`),
        right, [BIG, SMALL, OK].filter(o => o !== right),
        T(`${Math.round(a / 10) * 10} × ${Math.round(b / 10) * 10} = ${es(est)}. El resultado exacto es ${es(exact)}.`, `${Math.round(a / 10) * 10} × ${Math.round(b / 10) * 10} = ${en(est)}. The exact result is ${en(exact)}.`),
        T(`Redondeá ${a} y ${b} a la decena y multiplicá.`, `Round ${a} and ${b} to the nearest ten and multiply.`),
        { reward: T(`Átomo revisa el segundo alerón: ${es(exact)} remaches. ¡Los dos alerones ya se mueven!`, `Átomo checks the second aileron: ${en(exact)} rivets. Both ailerons move now!`) });
    },
  ],
  'G04-04-L01': [
    r => {
      const ribs = r.int(3, 8), first = r.pick([10, 20, 30]), extra = r.int(1, 9), total = ribs * (first + extra), used = ribs * first;
      return typed(
        T(`Hay ${total} bulones para las ${ribs} costillas del ala. Nina da primero ${first} a cada costilla. ¿Cuántos bulones usa?`, `There are ${total} bolts for the ${ribs} ribs of the wing. Nina first gives ${first} to each rib. How many bolts does that use?`),
        used,
        T(`${ribs} costillas reciben ${first} cada una: ${ribs} × ${first} = ${used}. Quedan ${total - used}.`, `${ribs} ribs get ${first} each: ${ribs} × ${first} = ${used}. ${total - used} are left.`),
        T(`Cada costilla recibe ${first}. ¿Cuántas costillas hay?`, `Each rib gets ${first}. How many ribs are there?`),
        { unit: T('bulones', 'bolts'), reward: T(`Cada costilla recibe ${first} bulones; quedan ${total - used} para repartir.`, `Each rib gets ${first} bolts; ${total - used} are left to share.`) },
      );
    },
    r => {
      const ribs = r.int(3, 8), g1 = r.pick([10, 20]), g2 = r.pick([5, 10]), g3 = r.int(1, 4), each = g1 + g2 + g3, total = ribs * each;
      return chooseNumber(r,
        T(`Hay ${total} bulones para ${ribs} costillas. Átomo da ${g1}, después ${g2} y después ${g3} a cada costilla, y no sobra ninguno. ¿Cuántos recibe cada costilla?`, `There are ${total} bolts for ${ribs} ribs. Átomo gives ${g1}, then ${g2}, then ${g3} to each rib, and none are left. How many does each rib get?`),
        each, [g1, each * ribs, g1 + g2, total - each],
        T(`Los lotes se suman: ${g1} + ${g2} + ${g3} = ${each}, y ${ribs} × ${each} = ${total}.`, `The batches add up: ${g1} + ${g2} + ${g3} = ${each}, and ${ribs} × ${each} = ${total}.`),
        L('Anotá lo que recibe una costilla en cada vuelta y sumalo.|Write down what one rib gets each round and add it up.'),
        { reward: T(`Cada costilla del ala tiene sus ${each} bulones.`, `Each rib of the wing has its ${each} bolts.`) });
    },
  ],
  'G04-04-L02': [
    r => {
      const d = r.int(2, 4), q = r.int(1, Math.floor(9 / d)) * 100 + r.int(1, 9), total = q * d;
      return typed(
        T(`Hay ${total} remaches para ${d} bandejas iguales. ¿Cuántos van en cada bandeja?`, `There are ${total} rivets for ${d} equal trays. How many go in each tray?`),
        q,
        T(`${Math.floor(q / 100) * 100 * d} ÷ ${d} = ${Math.floor(q / 100) * 100} y ${(q % 100) * d} ÷ ${d} = ${q % 100}: ${q} remaches por bandeja.`, `${Math.floor(q / 100) * 100 * d} ÷ ${d} = ${Math.floor(q / 100) * 100} and ${(q % 100) * d} ÷ ${d} = ${q % 100}: ${q} rivets per tray.`),
        T(`Repartí primero las centenas y después lo que queda. ¿Hay decenas para repartir?`, `Share the hundreds first, then the rest. Are there any tens to share?`),
        { unit: T('remaches', 'rivets'), reward: T(`Las ${d} bandejas reciben ${q} remaches cada una.`, `The ${d} trays get ${q} rivets each.`) },
      );
    },
    r => {
      const d = r.int(2, 4), q = r.int(1, Math.floor(9 / d)) * 100 + r.int(1, 9), total = q * d, dropped = Number(String(q).replace('0', '')), wrong = r.int(0, 1) === 0;
      const said = wrong ? dropped : q;
      const LOST = L('Está mal: se pierde el valor de las centenas|It is wrong: the hundreds lose their value');
      const OK = T(`Está bien: ${said} × ${d} = ${total}`, `It is right: ${said} × ${d} = ${total}`);
      const ZERO = L('Está mal: no se puede dividir un número con cero|It is wrong: a number with a zero cannot be divided');
      return choose(r,
        T(`${d} mecánicos se reparten ${total} bulones. Átomo dice que cada uno recibe ${said}. ¿Qué pasa?`, `${d} mechanics share ${total} bolts. Átomo says each one gets ${said}. What is going on?`),
        wrong ? LOST : OK, wrong ? [OK, ZERO] : [LOST, ZERO],
        wrong
          ? T(`${q} × ${d} = ${total}, pero ${dropped} × ${d} = ${dropped * d}. Cada mecánico recibe ${q} bulones.`, `${q} × ${d} = ${total}, but ${dropped} × ${d} = ${dropped * d}. Each mechanic gets ${q} bolts.`)
          : T(`${q} × ${d} = ${total}: el cero guarda el lugar de las decenas.`, `${q} × ${d} = ${total}: the zero keeps the tens place.`),
        T(`Multiplicá lo que dice Átomo por ${d}. ¿Volvés a ${total}?`, `Multiply Átomo’s answer by ${d}. Do you get back to ${total}?`),
        { reward: T(`Cada mecánico recibe su bolsa de ${q} bulones. ¡A trabajar en las dos alas!`, `Each mechanic gets a bag of ${q} bolts. Time to work on both wings!`) });
    },
  ],
  'G04-04-L03': [
    r => {
      const per = r.int(3, 9), bags = r.int(11, 29), rem = r.int(1, per - 1), total = per * bags + rem;
      const opts = [[bags - 1, rem + per], [bags + 1, 0], [bags, per - rem]].filter(([, x]) => x !== rem);
      const say = (b: number, x: number) => x === 0 ? T(`${b} bolsitas y no sobra ninguno`, `${b} bags and none left`) : T(`${b} bolsitas y sobran ${x}`, `${b} bags and ${x} left`);
      return choose(r,
        T(`Hay ${total} tornillos para bolsitas de ${per}. ¿Cuántas bolsitas completas y cuántos tornillos sobran?`, `There are ${total} screws for small bags of ${per}. How many full bags, and how many screws are left?`),
        say(bags, rem), opts.map(([b, x]) => say(b, x)),
        T(`${total} = ${per} × ${bags} + ${rem}, y ${rem} < ${per}: no alcanza para otra bolsita.`, `${total} = ${per} × ${bags} + ${rem}, and ${rem} < ${per}: not enough for another bag.`),
        T(`Contá de ${per} en ${per} sin pasarte de ${total}. ¿Cuánto falta para llegar?`, `Count in ${per}s without going past ${total}. How much is still missing?`),
        { reward: T(`Las ${bags} bolsitas entran en la caja de herramientas, y sobran ${rem} tornillos de repuesto.`, `The ${bags} bags fit in the toolbox, with ${rem} spare screws left over.`) });
    },
    r => {
      const ONE_MORE = L('Hace falta uno más para lo que sobra|One more is needed for what is left');
      const NOT_FULL = L('Lo que sobra no alcanza para otro completo|What is left is not enough for another full one');
      const DROP = L('El resto se borra: no importa|The remainder is erased: it does not matter');
      return oneOf(r, [
        () => {
          const seats = r.int(4, 7), full = r.int(3, 5), left = r.int(1, seats - 1), people = seats * full + left;
          return choose(r,
            T(`Vienen ${people} ayudantes a llevar las alas. Cada auto tiene ${seats} asientos: ${people} ÷ ${seats} = ${full} y sobran ${left}. ¿Qué hacemos con los ${left} que sobran?`, `${people} helpers come to carry the wings. Each car has ${seats} seats: ${people} ÷ ${seats} = ${full}, remainder ${left}. What do we do with the ${left} left over?`),
            ONE_MORE, [NOT_FULL, DROP],
            T(`El resto son ${left} personas: también necesitan asiento. Hacen falta ${full + 1} autos.`, `The remainder is ${left} people: they need seats too. ${full + 1} cars are needed.`),
            L('El resto son personas. ¿Pueden quedarse sin auto?|The remainder is people. Can they be left without a car?'),
            { reward: T(`¡Etapa completa! Llegan ${full + 1} autos llenos de ayudantes, y las dos alas quedan montadas en La Golondrina.`, `Stage complete! ${full + 1} cars full of helpers arrive, and both wings are mounted on La Golondrina.`) });
        },
        () => {
          const per = r.int(4, 8), full = r.int(5, 12), left = r.int(1, per - 1), total = per * full + left;
          return choose(r,
            T(`Hay ${total} tuercas para bolsitas llenas de ${per}: ${total} ÷ ${per} = ${full} y sobran ${left}. ¿Cuántas bolsitas llenas salen? ¿Por qué?`, `There are ${total} nuts for full bags of ${per}: ${total} ÷ ${per} = ${full}, remainder ${left}. How many full bags can be made? Why?`),
            NOT_FULL, [ONE_MORE, DROP],
            T(`Salen ${full} bolsitas llenas. Las ${left} tuercas que sobran no llenan otra.`, `That makes ${full} full bags. The ${left} nuts left over do not fill another.`),
            L('Leé la pregunta: ¿pide bolsitas llenas o lugar para todas?|Read the question: does it ask for full bags or room for all of them?'),
            { reward: L('¡Etapa completa! Las tuercas quedan guardadas, y las dos alas quedan montadas en La Golondrina.|Stage complete! The nuts are stored, and both wings are mounted on La Golondrina.') });
        },
      ]);
    },
  ],
  'G04-05-L01': [
    r => {
      const fifty = r.int(0, 1) === 0, n = fifty ? r.int(6, 24) * 2 : r.int(3, 12) * 4, a = fifty ? 50 : 25, result = a * n;
      return typed(
        T(`Nina pide ${a} cajitas con ${n} fusibles cada una. ¿Cuántos fusibles son?`, `Nina orders ${a} small boxes with ${n} fuses each. How many fuses is that?`),
        result,
        fifty
          ? T(`50 es la mitad de 100: 100 × ${n} = ${es(100 * n)}, y la mitad es ${es(result)}.`, `50 is half of 100: 100 × ${n} = ${en(100 * n)}, and half of that is ${en(result)}.`)
          : T(`25 es un cuarto de 100: 100 × ${n} = ${es(100 * n)}, y un cuarto es ${es(result)}.`, `25 is a quarter of 100: 100 × ${n} = ${en(100 * n)}, and a quarter of that is ${en(result)}.`),
        T(`Pensá primero en 100 cajitas. ¿Qué parte de 100 es ${a}?`, `Think about 100 boxes first. What part of 100 is ${a}?`),
        { unit: T('fusibles', 'fuses'), reward: T(`La caja de fusibles se llena: ${es(result)} fusibles.`, `The fuse box fills up: ${en(result)} fuses.`) },
      );
    },
    r => {
      const n = r.int(6, 24) * 2, valid = r.int(0, 1) === 0, product = 50 * n;
      const other = valid ? `100 × ${n / 2}` : r.pick([`100 × ${n}`, `25 × ${n / 2}`]);
      const value = valid ? product : other.startsWith('100') ? 100 * n : 25 * (n / 2);
      const OK = L('Sirve: duplica un número y toma la mitad del otro|It works: it doubles one number and halves the other');
      const NO = L('No sirve: cambia el resultado|It does not work: it changes the result');
      const FAST = L('Sirve: todo atajo rápido sirve|It works: every quick shortcut works');
      return choose(r,
        T(`Átomo calcula 50 × ${n} como ${other}. ¿Sirve ese atajo?`, `Átomo calculates 50 × ${n} as ${other}. Does that shortcut work?`),
        valid ? OK : NO, valid ? [NO, FAST] : [OK, FAST],
        valid
          ? T(`Duplicar 50 y tomar la mitad de ${n} no cambia el producto: ${other} = ${es(product)}.`, `Doubling 50 and halving ${n} does not change the product: ${other} = ${en(product)}.`)
          : T(`${other} = ${es(value)}, pero 50 × ${n} = ${es(product)}.`, `${other} = ${en(value)}, but 50 × ${n} = ${en(product)}.`),
        L('Calculá las dos cuentas y compará los resultados.|Work out both calculations and compare the results.'),
        { reward: L('El tablero queda conectado y los relojes de la cabina se encienden.|The panel is connected and the cockpit dials light up.') });
    },
  ],
  'G04-05-L02': [
    r => {
      const a = r.int(2, 6) * 100 + r.pick([-1, -2, 1, 2]), days = r.int(2, 4) * 10 + r.pick([-1, 1]), est = Math.round(a / 100) * 100 * Math.round(days / 10) * 10;
      return chooseNumber(r,
        T(`La Golondrina volará unos ${a} km por día durante ${days} días. ¿Qué tamaño esperamos para el total, ${a} × ${days}?`, `La Golondrina will fly about ${a} km a day for ${days} days. What size of total do we expect for ${a} × ${days}?`),
        est, [est * 10, est / 10, a + days],
        T(`${Math.round(a / 100) * 100} × ${Math.round(days / 10) * 10} = ${es(est)} km.`, `${Math.round(a / 100) * 100} × ${Math.round(days / 10) * 10} = ${en(est)} km.`),
        T(`Redondeá ${a} a la centena y ${days} a la decena.`, `Round ${a} to the nearest hundred and ${days} to the nearest ten.`),
        { unit: ['km', 'km'], reward: T(`El mapa del viaje queda colgado en la pared: unos ${es(est)} km de recorrido.`, `The trip map hangs on the wall: about ${en(est)} km of route.`) });
    },
    r => {
      const a = r.int(2, 6) * 100 + r.pick([-1, -2, 1, 2]), days = r.int(2, 4) * 10 + r.pick([-1, 1]), exact = a * days, est = Math.round(a / 100) * 100 * Math.round(days / 10) * 10;
      const far = r.int(0, 1) === 0, shown = far ? exact * 10 : exact + r.pick([-10, 10, -100, 100]);
      const EXACT = L('No alcanza: hace falta la cuenta exacta|It is not enough: the exact calculation is needed');
      const WRONG = L('Alcanza para saber que está mal: queda muy lejos|It is enough to know it is wrong: it is far off');
      const NEAR = L('Sí: todo resultado cercano es correcto|Yes: every nearby result is correct');
      return choose(r,
        T(`Átomo calcula ${a} × ${days} y escribe ${es(shown)} km. La estimación da unos ${es(est)} km. ¿Qué podés decir?`, `Átomo calculates ${a} × ${days} and writes ${en(shown)} km. The estimate is about ${en(est)} km. What can you say?`),
        far ? WRONG : EXACT, far ? [EXACT, NEAR] : [WRONG, NEAR],
        far
          ? T(`${es(shown)} es unas diez veces ${es(est)}: hay un error grande. La cuenta exacta da ${es(exact)} km.`, `${en(shown)} is about ten times ${en(est)}: there is a big mistake. The exact calculation gives ${en(exact)} km.`)
          : T(`La estimación detecta errores grandes, no las últimas cifras. La cuenta exacta da ${es(exact)} km.`, `An estimate catches big errors, not the last digits. The exact calculation gives ${en(exact)} km.`),
        T(`Compará ${es(shown)} con ${es(est)}. ¿Están cerca o lejos?`, `Compare ${en(shown)} with ${en(est)}. Are they close or far apart?`),
        { reward: T(`Nina anota en la bitácora la distancia planeada exacta: ${es(exact)} km.`, `Nina writes the exact planned distance in the logbook: ${en(exact)} km.`) });
    },
  ],
  'G04-05-L03': [
    r => {
      const litres = r.int(41, 89), cans = r.int(2, 6), hundred = r.int(0, 1) === 0, typedTimes = hundred ? cans * 100 : cans * 10;
      const TEN = L('Es diez veces mayor|It is ten times larger'), HUNDRED = L('Es cien veces mayor|It is a hundred times larger');
      const PLUS = T(`Es ${typedTimes - cans} litros más`, `It is ${typedTimes - cans} litres more`);
      return choose(r,
        T(`Nina necesita ${cans} bidones de ${litres} L: ${litres} × ${cans}. Átomo tecleó ${litres} × ${typedTimes}. ¿Cómo cambia el resultado?`, `Nina needs ${cans} cans of ${litres} L: ${litres} × ${cans}. Átomo typed ${litres} × ${typedTimes}. How does the result change?`),
        hundred ? HUNDRED : TEN, [hundred ? TEN : HUNDRED, PLUS],
        T(`${typedTimes} = ${hundred ? 100 : 10} × ${cans}: ${es(litres * typedTimes)} en vez de ${litres * cans}.`, `${typedTimes} = ${hundred ? 100 : 10} × ${cans}: ${en(litres * typedTimes)} instead of ${litres * cans}.`),
        T(`¿Cuántas veces ${cans} es ${typedTimes}?`, `How many times ${cans} is ${typedTimes}?`),
        { reward: T(`Llegan los ${cans} bidones: ${litres * cans} L de combustible, justo lo pedido.`, `The ${cans} cans arrive: ${litres * cans} L of fuel, exactly what was ordered.`) });
    },
    r => {
      const litres = r.int(41, 89), cans = r.int(2, 6), est = Math.round(litres / 10) * 10 * cans, odd = r.int(0, 1) === 0;
      const shown = odd ? litres * cans * 10 : litres * cans;
      const CHECK = L('Revisar los datos, la operación y la estimación|Check the data, the operation, and the estimate');
      const FINE = L('Parece razonable: coincide con la estimación|It looks reasonable: it matches the estimate');
      const SCREEN = L('Nada: la pantalla siempre tiene razón|Nothing: the screen is always right');
      return choose(r,
        T(`Se piden ${cans} bidones de unos ${litres} L. La pantalla muestra ${es(shown)} L. ¿Qué conviene hacer?`, `${cans} cans of about ${litres} L are ordered. The screen shows ${en(shown)} L. What should we do?`),
        odd ? CHECK : FINE, odd ? [FINE, SCREEN] : [CHECK, SCREEN],
        odd
          ? T(`Esperamos unos ${es(est)} L, y ${es(shown)} es unas diez veces más: algo se tecleó mal.`, `We expect about ${en(est)} L, and ${en(shown)} is about ten times more: something was typed wrong.`)
          : T(`Esperamos unos ${es(est)} L, y ${es(shown)} está cerca: el resultado es razonable.`, `We expect about ${en(est)} L, and ${en(shown)} is close: the result is reasonable.`),
        T(`Estimá: ${cans} bidones de unos ${Math.round(litres / 10) * 10} L. ¿Cuánto da?`, `Estimate: ${cans} cans of about ${Math.round(litres / 10) * 10} L. What do you get?`));
    },
  ],
};
