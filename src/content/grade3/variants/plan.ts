// Chapter 6 — The house plan (G03-09, G03-10): views, landmarks, keys, routes
// on the plan shown above the challenges, families of shapes, parts of solids,
// and complete descriptions. Each version changes which option is right.
import type { LocalizedText } from '../../../math/core/types';
import { T, choose, typed, L, oneOf, type Generator, type Rng } from './kit';

// Plans shown on the page for these lessons (lesson.scene.items in space.ts).
// G03-09-L01: ['🛏 □ 🗄','□ □ □','🚪 □ 🪑']; G03-09-L03: ['□ □ □ M','□ ■ ■ □','★ □ □ □'].
const BED = L('La cama 🛏|The bed 🛏'), WARDROBE = L('El placard 🗄|The wardrobe 🗄'), TABLE = L('La mesa 🪑|The table 🪑');

// Sofa route: columns 0–3 from the left, rows 0–2 from the top. ★ (0,2), M (3,0), ■ (1,1) and (2,1).
type Move = 'R' | 'U';
const START = [0, 2], GOAL = [3, 0];
const isPaint = (c: number, r: number) => r === 1 && (c === 1 || c === 2);
const ROUTES_OK: Move[][] = [['R', 'R', 'R', 'U', 'U'], ['U', 'U', 'R', 'R', 'R']];
function walk(route: Move[]) {
  let [c, r] = START, paintStep = 0;
  route.forEach((m, i) => {
    if (m === 'R') c++; else r--;
    if (!paintStep && isPaint(c, r)) paintStep = i + 1;
  });
  return { paintStep, arrives: c === GOAL[0] && r === GOAL[1] };
}
const ROUTES_PAINT: Move[][] = [];
for (let mask = 0; mask < 32; mask++) {
  const route = [0, 1, 2, 3, 4].map(i => (mask >> i & 1 ? 'U' : 'R') as Move);
  if (route.filter(m => m === 'U').length === 2 && walk(route).paintStep) ROUTES_PAINT.push(route);
}
const ROUTES_SHORT: Move[][] = [['R', 'R', 'R', 'U'], ['U', 'U', 'R', 'R'], ['R', 'R', 'R'], ['U', 'U', 'R']];
const say = (route: Move[]) => T(route.map(m => (m === 'R' ? 'derecha' : 'arriba')).join(', '), route.map(m => (m === 'R' ? 'right' : 'up')).join(', '));

type RouteKind = 'ok' | 'paint' | 'short';
function pickRoute(r: Rng, kind: RouteKind): Move[] {
  return r.pick(kind === 'ok' ? ROUTES_OK : kind === 'paint' ? ROUTES_PAINT : ROUTES_SHORT);
}
function routeKind(route: Move[]): RouteKind {
  const w = walk(route);
  return w.paintStep ? 'paint' : w.arrives ? 'ok' : 'short';
}

export const plan: Record<string, [Generator, Generator]> = {
  'G03-09-L01': [
    r => {
      const ABOVE = L('Desde arriba|From above'), FRONT = L('De frente, desde la vereda|From the front, from the pavement'), SIDE = L('Desde el costado|From the side');
      const hint = L('Pensá qué hay que ver: dónde está cada cosa, la puerta y las ventanas, o la forma del techo.|Think about what must be seen: where everything is, the door and windows, or the shape of the roof.');
      return oneOf(r, [
        () => choose(r, r.pick([L('Los fleteros quieren saber dónde va cada mueble en todas las habitaciones. ¿Desde dónde miramos la casa para dibujarlo?|The movers want to know where each piece of furniture goes in every room. Where do we look at the house from to draw it?'), L('El plano tiene que mostrar todas las habitaciones a la vez. ¿Desde dónde miramos la casa?|The plan must show every room at once. Where do we look at the house from?')]),
          ABOVE, [FRONT, SIDE], L('Desde arriba se ven todas las habitaciones y dónde está cada cosa.|From above you can see every room and where each thing is.'), hint),
        () => choose(r, r.pick([L('Rosa quiere mostrar la puerta y las ventanas tal como se ven desde la calle. ¿Desde dónde miramos la casa?|Rosa wants to show the door and windows as they look from the street. Where do we look at the house from?'), L('La abuela Tita quiere un dibujo de la fachada para la invitación. ¿Desde dónde miramos la casa?|Abuela Tita wants a drawing of the house front for the invitation. Where do we look at the house from?')]),
          FRONT, [ABOVE, SIDE], L('De frente se ven la puerta y las ventanas de la fachada.|From the front you see the door and windows of the house front.'), hint),
        () => choose(r, L('El carpintero quiere ver el triángulo que forma el techo a dos aguas. ¿Desde dónde miramos la casa?|The carpenter wants to see the triangle that the sloping roof makes. Where do we look at the house from?'),
          SIDE, [ABOVE, FRONT], L('De costado se ve el triángulo del techo de dos aguas.|From the side you see the triangle of the sloping roof.'), hint),
      ]);
    },
    r => {
      const hint = L('Poné el dedo en la puerta 🚪 del plano y movelo como dice la pregunta.|Put your finger on the door 🚪 on the plan and move it as the question says.');
      const reward = L('Los fleteros pueden leer el plano.|The movers can read the plan.');
      return oneOf(r, [
        () => choose(r, L('Un fletero entra por la puerta 🚪 y sigue derecho por la misma fila del plano. ¿Qué mueble encuentra al final?|A mover comes in at the door 🚪 and goes straight along the same row of the plan. Which piece of furniture is at the end?'),
          TABLE, [BED, WARDROBE], L('La mesa 🪑 está en la fila de la puerta, en la otra punta.|The table 🪑 is in the door’s row, at the other end.'), hint, { reward }),
        () => choose(r, L('Desde la puerta 🚪, un fletero sube por la misma columna del plano. ¿Qué mueble encuentra?|From the door 🚪, a mover goes up the same column of the plan. Which piece of furniture does he find?'),
          BED, [TABLE, WARDROBE], L('La cama 🛏 está arriba de la puerta, en la misma columna.|The bed 🛏 is above the door, in the same column.'), hint, { reward }),
        () => choose(r, L('¿Qué mueble está en la esquina opuesta a la puerta 🚪, lo más lejos posible?|Which piece of furniture is in the corner opposite the door 🚪, as far away as possible?'),
          WARDROBE, [BED, TABLE], L('El placard 🗄 está arriba a la derecha; la puerta, abajo a la izquierda.|The wardrobe 🗄 is at the top right; the door is at the bottom left.'), hint, { reward }),
      ]);
    },
  ],
  'G03-09-L02': [
    r => {
      const meanings: [string, LocalizedText][] = [
        ['★', L('La puerta del jardín|The garden gate')], ['A', L('Un árbol|A tree')], ['■', L('Una zona cerrada: nadie pasa|A closed area: nobody walks there')], ['□', L('Un lugar libre para pasar|A free square to walk through')],
      ];
      const [symbol, right] = r.pick(meanings);
      const wrong = r.shuffle(meanings.filter(([s]) => s !== symbol).map(([, m]) => m)).slice(0, r.int(2, 3));
      return choose(r,
        T(`En el plano del jardín, la leyenda explica cada símbolo. ¿Qué representa ${symbol}?`, `On the garden plan, the key explains each symbol. What does ${symbol} stand for?`),
        right, wrong,
        T(`La leyenda dice qué es ${symbol}: ${right['es-AR'].toLowerCase()}.`, `The key says what ${symbol} is: ${right['en-US'].toLowerCase()}.`),
        T(`Buscá ${symbol} en la leyenda que está al lado del plano.`, `Find ${symbol} in the key next to the plan.`));
    },
    r => {
      const SHAPES = L('Usar formas distintas, no solo colores|Use different shapes, not only colours');
      const SAME = L('Usar el mismo símbolo para lo mismo en todo el plano|Use the same symbol for the same thing all over the plan');
      const KEY = L('Agregar el símbolo a la leyenda|Add the symbol to the key');
      const MORE = L('Pintar el plano con más colores|Paint the plan with more colours');
      const hint = L('Imaginá que otra persona lee el plano impreso, sin que nadie se lo explique.|Imagine someone else reading the printed plan, with nobody explaining it.');
      return oneOf(r, [
        () => choose(r, L('La abuela Tita imprime el plano en blanco y negro. Rosa marcó la pintura fresca con ■ rojo y las macetas con ■ verde. ¿Qué conviene hacer?|Abuela Tita prints the plan in black and white. Rosa marked the wet paint with a red ■ and the plant pots with a green ■. What should be done?'),
          SHAPES, [SAME, KEY, MORE], L('Sin color, los dos ■ se ven iguales. Con formas distintas, el plano se lee igual.|Without colour, both ■ look the same. With different shapes, the plan reads the same.'), hint),
        () => choose(r, L('En la leyenda, ■ es zona cerrada. Átomo dibujó otra zona cerrada con ●. ¿Qué conviene hacer?|In the key, ■ is a closed area. Átomo drew another closed area with ●. What should be done?'),
          SAME, [SHAPES, KEY, MORE], L('Una misma cosa lleva siempre el mismo símbolo; si no, el plano confunde.|The same thing always gets the same symbol; otherwise the plan is confusing.'), hint),
        () => choose(r, L('Átomo dibujó ▲ para marcar la canilla del jardín, pero ▲ no está en la leyenda. ¿Qué conviene hacer?|Átomo drew ▲ to mark the garden tap, but ▲ is not in the key. What should be done?'),
          KEY, [SHAPES, SAME, MORE], L('Si ▲ no está en la leyenda, nadie sabe qué significa.|If ▲ is not in the key, nobody knows what it means.'), hint),
      ]);
    },
  ],
  'G03-09-L03': [
    r => {
      const kind = r.pick(['ok', 'paint', 'short'] as const), route = pickRoute(r, kind), w = walk(route);
      const OK = L('Sí: llega a M sin pisar ■|Yes: it reaches M without stepping on ■');
      const PAINT = L('No: pasa por la pintura fresca|No: it goes through the wet paint');
      const SHORT = L('No: no llega a M|No: it does not reach M');
      const right = kind === 'ok' ? OK : kind === 'paint' ? PAINT : SHORT;
      const steps = say(route);
      return choose(r,
        T(`Desde ★: ${steps['es-AR']}. ¿Sirve este camino para el sillón?`, `From ★: ${steps['en-US']}. Does this route work for the sofa?`),
        right, [OK, PAINT, SHORT].filter(o => o !== right),
        kind === 'ok' ? T('Cada paso pisa casillas libres y el último llega a M.', 'Every step lands on a free square and the last one reaches M.')
          : kind === 'paint' ? T(`El paso ${w.paintStep} entra en ■: pisa la pintura.`, `Step ${w.paintStep} goes into ■: it steps on the paint.`)
            : T(`Son ${route.length} pasos y el último no queda en M.`, `It is ${route.length} steps and the last one does not end on M.`),
        T('Poné el dedo en ★. Seguí los pasos de la pregunta y mirá cada casilla.', 'Put your finger on ★. Follow the steps in the question and look at every square.'));
    },
    r => {
      const kinds = [r.pick(['ok', 'paint', 'short'] as const), r.pick(['ok', 'paint', 'short'] as const)];
      const atomo = pickRoute(r, kinds[0]);
      let rosa = pickRoute(r, kinds[1]);
      while (rosa.join() === atomo.join()) rosa = pickRoute(r, kinds[1]);
      const a = routeKind(atomo) === 'ok', b = routeKind(rosa) === 'ok';
      const BOTH = L('Los dos: llegan a M sin pisar ■|Both: they reach M without stepping on ■');
      const ATOMO = L('Solo Átomo|Only Átomo'), ROSA = L('Solo Rosa|Only Rosa'), NONE = L('Ninguno de los dos|Neither of them');
      const right = a && b ? BOTH : a ? ATOMO : b ? ROSA : NONE;
      const sa = say(atomo), sb = say(rosa);
      return choose(r,
        T(`Camino de Átomo: ${sa['es-AR']}. Camino de Rosa: ${sb['es-AR']}. ¿Qué camino sirve para el sillón?`, `Átomo’s route: ${sa['en-US']}. Rosa’s route: ${sb['en-US']}. Which route works for the sofa?`),
        right, [BOTH, ATOMO, ROSA, NONE].filter(o => o !== right),
        T('Un camino está bien si llega a M sin pisar ■ y sin diagonales. Puede haber más de uno.', 'A route is right if it reaches M without stepping on ■ and without diagonals. There can be more than one.'),
        T('Probá el camino de Átomo y el de Rosa por separado, casilla por casilla.', 'Try Átomo’s route and Rosa’s route separately, square by square.'));
    },
  ],
  'G03-10-L01': [
    r => {
      const YES = L('Sí: tiene cuatro ángulos rectos|Yes: it has four right angles');
      const NOT_RIGHT = L('No: sus ángulos no son rectos|No: its angles are not right angles');
      const THREE = L('No: tiene tres lados|No: it has three sides');
      const FAMILY = L('No: una figura no puede estar en dos familias|No: a shape cannot be in two families');
      const shape = r.pick([
        { es: 'cuadrada', en: 'square', right: YES, why: L('Un cuadrado tiene cuatro ángulos rectos y además lados iguales.|A square has four right angles and equal sides too.') },
        { es: 'larga y angosta, con esquinas rectas', en: 'long and narrow, with square corners', right: YES, why: L('Cuatro ángulos rectos: es un rectángulo.|Four right angles: it is a rectangle.') },
        { es: 'en forma de rombo ◇, con lados iguales', en: 'shaped like a rhombus ◇, with equal sides', right: NOT_RIGHT, why: L('El rombo tiene cuatro lados, pero sus esquinas no son rectas.|The rhombus has four sides, but its corners are not square.') },
        { es: 'triangular del altillo', en: 'triangular attic', right: THREE, why: L('Un triángulo tiene tres lados; un rectángulo necesita cuatro.|A triangle has three sides; a rectangle needs four.') },
      ]);
      return choose(r,
        T(`El carpintero hace la lista de ventanas rectangulares. ¿Puede ir en esa lista la ventana ${shape.es}?`, `The carpenter lists the rectangular windows. Can the ${shape.en} window go on that list?`),
        shape.right, [YES, NOT_RIGHT, THREE, FAMILY].filter(o => o !== shape.right),
        shape.why,
        L('Compará las esquinas de la ventana con la esquina de una hoja. Contá sus lados.|Compare the window’s corners with the corner of a sheet of paper. Count its sides.'),
        { reward: L('Los marcos se encargan juntos.|The frames are ordered together.') });
    },
    r => {
      const shape = r.pick([{ es: 'triangular', en: 'triangular', n: 3 }, { es: 'cuadrada', en: 'square', n: 4 }, { es: 'rectangular', en: 'rectangular', n: 4 }]);
      const sides = r.int(0, 1) === 0;
      const word = sides ? ['lados', 'sides'] : ['vértices', 'vertices'];
      return choose(r,
        T(`La ventana ${shape.es} se coloca girada. ¿Cuántos ${word[0]} tiene ahora?`, `The ${shape.en} window is fitted turned around. How many ${word[1]} does it have now?`),
        T(`${shape.n}, como antes`, `${shape.n}, as before`),
        [T(`${shape.n + 1}: al girarla aparece uno más`, `${shape.n + 1}: turning it adds one`), T('Depende de cuánto se gire', 'It depends on how much it is turned')],
        T(`Girar una figura no cambia sus lados ni sus vértices: sigue teniendo ${shape.n}.`, `Turning a shape does not change its sides or vertices: it still has ${shape.n}.`),
        T(`Girá una hoja con la ventana dibujada. Contá sus ${word[0]} otra vez.`, `Turn a sheet with the window drawn on it. Count its ${word[1]} again.`),
        { reward: L('La ventana ya está puesta.|The window is in.') });
    },
  ],
  'G03-10-L02': [
    r => {
      const solid = r.pick([
        { es: 'una caja (prisma rectangular)', en: 'a box (rectangular prism)', faces: 6, edges: 12, vertices: 8 },
        { es: 'la cucha de Canela, con techo de pirámide de base cuadrada', en: 'the top of Canela’s dog house, a pyramid with a square base', faces: 5, edges: 8, vertices: 5 },
        { es: 'una carpa con forma de prisma triangular', en: 'a tent shaped like a triangular prism', faces: 5, edges: 9, vertices: 6 },
      ]);
      const part = r.pick(['vertices', 'faces', 'edges'] as const);
      const n = solid[part];
      const what = { vertices: ['un esquinero en cada vértice', 'a corner protector on every vertex', 'esquineros', 'protectors'], faces: ['una etiqueta en cada cara', 'a label on every face', 'etiquetas', 'labels'], edges: ['una cinta en cada arista', 'a strip of tape on every edge', 'cintas', 'strips'] }[part];
      return typed(
        T(`Átomo pone ${what[0]} de ${solid.es}. ¿Cuántos ${what[2]} necesita?`, `Átomo puts ${what[1]} of ${solid.en}. How many ${what[3]} does he need?`),
        n,
        T(`Hacen falta ${n}: tiene ${solid.faces} caras, ${solid.edges} aristas y ${solid.vertices} vértices.`, `${n} are needed: it has ${solid.faces} faces, ${solid.edges} edges, and ${solid.vertices} vertices.`),
        T('Marcá cada uno una sola vez, también los de atrás y los de abajo.', 'Mark each one only once, including the ones at the back and underneath.'),
        { unit: T(what[2], what[3]), reward: T(`Átomo tiene sus ${n} ${what[2]} listos.`, `Átomo has his ${n} ${what[3]} ready.`) },
      );
    },
    r => {
      const solid = r.pick([
        { es: 'una caja', en: 'a box', total: 6, seen: 3 },
        { es: 'la cucha con techo de pirámide de base cuadrada', en: 'the pyramid-shaped dog-house top with a square base', total: 5, seen: 2 },
        { es: 'una carpa con forma de prisma triangular', en: 'a tent shaped like a triangular prism', total: 5, seen: 2 },
      ]);
      return choose(r,
        T(`Hay que poner una etiqueta en cada cara de ${solid.es}. Desde un lado, Átomo ve ${solid.seen} caras. ¿Cuántas etiquetas hacen falta?`, `A label goes on every face of ${solid.en}. From one side, Átomo sees ${solid.seen} faces. How many labels are needed?`),
        T(`${solid.total}: también cuentan las caras de atrás y de abajo`, `${solid.total}: the faces at the back and underneath count too`),
        [T(`${solid.seen}: solo las caras que se ven`, `${solid.seen}: only the faces you can see`), T(`${solid.total + 2}: al girarla aparecen caras nuevas`, `${solid.total + 2}: turning it makes new faces appear`)],
        T(`Tiene ${solid.total} caras, aunque desde un lado solo se vean ${solid.seen}.`, `It has ${solid.total} faces, even if you can only see ${solid.seen} from one side.`),
        L('Girá el cuerpo en tu cabeza. ¿Aparecen caras que antes no veías?|Turn the solid in your head. Do faces appear that you could not see before?'),
        { reward: L('Todas las caras tienen su etiqueta.|Every face has its label.') });
    },
  ],
  'G03-10-L03': [
    r => {
      const WIDTH = L('La medida del ancho|The width'), LENGTH = L('La medida del largo|The length'), NOTHING = L('No falta nada: alcanza con eso|Nothing is missing: that is enough'), COLOUR = L('El color del lápiz|The colour of the pencil');
      const a = r.int(2, 9);
      const order = r.pick([
        { text: T(`«un rectángulo de ${a} cm de largo»`, `“a rectangle ${a} cm long”`), right: WIDTH, why: T('Un rectángulo necesita el largo y el ancho.', 'A rectangle needs its length and its width.') },
        { text: T(`«un rectángulo de ${a} cm de ancho»`, `“a rectangle ${a} cm wide”`), right: LENGTH, why: T('Un rectángulo necesita el largo y el ancho.', 'A rectangle needs its length and its width.') },
        { text: T(`«un cuadrado de ${a} cm de lado»`, `“a square with ${a} cm sides”`), right: NOTHING, why: T(`En un cuadrado los cuatro lados miden lo mismo: todos ${a} cm.`, `In a square all four sides are equal: all ${a} cm.`) },
      ]);
      return choose(r,
        T(`El pedido de la chapita del buzón dice: ${order.text['es-AR']}. ¿Qué dato falta para saber su tamaño?`, `The order for the mailbox plate says: ${order.text['en-US']}. What is missing to know its size?`),
        order.right, [WIDTH, LENGTH, NOTHING, COLOUR].filter(o => o !== order.right).slice(0, 3),
        order.why,
        L('Dibujá dos chapitas distintas que cumplan el pedido. ¿Se puede?|Draw two different plates that match the order. Is it possible?'),
        { reward: L('El carpintero ya puede cortar la chapita.|The carpenter can now cut the plate.') });
    },
    r => {
      const long = r.int(4, 9), wide = r.int(2, long - 1);
      const OK = L('Sí: girarla no cambia sus lados ni sus ángulos|Yes: turning it does not change its sides or angles');
      const SIDE = L('No: un lado no mide lo pedido|No: one side is not the size ordered');
      const ANGLE = L('No: sus ángulos no son rectos|No: its angles are not right angles');
      const FLAT = L('No: tiene que llegar acostada|No: it must arrive lying flat');
      const c = r.pick([
        { text: T(`Llega parada, con ${long} cm por ${wide} cm y esquinas rectas.`, `It arrives standing up, ${long} cm by ${wide} cm with square corners.`), right: OK, why: T('Girar la chapita no cambia sus lados ni sus ángulos.', 'Turning the plate does not change its sides or angles.') },
        { text: T(`Llega acostada, con ${long} cm por ${wide + 1} cm y esquinas rectas.`, `It arrives lying flat, ${long} cm by ${wide + 1} cm with square corners.`), right: SIDE, why: T(`El ancho pedido es ${wide} cm, no ${wide + 1} cm.`, `The width ordered is ${wide} cm, not ${wide + 1} cm.`) },
        { text: T(`Llega acostada, con lados de ${long} cm y ${wide} cm, pero inclinada como un rombo.`, `It arrives lying flat, with sides of ${long} cm and ${wide} cm, but slanted like a rhombus.`), right: ANGLE, why: T('Un rectángulo necesita cuatro ángulos rectos.', 'A rectangle needs four right angles.') },
      ]);
      return choose(r,
        T(`El pedido: un rectángulo de ${long} cm por ${wide} cm. ${c.text['es-AR']} ¿Cumple el pedido?`, `The order: a rectangle ${long} cm by ${wide} cm. ${c.text['en-US']} Does it match the order?`),
        c.right, [OK, SIDE, ANGLE, FLAT].filter(o => o !== c.right).slice(0, 3),
        c.why,
        L('Revisá los lados, los ángulos y la posición. ¿Cuál de esas cosas pidió el pedido?|Check the sides, the angles, and the position. Which of those did the order ask for?'));
    },
  ],
};
