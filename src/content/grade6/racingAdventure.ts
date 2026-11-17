import { GRADE_SIX_LESSONS } from './index';
import { text } from '../lessonModel';
import type { LocalizedText } from '../../math/core/types';

// Grade 6 story: Math Racing. The hero is the rookie driver of the race car
// Chispa (Escudería Pampa) in the fictional Copa Mundoki: a preseason, six
// Grands Prix across Argentina, and the Grand Final. Friendly rival: Nico
// Viento (team Viento Sur). Scenario: docs/grade-6-racing-scenario.md.
//
// Every check in numbers.ts, rational.ts, proportions.ts, space.ts and data.ts
// is a race decision; rewards[i] is shown after checks[i] and names the effect
// that answer has on the race. `{name}` (the chosen hero) is allowed only in
// introductions, rewards, and the epilogue, which render through HeroText.
// Keep the Spanish around `{name}` gender-neutral: `text()` splits on `|`.

export type RaceSceneKind = 'garage' | 'river' | 'andes' | 'sierras' | 'jungle' | 'wind' | 'night' | 'final';
export type RaceEffect = 'boost' | 'turbo' | 'route' | 'upgrade' | 'pit' | 'slipstream' | 'telemetry' | 'position' | 'points';

export const RACE_EFFECTS: Record<RaceEffect, { icon: string; label: LocalizedText }> = {
 boost: { icon: '⚡', label: text('Acelerón|Boost') },
 turbo: { icon: '🔥', label: text('Turbo|Turbo') },
 route: { icon: '🛣️', label: text('Ruta alternativa|Alternative route') },
 upgrade: { icon: '🔧', label: text('Mejora|Upgrade') },
 pit: { icon: '⏱️', label: text('Boxes|Pit stop') },
 slipstream: { icon: '🌀', label: text('Rebufo|Slipstream') },
 telemetry: { icon: '📡', label: text('Telemetría|Telemetry') },
 position: { icon: '🏁', label: text('Posición|Position') },
 points: { icon: '🏆', label: text('Puntos|Points') },
};

// Car parts shown in Chispa's garage. Each part is installed by exactly one
// upgrade reward (the third element of a reward in STORY).
export type RacePart = 'wheel' | 'chassis' | 'telemetry' | 'warmers' | 'number' | 'spare' | 'cooling' | 'wing' | 'brakes' | 'engine' | 'rainTires' | 'rearWing' | 'driver';
export const RACE_PARTS: Record<RacePart, LocalizedText> = {
 wheel: text('Volante|Steering wheel'), chassis: text('Chasis|Chassis'), telemetry: text('Antena de telemetría|Telemetry antenna'),
 warmers: text('Calentadores de neumáticos|Tire warmers'), number: text('Número 23|Number 23'), spare: text('Rueda de auxilio|Spare wheel'),
 cooling: text('Radiadores|Radiators'), wing: text('Alerón delantero|Front wing'), brakes: text('Frenos|Brakes'),
 engine: text('Motor reconstruido|Rebuilt engine'), rainTires: text('Neumáticos de lluvia|Rain tires'), rearWing: text('Alerón trasero|Rear wing'),
 driver: text('Mejora de piloto|Driver upgrade'),
};

/** Result of the last-lap duel with Nico that closes each chapter (story-fixed). */
export type RaceDuelResult = 'solo' | 'ahead' | 'behind' | 'tie';
export interface RaceReward { effect: RaceEffect; text: LocalizedText; part?: RacePart }
export interface RaceMission {
 id: string;
 packageId: string;
 scene: RaceSceneKind;
 /** Position of this mission inside its chapter: step of steps. */
 step: number;
 steps: number;
 title: LocalizedText;
 introduction: LocalizedText;
 rewards: RaceReward[];
 checks: (typeof GRADE_SIX_LESSONS)[number]['checks'];
}
export interface RaceChapter {
 id: string;
 icon: string;
 scene: RaceSceneKind;
 packages: string[];
 title: LocalizedText;
 opening: LocalizedText;
 duel: { result: RaceDuelResult; text: LocalizedText };
 missions: RaceMission[];
}

const chapterDefinitions: { id: RaceSceneKind; icon: string; packages: string[]; title: string; opening: string; duel: [RaceDuelResult, string] }[] = [
 { id: 'garage', icon: '🔧', packages: ['G06-01'], title: 'Pretemporada en la Escudería Pampa|Preseason at the Escudería Pampa',
  opening: 'Chispa todavía no tiene volante ni número. En una semana es la clasificación.|Chispa has no steering wheel or number yet. Qualifying is in one week.',
  duel: ['solo', 'Vuelta de clasificación: Chispa sale sola a la pista y marca un buen tiempo. Nico aplaude desde los boxes: {name} entra en la Copa.|Qualifying lap: Chispa goes out alone and sets a good time. Nico applauds from the pits: {name} is in the Copa.'] },
 { id: 'river', icon: '🌉', packages: ['G06-02', 'G06-03'], title: 'Gran Premio del Río|River Grand Prix',
  opening: 'Un circuito callejero junto al río, en Buenos Aires: curvas cerradas y paradas en boxes que deciden todo.|A street circuit by the river in Buenos Aires: tight corners and pit stops that decide everything.',
  duel: ['behind', 'Última curva junto al río: Chispa usa el rebufo, pero Nico cierra la puerta. Medio auto de diferencia: segundo puesto.|Last corner by the river: Chispa uses the slipstream, but Nico closes the door. Half a car apart: second place.'] },
 { id: 'andes', icon: '🏔️', packages: ['G06-04', 'G06-05'], title: 'Gran Premio de los Andes|Andes Grand Prix',
  opening: 'Una subida larga hasta un paso de montaña cerca de Mendoza. Aire frío y la batería al límite.|A long climb to a mountain pass near Mendoza. Cold air and the battery at its limit.',
  duel: ['ahead', 'Recta final después de la bajada: cuatro ráfagas de turbo y Chispa pasa a Nico por una nariz.|Final straight after the descent: four turbo bursts, and Chispa passes Nico by a nose.'] },
 { id: 'sierras', icon: '🌄', packages: ['G06-06', 'G06-07'], title: 'Gran Premio de las Sierras|Sierras Grand Prix',
  opening: 'Un circuito rápido en las sierras de Córdoba. Chispa necesita piezas nuevas y un buen plan.|A fast circuit in the hills of Córdoba. Chispa needs new parts and a good plan.',
  duel: ['ahead', 'Nico entra a boxes una vuelta tarde. Chispa ya hizo su parada perfecta y se escapa.|Nico pits one lap too late. Chispa has already made its perfect stop and pulls away.'] },
 { id: 'jungle', icon: '🌧️', packages: ['G06-08'], title: 'Gran Premio de la Selva|Jungle Grand Prix',
  opening: 'Lluvia tropical en Misiones, cerca de las Cataratas del Iguazú. El tablero muestra todo en porcentajes.|Tropical rain in Misiones, near the Iguazú Falls. The dashboard shows everything in percent.',
  duel: ['ahead', 'Bajo la tormenta, los neumáticos de lluvia agarran mejor. Chispa termina delante de Nico.|In the storm, the rain tires grip better. Chispa finishes ahead of Nico.'] },
 { id: 'wind', icon: '🌬️', packages: ['G06-09', 'G06-10'], title: 'Gran Premio del Viento|Wind Grand Prix',
  opening: 'La estepa de Patagonia, con viento fuerte del oeste. Este circuito tiene rutas alternativas.|The Patagonian steppe, with strong wind from the west. This circuit has alternative routes.',
  duel: ['ahead', 'Nico sigue por la ruta principal; Chispa toma la ruta alternativa de 300 m y sale primera.|Nico stays on the main route; Chispa takes the 300 m alternative route and comes out first.'] },
 { id: 'night', icon: '🌙', packages: ['G06-11', 'G06-12'], title: 'Gran Premio del Fin del Mundo|End of the World Grand Prix',
  opening: 'Carrera nocturna en Ushuaia, la ciudad más austral. De noche, el equipo corre con gráficos y datos.|A night race in Ushuaia, the southernmost city. At night, the team races with graphs and data.',
  duel: ['tie', 'Los dos autos cruzan la meta juntos. La foto final no los separa: empate en el campeonato.|Both cars cross the line together. The photo finish cannot separate them: the championship is level.'] },
 { id: 'final', icon: '🏆', packages: ['G06-13'], title: 'La Gran Final|The Grand Final',
  opening: 'De vuelta en Buenos Aires. Chispa y Viento Sur llegan empatados: todo se decide en una carrera.|Back in Buenos Aires. Chispa and Viento Sur arrive level: everything is decided in one race.',
  duel: ['ahead', 'Última recta de la temporada: súper turbo, y Chispa gana por centímetros. ¡La Copa Mundoki es para {name}!|The season’s last straight: super turbo, and Chispa wins by centimeters. {name} is the Copa Mundoki champion!'] },
];

type Reward = [RaceEffect, string] | [RaceEffect, string, RacePart];
interface MissionDefinition { title: string; introduction: string; rewards: [Reward, Reward] }

const STORY: Record<string, MissionDefinition> = {
 // Chapter 1 — Preseason.
 'G06-01-L01': { title: 'Créditos para el volante|Credits for the steering wheel',
  introduction: '{name} entra por primera vez al garaje de la Escudería Pampa. Bajo una lona espera Chispa, el bólido del equipo. Faltan el volante y el chasis. Marga, la ingeniera, muestra el tablero de créditos.|{name} enters the Escudería Pampa garage for the first time. Under a cover waits Chispa, the team’s race car. The steering wheel and the chassis are missing. Marga, the race engineer, shows the credits board.',
  rewards: [['upgrade', 'Pocho paga con seis fichas de 100: ¡Chispa tiene volante nuevo!|Pocho pays with six 100-chips: Chispa has a new steering wheel!', 'wheel'], ['upgrade', 'Llegan 100 bolsas de tornillos: el chasis queda armado.|100 bags of bolts arrive: the chassis is assembled.', 'chassis']] },
 'G06-01-L02': { title: 'Números romanos en el paddock|Roman numerals in the paddock',
  introduction: 'La primera prueba es en un circuito histórico, donde los boxes y la grilla usan números romanos. Nico Viento, el piloto rival, saluda desde su auto azul: «¡Bienvenidos a la Copa!».|The first test is at a historic circuit, where the pit boxes and the grid use Roman numerals. Nico Viento, the rival driver, waves from his blue car: “Welcome to the Copa!”',
  rewards: [['position', 'El camión del equipo estaciona en el box 25.|The team truck parks at box 25.'], ['position', '{name} larga en el puesto 4, no en el 6. Nico levanta el pulgar.|{name} starts in position 4, not 6. Nico gives a thumbs-up.']] },
 'G06-01-L03': { title: 'Telemetría y simulador|Telemetry and simulator',
  introduction: 'Faltan pocos días para la clasificación. Marga conecta la telemetría y {name} practica en el simulador.|Qualifying is only days away. Marga connects the telemetry and {name} practices in the simulator.',
  rewards: [['telemetry', 'La pantalla de Marga muestra los datos de Chispa en vivo.|Marga’s screen shows Chispa’s data live.', 'telemetry'], ['points', '350 Wh de práctica: {name} ya conoce cada curva. ¡Chispa clasifica para la Copa!|350 Wh of practice: {name} knows every corner now. Chispa qualifies for the Copa!']] },
 // Chapter 2 — River Grand Prix.
 'G06-02-L01': { title: 'Equipos de boxes|Pit crews',
  introduction: 'Primera carrera de la Copa. Las curvas son cerradas y las paradas en boxes deciden todo. Llegan voluntarios para ayudar al equipo de {name}.|First race of the Copa. The corners are tight and pit stops decide everything. Volunteers arrive to help {name}’s team.',
  rewards: [['pit', 'Se forman cuatro equipos completos con chalecos amarillos.|Four complete crews form in yellow vests.'], ['pit', 'Quedan los equipos de 7: nadie espera sin tarea.|The crews of 7 stay: nobody waits without a job.']] },
 'G06-02-L02': { title: 'La estrategia de vueltas|The lap strategy',
  introduction: 'Marga y {name} planifican la carrera: cuándo parar en boxes y cuándo probar el turbo.|Marga and {name} plan the race: when to pit and when to test the turbo.',
  rewards: [['pit', 'Plan listo: 3 tandas de 6 vueltas y 2 paradas.|Plan ready: 3 stints of 6 laps and 2 stops.'], ['turbo', 'En la vuelta 45 de la práctica, {name} prueba el turbo: ¡funciona!|On practice lap 45, {name} tests the turbo: it works!']] },
 'G06-02-L03': { title: 'Calentadores de neumáticos|Tire warmers',
  introduction: 'Con neumáticos fríos, Chispa resbala en la largada. Pocho, el mecánico, instala calentadores y {name} revisa los tornillos.|With cold tires, Chispa slides at the start. Pocho, the mechanic, fits tire warmers and {name} checks the bolts.',
  rewards: [['upgrade', 'Calentadores instalados: neumáticos tibios para largar.|Tire warmers installed: warm tires for the start.', 'warmers'], ['upgrade', 'Se usa el soporte de 3: no queda ningún tornillo suelto.|The 3-bolt rack is used: no bolt is left loose.']] },
 'G06-03-L01': { title: 'El número de Chispa|Chispa’s number',
  introduction: 'Los autos de novatos llevan un número primo. {name} elige el número para Chispa, y Nico muestra el suyo.|Rookie cars carry a prime number. {name} picks Chispa’s number, and Nico shows his.',
  rewards: [['upgrade', 'El 21 no sirve. {name} elige el 23, que solo se divide por 1 y por 23. ¡El número ya está pintado!|21 won’t do. {name} picks 23, which divides only by 1 and 23. The number is painted on!', 'number'], ['position', 'El número 2 de Nico es válido. Los dos pilotos se dan la mano.|Nico’s number 2 is valid. The two drivers shake hands.']] },
 'G06-03-L02': { title: 'Kits para el equipo|Kits for the team',
  introduction: 'La carrera es larga y hace calor. {name} arma kits iguales de agua y comida para el equipo de boxes.|The race is long and hot. {name} makes identical kits of water and food for the pit crew.',
  rewards: [['pit', 'Se arman 8 kits, uno para cada mecánico.|8 kits are made, one for each mechanic.'], ['pit', 'Cada kit tiene 2 botellas y 3 barras. ¡Las paradas son más rápidas!|Each kit has 2 bottles and 3 bars. The stops get faster!']] },
 'G06-03-L03': { title: 'Rebufo en la vuelta 24|Slipstream on lap 24',
  introduction: 'Últimas vueltas. Chispa persigue al auto azul de Nico. Para pasarlo, la batería y el sensor de rebufo tienen que estar listos a la vez.|Final laps. Chispa chases Nico’s blue car. To pass it, the battery and the slipstream sensor must be ready at the same time.',
  rewards: [['slipstream', 'Vuelta 24: Chispa se pega detrás de Nico y dispara el turbo.|Lap 24: Chispa tucks in behind Nico and fires the turbo.'], ['points', '¡Bandera a cuadros! {name} termina en el puesto 2, justo detrás de Nico.|Chequered flag! {name} finishes in position 2, just behind Nico.']] },
 // Chapter 3 — Andes Grand Prix.
 'G06-04-L01': { title: 'Energía para la subida|Energy for the climb',
  introduction: 'Segunda carrera: los Andes. La subida al paso de montaña es larga. Marga avisa por radio: «Acá decide la batería».|Second race: the Andes. The climb to the mountain pass is long. Marga says over the radio: “Here the battery decides.”',
  rewards: [['boost', 'Plan de energía cargado: 2/5 de paquete para cada tramo.|Energy plan loaded: 2/5 of a pack for each section.'], ['upgrade', 'Los equipos se turnan con ruedas enteras. Chispa guarda una rueda de auxilio completa.|The teams take turns with whole wheels. Chispa keeps a complete spare wheel.', 'spare']] },
 'G06-04-L02': { title: 'Refrigerante para el motor|Coolant for the engine',
  introduction: 'En la subida, el motor se calienta. Pocho llena los radiadores y {name} controla las cuentas.|On the climb, the engine heats up. Pocho fills the radiators and {name} checks the numbers.',
  rewards: [['upgrade', 'Radiadores llenos: el motor no se recalienta.|Radiators full: the engine will not overheat.', 'cooling'], ['telemetry', 'El control de Marga se pone en verde: 3 × 5/3 = 5 L.|Marga’s check turns green: 3 × 5/3 = 5 L.']] },
 'G06-04-L03': { title: 'El tablero en decimales|The dashboard in decimals',
  introduction: 'El tablero de Chispa solo muestra decimales. {name} traduce las fracciones del plan.|Chispa’s dashboard shows only decimals. {name} translates the plan’s fractions.',
  rewards: [['telemetry', 'Tablero calibrado: la batería marca 0,625.|Dashboard calibrated: the battery shows 0.625.'], ['position', '{name} frena un poco antes de la curva y pasa limpio.|{name} brakes a little early and takes the corner cleanly.']] },
 'G06-05-L01': { title: 'La subida empinada|The steep climb',
  introduction: 'La etapa de montaña sube y sube. {name} calcula cuánta energía guardar.|The mountain stage climbs and climbs. {name} works out how much energy to save.',
  rewards: [['boost', 'Energía guardada para los 14 km de subida.|Energy saved for the 14 km climb.'], ['turbo', 'Quedan 7 kWh: ¡turbo en la cima del paso!|7 kWh are left: turbo at the top of the pass!']] },
 'G06-05-L02': { title: 'El tanque de turbo|The turbo tank',
  introduction: 'El turbo funciona con un líquido especial, y el reglamento limita cuánto se puede usar.|The turbo runs on a special fluid, and the rules limit how much can be used.',
  rewards: [['turbo', 'Chispa usa 1/3 L de turbo en la subida, dentro del reglamento.|Chispa uses 1/3 L of turbo on the climb, within the rules.'], ['turbo', 'Seis marcas de turbo se encienden en el tablero.|Six turbo marks light up on the dashboard.']] },
 'G06-05-L03': { title: 'Bajada y recta final|Descent and final straight',
  introduction: 'Después de la cima vienen una bajada rápida y la recta final. Nico está muy cerca.|After the summit come a fast descent and the final straight. Nico is very close.',
  rewards: [['boost', 'Los frenos recuperan energía en cada curva de la bajada.|The brakes recover energy at every bend of the descent.'], ['points', '¡Cuatro ráfagas de turbo! {name} gana por una nariz.|Four turbo bursts! {name} wins by a nose.']] },
 // Chapter 4 — Sierras Grand Prix.
 'G06-06-L01': { title: 'Aletas para el alerón|Fins for the wing',
  introduction: 'Tercera carrera: las sierras de Córdoba. Después de los Andes, Chispa necesita piezas nuevas. Marga abre el catálogo de repuestos.|Third race: the hills of Córdoba. After the Andes, Chispa needs new parts. Marga opens the parts catalogue.',
  rewards: [['upgrade', 'Alerón nuevo: Chispa dobla más rápido.|New wing: Chispa corners faster.', 'wing'], ['upgrade', 'Marga compra en la primera tienda, sin envío fijo.|Marga buys from the first shop, with no fixed delivery.']] },
 'G06-06-L02': { title: 'Frenos nuevos|New brakes',
  introduction: 'Al final de cada recta larga hay que frenar fuerte. El equipo compra frenos y cinta para la carrocería.|At the end of each long straight, hard braking is needed. The team buys brakes and bodywork tape.',
  rewards: [['upgrade', 'Frenos nuevos: {name} puede frenar más tarde.|New brakes: {name} can brake later.', 'brakes'], ['upgrade', 'El catálogo muestra el precio correcto: 4 créditos por metro.|The catalogue shows the right price: 4 credits per meter.']] },
 'G06-06-L03': { title: 'El gráfico de energía|The energy graph',
  introduction: 'Para la clasificación, Marga dibuja cuánta energía gasta Chispa según los kilómetros.|For qualifying, Marga graphs how much energy Chispa uses by kilometer.',
  rewards: [['telemetry', 'El gráfico de energía aparece en el muro de boxes.|The energy graph appears on the pit wall.'], ['boost', 'El gráfico es confiable: {name} usa la energía que sobra en un acelerón.|The graph is reliable: {name} uses the spare energy for a boost.']] },
 'G06-07-L01': { title: 'El motor en una noche|The engine overnight',
  introduction: 'Un ruido raro: hay que reconstruir el motor antes de mañana. ¿Cuántos mecánicos hacen falta?|A strange noise: the engine must be rebuilt before tomorrow. How many mechanics are needed?',
  rewards: [['upgrade', 'Tres mecánicos trabajan juntos: el motor está listo a la mañana.|Three mechanics work together: the engine is ready by morning.', 'engine'], ['upgrade', 'Marga le da a cada mecánico una parte distinta del motor.|Marga gives each mechanic a different part of the engine.']] },
 'G06-07-L02': { title: 'Modo ahorro|Saving mode',
  introduction: 'Anuncian que la carrera será más larga. La energía total no cambia: hay que repartirla de nuevo.|The race will be longer. The total energy does not change: it must be shared again.',
  rewards: [['boost', 'Modo ahorro activado: Chispa llega al final de la carrera.|Saving mode on: Chispa reaches the end of the race.'], ['telemetry', 'El error se corrige y la estrategia vuelve a cargar.|The error is fixed and the strategy loads again.']] },
 'G06-07-L03': { title: 'Ritmo y tiempo|Pace and time',
  introduction: 'En plena carrera, Marga compara el ritmo de Chispa con los minutos de cada etapa.|Mid-race, Marga compares Chispa’s pace with the minutes of each stage.',
  rewards: [['position', '{name} lo entiende: más ritmo, menos tiempo. ¡Chispa ataca!|{name} gets it: faster pace, less time. Chispa attacks!'], ['points', 'Parada en la vuelta justa: ¡{name} gana con una parada perfecta!|A stop on exactly the right lap: {name} wins with a perfect pit stop!']] },
 // Chapter 5 — Jungle Grand Prix.
 'G06-08-L01': { title: 'El tablero en porcentajes|The dashboard in percent',
  introduction: 'Cuarta carrera: la selva de Misiones. Llueve fuerte y la tierra es roja. Nico avisa: «Con lluvia ganan los mejores neumáticos».|Fourth race: the Misiones jungle. It rains hard and the soil is red. Nico warns: “In the rain, the best tires win.”',
  rewards: [['telemetry', 'La estrategia se actualiza: batería 0,4.|The strategy updates: battery 0.4.'], ['upgrade', 'Se eligen neumáticos de lluvia.|Rain tires are chosen.']] },
 'G06-08-L02': { title: 'Turbo y recargas|Turbo and pickups',
  introduction: 'Bajo la lluvia, cada ventaja cuenta. {name} calcula el turbo y elige una recarga de energía.|In the rain, every advantage counts. {name} works out the turbo and picks an energy pickup.',
  rewards: [['turbo', '¡Turbo! Chispa llega a 180 km/h en la recta.|Turbo! Chispa reaches 180 km/h on the straight.'], ['route', '{name} toma el carril de la recarga B: 40 unidades.|{name} takes the lane with pickup B: 40 units.']] },
 'G06-08-L03': { title: 'Descuento y distancia|Discount and distance',
  introduction: 'Antes de largar, el equipo compra neumáticos en la tienda del circuito. En carrera, el tablero muestra el avance en porcentaje.|Before the start, the team buys tires at the circuit shop. During the race, the board shows progress in percent.',
  rewards: [['upgrade', 'Neumáticos de lluvia puestos por 60 créditos.|Rain tires fitted for 60 credits.', 'rainTires'], ['points', 'Energía planeada para los 35 km que faltan: ¡{name} termina en el puesto 2 bajo la tormenta, Nico en el 3!|Energy planned for the remaining 35 km: {name} finishes in position 2 in the storm, Nico in 3!']] },
 // Chapter 6 — Wind Grand Prix.
 'G06-09-L01': { title: 'Baranda y piso del box|Barrier and box floor',
  introduction: 'Quinta carrera: Patagonia. El paddock está hecho de carpas y barandas, y el viento se lleva todo.|Fifth race: Patagonia. The paddock is made of tents and barriers, and the wind blows everything away.',
  rewards: [['pit', 'Baranda colocada: las herramientas ya no vuelan.|Barrier in place: the tools stop blowing away.'], ['pit', 'Piso antideslizante: el equipo se mueve más rápido.|Non-slip floor: the crew moves faster.']] },
 'G06-09-L02': { title: 'La carpa del equipo|The team tent',
  introduction: 'La carpa del equipo tiene un armario de herramientas en una esquina. Hay que cubrir el resto del piso con alfombras.|The team tent has a tool cabinet in one corner. The rest of the floor must be covered with mats.',
  rewards: [['pit', 'Llegan las alfombras justas.|Exactly enough mats arrive.'], ['pit', 'Pocho vuelve a cortar las piezas: el piso queda parejo.|Pocho recuts the pieces: the floor is flat.']] },
 'G06-09-L03': { title: 'El cargador solar|The solar charger',
  introduction: 'En Patagonia hay mucho sol y mucho viento. El equipo arma un cargador solar y elige una carpa.|Patagonia has lots of sun and lots of wind. The team builds a solar charger and picks a tent.',
  rewards: [['boost', 'El cargador más grande carga a Chispa más rápido.|The bigger charger charges Chispa faster.'], ['pit', 'La carpa de 3 × 4 necesita menos cerca y se arma antes de que el viento crezca.|The 3 × 4 tent needs less fence and goes up before the wind gets stronger.']] },
 'G06-10-L01': { title: 'La maqueta en el túnel|The model in the tunnel',
  introduction: 'Con tanto viento, Chispa necesita un alerón trasero mejor. El equipo prueba maquetas en un túnel de viento.|With so much wind, Chispa needs a better rear wing. The team tests models in a wind tunnel.',
  rewards: [['upgrade', 'Prueba válida: alerón trasero nuevo contra el viento.|Valid test: a new rear wing against the wind.', 'rearWing'], ['upgrade', 'La maqueta queda proporcional y los resultados son confiables.|The model stays proportional and the results are reliable.']] },
 'G06-10-L02': { title: 'La ruta alternativa|The alternative route',
  introduction: 'Este circuito tiene rutas alternativas. Solo pueden usarlas los equipos que calculan bien el mapa.|This circuit has alternative routes. Only teams that calculate the map correctly may use them.',
  rewards: [['route', '¡Ruta alternativa abierta! Mide 300 m.|Alternative route open! It is 300 m long.'], ['route', 'La navegación queda cargada en Chispa.|The navigation is loaded into Chispa.']] },
 'G06-10-L03': { title: 'El plano del box|The pit-box plan',
  introduction: '{name} dibuja el plano del box para los comisarios de la carrera.|{name} draws the pit-box plan for the race officials.',
  rewards: [['pit', 'Plano aprobado: el equipo recibe el box más cercano a la salida.|Plan approved: the team gets the box closest to the pit exit.'], ['points', '{name} toma la ruta alternativa en la última vuelta: ¡gana la carrera!|{name} takes the alternative route on the last lap: race won!']] },
 // Chapter 7 — End of the World Grand Prix.
 'G06-11-L01': { title: 'Pantallas del muro|Pit-wall screens',
  introduction: 'Sexta carrera: de noche en Ushuaia. Hace frío y el asfalto está mojado. Se ve poco, así que el equipo corre con gráficos.|Sixth race: night in Ushuaia. It is cold and the asphalt is wet. Little can be seen, so the team races with graphs.',
  rewards: [['pit', '{name} elige el neumático que pocos equipos usan: menos fila en boxes.|{name} picks the tire few teams use: a shorter queue in the pits.'], ['telemetry', 'El eje dice «desgaste de neumáticos (%)» y el gráfico se entiende.|The axis says “tire wear (%)” and the graph makes sense.']] },
 'G06-11-L02': { title: 'Tablero y votación|Board and vote',
  introduction: 'El público sigue la carrera en un tablero grande y vota el mejor sobrepaso de la noche.|The crowd follows the race on a big board and votes for the best overtake of the night.',
  rewards: [['position', 'El tablero muestra a Chispa en punta: 4 bloques.|The board shows Chispa in the lead: 4 blocks.'], ['points', 'El sobrepaso de {name} gana el premio, con una frase honesta.|{name}’s overtake wins the prize, with an honest claim.']] },
 'G06-11-L03': { title: 'El afiche engañoso|The misleading poster',
  introduction: 'Viento Sur pegó un afiche en el paddock. Parece que su auto es mucho más potente.|Viento Sur put up a poster in the paddock. Their car looks much more powerful.',
  rewards: [['position', '{name} no cambia nada del auto: la diferencia real es pequeña.|{name} changes nothing on the car: the real difference is small.'], ['pit', 'Marga corrige el gráfico, ve el desgaste real y pide la parada a tiempo.|Marga fixes the graph, sees the real wear, and calls the stop on time.']] },
 'G06-12-L01': { title: 'Batería equilibrada|Balanced battery',
  introduction: 'Con el frío, los módulos de la batería quedan desparejos. El equilibrador los nivela.|In the cold, the battery modules become uneven. The balancer levels them.',
  rewards: [['boost', 'Batería equilibrada: potencia pareja toda la noche.|Balanced battery: steady power all night.'], ['telemetry', 'Marga controla: 12 unidades antes y después.|Marga checks: 12 units before and after.']] },
 'G06-12-L02': { title: 'Ganancias del turbo|Turbo gains',
  introduction: 'Marga revisa cuánto tiempo ganó el turbo y cuánto duraron las paradas.|Marga reviews how much time the turbo gained and how long the stops took.',
  rewards: [['turbo', 'Marga planea el turbo con una media honesta: 4 décimas.|Marga plans the turbo with an honest mean: 4 tenths.'], ['pit', 'Se cambia el cronómetro roto.|The broken stopwatch is replaced.']] },
 'G06-12-L03': { title: 'Dos equipos de boxes|Two pit crews',
  introduction: 'Antes de la última parada, Marga compara las paradas de los dos equipos.|Before the last stop, Marga compares the two teams’ stops.',
  rewards: [['telemetry', 'Marga descubre una parada lenta escondida en la media de Viento Sur.|Marga finds a slow stop hidden in Viento Sur’s mean.'], ['points', 'Marga confía en su equipo parejo. ¡{name} y Nico llegan a la final con los mismos puntos!|Marga trusts her steady crew. {name} and Nico reach the final with equal points!']] },
 // Chapter 8 — The Grand Final.
 'G06-13-L01': { title: 'El simulador antes de la final|Simulator before the final',
  introduction: 'La Gran Final vuelve a Buenos Aires y los dos equipos están empatados. {name} repasa en el simulador.|The Grand Final returns to Buenos Aires and the two teams are level. {name} reviews in the simulator.',
  rewards: [['turbo', 'Turbo final reservado: 16 unidades.|Final turbo reserved: 16 units.'], ['upgrade', '{name} repasa borde y superficie: ¡mejora de piloto!|{name} reviews boundary and surface: driver upgrade!', 'driver']] },
 'G06-13-L02': { title: 'La zona de boxes de la final|The final pit area',
  introduction: 'La zona de boxes de la final es grande. Hay que organizarla para el equipo y para los fans.|The final’s pit area is large. It must be organized for the team and for the fans.',
  rewards: [['pit', 'La zona del equipo queda marcada: 180 m².|The team zone is marked: 180 m².'], ['pit', '12 kits listos: cada puesto del equipo está preparado.|12 kits ready: every crew position is prepared.']] },
 'G06-13-L03': { title: '¡La última vuelta!|The last lap!',
  introduction: 'Última vuelta de la Gran Final. Chispa y el auto azul de Nico van rueda a rueda.|Last lap of the Grand Final. Chispa and Nico’s blue car are wheel to wheel.',
  rewards: [['boost', 'Marga planea el último ataque con 60 unidades.|Marga plans the last attack with 60 units.'], ['points', '¡Súper turbo en la recta final! {name} gana la Copa Mundoki por centímetros.|Super turbo on the final straight! {name} wins the Copa Mundoki by centimeters.']] },
};

export const RACE_EPILOGUE = text('En el podio, {name} sube al primer escalón y Nico al segundo. Nico abraza a {name}: «La próxima temporada, revancha». Marga muestra la telemetría de toda la temporada: cada acelerón, cada mejora y cada ruta salió de una cuenta. Pocho se ríe: «A ojo, no. Con números, sí».|On the podium, {name} takes the top step and Nico the second. Nico hugs {name}: “Next season, a rematch.” Marga shows the whole season’s telemetry: every boost, every upgrade, and every route came from a calculation. Pocho laughs: “Not by eye. With numbers, yes.”');

export const RACE_CHAPTERS: RaceChapter[] = chapterDefinitions.map(chapter => {
 const lessons = GRADE_SIX_LESSONS.filter(lesson => chapter.packages.includes(lesson.packageId));
 return {
  id: chapter.id, icon: chapter.icon, scene: chapter.id, packages: chapter.packages,
  title: text(chapter.title), opening: text(chapter.opening),
  duel: { result: chapter.duel[0], text: text(chapter.duel[1]) },
  missions: lessons.map((lesson, step) => {
   const story = STORY[lesson.id];
   if (!story) throw new Error(`Missing racing mission: ${lesson.id}`);
   if (story.rewards.length !== lesson.checks.length) throw new Error(`Rewards do not match checks: ${lesson.id}`);
   return {
    id: lesson.id, packageId: lesson.packageId, scene: chapter.id, step, steps: lessons.length,
    title: text(story.title), introduction: text(story.introduction),
    rewards: story.rewards.map(([effect, reward, part]) => ({ effect, text: text(reward), ...(part ? { part } : {}) })),
    checks: lesson.checks,
   };
  }),
 };
});
export const RACE_MISSIONS: RaceMission[] = RACE_CHAPTERS.flatMap(chapter => chapter.missions);

/** Garage state when mission `index` opens: parts installed by earlier missions. */
export function racePartsBefore(index: number): RacePart[] {
 return RACE_MISSIONS.slice(0, index).flatMap(m => m.rewards.flatMap(r => r.part ? [r.part] : []));
}
/** Which stage (1-based chapter number) installs each part. */
export const RACE_PART_STAGE: Record<RacePart, number> = Object.fromEntries(
 RACE_CHAPTERS.flatMap((c, i) => c.missions.flatMap(m => m.rewards.flatMap(r => r.part ? [[r.part, i + 1]] : []))),
) as Record<RacePart, number>;
