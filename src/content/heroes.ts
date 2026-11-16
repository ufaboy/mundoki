// Story heroes a child can choose. The app swaps the picture and rewrites
// story text to match. Add a hero here (and its drawing in HeroCharacter.astro)
// to make it available everywhere.

export const HEROES = {
  tomi: { name: 'Tomi', gender: 'm' },
  lola: { name: 'Lola', gender: 'f' },
} as const;

export type HeroId = keyof typeof HEROES;

// Look of the drawing only; it never changes any text.
export const HERO_SKINS = ['light', 'brown', 'dark'] as const;
export type HeroSkin = (typeof HERO_SKINS)[number];

export interface HeroChoice {
  hero: HeroId;
  skin: HeroSkin;
}

export const DEFAULT_HERO: HeroChoice = { hero: 'tomi', skin: 'light' };
export const HERO_STORAGE_KEY = 'mundoki_hero';

export function isHeroId(value: unknown): value is HeroId {
  return typeof value === 'string' && value in HEROES;
}

export function isHeroSkin(value: unknown): value is HeroSkin {
  return typeof value === 'string' && (HERO_SKINS as readonly string[]).includes(value);
}

/**
 * Fill a story template for the chosen hero.
 *   {name}            → the hero's name
 *   {boy form|girl form} → the word that agrees with the hero
 * Example: "{name} está {listo|lista}."  /  "{name} opens {his|her} notebook."
 */
export function personalize(template: string, hero: HeroId): string {
  const { name, gender } = HEROES[hero];
  return template
    .replace(/\{name\}/g, name)
    .replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_match, masculine: string, feminine: string) =>
      gender === 'f' ? feminine : masculine
    );
}
