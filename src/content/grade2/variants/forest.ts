// Chapter 5 — Shape Forest (G02-09, G02-10, G02-11-L01): shapes and solids,
// routes on the question map, and measuring with a ruler.
import { T, choose, chooseNumber, typed, type Generator } from './kit';
import type { LocalizedText } from '../../../math/core/types';

const ROLLERS = [
  { name: T('la pelota', 'the ball'), tied: T('La pelota está atada', 'The ball is tied down') },
  { name: T('la lata acostada', 'the can lying down'), tied: T('La lata está atada', 'The can is tied down') },
  { name: T('el tronco acostado', 'the log lying down'), tied: T('El tronco está atado', 'The log is tied down') },
  { name: T('la canica', 'the marble'), tied: T('La canica está atada', 'The marble is tied down') },
];
const STILL = [T('el dado', 'the die'), T('la caja', 'the box'), T('el libro', 'the book'), T('el ladrillo', 'the brick')];
const cap = (text: LocalizedText) => T(text['es-AR'][0].toUpperCase() + text['es-AR'].slice(1), text['en-US'][0].toUpperCase() + text['en-US'].slice(1));

// G02-10-L01 map (3 × 3): ★ bottom left, 🦌 top right, ■ in the middle.
const SAFE = ['↑ ↑ → →', '→ → ↑ ↑'];
const BLOCKED = ['→ ↑ → ↑', '↑ → ↑ →', '↑ → → ↑', '→ ↑ ↑ →'];

export const forest: Record<string, [Generator, Generator]> = {
  'G02-09-L01': [
    r => {
      const sides = r.int(3, 8);
      return typed(
        T(`Otro portón tiene ${sides} lados. ¿Cuántas lucecitas hacen falta, una por vértice?`, `Another gate has ${sides} sides. How many little lights are needed, one per vertex?`),
        sides,
        T(`Cada vértice une dos lados. Con ${sides} lados hay ${sides} vértices.`, `Each vertex joins two sides. With ${sides} sides there are ${sides} vertices.`),
        T(`Dibujá un portón de ${sides} lados. Marcá cada esquina donde se juntan dos lados.`, `Draw a ${sides}-sided gate. Mark each corner where two sides meet.`),
        { unit: T('lucecitas', 'lights'), reward: T(`El portón brilla con ${sides} lucecitas.`, `The gate shines with ${sides} little lights.`) },
      );
    },
    r => r.int(0, 1) === 0
      ? choose(r,
        T('Buscamos el portón cuadrado. ¿Alcanza con decir «tiene 4 lados»?', 'We are looking for the square gate. Is “it has 4 sides” enough?'),
        T('No, un rectángulo largo también tiene 4', 'No, a long rectangle also has 4'),
        [T('Sí, todas las de 4 lados son cuadrados', 'Yes, all 4-sided shapes are squares'), T('Sí, si también tiene 4 vértices', 'Yes, if it also has 4 vertices')],
        T('Hay que decir más: el cuadrado tiene 4 lados iguales.', 'We need to say more: a square has 4 equal sides.'),
        T('Compará un cuadrado con un rectángulo largo. Contá sus lados.', 'Compare a square with a long rectangle. Count their sides.'),
        { reward: T('Encontraron el portón cuadrado y se abre.', 'They found the square gate, and it opens.') })
      : choose(r,
        T('Buscamos el portón triangular. ¿Alcanza con decir «tiene 3 lados»?', 'We are looking for the triangle gate. Is “it has 3 sides” enough?'),
        T('Sí, todas las figuras de 3 lados son triángulos', 'Yes, every 3-sided shape is a triangle'),
        [T('No, un cuadrado también tiene 3 lados', 'No, a square also has 3 sides'), T('No, también hay que tener 4 vértices', 'No, it also needs 4 vertices')],
        T('Toda figura plana con 3 lados rectos es un triángulo.', 'Every flat shape with 3 straight sides is a triangle.'),
        T('Dibujá dos figuras distintas de 3 lados. ¿Cómo se llaman?', 'Draw two different 3-sided shapes. What are they called?'),
        { reward: T('Encontraron el portón triangular y se abre.', 'They found the triangle gate, and it opens.') }),
  ],
  'G02-09-L02': [
    r => {
      const roller = r.pick(ROLLERS), [a, b] = r.shuffle(STILL).slice(0, 2);
      const list = r.shuffle([roller.name, a, b]);
      return choose(r,
        T(`¿Qué hay que atar para que no ruede por el túnel: ${list[0]['es-AR']}, ${list[1]['es-AR']} o ${list[2]['es-AR']}?`, `What must be tied down so it does not roll down the tunnel: ${list[0]['en-US']}, ${list[1]['en-US']}, or ${list[2]['en-US']}?`),
        cap(roller.name), [cap(a), cap(b)],
        T(`${cap(roller.name)['es-AR']} se apoya en una parte curva y rueda. Lo demás se apoya en caras planas.`, `${cap(roller.name)['en-US']} rests on a curved part and rolls. The others rest on flat faces.`),
        T('Imaginá las tres cosas en una bajada. Buscá cuál no tiene una parte plana abajo.', 'Imagine the three things on a slope. Find which one has no flat part underneath.'),
        { reward: T(`${roller.tied['es-AR']}. Nada se escapa.`, `${roller.tied['en-US']}. Nothing gets away.`) });
    },
    r => {
      const form = r.int(0, 2);
      const options = [T('Tiene una parte curva y bases planas', 'It has a curved part and flat bases'), T('No tiene partes planas', 'It has no flat parts'), T('Todas sus caras son planas', 'All its faces are flat')];
      const prompts = [
        r.pick([T('¿Por qué un tronco puede rodar y también quedarse parado?', 'Why can a log roll and also stand up?'), T('¿Por qué una lata puede rodar y también quedarse parada?', 'Why can a can roll and also stand up?')]),
        T('¿Por qué una pelota rueda para cualquier lado?', 'Why does a ball roll any way?'),
        r.pick([T('¿Por qué un dado no rueda por el túnel?', 'Why does a die not roll down the tunnel?'), T('¿Por qué una caja no rueda por el túnel?', 'Why does a box not roll down the tunnel?')]),
      ];
      const explanations = [
        T('Si se acuesta, rueda por la parte curva. Si se para, se apoya en una base plana.', 'Lying down, it rolls on the curved part. Standing up, it rests on a flat base.'),
        T('La pelota es toda curva: siempre puede rodar.', 'A ball is curved all over: it can always roll.'),
        T('Se apoya en una cara plana y se queda quieto.', 'It rests on a flat face and stays still.'),
      ];
      return choose(r, prompts[form], options[form], options.filter((_, i) => i !== form), explanations[form],
        T('Tocá el objeto. Buscá partes curvas y partes planas.', 'Touch the object. Look for curved parts and flat parts.'),
        { reward: T('Todo baja bien atado. ¡Salen del túnel!', 'Everything goes down tied safely. Out of the tunnel!') });
    },
  ],
  'G02-09-L03': [
    r => {
      const shapes = [
        { riddle: T('Soy plana. Tengo 3 lados rectos y 3 vértices.', 'I am flat. I have 3 straight sides and 3 vertices.'), name: T('El triángulo', 'The triangle'), gate: T('triangular', 'triangle') },
        { riddle: T('Soy plana. Tengo 4 lados iguales y 4 vértices.', 'I am flat. I have 4 equal sides and 4 vertices.'), name: T('El cuadrado', 'The square'), gate: T('cuadrado', 'square') },
        { riddle: T('Soy plana y redonda. No tengo vértices.', 'I am flat and round. I have no vertices.'), name: T('El círculo', 'The circle'), gate: T('redondo', 'round') },
      ];
      const pick = r.int(0, 2), shape = shapes[pick];
      return choose(r,
        T(`Adivinanza: «${shape.riddle['es-AR']}» ¿Qué portón es?`, `Riddle: “${shape.riddle['en-US']}” Which gate is it?`),
        shape.name, shapes.filter((_, i) => i !== pick).map(s => s.name),
        T(`Las pistas describen ${shape.name['es-AR'].toLowerCase()}.`, `The clues describe ${shape.name['en-US'].toLowerCase()}.`),
        T('Leé cada pista. Contá lados y vértices en cada figura.', 'Read each clue. Count the sides and vertices of each shape.'),
        { reward: T(`¡El portón ${shape.gate['es-AR']} aparece!`, `The ${shape.gate['en-US']} gate appears!`) });
    },
    r => {
      const form = r.int(0, 2);
      const cases = [
        { clue: T('Puedo rodar', 'I can roll'), a: T('una pelota', 'a ball'), b: T('un tronco', 'a log'), answer: 0 },
        { clue: T('No tengo partes planas', 'I have no flat parts'), a: T('una pelota', 'a ball'), b: T('un tronco', 'a log'), answer: 1 },
        { clue: T('Tengo caras planas', 'I have flat faces'), a: T('un dado', 'a die'), b: T('una caja', 'a box'), answer: 0 },
      ][form];
      const options = [T('No, los dos lo cumplen', 'No, both fit it'), T(`Sí, solo ${cases.a['es-AR']} lo cumple`, `Yes, only ${cases.a['en-US']} fits it`), T(`Sí, solo ${cases.b['es-AR']} lo cumple`, `Yes, only ${cases.b['en-US']} fits it`)];
      return choose(r,
        T(`Pista: «${cases.clue['es-AR']}». ¿Alcanza para saber si es ${cases.a['es-AR']} o ${cases.b['es-AR']}?`, `Clue: “${cases.clue['en-US']}.” Is it enough to tell ${cases.a['en-US']} from ${cases.b['en-US']}?`),
        options[cases.answer], options.filter((_, i) => i !== cases.answer),
        cases.answer === 0 ? T('Los dos cumplen la pista: hace falta otra.', 'Both fit the clue: another one is needed.') : T('El tronco tiene bases planas; la pelota no.', 'A log has flat bases; a ball does not.'),
        T(`Probá la pista con ${cases.a['es-AR']} y después con ${cases.b['es-AR']}.`, `Try the clue with ${cases.a['en-US']} and then with ${cases.b['en-US']}.`));
    },
  ],
  'G02-10-L01': [
    r => {
      const safe = r.int(0, 1) === 0;
      const correct = r.pick(safe ? SAFE : BLOCKED), wrong = r.shuffle(safe ? BLOCKED : SAFE).slice(0, 2);
      const label = (path: string) => T(path, path);
      return choose(r,
        safe ? T('Desde ★, ¿qué camino esquiva el árbol y llega hasta Teo?', 'From ★, which path avoids the tree and reaches Teo?') : T('Mora dice que un camino choca con el árbol. ¿Cuál es?', 'Mora says one path hits the tree. Which one?'),
        label(correct), wrong.map(label),
        safe ? T(`${correct} va por el borde. Los otros pasan por el centro, donde está el árbol.`, `${correct} goes along the edge. The others go through the middle, where the tree is.`) : T(`${correct} pasa por el centro, donde está el árbol.`, `${correct} goes through the middle, where the tree is.`),
        T('Poné el dedo en ★. Seguí cada camino y fijate si pisa ■.', 'Put your finger on ★. Follow each path and check whether it lands on ■.'));
    },
    r => {
      const meanings = [
        { symbol: '■', text: T('Un árbol caído: no se pasa', 'A fallen tree: no way through') },
        { symbol: '★', text: T('El lugar donde estamos', 'The place where we are') },
        { symbol: '🦌', text: T('Teo, adonde queremos llegar', 'Teo, where we want to go') },
      ];
      const ask = r.int(0, 2);
      return choose(r,
        T(`Mirá la clave del plano. ¿Qué significa ${meanings[ask].symbol}?`, `Look at the map’s key. What does ${meanings[ask].symbol} mean?`),
        meanings[ask].text, meanings.filter((_, i) => i !== ask).map(m => m.text),
        T('La clave dice dónde estamos, dónde está Teo y qué está bloqueado.', 'The key tells where we are, where Teo is, and what is blocked.'),
        T('Buscá cada símbolo en la clave antes de elegir.', 'Find each symbol in the key before choosing.'));
    },
  ],
  'G02-10-L02': [
    r => {
      const right = r.int(1, 3), up = r.int(1, 2);
      const path = r.shuffle([...Array(right).fill('→'), ...Array(up).fill('↑')]).join(' ');
      return typed(
        T(`Ramón prueba este camino: ${path}. ¿Cuántos pasos tiene?`, `Ramón tries this path: ${path}. How many steps does it have?`),
        right + up,
        T(`${right} a la derecha y ${up} hacia arriba: ${right + up} pasos.`, `${right} right and ${up} up: ${right + up} steps.`),
        T('Contá las flechas una por una. Cada flecha es un paso.', 'Count the arrows one by one. Each arrow is one step.'),
        { unit: T('pasos', 'steps') },
      );
    },
    r => {
      const arrive = r.int(0, 1) === 0;
      const a = r.shuffle(['→', '→', '→', '↑', '↑']).join(' '), b = r.shuffle(['→', '→', '→', '↑', '↑']).join(' ');
      const short = r.shuffle(['→', '→', '↑', '↑']).join(' ');
      const options = [T('Sí, los dos llegan a 🏁', 'Yes, both reach 🏁'), T('No, ese camino no llega a 🏁', 'No, that path does not reach 🏁'), T('Solo si es el camino más corto', 'Only if it is the shortest path')];
      return choose(r,
        arrive ? T(`Desde ★, un camino es ${a} y otro es ${a === b ? '↑ ↑ → → →' : b}. ¿Pueden ser correctos los dos?`, `From ★, one path is ${a} and another is ${a === b ? '↑ ↑ → → →' : b}. Can both be correct?`)
          : T(`Desde ★, Ramón sigue ${short}. ¿Es un camino correcto hasta 🏁?`, `From ★, Ramón follows ${short}. Is it a correct path to 🏁?`),
        options[arrive ? 0 : 1], options.filter((_, i) => i !== (arrive ? 0 : 1)),
        arrive ? T('Los dos hacen 3 pasos a la derecha y 2 hacia arriba: llegan a 🏁.', 'Both make 3 steps right and 2 up: they reach 🏁.') : T('Le falta un paso a la derecha: no llega a 🏁.', 'It is one step right short: it does not reach 🏁.'),
        T('Seguí cada camino con el dedo desde ★. ¿Dónde termina?', 'Follow each path with your finger from ★. Where does it end?'));
    },
  ],
  'G02-11-L01': [
    r => {
      const from = r.int(1, 6), to = from + r.int(3, 8);
      return typed(
        T(`El hueco va del ${from} al ${to} de la regla. ¿Cuánto mide la tabla?`, `The gap goes from ${from} to ${to} on the ruler. How long is the board?`),
        to - from,
        T(`${to} − ${from} = ${to - from}. Hay ${to - from} espacios de 1 cm.`, `${to} − ${from} = ${to - from}. There are ${to - from} spaces of 1 cm.`),
        T(`Empezá en la rayita ${from}. Contá los espacios hasta llegar a ${to}.`, `Start at mark ${from}. Count the spaces until you reach ${to}.`),
        { unit: T('cm', 'cm') },
      );
    },
    r => {
      if (r.int(0, 1) === 0) return choose(r,
        T('¿Por qué se empieza a medir desde el 0?', 'Why do we start measuring from 0?'),
        T('Desde ahí empiezan los centímetros', 'That is where the centimeters start'),
        [T('Porque el borde siempre es 0', 'Because the edge is always 0'), T('Para que la tabla dé más corta', 'So the board comes out shorter')],
        T('El borde de la regla puede estar antes del 0.', 'The edge of the ruler may come before the 0.'),
        T('Buscá el 0 en una regla de verdad. ¿Está justo en el borde?', 'Find the 0 on a real ruler. Is it right at the edge?'));
      const end = r.int(5, 12);
      return chooseNumber(r,
        T(`Tuco puso la tabla desde el 1 y llegó al ${end}. ¿Cuánto mide de verdad?`, `Tuco put the board from 1 and reached ${end}. How long is it really?`),
        end - 1, [end, end + 1],
        T(`Del 1 al ${end} hay ${end - 1} espacios de 1 cm.`, `From 1 to ${end} there are ${end - 1} spaces of 1 cm.`),
        T(`Contá los espacios entre el 1 y el ${end}, no las rayitas.`, `Count the spaces between 1 and ${end}, not the marks.`), { unit: ['cm', 'cm'] });
    },
  ],
};
