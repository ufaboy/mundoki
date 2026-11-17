import type { SkillChallenge } from '../../../math/arcade/skillGames';
import {
  clamp,
  drawHero,
  drawRoundedRect,
  drawStarPath,
  easeInOutQuad,
  lerp,
  spawnBurst,
  type HeroMood,
  type Particle,
} from '../canvasUtils';
import type { SkillScene, SkillSceneContext } from '../sceneTypes';

type Phase = 'idle' | 'charging' | 'crossing' | 'won' | 'fizzle';

export class ChainGearBridgeScene implements SkillScene {
  private ctxInfo: SkillSceneContext;
  private challenge!: SkillChallenge;
  private phase: Phase = 'idle';
  private time = 0;
  private phaseTime = 0;
  private submitted = 0;

  private chargeStage = 0; // 0..3
  private bridgeAlpha = 0;
  private heroX = 112;
  private gearAngle = 0;

  private particles: Particle[] = [];
  private onComplete?: (won: boolean) => void;
  private statusTag = '';

  constructor(ctxInfo: SkillSceneContext) {
    this.ctxInfo = ctxInfo;
  }

  reset(challenge: SkillChallenge): void {
    this.challenge = challenge;
    this.phase = 'idle';
    this.phaseTime = 0;
    this.submitted = 0;
    this.chargeStage = 0;
    this.bridgeAlpha = 0;
    this.heroX = 112;
    this.particles = [];
    this.statusTag = '';
  }

  playAttempt(
    submitted: number,
    challenge: SkillChallenge,
    onComplete: (won: boolean) => void
  ): void {
    this.challenge = challenge;
    this.submitted = submitted;
    this.onComplete = onComplete;
    this.chargeStage = 0;
    this.bridgeAlpha = 0;
    this.statusTag = '';
    this.phase = 'charging';
    this.phaseTime = 0;
  }

  update(dt: number, reducedMotion: boolean): void {
    this.time += dt;
    this.phaseTime += dt;

    const spinSpeed =
      this.phase === 'charging' || this.phase === 'crossing' || this.phase === 'won'
        ? 2.8
        : 0.35;
    this.gearAngle += dt * spinSpeed;

    const chargeDur = reducedMotion ? 0.25 : 1.05;
    const crossDur = reducedMotion ? 0.2 : 1.25;

    if (this.phase === 'charging') {
      const p = clamp(this.phaseTime / chargeDur, 0, 1);
      this.chargeStage = p * 3;
      if (p >= 1) {
        if (this.submitted === this.challenge.answer) {
          this.bridgeAlpha = 1;
          this.phase = 'crossing';
          this.phaseTime = 0;
          this.statusTag =
            this.ctxInfo.locale === 'es-AR' ? '¡Puente activado!' : 'Bridge powered!';
          spawnBurst(this.particles, 420, 175, 22, ['#A855F7', '#38BDF8', '#FFC933'], {
            shape: 'star',
            speedMin: 70,
            speedMax: 190,
          });
        } else {
          this.phase = 'fizzle';
          this.phaseTime = 0;
          this.statusTag =
            this.submitted < this.challenge.answer
              ? this.ctxInfo.locale === 'es-AR'
                ? '¡Falta energía!'
                : 'Not enough power!'
              : this.ctxInfo.locale === 'es-AR'
                ? '¡Sobrecarga!'
                : 'Overload!';
          spawnBurst(this.particles, 535, 175, 14, ['#C2410C', '#F97316', '#FFC933'], {
            speedMin: 50,
            speedMax: 150,
            life: 0.65,
          });
        }
      }
    } else if (this.phase === 'crossing') {
      const p = clamp(this.phaseTime / crossDur, 0, 1);
      this.heroX = lerp(112, 725, easeInOutQuad(p));
      if (p >= 1) {
        this.phase = 'won';
        this.phaseTime = 0;
        spawnBurst(this.particles, 725, 285, 26, ['#FFC933', '#22C55E', '#A855F7'], {
          shape: 'star',
          speedMin: 80,
          speedMax: 220,
          life: 1.0,
        });
        this.onComplete?.(true);
      }
    } else if (this.phase === 'fizzle') {
      if (this.phaseTime > 0.95) {
        this.phase = 'idle';
        this.chargeStage = 0;
        this.statusTag = '';
        this.onComplete?.(false);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life += dt;
      if (pt.life >= pt.maxLife) {
        this.particles.splice(i, 1);
      } else {
        pt.vy += pt.gravity * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // Deep twilight workshop sky
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#1E1B4B');
    bg.addColorStop(0.65, '#3B2F63');
    bg.addColorStop(1, '#1E293B');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 18; i++) {
      const sx = ((i * 173) % (w - 40)) + 20;
      const sy = ((i * 79) % 140) + 20;
      ctx.beginPath();
      ctx.arc(sx, sy, (i % 2) + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3 Interlocking Gears above the chasm
    const gears = [
      { x: 305, y: 175, r: 44, teeth: 10, dir: 1, color: '#38BDF8' },
      { x: 420, y: 155, r: 52, teeth: 12, dir: -1, color: '#FFC933' },
      { x: 535, y: 175, r: 44, teeth: 10, dir: 1, color: '#A855F7' },
    ];

    gears.forEach((g, idx) => {
      const lit = this.chargeStage >= idx + 0.6;
      this.drawGear(
        ctx,
        g.x,
        g.y,
        g.r,
        g.teeth,
        this.gearAngle * g.dir,
        lit ? g.color : '#64748B',
        lit
      );
    });

    // Left & Right Stone Platforms
    const deckY = 330;
    ctx.fillStyle = '#475569';
    drawRoundedRect(ctx, 20, deckY, 190, h - deckY, 10);
    ctx.fill();
    drawRoundedRect(ctx, 630, deckY, 190, h - deckY, 10);
    ctx.fill();

    // Portal Arch on Right Platform
    ctx.strokeStyle = this.phase === 'won' ? '#22C55E' : '#A855F7';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(730, deckY, 44, Math.PI, 0);
    ctx.stroke();

    // Energy Bridge across the chasm
    if (this.bridgeAlpha > 0) {
      ctx.save();
      ctx.fillStyle = '#38BDF8';
      drawRoundedRect(ctx, 205, deckY, 430, 14, 7);
      ctx.fill();
      ctx.fillStyle = '#E0F2FE';
      drawRoundedRect(ctx, 210, deckY + 4, 420, 6, 3);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(210, deckY + 7);
      ctx.lineTo(630, deckY + 7);
      ctx.stroke();
      ctx.restore();
    }

    // Hero
    const mood: HeroMood =
      this.phase === 'crossing'
        ? 'walking'
        : this.phase === 'won'
          ? 'happy'
          : this.phase === 'fizzle'
            ? 'oops'
            : 'idle';
    drawHero(ctx, this.ctxInfo.hero, {
      x: this.heroX,
      y: deckY,
      scale: 0.9,
      mood,
      time: this.time,
      facing: 1,
    });

    // Particles
    for (const pt of this.particles) {
      const progress = pt.life / pt.maxLife;
      ctx.save();
      ctx.globalAlpha = clamp(1 - progress, 0, 1);
      if (pt.shape === 'star') {
        ctx.fillStyle = pt.color;
        drawStarPath(ctx, pt.x, pt.y, 5, pt.size, pt.size * 0.45);
        ctx.fill();
      } else {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Status tag
    if (this.statusTag) {
      ctx.save();
      ctx.font = '800 18px Nunito, sans-serif';
      const tw = ctx.measureText(this.statusTag).width + 32;
      ctx.fillStyle =
        this.phase === 'crossing' || this.phase === 'won' ? '#15803D' : '#C2410C';
      drawRoundedRect(ctx, w / 2 - tw / 2, 18, tw, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.statusTag, w / 2, 36);
      ctx.restore();
    }
  }

  private drawGear(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    teeth: number,
    angle: number,
    color: string,
    lit: boolean
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.fillStyle = color;
    for (let i = 0; i < teeth; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / teeth);
      drawRoundedRect(ctx, -6, -r - 9, 12, 14, 3);
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = lit ? '#FFFFFF' : '#334155';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.36, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
