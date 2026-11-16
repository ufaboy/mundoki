import { text } from '../lessonModel';
const hints: Record<string, [string, string]> = {
 "G07-01-L01": [
  "Buscá la posición del 4: unidades, decenas o centenas.|Find the position of 4: ones, tens, or hundreds.",
  "Sumá las cifras y buscá qué sobra al formar grupos de nueve.|Add the digits and find what remains after making groups of nine."
 ],
 "G07-01-L02": [
  "Imaginá juntar dos colecciones de grupos completos de cinco.|Imagine combining two collections of complete groups of five.",
  "Probá dividir cada sumando por tres por separado.|Try dividing each addend by three separately."
 ],
 "G07-01-L03": [
  "Buscá una opción que tenga divisores además de uno y de sí misma.|Find an option with divisors besides one and itself.",
  "Listá los divisores de dos y comprobá si es par.|List the divisors of two and check whether it is even."
 ],
 "G07-02-L01": [
  "Dividí siete entre ocho y verificá multiplicando por ocho.|Divide seven by eight and check by multiplying by eight.",
  "Sumá los centésimos y compará con cien centésimos.|Add the hundredths and compare with one hundred hundredths."
 ],
 "G07-02-L02": [
  "Primero calculá tres veces un sexto; después agregá un medio.|First calculate three times one sixth; then add one half.",
  "Resolvé primero lo que está entre paréntesis.|Work out what is inside the parentheses first."
 ],
 "G07-02-L03": [
  "Expresá las dos cantidades en décimos y contá grupos de tres.|Express both quantities in tenths and count groups of three.",
  "0,2 es un quinto. Pensá qué parte de cinco estás tomando.|0.2 is one fifth. Think about what part of five you are taking."
 ],
 "G07-03-L01": [
  "Repartí el costo total entre las ocho etiquetas.|Share the total cost among the eight labels.",
  "Elegí una misma cantidad de lápices como referencia para ambos paquetes.|Choose the same number of pencils as a reference for both packs."
 ],
 "G07-03-L02": [
  "Reemplazá x por dos y medio; 4x significa cuatro veces x.|Replace x with two and a half; 4x means four times x.",
  "Calculá el costo por unidad con x = 1 y con x = 2.|Calculate cost per unit with x = 1 and with x = 2."
 ],
 "G07-03-L03": [
  "Hallá un cuarto de 80 y restalo del precio original.|Find one quarter of 80 and subtract it from the original price.",
  "Pasá del plano a la realidad multiplicando por 200; después convertí cm a m.|Go from plan to reality by multiplying by 200; then convert cm to m."
 ],
 "G07-04-L01": [
  "Contá cuatro palitos al empezar y tres por cada cuadrado nuevo.|Count four sticks to start and three for each new square.",
  "Buscá el lado que el cuadrado nuevo comparte con el anterior.|Find the side the new square shares with the previous one."
 ],
 "G07-04-L02": [
  "Separá el primer cuadrado de los que se agregan después.|Separate the first square from those added later.",
  "Pensá si podrías continuar esos tres números de dos maneras distintas.|Think whether you could continue those three numbers in two different ways."
 ],
 "G07-04-L03": [
  "Reemplazá n por seis y multiplicá antes de sumar.|Replace n with six and multiply before adding.",
  "Recordá qué cuenta n: ¿se permiten cuadrados incompletos en esta fila?|Recall what n counts: are incomplete squares allowed in this row?"
 ],
 "G07-05-L01": [
  "Buscá en el enunciado qué medida puede cambiar.|Find the measurement that can change in the description.",
  "El perímetro recorre el borde. Pensá qué unidad usarías para medirlo.|Perimeter follows the boundary. Think what unit you would use to measure it."
 ],
 "G07-05-L02": [
  "Sustituí w por siete y hacé primero la multiplicación.|Replace w with seven and multiply first.",
  "Recorré el borde del rectángulo y anotá cada longitud.|Follow the rectangle boundary and write down each length."
 ],
 "G07-05-L03": [
  "El primer número es el ancho. Usalo en la fórmula y compará con el segundo.|The first number is width. Use it in the formula and compare with the second.",
  "Dividí el perímetro por el ancho en dos filas de la tabla.|Divide perimeter by width in two rows of the table."
 ],
 "G07-06-L01": [
  "Completá media vuelta: restá el ángulo conocido de 180°.|Complete a half turn: subtract the known angle from 180°.",
  "Buscá el ángulo que queda enfrente, sin compartir un lado.|Find the angle across the vertex, with no shared side."
 ],
 "G07-06-L02": [
  "Sumá los dos ángulos conocidos y completá 180°.|Add the two known angles and complete 180°.",
  "Trazá una diagonal y contá los triángulos que aparecen.|Draw a diagonal and count the triangles it makes."
 ],
 "G07-06-L03": [
  "Sumá los dos lados cortos y compará con el más largo.|Add the two shorter sides and compare with the longest.",
  "Recordá que todos los puntos del arco están a la misma distancia del centro.|Recall that all points on the arc are the same distance from its center."
 ],
 "G07-07-L01": [
  "Aplicá el factor tres a cada medida por separado.|Apply the factor three to each measurement separately.",
  "Compará las razones entre los lados antes y después de sumar.|Compare the side-length ratios before and after adding."
 ],
 "G07-07-L02": [
  "Contá cuántas copias entran por fila y cuántas filas hay.|Count copies per row and the number of rows.",
  "El perímetro suma los lados. Pensá qué pasa si cada sumando se divide por dos.|Perimeter adds the side lengths. Think what happens when each term is halved."
 ],
 "G07-07-L03": [
  "Sumá los cuatro lados de cada rectángulo y compará.|Add all four sides of each rectangle and compare.",
  "Buscá dos rectángulos con el mismo borde pero distinta superficie.|Find two rectangles with the same boundary length but different areas."
 ],
 "G07-08-L01": [
  "Buscá la cara opuesta: debe tener las mismas dos medidas.|Find the opposite face: it must have the same two measurements.",
  "Imaginá plegar una fila de seis cuadrados: ¿cerraría sin superponer caras?|Imagine folding a row of six squares: would it close without overlapping faces?"
 ],
 "G07-08-L02": [
  "Pensá si estás contando cuadrados para cubrir o cubos para llenar.|Think whether you are counting squares to cover or cubes to fill.",
  "Contá los cubitos de una capa y multiplicá por la cantidad de capas.|Count cubes in one layer and multiply by the number of layers."
 ],
 "G07-08-L03": [
  "Hallá las áreas de los tres tipos de cara y recordá que hay dos de cada tipo.|Find the areas of the three face types and remember there are two of each.",
  "Para comparar material, revisá qué se mantiene igual y qué se mide.|To compare material, check what stays the same and what is measured."
 ],
 "G07-09-L01": [
  "Escribí las seis respuestas de dibujo como parte del total de veinte.|Write the six drawing votes as a fraction of all twenty votes.",
  "Compará los valores escritos, no solo los tramos visibles desde cinco.|Compare the written values, not just the visible portions above five."
 ],
 "G07-09-L02": [
  "Sumá los cuatro datos y repartí el total en cuatro partes iguales.|Add all four values and share the total into four equal parts.",
  "Contá cuántas veces aparece cada número.|Count how often each number appears."
 ],
 "G07-09-L03": [
  "Restá el mínimo del máximo en cada grupo.|Subtract the minimum from the maximum in each group.",
  "Pensá si esas cuatro personas representan a todos los habitantes.|Think whether those four people represent all residents."
 ],
 "G07-10-L01": [
  "Enumerá las caras del dado y quedate con las menores que tres.|List the die faces and keep those less than three.",
  "Pensá si un dado podría estar cargado aunque tenga seis caras.|Think whether a die could be loaded even though it has six faces."
 ],
 "G07-10-L02": [
  "Revisá si hay alguna ficha azul dentro de la bolsa.|Check whether there is a blue counter in the bag.",
  "Buscá una opción que incluya todos los colores de la bolsa.|Find an option covering every color in the bag."
 ],
 "G07-10-L03": [
  "Dividí la cantidad de caras por el total de lanzamientos.|Divide the number of heads by the total number of tosses.",
  "Pensá si los resultados anteriores cambian las posibilidades del siguiente lanzamiento.|Think whether earlier outcomes change the chances on the next toss."
 ],
 "G07-11-L01": [
  "Calculá el área total y quitá el cuarto reservado para lectura.|Calculate the total area and remove the quarter reserved for reading.",
  "Convertí seis metros a centímetros antes de dividir por cien.|Convert six meters to centimeters before dividing by one hundred."
 ],
 "G07-11-L02": [
  "Restá el porcentaje descontado de 100% y escribí lo que queda como decimal.|Subtract the discount percentage from 100% and write the remainder as a decimal.",
  "Separá los gastos con descuento de los que conservan su precio.|Separate discounted expenses from those that keep their price."
 ],
 "G07-11-L03": [
  "Duplicá filas y columnas: contá cuántas copias del rectángulo original caben.|Double rows and columns: count how many copies of the original rectangle fit.",
  "Compará el costo por unidad para distintas cantidades.|Compare cost per unit for different quantities."
 ]
};
export function getGradeSevenHints(id: string) {
 const pair = hints[id];
 if (!pair) throw new Error(`Missing Grade 7 hints: ${id}`);
 return pair.map(text);
}
