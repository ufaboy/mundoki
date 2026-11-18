// Secundaria lesson page (Grades 8–12): answer checking, the hint, progress,
// and the interactive models (balance, operation chain, substitution, two lines).
// Answers are checked with the same rules the server uses (src/math/core/secondaryAnswer.ts);
// a correct one is recorded and re-checked by POST /api/progress/sync.

import type { TopicId } from '../math/core/types';
import { checkSecondaryAnswer, joinPair, matchesValue, readRational, type SecondaryAnswerSpec } from '../math/core/secondaryAnswer';
import { readCounted, recordSecondaryAnswer } from './missionProgress';

interface ClientData {
  lessonId: string;
  topicId: TopicId;
  items: { answer: SecondaryAnswerSpec; errors: { value: string; note: string }[] }[];
  text: Record<string, string>;
}

const SVG = 'http://www.w3.org/2000/svg';

function init(lesson: HTMLElement, data: ClientData) {
  const T = data.text;
  const solved = new Set<number>();
  const steps = [...lesson.querySelectorAll<HTMLElement>('[data-sec-step]')];
  const count = lesson.querySelector<HTMLElement>('[data-sec-count]');

  const refreshProgress = () => {
    steps.forEach((step, i) => step.classList.toggle('is-done', solved.has(i)));
    if (count) count.textContent = `${solved.size} / ${data.items.length} ${T.done}`;
  };

  const counted = new Set(readCounted());

  lesson.querySelectorAll<HTMLElement>('[data-sec-item]').forEach((card) => {
    const index = Number(card.dataset.secItem);
    const spec = data.items[index];
    if (!spec) return;
    const form = card.querySelector<HTMLFormElement>('[data-sec-form]')!;
    const inputs = [...card.querySelectorAll<HTMLInputElement>('[data-sec-input]')];
    const choices = [...card.querySelectorAll<HTMLButtonElement>('[data-sec-choice]')];
    const feedback = card.querySelector<HTMLElement>('[data-sec-feedback]')!;
    const hintButton = card.querySelector<HTMLButtonElement>('[data-sec-hint]')!;
    const hint = card.querySelector<HTMLElement>('[data-sec-hint-text]')!;
    let lastInput: HTMLInputElement | null = inputs[0] ?? null;

    const say = (kind: 'correct' | 'retry' | 'hint', message: string) => {
      feedback.hidden = false;
      feedback.className = `mk-feedback mk-feedback--${kind}`;
      feedback.textContent = message;
    };

    const markSolved = () => {
      card.classList.add('is-solved');
      solved.add(index);
      refreshProgress();
    };

    if (counted.has(`${data.lessonId}:${index}`)) markSolved();

    const settle = (answer: string, verdictText?: string) => {
      const verdict = checkSecondaryAnswer(spec.answer, answer);
      if (verdict === 'invalid') {
        inputs.forEach((input) => input.setAttribute('aria-invalid', String(!readRational(input.value))));
        say('hint', verdictText ?? (spec.answer.kind === 'pair' ? T.invalidPair : T.invalid));
        return;
      }
      inputs.forEach((input) => input.removeAttribute('aria-invalid'));
      if (verdict === 'correct') {
        say('correct', T.correct);
        markSolved();
        recordSecondaryAnswer({ lessonId: data.lessonId, checkIndex: index, answer, topicId: data.topicId });
        return;
      }
      const kind = spec.answer.kind === 'pair' ? 'pair' : 'number';
      const known = spec.answer.kind === 'choice' ? undefined : spec.errors.find((e) => matchesValue(kind, answer, e.value));
      say('retry', known ? known.note : T.retry);
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (spec.answer.kind === 'number') settle(inputs[0]?.value ?? '');
      else if (spec.answer.kind === 'pair') {
        const [x, y] = inputs.map((input) => input.value);
        if (!readRational(x ?? '') || !readRational(y ?? '')) {
          settle('');
          return;
        }
        settle(joinPair(x, y));
      }
    });

    choices.forEach((button) => {
      button.addEventListener('click', () => {
        const pickIndex = Number(button.dataset.secChoice);
        choices.forEach((other) => {
          other.setAttribute('aria-pressed', String(other === button));
          other.classList.remove('is-correct', 'is-retry');
        });
        const right = spec.answer.kind === 'choice' && spec.answer.answer === pickIndex;
        button.classList.add(right ? 'is-correct' : 'is-retry');
        settle(String(pickIndex));
      });
    });

    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        lastInput = input;
      });
      input.addEventListener('input', () => input.removeAttribute('aria-invalid'));
    });

    // ± and / sit next to their own box (the phone's number keypad has neither sign).
    const boxInput = (button: HTMLElement) =>
      button.closest('.sec-box')?.querySelector<HTMLInputElement>('[data-sec-input]') ?? lastInput ?? inputs[0];

    card.querySelectorAll<HTMLButtonElement>('[data-sec-sign]').forEach((sign) => {
      sign.addEventListener('click', () => {
        const target = boxInput(sign);
        if (!target) return;
        const value = target.value.trim();
        target.value = /^[-−]/.test(value) ? value.slice(1) : `-${value}`;
        target.removeAttribute('aria-invalid');
        target.focus();
        target.setSelectionRange(target.value.length, target.value.length);
      });
    });

    card.querySelectorAll<HTMLButtonElement>('[data-sec-key]').forEach((key) => {
      key.addEventListener('click', () => {
        const target = boxInput(key);
        if (!target) return;
        const symbol = key.dataset.secKey ?? '';
        const start = target.selectionStart ?? target.value.length;
        const end = target.selectionEnd ?? target.value.length;
        target.value = `${target.value.slice(0, start)}${symbol}${target.value.slice(end)}`;
        target.focus();
        target.setSelectionRange(start + symbol.length, start + symbol.length);
      });
    });

    hintButton.addEventListener('click', () => {
      hint.hidden = !hint.hidden;
      hintButton.setAttribute('aria-expanded', String(!hint.hidden));
    });
  });

  refreshProgress();
  lesson.querySelectorAll<HTMLElement>('[data-explorer]').forEach((box) => {
    const kind = box.dataset.explorer;
    if (kind === 'balance') balance(box, T);
    if (kind === 'chain') chain(box);
    if (kind === 'substitute') substitute(box, T);
    if (kind === 'lines') lines(box, T);
    if (kind === 'numberline') numberLine(box, T);
    if (kind === 'triangle') triangle(box, T);
    if (kind === 'parallels') parallels(box, T);
    if (kind === 'locus') locus(box, T);
    if (kind === 'frequency') frequency(box, T);
    if (kind === 'trials') trials(box, T);
  });
}

// ---------- Number formatting ----------

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

/** Exact fraction text for num/den, e.g. "5/2", "−3". */
function fraction(num: number, den: number): string {
  if (den < 0) [num, den] = [-num, -den];
  const g = gcd(num, den);
  const n = num / g;
  const d = den / g;
  const sign = n < 0 ? '−' : '';
  return d === 1 ? `${sign}${Math.abs(n)}` : `${sign}${Math.abs(n)}/${d}`;
}

function decimal(value: number, comma: string): string {
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded).replace('-', '−').replace('.', comma);
}

function signed(value: number, comma: string): string {
  return value < 0 ? ` − ${decimal(-value, comma)}` : ` + ${decimal(value, comma)}`;
}

function lineText(m: number, b: number, comma: string): string {
  const slope = m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '−x' : `${decimal(m, comma)}x`;
  if (!slope) return `y = ${decimal(b, comma)}`;
  return b === 0 ? `y = ${slope}` : `y = ${slope}${signed(b, comma)}`;
}

function svgEl(name: string, attrs: Record<string, string | number>, text?: string): SVGElement {
  const el = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
  if (text !== undefined) el.textContent = text;
  return el;
}

// ---------- Balance: a·x + b = c ----------

function balance(box: HTMLElement, T: Record<string, string>) {
  const examples = JSON.parse(box.dataset.examples || '[]') as [number, number, number][];
  const eq = box.querySelector<HTMLElement>('[data-balance-eq]')!;
  const view = box.querySelector<HTMLElement>('[data-balance-view]')!;
  const status = box.querySelector<HTMLElement>('[data-balance-status]')!;
  let which = 0;
  let a = 0;
  let b = 0;
  let c = 0;
  let split = false;

  const load = () => {
    [a, b, c] = examples[which % examples.length];
    split = false;
    status.textContent = '';
    draw();
  };

  const draw = () => {
    const left = split ? 'x' : `${a === 1 ? '' : a}x${b ? ` + ${b}` : ''}`;
    const right = split ? fraction(c, a) : String(c);
    eq.textContent = `${left} = ${right}`;

    const svg = svgEl('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': `${left} = ${right}` });
    svg.append(
      svgEl('path', { d: 'M180 70 L160 200 H200 Z', fill: '#EADFCB' }),
      svgEl('rect', { x: 20, y: 64, width: 320, height: 8, rx: 4, fill: '#1C2443' }),
      svgEl('path', { d: 'M30 72 V96 M160 72 V96 M200 72 V96 M330 72 V96', stroke: '#878DA6', 'stroke-width': 2 }),
      svgEl('rect', { x: 22, y: 96, width: 146, height: 92, rx: 12, fill: '#E1F2FF', stroke: '#0B79C4', 'stroke-width': 2 }),
      svgEl('rect', { x: 192, y: 96, width: 146, height: 92, rx: 12, fill: '#FFF3C9', stroke: '#D99B00', 'stroke-width': 2 }),
    );
    const groups = split ? 1 : a;
    const units = split ? 0 : b;
    let slot = 0;
    const place = (x0: number) => {
      const col = slot % 7;
      const row = Math.floor(slot / 7);
      slot += 1;
      return { x: x0 + 12 + col * 19, y: 106 + row * 22 };
    };
    for (let i = 0; i < groups; i += 1) {
      const p = place(22);
      svg.append(
        svgEl('rect', { x: p.x, y: p.y, width: 17, height: 17, rx: 3, fill: '#6D43D0' }),
        svgEl('text', { x: p.x + 8.5, y: p.y + 13, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#fff' }, 'x'),
      );
    }
    for (let i = 0; i < units; i += 1) {
      const p = place(22);
      svg.append(svgEl('circle', { cx: p.x + 8.5, cy: p.y + 8.5, r: 7, fill: '#0B79C4' }));
    }
    slot = 0;
    const rightUnits = split ? Math.round(c / a) : c;
    for (let i = 0; i < Math.min(rightUnits, 28); i += 1) {
      const p = place(192);
      svg.append(svgEl('circle', { cx: p.x + 8.5, cy: p.y + 8.5, r: 7, fill: '#D99B00' }));
    }
    view.replaceChildren(svg);
  };

  box.querySelector('[data-balance-remove]')?.addEventListener('click', () => {
    if (split || b === 0) {
      status.textContent = split ? '' : T.balanceNowSplit;
      return;
    }
    b -= 1;
    c -= 1;
    status.textContent = '';
    draw();
  });
  box.querySelector('[data-balance-split]')?.addEventListener('click', () => {
    if (b > 0) {
      status.textContent = T.balanceNeedUnits;
      return;
    }
    split = true;
    status.textContent = `${T.balanceDone} ${fraction(c, a)}.`;
    draw();
  });
  box.querySelector('[data-balance-next]')?.addEventListener('click', () => {
    which += 1;
    load();
  });
  load();
}

// ---------- Chain of operations, undone backwards ----------

function chain(box: HTMLElement) {
  const steps = [...box.querySelectorAll<HTMLElement>('[data-chain-step]')];
  const total = new Set(steps.map((s) => s.dataset.chainStep)).size;
  let shown = 0;
  const undo = box.querySelector<HTMLButtonElement>('[data-chain-undo]')!;
  const show = () => {
    steps.forEach((s) => {
      s.hidden = Number(s.dataset.chainStep) >= shown;
    });
    undo.disabled = shown >= total;
  };
  undo.addEventListener('click', () => {
    shown = Math.min(total, shown + 1);
    show();
  });
  box.querySelector('[data-chain-reset]')?.addEventListener('click', () => {
    shown = 0;
    show();
  });
  show();
}

// ---------- Substitution: compare both sides ----------

function substitute(box: HTMLElement, T: Record<string, string>) {
  const [p, q] = JSON.parse(box.dataset.left || '[0,0]') as [number, number];
  const [r, s] = JSON.parse(box.dataset.right || '[0,0]') as [number, number];
  const input = box.querySelector<HTMLInputElement>('[data-sub-input]')!;
  const status = box.querySelector<HTMLElement>('[data-sub-status]')!;
  const comma = T.decimal;

  const evaluate = () => {
    const value = readRational(input.value);
    if (!value) {
      status.textContent = '';
      return;
    }
    const v = value.numerator / value.denominator;
    const left = p * v + q;
    const right = r * v + s;
    const equal = Math.abs(left - right) < 1e-9;
    status.textContent = `${T.left}: ${decimal(left, comma)} · ${T.right}: ${decimal(right, comma)}. ${equal ? T.same : T.different}`;
  };

  input.addEventListener('input', evaluate);
  box.querySelectorAll<HTMLButtonElement>('[data-sub-try]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = (button.dataset.subTry ?? '').replace('.', comma);
      evaluate();
    });
  });
}

// ---------- Two lines on a grid ----------

function lines(box: HTMLElement, T: Record<string, string>) {
  const fixed = JSON.parse(box.dataset.fixed || 'null') as [number, number] | null;
  const [m1, b1] = fixed ?? [0, 0];
  const [m0, b0] = JSON.parse(box.dataset.start || '[0,0]') as [number, number];
  const xLabel = box.dataset.xlabel || 'x';
  const yLabel = box.dataset.ylabel || 'y';
  const view = box.querySelector<HTMLElement>('[data-lines-view]')!;
  const slope = box.querySelector<HTMLInputElement>('[data-lines-slope]')!;
  const intercept = box.querySelector<HTMLInputElement>('[data-lines-intercept]')!;
  const mOut = box.querySelector<HTMLOutputElement>('[data-lines-m]')!;
  const bOut = box.querySelector<HTMLOutputElement>('[data-lines-b]')!;
  const eq = box.querySelector<HTMLElement>('[data-lines-eq]')!;
  const status = box.querySelector<HTMLElement>('[data-lines-status]')!;
  const comma = T.decimal;
  slope.value = String(m0);
  intercept.value = String(b0);

  const R = 8;
  const S = 20;
  const px = (x: number) => 170 + x * S;
  const py = (y: number) => 170 - y * S;

  const draw = () => {
    const m2 = Number(slope.value);
    const b2 = Number(intercept.value);
    mOut.textContent = decimal(m2, comma);
    bOut.textContent = decimal(b2, comma);
    eq.textContent = fixed ? `${lineText(m1, b1, comma)}   ·   ${lineText(m2, b2, comma)}` : lineText(m2, b2, comma);

    const svg = svgEl('svg', { viewBox: '0 0 340 340', role: 'img', 'aria-label': eq.textContent ?? '' });
    const defs = svgEl('defs', {});
    const clip = svgEl('clipPath', { id: 'sec-lines-clip' });
    clip.append(svgEl('rect', { x: px(-R), y: py(R), width: 2 * R * S, height: 2 * R * S }));
    defs.append(clip);
    svg.append(defs, svgEl('rect', { x: px(-R), y: py(R), width: 2 * R * S, height: 2 * R * S, fill: '#fff', stroke: '#EADFCB' }));
    for (let i = -R; i <= R; i += 1) {
      svg.append(
        svgEl('line', { x1: px(i), y1: py(-R), x2: px(i), y2: py(R), stroke: '#F1E8D8', 'stroke-width': 1 }),
        svgEl('line', { x1: px(-R), y1: py(i), x2: px(R), y2: py(i), stroke: '#F1E8D8', 'stroke-width': 1 }),
      );
    }
    svg.append(
      svgEl('line', { x1: px(-R), y1: py(0), x2: px(R), y2: py(0), stroke: '#4B5475', 'stroke-width': 1.5 }),
      svgEl('line', { x1: px(0), y1: py(-R), x2: px(0), y2: py(R), stroke: '#4B5475', 'stroke-width': 1.5 }),
      svgEl('text', { x: px(R) - 2, y: py(0) - 6, 'text-anchor': 'end', 'font-size': 12, fill: '#4B5475' }, xLabel),
      svgEl('text', { x: px(0) + 6, y: py(R) + 14, 'font-size': 12, fill: '#4B5475' }, yLabel),
    );
    const plotted = svgEl('g', { 'clip-path': 'url(#sec-lines-clip)' });
    const line = (m: number, b: number, color: string, dash = '') =>
      svgEl('line', { x1: px(-R), y1: py(m * -R + b), x2: px(R), y2: py(m * R + b), stroke: color, 'stroke-width': 3, 'stroke-dasharray': dash, 'stroke-linecap': 'round' });
    if (!fixed) {
      plotted.append(
        line(m2, b2, '#C2410C'),
        svgEl('circle', { cx: px(0), cy: py(b2), r: 6, fill: '#15803D', stroke: '#fff', 'stroke-width': 2 }),
        svgEl('path', { d: `M${px(0)} ${py(b2)} H${px(1)} V${py(b2 + m2)}`, fill: 'none', stroke: '#15803D', 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }),
      );
      status.textContent = `${T.lineIntercept} ${decimal(b2, comma)}. ${T.lineSlope} ${decimal(m2, comma)}.`;
    } else if (m1 === m2) {
      plotted.append(line(m1, b1, '#0B79C4'), line(m2, b2, '#C2410C', b2 === b1 ? '8 6' : ''));
      status.textContent = b1 === b2 ? T.same_line : T.parallel;
    } else {
      // Exact crossing: slopes are multiples of 1/2, intercepts are whole numbers.
      const xNum = 2 * (b2 - b1);
      const xDen = 2 * (m1 - m2);
      const x = xNum / xDen;
      const y = m1 * x + b1;
      const yNum = 2 * m1 * xNum + 2 * b1 * xDen;
      const yDen = 2 * xDen;
      plotted.append(line(m1, b1, '#0B79C4'), line(m2, b2, '#C2410C'));
      plotted.append(svgEl('circle', { cx: px(x), cy: py(y), r: 6, fill: '#15803D', stroke: '#fff', 'stroke-width': 2 }));
      const point = `x = ${fraction(xNum, xDen)}, y = ${fraction(yNum, yDen)}`;
      status.textContent = `${T.cross} ${point}.`;
    }
    svg.append(plotted);
    view.replaceChildren(svg);
  };

  slope.addEventListener('input', draw);
  intercept.addEventListener('input', draw);
  draw();
}

// ---------- Number line: a + b as a jump ----------

function numberLine(box: HTMLElement, T: Record<string, string>) {
  const [a0, b0] = JSON.parse(box.dataset.start || '[0,0]') as [number, number];
  const view = box.querySelector<HTMLElement>('[data-nl-view]')!;
  const start = box.querySelector<HTMLInputElement>('[data-nl-start]')!;
  const move = box.querySelector<HTMLInputElement>('[data-nl-move]')!;
  const aOut = box.querySelector<HTMLOutputElement>('[data-nl-a]')!;
  const bOut = box.querySelector<HTMLOutputElement>('[data-nl-b]')!;
  const eq = box.querySelector<HTMLElement>('[data-nl-eq]')!;
  const comma = T.decimal;
  start.value = String(a0);
  move.value = String(b0);
  const R = 20;
  const S = 8;
  const px = (x: number) => 170 + x * S;

  const draw = () => {
    const a = Number(start.value);
    const b = Number(move.value);
    const r = a + b;
    aOut.textContent = decimal(a, comma);
    bOut.textContent = decimal(b, comma);
    const plain = b < 0 ? ` = ${decimal(a, comma)} − ${decimal(-b, comma)}` : '';
    eq.textContent = `${decimal(a, comma)} + (${decimal(b, comma)})${plain} = ${decimal(r, comma)}`;

    const svg = svgEl('svg', { viewBox: '0 0 340 110', role: 'img', 'aria-label': eq.textContent ?? '' });
    svg.append(svgEl('line', { x1: px(-R), y1: 70, x2: px(R), y2: 70, stroke: '#4B5475', 'stroke-width': 2 }));
    for (let i = -R; i <= R; i += 1) {
      const big = i % 5 === 0;
      svg.append(svgEl('line', { x1: px(i), y1: big ? 62 : 66, x2: px(i), y2: big ? 78 : 74, stroke: '#4B5475', 'stroke-width': big ? 2 : 1 }));
      if (big) svg.append(svgEl('text', { x: px(i), y: 96, 'text-anchor': 'middle', 'font-size': 12, fill: '#4B5475' }, String(i).replace('-', '−')));
    }
    if (b !== 0) {
      const mid = (px(a) + px(r)) / 2;
      svg.append(
        svgEl('path', { d: `M${px(a)} 64 Q${mid} ${Math.max(8, 64 - Math.abs(b) * 5)} ${px(r)} 64`, fill: 'none', stroke: b > 0 ? '#15803D' : '#C2410C', 'stroke-width': 3 }),
        svgEl('path', { d: `M${px(r)} 64 l${b > 0 ? -7 : 7} -6 M${px(r)} 64 l${b > 0 ? -6 : 6} 4`, stroke: b > 0 ? '#15803D' : '#C2410C', 'stroke-width': 3, 'stroke-linecap': 'round' }),
      );
    }
    svg.append(
      svgEl('circle', { cx: px(a), cy: 70, r: 6, fill: '#0B79C4' }),
      svgEl('circle', { cx: px(r), cy: 70, r: 6, fill: '#6D43D0', stroke: '#fff', 'stroke-width': 2 }),
    );
    view.replaceChildren(svg);
  };

  start.addEventListener('input', draw);
  move.addEventListener('input', draw);
  draw();
}

// ---------- Right triangle with squares on the sides ----------

function triangle(box: HTMLElement, T: Record<string, string>) {
  const [a0, b0] = JSON.parse(box.dataset.start || '[3,4]') as [number, number];
  const view = box.querySelector<HTMLElement>('[data-tri-view]')!;
  const legA = box.querySelector<HTMLInputElement>('[data-tri-leg-a]')!;
  const legB = box.querySelector<HTMLInputElement>('[data-tri-leg-b]')!;
  const aOut = box.querySelector<HTMLOutputElement>('[data-tri-a]')!;
  const bOut = box.querySelector<HTMLOutputElement>('[data-tri-b]')!;
  const eq = box.querySelector<HTMLElement>('[data-tri-eq]')!;
  const status = box.querySelector<HTMLElement>('[data-tri-status]')!;
  const comma = T.decimal;
  legA.value = String(a0);
  legB.value = String(b0);

  const draw = () => {
    const a = Number(legA.value);
    const b = Number(legB.value);
    const c2 = a * a + b * b;
    const c = Math.sqrt(c2);
    aOut.textContent = String(a);
    bOut.textContent = String(b);
    eq.textContent = `${a}² + ${b}² = ${a * a} + ${b * b} = ${c2}`;
    status.textContent = Number.isInteger(c) ? `${T.hypotenuse}: √${c2} = ${c}` : `${T.hypotenuse}: √${c2} ≈ ${decimal(c, comma)}`;

    // Math coordinates (y up): right angle at the origin, legs on the axes.
    const squares: { pts: [number, number][]; fill: string; label: string }[] = [
      { pts: [[0, 0], [a, 0], [a, -a], [0, -a]], fill: '#E1F2FF', label: `${a * a}` },
      { pts: [[0, 0], [0, b], [-b, b], [-b, 0]], fill: '#FFF3C9', label: `${b * b}` },
      { pts: [[a, 0], [0, b], [b, a + b], [a + b, a]], fill: '#EEE7FF', label: `${c2}` },
    ];
    const all = squares.flatMap((s) => s.pts);
    const minX = Math.min(...all.map((p) => p[0])) - 0.5;
    const maxX = Math.max(...all.map((p) => p[0])) + 0.5;
    const minY = Math.min(...all.map((p) => p[1])) - 0.5;
    const maxY = Math.max(...all.map((p) => p[1])) + 0.5;
    const unit = 300 / Math.max(maxX - minX, maxY - minY);
    const X = (x: number) => (x - minX) * unit;
    const Y = (y: number) => (maxY - y) * unit;
    const width = (maxX - minX) * unit;
    const height = (maxY - minY) * unit;
    const svg = svgEl('svg', { viewBox: `0 0 ${width.toFixed(1)} ${height.toFixed(1)}`, role: 'img', 'aria-label': eq.textContent ?? '' });
    for (const square of squares) {
      svg.append(svgEl('polygon', { points: square.pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' '), fill: square.fill, stroke: '#878DA6', 'stroke-width': 1.5 }));
      const cx = square.pts.reduce((s, p) => s + p[0], 0) / 4;
      const cy = square.pts.reduce((s, p) => s + p[1], 0) / 4;
      svg.append(svgEl('text', { x: X(cx), y: Y(cy) + 6, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#1C2443' }, square.label));
    }
    svg.append(
      svgEl('polygon', { points: `${X(0)},${Y(0)} ${X(a)},${Y(0)} ${X(0)},${Y(b)}`, fill: '#fff', stroke: '#1C2443', 'stroke-width': 3 }),
      svgEl('path', { d: `M${X(0) + 12} ${Y(0)} V${Y(0) - 12} H${X(0)}`, fill: 'none', stroke: '#1C2443', 'stroke-width': 2 }),
    );
    view.replaceChildren(svg);
  };

  legA.addEventListener('input', draw);
  legB.addEventListener('input', draw);
  draw();
}

// ---------- Parallel lines cut by a transversal ----------

// Sectors at each crossing, in degrees counter-clockwise from the right-hand ray:
// 0 upper right [0, a], 1 upper left [a, 180], 2 lower left [180, 180 + a], 3 lower right [180 + a, 360].
// Each pair is [sector at the top crossing, sector at the bottom crossing].
const PARALLEL_PAIRS: Record<string, [number, number]> = { corresponding: [0, 0], alternate: [2, 0], cointerior: [3, 0] };
const PARALLEL_LABEL: Record<string, string> = { corresponding: 'parCorresponding', alternate: 'parAlternate', cointerior: 'parCointerior' };

function parallels(box: HTMLElement, T: Record<string, string>) {
  const view = box.querySelector<HTMLElement>('[data-par-view]')!;
  const angle = box.querySelector<HTMLInputElement>('[data-par-angle]')!;
  const out = box.querySelector<HTMLOutputElement>('[data-par-a]')!;
  const status = box.querySelector<HTMLElement>('[data-par-status]')!;
  const buttons = [...box.querySelectorAll<HTMLButtonElement>('[data-par-pair]')];
  let pair = PARALLEL_PAIRS[box.dataset.pair ?? ''] ? box.dataset.pair! : 'corresponding';
  angle.value = box.dataset.start || '60';

  const W = 340;
  const H = 240;
  const gap = 110;
  const top = H / 2 - gap / 2;
  const bottom = H / 2 + gap / 2;

  const draw = () => {
    const a = Number(angle.value);
    out.textContent = String(a);
    const rad = (a * Math.PI) / 180;
    const cot = Math.cos(rad) / Math.sin(rad);
    const crossings = [{ x: W / 2 + (gap / 2) * cot, y: top }, { x: W / 2 - (gap / 2) * cot, y: bottom }];
    const values = [a, 180 - a, a, 180 - a];
    const sector = (s: number): [number, number] => [s === 0 ? 0 : s === 1 ? a : s === 2 ? 180 : 180 + a, s === 0 ? a : s === 1 ? 180 : s === 2 ? 180 + a : 360];
    const at = (p: { x: number; y: number }, deg: number, r: number) => {
      const t = (deg * Math.PI) / 180;
      return { x: p.x + r * Math.cos(t), y: p.y - r * Math.sin(t) };
    };
    const [s1, s2] = PARALLEL_PAIRS[pair];
    const supplementary = pair === 'cointerior';
    status.textContent = `${T[PARALLEL_LABEL[pair]]}: ${values[s1]}° ${T.and} ${values[s2]}° — ${supplementary ? T.parSupplementary : T.parEqual}.`;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.parPair === pair)));

    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': status.textContent });
    for (const y of [top, bottom]) {
      svg.append(
        svgEl('line', { x1: 8, y1: y, x2: W - 8, y2: y, stroke: '#0B79C4', 'stroke-width': 3, 'stroke-linecap': 'round' }),
        // Arrow marks: the usual sign that the two lines are parallel.
        svgEl('path', { d: `M${W - 40} ${y - 6} l8 6 l-8 6`, fill: 'none', stroke: '#0B79C4', 'stroke-width': 2.5 }),
      );
    }
    const reach = H / 2 / Math.sin(rad);
    const ends = [at({ x: W / 2, y: H / 2 }, a, reach), at({ x: W / 2, y: H / 2 }, a + 180, reach)];
    svg.append(svgEl('line', { x1: ends[0].x, y1: ends[0].y, x2: ends[1].x, y2: ends[1].y, stroke: '#1C2443', 'stroke-width': 2.5 }));

    crossings.forEach((p, i) => {
      for (let s = 0; s < 4; s += 1) {
        const [d1, d2] = sector(s);
        const on = (i === 0 && s === s1) || (i === 1 && s === s2);
        if (on) {
          const p1 = at(p, d1, 26);
          const p2 = at(p, d2, 26);
          svg.append(svgEl('path', { d: `M${p.x} ${p.y} L${p1.x} ${p1.y} A26 26 0 0 0 ${p2.x} ${p2.y} Z`, fill: '#FDE7C8', stroke: '#C2410C', 'stroke-width': 2 }));
        }
        const label = at(p, (d1 + d2) / 2, 42);
        svg.append(svgEl('text', {
          x: label.x, y: label.y + 4, 'text-anchor': 'middle', 'font-size': on ? 14 : 11, 'font-weight': on ? 800 : 400, fill: on ? '#C2410C' : '#878DA6',
        }, `${values[s]}°`));
      }
      svg.append(svgEl('circle', { cx: p.x, cy: p.y, r: 3.5, fill: '#1C2443' }));
    });
    view.replaceChildren(svg);
  };

  buttons.forEach((button) => button.addEventListener('click', () => {
    pair = button.dataset.parPair ?? pair;
    draw();
  }));
  angle.addEventListener('input', draw);
  draw();
}

// ---------- Locus: points at a given distance, or equidistant ----------

function locus(box: HTMLElement, T: Record<string, string>) {
  const mode = box.dataset.mode || 'circle';
  const [x0, y0] = JSON.parse(box.dataset.start || '[1,1]') as [number, number];
  const view = box.querySelector<HTMLElement>('[data-locus-view]')!;
  const px = box.querySelector<HTMLInputElement>('[data-locus-px]')!;
  const py = box.querySelector<HTMLInputElement>('[data-locus-py]')!;
  const xOut = box.querySelector<HTMLOutputElement>('[data-locus-x]')!;
  const yOut = box.querySelector<HTMLOutputElement>('[data-locus-y]')!;
  const eq = box.querySelector<HTMLElement>('[data-locus-eq]')!;
  const status = box.querySelector<HTMLElement>('[data-locus-status]')!;
  const comma = T.decimal;
  px.value = String(x0);
  py.value = String(y0);

  const R = 6;
  const S = 26;
  const X = (x: number) => 170 + x * S;
  const Y = (y: number) => 170 - y * S;
  const A: [number, number] = [-2, -1];
  const B: [number, number] = [2, 3];
  /** A distance from its square: exact when whole, otherwise √n ≈ value. */
  const dist = (d2: number) => {
    const d = Math.sqrt(d2);
    return Number.isInteger(d) ? String(d) : `√${d2} ≈ ${decimal(Math.round(d * 10) / 10, comma)}`;
  };
  const sq = (p: [number, number], q: [number, number]) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;

  const draw = () => {
    const P: [number, number] = [Number(px.value), Number(py.value)];
    xOut.textContent = decimal(P[0], comma);
    yOut.textContent = decimal(P[1], comma);

    const svg = svgEl('svg', { viewBox: '0 0 340 340', role: 'img' });
    const defs = svgEl('defs', {});
    const clip = svgEl('clipPath', { id: 'sec-locus-clip' });
    clip.append(svgEl('rect', { x: X(-R), y: Y(R), width: 2 * R * S, height: 2 * R * S }));
    defs.append(clip);
    svg.append(defs, svgEl('rect', { x: X(-R), y: Y(R), width: 2 * R * S, height: 2 * R * S, fill: '#fff', stroke: '#EADFCB' }));
    for (let i = -R; i <= R; i += 1) {
      svg.append(
        svgEl('line', { x1: X(i), y1: Y(-R), x2: X(i), y2: Y(R), stroke: '#F1E8D8', 'stroke-width': 1 }),
        svgEl('line', { x1: X(-R), y1: Y(i), x2: X(R), y2: Y(i), stroke: '#F1E8D8', 'stroke-width': 1 }),
      );
    }
    const plotted = svgEl('g', { 'clip-path': 'url(#sec-locus-clip)' });
    const dashed = (x1: number, y1: number, x2: number, y2: number, color = '#878DA6') =>
      svgEl('line', { x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(y2), stroke: color, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
    const dot = (p: [number, number], name: string, color: string) => [
      svgEl('circle', { cx: X(p[0]), cy: Y(p[1]), r: 6, fill: color, stroke: '#fff', 'stroke-width': 2 }),
      svgEl('text', { x: X(p[0]) + 9, y: Y(p[1]) - 8, 'font-size': 14, 'font-weight': 800, fill: color }, name),
    ];

    if (mode === 'circle') {
      const d2 = P[0] ** 2 + P[1] ** 2;
      eq.textContent = `OP = ${dist(d2)}`;
      status.textContent = d2 === 25 ? T.locusOnCircle : d2 < 25 ? T.locusInside : T.locusOutside;
      plotted.append(
        svgEl('circle', { cx: X(0), cy: Y(0), r: 5 * S, fill: 'none', stroke: '#15803D', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }),
        dashed(0, 0, P[0], P[1], '#6D43D0'),
        ...dot([0, 0], 'O', '#1C2443'),
      );
    } else if (mode === 'bisector') {
      const dA = sq(P, A);
      const dB = sq(P, B);
      eq.textContent = `PA = ${dist(dA)}   ·   PB = ${dist(dB)}`;
      status.textContent = dA === dB ? T.locusEqualAB : dA < dB ? T.locusCloserA : T.locusCloserB;
      // Perpendicular bisector of A(−2, −1) and B(2, 3): x + y = 1.
      plotted.append(
        svgEl('line', { x1: X(-R), y1: Y(1 + R), x2: X(R), y2: Y(1 - R), stroke: '#15803D', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }),
        svgEl('line', { x1: X(A[0]), y1: Y(A[1]), x2: X(B[0]), y2: Y(B[1]), stroke: '#0B79C4', 'stroke-width': 3 }),
        dashed(P[0], P[1], A[0], A[1]),
        dashed(P[0], P[1], B[0], B[1]),
        ...dot(A, 'A', '#0B79C4'),
        ...dot(B, 'B', '#0B79C4'),
      );
    } else {
      // Right angle at O with sides along the positive axes; its bisector is y = x.
      eq.textContent = `${T.toHorizontal}: ${P[1]}   ·   ${T.toVertical}: ${P[0]}`;
      status.textContent = P[0] === P[1] ? T.locusEqualSides : P[1] < P[0] ? T.locusCloserH : T.locusCloserV;
      plotted.append(
        svgEl('line', { x1: X(0), y1: Y(0), x2: X(R), y2: Y(R), stroke: '#15803D', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }),
        svgEl('path', { d: `M${X(0)} ${Y(R)} V${Y(0)} H${X(R)}`, fill: 'none', stroke: '#0B79C4', 'stroke-width': 3 }),
        dashed(P[0], P[1], P[0], 0),
        dashed(P[0], P[1], 0, P[1]),
        ...dot([0, 0], 'O', '#1C2443'),
      );
    }
    plotted.append(...dot(P, 'P', '#6D43D0'));
    svg.append(plotted);
    svg.setAttribute('aria-label', `${eq.textContent}. ${status.textContent}`);
    view.replaceChildren(svg);
  };

  px.addEventListener('input', draw);
  py.addEventListener('input', draw);
  draw();
}

// ---------- Frequency table and bar chart ----------

function frequency(box: HTMLElement, T: Record<string, string>) {
  const counts = JSON.parse(box.dataset.counts || '[]') as number[];
  const names = JSON.parse(box.dataset.names || '[]') as string[];
  const view = box.querySelector<HTMLElement>('[data-freq-view]')!;
  const status = box.querySelector<HTMLElement>('[data-freq-status]')!;
  const comma = T.decimal;
  const MAX = 30;
  const colors = ['#0B79C4', '#C2410C', '#15803D', '#6D43D0', '#B45309', '#0F766E'];

  const draw = () => {
    const total = counts.reduce((s, c) => s + c, 0);
    counts.forEach((c, i) => {
      box.querySelector(`[data-freq-count="${i}"]`)!.textContent = String(c);
      const rel = box.querySelector(`[data-freq-rel="${i}"]`)!;
      rel.textContent = total ? `${c}/${total} ≈ ${decimal(Math.round((c / total) * 1000) / 10, comma)} %` : '—';
    });
    status.textContent = `${T.total}: ${total}`;

    const W = 340;
    const H = 200;
    const base = 160;
    const top = Math.max(5, Math.ceil(Math.max(...counts, 1) / 5) * 5);
    const slot = (W - 40) / counts.length;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `${T.total}: ${total}` });
    for (let v = 0; v <= top; v += 5) {
      const y = base - (v / top) * 140;
      svg.append(
        svgEl('line', { x1: 32, y1: y, x2: W - 6, y2: y, stroke: v === 0 ? '#4B5475' : '#F1E8D8', 'stroke-width': v === 0 ? 1.5 : 1 }),
        svgEl('text', { x: 26, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#4B5475' }, String(v)),
      );
    }
    counts.forEach((c, i) => {
      const h = (c / top) * 140;
      const x = 36 + i * slot + slot * 0.18;
      const w = slot * 0.64;
      svg.append(
        svgEl('rect', { x, y: base - h, width: w, height: h, rx: 3, fill: colors[i % colors.length] }),
        svgEl('text', { x: x + w / 2, y: base - h - 5, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#1C2443' }, String(c)),
        svgEl('text', { x: x + w / 2, y: base + 18, 'text-anchor': 'middle', 'font-size': 11, fill: '#1C2443' }, (names[i] ?? '').slice(0, 12)),
      );
    });
    view.replaceChildren(svg);
  };

  box.querySelectorAll<HTMLButtonElement>('[data-freq-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const i = Number(button.dataset.freqStep);
      counts[i] = Math.min(MAX, Math.max(0, counts[i] + Number(button.dataset.delta)));
      draw();
    });
  });
  draw();
}

// ---------- Repeated trials: relative frequency against the number of trials ----------

function trials(box: HTMLElement, T: Record<string, string>) {
  const coin = box.dataset.experiment === 'coin';
  const target = Number(box.dataset.target || '6');
  const p = coin ? 1 / 2 : 1 / 6;
  const pText = coin ? '1/2' : '1/6';
  const event = coin ? T.eventHeads : `${T.eventFace} ${target}`;
  const view = box.querySelector<HTMLElement>('[data-trials-view]')!;
  const last = box.querySelector<HTMLElement>('[data-trials-last]')!;
  const status = box.querySelector<HTMLElement>('[data-trials-status]')!;
  const runs = [...box.querySelectorAll<HTMLButtonElement>('[data-trials-run]')];
  const comma = T.decimal;
  const MAX = 5000;
  let n = 0;
  let hits = 0;
  let history: number[] = [];

  const draw = () => {
    const rel = n ? hits / n : 0;
    status.textContent = n
      ? `${T.trialsCount}: ${n} · ${event}: ${hits} · ${T.relFreq}: ${hits}/${n} ≈ ${decimal(Math.round(rel * 1000) / 1000, comma)}`
      : `${T.trialsCount}: 0`;
    if (n >= MAX) status.textContent += ` ${T.trialsMax}`;
    runs.forEach((b) => { b.disabled = n >= MAX; });

    const W = 340;
    const H = 200;
    const left = 34;
    const right = W - 10;
    const topY = 14;
    const bottomY = 176;
    const X = (i: number) => left + (i / Math.max(n, 10)) * (right - left);
    const Y = (v: number) => bottomY - v * (bottomY - topY);
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': status.textContent });
    for (const v of [0, 0.5, 1]) {
      svg.append(
        svgEl('line', { x1: left, y1: Y(v), x2: right, y2: Y(v), stroke: v === 0 ? '#4B5475' : '#F1E8D8', 'stroke-width': v === 0 ? 1.5 : 1 }),
        svgEl('text', { x: left - 6, y: Y(v) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#4B5475' }, decimal(v, comma)),
      );
    }
    svg.append(
      svgEl('line', { x1: left, y1: Y(p), x2: right, y2: Y(p), stroke: '#15803D', 'stroke-width': 2, 'stroke-dasharray': '6 5' }),
      svgEl('text', { x: right, y: Y(p) - 6, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 800, fill: '#15803D' }, pText),
      svgEl('text', { x: right, y: H - 4, 'text-anchor': 'end', 'font-size': 11, fill: '#4B5475' }, `${T.trialsCount}: ${n}`),
    );
    if (history.length) {
      const step = Math.max(1, Math.floor(history.length / 400));
      const pts: string[] = [];
      for (let i = 0; i < history.length; i += step) pts.push(`${X(i + 1).toFixed(1)},${Y(history[i]).toFixed(1)}`);
      pts.push(`${X(history.length).toFixed(1)},${Y(history[history.length - 1]).toFixed(1)}`);
      svg.append(svgEl('polyline', { points: pts.join(' '), fill: 'none', stroke: '#C2410C', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
    }
    view.replaceChildren(svg);
  };

  runs.forEach((button) => {
    button.addEventListener('click', () => {
      const times = Math.min(Number(button.dataset.trialsRun), MAX - n);
      let face = 0;
      for (let i = 0; i < times; i += 1) {
        face = coin ? (Math.random() < 0.5 ? 1 : 0) : 1 + Math.floor(Math.random() * 6);
        if (coin ? face === 1 : face === target) hits += 1;
        n += 1;
        history.push(hits / n);
      }
      if (times > 0) last.textContent = coin ? (face === 1 ? T.lastHeads : T.lastTails) : `${T.lastDie} ${face}`;
      draw();
    });
  });
  box.querySelector<HTMLButtonElement>('[data-trials-reset]')!.addEventListener('click', () => {
    n = 0;
    hits = 0;
    history = [];
    last.textContent = '—';
    draw();
  });
  draw();
}

// Start last, after every helper above is defined.
const root = document.querySelector<HTMLElement>('[data-sec-lesson]');
const dataNode = root?.querySelector<HTMLScriptElement>('[data-sec-data]');
if (root && dataNode) init(root, JSON.parse(dataNode.textContent || '{}') as ClientData);
