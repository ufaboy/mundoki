import { GRADE_FOUR_LESSONS, GRADE_FOUR_PACKAGES } from './index';
import { text } from '../lessonModel';
export type IslandScene = 'ship' | 'base' | 'solar' | 'rover' | 'lighthouse' | 'bridge' | 'drone' | 'exhibition';
// Each chapter supplies the setting; each mission retains its source objective and checks.
const settings: [IslandScene,string,string,string,string,string[]][] = [
 ['ship','⛵','La expedición|The expedition','Leé los registros para preparar el barco.|Read the records to prepare the ship.','La carga está a bordo.|The cargo is aboard.',['El barco llega a la isla.|The ship reaches the island.']],
 ['ship','📦','El cargamento|The cargo','Organizá los materiales que llevarás a la base.|Organize the supplies for your base.','La carga está a bordo.|The cargo is aboard.',['El barco llega a la isla.|The ship reaches the island.']],
 ['base','🏕','El taller|The workshop','Comprobá los cálculos para montar el taller.|Check the calculations to assemble the workshop.','La estructura está lista.|The frame is ready.',['¡El techo está colocado!|The roof is in place!']],
 ['base','🧰','Un lugar para cada cosa|A place for everything','Repartí los materiales para equipar la base.|Share out supplies to equip the base.','La estructura está lista.|The frame is ready.',['¡El techo está colocado!|The roof is in place!']],
 ['base','🔧','La base funciona|The base works','Revisá los cálculos antes de abrir el taller.|Check the calculations before opening the workshop.','La estructura está lista.|The frame is ready.',['¡El techo está colocado!|The roof is in place!']],
 ['solar','☀','Energía en partes|Energy in parts','Explorá partes iguales para instalar la estación solar.|Explore equal parts to install the solar station.','El panel está instalado.|The panel is installed.',['¡La estación tiene luz!|The station has light!']],
 ['solar','🔋','Más energía|More energy','Compará fracciones para conectar la estación.|Compare fractions to connect the station.','El panel está instalado.|The panel is installed.',['¡La estación tiene luz!|The station has light!']],
 ['solar','⚡','El laboratorio solar|The solar lab','Usá décimos y centésimos para preparar el laboratorio.|Use tenths and hundredths to prepare the lab.','El panel está instalado.|The panel is installed.',['¡La estación tiene luz!|The station has light!']],
 ['rover','🚙','Nuestro explorador|Our explorer','Comprobá medidas para preparar el vehículo de investigación.|Check measurements to prepare the research rover.','Las ruedas están instaladas.|The wheels are installed.',['¡El vehículo sale a explorar!|The rover heads out to explore!']],
 ['lighthouse','🔭','Señales del faro|Lighthouse signals','Explorá giros y ángulos para poner en marcha el faro.|Explore turns and angles to start the lighthouse.','La antena está instalada.|The antenna is installed.',['¡El faro ilumina el mar!|The lighthouse lights up the sea!']],
 ['bridge','🌉','Al otro lado|The other side','Investigá triángulos para construir el puente.|Investigate triangles to build the bridge.','Los soportes están colocados.|The supports are in place.',['El puente está listo y el explorador cruza.|The bridge is ready and the explorer crosses.']],
 ['drone','🛩','Un dron para explorar|An exploration drone','Estudiá figuras y cuerpos para montar el dron.|Study shapes and solids to assemble the drone.','El cuerpo del dron está listo.|The drone body is ready.',['¡El dron despega!|The drone takes off!']],
 ['exhibition','📊','Invitados de la ciudad|Visitors from the city','Organizá los datos para preparar la muestra de inventos.|Organize data to prepare the invention exhibition.','Los puestos están listos.|The stands are ready.',['¡Llegaron los visitantes!|The visitors have arrived!']],
 ['exhibition','🎉','La muestra de inventos|The invention exhibition','Revisá materiales y argumentos para abrir la muestra.|Check supplies and explanations to open the exhibition.','Los puestos están listos.|The stands are ready.',['¡Llegaron los visitantes!|The visitors have arrived!']],
];
const titles = [
 'El registro del barco|The ship register','Orden en el puerto|Order at the harbor','Rumbo a la isla|Heading to the island',
 'El plan de carga|The cargo plan','Prepará los paquetes|Prepare the packs','Entrega en la playa|Beach delivery',
 'El piso del taller|The workshop floor','Piezas para construir|Building parts','Revisá la estructura|Check the structure',
 'Reparto de herramientas|Sharing tools','Organizá los estantes|Organize the shelves','Que nadie quede afuera|Room for everyone',
 'Un cálculo ingenioso|A clever calculation','Antes de encender|Before switching on','Revisá el tablero|Check the controls',
 'Partes del panel|Parts of the panel','Módulos que encajan|Modules that fit','La ruta de la energía|The energy route',
 'Compará los módulos|Compare the modules','La misma energía|The same energy','Completá la estación|Complete the station',
 'El panel de cien|The hundred panel','Cables a medida|Made-to-measure cables','Encendé el laboratorio|Light up the lab',
 'Piezas del explorador|Rover parts','Agua para el viaje|Water for the journey','La ruta de investigación|The research route',
 'La antena giratoria|The rotating antenna','Señales en el cielo|Signals in the sky','Calibrá el faro|Calibrate the lighthouse',
 'Soportes para el puente|Bridge supports','¿Cierra la estructura?|Does the structure close?','Cruzá el arroyo|Cross the stream',
 'El plano del dron|The drone plan','El cuerpo del dron|The drone body','Listo para despegar|Ready for takeoff',
 'Consultá a los visitantes|Ask the visitors','El cartel de estrellas|The star poster','Mostrá los resultados|Show the results',
 'Materiales para la muestra|Exhibition supplies','¡Bienvenidos, inventores!|Welcome, inventors!',
];
export const ISLAND_MISSIONS = GRADE_FOUR_LESSONS.map((lesson,index)=>{
 const setting=settings[GRADE_FOUR_PACKAGES.findIndex(p=>p.id===lesson.packageId)];
 if(!setting || !titles[index])throw new Error(`Missing island story for ${lesson.id}`);
 return {id:lesson.id,packageId:lesson.packageId,title:text(titles[index]),introduction:text(setting[3]),scene:setting[0],
  objective:lesson.objective,checks:lesson.checks,
  rewards:lesson.checks.map((_,i)=>text(i===lesson.checks.length-1?setting[5][0]:setting[4]))};
});
export const ISLAND_CHAPTERS = GRADE_FOUR_PACKAGES.map((p,i)=>({id:p.id,title:text(settings[i][2]),icon:settings[i][1],missions:ISLAND_MISSIONS.filter(m=>m.packageId===p.id)}));
