// Grade 4 challenge generators: GRADE_FOUR_GENERATORS[lessonId][i] makes fresh
// versions of checks[i] (same skill and story object, new numbers; in "why"
// questions the right answer changes too). The mission page renders a few
// versions on the server and shows the next one after each wrong answer, so
// pressing every button in turn never completes a mission. The same seed always
// gives the same version.
import { rng, type Generator, type GradeFourVariant } from './kit';
import { hangar } from './hangar';
import { wings } from './wings';
import { iguazu } from './iguazu';
import { south } from './south';
import { festival } from './festival';

export type { GradeFourVariant, IslandModelData } from './kit';

export const GRADE_FOUR_GENERATORS: Record<string, [Generator, Generator]> = { ...hangar, ...wings, ...iguazu, ...south, ...festival };

export function gradeFourVariant(lessonId: string, checkIndex: number, seed: number): GradeFourVariant {
  const generator = GRADE_FOUR_GENERATORS[lessonId]?.[checkIndex];
  if (!generator) throw new Error(`Missing Grade 4 generator: ${lessonId} #${checkIndex}`);
  return generator(rng(seed));
}

/**
 * `count` versions with prompts that differ from each other and from `avoid`
 * (the authored challenge). Seeds come from `seed`, so a page render is repeatable.
 */
export function gradeFourVariants(lessonId: string, checkIndex: number, avoid: string, count: number, seed: number): GradeFourVariant[] {
  const seen = new Set([avoid]);
  const variants: GradeFourVariant[] = [];
  for (let attempt = 0; variants.length < count && attempt < count * 20; attempt++) {
    let variant: GradeFourVariant;
    try {
      variant = gradeFourVariant(lessonId, checkIndex, (seed + attempt * 7919) >>> 0);
    } catch {
      continue; // A generator that cannot build this seed: try the next one.
    }
    if (seen.has(variant.prompt['en-US'])) continue;
    seen.add(variant.prompt['en-US']);
    variants.push(variant);
  }
  return variants;
}
