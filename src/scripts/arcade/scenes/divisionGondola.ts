import type { SkillChallenge } from '../../../math/arcade/skillGames';
import {
  clamp,
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

type Phase = 'idle' | 'distributing' | 'rolling' | 'won' | 'resetting';

export class DivisionGondolaScene implements SkillScene {
  private ctxInfo: SkillSceneContext;
  private challenge!: SkillChallenge;
  private phase: Phase = 'idle';
  private time = 0;
  private phaseTime = 0;
  private submitted = 0;

  private cartCounts: number[] = [];
  private targetCartCounts: number[] = [];
  private hopperRemaining = 0;
  private trainOffsetX = 0;
  private flyingGems: {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    t: number;
    dur: number;
    cartIdx: number;
  }[] = [];

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
    this.cartCounts = Array.from({ length: challenge.b }, () => 0);
    this.targetCartCounts = [...this.cartCounts];
    this.hopperRemaining = challenge.a;
    this.trainOffsetX = 0;
    this.flyingGems = [];
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
    this.cartCounts = Array.from({ length: challenge.b }, () => 0);
    this.hopperRemaining = challenge.a;
    this.flyingGems = [];
    this.statusTag = '';

    // Compute how many gems each cart can actually get from the A available
    let pool = challenge.a;
    this.targetCartCounts = [];
    for (let i = 0; i < challenge.b; i++) {
      const give = Math.min(this.submitted, pool);
      this.targetCartCounts.push(give);
      pool -= give;
    }

    // Spawn flying gem waves
    const totalToDrop = challenge.a - pool;
    const cartPositions = this.getCartPositions(challenge.b);
    let delayStep = 0;
    const perCart = Array.from({ length: challenge.b }, () => 0);
    // Distribute round-robin visually
    let dropped = 0;
    while (dropped < totalToDrop) {
      let progressed = false;
      for (let i = 0; i < challenge.b; i++) {
        if (perCart[i] < this.targetCartCounts[i]) {
          perCart[i]++;
          dropped++;
          const cx = cartPositions[i].x;
          const cy = cartPositions[i].y;
          this.flyingGems.push({
            sx: 420 + (Math.random() - 0.5) * 24,
            sy: 118,
            tx: cx,
            ty: cy - 12,
            t: -delayStep * 0.025,
            dur: 0.36,
            cartIdx: i,
          });
          delayStep++;
          progressed = true;
        }
      }
      if (!progressed) break;
    }

    this.phase = 'distributing';
    this.phaseTime = 0;
  }

  private getCartPositions(count: number): { x: number; y: number; w: number }[] {
    const startX = 115;
    const availW = 460;
    const gap = 10;
    const cartW = Math.min(68, (availW - gap * (count - 1)) / count);
    const totalW = count * cartW + (count - 1) * gap;
    const baseLeft = startX + (availW - totalW) / 2;
    const res: { x: number; y: number; w: number }[] = [];
    for (let i = 0; i < count; i++) {
      res.push({
        x: baseLeft + i * (cartW + gap) + cartW / 2,
        y: 336,
        w: cartW,
      });
    }
    return res;
  }

  update(dt: number, reducedMotion: boolean): void {
    this.time += dt;
    this.phaseTime += dt;

    if (this.phase === 'distributing') {
      const speedMul = reducedMotion ? 3.5 : 1;
      for (let i = this.flyingGems.length - 1; i >= 0; i--) {
        const g = this.flyingGems[i];
        g.t += dt * speedMul;
        if (g.t >= g.dur) {
          this.cartCounts[g.cartIdx]++;
          this.hopperRemaining = Math.max(0, this.hopperRemaining - 1);
          if (!reducedMotion) {
            spawnBurst(this.particles, g.tx, g.ty, 3, ['#A855F7', '#38BDF8', '#FFC933'], {
              speedMin: 20,
              speedMax: 70,
              life: 0.35,
              sizeMin: 2,
              sizeMax: 4,
            });
          }
          this.flyingGems.splice(i, 1);
        }
      }

      if (this.flyingGems.length === 0 && this.phaseTime > (reducedMotion ? 0.15 : 0.45)) {
        if (this.submitted === this.challenge.answer) {
          this.phase = 'rolling';
          this.phaseTime = 0;
          this.statusTag =
            this.ctxInfo.locale === 'es-AR' ? '¡Reparto exacto!' : 'Equal split!';
          spawnBurst(this.particles, 650, 315, 18, ['#15803D', '#FFC933', '#A855F7'], {
            shape: 'star',
            speedMin: 60,
            speedMax: 160,
          });
        } else {
          this.phase = 'resetting';
          this.phaseTime = 0;
          this.statusTag =
            this.submitted < this.challenge.answer
              ? this.ctxInfo.locale === 'es-AR'
                ? '¡Sobran gemas en la tolva!'
                : 'Gems left in hopper!'
              : this.ctxInfo.locale === 'es-AR'
                ? '¡No alcanzan para todos!'
                : 'Not enough gems for all carts!';
        }
      }
    } else if (this.phase === 'rolling') {
      const rollDur = reducedMotion ? 0.2 : 1.3;
      const p = clamp(this.phaseTime / rollDur, 0, 1);
      this.trainOffsetX = lerp(0, 740, easeInOutQuad(p));
      if (p >= 1) {
        this.phase = 'won';
        this.phaseTime = 0;
        this.onComplete?.(true);
      }
    } else if (this.phase === 'resetting') {
      if (this.phaseTime > 1.05) {
        this.cartCounts = Array.from({ length: this.challenge.b }, () => 0);
        this.hopperRemaining = this.challenge.a;
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
    // Cavern / crystal mine background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#1E1B4B');
    bg.addColorStop(0.6, '#312E81');
    bg.addColorStop(1, '#1E293B');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle cavern arches
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.arc(210, 420, 220, Math.PI, 0);
    ctx.arc(620, 420, 240, Math.PI, 0);
    ctx.fill();

    // Ground & Track
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 362, w, h - 362);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(0, 356, w, 6);

    // Railroad ties
    ctx.fillStyle = '#64748B';
    for (let tx = 20; tx < w; tx += 36) {
      ctx.fillRect(tx, 362, 18, 6);
    }

    // Exit Gate on the right
    const gateOpen = this.phase === 'rolling' || this.phase === 'won';
    ctx.fillStyle = '#475569';
    drawRoundedRect(ctx, 735, 225, 90, 132, 14);
    ctx.fill();
    ctx.fillStyle = gateOpen ? '#22C55E' : '#C2410C';
    ctx.beginPath();
    ctx.arc(780, 248, 10, 0, Math.PI * 2);
    ctx.fill();

    // Gem Hopper at top-center
    ctx.save();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(355, 42);
    ctx.lineTo(485, 42);
    ctx.lineTo(450, 118);
    ctx.lineTo(390, 118);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Hopper gem count
    ctx.fillStyle = '#A855F7';
    drawStarPath(ctx, 396, 80, 6, 11, 6);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 20px Nunito, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${this.hopperRemaining}`, 414, 81);
    ctx.restore();

    // Train (Minecarts + Hero locomotive)
    ctx.save();
    ctx.translate(this.trainOffsetX, 0);

    const carts = this.getCartPositions(this.challenge.b);
    // Couplers
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 4;
    if (carts.length > 0) {
      ctx.beginPath();
      ctx.moveTo(carts[0].x, 336);
      ctx.lineTo(carts[carts.length - 1].x + 70, 336);
      ctx.stroke();
    }

    // Draw each minecart
    carts.forEach((cart, idx) => {
      const count = this.cartCounts[idx] ?? 0;
      const isOk = this.phase === 'rolling' || this.phase === 'won';
      ctx.fillStyle = isOk ? '#15803D' : '#0B79C4';
      drawRoundedRect(ctx, cart.x - cart.w / 2, cart.y - 34, cart.w, 34, 7);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Wheels
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(cart.x - cart.w * 0.28, cart.y + 8, 8, 0, Math.PI * 2);
      ctx.arc(cart.x + cart.w * 0.28, cart.y + 8, 8, 0, Math.PI * 2);
      ctx.fill();

      // Gem count inside cart
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 16px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${count}`, cart.x, cart.y - 17);
    });

    // Lead Hero Locomotive at the right end of carts
    const locoX = (carts[carts.length - 1]?.x ?? 520) + 64;
    const mood: HeroMood =
      this.phase === 'rolling' || this.phase === 'won'
        ? 'happy'
        : this.phase === 'resetting'
          ? 'oops'
          : 'idle';
    drawHero(ctx, this.ctxInfo.hero, {
      x: locoX,
      y: 316,
      scale: 0.72,
      mood,
      time: this.time,
      facing: 1,
    });
    ctx.fillStyle = '#FFC933';
    drawRoundedRect(ctx, locoX - 28, 302, 56, 36, 8);
    ctx.fill();
    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(locoX - 15, 344, 9, 0, Math.PI * 2);
    ctx.arc(locoX + 15, 344, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Flying gems
    for (const g of this.flyingGems) {
      if (g.t < 0) continue;
      const p = clamp(g.t / g.dur, 0, 1);
      const gx = lerp(g.sx, g.tx, easeOutCubic(p));
      const gy = lerp(g.sy, g.ty, p) - Math.sin(p * Math.PI) * 35;
      ctx.fillStyle = '#C084FC';
      drawStarPath(ctx, gx, gy, 6, 7, 3.5);
      ctx.fill();
    }

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
      ctx.fillStyle = this.phase === 'rolling' || this.phase === 'won' ? '#15803D' : '#C2410C';
      drawRoundedRect(ctx, w / 2 - tw / 2, 16, tw, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.statusTag, w / 2, 34);
      ctx.restore();
    }
  }
}
