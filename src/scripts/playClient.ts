import { reconcileSyncedState } from '../game/core/syncState';
import {
  applyExerciseOutcome,
  AttemptRecord,
  COSMETIC_CATALOG,
  INITIAL_GAME_STATE,
  MascotMood,
  PLANET_DESTINATIONS,
  PlayerGameState,
  VEHICLE_TIERS,
} from '../game/core/gameState';
import { buildPlayUrl } from '../i18n/routes';
import { Locale, MathExercise, TopicId } from '../math/core/types';
import { validateMathAnswer } from '../math/core/validator';
import { generateMathExercise, TOPICS_CATALOG } from '../math/topics/generators';

const STORAGE_KEY = 'mundoki_game_state_v1';

export function loadLocalGameState(): PlayerGameState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlayerGameState>;
      return {
        ...INITIAL_GAME_STATE,
        ...parsed,
        topicMastery: {
          ...INITIAL_GAME_STATE.topicMastery,
          ...(parsed.topicMastery || {}),
        },
        equippedCosmetics: {
          ...INITIAL_GAME_STATE.equippedCosmetics,
          ...(parsed.equippedCosmetics || {}),
        },
        unlockedCosmetics: parsed.unlockedCosmetics || INITIAL_GAME_STATE.unlockedCosmetics,
        unlockedPlanets: parsed.unlockedPlanets || INITIAL_GAME_STATE.unlockedPlanets,
        pendingSyncAttempts: parsed.pendingSyncAttempts || [],
      };
    }
  } catch {
    // Ignore storage errors
  }
  return { ...INITIAL_GAME_STATE };
}

export function saveLocalGameState(state: PlayerGameState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

function updateMascotSvgDom(
  idPrefix: string,
  mood: MascotMood,
  state: PlayerGameState
): void {
  const svg = document.getElementById(`${idPrefix}-svg`);
  if (!svg) return;

  if (state.reducedMotion) {
    svg.classList.remove('mascot-animated');
  } else {
    svg.classList.add('mascot-animated');
  }

  const suit = state.equippedCosmetics.suit;
  const hat = state.equippedCosmetics.hat;
  const acc = state.equippedCosmetics.accessory;

  const bodyColor =
    suit === 'suit-quantum-vest'
      ? '#D97706'
      : suit === 'suit-explorer'
        ? '#0284C7'
        : '#334155';

  const chestAccent =
    suit === 'suit-quantum-vest'
      ? '#FEF3C7'
      : suit === 'suit-explorer'
        ? '#E0F2FE'
        : '#94A3B8';

  const torso = document.getElementById(`${idPrefix}-torso`);
  const chest = document.getElementById(`${idPrefix}-chest`);
  const symbol = document.getElementById(`${idPrefix}-symbol`);
  const armL = document.getElementById(`${idPrefix}-arm-left`);
  const armR = document.getElementById(`${idPrefix}-arm-right`);

  if (torso) torso.setAttribute('fill', bodyColor);
  if (chest) chest.setAttribute('fill', chestAccent);
  if (armL) {
    armL.setAttribute('stroke', bodyColor);
    armL.setAttribute(
      'd',
      mood === 'celebrating' ? 'M 64 124 Q 36 96 42 76' : 'M 64 124 Q 44 138 48 152'
    );
  }
  if (armR) {
    armR.setAttribute('stroke', bodyColor);
    armR.setAttribute(
      'd',
      mood === 'celebrating' ? 'M 136 124 Q 164 96 158 76' : 'M 136 124 Q 156 138 152 152'
    );
  }
  if (symbol) {
    symbol.textContent =
      mood === 'celebrating' || mood === 'happy'
        ? '+★'
        : mood === 'thinking'
          ? '=?'
          : 'π';
  }

  const faceIdle = document.getElementById(`${idPrefix}-face-idle`);
  const faceHappy = document.getElementById(`${idPrefix}-face-happy`);
  const faceThinking = document.getElementById(`${idPrefix}-face-thinking`);
  if (faceIdle) {
    faceIdle.style.display =
      mood === 'happy' || mood === 'celebrating' || mood === 'thinking' ? 'none' : '';
  }
  if (faceHappy) {
    faceHappy.style.display = mood === 'happy' || mood === 'celebrating' ? '' : 'none';
  }
  if (faceThinking) {
    faceThinking.style.display = mood === 'thinking' ? '' : 'none';
  }

  const hatHelmet = document.getElementById(`${idPrefix}-hat-helmet`);
  const hatCrown = document.getElementById(`${idPrefix}-hat-crown`);
  if (hatHelmet) hatHelmet.style.display = hat === 'hat-astro-helmet' ? '' : 'none';
  if (hatCrown) hatCrown.style.display = hat === 'hat-solar-crown' ? '' : 'none';

  const accVisor = document.getElementById(`${idPrefix}-acc-visor`);
  const bootL = document.getElementById(`${idPrefix}-boot-left`);
  const bootR = document.getElementById(`${idPrefix}-boot-right`);
  if (accVisor) accVisor.style.display = acc === 'acc-math-visor' ? '' : 'none';
  if (bootL) bootL.setAttribute('fill', acc === 'acc-gravity-boots' ? '#D97706' : '#475569');
  if (bootR) bootR.setAttribute('fill', acc === 'acc-gravity-boots' ? '#D97706' : '#475569');
}

export function initPlayAdventure(): void {
  const root = document.getElementById('play-adventure-root');
  if (!root) return;

  const locale = (root.dataset.locale || 'es-AR') as Locale;
  let activeTopic = (root.dataset.topicId || 'addition-subtraction') as TopicId;
  let difficulty: 1 | 2 | 3 = 1;
  let seed = 104 + Math.floor(Math.random() * 800);
  let gameState = loadLocalGameState();
  let currentExercise: MathExercise = generateMathExercise(activeTopic, difficulty, seed);
  let hintIndex = -1;
  let showSteps = false;
  let mood: MascotMood = 'idle';

  const promptEl = document.getElementById('play-prompt-text');
  const exprEl = document.getElementById('play-expression-box');
  const answerInput = document.getElementById('play-answer-input') as HTMLInputElement | null;
  const feedbackBox = document.getElementById('play-feedback-box');
  const hintBox = document.getElementById('play-hint-box');
  const stepsBox = document.getElementById('play-steps-box');
  const energyBadge = document.getElementById('play-energy-val');
  const starsBadge = document.getElementById('play-stars-val');
  const vehicleTitle = document.getElementById('play-vehicle-title');
  const vehicleTierLabel = document.getElementById('play-vehicle-tier');
  const vehicleBar = document.getElementById('play-vehicle-bar');
  const vehiclePct = document.getElementById('play-vehicle-pct');
  const guardianNameEl = document.getElementById('play-guardian-name');
  const guardianCountEl = document.getElementById('play-guardian-count');
  const guardianBar = document.getElementById('play-guardian-bar');
  const starMapSvg = document.getElementById('play-starmap-svg');
  const wardrobeGrid = document.getElementById('play-wardrobe-grid');
  const syncStatusEl = document.getElementById('play-sync-status');
  const btnReducedMotion = document.getElementById('btn-toggle-motion');

  function renderStarMap() {
    if (!starMapSvg) return;
    const currentVehicle =
      [...VEHICLE_TIERS]
        .reverse()
        .find((tier) => gameState.energy >= tier.requiredEnergy) || VEHICLE_TIERS[0];

    let svgHtml = '';
    const stars = [
      [40, 25],
      [125, 145],
      [210, 30],
      [295, 150],
      [380, 22],
      [455, 140],
      [545, 35],
      [630, 145],
    ];
    stars.forEach(([cx, cy], idx) => {
      svgHtml += `<circle cx="${cx}" cy="${cy}" r="${idx % 2 === 0 ? 1.8 : 1.2}" fill="#94A3B8" opacity="0.6" />`;
    });

    const pts = PLANET_DESTINATIONS.map(
      (p) => `${(p.coordinates.x * 680) / 100},${(p.coordinates.y * 185) / 100}`
    ).join(' ');
    svgHtml += `<polyline points="${pts}" fill="none" stroke="#334155" stroke-width="2.5" stroke-dasharray="6 4" />`;

    PLANET_DESTINATIONS.forEach((planet, index) => {
      const cx = (planet.coordinates.x * 680) / 100;
      const cy = (planet.coordinates.y * 185) / 100;
      const isUnlocked = gameState.unlockedPlanets.includes(planet.id);
      const isCurrent = planet.topicId === activeTopic;
      const guardianCleared = gameState.topicMastery[planet.topicId]?.guardianDefeated;

      svgHtml += `<g data-planet-topic="${planet.topicId}" style="cursor:pointer;">`;
      if (isCurrent) {
        svgHtml += `<circle cx="${cx}" cy="${cy}" r="27" fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="4 3" />`;
      }
      svgHtml += `<circle cx="${cx}" cy="${cy}" r="19" fill="${
        isUnlocked ? planet.colorHex : '#1E293B'
      }" stroke="${isCurrent ? '#FFFFFF' : isUnlocked ? '#CBD5E1' : '#475569'}" stroke-width="${
        isCurrent ? 3 : 1.5
      }" />`;
      svgHtml += `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11" font-family="monospace" font-weight="700" fill="#FFFFFF">${
        guardianCleared ? '✓' : index + 1
      }</text>`;
      svgHtml += `<text x="${cx}" y="${cy + 36}" text-anchor="middle" font-size="10" font-weight="600" fill="${
        isCurrent ? '#7DD3FC' : '#CBD5E1'
      }">${planet.name[locale]}</text></g>`;
    });

    const activePlanet =
      PLANET_DESTINATIONS.find((p) => p.topicId === activeTopic) || PLANET_DESTINATIONS[0];
    const sx = (activePlanet.coordinates.x * 680) / 100 - 18;
    const sy = (activePlanet.coordinates.y * 185) / 100 - 38;
    const shipColor =
      currentVehicle.level === 3
        ? '#F59E0B'
        : currentVehicle.level === 2
          ? '#38BDF8'
          : '#E2E8F0';
    svgHtml += `<g transform="translate(${sx}, ${sy})">
      <polygon points="-8,12 2,7 2,17" fill="#F59E0B" />
      <polygon points="2,4 28,12 2,20" fill="${shipColor}" stroke="#0F172A" stroke-width="1.5" />
      <circle cx="12" cy="12" r="3.5" fill="#0284C7" />
    </g>`;

    starMapSvg.innerHTML = svgHtml;

    starMapSvg.querySelectorAll<SVGGElement>('[data-planet-topic]').forEach((g) => {
      g.addEventListener('click', () => {
        const nextTopic = g.dataset.planetTopic as TopicId;
        if (nextTopic) {
          window.location.href = buildPlayUrl(locale, nextTopic);
        }
      });
    });
  }

  function renderWardrobe() {
    if (!wardrobeGrid) return;
    wardrobeGrid.innerHTML = COSMETIC_CATALOG.map((item) => {
      const unlocked = gameState.unlockedCosmetics.includes(item.id);
      const equipped = gameState.equippedCosmetics[item.slot] === item.id;
      return `
        <div class="card-subtle flex-between" style="opacity:${unlocked ? '1' : '0.65'};">
          <div>
            <div class="font-bold text-sm">${item.name[locale]}</div>
            <div class="text-xs text-muted">${item.description[locale]}</div>
          </div>
          ${
            unlocked
              ? `<button type="button" class="btn ${
                  equipped ? 'btn-emerald' : 'btn-outline'
                } btn-sm" data-equip-slot="${item.slot}" data-equip-id="${
                  equipped ? '' : item.id
                }">
                  ${
                    equipped
                      ? locale === 'es-AR'
                        ? 'Equipado ✓'
                        : 'Equipped ✓'
                      : locale === 'es-AR'
                        ? 'Equipar'
                        : 'Equip'
                  }
                </button>`
              : `<span class="text-xs text-mono text-muted">🔒 ${item.requiredStars}★</span>`
          }
        </div>
      `;
    }).join('');

    wardrobeGrid.querySelectorAll<HTMLButtonElement>('[data-equip-slot]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const slot = btn.dataset.equipSlot as 'hat' | 'suit' | 'accessory';
        const itemId = btn.dataset.equipId || null;
        gameState.equippedCosmetics[slot] = itemId;
        saveLocalGameState(gameState);
        renderAll();

        const token = window.localStorage.getItem('mundoki_token');
        if (token) {
          fetch('/api/progress/cosmetics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ slot, itemId }),
          }).catch(() => {});
        }
      });
    });
  }

  function renderAll() {
    document.documentElement.setAttribute(
      'data-reduced-motion',
      gameState.reducedMotion ? 'true' : 'false'
    );
    if (btnReducedMotion) {
      btnReducedMotion.textContent = gameState.reducedMotion
        ? locale === 'es-AR'
          ? 'Movimiento Reducido: Sí'
          : 'Reduced Motion: On'
        : locale === 'es-AR'
          ? 'Movimiento Reducido: No'
          : 'Reduced Motion: Off';
    }

    updateMascotSvgDom('play-atomo', mood, gameState);

    if (promptEl) promptEl.textContent = currentExercise.prompt[locale];
    if (exprEl) exprEl.textContent = currentExercise.expressionLatex.replace(/\\times/g, '×').replace(/\\div/g, '÷');

    if (energyBadge) energyBadge.textContent = `${gameState.energy}⚡`;
    if (starsBadge) starsBadge.textContent = `${gameState.stars}★`;

    const currentVehicle =
      [...VEHICLE_TIERS]
        .reverse()
        .find((tier) => gameState.energy >= tier.requiredEnergy) || VEHICLE_TIERS[0];
    const nextVehicle = VEHICLE_TIERS.find((tier) => tier.requiredEnergy > gameState.energy);
    const pct = nextVehicle
      ? Math.min(100, Math.round((gameState.energy / nextVehicle.requiredEnergy) * 100))
      : 100;

    if (vehicleTitle) vehicleTitle.textContent = currentVehicle.name[locale];
    if (vehicleTierLabel) {
      vehicleTierLabel.textContent =
        locale === 'es-AR' ? `Nivel ${currentVehicle.level}` : `Tier ${currentVehicle.level}`;
    }
    if (vehicleBar) vehicleBar.style.width = `${pct}%`;
    if (vehiclePct) vehiclePct.textContent = `${pct}%`;

    const activePlanet =
      PLANET_DESTINATIONS.find((p) => p.topicId === activeTopic) || PLANET_DESTINATIONS[0];
    const solvedInTopic = gameState.topicMastery[activeTopic]?.solved || 0;
    const gProg = Math.min(3, solvedInTopic);
    if (guardianNameEl) guardianNameEl.textContent = activePlanet.guardianName[locale];
    if (guardianCountEl) guardianCountEl.textContent = `${gProg}/3`;
    if (guardianBar) guardianBar.style.width = `${Math.round((gProg / 3) * 100)}%`;

    if (syncStatusEl) {
      const pendingCount = gameState.pendingSyncAttempts.length;
      syncStatusEl.textContent =
        locale === 'es-AR'
          ? `Intentos locales en cola: ${pendingCount}`
          : `Queued local attempts: ${pendingCount}`;
    }

    renderStarMap();
    renderWardrobe();
  }

  function loadNewChallenge() {
    seed += 7;
    currentExercise = generateMathExercise(activeTopic, difficulty, seed);
    hintIndex = -1;
    showSteps = false;
    mood = 'idle';
    if (answerInput) {
      answerInput.value = '';
      answerInput.focus();
    }
    if (feedbackBox) feedbackBox.style.display = 'none';
    if (hintBox) hintBox.style.display = 'none';
    if (stepsBox) stepsBox.style.display = 'none';
    renderAll();
  }

  const form = document.getElementById('play-answer-form') as HTMLFormElement | null;
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!answerInput) return;
    const rawAns = answerInput.value.trim();
    const validation = validateMathAnswer(currentExercise, rawAns);

    const isCorrect = validation.status === 'correct';
    const attempt: AttemptRecord = {
      attemptId: `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      exerciseId: currentExercise.id,
      topicId: activeTopic,
      seed: currentExercise.seed,
      difficulty,
      userAnswer: rawAns,
      isCorrect,
      timestamp: new Date().toISOString(),
      syncedToServer: false,
    };

    const isPremium = window.localStorage.getItem('mundoki_premium') === 'true';
    const { nextState, events } = applyExerciseOutcome(gameState, attempt, isPremium);
    gameState = nextState;
    saveLocalGameState(gameState);

    if (isCorrect) {
      mood = events.length > 1 ? 'celebrating' : 'happy';
      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'callout callout-emerald stack-sm';
        const eventMessages = events
          .map((ev) => {
            if (ev.type === 'ENERGY_EARNED') {
              return locale === 'es-AR'
                ? `+${ev.amount}⚡ de energía para la nave`
                : `+${ev.amount}⚡ spacecraft energy`;
            }
            if (ev.type === 'OUTFIT_UNLOCKED') {
              const item = COSMETIC_CATALOG.find((c) => c.id === ev.itemId);
              return locale === 'es-AR'
                ? `¡Nuevo traje desbloqueado: ${item?.name[locale]}!`
                : `New outfit unlocked: ${item?.name[locale]}!`;
            }
            if (ev.type === 'VEHICLE_UPGRADED') {
              return locale === 'es-AR' ? '¡Nave espacial mejorada!' : 'Spacecraft upgraded!';
            }
            if (ev.type === 'PLANET_UNLOCKED') {
              return locale === 'es-AR' ? '¡Nuevo planeta desbloqueado!' : 'New planet unlocked!';
            }
            if (ev.type === 'GUARDIAN_OVERCOME') {
              return locale === 'es-AR'
                ? '¡Desafío del Guardián completado!'
                : 'Guardian challenge completed!';
            }
            return '';
          })
          .filter(Boolean)
          .join(' · ');

        feedbackBox.innerHTML = `<strong>${
          locale === 'es-AR' ? '¡Respuesta correcta!' : 'Correct answer!'
        }</strong> (${validation.expectedCanonicalAnswer}) — ${eventMessages}`;
      }
    } else {
      mood = 'thinking';
      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'callout callout-amber stack-sm';
        const hintText = currentExercise.hints[0]?.[locale] || '';
        feedbackBox.innerHTML = `<strong>${
          locale === 'es-AR'
            ? 'Todavía no es exacto. ¡Intentá de nuevo sin penalización!'
            : 'Not quite there yet. Try again with zero penalty!'
        }</strong><div>${hintText}</div>`;
      }
    }

    renderAll();
  });

  document.getElementById('btn-next-challenge')?.addEventListener('click', loadNewChallenge);

  document.getElementById('btn-request-hint')?.addEventListener('click', () => {
    mood = 'thinking';
    hintIndex = Math.min(currentExercise.hints.length - 1, hintIndex + 1);
    if (hintBox) {
      hintBox.style.display = 'block';
      hintBox.textContent = `💡 ${currentExercise.hints[hintIndex]?.[locale] || ''}`;
    }
    renderAll();
  });

  document.getElementById('btn-show-steps')?.addEventListener('click', () => {
    showSteps = !showSteps;
    if (stepsBox) {
      stepsBox.style.display = showSteps ? 'block' : 'none';
      stepsBox.innerHTML = `<ol style="margin:0;padding-left:20px;">${currentExercise.solutionSteps
        .map((s) => `<li>${s[locale]}</li>`)
        .join('')}</ol>`;
    }
  });

  document.querySelectorAll<HTMLButtonElement>('[data-diff-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      difficulty = (Number(btn.dataset.diffBtn) || 1) as 1 | 2 | 3;
      document.querySelectorAll<HTMLButtonElement>('[data-diff-btn]').forEach((b) => {
        b.className =
          Number(b.dataset.diffBtn) === difficulty
            ? 'btn btn-primary btn-sm'
            : 'btn btn-outline btn-sm';
      });
      loadNewChallenge();
    });
  });

  btnReducedMotion?.addEventListener('click', () => {
    gameState.reducedMotion = !gameState.reducedMotion;
    saveLocalGameState(gameState);
    renderAll();
  });

  document.getElementById('btn-sync-server')?.addEventListener('click', async () => {
    const token = window.localStorage.getItem('mundoki_token');
    if (!token) {
      if (syncStatusEl) {
        syncStatusEl.textContent =
          locale === 'es-AR'
            ? 'Iniciá sesión en Cuenta para sincronizar tus intentos en el servidor D1.'
            : 'Sign in under Account to synchronize your attempts with the D1 server.';
      }
      return;
    }

    try {
      const res = await fetch('/api/progress/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attempts: gameState.pendingSyncAttempts }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.gameState) {
          gameState = reconcileSyncedState(gameState, data.gameState,
            data.syncedAttemptIds || [], data.isPremiumEntitled);
          saveLocalGameState(gameState);
          renderAll();
        }
        if (syncStatusEl) {
          syncStatusEl.textContent =
            locale === 'es-AR'
              ? '✓ Progreso verificado y guardado en el servidor D1.'
              : '✓ Progress verified and saved on the D1 server.';
        }
      }
    } catch {
      if (syncStatusEl) {
        syncStatusEl.textContent =
          locale === 'es-AR'
            ? 'Sin conexión: los intentos siguen guardados localmente.'
            : 'Offline: attempts remain safely queued in browser storage.';
      }
    }
  });

  renderAll();
}
