// Grade 2 challenge generators: GRADE_TWO_GENERATORS[lessonId][i] makes fresh
// versions of checks[i] (same skill and story object, new numbers; in "why"
// questions the right answer changes too). The mission page renders a few
// versions on the server and shows the next one after each wrong answer, so
// remembering which button was wrong does not help. The same seed always gives
// the same version, so a server can re-check an answer from (lesson, check, seed).
import { rng, type Generator, type GradeTwoVariant } from './kit';
import { market } from './market';
import { river } from './river';
import { lake } from './lake';
import { mine } from './mine';
import { forest } from './forest';
import { tower } from './tower';

export type { GradeTwoVariant } from './kit';

export const GRADE_TWO_GENERATORS: Record<string, [Generator, Generator]> = { ...market, ...river, ...lake, ...mine, ...forest, ...tower };

export function gradeTwoVariant(lessonId: string, checkIndex: number, seed: number): GradeTwoVariant {
  const generator = GRADE_TWO_GENERATORS[lessonId]?.[checkIndex];
  if (!generator) throw new Error(`Missing Grade 2 generator: ${lessonId} #${checkIndex}`);
  return generator(rng(seed));
}

/**
 * `count` versions with prompts that differ from each other and from `avoid`
 * (the authored challenge). Seeds come from `seed` so a page render is repeatable.
 */
export function gradeTwoVariants(lessonId: string, checkIndex: number, avoid: string, count: number, seed: number): GradeTwoVariant[] {
  const seen = new Set([avoid]);
  const variants: GradeTwoVariant[] = [];
  for (let attempt = 0; variants.length < count && attempt < count * 20; attempt++) {
    const variant = gradeTwoVariant(lessonId, checkIndex, (seed + attempt * 7919) >>> 0);
    if (seen.has(variant.prompt['en-US'])) continue;
    seen.add(variant.prompt['en-US']);
    variants.push(variant);
  }
  return variants;
}
