import type { SkillChallenge } from '../../math/arcade/skillGames';
import type { HeroChoice } from '../../content/heroes';
import type { Locale } from '../../math/core/types';

export interface SkillSceneContext {
  locale: Locale;
  hero: HeroChoice;
}

export interface SkillScene {
  reset(challenge: SkillChallenge): void;
  playAttempt(
    submitted: number,
    challenge: SkillChallenge,
    onComplete: (won: boolean) => void
  ): void;
  update(dt: number, reducedMotion: boolean): void;
  render(ctx: CanvasRenderingContext2D, width: number, height: number): void;
}
