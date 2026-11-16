import { l,q } from './author';
export const numberLessons = [
l(1,1,'Descomponer para explicar|Decompose to explain','Usar el valor posicional en una justificación.|Use place value in a justification.','Escribí 340 como suma de centenas y decenas.|Write 340 as hundreds plus tens.','¿Por qué 352 y 325 dejan el mismo resto al dividir por nueve?|Why do 352 and 325 leave the same remainder when divided by nine?',[
'352 = 3 × 100 + 5 × 10 + 2.|352 = 3 × 100 + 5 × 10 + 2.',
'Como 100 = 99 + 1 y 10 = 9 + 1, queda 3 × 99 + 5 × 9 + 10.|Since 100 = 99 + 1 and 10 = 9 + 1, this becomes 3 × 99 + 5 × 9 + 10.',
'Las primeras partes son múltiplos de nueve; 10 deja resto 1. Reordenar las cifras conserva su suma.|The first parts are multiples of nine; 10 leaves remainder 1. Rearranging digits preserves their sum.'
],['352 = 297 + 45 + 10','325 = 297 + 18 + 10'],'Misma suma de cifras no significa mismo número.|The same digit sum does not mean the same number.','Explicá el resto de 451 al dividir por nueve usando una descomposición.|Explain the remainder of 451 divided by nine using decomposition.',[
q('¿Qué representa el 4 en 2405?|What does 4 represent in 2405?','400|400','40|40','Ocupa las centenas.|It occupies the hundreds place.'),
q('¿Qué resto deja 451 al dividir por nueve?|What remainder does 451 leave when divided by nine?','1|1','10|10','La suma 10 deja resto 1; el resto es menor que nueve.|The sum 10 leaves remainder 1; the remainder is less than nine.')]),
l(1,2,'Propiedades de la divisibilidad|Properties of divisibility','Justificar una propiedad usando grupos completos.|Justify a property using complete groups.','Comprobá que 18 y 30 son múltiplos de seis.|Check that 18 and 30 are multiples of six.','¿Su suma y su diferencia también son múltiplos de seis?|Are their sum and difference also multiples of six?',[
'18 = 6 × 3 y 30 = 6 × 5.|18 = 6 × 3 and 30 = 6 × 5.',
'18 + 30 = 6 × (3 + 5) = 48: reunimos ocho grupos.|18 + 30 = 6 × (3 + 5) = 48: combine eight groups.',
'30 − 18 = 6 × (5 − 3) = 12. La idea vale para otros múltiplos del mismo divisor.|30 − 18 = 6 × (5 − 3) = 12. The idea works for other multiples of the same divisor.'
],['6×3 + 6×5 = 6×8','6×5 − 6×3 = 6×2'],'La suma divisible no obliga a que cada sumando lo sea: 1 + 5 = 6.|A divisible sum does not require each addend to be divisible: 1 + 5 = 6.','Explicá sin dividir por qué 28 + 42 es múltiplo de siete.|Explain without division why 28 + 42 is a multiple of seven.',[
q('Dos múltiplos de cinco suman…|Two multiples of five add up to…','Otro múltiplo de cinco|Another multiple of five','Siempre un primo|Always a prime','Se reúnen grupos completos de cinco.|Complete groups of five are combined.'),
q('¿Que 2 + 4 sea divisible por tres prueba que 2 y 4 lo sean?|Does 2 + 4 being divisible by three prove 2 and 4 are?','No|No','Sí|Yes','Ningún sumando es múltiplo de tres.|Neither addend is a multiple of three.')]),
l(1,3,'Un ejemplo no es una prueba general|One example is not a general proof','Usar un contraejemplo para refutar una regla.|Use a counterexample to refute a rule.','¿Qué divisores positivos tiene nueve?|What positive divisors does nine have?','Alguien afirma: «Todos los números impares mayores que uno son primos».|Someone claims: “All odd numbers greater than one are prime.”',[
'3, 5 y 7 cumplen, pero no representan todos los impares.|3, 5, and 7 fit, but do not represent all odd numbers.',
'9 = 3 × 3: es impar y compuesto. Un solo caso contradice la afirmación universal.|9 = 3 × 3: it is odd and composite. One case contradicts the universal statement.',
'Una afirmación distinta sí vale: todo primo mayor que dos es impar; si fuera par tendría divisor dos.|A different statement is true: every prime greater than two is odd; if even, it would have divisor two.'
],['3, 5, 7: primos / primes','9 = 3 × 3'],'Muchos ejemplos favorables no demuestran una afirmación sobre todos los naturales.|Many supporting examples do not prove a statement about all whole numbers.','Refutá «todo número divisible por tres es divisible por nueve».|Refute “every number divisible by three is divisible by nine.”',[
q('¿Qué refuta «todo impar mayor que uno es primo»?|What refutes “every odd number greater than one is prime”?','15|15','11|11','15 = 3 × 5.|15 = 3 × 5.'),
q('¿Por qué dos es una excepción a «los primos son impares»?|Why is two an exception to “primes are odd”?','Es primo y par|It is prime and even','No es primo|It is not prime','Tiene exactamente los divisores positivos 1 y 2.|It has exactly the positive divisors 1 and 2.')]),
l(2,1,'Elegir la escritura que ayuda|Choose a useful representation','Elegir fracción o decimal conservando el valor exacto.|Choose a fraction or decimal while preserving exact value.','Convertí 3/4 en decimal.|Convert 3/4 to a decimal.','Comparamos 1/3 + 1/6 y un precio de 0,75 por tres cuadernos.|Compare 1/3 + 1/6 and a price of 0.75 for three notebooks.',[
'Para las fracciones, 1/3 = 2/6: 2/6 + 1/6 = 1/2.|For the fractions, 1/3 = 2/6: 2/6 + 1/6 = 1/2.',
'Para el precio, 0,75 × 3 = 2,25; también podemos usar 3/4 × 3 = 9/4.|For the price, 0.75 × 3 = 2.25; we can also use 3/4 × 3 = 9/4.',
'0,33 aproxima 1/3, pero no es igual. Conservá fracciones si necesitás exactitud.|0.33 approximates 1/3, but is not equal. Keep fractions if you need exactness.'
],['1/3 + 1/6 = 3/6','0.75 × 3 = 2.25'],'Una aproximación no debe llevar un signo de igualdad con el valor exacto.|An approximation should not be marked equal to the exact value.','Elegí una escritura y resolvé 2/5 + 0,25.|Choose a representation and solve 2/5 + 0.25.',[
q('¿Qué decimal equivale exactamente a 7/8?|Which decimal equals 7/8 exactly?','0,875|0.875','0,87|0.87','7 ÷ 8 = 0,875.|7 ÷ 8 = 0.875.'),
q('¿Es 0,33 + 0,33 + 0,33 exactamente uno?|Is 0.33 + 0.33 + 0.33 exactly one?','No: es 0,99|No: it is 0.99','Sí|Yes','Tres aproximaciones no recuperan automáticamente el valor exacto.|Three approximations do not automatically recover the exact value.')]),
l(2,2,'Operaciones combinadas con sentido|Mixed operations with meaning','Interpretar paréntesis y prioridad de operaciones.|Interpret parentheses and operation order.','Calculá la mitad de 3/4.|Calculate half of 3/4.','Hay 3/4 L de jugo; agregamos dos porciones de 1/8 L.|There are 3/4 L of juice; we add two 1/8 L portions.',[
'La expresión es 3/4 + 2 × 1/8: primero hallamos lo agregado.|The expression is 3/4 + 2 × 1/8: first find the amount added.',
'2 × 1/8 = 1/4; luego 3/4 + 1/4 = 1 L.|2 × 1/8 = 1/4; then 3/4 + 1/4 = 1 L.',
'(3/4 + 2) × 1/8 describe otra cuenta. Los paréntesis cambian qué cantidad se multiplica.|(3/4 + 2) × 1/8 describes a different calculation. Parentheses change which quantity is multiplied.'
],['3/4 + (2 × 1/8)','6/8 + 2/8 = 1'],'No calcules siempre de izquierda a derecha: respetá grupos y productos.|Do not always calculate left to right: respect grouping and products.','Representá y resolvé (1/2 + 1/4) ÷ 3.|Represent and solve (1/2 + 1/4) ÷ 3.',[
q('Calculá 1/2 + 3 × 1/6.|Calculate 1/2 + 3 × 1/6.','1|1','7/12|7/12','El producto vale 1/2.|The product equals 1/2.'),
q('Calculá (0,6 + 0,4) ÷ 2.|Calculate (0.6 + 0.4) ÷ 2.','0,5|0.5','0,8|0.8','Primero sumamos uno y luego lo dividimos entre dos.|First add to make one, then divide by two.')]),
l(2,3,'Estimar antes y verificar después|Estimate first and verify afterward','Detectar resultados imposibles por orden de magnitud.|Detect impossible results using magnitude.','¿Cuántos medios hay en tres enteros?|How many halves are in three wholes?','¿Cuántas porciones de 0,4 L salen de 3,6 L?|How many 0.4 L portions can be made from 3.6 L?',[
'Como cada porción es menor que un litro, habrá más de 3,6 porciones.|Since each portion is less than a liter, there will be more than 3.6 portions.',
'3,6 ÷ 0,4 = 36 ÷ 4 = 9: expresamos ambas cantidades en décimos de litro.|3.6 ÷ 0.4 = 36 ÷ 4 = 9: express both quantities in tenths of a liter.',
'Verificamos 9 × 0,4 = 3,6 L. El resultado 0,9 no reconstruye el total.|Check 9 × 0.4 = 3.6 L. The result 0.9 does not reconstruct the total.'
],['3.6 L ÷ 0.4 L = 9','9 × 0.4 L = 3.6 L'],'Dividir por una cantidad menor que uno puede aumentar el número.|Dividing by a number below one can increase the result.','Estimá y resolvé 4,8 ÷ 0,6; comprobá multiplicando.|Estimate and solve 4.8 ÷ 0.6; check by multiplication.',[
q('¿Cuánto es 2,4 ÷ 0,3?|What is 2.4 ÷ 0.3?','8|8','0,8|0.8','Ocho porciones de 0,3 forman 2,4.|Eight portions of 0.3 make 2.4.'),
q('¿Puede 5 × 0,2 ser mayor que cinco?|Can 5 × 0.2 be greater than five?','No|No','Sí, todo producto aumenta|Yes, every product increases','Tomamos un quinto de cinco: uno.|We take one fifth of five: one.')]),
];
