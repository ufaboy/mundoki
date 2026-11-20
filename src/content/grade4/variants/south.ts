// Chapters 7–10 — Mendoza, the Perito Moreno glacier, Ushuaia and Península
// Valdés (G04-09 … G04-12): units of mass, length and capacity, volume in
// layers, turns and angles, the protractor, triangles by sides and angles,
// closing a triangle, copying shapes, and the parts and nets of solids.
import type { LocalizedText } from '../../../math/core/types';
import { T, choose, typed, es, en, L, type Generator } from './kit';

type Tri = 'equilateral' | 'isosceles' | 'scalene';
const TRI_NAME: Record<Tri, LocalizedText> = { equilateral: L('Equilátero|Equilateral'), isosceles: L('Isósceles|Isosceles'), scalene: L('Escaleno|Scalene') };
const RIGHT_TRI = L('Rectángulo|Right-angled');
const kindOf = (s: number[]): Tri => (s[0] === s[1] && s[1] === s[2] ? 'equilateral' : s[0] === s[1] || s[1] === s[2] || s[0] === s[2] ? 'isosceles' : 'scalene');
const ANGLE_KINDS = [L('Agudo|Acute'), L('Recto|Right'), L('Obtuso|Obtuse')];
const angleKind = (a: number) => ANGLE_KINDS[a < 90 ? 0 : a === 90 ? 1 : 2];

export const south: Record<string, [Generator, Generator]> = {
  'G04-09-L01': [
    r => {
      const c = r.pick([
        () => { const k = r.int(2, 9); return { es: `La caja de herramientas de Nina pesa ${k} kg. La planilla de carga pide gramos. ¿Cuántos gramos son?`, en: `Nina’s toolbox weighs ${k} kg. The load sheet asks for grams. How many grams is that?`, v: k * 1000, u: ['g', 'g'], why: [`Cada kilogramo tiene mil gramos: ${k} kg = ${es(k * 1000)} g.`, `Each kilogram has one thousand grams: ${k} kg = ${en(k * 1000)} g.`], hint: ['Un kilogramo son 1.000 gramos. ¿Cuántos kilogramos hay?', 'One kilogram is 1,000 grams. How many kilograms are there?'] }; },
        () => { const k = r.int(1, 4), g = r.int(1, 9) * 100; return { es: `La valija pesa ${k} kg y ${g} g. La planilla pide gramos. ¿Cuántos gramos son?`, en: `The suitcase weighs ${k} kg and ${g} g. The sheet asks for grams. How many grams is that?`, v: k * 1000 + g, u: ['g', 'g'], why: [`${k} kg = ${es(k * 1000)} g, y ${es(k * 1000)} + ${g} = ${es(k * 1000 + g)} g.`, `${k} kg = ${en(k * 1000)} g, and ${en(k * 1000)} + ${g} = ${en(k * 1000 + g)} g.`], hint: ['Pasá primero los kilogramos a gramos y después sumá.', 'Change the kilograms into grams first, then add.'] }; },
        () => { const m = r.int(2, 9); return { es: `La soga para atar el avión mide ${m} m. ¿Cuántos centímetros son?`, en: `The rope for tying down the plane is ${m} m long. How many centimeters is that?`, v: m * 100, u: ['cm', 'cm'], why: [`Cada metro tiene 100 cm: ${m} × 100 = ${m * 100} cm.`, `Each meter has 100 cm: ${m} × 100 = ${m * 100} cm.`], hint: ['Un metro son 100 centímetros. ¿Cuántos metros hay?', 'One meter is 100 centimeters. How many meters are there?'] }; },
      ])();
      return typed(T(c.es, c.en), c.v, T(c.why[0], c.why[1]), T(c.hint[0], c.hint[1]), { unit: T(c.u[0], c.u[1]), reward: T(`La planilla de carga queda completa: ${es(c.v)} ${c.u[0]}.`, `The load sheet is complete: ${en(c.v)} ${c.u[1]}.`) });
    },
    r => {
      const m = r.int(1, 3), kind = r.pick(['cm', 'm', 'same'] as const);
      const cm = kind === 'same' ? m * 100 : kind === 'cm' ? m * 100 + r.int(1, 9) * 10 : m * 100 - r.int(1, 9) * 10;
      const CM = T(`${cm} cm`, `${cm} cm`), M = T(`${m} m`, `${m} m`), SAME = L('Miden lo mismo|They are the same length');
      const right = kind === 'cm' ? CM : kind === 'm' ? M : SAME;
      return choose(r,
        T(`Hay viento en el aeródromo. Para atar el avión, Nina necesita la cuerda más larga. ¿Cuál es: ${cm} cm o ${m} m?`, `It is windy at the airfield. To tie down the plane, Nina needs the longer rope. Which is it: ${cm} cm or ${m} m?`),
        right, [CM, M, SAME].filter(o => o !== right),
        T(`${m} m son ${m * 100} cm. Comparamos ${m * 100} cm con ${cm} cm.`, `${m} m is ${m * 100} cm. We compare ${m * 100} cm with ${cm} cm.`),
        T(`Pasá ${m} m a centímetros antes de comparar.`, `Change ${m} m into centimeters before comparing.`),
        { reward: L('Con la cuerda más larga, el avión queda bien atado contra el viento.|With the longer rope, the plane is tied down tight against the wind.') });
    },
  ],
  'G04-09-L02': [
    r => {
      const [litres, cup] = r.pick([[1, 250], [1, 200], [1, 500], [2, 250], [2, 500], [3, 500], [2, 200], [3, 250]] as const), cups = litres * 1000 / cup;
      return typed(
        T(`¿Cuántos vasos de ${cup} mL se llenan con una botella de ${litres} L?`, `How many ${cup} mL cups can be filled from a ${litres} L bottle?`),
        cups,
        T(`${litres} L = ${es(litres * 1000)} mL, y ${cups} vasos de ${cup} mL son ${es(litres * 1000)} mL.`, `${litres} L = ${en(litres * 1000)} mL, and ${cups} cups of ${cup} mL are ${en(litres * 1000)} mL.`),
        T(`Pasá ${litres} L a mililitros y contá de ${cup} en ${cup}.`, `Change ${litres} L into milliliters and count in ${cup}s.`),
        { unit: T('vasos', 'cups'), reward: T(`La botella llena ${cups} vasos de ${cup} mL para el viaje.`, `The bottle fills ${cups} cups of ${cup} mL for the trip.`) },
      );
    },
    r => {
      const layers = r.int(2, 5), per = r.int(4, 12), n = layers * per;
      return typed(
        T(`La bodega del avión se llena con cajas cúbicas: ${layers} capas de ${per}, sin huecos. ¿Cuántas cajas hay?`, `The plane’s hold is filled with cube boxes: ${layers} layers of ${per}, with no gaps. How many boxes are there?`),
        n,
        T(`Se cuenta cada capa, también las de abajo que no se ven: ${layers} × ${per} = ${n}.`, `Count every layer, including the bottom ones you cannot see: ${layers} × ${per} = ${n}.`),
        T(`Contá las cajas de una capa y repetí por cada capa.`, `Count the boxes in one layer and repeat for each layer.`),
        { unit: T('cajas', 'boxes'), reward: T(`Las ${n} cajas quedan bien acomodadas en la bodega.`, `The ${n} boxes are packed neatly in the hold.`) },
      );
    },
  ],
  'G04-09-L03': [
    r => {
      const km = r.int(2, 9), extra = r.pick([0, 0, r.int(1, 9) * 100]), m = km * 1000 + extra;
      return typed(
        extra
          ? T(`La Golondrina sube ${km} km y ${extra} m. ¿Cuántos metros son?`, `La Golondrina climbs ${km} km and ${extra} m. How many meters is that?`)
          : T(`La Golondrina puede subir hasta ${km} km de altura. ¿Cuántos metros son?`, `La Golondrina can climb to a height of ${km} km. How many meters is that?`),
        m,
        T(`Un kilómetro tiene mil metros: ${km} km = ${es(km * 1000)} m${extra ? `, y ${es(km * 1000)} + ${extra} = ${es(m)} m` : ''}.`, `One kilometer has one thousand meters: ${km} km = ${en(km * 1000)} m${extra ? `, and ${en(km * 1000)} + ${extra} = ${en(m)} m` : ''}.`),
        L('Un kilómetro son 1.000 metros. ¿Cuántos kilómetros hay?|One kilometer is 1,000 meters. How many kilometers are there?'),
        { unit: T('m', 'm'), reward: m < 6961 ? T(`Como ${es(m)} m es menos que 6.961 m, Nina traza la ruta junto a la montaña, no por encima.`, `Since ${en(m)} m is less than 6,961 m, Nina plans the route beside the mountain, not over it.`) : T(`${es(m)} m es más que los 6.961 m del Aconcagua, pero Nina igual traza la ruta junto a la montaña.`, `${en(m)} m is more than the Aconcagua’s 6,961 m, but Nina still plans the route beside the mountain.`) },
      );
    },
    r => {
      const items: [LocalizedText, LocalizedText][] = [
        [L('la capacidad del vaso del termo|the capacity of the thermos cup'), L('mL|mL')], [L('la masa de una valija|the mass of a suitcase'), L('kg|kg')],
        [L('la distancia de Mendoza a Ushuaia|the distance from Mendoza to Ushuaia'), L('km|km')], [L('el largo de un lápiz|the length of a pencil'), L('cm|cm')],
        [L('la masa de una carta|the mass of a letter'), L('g|g')], [L('la capacidad del tanque del avión|the capacity of the plane’s tank'), L('L|L')],
      ];
      const i = r.int(0, items.length - 1), [what, right] = items[i];
      const wrong = r.shuffle(items.filter((x, j) => j !== i && x[1]['en-US'] !== right['en-US']).map(x => x[1])).slice(0, 2);
      return choose(r,
        T(`¿Qué unidad conviene para ${what['es-AR']}?`, `Which unit suits ${what['en-US']}?`),
        right, wrong,
        T(`${right['es-AR']} es la unidad que conviene: mide lo que pide la pregunta y da un número cómodo.`, `${right['en-US']} is the right unit: it measures what the question asks and gives a handy number.`),
        L('Pensá primero: ¿es un largo, una masa o una capacidad? Después, ¿es grande o chico?|Think first: is it a length, a mass, or a capacity? Then: is it big or small?'));
    },
  ],
  'G04-10-L01': [
    r => {
      const turn = r.pick([
        { es: 'media vuelta', en: 'half a turn', deg: 180 }, { es: 'un cuarto de vuelta', en: 'a quarter turn', deg: 90 },
        { es: 'tres cuartos de vuelta', en: 'three quarters of a turn', deg: 270 }, { es: 'una vuelta entera', en: 'a full turn', deg: 360 },
      ]);
      return typed(
        T(`Sobre el glaciar, el avión da ${turn.es}. ¿Cuántos grados son?`, `Over the glacier, the plane makes ${turn.en}. How many degrees is that?`),
        turn.deg,
        T(`Una vuelta entera son 360°; ${turn.es}, ${turn.deg}°.`, `A full turn is 360°; ${turn.en}, ${turn.deg}°.`),
        L('Una vuelta entera son 360°. ¿Qué parte de la vuelta da el avión?|A full turn is 360°. What part of the turn does the plane make?'),
        { unit: T('°', '°'), model: turn.deg <= 180 ? { angle: turn.deg } : undefined, reward: T(`La Golondrina gira ${turn.deg}° junto a la pared de hielo.`, `La Golondrina turns ${turn.deg}° beside the wall of ice.`) },
      );
    },
    r => {
      const deg = r.pick([40, 55, 70, 110, 125, 140]), kind = r.pick(['longer', 'wider', 'narrower'] as const);
      const SAME = L('No, sigue igual|No, it stays the same'), BIG = L('Sí, se hace más grande|Yes, it gets bigger'), SMALL = L('Sí, se hace más chico|Yes, it gets smaller');
      const right = kind === 'longer' ? SAME : kind === 'wider' ? BIG : SMALL;
      return choose(r,
        kind === 'longer'
          ? T(`Nina dibuja un giro de ${deg}° con líneas cortas. Átomo lo copia con líneas largas, sin abrirlas ni cerrarlas. ¿Cambia el ángulo?`, `Nina draws a ${deg}° turn with short lines. Átomo copies it with long lines, without opening or closing them. Does the angle change?`)
          : kind === 'wider'
            ? T(`Nina dibuja un giro de ${deg}°. Átomo deja las líneas igual de largas pero las abre más. ¿Cambia el ángulo?`, `Nina draws a ${deg}° turn. Átomo keeps the lines the same length but opens them wider. Does the angle change?`)
            : T(`Nina dibuja un giro de ${deg}°. Átomo deja las líneas igual de largas pero las cierra un poco. ¿Cambia el ángulo?`, `Nina draws a ${deg}° turn. Átomo keeps the lines the same length but closes them a little. Does the angle change?`),
        right, [SAME, BIG, SMALL].filter(o => o !== right),
        kind === 'longer'
          ? L('La abertura del giro sigue igual: el largo de las líneas no importa.|The opening of the turn stays the same: the length of the lines does not matter.')
          : L('El ángulo es la abertura entre las líneas: si cambia la abertura, cambia el ángulo.|The angle is the opening between the lines: if the opening changes, the angle changes.'),
        L('Fijate qué cambió: ¿el largo de las líneas o la abertura entre ellas?|Notice what changed: the length of the lines or the opening between them?'),
        { model: { angle: deg }, reward: L('El giro en el mapa queda bien dibujado.|The turn on the map is drawn correctly.') });
    },
  ],
  'G04-10-L02': [
    r => {
      const deg = r.pick([25, 35, 45, 60, 65, 75, 80, 90, 90]);
      const right = angleKind(deg);
      return choose(r,
        T(`El giro sobre el lago es de ${deg}°. ¿En qué columna del plan va?`, `The turn over the lake is ${deg}°. Which column of the plan does it go in?`),
        right, ANGLE_KINDS.filter(o => o !== right),
        deg === 90 ? T('90° es exactamente un ángulo recto.', '90° is exactly a right angle.') : T(`${deg}° es menos que 90°: es un giro agudo.`, `${deg}° is less than 90°: it is an acute turn.`),
        L('Compará el giro con la esquina de una hoja, que mide 90°.|Compare the turn with the corner of a sheet of paper, which is 90°.'),
        { model: { angle: deg }, reward: T(`El giro de ${deg}° queda en su columna.`, `The ${deg}° turn goes in its column.`) });
    },
    r => {
      const deg = r.pick([95, 105, 120, 135, 150, 165, 90]);
      const right = angleKind(deg);
      return choose(r,
        T(`El giro para volver al aeródromo es de ${deg}°. ¿En qué columna va?`, `The turn back to the airfield is ${deg}°. Which column does it go in?`),
        right, ANGLE_KINDS.filter(o => o !== right),
        deg === 90 ? T('90° es exactamente un ángulo recto.', '90° is exactly a right angle.') : T(`${deg}° está entre 90° y 180°: es un giro obtuso.`, `${deg}° is between 90° and 180°: it is an obtuse turn.`),
        L('Compará el giro con la esquina de una hoja, que mide 90°.|Compare the turn with the corner of a sheet of paper, which is 90°.'),
        { model: { angle: deg }, reward: T(`El giro de ${deg}° queda en su columna. ¡La ruta sobre el lago está lista!`, `The ${deg}° turn goes in its column. The route over the lake is ready!`) });
    },
  ],
  'G04-10-L03': [
    r => {
      const VERTEX = L('En el vértice, donde está el avión|At the vertex, where the plane is'), RAY = L('Sobre una de las líneas del ángulo|Along one of the lines of the angle');
      const FAR = L('En el extremo más lejano de la línea|At the far end of the line'), MIDDLE = L('En el medio de la línea|In the middle of the line');
      const center = r.int(0, 1) === 0;
      return choose(r,
        center
          ? L('Para dibujar el rumbo con el transportador, ¿dónde va el centro del transportador?|To draw the heading with the protractor, where does the center of the protractor go?')
          : L('Para medir el rumbo con el transportador, ¿dónde va la línea del 0 de la escala?|To measure the heading with the protractor, where does the 0 line of the scale go?'),
        center ? VERTEX : RAY, center ? [RAY, FAR, MIDDLE] : [VERTEX, FAR, MIDDLE],
        center ? L('La medición del giro parte del vértice: el lugar del avión.|Measuring the turn starts at the vertex: where the plane is.') : L('El 0 se apoya sobre una línea del ángulo y se cuenta hasta la otra.|The 0 lies along one line of the angle, and we count up to the other.'),
        L('Mirá dónde empieza el giro y desde qué línea se cuenta.|Look at where the turn starts and from which line it is counted.'));
    },
    r => {
      const want = r.pick([30, 40, 50, 60, 70]), wrong = r.int(0, 1) === 0, drawn = wrong ? 180 - want : want;
      const SCALE = L('Si se leyó la escala desde el cero correcto|Whether the scale was read from the right zero');
      const OK = L('Nada: el dibujo coincide con el rumbo|Nothing: the drawing matches the heading');
      const LINES = L('Solo el largo de las líneas|Only the length of the lines');
      return choose(r,
        wrong
          ? T(`Nina quería ${want}°, pero el dibujo muestra un ángulo obtuso de ${drawn}°. ¿Qué hay que revisar?`, `Nina wanted ${want}°, but the drawing shows an obtuse angle of ${drawn}°. What should be checked?`)
          : T(`Nina quería ${want}° y el dibujo muestra un ángulo agudo de ${drawn}°. ¿Qué hay que revisar?`, `Nina wanted ${want}° and the drawing shows an acute angle of ${drawn}°. What should be checked?`),
        wrong ? SCALE : OK, wrong ? [OK, LINES] : [SCALE, LINES],
        wrong
          ? T(`${want}° debe ser agudo; la escala opuesta marca ${drawn}°.`, `${want}° must be acute; the opposite scale shows ${drawn}°.`)
          : T(`${want}° es agudo y el dibujo marca ${drawn}°: está bien.`, `${want}° is acute and the drawing shows ${drawn}°: it is right.`),
        L('¿El rumbo pedido es agudo u obtuso? ¿Y el dibujo?|Is the heading asked for acute or obtuse? And the drawing?'),
        { model: { angle: drawn }, reward: T(`¡Etapa completa! Con el rumbo de ${want}°, La Golondrina pasa junto al glaciar y un bloque de hielo cae al lago. Próxima parada: Ushuaia.`, `Stage complete! On the ${want}° heading, La Golondrina passes the glacier, and a block of ice falls into the lake. Next stop: Ushuaia.`) });
    },
  ],
  'G04-11-L01': [
    r => {
      const kind = r.pick(['equilateral', 'isosceles', 'scalene'] as const);
      const a = r.int(3, 9);
      const sides = kind === 'equilateral' ? [a, a, a] : kind === 'isosceles' ? [a, a, r.pick([a - 2, a - 1, a + 1, a + 2].filter(x => x > 1 && x < 2 * a))] : (() => { const s = r.shuffle([3, 4, 5, 6, 7, 8]).slice(0, 3).sort((x, y) => x - y); return s[0] + s[1] > s[2] ? s : [4, 5, 6]; })();
      const right = TRI_NAME[kindOf(sides)];
      // An equilateral triangle is also isosceles («al menos dos lados iguales»), so that option is not offered then.
      const wrong = kind === 'equilateral' ? [TRI_NAME.scalene, RIGHT_TRI] : [TRI_NAME.equilateral, TRI_NAME.isosceles, TRI_NAME.scalene].filter(o => o !== right);
      return choose(r,
        T(`Un dibujo de refuerzo tiene lados de ${sides.join(' cm, ')} cm. ¿Qué nombre preciso describe sus lados?`, `A brace drawing has sides of ${sides.join(' cm, ')} cm. Which precise name describes its sides?`),
        right, wrong,
        kind === 'equilateral' ? T('Los tres lados son iguales: es equilátero.', 'All three sides are equal: it is equilateral.')
          : kind === 'isosceles' ? T('Tiene dos lados iguales: es isósceles.', 'It has two equal sides: it is isosceles.')
            : T('Los tres lados son distintos: es escaleno.', 'All three sides are different: it is scalene.'),
        L('Compará los largos de los tres lados. ¿Cuántos son iguales?|Compare the lengths of the three sides. How many are equal?'),
        { reward: T(`El dibujo queda rotulado: ${right['es-AR'].toLowerCase()}.`, `The drawing is labelled: ${right['en-US'].toLowerCase()}.`) });
    },
    r => {
      const ACUTE = L('Acutángulo|Acute'), RIGHT = L('Rectángulo|Right-angled'), OBTUSE = L('Obtusángulo|Obtuse');
      const kind = r.pick(['acute', 'right', 'obtuse'] as const);
      const angles = kind === 'acute' ? r.pick([[60, 60, 60], [50, 60, 70], [45, 65, 70], [40, 70, 70]]) : kind === 'right' ? r.pick([[90, 45, 45], [90, 30, 60], [90, 40, 50]]) : r.pick([[100, 40, 40], [120, 30, 30], [110, 35, 35], [130, 20, 30]]);
      const right = kind === 'acute' ? ACUTE : kind === 'right' ? RIGHT : OBTUSE;
      return choose(r,
        T(`Otro dibujo de refuerzo tiene ángulos de ${angles.join('°, ')}°. ¿Cómo se clasifica por ángulos?`, `Another brace drawing has angles of ${angles.join('°, ')}°. How is it classified by angles?`),
        right, [ACUTE, RIGHT, OBTUSE].filter(o => o !== right),
        kind === 'acute' ? T('Los tres ángulos son menores que 90°: es acutángulo.', 'All three angles are less than 90°: it is acute.')
          : kind === 'right' ? T('Tiene un ángulo de 90°: es rectángulo.', 'It has a 90° angle: it is right-angled.')
            : T(`Tiene un ángulo de ${angles[0]}°, mayor que 90°: es obtusángulo.`, `It has a ${angles[0]}° angle, greater than 90°: it is obtuse.`),
        L('Buscá el ángulo más grande. ¿Es menor, igual o mayor que 90°?|Find the biggest angle. Is it less than, equal to, or greater than 90°?'),
        { reward: L('Los dibujos de refuerzo quedan ordenados.|The brace drawings are sorted.') });
    },
  ],
  'G04-11-L02': [
    r => {
      const kind = r.pick(['yes', 'flat', 'short'] as const), a = r.int(2, 6), b = r.int(2, 6);
      const c = kind === 'yes' ? r.int(Math.abs(a - b) + 1, a + b - 1) : kind === 'flat' ? a + b : a + b + r.int(1, 3);
      const YES = L('Sí|Yes'), NO = L('No|No'), ORDER = L('Solo si se cambia el orden de las tiras|Only if the order of the strips changes');
      const big = Math.max(a, b, c), others = [a, b, c].sort((x, y) => x - y).slice(0, 2);
      const closes = others[0] + others[1] > big;
      return choose(r,
        T(`¿Pueden tiras de ${a} cm, ${b} cm y ${c} cm cerrar un triángulo?`, `Can strips of ${a} cm, ${b} cm, and ${c} cm close a triangle?`),
        closes ? YES : NO, [closes ? NO : YES, ORDER],
        closes
          ? T(`${others[0]} + ${others[1]} = ${others[0] + others[1]}, más que ${big}: el triángulo cierra.`, `${others[0]} + ${others[1]} = ${others[0] + others[1]}, more than ${big}: the triangle closes.`)
          : T(`${others[0]} + ${others[1]} = ${others[0] + others[1]}, que no supera ${big}: las tiras no cierran el triángulo.`, `${others[0]} + ${others[1]} = ${others[0] + others[1]}, which is not more than ${big}: the strips do not close a triangle.`),
        T(`Sumá las dos tiras más cortas y compará con la más larga.`, `Add the two shortest strips and compare with the longest.`),
        { reward: closes ? T(`Con ${a}, ${b} y ${c} cm el modelo cierra: ese refuerzo se corta en metal.`, `With ${a}, ${b}, and ${c} cm the model closes: that brace is cut in metal.`) : T(`Las tiras de ${a}, ${b} y ${c} cm no cierran y vuelven a la caja.`, `The ${a}, ${b}, and ${c} cm strips do not close and go back into the box.`) });
    },
    r => {
      const s = r.shuffle([[3, 4, 5], [2, 3, 6], [4, 4, 9], [5, 5, 6], [2, 5, 7], [3, 6, 8], [4, 7, 10], [1, 4, 6]])[0];
      const closes = s[0] + s[1] > s[2];
      const YES = L('Sí|Yes'), NO = L('No|No'), ORDER = L('Solo si se cambia el orden de las tiras|Only if the order of the strips changes');
      return choose(r,
        T(`Átomo encuentra tiras de ${s[0]} cm, ${s[1]} cm y ${s[2]} cm. ¿Pueden cerrar un triángulo?`, `Átomo finds strips of ${s[0]} cm, ${s[1]} cm, and ${s[2]} cm. Can they close a triangle?`),
        closes ? YES : NO, [closes ? NO : YES, ORDER],
        closes
          ? T(`${s[0]} + ${s[1]} = ${s[0] + s[1]}, más que ${s[2]}: el triángulo cierra.`, `${s[0]} + ${s[1]} = ${s[0] + s[1]}, more than ${s[2]}: the triangle closes.`)
          : T(`${s[0]} + ${s[1]} = ${s[0] + s[1]}, que no supera ${s[2]}: el triángulo no cierra.`, `${s[0]} + ${s[1]} = ${s[0] + s[1]}, which is not more than ${s[2]}: the triangle does not close.`),
        T(`Sumá las dos tiras más cortas y compará con la más larga.`, `Add the two shortest strips and compare with the longest.`),
        { reward: closes ? T(`Las tiras de ${s.join(', ')} cm cierran: Átomo las guarda para el soporte.`, `The ${s.join(', ')} cm strips close: Átomo keeps them for the support.`) : T(`Las tiras de ${s.join(', ')} cm quedan chatas y vuelven a la caja.`, `The ${s.join(', ')} cm strips stay flat and go back into the box.`) });
    },
  ],
  'G04-11-L03': [
    r => {
      const kind = r.pick(['isosceles', 'scalene', 'equilateral'] as const), a = r.int(4, 8);
      const sides = kind === 'isosceles' ? [a, a, a + 2] : kind === 'equilateral' ? [a, a, a] : [a - 1, a, a + 2];
      const right = TRI_NAME[kind];
      const wrong = kind === 'equilateral' ? [TRI_NAME.scalene, RIGHT_TRI] : [TRI_NAME.equilateral, TRI_NAME.isosceles, TRI_NAME.scalene].filter(o => o !== right);
      return choose(r,
        T(`Un refuerzo de ${sides.join(', ')} cm se coloca dado vuelta. ¿Qué tipo de triángulo es ahora, por sus lados?`, `A ${sides.join(', ')} cm brace is fitted turned around. What kind of triangle is it now, by its sides?`),
        right, wrong,
        T(`Al girarlo, sus lados siguen midiendo ${sides.join(', ')} cm: sigue siendo ${right['es-AR'].toLowerCase()}.`, `When turned, its sides still measure ${sides.join(', ')} cm: it is still ${right['en-US'].toLowerCase()}.`),
        L('Girá una hoja con el triángulo dibujado. ¿Cambian los largos de los lados?|Turn a sheet with the triangle drawn on it. Do the side lengths change?'),
        { reward: T(`El refuerzo de ${sides.join(', ')} cm queda colocado.`, `The ${sides.join(', ')} cm brace is fitted.`) });
    },
    r => {
      const SCALENE = L('Sus tres lados tienen longitudes distintas|All three sides have different lengths');
      const ISOS = L('Tiene al menos dos lados iguales|It has at least two equal sides');
      const RIGHT = L('Tiene un ángulo de 90°|It has a 90° angle');
      const TILT = L('Está dibujado inclinado|It is drawn tilted');
      const ask = r.pick([['escaleno', 'scalene', SCALENE], ['isósceles', 'isosceles', ISOS], ['rectángulo', 'right-angled', RIGHT]] as const);
      return choose(r,
        T(`¿Qué dato prueba que un refuerzo es ${ask[0]}?`, `Which information proves that a brace is ${ask[1]}?`),
        ask[2], [SCALENE, ISOS, RIGHT, TILT].filter(o => o !== ask[2]).slice(0, 3),
        T(`${ask[0][0].toUpperCase()}${ask[0].slice(1)} se decide por ${ask[2] === RIGHT ? 'sus ángulos' : 'las longitudes de sus lados'}, no por la posición.`, `${ask[1][0].toUpperCase()}${ask[1].slice(1)} is decided by ${ask[2] === RIGHT ? 'its angles' : 'its side lengths'}, not by its position.`),
        L('Pensá si el nombre habla de lados, de ángulos o de cómo está dibujado.|Think whether the name is about sides, angles, or how it is drawn.'));
    },
  ],
  'G04-12-L01': [
    r => {
      const SQUARE = L('Escuadra|Set square'), PROTRACTOR = L('Transportador|Protractor'), RULER = L('Regla|Ruler'), COMPASS = L('Compás|Compasses');
      const ask = r.pick([
        [L('Para que el parche encaje, sus esquinas tienen que ser rectas. ¿Qué herramienta ayuda a copiar ángulos rectos?|For the patch to fit, its corners must be right angles. Which tool helps copy right angles?'), SQUARE, L('La escuadra tiene una esquina de 90°.|The set square has a 90° corner.')],
        [L('El parche tiene una esquina de 70°. ¿Qué herramienta mide cuántos grados tiene?|The patch has a 70° corner. Which tool measures how many degrees it has?'), PROTRACTOR, L('El transportador mide ángulos en grados.|The protractor measures angles in degrees.')],
        [L('Un lado del parche tiene que medir 12 cm. ¿Qué herramienta sirve para trazarlo?|One side of the patch must be 12 cm long. Which tool helps draw it?'), RULER, L('La regla mide y traza segmentos rectos.|The ruler measures and draws straight segments.')],
        [L('Nina quiere un parche redondo para la rueda. ¿Qué herramienta sirve para trazarlo?|Nina wants a round patch for the wheel. Which tool helps draw it?'), COMPASS, L('El compás traza circunferencias.|Compasses draw circles.')],
      ] as const);
      return choose(r, ask[0], ask[1], [SQUARE, PROTRACTOR, RULER, COMPASS].filter(o => o !== ask[1]).slice(0, 2), ask[2],
        L('Pensá qué hay que copiar: un ángulo recto, una medida en grados, un largo o un círculo.|Think about what must be copied: a right angle, a size in degrees, a length, or a circle.'));
    },
    r => {
      const a = r.int(4, 9), b = r.int(2, a - 1);
      const ANGLES = L('Información sobre sus ángulos|Information about its angles'), NOTHING = L('Nada más: con eso alcanza|Nothing more: that is enough'), COLOUR = L('Su color|Its colour');
      const shape = r.pick([
        { es: `un paralelogramo de lados ${a} cm y ${b} cm`, en: `a parallelogram with sides of ${a} cm and ${b} cm`, right: ANGLES, why: L('Los largos solos no fijan cuánto se inclina: hacen falta los ángulos.|Lengths alone do not fix how much it slants: the angles are needed.') },
        { es: `un rectángulo de ${a} cm por ${b} cm`, en: `a rectangle ${a} cm by ${b} cm`, right: NOTHING, why: L('Un rectángulo ya tiene cuatro ángulos rectos: alcanza con el largo y el ancho.|A rectangle already has four right angles: its length and width are enough.') },
        { es: `un rombo de lados de ${a} cm`, en: `a rhombus with ${a} cm sides`, right: ANGLES, why: L('Un rombo puede estar más o menos aplastado: hacen falta los ángulos.|A rhombus can be more or less squashed: the angles are needed.') },
        { es: `un cuadrado de ${a} cm de lado`, en: `a square with ${a} cm sides`, right: NOTHING, why: L('Un cuadrado tiene lados iguales y ángulos rectos: alcanza con el lado.|A square has equal sides and right angles: the side is enough.') },
      ]);
      return choose(r,
        T(`El parche es ${shape.es}. ¿Qué más necesitamos para copiar su forma?`, `The patch is ${shape.en}. What else do we need to copy its shape?`),
        shape.right, [ANGLES, NOTHING, COLOUR].filter(o => o !== shape.right), shape.why,
        L('Pensá si con los largos ya se sabe cuánto se inclina la figura.|Think whether the lengths already tell how much the shape slants.'),
        { reward: L('Con los datos justos, el parche encaja en el ala.|With the right information, the patch fits the wing.') });
    },
  ],
  'G04-12-L02': [
    r => {
      const solid = r.pick([
        { es: 'una caja con forma de cubo', en: 'a cube-shaped box', faces: 6, edges: 12, vertices: 8 },
        { es: 'una caja con forma de prisma triangular', en: 'a box shaped like a triangular prism', faces: 5, edges: 9, vertices: 6 },
        { es: 'una pirámide de base cuadrada', en: 'a pyramid with a square base', faces: 5, edges: 8, vertices: 5 },
      ]);
      const part = r.pick(['edges', 'vertices', 'faces'] as const), n = solid[part];
      const act = {
        edges: { es: 'un trozo de cinta en cada arista', en: 'a strip of tape on every edge', unit: ['trozos de cinta', 'strips of tape'], many: 'Cuántos' },
        vertices: { es: 'un protector en cada vértice', en: 'a protector on every vertex', unit: ['protectores', 'protectors'], many: 'Cuántos' },
        faces: { es: 'una etiqueta en cada cara', en: 'a label on every face', unit: ['etiquetas', 'labels'], many: 'Cuántas' },
      }[part];
      return typed(
        T(`En la excursión regalan postales en ${solid.es}. Átomo pone ${act.es}. ¿${act.many} ${act.unit[0]} necesita?`, `On the trip they give out postcards in ${solid.en}. Átomo puts ${act.en}. How many ${act.unit[1]} does he need?`),
        n,
        T(`Tiene ${solid.faces} caras, ${solid.edges} aristas y ${solid.vertices} vértices: hacen falta ${n}.`, `It has ${solid.faces} faces, ${solid.edges} edges, and ${solid.vertices} vertices: ${n} are needed.`),
        L('Contá arriba, abajo y los de los costados, sin repetir ninguno.|Count the top, the bottom, and the sides, without counting any twice.'),
        { unit: T(act.unit[0], act.unit[1]), reward: T(`Átomo tiene listos sus ${n} ${act.unit[0]}.`, `Átomo has his ${n} ${act.unit[1]} ready.`) },
      );
    },
    r => {
      const VERT = L('En los vértices|At the vertices'), FACES = L('En las caras|On the faces'), EDGES = L('En las aristas|Along the edges');
      const ask = r.pick([
        [L('Nina pone protectores donde se juntan tres aristas de la caja. ¿Dónde van?|Nina puts protectors where three edges of the box meet. Where do they go?'), VERT, L('El vértice es la esquina donde se juntan las aristas.|A vertex is the corner where the edges meet.')],
        [L('Nina pega una etiqueta en cada superficie plana de la caja. ¿Dónde van?|Nina sticks a label on every flat surface of the box. Where do they go?'), FACES, L('Las caras son las superficies planas de la caja.|The faces are the flat surfaces of the box.')],
        [L('Nina pone cinta en cada borde donde se juntan dos caras. ¿Dónde va?|Nina puts tape on every border where two faces meet. Where does it go?'), EDGES, L('La arista es el borde donde se juntan dos caras.|An edge is the border where two faces meet.')],
      ] as const);
      return choose(r, ask[0], ask[1], [VERT, FACES, EDGES].filter(o => o !== ask[1]), ask[2],
        L('Tocá una caja de verdad: una esquina, un borde y una superficie plana.|Touch a real box: a corner, a border, and a flat surface.'),
        { reward: L('La caja queda protegida. ¡Lista para el viaje!|The box is protected. Ready for the trip!') });
    },
  ],
  'G04-12-L03': [
    r => {
      const solid = r.pick([
        { es: 'una caja cúbica', en: 'a cube-shaped box', faces: 6, shape: ['cuadradas', 'square'] },
        { es: 'una caja con forma de prisma rectangular', en: 'a box shaped like a rectangular prism', faces: 6, shape: ['rectangulares', 'rectangular'] },
        { es: 'una caja con forma de prisma triangular', en: 'a box shaped like a triangular prism', faces: 5, shape: ['planas', 'flat'] },
        { es: 'una pirámide de base cuadrada', en: 'a pyramid with a square base', faces: 5, shape: ['planas', 'flat'] },
      ]);
      return typed(
        T(`Nina quiere armar ${solid.es} para regalos. ¿Cuántas caras ${solid.shape[0]} debe tener su red?`, `Nina wants to make ${solid.en} for gifts. How many ${solid.shape[1]} faces must its net have?`),
        solid.faces,
        T(`El cuerpo tiene ${solid.faces} caras, y la red tiene una por cada cara: ${solid.faces}.`, `The solid has ${solid.faces} faces, and the net has one for each face: ${solid.faces}.`),
        L('Contá las caras del cuerpo: abajo, arriba y los costados.|Count the faces of the solid: bottom, top, and sides.'),
        { unit: T('caras', 'faces') },
      );
    },
    r => {
      const OK = L('Sirve: al doblarla cierra sin huecos|It works: folded, it closes with no gaps');
      const OVER = L('No sirve: al doblarla dos caras se enciman|It does not work: folded, two faces overlap');
      const MISSING = L('No sirve: le falta una cara|It does not work: a face is missing');
      const net = r.pick([
        [L('una cruz: cuatro cuadrados en fila, uno arriba del segundo y otro abajo del segundo|a cross: four squares in a row, one above the second and one below the second'), OK],
        [L('seis cuadrados en una sola fila|six squares in a single row'), OVER],
        [L('cinco cuadrados: cuatro en fila y uno arriba del segundo|five squares: four in a row and one above the second'), MISSING],
        [L('cuatro cuadrados en fila, uno arriba del primero y otro abajo del último|four squares in a row, one above the first and one below the last'), OK],
      ] as const);
      return choose(r,
        T(`Átomo dibujó una red para una caja cúbica: ${net[0]['es-AR']}. ¿Sirve?`, `Átomo drew a net for a cube-shaped box: ${net[0]['en-US']}. Does it work?`),
        net[1], [OK, OVER, MISSING].filter(o => o !== net[1]),
        net[1] === OK ? L('Las seis caras quedan una en cada lado del cubo.|The six faces end up one on each side of the cube.') : net[1] === OVER ? L('Seis en fila dan la vuelta y dos caras quedan encimadas.|Six in a row wrap around and two faces overlap.') : L('Un cubo necesita seis caras; esta red tiene cinco.|A cube needs six faces; this net has five.'),
        L('Dibujala en papel cuadriculado, recortala y doblala.|Draw it on squared paper, cut it out, and fold it.'),
        { reward: L('¡Etapa completa! Las cajas quedan dobladas y sin huecos. La Golondrina despega rumbo a casa.|Stage complete! The boxes are folded with no gaps. La Golondrina takes off for home.') });
    },
  ],
};

