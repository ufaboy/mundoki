import type { SkillChallenge } from '../../../math/arcade/skillGames';
import {
  clamp,
  drawCloud,
  drawHero,
  drawRoundedRect,
  easeInOutQuad,
  easeOutCubic,
  lerp,
  spawnBurst,
  updateAndDrawParticles,
  type HeroMood,
  type Particle,
} from '../canvasUtils';
import type { SkillScene, SkillSceneContext } from '../sceneTypes';

type Phase = 'idle' | 'pouring' | 'walking' | 'won' | 'draining';

export class AdditionCylindersScene implements SkillScene {
  private ctxInfo: SkillSceneContext;
  private challenge!: SkillChallenge;
  private phase: Phase = 'idle';
  private time = 0;
  private phaseTime = 0;
  private submitted = 0;
  private currentRightLevel = 0;
  private targetRightLevel = 0;
  private startRightLevel = 0;
  private maxCap = 20;
  private heroX = 110;
  private particles: Particle[] = [];
  private bubbles: { x: number; y: number; r: number; speed: number }[] = [];
  private onComplete?: (won: boolean) => void;
  private statusTag = '';

  constructor(ctxInfo: SkillSceneContext) {
    this.ctxInfo = ctxInfo;
    for (let i = 0; i < 14; i++) {
      this.bubbles.push({
        x: Math.random(),
        y: Math.random(),
        r: 2 + Math.random() * 3.5,
        speed: 0.18 + Math.random() * 0.25,
      });
    }
  }

  reset(challenge: SkillChallenge): void {
    this.challenge = challenge;
    this.phase = 'idle';
    this.phaseTime = 0;
    this.submitted = 0;
    this.currentRightLevel = 0;
    this.targetRightLevel = 0;
    this.startRightLevel = 0;
    this.maxCap = Math.max(challenge.answer * 1.25, challenge.answer + 4);
    this.heroX = 110;
    this.particles = [];
    this.statusTag = '';
  }

  playAttempt(
    submitted: number,
    challenge: SkillChallenge,
    onComplete: (won: boolean) => void
  ): void {
    this.challenge = challenge;
    this.submitted = Math.max(0, submitted);
    this.onComplete = onComplete;
    this.startRightLevel = this.currentRightLevel;
    this.targetRightLevel = Math.min(this.submitted, this.maxCap * 1.05);
    this.phase = 'pouring';
    this.phaseTime = 0;
    this.statusTag = '';
  }

  update(dt: number, reducedMotion: boolean): void {
    this.time += dt;
    this.phaseTime += dt;

    for (const b of this.bubbles) {
      b.y -= b.speed * dt;
      if (b.y < 0) {
        b.y = 1;
        b.x = Math.random();
      }
    }

    const pourDur = reducedMotion ? 0.2 : 1.05;
    const walkDur = reducedMotion ? 0.2 : 1.35;
    const drainDur = reducedMotion ? 0.2 : 0.75;

    if (this.phase === 'pouring') {
      const p = clamp(this.phaseTime / pourDur, 0, 1);
      this.currentRightLevel = lerp(
        this.startRightLevel,
        this.targetRightLevel,
        easeOutCubic(p)
      );

      // Pour splash droplets
      if (!reducedMotion && Math.random() < 0.65) {
        const rightCylCenterX = 520;
        const cylBottom = 385;
        const cylH = 220;
        const fillFrac = clamp(this.currentRightLevel / this.maxCap, 0, 1);
        const surfY = cylBottom - fillFrac * cylH;
        spawnBurst(
          this.particles,
          rightCylCenterX + (Math.random() - 0.5) * 18,
          surfY,
          2,
          ['#38BDF8', '#7DD3FC', '#FFFFFF'],
          { speedMin: 30, speedMax: 95, angleMin: -Math.PI, angleMax: 0, life: 0.45, sizeMin: 2, sizeMax: 4 }
        );

        // Overflow splashes if over target capacity
        if (this.submitted > this.challenge.answer && p > 0.75) {
          spawnBurst(
            this.particles,
            rightCylCenterX + (Math.random() < 0.5 ? -58 : 58),
            cylBottom - cylH,
            2,
            ['#0EA5E9', '#BAE6FD'],
            { speedMin: 40, speedMax: 110, angleMin: 0.2, angleMax: Math.PI - 0.2, life: 0.6 }
          );
        }
      }

      if (p >= 1) {
        if (this.submitted === this.challenge.answer) {
          this.currentRightLevel = this.challenge.answer;
          this.phase = 'walking';
          this.phaseTime = 0;
          this.statusTag =
            this.ctxInfo.locale === 'es-AR' ? '¡Nivelado exacto!' : 'Perfect level!';
          spawnBurst(this.particles, 520, 210, 18, ['#15803D', '#FFC933', '#38BDF8'], {
            shape: 'star',
            speedMin: 70,
            speedMax: 180,
          });
        } else {
          this.phase = 'draining';
          this.phaseTime = 0;
          const tooHigh = this.submitted > this.challenge.answer;
          this.statusTag = tooHigh
            ? this.ctxInfo.locale === 'es-AR'
              ? '¡Se desbordó!'
              : 'Overflowed!'
            : this.ctxInfo.locale === 'es-AR'
              ? '¡Falta agua!'
              : 'Too low!';
        }
      }
    } else if (this.phase === 'walking') {
      const p = clamp(this.phaseTime / walkDur, 0, 1);
      this.heroX = lerp(110, 715, easeInOutQuad(p));
      if (p >= 1) {
        this.phase = 'won';
        this.phaseTime = 0;
        spawnBurst(this.particles, 715, 210, 28, ['#FFC933', '#0B79C4', '#15803D', '#E8607A'], {
          shape: 'rect',
          speedMin: 90,
          speedMax: 240,
          life: 1.2,
        });
        this.onComplete?.(true);
      }
    } else if (this.phase === 'draining') {
      if (this.phaseTime > 0.65) {
        const dp = clamp((this.phaseTime - 0.65) / drainDur, 0, 1);
        this.currentRightLevel = lerp(this.targetRightLevel, 0, easeInOutQuad(dp));
        if (dp >= 1) {
          this.currentRightLevel = 0;
          this.phase = 'idle';
          this.statusTag = '';
          this.onComplete?.(false);
        }
      }
    }

    updateAndDrawParticles(
      // updated during render if needed; keep physics here
      null as unknown as CanvasRenderingContext2D,
      [],
      0
    );
    // Step particles manually without drawing
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
    // Sky background
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#D8F0FF');
    sky.addColorStop(0.68, '#F6FBFF');
    sky.addColorStop(1, '#E6F4EA');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Drifting clouds
    const drift = (this.time * 12) % (w + 180);
    drawCloud(ctx, drift - 90, 62, 0.85, 0.75);
    drawCloud(ctx, ((drift + 380) % (w + 180)) - 90, 92, 0.65, 0.6);

    // Distant hills
    ctx.fillStyle = '#BFE3C6';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.quadraticCurveTo(180, 295, 420, 355);
    ctx.quadraticCurveTo(640, 290, w, 345);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Stone ledges (left & right)
    const targetFrac = clamp(this.challenge.answer / this.maxCap, 0, 1);
    const cylBottom = 385;
    const cylH = 220;
    const targetSurfY = cylBottom - targetFrac * cylH;
    const ledgeY = targetSurfY - 12;

    // Left stone ledge
    ctx.fillStyle = '#7A849E';
    drawRoundedRect(ctx, 20, ledgeY, 170, h - ledgeY, 10);
    ctx.fill();
    ctx.fillStyle = '#4B5475';
    ctx.fillRect(20, ledgeY, 170, 12);

    // Right stone ledge + goal flag
    ctx.fillStyle = '#7A849E';
    drawRoundedRect(ctx, 640, ledgeY, 190, h - ledgeY, 10);
    ctx.fill();
    ctx.fillStyle = '#4B5475';
    ctx.fillRect(640, ledgeY, 190, 12);

    // Victory flag on right ledge
    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(765, ledgeY);
    ctx.lineTo(765, ledgeY - 68);
    ctx.stroke();
    ctx.fillStyle = this.phase === 'won' ? '#15803D' : '#FFC933';
    ctx.beginPath();
    ctx.moveTo(767, ledgeY - 66);
    ctx.lineTo(804, ledgeY - 52 + Math.sin(this.time * 5) * 3);
    ctx.lineTo(767, ledgeY - 38);
    ctx.closePath();
    ctx.fill();

    // Connecting pipe at bottom between cylinders
    ctx.fillStyle = '#5C6784';
    ctx.fillRect(280, cylBottom - 26, 240, 20);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(280, cylBottom - 21, 240, 10);

    // Draw Left Cylinder (shows A + B)
    this.drawCylinder(ctx, 225, cylBottom - cylH, 110, cylH, this.challenge.answer, true);

    // Draw Right Cylinder (shows currentRightLevel)
    this.drawCylinder(ctx, 465, cylBottom - cylH, 110, cylH, this.currentRightLevel, false);

    // Target alignment dashed line across both cylinders
    ctx.save();
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle =
      this.phase === 'walking' || this.phase === 'won' ? '#15803D' : '#0B79C4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(205, targetSurfY);
    ctx.lineTo(605, targetSurfY);
    ctx.stroke();
    ctx.restore();

    // Overhead Faucet above Right Cylinder
    const faucetX = 520;
    ctx.fillStyle = '#4B5475';
    drawRoundedRect(ctx, faucetX - 18, 22, 36, 46, 6);
    ctx.fill();
    ctx.fillStyle = '#FFC933';
    drawRoundedRect(ctx, faucetX - 24, 58, 48, 12, 5);
    ctx.fill();

    // Pouring water stream
    if (this.phase === 'pouring') {
      const rightSurfY =
        cylBottom - clamp(this.currentRightLevel / this.maxCap, 0, 1) * cylH;
      const streamGrad = ctx.createLinearGradient(faucetX - 8, 70, faucetX + 8, 70);
      streamGrad.addColorStop(0, '#0284C7');
      streamGrad.addColorStop(0.5, '#7DD3FC');
      streamGrad.addColorStop(1, '#0284C7');
      ctx.fillStyle = streamGrad;
      const wobble = Math.sin(this.time * 24) * 2;
      ctx.fillRect(faucetX - 7 + wobble * 0.3, 70, 14, Math.max(10, rightSurfY - 70));
    }

    // Floating Bridge Platform between left ledge and right ledge
    const rightSurfY =
      cylBottom - clamp(this.currentRightLevel / this.maxCap, 0, 1) * cylH;
    const bridgeY =
      this.phase === 'walking' || this.phase === 'won' ? ledgeY : rightSurfY - 12;

    // Piston / float rod on right cylinder
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(514, bridgeY + 12, 12, Math.max(0, rightSurfY - bridgeY));

    // Bridge deck
    const isAligned = Math.abs(bridgeY - ledgeY) < 2;
    ctx.fillStyle = isAligned ? '#15803D' : '#C27D38';
    drawRoundedRect(ctx, 188, bridgeY, 454, 14, 6);
    ctx.fill();
    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hero character
    const heroMood: HeroMood =
      this.phase === 'walking'
        ? 'walking'
        : this.phase === 'won'
          ? 'happy'
          : this.phase === 'draining'
            ? 'oops'
            : 'idle';
    drawHero(ctx, this.ctxInfo.hero, {
      x: this.heroX,
      y: ledgeY,
      scale: 0.92,
      mood: heroMood,
      time: this.time,
      facing: 1,
    });

    // Particles
    for (const p of this.particles) {
      const progress = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = clamp(1 - progress, 0, 1);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.life * 7);
        ctx.fillRect(-p.size * 0.6, -p.size * 0.4, p.size * 1.2, p.size * 0.8);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Status pill inside canvas if any
    if (this.statusTag) {
      ctx.save();
      ctx.font = '800 18px Nunito, sans-serif';
      const tw = ctx.measureText(this.statusTag).width + 32;
      const bx = w / 2 - tw / 2;
      ctx.fillStyle = this.phase === 'won' || this.phase === 'walking' ? '#15803D' : '#C2410C';
      drawRoundedRect(ctx, bx, 20, tw, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.statusTag, w / 2, 38);
      ctx.restore();
    }
  }

  private drawCylinder(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    value: number,
    isReference: boolean
  ): void {
    // Glass body
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    drawRoundedRect(ctx, x, y, w, h, 10);
    ctx.fill();

    // Clip to cylinder interior for water
    ctx.save();
    drawRoundedRect(ctx, x + 3, y + 3, w - 6, h - 6, 8);
    ctx.clip();

    if (isReference) {
      const aH = clamp(this.challenge.a / this.maxCap, 0, 1) * h;
      const bH = clamp(this.challenge.b / this.maxCap, 0, 1) * h;

      // Bottom band: A
      ctx.fillStyle = '#0B79C4';
      ctx.fillRect(x, y + h - aH, w, aH);

      // Top band: B with animated wave top
      const topY = y + h - aH - bH;
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(x, y + h - aH);
      ctx.lineTo(x + w, y + h - aH);
      ctx.lineTo(x + w, topY);
      for (let wx = x + w; wx >= x; wx -= 10) {
        const wy = topY + Math.sin(this.time * 4 + wx * 0.08) * 2.5;
        ctx.lineTo(wx, wy);
      }
      ctx.closePath();
      ctx.fill();

      // Labels inside bands
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 16px Nunito, sans-serif';
      ctx.textAlign = 'center';
      if (aH > 22) ctx.fillText(`${this.challenge.a} L`, x + w / 2, y + h - aH / 2 + 5);
      if (bH > 22) ctx.fillText(`+${this.challenge.b} L`, x + w / 2, y + h - aH - bH / 2 + 5);
    } else if (value > 0.05) {
      const fillH = clamp(value / this.maxCap, 0, 1.04) * h;
      const topY = y + h - fillH;
      const grad = ctx.createLinearGradient(x, topY, x, y + h);
      grad.addColorStop(0, '#38BDF8');
      grad.addColorStop(1, '#0284C7');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w, topY);
      for (let wx = x + w; wx >= x; wx -= 10) {
        const wy = topY + Math.sin(this.time * 5 + wx * 0.09) * 2.5;
        ctx.lineTo(wx, wy);
      }
      ctx.closePath();
      ctx.fill();

      // Bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (const b of this.bubbles) {
        const bx = x + 12 + b.x * (w - 24);
        const by = topY + 8 + b.y * Math.max(0, fillH - 12);
        if (by > topY + 4 && by < y + h - 4) {
          ctx.beginPath();
          ctx.arc(bx, by, b.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Numeric readout
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 18px Nunito, sans-serif';
      ctx.textAlign = 'center';
      if (fillH > 26) {
        ctx.fillText(`${Math.round(value)} L`, x + w / 2, y + h - fillH / 2 + 6);
      }
    }
    ctx.restore();

    // Graduation ticks
    ctx.strokeStyle = 'rgba(28, 36, 67, 0.25)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 5; i++) {
      const ty = y + (h / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x + 4, ty);
      ctx.lineTo(x + 16, ty);
      ctx.stroke();
    }

    // Glass border & metal base
    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, x, y, w, h, 10);
    ctx.stroke();

    ctx.fillStyle = '#4B5475';
    drawRoundedRect(ctx, x - 6, y + h - 6, w + 12, 14, 5);
    ctx.fill();
    ctx.restore();
  }
}
