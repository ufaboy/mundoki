import { check as q, type GradeOneCheck } from './model';

// A: recognition, B: procedure (two items), C: transfer, D: explanation.
// These items are distinct from the lesson's guided checks.
export const GRADE_ONE_ASSESSMENTS: Record<string, GradeOneCheck[]> = {
  'G01-01': [
    q('¿Qué grupo está vacío?|Which group is empty?', 'Una bolsa sin fichas|A bag with no counters','Una bolsa con una ficha|A bag with one counter','Vacío significa cero objetos.|Empty means zero objects.'),
    q('Contá ● ● ● ● ● ● ●. ¿Cuántos hay?|Count ● ● ● ● ● ● ●. How many are there?','7|7','6|6','Son siete puntos, contados una vez cada uno.|There are seven dots, each counted once.'),
    q('Contaste 1, 2, 3, 4, 5, 6. ¿Cuál es el total?|You counted 1, 2, 3, 4, 5, 6. What is the total?','6|6','5|5','El último número indica la cantidad total.|The last number gives the total.'),
    q('Hay seis botones; los pasás a otra mesa sin perder ninguno. ¿Cuántos llevaste?|There are six buttons; you move them to another table without losing any. How many did you move?','6|6','7|7','Mover los botones no cambia su cantidad.|Moving the buttons does not change their quantity.'),
    q('Dos filas tienen las mismas cinco fichas, pero una está más separada. ¿Por qué tienen igual cantidad?|Two rows use the same five counters, but one is more spread out. Why are the quantities equal?','Solo cambió el espacio entre las fichas|Only the space between counters changed','La fila más larga siempre tiene más|The longer row always has more','No se agregó ni se quitó ninguna ficha.|No counter was added or removed.'),
  ],
  'G01-02': [
    q('¿Qué representa una decena?|What does one ten represent?','Diez unidades|Ten ones','Una unidad|One one','Agrupamos diez unidades para formar una decena.|We group ten ones to make one ten.'),
    q('¿Qué número corresponde a ● ● ● ● ● ● ● ● ●?|Which number matches ● ● ● ● ● ● ● ● ●?','9|9','8|8','El dibujo contiene nueve puntos.|The picture has nine dots.'),
    q('Una decena y ocho unidades son…|One ten and eight ones are…','18|18','81|81','10 + 8 = 18.|10 + 8 = 18.'),
    q('Hay seis paquetes de diez semillas y tres semillas sueltas. ¿Cuántas semillas hay?|There are six packs of ten seeds and three loose seeds. How many seeds are there?','63|63','9|9','Los paquetes contienen 60; con tres más son 63.|The packs contain 60; with three more there are 63.'),
    q('¿Por qué el 2 de 27 vale veinte?|Why does the 2 in 27 mean twenty?','Está en el lugar de las decenas|It is in the tens place','Toda cifra 2 vale veinte|Every digit 2 means twenty','Su posición indica dos grupos de diez.|Its position indicates two groups of ten.'),
  ],
  'G01-03': [
    q('¿Qué comparación es correcta?|Which comparison is correct?','8 es mayor que 5|8 is greater than 5','5 es mayor que 8|5 is greater than 8','Al emparejar sobran tres del grupo de ocho.|Pairing leaves three in the group of eight.'),
    q('¿Qué número está justo antes de 15?|Which number is just before 15?','14|14','16|16','14 + 1 = 15.|14 + 1 = 15.'),
    q('Ordená de menor a mayor: 11, 4, 8.|Order from smallest to largest: 11, 4, 8.','4, 8, 11|4, 8, 11','11, 8, 4|11, 8, 4','Primero va el menor y al final el mayor.|The smallest comes first and the largest last.'),
    q('Hay 9 niños y 7 sillas. ¿Hay más niños o sillas?|There are 9 children and 7 chairs. Are there more children or chairs?','Niños|Children','Sillas|Chairs','Nueve es mayor que siete.|Nine is greater than seven.'),
    q('¿Por qué dos grupos emparejados sin sobrantes tienen igual cantidad?|Why do two groups paired with no leftovers have the same quantity?','Cada objeto tiene exactamente una pareja|Each object has exactly one partner','Todos los objetos deben ser del mismo tamaño|All objects must have the same size','Cada objeto tiene pareja y no sobra ninguno.|Every object has a partner and none are left over.'),
  ],
  'G01-04': [
    q('¿Qué pregunta pide una posición?|Which question asks for a position?','¿Quién está segundo?|Who is second?','¿Cuántos hay?|How many are there?','Segundo indica un lugar en un orden.|Second indicates a place in an order.'),
    q('Fila: Eva, Max, Luz, Ian. ¿Cuántas personas hay?|Line: Eva, Max, Luz, Ian. How many people are there?','4|4','3|3','Contamos los cuatro nombres.|We count the four names.'),
    q('Desde Eva, ¿quién está tercero en Eva, Max, Luz, Ian?|Starting with Eva, who is third in Eva, Max, Luz, Ian?','Luz|Luz','Ian|Ian','Eva primera, Max segundo, Luz tercera.|Eva first, Max second, Luz third.'),
    q('Cuatro autos esperan. El segundo sale. ¿Cuántos quedan?|Four cars wait. The second leaves. How many remain?','3|3','2|2','Sale un solo auto; segundo era su posición.|Only one car leaves; second was its position.'),
    q('¿Por qué hay que indicar desde dónde contamos posiciones?|Why must we say where we start counting positions?','El orden cambia si empezamos por el otro extremo|The order changes if we start at the other end','La cantidad cambia al mirar del otro lado|The quantity changes when seen from the other side','Cambia la referencia de posición, no el total.|The reference for position changes, not the total.'),
  ],
  'G01-05': [
    q('¿Qué historia representa una suma?|Which story represents addition?','Hay 2 flores y agregamos 3|There are 2 flowers and we add 3','Hay 5 flores y sacamos 3|There are 5 flowers and we remove 3','Agregar aumenta la cantidad.|Adding increases the quantity.'),
    q('¿Cuánto es 6 + 3?|What is 6 + 3?','9|9','8|8','Desde seis avanzamos a siete, ocho y nueve.|From six we move to seven, eight, and nine.'),
    q('Desde 5 avanzás 4 pasos. ¿Dónde terminás?|From 5 you move 4 steps forward. Where do you end?','9|9','8|8','Los pasos llegan a 6, 7, 8 y 9.|The steps land on 6, 7, 8, and 9.'),
    q('En un estante hay 4 libros y en otro 6. ¿Cuántos hay juntos?|One shelf has 4 books and another has 6. How many altogether?','10|10','6|6','4 + 6 = 10 libros.|4 + 6 = 10 books.'),
    q('¿Por qué 6 + 4 y 4 + 6 dan igual?|Why do 6 + 4 and 4 + 6 give the same result?','Reordenan los mismos dos grupos|They reorder the same two groups','Porque solo contamos el grupo de seis|Because we only count the group of six','El orden no cambia el total de objetos.|Order does not change the total number of objects.'),
  ],
  'G01-06': [
    q('¿Qué situación puede representarse con 10 − 4?|Which situation can 10 − 4 represent?','Hay 10 y se van 4|There are 10 and 4 leave','Hay 10 y llegan 4|There are 10 and 4 arrive','Restamos la cantidad que se va.|We subtract the number that leaves.'),
    q('¿Cuánto es 9 − 3?|What is 9 − 3?','6|6','7|7','Retrocedemos tres: 8, 7, 6.|We move back three: 8, 7, 6.'),
    q('¿Cuánto falta de 7 a 10?|How many are missing from 7 to 10?','3|3','17|17','7 + 3 = 10.|7 + 3 = 10.'),
    q('Hay 9 platos y 5 vasos. ¿Cuántos platos más que vasos hay?|There are 9 plates and 5 cups. How many more plates than cups are there?','4|4','14|14','Cinco pares dejan cuatro platos sin pareja.|Five pairs leave four plates unpaired.'),
    q('¿Por qué 6 + 3 comprueba 9 − 3 = 6?|Why does 6 + 3 check 9 − 3 = 6?','Devuelve los tres que quitamos|It puts back the three we removed','Quita otros tres|It removes three more','Volvemos a la cantidad inicial de nueve.|We return to the starting quantity of nine.'),
  ],
  'G01-07': [
    q('¿Qué dos partes forman nueve?|Which two parts make nine?','4 y 5|4 and 5','4 y 6|4 and 6','4 + 5 = 9.|4 + 5 = 9.'),
    q('¿Qué falta en 4 + __ = 10?|What is missing in 4 + __ = 10?','6|6','5|5','Diez menos cuatro deja seis lugares.|Ten minus four leaves six spaces.'),
    q('¿Cuánto es 8 + 4 completando diez?|What is 8 + 4 by making ten?','12|12','14|14','4 = 2 + 2; 8 + 2 + 2 = 12.|4 = 2 + 2; 8 + 2 + 2 = 12.'),
    q('Hay nueve pasajeros y suben seis. Completá diez: ¿cuántos quedan en total?|There are nine passengers and six board. Make ten: how many are there altogether?','15|15','16|16','De los seis usamos uno; quedan cinco. 10 + 5 = 15.|We use one of the six; five remain. 10 + 5 = 15.'),
    q('Para 8 + 6, alguien escribe 10 + 6. ¿Qué olvidó?|For 8 + 6, someone writes 10 + 6. What did they forget?','Usó dos del seis para completar diez|They used two of the six to make ten','No se puede completar diez|Making ten is impossible','Quedan cuatro, así que corresponde 10 + 4.|Four remain, so it should be 10 + 4.'),
  ],
  'G01-08': [
    q('¿Qué bloque se repite en ○ △ △ ○ △ △?|Which unit repeats in ○ △ △ ○ △ △?','○ △ △|○ △ △','○ △|○ △','Cada repetición tiene un círculo y dos triángulos.|Each repeat has a circle and two triangles.'),
    q('Repetimos □ ○ ○. Después de □ ○ ○ □ ○ sigue…|We repeat □ ○ ○. After □ ○ ○ □ ○ comes…','○|○','□|□','Falta el segundo círculo del bloque.|The second circle of the unit is missing.'),
    q('Empezá en 3 y sumá 2: 3, 5, 7, __.|Start at 3 and add 2: 3, 5, 7, __.','9|9','8|8','7 + 2 = 9.|7 + 2 = 9.'),
    q('Una pulsera repite estrella, luna. Después de estrella, luna, estrella viene…|A bracelet repeats star, moon. After star, moon, star comes…','Luna|Moon','Estrella|Star','La luna completa el segundo bloque.|The moon completes the second unit.'),
    q('Alguien sigue 2, 4 con 2 y dice «repito 2, 4». ¿Es una regla posible?|Someone follows 2, 4 with 2 and says “I repeat 2, 4.” Is that a possible rule?','Sí, si mantiene ese bloque|Yes, if they keep repeating that unit','No, siempre debe sumar dos|No, they must always add two','Sin una regla fijada, ambas continuaciones pueden justificarse.|Without a fixed rule, both continuations can be justified.'),
  ],
  'G01-09': [
    q('De izquierda a derecha: árbol, banco, fuente. ¿Qué está entre los otros dos?|Left to right: tree, bench, fountain. What is between the others?','Banco|Bench','Árbol|Tree','El banco ocupa el lugar intermedio.|The bench is in the middle.'),
    q('En esa fila, ¿qué está a la derecha del banco?|In that row, what is to the right of the bench?','Fuente|Fountain','Árbol|Tree','La fuente aparece después del banco hacia la derecha.|The fountain appears after the bench toward the right.'),
    q('Desde la casilla de abajo a la izquierda en una grilla 2×2, ¿cómo llegás arriba a la derecha?|From the bottom-left square of a 2×2 grid, how do you reach top right?','Un paso arriba y uno a la derecha|One step up and one right','Un paso abajo y uno a la izquierda|One step down and one left','Se cambia una fila hacia arriba y una columna a la derecha.|Move one row up and one column right.'),
    q('Para buscar un libro, ¿qué indicación es más precisa?|Which instruction is more precise for finding a book?','Está detrás de la caja que estás mirando|It is behind the box you are looking at','Está por ahí|It is somewhere around there','Se da un objeto de referencia y una posición.|It gives a reference object and a position.'),
    q('¿Por qué «dos pasos» no siempre alcanza para seguir un recorrido?|Why is “two steps” not always enough to follow a route?','Falta indicar hacia dónde|It does not say which direction','Porque dos no es un número|Because two is not a number','Necesitamos tanto la dirección como la cantidad de pasos.|We need both direction and number of steps.'),
  ],
  'G01-10': [
    q('¿Cuál es una figura plana?|Which is a flat shape?','Círculo|Circle','Esfera|Sphere','El círculo es plano; la esfera es un cuerpo.|A circle is flat; a sphere is a solid.'),
    q('Una figura cerrada tiene tres lados rectos. ¿Qué es?|A closed shape has three straight sides. What is it?','Triángulo|Triangle','Rectángulo|Rectangle','Los tres lados identifican al triángulo.|Three sides identify a triangle.'),
    q('¿A qué cuerpo se parece una caja con seis caras cuadradas iguales?|Which solid resembles a box with six equal square faces?','Cubo|Cube','Esfera|Sphere','Un cubo tiene seis caras cuadradas iguales.|A cube has six equal square faces.'),
    q('Una lata tiene dos bases circulares y un costado curvo. Se parece a…|A can has two circular bases and a curved side. It resembles…','Un cilindro|A cylinder','Un triángulo|A triangle','Esas partes corresponden al cilindro.|Those parts match a cylinder.'),
    q('¿Por qué un triángulo pequeño y uno grande pueden ser ambos triángulos?|Why can a small and a large triangle both be triangles?','Ambos conservan tres lados rectos|Both have three straight sides','Porque tienen el mismo tamaño|Because they are the same size','La clase de figura depende de sus propiedades, no solo del tamaño.|The shape type depends on its properties, not just size.'),
  ],
  'G01-11': [
    q('¿Qué comparamos al decir «más largo»?|What do we compare when saying “longer”?','Longitud|Length','Cantidad de colores|Number of colors','La longitud indica la extensión de un extremo al otro.|Length describes the extent from one end to the other.'),
    q('Con el mismo inicio, una cinta llega a 6 bloques y otra a 4. ¿Cuál es más larga?|With the same start, one ribbon reaches 6 blocks and another 4. Which is longer?','La de 6 bloques|The 6-block ribbon','La de 4 bloques|The 4-block ribbon','Usando los mismos bloques, seis cubren mayor longitud.|Using the same blocks, six cover a greater length.'),
    q('Una tira se cubre con tres bloques iguales sin huecos. Mide…|A strip is covered by three equal blocks without gaps. It measures…','3 bloques|3 blocks','2 bloques|2 blocks','Contamos cada unidad que cubre la tira.|We count every unit covering the strip.'),
    q('Dos niños comparan sus mesas. ¿Qué deben usar para comparar sus conteos de bloques?|Two children compare their tables. What should they use to compare their block counts?','Bloques de igual longitud|Blocks of equal length','Bloques de cualquier tamaño|Blocks of any size','Los números de unidades se comparan directamente si la unidad es la misma.|Unit counts compare directly when the unit is the same.'),
    q('Para medir, pusiste un bloque encima de otro. ¿Qué pasa?|When measuring, you put one block on top of another. What happens?','Una parte de la longitud se cuenta dos veces|Part of the length is counted twice','La mesa se acorta|The table gets shorter','Poné los bloques uno al lado del otro. No dejes espacios ni pongas uno encima de otro.|Put the blocks side by side. Leave no gaps and do not put one on top of another.'),
  ],
  'G01-12': [
    q('Primero dibujaste y después guardaste el dibujo. Dibujaste…|First you drew a picture. Then you put it away. You drew it…','Antes de guardarlo|Before putting it away','Después de guardarlo|After putting it away','Dibujaste antes de guardar el dibujo.|You drew the picture before putting it away.'),
    q('Para guardar un dibujo: dibujar, dejar secar, guardar. ¿Qué va segundo?|To put away a drawing: draw, let dry, put away. What comes second?','Dejar secar|Let dry','Guardar|Put away','Secar ocurre después de dibujar y antes de guardar.|Drying happens after drawing and before putting away.'),
    q('¿Cuántos días tiene una semana?|How many days are in a week?','7|7','6|6','Lunes a domingo forman siete días.|Monday through Sunday make seven days.'),
    q('La reunión es mañana y hoy es viernes. ¿Qué día será?|The meeting is tomorrow and today is Friday. What day will it be?','Sábado|Saturday','Jueves|Thursday','El día siguiente al viernes es sábado.|The day after Friday is Saturday.'),
    q('Arriba del calendario dice lunes, martes… ¿Para qué sirven esos nombres?|The top of the calendar says Monday, Tuesday… What do those names tell us?','Qué día de la semana es cada columna|Which day of the week each column shows','Todos los meses empiezan el mismo día|Every month starts on the same day','Las fechas cambian de columna según el mes.|Dates fall in different columns depending on the month.'),
  ],
  'G01-13': [
    q('¿Qué criterio separa círculos y cuadrados?|Which rule separates circles and squares?','La forma|Shape','El largo del nombre|Length of the name','Clasificamos por la forma del objeto.|We sort by the object’s shape.'),
    q('Un dibujo muestra cuatro símbolos, uno por voto. ¿Cuántos votos representa?|A picture shows four symbols, one per vote. How many votes does it represent?','4|4','8|8','La clave establece un voto por símbolo.|The key states one vote per symbol.'),
    q('Hay 6 votos para A y 2 para B. ¿Cuántos votos hay en total?|There are 6 votes for A and 2 for B. How many votes in total?','8|8','4|4','6 + 2 = 8.|6 + 2 = 8.'),
    q('Cuatro personas eligen manzana y seis banana. ¿Qué opción tiene más votos?|Four people choose apple and six banana. Which has more votes?','Banana|Banana','Manzana|Apple','Seis es mayor que cuatro.|Six is greater than four.'),
    q('¿Por qué debemos leer la clave de un dibujo de datos?|Why should we read the key of a data picture?','Dice qué cantidad representa cada símbolo|It says how many each symbol represents','Los símbolos siempre valen diez|Symbols always stand for ten','No podemos suponer el valor de un símbolo sin leer la clave.|We cannot assume a symbol’s value without reading the key.'),
  ],
  'G01-14': [
    q('Tenés 4 lápices y te dan 3 más. ¿Qué cuenta muestra lo que pasó?|You have 4 pencils and get 3 more. Which calculation shows what happened?','4 + 3|4 + 3','4 − 3|4 − 3','Recibir más aumenta el grupo.|Receiving more increases the group.'),
    q('Hay 6 lápices y llegan 5. ¿Cuántos hay?|There are 6 pencils and 5 arrive. How many are there?','11|11','10|10','6 + 4 + 1 = 11.|6 + 4 + 1 = 11.'),
    q('Hay 12 hojas y usamos 4. ¿Cuántas quedan?|There are 12 sheets and we use 4. How many remain?','8|8','16|16','12 − 4 = 8.|12 − 4 = 8.'),
    q('Necesitamos 10 vasos y hay 6. ¿Cuántos debemos buscar?|We need 10 cups and have 6. How many must we get?','4|4','16|16','6 + 4 = 10; buscamos lo que falta.|6 + 4 = 10; we find what is missing.'),
    q('¿Qué comprobación apoya que quedaron 8 de 12 hojas al usar 4?|Which check supports that 8 of 12 sheets remain after using 4?','8 + 4 = 12 recupera el inicio|8 + 4 = 12 restores the start','8 + 12 = 20 suma números distintos|8 + 12 = 20 adds different numbers','Juntamos las restantes con las usadas para recuperar el total inicial.|We join the remaining sheets with the used ones to recover the starting total.'),
  ],
};

export function hasGradeOneEvidence(correct: boolean[]): boolean {
  return correct.length === 5 && correct.filter(Boolean).length >= 4 && correct[3] && correct[4];
}
