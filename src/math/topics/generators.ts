import { formatRational, gcd, normalizeRational } from '../core/fraction';
import {
  createSeededRng,
  GradeId,
  GradeNumber,
  MathExercise,
  SchoolStageId,
  TopicId,
} from '../core/types';

export interface TopicMetadata {
  id: TopicId;
  stage: SchoolStageId;
  gradeId: GradeId;
  gradeNumber: GradeNumber;
  slugEs: string;
  slugEn: string;
  title: { 'es-AR': string; 'en-US': string };
  subtitle: { 'es-AR': string; 'en-US': string };
  planetName: { 'es-AR': string; 'en-US': string };
  guardianName: { 'es-AR': string; 'en-US': string };
  accessLevel: 'free' | 'premium';
  estimatedMinutes: number;
  rewardItemId: string;
}

export const TOPICS_CATALOG: TopicMetadata[] = [
  {
    id: 'addition-subtraction',
    stage: 'primary',
    gradeId: 'grade-1',
    gradeNumber: 1,
    slugEs: 'suma-y-resta',
    slugEn: 'addition-subtraction',
    title: {
      'es-AR': 'Suma y Resta Visual',
      'en-US': 'Visual Addition & Subtraction',
    },
    subtitle: {
      'es-AR': 'Agrupá decenas y unidades para resolver sin memorizar a ciegas.',
      'en-US': 'Group tens and ones to solve clearly without blind memorization.',
    },
    planetName: {
      'es-AR': 'Planeta Suma-1',
      'en-US': 'Planet Suma-1',
    },
    guardianName: {
      'es-AR': 'Comandante Ábaco',
      'en-US': 'Commander Abacus',
    },
    accessLevel: 'free',
    estimatedMinutes: 6,
    rewardItemId: 'hat-astro-helmet',
  },
  {
    id: 'multiplication-division',
    stage: 'primary',
    gradeId: 'grade-3',
    gradeNumber: 3,
    slugEs: 'multiplicacion-y-division',
    slugEn: 'multiplication-division',
    title: {
      'es-AR': 'Multiplicación y División por Grupos',
      'en-US': 'Multiplication & Division Arrays',
    },
    subtitle: {
      'es-AR': 'Conectá filas y columnas iguales con repartos justos.',
      'en-US': 'Connect equal rows and columns with fair sharing.',
    },
    planetName: {
      'es-AR': 'Estación Multi-Anillo',
      'en-US': 'Multi-Ring Station',
    },
    guardianName: {
      'es-AR': 'Capitán Grilla',
      'en-US': 'Captain Grid',
    },
    accessLevel: 'free',
    estimatedMinutes: 7,
    rewardItemId: 'suit-explorer',
  },
  {
    id: 'fractions',
    stage: 'primary',
    gradeId: 'grade-4',
    gradeNumber: 4,
    slugEs: 'fracciones',
    slugEn: 'fractions',
    title: {
      'es-AR': 'Fracciones y Partes Iguales',
      'en-US': 'Fractions & Equal Parts',
    },
    subtitle: {
      'es-AR': 'Entendé el numerador, el denominador y las fracciones equivalentes.',
      'en-US': 'Master numerators, denominators, and equivalent fractions.',
    },
    planetName: {
      'es-AR': 'Luna Partida',
      'en-US': 'Split Moon',
    },
    guardianName: {
      'es-AR': 'Guardián Cuarto',
      'en-US': 'Quarter Guardian',
    },
    accessLevel: 'free',
    estimatedMinutes: 8,
    rewardItemId: 'acc-gravity-boots',
  },
  {
    id: 'negative-numbers',
    stage: 'middle',
    gradeId: 'grade-6',
    gradeNumber: 6,
    slugEs: 'numeros-negativos',
    slugEn: 'negative-numbers',
    title: {
      'es-AR': 'Números Negativos y Recta Numérica',
      'en-US': 'Negative Numbers & Number Line',
    },
    subtitle: {
      'es-AR': 'Explorá temperaturas bajo cero, deudas y desplazamientos opuestos.',
      'en-US': 'Explore sub-zero temperatures, altitudes, and opposite shifts.',
    },
    planetName: {
      'es-AR': 'Nebulosa Bajo Cero',
      'en-US': 'Sub-Zero Nebula',
    },
    guardianName: {
      'es-AR': 'Barón Termómetro',
      'en-US': 'Baron Thermometer',
    },
    accessLevel: 'free',
    estimatedMinutes: 8,
    rewardItemId: 'hat-solar-crown',
  },
  {
    id: 'percentages-proportions',
    stage: 'middle',
    gradeId: 'grade-7',
    gradeNumber: 7,
    slugEs: 'porcentajes-y-proporciones',
    slugEn: 'percentages-proportions',
    title: {
      'es-AR': 'Porcentajes y Proporciones',
      'en-US': 'Percentages & Proportions',
    },
    subtitle: {
      'es-AR': 'Relacioná cada parte de 100 con fracciones y escalas reales.',
      'en-US': 'Connect parts per 100 with fractions and real-world scaling.',
    },
    planetName: {
      'es-AR': 'Púlsar Proporción',
      'en-US': 'Ratio Pulsar',
    },
    guardianName: {
      'es-AR': 'Oráculo Centésimo',
      'en-US': 'Centennial Oracle',
    },
    accessLevel: 'free',
    estimatedMinutes: 9,
    rewardItemId: 'suit-quantum-vest',
  },
  {
    id: 'linear-equations',
    stage: 'middle',
    gradeId: 'grade-8',
    gradeNumber: 8,
    slugEs: 'ecuaciones-lineales',
    slugEn: 'linear-equations',
    title: {
      'es-AR': 'Ecuaciones Lineales en Equilibrio',
      'en-US': 'Linear Equations in Balance',
    },
    subtitle: {
      'es-AR': 'Despejá la incógnita manteniendo los dos lados de la balanza iguales.',
      'en-US': 'Isolate the unknown while keeping both sides of the scale balanced.',
    },
    planetName: {
      'es-AR': 'Equilibria Prime',
      'en-US': 'Equilibria Prime',
    },
    guardianName: {
      'es-AR': 'Arquitecta Balanza',
      'en-US': 'Architect Balance',
    },
    accessLevel: 'premium',
    estimatedMinutes: 10,
    rewardItemId: 'acc-math-visor',
  },
];

export function generateMathExercise(
  topic: TopicId,
  difficulty: 1 | 2 | 3 = 1,
  seed: number = Date.now()
): MathExercise {
  const normalizedSeed = Math.abs(Math.trunc(seed)) || 101;
  const rng = createSeededRng(normalizedSeed);
  const exerciseId = `${topic}-d${difficulty}-s${normalizedSeed}`;

  switch (topic) {
    case 'addition-subtraction': {
      const isSubtraction = difficulty > 1 && rng.nextInt(0, 1) === 1;
      if (!isSubtraction) {
        const a =
          difficulty === 1
            ? rng.nextInt(6, 18)
            : difficulty === 2
              ? rng.nextInt(15, 48)
              : rng.nextInt(35, 89);
        const b =
          difficulty === 1
            ? rng.nextInt(4, 15)
            : difficulty === 2
              ? rng.nextInt(12, 39)
              : rng.nextInt(25, 76);
        const sum = a + b;
        const tensA = Math.floor(a / 10) * 10;
        const onesA = a % 10;
        const tensB = Math.floor(b / 10) * 10;
        const onesB = b % 10;

        return {
          id: exerciseId,
          seed: normalizedSeed,
          subject: 'mathematics',
          stage: 'primary',
          topic,
          difficulty,
          answerType: 'numeric',
          prompt: {
            'es-AR': `La nave recolectó ${a} cristales solares en el primer sector y ${b} en el segundo. ¿Cuántos cristales tiene en total?`,
            'en-US': `The ship collected ${a} solar crystals in sector one and ${b} in sector two. How many crystals does it have in total?`,
          },
          expressionLatex: `${a} + ${b} = ?`,
          correctAnswer: `${sum}`,
          visual: {
            kind: 'counters-combine',
            params: { a, b, operation: '+' },
          },
          hints: [
            {
              'es-AR': `Separá en decenas y unidades: ${a} = ${tensA} + ${onesA}, y ${b} = ${tensB} + ${onesB}.`,
              'en-US': `Split into tens and ones: ${a} = ${tensA} + ${onesA}, and ${b} = ${tensB} + ${onesB}.`,
            },
            {
              'es-AR': `Sumá primero las decenas (${tensA} + ${tensB} = ${tensA + tensB}) y luego las unidades (${onesA} + ${onesB} = ${onesA + onesB}).`,
              'en-US': `Add the tens first (${tensA} + ${tensB} = ${tensA + tensB}) and then the ones (${onesA} + ${onesB} = ${onesA + onesB}).`,
            },
            {
              'es-AR': `Juntá ambos resultados: ${tensA + tensB} + ${onesA + onesB} = ${sum}.`,
              'en-US': `Combine both parts: ${tensA + tensB} + ${onesA + onesB} = ${sum}.`,
            },
          ],
          solutionSteps: [
            {
              'es-AR': `Descomponemos cada número: ${a} = ${tensA} + ${onesA} y ${b} = ${tensB} + ${onesB}.`,
              'en-US': `Decompose each number: ${a} = ${tensA} + ${onesA} and ${b} = ${tensB} + ${onesB}.`,
            },
            {
              'es-AR': `Sumamos decenas con decenas (${tensA} + ${tensB} = ${tensA + tensB}) y unidades con unidades (${onesA} + ${onesB} = ${onesA + onesB}).`,
              'en-US': `Add tens with tens (${tensA} + ${tensB} = ${tensA + tensB}) and ones with ones (${onesA} + ${onesB} = ${onesA + onesB}).`,
            },
            {
              'es-AR': `Total final: ${tensA + tensB} + ${onesA + onesB} = ${sum}.`,
              'en-US': `Final total: ${tensA + tensB} + ${onesA + onesB} = ${sum}.`,
            },
          ],
        };
      } else {
        const b = difficulty === 2 ? rng.nextInt(8, 25) : rng.nextInt(18, 45);
        const diff = difficulty === 2 ? rng.nextInt(9, 28) : rng.nextInt(15, 52);
        const a = b + diff;
        return {
          id: exerciseId,
          seed: normalizedSeed,
          subject: 'mathematics',
          stage: 'primary',
          topic,
          difficulty,
          answerType: 'numeric',
          prompt: {
            'es-AR': `El tanque de energía tenía ${a} unidades y usamos ${b} para el despegue. ¿Cuántas unidades quedan?`,
            'en-US': `The energy tank had ${a} units and we used ${b} for liftoff. How many units remain?`,
          },
          expressionLatex: `${a} - ${b} = ?`,
          correctAnswer: `${diff}`,
          visual: {
            kind: 'counters-combine',
            params: { a, b, operation: '-' },
          },
          hints: [
            {
              'es-AR': `Pensá la resta como lo que falta para llegar de ${b} hasta ${a}.`,
              'en-US': `Think of subtraction as the distance needed to go from ${b} up to ${a}.`,
            },
            {
              'es-AR': `Restá primero ${Math.floor(b / 10) * 10} a ${a}: te queda ${a - Math.floor(b / 10) * 10}.`,
              'en-US': `First subtract ${Math.floor(b / 10) * 10} from ${a}: you get ${a - Math.floor(b / 10) * 10}.`,
            },
            {
              'es-AR': `Ahora quitá las ${b % 10} unidades restantes para obtener ${diff}.`,
              'en-US': `Now remove the remaining ${b % 10} ones to get ${diff}.`,
            },
          ],
          solutionSteps: [
            {
              'es-AR': `Partimos de ${a} y separamos ${b} en ${Math.floor(b / 10) * 10} y ${b % 10}.`,
              'en-US': `Start at ${a} and split ${b} into ${Math.floor(b / 10) * 10} and ${b % 10}.`,
            },
            {
              'es-AR': `${a} - ${Math.floor(b / 10) * 10} = ${a - Math.floor(b / 10) * 10}.`,
              'en-US': `${a} - ${Math.floor(b / 10) * 10} = ${a - Math.floor(b / 10) * 10}.`,
            },
            {
              'es-AR': `${a - Math.floor(b / 10) * 10} - ${b % 10} = ${diff}.`,
              'en-US': `${a - Math.floor(b / 10) * 10} - ${b % 10} = ${diff}.`,
            },
          ],
        };
      }
    }

    case 'multiplication-division': {
      const isDivision = difficulty > 1 && rng.nextInt(0, 1) === 1;
      const rows =
        difficulty === 1
          ? rng.nextInt(2, 5)
          : difficulty === 2
            ? rng.nextInt(3, 8)
            : rng.nextInt(4, 11);
      const cols =
        difficulty === 1
          ? rng.nextInt(2, 6)
          : difficulty === 2
            ? rng.nextInt(3, 9)
            : rng.nextInt(5, 12);
      const product = rows * cols;

      if (!isDivision) {
        return {
          id: exerciseId,
          seed: normalizedSeed,
          subject: 'mathematics',
          stage: 'primary',
          topic,
          difficulty,
          answerType: 'numeric',
          prompt: {
            'es-AR': `El panel solar de la estación tiene ${rows} filas con ${cols} celdas en cada fila. ¿Cuántas celdas hay en total?`,
            'en-US': `The station's solar array has ${rows} rows with ${cols} cells in each row. How many cells are there in total?`,
          },
          expressionLatex: `${rows} \\times ${cols} = ?`,
          correctAnswer: `${product}`,
          visual: {
            kind: 'array-grid',
            params: { rows, cols },
          },
          hints: [
            {
              'es-AR': `${rows} × ${cols} significa sumar ${rows} grupos iguales de ${cols}.`,
              'en-US': `${rows} × ${cols} means adding ${rows} equal groups of ${cols}.`,
            },
            {
              'es-AR': `Si contás por filas: ${Array.from({ length: rows }, () => cols).join(' + ')}.`,
              'en-US': `Counting by rows: ${Array.from({ length: rows }, () => cols).join(' + ')}.`,
            },
            {
              'es-AR': `El total de las ${rows} filas de ${cols} es ${product}.`,
              'en-US': `The total of ${rows} rows of ${cols} is ${product}.`,
            },
          ],
          solutionSteps: [
            {
              'es-AR': `Representamos ${rows} filas de ${cols} elementos cada una.`,
              'en-US': `Represent ${rows} rows of ${cols} items each.`,
            },
            {
              'es-AR': `Sumamos grupos iguales: ${Array.from({ length: rows }, () => cols).join(' + ')} = ${product}.`,
              'en-US': `Add equal groups: ${Array.from({ length: rows }, () => cols).join(' + ')} = ${product}.`,
            },
          ],
        };
      } else {
        return {
          id: exerciseId,
          seed: normalizedSeed,
          subject: 'mathematics',
          stage: 'primary',
          topic,
          difficulty,
          answerType: 'numeric',
          prompt: {
            'es-AR': `Repartimos ${product} baterías en ${rows} cajas iguales sin que sobre ninguna. ¿Cuántas baterías van en cada caja?`,
            'en-US': `We share ${product} batteries equally across ${rows} crates with none left over. How many batteries go into each crate?`,
          },
          expressionLatex: `${product} \\div ${rows} = ?`,
          correctAnswer: `${cols}`,
          visual: {
            kind: 'array-grid',
            params: { rows, cols },
          },
          hints: [
            {
              'es-AR': `Dividir ${product} entre ${rows} es buscar qué número multiplicado por ${rows} da ${product}.`,
              'en-US': `Dividing ${product} by ${rows} means finding which number multiplied by ${rows} equals ${product}.`,
            },
            {
              'es-AR': `Pensá en la tabla del ${rows}: ${rows} × ? = ${product}.`,
              'en-US': `Think of multiples of ${rows}: ${rows} × ? = ${product}.`,
            },
            {
              'es-AR': `Como ${rows} × ${cols} = ${product}, en cada caja van ${cols}.`,
              'en-US': `Since ${rows} × ${cols} = ${product}, each crate holds ${cols}.`,
            },
          ],
          solutionSteps: [
            {
              'es-AR': `Buscamos el factor desconocido en ${rows} × ? = ${product}.`,
              'en-US': `Find the unknown factor in ${rows} × ? = ${product}.`,
            },
            {
              'es-AR': `Al organizar ${product} en ${rows} filas iguales, cada fila tiene ${cols} unidades.`,
              'en-US': `When arranging ${product} into ${rows} equal rows, each row has ${cols} units.`,
            },
          ],
        };
      }
    }

    case 'fractions': {
      if (difficulty === 1) {
        const denominators = [2, 3, 4, 5, 6, 8] as const;
        const den = rng.pick(denominators);
        const num = rng.nextInt(1, den - 1);
        const simplified = normalizeRational(num, den)!;
        const canonical = formatRational(simplified);

        return {
          id: exerciseId,
          seed: normalizedSeed,
          subject: 'mathematics',
          stage: 'primary',
          topic,
          difficulty,
          answerType: 'fraction',
          acceptEquivalentFractions: true,
          prompt: {
            'es-AR': `Una barra de energía está dividida en ${den} partes iguales y ${num} están encendidas. Escribí la fracción (por ejemplo ${num}/${den}).`,
            'en-US': `An energy bar is divided into ${den} equal parts and ${num} are lit. Write the fraction (for example ${num}/${den}).`,
          },
          expressionLatex: `\\frac{${num}}{${den}}`,
          correctAnswer: canonical,
          visual: {
            kind: 'fraction-slices',
            params: { numerator: num, denominator: den },
          },
          hints: [
            {
              'es-AR': `El número de abajo (denominador) es el total de partes iguales: ${den}.`,
              'en-US': `The bottom number (denominator) is the total number of equal parts: ${den}.`,
            },
            {
              'es-AR': `El número de arriba (numerador) indica cuántas partes tomamos: ${num}.`,
              'en-US': `The top number (numerator) shows how many parts are active: ${num}.`,
            },
            {
              'es-AR': `Escribí ${num}/${den} (o su forma simplificada ${canonical}).`,
              'en-US': `Write ${num}/${den} (or its simplified form ${canonical}).`,
            },
          ],
          solutionSteps: [
            {
              'es-AR': `Contamos ${den} partes iguales en total → denominador = ${den}.`,
              'en-US': `Count ${den} equal parts in total → denominator = ${den}.`,
            },
            {
              'es-AR': `Contamos ${num} partes pintadas → numerador = ${num}. Fracción: ${num}/${den} (simplificada: ${canonical}).`,
              'en-US': `Count ${num} shaded parts → numerator = ${num}. Fraction: ${num}/${den} (simplified: ${canonical}).`,
            },
          ],
        };
      } else {
        // Addition of fractions with same or simple related denominator
        const den = rng.pick([4, 6, 8, 10] as const);
        const a = rng.nextInt(1, Math.floor(den / 2));
        const b = rng.nextInt(1, den - a - 1);
        const sumNum = a + b;
        const simplified = normalizeRational(sumNum, den)!;
        const canonical = formatRational(simplified);
        const divisor = gcd(sumNum, den);

        return {
          id: exerciseId,
          seed: normalizedSeed,
          subject: 'mathematics',
          stage: 'primary',
          topic,
          difficulty,
          answerType: 'fraction',
          acceptEquivalentFractions: true,
          prompt: {
            'es-AR': `Sumá las fracciones de combustible: ${a}/${den} + ${b}/${den}. Podés responder sin simplificar o simplificado.`,
            'en-US': `Add the fuel fractions: ${a}/${den} + ${b}/${den}. You may enter the unreduced or simplified fraction.`,
          },
          expressionLatex: `\\frac{${a}}{${den}} + \\frac{${b}}{${den}} = ?`,
          correctAnswer: canonical,
          visual: {
            kind: 'fraction-slices',
            params: { numerator: sumNum, denominator: den, partA: a, partB: b },
          },
          hints: [
            {
              'es-AR': `Como las partes tienen el mismo tamaño (denominador ${den}), el denominador se mantiene en ${den}.`,
              'en-US': `Because the parts are the same size (denominator ${den}), keep the denominator as ${den}.`,
            },
            {
              'es-AR': `Sumá solo los numeradores: ${a} + ${b} = ${sumNum}, formando ${sumNum}/${den}.`,
              'en-US': `Add only the numerators: ${a} + ${b} = ${sumNum}, giving ${sumNum}/${den}.`,
            },
            {
              'es-AR':
                divisor > 1
                  ? `Dividí arriba y abajo por ${divisor} para simplificar a ${canonical} (o ingresá ${sumNum}/${den}).`
                  : `La fracción ya está simplificada: ${canonical}.`,
              'en-US':
                divisor > 1
                  ? `Divide top and bottom by ${divisor} to simplify to ${canonical} (or enter ${sumNum}/${den}).`
                  : `The fraction is already simplified: ${canonical}.`,
            },
          ],
          solutionSteps: [
            {
              'es-AR': `Mismo denominador (${den}): sumamos numeradores ${a} + ${b} = ${sumNum} → ${sumNum}/${den}.`,
              'en-US': `Same denominator (${den}): add numerators ${a} + ${b} = ${sumNum} → ${sumNum}/${den}.`,
            },
            {
              'es-AR':
                divisor > 1
                  ? `Simplificamos dividiendo numerador y denominador por ${divisor}: ${canonical}.`
                  : `Resultado final irreductible: ${canonical}.`,
              'en-US':
                divisor > 1
                  ? `Simplify by dividing numerator and denominator by ${divisor}: ${canonical}.`
                  : `Final irreducible result: ${canonical}.`,
            },
          ],
        };
      }
    }

    case 'negative-numbers': {
      const startTemp = rng.nextInt(-9, -1);
      const delta =
        difficulty === 1
          ? rng.nextInt(3, 10)
          : difficulty === 2
            ? -rng.nextInt(2, 7)
            : rng.nextInt(-8, 12) || 5;
      const result = startTemp + delta;
      const signSymbol = delta >= 0 ? '+' : '-';
      const absDelta = Math.abs(delta);

      return {
        id: exerciseId,
        seed: normalizedSeed,
        subject: 'mathematics',
        stage: 'middle',
        topic,
        difficulty,
        answerType: 'numeric',
        prompt: {
          'es-AR': `En la Nebulosa Bajo Cero la temperatura era de ${startTemp} °C y luego ${
            delta >= 0 ? `subió ${absDelta} °C` : `bajó ${absDelta} °C`
          }. ¿Cuál es la nueva temperatura?`,
          'en-US': `In the Sub-Zero Nebula the temperature was ${startTemp} °C and then ${
            delta >= 0 ? `rose by ${absDelta} °C` : `dropped by ${absDelta} °C`
          }. What is the new temperature?`,
        },
        expressionLatex: `${startTemp} ${signSymbol} ${absDelta} = ?`,
        correctAnswer: `${result}`,
        visual: {
          kind: 'number-line',
          params: { start: startTemp, delta, end: result },
        },
        hints: [
          {
            'es-AR': `Ubicá el ${startTemp} a la izquierda del 0 en la recta numérica.`,
            'en-US': `Locate ${startTemp} to the left of 0 on the number line.`,
          },
          {
            'es-AR':
              delta >= 0
                ? `Subir ${absDelta} significa moverse ${absDelta} lugares hacia la derecha.`
                : `Bajar ${absDelta} significa moverse ${absDelta} lugares más hacia la izquierda.`,
            'en-US':
              delta >= 0
                ? `Rising by ${absDelta} means moving ${absDelta} steps to the right.`
                : `Dropping by ${absDelta} means moving ${absDelta} more steps to the left.`,
          },
          {
            'es-AR': `Al avanzar desde ${startTemp}, llegás exactamente a ${result}.`,
            'en-US': `Stepping from ${startTemp} lands you right on ${result}.`,
          },
        ],
        solutionSteps: [
          {
            'es-AR': `Punto inicial en la recta: ${startTemp}.`,
            'en-US': `Starting point on the number line: ${startTemp}.`,
          },
          {
            'es-AR': `Desplazamiento: ${delta >= 0 ? `+${absDelta} (derecha)` : `-${absDelta} (izquierda)`}.`,
            'en-US': `Shift: ${delta >= 0 ? `+${absDelta} (right)` : `-${absDelta} (left)`}.`,
          },
          {
            'es-AR': `Posición final: ${startTemp} ${signSymbol} ${absDelta} = ${result}.`,
            'en-US': `Final position: ${startTemp} ${signSymbol} ${absDelta} = ${result}.`,
          },
        ],
      };
    }

    case 'percentages-proportions': {
      const percents =
        difficulty === 1
          ? ([10, 20, 25, 50] as const)
          : difficulty === 2
            ? ([15, 25, 30, 40, 75] as const)
            : ([12, 20, 35, 60, 80] as const);
      const pct = rng.pick(percents);
      const baseMultipliers = [20, 40, 60, 80, 100, 120, 200] as const;
      const total = rng.pick(baseMultipliers);
      const answer = (pct * total) / 100;

      return {
        id: exerciseId,
        seed: normalizedSeed,
        subject: 'mathematics',
        stage: 'middle',
        topic,
        difficulty,
        answerType: 'numeric',
        prompt: {
          'es-AR': `El escudo cuántico está al ${pct}% de su capacidad máxima de ${total} megavatios. ¿Cuántos megavatios representa el ${pct}% de ${total}?`,
          'en-US': `The quantum shield is at ${pct}% of its ${total}-megawatt maximum capacity. How many megawatts is ${pct}% of ${total}?`,
        },
        expressionLatex: `${pct}\\% \\text{ of } ${total} = \\frac{${pct}}{100} \\times ${total}`,
        correctAnswer: `${answer}`,
        visual: {
          kind: 'percent-bar',
          params: { percent: pct, total, part: answer },
        },
        hints: [
          {
            'es-AR': `Recordá que ${pct}% significa "${pct} de cada 100", es decir la fracción ${pct}/100.`,
            'en-US': `Remember that ${pct}% means "${pct} out of every 100", or the fraction ${pct}/100.`,
          },
          {
            'es-AR': `El 10% de ${total} es ${total / 10}. Usalo como bloque de referencia.`,
            'en-US': `10% of ${total} is ${total / 10}. Use that as your reference building block.`,
          },
          {
            'es-AR': `Multiplicá (${pct} × ${total}) ÷ 100 = ${answer}.`,
            'en-US': `Calculate (${pct} × ${total}) ÷ 100 = ${answer}.`,
          },
        ],
        solutionSteps: [
          {
            'es-AR': `Expresamos el porcentaje como fracción: ${pct}% = ${pct}/100.`,
            'en-US': `Express the percentage as a fraction: ${pct}% = ${pct}/100.`,
          },
          {
            'es-AR': `Multiplicamos por el total: (${pct} × ${total}) / 100 = ${pct * total} / 100 = ${answer}.`,
            'en-US': `Multiply by the total: (${pct} × ${total}) / 100 = ${pct * total} / 100 = ${answer}.`,
          },
        ],
      };
    }

    case 'linear-equations': {
      const xVal =
        difficulty === 1
          ? rng.nextInt(2, 12)
          : difficulty === 2
            ? rng.nextInt(3, 15)
            : rng.nextInt(-6, 14) || 4;
      const coeff = difficulty === 1 ? 1 : rng.nextInt(2, 5);
      const constant = rng.nextInt(2, 14);
      const rhs = coeff * xVal + constant;
      const lhsText = coeff === 1 ? `x + ${constant}` : `${coeff}x + ${constant}`;

      return {
        id: exerciseId,
        seed: normalizedSeed,
        subject: 'mathematics',
        stage: 'middle',
        topic,
        difficulty,
        answerType: 'equation',
        prompt: {
          'es-AR': `Mantené la balanza en equilibrio para descubrir el valor de x en la ecuación: ${lhsText} = ${rhs}`,
          'en-US': `Keep the scale in balance to find the value of x in the equation: ${lhsText} = ${rhs}`,
        },
        expressionLatex: `${lhsText} = ${rhs}`,
        correctAnswer: `${xVal}`,
        visual: {
          kind: 'balance-scale',
          params: { coeff, constant, rhs, xVal },
        },
        hints: [
          {
            'es-AR': `Para dejar sola a la incógnita, primero restá ${constant} en AMBOS lados de la balanza.`,
            'en-US': `To isolate the unknown, first subtract ${constant} from BOTH sides of the scale.`,
          },
          {
            'es-AR': `Al restar ${constant} de los dos lados, queda: ${coeff === 1 ? 'x' : `${coeff}x`} = ${rhs - constant}.`,
            'en-US': `Subtracting ${constant} from both sides leaves: ${coeff === 1 ? 'x' : `${coeff}x`} = ${rhs - constant}.`,
          },
          {
            'es-AR':
              coeff === 1
                ? `Entonces x = ${xVal}.`
                : `Dividí ambos lados por ${coeff}: x = ${rhs - constant} ÷ ${coeff} = ${xVal}.`,
            'en-US':
              coeff === 1
                ? `Therefore x = ${xVal}.`
                : `Divide both sides by ${coeff}: x = ${rhs - constant} ÷ ${coeff} = ${xVal}.`,
          },
        ],
        solutionSteps: [
          {
            'es-AR': `Ecuación original: ${lhsText} = ${rhs}. Restamos ${constant} en ambos lados para conservar el equilibrio.`,
            'en-US': `Original equation: ${lhsText} = ${rhs}. Subtract ${constant} from both sides to preserve balance.`,
          },
          {
            'es-AR': `Obtenemos: ${coeff === 1 ? 'x' : `${coeff}x`} = ${rhs - constant}.`,
            'en-US': `We get: ${coeff === 1 ? 'x' : `${coeff}x`} = ${rhs - constant}.`,
          },
          ...(coeff > 1
            ? [
                {
                  'es-AR': `Dividimos ambos miembros por ${coeff}: x = ${rhs - constant} / ${coeff} = ${xVal}.`,
                  'en-US': `Divide both sides by ${coeff}: x = ${rhs - constant} / ${coeff} = ${xVal}.`,
                },
              ]
            : []),
        ],
      };
    }
  }
}
