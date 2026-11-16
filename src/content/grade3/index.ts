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
 ['Una salida escolar|A school trip',['G03-08','G03-09','G03-11','G03-12','G03-13']],
];
export const GRADE_THREE_PACKAGES = definitions.map(([title,prerequisites],i) => ({id:`G03-${String(i+1).padStart(2,'0')}`,title:text(title),prerequisites,alignment:'editorial' as const}));
export const GRADE_THREE_PROJECT = {
 title: text('Planificamos una salida|Planning a trip'),
 introduction: text('Prepará una propuesta ficticia para 86 personas. Mostrá cálculos, medidas, horarios y un plano que otra persona pueda revisar.|Prepare a fictional proposal for 86 people. Show calculations, measurements, times, and a plan that another person can review.'),
 tasks: [
 'Cada vehículo tiene 24 lugares. Calculá cuántos vehículos se necesitan e interpretá el resto.|Each vehicle has 24 seats. Calculate how many vehicles are needed and interpret the remainder.',
 'Cada entrada cuesta 7 unidades monetarias. Calculá el costo para 86 personas con dos estrategias y una estimación.|Each ticket costs 7 currency units. Calculate the cost for 86 people using two strategies and an estimate.',
 'La salida es a las 9:35 y el viaje dura 50 minutos. Construí una línea de tiempo y calculá la llegada.|Departure is at 9:35 and the trip takes 50 minutes. Build a timeline and calculate arrival.',
 'Dibujá el punto de encuentro y un recorrido con símbolos y referencias claras. Elegí una unidad para medir la distancia.|Draw the meeting point and a route with clear symbols and landmarks. Choose a unit for measuring the distance.',
 'Consultá a un grupo pequeño qué actividad prefiere. Hacé una tabla y un gráfico y explicá qué conclusión permiten esos datos.|Ask a small group which activity they prefer. Make a table and graph and explain what conclusion the data support.'
 ].map(text),
 rubric: [
 'Relaciona cada operación con la pregunta y registra las unidades.|Connects each operation to the question and records units.',
 'Explica por qué 86 = 24 × 3 + 14 requiere cuatro vehículos; el costo es 602.|Explains why 86 = 24 × 3 + 14 requires four vehicles; the cost is 602.',
 'Comprueba la llegada a las 10:25 con una línea de tiempo y produce un plano que se puede seguir.|Checks the 10:25 arrival with a timeline and produces a usable plan.',
 'Los totales del gráfico y la tabla coinciden; la conclusión se limita al grupo consultado.|Graph and table totals agree; the conclusion is limited to the surveyed group.'
 ].map(text),
};
