import type { SkillChallenge } from '../../../math/arcade/skillGames';
import {
  clamp,
  drawCloud,
  drawHero,
  drawRoundedRect,
  drawStarPath,
  easeInOutQuad,
  easeOutCubic,
  lerp,
  spawnBurst,
  type HeroMood,
  type Particle,
} from '../canvasUtils';
import type { SkillScene, SkillSceneContext } from '../sceneTypes';

type Phase = 'idle' | 'aiming' | 'flying' | 'won' | 'missed';

export class SeaCannonIsoScene implements SkillScene {
  private ctxInfo: SkillSceneContext;
  private challenge!: SkillChallenge;
  private phase: Phase = 'idle';
  private time = 0;
  private phaseTime = 0;

  private gridSize = 8;
  private targetX = 4;
  private targetY = 4;
  private subX = 0;
  private subY = 0;

  private cannonAngle = -Math.PI * 0.5;
  private startCannonAngle = -Math.PI * 0.5;
  private targetCannonAngle = -Math.PI * 0.5;

  private shotProgress = 0;
  private shotStart = { x: 120, y: 310 };
  private shotEnd = { x: 420, y: 200 };
  private shipHit = false;
  private ripple: { x: number; y: number; r: number; alpha: number } | null = null;

  private particles: Particle[] = [];
  private onComplete?: (won: boolean) => void;
  private statusTag = '';

  constructor(ctxInfo: SkillSceneContext) {
    this.ctxInfo = ctxInfo;
  }

  private isoToScreen(gx: number, gy: number): { x: number; y: number } {
    const tileW = this.gridSize <= 8 ? 50 : this.gridSize <= 10 ? 42 : 35;
    const tileH = tileW * 0.52;
    const originX = 445;
    const originY = 92;
    return {
      x: originX + (gx - gy) * (tileW * 0.5),
      y: originY + (gx + gy) * (tileH * 0.5),
    };
  }

  reset(challenge: SkillChallenge): void {
    this.challenge = challenge;
    this.gridSize = challenge.gridSize ?? 8;
    this.targetX = challenge.targetX ?? 4;
    this.targetY = challenge.targetY ?? 4;
    this.phase = 'idle';
    this.phaseTime = 0;
    this.shipHit = false;
    this.ripple = null;
    this.particles = [];
    this.statusTag = '';
    this.cannonAngle = -Math.PI * 0.35;
  }

  playAttempt(
    submitted: number,
    challenge: SkillChallenge,
    onComplete: (won: boolean) => void,
    submittedY = 0
  ): void {
    this.challenge = challenge;
    this.gridSize = challenge.gridSize ?? 8;
    this.targetX = challenge.targetX ?? 4;
    this.targetY = challenge.targetY ?? 4;
    this.subX = submitted;
    this.subY = submittedY;
    this.onComplete = onComplete;

    const clampedX = clamp(submitted, -1, this.gridSize);
    const clampedY = clamp(submittedY, -1, this.gridSize);
    this.shotStart = { x: 132, y: 318 };
    this.shotEnd = this.isoToScreen(clampedX + 0.5, clampedY + 0.5);

    this.startCannonAngle = this.cannonAngle;
    this.targetCannonAngle = Math.atan2(
      this.shotEnd.y - this.shotStart.y,
      this.shotEnd.x - this.shotStart.x
    );
    this.shotProgress = 0;
    this.ripple = null;
    this.statusTag = '';
    this.phase = 'aiming';
    this.phaseTime = 0;
  }

  update(dt: number, reducedMotion: boolean): void {
    this.time += dt;
    this.phaseTime += dt;

    if (this.ripple) {
      this.ripple.r += dt * 42;
      this.ripple.alpha = Math.max(0, this.ripple.alpha - dt * 1.1);
      if (this.ripple.alpha <= 0) this.ripple = null;
    }

    const aimDur = reducedMotion ? 0.12 : 0.45;
    const flyDur = reducedMotion ? 0.2 : 0.85;

    if (this.phase === 'aiming') {
      const p = clamp(this.phaseTime / aimDur, 0, 1);
      this.cannonAngle = lerp(
        this.startCannonAngle,
        this.targetCannonAngle,
        easeInOutQuad(p)
      );
      if (p >= 1) {
        this.phase = 'flying';
        this.phaseTime = 0;
        spawnBurst(
          this.particles,
          this.shotStart.x + Math.cos(this.cannonAngle) * 32,
          this.shotStart.y + Math.sin(this.cannonAngle) * 32,
          12,
          ['#F97316', '#FACC15', '#E2E8F0'],
          { speedMin: 40, speedMax: 130, gravity: 20, life: 0.45 }
        );
      }
    } else if (this.phase === 'flying') {
      const p = clamp(this.phaseTime / flyDur, 0, 1);
      this.shotProgress = p;
      if (p >= 1) {
        const xOk = this.subX === this.targetX;
        const yOk = this.subY === this.targetY;
        if (xOk && yOk) {
          this.shipHit = true;
          this.phase = 'won';
          this.phaseTime = 0;
          this.statusTag =
            this.ctxInfo.locale === 'es-AR' ? '¡Impacto directo!' : 'Direct hit!';
          spawnBurst(
            this.particles,
            this.shotEnd.x,
            this.shotEnd.y - 14,
            30,
            ['#FFC933', '#F97316', '#15803D', '#FFFFFF'],
            { shape: 'star', speedMin: 80, speedMax: 230, life: 1.0 }
          );
          this.onComplete?.(true);
        } else {
          this.phase = 'missed';
          this.phaseTime = 0;
          this.ripple = { x: this.shotEnd.x, y: this.shotEnd.y, r: 4, alpha: 1 };
          spawnBurst(
            this.particles,
            this.shotEnd.x,
            this.shotEnd.y,
            16,
            ['#FFFFFF', '#BAE6FD', '#38BDF8'],
            {
              speedMin: 45,
              speedMax: 145,
              angleMin: -Math.PI,
              angleMax: 0,
              life: 0.65,
            }
          );
          this.statusTag = `${xOk ? '✓' : '✗'} X (${this.subX})  ·  ${yOk ? '✓' : '✗'} Y (${this.subY})`;
        }
      }
    } else if (this.phase === 'missed') {
      if (this.phaseTime > 0.95) {
        this.phase = 'idle';
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
    // Horizon sky & deep ocean backdrop
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#BAE6FD');
    bg.addColorStop(0.28, '#E0F2FE');
    bg.addColorStop(0.29, '#0369A1');
    bg.addColorStop(1, '#0C4A6E');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Clouds
    const drift = (this.time * 12) % (w + 180);
    drawCloud(ctx, drift - 90, 48, 0.72, 0.75);
    drawCloud(ctx, ((drift + 420) % (w + 180)) - 90, 66, 0.55, 0.6);

    // Isometric Sea Grid
    const n = this.gridSize;
    const pTop = this.isoToScreen(0, 0);
    const pRight = this.isoToScreen(n, 0);
    const pBottom = this.isoToScreen(n, n);
    const pLeft = this.isoToScreen(0, n);

    // Sea diamond base
    ctx.fillStyle = '#0EA5E9';
    ctx.beginPath();
    ctx.moveTo(pTop.x, pTop.y);
    ctx.lineTo(pRight.x, pRight.y);
    ctx.lineTo(pBottom.x, pBottom.y);
    ctx.lineTo(pLeft.x, pLeft.y);
    ctx.closePath();
    ctx.fill();

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= n; i++) {
      const a = this.isoToScreen(i, 0);
      const b = this.isoToScreen(i, n);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      const c = this.isoToScreen(0, i);
      const d = this.isoToScreen(n, i);
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(d.x, d.y);
      ctx.stroke();
    }

    // Highlight target tile softly or on hit
    const tc0 = this.isoToScreen(this.targetX, this.targetY);
    const tc1 = this.isoToScreen(this.targetX + 1, this.targetY);
    const tc2 = this.isoToScreen(this.targetX + 1, this.targetY + 1);
    const tc3 = this.isoToScreen(this.targetX, this.targetY + 1);
    ctx.fillStyle = this.shipHit ? 'rgba(255, 201, 51, 0.45)' : 'rgba(255, 255, 255, 0.14)';
    ctx.beginPath();
    ctx.moveTo(tc0.x, tc0.y);
    ctx.lineTo(tc1.x, tc1.y);
    ctx.lineTo(tc2.x, tc2.y);
    ctx.lineTo(tc3.x, tc3.y);
    ctx.closePath();
    ctx.fill();

    // Axis labels (X along top-right, Y along top-left)
    ctx.font = '800 11px Nunito, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const xp = this.isoToScreen(i + 0.5, -0.45);
      ctx.fillText(String(i), xp.x, xp.y);
      const yp = this.isoToScreen(-0.45, i + 0.5);
      ctx.fillText(String(i), yp.x, yp.y);
    }

    // Axis titles
    ctx.font = '900 14px Nunito, sans-serif';
    ctx.fillStyle = '#FFC933';
    const xTitlePos = this.isoToScreen(n * 0.5, -1.2);
    ctx.fillText('X →', xTitlePos.x, xTitlePos.y);
    const yTitlePos = this.isoToScreen(-1.2, n * 0.5);
    ctx.fillText('← Y', yTitlePos.x, yTitlePos.y);

    // Water splash ripple on miss
    if (this.ripple) {
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.ripple.alpha})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(this.ripple.x, this.ripple.y, this.ripple.r, this.ripple.r * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Target Ship on (targetX, targetY)
    const shipPos = this.isoToScreen(this.targetX + 0.5, this.targetY + 0.5);
    this.drawShip(ctx, shipPos.x, shipPos.y);

    // Coastal Fort & Cannon on left island
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.ellipse(112, 342, 84, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#64748B';
    drawRoundedRect(ctx, 84, 306, 86, 36, 10);
    ctx.fill();

    const mood: HeroMood =
      this.phase === 'won' ? 'happy' : this.phase === 'missed' ? 'oops' : 'idle';
    drawHero(ctx, this.ctxInfo.hero, {
      x: 74,
      y: 326,
      scale: 0.78,
      mood,
      time: this.time,
      facing: 1,
      goggles: true,
    });

    // Swivel Cannon
    ctx.save();
    ctx.translate(132, 318);
    ctx.rotate(this.cannonAngle);
    ctx.fillStyle = '#1E293B';
    drawRoundedRect(ctx, -10, -10, 44, 20, 7);
    ctx.fill();
    ctx.fillStyle = '#FFC933';
    drawRoundedRect(ctx, 26, -12, 9, 24, 3);
    ctx.fill();
    ctx.restore();

    // Flying Cannonball + Water Shadow
    if (this.phase === 'flying') {
      const p = this.shotProgress;
      const sx = lerp(this.shotStart.x, this.shotEnd.x, p);
      const sy = lerp(this.shotStart.y, this.shotEnd.y, p);
      const arcZ = Math.sin(p * Math.PI) * 115;

      // Shadow on water
      ctx.fillStyle = 'rgba(12, 74, 110, 0.45)';
      ctx.beginPath();
      ctx.ellipse(sx, sy, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cannonball
      ctx.fillStyle = '#1C2443';
      ctx.beginPath();
      ctx.arc(sx, sy - arcZ, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFC933';
      ctx.beginPath();
      ctx.arc(sx - 2, sy - arcZ - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

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
      ctx.fillStyle = this.phase === 'won' ? '#15803D' : '#C2410C';
      drawRoundedRect(ctx, w / 2 - tw / 2, 16, tw, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.statusTag, w / 2, 34);
      ctx.restore();
    }
  }

  private drawShip(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const bob = Math.sin(this.time * 3.5) * 2.5;
    const tilt = this.shipHit ? Math.sin(this.time * 10) * 0.14 : Math.sin(this.time * 2.5) * 0.03;

    ctx.save();
    ctx.translate(x, y + bob);
    ctx.rotate(tilt);

    // Hull
    ctx.fillStyle = '#92400E';
    ctx.beginPath();
    ctx.moveTo(-20, -4);
    ctx.lineTo(20, -4);
    ctx.lineTo(13, 8);
    ctx.lineTo(-13, 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Mast & Sail
    ctx.strokeStyle = '#451A03';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(0, -34);
    ctx.stroke();

    ctx.fillStyle = this.shipHit ? '#FFC933' : '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(2, -32);
    ctx.quadraticCurveTo(18, -22, 2, -10);
    ctx.closePath();
    ctx.fill();

    // Flag
    ctx.fillStyle = '#C2410C';
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(-10, -30);
    ctx.lineTo(0, -26);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
