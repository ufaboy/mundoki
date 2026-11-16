import { text } from '../lessonModel';
import type { LocalizedText } from '../../math/core/types';

export type CitySceneKind='build'|'delivery'|'bakery'|'bus'|'park'|'repair'|'festival';
export interface CityMission {id:string;title:LocalizedText;introduction:LocalizedText;rewards:[LocalizedText,LocalizedText];scene:CitySceneKind}
const chapter=(id:number,title:string,icon:string,scene:CitySceneKind,introduction:string,missions:[string,string,string][])=>({
 id:`G03-${String(id).padStart(2,'0')}`,title:text(title),icon,scene,
 missions:missions.map(([name,first,second],i):CityMission=>({id:`G03-${String(id).padStart(2,'0')}-L0${i+1}`,title:text(name),introduction:text(introduction),scene,rewards:[text(first),text(second)]})),
});
// Story rewards are separate from the mathematical quantities in the lesson checks.
export const CITY_CHAPTERS=[
 chapter(1,'El primer barrio|The first neighborhood','🏗','build','Nuestro terreno está vacío. Explorá los números para empezar a construir una ciudad.|Our plot is empty. Explore numbers to start building a city.',[
  ['La primera casa|The first house','¡Los cimientos están listos!|The foundations are ready!','¡La primera casa tiene techo!|The first house has a roof!'],
  ['Direcciones para las casas|Addresses for the houses','La primera dirección está revisada.|The first address is checked.','¡Las casas reciben sus direcciones!|The houses have their addresses!'],
  ['El depósito de materiales|The supply depot','Ordenamos la primera parte del depósito.|We organize the first part of the depot.','¡El depósito está construido!|The depot is built!'],
 ]),
 chapter(2,'Llegan los materiales|Supplies arrive','🚚','delivery','Llegan pedidos para el barrio. Resolvé las sumas para ayudar con las entregas.|Orders arrive for the neighborhood. Solve the additions to help with deliveries.',[
  ['Dos entregas juntas|Two deliveries together','El primer camión llega al barrio.|The first truck reaches the neighborhood.','¡Descargamos los dos pedidos!|We unload both orders!'],
  ['Cajas bien organizadas|Well-organized boxes','Las cajas pequeñas están agrupadas.|The small boxes are grouped.','¡El camión termina la entrega!|The truck finishes its delivery!'],
  ['Revisamos el pedido|Check the order','Primera revisión completada.|First check complete.','¡Los materiales llegan a la obra!|The supplies reach the building site!'],
 ]),
 chapter(3,'Cuidamos nuestro barrio|Care for our neighborhood','🔧','repair','También hay que cuidar lo que construimos. Practicá restas para ayudar al equipo de reparación.|We must care for what we build too. Practice subtraction to help the repair team.',[
  ['Una calle por reparar|A street to repair','El equipo repara el primer tramo.|The crew repairs the first section.','¡La calle vuelve a abrir!|The street reopens!'],
  ['El puente del barrio|The neighborhood bridge','El primer tramo del puente encaja.|The first bridge section fits.','¡El puente está reparado!|The bridge is repaired!'],
  ['Comprobamos el arreglo|Check the repair','Primera comprobación lista.|First check complete.','¡El equipo retira las vallas!|The crew removes the barriers!'],
 ]),
 chapter(4,'Casas con muchas ventanas|Houses with many windows','🏘','build','Las filas y columnas nos ayudan a contar. Vamos a construir el barrio de las ventanas.|Rows and columns help us count. Let’s build the window neighborhood.',[
  ['Ventanas en filas|Windows in rows','La primera sección sube con la grúa.|The crane lifts the first section.','¡Las ventanas están colocadas!|The windows are fitted!'],
  ['Miramos desde otro lado|Look from another side','Revisamos el primer plano.|We check the first plan.','¡La nueva fachada está lista!|The new facade is ready!'],
  ['Más casas para los vecinos|More homes for neighbors','Un nuevo piso queda instalado.|A new floor is installed.','¡Llegan los nuevos vecinos!|The new neighbors arrive!'],
 ]),
 chapter(5,'Abrimos la panadería|Open the bakery','🥐','bakery','La panadería prepara pedidos grandes. Multiplicá por partes para ayudar a organizar el trabajo.|The bakery prepares large orders. Multiply in parts to help organize the work.',[
  ['Bandejas para hornear|Trays for baking','La primera bandeja sale del horno.|The first tray comes out of the oven.','¡Las bandejas están preparadas!|The trays are ready!'],
  ['Un pedido grande|A large order','La primera parte del pedido está lista.|The first part of the order is ready.','¡El pedido queda completo!|The order is complete!'],
  ['El cartel de apertura|The opening sign','Colocamos el cartel de la panadería.|We put up the bakery sign.','¡La panadería abre sus puertas!|The bakery opens its doors!'],
 ]),
 chapter(6,'Compartimos en la plaza|Sharing in the square','🧺','bakery','Preparamos paquetes para los vecinos. Pensá qué buscamos al dividir y qué hacemos con lo que sobra.|We prepare packs for our neighbors. Think about what division finds and what to do with leftovers.',[
  ['Paquetes para repartir|Packs to share','El primer paquete está preparado.|The first pack is ready.','¡Los paquetes llegan al mostrador!|The packs reach the counter!'],
  ['Una parte para cada uno|A share for everyone','Organizamos la primera entrega.|We organize the first delivery.','¡Repartimos los paquetes!|We share the packs!'],
  ['¿Qué hacemos con lo que sobra?|What about the leftovers?','Revisamos qué queda por repartir.|We check what remains to be shared.','¡El reparto está organizado!|The sharing is organized!'],
 ]),
 chapter(7,'El mercado del barrio|The neighborhood market','📦','delivery','Elegí estrategias de cálculo para revisar los pedidos del mercado.|Choose calculation strategies to check the market orders.',[
  ['Una entrega rápida|A quick delivery','El camión encuentra su primera parada.|The truck finds its first stop.','¡La entrega llega a tiempo!|The delivery arrives on time!'],
  ['¿Alcanzará el espacio?|Will there be enough space?','La primera estimación está revisada.|The first estimate is checked.','¡Preparamos el lugar para la carga!|We prepare a place for the cargo!'],
  ['Dos maneras de revisar|Two ways to check','Comparamos el primer método.|We compare the first method.','¡El pedido está comprobado!|The order is checked!'],
 ]),
 chapter(8,'Un autobús para todos|A bus for everyone','🚌','bus','El barrio necesita transporte. Resolvé cada situación para organizar el servicio del autobús.|The neighborhood needs transport. Solve each situation to organize the bus service.',[
  ['La primera parada|The first bus stop','El autobús llega a la parada.|The bus reaches the stop.','¡Los pasajeros suben!|The passengers board!'],
  ['Organizamos el recorrido|Plan the journey','El primer tramo está organizado.|The first part of the journey is organized.','¡El autobús conecta el barrio!|The bus connects the neighborhood!'],
  ['Paquetes a bordo|Packs on board','La primera carga está preparada.|The first load is ready.','¡El autobús lleva los paquetes!|The bus carries the packs!'],
 ]),
 chapter(9,'El mapa de nuestra ciudad|Our city map','🗺','bus','Un buen plano ayuda a todos. Revisá referencias, símbolos y recorridos.|A good plan helps everyone. Check landmarks, symbols, and routes.',[
  ['Marcamos los lugares|Mark the places','Señalamos el primer punto del mapa.|We mark the first point on the map.','¡La parada aparece en el plano!|The stop is on the plan!'],
  ['Símbolos para orientarnos|Symbols to guide us','La primera referencia está clara.|The first landmark is clear.','¡El autobús encuentra la parada!|The bus finds the stop!'],
  ['Probamos el camino|Try the route','Probamos el primer tramo.|We try the first section.','¡El recorrido nos lleva al parque!|The route takes us to the park!'],
 ]),
 chapter(10,'Diseñamos el parque|Design the park','🌳','park','Compará figuras y cuerpos para diseñar los espacios del parque.|Compare shapes and solids to design the park spaces.',[
  ['Canteros con formas|Shape flowerbeds','Plantamos el primer cantero.|We plant the first flowerbed.','¡Los canteros están listos!|The flowerbeds are ready!'],
  ['Una fuente en la plaza|A fountain in the square','La base de la fuente está colocada.|The fountain base is fitted.','¡La fuente empieza a funcionar!|The fountain starts running!'],
  ['Un plano para construir|A plan to build from','El equipo interpreta el primer dibujo.|The crew reads the first drawing.','¡Abrimos el nuevo parque!|We open the new park!'],
 ]),
 chapter(11,'Senderos y jardines|Paths and gardens','📏','park','Elegí unidades, estimá y compará medidas para ayudar a terminar el jardín.|Choose units, estimate, and compare measurements to help finish the garden.',[
  ['Medimos para el jardín|Measure for the garden','Revisamos la primera medida.|We check the first measurement.','¡La entrada del jardín está lista!|The garden entrance is ready!'],
  ['Antes de usar la regla|Before using the ruler','La primera estimación está anotada.|The first estimate is recorded.','¡El sendero llega a la fuente!|The path reaches the fountain!'],
  ['La misma medida|The same measurement','Comparamos las primeras medidas.|We compare the first measurements.','¡El jardín queda terminado!|The garden is finished!'],
 ]),
 chapter(12,'Ponemos la ciudad en hora|Set the city’s clocks','🕒','bus','Leé relojes y calendarios para organizar los viajes y las actividades de la ciudad.|Read clocks and calendars to organize the city’s trips and activities.',[
  ['El reloj de la estación|The station clock','Revisamos la hora de salida.|We check the departure time.','¡El autobús sale de la estación!|The bus leaves the station!'],
  ['Tiempo para llegar|Time to arrive','El primer tramo del viaje está revisado.|The first travel segment is checked.','¡Llegamos a la siguiente parada!|We reach the next stop!'],
  ['La fecha del encuentro|The meeting date','La fecha está anotada.|The date is written down.','¡El viaje para la fiesta está organizado!|The journey to the party is organized!'],
 ]),
 chapter(13,'Escuchamos a los vecinos|Listen to the neighbors','🎈','festival','Preguntá, registrá y leé los datos. Preparamos la fiesta con las ideas del grupo consultado.|Ask, record, and read the data. We prepare the party with ideas from the group we asked.',[
  ['¿Qué hacemos en la fiesta?|What shall we do at the party?','La primera consulta está preparada.|The first survey is prepared.','¡La mesa de actividades está lista!|The activity table is ready!'],
  ['El cartel de los resultados|The results board','Organizamos la primera parte del cartel.|We organize the first part of the board.','¡Los vecinos pueden leer los resultados!|The neighbors can read the results!'],
  ['Lo que nos dicen los datos|What the data tell us','Revisamos la primera conclusión.|We check the first conclusion.','¡La plaza está decorada!|The square is decorated!'],
 ]),
 chapter(14,'¡La ciudad está de fiesta!|The city celebrates!','🎉','festival','Organizamos una salida para visitar la ciudad. Comprobá los cálculos antes de recibir a los visitantes.|We organize a trip to visit the city. Check the calculations before welcoming the visitors.',[
  ['Llegan los visitantes|The visitors arrive','El primer grupo llega a la plaza.|The first group reaches the square.','¡Recibimos a los visitantes!|We welcome the visitors!'],
  ['La gran inauguración|The grand opening','La última revisión está completa.|The final check is complete.','¡Nuestra ciudad abre sus puertas! Que empiece la fiesta.|Our city opens its doors! Let the celebration begin.'],
 ]),
];
export const CITY_MISSIONS=CITY_CHAPTERS.flatMap(c=>c.missions);
