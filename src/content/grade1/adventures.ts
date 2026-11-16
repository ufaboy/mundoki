import { text } from './model';
import type { LocalizedText } from '../../math/core/types';

export type AdventureSceneKind = 'groups' | 'tens' | 'track' | 'cards' | 'people' | 'route' | 'shapes' | 'solids' | 'lengths' | 'measure' | 'plant' | 'calendar' | 'sorting' | 'votes';
export interface AdventureRow { label: LocalizedText; items: LocalizedText[] }
export interface AdventureTrack {
  /** Index of the item the marker starts on. */
  start: number;
  /** Index the marker reaches when the challenge is solved. */
  target: number;
  direction: 1 | -1;
  /** What one move is called on the button: turning a page, a step, or a day. */
  unit?: 'page' | 'step' | 'day';
}
export interface AdventureStep {
  introduction: LocalizedText;
  kind: AdventureSceneKind;
  rows: AdventureRow[];
  reward: LocalizedText;
  symbol: string;
  /** Alternate arrangement preserves quantities unless the caption explicitly describes a change. */
  after?: AdventureRow[];
  /** The alternate arrangement is the same objects spread far apart (conservation scenes). */
  spread?: boolean;
  /** Track scenes: where the marker starts, where it ends, and which way it moves. */
  track?: AdventureTrack;
  /** Route maps: start and goal cells of the 3 × 3 map. */
  route?: { start: number; goal: number };
}
export interface GradeOneAdventure {
  id: string;
  title: LocalizedText;
  place: 'home' | 'yard' | 'playground' | 'garden' | 'return';
  /** What the hero wants in this mission; shown before the first challenge. */
  intro?: LocalizedText;
  steps: [AdventureStep, AdventureStep];
}
const localized = (s: string) => s.includes('|') ? text(s) : text(`${s}|${s}`);
const row = (label: string, items: string[]): AdventureRow => ({ label: localized(label), items: items.map(localized) });
const copies = (n: number, item = '●') => Array.from({ length: n }, () => item);
type StepOptions = Pick<AdventureStep, 'spread' | 'track' | 'route'>;
const step = (introduction: string, kind: AdventureSceneKind, rows: AdventureRow[], reward: string, symbol: string, after?: AdventureRow[], options: StepOptions = {}): AdventureStep => ({ introduction: text(introduction), kind, rows, reward: text(reward), symbol, after, ...options });
const adventure = (id: string, title: string, place: GradeOneAdventure['place'], a: AdventureStep, b: AdventureStep, intro?: string): GradeOneAdventure => ({ id, title: text(title), place, steps: [a, b], ...(intro ? { intro: text(intro) } : {}) });
const TOYS = ['🚗', '🧸', '⚽', '🤖', '⛵'];
const FRIENDS = ['Ana', 'Leo', 'Sol', 'Paz', 'Teo'];
/** 3 × 3 map, top row first: the house is bottom left, the garden top right. */
const GARDEN_MAP = ['□', '□', '🌳', '□', '□', '□', '🏠', '□', '□'];
const VOTES = [row('Círculo|Circle', copies(3, '○')), row('Triángulo|Triangle', copies(5, '△'))];

// Each step is the story moment of the lesson's check with the same index:
// the step sets the scene, the check asks the question, the reward shows what
// the answer made possible. Rewrite a step and its check together (see
// .agents/skills/grade-1-lesson-authoring). Lessons 1–9 also carry `intro`.
export const GRADE_ONE_ADVENTURES: GradeOneAdventure[] = [
  adventure('G01-01-L01', 'Los juguetes de la mochila|Toys for the backpack', 'home',
    step('Estos juguetes van a la mochila. Tocá cada uno una vez para contarlo.|These toys go in the backpack. Tap each one once to count it.', 'groups', [row('En el estante|On the shelf', TOYS)], 'La lista de la mochila dice: 5 juguetes.|The backpack list says: 5 toys.', '5'),
    step('{name} contó la pelota dos veces. Volvé a contar y marcá cada juguete.|{name} counted the ball twice. Count again and mark each toy.', 'groups', [row('En el estante|On the shelf', TOYS)], 'Cada juguete tiene su ✓. La lista está bien.|Every toy has its ✓. The list is right.', '✓'),
    'La abuela dice: «Llevamos los juguetes que podamos contar. Así volvemos con todos».|Grandma says: “We take the toys we can count. That way we bring them all back.”'),
  adventure('G01-01-L02', 'El bolsillo para la arena|The sand-toy pocket', 'home',
    step('Mirá solo adentro del bolsillo. Los juguetes de arena esperan afuera.|Look only inside the pocket. The sand toys are waiting outside.', 'groups', [row('Dentro del bolsillo|Inside the pocket', []), row('Afuera|Outside', ['🐚', '⭐', '🦀'])], 'La etiqueta del bolsillo dice 0. ¡Hay que llenarlo!|The pocket label says 0. Time to fill it!', '0'),
    step('{name} guarda los juguetes de arena uno por uno.|{name} puts the sand toys in one by one.', 'groups', [row('Dentro del bolsillo|Inside the pocket', ['🐚', '⭐', '🦀']), row('Afuera|Outside', [])], 'Ahora la etiqueta dice 3. El bolsillo está listo.|Now the label says 3. The pocket is ready.', '3'),
    'El bolsillo de la mochila es para los juguetes de arena. Primero miramos qué hay adentro.|The backpack pocket is for sand toys. First we look at what is inside.'),
  adventure('G01-01-L03', '¡Hagamos lugar!|Let’s make room!', 'home',
    step('Tocá «Separar» y contá los moldes otra vez.|Tap “Spread out” and count the molds again.', 'groups', [row('Moldes juntos|Molds together', copies(4, '⭐'))], '¡{name} alcanza la palita! Los 4 moldes van a la bolsa.|{name} reaches the scoop! The 4 molds go in the bag.', '4', [row('Moldes separados|Molds spread out', copies(4, '⭐'))], { spread: true }),
    step('La fila de moldes es más larga. ¿Por qué sigue habiendo cuatro?|The row of molds is longer. Why are there still four?', 'groups', [row('Moldes separados|Molds spread out', copies(4, '⭐'))], 'La bolsa de arena tiene 4 moldes y la palita.|The sand bag has 4 molds and the scoop.', '⭐'),
    'La palita quedó detrás de los moldes. {name} los separa para alcanzarla.|The scoop is stuck behind the molds. {name} spreads them out to reach it.'),
  adventure('G01-02-L01', 'Crayones para dibujar|Crayons for drawing', 'home',
    step('Tocá cada crayón. Cada punto del dibujo es un crayón.|Tap each crayon. Each dot in the picture is one crayon.', 'groups', [row('Caja de crayones|Crayon box', copies(4, '🖍️')), row('Dibujo|Picture', copies(4))], 'La caja tiene su etiqueta: 4.|The box has its label: 4.', '4'),
    step('La caja grande ya tiene etiqueta: dice 6.|The big box already has a label: it says 6.', 'groups', [row('Caja grande|Big box', copies(6, '🖍️')), row('Etiqueta|Label', ['6'])], 'Las dos cajas tienen etiqueta. ¡Nada se pierde!|Both boxes are labeled. Nothing gets lost!', '🏷️'),
    'Cada caja lleva una etiqueta con su número. Así sabemos si vuelve completa.|Each box gets a label with its number. That way we know if it comes back complete.'),
  adventure('G01-02-L02', 'Figuritas de regalo|Sticker gifts', 'home',
    step('El regalo de Leo: una hoja de diez y siete sueltas. Contá desde diez.|Leo’s gift: one sheet of ten and seven loose ones. Count on from ten.', 'tens', [row('Hoja|Sheet', ['10']), row('Sueltas|Loose', copies(7, '★'))], 'El regalo de Leo dice 17.|Leo’s gift says 17.', '17'),
    step('El regalo de Ana: dos hojas completas.|Ana’s gift: two full sheets.', 'tens', [row('Hojas|Sheets', copies(2, '10')), row('Sueltas: ninguna|Loose: none', [])], 'El regalo de Ana dice 20. ¡Dos regalos listos!|Ana’s gift says 20. Two gifts ready!', '20'),
    '{name} prepara figuritas de regalo para los amigos. Cada regalo lleva su número.|{name} prepares sticker gifts for friends. Each gift gets its number.'),
  adventure('G01-02-L03', 'La caja de figuritas|The sticker box', 'home',
    step('{name} cuenta las hojas de diez en diez y después las sueltas.|{name} counts the sheets by tens, then the loose ones.', 'tens', [row('Hojas|Sheets', copies(5, '10')), row('Sueltas|Loose', copies(2, '★'))], 'La caja recibe su etiqueta: 52.|The box gets its label: 52.', '52'),
    step('La otra caja tiene cuatro hojas y ninguna suelta.|The other box has four sheets and no loose ones.', 'tens', [row('Hojas|Sheets', copies(4, '10')), row('Sueltas: ninguna|Loose: none', [])], '{name} cierra la caja de 40 figuritas.|{name} closes the box of 40 stickers.', '40'),
    'Las figuritas que quedan en casa también llevan etiqueta.|The stickers staying at home get labels too.'),
  adventure('G01-03-L01', '¿Alcanzan los globos?|Enough balloons?', 'home',
    step('Emparejá cada globo con un amigo. ¿Qué fila se termina primero?|Pair each balloon with a friend. Which row runs out first?', 'groups', [row('Globos|Balloons', copies(4, '🎈')), row('Amigos|Friends', copies(7, '🙂'))], 'Faltan globos. {name} infla 3 más.|There are not enough balloons. {name} blows up 3 more.', '🎈'),
    step('Cada amigo lleva un gorro para el sol. Emparejá un gorro con cada amigo.|Each friend wears a sun hat. Pair one hat with each friend.', 'groups', [row('Gorros|Hats', copies(7, '🧢')), row('Amigos|Friends', copies(7, '🙂'))], 'Un gorro para cada amigo. ¡Listos para la plaza!|One hat for each friend. Ready for the park!', '🧢'),
    '{name} lleva un globo para cada amigo que viene a la plaza.|{name} is taking a balloon for each friend coming to the park.'),
  adventure('G01-03-L02', 'La libreta de los amigos|The friends’ notebook', 'home',
    step('Empezá en la página 19. Pasá una página.|Start on page 19. Turn one page.', 'track', [row('Páginas|Pages', ['18', '19', '20', '21'])], '{name} abre la página 20 y encuentra los teléfonos.|{name} opens page 20 and finds the phone numbers.', '☎', undefined, { track: { start: 1, target: 2, direction: 1, unit: 'page' } }),
    step('Ahora buscá a Ana: una página antes de la 7.|Now find Ana: one page before 7.', 'track', [row('Páginas|Pages', ['5', '6', '7', '8'])], '{name} pone una marca en la página 6.|{name} puts a tab on page 6.', '6', undefined, { track: { start: 2, target: 1, direction: -1, unit: 'page' } }),
    '{name} busca los teléfonos de los amigos para invitarlos a la plaza.|{name} looks for the friends’ phone numbers to invite them to the park.'),
  adventure('G01-03-L03', 'Llamamos a los amigos|Calling our friends', 'home',
    step('Mirá los números de las tarjetas. ¿Cuál va primero?|Look at the card numbers. Which comes first?', 'cards', [row('Tarjetas|Cards', ['8', '2', '5'])], '{name} llama en orden: 2, 5, 8.|{name} calls in order: 2, 5, 8.', '☎', [row('En orden|In order', ['2', '5', '8'])]),
    step('Quedan dos tarjetas: 6 y 3.|Two cards are left: 6 and 3.', 'cards', [row('Últimas tarjetas|Last cards', ['6', '3'])], '¡Todos invitados! Nos vemos en la plaza.|Everyone is invited! See you at the park.', '👋', [row('En orden|In order', ['3', '6'])]),
    '{name} llama a los amigos en orden, de la tarjeta menor a la mayor, para no saltear a nadie.|{name} calls friends in order, from the smallest card to the largest, so nobody is skipped.'),
  // Place 2: with the friends (gate of the park).
  adventure('G01-04-L01', '¿Cuántos amigos vinieron?|How many friends came?', 'yard',
    step('Los amigos esperan en la puerta de la plaza. Tocá a cada uno una vez.|The friends wait at the park gate. Tap each one once.', 'people', [row('Esperan en la puerta|Waiting at the gate', FRIENDS)], 'La abuela compra 5 jugos, uno para cada amigo.|Grandma buys 5 juices, one for each friend.', '5'),
    step('Sol y Leo cambian de lugar. Nadie llega y nadie se va.|Sol and Leo swap places. Nobody arrives and nobody leaves.', 'people', [row('Antes|Before', FRIENDS)], 'Siguen siendo 5: alcanzan los 5 jugos.|Still 5: the 5 juices are enough.', '🥤', [row('Después|After', ['Ana', 'Sol', 'Leo', 'Paz', 'Teo'])]),
    '{name} llega a la plaza con la abuela. Los amigos esperan en la puerta.|{name} arrives at the park with Grandma. The friends are waiting at the gate.'),
  adventure('G01-04-L02', 'La bandera del paseo|The walk flag', 'yard',
    step('Contá los lugares desde Ana, a la izquierda.|Count the places from Ana, on the left.', 'people', [row('Fila: empieza en Ana →|Line: starts with Ana →', FRIENDS)], 'Paz lleva la bandera: está en el cuarto lugar.|Paz carries the flag: fourth place.', '🚩'),
    step('Podemos señalar a todos los amigos o solo a Teo, el quinto.|We can point to all the friends or only to Teo, the fifth.', 'people', [row('La fila completa|The whole line', FRIENDS)], 'Saludan los cinco, y Teo, el quinto, cierra la fila. ¡A jugar!|All five wave, and Teo, the fifth, closes the line. Let’s play!', '👋'),
    'La abuela dice: «El amigo del cuarto lugar lleva la bandera del paseo».|Grandma says: “The friend in fourth place carries the walk flag.”'),

  // Place 3: let's play (the park).
  adventure('G01-05-L01', 'Pájaros en la plaza|Birds in the park', 'playground',
    step('Cinco pájaros comen en la plaza. Llega uno más: mirá el cambio.|Five birds are eating in the park. One more arrives: watch the change.', 'groups', [row('Ya estaban|Already here', copies(5, '🐦')), row('Llega|Arriving', ['🐦'])], '{name} pone 6 montoncitos de alpiste, uno por pájaro.|{name} puts down 6 piles of seed, one for each bird.', '6', [row('Ahora juntos|Now together', copies(6, '🐦'))]),
    step('Llegó un pájaro nuevo y no se fue ninguno.|A new bird arrived and none flew away.', 'groups', [row('Antes|Before', copies(5, '🐦')), row('Se suma|Joins them', ['🐦'])], '{name} anota 5 + 1 = 6 en la libreta del día.|{name} writes 5 + 1 = 6 in the day’s notebook.', '+'),
    '{name} trae alpiste para los pájaros: un montoncito para cada uno.|{name} brings bird seed: one little pile for each bird.'),
  adventure('G01-05-L02', 'Una ciudad de arena|A sand town', 'playground',
    step('{name} trae 2 señales en el bolso y Leo trae 5. Las juntan en una ciudad.|{name} brings 2 signs in the bag and Leo brings 5. They put them in one town.', 'groups', [row('Del bolso|From the bag', copies(2, '🚩')), row('De Leo|Leo’s', copies(5, '🚩'))], 'Hacen 7 pozos en la arena, uno por señal.|They dig 7 holes in the sand, one for each sign.', '7', [row('Ciudad|Town', copies(7, '🚩'))]),
    step('Cambiamos el orden de los grupos, sin cambiar las señales.|We swap the order of the groups without changing the signs.', 'cards', [row('Primero el bolso|Bag first', ['2', '+', '5'])], 'El autito recorre la ciudad de 7 señales.|The toy car drives through the town of 7 signs.', '🚗', [row('Primero Leo|Leo first', ['5', '+', '2'])]),
    'La ciudad de arena necesita señales. Cada señal va en un pozo.|The sand town needs signs. Each sign goes in a hole.'),
  adventure('G01-05-L03', 'La rayuela|Hopscotch', 'playground',
    step('Tocá «Avanzar» y contá los saltos, no la salida.|Tap “Move forward” and count the hops, not the start.', 'track', [row('Rayuela|Hopscotch', ['3', '4', '5', '6', '7'])], '{name} llega al 7 y junta la piedrita.|{name} reaches 7 and picks up the pebble.', '7', undefined, { track: { start: 0, target: 4, direction: 1 } }),
    step('Antes de moverse, {name} sigue en la salida.|Before moving, {name} is still at the start.', 'track', [row('Primer salto|First hop', ['3', '4'])], 'Primer salto: del 3 al 4. ¡Ahora sí cuenta!|First hop: from 3 to 4. Now it counts!', '👟', undefined, { track: { start: 0, target: 1, direction: 1 } }),
    'La piedrita cayó en la casilla 7. {name} salta para buscarla.|The pebble landed on square 7. {name} hops to get it.'),
  adventure('G01-06-L01', 'Abrimos la calle|Clear the road', 'playground',
    step('Hay 6 vallas en la calle de juguete. {name} saca 2 para que pase el autito.|There are 6 barriers on the toy road. {name} takes 2 away so the toy car can pass.', 'groups', [row('En la calle|On the road', copies(6, '🚧'))], 'Quedan 4 vallas y el autito pasa por el hueco.|4 barriers are left and the toy car drives through the gap.', '4', [row('Quedan|Left', copies(4, '🚧')), row('Guardadas|Put away', copies(2, '×'))]),
    step('En otra calle había 7 vallas y guardamos 2.|On another road there were 7 barriers and we put 2 away.', 'groups', [row('Quedan|Left', copies(5, '🚧')), row('Guardadas|Put away', copies(2, '×'))], '{name} guarda justo 2 vallas en la caja.|{name} puts exactly 2 barriers in the box.', '📦'),
    'El autito de juguete quiere pasar, pero la calle está llena de vallas.|The toy car wants to pass, but the road is full of barriers.'),
  adventure('G01-06-L02', 'Las figuritas que faltan|The missing stickers', 'playground',
    step('La fila del álbum tiene 7 lugares. {name} tiene 4 figuritas.|The album row has 7 spaces. {name} has 4 stickers.', 'groups', [row('Fila del álbum|Album row', [...copies(4, '★'), ...copies(3, '□')])], 'Sol regala 3 y la fila queda completa.|Sol gives 3 and the row is complete.', '3', [row('Fila completa|Complete row', copies(7, '★'))]),
    step('Sol tiene 9 figuritas y Paz tiene 6. Emparejalas una con una.|Sol has 9 stickers and Paz has 6. Pair them one to one.', 'groups', [row('Sol', copies(9, '★')), row('Paz', copies(6, '★'))], 'Las 3 sin pareja son para cambiar con los amigos.|The 3 without a partner are for swapping with friends.', '★'),
    'En la plaza, los amigos completan el álbum de figuritas.|In the park, the friends fill in the sticker album.'),
  adventure('G01-06-L03', 'Buscamos la pelota|Fetch the ball', 'playground',
    step('{name} está en la baldosa 8. La pelota quedó 2 baldosas atrás.|{name} is on tile 8. The ball is 2 tiles back.', 'track', [row('Baldosas|Tiles', ['6', '7', '8'])], '{name} llega a la 6 y agarra la pelota.|{name} reaches 6 and grabs the ball.', '⚽', undefined, { track: { start: 2, target: 0, direction: -1 } }),
    step('Para comprobar, {name} vuelve 2 baldosas hacia adelante.|To check, {name} moves 2 tiles forward again.', 'track', [row('Baldosas|Tiles', ['6', '7', '8'])], 'Otra vez en la 8: ¡comprobado!|Back on 8: checked!', '✓', undefined, { track: { start: 0, target: 2, direction: 1 } }),
    'La pelota rodó hacia atrás por el caminito de baldosas.|The ball rolled back along the tile path.'),
  adventure('G01-07-L01', 'Dos canastas|Two baskets', 'playground',
    step('{name} reparte 8 pelotitas en dos canastas. No hace falta que sean iguales.|{name} puts 8 balls into two baskets. They do not have to be equal.', 'groups', [row('Pelotitas|Balls', copies(8, '🎾'))], 'Canasta A: 3, canasta B: 5. ¡Entran las 8!|Basket A: 3, basket B: 5. All 8 fit!', '🧺', [row('Canasta A|Basket A', copies(3, '🎾')), row('Canasta B|Basket B', copies(5, '🎾'))]),
    step('En otro juego hay 6 pelotitas: primero 1 y 5, después 2 y 4.|In another game there are 6 balls: first 1 and 5, then 2 and 4.', 'groups', [row('A', ['🎾']), row('B', copies(5, '🎾'))], 'Las partes cambian y no se pierde ninguna pelotita.|The parts change and no ball is lost.', '6', [row('A', copies(2, '🎾')), row('B', copies(4, '🎾'))]),
    'El juego de embocar necesita dos canastas con todas las pelotitas.|The toss game needs two baskets holding all the balls.'),
  adventure('G01-07-L02', 'Llenamos el tablero|Fill the board', 'playground',
    step('El tablero tiene 10 lugares, en dos filas de 5. Hay 6 fichas.|The board has 10 spaces, in two rows of 5. There are 6 counters.', 'groups', [row('Tablero de diez|Ten-board', [...copies(6), ...copies(4, '□')])], 'Con 4 fichas más el tablero está lleno. ¡A jugar!|With 4 more counters the board is full. Let’s play!', '10', [row('Tablero lleno|Full board', copies(10))]),
    step('En otro turno ponen 8 y 2. Probá cambiar el orden.|On another turn they put 8 and 2. Try swapping the order.', 'cards', [row('Dos partes|Two parts', ['8', '+', '2'])], 'El tablero se llena igual con 2 + 8.|The board fills just the same with 2 + 8.', '✓', [row('Las mismas partes|The same parts', ['2', '+', '8'])]),
    'Para jugar al tablero de diez, todos los lugares tienen que estar llenos.|To play the ten-board game, every space must be filled.'),
  adventure('G01-07-L03', 'Llenamos primero la caja|Fill the box first', 'playground',
    step('En la caja de 10 hay 9 fichas y llegan 3. Una completa la caja.|The 10-box has 9 counters and 3 arrive. One fills the box.', 'groups', [row('Caja|Box', [...copies(9), '□']), row('Llegan|Arriving', copies(3))], '10 en la caja y 2 al lado: 12 fichas.|10 in the box and 2 beside it: 12 counters.', '12', [row('Caja llena|Full box', copies(10)), row('Al lado|Beside it', copies(2))]),
    step('Otro turno: 7 + 5. Pasamos 3 de las 5 para llenar la caja.|Another turn: 7 + 5. We move 3 of the 5 to fill the box.', 'groups', [row('Caja|Box', [...copies(7), ...copies(3, '□')]), row('Para sumar|To add', copies(5))], 'Las 2 que sobran van al bolsillo chico.|The 2 left over go in the small pocket.', '2', [row('Caja llena|Full box', copies(10)), row('Quedan de las 5|Left from the 5', copies(2))]),
    'Leo inventa un juego: primero llenamos la caja de 10 y después contamos lo que queda.|Leo invents a game: first fill the 10-box, then count what is left.'),
  adventure('G01-08-L01', 'La guirnalda|The garland', 'playground',
    step('La guirnalda repite círculo, cuadrado. Ayudá a {name} a seguirla.|The garland repeats circle, square. Help {name} continue it.', 'cards', [row('Guirnalda|Garland', ['○', '□', '○', '□', '?'])], '{name} cuelga el círculo que sigue.|{name} hangs the next circle.', '○', [row('Guirnalda|Garland', ['○', '□', '○', '□', '○'])]),
    step('Otra guirnalda tiene un grupo más largo. Buscá el grupo que se repite.|Another garland has a longer group. Find the group that repeats.', 'cards', [row('Otra guirnalda|Another garland', ['△', '△', '○', '△', '△', '○'])], 'Los amigos agregan un grupo entero: △ △ ○.|The friends add a whole group: △ △ ○.', '△', [row('Guirnalda terminada|Finished garland', ['△', '△', '○', '△', '△', '○', '△', '△', '○'])]),
    'La ciudad de arena tiene fiesta: falta terminar la guirnalda.|The sand town is having a party: the garland needs finishing.'),
  adventure('G01-08-L02', 'La rana saltarina|The hopping frog', 'playground',
    step('La rana de juguete salta de 2 en 2. Está en la piedra 8.|The toy frog hops by twos. It is on stone 8.', 'track', [row('Piedras|Stones', ['2', '4', '6', '8', '10'])], 'La rana salta a la piedra 10.|The frog hops to stone 10.', '🐸', undefined, { track: { start: 3, target: 4, direction: 1 } }),
    step('Llega Teo y quiere jugar. {name} le muestra la regla.|Teo arrives and wants to play. {name} shows the rule.', 'cards', [row('Regla: +2|Rule: +2', ['2', '4', '6', '8', '10'])], 'Teo conoce la regla y sigue jugando.|Teo knows the rule and keeps playing.', '+2'),
    'Juegan a la rana: cada salto tiene que seguir la misma regla.|They play frog: every hop must follow the same rule.'),
  adventure('G01-08-L03', '¡A bailar!|Let’s dance!', 'playground',
    step('Los pasos tienen números. El baile repite 1, 2, 3.|The steps have numbers. The dance repeats 1, 2, 3.', 'cards', [row('Regla: repetir 1, 2, 3|Rule: repeat 1, 2, 3', ['1', '2', '3', '?'])], 'Todos vuelven al paso 1 y empieza otra vuelta.|Everyone goes back to step 1 and starts another round.', '♫', [row('Baile|Dance', ['1', '2', '3', '1'])]),
    step('Hay dos ideas. Cada una necesita una regla que explique todos sus pasos.|There are two ideas. Each needs a rule that explains every step.', 'cards', [row('Sumar uno|Add one', ['1', '2', '3', '4', '5']), row('Repetir|Repeat', ['1', '2', '3', '1', '2'])], 'Los amigos eligen una regla y bailan juntos.|The friends choose a rule and dance together.', '💃'),
    'Para terminar en la plaza, los amigos inventan un baile.|To end the park visit, the friends invent a dance.'),

  // Place 4: the garden.
  adventure('G01-09-L01', 'El picnic|The picnic', 'garden',
    step('Miramos la mesa de frente. De izquierda a derecha: libro, vaso y pelota.|We face the table. From left to right: book, cup, and ball.', 'cards', [row('Vista de frente →|Front view →', ['📖', '🥤', '⚽'])], '{name} encuentra el vaso y toma agua.|{name} finds the cup and has a drink.', '🥤'),
    step('{name} y Sol se paran del mismo lado de la mesa para darse indicaciones.|{name} and Sol stand on the same side of the table to give directions.', 'cards', [row('Miramos desde acá →|We look from here →', ['📖', '🥤', '⚽'])], 'Mirando desde el mismo lado, encuentran todo.|Looking from the same side, they find everything.', '👀'),
    'En el jardín hay picnic. La abuela pide el vaso que está en el medio.|There is a picnic in the garden. Grandma asks for the cup in the middle.'),
  adventure('G01-09-L02', 'El camino al jardín|The garden path', 'garden',
    step('{name} y la abuela salen de la casa, abajo a la izquierda. El jardín está arriba a la derecha.|{name} and Grandma leave the house at the bottom left. The garden is at the top right.', 'route', [row('Mapa|Map', GARDEN_MAP)], '{name} llega a la entrada del jardín.|{name} reaches the garden entrance.', '🌳', undefined, { route: { start: 6, goal: 2 } }),
    step('Volvé a la casa y probá otro camino. No hay obstáculos.|Go back to the house and try another route. There are no obstacles.', 'route', [row('El mismo mapa|The same map', GARDEN_MAP)], 'Sol llega por el otro camino. ¡Se encuentran en la entrada!|Sol arrives by the other route. They meet at the entrance!', '👋', undefined, { route: { start: 6, goal: 2 } }),
    'Después del picnic vamos al jardín. Hay que elegir el camino en el mapa.|After the picnic we go to the garden. We must choose the route on the map.'),
  adventure('G01-10-L01', 'Un cartel para el jardín|A sign for the garden', 'garden',
    step('El dibujo de la casa del cartel necesita un techo de 3 lados.|The house on the sign needs a roof with 3 sides.', 'shapes', [row('Piezas|Pieces', ['○', '△', '□', '▭'])], 'El triángulo es el techo del cartel.|The triangle becomes the roof on the sign.', '△'),
    step('{name} gira el cuadrado para decorar. Sus lados y esquinas no cambian.|{name} turns the square to decorate. Its sides and corners do not change.', 'shapes', [row('Cuadrado|Square', ['□'])], 'El cuadrado girado decora el cartel.|The turned square decorates the sign.', '◇', [row('Girado|Turned', ['◇'])]),
    'La abuela y {name} arman un cartel con figuras para la puerta del jardín.|Grandma and {name} make a sign with shapes for the garden gate.'),
  adventure('G01-10-L02', 'Torres y pelotas|Towers and balls', 'garden',
    step('Armamos una ciudad con cosas que ocupan lugar: pelota, dado y lata.|We build a town with things that take up space: ball, die, and can.', 'solids', [row('Objetos|Objects', ['⚽', '🎲', '🥫'])], 'La pelota rueda hasta la plaza de la ciudad.|The ball rolls to the town square.', '⚽'),
    step('Una cara del dado es cuadrada, pero el dado entero tiene varias caras.|One face of the die is square, but the whole die has several faces.', 'solids', [row('Una cara y el dado entero|One face and the whole die', ['□', '🎲'])], '{name} usa el dado como torre de la ciudad.|{name} uses the die as a tower in the town.', '🎲'),
    'En el jardín, {name} arma una ciudad con objetos de verdad.|In the garden, {name} builds a town with real objects.'),
  adventure('G01-11-L01', 'La cinta del regalo|The gift ribbon', 'garden',
    step('Las cintas A y B empiezan en la misma marca. Mirá cuál llega más lejos.|Ribbons A and B start at the same mark. See which reaches farther.', 'lengths', [row('A', copies(4, '━')), row('B', copies(6, '━'))], '{name} usa la cinta B para el regalo grande.|{name} uses ribbon B for the big gift.', '🎀'),
    step('Tocá «Ver el cambio»: la cinta B se corre. Después volvé a alinearla.|Tap “See the change”: ribbon B moves. Then line it up again.', 'lengths', [row('A', copies(4, '━')), row('B', copies(6, '━'))], 'Con los comienzos alineados, comparan bien.|With the starts lined up, they compare correctly.', '✓', [row('A', copies(4, '━')), row('B corrida|B moved', ['·', '·', '·', ...copies(6, '━')])]),
    'La abuela quiere envolver un regalo grande para la maestra del jardín.|Grandma wants to wrap a big gift for the garden teacher.'),
  adventure('G01-11-L02', 'Un puente para el autito|A bridge for the toy car', 'garden',
    step('Medimos la tira del puente con bloques iguales, sin huecos.|We measure the bridge strip with equal blocks, with no gaps.', 'measure', [row('La tira|The strip', copies(5, '▢'))], 'La tira de 5 bloques es el puente.|The 5-block strip becomes the bridge.', '🌉'),
    step('Probá separar los bloques. Los huecos dejan partes sin medir.|Try spreading the blocks apart. The gaps leave parts unmeasured.', 'measure', [row('La tira|The strip', copies(5, '▢'))], '{name} junta los bloques otra vez. ¡El autito cruza!|{name} puts the blocks together again. The toy car crosses!', '🚗', [row('Con huecos|With gaps', ['▢', '·', '▢', '·', '▢', '·', '▢', '·', '▢'])]),
    'El arroyito del jardín necesita un puente para el autito.|The garden stream needs a bridge for the toy car.'),
  adventure('G01-12-L01', 'Plantamos una semilla|Planting a seed', 'garden',
    step('Con la abuela, {name} hace un hueco, pone la semilla y la tapa.|With Grandma, {name} makes a hole, puts in the seed, and covers it.', 'plant', [row('Pasos mezclados|Mixed-up steps', ['Tapar|Cover', 'Hacer el hueco|Make the hole', 'Poner la semilla|Put in the seed'])], '{name} pone la semilla y la tapa con tierra.|{name} puts in the seed and covers it with soil.', '🌱', [row('En orden|In order', ['Hacer el hueco|Make the hole', 'Poner la semilla|Put in the seed', 'Tapar|Cover'])]),
    step('La planta va a tardar en crecer. Dejamos una tarjeta con los pasos.|The plant will take time to grow. We leave a card with the steps.', 'plant', [row('La tarjeta|The card', ['Primero|First', 'Después|Next', 'Al final|Finally'])], 'La tarjeta queda junto a la maceta. ¡Plantamos!|The card stays by the pot. We planted it!', '🌱'),
    '{name} quiere plantar una semilla para ver cómo crece.|{name} wants to plant a seed to watch it grow.'),
  adventure('G01-12-L02', '¿Cuándo volvemos?|When do we come back?', 'garden',
    step('Miramos una semana de ejemplo. Después del domingo empieza otra semana.|Look at an example week. After Sunday a new week starts.', 'calendar', [row('Semana de ejemplo|Example week', ['Vie|Fri', 'Sáb|Sat', 'Dom|Sun', 'Lun|Mon'])], '{name} marca el lunes en el calendario.|{name} marks Monday on the calendar.', '📅', undefined, { track: { start: 2, target: 3, direction: 1, unit: 'day' } }),
    step('En este calendario inventado, el lunes es 1. La visita es el jueves 4.|In this pretend calendar, Monday is the 1st. The visit is Thursday the 4th.', 'calendar', [row('Calendario de ejemplo|Example calendar', ['Lun 1|Mon 1', 'Mar 2|Tue 2', 'Mié 3|Wed 3', 'Jue 4|Thu 4', 'Vie 5|Fri 5'])], '{name} marca la visita del jueves. ¡Volvemos pronto!|{name} marks Thursday’s visit. We’ll be back soon!', '4', undefined, { track: { start: 0, target: 3, direction: 1, unit: 'day' } }),
    'La semilla va a crecer. {name} quiere saber cuándo volver a verla.|The seed will grow. {name} wants to know when to come back and see it.'),

  // Place 5: back home — everything counted in the morning comes back.
  adventure('G01-13-L01', 'Guardamos los juguetes|Tidy up the toys', 'return',
    step('Guardamos las piezas por forma. Un círculo chico sigue siendo un círculo.|We put the pieces away by shape. A small circle is still a circle.', 'sorting', [row('Piezas mezcladas|Mixed pieces', ['○', '△', '◦', '△', '○'])], 'El círculo chico va con los otros círculos.|The small circle goes with the other circles.', '○', [row('Círculos|Circles', ['○', '◦', '○']), row('Triángulos|Triangles', ['△', '△'])]),
    step('Podemos cambiar la regla, si decimos cuál usamos. Probá por tamaño.|We can change the rule, if we say which one we use. Try size.', 'sorting', [row('Por forma|By shape', ['○', '◦', '○', '△', '▵'])], 'Los amigos terminan de guardar todas las piezas.|The friends finish putting all the pieces away.', '🧩', [row('Chicas|Small', ['◦', '▵']), row('Grandes|Big', ['○', '○', '△'])]),
    'Es hora de volver. Antes, guardamos los juguetes del jardín en cajas.|It is time to go back. First, we put the garden toys away in boxes.'),
  adventure('G01-13-L02', 'Una foto juntos|A photo together', 'return',
    step('Ocho amigos votan el adorno de la foto. Cada símbolo es un voto.|Eight friends vote for the photo decoration. Each symbol is one vote.', 'votes', VOTES, 'El triángulo decora la foto del grupo.|The triangle decorates the group photo.', '📷'),
    step('Solo votaron estos ocho amigos. No sabemos qué piensa el resto de la escuela.|Only these eight friends voted. We do not know what the rest of the school thinks.', 'votes', VOTES, '{name} escribe: «Lo que eligió nuestro grupo». Los amigos se despiden.|{name} writes: “Our group’s choice.” The friends say goodbye.', '👋'),
    'Antes de despedirse, los amigos se sacan una foto con un adorno.|Before saying goodbye, the friends take a photo with a decoration.'),
  adventure('G01-14-L01', 'Recuerdos en el álbum|Memories in the album', 'return',
    step('Leo tenía 7 figuritas y le regaló 2 a {name}.|Leo had 7 stickers and gave 2 to {name}.', 'groups', [row('Leo se queda|Leo keeps', copies(5, '★')), row('Leo regaló|Leo gave away', copies(2, '☆'))], 'A Leo le quedan 5 y {name} pega 2 nuevas en el álbum.|Leo keeps 5 and {name} sticks 2 new ones in the album.', '★'),
    step('Otra historia del álbum: Sol tenía 8 figuritas y recibió 5.|Another album story: Sol had 8 stickers and received 5.', 'groups', [row('Tenía|Had', copies(8, '★')), row('Recibió|Received', copies(5, '☆'))], '{name} escribe: Sol tiene 13 al final.|{name} writes: Sol has 13 at the end.', '13'),
    'De vuelta en casa, {name} arma el álbum del día.|Back home, {name} puts together the day’s album.'),
  adventure('G01-14-L02', '¡Todo volvió a casa!|Everything came back home!', 'home',
    step('{name} revisa una cuenta del álbum: 7 figuritas y 4 más son 11.|{name} checks an album sum: 7 stickers and 4 more make 11.', 'groups', [row('Al principio|At the start', copies(7, '★')), row('Llegaron|Arrived', copies(4, '☆'))], 'Sacando las 4 que llegaron volvemos a 7: ¡la cuenta está bien!|Taking away the 4 that arrived brings us back to 7: the sum is right!', '✓', [row('Volvemos al principio|Back to the start', copies(7, '★')), row('Sacamos las que llegaron|Took away the new ones', copies(4, '×'))]),
    step('La abuela revisa la lista de la mañana con dos maneras de contar.|Grandma checks the morning list with two ways of counting.', 'cards', [row('Contar desde 8|Count on from 8', ['8', '9', '10', '11', '12', '13']), row('Armar diez|Make ten', ['8', '+ 2', '+ 3', '= 13'])], '¡Volvieron los 5 juguetes, los 4 moldes, los crayones y las figuritas! Fin del día.|The 5 toys, the 4 molds, the crayons, and the stickers all came back! End of the day.', '🏠'),
    'La abuela dice: «Revisemos que todo haya vuelto, como dijimos a la mañana».|Grandma says: “Let’s check that everything came back, as we said this morning.”'),
];

export function getGradeOneAdventure(id: string): GradeOneAdventure | undefined {
  return GRADE_ONE_ADVENTURES.find(adventure => adventure.id === id);
}
