// Grade 3 challenge generators: GRADE_THREE_GENERATORS[lessonId][i] makes fresh
// versions of checks[i] (same skill and building-site object, new numbers; in
// "why" questions the right answer changes too). The mission page renders a few
// versions on the server and shows the next one after each wrong answer, so
// pressing every button in turn never adds a house piece. The same seed always
// gives the same version, so the server re-checks an answer from (lesson, check, seed).
import { rng, type Generator, type GradeThreeVariant } from './kit';
import { lot } from './lot';
import { foundation } from './foundation';
import { walls } from './walls';
import { roof } from './roof';
import { services } from './services';
import { plan } from './plan';
import { moving } from './moving';
import { party } from './party';

export type { GradeThreeVariant } from './kit';

export const GRADE_THREE_GENERATORS: Record<string, [Generator, Generator]> = { ...lot, ...foundation, ...walls, ...roof, ...services, ...plan, ...moving, ...party };

/** Largest seed a page uses; the server refuses others. */
export const MAX_VARIANT_SEED = 2 ** 31;

export function gradeThreeVariant(lessonId: string, checkIndex: number, seed: number): GradeThreeVariant {
  const generator = GRADE_THREE_GENERATORS[lessonId]?.[checkIndex];
  if (!generator) throw new Error(`Missing Grade 3 generator: ${lessonId} #${checkIndex}`);
  return generator(rng(seed));
}

/**
 * `count` versions with prompts that differ from each other and from `avoid`
 * (the authored challenge), each with the seed that made it. Seeds come from
 * `seed`, so a page render is repeatable.
 */
export function gradeThreeVariants(lessonId: string, checkIndex: number, avoid: string, count: number, seed: number): (GradeThreeVariant & { seed: number })[] {
  const seen = new Set([avoid]);
  const variants: (GradeThreeVariant & { seed: number })[] = [];
  for (let attempt = 0; variants.length < count && attempt < count * 20; attempt++) {
    const variantSeed = 1 + ((seed + attempt * 7919) % (MAX_VARIANT_SEED - 1));
    let variant: GradeThreeVariant;
    try {
      variant = gradeThreeVariant(lessonId, checkIndex, variantSeed);
    } catch {
      continue; // A generator that cannot build this seed: try the next one.
    }
    if (seen.has(variant.prompt['en-US'])) continue;
    seen.add(variant.prompt['en-US']);
    variants.push({ ...variant, seed: variantSeed });
  }
  return variants;
}
