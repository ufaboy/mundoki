import {GRADE_SEVEN_LESSONS,GRADE_SEVEN_PACKAGES} from './index';
import {text} from '../lessonModel';
export type ParkScene='archive'|'delivery'|'plan'|'modules'|'formula'|'geometry'|'paving'|'pavilion'|'trials'|'chance'|'opening';
const definitions:[ParkScene,string,string,string,string,string,string[]][]=[
 [
  "archive",
  "🗝",
  "Las llaves del parque|Keys to the park",
  "Revisá los registros del viejo complejo para encender el centro de diseño.|Check the old complex’s records to power up the design center.",
  "Las luces se encienden.|The lights switch on.",
  "El proyector muestra las zonas del parque.|The projector reveals the park zones.",
  [
   "Las llaves del viejo complejo|Keys to the old complex",
   "Revisá el archivo|Check the archive",
   "Una regla sospechosa|A suspicious rule"
  ]
 ],
 [
  "delivery",
  "📦",
  "Llegan los materiales|Materials arrive",
  "Calculá y verificá las cantidades para recibir los materiales.|Calculate and check quantities to receive the materials.",
  "El camión llega al depósito.|The truck reaches the storehouse.",
  "Los materiales están descargados.|The materials are unloaded.",
  [
   "Prepará el pedido|Prepare the order",
   "Combiná las provisiones|Combine supplies",
   "Revisá la entrega|Check the delivery"
  ]
 ],
 [
  "plan",
  "📐",
  "El plano del parque|The park plan",
  "Compará costos y escalas para preparar el diseño.|Compare costs and scales to prepare the design.",
  "El plano está sobre la mesa.|The plan is on the table.",
  "El diseño aparece en la maqueta.|The design appears on the model.",
  [
   "Compará proveedores|Compare suppliers",
   "El costo del diseño|The design cost",
   "De plano a maqueta|From plan to model"
  ]
 ],
 [
  "modules",
  "🧩",
  "El paseo modular|The modular walkway",
  "Buscá una regla para construir módulos que comparten lados.|Find a rule to build modules with shared sides.",
  "El primer módulo está colocado.|The first module is in place.",
  "La fila de módulos está conectada.|The row of modules is connected.",
  [
   "Construí el primer tramo|Build the first section",
   "Planeá una fila larga|Plan a long row",
   "Una regla para construir|A building rule"
  ]
 ],
 [
  "formula",
  "⚙",
  "Taller de fórmulas|Formula workshop",
  "Exploración opcional: ajustá las medidas de una estructura.|Optional exploration: adjust a structure’s dimensions.",
  "El marco está instalado.|The frame is installed.",
  "El panel de control está conectado.|The control panel is connected.",
  [
   "Qué podemos cambiar|What can we change",
   "Probá una medida|Test a measurement",
   "Del cálculo al gráfico|From calculation to graph"
  ]
 ],
 [
  "geometry",
  "🔺",
  "Estructuras que encajan|Structures that fit",
  "Comprobá ángulos y longitudes antes de montar las estructuras.|Check angles and lengths before assembling structures.",
  "Los soportes están colocados.|The supports are in place.",
  "El techo encaja sobre los soportes.|The roof fits onto the supports.",
  [
   "Ajustá las uniones|Adjust the joints",
   "El techo geométrico|The geometric roof",
   "¿Se puede construir?|Can we build it?"
  ]
 ],
 [
  "paving",
  "🌿",
  "Espacio para crecer|Room to grow",
  "Compará bordes y superficies para ampliar el parque.|Compare boundaries and areas to expand the park.",
  "El borde del patio está trazado.|The courtyard boundary is marked.",
  "El patio tiene su nuevo piso.|The courtyard has its new paving.",
  [
   "Ampliá el diseño|Enlarge the design",
   "Cuánto piso hace falta|How much paving do we need",
   "Dos patios distintos|Two different courtyards"
  ]
 ],
 [
  "pavilion",
  "🏗",
  "El pabellón de ciencias|The science pavilion",
  "Estudiá caras y volúmenes para montar el pabellón.|Study faces and volumes to assemble the pavilion.",
  "Las paredes están levantadas.|The walls are up.",
  "El pabellón está cerrado y listo.|The pavilion is enclosed and ready.",
  [
   "Piezas que se pliegan|Pieces that fold",
   "Cubrir o llenar|Cover or fill",
   "Compará los materiales|Compare materials"
  ]
 ],
 [
  "trials",
  "📊",
  "Pruebas con visitantes|Visitor trials",
  "Compará los registros de prueba antes de abrir el parque.|Compare trial records before opening the park.",
  "Los registros aparecen en pantalla.|The records appear on screen.",
  "Los visitantes entran a la zona de pruebas.|Visitors enter the trial area.",
  [
   "Leé las preferencias|Read the preferences",
   "Qué cuenta el promedio|What the average tells us",
   "Compará las experiencias|Compare experiences"
  ]
 ],
 [
  "chance",
  "🎲",
  "Laboratorio del azar|Chance laboratory",
  "Exploración opcional: distinguí lo posible de lo garantizado.|Optional exploration: distinguish possible from guaranteed.",
  "La mesa de experimentos está preparada.|The experiment table is ready.",
  "El panel de registro está conectado.|The recording panel is connected.",
  [
   "Resultados posibles|Possible outcomes",
   "La bolsa de fichas|The bag of counters",
   "Registrá los ensayos|Record the trials"
  ]
 ],
 [
  "opening",
  "🎉",
  "La feria de apertura|The opening fair",
  "Revisá la propuesta y prepará una feria para despedir la primaria.|Review the proposal and prepare a fair to celebrate completing primary school.",
  "Los puestos están listos.|The stands are ready.",
  "¡Se abre la entrada y llegan los visitantes!|The entrance opens and visitors arrive!",
  [
   "Organizá los puestos|Organize the stands",
   "Revisá el presupuesto|Review the budget",
   "¡Abrimos el parque!|Opening the park!"
  ]
 ]
];
export const PARK_CHAPTERS=GRADE_SEVEN_PACKAGES.map((p,i)=>{
 const [scene,icon,title,introduction,first,last,titles]=definitions[i];
 const lessons=GRADE_SEVEN_LESSONS.filter(l=>l.packageId===p.id);
 if(lessons.length!==titles.length)throw new Error(`Incomplete park chapter ${p.id}`);
 const optional=p.id==='G07-05'||p.id==='G07-10';
 return {id:p.id,icon,optional,title:text(title),missions:lessons.map((lesson,j)=>({id:lesson.id,packageId:p.id,optional,scene,title:text(titles[j]),introduction:text(introduction),objective:lesson.objective,checks:lesson.checks,rewards:lesson.checks.map((_,k)=>text(k===lesson.checks.length-1?last:first))}))};
});
export const PARK_MISSIONS=PARK_CHAPTERS.flatMap(c=>c.missions);
// Workshops remain accessible, but never block the main adventure.
export function nextParkMission(id:string){
 const index=PARK_MISSIONS.findIndex(m=>m.id===id);
 if(index<0)return undefined;
 const current=PARK_MISSIONS[index];
 return PARK_MISSIONS.slice(index+1).find(m=>!m.optional||(current.optional&&m.packageId===current.packageId));
}
