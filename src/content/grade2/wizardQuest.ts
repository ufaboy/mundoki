// Grade 2 story: Wizard Embrollo has locked up six friends of the hero; every
// correct answer unties one knot of his spell. Story plan:
// docs/grade-2-wizard-scenario.md and .agents/skills/grade-2-lesson-authoring.
// Mission i belongs to GRADE_TWO_LESSONS[i]; rewards[i] is shown after checks[i].
// `{name}` (the chosen hero) is allowed only in introductions and rewards,
// which QuestLesson renders through HeroText.
import { text } from '../lessonModel';
import type { LocalizedText } from '../../math/core/types';

export interface QuestMission {
  id: string;
  title: LocalizedText;
  introduction: LocalizedText;
  rewards: [LocalizedText, LocalizedText];
}

const mission = (id: string, title: string, introduction: string, first: string, second: string): QuestMission => ({
  id, title: text(title), introduction: text(introduction), rewards: [text(first), text(second)],
});

export const QUEST_MISSIONS: QuestMission[] = [
  // Chapter 1 — Gem Market: free Pipa the squirrel.
  mission('G02-01-L01', 'Los precios embrujados|The bewitched prices',
    'El mago Embrollo encerró a la ardilla Pipa en una jaula del mercado. También cambió los precios por montones de gemas. {name} escribe cada precio con números.|Wizard Embrollo locked Pipa the squirrel in a cage at the market. He also turned the prices into piles of gems. {name} writes each price with numbers.',
    'Se ve el precio de la soga: 400 + 60 + 1.|The rope’s price shows again: 400 + 60 + 1.',
    'Los puestos vuelven a brillar. ¡Pipa te saluda desde la jaula!|The stalls shine again. Pipa waves from the cage!'),
  mission('G02-01-L02', 'Precios en voz alta|Prices out loud',
    'Los números de los precios desaparecieron. Los vendedores dicen los precios en voz alta. {name} tiene 700 gemas y escribe cada precio.|The numbers on the prices disappeared. The sellers say the prices out loud. {name} has 700 gems and writes down each price.',
    'La llave cuesta 930. Es más que 700: no alcanza.|The key costs 930. That is more than 700: not enough.',
    '{name} paga 5 cajas y 7 gemas. El farol muestra un candado en la jaula.|{name} pays 5 boxes and 7 gems. The lantern shows a lock on the cage.'),
  mission('G02-01-L03', 'El candado de números|The number lock',
    'La jaula de Pipa tiene un candado con números. El mago dejó una adivinanza. {name} compara los números.|Pipa’s cage has a number lock. The wizard left a riddle. {name} compares the numbers.',
    'La primera rueda del candado gira.|The lock’s first wheel turns.',
    'La segunda rueda hace clic. Queda una caja mágica.|The second wheel clicks. A magic box is left.'),
  mission('G02-02-L01', 'La caja de tres ventanitas|The box with three windows',
    'La caja mágica pide gemas exactas. {name} reparte las gemas en sus tres ventanitas.|The magic box asks for exact gems. {name} sorts the gems into its three little windows.',
    'La primera ventanita se cierra. ¡Un nudo menos!|The first little window closes. One knot fewer!',
    'La segunda ventanita se cierra. No hizo falta abrir ninguna bolsita.|The second little window closes. No bag had to be opened.'),
  mission('G02-02-L02', 'Cambiamos una caja|We trade a box',
    'La última ventanita solo acepta bolsitas de 10. {name} cambia una caja de 100 en el mercado.|The last little window only takes bags of 10. {name} trades a box of 100 at the market.',
    '{name} recibe 10 bolsitas por una caja.|{name} gets 10 bags for one box.',
    'La ventanita acepta las bolsitas. ¡La caja mágica se abre!|The little window takes the bags. The magic box opens!'),
  mission('G02-02-L03', '¡Pipa es libre!|Pipa is free!',
    'Quedan los barrotes de la jaula. Dos espejos muestran números. {name} revisa si son el mismo número.|The cage bars are left. Two mirrors show numbers. {name} checks whether they are the same number.',
    'Los barrotes de la izquierda desaparecen.|The bars on the left disappear.',
    '¡La jaula se abre! Pipa está libre. El mago huye: «¡Al río!»|The cage opens! Pipa is free. The wizard flees: “To the river!”'),
  // Chapter 2 — Stepping-Stone River: free Tuco the beaver.
  mission('G02-03-L01', 'Piedras con números|Numbered stones',
    'Pipa muestra el camino al río. El mago rompió el dique de los castores. El castor Tuco está congelado en un bloque de hielo. {name} cruza por piedras con números.|Pipa shows the way to the river. The wizard broke the beavers’ dam. Tuco the beaver is frozen in a block of ice. {name} crosses on numbered stones.',
    '{name} salta a la piedra 660 y no se cae.|{name} jumps to stone 660 and does not fall.',
    '¡Todos llegan a la islita del medio del río!|Everyone reaches the little island in the middle of the river!'),
  mission('G02-03-L02', 'El hielo de Tuco|Tuco’s ice',
    'Tuco está dentro de un bloque de hielo. Un espejito de sol lo derrite: cada vuelta, 50 gotas. Con 300 gotas, el hielo se rompe. {name} cuenta las gotas.|Tuco is inside a block of ice. A little sun mirror melts it: 50 drops each turn. At 300 drops the ice cracks. {name} counts the drops.',
    '¡Crac! El hielo se rompe.|Crack! The ice breaks.',
    'La soga llega hasta el hielo. {name} la ata.|The rope reaches the ice. {name} ties it on.'),
  mission('G02-03-L03', 'Los nidos de la orilla|The nests on the bank',
    'Para arreglar el dique hacen falta las herramientas de Tuco. Están en nidos con números. {name} busca el nido correcto.|To fix the dam, Tuco’s tools are needed. They are in numbered nests. {name} looks for the right nest.',
    '¡El martillo aparece en el nido 198!|The hammer turns up in nest 198!',
    '¡El cincel está en el nido 109! Ya están todas las herramientas.|The chisel is in nest 109! All the tools are here.'),
  mission('G02-04-L01', 'Troncos para el dique|Logs for the dam',
    'Con las herramientas listas, toca arreglar el dique. Hacen falta troncos. {name} cuenta cuántos hay.|With the tools ready, it is time to fix the dam. Logs are needed. {name} counts how many there are.',
    'Quedan 30 troncos: alcanzan para otra pared.|30 logs are left: enough for another wall.',
    'Las dos paredes del dique están en pie.|Both walls of the dam are standing.'),
  mission('G02-04-L02', 'Piedras a los dos lados|Stones on both sides',
    'El dique necesita piedras a los dos lados. El lado izquierdo necesita más. {name} compara las cantidades.|The dam needs stones on both sides. The left side needs more. {name} compares the amounts.',
    'Al lado izquierdo le ponen 8 piedras más.|8 extra stones go to the left side.',
    'Los dos lados del dique están listos.|Both sides of the dam are ready.'),
  mission('G02-04-L03', '¡Tuco es libre!|Tuco is free!',
    'Falta la compuerta del dique. Necesita 60 palos y algunos ya están puestos. {name} calcula cuántos faltan.|The dam gate is missing. It needs 60 sticks, and some are already in. {name} works out how many are missing.',
    'Los últimos palos están en su lugar.|The last sticks are in place.',
    'El agua vuelve al río y el hielo se derrite. ¡Tuco está libre! El mago grita: «¡Al Lago Espejo!»|The water returns to the river and the ice melts. Tuco is free! The wizard shouts: “To Mirror Lake!”'),
  // Chapter 3 — Mirror Lake: free Mora the owl.
  mission('G02-05-L01', 'La poción del agua clara|The clear-water potion',
    'Tuco arma una balsa y todos navegan por el Lago Espejo. La lechuza Mora está atrapada en el reflejo. {name} prepara una poción para ver bajo el agua.|Tuco builds a raft and everyone sails on Mirror Lake. Mora the owl is trapped in the reflection. {name} makes a potion to see under the water.',
    'La primera poción está lista. El agua se aclara.|The first potion is ready. The water clears.',
    'La segunda poción está lista. ¡El agua es transparente!|The second potion is ready. The water is clear!'),
  mission('G02-05-L02', 'Estrellas en la vela|Stars on the sail',
    'El reflejo del lago encandila. {name} pega estrellas que brillan en la vela de la balsa.|The lake’s reflection is dazzling. {name} sticks glowing stars on the raft’s sail.',
    'La vela brilla con 44 estrellas.|The sail shines with 44 stars.',
    'La balsa llega al medio del lago.|The raft reaches the middle of the lake.'),
  mission('G02-05-L03', '¿Verdad o mentira?|True or false?',
    'El mago escribe cuentas en el agua para confundir. {name} revisa si son verdad o mentira.|The wizard writes calculations on the water to confuse everyone. {name} checks whether they are true or false.',
    '¡Es verdad! Un puente de luz aparece sobre el agua.|It is true! A bridge of light appears over the water.',
    '¡La mentira explota como una burbuja! Se ve el camino hacia Mora.|The lie pops like a bubble! The way to Mora appears.'),
  mission('G02-06-L01', 'Reflejos falsos|Fake reflections',
    'En el Lago Espejo todo se duplica: lo de arriba y su reflejo. {name} busca los reflejos falsos.|In Mirror Lake everything doubles: what is above and its reflection. {name} looks for fake reflections.',
    'El escudo de luciérnagas se abre.|The firefly shield opens.',
    'El reflejo falso desaparece.|The fake reflection disappears.'),
  mission('G02-06-L02', 'Piedras de luna|Moon stones',
    'Para romper el hechizo del lago, las dos orillas deben tener la misma cantidad de piedras de luna. {name} reparte las piedras.|To break the lake’s spell, both shores must have the same number of moon stones. {name} shares out the stones.',
    'Cada orilla tiene 15 piedras. El lago se calma.|Each shore has 15 stones. The lake calms down.',
    'Ahora hay 10 piedras en cada orilla. Se oye a Mora.|Now there are 10 stones on each shore. Mora can be heard.'),
  mission('G02-06-L03', '¡Mora es libre!|Mora is free!',
    'El espejo mágico tiene la última cerradura. Se abre con dobles y mitades. {name} usa los dobles que ya conoce.|The magic mirror has the last lock. It opens with doubles and halves. {name} uses doubles that are already known.',
    'El espejo se llena de grietas.|The mirror fills with cracks.',
    '¡El espejo se rompe en chispas! Mora está libre. El mago grita: «¡A la mina!»|The mirror breaks into sparkles! Mora is free. The wizard shouts: “To the mine!”'),
  // Chapter 4 — Crystal Mine: free Ramón the mole.
  mission('G02-07-L01', 'Carritos de cristales|Crystal carts',
    'Mora vuela adelante hasta la Mina de los Cristales. El mago encerró al topo Ramón detrás de una puerta de cristal. La puerta se abre si todo está en partes iguales. {name} carga los carritos.|Mora flies ahead to the Crystal Mine. The wizard locked Ramón the mole behind a crystal door. The door opens if everything is in equal parts. {name} loads the carts.',
    'Los carritos se ponen en marcha.|The carts start moving.',
    'El tren de carritos pasa la primera curva.|The cart train goes around the first bend.'),
  mission('G02-07-L02', 'Faroles en filas|Lanterns in rows',
    'El mago apagó los faroles del túnel. Para encenderlos, hay que escribir cuántos son de forma corta. {name} usa la multiplicación.|The wizard turned off the tunnel lanterns. To light them, you must write how many there are the short way. {name} uses multiplication.',
    'El primer cartel de faroles se enciende.|The first lantern sign lights up.',
    '¡El techo del túnel brilla!|The tunnel ceiling shines!'),
  mission('G02-07-L03', 'La tabla del depósito|The storeroom table',
    'La puerta del depósito tiene una tabla sin terminar. {name} completa cuántos cristales hay en las cajas.|The storeroom door has an unfinished table. {name} fills in how many crystals are in the boxes.',
    'Una fila de la tabla está completa.|One row of the table is complete.',
    'La tabla está lista. ¡El depósito se abre!|The table is done. The storeroom opens!'),
  mission('G02-08-L01', 'Luciérnagas mineras|Miner fireflies',
    'El fondo de la mina está oscuro. Tres luciérnagas mineras pueden alumbrar si reciben partes iguales de cristales. {name} reparte.|The bottom of the mine is dark. Three miner fireflies can light it if they get equal shares of crystals. {name} shares them out.',
    'Las tres luciérnagas brillan igual.|All three fireflies shine the same.',
    'El túnel profundo se ilumina.|The deep tunnel lights up.'),
  mission('G02-08-L02', 'Hasta la puerta de cristal|To the crystal door',
    'Hay que llevar cristales hasta la puerta de Ramón. En cada carrito entran 5. {name} calcula cuántos carritos hacen falta.|Crystals must go to Ramón’s door. Each cart holds 5. {name} works out how many carts are needed.',
    'Los carritos llegan a la puerta.|The carts reach the door.',
    'Los carritos se paran frente a las cerraduras.|The carts stop in front of the locks.'),
  mission('G02-08-L03', '¡Ramón es libre!|Ramón is free!',
    'La puerta de cristal tiene dos cerraduras. Las dos usan 24 cristales, pero preguntan cosas distintas. {name} piensa qué cuenta cada respuesta.|The crystal door has two locks. Both use 24 crystals, but they ask different things. {name} thinks about what each answer counts.',
    'La primera cerradura se abre.|The first lock opens.',
    '¡La puerta se abre! Ramón está libre. El mago grita: «¡Al bosque!»|The door opens! Ramón is free. The wizard shouts: “To the forest!”'),
  // Chapter 5 — Shape Forest: free Teo the deer.
  mission('G02-09-L01', 'Portones apagados|Dark gates',
    'Ramón cava un túnel hasta el Bosque de las Figuras. El ciervo Teo está encerrado detrás de una cerca. Los portones del camino se apagaron. {name} los vuelve a encender.|Ramón digs a tunnel to the Shape Forest. Teo the deer is shut behind a fence. The gates on the path went dark. {name} lights them up again.',
    'El primer portón brilla con 5 lucecitas.|The first gate shines with 5 little lights.',
    'Encontraron el portón cuadrado y se abre.|They found the square gate, and it opens.'),
  mission('G02-09-L02', 'El túnel en bajada|The downhill tunnel',
    'Para seguir, hay que bajar por el túnel de Ramón con las cosas del viaje. {name} revisa qué cosas pueden rodar.|To go on, everyone must go down Ramón’s tunnel with the trip’s things. {name} checks which things can roll.',
    'La pelota está atada. Nada se escapa.|The ball is tied down. Nothing gets away.',
    'Los troncos van parados. ¡Salen del túnel!|The logs ride standing up. Out of the tunnel!'),
  mission('G02-09-L03', 'Las adivinanzas del mago|The wizard’s riddles',
    'El mago dejó adivinanzas en el camino. Solo la respuesta correcta muestra el portón hacia Teo. {name} lee las pistas.|The wizard left riddles along the path. Only the right answer shows the gate to Teo. {name} reads the clues.',
    '¡El portón triangular aparece!|The triangle gate appears!',
    '{name} pide otra pista y encuentra el camino.|{name} asks for another clue and finds the way.'),
  mission('G02-10-L01', 'El plano de Mora|Mora’s map',
    'Mora vuela sobre el bosque y dibuja un plano. Un árbol caído tapa el camino. {name} elige por dónde ir.|Mora flies over the forest and draws a map. A fallen tree blocks the way. {name} picks which way to go.',
    'El camino está elegido.|The path is chosen.',
    '{name} entiende el plano. ¡Ya saben adónde ir!|{name} understands the map. Now everyone knows where to go!'),
  mission('G02-10-L02', 'Instrucciones para Ramón|Directions for Ramón',
    'Ramón cava un túnel hasta la cerca de Teo, pero bajo tierra no ve. {name} le escribe el camino paso a paso.|Ramón digs a tunnel to Teo’s fence, but underground he cannot see. {name} writes him the path step by step.',
    'Ramón recibe las instrucciones y cava.|Ramón gets the instructions and digs.',
    'Ramón sale junto a la cerca de Teo.|Ramón comes out next to Teo’s fence.'),
  mission('G02-11-L01', '¡Teo es libre!|Teo is free!',
    'A la cerca de Teo le falta una tabla: la tabla justa abre la puerta. Tuco la corta y {name} la mide.|Teo’s fence is missing a board: the right board opens the gate. Tuco cuts it and {name} measures it.',
    'La primera tabla encaja justo.|The first board fits just right.',
    '¡La cerca se abre! Teo está libre. El mago grita: «¡Nunca van a llegar a mi torre!»|The fence opens! Teo is free. The wizard shouts: “You will never reach my tower!”'),
  // Chapter 6 — Tangled Tower: free Chispa the little dragon.
  mission('G02-11-L02', 'Dos puertas mágicas|Two magic doors',
    'Teo lleva a todos corriendo hasta la Torre Enredada. El festival es el martes. Arriba, el mago tiene encerrada a la dragoncita Chispa. Para entrar, {name} pasa dos puertas mágicas.|Teo carries everyone at a run to the Tangled Tower. The festival is on Tuesday. At the top, the wizard has Chispa the little dragon locked up. To get in, {name} goes through two magic doors.',
    'La balanza queda pareja. ¡Se abre la primera puerta!|The scale balances. The first door opens!',
    'La fuente se llena. ¡Se abre la segunda puerta!|The fountain fills. The second door opens!'),
  mission('G02-11-L03', 'La escalera con horario|The stairs with opening hours',
    'La escalera de la torre se abre solo a ciertas horas. Y hay que llegar a tiempo al festival. {name} usa el reloj y el calendario.|The tower stairs open only at certain times. And everyone must make it to the festival on time. {name} uses the clock and the calendar.',
    '¡Hay 2 horas! Alcanzan para subir.|There are 2 hours! Enough to climb up.',
    '{name} encuentra la fecha del festival en el calendario. ¡Llegamos a tiempo!|{name} finds the festival date on the calendar. We will make it on time!'),
  mission('G02-12-L01', 'Las cosas robadas|The stolen things',
    'En la torre hay un depósito lleno de cosas robadas del valle. {name} las cuenta en una tabla para devolverlas.|In the tower is a storeroom full of things stolen from the valley. {name} counts them in a table to give them back.',
    'La lista para devolver está lista: 12 cosas.|The return list is ready: 12 things.',
    'Cada cosa está en su canasta.|Each thing is in its basket.'),
  mission('G02-12-L02', '¿Qué puerta elegimos?|Which door do we choose?',
    'Hay varias puertas para subir. Los amigos votan y {name} lee el gráfico de votos.|There are several doors going up. The friends vote, and {name} reads the vote chart.',
    'Ganó la puerta con más votos. ¡Se abre!|The door with the most votes wins. It opens!',
    'La votación es justa. ¡Llegan a la cima de la torre!|The vote is fair. Everyone reaches the top of the tower!'),
  mission('G02-13-L01', 'Faroles para Chispa|Lanterns for Chispa',
    'Chispa está en la cima, dentro de un farol de vidrio. Para liberar su fuego hacen falta faroles de fiesta. {name} prepara los faroles.|Chispa is at the top, inside a glass lantern. To free her fire, festival lanterns are needed. {name} gets the lanterns ready.',
    'Tres faroles están listos con 24 velas.|Three lanterns are ready with 24 candles.',
    'Cada farol tiene sus chispas. ¡El vidrio de Chispa se raja!|Each lantern has its sparks. Chispa’s glass cracks!'),
  mission('G02-13-L02', 'El último hechizo|The last spell',
    'El mago usa su último hechizo: el número 347. Lo cambia dos veces y se ríe: «¡Ja! ¡No lo van a arreglar!». {name} sigue cada cambio.|The wizard casts his last spell: the number 347. He changes it twice and laughs: “Ha! You will never fix it!” {name} follows each change.',
    'El hechizo se debilita.|The spell gets weaker.',
    '¡El último nudo se desata! Chispa está libre.|The last knot comes undone! Chispa is free.'),
];

export interface QuestChapter {
  id: string;
  icon: string;
  title: LocalizedText;
  place: LocalizedText;
  friend: { name: string; emoji: string; kind: LocalizedText };
  start: number;
  end: number;
}

const chapter = (id: string, icon: string, title: string, place: string, name: string, emoji: string, kind: string, index: number): QuestChapter => ({
  id, icon, title: text(title), place: text(place), friend: { name, emoji, kind: text(kind) }, start: index * 6, end: index * 6 + 6,
});

export const QUEST_CHAPTERS: QuestChapter[] = [
  chapter('market', '💎', 'Liberamos a Pipa|We free Pipa', 'Mercado de las Gemas|Gem Market', 'Pipa', '🐿️', 'la ardilla|the squirrel', 0),
  chapter('river', '🪨', 'Liberamos a Tuco|We free Tuco', 'Río de las Piedras|Stepping-Stone River', 'Tuco', '🦫', 'el castor|the beaver', 1),
  chapter('lake', '🪞', 'Liberamos a Mora|We free Mora', 'Lago Espejo|Mirror Lake', 'Mora', '🦉', 'la lechuza|the owl', 2),
  chapter('mine', '⛏️', 'Liberamos a Ramón|We free Ramón', 'Mina de los Cristales|Crystal Mine', 'Ramón', '🐾', 'el topo|the mole', 3),
  chapter('forest', '🔺', 'Liberamos a Teo|We free Teo', 'Bosque de las Figuras|Shape Forest', 'Teo', '🦌', 'el ciervo|the deer', 4),
  chapter('tower', '🏰', 'Liberamos a Chispa|We free Chispa', 'Torre Enredada|Tangled Tower', 'Chispa', '🐉', 'la dragoncita|the little dragon', 5),
];

// The story state lives in questScene.ts so the page script can use it without
// shipping these mission texts to the browser (most missions need Premium).
export { KNOTS_PER_CHAPTER, QUEST_MISSION_COUNT, questSceneState } from './questScene';
