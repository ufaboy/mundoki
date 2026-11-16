import { calculationLessons } from './calculation';
import { fractionLessons } from './fractions';
import { decimalLessons } from './decimals';
import { worldLessons } from './world';
import { text, type GradeOneLesson } from '../lessonModel';
export const GRADE_FIVE_LESSONS: GradeOneLesson[] = [...calculationLessons,...fractionLessons,...decimalLessons,...worldLessons].sort((a,b)=>a.order-b.order);
const definitions: [string,string[]][] = [
 ['Calcular y comprobar con naturales|Calculate and check with whole numbers',['G04-03','G04-04','G04-05']],
 ['Distintos sentidos de las fracciones|Different meanings of fractions',['G04-06']],
 ['Fracciones equivalentes|Equivalent fractions',['G05-02','G04-07']],
 ['Comparar y ordenar fracciones|Compare and order fractions',['G05-03']],
 ['Sumar y restar fracciones|Add and subtract fractions',['G05-03','G05-04']],
 ['Leer y comparar decimales|Read and compare decimals',['G04-08']],
 ['Conectar fracciones y decimales|Connect fractions and decimals',['G05-03','G05-06']],
 ['Sumar y restar decimales|Add and subtract decimals',['G05-06','G04-09']],
 ['Elegir modelos y estrategias|Choose models and strategies',['G05-01','G05-05','G05-07','G05-08']],
 ['Construir figuras y redes|Construct shapes and nets',['G04-11','G04-12']],
 ['Medidas, conversiones y precisión|Measurements, conversions, and precision',['G04-09','G05-08']],
 ['Tipos de datos y moda|Data types and mode',['G04-13']],
 ['Receta, compras y argumentos|Recipe, purchases, and reasoning',['G05-09','G05-11','G05-12']],
];
export const GRADE_FIVE_PACKAGES = definitions.map(([title,prerequisites],i)=>({id:`G05-${String(i+1).padStart(2,'0')}`,title:text(title),prerequisites,alignment:'editorial' as const}));
export const GRADE_FIVE_PROJECT = {
 title:text('Una receta y un presupuesto para compartir|A recipe and budget to share'),
 introduction:text('Planificá tres tandas de una receta ficticia y defendé tus decisiones con cálculos, unidades y datos. No hace falta cocinar ni comprar.|Plan three batches of a fictional recipe and defend your decisions using calculations, units, and data. No cooking or purchasing is needed.'),
 tasks:[
 'Cada tanda usa 3/4 kg de harina y 0,4 L de leche. Calculá los totales y expresalos también en gramos y mililitros.|Each batch uses 3/4 kg of flour and 0.4 L of milk. Calculate totals and express them in grams and milliliters too.',
 'Solo se venden paquetes de harina de 1 kg a 2,50 unidades monetarias y envases de leche de 1 L a 1,75. Calculá paquetes, costo y sobrantes.|Only 1 kg flour packs at 2.50 currency units and 1 L milk containers at 1.75 are sold. Calculate packs, cost, and leftovers.',
 'El presupuesto es 15 unidades monetarias. Estimá si alcanza, calculá el saldo exacto y comprobá con una suma.|The budget is 15 currency units. Estimate whether it is enough, calculate the exact balance, and check with addition.',
 'Para la presentación, 14 personas votaron: A recibió 6 votos, B recibió 6 y C recibió 2. Construí tabla y gráfico, identificá las modas y proponé cómo resolver el empate.|For presentation, 14 people voted: A got 6 votes, B got 6, and C got 2. Build a table and graph, identify the modes, and propose how to resolve the tie.',
 'Mostrá el total de harina con fracciones y decimales. Explicá por qué el costo usa paquetes comprados y no solo lo consumido.|Show total flour using fractions and decimals. Explain why cost uses purchased packs and not just what is consumed.'
 ].map(text),
 rubric:[
 'Obtiene 9/4 kg = 2,25 kg = 2250 g y 1,2 L = 1200 mL, conservando las unidades y el entero de referencia.|Obtains 9/4 kg = 2.25 kg = 2250 g and 1.2 L = 1200 mL, preserving units and the reference whole.',
 'Compra tres paquetes de harina y dos de leche: costo 11,00; saldo 4,00; sobran 0,75 kg y 0,8 L.|Buys three flour packs and two milk containers: cost 11.00; balance 4.00; 0.75 kg and 0.8 L remain.',
 'Tabla y barras suman 14 y usan escala uniforme desde cero. A y B son modas; ninguna supera la mitad.|Table and bars total 14 and use a uniform scale from zero. A and B are modes; neither exceeds half.',
 'La explicación conecta cada operación con una pregunta, distingue estimación de exactitud y reconoce el alcance de la encuesta.|The explanation connects each operation to a question, distinguishes estimation from exactness, and recognizes the survey’s scope.'
 ].map(text),
};
