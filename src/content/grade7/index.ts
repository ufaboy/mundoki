import { numberLessons } from './numbers';
import { relationLessons } from './relations';
import { spaceLessons } from './space';
import { dataLessons } from './data';
import { text,type GradeOneLesson } from '../lessonModel';
export const GRADE_SEVEN_LESSONS: GradeOneLesson[]=[...numberLessons,...relationLessons,...spaceLessons,...dataLessons];
const definitions:[string,string[]][]=[
 ['Números, propiedades y argumentos|Numbers, properties, and arguments',['G06-01','G06-02','G06-03']],
 ['Racionales: elegir, calcular y verificar|Rationals: choose, calculate, and check',['G06-04','G06-05']],
 ['Proporciones, porcentajes y escala|Proportions, percentages, and scale',['G07-02','G06-06','G06-08','G06-10']],
 ['De patrones a variables|From patterns to variables',['G06-06']],
 ['Exploración adicional: fórmulas|Additional exploration: formulas',['G07-04']],
 ['Ángulos, figuras y construcciones|Angles, shapes, and constructions',['G04-09','G04-10']],
 ['Cambios de perímetro y área|Changes in perimeter and area',['G06-09','G06-10']],
 ['Cuerpos, redes, superficie y volumen|Solids, nets, surface area, and volume',['G07-07']],
 ['Estadística y comparación de grupos|Statistics and comparing groups',['G06-11','G06-12']],
 ['Exploración opcional: azar y frecuencias|Optional exploration: chance and frequencies',['G07-09']],
 ['Proyecto de cierre de primaria|Primary school final project',['G07-01','G07-02','G07-03','G07-04','G07-06','G07-07','G07-08','G07-09']],
];
export const GRADE_SEVEN_PACKAGES=definitions.map(([title,prerequisites],i)=>({id:`G07-${String(i+1).padStart(2,'0')}`,title:text(title),prerequisites,alignment:'editorial' as const}));
export const GRADE_SEVEN_PROJECT={
 title:text('Una feria para despedir la primaria|A fair to celebrate completing primary school'),
 introduction:text('Diseñá en papel una feria ficticia en un salón de 12 × 8 m. Usá dibujos, tablas y argumentos; separá lo que sabés de lo que suponés. Revisá la propuesta con otra persona.|Design a fictional fair on paper in a 12 × 8 m room. Use drawings, tables, and arguments; distinguish facts from assumptions. Review the proposal with another person.'),
 tasks:[
 'Dibujá el salón a escala 1:200. Reservá 25% del área para lectura mediante un rectángulo que quepa. Indicá dimensiones, área y perímetro del salón y área restante.|Draw the room at 1:200. Reserve 25% of its area for reading using a rectangle that fits. Label dimensions, room area and perimeter, and remaining area.',
 'Alquilar mesas cuesta 12 por mesa sin cargo fijo. Hacé una tabla para 1, 2, 4 y 6 mesas y un gráfico de puntos. Calculá el total de seis mesas con 15% de descuento por dos métodos.|Renting tables costs 12 per table with no fixed fee. Make a table for 1, 2, 4, and 6 tables and a point graph. Calculate six tables with a 15% discount using two methods.',
 'El cartel tiene ocho cuadrados contiguos hechos con palitos. Dibujá el patrón, contá palitos y explicá una regla para cualquier número positivo de cuadrados.|The sign has eight adjacent squares made with sticks. Draw the pattern, count sticks, and explain a rule for any positive number of squares.',
 'Compará cajas cerradas de 2 × 3 × 4 y 1 × 4 × 6 cm para premios: volumen y superficie sin espesor ni solapas. Elegí entre ellas justificando el criterio.|Compare closed 2 × 3 × 4 and 1 × 4 × 6 cm prize boxes: volume and surface area without thickness or tabs. Choose between them and justify the criterion.',
 'Los tiempos de espera de dos pruebas fueron A: 2, 2, 8, 8 y B: 5, 5, 5, 5 minutos. Calculá medias y modas; compará variación e indicá qué información falta para generalizar.|Waiting times in two trials were A: 2, 2, 8, 8 and B: 5, 5, 5, 5 minutes. Find means and modes; compare variation and state what is missing to generalize.',
 'Revisá «duplicar todos los lados duplica el área» usando el salón. Para un cartel triangular con lados 3, 4 y 8 cm, explicá si es construible. Elegí un repaso y volvé a una tarea similar en una o dos semanas.|Review “doubling all sides doubles the area” using the room. For a triangular sign with sides 3, 4, and 8 cm, explain whether it can be built. Choose a review topic and revisit a similar task in one or two weeks.'
 ].map(text),
 rubric:[
 'Plano 6 × 4 cm; salón 96 m² y perímetro 40 m. Lectura 24 m², por ejemplo 3 × 8 m; quedan 72 m². Las unidades del plano y de la realidad están diferenciadas.|Plan 6 × 4 cm; room 96 m² and perimeter 40 m. Reading 24 m², for example 3 × 8 m; 72 m² remains. Plan and real units are distinguished.',
 'Costos 12, 24, 48 y 72. Descuento 10,8; total 61,2. Coinciden 72 − 72 × 0,15 y 72 × 0,85. El gráfico usa mesas enteras, no fracciones de mesa.|Costs 12, 24, 48, and 72. Discount 10.8; total 61.2. Both 72 − 72 × 0.15 and 72 × 0.85 agree. The graph uses whole tables, not fractions of a table.',
 'Ocho cuadrados usan 25 palitos. Justifica 4 + 3(n − 1) o 3n + 1 mediante lados compartidos, no solo por comprobar un ejemplo.|Eight squares use 25 sticks. Justifies 4 + 3(n − 1) or 3n + 1 using shared sides, not just one example.',
 'Ambas cajas tienen volumen 24 cm³; superficies 52 y 68 cm². La primera usa menos material entre estas dos bajo los supuestos dados.|Both boxes have volume 24 cm³; surface areas are 52 and 68 cm². The first uses less material among these two under the given assumptions.',
 'Ambas medias son cinco; A tiene modas dos y ocho, B cinco. Las diferencias máximo−mínimo son seis y cero. No generaliza sin saber muestra, condiciones y cantidad de observaciones.|Both means are five; A has modes two and eight, B five. Maximum−minimum differences are six and zero. Does not generalize without sample, conditions, and observation count.',
 'Duplicar lados da 24 × 16 m y área 384 m², cuatro veces 96. El triángulo no se construye porque 3 + 4 < 8. Elige un repaso específico y explica qué corrigió.|Doubling sides gives 24 × 16 m and area 384 m², four times 96. The triangle cannot be built because 3 + 4 < 8. Chooses specific review and explains the correction.'
 ].map(text),
};
