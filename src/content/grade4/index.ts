import { numberLessons } from './numbers';
import { fractionLessons } from './fractions';
import { geometryLessons } from './geometry';
import { dataLessons } from './data';
import { text, type GradeOneLesson } from '../lessonModel';
export const GRADE_FOUR_LESSONS: GradeOneLesson[] = [...numberLessons, ...fractionLessons, ...geometryLessons, ...dataLessons];
const definitions: [string,string[]][] = [
 ['Números grandes|Large numbers',['G03-01']],
 ['Problemas de varios pasos|Multistep problems',['G03-08']],
 ['Multiplicación escrita|Written multiplication',['G03-05']],
 ['División escrita|Written division',['G03-06','G04-03']],
 ['Elegir cómo calcular|Choose how to calculate',['G04-03','G04-04','G03-07']],
 ['Partes iguales y fracciones|Equal parts and fractions',['G02-06','G03-06']],
 ['Comparar fracciones|Compare fractions',['G04-06']],
 ['Décimos y centésimos|Tenths and hundredths',['G04-06','G04-07']],
 ['Medir y convertir unidades|Measure and convert units',['G03-11','G04-08']],
 ['Ángulos y giros|Angles and turns',['G03-10']],
 ['Construir y clasificar triángulos|Construct and classify triangles',['G04-10']],
 ['Figuras, cuerpos y redes|Shapes, solids, and nets',['G03-10','G04-10']],
 ['Organizar y representar datos|Organize and represent data',['G03-13']],
 ['Compras y argumentos|Purchases and arguments',['G04-02','G04-05','G04-07','G04-08','G04-13']],
];
export const GRADE_FOUR_PACKAGES = definitions.map(([title,prerequisites],i)=>({id:`G04-${String(i+1).padStart(2,'0')}`,title:text(title),prerequisites,alignment:'editorial' as const}));
export const GRADE_FOUR_PROJECT = {
 title: text('Materiales para una muestra escolar|Supplies for a school exhibition'),
 introduction: text('Prepará y defendé un presupuesto ficticio. Trabajá en papel con dibujos, cálculos y un gráfico; pedile a otra persona que revise tu explicación.|Prepare and defend a fictional budget. Work on paper with drawings, calculations, and a graph; ask another person to review your explanation.'),
 tasks: [
 'Hay 1500 unidades monetarias. Compramos 12 paquetes de 20 hojas a 85 unidades monetarias por paquete. Calculá hojas, costo y dinero restante; estimá antes de calcular.|There are 1500 currency units. Buy 12 packs of 20 sheets at 85 currency units per pack. Calculate sheets, cost, and remaining money; estimate before calculating.',
 'Reservá un cuarto de las hojas. Mostrá la fracción en una tira y una cuadrícula de cien; escribí su decimal y calculá cuántas hojas representa.|Reserve one quarter of the sheets. Show the fraction on a strip and a hundred grid; write its decimal and calculate how many sheets it represents.',
 'Distribuí las hojas así: reserva 60, dibujos 100, carteles 80. Construí una tabla y barras con escala de 20 hojas y comprobá el total.|Distribute sheets as follows: reserve 60, drawings 100, posters 80. Build a table and bars with a scale of 20 sheets and check the total.',
 'Copiá un cartel rectangular de 8 cm por 5 cm y construí un ángulo de 60° como parte de la decoración. Explicá cómo comprobaste ambas construcciones.|Copy an 8 cm by 5 cm rectangular poster and construct a 60° angle as part of the decoration. Explain how you checked both constructions.',
 'Corregí «12 × 85 = 85 + 170 = 255» y «un cuarto de 240 hojas son 0,25 hojas». Identificá el paso equivocado, no solo el resultado.|Correct “12 × 85 = 85 + 170 = 255” and “one quarter of 240 sheets is 0.25 sheets.” Identify the wrong step, not just the result.'
 ].map(text),
 rubric: [
 'Justifica 240 hojas, costo 1020 y saldo 480 con operaciones y unidades; contrasta con una estimación.|Justifies 240 sheets, cost 1020, and balance 480 using operations and units; compares with an estimate.',
 'Mantiene el mismo entero y relaciona 1/4 = 25/100 = 0,25 con 60 de las 240 hojas.|Keeps the same whole and relates 1/4 = 25/100 = 0.25 to 60 of the 240 sheets.',
 'La tabla y el gráfico suman 240, tienen rótulos y escala uniforme; las construcciones conservan medidas y ángulos.|Table and graph total 240, have labels and a uniform scale; constructions preserve lengths and angles.',
 'Explica que el 1 de 12 vale diez y que 0,25 expresa la parte del conjunto, no la cantidad de hojas.|Explains that the 1 in 12 means ten and that 0.25 expresses the part of the set, not the number of sheets.'
 ].map(text),
};
