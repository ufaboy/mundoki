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

export class MultiplicationCannonScene implements SkillScene {
  private ctxInfo: SkillSceneContext;
  private challenge!: SkillChallenge;
  private phase: Phase = 'idle';
  private time = 0;
  private phaseTime = 0;
  private submitted = 0;

  private readonly cannonX = 165;
  private readonly cannonY = 340;
  private readonly targetX = 695;
  private readonly targetY = 265;
  private readonly gravity = 520;
  private readonly correctAngleDeg = 42;

  private currentAngleDeg = 28;
  private startAngleDeg = 28;
  private targetAngleDeg = 42;
  private recoil = 0;

  private ballX = 0;
  private ballY = 0;
  private ballVx = 0;
  private ballVy = 0;
  private flightTime = 0;
  private trail: { x: number; y: number }[] = [];
  private targetHit = false;

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
    this.currentAngleDeg = 28;
    this.recoil = 0;
    this.trail = [];
    this.targetHit = false;
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
    this.startAngleDeg = this.currentAngleDeg;
    this.trail = [];
    this.recoil = 0;
    this.statusTag = '';

    if (submitted === challenge.answer) {
      this.targetAngleDeg = this.correctAngleDeg;
    } else if (submitted < challenge.answer) {
      const offset = clamp((challenge.answer - submitted) * 1.4, 14, 24);
      this.targetAngleDeg = this.correctAngleDeg - offset;
    } else {
      const offset = clamp((submitted - challenge.answer) * 1.4, 14, 26);
      this.targetAngleDeg = this.correctAngleDeg + offset;
    }

    this.phase = 'aiming';
    this.phaseTime = 0;
  }

  private launchBall(): void {
    const radCorrect = (this.correctAngleDeg * Math.PI) / 180;
    const muzzleLen = 54;
    const mx = this.cannonX + Math.cos(radCorrect) * muzzleLen;
    const my = this.cannonY - Math.sin(radCorrect) * muzzleLen;
    const dx = this.targetX - mx;
    const dy = this.targetY - my;
    const tHit = Math.sqrt((dy + dx * Math.tan(radCorrect)) / (0.5 * this.gravity));
    const v0 = dx / (Math.cos(radCorrect) * tHit);

    const shotRad = (this.targetAngleDeg * Math.PI) / 180;
    this.ballX = this.cannonX + Math.cos(shotRad) * muzzleLen;
    this.ballY = this.cannonY - Math.sin(shotRad) * muzzleLen;
    this.ballVx = v0 * Math.cos(shotRad);
    this.ballVy = -v0 * Math.sin(shotRad);
    this.flightTime = 0;
    this.recoil = 14;

    // Muzzle flash & smoke
    spawnBurst(this.particles, this.ballX, this.ballY, 16, ['#F97316', '#FACC15', '#E2E8F0'], {
      speedMin: 60,
      speedMax: 180,
      angleMin: -shotRad - 0.6,
      angleMax: -shotRad + 0.6,
      gravity: 40,
      life: 0.55,
      sizeMin: 4,
      sizeMax: 9,
    });
  }

  update(dt: number, reducedMotion: boolean): void {
    this.time += dt;
    this.phaseTime += dt;
    this.recoil = Math.max(0, this.recoil - dt * 28);

    const aimDur = reducedMotion ? 0.15 : 0.6;

    if (this.phase === 'aiming') {
      const p = clamp(this.phaseTime / aimDur, 0, 1);
      this.currentAngleDeg = lerp(
        this.startAngleDeg,
        this.targetAngleDeg,
        easeInOutQuad(p)
      );
      if (p >= 1) {
        this.currentAngleDeg = this.targetAngleDeg;
        this.launchBall();
        this.phase = 'flying';
        this.phaseTime = 0;
      }
    } else if (this.phase === 'flying') {
      const stepDt = reducedMotion ? dt * 2.2 : dt;
      this.flightTime += stepDt;
      this.ballVy += this.gravity * stepDt;
      this.ballX += this.ballVx * stepDt;
      this.ballY += this.ballVy * stepDt;

      if (this.trail.length === 0 || Math.hypot(
        this.ballX - this.trail[this.trail.length - 1].x,
        this.ballY - this.trail[this.trail.length - 1].y
      ) > 16) {
        this.trail.push({ x: this.ballX, y: this.ballY });
      }

      // Check hit with target
      const dist = Math.hypot(this.ballX - this.targetX, this.ballY - this.targetY);
      if (this.submitted === this.challenge.answer && dist < 26) {
        this.targetHit = true;
        this.phase = 'won';
        this.phaseTime = 0;
        this.statusTag =
          this.ctxInfo.locale === 'es-AR' ? '¡Blanco perfecto!' : 'Direct hit!';
        spawnBurst(this.particles, this.targetX, this.targetY, 30, ['#FFC933', '#F97316', '#15803D', '#FFFFFF'], {
          shape: 'star',
          speedMin: 90,
          speedMax: 260,
          life: 1.0,
          sizeMin: 5,
          sizeMax: 10,
        });
        this.particles.push({
          x: this.targetX,
          y: this.targetY,
          vx: 0,
          vy: 0,
          size: 10,
          color: '#FFC933',
          alpha: 1,
          life: 0,
          maxLife: 0.55,
          gravity: 0,
          shape: 'ring',
        });
        this.onComplete?.(true);
      } else if (this.ballY > 395 || this.ballX > 880) {
        // Missed!
        if (this.ballY > 395) {
          spawnBurst(this.particles, this.ballX, 392, 14, ['#38BDF8', '#BAE6FD', '#FFFFFF'], {
            speedMin: 40,
            speedMax: 130,
            angleMin: -Math.PI,
            angleMax: 0,
            life: 0.65,
          });
        }
        this.phase = 'missed';
        this.phaseTime = 0;
        this.statusTag =
          this.submitted < this.challenge.answer
            ? this.ctxInfo.locale === 'es-AR'
              ? '¡Ángulo muy bajo!'
              : 'Angle too low!'
            : this.ctxInfo.locale === 'es-AR'
              ? '¡Ángulo muy alto!'
              : 'Angle too high!';
      }
    } else if (this.phase === 'missed') {
      if (this.phaseTime > 0.9) {
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
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#BAE6FD');
    sky.addColorStop(0.7, '#F0F9FF');
    sky.addColorStop(1, '#DCFCE7');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Clouds
    const drift = (this.time * 14) % (w + 180);
    drawCloud(ctx, drift - 90, 68, 0.85, 0.8);
    drawCloud(ctx, ((drift + 420) % (w + 180)) - 90, 108, 0.65, 0.65);

    // Water pond in the middle valley
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(260, 388, 360, h - 388);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let wx = 280; wx < 600; wx += 48) {
      ctx.fillRect(wx + Math.sin(this.time * 3 + wx) * 6, 396, 24, 4);
    }

    // Left grassy hill
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.moveTo(0, 365);
    ctx.quadraticCurveTo(180, 345, 275, 420);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Right stone tower platform
    ctx.fillStyle = '#64748B';
    drawRoundedRect(ctx, 645, 305, 100, h - 305, 8);
    ctx.fill();
    ctx.fillStyle = '#475569';
    drawRoundedRect(ctx, 635, 298, 120, 18, 6);
    ctx.fill();

    // Target (Star Bell / Bullseye)
    if (!this.targetHit) {
      const hover = Math.sin(this.time * 4) * 3;
      const ty = this.targetY + hover;
      ctx.save();
      ctx.fillStyle = '#C2410C';
      ctx.beginPath();
      ctx.arc(this.targetX, ty, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFF8EC';
      ctx.beginPath();
      ctx.arc(this.targetX, ty, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFC933';
      drawStarPath(ctx, this.targetX, ty, 5, 11, 5);
      ctx.fill();
      ctx.strokeStyle = '#1C2443';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(this.targetX, ty, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Protractor arc behind cannon
    ctx.save();
    ctx.strokeStyle = 'rgba(28, 36, 67, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(this.cannonX, this.cannonY, 72, -Math.PI / 2, 0);
    ctx.stroke();
    ctx.restore();

    // Dotted trajectory trail
    ctx.fillStyle = 'rgba(28, 36, 67, 0.35)';
    for (const pt of this.trail) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hero next to cannon (with aviator goggles!)
    const mood: HeroMood =
      this.phase === 'won' ? 'happy' : this.phase === 'missed' ? 'oops' : 'idle';
    drawHero(ctx, this.ctxInfo.hero, {
      x: 82,
      y: 365,
      scale: 0.9,
      mood,
      time: this.time,
      facing: 1,
      goggles: true,
    });

    // Cannon barrel
    const rad = (this.currentAngleDeg * Math.PI) / 180;
    ctx.save();
    ctx.translate(
      this.cannonX - Math.cos(rad) * this.recoil,
      this.cannonY + Math.sin(rad) * this.recoil
    );
    ctx.rotate(-rad);
    ctx.fillStyle = '#334155';
    drawRoundedRect(ctx, -14, -15, 68, 30, 10);
    ctx.fill();
    ctx.fillStyle = '#FFC933';
    drawRoundedRect(ctx, 44, -17, 12, 34, 4);
    ctx.fill();
    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 2.5;
    drawRoundedRect(ctx, -14, -15, 68, 30, 10);
    ctx.stroke();
    ctx.restore();

    // Cannon carriage & wheel
    ctx.fillStyle = '#92400E';
    drawRoundedRect(ctx, this.cannonX - 24, this.cannonY + 2, 48, 20, 6);
    ctx.fill();
    ctx.fillStyle = '#451A03';
    ctx.beginPath();
    ctx.arc(this.cannonX, this.cannonY + 18, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFC933';
    ctx.beginPath();
    ctx.arc(this.cannonX, this.cannonY + 18, 6, 0, Math.PI * 2);
    ctx.fill();

    // Angle badge
    ctx.fillStyle = '#1C2443';
    drawRoundedRect(ctx, this.cannonX - 24, this.cannonY - 62, 54, 24, 12);
    ctx.fill();
    ctx.fillStyle = '#FFC933';
    ctx.font = '800 13px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(this.currentAngleDeg)}°`, this.cannonX + 3, this.cannonY - 50);

    // Cannonball in flight
    if (this.phase === 'flying') {
      ctx.fillStyle = '#1C2443';
      ctx.beginPath();
      ctx.arc(this.ballX, this.ballY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFC933';
      ctx.beginPath();
      ctx.arc(this.ballX - 3, this.ballY - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Particles
    for (const p of this.particles) {
      const progress = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = clamp(1 - progress, 0, 1);
      if (p.shape === 'ring') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + progress * 52, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.shape === 'star') {
        ctx.fillStyle = p.color;
        drawStarPath(ctx, p.x, p.y, 5, p.size, p.size * 0.45);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
      drawRoundedRect(ctx, w / 2 - tw / 2, 18, tw, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.statusTag, w / 2, 36);
      ctx.restore();
    }
  }
}
