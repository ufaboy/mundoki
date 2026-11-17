import { text } from '../lessonModel';
// Átomo’s hints: one per lesson check, about the case objects, never the answer.
const hints: Record<string, [string, string]> = {
 "G07-01-L01": [
  "Mirá en qué columna está el 4 de 2405: unidades, decenas, centenas o miles.|Look at which column the 4 in 2405 is in: ones, tens, hundreds, or thousands.",
  "Sumá las cifras de 451 y fijate qué sobra al armar grupos de nueve.|Add the digits of 451 and see what is left after making groups of nine."
 ],
 "G07-01-L02": [
  "Imaginá juntar las filas de los dos carritos: ¿queda alguna fila incompleta?|Imagine putting the rows of both carts together: is any row incomplete?",
  "Probá repartir solo la caja de 2 libros en 3 grupos iguales.|Try sharing only the box of 2 books into 3 equal groups."
 ],
 "G07-01-L03": [
  "Buscá el casillero cuyo número tiene un divisor además de 1 y de sí mismo.|Find the locker whose number has a divisor besides 1 and itself.",
  "Escribí los divisores de dos y fijate si es par.|Write down the divisors of two and check whether it is even."
 ],
 "G07-02-L01": [
  "Dividí 7 entre 8 hasta que no sobre nada; después compará con las marcas de la jarra.|Divide 7 by 8 until nothing is left; then compare with the jug marks.",
  "Sumá los centésimos de la tarjeta y compará con cien centésimos.|Add the hundredths on the card and compare with one hundred hundredths."
 ],
 "G07-02-L02": [
  "Antes de sumar, calculá cuánto son tres sextos de taza.|Before adding, work out how much three sixths of a cup is.",
  "Primero averiguá cuánto café hay en total; después repartilo en los dos frascos.|First find how much coffee there is in total; then share it between the two jars."
 ],
 "G07-02-L03": [
  "Pasá los litros a décimos: ¿cuántas veces entra 3 en 24?|Turn the liters into tenths: how many times does 3 fit into 24?",
  "0,2 es un quinto. ¿Cuánto es un quinto de 5 cafés?|0.2 is one fifth. How much is one fifth of 5 coffees?"
 ],
 "G07-03-L01": [
  "Repartí las 20 cuadras entre los 8 minutos: ¿cuántas tocan a cada minuto?|Share the 20 blocks among the 8 minutes: how many go to each minute?",
  "Pensá en la tabla de coartadas: ¿qué columna permite comparar a Aurelio con Clara?|Think about the alibi table: which column lets you compare Aurelio with Clara?"
 ],
 "G07-03-L02": [
  "En la recta de Rayo, multiplicá los km por el precio de un km.|On Rayo’s line, multiply the km by the price of one km.",
  "Calculá el costo dividido por los km para 1 km y para 2 km en la recta de Cóndor.|Work out the cost divided by the km for 1 km and for 2 km on Cóndor’s line."
 ],
 "G07-03-L03": [
  "Multiplicá los 5 cm del mapa por 20.000 y pasá el resultado de cm a km.|Multiply the 5 cm on the map by 20,000 and convert the result from cm to km.",
  "Calculá el 25 % de 80 lupas y restalo del precio del libro.|Work out 25% of 80 lupas and subtract it from the book’s price."
 ],
 "G07-04-L01": [
  "Contá los barrotes del primer cuadrado y después solo los nuevos de cada cuadrado.|Count the bars of the first square, then only the new bars of each square.",
  "Dibujá un cuadrado más en la reja y contá solo los barrotes nuevos.|Draw one more square on the gate and count only the new bars."
 ],
 "G07-04-L02": [
  "En una reja de 12 cuadrados, tapá el primero: ¿cuántos quedan?|In a gate of 12 squares, cover the first one: how many are left?",
  "¿Podría otra reja empezar con 4, 7, 10 y seguir distinto?|Could another gate start with 4, 7, 10 and continue differently?"
 ],
 "G07-04-L03": [
  "Reemplazá n por 6: primero multiplicá 3 por 6 y después sumá 1.|Replace n with 6: first multiply 3 by 6, then add 1.",
  "Mirá una reja real: ¿se puede construir medio cuadrado de barrotes?|Look at a real gate: can half a square of bars be built?"
 ],
 "G07-05-L01": [
  "Leé la orden: ¿qué medida de la foto cambia de un marco a otro?|Read the order: which measurement of the photo changes from one frame to another?",
  "El listón rodea la foto: ¿mide una longitud o una superficie?|The strip goes around the photo: does it measure a length or a surface?"
 ],
 "G07-05-L02": [
  "Reemplazá w por 7: multiplicá 2 por 7 y después sumá 4.|Replace w with 7: multiply 2 by 7, then add 4.",
  "Recorré con el dedo el borde de la foto y sumá cada tramo del listón.|Trace the photo’s edge with your finger and add each piece of the strip."
 ],
 "G07-05-L03": [
  "Para w = 4, calculá 2 × 4 + 4 y buscá el punto con ese segundo número.|For w = 4, work out 2 × 4 + 4 and find the point with that second number.",
  "Dividí el listón por el ancho en dos filas de la tabla del cartel y compará.|Divide the strip by the width in two rows of the sign’s table and compare."
 ],
 "G07-06-L01": [
  "Sobre la calle recta, los dos ángulos juntos forman media vuelta.|Along the straight street, the two angles together make half a turn.",
  "Mirá qué ángulo del cruce está enfrentado al de 72°, tocándolo solo por el vértice.|Look at which angle of the crossing faces the 72° angle, touching it only at the vertex."
 ],
 "G07-06-L02": [
  "Sumá las dos esquinas de la plazoleta y restá de 180°.|Add the two corners of the square and subtract from 180°.",
  "Trazá una diagonal de la manzana: ¿qué figuras aparecen?|Draw a diagonal of the block: which shapes appear?"
 ],
 "G07-06-L03": [
  "Sumá los dos cordones más cortos y compará con el más largo.|Add the two shortest strings and compare with the longest.",
  "Un arco reúne todos los puntos a la misma distancia del centro: ¿qué medida fija?|An arc collects all the points at the same distance from the center: what measurement does it fix?"
 ],
 "G07-07-L01": [
  "Ampliar por tres es multiplicar: aplicalo al ancho y al largo del negativo.|Enlarging by three means multiplying: apply it to both the width and length of the negative.",
  "Probá con una copia de 2 × 4: sumá 3 a cada lado y compará las razones.|Try a 2 × 4 copy: add 3 to each side and compare the ratios."
 ],
 "G07-07-L02": [
  "Dibujá cuántas copias de la foto original entran en la ampliación: filas por columnas.|Draw how many copies of the original photo fit in the enlargement: rows times columns.",
  "El marco es el borde: ¿qué le pasa a cada tramo si cada lado se reduce a la mitad?|The frame is the edge: what happens to each piece if every side is halved?"
 ],
 "G07-07-L03": [
  "Calculá el cerco de cada cantero sumando sus cuatro lados.|Work out each bed’s fence by adding its four sides.",
  "Buscá el par de canteros con el mismo cerco y compará cuánta tierra tiene cada uno.|Find the pair of beds with the same fence and compare how much soil each has."
 ],
 "G07-08-L01": [
  "Las caras gemelas están enfrentadas en la caja: ¿qué medidas tiene la de enfrente?|Twin faces are opposite each other in the box: what size is the opposite face?",
  "Imaginá plegar seis cuadrados en una fila larga: ¿se cierra la caja?|Imagine folding six squares in one long row: does the box close?"
 ],
 "G07-08-L02": [
  "El cubito tiene largo, ancho y alto: ¿qué unidad tiene tres dimensiones?|The cube has length, width, and height: which unit has three dimensions?",
  "Contá los cubitos de una capa de 2 × 2 y multiplicá por las capas.|Count the cubes in one 2 × 2 layer and multiply by the number of layers."
 ],
 "G07-08-L03": [
  "Calculá el área de cada tipo de cara de la caja de 2 × 2 × 6 y recordá que hay dos de cada una.|Work out the area of each type of face of the 2 × 2 × 6 box and remember there are two of each.",
  "Para comparar papel, ¿qué tiene que ser igual en las dos cajas?|To compare paper, what must be the same in both boxes?"
 ],
 "G07-09-L01": [
  "Dividí los que eligieron dibujo por el total de la encuesta.|Divide the number who chose drawing by the survey total.",
  "Leé los números del eje, no solo la altura de las barras.|Read the numbers on the axis, not only the height of the bars."
 ],
 "G07-09-L02": [
  "Sumá los acertijos de las cuatro semanas y dividí por cuatro.|Add the riddles of the four weeks and divide by four.",
  "Buscá qué cantidad de acertijos aparece más veces en la lista.|Find which number of riddles appears most often in the list."
 ],
 "G07-09-L03": [
  "En cada grupo de letras, restá la altura menor a la mayor.|In each group of letters, subtract the smallest height from the largest.",
  "Pensá a quiénes preguntaron Los Halcones y a quiénes no.|Think about whom the Halcones asked and whom they did not."
 ],
 "G07-10-L01": [
  "Escribí las caras del dado y marcá solo las menores que tres.|Write the faces of the die and mark only those less than three.",
  "Un dado tallado a mano puede ser desparejo: ¿alcanza con nombrar las caras?|A hand-carved die can be uneven: is naming the faces enough?"
 ],
 "G07-10-L02": [
  "Mirá dentro de la bolsa: ¿hay alguna bolita azul?|Look inside the bag: is there any blue marble?",
  "Buscá el evento que ocurre con cualquier bolita que saques.|Find the event that happens with any marble you draw."
 ],
 "G07-10-L03": [
  "Escribí las caras como fracción del total de tiradas y pasala a porcentaje.|Write the heads as a fraction of all the tosses and turn it into a percentage.",
  "¿La moneda recuerda lo que salió antes?|Does the coin remember what came up before?"
 ],
 "G07-11-L01": [
  "Calculá el área de toda la huerta y restá la franja de lectura.|Work out the area of the whole garden and subtract the reading strip.",
  "Pasá 6 m a cm y dividí por 100.|Convert 6 m to cm and divide by 100."
 ],
 "G07-11-L02": [
  "Si descuentan el 30 % de las mesas, ¿qué parte del precio queda?|If 30% is taken off the tables, what part of the price remains?",
  "Leé la condición: ¿sobre qué compras vale el descuento?|Read the condition: which purchases does the discount apply to?"
 ],
 "G07-11-L03": [
  "Dibujá el cantero con lados dobles y contá cuántas copias del original entran.|Draw the bed with doubled sides and count how many copies of the original fit.",
  "Recordá las dos mensajerías: ¿qué tenía Cóndor que Rayo no tenía?|Remember the two couriers: what did Cóndor have that Rayo did not?"
 ]
};
export function getGradeSevenHints(id: string) {
 const pair = hints[id];
 if (!pair) throw new Error(`Missing Grade 7 hints: ${id}`);
 return pair.map(text);
}
