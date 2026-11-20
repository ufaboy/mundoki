// Chapter 7 — Moving day (G03-11, G03-12): metres and centimetres, units,
// estimating then measuring, comparing measures written differently, clock
// hands, durations across the hour, and the fridge calendar.
import { T, choose, typed, L, oneOf, type Generator } from './kit';

const DAYS_ES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const day = (i: number, date: number) => T(`${DAYS_ES[(i + 7) % 7][0].toUpperCase()}${DAYS_ES[(i + 7) % 7].slice(1)} ${date}`, `${DAYS_EN[(i + 7) % 7]} ${date}`);
/** English ordinal: 1st, 2nd, 3rd, 4th, 11th, 21st… */
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
const clock = (minutes: number) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;

export const moving: Record<string, [Generator, Generator]> = {
  'G03-11-L01': [
    r => {
      const m = r.int(2, 9), extra = r.pick([0, 0, r.int(1, 9) * 10 + r.int(0, 9)]), cm = m * 100 + extra;
      return typed(
        extra
          ? T(`El pasillo mide ${m} m y ${extra} cm de largo. El vendedor de alfombras pregunta la medida en centímetros. ¿Cuántos centímetros son?`, `The hall is ${m} m and ${extra} cm long. The carpet seller asks for the length in centimetres. How many centimetres is that?`)
          : T(`El pasillo mide ${m} m de largo. El vendedor de alfombras pregunta la medida en centímetros. ¿Cuántos centímetros son?`, `The hall is ${m} m long. The carpet seller asks for the length in centimetres. How many centimetres is that?`),
        cm,
        T(`Cada metro tiene 100 cm: ${m} × 100 = ${m * 100}${extra ? `, y ${m * 100} + ${extra} = ${cm}` : ''} cm.`, `Each metre has 100 cm: ${m} × 100 = ${m * 100}${extra ? `, and ${m * 100} + ${extra} = ${cm}` : ''} cm.`),
        T(`Cada metro tiene 100 centímetros. Contá ${m} grupos de 100${extra ? ' y sumá los centímetros sueltos' : ''}.`, `Each metre has 100 centimetres. Count ${m} groups of 100${extra ? ' and add the extra centimetres' : ''}.`),
        { unit: T('cm', 'cm'), reward: T(`La alfombra de ${cm} cm entra justo en el pasillo.`, `The ${cm} cm carpet fits the hall.`) },
      );
    },
    r => {
      const WEIGHT = L('Un peso|A weight'), LENGTH = L('Un largo|A length'), TIME = L('Un tiempo|A time');
      const [unit, right] = r.pick([['kg', WEIGHT], ['g', WEIGHT], ['cm', LENGTH], ['m', LENGTH], ['min', TIME], ['h', TIME]] as const);
      const n = r.int(2, 60);
      return choose(r,
        T(`Una línea de la lista de la mudanza dice: «${n} ${unit}». ¿Qué se midió?`, `A line on the moving list says: “${n} ${unit}.” What was measured?`),
        right, [WEIGHT, LENGTH, TIME].filter(o => o !== right),
        T(`La unidad lo dice: «${unit}» mide ${right['es-AR'].toLowerCase()}. Sin la unidad, ${n} no dice nada.`, `The unit tells us: “${unit}” measures ${right['en-US'].toLowerCase()}. Without the unit, ${n} says nothing.`),
        L('Pensá con qué se mide: ¿balanza, cinta métrica o reloj?|Think about what you measure it with: a scale, a tape measure, or a clock?'),
        { reward: L('Los fleteros saben qué dice cada número.|The movers know what each number means.') });
    },
  ],
  'G03-11-L02': [
    r => {
      const est = r.int(3, 9) * 10, off = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), real = est + off, diff = Math.abs(off);
      return typed(
        T(`Para el lavarropas estimaste un hueco de ${est} cm. La cinta muestra ${real} cm. ¿Por cuántos centímetros se equivocó la estimación?`, `For the washing machine you estimated a gap of ${est} cm. The tape shows ${real} cm. By how many centimetres was the estimate off?`),
        diff,
        T(`${Math.max(est, real)} − ${Math.min(est, real)} = ${diff} cm. Al plano va la medida real: ${real} cm.`, `${Math.max(est, real)} − ${Math.min(est, real)} = ${diff} cm. The real measure goes on the plan: ${real} cm.`),
        T(`Desde ${Math.min(est, real)} cm, contá cuánto falta para llegar a ${Math.max(est, real)} cm.`, `From ${Math.min(est, real)} cm, count how much is missing to reach ${Math.max(est, real)} cm.`),
        { unit: T('cm', 'cm'), reward: T(`La medida real, ${real} cm, queda anotada en el plano.`, `The real measure, ${real} cm, is written on the plan.`) },
      );
    },
    r => {
      const est = r.int(3, 9) * 10, over = r.int(0, 1) === 0, real = over ? est - r.int(3, 8) : est + r.int(3, 8);
      const LESS = L('Un poco menos: esta vez me pasé|A bit less: this time I went over');
      const MORE = L('Un poco más: esta vez me quedé corto|A bit more: this time I fell short');
      const NEVER = L('Ya no hace falta estimar: medimos siempre|No need to estimate any more: we always measure');
      return choose(r,
        T(`Estimaste que un hueco medía ${est} cm. La cinta mostró ${real} cm. Para un hueco parecido, ¿cómo conviene estimar la próxima vez?`, `You estimated a gap of ${est} cm. The tape showed ${real} cm. For a similar gap, how should you estimate next time?`),
        over ? LESS : MORE, over ? [MORE, NEVER] : [LESS, NEVER],
        over
          ? T(`${est} es más que ${real}: la estimación se pasó. Comparar nos enseña a estimar mejor.`, `${est} is more than ${real}: the estimate went over. Comparing teaches us to estimate better.`)
          : T(`${est} es menos que ${real}: la estimación se quedó corta. Comparar nos enseña a estimar mejor.`, `${est} is less than ${real}: the estimate fell short. Comparing teaches us to estimate better.`),
        T(`Compará ${est} con ${real}. ¿Cuál es más grande?`, `Compare ${est} with ${real}. Which is bigger?`));
    },
  ],
  'G03-11-L03': [
    r => {
      const m = r.int(1, 2), extra = r.pick([0, 20, 50]), bed = m * 100 + extra;
      const kind = r.pick(['bed', 'wall', 'same'] as const);
      const wall = kind === 'same' ? bed : kind === 'bed' ? bed - r.int(2, 6) * 10 : bed + r.int(2, 6) * 10;
      const bedText = extra ? T(`${m} m ${extra} cm`, `${m} m ${extra} cm`) : T(`${m} m`, `${m} m`);
      const BED = bedText, WALL = T(`${wall} cm`, `${wall} cm`), SAME = L('Miden lo mismo|They are the same length');
      const right = kind === 'bed' ? BED : kind === 'wall' ? WALL : SAME;
      return choose(r,
        T(`La cama mide ${bedText['es-AR']} de largo. Una pared tiene ${wall} cm libres. ¿Qué es más largo?`, `The bed is ${bedText['en-US']} long. One wall has ${wall} cm free. Which is longer?`),
        right, [BED, WALL, SAME].filter(o => o !== right),
        T(`${bedText['es-AR']} = ${bed} cm. Comparamos ${bed} cm con ${wall} cm.`, `${bedText['en-US']} = ${bed} cm. We compare ${bed} cm with ${wall} cm.`),
        T(`Pasá los ${m} m a centímetros antes de comparar.`, `Change the ${m} m into centimetres before comparing.`));
    },
    r => {
      const m = r.int(2, 9), same = r.int(0, 1) === 0, cm = same ? m * 100 : r.pick([m * 10, m * 100 + 50, m * 100 - 50]);
      const SAME = L('Tienen razón las dos: es la misma medida|Both are right: it is the same length');
      const DIFF = T(`No: ${cm} cm no son ${m} m`, `No: ${cm} cm is not ${m} m`);
      const ANY = L('Tienen razón: cualquier número sirve si cambia la unidad|Both are right: any number works if the unit changes');
      return choose(r,
        T(`La cinta dice ${cm} cm y Rosa dice ${m} m. ¿Tienen razón las dos?`, `The tape says ${cm} cm and Rosa says ${m} m. Are both right?`),
        same ? SAME : DIFF, same ? [DIFF, ANY] : [SAME, ANY],
        T(`100 cm = 1 m, así que ${m} m = ${m * 100} cm.`, `100 cm = 1 m, so ${m} m = ${m * 100} cm.`),
        T('Mirá cuántos centímetros tiene 1 metro.', 'Look at how many centimetres are in 1 metre.'));
    },
  ],
  'G03-12-L01': [
    r => {
      const k = r.int(1, 11), min = k * 5;
      return typed(
        T(`La familia espera el camión. La aguja larga del reloj está en el ${k}. ¿Cuántos minutos marca?`, `The family waits for the truck. The long hand of the clock is on the ${k}. How many minutes does it show?`),
        min,
        T(`Cada número vale 5 minutos: ${k} × 5 = ${min} minutos.`, `Each number is worth 5 minutes: ${k} × 5 = ${min} minutes.`),
        T(`Contá de 5 en 5 desde el 12 hasta el ${k} del reloj.`, `Count by fives from the 12 to the ${k} on the clock.`),
        { unit: T('minutos', 'minutes') },
      );
    },
    r => {
      const h = r.int(2, 10), half = r.int(0, 1) === 0;
      const BETWEEN = T(`Entre el ${h} y el ${h + 1}`, `Between ${h} and ${h + 1}`), ON = T(`Justo en el ${h}`, `Exactly on ${h}`);
      const BEFORE = T(`Entre el ${h - 1} y el ${h}`, `Between ${h - 1} and ${h}`), NEXT = T(`Justo en el ${h + 1}`, `Exactly on ${h + 1}`);
      return choose(r,
        T(`El camión llega a las ${h}:${half ? '30' : '00'}. ¿Dónde está la aguja corta a esa hora?`, `The truck arrives at ${h}:${half ? '30' : '00'}. Where is the short hand at that time?`),
        half ? BETWEEN : ON, half ? [ON, BEFORE, NEXT] : [BETWEEN, BEFORE, NEXT],
        half
          ? T(`A las ${h}:30 pasó media hora: la aguja corta va por la mitad entre el ${h} y el ${h + 1}.`, `At ${h}:30 half an hour has passed: the short hand is halfway between ${h} and ${h + 1}.`)
          : T(`A las ${h}:00 en punto, la aguja corta está justo en el ${h}.`, `At ${h}:00 sharp, the short hand is exactly on ${h}.`),
        T(`Pensá: ¿pasó algo de tiempo desde las ${h} en punto? La aguja corta se mueve de a poco.`, `Think: has any time passed since ${h} o’clock? The short hand moves little by little.`),
        { reward: L('El despertador queda programado.|The alarm is set.') });
    },
  ],
  'G03-12-L02': [
    r => {
      const hour = r.int(8, 15), startMin = r.pick([35, 40, 45, 50, 55]), toHour = 60 - startMin;
      const dur = toHour + r.pick([5, 10, 15, 20, 25, 30]), start = hour * 60 + startMin, end = start + dur;
      return typed(
        T(`Los fleteros descargan el camión de ${clock(start)} a ${clock(end)}. ¿Cuánto tardan?`, `The movers unload the truck from ${clock(start)} to ${clock(end)}. How long does it take?`),
        dur,
        T(`De ${clock(start)} a ${clock(start + toHour)} son ${toHour} minutos; de ${clock(start + toHour)} a ${clock(end)}, ${dur - toHour} más: ${dur} minutos.`, `From ${clock(start)} to ${clock(start + toHour)} is ${toHour} minutes; from ${clock(start + toHour)} to ${clock(end)}, ${dur - toHour} more: ${dur} minutes.`),
        T(`Contá primero hasta las ${clock(start + toHour)} y después hasta las ${clock(end)}.`, `Count to ${clock(start + toHour)} first, then on to ${clock(end)}.`),
        { unit: T('minutos', 'minutes') },
      );
    },
    r => {
      const m = r.int(1, 9) * 5, wrong = r.int(0, 1) === 0, written = wrong ? 100 + m : 60 + m;
      const BAD = L('Está mal: una hora tiene 60 minutos, no 100|It is wrong: an hour has 60 minutes, not 100');
      const GOOD = T(`Está bien: 60 + ${m} = ${60 + m}`, `It is right: 60 + ${m} = ${60 + m}`);
      const HUNDRED = L('Está bien: una hora tiene 100 minutos|It is right: an hour has 100 minutes');
      return choose(r,
        T(`Rosa anota que el viaje duró 1 h ${m} min. Átomo lo escribe en minutos: ${written} minutos. ¿Qué pasa?`, `Rosa writes that the trip took 1 h ${m} min. Átomo writes it in minutes: ${written} minutes. What is going on?`),
        wrong ? BAD : GOOD, wrong ? [GOOD, HUNDRED] : [BAD, HUNDRED],
        T(`1 h ${m} min = 60 + ${m} = ${60 + m} minutos.`, `1 h ${m} min = 60 + ${m} = ${60 + m} minutes.`),
        T(`Escribí cuántos minutos tiene 1 hora y sumale ${m}.`, `Write how many minutes are in 1 hour and add ${m}.`));
    },
  ],
  'G03-12-L03': [
    r => {
      const start = r.int(0, 6), date = r.int(1, 15), add = r.pick([7, 14, 3, 5]), target = date + add, wd = start + add;
      return choose(r,
        T(`La familia se muda el ${DAYS_ES[start]} ${date}. La fiesta es ${add} días después. ¿Qué día y qué fecha es la fiesta?`, `The family moves in on ${DAYS_EN[start]} the ${ord(date)}. The party is ${add} days later. What day and date is the party?`),
        day(wd, target), [day(wd - 1, target - 1), day(wd, target + 1), day(wd + 1, target)],
        add % 7 === 0
          ? T(`${date} + ${add} = ${target}. ${add / 7 === 1 ? 'Una semana' : 'Dos semanas'} después vuelve a ser ${DAYS_ES[start]}.`, `${date} + ${add} = ${target}. ${add / 7 === 1 ? 'One week' : 'Two weeks'} later it is ${DAYS_EN[start]} again.`)
          : T(`${date} + ${add} = ${target}. Contando ${add} días desde el ${DAYS_ES[start]} llegamos al ${DAYS_ES[wd % 7]}.`, `${date} + ${add} = ${target}. Counting ${add} days from ${DAYS_EN[start]} we reach ${DAYS_EN[wd % 7]}.`),
        T(`Avanzá ${add} días desde el ${DAYS_ES[start]} ${date}. Contá cada cambio de día.`, `Move ${add} days on from ${DAYS_EN[start]} the ${ord(date)}. Count each change of day.`),
        { reward: T(`Las invitaciones ya tienen su fecha: ${day(wd, target)['es-AR'].toLowerCase()}.`, `The invitations have their date: ${day(wd, target)['en-US']}.`) });
    },
    r => {
      const days = r.pick([30, 31]), date = r.int(days - 5, days), add = 7, next = date + add - days, other = days === 30 ? 31 : 30;
      return choose(r,
        T(`El mes tiene ${days} días. La mudanza es el día ${date}. La fiesta es ${add} días después. ¿Qué fecha es la fiesta?`, `The month has ${days} days. Moving day is the ${ord(date)}. The party is ${add} days later. What is the date of the party?`),
        T(`El ${next} del mes siguiente`, `The ${ord(next)} of the next month`),
        [T(`El ${date + add} de este mes`, `The ${ord(date + add)} of this month`), T(`El ${date + add - other} del mes siguiente`, `The ${ord(date + add - other)} of the next month`)],
        T(`Después del día ${days}, la cuenta sigue en el 1 del mes siguiente: ${date} + ${add} − ${days} = ${next}.`, `After day ${days}, counting goes on from the 1st of the next month: ${date} + ${add} − ${days} = ${next}.`),
        T(`Contá día por día desde el ${date}. ¿Qué pasa después del ${days}?`, `Count day by day from the ${ord(date)}. What happens after the ${ord(days)}?`));
    },
  ],
};
