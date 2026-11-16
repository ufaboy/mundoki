import { reconcileSyncedState } from '../game/core/syncState';
import { COSMETIC_CATALOG, VEHICLE_TIERS } from '../game/core/gameState';
import { buildLearnTopicUrl, buildPlayUrl } from '../i18n/routes';
import { Locale } from '../math/core/types';
import { TOPICS_CATALOG } from '../math/topics/generators';
import { loadLocalGameState, saveLocalGameState } from './playClient';

export function initProgressDashboard(): void {
  const root = document.getElementById('progress-dashboard-root');
  if (!root) return;

  const locale = (root.dataset.locale || 'es-AR') as Locale;
  let state = loadLocalGameState();

  function render() {
    const accuracy =
      state.totalAttempts > 0
        ? Math.round((state.totalSolved / state.totalAttempts) * 100)
        : 100;

    const solvedEl = document.getElementById('prog-stat-solved');
    const accEl = document.getElementById('prog-stat-accuracy');
    const energyEl = document.getElementById('prog-stat-energy');
    const pendingEl = document.getElementById('prog-stat-pending');

    if (solvedEl) solvedEl.textContent = String(state.totalSolved);
    if (accEl) accEl.textContent = `${accuracy}%`;
    if (energyEl) energyEl.textContent = `${state.energy}⚡`;
    if (pendingEl) pendingEl.textContent = String(state.pendingSyncAttempts.length);

    const topicsContainer = document.getElementById('prog-topics-list');
    if (topicsContainer) {
      topicsContainer.innerHTML = TOPICS_CATALOG.map((topic) => {
        const mastery = state.topicMastery[topic.id] || {
          solved: 0,
          attempts: 0,
          guardianDefeated: false,
        };
        const pct = Math.min(100, Math.round((mastery.solved / 3) * 100));
        return `
          <div class="card-subtle stack-sm">
            <div class="flex-between">
              <div>
                <strong>${topic.title[locale]}</strong>
                <div class="text-xs text-muted">${topic.planetName[locale]} · ${topic.guardianName[locale]}</div>
              </div>
              <span class="text-mono font-bold text-sm">
                ${mastery.solved}/3 ${mastery.guardianDefeated ? '✓' : ''}
              </span>
            </div>
            <div class="progress-track">
              <div class="progress-fill progress-fill-emerald" style="width:${pct}%;"></div>
            </div>
            <div class="flex-row text-xs">
              <a href="${buildLearnTopicUrl(locale, topic.id)}">${
                locale === 'es-AR' ? 'Repasar Lección' : 'Review Lesson'
              }</a>
              <span>·</span>
              <a href="${buildPlayUrl(locale, topic.id)}">${
                locale === 'es-AR' ? 'Practicar en Aventura →' : 'Practice in Adventure →'
              }</a>
            </div>
          </div>
        `;
      }).join('');
    }

    const rewardsContainer = document.getElementById('prog-rewards-list');
    if (rewardsContainer) {
      const currentVehicle =
        [...VEHICLE_TIERS]
          .reverse()
          .find((tier) => state.energy >= tier.requiredEnergy) || VEHICLE_TIERS[0];

      rewardsContainer.innerHTML = `
        <div class="card-subtle stack-sm">
          <div class="text-xs text-muted">${locale === 'es-AR' ? 'Nave Activa' : 'Active Spacecraft'}</div>
          <strong>${currentVehicle.name[locale]}</strong>
          <div class="text-xs">${currentVehicle.description[locale]}</div>
        </div>
        ${COSMETIC_CATALOG.map((item) => {
          const unlocked = state.unlockedCosmetics.includes(item.id);
          return `
            <div class="card-subtle stack-sm" style="opacity:${unlocked ? '1' : '0.55'};">
              <div class="flex-between">
                <strong>${item.name[locale]}</strong>
                <span class="text-xs text-mono">${unlocked ? '✓' : `🔒 ${item.requiredStars}★`}</span>
              </div>
              <div class="text-xs text-muted">${item.description[locale]}</div>
            </div>
          `;
        }).join('')}
      `;
    }
  }

  document.getElementById('btn-prog-sync')?.addEventListener('click', async () => {
    const token = window.localStorage.getItem('mundoki_token');
    const msgEl = document.getElementById('prog-sync-message');
    if (!token) {
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.className = 'callout callout-amber text-sm';
        msgEl.textContent =
          locale === 'es-AR'
            ? 'Iniciá sesión en Cuenta para sincronizar tu progreso en Cloudflare D1.'
            : 'Sign in under Account to sync your progress to Cloudflare D1.';
      }
      return;
    }

    const res = await fetch('/api/progress/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ attempts: state.pendingSyncAttempts }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.gameState) {
        state = reconcileSyncedState(state, data.gameState, data.syncedAttemptIds || [], data.isPremiumEntitled);
        saveLocalGameState(state);
        render();
      }
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.className = 'callout callout-emerald text-sm';
        msgEl.textContent =
          locale === 'es-AR'
            ? '✓ Sincronización completada. Los intentos pendientes se conservan para el próximo envío.'
            : '✓ All attempts were verified and saved on the server.';
      }
    }
  });

  render();
}
