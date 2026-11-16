import {GRADE_FIVE_LESSONS,GRADE_FIVE_PACKAGES} from './index';
import {text} from '../lessonModel';
export type MoonScene='hangar'|'hull'|'tank'|'cargo'|'console'|'launch'|'flight'|'landing'|'rover'|'research'|'home';
const definitions: [MoonScene,string,string,string,string,string,string[]][] = [
 [
  "hangar",
  "🧰",
  "Abrimos el hangar|Opening the hangar",
  "Revisá los cálculos para poner en marcha la grúa.|Check the calculations to start the crane.",
  "La grúa trae la base.|The crane delivers the base.",
  "La base está instalada.|The base is installed.",
  [
   "Abrimos el hangar|Opening the hangar",
   "El inventario del equipo|Team inventory",
   "La primera pieza|The first part"
  ]
 ],
 [
  "hull",
  "🚀",
  "Construimos el cohete|Building the rocket",
  "Explorá fracciones para preparar las secciones del cohete.|Explore fractions to prepare the rocket sections.",
  "La sección está alineada.|The section is aligned.",
  "La sección encaja en el cohete.|The section fits the rocket.",
  [
   "Secciones del cohete|Rocket sections",
   "Unidades para construir|Building units",
   "Más de una sección|More than one section"
  ]
 ],
 [
  "tank",
  "🔧",
  "Conectamos los sistemas|Connecting systems",
  "Comprobá equivalencias para conectar los depósitos.|Check equivalences to connect the tanks.",
  "El depósito está conectado.|The tank is connected.",
  "El indicador del sistema se enciende.|The system indicator lights up.",
  [
   "Piezas equivalentes|Equivalent parts",
   "Conectores a medida|Matching connectors",
   "Simplificá el plano|Simplify the plan"
  ]
 ],
 [
  "tank",
  "⚖",
  "Comprobamos los depósitos|Checking the tanks",
  "Compará las cantidades antes de aprobar los sistemas.|Compare quantities before approving the systems.",
  "El depósito está conectado.|The tank is connected.",
  "El indicador del sistema se enciende.|The system indicator lights up.",
  [
   "Compará las reservas|Compare reserves",
   "Una referencia común|A common reference",
   "Orden en el tablero|Control panel order"
  ]
 ],
 [
  "cargo",
  "📦",
  "Cargamos las provisiones|Loading supplies",
  "Calculá cantidades y restos para preparar la carga.|Calculate quantities and remainders to prepare the cargo.",
  "Las provisiones llegan a la compuerta.|Supplies reach the hatch.",
  "La carga entra y la compuerta se cierra.|Cargo goes inside and the hatch closes.",
  [
   "Sumá las provisiones|Add the supplies",
   "Combiná las medidas|Combine measurements",
   "Revisá lo que queda|Check what remains"
  ]
 ],
 [
  "console",
  "🎛",
  "Calibramos los instrumentos|Calibrating instruments",
  "Leé los decimales para activar el tablero de vuelo.|Read decimals to activate the flight console.",
  "El monitor se enciende.|The monitor switches on.",
  "La antena transmite la señal.|The antenna transmits the signal.",
  [
   "El tablero decimal|The decimal console",
   "Ceros importantes|Important zeros",
   "Compará las lecturas|Compare readings"
  ]
 ],
 [
  "console",
  "📡",
  "Últimos controles|Final checks",
  "Relacioná fracciones y decimales antes del despegue.|Connect fractions and decimals before liftoff.",
  "El monitor se enciende.|The monitor switches on.",
  "La antena transmite la señal.|The antenna transmits the signal.",
  [
   "Dos formas de medir|Two ways to measure",
   "Lecturas equivalentes|Equivalent readings",
   "Elegí la representación|Choose the representation"
  ]
 ],
 [
  "launch",
  "🔥",
  "¡Despegamos!|Liftoff!",
  "Completá los cálculos del simulador para avanzar en el lanzamiento.|Complete the simulator calculations to advance the launch.",
  "Los motores están encendidos.|The engines are on.",
  "¡El cohete despega!|The rocket lifts off!",
  [
   "Encendé los motores|Start the engines",
   "Dejamos la plataforma|Leaving the pad",
   "Rumbo al espacio|Heading into space"
  ]
 ],
 [
  "flight",
  "🌎",
  "Camino a la Luna|On the way to the Moon",
  "Elegí estrategias para completar los controles de vuelo.|Choose strategies to complete the flight checks.",
  "La nave orienta sus paneles.|The spacecraft aligns its panels.",
  "La nave se acerca a la Luna.|The spacecraft approaches the Moon.",
  [
   "El plan de vuelo|The flight plan",
   "Revisá la trayectoria|Check the trajectory",
   "La Luna a la vista|Moon in sight"
  ]
 ],
 [
  "landing",
  "🌕",
  "Aterrizamos|Landing",
  "Investigá figuras y redes para preparar el módulo lunar.|Investigate shapes and nets to prepare the lunar module.",
  "Las patas de aterrizaje se despliegan.|The landing legs unfold.",
  "¡El módulo aterriza en la Luna!|The module lands on the Moon!",
  [
   "El módulo lunar|The lunar module",
   "Piezas que cierran|Parts that close",
   "Contacto con la Luna|Lunar touchdown"
  ]
 ],
 [
  "rover",
  "🔬",
  "Laboratorio lunar|Lunar laboratory",
  "Comprobá medidas para transportar las muestras.|Check measurements to transport the samples.",
  "La muestra está en el explorador.|The sample is in the rover.",
  "El explorador lleva la muestra al laboratorio.|The rover carries the sample to the lab.",
  [
   "Preparamos los instrumentos|Preparing instruments",
   "Medidas de las muestras|Sample measurements",
   "Medir con cuidado|Measure carefully"
  ]
 ],
 [
  "research",
  "📊",
  "Compartimos descubrimientos|Sharing discoveries",
  "Organizá datos y conclusiones para transmitir el informe.|Organize data and conclusions to transmit the report.",
  "El informe aparece en la pantalla.|The report appears on screen.",
  "La antena envía el informe a la Tierra.|The antenna sends the report to Earth.",
  [
   "El registro de la misión|The mission record",
   "Organizá los resultados|Organize the results",
   "Un informe para la Tierra|A report for Earth"
  ]
 ],
 [
  "home",
  "🎉",
  "Volvemos a casa|Coming home",
  "Planificá la bienvenida del equipo con recetas y un presupuesto.|Plan the team welcome with recipes and a budget.",
  "La cápsula regresa bajo su paracaídas.|The capsule returns under its parachute.",
  "¡El equipo está en casa y la bienvenida está lista!|The team is home and the welcome is ready!",
  [
   "La bienvenida del equipo|Welcoming the team",
   "¡Misión cumplida!|Mission accomplished!"
  ]
 ]
];
export const MOON_CHAPTERS=GRADE_FIVE_PACKAGES.map((p,i)=>{
 const [scene,icon,title,introduction,firstReward,lastReward,titles]=definitions[i];
 const lessons=GRADE_FIVE_LESSONS.filter(l=>l.packageId===p.id);
 if(lessons.length!==titles.length)throw new Error(`Incomplete Moon chapter ${p.id}`);
 return {id:p.id,icon,title:text(title),missions:lessons.map((lesson,j)=>({id:lesson.id,packageId:p.id,scene,title:text(titles[j]),introduction:text(introduction),objective:lesson.objective,checks:lesson.checks,rewards:lesson.checks.map((_,k)=>text(k===lesson.checks.length-1?lastReward:firstReward))}))};
});
export const MOON_MISSIONS=MOON_CHAPTERS.flatMap(chapter=>chapter.missions);
