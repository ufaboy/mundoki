import type { Locale } from '../core/types';

export type SkillGameId = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type SkillDifficulty = 1 | 2 | 3;

export interface SkillGameMeta {
  id: SkillGameId;
  slugEs: string;
  slugEn: string;
  accent: 'sky' | 'coral' | 'sun' | 'leaf';
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
  operatorSymbol: '+' | '−' | '×' | '÷';
  equationText: string;
  prompt: Record<Locale, string>;
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
