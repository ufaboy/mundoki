import { GRADE_SEVEN_LESSONS } from '../content/grade7';
import { GRADE_SIX_LESSONS } from '../content/grade6';
import { GRADE_FIVE_LESSONS } from '../content/grade5';
import { GRADE_THREE_LESSONS } from '../content/grade3';
import { GRADE_FOUR_LESSONS } from '../content/grade4';
import { GRADE_TWO_LESSONS } from '../content/grade2';
import { GRADE_ONE_LESSONS } from '../content/grade1';
import {
  AccessLevel,
  GradeId,
  GradeNumber,
  LocalizedText,
  SchoolStageId,
  TopicId,
} from './core/types';

export interface GradeLessonItem {
  lessonId?: string;
  id: string;
  unitCode: string;
  order: number;
  title: LocalizedText;
  summary: LocalizedText;
  estimatedMinutes: number;
  accessLevel: AccessLevel;
  linkedTopicId: TopicId;
  trainerTitle: LocalizedText;
  planetSector: LocalizedText;
  hasInteractiveDiagram: boolean;
}

export interface GradeMetadata {
  id: GradeId;
  gradeNumber: GradeNumber;
  stage: SchoolStageId;
  slugEs: string;
  slugEn: string;
  labelShort: LocalizedText;
  title: LocalizedText;
  ageRange: LocalizedText;
  summary: LocalizedText;
  planetSector: LocalizedText;
  guardianTitle: LocalizedText;
  primaryTopicId: TopicId;
  lessons: GradeLessonItem[];
}

export interface SchoolBlockMetadata {
  id: SchoolStageId;
  blockNumber: 1 | 2 | 3;
  gradeNumbers: readonly GradeNumber[];
  slugEs: string;
  slugEn: string;
  title: LocalizedText;
  gradeRangeLabel: LocalizedText;
  description: LocalizedText;
  badgeColorVar: string;
}

export const SCHOOL_BLOCKS: SchoolBlockMetadata[] = [
  {
    id: 'primary',
    blockNumber: 1,
    gradeNumbers: [1, 2, 3, 4, 5, 6, 7],
    slugEs: 'primaria',
    slugEn: 'primary-school',
    title: {
      'es-AR': 'Primaria · CABA',
      'en-US': 'Primary school · CABA',
    },
    gradeRangeLabel: {
      'es-AR': '1.° a 7.° grado',
      'en-US': 'Grades 1–7',
    },
    description: {
      'es-AR':
        'Sentido numérico visual, bloques en base 10, sumas y restas con reagrupación, grillas de multiplicación/división y primeras fracciones.',
      'en-US':
        'Visual number sense, base-10 blocks, addition and subtraction with regrouping, multiplication/division arrays, and foundational fractions.',
    },
    badgeColorVar: 'var(--accent-emerald)',
  },
  {
    id: 'middle',
    blockNumber: 2,
    gradeNumbers: [8, 9],
    slugEs: 'secundaria-media',
    slugEn: 'middle-school',
    title: {
      'es-AR': 'Secundaria · 1.° y 2.° año',
      'en-US': 'Secondary school · Years 1–2',
    },
    gradeRangeLabel: {
      'es-AR': 'Años de escolaridad 8–9 · CABA',
      'en-US': 'Schooling years 8–9 · CABA',
    },
    description: {
      'es-AR':
        'Operaciones con fracciones y decimales, números negativos en la recta numérica, porcentajes, proporciones y ecuaciones lineales en equilibrio.',
      'en-US':
        'Operations with fractions and decimals, negative numbers on the number line, percentages, proportions, and linear equations in balance.',
    },
    badgeColorVar: 'var(--accent-primary)',
  },
  {
    id: 'high',
    blockNumber: 3,
    gradeNumbers: [10, 11, 12],
    slugEs: 'secundaria-superior',
    slugEn: 'high-school',
    title: {
      'es-AR': 'Secundaria · 3.° a 5.° año',
      'en-US': 'Secondary school · Years 3–5',
    },
    gradeRangeLabel: {
      'es-AR': 'Años de escolaridad 10–12 · CABA',
      'en-US': 'Schooling years 10–12 · CABA',
    },
    description: {
      'es-AR':
        'Sistemas de ecuaciones, funciones cuadráticas, trigonometría visual, modelos exponenciales e introducción intuitiva al análisis matemático.',
      'en-US':
        'Systems of equations, quadratic functions, visual trigonometry, exponential models, and intuitive foundations of calculus.',
    },
    badgeColorVar: 'var(--accent-violet)',
  },
];

export const GRADES_CATALOG: GradeMetadata[] = [
  // =========================================================================
  // CABA PRIMARY SCHOOL (schooling years 1 to 7)
  // =========================================================================
  {
    id: 'grade-1',
    gradeNumber: 1,
    stage: 'primary',
    slugEs: '1-grado',
    slugEn: 'grade-1',
    labelShort: { 'es-AR': '1.° Grado', 'en-US': '1st Grade' },
    title: {
      'es-AR': '1.° Grado · Números, Formas y Nuestro Mundo',
      'en-US': '1st Grade · Numbers, Shapes & Our World',
    },
    ageRange: { 'es-AR': '6–7 años', 'en-US': 'Ages 6–7' },
    summary: {
      'es-AR':
        '35 lecciones para contar, sumar, restar, explorar formas, medir, leer datos y explicar tus ideas.',
      'en-US':
        '35 lessons to count, add, subtract, explore shapes, measure, read data, and explain your ideas.',
    },
    planetSector: { 'es-AR': 'Planeta Suma-1 · Sector Alfa', 'en-US': 'Planet Suma-1 · Alpha Sector' },
    guardianTitle: { 'es-AR': 'Comandante Ábaco', 'en-US': 'Commander Abacus' },
    primaryTopicId: 'addition-subtraction',
    lessons: GRADE_ONE_LESSONS.map((lesson, index) => ({
      id: lesson.id, lessonId: lesson.id, unitCode: lesson.packageId, order: index + 1,
      title: lesson.title, summary: lesson.objective, estimatedMinutes: 10,
      accessLevel: 'free', linkedTopicId: 'addition-subtraction',
      trainerTitle: { 'es-AR': 'Práctica de la lección', 'en-US': 'Lesson practice' },
      planetSector: { 'es-AR': 'Planeta Suma-1', 'en-US': 'Planet Suma-1' },
      hasInteractiveDiagram: true,
    })),
  },
  {
    id: 'grade-2',
    gradeNumber: 2,
    stage: 'primary',
    slugEs: '2-grado',
    slugEn: 'grade-2',
    labelShort: { 'es-AR': '2.° Grado', 'en-US': '2nd Grade' },
    title: {
      'es-AR': '2.° Grado · Números hasta Mil y Grupos Iguales',
      'en-US': '2nd Grade · Numbers to One Thousand & Equal Groups',
    },
    ageRange: { 'es-AR': '7–8 años', 'en-US': 'Ages 7–8' },
    summary: {
      'es-AR':
        '36 lecciones sobre números hasta mil, cálculo mental, grupos iguales, figuras, medidas y datos.',
      'en-US':
        '36 lessons on numbers to one thousand, mental calculation, equal groups, shapes, measurements, and data.',
    },
    planetSector: { 'es-AR': 'Planeta Suma-1 · Sector Beta', 'en-US': 'Planet Suma-1 · Beta Sector' },
    guardianTitle: { 'es-AR': 'Comandante Ábaco II', 'en-US': 'Commander Abacus II' },
    primaryTopicId: 'addition-subtraction',
    lessons: GRADE_TWO_LESSONS.map((lesson, index) => ({
      id: lesson.id, lessonId: lesson.id, unitCode: lesson.packageId, order: index + 1,
      title: lesson.title, summary: lesson.objective, estimatedMinutes: 10,
      accessLevel: 'free', linkedTopicId: 'addition-subtraction',
      trainerTitle: { 'es-AR': 'Práctica de la lección', 'en-US': 'Lesson practice' },
      planetSector: { 'es-AR': 'Planeta Suma-1 · Sector Beta', 'en-US': 'Planet Suma-1 · Beta Sector' },
      hasInteractiveDiagram: true,
    })),
  },
  {
    id: 'grade-3',
    gradeNumber: 3,
    stage: 'primary',
    slugEs: '3-grado',
    slugEn: 'grade-3',
    labelShort: { 'es-AR': '3.° Grado', 'en-US': '3rd Grade' },
    title: {
      'es-AR': '3.° Grado · Cuatro operaciones y estrategias',
      'en-US': '3rd Grade · Four Operations and Strategies',
    },
    ageRange: { 'es-AR': '8–9 años', 'en-US': 'Ages 8–9' },
    summary: {
      'es-AR':
        'Números hasta diez mil, cuatro operaciones, planos, medidas, tiempo y datos.',
      'en-US':
        'Numbers up to ten thousand, four operations, plans, measurements, time, and data.',
    },
    planetSector: { 'es-AR': 'Estación Multi-Anillo', 'en-US': 'Multi-Ring Station' },
    guardianTitle: { 'es-AR': 'Capitán Grilla', 'en-US': 'Captain Grid' },
    primaryTopicId: 'multiplication-division',
    lessons: GRADE_THREE_LESSONS.map((lesson, index) => ({
      id: lesson.id, lessonId: lesson.id, unitCode: lesson.packageId, order: index + 1,
      title: lesson.title, summary: lesson.objective, estimatedMinutes: 10,
      accessLevel: 'free', linkedTopicId: 'multiplication-division',
      trainerTitle: { 'es-AR': 'Práctica de la lección', 'en-US': 'Lesson practice' },
      planetSector: { 'es-AR': 'Recorrido de 3.° grado', 'en-US': 'Grade 3 learning path' },
      hasInteractiveDiagram: ['G03-04','G03-05','G03-06','G04-03','G04-04','G04-06','G04-07','G04-08','G04-10'].includes(lesson.packageId),
    })),
  },
  {
    id: 'grade-4',
    gradeNumber: 4,
    stage: 'primary',
    slugEs: '4-grado',
    slugEn: 'grade-4',
    labelShort: { 'es-AR': '4.° Grado', 'en-US': '4th Grade' },
    title: {
      'es-AR': '4.° Grado · Números grandes, fracciones y datos',
      'en-US': '4th Grade · Large Numbers, Fractions, and Data',
    },
    ageRange: { 'es-AR': '9–10 años', 'en-US': 'Ages 9–10' },
    summary: {
      'es-AR':
        'Cálculo con números grandes, fracciones y decimales, mediciones, geometría y gráficos.',
      'en-US':
        'Large-number calculations, fractions and decimals, measurements, geometry, and graphs.',
    },
    planetSector: { 'es-AR': 'Luna Partida', 'en-US': 'Split Moon' },
    guardianTitle: { 'es-AR': 'Guardián Cuarto', 'en-US': 'Quarter Guardian' },
    primaryTopicId: 'fractions',
    lessons: GRADE_FOUR_LESSONS.map((lesson, index) => ({
      id: lesson.id, lessonId: lesson.id, unitCode: lesson.packageId, order: index + 1,
      title: lesson.title, summary: lesson.objective, estimatedMinutes: 15,
      accessLevel: 'free', linkedTopicId: 'fractions',
      trainerTitle: { 'es-AR': 'Práctica de la lección', 'en-US': 'Lesson practice' },
      planetSector: { 'es-AR': 'Recorrido de 4.° grado', 'en-US': 'Grade 4 learning path' },
      hasInteractiveDiagram: ['G03-04','G03-05','G03-06','G04-03','G04-04','G04-06','G04-07','G04-08','G04-10'].includes(lesson.packageId),
    })),
  },

  // =========================================================================
  // UPPER PRIMARY AND SECONDARY COURSES (CABA mapping is defined per grade)
  // =========================================================================
  {
    id: 'grade-5',
    gradeNumber: 5,
    stage: 'primary',
    slugEs: '5-grado',
    slugEn: 'grade-5',
    labelShort: { 'es-AR': '5.° Grado', 'en-US': '5th Grade' },
    title: {
      'es-AR': '5.° Grado · Fracciones Avanzadas, Decimales y Escala 100',
      'en-US': '5th Grade · Advanced Fractions, Decimals & 100-Grids',
    },
    ageRange: { 'es-AR': '10–11 años', 'en-US': 'Ages 10–11' },
    summary: {
      'es-AR':
        '38 lecciones sobre fracciones y decimales, estrategias, construcciones, medidas, datos y moda.',
      'en-US':
        '38 lessons on fractions and decimals, strategies, constructions, measurements, data, and mode.',
    },
    planetSector: { 'es-AR': 'Órbita de Transición · Luna Partida II', 'en-US': 'Transition Orbit · Split Moon II' },
    guardianTitle: { 'es-AR': 'Navegante Racional', 'en-US': 'Rational Navigator' },
    primaryTopicId: 'fractions',
    lessons: GRADE_FIVE_LESSONS.map((lesson,index)=>({
      id:lesson.id,lessonId:lesson.id,unitCode:lesson.packageId,order:index+1,
      title:lesson.title,summary:lesson.objective,estimatedMinutes:15,
      accessLevel:'free',linkedTopicId:'fractions',
      trainerTitle:{'es-AR':'Práctica de la lección','en-US':'Lesson practice'},
      planetSector:{'es-AR':'Recorrido de 5.° grado','en-US':'Grade 5 learning path'},
      hasInteractiveDiagram:['G05-02','G05-03','G05-04','G05-05','G05-06','G05-07','G05-08','G05-12'].includes(lesson.packageId),
    })),
  },
  {
    id: 'grade-6',
    gradeNumber: 6,
    stage: 'primary',
    slugEs: '6-grado',
    slugEn: 'grade-6',
    labelShort: { 'es-AR': '6.° Grado', 'en-US': '6th Grade' },
    title: { 'es-AR': '6.° Grado · Proporciones, porcentajes y medidas', 'en-US': 'Grade 6 · Proportions, Percentages, and Measurement' },
    ageRange: { 'es-AR': '11–12 años', 'en-US': 'Ages 11–12' },
    summary: { 'es-AR': '39 lecciones sobre divisibilidad, racionales, proporciones, porcentajes, escala, área, gráficos y media.', 'en-US': '39 lessons on divisibility, rational numbers, proportions, percentages, scale, area, graphs, and mean.' },
    planetSector: { 'es-AR': 'Nebulosa Bajo Cero', 'en-US': 'Sub-Zero Nebula' },
    guardianTitle: { 'es-AR': 'Barón Termómetro', 'en-US': 'Baron Thermometer' },
    primaryTopicId: 'percentages-proportions',
    lessons:GRADE_SIX_LESSONS.map((lesson,index)=>({
      id:lesson.id,lessonId:lesson.id,unitCode:lesson.packageId,order:index+1,
      title:lesson.title,summary:lesson.objective,estimatedMinutes:15,
      accessLevel:'free',linkedTopicId:'percentages-proportions',
      trainerTitle:{'es-AR':'Práctica de la lección','en-US':'Lesson practice'},
      planetSector:{'es-AR':'Recorrido de 6.° grado','en-US':'Grade 6 learning path'},
      hasInteractiveDiagram:['G06-02','G06-03','G06-06','G06-07','G06-08','G06-09','G06-10','G06-12'].includes(lesson.packageId),
    })),
  },
  {
    id: 'grade-7',
    gradeNumber: 7,
    stage: 'primary',
    slugEs: '7-grado',
    slugEn: 'grade-7',
    labelShort: { 'es-AR': '7.° Grado', 'en-US': '7th Grade' },
    title: {
      'es-AR': '7.° Grado · Cierre de primaria',
      'en-US': 'Grade 7 · Completing Primary School',
    },
    ageRange: { 'es-AR': '12–13 años', 'en-US': 'Ages 12–13' },
    summary: {
      'es-AR':
        '33 lecciones sobre racionales, relaciones, geometría y datos, con exploraciones adicionales y un proyecto final.',
      'en-US':
        '33 lessons on rational numbers, relationships, geometry, and data, with additional explorations and a final project.',
    },
    planetSector: { 'es-AR': 'Púlsar Proporción', 'en-US': 'Ratio Pulsar' },
    guardianTitle: { 'es-AR': 'Oráculo Centésimo', 'en-US': 'Centennial Oracle' },
    primaryTopicId: 'percentages-proportions',
    lessons:GRADE_SEVEN_LESSONS.map((lesson,index)=>({
      id:lesson.id,lessonId:lesson.id,unitCode:lesson.packageId,order:index+1,
      title:lesson.title,summary:lesson.objective,estimatedMinutes:15,
      accessLevel:'free',linkedTopicId:'percentages-proportions',
      trainerTitle:{'es-AR':'Práctica de la lección','en-US':'Lesson practice'},
      planetSector:{'es-AR':'Recorrido de 7.° grado','en-US':'Grade 7 learning path'},
      hasInteractiveDiagram:['G07-03','G07-04','G07-05','G07-06','G07-07','G07-08','G07-09','G07-10'].includes(lesson.packageId),
    })),
  },
  {
    id: 'grade-8',
    gradeNumber: 8,
    stage: 'middle',
    slugEs: '8-grado',
    slugEn: 'grade-8',
    labelShort: { 'es-AR': '1.° año de secundaria', 'en-US': 'Secondary Year 1' },
    title: {
      'es-AR': '1.° año de secundaria · Álgebra Visual y Ecuaciones Lineales en Equilibrio',
      'en-US': 'Secondary Year 1 · Visual Algebra & Linear Equations in Balance',
    },
    ageRange: { 'es-AR': '13–14 años', 'en-US': 'Ages 13–14' },
    summary: {
      'es-AR':
        'Modelado de incógnitas en balanza, ecuaciones de uno y dos pasos ax + b = c y verificación por sustitución.',
      'en-US':
        'Modeling unknowns on a balance scale, one- and two-step equations ax + b = c, and verification by substitution.',
    },
    planetSector: { 'es-AR': 'Equilibria Prime', 'en-US': 'Equilibria Prime' },
    guardianTitle: { 'es-AR': 'Arquitecta Balanza', 'en-US': 'Architect Balance' },
    primaryTopicId: 'linear-equations',
    lessons: [
      {
        id: 'g8-u1-linear-equations-balance',
        unitCode: 'G8 · U1',
        order: 1,
        title: {
          'es-AR': 'Ecuaciones Lineales en Equilibrio (ax + b = c)',
          'en-US': 'Linear Equations in Balance (ax + b = c)',
        },
        summary: {
          'es-AR': 'Despejá la incógnita realizando la misma operación en ambos platillos de la balanza.',
          'en-US': 'Isolate the unknown by performing identical inverse operations on both sides of the balance scale.',
        },
        estimatedMinutes: 10,
        accessLevel: 'premium',
        linkedTopicId: 'linear-equations',
        trainerTitle: {
          'es-AR': 'Entrenador: Balanza Gravitatoria en Equilibria Prime',
          'en-US': 'Trainer: Gravity Balance at Equilibria Prime',
        },
        planetSector: { 'es-AR': 'Equilibria Prime', 'en-US': 'Equilibria Prime' },
        hasInteractiveDiagram: true,
      },
      {
        id: 'g8-u2-equations-negative-solutions',
        unitCode: 'G8 · U2',
        order: 2,
        title: {
          'es-AR': 'Ecuaciones con Coeficientes y Soluciones Enteras',
          'en-US': 'Equations with Coefficients & Integer Solutions',
        },
        summary: {
          'es-AR': 'Combiná la balanza algebraica con números negativos para resolver ecuaciones de nivel avanzado.',
          'en-US': 'Combine the algebraic balance scale with negative numbers to solve advanced linear equations.',
        },
        estimatedMinutes: 10,
        accessLevel: 'premium',
        linkedTopicId: 'linear-equations',
        trainerTitle: {
          'es-AR': 'Entrenador: Núcleo Algebraico (Nivel 3)',
          'en-US': 'Trainer: Algebraic Core (Level 3)',
        },
        planetSector: { 'es-AR': 'Equilibria Prime', 'en-US': 'Equilibria Prime' },
        hasInteractiveDiagram: true,
      },
    ],
  },

  // =========================================================================
  // SECONDARY COURSES (CABA mapping is defined per grade)
  // =========================================================================
  {
    id: 'grade-9',
    gradeNumber: 9,
    stage: 'middle',
    slugEs: '9-grado',
    slugEn: 'grade-9',
    labelShort: { 'es-AR': '2.° año de secundaria', 'en-US': 'Secondary Year 2' },
    title: {
      'es-AR': '2.° año de secundaria · Funciones Lineales, Pendiente y Sistemas 2×2',
      'en-US': 'Secondary Year 2 · Linear Functions, Slope & 2×2 Systems',
    },
    ageRange: { 'es-AR': '14–15 años', 'en-US': 'Ages 14–15' },
    summary: {
      'es-AR':
        'Transición de ecuaciones lineales al plano cartesiano, razón de cambio (pendiente) e intersección de rectas.',
      'en-US':
        'Transitioning from linear equations to the coordinate plane, rate of change (slope), and line intersections.',
    },
    planetSector: { 'es-AR': 'Sector Cartesiano · Horizonte IX', 'en-US': 'Cartesian Sector · Horizon IX' },
    guardianTitle: { 'es-AR': 'Comodoro Vector', 'en-US': 'Commodore Vector' },
    primaryTopicId: 'linear-equations',
    lessons: [
      {
        id: 'g9-u1-linear-models',
        unitCode: 'G9 · U1',
        order: 1,
        title: {
          'es-AR': 'De la Ecuación Lineal a la Recta en el Plano',
          'en-US': 'From Linear Equations to Lines on the Plane',
        },
        summary: {
          'es-AR': 'Conectá el equilibrio algebraico ax + b = c con la pendiente y la ordenada al origen.',
          'en-US': 'Connect algebraic balance ax + b = c with slope and y-intercept.',
        },
        estimatedMinutes: 10,
        accessLevel: 'premium',
        linkedTopicId: 'linear-equations',
        trainerTitle: {
          'es-AR': 'Entrenador Base: Despeje Algebraico Lineal',
          'en-US': 'Base Trainer: Linear Algebraic Solving',
        },
        planetSector: { 'es-AR': 'Sector Cartesiano', 'en-US': 'Cartesian Sector' },
        hasInteractiveDiagram: true,
      },
      {
        id: 'g9-u2-systems-intersection',
        unitCode: 'G9 · U2',
        order: 2,
        title: {
          'es-AR': 'Sistemas de Dos Ecuaciones e Intersección de Trayectorias',
          'en-US': 'Two-Equation Systems & Trajectory Intersections',
        },
        summary: {
          'es-AR': 'Encontrá el punto exacto donde dos naves con velocidades distintas se cruzan.',
          'en-US': 'Find the exact coordinates where two spacecraft with different velocities intersect.',
        },
        estimatedMinutes: 11,
        accessLevel: 'premium',
        linkedTopicId: 'linear-equations',
        trainerTitle: {
          'es-AR': 'Entrenador: Encuentro Orbital',
          'en-US': 'Trainer: Orbital Rendezvous',
        },
        planetSector: { 'es-AR': 'Sector Cartesiano', 'en-US': 'Cartesian Sector' },
        hasInteractiveDiagram: true,
      },
    ],
  },
  {
    id: 'grade-10',
    gradeNumber: 10,
    stage: 'high',
    slugEs: '10-grado',
    slugEn: 'grade-10',
    labelShort: { 'es-AR': '3.° año de secundaria', 'en-US': 'Secondary Year 3' },
    title: {
      'es-AR': '3.° año de secundaria · Funciones Cuadráticas, Parábolas y Factorización Geométrica',
      'en-US': 'Secondary Year 3 · Quadratic Functions, Parabolas & Geometric Factoring',
    },
    ageRange: { 'es-AR': '15–16 años', 'en-US': 'Ages 15–16' },
    summary: {
      'es-AR':
        'Área de cuadrados compuestos, completar el cuadrado visualmente y trayectorias parabólicas.',
      'en-US':
        'Area of composite squares, completing the square visually, and parabolic trajectories.',
    },
    planetSector: { 'es-AR': 'Arco Parabólico X', 'en-US': 'Parabolic Arc X' },
    guardianTitle: { 'es-AR': 'Custodio Vértice', 'en-US': 'Vertex Custodian' },
    primaryTopicId: 'linear-equations',
    lessons: [
      {
        id: 'g10-u1-area-factoring',
        unitCode: 'G10 · U1',
        order: 1,
        title: {
          'es-AR': 'Álgebra Geométrica y Factorización por Áreas',
          'en-US': 'Geometric Algebra & Area Model Factoring',
        },
        summary: {
          'es-AR': 'Visualizá expresiones algebraicas como áreas rectangulares y ecuaciones en equilibrio.',
          'en-US': 'Visualize algebraic expressions as rectangular areas and balanced equations.',
        },
        estimatedMinutes: 11,
        accessLevel: 'premium',
        linkedTopicId: 'linear-equations',
        trainerTitle: {
          'es-AR': 'Entrenador: Equilibrio Algebraico Avanzado',
          'en-US': 'Trainer: Advanced Algebraic Balance',
        },
        planetSector: { 'es-AR': 'Arco Parabólico X', 'en-US': 'Parabolic Arc X' },
        hasInteractiveDiagram: true,
      },
    ],
  },
  {
    id: 'grade-11',
    gradeNumber: 11,
    stage: 'high',
    slugEs: '11-grado',
    slugEn: 'grade-11',
    labelShort: { 'es-AR': '4.° año de secundaria', 'en-US': 'Secondary Year 4' },
    title: {
      'es-AR': '4.° año de secundaria · Trigonometría Visual, Proporciones Angulares y Exponenciales',
      'en-US': 'Secondary Year 4 · Visual Trigonometry, Angular Ratios & Exponentials',
    },
    ageRange: { 'es-AR': '16–17 años', 'en-US': 'Ages 16–17' },
    summary: {
      'es-AR':
        'Semejanza de triángulos, razones trigonométricas en la circunferencia unitaria y crecimiento exponencial.',
      'en-US':
        'Triangle similarity, trigonometric ratios on the unit circle, and exponential growth.',
    },
    planetSector: { 'es-AR': 'Anillo Unitario XI', 'en-US': 'Unit Ring XI' },
    guardianTitle: { 'es-AR': 'Navegante Sinusoidal', 'en-US': 'Sinusoidal Navigator' },
    primaryTopicId: 'percentages-proportions',
    lessons: [
      {
        id: 'g11-u1-trig-ratios',
        unitCode: 'G11 · U1',
        order: 1,
        title: {
          'es-AR': 'Razones, Escalas y Proporciones Geométricas',
          'en-US': 'Ratios, Scaling & Geometric Proportions',
        },
        summary: {
          'es-AR': 'Extendé el concepto de razón proporcional al cálculo de distancias y escalas espaciales.',
          'en-US': 'Extend proportional reasoning to spatial distance and scaling calculations.',
        },
        estimatedMinutes: 11,
        accessLevel: 'premium',
        linkedTopicId: 'percentages-proportions',
        trainerTitle: {
          'es-AR': 'Entrenador: Telemetría Proporcional',
          'en-US': 'Trainer: Proportional Telemetry',
        },
        planetSector: { 'es-AR': 'Anillo Unitario XI', 'en-US': 'Unit Ring XI' },
        hasInteractiveDiagram: true,
      },
    ],
  },
  {
    id: 'grade-12',
    gradeNumber: 12,
    stage: 'high',
    slugEs: '12-grado',
    slugEn: 'grade-12',
    labelShort: { 'es-AR': '5.° año de secundaria', 'en-US': 'Secondary Year 5' },
    title: {
      'es-AR': '5.° año de secundaria · Cambio Instantáneo, Límites y Fundamentos de Cálculo',
      'en-US': 'Secondary Year 5 · Instantaneous Rate of Change, Limits & Calculus Foundations',
    },
    ageRange: { 'es-AR': '17–18 años', 'en-US': 'Ages 17–18' },
    summary: {
      'es-AR':
        'Velocidad media vs. instantánea, aproximación por pendientes y acumulación de área bajo la curva.',
      'en-US':
        'Average vs. instantaneous velocity, tangent slope approximation, and area accumulation under a curve.',
    },
    planetSector: { 'es-AR': 'Singularidad Omega XII', 'en-US': 'Omega Singularity XII' },
    guardianTitle: { 'es-AR': 'Arquitecto Infinitesimal', 'en-US': 'Infinitesimal Architect' },
    primaryTopicId: 'linear-equations',
    lessons: [
      {
        id: 'g12-u1-rate-of-change',
        unitCode: 'G12 · U1',
        order: 1,
        title: {
          'es-AR': 'Razón de Cambio y Modelado con Ecuaciones',
          'en-US': 'Rate of Change & Equation Modeling',
        },
        summary: {
          'es-AR': 'Analizá cómo varía una magnitud respecto de otra mediante ecuaciones y balanzas algebraicas.',
          'en-US': 'Analyze how one quantity changes with respect to another using equations and algebraic balance.',
        },
        estimatedMinutes: 12,
        accessLevel: 'premium',
        linkedTopicId: 'linear-equations',
        trainerTitle: {
          'es-AR': 'Entrenador: Simulador de Variación',
          'en-US': 'Trainer: Rate-of-Change Simulator',
        },
        planetSector: { 'es-AR': 'Singularidad Omega XII', 'en-US': 'Omega Singularity XII' },
        hasInteractiveDiagram: true,
      },
    ],
  },
];

export function getBlockById(stage: SchoolStageId): SchoolBlockMetadata {
  return SCHOOL_BLOCKS.find((b) => b.id === stage) || SCHOOL_BLOCKS[0];
}

export function getGradesByBlock(stage: SchoolStageId): GradeMetadata[] {
  return GRADES_CATALOG.filter((g) => g.stage === stage);
}

export function getGradeById(gradeId: GradeId): GradeMetadata {
  return GRADES_CATALOG.find((g) => g.id === gradeId) || GRADES_CATALOG[0];
}

export function resolveGradeFromSlug(rawSlug: string): GradeMetadata {
  const clean = (rawSlug || '').trim().toLowerCase();
  const direct = GRADES_CATALOG.find(
    (g) =>
      g.id === clean ||
      g.slugEs.toLowerCase() === clean ||
      g.slugEn.toLowerCase() === clean ||
      `${g.gradeNumber}` === clean ||
      `grado-${g.gradeNumber}` === clean
  );
  return direct || GRADES_CATALOG[0];
}
