import { numberLessons } from './numbers';
import { rationalLessons } from './rational';
import { proportionLessons } from './proportions';
import { spaceLessons } from './space';
import { dataLessons } from './data';
import { text,type GradeOneLesson } from '../lessonModel';
export const GRADE_SIX_LESSONS: GradeOneLesson[]=[...numberLessons,...rationalLessons,...proportionLessons,...spaceLessons,...dataLessons];
const definitions:[string,string[]][]=[
 ['Sistema decimal y otras escrituras|Decimal system and other notations',['G05-01','G05-06']],
 ['Múltiplos y divisores|Multiples and divisors',['G04-04']],
 ['Primos, divisores y múltiplos comunes|Primes, common divisors and multiples',['G06-02']],
 ['La fracción como cociente|Fractions as quotients',['G05-02','G05-03','G05-07']],
 ['Operaciones con fracciones y decimales|Fraction and decimal operations',['G06-04','G05-05','G05-08']],
 ['Proporcionalidad directa|Direct proportionality',['G06-05','G05-09']],
 ['Proporcionalidad inversa|Inverse proportionality',['G06-06']],
 ['Porcentajes y descuentos|Percentages and discounts',['G06-05','G06-06']],
 ['Perímetro y área|Perimeter and area',['G05-10','G05-11']],
 ['Escala y planos|Scale and plans',['G06-06','G05-11']],
 ['Gráficos y lectura crítica|Graphs and critical interpretation',['G05-12']],
 ['Media aritmética|Arithmetic mean',['G05-12','G05-08']],
 ['Planificamos el patio|Planning the schoolyard',['G06-03','G06-05','G06-07','G06-08','G06-09','G06-10','G06-11','G06-12']],
];
export const GRADE_SIX_PACKAGES=definitions.map(([title,prerequisites],i)=>({id:`G06-${String(i+1).padStart(2,'0')}`,title:text(title),prerequisites,alignment:'editorial' as const}));
export const GRADE_SIX_PROJECT={
 title:text('Un patio que podemos explicar|A schoolyard we can explain'),
 introduction:text('Prepará un plano ficticio de un patio de 18 m por 10 m. Es una propuesta en papel: documentá los supuestos, compará estrategias y revisá con otra persona.|Prepare a fictional plan for an 18 m by 10 m yard. This is a paper proposal: document assumptions, compare strategies, and review with another person.'),
 tasks:[
 'Dibujá el patio a escala 1:200. Indicá escala, longitudes reales, puerta de 2 m y una leyenda. Calculá perímetro y área con unidades.|Draw the yard at scale 1:200. Label scale, real lengths, a 2 m gate, and a key. Calculate perimeter and area with units.',
 'Reservá 20% del área para plantas y proponé un rectángulo que la ocupe. Calculá el área restante y verificá que ambas partes reconstruyan el patio.|Reserve 20% of the area for plants and propose a rectangle occupying it. Calculate remaining area and check both parts reconstruct the yard.',
 'Organizá 24 macetas y 40 etiquetas en la mayor cantidad de kits idénticos sin sobrantes. Justificá con divisores comunes.|Organize 24 pots and 40 labels into the greatest number of identical kits without leftovers. Justify using common divisors.',
 'La cerca cuesta 6 unidades monetarias por metro, sin cargo fijo. Descontá la puerta del perímetro, calculá el costo y un descuento de 10%. Para una tarea separada de 24 horas-persona, compará tiempos de dos y cuatro personas e indicá las condiciones necesarias.|Fencing costs 6 currency units per meter, without a fixed charge. Subtract the gate from the perimeter, calculate cost and a 10% discount. For a separate 24 person-hour task, compare times for two and four people and state the necessary conditions.',
 'Los conteos de uso fueron 8, 12, 16 y 24 personas en cuatro momentos. Hacé tabla y gráfico, hallá la media y explicá qué no se puede concluir a partir de ella.|Usage counts were 8, 12, 16, and 24 people at four times. Make a table and graph, find the mean, and explain what cannot be concluded from it.',
 'Revisá «el área del dibujo se obtiene dividiendo el área real por 200» y «la media significa que siempre hubo esa cantidad». Corregí ambos argumentos y elegí un paquete para repasar.|Review “drawing area is found by dividing real area by 200” and “the mean means that number was always present.” Correct both arguments and choose a package to review.'
 ].map(text),
 rubric:[
 'Plano de 9 × 5 cm, puerta de 1 cm; perímetro 56 m y área 180 m². La reserva es 36 m², por ejemplo 3,6 × 10 m; quedan 144 m².|Plan is 9 × 5 cm, gate 1 cm; perimeter 56 m and area 180 m². Reserve is 36 m², for example 3.6 × 10 m; 144 m² remains.',
 'Ocho kits con tres macetas y cinco etiquetas. Cerca de 54 m: costo 324, descuento 32,4 y precio final 291,6 unidades monetarias.|Eight kits with three pots and five labels. Fence is 54 m: cost 324, discount 32.4, final price 291.6 currency units.',
 'Para igual trabajo divisible e igual ritmo sin esperas, dos personas tardan 12 horas y cuatro tardan 6; el producto es 24 horas-persona.|For equal divisible work and equal rates without waiting, two people take 12 hours and four take 6; the product is 24 person-hours.',
 'La media es 15 personas; no coincide con cada observación ni describe por sí sola toda la escuela. El gráfico tiene unidades y escala uniforme.|Mean is 15 people; it does not match each observation or alone describe the whole school. The graph has units and a uniform scale.',
 'Explica que ambas longitudes se escalan, por lo que el área cambia por el cuadrado del factor; convierte unidades antes de comparar. Reconoce errores y los vincula con un repaso concreto.|Explains that both lengths scale, so area changes by the square of the factor; converts units before comparing. Recognizes errors and links them to specific review.'
 ].map(text),
};
