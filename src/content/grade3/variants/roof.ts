// Chapter 4 — The roof before the rain (G03-06): division as equal rows and as
// sharing, checking with a multiplication, what the quotient counts, and what
// to do with the remainder.
import { T, choose, typed, L, type Generator } from './kit';

export const roof: Record<string, [Generator, Generator]> = {
  'G03-06-L01': [
    r => {
      const rows = r.int(3, 9), each = r.int(3, 9), total = rows * each;
      return typed(
        T(`Hay ${total} chapas para ${rows} filas iguales. ¿Cuántas chapas van en cada fila?`, `There are ${total} roof sheets for ${rows} equal rows. How many sheets go in each row?`),
        each,
        T(`${rows} filas de ${each} chapas forman ${total}: ${total} ÷ ${rows} = ${each}.`, `${rows} rows of ${each} sheets make ${total}: ${total} ÷ ${rows} = ${each}.`),
        T(`Buscá el número que multiplicado por ${rows} da ${total}.`, `Find the number that times ${rows} makes ${total}.`),
        { unit: T('chapas', 'sheets') },
      );
    },
    r => {
      const boxes = r.int(3, 9), each = r.int(3, 9), total = boxes * each;
      return choose(r,
        T(`Repartimos ${total} tornillos por igual en ${boxes} cajitas: van ${each} en cada una. ¿Qué cuenta comprueba el reparto?`, `We share ${total} screws equally into ${boxes} little boxes: ${each} go in each one. Which calculation checks the sharing?`),
        T(`${boxes} × ${each} = ${total}`, `${boxes} × ${each} = ${total}`),
        [T(`${boxes} + ${each} = ${boxes + each}`, `${boxes} + ${each} = ${boxes + each}`), T(`${total} − ${boxes} = ${total - boxes}`, `${total} − ${boxes} = ${total - boxes}`), T(`${total} × ${boxes} = ${total * boxes}`, `${total} × ${boxes} = ${total * boxes}`)],
        T(`${boxes} × ${each} = ${total}: la multiplicación arma otra vez todos los grupos.`, `${boxes} × ${each} = ${total}: multiplication builds all the groups again.`),
        T(`Si cada cajita tiene ${each} tornillos, ¿cuántos hay en las ${boxes} cajitas?`, `If each little box has ${each} screws, how many are there in all ${boxes} boxes?`),
        { reward: T(`Cada ayudante tiene su cajita con ${each} tornillos.`, `Every helper has a little box with ${each} screws.`) });
    },
  ],
  'G03-06-L02': [
    r => {
      const per = r.int(3, 9), rows = r.int(3, 9), total = per * rows, perKnown = r.int(0, 1) === 0;
      const q = perKnown ? rows : per;
      const ROWS = T(`${q} hileras`, `${q} rows`), PER = T(`${q} tejas en cada hilera`, `${q} tiles in each row`), LEFT = T(`${q} tejas que sobran`, `${q} tiles left over`);
      return choose(r,
        perKnown
          ? T(`Hay ${total} tejas. Van ${per} en cada hilera. La cuenta da ${q}. ¿Qué significa ese ${q}?`, `There are ${total} tiles. ${per} go in each row. The calculation gives ${q}. What does that ${q} mean?`)
          : T(`Hay ${total} tejas para ${rows} hileras iguales. La cuenta da ${q}. ¿Qué significa ese ${q}?`, `There are ${total} tiles for ${rows} equal rows. The calculation gives ${q}. What does that ${q} mean?`),
        perKnown ? ROWS : PER, perKnown ? [PER, LEFT] : [ROWS, LEFT],
        perKnown
          ? T(`Ya sabemos que van ${per} por hilera. Buscábamos cuántas hileras: ${total} ÷ ${per} = ${rows}.`, `We already know ${per} go in each row. We were looking for how many rows: ${total} ÷ ${per} = ${rows}.`)
          : T(`Ya sabemos que hay ${rows} hileras. Buscábamos cuántas tejas van en cada una: ${total} ÷ ${rows} = ${per}.`, `We already know there are ${rows} rows. We were looking for how many tiles go in each: ${total} ÷ ${rows} = ${per}.`),
        T('Leé qué dato ya sabés y qué dato falta averiguar.', 'Read which fact you already know and which one is still missing.'),
        { reward: T(`Las ${rows} hileras quedan marcadas con tiza.`, `The ${rows} rows are marked in chalk.`) });
    },
    r => {
      const k = r.int(3, 8), each = r.int(4, 9), total = k * each, share = r.int(0, 1) === 0;
      const GROUPS = L('Cuántos grupos hay|How many groups there are'), EACH = L('Cuántos clavos hay en cada grupo|How many nails are in each group'), LEFT = L('Los clavos que sobran|The nails left over');
      return choose(r,
        share
          ? T(`Repartimos ${total} clavos por igual entre ${k} trabajadores: ${total} ÷ ${k}. ¿Qué cuenta el ${k}?`, `We share ${total} nails equally among ${k} workers: ${total} ÷ ${k}. What does the ${k} count?`)
          : T(`Guardamos ${total} clavos en bolsitas de ${k}: ${total} ÷ ${k}. ¿Qué cuenta el ${k}?`, `We put ${total} nails into little bags of ${k}: ${total} ÷ ${k}. What does the ${k} count?`),
        share ? GROUPS : EACH, share ? [EACH, LEFT] : [GROUPS, LEFT],
        share
          ? T(`Acá el ${k} cuenta trabajadores: son ${k} grupos. Cada uno recibe ${each} clavos.`, `Here the ${k} counts workers: there are ${k} groups. Each one gets ${each} nails.`)
          : T(`Acá el ${k} cuenta los clavos de cada bolsita. Salen ${each} bolsitas.`, `Here the ${k} counts the nails in each bag. That makes ${each} bags.`),
        T(`Leé otra vez: ¿el ${k} son personas, bolsitas o clavos?`, `Read it again: is the ${k} people, bags, or nails?`),
        { reward: L('Los clavos quedan repartidos. ¡A martillar!|The nails are shared out. Time to hammer!') });
    },
  ],
  'G03-06-L03': [
    r => {
      const per = r.int(4, 9), rows = r.int(3, 8), rem = r.int(2, per - 1), total = per * rows + rem;
      return choose(r,
        T(`Quedan ${total} tejas. Van en hileras de ${per}. ¿Cuántas hileras completas salen y cuántas tejas sobran?`, `${total} tiles are left. They go in rows of ${per}. How many full rows can we make, and how many tiles are left over?`),
        T(`${rows} hileras y sobran ${rem}`, `${rows} rows and ${rem} left over`),
        [T(`${rows - 1} hileras y sobran ${rem + per}`, `${rows - 1} rows and ${rem + per} left over`), T(`${rows + 1} hileras y no sobra ninguna`, `${rows + 1} rows and none left over`), T(`${rows} hileras y sobran ${per - rem}`, `${rows} rows and ${per - rem} left over`)].filter((_, i) => i < 2 || per - rem !== rem),
        T(`${total} = ${per} × ${rows} + ${rem}. Sobran ${rem}, menos que ${per}.`, `${total} = ${per} × ${rows} + ${rem}. ${rem} are left over, fewer than ${per}.`),
        T(`Contá de ${per} en ${per} sin pasar de ${total} tejas. Después mirá cuántas sobran.`, `Count by ${per}s without going past ${total} tiles. Then see how many are left.`),
        { reward: T(`Las ${rem} tejas que sobran techan la cucha de Canela.`, `The ${rem} extra tiles cover Canela’s dog house.`) });
    },
    r => {
      const per = r.int(3, 8), full = r.int(3, 6), rem = r.int(1, per - 1), total = per * full + rem, need = full + 1;
      const enough = r.int(0, 1) === 0, trips = enough ? need : full;
      const YES = T(`Sí: ${trips} viajes suben ${trips * per} rollos`, `Yes: ${trips} trips lift ${trips * per} rolls`);
      const NO = T(`No: hacen falta ${trips + 1} viajes`, `No: ${trips + 1} trips are needed`);
      const DROP = L('Sí: los rollos que sobran no importan|Yes: the leftover rolls do not matter');
      return choose(r,
        T(`Hay que subir ${total} rollos al techo. El montacargas lleva ${per} rollos por viaje. ¿Alcanza con ${trips} viajes?`, `${total} rolls must go up to the roof. The hoist carries ${per} rolls per trip. Are ${trips} trips enough?`),
        enough ? YES : NO, enough ? [NO, DROP] : [YES, DROP],
        enough
          ? T(`${trips} viajes suben ${trips * per} rollos, y ${trips * per} es más que ${total}. ¡Alcanza!`, `${trips} trips lift ${trips * per} rolls, and ${trips * per} is more than ${total}. It is enough!`)
          : T(`${trips} viajes suben ${trips * per} rollos. Los ${rem} que quedan necesitan otro viaje.`, `${trips} trips lift ${trips * per} rolls. The ${rem} left need one more trip.`),
        T(`Contá los rollos que suben en ${trips} viajes. ¿Quedan rollos abajo?`, `Count the rolls lifted in ${trips} trips. Are any rolls left down below?`));
    },
  ],
};
