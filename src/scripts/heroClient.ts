// Hero picker. The chosen hero is applied to <html> before first paint by the
// inline script in DesignHead.astro; pictures (HeroCharacter) and texts
// (HeroText) then switch by CSS alone. This module only handles the picker.
//
// Markup:
//   <button data-hero-pick="lola">        choose a hero
//   <button data-skin-pick="brown">       choose a skin tone

import {
  DEFAULT_HERO,
  HERO_STORAGE_KEY,
  isHeroId,
  isHeroSkin,
  type HeroChoice,
} from '../content/heroes';

export function readHeroChoice(): HeroChoice {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(HERO_STORAGE_KEY) ?? 'null');
    if (parsed && typeof parsed === 'object') {
      const { hero, skin } = parsed as Record<string, unknown>;
      return {
        hero: isHeroId(hero) ? hero : DEFAULT_HERO.hero,
        skin: isHeroSkin(skin) ? skin : DEFAULT_HERO.skin,
      };
    }
  } catch {
    // Unreadable or blocked storage: fall back to the default hero.
  }
  return { ...DEFAULT_HERO };
}

function saveHeroChoice(choice: HeroChoice): void {
  try {
    window.localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // The choice still applies for this visit.
  }
}

export function applyHeroChoice(choice: HeroChoice, root: ParentNode = document): void {
  const html = document.documentElement;
  html.dataset.hero = choice.hero;
  html.dataset.heroSkin = choice.skin;

  root.querySelectorAll<HTMLElement>('[data-hero-pick]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.heroPick === choice.hero));
  });
  root.querySelectorAll<HTMLElement>('[data-skin-pick]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.skinPick === choice.skin));
  });
}

export function initHero(root: ParentNode = document): void {
  let choice = readHeroChoice();
  applyHeroChoice(choice, root);

  const update = (next: HeroChoice): void => {
    choice = next;
    applyHeroChoice(choice, root);
    saveHeroChoice(choice);
  };

  root.querySelectorAll<HTMLElement>('[data-hero-pick]').forEach((button) => {
    button.addEventListener('click', () => {
      const hero = button.dataset.heroPick;
      if (isHeroId(hero)) update({ ...choice, hero });
    });
  });
  root.querySelectorAll<HTMLElement>('[data-skin-pick]').forEach((button) => {
    button.addEventListener('click', () => {
      const skin = button.dataset.skinPick;
      if (isHeroSkin(skin)) update({ ...choice, skin });
    });
  });
}
