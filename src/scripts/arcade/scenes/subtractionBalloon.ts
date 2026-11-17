import type { SkillChallenge } from '../../../math/arcade/skillGames';
import {
  clamp,
  drawCloud,
  drawHero,
  drawRoundedRect,
  easeInOutQuad,
  easeOutBack,
  easeOutCubic,
  lerp,
  spawnBurst,
  type HeroMood,
  type Particle,
} from '../canvasUtils';
import type { SkillScene, SkillSceneContext } from '../sceneTypes';

type Phase = 'idle' | 'dropping' | 'gliding' | 'won' | 'rebounding';

export class SubtractionBalloonScene implements SkillScene {
  private ctxInfo: SkillSceneContext;
  private challenge!: SkillChallenge;
  private phase: Phase = 'idle';
  private time = 0;
  private phaseTime = 0;
  private submitted = 0;
  private balloonX = 175;
  private balloonY = 285;
  private startY = 285;
  private targetY = 185;
  private dockY = 185;
  private bagDropY = 0;
  private bagAlpha = 1;
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
    this.balloonX = 175;
    this.balloonY = 285;
    this.startY = 285;
    this.targetY = 185;
    this.bagDropY = 0;
    this.bagAlpha = 1;
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
    this.phase = 'dropping';
    this.phaseTime = 0;
    this.bagDropY = 0;
    this.bagAlpha = 1;
    this.startY = 285;
    this.statusTag = '';

    if (submitted === challenge.answer) {
      this.targetY = this.dockY;
    } else if (submitted < challenge.answer) {
      // Too light -> shoots too high
      this.targetY = 76;
    } else {
      // Too heavy -> sinks too low
      this.targetY = 340;
    }
  }

  update(dt: number, reducedMotion: boolean): void {
    this.time += dt;
    this.phaseTime += dt;

    const dropDur = reducedMotion ? 0.15 : 0.75;
    const glideDur = reducedMotion ? 0.2 : 1.1;
    const reboundDur = reducedMotion ? 0.2 : 0.75;

    if (this.phase === 'dropping') {
      const p = clamp(this.phaseTime / dropDur, 0, 1);
      this.bagDropY = p * p * 170;
      this.bagAlpha = clamp(1 - p * 0.9, 0, 1);
      this.balloonY = lerp(this.startY, this.targetY, easeOutCubic(p) * 0.45);

      if (p >= 1) {
        this.phase = 'gliding';
        this.phaseTime = 0;
        if (this.submitted === this.challenge.answer) {
          this.statusTag =
            this.ctxInfo.locale === 'es-AR' ? '¡Altura exacta!' : 'Exact altitude!';
        } else if (this.submitted < this.challenge.answer) {
          this.statusTag =
            this.ctxInfo.locale === 'es-AR' ? '¡Muy liviano, subió de más!' : 'Too light, floated too high!';
        } else {
          this.statusTag =
            this.ctxInfo.locale === 'es-AR' ? '¡Muy pesado, bajó de más!' : 'Too heavy, sank too low!';
        }
      }
    } else if (this.phase === 'gliding') {
      const p = clamp(this.phaseTime / glideDur, 0, 1);
      if (this.submitted === this.challenge.answer) {
        this.balloonY = lerp(
          lerp(this.startY, this.targetY, 0.45),
          this.dockY,
          easeOutCubic(clamp(p * 1.4, 0, 1))
        );
        this.balloonX = lerp(175, 650, easeInOutQuad(p));
        if (p >= 1) {
          this.phase = 'won';
          this.phaseTime = 0;
          spawnBurst(this.particles, 650, this.dockY - 25, 26, ['#FFC933', '#15803D', '#0B79C4', '#C2410C'], {
            shape: 'star',
            speedMin: 80,
            speedMax: 220,
            life: 1.1,
          });
          this.onComplete?.(true);
        }
      } else {
        this.balloonY = lerp(
          lerp(this.startY, this.targetY, 0.45),
          this.targetY,
          easeOutBack(p)
        );
        this.balloonX = lerp(175, 410, easeInOutQuad(p));
        if (p >= 1) {
          spawnBurst(this.particles, this.balloonX, this.balloonY, 10, ['#FFFFFF', '#CBD5E1'], {
            speedMin: 40,
            speedMax: 110,
            gravity: 60,
            life: 0.6,
          });
          this.phase = 'rebounding';
          this.phaseTime = 0;
        }
      }
    } else if (this.phase === 'rebounding') {
      const p = clamp(this.phaseTime / reboundDur, 0, 1);
      this.balloonX = lerp(410, 175, easeInOutQuad(p));
      this.balloonY = lerp(this.targetY, 285, easeInOutQuad(p));
      if (p >= 1) {
        this.phase = 'idle';
        this.bagDropY = 0;
        this.bagAlpha = 1;
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
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#8ED0F9');
    sky.addColorStop(0.55, '#DDF2FF');
    sky.addColorStop(1, '#FFF3D6');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Sun
    ctx.fillStyle = '#FFE07D';
    ctx.beginPath();
    ctx.arc(730, 74, 38, 0, Math.PI * 2);
    ctx.fill();

    // Parallax clouds
    const drift = (this.time * 16) % (w + 200);
    drawCloud(ctx, drift - 100, 82, 0.9, 0.8);
    drawCloud(ctx, ((drift + 360) % (w + 200)) - 100, 140, 0.7, 0.65);
    drawCloud(ctx, ((drift + 620) % (w + 200)) - 100, 355, 0.85, 0.7);

    // Target altitude dashed guide line
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = this.phase === 'won' ? '#15803D' : '#0B79C4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(140, this.dockY + 42);
    ctx.lineTo(615, this.dockY + 42);
    ctx.stroke();
    ctx.restore();

    // Sky-Island Dock on the right
    this.drawSkyDock(ctx, 610, this.dockY + 42);

    // Balloon
    const floatBob = this.phase === 'idle' || this.phase === 'won' ? Math.sin(this.time * 2.5) * 4 : 0;
    this.drawBalloon(ctx, this.balloonX, this.balloonY + floatBob);

    // Particles
    for (const p of this.particles) {
      const progress = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = clamp(1 - progress, 0, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
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

  private drawSkyDock(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.save();
    // Floating rock underside
    ctx.fillStyle = '#8B6F52';
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 14);
    ctx.lineTo(x + 170, y + 14);
    ctx.lineTo(x + 135, y + 66);
    ctx.lineTo(x + 85, y + 84);
    ctx.lineTo(x + 42, y + 60);
    ctx.closePath();
    ctx.fill();

    // Grass top
    ctx.fillStyle = '#22C55E';
    drawRoundedRect(ctx, x, y, 180, 20, 8);
    ctx.fill();

    // Landing pad target sign
    ctx.fillStyle = '#1C2443';
    drawRoundedRect(ctx, x + 125, y - 48, 42, 32, 6);
    ctx.fill();
    ctx.fillRect(x + 144, y - 16, 4, 16);

    ctx.fillStyle = '#FFC933';
    ctx.font = '800 15px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      this.phase === 'won' ? 'OK!' : '? kg',
      x + 146,
      y - 32
    );
    ctx.restore();
  }

  private drawBalloon(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
    ctx.save();

    // Ropes
    ctx.strokeStyle = '#6B4F35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 26, cy - 35);
    ctx.lineTo(cx - 18, cy + 12);
    ctx.moveTo(cx + 26, cy - 35);
    ctx.lineTo(cx + 18, cy + 12);
    ctx.stroke();

    // Flame when rising
    if (this.phase === 'dropping' || this.phase === 'gliding') {
      const flicker = Math.sin(this.time * 32) * 3;
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 22);
      ctx.lineTo(cx + 8, cy - 22);
      ctx.lineTo(cx, cy - 40 - flicker);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(cx, cy - 26, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Envelope (hot air balloon)
    const envY = cy - 82;
    ctx.fillStyle = '#C2410C';
    ctx.beginPath();
    ctx.ellipse(cx, envY, 48, 54, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stripes
    ctx.fillStyle = '#FFC933';
    ctx.beginPath();
    ctx.ellipse(cx, envY, 26, 54, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0B79C4';
    ctx.beginPath();
    ctx.ellipse(cx, envY, 10, 54, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, envY, 48, 54, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Hero peeking out of basket
    const mood: HeroMood =
      this.phase === 'won' ? 'happy' : this.phase === 'rebounding' ? 'oops' : 'idle';
    drawHero(ctx, this.ctxInfo.hero, {
      x: cx,
      y: cy + 32,
      scale: 0.62,
      mood,
      time: this.time,
      facing: 1,
    });

    // Wicker basket
    ctx.fillStyle = '#B47B44';
    drawRoundedRect(ctx, cx - 24, cy + 12, 48, 28, 6);
    ctx.fill();
    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Total weight badge on basket
    ctx.fillStyle = '#FFF8EC';
    drawRoundedRect(ctx, cx - 22, cy + 16, 44, 20, 5);
    ctx.fill();
    ctx.fillStyle = '#1C2443';
    ctx.font = '800 13px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelWeight =
      this.phase === 'won'
        ? `${this.challenge.answer} kg`
        : `${this.challenge.a} kg`;
    ctx.fillText(labelWeight, cx, cy + 26);

    // Sandbag to drop (-B kg)
    if (this.phase !== 'won' && this.bagAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = this.bagAlpha;
      const by = cy + 44 + this.bagDropY;
      ctx.fillStyle = '#D97706';
      drawRoundedRect(ctx, cx - 18, by, 36, 22, 7);
      ctx.fill();
      ctx.strokeStyle = '#1C2443';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 12px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`-${this.challenge.b} kg`, cx, by + 11);
      ctx.restore();
    }

    ctx.restore();
  }
}
