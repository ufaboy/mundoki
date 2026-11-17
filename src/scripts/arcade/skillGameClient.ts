import {
  evaluateSkillAnswer,
  generateSkillChallenge,
  type SkillChallenge,
  type SkillDifficulty,
  type SkillGameId,
} from '../../math/arcade/skillGames';
import type { Locale } from '../../math/core/types';
import { readStoredHero, resizeCanvasToDisplaySize } from './canvasUtils';
import type { SkillScene } from './sceneTypes';
import { AdditionCylindersScene } from './scenes/additionCylinders';
import { DivisionGondolaScene } from './scenes/divisionGondola';
import { MultiplicationCannonScene } from './scenes/multiplicationCannon';
import { SubtractionBalloonScene } from './scenes/subtractionBalloon';

const LOGICAL_W = 840;
const LOGICAL_H = 440;

function createScene(skill: SkillGameId, locale: Locale): SkillScene {
  const hero = readStoredHero();
  const ctxInfo = { locale, hero };
  switch (skill) {
    case 'addition':
      return new AdditionCylindersScene(ctxInfo);
    case 'subtraction':
      return new SubtractionBalloonScene(ctxInfo);
    case 'multiplication':
      return new MultiplicationCannonScene(ctxInfo);
    case 'division':
      return new DivisionGondolaScene(ctxInfo);
  }
}

export function initSkillGame(): void {
  const root = document.getElementById('skill-game-root');
  if (!root) return;

  const skill = (root.dataset.skill || 'addition') as SkillGameId;
  const locale = (root.dataset.locale || 'es-AR') as Locale;
  const es = locale === 'es-AR';

  const canvas = document.getElementById('skill-game-canvas') as HTMLCanvasElement | null;
  const promptEl = document.getElementById('skill-prompt');
  const eqEl = document.getElementById('skill-equation');
  const form = document.getElementById('skill-answer-form') as HTMLFormElement | null;
  const input = document.getElementById('skill-answer-input') as HTMLInputElement | null;
  const submitBtn = document.getElementById('skill-submit-btn') as HTMLButtonElement | null;
  const nextBtn = document.getElementById('skill-next-btn') as HTMLButtonElement | null;
  const feedbackEl = document.getElementById('skill-feedback');
  const scoreEl = document.getElementById('skill-score');
  const streakEl = document.getElementById('skill-streak');
  const motionBtn = document.getElementById('skill-motion-btn') as HTMLButtonElement | null;
  const diffButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-skill-diff]')
  );
  const keypadButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-keypad]')
  );

  if (!canvas || !form || !input || !submitBtn || !nextBtn) return;

  let difficulty: SkillDifficulty = 1;
  let seed = Math.floor(Date.now() % 100000) + 17;
  let score = 0;
  let streak = 0;
  let busy = false;
  let roundWon = false;
  let reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = createScene(skill, locale);
  let challenge: SkillChallenge = generateSkillChallenge(skill, difficulty, seed);
  scene.reset(challenge);

  const updateMotionLabel = () => {
    if (!motionBtn) return;
    motionBtn.setAttribute('aria-pressed', reducedMotion ? 'true' : 'false');
    motionBtn.textContent = reducedMotion
      ? es
        ? 'Movimiento reducido: Sí'
        : 'Reduced motion: On'
      : es
        ? 'Movimiento reducido: No'
        : 'Reduced motion: Off';
  };

  const setFeedback = (msg: string, tone: 'neutral' | 'ok' | 'retry') => {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.dataset.tone = tone;
  };

  const renderChallengeUI = () => {
    if (promptEl) promptEl.textContent = challenge.prompt[locale];
    if (eqEl) eqEl.textContent = challenge.equationText;
    input.value = '';
    input.disabled = false;
    submitBtn.disabled = false;
    nextBtn.hidden = true;
    roundWon = false;
    busy = false;
    setFeedback('', 'neutral');
    input.focus();
  };

  const startNewRound = () => {
    seed += 37;
    challenge = generateSkillChallenge(skill, difficulty, seed);
    scene.reset(challenge);
    renderChallengeUI();
  };

  updateMotionLabel();
  renderChallengeUI();

  motionBtn?.addEventListener('click', () => {
    reducedMotion = !reducedMotion;
    updateMotionLabel();
  });

  diffButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (busy) return;
      const nextDiff = Number(btn.dataset.skillDiff) as SkillDifficulty;
      if (nextDiff !== 1 && nextDiff !== 2 && nextDiff !== 3) return;
      difficulty = nextDiff;
      diffButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('mk-btn--primary', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      startNewRound();
    });
  });

  keypadButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (busy || roundWon) return;
      const key = btn.dataset.keypad || '';
      if (key === 'clear') {
        input.value = '';
      } else if (key === 'back') {
        input.value = input.value.slice(0, -1);
      } else {
        if (input.value.length < 5) {
          input.value += key;
        }
      }
      input.focus();
    });
  });

  nextBtn.addEventListener('click', () => {
    startNewRound();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (busy) return;
    if (roundWon) {
      startNewRound();
      return;
    }

    const evalRes = evaluateSkillAnswer(challenge, input.value);
    if (!evalRes.valid || evalRes.numericValue === null) {
      setFeedback(
        es ? 'Escribí un número entero para probar.' : 'Enter a whole number to try.',
        'retry'
      );
      input.focus();
      return;
    }

    busy = true;
    input.disabled = true;
    submitBtn.disabled = true;
    setFeedback(es ? '¡En marcha!' : 'Here we go!', 'neutral');

    scene.playAttempt(evalRes.numericValue, challenge, (won) => {
      busy = false;
      if (won) {
        roundWon = true;
        score += 10 * difficulty;
        streak += 1;
        if (scoreEl) scoreEl.textContent = String(score);
        if (streakEl) streakEl.textContent = String(streak);
        if (eqEl) {
          eqEl.textContent = challenge.equationText.replace('?', String(challenge.answer));
        }
        setFeedback(
          es
            ? `¡Excelente! +${10 * difficulty} puntos.`
            : `Awesome! +${10 * difficulty} points.`,
          'ok'
        );
        nextBtn.hidden = false;
        nextBtn.focus();
      } else {
        streak = 0;
        if (streakEl) streakEl.textContent = '0';
        input.disabled = false;
        submitBtn.disabled = false;
        setFeedback(
          es ? 'Casi — revisá el cálculo y probá de nuevo.' : 'Almost — check the math and try again.',
          'retry'
        );
        input.select();
        input.focus();
      }
    });
  });

  // 60fps Canvas Loop
  let lastTs = performance.now();
  const frame = (ts: number) => {
    const dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;
    scene.update(dt, reducedMotion);
    const ctx = resizeCanvasToDisplaySize(canvas, LOGICAL_W, LOGICAL_H);
    if (ctx) {
      scene.render(ctx, LOGICAL_W, LOGICAL_H);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

initSkillGame();
