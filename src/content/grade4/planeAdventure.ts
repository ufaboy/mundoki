import { GRADE_FOUR_LESSONS } from './index';
import { text } from '../lessonModel';
import type { LocalizedText } from '../../math/core/types';

// Grade 4 story: the hero and Tía Nina rebuild the old plane La Golondrina,
// fly around Argentina, and come back for the aeroclub festival.
// Scenario and story map: docs/grade-4-plane-scenario.md.
//
// `{name}` (the chosen hero) is allowed only in introductions and rewards.
// Every lesson has a STORY entry: its checks in numbers.ts, fractions.ts,
// geometry.ts and data.ts are written for that scene, and each reward names
// what that answer changed.

export type PlaneSceneKind = 'hangar' | 'route' | 'festival';
export interface PlaneSceneState {
 kind: PlaneSceneKind;
 /** Hangar: building chapter 1–4. Route: stop 1–6 on the map. Festival: 1–2. */
 stage: number;
 /** Numbered parts already in place before this mission: across hangar chapters 1–4, per chapter on the journey. */
 before?: number;
}

interface ChapterDefinition { packages: string[]; icon: string; title: string; opening: string; scene: Omit<PlaneSceneState, 'before'> }

const chapterDefinitions: ChapterDefinition[] = [
 {packages:['G04-01'],icon:'🔧',scene:{kind:'hangar',stage:1},title:'El hangar viejo|The old hangar',
  opening:'En el hangar viejo del Aeroclub El Ceibo, La Golondrina espera bajo una lona. Primero hay que contar todo lo que hay en el depósito.|In the old hangar of Aeroclub El Ceibo, La Golondrina waits under a tarp. First, everything in the warehouse must be counted.'},
 {packages:['G04-02'],icon:'🎨',scene:{kind:'hangar',stage:2},title:'El fuselaje|The fuselage',
  opening:'El cuerpo del avión tiene agujeros. Hay que atornillar, remachar y pintar paneles nuevos.|The body of the plane has holes. New panels must be screwed, riveted, and painted.'},
 {packages:['G04-03','G04-04'],icon:'✈️',scene:{kind:'hangar',stage:3},title:'Las alas|The wings',
  opening:'Las alas son rectángulos largos cubiertos de filas de remaches. Después hay que repartir bulones y tornillos.|The wings are long rectangles covered with rows of rivets. Then bolts and screws must be shared out.'},
 {packages:['G04-05'],icon:'🛫',scene:{kind:'hangar',stage:4},title:'El tablero y el primer vuelo|The instrument panel and the first flight',
  opening:'El tablero está vacío y el viaje necesita un plan. Un buen piloto siempre sabe qué resultado esperar.|The instrument panel is empty and the trip needs a plan. A good pilot always knows what result to expect.'},
 {packages:['G04-06','G04-07'],icon:'💧',scene:{kind:'route',stage:1},title:'Hacia las Cataratas del Iguazú|To the Iguazú Falls',
  opening:'Una línea en el mapa va del aeroclub hasta Iguazú. El indicador de combustible marca medios, cuartos y octavos.|A line on the map goes from the aeroclub to Iguazú. The fuel gauge shows halves, quarters, and eighths.'},
 {packages:['G04-08'],icon:'🧶',scene:{kind:'route',stage:2},title:'La Quebrada de Humahuaca|The Quebrada de Humahuaca',
  opening:'En el mercado de Purmamarca, Doña Elva teje un tapiz de 10 filas de 10 cuadraditos.|At the Purmamarca market, Doña Elva weaves a tapestry of 10 rows of 10 small squares.'},
 {packages:['G04-09'],icon:'🏔️',scene:{kind:'route',stage:3},title:'Mendoza y el Aconcagua|Mendoza and the Aconcagua',
  opening:'Antes del vuelo largo hacia el sur, todo se pesa, se mide y se guarda.|Before the long flight south, everything is weighed, measured, and packed.'},
 {packages:['G04-10'],icon:'🧊',scene:{kind:'route',stage:4},title:'El glaciar Perito Moreno|The Perito Moreno glacier',
  opening:'Frente a la pared de hielo, cada giro del avión es un ángulo.|In front of the ice wall, every turn of the plane is an angle.'},
 {packages:['G04-11'],icon:'🌬️',scene:{kind:'route',stage:5},title:'Ushuaia, el fin del mundo|Ushuaia, at the end of the world',
  opening:'El viento dobló un soporte del ala. Nina lo arregla con refuerzos triangulares.|The wind bent a wing strut. Nina repairs it with triangular braces.'},
 {packages:['G04-12'],icon:'🐋',scene:{kind:'route',stage:6},title:'Península Valdés|Península Valdés',
  opening:'Las ballenas saltan en el mar. El ala necesita parches y las postales necesitan cajas.|The whales jump in the sea. The wing needs patches and the postcards need boxes.'},
 {packages:['G04-13'],icon:'📊',scene:{kind:'festival',stage:1},title:'De vuelta: el cartel del festival|Home: the festival poster',
  opening:'De vuelta en el aeroclub, preguntamos qué lugar del viaje va en el cartel del festival.|Back at the aeroclub, we ask which place from the trip goes on the festival poster.'},
 {packages:['G04-14'],icon:'🎉',scene:{kind:'festival',stage:2},title:'El festival del aeroclub|The aeroclub festival',
  opening:'El festival está por empezar. Hay que revisar cada cuenta, también las de otras personas.|The festival is about to start. Every calculation must be checked, other people’s too.'},
];

interface StoryMission { title: string; introduction: string; rewards: string[]; pieces?: number }

// One entry per lesson. `pieces` = scene parts this mission adds (two, one per answer).
const STORY: Record<string, StoryMission> = {
 'G04-01-L01': {
  title:'El registro del depósito|The warehouse register',
  introduction:'Nina abre el hangar viejo del Aeroclub El Ceibo. Bajo una lona está La Golondrina, un avión que no vuela hace años. Para arreglarlo, {name} y Nina revisan el registro del depósito.|Nina opens the old hangar of Aeroclub El Ceibo. Under a tarp stands La Golondrina, a plane that has not flown for years. To fix it, {name} and Nina check the warehouse register.',
  rewards:[
   '{name} encuentra los 7 cajones de 100.000 remaches en el estante de arriba.|{name} finds the 7 crates of 100,000 rivets on the top shelf.',
   'El registro queda bien copiado. Nina tacha la primera línea de la lista de reparación.|The register is copied correctly. Nina ticks the first line of the repair list.',
  ], pieces:2,
 },
 'G04-01-L02': {
  title:'El motor elegido|Choosing the engine',
  introduction:'Rulo, el hornero, armó un nido de barro sobre el motor viejo: ese motor no sirve. En el depósito hay motores de repuesto con contadores de kilómetros. {name} ayuda a elegir el que menos voló.|Rulo the hornero built a mud nest on the old engine: that engine is no good. The warehouse has spare engines with kilometre counters. {name} helps choose the one that has flown least.',
  rewards:[
   'El motor de 1.000.000 km va al estante del museo del aeroclub.|The 1,000,000-km engine goes to the aeroclub museum shelf.',
   '¡El motor de 405.900 km queda montado en la nariz de La Golondrina!|The 405,900-km engine is mounted on La Golondrina’s nose!',
  ], pieces:2,
 },
 'G04-01-L03': {
  title:'Remaches para las alas|Rivets for the wings',
  introduction:'Las alas de La Golondrina necesitan miles de remaches nuevos. Nina dibuja una recta numérica en el pizarrón del hangar. {name} ubica en la recta la cantidad de remaches.|La Golondrina’s wings need thousands of new rivets. Nina draws a number line on the hangar board. {name} places the rivet count on the line.',
  rewards:[
   'La marca de 8.240 queda en la recta. Nina escribe en el plano: «unos 8.000 remaches».|The 8,240 mark is on the line. Nina writes on the plan: “about 8,000 rivets”.',
   '¡Etapa completa! El hangar está limpio, el motor elegido y los remaches contados. {name} saca la lona: La Golondrina brilla. Rulo se muda al techo.|Stage complete! The hangar is clean, the engine is chosen, and the rivets are counted. {name} pulls off the tarp: La Golondrina shines. Rulo moves to the roof.',
  ], pieces:2,
 },
 'G04-02-L01': {
  title:'El esquema de Nina|Nina’s diagram',
  introduction:'El fuselaje de La Golondrina tiene agujeros. Llegan cajas de remaches para los paneles nuevos. Antes de calcular, Nina le pide a {name} que dibuje lo que saben.|La Golondrina’s fuselage has holes. Boxes of rivets arrive for the new panels. Before calculating, Nina asks {name} to draw what they know.',
  rewards:[
   'En el pizarrón, el esquema dice: «18 × 425 = remaches».|On the board, the diagram says: “18 × 425 = rivets”.',
   'Nina clava el esquema arriba del banco de trabajo. ¡A remachar!|Nina pins the diagram above the workbench. Time to rivet!',
  ], pieces:2,
 },
 'G04-02-L02': {
  title:'Tornillos para los paneles|Screws for the panels',
  introduction:'Los paneles nuevos se atornillan a los costados del fuselaje. {name} cuenta los tornillos paso a paso para que no falte ninguno.|The new panels are screwed onto the sides of the fuselage. {name} counts the screws step by step so none are missing.',
  rewards:[
   'Los 570 tornillos que sobran vuelven al cajón con su etiqueta.|The 570 screws left over go back into the drawer with their label.',
   '¡Los paneles quedan atornillados al fuselaje!|The panels are screwed onto the fuselage!',
  ], pieces:2,
 },
 'G04-02-L03': {
  title:'Pintura y nombre|Paint and name',
  introduction:'El fuselaje está cerrado. Falta pintarlo y escribir su nombre. Nina le pide a {name} que revise cada cuenta antes de abrir las latas.|The fuselage is closed. It still needs paint and its name. Nina asks {name} to check every calculation before opening the cans.',
  rewards:[
   'La franja azul queda pintada a lo largo del fuselaje.|The blue stripe is painted along the fuselage.',
   '¡Etapa completa! «LA GOLONDRINA» brilla en el fuselaje. Rulo se asoma desde el techo a mirar.|Stage complete! “LA GOLONDRINA” shines on the fuselage. Rulo peeks down from the roof to look.',
  ], pieces:2,
 },
 'G04-03-L01': {
  title:'El panel del ala izquierda|The left-wing panel',
  introduction:'Las alas de La Golondrina son rectángulos largos cubiertos de filas de remaches. {name} ayuda a Nina a contar los remaches del panel izquierdo sin contarlos de a uno.|La Golondrina’s wings are long rectangles covered with rows of rivets. {name} helps Nina count the rivets of the left panel without counting them one by one.',
  rewards:[
   'Los 12 remaches de la esquina quedan puestos.|The 12 corner rivets are in place.',
   '¡El panel del ala izquierda está remachado: 322 remaches!|The left-wing panel is riveted: 322 rivets!',
  ], pieces:2,
 },
 'G04-03-L02': {
  title:'El panel del ala derecha|The right-wing panel',
  introduction:'El panel derecho es más grande que el izquierdo. Nina lo calcula en productos parciales y {name} revisa cada parte.|The right panel is bigger than the left one. Nina calculates it in partial products, and {name} checks each part.',
  rewards:[
   'Las 20 filas de 34 remaches, 680 en total, quedan puestas en el panel derecho.|The 20 rows of 34 rivets, 680 in all, are in place on the right panel.',
   'Átomo corrige su cuenta: 230 + 92 = 322. Las cuentas de los dos paneles cierran y Nina remacha las últimas filas.|Átomo corrects his calculation: 230 + 92 = 322. The counts for both panels add up, and Nina rivets the last rows.',
  ], pieces:2,
 },
 'G04-03-L03': {
  title:'Los alerones|The ailerons',
  introduction:'Los alerones son las partes del ala que se mueven para girar. {name} calcula sus remaches por escrito, y Nina pide estimar antes de confiar en un resultado.|The ailerons are the parts of the wing that move to turn. {name} calculates their rivets in writing, and Nina asks for an estimate before trusting a result.',
  rewards:[
   'El primer alerón queda remachado: 448 remaches.|The first aileron is riveted: 448 rivets.',
   'Átomo corrige el segundo alerón: 1.081 remaches. ¡Los dos alerones ya se mueven!|Átomo corrects the second aileron: 1,081 rivets. Both ailerons move now!',
  ], pieces:2,
 },
 'G04-04-L01': {
  title:'Bulones para las costillas|Bolts for the ribs',
  introduction:'Dentro de cada ala hay costillas que le dan forma. Cada costilla necesita la misma cantidad de bulones. {name} ayuda a repartirlos en lotes grandes.|Inside each wing there are ribs that give it its shape. Every rib needs the same number of bolts. {name} helps share them out in big batches.',
  rewards:[
   'Cada costilla del ala derecha recibe 20 bulones; quedan 12 para repartir.|Each rib of the right wing gets 20 bolts; 12 are left to share.',
   'Cada costilla del ala derecha tiene sus 22 bulones.|Every rib of the right wing has its 22 bolts.',
  ], pieces:2,
 },
 'G04-04-L02': {
  title:'Bandejas de remaches|Rivet trays',
  introduction:'Para trabajar en las dos alas a la vez, remaches y bulones se reparten en partes iguales. {name} reparte por lugares: centenas, decenas y unidades.|To work on both wings at once, rivets and bolts are shared out equally. {name} shares them place by place: hundreds, tens, and ones.',
  rewards:[
   'Las 4 bandejas reciben 204 remaches cada una.|The 4 trays get 204 rivets each.',
   'Cada mecánico recibe su bolsa de 302 bulones. ¡A trabajar en las dos alas!|Each mechanic gets a bag of 302 bolts. Time to work on both wings!',
  ], pieces:2,
 },
 'G04-04-L03': {
  title:'Autos para llevar las alas|Cars to carry the wings',
  introduction:'Las alas están listas en el taller del fondo. Hay que guardar los tornillos de repuesto y llevar las alas al hangar con ayuda de todo el aeroclub. {name} organiza bolsitas y autos.|The wings are ready in the back workshop. The spare screws must be bagged, and the wings carried to the hangar with help from the whole aeroclub. {name} organises bags and cars.',
  rewards:[
   'Las 23 bolsitas entran en la caja de herramientas, y sobran 3 tornillos de repuesto.|The 23 bags go into the toolbox, with 3 spare screws left over.',
   '¡Etapa completa! Llegan 4 autos llenos de ayudantes, y las dos alas quedan montadas en La Golondrina.|Stage complete! 4 cars full of helpers arrive, and both wings are mounted on La Golondrina.',
  ], pieces:2,
 },
 'G04-05-L01': {
  title:'El tablero de instrumentos|The instrument panel',
  introduction:'Las alas ya están puestas. Ahora falta el tablero: relojes, luces y fusibles. Nina le enseña a {name} atajos para calcular rápido sin equivocarse.|The wings are on. Now the instrument panel is missing: dials, lights, and fuses. Nina shows {name} shortcuts for calculating fast without mistakes.',
  rewards:[
   'La caja de fusibles se llena: 900 fusibles.|The fuse box is filled: 900 fuses.',
   'El tablero queda conectado y los relojes de la cabina se encienden.|The panel is wired, and the cockpit dials light up.',
  ], pieces:2,
 },
 'G04-05-L02': {
  title:'El plan del viaje|The trip plan',
  introduction:'Nina despliega el mapa de la Argentina sobre el ala. Antes de calcular la distancia del viaje, {name} estima qué tamaño de resultado esperar.|Nina spreads the map of Argentina over the wing. Before calculating the trip distance, {name} estimates what size of result to expect.',
  rewards:[
   'El mapa del viaje queda colgado en la pared: unos 9.000 km de recorrido.|The trip map goes up on the wall: a route of about 9,000 km.',
   'Nina marca la ruta en el mapa y anota en la bitácora la distancia planeada exacta: 9.269 km.|Nina marks the route on the map and writes the exact planned distance in the logbook: 9,269 km.',
  ], pieces:2,
 },
 'G04-05-L03': {
  title:'Combustible para despegar|Fuel for take-off',
  introduction:'Todo está listo para el primer vuelo. Solo falta pedir el combustible. Átomo usa la calculadora, y {name} revisa si el resultado tiene sentido.|Everything is ready for the first flight. Only the fuel order is missing. Átomo uses the calculator, and {name} checks whether the result makes sense.',
  rewards:[
   'Llegan los 4 bidones: 252 L de combustible, justo lo pedido.|The 4 cans arrive: 252 L of fuel, exactly what was ordered.',
   '¡Etapa completa! La hélice gira y La Golondrina despega. {name} y Nina vuelan sobre el Obelisco y el Río de la Plata. Rulo vuela al lado.|Stage complete! The propeller spins and La Golondrina takes off. {name} and Nina fly over the Obelisco and the Río de la Plata. Rulo flies alongside.',
  ], pieces:2,
 },
 'G04-06-L01': {
  title:'Rumbo a Iguazú|Heading to Iguazú',
  introduction:'La Golondrina despega rumbo a las Cataratas del Iguazú, en Misiones. En el mapa, una línea va del aeroclub hasta Iguazú. {name} lee el indicador de combustible y marca la ruta.|La Golondrina takes off for the Iguazú Falls, in Misiones. On the map, a line goes from the aeroclub to Iguazú. {name} reads the fuel gauge and marks the route.',
  rewards:[
   'Nina confirma la lectura: el tanque está a 3/4.|Nina confirms the reading: the tank is at 3/4.',
   'En el mapa quedan marcados 2/4 de la ruta.|2/4 of the route is marked on the map.',
  ], pieces:2,
 },
 'G04-06-L02': {
  title:'Una parada para cargar combustible|A refuelling stop',
  introduction:'El viaje a Iguazú es largo: hay que parar a cargar combustible. Nina dobla el mapa para dividir la ruta en partes iguales, y {name} ubica la parada.|The trip to Iguazú is long: there must be a stop to refuel. Nina folds the map to divide the route into equal parts, and {name} places the stop.',
  rewards:[
   'La parada queda marcada después de 2/8 de la ruta.|The stop is marked after 2/8 of the route.',
   'El plan muestra los cuatro tramos del viaje.|The plan shows the four legs of the trip.',
  ], pieces:2,
 },
 'G04-06-L03': {
  title:'Llamada por radio y aterrizaje|Radio call and landing',
  introduction:'Durante el vuelo hay que avisar por radio dónde está el avión. {name} sigue la ruta en una recta numérica, del 0 al 1.|During the flight, the plane must report its position by radio. {name} follows the route on a number line, from 0 to 1.',
  rewards:[
   'Nina llama por radio justo en 3/8 de la ruta.|Nina makes the radio call exactly at 3/8 of the route.',
   '¡La Golondrina aterriza en Iguazú!|La Golondrina lands at Iguazú!',
  ], pieces:2,
 },
 'G04-07-L01': {
  title:'Las pasarelas de la Garganta del Diablo|The Devil’s Throat walkways',
  introduction:'En Iguazú, las pasarelas llegan hasta la Garganta del Diablo, donde el agua cae con un rugido enorme. {name} compara qué parte del camino recorrió cada uno.|At Iguazú, the walkways lead to the Devil’s Throat, where the water falls with a huge roar. {name} compares how much of the path each one has walked.',
  rewards:[
   'El grupo espera a Átomo en la pasarela.|The group waits for Átomo on the walkway.',
   'Eligen recorrer la mitad del sendero corto antes del paseo en lancha.|They choose to walk half of the short trail before the boat ride.',
  ], pieces:2,
 },
 'G04-07-L02': {
  title:'Combustible en Iguazú|Fuel at Iguazú',
  introduction:'Antes de seguir viaje, hay que cargar combustible. El indicador del avión y el del surtidor usan partes distintas. {name} los compara.|Before flying on, the plane needs fuel. The plane’s gauge and the pump’s gauge use different parts. {name} compares them.',
  rewards:[
   'Los dos indicadores coinciden: 1/2 = 2/4.|The two gauges agree: 1/2 = 2/4.',
   'El empleado frena el surtidor justo en 6/8.|The attendant stops the pump right at 6/8.',
  ], pieces:2,
 },
 'G04-07-L03': {
  title:'Tanque lleno y arcoíris|Full tank and a rainbow',
  introduction:'A la mañana siguiente, el sol hace un arcoíris sobre las cataratas. Antes del tramo largo hacia el noroeste, {name} revisa el tanque con Nina.|The next morning, the sun makes a rainbow over the falls. Before the long leg to the northwest, {name} checks the tank with Nina.',
  rewards:[
   'Nina anota la regla en la bitácora: para el tramo largo, más de 4/8.|Nina writes the rule in the logbook: for the long leg, more than 4/8.',
   '¡Etapa completa! Con 1/8 más, el tanque queda lleno. Un arcoíris cruza la Garganta del Diablo, y La Golondrina despega hacia el noroeste.|Stage complete! With 1/8 more, the tank is full. A rainbow crosses the Devil’s Throat, and La Golondrina takes off for the northwest.',
  ], pieces:2,
 },
 'G04-08-L01': {
  title:'El tapiz de Doña Elva|Doña Elva’s tapestry',
  introduction:'La Golondrina aterriza en Jujuy. En el mercado de Purmamarca, al pie del Cerro de los Siete Colores, Doña Elva teje un tapiz de 10 filas de 10 cuadraditos. {name} la ayuda a contar los colores.|La Golondrina lands in Jujuy. At the Purmamarca market, at the foot of the Hill of Seven Colours, Doña Elva weaves a tapestry of 10 rows of 10 small squares. {name} helps her count the colours.',
  rewards:[
   'Doña Elva termina la primera fila del tapiz.|Doña Elva finishes the first row of the tapestry.',
   'Los 7 cuadraditos rojos quedan anotados en la receta de colores.|The 7 red squares are written in the colour recipe.',
  ], pieces:2,
 },
 'G04-08-L02': {
  title:'Fajas a medida|Made-to-measure strips',
  introduction:'Doña Elva vende fajas tejidas y las mide con una cinta. {name} quiere una para adornar La Golondrina y ayuda a escribir las medidas.|Doña Elva sells woven strips and measures them with a tape. {name} wants one to decorate La Golondrina and helps write the measurements.',
  rewards:[
   'Doña Elva corta la faja justo en 40 cm.|Doña Elva cuts the strip exactly at 40 cm.',
   'La etiqueta dice 2,08 m: el camino tejido va al piso del avión.|The label says 2.08 m: the woven runner goes on the plane’s floor.',
  ], pieces:2,
 },
 'G04-08-L03': {
  title:'Un regalo para la cabina|A gift for the cockpit',
  introduction:'Antes de despegar, Doña Elva le regala a {name} un tapiz chico para la cabina. Juntos revisan qué parte de cada color tiene.|Before take-off, Doña Elva gives {name} a small tapestry for the cockpit. Together they check how much of each colour it has.',
  rewards:[
   'La mitad roja del tapiz chico queda terminada.|The red half of the small tapestry is finished.',
   '¡Etapa completa! El tapiz chico cuelga en la cabina, y La Golondrina despega hacia Mendoza.|Stage complete! The small tapestry hangs in the cockpit, and La Golondrina takes off for Mendoza.',
  ], pieces:2,
 },
 'G04-09-L01': {
  title:'La planilla de carga|The load sheet',
  introduction:'La Golondrina aterriza en Mendoza. Al oeste, los Andes parecen una pared. Antes del vuelo largo hacia el sur, todo se pesa y se mide. {name} completa la planilla de carga con Nina.|La Golondrina lands in Mendoza. To the west, the Andes look like a wall. Before the long flight south, everything is weighed and measured. {name} fills in the load sheet with Nina.',
  rewards:[
   'La caja de herramientas entra en la planilla de carga: 2.000 g.|The toolbox goes on the load sheet: 2,000 g.',
   'Con la cuerda de 150 cm, el avión queda bien atado contra el viento.|With the 150 cm rope, the plane is tied down safely against the wind.',
  ], pieces:2,
 },
 'G04-09-L02': {
  title:'Agua y equipaje|Water and luggage',
  introduction:'El vuelo hacia la Patagonia es largo. Hay que llevar agua y acomodar el equipaje en la bodega del avión. {name} reparte el agua y cuenta las cajas.|The flight to Patagonia is long. They must take water and fit the luggage into the plane’s hold. {name} shares out the water and counts the boxes.',
  rewards:[
   'La botella llena 4 vasos de 250 mL para el viaje.|The bottle fills 4 cups of 250 mL for the trip.',
   'Las 12 cajas quedan bien acomodadas en la bodega.|The 12 boxes are packed neatly in the hold.',
  ], pieces:2,
 },
 'G04-09-L03': {
  title:'El mirador del Aconcagua|The Aconcagua viewpoint',
  introduction:'El Aconcagua mide 6.961 m: es la montaña más alta de América. Nina y {name} hacen una caminata corta hasta el mirador y planean la ruta hacia el sur.|The Aconcagua is 6,961 m high: the highest mountain in the Americas. Nina and {name} take a short hike to the viewpoint and plan the route south.',
  rewards:[
   'Como 4.000 m es menos que 6.961 m, Nina traza la ruta junto a la montaña, no por encima.|Since 4,000 m is less than 6,961 m, Nina plans the route beside the mountain, not over it.',
   '¡Etapa completa! Foto en el mirador con el Aconcagua atrás. La Golondrina despega hacia la Patagonia.|Stage complete! A photo at the viewpoint with the Aconcagua behind. La Golondrina takes off for Patagonia.',
  ], pieces:2,
 },
 'G04-10-L01': {
  title:'Media vuelta frente al hielo|Half a turn by the ice',
  introduction:'Cerca de El Calafate, el glaciar Perito Moreno termina en una pared de hielo azul sobre el Lago Argentino. Los guardaparques piden volar lejos del hielo y girar justo como está planeado. {name} calcula los giros.|Near El Calafate, the Perito Moreno glacier ends in a wall of blue ice over Lago Argentino. The park rangers ask pilots to keep away from the ice and turn exactly as planned. {name} works out the turns.',
  rewards:[
   'La Golondrina da media vuelta y vuelve a lo largo de la pared de hielo.|La Golondrina makes half a turn and flies back along the ice wall.',
   'El giro en el mapa queda igual, con líneas cortas o largas.|The turn on the map stays the same, with short or long lines.',
  ], pieces:2,
 },
 'G04-10-L02': {
  title:'El plan de giros|The turn plan',
  introduction:'El plan de vuelo tiene tres columnas: giros agudos, rectos y obtusos. {name} ubica cada giro en su columna antes de despegar.|The flight plan has three columns: acute, right, and obtuse turns. {name} puts each turn in its column before take-off.',
  rewards:[
   'El giro de 65° queda en la columna de los agudos.|The 65° turn goes in the acute column.',
   'El giro de 135° queda en la columna de los obtusos. ¡La ruta sobre el lago está lista!|The 135° turn goes in the obtuse column. The route over the lake is ready!',
  ], pieces:2,
 },
 'G04-10-L03': {
  title:'Un rumbo nuevo|A new heading',
  introduction:'Para llegar a Ushuaia hay que tomar un rumbo nuevo. Nina lo dibuja en la carta con un transportador, y {name} controla cada paso.|To reach Ushuaia, the plane needs a new heading. Nina draws it on the chart with a protractor, and {name} checks each step.',
  rewards:[
   'El rumbo sale del punto correcto: el lugar del avión.|The heading starts from the right point: where the plane is.',
   '¡Etapa completa! Con el rumbo de 60°, La Golondrina pasa junto al glaciar y un bloque de hielo cae al lago. Próxima parada: Ushuaia.|Stage complete! On the 60° heading, La Golondrina passes the glacier, and a block of ice falls into the lake. Next stop: Ushuaia.',
  ], pieces:2,
 },
 'G04-11-L01': {
  title:'Refuerzos para el ala|Braces for the wing',
  introduction:'Sobre el Canal Beagle sopla un viento muy fuerte. Al aterrizar en Ushuaia, Nina encuentra doblado un soporte del ala. Lo va a arreglar con refuerzos triangulares: «Los triángulos no se deforman». {name} ordena los dibujos.|A very strong wind blows over the Beagle Channel. After landing in Ushuaia, Nina finds a bent wing strut. She will fix it with triangular braces: “Triangles keep their shape.” {name} sorts the drawings.',
  rewards:[
   'El dibujo de tres lados iguales queda rotulado: equilátero.|The drawing with three equal sides is labelled: equilateral.',
   'El dibujo con el ángulo de 100° queda rotulado: obtusángulo. Los dibujos están ordenados.|The drawing with the 100° angle is labelled: obtuse. The drawings are sorted.',
  ], pieces:2,
 },
 'G04-11-L02': {
  title:'Modelos de papel|Paper models',
  introduction:'Antes de cortar metal, Nina prueba cada refuerzo con tiras de papel. {name} decide qué tiras pueden cerrar un triángulo.|Before cutting metal, Nina tests each brace with paper strips. {name} decides which strips can close a triangle.',
  rewards:[
   'Con 3, 3 y 4 cm el modelo cierra: ese refuerzo se corta en metal.|With 3, 3, and 4 cm the model closes: that brace is cut from metal.',
   'Las tiras de 2, 3 y 5 cm quedan chatas y vuelven a la caja.|The 2, 3, and 5 cm strips lie flat and go back in the box.',
  ], pieces:2,
 },
 'G04-11-L03': {
  title:'El soporte reparado|The repaired strut',
  introduction:'Llega el momento de colocar los refuerzos en el soporte del ala. Algunos entran dados vuelta. {name} revisa que cada uno siga siendo el que pidió Nina.|It is time to fit the braces on the wing strut. Some go in turned around. {name} checks that each one is still the brace Nina asked for.',
  rewards:[
   'El refuerzo de 6, 6 y 8 cm queda colocado, y sigue siendo isósceles.|The 6, 6, and 8 cm brace is fitted, and it is still isosceles.',
   '¡Etapa completa! El soporte está reparado y el viento se calma. Foto junto al faro del Canal Beagle. Próxima parada: Península Valdés.|Stage complete! The strut is repaired and the wind calms down. A photo by the lighthouse in the Beagle Channel. Next stop: Península Valdés.',
  ], pieces:2,
 },
 'G04-12-L01': {
  title:'Parches para el ala|Patches for the wing',
  introduction:'La Golondrina aterriza cerca de Puerto Pirámides, en Península Valdés. En el mar saltan las ballenas francas australes. En el vuelo por la Patagonia, el ala se raspó en dos lugares. {name} ayuda a Nina a copiar los parches.|La Golondrina lands near Puerto Pirámides, on Península Valdés. Southern right whales jump in the sea. On the flight through Patagonia, the wing got scratched in two places. {name} helps Nina copy the patches.',
  rewards:[
   'El parche rectangular, con sus cuatro esquinas rectas, encaja en el ala.|The rectangular patch, with its four right corners, fits the wing.',
   'Con los ángulos medidos, el parche con forma de paralelogramo también encaja.|With the angles measured, the parallelogram patch fits too.',
  ], pieces:2,
 },
 'G04-12-L02': {
  title:'Una caja para las postales|A box for the postcards',
  introduction:'En la excursión de ballenas, {name} recibe postales en una caja con forma de cubo. Para que llegue sana al aeroclub, hay que reforzarla.|On the whale-watching trip, {name} is given postcards in a cube-shaped box. To get it safely to the aeroclub, it must be reinforced.',
  rewards:[
   'La cinta cubre las 12 aristas de la caja.|The tape covers all 12 edges of the box.',
   'Cada esquina tiene su protector. ¡La caja está lista para el viaje!|Every corner has its protector. The box is ready for the trip!',
  ], pieces:2,
 },
 'G04-12-L03': {
  title:'Regalos para el aeroclub|Gifts for the aeroclub',
  introduction:'Antes de volver a casa, Nina y {name} arman cajas de cartón para llevar regalos a los amigos del aeroclub. Primero dibujan las redes.|Before going home, Nina and {name} make cardboard boxes to take gifts to their aeroclub friends. First they draw the nets.',
  rewards:[
   'La red de seis cuadrados queda recortada.|The six-square net is cut out.',
   '¡Etapa completa! Las cajas quedan dobladas y sin huecos. La Golondrina despega rumbo a casa.|Stage complete! The boxes are folded with no gaps. La Golondrina takes off for home.',
  ], pieces:2,
 },
 'G04-13-L01': {
  title:'La encuesta del cartel|The poster survey',
  introduction:'La Golondrina vuelve al Aeroclub El Ceibo. Falta una semana para el festival, y el cartel va a mostrar el viaje. ¿Qué lugar va en la foto más grande? {name} les pregunta a los chicos del aeroclub.|La Golondrina is back at Aeroclub El Ceibo. The festival is one week away, and the poster will show the trip. Which place gets the biggest photo? {name} asks the aeroclub kids.',
  rewards:[
   'La tabla se corrige: cada respuesta aparece una sola vez.|The table is corrected: each answer appears only once.',
   'El cartel dice: «Elegido por los chicos del aeroclub».|The poster says: “Chosen by the aeroclub kids.”',
  ], pieces:2,
 },
 'G04-13-L02': {
  title:'El pictograma del hangar|The hangar pictograph',
  introduction:'Para que todos vean los resultados, {name} y Nina dibujan un pictograma en la pared del hangar. Cada estrella vale más de un voto.|So everyone can see the results, {name} and Nina draw a pictograph on the hangar wall. Each star is worth more than one vote.',
  rewards:[
   'La fila de cinco estrellas queda leída: 10 votos.|The five-star row is read: 10 votes.',
   'La fila de 8 votos queda con sus 4 estrellas. ¡El pictograma está terminado!|The 8-vote row gets its 4 stars. The pictograph is finished!',
  ], pieces:2,
 },
 'G04-13-L03': {
  title:'El gráfico del cartel|The poster chart',
  introduction:'El cartel del festival lleva un gráfico de barras con los votos. {name} dibuja el eje y revisa qué dicen las barras.|The festival poster has a bar chart of the votes. {name} draws the axis and checks what the bars say.',
  rewards:[
   'El eje queda parejo: 0, 2, 4, 6, 8.|The axis is even: 0, 2, 4, 6, 8.',
   '¡Etapa completa! El cartel muestra Iguazú en la foto más grande, con el glaciar y las ballenas al lado: «la mitad de los votos».|Stage complete! The poster shows Iguazú in the biggest photo, with the glacier and the whales beside it: “half of the votes.”',
  ], pieces:2,
 },
 'G04-14-L01': {
  title:'Postales del viaje|Postcards of the trip',
  introduction:'El festival del aeroclub está por empezar. Hay un presupuesto de juego de 1.200 unidades para postales del viaje. Nina le pide a {name} que revise cada cuenta.|The aeroclub festival is about to start. There is a play budget of 1,200 units for postcards of the trip. Nina asks {name} to check every calculation.',
  rewards:[
   '50 postales quedan junto al libro de visitas.|50 postcards are placed by the visitors’ book.',
   'Con las 80 unidades que sobran se compran globos.|The 80 units left over buy balloons.',
  ], pieces:2,
 },
 'G04-14-L02': {
  title:'¡Bienvenidos al festival!|Welcome to the festival!',
  introduction:'Llegan los visitantes. Los voluntarios acomodan sillas y reparten postales, pero algunas cuentas tienen errores. {name} los encuentra y los repara.|The visitors arrive. The volunteers set out chairs and hand out postcards, but some calculations have mistakes. {name} finds and repairs them.',
  rewards:[
   'Hay 384 sillas: alcanzan para todos.|There are 384 chairs: enough for everyone.',
   '¡El festival empieza! Las 80 postales se reparten en dos mitades de 40, una a cada lado del hangar.|The festival begins! The 80 postcards are shared in two halves of 40, one on each side of the hangar.',
  ], pieces:2,
 },
};


export interface PlaneMission {
 id: string; packageId: string; chapterId: string;
 title: LocalizedText; introduction: LocalizedText; scene: PlaneSceneState;
 objective: LocalizedText; checks: (typeof GRADE_FOUR_LESSONS)[number]['checks']; rewards: LocalizedText[];
}

const chapterOf = (packageId: string) => {
 const index = chapterDefinitions.findIndex(c => c.packages.includes(packageId));
 if (index < 0) throw new Error(`Missing plane chapter for ${packageId}`);
 return index;
};

let piecesSoFar = 0;
const chapterPieces: number[] = [];
export const PLANE_MISSIONS: PlaneMission[] = GRADE_FOUR_LESSONS.map(lesson => {
 const chapterIndex = chapterOf(lesson.packageId);
 const chapter = chapterDefinitions[chapterIndex];
 const story = STORY[lesson.id];
 if (!story) throw new Error(`Missing plane story for ${lesson.id}`);
 if (story.rewards.length !== lesson.checks.length) throw new Error(`Rewards must match checks for ${lesson.id}`);
 // Hangar parts are numbered across chapters 1–4; journey parts restart in each chapter.
 const hangar = chapter.scene.kind === 'hangar';
 const scene: PlaneSceneState = {...chapter.scene, before: hangar ? piecesSoFar : (chapterPieces[chapterIndex] ?? 0)};
 if (story.pieces) {
  if (hangar) piecesSoFar += story.pieces;
  else chapterPieces[chapterIndex] = (chapterPieces[chapterIndex] ?? 0) + story.pieces;
 }
 return {
  id: lesson.id, packageId: lesson.packageId, chapterId: `plane-${chapterIndex + 1}`,
  title: text(story.title),
  introduction: text(story.introduction),
  scene, objective: lesson.objective, checks: lesson.checks,
  rewards: story.rewards.map(text),
 };
});

export const PLANE_CHAPTERS = chapterDefinitions.map((chapter, i) => ({
 id: `plane-${i + 1}`, packages: chapter.packages, icon: chapter.icon, title: text(chapter.title), opening: text(chapter.opening),
 scene: chapter.scene, missions: PLANE_MISSIONS.filter(m => m.chapterId === `plane-${i + 1}`),
}));

/** Numbered hangar parts placed by story missions (two per mission). */
export const PLANE_STORY_PIECES = piecesSoFar;
