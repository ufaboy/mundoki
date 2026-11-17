import { numberLessons } from './numbers';
import { productLessons } from './products';
import { strategyLessons } from './strategies';
import { spaceLessons } from './space';
import { measurementLessons } from './measurement';
import { text, type GradeOneLesson } from '../lessonModel';
export const GRADE_THREE_LESSONS: GradeOneLesson[] = [...numberLessons, ...productLessons, ...strategyLessons, ...spaceLessons, ...measurementLessons].map(lesson => ({...lesson, scene: {...lesson.scene, layout: 'aligned'}}));
const definitions: [string, string[]][] = [
 ['Números hasta diez mil|Numbers up to ten thousand',['G02-01','G02-02']],
 ['Sumar por escrito|Written addition',['G03-01','G02-05']],
 ['Restar por escrito|Written subtraction',['G03-02']],
 ['Construir hechos de multiplicación|Build multiplication facts',['G02-07']],
 ['Multiplicar por una cifra|Multiply by one digit',['G03-01','G03-04']],
 ['Dividir e interpretar el resto|Divide and interpret remainders',['G03-04','G02-08']],
 ['Elegir estrategias de cálculo|Choose calculation strategies',['G03-02','G03-03','G03-05','G03-06']],
 ['Problemas con cuatro operaciones|Problems with four operations',['G03-07']],
 ['Planos y recorridos|Plans and routes',['G02-10']],
 ['Figuras y cuerpos por sus propiedades|Shapes and solids by properties',['G02-09']],
 ['Longitud y masa|Length and mass',['G02-11']],
 ['Relojes y calendarios|Clocks and calendars',['G02-11','G03-03']],
 ['Preguntas, tablas y conclusiones|Questions, tables, and conclusions',['G02-12']],
 ['Planificamos una fiesta|Planning a party',['G03-08','G03-09','G03-11','G03-12','G03-13']],
];
export const GRADE_THREE_PACKAGES = definitions.map(([title,prerequisites],i) => ({id:`G03-${String(i+1).padStart(2,'0')}`,title:text(title),prerequisites,alignment:'editorial' as const}));
export const GRADE_THREE_PROJECT = {
 title: text('Planificamos la fiesta de la casa nueva|Planning the housewarming party'),
 introduction: text('Prepará un plan ficticio para una fiesta con 86 invitados. Mostrá cálculos, horarios y un plano que otra persona pueda revisar.|Prepare a fictional plan for a party with 86 guests. Show calculations, times, and a plan that another person can review.'),
 tasks: [
 'Cada combi tiene 24 asientos. Calculá cuántas combis hacen falta e interpretá el resto.|Each van has 24 seats. Calculate how many vans are needed and interpret the remainder.',
 'Cada invitado come 7 empanadas. Calculá cuántas empanadas hacen falta para 86 personas con dos estrategias y una estimación.|Each guest eats 7 empanadas. Calculate how many empanadas 86 people need using two strategies and an estimate.',
 'Las combis salen a las 9:35 y el viaje dura 50 minutos. Armá una línea de tiempo y calculá la llegada.|The vans leave at 9:35 and the trip takes 50 minutes. Build a timeline and calculate the arrival time.',
 'Dibujá el camino desde la parada de la combi hasta la casa con símbolos y referencias claras. Elegí una unidad para medir la distancia.|Draw the route from the van stop to the house with clear symbols and landmarks. Choose a unit for measuring the distance.',
 'Preguntá a un grupo pequeño qué juego prefiere para la fiesta. Hacé una tabla y un gráfico y explicá qué conclusión permiten esos datos.|Ask a small group which game they prefer for the party. Make a table and a graph and explain what conclusion the data support.'
 ].map(text),
 rubric: [
 'Relaciona cada operación con la pregunta y registra las unidades.|Connects each operation to the question and records units.',
 'Explica por qué 86 = 24 × 3 + 14 requiere cuatro combis; hacen falta 602 empanadas.|Explains why 86 = 24 × 3 + 14 requires four vans; 602 empanadas are needed.',
 'Comprueba la llegada a las 10:25 con una línea de tiempo y produce un plano que se puede seguir.|Checks the 10:25 arrival with a timeline and produces a usable plan.',
 'Los totales del gráfico y la tabla coinciden; la conclusión se limita al grupo consultado.|Graph and table totals agree; the conclusion is limited to the surveyed group.'
 ].map(text),
};
