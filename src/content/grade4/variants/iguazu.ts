// Chapters 5–6 — To the Iguazú Falls and the Quebrada de Humahuaca (G04-06,
// G04-07, G04-08): fractions of the route and of the fuel tank, the number line,
// equivalent fractions, comparing, and Doña Elva's tapestry for decimals.
import type { LocalizedText } from '../../../math/core/types';
import { T, choose, typed, decEs, decEn, L, twoDifferent, type Generator, type Rng } from './kit';

const NAME: Record<number, [string, string, string, string]> = {
  2: ['medio', 'medios', 'half', 'halves'], 3: ['tercio', 'tercios', 'third', 'thirds'], 4: ['cuarto', 'cuartos', 'quarter', 'quarters'],
  5: ['quinto', 'quintos', 'fifth', 'fifths'], 6: ['sexto', 'sextos', 'sixth', 'sixths'], 8: ['octavo', 'octavos', 'eighth', 'eighths'],
  9: ['noveno', 'novenos', 'ninth', 'ninths'], 10: ['décimo', 'décimos', 'tenth', 'tenths'], 12: ['doceavo', 'doceavos', 'twelfth', 'twelfths'],
};
const one = (n: number) => T(NAME[n][0], NAME[n][2]);
const many = (n: number) => T(NAME[n][1], NAME[n][3]);
const frac = (a: number, b: number) => T(`${a}/${b}`, `${a}/${b}`);
const pad2 = (n: number) => String(n).padStart(2, '0');
/** A fraction a/b with 0 < a < b. */
const proper = (r: Rng, dens: number[]) => { const b = r.pick(dens); return [r.int(1, b - 1), b] as const; };

export const iguazu: Record<string, [Generator, Generator]> = {
  'G04-06-L01': [
    r => {
      const [a, b] = proper(r, [3, 4, 5, 6, 8]), askDen = r.int(0, 1) === 0;
      const FULL = L('Las partes iguales del tanque lleno|The equal parts of the full tank'), FUEL = L('Las partes con combustible|The parts with fuel'), EMPTY = L('Las partes vacías|The empty parts');
      return choose(r,
        T(`El indicador de combustible marca ${a}/${b}. ¿Qué cuenta el ${askDen ? b : a}?`, `The fuel gauge shows ${a}/${b}. What does the ${askDen ? b : a} count?`),
        askDen ? FULL : FUEL, askDen ? [FUEL, EMPTY] : [FULL, EMPTY],
        T(`El tanque lleno está dividido en ${b} partes iguales; ${a} tienen combustible.`, `The full tank is divided into ${b} equal parts; ${a} have fuel.`),
        T(`Contá todas las partes del tanque y después las pintadas. ¿Cuál es el ${askDen ? b : a}?`, `Count all the parts of the tank, then the shaded ones. Which is the ${askDen ? b : a}?`),
        { model: { strips: [[a, b]] }, reward: T(`Nina confirma la lectura: el tanque está a ${a}/${b}.`, `Nina confirms the reading: the tank is at ${a}/${b}.`) });
    },
    r => {
      const [a, b] = proper(r, [3, 4, 5, 6, 8]);
      return typed(
        T(`La ruta tiene ${b} tramos iguales y ya volamos ${a}. ¿Qué fracción de la ruta volamos? Escribila con una barra.`, `The route has ${b} equal legs and we have flown ${a}. What fraction of the route have we flown? Write it with a slash.`),
        `${a}/${b}`,
        T(`${a} tramos volados de ${b} tramos en total: ${a}/${b}.`, `${a} legs flown out of ${b} legs in all: ${a}/${b}.`),
        T(`Arriba de la barra van los tramos volados; abajo, todos los tramos.`, `Above the slash go the legs flown; below it, all the legs.`),
        { model: { strips: [[a, b]] }, reward: T(`En el mapa quedan marcados ${a}/${b} de la ruta.`, `${a}/${b} of the route is marked on the map.`) },
      );
    },
  ],
  'G04-06-L02': [
    r => {
      const [n, m] = r.pick([[8, 2], [8, 4], [6, 2], [6, 3], [10, 2], [10, 5], [12, 2], [12, 3], [12, 4], [12, 6]] as const), k = n / m;
      return typed(
        m === 2
          ? T(`La ruta tiene ${n} partes iguales. La parada está en la mitad de la ruta. ¿Cuántos ${many(n)['es-AR']} forman la mitad?`, `The route has ${n} equal parts. The stop is halfway. How many ${many(n)['en-US']} make one half?`)
          : T(`La ruta tiene ${n} partes iguales. La parada está a un ${one(m)['es-AR']} de la ruta. ¿Cuántos ${many(n)['es-AR']} forman un ${one(m)['es-AR']}?`, `The route has ${n} equal parts. The stop is one ${one(m)['en-US']} of the way. How many ${many(n)['en-US']} make one ${one(m)['en-US']}?`),
        k,
        T(`${n} ÷ ${m} = ${k}: la parada está después de ${k}/${n}.`, `${n} ÷ ${m} = ${k}: the stop is after ${k}/${n}.`),
        T(`Partí la ruta en ${m} partes iguales. ¿Cuántos ${many(n)['es-AR']} entran en una?`, `Split the route into ${m} equal parts. How many ${many(n)['en-US']} fit in one?`),
        { unit: many(n), model: { strips: [[k, n]] }, reward: T(`La parada queda marcada después de ${k}/${n} de la ruta.`, `The stop is marked after ${k}/${n} of the route.`) },
      );
    },
    r => {
      const m = r.pick([3, 4, 5, 6, 8]), flown = r.int(0, 1) === 0 ? 0 : r.int(1, m - 1), left = m - flown;
      return typed(
        flown
          ? T(`Ya volamos ${flown} ${(flown === 1 ? one(m) : many(m))['es-AR']} de la ruta. ¿Cuántos ${many(m)['es-AR']} faltan para completarla?`, `We have flown ${flown} ${(flown === 1 ? one(m) : many(m))['en-US']} of the route. How many ${many(m)['en-US']} are left to complete it?`)
          : T(`¿Cuántos ${many(m)['es-AR']} completan toda la ruta?`, `How many ${many(m)['en-US']} make the whole route?`),
        left,
        flown
          ? T(`La ruta completa son ${m}/${m}: ${m} − ${flown} = ${left} ${many(m)['es-AR']}.`, `The whole route is ${m}/${m}: ${m} − ${flown} = ${left} ${many(m)['en-US']}.`)
          : T(`${m}/${m} es la ruta completa: ${left} tramos.`, `${m}/${m} is the whole route: ${left} legs.`),
        T(`¿Cuántos ${many(m)['es-AR']} tiene una ruta entera?`, `How many ${many(m)['en-US']} does a whole route have?`),
        { unit: many(m), model: { strips: [[flown, m]] } },
      );
    },
  ],
  'G04-06-L03': [
    r => {
      const n = r.pick([5, 6, 8, 10]);
      let a = r.int(1, n - 1);
      if (a * 2 === n) a = 1;
      return choose(r,
        T(`La recta de 0 a 1 tiene ${n} intervalos iguales. Nina tiene que llamar por radio en ${a}/${n}. ¿Dónde queda?`, `The line from 0 to 1 has ${n} equal intervals. Nina must make a radio call at ${a}/${n}. Where is it?`),
        T(`En el paso ${a} desde 0`, `At step ${a} from 0`), [T(`En el paso ${n} desde 0`, `At step ${n} from 0`), T(`En el paso ${n - a} desde 0`, `At step ${n - a} from 0`)],
        T(`El numerador dice cuántos intervalos avanzar desde 0: ${a}.`, `The numerator tells how many intervals to move from 0: ${a}.`),
        T(`Poné el dedo en 0 y avanzá de a un intervalo. ¿Cuántos pasos dice la fracción?`, `Put your finger on 0 and move one interval at a time. How many steps does the fraction say?`),
        { model: { line: n }, reward: T(`Nina llama por radio justo en ${a}/${n} de la ruta.`, `Nina makes the radio call right at ${a}/${n} of the route.`) });
    },
    r => {
      const m = r.pick([4, 6, 8, 10]), middle = r.int(0, 1) === 0;
      const all = [frac(m, m), frac(m / 2, m), frac(1, m), frac(m, 1)];
      const right = middle ? all[1] : all[0];
      return choose(r,
        middle
          ? T(`En la recta de ${many(m)['es-AR']}, ¿qué marca está justo en la mitad del camino entre 0 y 1?`, `On the line of ${many(m)['en-US']}, which mark is exactly halfway between 0 and 1?`)
          : T(`En la recta de ${many(m)['es-AR']}, ¿qué marca está en Iguazú, el 1?`, `On the line of ${many(m)['en-US']}, which mark is at Iguazú, the 1?`),
        right, all.filter(o => o !== right),
        middle
          ? T(`La mitad de ${m} pasos son ${m / 2} pasos: ${m / 2}/${m}.`, `Half of ${m} steps is ${m / 2} steps: ${m / 2}/${m}.`)
          : T(`${m} pasos de un ${one(m)['es-AR']} completan la ruta: ${m}/${m} = 1.`, `${m} steps of one ${one(m)['en-US']} complete the route: ${m}/${m} = 1.`),
        T(`Contá los intervalos desde 0 hasta ${middle ? 'la mitad' : 'el 1'}.`, `Count the intervals from 0 to ${middle ? 'the middle' : 'the 1'}.`),
        { model: { line: m } });
    },
  ],
  'G04-07-L01': [
    r => {
      const kind = r.pick(['unit', 'same', 'equal'] as const);
      let nina: [number, number], atomo: [number, number];
      if (kind === 'unit') { const [p, q] = twoDifferent(r, 0, 4).map(i => [2, 3, 4, 6, 8][i]); nina = [1, p]; atomo = [1, q]; }
      else if (kind === 'same') { const n = r.pick([5, 6, 8]); const [a, b] = twoDifferent(r, 1, n - 1); nina = [a, n]; atomo = [b, n]; }
      else { const [a, b] = r.pick([[1, 2], [1, 3], [3, 4], [1, 4]] as const); const k = r.pick([2, 3]); [nina, atomo] = r.int(0, 1) ? [[a, b], [a * k, b * k]] : [[a * k, b * k], [a, b]]; }
      const vn = nina[0] / nina[1], va = atomo[0] / atomo[1];
      const NINA = T(`Nina, ${nina[0]}/${nina[1]}`, `Nina, ${nina[0]}/${nina[1]}`), ATOMO = T(`Átomo, ${atomo[0]}/${atomo[1]}`, `Átomo, ${atomo[0]}/${atomo[1]}`), SAME = L('Caminaron lo mismo|They walked the same distance');
      const right = vn === va ? SAME : vn > va ? NINA : ATOMO;
      return choose(r,
        T(`En la misma pasarela, Nina camina ${nina[0]}/${nina[1]} y Átomo se queda sacando fotos después de ${atomo[0]}/${atomo[1]}. ¿Quién caminó más?`, `On the same walkway, Nina walks ${nina[0]}/${nina[1]}, and Átomo stops to take photos after ${atomo[0]}/${atomo[1]}. Who has walked further?`),
        right, [NINA, ATOMO, SAME].filter(o => o !== right),
        vn === va
          ? T(`${nina[0]}/${nina[1]} y ${atomo[0]}/${atomo[1]} son la misma parte de la pasarela.`, `${nina[0]}/${nina[1]} and ${atomo[0]}/${atomo[1]} are the same part of the walkway.`)
          : T(`De la misma pasarela, ${(vn > va ? nina : atomo).join('/')} es más que ${(vn > va ? atomo : nina).join('/')}.`, `Of the same walkway, ${(vn > va ? nina : atomo).join('/')} is more than ${(vn > va ? atomo : nina).join('/')}.`),
        L('Dibujá dos tiras iguales, una para cada uno, y pintá lo que caminaron.|Draw two equal strips, one for each, and shade what they walked.'),
        { model: { strips: [nina, atomo] } });
    },
    r => {
      const [x, y] = twoDifferent(r, 5, 25), same = r.int(0, 2) === 0, l1 = x * 2, l2 = same ? l1 : y * 2;
      const NO = T(`No: son ${l1 / 2} cm y ${l2 / 2} cm`, `No: they are ${l1 / 2} cm and ${l2 / 2} cm`);
      const YES = T(`Sí: las dos miden ${l1 / 2} cm`, `Yes: both measure ${l1 / 2} cm`);
      const HALF = L('Sí: una mitad siempre mide lo mismo|Yes: a half always measures the same');
      return choose(r,
        T(`En el mapa del parque, un sendero mide ${l1} cm y otro ${l2} cm. ¿La mitad de cada sendero mide lo mismo en el mapa?`, `On the park map, one trail is ${l1} cm long and another ${l2} cm. Is half of each trail the same length on the map?`),
        same ? YES : NO, same ? [HALF, T(`No: son ${l1 / 2} cm y ${l1} cm`, `No: they are ${l1 / 2} cm and ${l1} cm`)] : [HALF, T(`Sí: las dos miden ${l1 / 2} cm`, `Yes: both measure ${l1 / 2} cm`)],
        same
          ? T(`Los dos senderos miden ${l1} cm: sus mitades miden ${l1 / 2} cm.`, `Both trails are ${l1} cm: their halves are ${l1 / 2} cm.`)
          : T(`La fracción es la misma, pero cambió el entero: ${l1 / 2} cm y ${l2 / 2} cm.`, `The fraction is the same, but the whole changed: ${l1 / 2} cm and ${l2 / 2} cm.`),
        T(`Calculá la mitad de ${l1} cm y la mitad de ${l2} cm.`, `Work out half of ${l1} cm and half of ${l2} cm.`),
        { reward: L('Eligen recorrer la mitad del sendero corto antes del paseo en lancha.|They choose to walk half of the short trail before the boat ride.') });
    },
  ],
  'G04-07-L02': [
    r => {
      const [a, b] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]] as const), n = r.pick([b * 2, b * 3, b * 4].filter(x => x <= 12)), k = n / b;
      const right = frac(a * k, n), wrong = [frac(a, n), frac(a * k + 1, n), frac(n, a * k)];
      return choose(r,
        T(`El indicador del avión marca ${a}/${b}, pero el surtidor solo marca ${many(n)['es-AR']}. ¿Qué marca es igual a ${a}/${b}?`, `The plane’s gauge shows ${a}/${b}, but the pump only shows ${many(n)['en-US']}. Which mark equals ${a}/${b}?`),
        right, wrong,
        T(`Cada ${one(b)['es-AR']} se parte en ${k}: ${a}/${b} = ${a * k}/${n}.`, `Each ${one(b)['en-US']} splits into ${k}: ${a}/${b} = ${a * k}/${n}.`),
        T(`¿Cuántos ${many(n)['es-AR']} entran en un ${one(b)['es-AR']}?`, `How many ${many(n)['en-US']} fit in one ${one(b)['en-US']}?`),
        { model: { strips: [[a, b], [a * k, n]] }, reward: T(`Los dos indicadores coinciden: ${a}/${b} = ${a * k}/${n}.`, `Both gauges agree: ${a}/${b} = ${a * k}/${n}.`) });
    },
    r => {
      const [a, b] = r.pick([[1, 2], [3, 4], [1, 4], [2, 3], [1, 3], [5, 6]] as const), n = b === 6 ? 12 : r.pick([b * 2, b * 3].filter(x => x <= 12)), k = n / b;
      return typed(
        T(`Nina quiere el tanque en ${a}/${b}, y el surtidor cuenta en ${many(n)['es-AR']}. ¿Cuántos ${many(n)['es-AR']} son?`, `Nina wants the tank at ${a}/${b}, and the pump counts in ${many(n)['en-US']}. How many ${many(n)['en-US']} is that?`),
        a * k,
        T(`Cada ${one(b)['es-AR']} tiene ${k} ${many(n)['es-AR']}: ${a} × ${k} = ${a * k}.`, `Each ${one(b)['en-US']} has ${k} ${many(n)['en-US']}: ${a} × ${k} = ${a * k}.`),
        T(`¿Cuántos ${many(n)['es-AR']} tiene un ${one(b)['es-AR']}? Repetilo ${a} ${a === 1 ? 'vez' : 'veces'}.`, `How many ${many(n)['en-US']} are in one ${one(b)['en-US']}? Repeat it ${a} ${a === 1 ? 'time' : 'times'}.`),
        { unit: many(n), reward: T(`El empleado frena el surtidor justo en ${a * k}/${n}.`, `The attendant stops the pump right at ${a * k}/${n}.`) },
      );
    },
  ],
  'G04-07-L03': [
    r => {
      const n = r.pick([6, 8, 10]), half = n / 2, k = r.int(1, half - 1), levels = [half + k, half, half - k];
      const shown = r.shuffle(levels);
      return choose(r,
        T(`Para el tramo largo, el tanque tiene que estar a más de la mitad. ¿Qué nivel alcanza: ${shown.map(x => `${x}/${n}`).join(', ')}?`, `For the long leg, the tank must be more than half full. Which level is enough: ${shown.map(x => `${x}/${n}`).join(', ')}?`),
        frac(half + k, n), [frac(half, n), frac(half - k, n)],
        T(`La mitad son ${half}/${n}; ${half + k} es más. ${half}/${n} es justo la mitad, no más.`, `Half is ${half}/${n}; ${half + k} is more. ${half}/${n} is exactly half, not more.`),
        T(`¿Cuántos ${many(n)['es-AR']} son la mitad del tanque?`, `How many ${many(n)['en-US']} are half the tank?`),
        { reward: T(`Nina anota la regla en la bitácora: para el tramo largo, más de ${half}/${n}.`, `Nina writes the rule in the logbook: for the long leg, more than ${half}/${n}.`) });
    },
    r => {
      const [a, n] = proper(r, [5, 6, 8, 10]), missing = n - a;
      return typed(
        T(`Después de cargar, el indicador marca ${a}/${n}. ¿Cuánto falta para el tanque lleno? Escribilo como fracción.`, `After refuelling, the gauge shows ${a}/${n}. How much is missing for a full tank? Write it as a fraction.`),
        `${missing}/${n}`,
        T(`${a}/${n} + ${missing}/${n} = ${n}/${n} = 1 tanque lleno.`, `${a}/${n} + ${missing}/${n} = ${n}/${n} = 1 full tank.`),
        T(`El tanque lleno son ${n}/${n}. ¿Cuántos ${many(n)['es-AR']} faltan?`, `A full tank is ${n}/${n}. How many ${many(n)['en-US']} are missing?`),
        { unit: T('del tanque', 'of the tank'), model: { strips: [[a, n]] }, reward: T(`¡Etapa completa! Con ${missing}/${n} más, el tanque queda lleno. Un arcoíris cruza la Garganta del Diablo, y La Golondrina despega hacia el noroeste.`, `Stage complete! With ${missing}/${n} more, the tank is full. A rainbow crosses the Devil’s Throat, and La Golondrina takes off for the northwest.`) },
      );
    },
  ],
  'G04-08-L01': [
    r => {
      const rows = r.int(2, 9);
      return typed(
        T(`Doña Elva teje ${rows} filas completas del tapiz de 100 cuadraditos: ${rows} décimos. ¿Cuántos centésimos (cuadraditos) son?`, `Doña Elva weaves ${rows} full rows of the 100-square tapestry: ${rows} tenths. How many hundredths (small squares) is that?`),
        rows * 10,
        T(`Cada fila tiene 10 cuadraditos: ${rows} × 10 = ${rows * 10} centésimos.`, `Each row has 10 small squares: ${rows} × 10 = ${rows * 10} hundredths.`),
        L('Contá los cuadraditos de una fila y repetí por cada fila tejida.|Count the squares in one row and repeat for every woven row.'),
        { unit: T('cuadraditos', 'squares'), model: { strips: [[rows * 10, 100]] }, reward: T(`Doña Elva termina ${rows} filas del tapiz.`, `Doña Elva finishes ${rows} rows of the tapestry.`) },
      );
    },
    r => {
      const kind = r.pick(['hundredths', 'tenths', 'both'] as const);
      let h: number, right: LocalizedText, wrong: LocalizedText[];
      if (kind === 'hundredths') { const d = r.int(1, 9); h = d; right = frac(d, 100); wrong = [frac(d, 10), frac(d * 10, 100)]; }
      else if (kind === 'tenths') { const d = r.int(1, 9); h = d * 10; right = frac(d * 10, 100); wrong = [frac(d, 100), frac(d, 1)]; }
      else { const a = r.int(1, 9), b = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== a)); h = a * 10 + b; right = frac(h, 100); wrong = [frac(h, 10), frac(b * 10 + a, 100)]; }
      return choose(r,
        T(`En el tapiz hay ${decEs(h, kind === 'tenths' ? 1 : 2)} de color rojo. ¿Qué representa ${decEs(h, kind === 'tenths' ? 1 : 2)}?`, `The tapestry has ${decEn(h, kind === 'tenths' ? 1 : 2)} of red. What does ${decEn(h, kind === 'tenths' ? 1 : 2)} represent?`),
        right, wrong,
        T(`Son ${h} cuadraditos de 100: ${h}/100.`, `It is ${h} small squares out of 100: ${h}/100.`),
        T(`Mirá qué cifra está en los décimos y cuál en los centésimos.`, `Look at which digit is in the tenths and which in the hundredths.`),
        { model: { strips: [[h, 100]] }, reward: T(`Los ${h} cuadraditos rojos quedan anotados en la receta de colores.`, `The ${h} red squares are written in the colour recipe.`) });
    },
  ],
  'G04-08-L02': [
    r => {
      const cm = r.int(1, 9) * 10 + r.pick([0, 0, r.int(1, 9)]);
      return typed(
        T(`La etiqueta de una faja dice ${decEs(cm)} m. ¿Cuántos centímetros son?`, `A strip’s label says ${decEn(cm)} m. How many centimeters is that?`),
        cm,
        T(`${cm} centésimos de metro son ${cm} centímetros.`, `${cm} hundredths of a meter is ${cm} centimeters.`),
        L('Un metro tiene 100 cm. ¿Cuántos centésimos de metro dice la etiqueta?|One meter has 100 cm. How many hundredths of a meter does the label say?'),
        { unit: T('cm', 'cm'), reward: T(`Doña Elva corta la faja justo en ${cm} cm.`, `Doña Elva cuts the strip right at ${cm} cm.`) },
      );
    },
    r => {
      const m = r.int(1, 4), c = r.pick([r.int(1, 9), r.int(11, 99)]), value = `${m},${pad2(c)}`;
      return typed(
        T(`Un camino tejido para el piso del avión mide ${m} m y ${c} cm. ¿Cómo se escribe en metros, con coma?`, `A woven runner for the plane’s floor is ${m} m and ${c} cm long. How is it written in meters, with a decimal point?`),
        value,
        T(`${c} centímetros son ${c} centésimos de metro: ${m},${pad2(c)} m.`, `${c} centimeters is ${c} hundredths of a meter: ${m}.${pad2(c)} m.`),
        T(`Después de la coma van dos lugares: décimos y centésimos. ¿Cuántos centésimos son ${c} cm?`, `After the point there are two places: tenths and hundredths. How many hundredths is ${c} cm?`),
        { unit: T('m', 'm'), reward: T(`La etiqueta dice ${m},${pad2(c)} m: el camino tejido va al piso del avión.`, `The label says ${m}.${pad2(c)} m: the woven runner goes on the plane’s floor.`) },
      );
    },
  ],
  'G04-08-L03': [
    r => {
      const pick = r.pick([
        { es: 'La mitad', en: 'Half', red: 'roja', h: 50, places: 1, wrong: [5, 120] },
        { es: 'Un cuarto', en: 'One quarter', red: 'rojo', h: 25, places: 2, wrong: [140, 40] },
        { es: 'Tres cuartos', en: 'Three quarters', red: 'rojos', h: 75, places: 2, wrong: [340, 34] },
        { es: 'Un quinto', en: 'One fifth', red: 'rojo', h: 20, places: 1, wrong: [150, 15] },
        { es: 'Un décimo', en: 'One tenth', red: 'rojo', h: 10, places: 1, wrong: [1, 110] },
      ]);
      const dec = (x: number) => T(decEs(x, x % 10 === 0 ? 1 : 2), decEn(x, x % 10 === 0 ? 1 : 2));
      return choose(r,
        T(`${pick.es} del tapiz chico ${pick.red === 'rojos' ? 'son' : 'es'} ${pick.red}. ¿Qué decimal lo muestra?`, `${pick.en} of the small tapestry is red. Which decimal shows it?`),
        dec(pick.h), pick.wrong.map(dec),
        T(`Son ${pick.h} cuadraditos de 100: ${pick.h}/100 = ${decEs(pick.h)}.`, `It is ${pick.h} squares out of 100: ${pick.h}/100 = ${decEn(pick.h)}.`),
        L('Pintá esa parte en una cuadrícula de 100. ¿Cuántos cuadraditos son?|Shade that part on a 100-square grid. How many squares is it?'),
        { model: { strips: [[pick.h, 100]] } });
    },
    r => {
      const tenths = r.int(0, 1) === 0, h = tenths ? r.int(1, 9) * 10 : r.int(11, 99);
      const shown = tenths ? [decEs(h, 1), decEn(h, 1)] : [decEs(h), decEn(h)];
      return typed(
        T(`Un dibujo en una esquina ocupa ${shown[0]} del tapiz chico. ¿Cuántos cuadraditos de 100 son?`, `A pattern in one corner covers ${shown[1]} of the small tapestry. How many squares out of 100 is that?`),
        h,
        T(`${shown[0]} son ${h} centésimos: ${h} cuadraditos.`, `${shown[1]} is ${h} hundredths: ${h} squares.`),
        T(`Escribí ${shown[0]} con dos cifras después de la coma.`, `Write ${shown[1]} with two digits after the point.`),
        { unit: T('cuadraditos', 'squares'), model: { strips: [[h, 100]] } },
      );
    },
  ],
};

