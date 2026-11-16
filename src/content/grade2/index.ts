import { numberLessons } from './numbers';
import { operationLessons } from './operations';
import { groupLessons } from './groups';
import { worldLessons } from './world';
import { text, type GradeOneLesson } from '../lessonModel';

export const GRADE_TWO_LESSONS: GradeOneLesson[] = [...numberLessons, ...operationLessons, ...groupLessons, ...worldLessons].map(lesson => ({
  ...lesson,
  scene: { ...lesson.scene, layout: lesson.packageId === 'G02-09' ? 'row' : 'aligned' },
}));
const packageDefinitions: [string, string[]][] = [
  ['Números hasta mil|Numbers up to one thousand', ['G01-02', 'G01-03']],
  ['Descomponer y reagrupar|Decomposing and regrouping', ['G02-01']],
  ['Escalas y saltos|Scales and jumps', ['G02-01', 'G02-02']],
  ['Historias de suma y resta|Addition and subtraction stories', ['G01-05', 'G01-06']],
  ['Cálculo mental|Mental calculation', ['G02-02', 'G02-04', 'G01-07']],
  ['Dobles y mitades|Doubles and halves', ['G02-05']],
  ['Grupos iguales y multiplicación|Equal groups and multiplication', ['G02-04', 'G02-06']],
  ['Dos sentidos de dividir|Two meanings of division', ['G02-07']],
  ['Propiedades de figuras y cuerpos|Properties of shapes and solids', ['G01-10']],
  ['Planos y recorridos|Plans and routes', ['G01-09']],
  ['Instrumentos y medidas|Tools and measurements', ['G01-11', 'G01-12']],
  ['Tablas y pictografías|Tables and pictographs', ['G01-13', 'G02-07']],
  ['Organizamos la clase|Organizing the classroom', ['G02-02', 'G02-03', 'G02-05', 'G02-08']],
];
export const GRADE_TWO_PACKAGES = packageDefinitions.map(([title, prerequisites], index) => ({
  id: `G02-${String(index + 1).padStart(2, '0')}`, title: text(title), prerequisites, alignment: 'editorial' as const,
}));
export const GRADE_TWO_PROJECT = {
  title: text('Kits para nuestra clase|Kits for our classroom'),
  introduction: text('Organizá materiales con alguien de tu clase o familia. Usá dibujos y objetos para explicar tus decisiones.|Organize supplies with someone in your class or family. Use drawings and objects to explain your decisions.'),
  tasks: [
    'Prepará cuatro kits con seis objetos cada uno. Escribí una suma y una multiplicación para el total.|Prepare four kits with six objects each. Write an addition and multiplication for the total.',
    'Repartí 18 etiquetas entre tres mesas. Después explicá otra situación donde hagas grupos de tres con esas mismas etiquetas.|Share 18 labels among three tables. Then explain another situation where you make groups of three using those same labels.',
    'El depósito tiene 347 hojas. Mostrá dos descomposiciones y calculá cien más y diez menos partiendo de 347 en cada caso.|The supply room has 347 sheets. Show two decompositions and find one hundred more and ten less, starting from 347 each time.',
    'Medí el largo de un objeto con una regla, dibujá un plano para encontrar los kits y elegí una fecha y una hora para repartirlos.|Measure one object’s length with a ruler, draw a plan for finding the kits, and choose a date and time to distribute them.',
    'Armá una tabla de materiales y una pictografía con una clave clara. Explicá un total y una comparación.|Make a supply table and a pictograph with a clear key. Explain a total and a comparison.',
  ].map(text),
  rubric: [
    'Distingue grupos, objetos por grupo y total; interpreta la unidad del resultado.|Distinguishes groups, objects per group, and total; interprets the result’s unit.',
    'Conserva el valor en las descomposiciones y justifica los cambios de diez y cien.|Preserves value in decompositions and justifies changes of ten and one hundred.',
    'Elige instrumentos y unidades adecuados; otra persona puede seguir el plano.|Chooses suitable tools and units; another person can follow the plan.',
    'La tabla, el gráfico y su clave coinciden con los objetos contados; comprueba y explica el resultado.|The table, chart, and key match the counted objects; checks and explains the result.',
  ].map(text),
};
