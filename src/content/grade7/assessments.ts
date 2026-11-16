import { check as q, type GradeOneCheck } from '../lessonModel';
// In each package: recognition, two procedures, application, reasoning.
export const GRADE_SEVEN_ASSESSMENTS: Record<string,GradeOneCheck[]> = {
'G07-01':[
q('¿Qué basta para refutar «todos»?|What is enough to refute “all”?','Un contraejemplo válido|One valid counterexample','Cien ejemplos favorables|One hundred supporting examples','El contraejemplo incumple la afirmación.|The counterexample violates the claim.'),
q('Descomponé 6072.|Decompose 6072.','6000 + 70 + 2|6000 + 70 + 2','6000 + 700 + 2|6000 + 700 + 2','Siete está en decenas.|Seven is in the tens place.'),
q('¿Qué resto deja 724 al dividir por nueve?|What remainder does 724 leave when divided by nine?','4|4','13|13','7 + 2 + 4 = 13; 13 = 9 + 4.|7 + 2 + 4 = 13; 13 = 9 + 4.'),
q('Hay 35 y 49 fichas en cajas completas de siete. ¿Se pueden reunir sin sobrantes?|There are 35 and 49 counters in full boxes of seven. Can they be combined without leftovers?','Sí: doce cajas|Yes: twelve boxes','No|No','7 × (5 + 7) = 84.|7 × (5 + 7) = 84.'),
q('¿Qué refuta «divisible por dos y por cuatro implica divisible por ocho»?|What refutes “divisible by two and four implies divisible by eight”?','12|12','16|16','12 es divisible por dos y cuatro, pero no por ocho.|12 is divisible by two and four, but not eight.')],
'G07-02':[
q('¿Cuál escritura es exacta para un tercio?|Which notation is exact for one third?','1/3|1/3','0,333|0.333','El decimal finito solo aproxima.|The finite decimal only approximates.'),
q('Calculá 3/5 + 0,15.|Calculate 3/5 + 0.15.','0,75|0.75','0,18|0.18','0,60 + 0,15 = 0,75.|0.60 + 0.15 = 0.75.'),
q('Calculá (3/4 − 1/4) × 2.|Calculate (3/4 − 1/4) × 2.','1|1','1/4|1/4','Primero queda 1/2.|First we get 1/2.'),
q('Se cortan 5,4 m en tramos de 0,9 m sin desperdicio. ¿Cuántos?|5.4 m is cut into 0.9 m pieces without waste. How many?','6|6','0,6|0.6','6 × 0,9 = 5,4.|6 × 0.9 = 5.4.'),
q('¿Por qué 4 ÷ 1/2 supera cuatro?|Why does 4 ÷ 1/2 exceed four?','Cada entero contiene dos mitades|Each whole contains two halves','Dividir siempre aumenta|Division always increases','Contamos ocho mitades en cuatro enteros.|We count eight halves in four wholes.')],
'G07-03':[
q('¿Qué relación es directamente proporcional?|Which relation is directly proportional?','y = 5x|y = 5x','y = 5x + 1|y = 5x + 1','Para x positivo, y/x = 5.|For positive x, y/x = 5.'),
q('12 unidades cuestan 42. ¿Precio unitario?|12 units cost 42. Unit price?','3,5|3.5','30|30','42 ÷ 12 = 3,5.|42 ÷ 12 = 3.5.'),
q('Calculá 35% de 180.|Calculate 35% of 180.','63|63','35|35','30% es 54 y 5% es 9.|30% is 54 and 5% is 9.'),
q('Un sendero mide 14 m. ¿Cuánto mide en un plano 1:200?|A path measures 14 m. How long is it on a 1:200 plan?','7 cm|7 cm','70 cm|70 cm','1400 cm ÷ 200 = 7 cm.|1400 cm ÷ 200 = 7 cm.'),
q('Un servicio cobra 10 de base y 2 por unidad. ¿Por qué no es proporcional?|A service charges a base of 10 and 2 per unit. Why is it not proportional?','Duplicar unidades no duplica el cargo fijo|Doubling units does not double the fixed fee','Porque el precio disminuye|Because the price decreases','Una unidad cuesta 12; dos cuestan 14, no 24.|One unit costs 12; two cost 14, not 24.')],
'G07-04':[
q('En el patrón de cuadrados, ¿qué cuenta n?|In the square pattern, what does n count?','Cuadrados de la fila|Squares in the row','Todos los palitos|All the sticks','La variable se define como posición o cantidad de cuadrados.|The variable is defined as position or square count.'),
q('Evaluá 3n + 1 para n = 9.|Evaluate 3n + 1 for n = 9.','28|28','31|31','27 + 1 = 28.|27 + 1 = 28.'),
q('¿Cuántos palitos tiene la fila de 15 cuadrados?|How many sticks are in a row of 15 squares?','46|46','60|60','4 + 14 × 3 = 46.|4 + 14 × 3 = 46.'),
q('Un borde tiene n fichas arriba, n abajo y dos extras. ¿Regla total?|A border has n counters above, n below, and two extras. Total rule?','2n + 2|2n + 2','n + 2|n + 2','Sumamos las dos filas y las dos extras.|Add both rows and the two extras.'),
q('¿Por qué 4 + 3(n − 1) y 3n + 1 coinciden?|Why do 4 + 3(n − 1) and 3n + 1 agree?','4 − 3 = 1 al distribuir|4 − 3 = 1 after distributing','Porque probamos solo n = 1|Because we tested only n = 1','3 × (n − 1) = 3n − 3. Entonces 4 + 3n − 3 = 3n + 1, para cualquier cantidad de cuadrados de la fila.|3 × (n − 1) = 3n − 3. So 4 + 3n − 3 = 3n + 1, for any number of squares in the row.')],
'G07-05':[
q('En C = 6x + 2, ¿qué cantidad es constante?|In C = 6x + 2, which quantity is constant?','El cargo adicional de 2|The additional fee of 2','El costo C para todo x|The cost C for every x','C cambia cuando cambia x.|C changes when x changes.'),
q('Evaluá C = 6x + 2 con x = 3.|Evaluate C = 6x + 2 at x = 3.','20|20','30|30','18 + 2 = 20.|18 + 2 = 20.'),
q('¿Qué punto pertenece a C = 6x + 2?|Which point belongs to C = 6x + 2?','(2,14)|(2,14)','(2,12)|(2,12)','Incluí el cargo de dos.|Include the fee of two.'),
q('Un rectángulo tiene altura fija 3 cm y ancho 4 cm. ¿Perímetro?|A rectangle has fixed height 3 cm and width 4 cm. Perimeter?','14 cm|14 cm','12 cm²|12 cm²','2 × 4 + 2 × 3 = 14.|2 × 4 + 2 × 3 = 14.'),
q('Para rectángulos de altura 3, ¿por qué excluir ancho cero?|For height-3 rectangles, why exclude zero width?','Queda un segmento, sin superficie rectangular|A line segment remains, with no rectangular area','Porque la fórmula no se puede calcular|Because the formula cannot be evaluated','Podemos calcular la fórmula con cero, pero para construir un rectángulo necesitamos un ancho mayor que cero.|We can calculate the formula with zero, but to build a rectangle we need a width greater than zero.')],
'G07-06':[
q('Los ángulos interiores de un triángulo plano suman…|The interior angles of a plane triangle sum to…','180°|180°','360°|360°','Tres ángulos completan media vuelta.|Three angles complete half a turn.'),
q('Hallá el adyacente a 47° sobre una recta.|Find the angle adjacent to 47° on a straight line.','133°|133°','43°|43°','180 − 47 = 133.|180 − 47 = 133.'),
q('Un triángulo isósceles tiene vértice de 50°. ¿Cada ángulo de base?|An isosceles triangle has a 50° vertex angle. Each base angle?','65°|65°','130°|130°','(180 − 50) ÷ 2 = 65.|(180 − 50) ÷ 2 = 65.'),
q('¿Podés construir un marco triangular con varillas de 3, 5 y 9 cm?|Can you build a triangular frame with rods of 3, 5, and 9 cm?','No|No','Sí|Yes','3 + 5 < 9.|3 + 5 < 9.'),
q('¿Por qué 3, 5 y 8 cm tampoco cierran un triángulo?|Why do 3, 5, and 8 cm also fail to close a triangle?','La igualdad deja los segmentos alineados|Equality leaves the segments aligned','Porque ocho es par|Because eight is even','Se necesita desigualdad estricta.|A strict inequality is needed.')],
'G07-07':[
q('¿Qué conserva una ampliación de factor común?|What does enlargement by a common factor preserve?','La razón entre longitudes correspondientes del mismo dibujo|The ratio between lengths within the same drawing','El área original|The original area','Todas las longitudes reciben el mismo factor.|Every length receives the same factor.'),
q('Ampliá 4 × 7 cm con factor dos.|Enlarge 4 × 7 cm by factor two.','8 × 14 cm|8 × 14 cm','6 × 9 cm|6 × 9 cm','Se multiplican ambas longitudes.|Both lengths are multiplied.'),
q('Área 18 cm², factor dos en longitudes: nueva área…|Area 18 cm², factor two on lengths: new area…','72 cm²|72 cm²','36 cm²|36 cm²','18 × 2² = 72.|18 × 2² = 72.'),
q('Una foto 6 × 8 cm se reduce a la mitad. ¿Nuevo perímetro?|A 6 × 8 cm photo is reduced by half. New perimeter?','14 cm|14 cm','7 cm|7 cm','La nueva foto mide 3 × 4 cm.|The new photo measures 3 × 4 cm.'),
q('¿Qué demuestra comparar 1 × 9 y 4 × 6?|What does comparing 1 × 9 and 4 × 6 show?','Igual perímetro puede dar áreas distintas|Equal perimeter can give different areas','Igual perímetro obliga a igual área|Equal perimeter forces equal area','Ambos tienen perímetro 20 y áreas 9 y 24.|Both have perimeter 20 and areas 9 and 24.')],
'G07-08':[
q('¿Qué medís para envolver una caja cerrada sin solapas?|What do you measure to wrap a closed box without tabs?','Superficie exterior|Outer surface area','Solo volumen|Only volume','Se cubren caras, no se llena el interior.|We cover faces rather than fill the interior.'),
q('Volumen de una caja 3 × 3 × 2 cm:|Volume of a 3 × 3 × 2 cm box:','18 cm³|18 cm³','8 cm³|8 cm³','Nueve cubitos por capa, dos capas.|Nine cubes per layer, two layers.'),
q('Superficie de un cubo de lado 3 cm:|Surface area of a cube with side 3 cm:','54 cm²|54 cm²','27 cm²|27 cm²','Seis caras de nueve cm².|Six faces of nine cm².'),
q('Se llena una caja 2 × 3 × 5 cm con cubitos de 1 cm³. ¿Cuántos?|A 2 × 3 × 5 cm box is filled with 1 cm³ cubes. How many?','30|30','10|10','Seis por capa y cinco capas.|Six per layer and five layers.'),
q('Dos cajas tienen volumen 18 cm³. ¿Basta para afirmar igual material exterior?|Two boxes have volume 18 cm³. Is that enough to claim equal outer material?','No, necesitamos las superficies|No, we need the surface areas','Sí|Yes','Distintas dimensiones pueden conservar volumen y cambiar superficie.|Different dimensions can preserve volume and change surface area.')],
'G07-09':[
q('¿Qué medida admite una variable como color preferido?|Which measure suits a variable such as favorite color?','Moda|Mode','Media de los nombres|Mean of the names','Podemos contar preferencias, no sumar nombres.|We can count preferences, not add names.'),
q('Media de 3, 3, 6, 8:|Mean of 3, 3, 6, 8:','5|5','3|3','20 ÷ 4 = 5.|20 ÷ 4 = 5.'),
q('Modas de 1, 1, 4, 4, 6:|Modes of 1, 1, 4, 4, 6:','1 y 4|1 and 4','Solo 6|Only 6','Ambos aparecen dos veces.|Both appear twice.'),
q('De 30 votos, 12 eligen lectura. ¿Porcentaje?|Of 30 votes, 12 choose reading. Percentage?','40%|40%','12%|12%','12/30 = 4/10.|12/30 = 4/10.'),
q('Grupos 2,2,8,8 y 5,5,5,5: ¿qué conclusión está justificada?|Groups 2,2,8,8 and 5,5,5,5: which conclusion is justified?','Igual media, diferente variación|Equal mean, different variation','Todas las observaciones son iguales|All observations are equal','Ambos promedian cinco, pero solo el segundo es uniforme.|Both average five, but only the second is uniform.')],
'G07-10':[
q('En un dado del uno al seis, sacar siete es…|On a die numbered one to six, rolling seven is…','Imposible|Impossible','Poco frecuente pero posible|Rare but possible','Siete no pertenece a los resultados del experimento.|Seven is not among this experiment’s outcomes.'),
q('¿Cuáles son los resultados mayores que tres en ese dado?|Which outcomes are greater than three on that die?','4, 5, 6|4, 5, 6','3, 4, 5, 6|3, 4, 5, 6','La desigualdad excluye tres.|The inequality excludes three.'),
q('14 éxitos de 40 ensayos dan frecuencia…|14 successes out of 40 trials give frequency…','35%|35%','14%|14%','14/40 = 35/100.|14/40 = 35/100.'),
q('Una bolsa contiene solo dos verdes. ¿Qué evento es seguro al sacar una?|A bag contains only two green counters. Which event is certain on one draw?','Sacar verde|Drawing green','Sacar azul|Drawing blue','Todas las fichas son verdes.|All counters are green.'),
q('¿Por qué una frecuencia observada de 70% no garantiza el próximo resultado?|Why does an observed 70% frequency not guarantee the next outcome?','Resume la serie pasada, no determina un ensayo independiente|It summarizes the past series, not an independent trial','Porque las frecuencias siempre son errores|Because frequencies are always errors','Observación y garantía son conceptos distintos.|Observation and guarantee are different concepts.')],
'G07-11':[
q('¿Qué debe acompañar una respuesta numérica en un proyecto?|What should accompany a numerical answer in a project?','Unidades, supuestos y explicación|Units, assumptions, and explanation','Solo otra cifra|Only another digit','Eso permite interpretar y revisar el resultado.|These allow interpretation and review.'),
q('25% de un área de 72 m²:|25% of an area of 72 m²:','18 m²|18 m²','47 m²|47 m²','72 ÷ 4 = 18.|72 ÷ 4 = 18.'),
q('Precio 160 con 15% de descuento:|Price 160 with a 15% discount:','136|136','145|145','Descuento 24; 160 − 24 = 136.|Discount 24; 160 − 24 = 136.'),
q('Un salón de 12 × 8 m se dibuja a 1:200. ¿Dimensiones del plano?|A 12 × 8 m room is drawn at 1:200. Plan dimensions?','6 × 4 cm|6 × 4 cm','24 × 16 cm|24 × 16 cm','Convertimos metros a centímetros antes de dividir.|Convert meters to centimeters before dividing.'),
q('¿Qué revisión responde a «mi gráfico crece, entonces es proporcional»?|What review addresses “my graph increases, so it is proportional”?','Comparar razones y comprobar si hay cargo fijo|Compare ratios and check for a fixed fee','Cambiar el color del gráfico|Change the graph color','La relación y = 2x + 1 crece sin ser proporcional.|The relation y = 2x + 1 increases without being proportional.')],
};
