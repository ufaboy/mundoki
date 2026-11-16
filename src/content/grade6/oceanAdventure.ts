import {GRADE_SIX_LESSONS,GRADE_SIX_PACKAGES} from './index';
import {text} from '../lessonModel';
export type OceanScene='archive'|'kits'|'beacons'|'supplies'|'sub'|'workshop'|'robots'|'market'|'floor'|'chart'|'report'|'park';
const definitions:[OceanScene,string,string,string,string,string,string[]][]=[
 [
  "archive",
  "🗺",
  "El archivo marino|The marine archive",
  "Leé los registros para revelar el primer destino.|Read the records to reveal the first destination.",
  "El proyector se enciende.|The projector switches on.",
  "¡La estación aparece en el mapa!|The station appears on the map!",
  [
   "Una caja del archivo|A box from the archive",
   "Marcas en el diario|Marks in the journal",
   "El primer destino|The first destination"
  ]
 ],
 [
  "kits",
  "🧰",
  "Equipamos la expedición|Equipping the expedition",
  "Organizá grupos completos para preparar el equipo.|Organize complete groups to prepare the equipment.",
  "El equipo llega a la mesa.|Equipment arrives at the table.",
  "Los contenedores están listos.|The containers are ready.",
  [
   "Sin dejar piezas sueltas|No loose parts",
   "El almacén de herramientas|The tool store",
   "Comprobá el inventario|Check the inventory"
  ]
 ],
 [
  "beacons",
  "💡",
  "Las señales del mar|Signals at sea",
  "Revisá divisores y múltiplos para encontrar el paso.|Check divisors and multiples to find the passage.",
  "El primer faro está encendido.|The first beacon is on.",
  "Los dos faros iluminan el paso.|Both beacons light the passage.",
  [
   "Las claves del faro|Beacon clues",
   "Kits para los fareros|Kits for the keepers",
   "Cuando coinciden las señales|When signals coincide"
  ]
 ],
 [
  "supplies",
  "🚢",
  "Todos a bordo|All aboard",
  "Repartí las provisiones para preparar el viaje.|Share the supplies to prepare the journey.",
  "Las provisiones están a bordo.|Supplies are aboard.",
  "¡El barco sale del puerto!|The ship leaves the harbor!",
  [
   "Provisiones para compartir|Supplies to share",
   "La parte de cada uno|Each person’s share",
   "Listos para zarpar|Ready to sail"
  ]
 ],
 [
  "sub",
  "🤿",
  "Nuestro submarino|Our submarine",
  "Comprobá los cálculos para montar el vehículo de exploración.|Check calculations to assemble the exploration vehicle.",
  "La cabina está instalada.|The cabin is installed.",
  "¡El submarino inicia la inmersión!|The submarine begins its dive!",
  [
   "Piezas del submarino|Submarine parts",
   "Reservas bajo control|Reserves in check",
   "Primera inmersión|First dive"
  ]
 ],
 [
  "workshop",
  "⚙",
  "El taller submarino|The underwater workshop",
  "Relacioná cantidades y costos para equipar el taller.|Relate quantities and costs to equip the workshop.",
  "El módulo está colocado.|The module is in place.",
  "El taller tiene energía.|The workshop has power.",
  [
   "Módulos para el taller|Workshop modules",
   "El costo por unidad|Unit cost",
   "Activá el taller|Activate the workshop"
  ]
 ],
 [
  "robots",
  "🤖",
  "Robots de reparación|Repair robots",
  "Estudiá cómo repartir una tarea con condiciones claras.|Study how to share a task under clear conditions.",
  "El robot llega al conducto.|The robot reaches the pipe.",
  "El conducto está reparado.|The pipe is repaired.",
  [
   "Organizá el trabajo|Organize the work",
   "Repartí el suministro|Share the supply",
   "Comprobá el plan|Check the plan"
  ]
 ],
 [
  "market",
  "📦",
  "Nuevos instrumentos|New instruments",
  "Calculá porcentajes para preparar la compra ficticia.|Calculate percentages to prepare the fictional purchase.",
  "El instrumento está preparado.|The instrument is ready.",
  "El pedido llega a la estación.|The order reaches the station.",
  [
   "Partes de cien|Parts of a hundred",
   "Compará las ofertas|Compare offers",
   "El precio final|The final price"
  ]
 ],
 [
  "floor",
  "🏗",
  "Restauramos la estación|Restoring the station",
  "Distinguí bordes y superficies para restaurar el laboratorio.|Distinguish boundaries and surfaces to restore the lab.",
  "El marco está reparado.|The frame is repaired.",
  "El nuevo piso está colocado.|The new floor is in place.",
  [
   "Bordes y superficies|Boundaries and surfaces",
   "Piezas del laboratorio|Lab sections",
   "El espacio recuperado|Reclaimed space"
  ]
 ],
 [
  "chart",
  "🧭",
  "La carta submarina|The underwater chart",
  "Interpretá escalas para trazar el recorrido del explorador.|Interpret scales to plot the explorer’s route.",
  "La ruta aparece en la carta.|The route appears on the chart.",
  "El explorador llega al punto señalado.|The explorer reaches the marked point.",
  [
   "Una escala para explorar|A scale for exploration",
   "Distancias del recorrido|Route distances",
   "La entrada de la estación|The station entrance"
  ]
 ],
 [
  "report",
  "📊",
  "Las pistas del océano|Ocean clues",
  "Revisá gráficos para recuperar el informe de la estación.|Review graphs to recover the station report.",
  "El informe aparece en pantalla.|The report appears on screen.",
  "La antena transmite los datos.|The antenna transmits the data.",
  [
   "Elegí el gráfico|Choose the graph",
   "Leé la escala|Read the scale",
   "Una pista engañosa|A misleading clue"
  ]
 ],
 [
  "report",
  "🔬",
  "El secreto de la estación|The station’s secret",
  "Analizá las observaciones: la estación estudiaba cambios en el océano.|Analyze observations: the station studied changes in the ocean.",
  "El informe aparece en pantalla.|The report appears on screen.",
  "La antena transmite los datos.|The antenna transmits the data.",
  [
   "Equilibrá las observaciones|Balance observations",
   "El promedio del registro|The record’s mean",
   "Lo que cuentan los datos|What the data tell us"
  ]
 ],
 [
  "park",
  "🌿",
  "Un parque para compartir|A park to share",
  "De vuelta en la costa, diseñá un patio para compartir la investigación.|Back on shore, design a yard to share the research.",
  "Las plantas están colocadas.|The plants are in place.",
  "¡El parque recibe a sus visitantes!|The park welcomes visitors!",
  [
   "El plan de la costa|The coastal plan",
   "Organizá el patio|Organize the yard",
   "¡Abrimos el parque!|Opening the park!"
  ]
 ]
];
export const OCEAN_CHAPTERS=GRADE_SIX_PACKAGES.map((p,i)=>{
 const [scene,icon,title,introduction,first,last,titles]=definitions[i];
 const lessons=GRADE_SIX_LESSONS.filter(l=>l.packageId===p.id);
 if(lessons.length!==titles.length)throw new Error(`Incomplete ocean chapter ${p.id}`);
 return {id:p.id,icon,title:text(title),missions:lessons.map((lesson,j)=>({id:lesson.id,packageId:p.id,scene,title:text(titles[j]),introduction:text(introduction),objective:lesson.objective,checks:lesson.checks,rewards:lesson.checks.map((_,k)=>text(k===lesson.checks.length-1?last:first))}))};
});
export const OCEAN_MISSIONS=OCEAN_CHAPTERS.flatMap(c=>c.missions);
