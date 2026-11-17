import { text } from '../lessonModel';
import type { LocalizedText } from '../../math/core/types';

// Grade 3 game layer: the hero builds a house for the family.
// Each chapter is one building stage; each correct answer adds one piece of the
// house (82 pieces = 41 missions × 2 challenges). rewards[i] is shown after
// checks[i] and names what that answer made possible.
// Introductions and rewards may name the chosen hero ({name}); they render
// through HeroText. Lessons, prompts and hints never use {name}.
// Scenario: docs/grade-3-house-scenario.md.

export interface HouseMission {
  id: string;
  title: LocalizedText;
  introduction: LocalizedText;
  rewards: [LocalizedText, LocalizedText];
}
export interface HouseChapter {
  id: string;
  number: number;
  icon: string;
  title: LocalizedText;
  /** What is finished when the chapter ends. */
  stage: LocalizedText;
  /** First and one-after-last mission index. */
  start: number;
  end: number;
  missions: HouseMission[];
}

type MissionSource = [lessonId: string, title: string, introduction: string, reward1: string, reward2: string];

const chapterSources: [icon: string, title: string, stage: string, missions: MissionSource[]][] = [
  ['🧱', 'El terreno y el corralón|The lot and the supply yard', 'Los materiales están en el terreno.|The materials are on the lot.', [
    ['G03-01-L01', 'Ladrillos en el corralón|Bricks at the supply yard',
      'La familia de {name} compró un terreno vacío. ¡Vamos a construir una casa! Rosa, la maestra mayor de obras, necesita ladrillos. En el corralón cuentan los ladrillos en palés, pilas y paquetes.|{name}’s family has bought an empty lot. Let’s build a house! Rosa, the site manager, needs bricks. At the supply yard, bricks are counted in pallets, stacks, and packs.',
      'Rosa reserva las 5 pilas: 500 ladrillos.|Rosa reserves the 5 stacks: 500 bricks.',
      '10 pilas suben al camión como un palé. ¡El primer palé está listo!|10 stacks go on the truck as one pallet. The first pallet is ready!'],
    ['G03-01-L02', 'El pedido por teléfono|The phone order',
      'Rosa pide los ladrillos por teléfono. {name} escribe el número en la hoja de pedido. Un cero mal puesto cambia todo.|Rosa orders the bricks by phone. {name} writes the number on the order form. One zero in the wrong place changes everything.',
      'La hoja de pedido dice 8.009. ¡Está bien escrita!|The order form says 8,009. It is written correctly!',
      'Rosa agrega 1 ladrillo suelto. ¡El pedido de 9.000 está completo!|Rosa adds 1 loose brick. The order for 9,000 is complete!'],
    ['G03-01-L03', 'Llega el camión|The truck arrives',
      'El camión trae los ladrillos. Un palé llegó desarmado en pilas. {name} revisa si llegó todo lo pedido.|The truck brings the bricks. One pallet arrived split into stacks. {name} checks that everything ordered has arrived.',
      'Llegaron los 4.512 ladrillos. Rosa firma el remito.|All 4,512 bricks arrived. Rosa signs the delivery note.',
      'Las baldosas también están completas. ¡Los materiales están en el terreno!|The tiles are complete too. The materials are on the lot!'],
  ]],
  ['⛏', 'Los cimientos|The foundation', 'El piso de la casa está firme y seco.|The house floor is solid and dry.', [
    ['G03-02-L01', 'La zanja de los cimientos|The foundation trench',
      'Rosa marca la casa con hilos en el suelo. «Antes de las paredes, cimientos fuertes». {name} anota los bloques en la libreta de obra.|Rosa marks the house with strings on the ground. “Before walls, a strong foundation.” {name} writes the blocks in the site notebook.',
      'Las carretillas llevan justo 457 bloques.|The wheelbarrows carry exactly 457 blocks.',
      'La libreta queda prolija. ¡La zanja tiene sus bloques!|The notebook is neat. The trench has its blocks!'],
    ['G03-02-L02', 'La hormigonera|The concrete mixer',
      'Para el hormigón hace falta arena y piedra. {name} cuenta los baldes que entran en la hormigonera.|Concrete needs sand and gravel. {name} counts the buckets that go into the mixer.',
      'Entran 422 baldes. ¡La hormigonera gira!|422 buckets go in. The mixer turns!',
      'El hormigón está listo y cae en la zanja.|The concrete is ready and pours into the trench.'],
    ['G03-02-L03', '¿Alcanza el agua?|Is there enough water?',
      'El tanque de la obra tiene 1.000 litros. La hormigonera usa mucha agua. {name} piensa si alcanza para todo el día.|The site tank holds 1,000 litres. The mixer uses a lot of water. {name} thinks about whether it is enough for the whole day.',
      'Unos 800 litros: el tanque alcanza para hoy.|About 800 litres: the tank is enough for today.',
      'Rosa anota el total exacto: 799 litros.|Rosa writes the exact total: 799 litres.'],
    ['G03-03-L01', 'Los hierros|The iron rods',
      'Dentro del hormigón van hierros. Sobran algunos. {name} cuenta cuántos quedan para las columnas.|Iron rods go inside the concrete. Some are left over. {name} counts how many are left for the columns.',
      'Quedan 26 hierros para las columnas.|26 rods are left for the columns.',
      'Rosa confía en la cuenta y guarda los hierros.|Rosa trusts the count and stores the rods.'],
    ['G03-03-L02', 'Lo que sobra|What is left over',
      'Los cimientos usaron muchos bloques y agua. {name} calcula lo que sobra.|The foundation used many blocks and lots of water. {name} works out what is left.',
      'Quedan 217 bloques apilados para las paredes.|217 blocks are stacked for the walls.',
      'La manguera se cierra a tiempo. El tanque guarda su agua.|The hose is turned off in time. The tank keeps its water.'],
    ['G03-03-L03', 'La revisión de Rosa|Rosa’s check',
      'Antes de que el piso se seque, Rosa revisa la libreta. {name} comprueba cada resta.|Before the floor dries, Rosa checks the notebook. {name} checks each subtraction.',
      'La línea de la libreta recibe su tilde ✔.|The notebook line gets its tick ✔.',
      '¡El piso está seco! Canela dejó sus huellas en una esquina. La familia las guarda de recuerdo.|The floor is dry! Canela left paw prints in one corner. The family keeps them as a souvenir.'],
  ]],
  ['🏗', 'Las paredes|The walls', 'Las paredes están de pie.|The walls are standing.', [
    ['G03-04-L01', 'La ventana de vidrio|The glass window',
      '¡Ahora la casa crece hacia arriba! Una pared de ladrillos tiene filas y columnas. El baño lleva una ventana de bloques de vidrio.|Now the house grows upwards! A brick wall has rows and columns. The bathroom gets a window of glass blocks.',
      'La ventana de vidrio brilla con sus 28 bloques.|The glass window shines with its 28 blocks.',
      'Rosa completa el hueco. La ventana está entera.|Rosa fills the gap. The window is complete.'],
    ['G03-04-L02', 'El dibujo girado|The turned drawing',
      '{name} mira el dibujo de una pared desde otro lado. ¿Cambia la cantidad de ladrillos?|{name} looks at the drawing of a wall from another side. Does the number of bricks change?',
      'Son 48 ladrillos igual. El pedido no cambia.|It is still 48 bricks. The order does not change.',
      'La libreta dice bien: quedan 5 marcos.|The notebook is right: 5 frames are left.'],
    ['G03-04-L03', 'Una fila más|One more row',
      'La pared de la cocina sube fila por fila. {name} usa lo que ya sabe para calcular rápido.|The kitchen wall rises row by row. {name} uses what is already known to calculate quickly.',
      'La pared llega a la altura de la ventana.|The wall reaches window height.',
      'Las dos paredes iguales del cuarto están hechas.|The two equal walls of the children’s room are built.'],
    ['G03-05-L01', 'La pared del frente|The front wall',
      'La pared del frente es larga. Rosa corta el dibujo en partes para contar mejor.|The front wall is long. Rosa cuts the drawing into parts to count better.',
      'La pared del frente llega al marco de la puerta.|The front wall reaches the door frame.',
      'Se piden los ladrillos justos, sin que falte ni sobre ninguno.|The exact bricks are ordered, none missing and none extra.'],
    ['G03-05-L02', 'Paredes por partes|Walls in parts',
      'Faltan las paredes del dormitorio y de la cocina. La abuela Tita y {name} calculan de dos maneras.|The bedroom and kitchen walls are still missing. Abuela Tita and {name} calculate in two ways.',
      'Suben las tres paredes del dormitorio.|The three bedroom walls rise.',
      'Las cuatro paredes de la cocina están listas.|The four kitchen walls are ready.'],
    ['G03-05-L03', 'La última pared|The last wall',
      'Queda una sola pared. {name} hace la cuenta escrita en la libreta.|Only one wall is left. {name} writes the calculation in the notebook.',
      'La última pared ya está de pie.|The last wall is standing.',
      '¡Todas las paredes están listas, con sus huecos para ventanas!|All the walls are ready, with holes for the windows!'],
  ]],
  ['🌧', 'El techo antes de la lluvia|The roof before the rain', 'El techo está cerrado.|The roof is closed.', [
    ['G03-06-L01', 'Chapas en filas|Roof sheets in rows',
      'La radio anuncia lluvia para el viernes. ¡Hay que cerrar el techo antes! {name} reparte las chapas en filas iguales.|The radio says rain on Friday. The roof must be closed before then! {name} shares out the roof sheets in equal rows.',
      'El primer lado del techo está cubierto.|The first side of the roof is covered.',
      'Cada ayudante tiene su cajita con 7 tornillos.|Every helper has a little box with 7 screws.'],
    ['G03-06-L02', 'Las tejas del alero|The porch tiles',
      'Falta el techito de la entrada. {name} organiza las tejas y los clavos.|The porch roof is still missing. {name} organizes the tiles and the nails.',
      'Las 8 hileras quedan marcadas con tiza.|The 8 rows are marked in chalk.',
      'Los 4 trabajadores martillan a la vez.|The 4 workers hammer at the same time.'],
    ['G03-06-L03', '¡Que no llueva todavía!|Not raining yet!',
      'Es jueves y las nubes se acercan. Quedan las últimas tejas y los rollos de membrana. {name} decide cuántas hileras y cuántos viajes.|It is Thursday and the clouds are coming. The last tiles and rolls of roof sheet remain. {name} decides how many rows and how many trips.',
      'Las 4 tejas que sobran techan la cucha de Canela.|The 4 extra tiles cover Canela’s dog house.',
      '¡El techo se cierra justo cuando empieza a llover! La familia mira la lluvia desde adentro, seca.|The roof closes just as the rain starts! The family watches the rain from inside, dry.'],
  ]],
  ['💡', 'Agua, luz y color|Water, light, and colour', 'La casa tiene agua, luz, azulejos y estantes.|The house has water, light, tiles, and shelves.', [
    ['G03-07-L01', 'Cables para la luz|Cables for the lights',
      'Adentro todavía está oscuro. {name} ayuda a medir los cables con cálculos rápidos.|It is still dark inside. {name} helps measure the cables with quick calculations.',
      'El cable de 126 m queda cortado a medida.|The 126 m cable is cut to size.',
      '¡Se prenden las primeras luces!|The first lights switch on!'],
    ['G03-07-L02', 'Un rollo de cable|A roll of cable',
      'En el corralón venden rollos de 300 m de cable. {name} estima si alcanza un rollo para toda la casa.|The supply yard sells 300 m rolls of cable. {name} estimates whether one roll is enough for the whole house.',
      'Unos 300 m: un rollo parece justo.|About 300 m: one roll looks about right.',
      'Hacen falta menos de 300 m. ¡Un rollo alcanza!|Less than 300 m is needed. One roll is enough!'],
    ['G03-07-L03', 'Agua para el baño|Water for the bathroom',
      'El baño recibe agua y azulejos. La abuela Tita tiene sus trucos para calcular. {name} los prueba.|The bathroom gets water and tiles. Abuela Tita has her own calculation tricks. {name} tries them.',
      '¡El agua corre! Quedan 301 litros en el tanque.|The water runs! 301 litres are left in the tank.',
      'La pared del baño queda cubierta de azulejos.|The bathroom wall is covered in tiles.'],
    ['G03-08-L01', 'Las cajas de azulejos|The tile boxes',
      'Ahora la cocina. Los azulejos vienen en cajas. {name} elige la cuenta que responde cada pregunta.|Now the kitchen. The tiles come in boxes. {name} chooses the calculation that answers each question.',
      'Las 12 cajas quedan contadas.|The 12 boxes are counted.',
      'El pedido de azulejos de la cocina está hecho.|The kitchen tile order is placed.'],
    ['G03-08-L02', 'Estantes para la despensa|Shelves for the pantry',
      'La despensa necesita estantes. Canela escondió algunos tornillos en el pasto. {name} arma un plan paso a paso.|The pantry needs shelves. Canela hid some screws in the grass. {name} makes a step-by-step plan.',
      'Cada estante recibe sus 7 tornillos.|Every shelf gets its 7 screws.',
      'Los estantes ya están colgados.|The shelves are up.'],
    ['G03-08-L03', 'El piso del pasillo|The hall floor',
      'Falta el piso del pasillo. {name} arma una tabla de cajas y azulejos.|The hall floor is still missing. {name} makes a table of boxes and tiles.',
      'El piso del pasillo queda cubierto con 72 azulejos.|The hall floor is covered with 72 tiles.',
      '¡La casa tiene agua, luz, azulejos y estantes!|The house has water, light, tiles, and shelves!'],
  ]],
  ['📐', 'El plano de la casa|The house plan', 'Las ventanas están puestas y el plan para la mudanza está listo.|The windows are in and the moving-day plan is ready.', [
    ['G03-09-L01', 'Un plano para la mudanza|A plan for moving day',
      'Se acerca el día de la mudanza. Los fleteros nunca vieron la casa. {name} dibuja un plano para que sepan dónde va cada cosa.|Moving day is coming. The movers have never seen the house. {name} draws a plan so they know where everything goes.',
      'El plano muestra todas las habitaciones.|The plan shows every room.',
      'Los fleteros pueden leer el plano.|The movers can read the plan.'],
    ['G03-09-L02', 'Pintura fresca|Wet paint',
      'Una habitación tiene pintura fresca. ¡Nadie puede pasar por ahí! {name} arma la leyenda del plano.|One room has wet paint. Nobody may walk through it! {name} makes the key for the plan.',
      'La habitación con pintura fresca queda marcada.|The room with wet paint is marked.',
      'La leyenda usa formas. Se lee también en blanco y negro.|The key uses shapes. It can be read in black and white too.'],
    ['G03-09-L03', 'El camino del sillón|The sofa’s route',
      'Los fleteros van a entrar el sillón por la puerta. {name} prueba los caminos en el plano.|The movers will carry the sofa in through the door. {name} tests the routes on the plan.',
      'Los fleteros evitarán la pintura fresca.|The movers will avoid the wet paint.',
      'El recorrido para el día de la mudanza está listo.|The moving-day route is ready.'],
    ['G03-10-L01', 'Marcos para las ventanas|Window frames',
      'El carpintero hace los marcos. {name} ordena la lista de ventanas por su forma.|The carpenter makes the frames. {name} sorts the list of windows by shape.',
      'Los marcos se encargan juntos.|The frames are ordered together.',
      'La ventana triangular del altillo ya está puesta.|The triangular attic window is in.'],
    ['G03-10-L02', 'Cajas para la mudanza|Moving boxes',
      'La familia guarda todo en cajas. Átomo protege las cajas y {name} les pone etiquetas.|The family packs everything in boxes. Átomo protects the boxes and {name} labels them.',
      'Cada caja tiene sus 8 esquineros.|Every box has its 8 corner protectors.',
      'Todas las cajas tienen etiquetas en todas sus caras.|Every box has labels on all its faces.'],
    ['G03-10-L03', 'La chapita del buzón|The mailbox plate',
      'La casa necesita un buzón con una chapita. {name} encarga la chapita por teléfono.|The house needs a mailbox with a name plate. {name} orders the plate by phone.',
      'El carpintero ya puede cortar la chapita.|The carpenter can now cut the plate.',
      '¡La chapita está en el buzón! La casa ya tiene nombre.|The plate is on the mailbox! The house has its name.'],
  ]],
  ['🚚', '¡Día de mudanza!|Moving day!', 'La familia duerme la primera noche en la casa nueva.|The family spends the first night in the new house.', [
    ['G03-11-L01', 'Medir y pesar|Measuring and weighing',
      'El camión de mudanza está reservado. Todo tiene que entrar. {name} usa la cinta métrica y la balanza.|The moving truck is booked. Everything has to fit. {name} uses the tape measure and the scale.',
      'La alfombra de 300 cm entra justo en el pasillo.|The 300 cm carpet fits the hall.',
      'Los fleteros saben cuál es la caja pesada.|The movers know which box is the heavy one.'],
    ['G03-11-L02', 'El hueco del lavarropas|The washing machine gap',
      'El lavarropas va en un hueco de la cocina. {name} primero estima y después mide.|The washing machine goes in a gap in the kitchen. {name} estimates first, then measures.',
      'La medida real, 46 cm, queda anotada en el plano.|The real measure, 46 cm, is written on the plan.',
      'Las próximas estimaciones de {name} van a estar más cerca.|{name}’s next estimates will be closer.'],
    ['G03-11-L03', '¿Dónde va la cama?|Where does the bed go?',
      'La cama no entra en cualquier pared. {name} compara medidas escritas de maneras distintas.|The bed does not fit on every wall. {name} compares measures written in different ways.',
      'La cama va en la pared más larga.|The bed goes on the longer wall.',
      'La cama ya está en su lugar.|The bed is in its place.'],
    ['G03-12-L01', 'El reloj de la cocina|The kitchen clock',
      'El camión llega temprano. {name} lee el reloj de la cocina.|The truck comes early. {name} reads the kitchen clock.',
      'La familia está lista cuando llega el camión.|The family is ready when the truck arrives.',
      'El despertador queda programado.|The alarm is set.'],
    ['G03-12-L02', '¿Cuánto tarda la descarga?|How long does unloading take?',
      'Los fleteros descargan el camión. {name} calcula cuánto tardan.|The movers unload the truck. {name} works out how long it takes.',
      '¡El almuerzo llega a tiempo!|Lunch is on time!',
      'El horario de la mudanza queda bien anotado.|The moving-day timetable is written correctly.'],
    ['G03-12-L03', 'El calendario de la heladera|The calendar on the fridge',
      'La familia ya vive en la casa nueva. Quieren hacer una fiesta. {name} busca la fecha en el calendario.|The family now lives in the new house. They want to have a party. {name} looks for the date on the calendar.',
      'Las invitaciones ya tienen su fecha: martes 13.|The invitations have their date: Tuesday 13.',
      '¡Primera noche en la casa nueva! El calendario cuelga en la heladera.|First night in the new house! The calendar hangs on the fridge.'],
  ]],
  ['🎉', 'La fiesta de la casa nueva|The housewarming party', '¡La casa está terminada y llena de invitados!|The house is finished and full of guests!', [
    ['G03-13-L01', 'Una pregunta para la familia|A question for the family',
      '«¡Hagamos una fiesta para todos los que ayudaron!». La familia decide junta. {name} prepara una pregunta.|“Let’s have a party for everyone who helped!” The family decides together. {name} prepares a question.',
      'La hoja de la encuesta está lista.|The survey sheet is ready.',
      'Todas las respuestas están anotadas.|All the answers are written down.'],
    ['G03-13-L02', 'El gráfico de las empanadas|The empanada chart',
      '{name} pasa los votos de las empanadas a un gráfico para la heladera.|{name} turns the empanada votes into a chart for the fridge.',
      'El gráfico de barras está dibujado.|The bar chart is drawn.',
      'Todos pueden leer el gráfico.|Everyone can read the chart.'],
    ['G03-13-L03', 'El árbol del jardín|The garden tree',
      'La abuela Tita quiere plantar un árbol. La familia votó. {name} lee qué dicen los datos.|Abuela Tita wants to plant a tree. The family voted. {name} reads what the data say.',
      'La familia vuelve a conversar antes de elegir.|The family talks again before choosing.',
      'La abuela Tita planta el árbol que eligió la familia.|Abuela Tita plants the tree the family chose.'],
    ['G03-14-L01', 'Llegan los invitados|The guests arrive',
      'Los parientes vienen de otra ciudad. {name} reserva las combis.|The relatives come from another town. {name} books the vans.',
      'Las 4 combis quedan reservadas.|The 4 vans are booked.',
      '¡Todos los invitados llegan a la fiesta!|Every guest arrives at the party!'],
    ['G03-14-L02', '¡A cortar la cinta!|Cut the ribbon!',
      'En la mesa hay bandejas de empanadas. {name} y la abuela Tita las cuentan de dos maneras distintas.|There are trays of empanadas on the table. {name} and Abuela Tita count them in two different ways.',
      'Las empanadas quedan contadas: hay para todos.|The empanadas are counted: there are enough for everyone.',
      '{name} corta la cinta. ¡La casa nueva está terminada!|{name} cuts the ribbon. The new house is finished!'],
  ]],
];

let missionIndex = 0;
export const HOUSE_CHAPTERS: HouseChapter[] = chapterSources.map(([icon, title, stage, missions], i) => {
  const start = missionIndex;
  missionIndex += missions.length;
  return {
    id: `house-${i + 1}`, number: i + 1, icon, title: text(title), stage: text(stage), start, end: missionIndex,
    missions: missions.map(([id, name, introduction, first, second]) => ({
      id, title: text(name), introduction: text(introduction), rewards: [text(first), text(second)],
    })),
  };
});
export const HOUSE_MISSIONS: HouseMission[] = HOUSE_CHAPTERS.flatMap(chapter => chapter.missions);

export const HOUSE_EPILOGUE = text('La familia, Rosa, los vecinos y los parientes miran la casa terminada. El limonero de la abuela Tita está en el jardín. Las huellas de Canela siguen en el piso. La libreta de obra tiene sus 82 tildes. {name} abre la puerta: «¡Bienvenidos a casa!».|The family, Rosa, the neighbours, and the relatives look at the finished house. Abuela Tita’s lemon tree is in the garden. Canela’s paw prints are still in the floor. The site notebook has all 82 ticks. {name} opens the door: “Welcome home!”');

export const HOUSE_PIECES = HOUSE_MISSIONS.length * 2;

export function houseChapterAt(index: number): HouseChapter {
  return HOUSE_CHAPTERS.find(chapter => index >= chapter.start && index < chapter.end) ?? HOUSE_CHAPTERS[0];
}
