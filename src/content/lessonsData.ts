import { AccessLevel, LocalizedText, SchoolStageId, TopicId } from '../math/core/types';

export interface LessonStep {
  title: LocalizedText;
  explanation: LocalizedText;
  mathExpression: string;
}

export interface QuickCheckQuestion {
  id: string;
  question: LocalizedText;
  options: { label: LocalizedText; value: string; isCorrect: boolean }[];
  explanation: LocalizedText;
}

export interface VisualLesson {
  topicId: TopicId;
  stage: SchoolStageId;
  accessLevel: AccessLevel;
  title: LocalizedText;
  whatIsThis: LocalizedText;
  visualInteractiveHint: LocalizedText;
  workedExampleTitle: LocalizedText;
  workedSteps: LessonStep[];
  whyItWorks: LocalizedText;
  commonMistake: {
    wrongExample: LocalizedText;
    correction: LocalizedText;
  };
  deepDiveExtra: LocalizedText;
  quickChecks: [QuickCheckQuestion, QuickCheckQuestion];
}

export const VISUAL_LESSONS: Record<TopicId, VisualLesson> = {
  'addition-subtraction': {
    topicId: 'addition-subtraction',
    stage: 'primary',
    accessLevel: 'free',
    title: {
      'es-AR': 'Suma y Resta Agrupando Decenas y Unidades',
      'en-US': 'Addition & Subtraction by Grouping Tens and Ones',
    },
    whatIsThis: {
      'es-AR': 'Sumar es juntar cantidades y restar es encontrar cuánto queda o cuánto falta para llegar de un número a otro.',
      'en-US': 'Adding combines quantities together, while subtracting finds how much remains or the distance between two numbers.',
    },
    visualInteractiveHint: {
      'es-AR': 'Mové los deslizadores de abajo para agrupar de a 10 bloques. Cuando juntás 10 unidades sueltas, forman 1 barra de decena completa.',
      'en-US': 'Adjust the sliders below to group blocks by 10s. Whenever you gather 10 single units, they snap into 1 full ten-rod.',
    },
    workedExampleTitle: {
      'es-AR': 'Resolvamos 27 + 15 sin hacer cuentas de memoria',
      'en-US': 'Let’s solve 27 + 15 visually step by step',
    },
    workedSteps: [
      {
        title: {
          'es-AR': 'Paso 1: Separar en barras de 10 y unidades sueltas',
          'en-US': 'Step 1: Break into ten-rods and single ones',
        },
        explanation: {
          'es-AR': 'El 27 tiene 2 decenas (20) y 7 unidades. El 15 tiene 1 decena (10) y 5 unidades.',
          'en-US': '27 has 2 tens (20) and 7 ones. 15 has 1 ten (10) and 5 ones.',
        },
        mathExpression: '27 + 15 = (20 + 7) + (10 + 5)',
      },
      {
        title: {
          'es-AR': 'Paso 2: Juntar las decenas primero',
          'en-US': 'Step 2: Combine the tens first',
        },
        explanation: {
          'es-AR': 'Sumamos 20 + 10 y obtenemos 30.',
          'en-US': 'Add 20 + 10 to get 30.',
        },
        mathExpression: '20 + 10 = 30',
      },
      {
        title: {
          'es-AR': 'Paso 3: Formar una nueva decena con las unidades',
          'en-US': 'Step 3: Make a new ten from the ones',
        },
        explanation: {
          'es-AR': 'Sumamos 7 + 5. Como 7 necesita 3 para llegar a 10, armamos un 10 nuevo y sobran 2: 10 + 2 = 12. Finalmente 30 + 12 = 42.',
          'en-US': 'Add 7 + 5. Since 7 needs 3 to reach 10, we form a new ten with 2 left over: 10 + 2 = 12. Finally, 30 + 12 = 42.',
        },
        mathExpression: '30 + 12 = 42',
      },
    ],
    whyItWorks: {
      'es-AR': 'Nuestro sistema de numeración es decimal (de base 10): el valor de cada cifra depende de su posición. Agrupar de a 10 hace que cualquier suma grande se transforme en pasos chiquitos.',
      'en-US': 'Our number system is base-10: each digit’s value comes from its place. Grouping by 10 turns any large calculation into small, reliable steps.',
    },
    commonMistake: {
      wrongExample: {
        'es-AR': 'Confusión típica: hacer 27 + 15 sumando 2+1=3 y 7+5=12 y escribir "312".',
        'en-US': 'Common trap: solving 27 + 15 by writing 2+1=3 next to 7+5=12 as "312".',
      },
      correction: {
        'es-AR': '¡Cuidado! Esas 12 unidades valen 1 decena más 2 unidades, así que la decena se suma a las 3 decenas para dar 42, no 312.',
        'en-US': 'Watch out! Those 12 ones equal 1 ten plus 2 ones, so that extra ten joins the 3 tens to make 42, not 312.',
      },
    },
    deepDiveExtra: {
      'es-AR': 'También podés restar pensando "cuánto falta para llegar". Por ejemplo, para 52 − 38: de 38 a 40 faltan 2, y de 40 a 52 faltan 12. Total: 2 + 12 = 14.',
      'en-US': 'You can also subtract by "counting up". For 52 − 38: from 38 to 40 is 2, and from 40 to 52 is 12. Total distance: 2 + 12 = 14.',
    },
    quickChecks: [
      {
        id: 'add-q1',
        question: {
          'es-AR': 'Si descomponés 36 + 24 en decenas y unidades, ¿qué suma obtenés?',
          'en-US': 'If you split 36 + 24 into tens and ones, which sum do you get?',
        },
        options: [
          { label: { 'es-AR': '(30 + 20) + (6 + 4) = 60', 'en-US': '(30 + 20) + (6 + 4) = 60' }, value: '60', isCorrect: true },
          { label: { 'es-AR': '(3 + 2) + (6 + 4) = 15', 'en-US': '(3 + 2) + (6 + 4) = 15' }, value: '15', isCorrect: false },
          { label: { 'es-AR': '50 + 10 = 510', 'en-US': '50 + 10 = 510' }, value: '510', isCorrect: false },
        ],
        explanation: {
          'es-AR': '30 + 20 da 50, y 6 + 4 forma otra decena completa (10). 50 + 10 = 60.',
          'en-US': '30 + 20 is 50, and 6 + 4 makes another full ten (10). 50 + 10 = 60.',
        },
      },
      {
        id: 'add-q2',
        question: {
          'es-AR': '¿Cuánto le falta a 28 para llegar a 45?',
          'en-US': 'How much do you add to 28 to reach 45?',
        },
        options: [
          { label: { 'es-AR': '17 (2 para llegar a 30, más 15 para llegar a 45)', 'en-US': '17 (2 to reach 30, plus 15 to reach 45)' }, value: '17', isCorrect: true },
          { label: { 'es-AR': '23 (restando 8 − 5)', 'en-US': '23 (by subtracting 8 − 5)' }, value: '23', isCorrect: false },
        ],
        explanation: {
          'es-AR': 'Desde 28 sumás 2 para llegar a 30, y luego 15 más hasta 45: 2 + 15 = 17.',
          'en-US': 'From 28 add 2 to hit 30, then 15 more to reach 45: 2 + 15 = 17.',
        },
      },
    ],
  },

  'multiplication-division': {
    topicId: 'multiplication-division',
    stage: 'primary',
    accessLevel: 'free',
    title: {
      'es-AR': 'Multiplicación y División con Filas y Columnas',
      'en-US': 'Multiplication & Division with Rows and Columns',
    },
    whatIsThis: {
      'es-AR': 'Multiplicar es sumar varios grupos iguales de forma rápida, y dividir es repartir un total en partes exactamente iguales.',
      'en-US': 'Multiplying quickly combines equal groups, and dividing splits a total into fair, equal shares.',
    },
    visualInteractiveHint: {
      'es-AR': 'Cambiá la cantidad de filas y columnas en la grilla interactiva para ver cómo 3 grupos de 4 equivalen a 4 + 4 + 4 = 12.',
      'en-US': 'Change the rows and columns in the interactive array to see how 3 groups of 4 link 4 + 4 + 4 = 12 to 3 × 4 = 12.',
    },
    workedExampleTitle: {
      'es-AR': 'Conectando 3 × 4 = 12 con 12 ÷ 3 = 4',
      'en-US': 'Connecting 3 × 4 = 12 with 12 ÷ 3 = 4',
    },
    workedSteps: [
      {
        title: {
          'es-AR': 'Paso 1: Armar filas iguales',
          'en-US': 'Step 1: Arrange equal rows',
        },
        explanation: {
          'es-AR': 'Imaginate 3 filas con 4 fichas en cada fila. En vez de contar una por una, sumamos por fila.',
          'en-US': 'Picture 3 rows with 4 counters in each row. Instead of counting one by one, add by row.',
        },
        mathExpression: '4 + 4 + 4 = 12',
      },
      {
        title: {
          'es-AR': 'Paso 2: Escribir como multiplicación',
          'en-US': 'Step 2: Write as multiplication',
        },
        explanation: {
          'es-AR': '"3 veces 4" se escribe 3 × 4 = 12. Si girás la grilla, ves 4 filas de 3 (4 × 3 = 12).',
          'en-US': '"3 groups of 4" is written 3 × 4 = 12. Rotate the grid and you see 4 rows of 3 (4 × 3 = 12).',
        },
        mathExpression: '3 \\times 4 = 4 \\times 3 = 12',
      },
      {
        title: {
          'es-AR': 'Paso 3: La división deshace la multiplicación',
          'en-US': 'Step 3: Division undoes multiplication',
        },
        explanation: {
          'es-AR': 'Si tenemos 12 fichas en total y las repartimos en 3 filas iguales, cada fila recibe 4 fichas.',
          'en-US': 'If we start with 12 counters and split them into 3 equal rows, each row gets 4 counters.',
        },
        mathExpression: '12 \\div 3 = 4',
      },
    ],
    whyItWorks: {
      'es-AR': 'Como el rectángulo de fichas no cambia de cantidad al girarlo, el orden de los factores no altera el producto (propiedad conmutativa).',
      'en-US': 'Because rotating the rectangle of counters never changes how many counters exist, factor order does not change the product.',
    },
    commonMistake: {
      wrongExample: {
        'es-AR': 'Confusión típica: pensar que 3 × 4 es 3 + 4 = 7.',
        'en-US': 'Common trap: thinking 3 × 4 means 3 + 4 = 7.',
      },
      correction: {
        'es-AR': 'El signo × indica grupos repetidos: son 3 filas de 4 elementos (4 + 4 + 4 = 12).',
        'en-US': 'The × symbol means repeated equal groups: 3 rows of 4 items (4 + 4 + 4 = 12).',
      },
    },
    deepDiveExtra: {
      'es-AR': 'Para multiplicar números más grandes como 6 × 7, podés partir el 7 en 5 + 2: hacés (6 × 5) + (6 × 2) = 30 + 12 = 42.',
      'en-US': 'To multiply larger numbers like 6 × 7, split 7 into 5 + 2: compute (6 × 5) + (6 × 2) = 30 + 12 = 42.',
    },
    quickChecks: [
      {
        id: 'mul-q1',
        question: {
          'es-AR': '¿Qué suma repetida representa exactamente a 4 × 5?',
          'en-US': 'Which repeated addition matches 4 × 5?',
        },
        options: [
          { label: { 'es-AR': '5 + 5 + 5 + 5 = 20', 'en-US': '5 + 5 + 5 + 5 = 20' }, value: '20', isCorrect: true },
          { label: { 'es-AR': '4 + 5 = 9', 'en-US': '4 + 5 = 9' }, value: '9', isCorrect: false },
        ],
        explanation: {
          'es-AR': '4 grupos de 5 unidades suman 5 + 5 + 5 + 5 = 20.',
          'en-US': '4 groups of 5 items add up to 5 + 5 + 5 + 5 = 20.',
        },
      },
      {
        id: 'mul-q2',
        question: {
          'es-AR': 'Si 6 × 8 = 48, ¿cuánto es 48 ÷ 6?',
          'en-US': 'If 6 × 8 = 48, what is 48 ÷ 6?',
        },
        options: [
          { label: { 'es-AR': '8', 'en-US': '8' }, value: '8', isCorrect: true },
          { label: { 'es-AR': '6', 'en-US': '6' }, value: '6', isCorrect: false },
          { label: { 'es-AR': '42', 'en-US': '42' }, value: '42', isCorrect: false },
        ],
        explanation: {
          'es-AR': 'Si 6 filas de 8 dan 48, repartir 48 en 6 filas iguales deja 8 en cada una.',
          'en-US': 'If 6 rows of 8 make 48, splitting 48 into 6 equal rows leaves 8 in each.',
        },
      },
    ],
  },

  fractions: {
    topicId: 'fractions',
    stage: 'primary',
    accessLevel: 'free',
    title: {
      'es-AR': 'Fracciones: Partes Iguales de un Todo',
      'en-US': 'Fractions: Equal Parts of a Whole',
    },
    whatIsThis: {
      'es-AR': 'Una fracción representa una o varias partes iguales de un entero, ya sea una pizza, una barra de energía o un grupo de objetos.',
      'en-US': 'A fraction represents one or more equal parts of a whole—whether a pizza, an energy bar, or a collection of objects.',
    },
    visualInteractiveHint: {
      'es-AR': 'Probá cambiar el numerador (arriba) y el denominador (abajo). Compará el disco circular con la barra rectangular para ver que ambos muestran la misma proporción.',
      'en-US': 'Adjust the numerator (top) and denominator (bottom). Compare the circular pizza and rectangular bar to see how both show the exact same share.',
    },
    workedExampleTitle: {
      'es-AR': '¿Por qué 1/4 y 2/8 valen exactamente lo mismo?',
      'en-US': 'Why do 1/4 and 2/8 represent the exact same amount?',
    },
    workedSteps: [
      {
        title: {
          'es-AR': 'Paso 1: El denominador exige partes iguales',
          'en-US': 'Step 1: The denominator demands equal parts',
        },
        explanation: {
          'es-AR': 'Si cortamos una pizza o una barra en 4 partes iguales y tomamos 1, tenemos 1/4 ("un cuarto").',
          'en-US': 'Cut a pizza or bar into 4 equal pieces and take 1 piece: you have 1/4 ("one fourth").',
        },
        mathExpression: '\\frac{1}{4} = \\text{1 de 4 partes iguales}',
      },
      {
        title: {
          'es-AR': 'Paso 2: Partir cada cuarto por la mitad',
          'en-US': 'Step 2: Split each fourth in half',
        },
        explanation: {
          'es-AR': 'Si cortamos cada uno de los 4 trozos en 2 partes iguales, ahora hay 8 porciones más chicas, y nuestra porción ocupa 2 de esas 8.',
          'en-US': 'If we slice each of the 4 pieces into 2 equal parts, there are now 8 smaller slices, and our share covers 2 of those 8.',
        },
        mathExpression: '\\frac{1 \\times 2}{4 \\times 2} = \\frac{2}{8}',
      },
      {
        title: {
          'es-AR': 'Paso 3: Sumar fracciones del mismo tamaño',
          'en-US': 'Step 3: Adding fractions of the same size',
        },
        explanation: {
          'es-AR': 'Para hacer 1/4 + 2/4, sumamos los numeradores (1 + 2 = 3) y dejamos el denominador 4 porque el tamaño de cada cuarto no cambió.',
          'en-US': 'To add 1/4 + 2/4, add the numerators (1 + 2 = 3) and keep the denominator 4 because the slice size did not change.',
        },
        mathExpression: '\\frac{1}{4} + \\frac{2}{4} = \\frac{3}{4}',
      },
    ],
    whyItWorks: {
      'es-AR': 'Multiplicar o dividir el numerador y el denominador por el mismo número equivale a multiplicar por 1: cambia la cantidad de divisiones pero no la cantidad total pintada.',
      'en-US': 'Multiplying or dividing top and bottom by the same number is multiplying by 1: it changes the slice count without changing the total shaded amount.',
    },
    commonMistake: {
      wrongExample: {
        'es-AR': 'Confusión típica: hacer 1/4 + 2/4 = 3/8 sumando también los denominadores.',
        'en-US': 'Common trap: computing 1/4 + 2/4 = 3/8 by adding the denominators too.',
      },
      correction: {
        'es-AR': 'El denominador indica el nombre y tamaño de la parte ("cuartos"). 1 cuarto más 2 cuartos son 3 cuartos (3/4), ¡no 3 octavos!',
        'en-US': 'The denominator names the size of the piece ("fourths"). 1 fourth plus 2 fourths equals 3 fourths (3/4), not 3 eighths!',
      },
    },
    deepDiveExtra: {
      'es-AR': 'Cuanto más grande es el denominador, más pequeñas son las partes individuales: 1/8 de barra es la mitad de 1/4 de barra.',
      'en-US': 'The larger the denominator, the smaller each individual slice becomes: 1/8 of a bar is half the size of 1/4 of a bar.',
    },
    quickChecks: [
      {
        id: 'frac-q1',
        question: {
          'es-AR': '¿Cuál de estas fracciones es equivalente a 1/2?',
          'en-US': 'Which of these fractions is equivalent to 1/2?',
        },
        options: [
          { label: { 'es-AR': '3/6 (la mitad de 6 partes iguales)', 'en-US': '3/6 (half of 6 equal parts)' }, value: '3/6', isCorrect: true },
          { label: { 'es-AR': '1/4', 'en-US': '1/4' }, value: '1/4', isCorrect: false },
          { label: { 'es-AR': '2/6', 'en-US': '2/6' }, value: '2/6', isCorrect: false },
        ],
        explanation: {
          'es-AR': '3 es exactamente la mitad de 6, por lo tanto 3/6 = 1/2.',
          'en-US': '3 is half of 6, so 3/6 simplifies directly to 1/2.',
        },
      },
      {
        id: 'frac-q2',
        question: {
          'es-AR': '¿Cuánto es 2/5 + 2/5?',
          'en-US': 'What is 2/5 + 2/5?',
        },
        options: [
          { label: { 'es-AR': '4/5', 'en-US': '4/5' }, value: '4/5', isCorrect: true },
          { label: { 'es-AR': '4/10', 'en-US': '4/10' }, value: '4/10', isCorrect: false },
        ],
        explanation: {
          'es-AR': 'Sumamos 2 quintos más 2 quintos = 4 quintos (4/5).',
          'en-US': '2 fifths plus 2 fifths equals 4 fifths (4/5).',
        },
      },
    ],
  },

  'negative-numbers': {
    topicId: 'negative-numbers',
    stage: 'middle',
    accessLevel: 'free',
    title: {
      'es-AR': 'Números Negativos y Desplazamientos en la Recta',
      'en-US': 'Negative Numbers & Shifts on the Number Line',
    },
    whatIsThis: {
      'es-AR': 'Los números negativos representan valores menores que cero, como temperaturas bajo cero, pisos subterráneos o profundidades bajo el nivel del mar.',
      'en-US': 'Negative numbers represent values less than zero, such as sub-zero temperatures, underground floors, or depths below sea level.',
    },
    visualInteractiveHint: {
      'es-AR': 'Elegí el punto de partida y el cambio en la recta numérica: sumar mueve hacia la derecha (+) y restar mueve hacia la izquierda (−).',
      'en-US': 'Pick the starting point and shift on the number line: adding moves right (+) and subtracting moves left (−).',
    },
    workedExampleTitle: {
      'es-AR': 'Caminando por la recta: de −4 sumamos +7',
      'en-US': 'Walking the number line: start at −4 and add +7',
    },
    workedSteps: [
      {
        title: {
          'es-AR': 'Paso 1: Ubicar el punto de partida',
          'en-US': 'Step 1: Locate the starting position',
        },
        explanation: {
          'es-AR': 'El −4 está 4 pasos a la izquierda del 0.',
          'en-US': '−4 sits 4 steps to the left of 0.',
        },
        mathExpression: '\\text{Inicio: } -4',
      },
      {
        title: {
          'es-AR': 'Paso 2: Llegar primero al cero',
          'en-US': 'Step 2: Step back to zero first',
        },
        explanation: {
          'es-AR': 'De los 7 pasos hacia la derecha, usamos los primeros 4 pasos para llegar de −4 hasta 0.',
          'en-US': 'Out of the 7 steps to the right, the first 4 steps bring us from −4 right up to 0.',
        },
        mathExpression: '-4 + 4 = 0',
      },
      {
        title: {
          'es-AR': 'Paso 3: Avanzar los pasos restantes',
          'en-US': 'Step 3: Take the remaining steps past zero',
        },
        explanation: {
          'es-AR': 'Como teníamos que avanzar 7 y ya usamos 4, avanzamos 3 pasos más a la derecha del 0 y llegamos a +3.',
          'en-US': 'Since we needed to move 7 steps and used 4, we move 3 more steps to the right of 0, landing on +3.',
        },
        mathExpression: '-4 + 7 = 3',
      },
    ],
    whyItWorks: {
      'es-AR': 'Cada número negativo es el opuesto simétrico de su positivo respecto del 0. Por eso −4 y +4 se cancelan exactamente en 0.',
      'en-US': 'Every negative number is the mirror opposite of its positive twin across 0. That is why −4 and +4 cancel out to 0.',
    },
    commonMistake: {
      wrongExample: {
        'es-AR': 'Confusión típica: creer que −8 es mayor que −2 porque 8 es mayor que 2.',
        'en-US': 'Common trap: thinking −8 is greater than −2 because 8 is greater than 2.',
      },
      correction: {
        'es-AR': 'En la recta numérica, cuanto más a la derecha está un número, mayor es. −2 °C es más cálido (mayor) que −8 °C.',
        'en-US': 'On the number line, numbers further to the right are always greater. −2 °C is warmer (greater) than −8 °C.',
      },
    },
    deepDiveExtra: {
      'es-AR': 'Restar un número negativo, como 5 − (−3), equivale a sacar una deuda de 3: te mueve hacia la derecha, así que 5 − (−3) = 5 + 3 = 8.',
      'en-US': 'Subtracting a negative number, like 5 − (−3), removes a debt of 3: it shifts you right, so 5 − (−3) = 5 + 3 = 8.',
    },
    quickChecks: [
      {
        id: 'neg-q1',
        question: {
          'es-AR': 'Si estás en −3 y bajás 4 lugares más a la izquierda (−3 − 4), ¿dónde terminás?',
          'en-US': 'If you start at −3 and move 4 steps further left (−3 − 4), where do you land?',
        },
        options: [
          { label: { 'es-AR': '−7', 'en-US': '−7' }, value: '-7', isCorrect: true },
          { label: { 'es-AR': '−1', 'en-US': '−1' }, value: '-1', isCorrect: false },
          { label: { 'es-AR': '+7', 'en-US': '+7' }, value: '7', isCorrect: false },
        ],
        explanation: {
          'es-AR': 'Empezás 3 lugares a la izquierda del 0 y te alejás 4 más hacia la izquierda: llegás a −7.',
          'en-US': 'Start 3 units left of 0 and move 4 more units left: you reach −7.',
        },
      },
      {
        id: 'neg-q2',
        question: {
          'es-AR': '¿Cuál temperatura es más alta (mayor)?',
          'en-US': 'Which temperature is higher (greater)?',
        },
        options: [
          { label: { 'es-AR': '−2 °C', 'en-US': '−2 °C' }, value: '-2', isCorrect: true },
          { label: { 'es-AR': '−9 °C', 'en-US': '−9 °C' }, value: '-9', isCorrect: false },
        ],
        explanation: {
          'es-AR': '−2 está más a la derecha en la recta numérica (más cerca del 0) que −9.',
          'en-US': '−2 is further to the right on the number line (closer to 0) than −9.',
        },
      },
    ],
  },

  'percentages-proportions': {
    topicId: 'percentages-proportions',
    stage: 'middle',
    accessLevel: 'free',
    title: {
      'es-AR': 'Porcentajes y Proporciones Visuales',
      'en-US': 'Visual Percentages & Proportions',
    },
    whatIsThis: {
      'es-AR': 'Un porcentaje ("por ciento") indica cuántas partes tomamos de cada 100 partes iguales, conectando fracciones, decimales y escalas.',
      'en-US': 'A percentage ("per hundred") tells how many parts we take out of 100 equal parts, linking fractions, decimals, and proportional scales.',
    },
    visualInteractiveHint: {
      'es-AR': 'Deslizá el porcentaje y el valor total para ver cómo cambia al mismo tiempo la barra de 0% a 100% y la cantidad proporcional.',
      'en-US': 'Slide the percentage and total value to watch the 0%–100% bar and proportional quantity scale together in real time.',
    },
    workedExampleTitle: {
      'es-AR': 'Cómo calcular el 25% de 80 de dos formas distintas',
      'en-US': 'Two visual ways to find 25% of 80',
    },
    workedSteps: [
      {
        title: {
          'es-AR': 'Paso 1: Pensar el porcentaje como fracción de 100',
          'en-US': 'Step 1: See the percentage as a fraction out of 100',
        },
        explanation: {
          'es-AR': '25% significa 25 de cada 100. Si simplificamos 25/100 dividiendo por 25, descubrimos que 25% es exactamente 1/4.',
          'en-US': '25% means 25 out of 100. Simplifying 25/100 by 25 shows that 25% is always 1/4 of the whole.',
        },
        mathExpression: '25\\% = \\frac{25}{100} = \\frac{1}{4}',
      },
      {
        title: {
          'es-AR': 'Paso 2: Dividir el total en 4 partes iguales',
          'en-US': 'Step 2: Split the total into 4 equal quarters',
        },
        explanation: {
          'es-AR': 'La cuarta parte de 80 es 80 ÷ 4 = 20.',
          'en-US': 'One fourth of 80 is 80 ÷ 4 = 20.',
        },
        mathExpression: '80 \\div 4 = 20',
      },
      {
        title: {
          'es-AR': 'Paso 3: Método alternativo usando bloques del 10%',
          'en-US': 'Step 3: Alternative method using 10% building blocks',
        },
        explanation: {
          'es-AR': 'El 10% de 80 es 8, y el 5% es la mitad (4). Entonces 25% = 10% + 10% + 5% = 8 + 8 + 4 = 20.',
          'en-US': '10% of 80 is 8, and 5% is half of that (4). So 25% = 10% + 10% + 5% = 8 + 8 + 4 = 20.',
        },
        mathExpression: '8 + 8 + 4 = 20',
      },
    ],
    whyItWorks: {
      'es-AR': 'Una proporción mantiene constante la razón entre la parte y el total: 20 es a 80 exactamente lo mismo que 25 es a 100.',
      'en-US': 'A proportion keeps the ratio between part and whole constant: 20 out of 80 is the exact same ratio as 25 out of 100.',
    },
    commonMistake: {
      wrongExample: {
        'es-AR': 'Confusión típica: pensar que el 25% de 80 es siempre 25.',
        'en-US': 'Common trap: assuming 25% of 80 is just 25.',
      },
      correction: {
        'es-AR': '25% solo vale 25 cuando el total es 100. Si el total es 80, el 25% es la cuarta parte de 80, que es 20.',
        'en-US': '25% only equals 25 when the total is 100. When the total is 80, 25% is one-fourth of 80, which is 20.',
      },
    },
    deepDiveExtra: {
      'es-AR': 'Para calcular mentalmente cualquier porcentaje, encontrá primero el 10% (dividiendo por 10) y el 1% (dividiendo por 100).',
      'en-US': 'To calculate any percentage mentally, find 10% first (divide by 10) and 1% (divide by 100), then combine them.',
    },
    quickChecks: [
      {
        id: 'pct-q1',
        question: {
          'es-AR': '¿Cuánto es el 50% de 140?',
          'en-US': 'What is 50% of 140?',
        },
        options: [
          { label: { 'es-AR': '70 (la mitad de 140)', 'en-US': '70 (half of 140)' }, value: '70', isCorrect: true },
          { label: { 'es-AR': '50', 'en-US': '50' }, value: '50', isCorrect: false },
        ],
        explanation: {
          'es-AR': '50% equivale a 50/100 = 1/2. La mitad de 140 es 70.',
          'en-US': '50% equals 50/100 = 1/2. Half of 140 is 70.',
        },
      },
      {
        id: 'pct-q2',
        question: {
          'es-AR': 'Si el 10% de 60 es 6, ¿cuánto es el 30% de 60?',
          'en-US': 'If 10% of 60 is 6, what is 30% of 60?',
        },
        options: [
          { label: { 'es-AR': '18 (3 veces 6)', 'en-US': '18 (3 times 6)' }, value: '18', isCorrect: true },
          { label: { 'es-AR': '36', 'en-US': '36' }, value: '36', isCorrect: false },
        ],
        explanation: {
          'es-AR': '30% es 3 veces el 10%, por lo tanto 3 × 6 = 18.',
          'en-US': '30% is 3 times 10%, so 3 × 6 = 18.',
        },
      },
    ],
  },

  'linear-equations': {
    topicId: 'linear-equations',
    stage: 'middle',
    accessLevel: 'premium',
    title: {
      'es-AR': 'Ecuaciones Lineales: El Secreto de la Balanza',
      'en-US': 'Linear Equations: The Secret of the Balance Scale',
    },
    whatIsThis: {
      'es-AR': 'Una ecuación es una igualdad entre dos expresiones: como una balanza en equilibrio, lo que hacés de un lado tenés que hacerlo igual del otro.',
      'en-US': 'An equation states that two expressions are equal: like a balanced scale, whatever you do to one side you must do equally to the other.',
    },
    visualInteractiveHint: {
      'es-AR': 'Usá los botones de la balanza interactiva para quitar pesas de ambos platillos al mismo tiempo y descubrir cuánto pesa cada caja x.',
      'en-US': 'Use the buttons on the interactive balance scale to remove weights from both pans simultaneously and reveal the weight of box x.',
    },
    workedExampleTitle: {
      'es-AR': 'Despejando 2x + 3 = 11 sobre la balanza',
      'en-US': 'Solving 2x + 3 = 11 on the balance scale',
    },
    workedSteps: [
      {
        title: {
          'es-AR': 'Paso 1: Quitar las unidades sueltas de ambos lados',
          'en-US': 'Step 1: Remove loose unit weights from both pans',
        },
        explanation: {
          'es-AR': 'En el platillo izquierdo hay 2 cajas "x" más 3 pesas, y en el derecho hay 11 pesas. Quitamos 3 pesas de cada lado.',
          'en-US': 'The left pan holds 2 "x" boxes plus 3 weights, and the right pan holds 11 weights. Subtract 3 from both sides.',
        },
        mathExpression: '2x + 3 - 3 = 11 - 3 \\implies 2x = 8',
      },
      {
        title: {
          'es-AR': 'Paso 2: Repartir en partes iguales según la cantidad de cajas x',
          'en-US': 'Step 2: Divide equally by the number of x boxes',
        },
        explanation: {
          'es-AR': 'Si 2 cajas iguales pesan 8 en total, dividimos ambos lados por 2 para saber cuánto pesa 1 sola caja.',
          'en-US': 'If 2 identical boxes weigh 8 in total, divide both sides by 2 to find the weight of 1 box.',
        },
        mathExpression: '\\frac{2x}{2} = \\frac{8}{2} \\implies x = 4',
      },
      {
        title: {
          'es-AR': 'Paso 3: Verificar reemplazando x por 4',
          'en-US': 'Step 3: Check by substituting x = 4',
        },
        explanation: {
          'es-AR': '2 × 4 + 3 = 8 + 3 = 11. ¡Ambos lados pesan 11, la balanza sigue en equilibrio!',
          'en-US': '2 × 4 + 3 = 8 + 3 = 11. Both sides equal 11, so the scale stays level!',
        },
        mathExpression: '2(4) + 3 = 11 \\checkmark',
      },
    ],
    whyItWorks: {
      'es-AR': 'No es que un número "pasa al otro lado cambiando de signo por magia": en realidad aplicamos la operación inversa en ambos miembros para mantener la igualdad verdadera.',
      'en-US': 'Numbers do not "magically jump across the equals sign": we apply the inverse operation to both sides so the equality remains true.',
    },
    commonMistake: {
      wrongExample: {
        'es-AR': 'Confusión típica: en x + 3 = 7, sumar 3 y decir x = 10.',
        'en-US': 'Common trap: in x + 3 = 7, adding 3 to get x = 10.',
      },
      correction: {
        'es-AR': 'Para cancelar un +3 necesitamos su operación inversa (−3) en ambos lados: x = 7 − 3 = 4.',
        'en-US': 'To undo +3 we apply its inverse operation (−3) to both sides: x = 7 − 3 = 4.',
      },
    },
    deepDiveExtra: {
      'es-AR': 'Siempre podés comprobar tu respuesta antes de entregarla: reemplazá la x por el número que encontraste y fijate si el cálculo da igual de los dos lados.',
      'en-US': 'You can always verify your answer yourself: plug your number back into x and check that the left side equals the right side.',
    },
    quickChecks: [
      {
        id: 'eq-q1',
        question: {
          'es-AR': 'En la ecuación x + 5 = 12, ¿qué operación hacés en ambos lados para despejar x?',
          'en-US': 'In the equation x + 5 = 12, what operation do you apply to both sides to isolate x?',
        },
        options: [
          { label: { 'es-AR': 'Restar 5 en ambos lados (x = 7)', 'en-US': 'Subtract 5 from both sides (x = 7)' }, value: '7', isCorrect: true },
          { label: { 'es-AR': 'Sumar 5 en ambos lados (x = 17)', 'en-US': 'Add 5 to both sides (x = 17)' }, value: '17', isCorrect: false },
        ],
        explanation: {
          'es-AR': 'Al restar 5 en ambos miembros: x + 5 − 5 = 12 − 5 → x = 7.',
          'en-US': 'Subtracting 5 from both sides gives x + 5 − 5 = 12 − 5 → x = 7.',
        },
      },
      {
        id: 'eq-q2',
        question: {
          'es-AR': 'Si 3x = 15, ¿cuánto vale x?',
          'en-US': 'If 3x = 15, what is the value of x?',
        },
        options: [
          { label: { 'es-AR': '5 (dividiendo ambos lados por 3)', 'en-US': '5 (by dividing both sides by 3)' }, value: '5', isCorrect: true },
          { label: { 'es-AR': '12 (restando 3)', 'en-US': '12 (by subtracting 3)' }, value: '12', isCorrect: false },
        ],
        explanation: {
          'es-AR': '3 cajas iguales pesan 15, así que 15 ÷ 3 = 5.',
          'en-US': '3 identical boxes weigh 15, so 15 ÷ 3 = 5.',
        },
      },
    ],
  },
};
