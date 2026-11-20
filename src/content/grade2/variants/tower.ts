// Chapter 6 — Tangled Tower (G02-11-L02 … G02-13): measuring tools, hours and
// the calendar, tables and pictographs, and the last spell (±10, ±100).
import { T, choose, chooseNumber, typed, type Generator, type Rng } from './kit';

const repeat = (part: number, times: number) => Array(times).fill(part).join(' + ');

const TOOLS = [
  { ask: T('¿Con qué sabemos qué bolsa pesa más?', 'What tells us which bag is heavier?'), tool: T('Con una balanza', 'With a scale'), why: T('La balanza compara cuánto pesan las cosas.', 'A scale compares how heavy things are.'), reward: T('La balanza queda pareja. ¡Se abre la primera puerta!', 'The scale balances. The first door opens!') },
  { ask: T('¿Con qué sabemos cuánta agua entra en la fuente?', 'What tells us how much water fits in the fountain?'), tool: T('Con una jarra con marcas', 'With a marked jug'), why: T('La jarra con marcas mide cuánta agua cargamos.', 'A marked jug measures how much water we carry.'), reward: T('La jarra mide el agua. ¡Se abre la primera puerta!', 'The jug measures the water. The first door opens!') },
  { ask: T('¿Con qué sabemos cuánto mide la puerta?', 'What tells us how tall the door is?'), tool: T('Con una regla', 'With a ruler'), why: T('La regla mide largos y alturas.', 'A ruler measures lengths and heights.'), reward: T('La puerta está medida. ¡Se abre la primera puerta!', 'The door is measured. The first door opens!') },
  { ask: T('¿Con qué sabemos cuánto tarda la arena en caer?', 'What tells us how long the sand takes to fall?'), tool: T('Con un reloj', 'With a clock'), why: T('El reloj mide cuánto tiempo pasa.', 'A clock measures how much time passes.'), reward: T('El tiempo está medido. ¡Se abre la primera puerta!', 'The time is measured. The first door opens!') },
];

const CALENDAR_TOOLS = [
  { ask: T('El festival es el próximo martes. ¿Qué usamos para saber qué fecha es?', 'The festival is next Tuesday. What do we use to find out the date?'), tool: T('Un calendario', 'A calendar'), why: T('El calendario une los días de la semana con las fechas.', 'A calendar matches weekdays with dates.'), reward: T('{name} encuentra la fecha del festival en el calendario. ¡Llegamos a tiempo!', '{name} finds the festival date on the calendar. We will make it on time!') },
  { ask: T('La escalera abre a las 3. ¿Qué usamos para saber cuándo son las 3?', 'The stairs open at 3. What do we use to know when it is 3 o’clock?'), tool: T('Un reloj', 'A clock'), why: T('El reloj muestra las horas del día.', 'A clock shows the hours of the day.'), reward: T('{name} mira el reloj: ¡son las 3! Llegamos a tiempo.', '{name} looks at the clock: it is 3! We will make it on time.') },
  { ask: T('Cada escalón tiene que ser igual de alto. ¿Qué usamos para comprobarlo?', 'Every step must be the same height. What do we use to check it?'), tool: T('Una regla', 'A ruler'), why: T('La regla mide la altura de cada escalón.', 'A ruler measures the height of each step.'), reward: T('Los escalones son iguales. {name} sube sin tropezar. ¡Llegamos a tiempo!', 'The steps are equal. {name} climbs without tripping. We will make it on time!') },
];

const THINGS = [T('faroles', 'lanterns'), T('campanitas', 'little bells'), T('banderines', 'flags'), T('cintas', 'ribbons')];

type Change = { es: string; en: string; delta: number; undo: { es: string; en: string } };
const CHANGES: Change[] = [
  { es: 'suma 100', en: 'adds 100', delta: 100, undo: { es: 'restamos 100', en: 'take away 100' } },
  { es: 'resta 100', en: 'takes away 100', delta: -100, undo: { es: 'sumamos 100', en: 'add 100' } },
  { es: 'suma 10', en: 'adds 10', delta: 10, undo: { es: 'restamos 10', en: 'take away 10' } },
  { es: 'resta 10', en: 'takes away 10', delta: -10, undo: { es: 'sumamos 10', en: 'add 10' } },
];
/** Two changes: one of ±100 and one of ±10, in either order, keeping the number between 100 and 999. */
const spell = (r: Rng) => {
  const start = r.int(2, 7) * 100 + r.int(1, 8) * 10 + r.int(0, 9);
  const pair = r.shuffle([r.pick(CHANGES.slice(0, 2)), r.pick(CHANGES.slice(2))]);
  return { start, first: pair[0], second: pair[1], middle: start + pair[0].delta, end: start + pair[0].delta + pair[1].delta };
};

export const tower: Record<string, [Generator, Generator]> = {
  'G02-11-L02': [
    r => {
      const pick = r.int(0, TOOLS.length - 1), tool = TOOLS[pick];
      return choose(r, tool.ask, tool.tool, r.shuffle(TOOLS.filter((_, i) => i !== pick)).slice(0, 2).map(t => t.tool), tool.why,
        T('Pensá qué se mide: peso, agua, largo o tiempo.', 'Think about what is measured: weight, water, length, or time.'), { reward: tool.reward });
    },
    r => {
      const tall = r.int(0, 1) === 0;
      const WIDTH = T('Pueden ser de distinto ancho', 'They may be different widths'), HEIGHT = T('Pueden ser de distinto alto', 'They may be different heights');
      return choose(r,
        tall ? T('Hay dos botellas. ¿Por qué no alcanza mirar cuál es más alta?', 'There are two bottles. Why is it not enough to see which is taller?') : T('Hay dos botellas. ¿Por qué no alcanza mirar cuál es más ancha?', 'There are two bottles. Why is it not enough to see which is wider?'),
        tall ? WIDTH : HEIGHT,
        [tall ? HEIGHT : WIDTH, tall ? T('En la más alta siempre entra más', 'The taller one always holds more') : T('En la más ancha siempre entra más', 'The wider one always holds more')],
        T('Lo que entra depende de todo el espacio de adentro. Usamos la jarra.', 'What fits depends on all the space inside. We use the jug.'),
        T('Imaginá una botella ancha y bajita y otra finita y muy alta.', 'Imagine a wide, short bottle and a thin, very tall one.'));
    },
  ],
  'G02-11-L03': [
    r => {
      const from = r.int(2, 5), hours = r.int(2, 4), to = from + hours;
      return typed(
        T(`La escalera está abierta de las ${from} a las ${to} de la tarde. ¿Cuántas horas hay para subir?`, `The stairs are open from ${from} to ${to} in the afternoon. How many hours are there to climb?`),
        hours,
        T(`De las ${from} a las ${to} pasan ${hours} horas.`, `From ${from} to ${to}, ${hours} hours pass.`),
        T(`Contá una hora desde las ${from}. Seguí hasta las ${to}.`, `Count one hour from ${from}. Keep going to ${to}.`),
        { unit: T('horas', 'hours'), reward: T(`¡Hay ${hours} horas! Alcanzan para subir.`, `There are ${hours} hours! Enough to climb up.`) },
      );
    },
    r => {
      const pick = r.int(0, CALENDAR_TOOLS.length - 1), item = CALENDAR_TOOLS[pick];
      return choose(r, item.ask, item.tool, CALENDAR_TOOLS.filter((_, i) => i !== pick).map(t => t.tool), item.why,
        T('Pensá qué buscamos: una fecha, una hora o una altura.', 'Think about what we are looking for: a date, a time, or a height.'), { reward: item.reward });
    },
  ],
  'G02-12-L01': [
    r => {
      const [a, b, c] = [r.int(2, 9), r.int(2, 9), r.int(2, 9)], [x, y, z] = r.shuffle(THINGS);
      return typed(
        T(`La tabla dice: ${a} ${x['es-AR']}, ${b} ${y['es-AR']} y ${c} ${z['es-AR']}. ¿Cuántas cosas hay?`, `The table says: ${a} ${x['en-US']}, ${b} ${y['en-US']}, and ${c} ${z['en-US']}. How many things are there?`),
        a + b + c,
        T(`${a} + ${b} + ${c} = ${a + b + c}.`, `${a} + ${b} + ${c} = ${a + b + c}.`),
        T(`Sumá ${a} ${x['es-AR']} y ${b} ${y['es-AR']}. Después agregá ${c} ${z['es-AR']}.`, `Add ${a} ${x['en-US']} and ${b} ${y['en-US']}. Then add ${c} ${z['en-US']}.`),
        { unit: T('cosas', 'things'), reward: T(`La lista para devolver está lista: ${a + b + c} cosas.`, `The return list is ready: ${a + b + c} things.`) },
      );
    },
    r => {
      if (r.int(0, 1) === 0) return choose(r,
        T('¿Para qué escribimos el nombre al lado de cada número?', 'Why do we write the name next to each number?'),
        T('Para saber qué se contó', 'To know what was counted'),
        [T('Porque queda más lindo', 'Because it looks nicer'), T('Para sumar más rápido', 'To add faster')],
        T('Un número solo no dice qué cosas contamos.', 'A number alone does not say what we counted.'),
        T('Si solo ves un número, ¿sabés en qué canasta van esas cosas?', 'If you only see a number, do you know which basket those things go in?'));
      const [a, b] = r.shuffle([3, 4, 5, 6, 7, 8, 9]).slice(0, 2), [x, y] = r.shuffle(THINGS);
      return chooseNumber(r,
        T(`La tabla dice: ${x['es-AR']}: ${a}; ${y['es-AR']}: ${b}. ¿Cuántas cosas van a la canasta de ${y['es-AR']}?`, `The table says: ${x['en-US']}: ${a}; ${y['en-US']}: ${b}. How many things go in the ${y['en-US']} basket?`),
        b, [a, a + b],
        T(`Al lado de «${y['es-AR']}» dice ${b}.`, `Next to “${y['en-US']}” it says ${b}.`),
        T(`Buscá el nombre «${y['es-AR']}» en la tabla. Mirá el número de al lado.`, `Find the name “${y['en-US']}” in the table. Look at the number next to it.`));
    },
  ],
  'G02-12-L02': [
    r => {
      const value = r.pick([2, 5, 10]), stars = r.int(3, 9);
      return typed(
        T(`Si ★ vale ${value} votos, ¿cuántos votos son ${stars} estrellas?`, `If ★ is worth ${value} votes, how many votes are ${stars} stars?`),
        value * stars,
        T(`${stars} grupos de ${value} son ${value * stars} votos.`, `${stars} groups of ${value} are ${value * stars} votes.`),
        T(`Dibujá ${stars} estrellas. Contá ${value} votos por cada estrella.`, `Draw ${stars} stars. Count ${value} votes for each star.`),
        { unit: T('votos', 'votes') },
      );
    },
    r => {
      if (r.int(0, 1) === 0) return choose(r,
        T('En una fila ★ vale 2 y en la otra vale 1. ¿Qué pasa?', 'In one row ★ is worth 2, and in the other it is worth 1. What happens?'),
        T('No podemos comparar las filas', 'We cannot compare the rows'),
        [T('Gana la fila con más estrellas', 'The row with more stars wins'), T('Gana la fila de abajo', 'The bottom row wins')],
        T('El mismo símbolo tiene que valer lo mismo en todo el gráfico.', 'The same symbol must be worth the same in the whole chart.'),
        T('Contá los votos de 3 estrellas en cada fila. ¿Dan lo mismo?', 'Count the votes for 3 stars in each row. Do they match?'));
      const a = r.int(4, 9), b = r.int(1, a - 2);
      return chooseNumber(r,
        T(`En las dos filas ★ vale 2. Una puerta tiene ${a} ★ y otra ${b} ★. ¿Cuántos votos más tiene la primera?`, `In both rows ★ is worth 2. One door has ${a} ★ and another ${b} ★. How many more votes does the first have?`),
        2 * (a - b), [a - b, 2 * a, a + b],
        T(`Hay ${a - b} estrellas de diferencia: ${a - b} × 2 = ${2 * (a - b)} votos.`, `There are ${a - b} stars of difference: ${a - b} × 2 = ${2 * (a - b)} votes.`),
        T('Primero contá cuántas estrellas más tiene. Después contá 2 votos por cada una.', 'First count how many more stars it has. Then count 2 votes for each.'), { unit: ['votos', 'votes'] });
    },
  ],
  'G02-13-L01': [
    r => {
      const lanterns = r.int(2, 5), candles = r.int(3, 9);
      return typed(
        T(`Hay ${lanterns} faroles con ${candles} velas cada uno. ¿Cuántas velas hay?`, `There are ${lanterns} lanterns with ${candles} candles each. How many candles are there?`),
        lanterns * candles,
        T(`${repeat(candles, lanterns)} = ${lanterns * candles}.`, `${repeat(candles, lanterns)} = ${lanterns * candles}.`),
        T(`Dibujá ${lanterns} faroles. Contá ${candles} velas para cada uno.`, `Draw ${lanterns} lanterns. Count ${candles} candles for each.`),
        { unit: T('velas', 'candles'), reward: T(`Los faroles están listos con ${lanterns * candles} velas.`, `The lanterns are ready with ${lanterns * candles} candles.`) },
      );
    },
    r => {
      const [lanterns, each] = r.shuffle([2, 3, 4, 5, 6]).slice(0, 2), total = lanterns * each;
      return choose(r,
        T(`Hay ${total} chispas para ${lanterns} faroles. ¿Qué cuenta comprueba que van ${each} en cada uno?`, `There are ${total} sparks for ${lanterns} lanterns. Which calculation checks that ${each} go in each?`),
        T(`${repeat(each, lanterns)} = ${total}`, `${repeat(each, lanterns)} = ${total}`),
        [T(`${total} + ${lanterns} = ${total + lanterns}`, `${total} + ${lanterns} = ${total + lanterns}`), T(`${each} + ${lanterns} = ${each + lanterns}`, `${each} + ${lanterns} = ${each + lanterns}`)],
        T(`Las ${lanterns} partes iguales vuelven a formar ${total}.`, `The ${lanterns} equal parts make ${total} again.`),
        T(`Juntá las chispas de los ${lanterns} faroles para revisar el total.`, `Put the sparks from all ${lanterns} lanterns together to check the total.`));
    },
  ],
  'G02-13-L02': [
    r => {
      const s = spell(r);
      return typed(
        T(`El hechizo es ${s.start}. El mago ${s.first.es} y después ${s.second.es}. ¿Qué número queda?`, `The spell is ${s.start}. The wizard ${s.first.en} and then ${s.second.en}. What number is left?`),
        s.end,
        T(`${s.start} → ${s.middle} → ${s.end}.`, `${s.start} → ${s.middle} → ${s.end}.`),
        T(`Escribí el número después del primer cambio. Desde ese número, hacé el segundo.`, `Write the number after the first change. From that number, make the second one.`),
      );
    },
    r => {
      const s = spell(r);
      return choose(r,
        T(`El mago empieza con ${s.start}, ${s.first.es} y después ${s.second.es}: queda ${s.end}. ¿Cómo volvemos a ${s.start}?`, `The wizard starts with ${s.start}, ${s.first.en}, and then ${s.second.en}: ${s.end} is left. How do we get back to ${s.start}?`),
        T(`Primero ${s.second.undo.es} y después ${s.first.undo.es}`, `First ${s.second.undo.en}, then ${s.first.undo.en}`),
        [T(`Primero ${s.second.es.replace('suma', 'sumamos').replace('resta', 'restamos')} y después ${s.first.es.replace('suma', 'sumamos').replace('resta', 'restamos')}`, `First ${s.second.en.replace('adds', 'add').replace('takes', 'take')}, then ${s.first.en.replace('adds', 'add').replace('takes', 'take')}`),
         T(`Primero ${s.second.undo.es} y después ${s.first.es.replace('suma', 'sumamos').replace('resta', 'restamos')}`, `First ${s.second.undo.en}, then ${s.first.en.replace('adds', 'add').replace('takes', 'take')}`)],
        T(`${s.end} → ${s.middle} → ${s.start}. ¡Volvimos al comienzo!`, `${s.end} → ${s.middle} → ${s.start}. We are back at the start!`),
        T(`El último cambio fue «${s.second.es}». Empezá por deshacerlo.`, `The last change was “${s.second.en}.” Start by undoing it.`));
    },
  ],
};
