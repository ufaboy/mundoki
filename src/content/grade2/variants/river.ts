// Chapter 2 — Stepping-Stone River (G02-03, G02-04): jumps of 10/100/50/20,
// ten or a hundred more and less, and additive stories with logs, stones, sticks.
import { T, choose, typed, type Generator } from './kit';

const repeat = (part: number, times: number) => Array(times).fill(part).join(' + ');

export const river: Record<string, [Generator, Generator]> = {
  'G02-03-L01': [
    r => {
      const big = r.int(0, 1) === 0, step = big ? 100 : 10;
      const start = big ? r.int(1, 6) * 100 + r.int(0, 9) * 10 + r.int(0, 9) : r.int(10, 96) * 10 + r.int(0, 9);
      const next = start + 3 * step;
      return typed(
        big ? T(`Piedras grandes: ${start}, ${start + 100}, ${start + 200}. ¿Qué número sigue?`, `Big stones: ${start}, ${start + 100}, ${start + 200}. What number comes next?`)
          : T(`Piedras chicas: ${start}, ${start + 10}, ${start + 20}. ¿Qué número sigue?`, `Small stones: ${start}, ${start + 10}, ${start + 20}. What number comes next?`),
        next,
        big ? T(`Cada piedra grande suma 100: ${start + 200} + 100 = ${next}.`, `Each big stone adds 100: ${start + 200} + 100 = ${next}.`) : T(`Cada piedra chica suma 10: ${start + 20} + 10 = ${next}.`, `Each small stone adds 10: ${start + 20} + 10 = ${next}.`),
        T(`Compará ${start} con ${start + step}. Hacé el mismo salto desde ${start + 2 * step}.`, `Compare ${start} with ${start + step}. Make the same jump from ${start + 2 * step}.`),
        { reward: T(`{name} salta a la piedra ${next} y no se cae.`, `{name} jumps to stone ${next} and does not fall.`) },
      );
    },
    r => {
      const big = r.int(0, 1) === 0, n = r.int(1, 8) * 100 + r.int(0, 8) * 10 + r.int(1, 9), m = n + (big ? 100 : 10);
      const TEN = T('Hay una decena más', 'There is one more ten'), HUNDRED = T('Hay una centena más', 'There is one more hundred');
      return choose(r,
        T(`Después de un salto, ${n} pasa a ${m}. ¿Por qué?`, `After one jump, ${n} becomes ${m}. Why?`),
        big ? HUNDRED : TEN, [big ? TEN : HUNDRED, T('Cambiaron las unidades', 'The ones changed')],
        big ? T(`Sumamos una centena: ${n} + 100 = ${m}.`, `We add one hundred: ${n} + 100 = ${m}.`) : T(`Sumamos una decena: ${n} + 10 = ${m}.`, `We add one ten: ${n} + 10 = ${m}.`),
        T(`Compará ${n} y ${m} cifra por cifra. ¿Cuál cambió?`, `Compare ${n} and ${m} digit by digit. Which one changed?`));
    },
  ],
  'G02-03-L02': [
    r => {
      const drops = r.int(0, 5) * 50;
      if (r.int(0, 1) === 0) return typed(
        T(`Hay ${drops} gotas. Cada vuelta del espejito suma 50. ¿Cuántas vueltas faltan para llegar a 300?`, `There are ${drops} drops. Each turn of the mirror adds 50. How many turns are left to reach 300?`),
        (300 - drops) / 50,
        T(`De ${drops} a 300 hay ${300 - drops} gotas: ${(300 - drops) / 50} saltos de 50.`, `From ${drops} to 300 there are ${300 - drops} drops: ${(300 - drops) / 50} jumps of 50.`),
        T(`Desde ${drops}, contá de 50 en 50 hasta 300. Marcá cada vuelta.`, `From ${drops}, count by 50s up to 300. Mark each turn.`),
        { unit: T('vueltas', 'turns') });
      return typed(
        T(`Hay ${drops} gotas. Con 300 gotas el hielo se rompe. ¿Cuántas gotas faltan?`, `There are ${drops} drops. At 300 drops the ice breaks. How many drops are missing?`),
        300 - drops,
        T(`${drops} + ${300 - drops} = 300.`, `${drops} + ${300 - drops} = 300.`),
        T(`Desde ${drops}, contá de 50 en 50 hasta 300.`, `From ${drops}, count by 50s up to 300.`),
        { unit: T('gotas', 'drops') });
    },
    r => {
      const piece = r.pick([20, 50]), k = piece === 20 ? r.int(3, 6) : r.int(2, 4), total = piece * k;
      return choose(r,
        T(`La soga tiene ${k} trozos de ${piece} cm. ¿Por qué mide ${total} cm?`, `The rope has ${k} pieces of ${piece} cm. Why is it ${total} cm long?`),
        T(`${repeat(piece, k)} = ${total}`, `${repeat(piece, k)} = ${total}`),
        [T(`${k} + ${piece} = ${k + piece}`, `${k} + ${piece} = ${k + piece}`), T(`${repeat(piece / 2, k)} = ${total / 2}`, `${repeat(piece / 2, k)} = ${total / 2}`)],
        T(`Cada uno de los ${k} trozos mide ${piece} cm.`, `Each of the ${k} pieces is ${piece} cm long.`),
        T(`Dibujá ${k} trozos de soga. Escribí ${piece} en cada uno y sumalos.`, `Draw ${k} rope pieces. Write ${piece} on each and add them.`));
    },
  ],
  'G02-03-L03': [
    r => {
      const less = r.int(0, 1) === 0;
      const n = less ? r.int(1, 9) * 100 + r.int(0, 9) : r.int(0, 8) * 100 + 90 + r.int(0, 9);
      const answer = less ? n - 10 : n + 10;
      return typed(
        less ? T(`El martillo está en el nido que tiene 10 menos que ${n}. ¿Qué número tiene?`, `The hammer is in the nest that is 10 less than ${n}. What number is it?`)
          : T(`El martillo está en el nido que tiene 10 más que ${n}. ¿Qué número tiene?`, `The hammer is in the nest that is 10 more than ${n}. What number is it?`),
        answer,
        less ? T(`${n} − 10 = ${answer}. Restamos 10, no 100.`, `${n} − 10 = ${answer}. We take away 10, not 100.`) : T(`${n} + 10 = ${answer}. Sumamos 10, no 100.`, `${n} + 10 = ${answer}. We add 10, not 100.`),
        less ? T(`En ${n} no hay decenas sueltas. Abrí una centena antes de sacar 10.`, `${n} has no loose tens. Open a hundred before taking away 10.`) : T(`Desde ${n}, ¿cuánto falta para la próxima centena?`, `From ${n}, how far is the next hundred?`),
        { reward: T(`¡El martillo aparece en el nido ${answer}!`, `The hammer turns up in nest ${answer}!`) },
      );
    },
    r => {
      const n = r.int(0, 8) * 100 + 90 + r.int(1, 9), more = n + 10, toHundred = 100 - (n % 100);
      return choose(r,
        T(`El cincel está en el nido que tiene 10 más que ${n}. ¿Por qué no es ${n + 1}?`, `The chisel is in the nest that is 10 more than ${n}. Why is it not ${n + 1}?`),
        T(`${n} + 10 = ${more}`, `${n} + 10 = ${more}`),
        [T(`Después de ${n} siempre va ${n + 1}`, `After ${n} always comes ${n + 1}`), T(`${n} + 10 = ${n + 100}`, `${n} + 10 = ${n + 100}`)],
        T(`${n} + ${toHundred} = ${n + toHundred} y faltan ${10 - toHundred} más: ${more}.`, `${n} + ${toHundred} = ${n + toHundred}, and ${10 - toHundred} more are left: ${more}.`),
        T(`Usá ${toHundred} de los 10 para llegar a ${n + toHundred}. ¿Usaste los 10?`, `Use ${toHundred} of the 10 to get to ${n + toHundred}. Did you use all 10?`),
        { reward: T(`¡El cincel está en el nido ${more}! Ya están todas las herramientas.`, `The chisel is in nest ${more}! All the tools are here.`) });
    },
  ],
  'G02-04-L01': [
    r => {
      const a = r.int(30, 99), b = r.int(10, a - 10);
      return typed(
        T(`Había ${a} troncos. Usaron ${b} en una pared. ¿Cuántos quedan?`, `There were ${a} logs. ${b} were used for a wall. How many are left?`),
        a - b,
        T(`Usar troncos deja menos: ${a} − ${b} = ${a - b}.`, `Using logs leaves fewer: ${a} − ${b} = ${a - b}.`),
        T(`Mostrá los ${a} troncos. Separá los ${b} que se usaron.`, `Show the ${a} logs. Set aside the ${b} that were used.`),
        { unit: T('troncos', 'logs'), reward: T(`Quedan ${a - b} troncos: alcanzan para otra pared.`, `${a - b} logs are left: enough for another wall.`) },
      );
    },
    r => {
      const a = r.int(20, 49), b = r.int(10, 19), join = r.int(0, 1) === 0;
      const JOIN = T('En las dos, dos partes forman el total', 'In both, two parts make the total'), TAKE = T('En las dos se saca una parte', 'In both, a part is taken away');
      return choose(r,
        join ? T(`Una historia junta dos pilas de ${a} y ${b} troncos. Otra tiene ${a} troncos y recibe ${b}. ¿Por qué las dos son ${a} + ${b}?`, `One story joins two piles of ${a} and ${b} logs. Another has ${a} logs and gets ${b} more. Why are both ${a} + ${b}?`)
          : T(`Una historia tiene ${a} troncos y el río se lleva ${b}. Otra tiene ${a} y usan ${b}. ¿Por qué las dos son ${a} − ${b}?`, `One story has ${a} logs and the river carries away ${b}. Another has ${a} and ${b} are used. Why are both ${a} − ${b}?`),
        join ? JOIN : TAKE, [join ? TAKE : JOIN, T('En las dos aparece la palabra «más»', 'Both use the word “more”')],
        join ? T('Juntar dos pilas o recibir más troncos: en los dos casos sumamos las partes.', 'Joining two piles or getting more logs: either way we add the parts.') : T('Llevarse troncos o usarlos: en los dos casos quitamos una parte.', 'Carrying logs away or using them: either way we take a part away.'),
        T(`En cada historia, buscá qué cuenta el ${a} y qué cuenta el ${b}.`, `In each story, find what the ${a} counts and what the ${b} counts.`));
    },
  ],
  'G02-04-L02': [
    r => {
      const b = r.int(11, 39), a = b + r.int(3, 19);
      return typed(
        T(`El lado izquierdo necesita ${a} piedras y el derecho ${b}. ¿Cuántas más necesita el izquierdo?`, `The left side needs ${a} stones and the right side needs ${b}. How many more does the left side need?`),
        a - b,
        T(`${b} + ${a - b} = ${a}. La diferencia es ${a - b}.`, `${b} + ${a - b} = ${a}. The difference is ${a - b}.`),
        T(`Desde ${b}, contá cuánto falta para llegar a ${a}.`, `From ${b}, count how many more to reach ${a}.`),
        { unit: T('piedras', 'stones'), reward: T(`Al lado izquierdo le ponen ${a - b} piedras más.`, `${a - b} extra stones go to the left side.`) },
      );
    },
    r => {
      const b = r.int(11, 39), a = b + r.int(3, 19), sum = r.int(0, 1) === 0;
      const TOTAL = T('Cuántas piedras se necesitan en total', 'How many stones are needed in all'), MORE = T('Cuántas más necesita el izquierdo', 'How many more the left side needs');
      return choose(r,
        T(`El izquierdo necesita ${a} piedras y el derecho ${b}. ¿Qué pregunta responde ${a} ${sum ? '+' : '−'} ${b}?`, `The left needs ${a} stones and the right ${b}. Which question does ${a} ${sum ? '+' : '−'} ${b} answer?`),
        sum ? TOTAL : MORE, [sum ? MORE : TOTAL, T('Cuántas piedras sobran', 'How many stones are left over')],
        sum ? T('Sumar da el total de los dos lados, no la diferencia.', 'Adding gives the total for both sides, not the difference.') : T('Restar da la diferencia entre los dos lados, no el total.', 'Subtracting gives the difference between the two sides, not the total.'),
        T(`Imaginá ${a} y ${b} piedras en dos filas. ¿Las juntás o las comparás?`, `Imagine ${a} and ${b} stones in two rows. Do you put them together or compare them?`));
    },
  ],
  'G02-04-L03': [
    r => {
      const total = r.int(5, 9) * 10, have = r.int(Math.max(total - 29, total / 2 + 1), total - 3);
      return typed(
        T(`La compuerta necesita ${total} palos. Ya hay ${have}. ¿Cuántos faltan?`, `The gate needs ${total} sticks. ${have} are already in. How many are missing?`),
        total - have,
        T(`${have} + ${total - have} = ${total}.`, `${have} + ${total - have} = ${total}.`),
        T(`Empezá en ${have}. Contá cuánto falta para llegar a ${total}.`, `Start at ${have}. Count how many more to reach ${total}.`),
        { unit: T('palos', 'sticks') },
      );
    },
    r => {
      const total = r.int(5, 9) * 10, have = r.int(Math.max(total - 29, total / 2 + 1), total - 3), miss = total - have;
      return choose(r,
        T(`La compuerta necesita ${total} palos. Hay ${have} y faltan ${miss}. ¿Cómo lo comprobás?`, `The gate needs ${total} sticks. There are ${have}, and ${miss} are missing. How do you check it?`),
        T(`${have} + ${miss} = ${total}`, `${have} + ${miss} = ${total}`),
        [T(`${total} + ${miss} = ${total + miss}`, `${total} + ${miss} = ${total + miss}`), T(`${have} − ${miss} = ${have - miss}`, `${have} − ${miss} = ${have - miss}`)],
        T('La parte que falta más la parte puesta forman el total.', 'The missing part plus the part in place makes the total.'),
        T(`Juntá los ${have} palos puestos con los ${miss} que faltan. ¿Qué total tiene que dar?`, `Put the ${have} sticks in place together with the ${miss} missing ones. What total should you get?`));
    },
  ],
};
