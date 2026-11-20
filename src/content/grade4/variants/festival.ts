// Chapters 11–12 — The festival poster and the aeroclub festival (G04-13,
// G04-14): checking a table, whom a survey describes, pictographs, axis scales,
// "more than half", fractions of a quantity, and correcting partial products.
import { T, choose, typed, es, en, L, type Generator } from './kit';

export const festival: Record<string, [Generator, Generator]> = {
  'G04-13-L01': [
    r => {
      const people = r.int(10, 24), kind = r.pick(['more', 'less', 'same'] as const), total = kind === 'same' ? people : kind === 'more' ? people + r.int(1, 3) : people - r.int(1, 3);
      const RECOUNT = L('Reviso el registro y vuelvo a contar|I check the records and count again'), OK = L('Está bien: el total coincide con las personas|It is fine: the total matches the people'), ACCEPT = L('Lo acepto sin revisar|I accept it without checking');
      return choose(r,
        T(`En otro grupo respondieron ${people} personas, una vez cada una, y la tabla suma ${total}. ¿Qué hacés?`, `In another group ${people} people answered, once each, and the table adds up to ${total}. What do you do?`),
        kind === 'same' ? OK : RECOUNT, kind === 'same' ? [RECOUNT, ACCEPT] : [OK, ACCEPT],
        kind === 'same'
          ? T(`Cada persona aparece una vez: ${people} personas, ${total} respuestas.`, `Each person appears once: ${people} people, ${total} answers.`)
          : T(`Cada respuesta debe aparecer una sola vez: ${total} no puede ser el total de ${people} personas.`, `Each answer must appear only once: ${total} cannot be the total for ${people} people.`),
        L('Compará el total de la tabla con la cantidad de personas que respondieron.|Compare the table’s total with the number of people who answered.'),
        { reward: L('La tabla queda revisada: cada respuesta aparece una sola vez.|The table is checked: each answer appears only once.') });
    },
    r => {
      const n = r.int(10, 30), group = r.pick([
        ['chicos del aeroclub', 'aeroclub kids', 'chicos de la Argentina', 'children in Argentina'],
        ['vecinos de la cuadra', 'neighbours on the block', 'vecinos de la ciudad', 'people in the town'],
        ['pasajeros del vuelo', 'passengers on the flight', 'pasajeros de todos los vuelos', 'passengers on every flight'],
      ]);
      return choose(r,
        T(`¿A quiénes describe la encuesta de los ${n} ${group[0]}?`, `Whom does the survey of the ${n} ${group[1]} describe?`),
        T(`A los ${n} ${group[0]} que respondieron`, `The ${n} ${group[1]} who answered`),
        [T(`A todos los ${group[2]}`, `All the ${group[3]}`), L('A cualquier persona|Anyone at all')],
        T(`Los datos describen al grupo que respondió, no a todos los ${group[2]}.`, `The data describe the group that answered, not all the ${group[3]}.`),
        L('Pensá a quiénes les preguntaron y a quiénes no.|Think about who was asked and who was not.'),
        { reward: L('El cartel dice a quiénes les preguntaron.|The poster says who was asked.') });
    },
  ],
  'G04-13-L02': [
    r => {
      const stars = r.int(3, 8), key = r.pick([2, 3, 5, 10]), votes = stars * key;
      return typed(
        T(`En el pictograma de otro grupo, una fila tiene ${stars} estrellas. La clave dice ★ = ${key} votos. ¿Cuántos votos son?`, `In another group’s pictograph, one row has ${stars} stars. The key says ★ = ${key} votes. How many votes is that?`),
        votes,
        T(`${stars} estrellas por ${key} votos cada una: ${stars} × ${key} = ${votes} votos.`, `${stars} stars at ${key} votes each: ${stars} × ${key} = ${votes} votes.`),
        T(`Cada estrella vale ${key}. Contá de ${key} en ${key}.`, `Each star is worth ${key}. Count in ${key}s.`),
        { unit: T('votos', 'votes'), model: { stars: [stars, key] }, reward: T(`La fila de ${stars} estrellas queda leída: ${votes} votos.`, `The row of ${stars} stars is read: ${votes} votes.`) },
      );
    },
    r => {
      const key = r.pick([2, 3, 5, 10]), stars = r.int(2, 9), votes = stars * key;
      return typed(
        T(`Con la clave ★ = ${key} votos, ¿cuántas estrellas hay que dibujar para ${votes} votos?`, `With the key ★ = ${key} votes, how many stars must be drawn for ${votes} votes?`),
        stars,
        T(`${votes} ÷ ${key} = ${stars} estrellas.`, `${votes} ÷ ${key} = ${stars} stars.`),
        T(`¿Cuántos grupos de ${key} votos entran en ${votes}?`, `How many groups of ${key} votes fit in ${votes}?`),
        { unit: T('estrellas', 'stars'), reward: T(`La fila de ${votes} votos queda con sus ${stars} estrellas.`, `The ${votes}-vote row gets its ${stars} stars.`) },
      );
    },
  ],
  'G04-13-L03': [
    r => {
      const step = r.pick([2, 5, 10, 20]), k = r.int(2, 5), v = step * k;
      return typed(
        T(`La escala del eje avanza de a ${step}. ¿Qué valor sigue a ${v}?`, `The axis scale goes up by ${step} each step. Which value comes after ${v}?`),
        v + step,
        T(`Pasos iguales: ${Array.from({ length: k + 2 }, (_, i) => i * step).join(', ')}.`, `Equal steps: ${Array.from({ length: k + 2 }, (_, i) => i * step).join(', ')}.`),
        T(`Sumale un paso de ${step} a ${v}.`, `Add one step of ${step} to ${v}.`),
        { reward: T(`El eje queda parejo: ${Array.from({ length: k + 2 }, (_, i) => i * step).join(', ')}.`, `The axis is even: ${Array.from({ length: k + 2 }, (_, i) => i * step).join(', ')}.`) },
      );
    },
    r => {
      const total = r.pick([10, 12, 14, 16, 20]), half = total / 2, kind = r.pick(['more', 'half', 'less'] as const);
      const v = kind === 'more' ? half + r.int(1, 2) : kind === 'half' ? half : half - 1;
      const place = r.pick([['Iguazú', 'Iguazú'], ['el glaciar', 'the glacier'], ['Valdés', 'Valdés']]);
      const MORE = L('Sí, más de la mitad|Yes, more than half'), HALF = L('No, exactamente la mitad|No, exactly half'), LESS = L('No, menos de la mitad|No, less than half');
      const right = kind === 'more' ? MORE : kind === 'half' ? HALF : LESS;
      return choose(r,
        T(`Votaron ${total} chicos y ${place[0]} tiene ${v} votos, la barra más alta. ¿Tiene más de la mitad?`, `${total} kids voted and ${place[1]} has ${v} votes, the tallest bar. Does it have more than half?`),
        right, [MORE, HALF, LESS].filter(o => o !== right),
        T(`La mitad de ${total} es ${half}, y ${place[0]} tiene ${v}. Ser la más elegida no significa superar la mitad.`, `Half of ${total} is ${half}, and ${place[1]} has ${v}. Being the most chosen does not mean more than half.`),
        T(`Repartí ${total} votos en dos grupos iguales y compará con ${v}.`, `Share ${total} votes into two equal groups and compare with ${v}.`),
        { reward: L('¡Etapa completa! El cartel muestra la foto más votada, con el glaciar y las ballenas al lado, y dice bien qué parte de los votos tuvo.|Stage complete! The poster shows the most-voted photo, with the glacier and the whales beside it, and says correctly what share of the votes it got.') });
    },
  ],
  'G04-14-L01': [
    r => {
      const [packs, per] = r.pick([[8, 25], [6, 20], [4, 50], [10, 12], [5, 40], [9, 20]] as const), total = packs * per;
      const part = r.pick([[2, 'La mitad', 'Half'], [4, 'Un cuarto', 'One quarter'], [5, 'Un quinto', 'One fifth'], [10, 'Un décimo', 'One tenth']] as const).slice();
      const d = total % (part[0] as number) === 0 ? part : [4, 'Un cuarto', 'One quarter'];
      const share = total / (d[0] as number);
      return typed(
        T(`Para el festival se compran ${packs} paquetes de ${per} postales: ${total} postales. ${d[1]} va al libro de visitas. ¿Cuántas postales son?`, `For the festival, ${packs} packs of ${per} postcards are bought: ${total} postcards. ${d[2]} goes to the visitors’ book. How many postcards is that?`),
        share,
        T(`${total} ÷ ${d[0]} = ${share} postales.`, `${total} ÷ ${d[0]} = ${share} postcards.`),
        T(`Repartí las ${total} postales en ${d[0]} partes iguales.`, `Share the ${total} postcards into ${d[0]} equal parts.`),
        { unit: T('postales', 'postcards'), reward: T(`${share} postales quedan junto al libro de visitas.`, `${share} postcards are placed beside the visitors’ book.`) },
      );
    },
    r => {
      const had = r.int(8, 20) * 100, spent = had - r.int(3, 19) * 10, left = had - spent;
      return typed(
        T(`El aeroclub tenía ${es(had)} unidades de juego y las postales costaron ${es(spent)}. ¿Cuánto queda?`, `The aeroclub had ${en(had)} play units, and the postcards cost ${en(spent)}. How much is left?`),
        left,
        T(`${es(spent)} + ${left} = ${es(had)}: quedan ${left} unidades.`, `${en(spent)} + ${left} = ${en(had)}: ${left} units are left.`),
        T(`¿Cuánto le falta a ${es(spent)} para llegar a ${es(had)}?`, `How much does ${en(spent)} need to reach ${en(had)}?`),
        { unit: T('unidades', 'units'), reward: T(`Con las ${left} unidades que sobran se compran globos.`, `The ${left} spare units buy balloons.`) },
      );
    },
  ],
  'G04-14-L02': [
    r => {
      const rows = r.int(21, 45), t = 1, o = r.int(2, 9), per = t * 10 + o, tensWrong = r.int(0, 1) === 0;
      const written = tensWrong ? `${rows} + ${rows * o}` : `${rows * 10} + ${rows}`;
      const TENS = T(`Debería ser ${rows} × 10 = ${rows * 10}, no ${rows}`, `It should be ${rows} × 10 = ${rows * 10}, not ${rows}`);
      const ONES = T(`Debería ser ${rows} × ${o} = ${rows * o}, no ${rows}`, `It should be ${rows} × ${o} = ${rows * o}, not ${rows}`);
      const HUNDRED = T(`Debería ser ${rows} × 100 = ${es(rows * 100)}`, `It should be ${rows} × 100 = ${en(rows * 100)}`);
      return choose(r,
        T(`Los voluntarios ponen ${rows} filas de ${per} sillas y escriben ${rows} × ${per} = ${written}. ¿Qué producto parcial está mal?`, `The volunteers set out ${rows} rows of ${per} chairs and write ${rows} × ${per} = ${written}. Which partial product is wrong?`),
        tensWrong ? TENS : ONES, tensWrong ? [ONES, HUNDRED] : [TENS, HUNDRED],
        T(`${rows} × 10 = ${rows * 10} y ${rows} × ${o} = ${rows * o}: ${rows * 10} + ${rows * o} = ${rows * per} sillas.`, `${rows} × 10 = ${rows * 10} and ${rows} × ${o} = ${rows * o}: ${rows * 10} + ${rows * o} = ${rows * per} chairs.`),
        T(`Partí ${per} en 10 y ${o}. ¿Cuánto da cada parte?`, `Split ${per} into 10 and ${o}. What does each part give?`),
        { reward: T(`Hay ${rows * per} sillas: alcanzan para todos.`, `There are ${rows * per} chairs: enough for everyone.`) });
    },
    r => {
      const [k, wEs, wEn] = r.pick([[2, 'la mitad', 'half'], [4, 'un cuarto', 'a quarter'], [5, 'un quinto', 'a fifth']] as const), n = k * r.int(6, 25), part = n / k;
      const RIGHT = T(`${k} grupos de ${part} vuelven a formar las ${n}`, `${k} groups of ${part} make the ${n} again`);
      const DIGITS = T(`Porque se divide cada cifra de ${n} por ${k}`, `Because each digit of ${n} is divided by ${k}`);
      const DEC = T(`Porque ${(1 / k).toFixed(2).replace('.', ',')} siempre significa ${Math.round(100 / k)} postales`, `Because ${(1 / k).toFixed(2)} always means ${Math.round(100 / k)} postcards`);
      return choose(r,
        T(`¿Por qué ${wEs} de ${n} postales son ${part} postales?`, `Why is ${wEn} of ${n} postcards ${part} postcards?`),
        RIGHT, [DIGITS, DEC],
        T(`${wEs[0].toUpperCase()}${wEs.slice(1)} se refiere al entero de ${n} postales: ${k} × ${part} = ${n}.`, `${wEn[0].toUpperCase()}${wEn.slice(1)} refers to the whole of ${n} postcards: ${k} × ${part} = ${n}.`),
        T(`Armá ${k} montones iguales con ${n} postales.`, `Make ${k} equal piles from ${n} postcards.`),
        { reward: T(`¡El festival empieza! Las ${n} postales se reparten en ${k} partes de ${part}, alrededor del hangar.`, `The festival begins! The ${n} postcards are shared in ${k} parts of ${part}, around the hangar.`) });
    },
  ],
};
