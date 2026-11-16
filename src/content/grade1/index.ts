import { numberLessons } from './numbers';
import { operationLessons } from './operations';
import { worldLessons } from './world';
import { text } from './model';

export const GRADE_ONE_LESSONS = [...numberLessons, ...operationLessons, ...worldLessons];
export const GRADE_ONE_PACKAGES = [
  ['Contar objetos|Counting objects', []],
  ['Leer y escribir números|Reading and writing numbers', [1]],
  ['Comparar y ordenar|Comparing and ordering', [1, 2]],
  ['Cantidad y posición|Quantity and position', [1]],
  ['Sumar con sentido|Meaningful addition', [1, 2, 3]],
  ['Restar con sentido|Meaningful subtraction', [1, 3, 5]],
  ['Partes y complementos|Parts and complements', [2, 5]],
  ['Patrones y reglas|Patterns and rules', []],
  ['Posiciones y recorridos|Positions and routes', []],
  ['Figuras y cuerpos|Shapes and solids', []],
  ['Comparar y medir longitudes|Comparing and measuring length', [1]],
  ['Secuencias y calendario|Sequences and calendars', []],
  ['Clasificar y leer datos|Sorting and reading data', [1, 3]],
  ['Resolver y explicar|Solving and explaining', [5, 6, 7]],
] .map(([title, prerequisites], index) => ({
  id: `G01-${String(index + 1).padStart(2, '0')}`,
  title: text(title as string),
  prerequisites: (prerequisites as number[]).map(n => `G01-${String(n).padStart(2, '0')}`),
  alignment: 'editorial' as const,
}));

export const GRADE_ONE_PROJECT = {
  title: text('Nuestro grupo|Our group'),
  introduction: text('Hacé este proyecto con alguien de tu familia o de tu clase. Podés dibujar y explicar en voz alta.|Do this project with someone in your family or class. You can draw and explain aloud.'),
  tasks: [
    'Contá dos grupos de materiales, hasta diez en cada uno. Dibujá un símbolo por objeto y escribí las cantidades.|Count two groups of supplies, up to ten in each. Draw one symbol per object and write the quantities.',
    'Compará los grupos. Explicá cuál tiene más o si tienen igual cantidad.|Compare the groups. Explain which has more or whether they have the same number.',
    'Inventá y resolvé una historia de agregar o quitar materiales. Comprobala de otra manera.|Invent and solve a story about adding or removing supplies. Check it another way.',
    'Dibujá un mapa sencillo y explicá cómo llegar a los materiales usando posiciones y pasos.|Draw a simple map and explain how to reach the supplies using positions and steps.',
    'Elegí un día del calendario para compartir tu trabajo. Contá qué harás antes y después.|Choose a calendar day to share your work. Tell what you will do before and after.',
  ].map(text),
  rubric: [
    'Cuenta cada objeto una vez y relaciona el dibujo con la cifra.|Counts each object once and matches the picture with the numeral.',
    'Compara con parejas o conteo y explica la diferencia.|Compares by pairing or counting and explains the difference.',
    'La operación corresponde a la historia; el dibujo y la comprobación apoyan la respuesta.|The operation fits the story; the picture and check support the answer.',
    'Otra persona puede seguir el recorrido y comprender el orden de los acontecimientos.|Another person can follow the route and understand the order of events.',
  ].map(text),
};
