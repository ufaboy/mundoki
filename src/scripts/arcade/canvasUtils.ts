import { DEFAULT_HERO, HERO_STORAGE_KEY, isHeroId, isHeroSkin, type HeroChoice } from '../../content/heroes';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  gravity: number;
  shape?: 'circle' | 'star' | 'rect' | 'ring';
}

export type HeroMood = 'idle' | 'walking' | 'happy' | 'oops';

export interface HeroDrawOptions {
  x: number;
  y: number; // ground / feet y
  scale?: number;
  mood?: HeroMood;
  time: number;
  facing?: 1 | -1;
  goggles?: boolean;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeOutCubic(t: number): number {
  const u = clamp(t, 0, 1);
  return 1 - Math.pow(1 - u, 3);
}

export function easeInOutQuad(t: number): number {
  const u = clamp(t, 0, 1);
  return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
}

export function easeOutBack(t: number): number {
  const u = clamp(t, 0, 1);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
}

export function easeOutBounce(t: number): number {
  let u = clamp(t, 0, 1);
  const n1 = 7.5625;
  const d1 = 2.75;
  if (u < 1 / d1) return n1 * u * u;
  if (u < 2 / d1) return n1 * (u -= 1.5 / d1) * u + 0.75;
  if (u < 2.5 / d1) return n1 * (u -= 2.25 / d1) * u + 0.9375;
  return n1 * (u -= 2.625 / d1) * u + 0.984375;
}

export function readStoredHero(): HeroChoice {
  try {
    const raw = window.localStorage.getItem(HERO_STORAGE_KEY);
    if (!raw) return DEFAULT_HERO;
    const parsed = JSON.parse(raw) as Partial<HeroChoice>;
    return {
      hero: isHeroId(parsed.hero) ? parsed.hero : DEFAULT_HERO.hero,
      skin: isHeroSkin(parsed.skin) ? parsed.skin : DEFAULT_HERO.skin,
    };
  } catch {
    return DEFAULT_HERO;
  }
}

export function resizeCanvasToDisplaySize(
  canvas: HTMLCanvasElement,
  logicalWidth: number,
  logicalHeight: number
): CanvasRenderingContext2D | null {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const targetW = Math.round(logicalWidth * dpr);
  const targetH = Math.round(logicalHeight * dpr);
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function spawnBurst(
  list: Particle[],
  x: number,
  y: number,
  count: number,
  colors: string[],
  opts?: {
    speedMin?: number;
    speedMax?: number;
    angleMin?: number;
    angleMax?: number;
    sizeMin?: number;
    sizeMax?: number;
    gravity?: number;
    life?: number;
    shape?: Particle['shape'];
  }
): void {
  const speedMin = opts?.speedMin ?? 50;
  const speedMax = opts?.speedMax ?? 190;
  const angleMin = opts?.angleMin ?? 0;
  const angleMax = opts?.angleMax ?? Math.PI * 2;
  const sizeMin = opts?.sizeMin ?? 3;
  const sizeMax = opts?.sizeMax ?? 7;
  const gravity = opts?.gravity ?? 260;
  const life = opts?.life ?? 0.9;
  const shape = opts?.shape ?? 'circle';

  for (let i = 0; i < count; i++) {
    const angle = lerp(angleMin, angleMax, Math.random());
    const speed = lerp(speedMin, speedMax, Math.random());
    list.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: lerp(sizeMin, sizeMax, Math.random()),
      color: colors[i % colors.length],
      alpha: 1,
      life: 0,
      maxLife: life * lerp(0.75, 1.25, Math.random()),
      gravity,
      shape,
    });
  }
}

export function updateAndDrawParticles(
  ctx: CanvasRenderingContext2D,
  list: Particle[],
  dt: number
): void {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.life += dt;
    if (p.life >= p.maxLife) {
      list.splice(i, 1);
      continue;
    }
    p.vy += p.gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    const progress = p.life / p.maxLife;
    const alpha = p.alpha * (1 - progress);

    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);
    if (p.shape === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + progress * 44, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.shape === 'star') {
      ctx.fillStyle = p.color;
      drawStarPath(ctx, p.x, p.y, 5, p.size, p.size * 0.45);
      ctx.fill();
    } else if (p.shape === 'rect') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 6);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size * 0.6, -p.size * 0.4, p.size * 1.2, p.size * 0.8);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - progress * 0.35), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function drawStarPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerR: number,
  innerR: number
): void {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
}

export function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1,
  alpha = 0.9
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.arc(22, -6, 26, 0, Math.PI * 2);
  ctx.arc(48, 0, 20, 0, Math.PI * 2);
  ctx.arc(24, 8, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const SKIN_PALETTES = {
  light: { skin: '#FFD7B5', shade: '#F4B98A' },
  brown: { skin: '#D49464', shade: '#B87748' },
  dark: { skin: '#8D5838', shade: '#6F4226' },
};

export function drawHero(
  ctx: CanvasRenderingContext2D,
  choice: HeroChoice,
  opts: HeroDrawOptions
): void {
  const s = opts.scale ?? 1;
  const facing = opts.facing ?? 1;
  const mood = opts.mood ?? 'idle';
  const t = opts.time;
  const skin = SKIN_PALETTES[choice.skin];

  const bob =
    mood === 'happy'
      ? Math.abs(Math.sin(t * 9)) * -10
      : mood === 'walking'
        ? Math.abs(Math.sin(t * 10)) * -4
        : Math.sin(t * 3) * 1.8;

  const legSwing = mood === 'walking' ? Math.sin(t * 10) * 7 : 0;
  const armWave =
    mood === 'happy'
      ? Math.sin(t * 12) * 0.7 - 0.9
      : mood === 'oops'
        ? Math.sin(t * 16) * 0.2
        : Math.sin(t * 3) * 0.1;

  ctx.save();
  ctx.translate(opts.x, opts.y);
  ctx.scale(s * facing, s);

  // Ground shadow
  ctx.fillStyle = 'rgba(28, 36, 67, 0.16)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, bob);

  // Legs
  ctx.strokeStyle = skin.shade;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-7, -22);
  ctx.lineTo(-7 - legSwing, -5);
  ctx.moveTo(7, -22);
  ctx.lineTo(7 + legSwing, -5);
  ctx.stroke();

  // Shoes
  ctx.fillStyle = choice.hero === 'lola' ? '#B4566E' : '#5A7058';
  drawRoundedRect(ctx, -14 - legSwing, -7, 13, 7, 3);
  ctx.fill();
  drawRoundedRect(ctx, 2 + legSwing, -7, 13, 7, 3);
  ctx.fill();

  // Torso / tunic
  ctx.fillStyle = choice.hero === 'lola' ? '#3F9C8F' : '#D5A844';
  ctx.beginPath();
  ctx.moveTo(-14, -46);
  ctx.lineTo(14, -46);
  ctx.lineTo(17, -20);
  ctx.lineTo(-17, -20);
  ctx.closePath();
  ctx.fill();

  // Emblem on chest
  ctx.fillStyle = choice.hero === 'lola' ? '#E6FFF8' : '#FFF0BC';
  drawStarPath(ctx, 0, -33, 5, 6, 2.8);
  ctx.fill();

  // Arms
  ctx.strokeStyle = skin.skin;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-14, -42);
  ctx.lineTo(-22, -28 + Math.sin(t * 4) * 2);
  ctx.stroke();

  ctx.save();
  ctx.translate(14, -42);
  ctx.rotate(armWave);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(14, 12);
  ctx.stroke();
  ctx.restore();

  // Head
  const headShake = mood === 'oops' ? Math.sin(t * 20) * 3 : 0;
  ctx.save();
  ctx.translate(headShake, -64);

  // Hair back for Lola
  if (choice.hero === 'lola') {
    ctx.fillStyle = '#3B2820';
    ctx.beginPath();
    ctx.arc(-18, -4, 9, 0, Math.PI * 2);
    ctx.arc(18, -4, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E8607A';
    ctx.beginPath();
    ctx.arc(-15, -11, 4, 0, Math.PI * 2);
    ctx.arc(15, -11, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Face
  ctx.fillStyle = skin.skin;
  drawRoundedRect(ctx, -17, -18, 34, 34, 16);
  ctx.fill();

  // Hair top
  ctx.fillStyle = choice.hero === 'lola' ? '#3B2820' : '#4A3121';
  ctx.beginPath();
  ctx.arc(0, -10, 18, Math.PI, Math.PI * 2);
  ctx.fill();
  if (choice.hero === 'tomi') {
    ctx.beginPath();
    ctx.arc(-6, -22, 7, 0, Math.PI * 2);
    ctx.arc(5, -20, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eyes
  ctx.fillStyle = '#1C2443';
  if (mood === 'happy') {
    ctx.strokeStyle = '#1C2443';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-6, -2, 3, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(7, -2, 3, Math.PI, 0);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(-6, -2, 2.4, 0, Math.PI * 2);
    ctx.arc(7, -2, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Goggles (for cannon game)
  if (opts.goggles) {
    ctx.strokeStyle = '#6D43D0';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(225, 242, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(-6, -11, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(7, -11, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Mouth
  ctx.strokeStyle = '#1C2443';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  if (mood === 'happy') {
    ctx.arc(1, 5, 5, 0, Math.PI);
  } else if (mood === 'oops') {
    ctx.ellipse(1, 7, 3.5, 4.5, 0, 0, Math.PI * 2);
  } else {
    ctx.arc(1, 5, 4, 0.15 * Math.PI, 0.85 * Math.PI);
  }
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}
