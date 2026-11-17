import type { Locale } from '../core/types';

export type SkillGameId =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'sea-cannon'
  | 'chain-ops';
export type SkillDifficulty = 1 | 2 | 3;

export interface SkillGameMeta {
  id: SkillGameId;
  slugEs: string;
  slugEn: string;
  accent: 'sky' | 'coral' | 'sun' | 'leaf' | 'grape';
  inputMode?: 'single' | 'xy';
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  actionLabel: Record<Locale, string>;
  howToPlay: Record<Locale, string>;
}

export interface SkillChallenge {
  id: string;
  skill: SkillGameId;
  difficulty: SkillDifficulty;
  seed: number;
  a: number;
  b: number;
  answer: number;
  operatorSymbol: '+' | '−' | '×' | '÷' | '⚙';
  equationText: string;
  prompt: Record<Locale, string>;
  // Optional 2-axis coordinate fields for sea-cannon
  gridSize?: number;
  targetX?: number;
  targetY?: number;
  xExpr?: string;
  yExpr?: string;
}

export interface SkillXYEvaluation {
  valid: boolean;
  isCorrect: boolean;
  xValue: number | null;
  yValue: number | null;
  xCorrect: boolean;
  yCorrect: boolean;
}

export interface SkillEvaluation {
  valid: boolean;
  isCorrect: boolean;
  numericValue: number | null;
  delta: number;
}

export const SKILL_GAMES_META: SkillGameMeta[] = [
  {
    id: 'addition',
    slugEs: 'suma',
    slugEn: 'addition',
    accent: 'sky',
    title: {
      'es-AR': 'Esclusas de Agua · Suma',
      'en-US': 'Water Locks · Addition',
    },
    subtitle: {
      'es-AR': 'Calculá el total de agua para nivelar los cilindros y cruzar el puente.',
      'en-US': 'Calculate the total water to level the cylinders and cross the bridge.',
    },
    actionLabel: {
      'es-AR': 'Llenar cilindro',
      'en-US': 'Pour water',
    },
    howToPlay: {
      'es-AR': 'Sumá ambos tanques para igualar la altura del agua.',
      'en-US': 'Add both tanks to match the exact water height.',
    },
  },
  {
    id: 'subtraction',
    slugEs: 'resta',
    slugEn: 'subtraction',
    accent: 'coral',
    title: {
      'es-AR': 'Globo Aerostático · Resta',
      'en-US': 'Sky Balloon · Subtraction',
    },
    subtitle: {
      'es-AR': 'Soltá el lastre justo para que el globo aterrice en la isla flotante.',
      'en-US': 'Drop the exact ballast so the balloon lands on the sky island.',
    },
    actionLabel: {
      'es-AR': 'Soltar lastre',
      'en-US': 'Drop ballast',
    },
    howToPlay: {
      'es-AR': 'Restá las bolsas que caen para saber cuánto peso queda.',
      'en-US': 'Subtract the dropped bags to find the remaining weight.',
    },
  },
  {
    id: 'multiplication',
    slugEs: 'multiplicacion',
    slugEn: 'multiplication',
    accent: 'sun',
    title: {
      'es-AR': 'Cañón de Ángulos · Multiplicación',
      'en-US': 'Angle Cannon · Multiplication',
    },
    subtitle: {
      'es-AR': 'Calculá el producto exacto para apuntar el cañón y dar en el blanco.',
      'en-US': 'Calculate the exact product to aim the cannon and hit the target.',
    },
    actionLabel: {
      'es-AR': '¡Disparar!',
      'en-US': 'Fire cannon!',
    },
    howToPlay: {
      'es-AR': 'El valor correcto ajusta el ángulo perfecto del disparo.',
      'en-US': 'The right product sets the exact launch angle.',
    },
  },
  {
    id: 'division',
    slugEs: 'division',
    slugEn: 'division',
    accent: 'leaf',
    title: {
      'es-AR': 'Tren de Gemas · División',
      'en-US': 'Gem Express · Division',
    },
    subtitle: {
      'es-AR': 'Repartí las gemas en partes iguales entre los vagones para activar la vía.',
      'en-US': 'Split the gems equally across the minecarts to unlock the track.',
    },
    actionLabel: {
      'es-AR': 'Repartir gemas',
      'en-US': 'Split gems',
    },
    howToPlay: {
      'es-AR': 'Dividí el total de gemas por la cantidad de vagones.',
      'en-US': 'Divide the total gems by the number of minecarts.',
    },
  },
  {
    id: 'sea-cannon',
    slugEs: 'canon-marino',
    slugEn: 'sea-cannon',
    accent: 'sky',
    inputMode: 'xy',
    title: {
      'es-AR': 'Batalla Naval Isométrica · Coordenadas (X, Y)',
      'en-US': 'Isometric Sea Cannon · Coordinates (X, Y)',
    },
    subtitle: {
      'es-AR': 'Calculá las 2 coordenadas con operaciones combinadas para acertar al barco.',
      'en-US': 'Calculate both (X, Y) coordinates using combined operations to hit the ship.',
    },
    actionLabel: {
      'es-AR': '¡Disparar al mar!',
      'en-US': 'Fire at sea!',
    },
    howToPlay: {
      'es-AR': 'Resolvé X e Y respetando el orden de las operaciones.',
      'en-US': 'Solve both X and Y following the order of operations.',
    },
  },
  {
    id: 'chain-ops',
    slugEs: 'operaciones-combinadas',
    slugEn: 'chain-operations',
    accent: 'grape',
    inputMode: 'single',
    title: {
      'es-AR': 'Puente de Engranajes · Operaciones Combinadas',
      'en-US': 'Gear Bridge · Combined Operations',
    },
    subtitle: {
      'es-AR': 'Resolvé 2 o 3 operaciones en el orden correcto para activar el puente.',
      'en-US': 'Solve 2 or 3 operations in the right order to power up the bridge.',
    },
    actionLabel: {
      'es-AR': 'Activar puente',
      'en-US': 'Power bridge',
    },
    howToPlay: {
      'es-AR': 'Primero paréntesis, luego × y ÷, y al final + y −.',
      'en-US': 'Parentheses first, then × and ÷, then + and −.',
    },
  },
];

export function getSkillGameMeta(skill: SkillGameId): SkillGameMeta {
  return SKILL_GAMES_META.find((item) => item.id === skill) || SKILL_GAMES_META[0];
}

export function resolveSkillFromSlug(slug: string): SkillGameId | null {
  const clean = (slug || '').trim().toLowerCase();
  const match = SKILL_GAMES_META.find(
    (item) => item.id === clean || item.slugEs === clean || item.slugEn === clean
  );
  return match ? match.id : null;
}

function buildAxisExpression(
  rng: () => number,
  target: number,
  difficulty: SkillDifficulty
): string {
  if (difficulty === 1) {
    // 2 operations: m × k ± offset
    const m = randInt(rng, 2, 4);
    const k = randInt(rng, 2, 4);
    const prod = m * k;
    if (prod > target) {
      return `${m} × ${k} − ${prod - target}`;
    }
    return `${m} × ${k} + ${target - prod}`;
  }

  if (difficulty === 2) {
    // 2–3 operations with division or multiplication
    if (rng() < 0.5) {
      const d = randInt(rng, 2, 5);
      const q = randInt(rng, 2, 6);
      const dividend = d * q;
      if (q > target) {
        return `${dividend} ÷ ${d} − ${q - target}`;
      }
      return `${dividend} ÷ ${d} + ${target - q}`;
    }
    const a = randInt(rng, 2, 5);
    const b = randInt(rng, 2, 5);
    const c = randInt(rng, 1, 4);
    const val = a * b + c;
    if (val >= target) {
      return `${a} × ${b} + ${c} − ${val - target}`;
    }
    return `${a} × ${b} + ${c} + ${target - val}`;
  }

  // difficulty === 3: 3 operations with parentheses
  const p1 = randInt(rng, 2, 5);
  const p2 = randInt(rng, 1, 4);
  const mul = randInt(rng, 2, 4);
  const val = (p1 + p2) * mul;
  if (val >= target) {
    return `(${p1} + ${p2}) × ${mul} − ${val - target}`;
  }
  return `(${p1} + ${p2}) × ${mul} + ${target - val}`;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function generateSkillChallenge(
  skill: SkillGameId,
  difficulty: SkillDifficulty,
  seed: number
): SkillChallenge {
  const rng = mulberry32(seed + difficulty * 997 + skill.length * 131);

  if (skill === 'addition') {
    const a =
      difficulty === 1
        ? randInt(rng, 2, 9)
        : difficulty === 2
          ? randInt(rng, 12, 48)
          : randInt(rng, 25, 89);
    const b =
      difficulty === 1
        ? randInt(rng, 2, 9)
        : difficulty === 2
          ? randInt(rng, 6, 35)
          : randInt(rng, 16, 78);
    const answer = a + b;
    return {
      id: `${skill}-${difficulty}-${seed}`,
      skill,
      difficulty,
      seed,
      a,
      b,
      answer,
      operatorSymbol: '+',
      equationText: `${a} + ${b} = ?`,
      prompt: {
        'es-AR': `Necesitamos ${a} L + ${b} L para nivelar el puente. ¿Cuántos litros hay que verter?`,
        'en-US': `We need ${a} L + ${b} L to level the bridge. How many liters should we pour?`,
      },
    };
  }

  if (skill === 'subtraction') {
    const b =
      difficulty === 1
        ? randInt(rng, 1, 8)
        : difficulty === 2
          ? randInt(rng, 6, 28)
          : randInt(rng, 15, 55);
    const answer =
      difficulty === 1
        ? randInt(rng, 2, 10)
        : difficulty === 2
          ? randInt(rng, 8, 42)
          : randInt(rng, 18, 75);
    const a = answer + b;
    return {
      id: `${skill}-${difficulty}-${seed}`,
      skill,
      difficulty,
      seed,
      a,
      b,
      answer,
      operatorSymbol: '−',
      equationText: `${a} − ${b} = ?`,
      prompt: {
        'es-AR': `El globo lleva ${a} kg y soltamos ${b} kg de lastre. ¿Con cuántos kg queda?`,
        'en-US': `The balloon carries ${a} kg and drops ${b} kg of ballast. How many kg remain?`,
      },
    };
  }

  if (skill === 'multiplication') {
    const a =
      difficulty === 1
        ? randInt(rng, 2, 5)
        : difficulty === 2
          ? randInt(rng, 3, 9)
          : randInt(rng, 6, 12);
    const b =
      difficulty === 1
        ? randInt(rng, 2, 6)
        : difficulty === 2
          ? randInt(rng, 4, 9)
          : randInt(rng, 6, 12);
    const answer = a * b;
    return {
      id: `${skill}-${difficulty}-${seed}`,
      skill,
      difficulty,
      seed,
      a,
      b,
      answer,
      operatorSymbol: '×',
      equationText: `${a} × ${b} = ?`,
      prompt: {
        'es-AR': `Calculá ${a} × ${b} para calibrar el ángulo perfecto del cañón.`,
        'en-US': `Calculate ${a} × ${b} to calibrate the cannon's exact launch angle.`,
      },
    };
  }

  if (skill === 'sea-cannon') {
    const gridSize = difficulty === 1 ? 8 : difficulty === 2 ? 10 : 12;
    const targetX = randInt(rng, 2, gridSize - 1);
    const targetY = randInt(rng, 2, gridSize - 1);
    const xExpr = buildAxisExpression(rng, targetX, difficulty);
    const yExpr = buildAxisExpression(rng, targetY, difficulty);
    return {
      id: `${skill}-${difficulty}-${seed}`,
      skill,
      difficulty,
      seed,
      a: targetX,
      b: targetY,
      answer: targetX,
      operatorSymbol: '⚙',
      equationText: `X = ${xExpr}  |  Y = ${yExpr}`,
      gridSize,
      targetX,
      targetY,
      xExpr,
      yExpr,
      prompt: {
        'es-AR': `Calculá X e Y para apuntar al barco en la grilla ${gridSize}×${gridSize}.`,
        'en-US': `Calculate X and Y to target the ship on the ${gridSize}×${gridSize} sea grid.`,
      },
    };
  }

  if (skill === 'chain-ops') {
    let expr = '';
    let answer = 0;
    if (difficulty === 1) {
      const a = randInt(rng, 2, 7);
      const b = randInt(rng, 2, 7);
      const c = randInt(rng, 2, 12);
      if (rng() < 0.5) {
        answer = a * b + c;
        expr = `${a} × ${b} + ${c}`;
      } else {
        answer = a * b - Math.min(c, a * b - 1);
        expr = `${a} × ${b} − ${Math.min(c, a * b - 1)}`;
      }
    } else if (difficulty === 2) {
      const a = randInt(rng, 3, 15);
      const b = randInt(rng, 2, 8);
      const c = randInt(rng, 2, 7);
      const d = randInt(rng, 1, 9);
      answer = a + b * c - d;
      expr = `${a} + ${b} × ${c} − ${d}`;
    } else {
      const variant = rng() < 0.5;
      if (variant) {
        const a = randInt(rng, 3, 9);
        const b = randInt(rng, 2, 8);
        const c = randInt(rng, 2, 6);
        const d = randInt(rng, 2, 12);
        answer = (a + b) * c - d;
        expr = `(${a} + ${b}) × ${c} − ${d}`;
      } else {
        const div = randInt(rng, 2, 5);
        const quot = randInt(rng, 3, 9);
        const total = div * quot;
        const p1 = randInt(rng, 1, div - 1);
        const p2 = div - p1;
        const extra = randInt(rng, 2, 12);
        answer = quot + extra;
        expr = `${total} ÷ (${p1} + ${p2}) + ${extra}`;
      }
    }

    return {
      id: `${skill}-${difficulty}-${seed}`,
      skill,
      difficulty,
      seed,
      a: 0,
      b: 0,
      answer,
      operatorSymbol: '⚙',
      equationText: `${expr} = ?`,
      prompt: {
        'es-AR': `Resolvé la cadena de operaciones respetando el orden correcto.`,
        'en-US': `Solve the chain of operations in the right order.`,
      },
    };
  }

  // division (always exact integer quotient)
  const b =
    difficulty === 1
      ? randInt(rng, 2, 4)
      : difficulty === 2
        ? randInt(rng, 3, 6)
        : randInt(rng, 4, 9);
  const answer =
    difficulty === 1
      ? randInt(rng, 2, 6)
      : difficulty === 2
        ? randInt(rng, 3, 9)
        : randInt(rng, 5, 12);
  const a = b * answer;
  return {
    id: `${skill}-${difficulty}-${seed}`,
    skill,
    difficulty,
    seed,
    a,
    b,
    answer,
    operatorSymbol: '÷',
    equationText: `${a} ÷ ${b} = ?`,
    prompt: {
      'es-AR': `Hay ${a} gemas para repartir por igual en ${b} vagones. ¿Cuántas lleva cada uno?`,
      'en-US': `Split ${a} gems equally into ${b} minecarts. How many gems go in each cart?`,
    },
  };
}

export function evaluateSkillAnswer(
  challenge: Pick<SkillChallenge, 'answer'>,
  rawInput: string
): SkillEvaluation {
  const trimmed = (rawInput || '').trim();
  if (!/^-?\d+$/.test(trimmed)) {
    return {
      valid: false,
      isCorrect: false,
      numericValue: null,
      delta: 0,
    };
  }
  const numericValue = Number.parseInt(trimmed, 10);
  if (!Number.isSafeInteger(numericValue)) {
    return {
      valid: false,
      isCorrect: false,
      numericValue: null,
      delta: 0,
    };
  }
  const delta = numericValue - challenge.answer;
  return {
    valid: true,
    isCorrect: delta === 0,
    numericValue,
    delta,
  };
}

export function evaluateSkillXYAnswer(
  challenge: Pick<SkillChallenge, 'targetX' | 'targetY'>,
  rawX: string,
  rawY: string
): SkillXYEvaluation {
  const tx = challenge.targetX ?? 0;
  const ty = challenge.targetY ?? 0;
  const xStr = (rawX || '').trim();
  const yStr = (rawY || '').trim();
  if (!/^-?\d+$/.test(xStr) || !/^-?\d+$/.test(yStr)) {
    return {
      valid: false,
      isCorrect: false,
      xValue: null,
      yValue: null,
      xCorrect: false,
      yCorrect: false,
    };
  }
  const xValue = Number.parseInt(xStr, 10);
  const yValue = Number.parseInt(yStr, 10);
  if (!Number.isSafeInteger(xValue) || !Number.isSafeInteger(yValue)) {
    return {
      valid: false,
      isCorrect: false,
      xValue: null,
      yValue: null,
      xCorrect: false,
      yCorrect: false,
    };
  }
  const xCorrect = xValue === tx;
  const yCorrect = yValue === ty;
  return {
    valid: true,
    isCorrect: xCorrect && yCorrect,
    xValue,
    yValue,
    xCorrect,
    yCorrect,
  };
}
