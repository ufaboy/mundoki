import type { GradeOneCheck } from '../lessonModel';
import { choice as c, entry as e } from './checks';

// Each package: recognition, two procedures, application, reasoning.
// Number answers are typed; the other questions offer 3–4 options (see checks.ts).
export const GRADE_TWO_ASSESSMENTS: Record<string, GradeOneCheck[]> = {
  'G02-01': [
    e('¿Qué cifra ocupa las centenas en 754?|Which digit is in the hundreds place in 754?',7,'El siete representa setecientos.|The seven represents seven hundred.'),
    e('¿Cómo escribimos ochocientos nueve?|How do we write eight hundred nine?',809,'Son ocho centenas, cero decenas y nueve unidades.|It is eight hundreds, zero tens, and nine ones.'),
    c('¿Cuál es el menor: 672, 627 o 762?|Which is the smallest: 672, 627, or 762?','627|627',['672|672','762|762'],'Con las mismas centenas, dos decenas son menos que siete. 762 tiene más centenas.|With the same hundreds, two tens are fewer than seven. 762 has more hundreds.'),
    c('Una biblioteca tiene 905 libros y otra 950. ¿Cuál tiene más?|One library has 905 books and another 950. Which has more?','La de 950|The one with 950',['La de 905|The one with 905','Tienen lo mismo|They have the same'],'Cinco decenas superan cero decenas cuando coinciden las centenas.|Five tens exceed zero tens when the hundreds match.'),
    c('¿Por qué 80 y 800 no representan lo mismo?|Why do 80 and 800 differ?','El ocho cambia de decenas a centenas|The eight changes from tens to hundreds',['Los ceros nunca importan|Zeros never matter','Porque 800 tiene un ocho más|Because 800 has one more eight'],'Ocho decenas son ochenta; ocho centenas son ochocientos.|Eight tens are eighty; eight hundreds are eight hundred.'),
  ],
  'G02-02': [
    c('¿Qué suma conserva los valores de 735?|Which sum preserves the values in 735?','700 + 30 + 5|700 + 30 + 5',['7 + 3 + 5|7 + 3 + 5','70 + 30 + 5|70 + 30 + 5','700 + 3 + 5|700 + 3 + 5'],'Se usan los valores de posición, no solo las cifras.|We use place values, not just digits.'),
    e('¿Cuántas decenas son 200?|How many tens are in 200?',20,'Cada centena contiene diez decenas.|Each hundred contains ten tens.','decenas|tens'),
    e('¿Qué total tiene 400 + 170 + 6?|What is the total of 400 + 170 + 6?',576,'400 + 100 + 70 + 6 = 576.|400 + 100 + 70 + 6 = 576.'),
    c('Hay 360 botones. Abrimos una caja de cien y hacemos paquetes de diez. ¿Qué representación sirve?|There are 360 buttons. We open one box of one hundred and make packs of ten. Which representation works?','200 + 160|200 + 160',['200 + 60|200 + 60','300 + 160|300 + 160'],'Los cien abiertos siguen en el total como diez decenas.|The opened hundred remains in the total as ten tens.'),
    c('¿Por qué 600 + 20 y 500 + 120 son iguales?|Why are 600 + 20 and 500 + 120 equal?','Una parte perdió cien y otra ganó cien|One part lost one hundred and another gained one hundred',['Porque se puede borrar una centena|Because we can erase one hundred','No son iguales: el segundo es mayor|They are not equal: the second is greater'],'Solo cambió la agrupación; ambas suman 620.|Only the grouping changed; both total 620.'),
  ],
  'G02-03': [
    c('¿Qué salto se repite en 215, 315, 415?|Which step repeats in 215, 315, 415?','100|100',['10|10','1|1'],'Cada número tiene cien más que el anterior.|Each number is one hundred more than the one before it.'),
    e('Completá con pasos de veinte: 160, 180, __.|Complete with steps of twenty: 160, 180, __.',200,'180 + 20 = 200.|180 + 20 = 200.'),
    e('¿Cuánto es 301 − 10?|What is 301 − 10?',291,'Restamos una decena, no una unidad.|We subtract one ten, not one one.'),
    e('Hay 650 hojas y llega un paquete de 50. ¿Cuántas hay?|There are 650 sheets and a pack of 50 arrives. How many are there?',700,'650 + 50 = 700.|650 + 50 = 700.','hojas|sheets'),
    c('¿Por qué 290 + 10 cambia también la cifra de centenas?|Why does 290 + 10 change the hundreds digit too?','Diez decenas se cambian por una centena|Ten tens are exchanged for one hundred',['Porque diez vale cien|Because ten equals one hundred','Porque se suma a las centenas|Because it is added to the hundreds'],'Nueve decenas más una forman diez decenas: una centena.|Nine tens plus one makes ten tens: one hundred.'),
  ],
  'G02-04': [
    c('Para saber cuántos más son 48 que 31, ¿qué cuenta sirve?|To find how many more 48 is than 31, which calculation fits?','48 − 31|48 − 31',['48 + 31|48 + 31','31 − 48|31 − 48'],'Se busca la diferencia, no el total.|We seek the difference, not the total.'),
    e('Hay 26 en un grupo y 13 en otro. ¿Cuántos hay juntos?|There are 26 in one group and 13 in another. How many altogether?',39,'26 + 13 = 39.|26 + 13 = 39.'),
    e('Completá 28 + __ = 45.|Complete 28 + __ = 45.',17,'28 + 2 + 15 = 45.|28 + 2 + 15 = 45.'),
    e('Después de recibir 14 cartas, Eva tiene 36. ¿Cuántas tenía antes?|After receiving 14 cards, Eva has 36. How many did she have before?',22,'Buscamos el inicio: 36 − 14 = 22.|We seek the start: 36 − 14 = 22.','cartas|cards'),
    c('¿Por qué la palabra «más» no basta para elegir suma?|Why is the word “more” insufficient to choose addition?','Puede preguntar por una diferencia o un dato desconocido|It may ask for a difference or an unknown quantity',['Porque siempre hay que restar|Because we must always subtract','Porque «más» siempre significa multiplicar|Because “more” always means multiplying'],'La relación entre las cantidades y la pregunta decide la operación.|The relationship between quantities and the question determines the operation.'),
  ],
  'G02-05': [
    c('¿Qué descomposición sirve para sumar 46 + 23?|Which decomposition works for 46 + 23?','46 + 20 + 3|46 + 20 + 3',['46 + 2 + 3|46 + 2 + 3','40 + 2 + 3|40 + 2 + 3'],'Veintitrés se conserva como veinte más tres.|Twenty-three is preserved as twenty plus three.'),
    e('¿Cuánto es 57 + 6?|What is 57 + 6?',63,'57 + 3 + 3 = 63.|57 + 3 + 3 = 63.'),
    e('¿Cuánto es 64 − 8?|What is 64 − 8?',56,'64 − 4 − 4 = 56.|64 − 4 − 4 = 56.'),
    e('Compramos 38 etiquetas y luego 25. ¿Cuántas tenemos?|We buy 38 labels, then 25. How many do we have?',63,'38 + 20 = 58; 58 + 5 = 63.|38 + 20 = 58; 58 + 5 = 63.','etiquetas|labels'),
    c('Alguien afirma 81 − 37 = 54. ¿Qué muestra 54 + 37 = 91?|Someone claims 81 − 37 = 54. What does 54 + 37 = 91 show?','La respuesta no recupera el inicio y hay que revisar|The answer does not recover the start and needs review',['La respuesta queda comprobada|The answer is confirmed','Que 81 − 37 es 91|That 81 − 37 is 91'],'La comprobación debe volver a 81, no a 91.|The check must return to 81, not 91.'),
  ],
  'G02-06': [
    c('¿Qué significa el doble de una cantidad?|What does double a quantity mean?','Dos partes iguales a esa cantidad|Two parts equal to that quantity',['Esa cantidad más dos|That quantity plus two','La mitad de esa cantidad|Half of that quantity'],'Duplicar repite la misma cantidad dos veces.|Doubling repeats the same quantity twice.'),
    e('¿Cuál es el doble de 18?|What is double 18?',36,'18 + 18 = 36.|18 + 18 = 36.'),
    e('¿Cuál es la mitad de 40?|What is half of 40?',20,'20 + 20 = 40.|20 + 20 = 40.'),
    e('Un equipo tiene 11 tarjetas y otro 12. Usá el doble de 11: ¿cuántas hay juntas?|One team has 11 cards and another 12. Use double 11: how many altogether?',23,'11 + 11 = 22 y una más da 23.|11 + 11 = 22 and one more gives 23.','tarjetas|cards'),
    c('¿Por qué 14 y 16 no son mitades de 30?|Why are 14 and 16 not halves of 30?','Suman treinta pero no son partes iguales|They total thirty but are not equal parts',['Porque las mitades deben sumar veinte|Because halves must total twenty','Porque 14 + 16 no da 30|Because 14 + 16 does not make 30'],'Las mitades de treinta son dos partes de quince.|The halves of thirty are two parts of fifteen.'),
  ],
  'G02-07': [
    c('¿Qué situación tiene grupos iguales?|Which situation has equal groups?','Tres bolsas con cuatro fichas cada una|Three bags with four counters each',['Bolsas con dos, cuatro y seis fichas|Bags with two, four, and six counters','Una bolsa con cuatro y otra con tres|One bag with four and another with three'],'Todos los grupos deben tener el mismo tamaño.|All groups must have the same size.'),
    e('¿Cuánto es 4 + 4 + 4 + 4 + 4?|What is 4 + 4 + 4 + 4 + 4?',20,'Cinco grupos de cuatro forman veinte.|Five groups of four make twenty.'),
    e('Una tabla dice 1 paquete → 3, 2 → 6, 3 → 9. ¿Cuánto corresponde a 6 paquetes?|A table says 1 pack → 3, 2 → 6, 3 → 9. What matches 6 packs?',18,'Seis paquetes de tres forman dieciocho.|Six packs of three make eighteen.'),
    e('Cada una de siete mesas necesita dos vasos. ¿Cuántos vasos hacen falta?|Each of seven tables needs two cups. How many cups are needed?',14,'7 × 2 = 14.|7 × 2 = 14.','vasos|cups'),
    c('¿Por qué 4 grupos de 7 no se calculan con 4 + 7?|Why are 4 groups of 7 not calculated with 4 + 7?','Cada uno de los cuatro grupos aporta siete|Each of the four groups contributes seven',['Porque nunca se puede sumar|Because we can never add','Porque hay que restar 7 − 4|Because we must subtract 7 − 4'],'Se suma siete cuatro veces, no el número de grupos más su tamaño.|We add seven four times, not the group count plus the size.'),
  ],
  'G02-08': [
    c('En 20 fichas repartidas entre cinco personas, ¿qué buscamos?|In 20 counters shared among five people, what do we seek?','Fichas por persona|Counters per person',['Número de personas|Number of people','Total de fichas|Total counters'],'La cantidad de personas ya está dada.|The number of people is already given.'),
    e('Repartí 16 fichas por igual entre dos. ¿Cuántas recibe cada uno?|Share 16 counters equally between two. How many does each receive?',8,'8 + 8 = 16.|8 + 8 = 16.','fichas|counters'),
    e('Con 21 fichas, ¿cuántos grupos de tres formamos?|With 21 counters, how many groups of three can we form?',7,'Siete grupos de tres reconstruyen veintiuno.|Seven groups of three rebuild twenty-one.','grupos|groups'),
    c('Hay 30 lápices y cada caja guarda cinco. ¿Cuántas cajas llenamos?|There are 30 pencils and each box holds five. How many boxes do we fill?','6 cajas|6 boxes',['6 lápices por caja|6 pencils per box','5 cajas|5 boxes','25 cajas|25 boxes'],'Buscamos cantidad de cajas: 30 ÷ 5 = 6.|We seek the number of boxes: 30 ÷ 5 = 6.'),
    c('Si respondés «seis», ¿por qué conviene aclarar «seis cajas» o «seis lápices para cada uno»?|If you answer “six,” why should you say “six boxes” or “six pencils for each person”?','Para saber qué estamos contando|To know what we are counting',['Porque toda división cuenta personas|Because every division counts people','Porque así el número es más grande|Because that makes the number bigger'],'La misma cuenta puede responder preguntas diferentes.|The same calculation can answer different questions.'),
  ],
  'G02-09': [
    c('¿Qué es un vértice de un polígono?|What is a vertex of a polygon?','El punto donde se unen dos lados|The point where two sides meet',['Toda la superficie interior|The whole inside surface','Uno de los lados rectos|One of the straight sides'],'Los vértices son uniones del borde recto.|Vertices are meetings of straight boundary segments.'),
    e('Una figura cerrada tiene seis lados rectos. ¿Cuántos vértices tiene?|A closed shape has six straight sides. How many vertices does it have?',6,'Al recorrerla se encuentran seis uniones de lados.|Going around it gives six meetings of sides.','vértices|vertices'),
    e('¿Cuántas caras tiene un cubo, contando las que no vemos?|How many faces does a cube have, including hidden ones?',6,'El cubo tiene seis caras cuadradas.|A cube has six square faces.','caras|faces'),
    c('Buscás un cuerpo con dos bases circulares planas y un costado curvo. ¿Cuál elegís?|You seek a solid with two flat circular bases and a curved side. Which do you choose?','Cilindro|Cylinder',['Esfera|Sphere','Cubo|Cube'],'Una esfera no tiene bases planas y un cubo no tiene costado curvo.|A sphere has no flat bases, and a cube has no curved side.'),
    c('¿Por qué «cuatro lados iguales» no identifica solo al cuadrado?|Why does “four equal sides” not identify only a square?','También lo cumplen rombos sin esquinas rectas|Rhombuses without square corners also fit',['Porque los cuadrados tienen tres lados|Because squares have three sides','Porque los rectángulos largos también tienen lados iguales|Because long rectangles also have all sides equal'],'Para distinguir el cuadrado hay que precisar sus esquinas rectas.|To distinguish a square, specify its square corners.'),
  ],
  'G02-10': [
    c('¿Qué símbolo debemos reconocer antes de empezar un recorrido?|Which symbol should we recognize before beginning a route?','El punto de partida|The starting point',['Solo el color del papel|Only the paper’s color','El título del plano|The map’s title'],'Sin inicio no sabemos desde dónde aplicar los pasos.|Without a start we do not know where to apply the steps.'),
    e('En una fila de cinco casillas, vas de la primera a la quinta. ¿Cuántos pasos hacés?|In a row of five squares, you go from first to fifth. How many steps?',4,'Contamos movimientos entre casillas, no la casilla inicial.|We count moves between squares, not the starting square.','pasos|steps'),
    c('Desde una casilla central, un paso a la derecha y uno a la izquierda te dejan…|From a central square, one step right and one left leave you…','En el inicio|At the start',['Dos casillas a la derecha|Two squares to the right','Dos casillas a la izquierda|Two squares to the left'],'El segundo movimiento deshace el primero.|The second move undoes the first.'),
    c('Una instrucción pasa por una casilla prohibida antes de llegar a la meta. ¿Es válida?|An instruction crosses a forbidden square before reaching the destination. Is it valid?','No: debe evitar el obstáculo|No: it must avoid the obstacle',['Sí: basta llegar al final|Yes: reaching the end is enough','Sí, si tiene pocos pasos|Yes, if it has few steps'],'Un camino debe respetar todas las reglas, no solo el destino.|A route must obey all rules, not just reach the destination.'),
    c('¿Por qué otra persona debe probar nuestras instrucciones?|Why should another person try our instructions?','Para comprobar que son claras y llegan a la meta|To check that they are clear and reach the destination',['Para que memorice sin mirar el plano|To memorize them without looking at the plan','Para que el camino sea más largo|To make the route longer'],'Seguirlas permite detectar pasos ambiguos o faltantes.|Following them reveals ambiguous or missing steps.'),
  ],
  'G02-11': [
    c('Para saber cuánta agua cabe en una jarra, ¿qué usamos?|To find how much water a jug holds, what do we use?','Un recipiente graduado|A marked measuring container',['Una regla para contar horas|A ruler to count hours','Una balanza|A scale'],'Las marcas del recipiente muestran cuántos litros de agua hay.|The container’s marks show how many liters of water there are.'),
    e('Una cinta empieza en 4 cm y termina en 10 cm. ¿Cuánto mide?|A ribbon starts at 4 cm and ends at 10 cm. How long is it?',6,'10 − 4 = 6.|10 − 4 = 6.','cm|cm'),
    e('Una actividad va de 10:00 a 13:00 del mismo día. ¿Cuánto dura?|An activity runs from 10:00 to 13:00 the same day. How long does it last?',3,'Son tres intervalos de una hora.|There are three one-hour intervals.','horas|hours'),
    c('Una bolsa grande de algodón y una pequeña de arroz: ¿cómo sabemos cuál tiene más masa?|A large bag of cotton and a small bag of rice: how do we know which has more mass?','Usando una balanza|Using a scale',['Eligiendo siempre la más grande|Always choosing the larger one','Midiendo su largo con una regla|Measuring their length with a ruler'],'El tamaño por sí solo no determina la masa.|Size alone does not determine mass.'),
    c('¿Por qué hay que escribir cm, kg o L junto a la medida?|Why write cm, kg, or L beside a measurement?','La unidad indica qué y cómo se midió|The unit indicates what was measured and how',['Todas las unidades significan lo mismo|All units mean the same thing','Para que el número sea más grande|To make the number bigger'],'El número sin unidad no permite interpretar la medida.|A number without a unit does not let us interpret the measurement.'),
  ],
  'G02-12': [
    c('¿Qué debe mostrar una tabla de conteos?|What should a count table show?','Cada categoría y su cantidad|Each category and its count',['Solo una lista de números sin nombres|Only unnamed numbers','Solo los nombres, sin números|Only the names, without numbers'],'Las categorías permiten interpretar cada cantidad.|Categories let us interpret each quantity.'),
    e('Una tabla muestra 7 autos, 4 bicicletas y 3 colectivos. ¿Cuál es el total?|A table shows 7 cars, 4 bicycles, and 3 buses. What is the total?',14,'7 + 4 + 3 = 14.|7 + 4 + 3 = 14.'),
    e('Si un símbolo vale dos objetos, ¿cuántos símbolos representan 12 objetos?|If a symbol means two objects, how many symbols represent 12 objects?',6,'Seis grupos de dos forman doce.|Six groups of two make twelve.','símbolos|symbols'),
    e('Cada estrella vale dos votos. Una actividad tiene seis estrellas y otra cuatro. ¿Cuántos votos de diferencia hay?|Each star means two votes. One activity has six stars and another four. How many votes apart are they?',4,'Dos estrellas de diferencia equivalen a cuatro votos.|A difference of two stars equals four votes.','votos|votes'),
    c('¿Qué error aparece si contamos un mismo voto dos veces?|What error occurs if we count the same vote twice?','El total deja de representar los votos reales|The total no longer represents the real votes',['El total se vuelve más preciso|The total becomes more accurate','No pasa nada|Nothing happens'],'Anotá cada voto una sola vez.|Write down each vote only once.'),
  ],
  'G02-13': [
    c('Para preparar seis cajas con cuatro objetos cada una, ¿qué cuenta corresponde?|To prepare six boxes with four objects each, which calculation fits?','6 × 4|6 × 4',['6 + 4|6 + 4','6 − 4|6 − 4'],'Se repite cuatro una vez por caja.|Four is repeated once per box.'),
    e('¿Cuánto es cien más que 347?|What is one hundred more than 347?',447,'347 + 100 = 447.|347 + 100 = 447.'),
    e('¿Cuánto es diez menos que 347?|What is ten less than 347?',337,'347 − 10 = 337.|347 − 10 = 337.'),
    e('Hay 24 materiales para cuatro mesas. Si repartimos igual, ¿cuántos recibe cada mesa?|There are 24 supplies for four tables. If shared equally, how many does each table receive?',6,'4 × 6 = 24 comprueba el reparto.|4 × 6 = 24 checks the sharing.','materiales|supplies'),
    c('¿Por qué 300 + 40 + 7 y 200 + 140 + 7 representan 347?|Why do 300 + 40 + 7 and 200 + 140 + 7 represent 347?','Una centena se cambió por diez decenas sin cambiar el total|One hundred was exchanged for ten tens without changing the total',['Se perdió una centena|One hundred was lost','No representan lo mismo|They do not represent the same number'],'Los cien siguen incluidos en 140.|The hundred is still included in 140.'),
  ],
};
