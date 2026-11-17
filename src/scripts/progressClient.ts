// Fills the "Estrellas" page from this browser: the star total, missions per
// grade (from the mission questions already answered right) and a few plain
// numbers for the family. Answers still waiting for the server are sent first.
import { GRADE_STORAGE_KEY } from '../content/savedGrade';
import { Locale } from '../math/core/types';
import { loadLocalGameState } from './gameStateStorage';
import { readCounted, syncNow } from './missionProgress';

interface WorldData {
  gradeId: string;
  missions: { id: string; checks: number }[];
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function initProgressDashboard(): void {
  const root = document.getElementById('progress-dashboard-root');
  if (!root) return;

  const locale = (root.dataset.locale || 'es-AR') as Locale;
  const L = (es: string, en: string) => (locale === 'es-AR' ? es : en);
  const number = (value: number) => value.toLocaleString(locale);
  const setText = (id: string, value: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  let worlds: WorldData[] = [];
  try {
    worlds = JSON.parse(document.getElementById('prog-worlds-data')?.textContent || '[]');
  } catch {
    worlds = [];
  }

  function render() {
    const state = loadLocalGameState();
    const counted = new Set(readCounted());
    const savedGrade = readStorage(GRADE_STORAGE_KEY);
    let missionsDone = 0;
    let shown = 0;

    const container = document.getElementById('prog-worlds');
    for (const world of worlds) {
      const card = container?.querySelector<HTMLElement>(`[data-world="${world.gradeId}"]`);
      if (!card) continue;

      let stars = 0;
      let done = 0;
      for (const mission of world.missions) {
        let answered = 0;
        for (let i = 0; i < mission.checks; i += 1) if (counted.has(`${mission.id}:${i}`)) answered += 1;
        stars += answered;
        if (mission.checks > 0 && answered === mission.checks) done += 1;
      }
      missionsDone += done;

      // Only worlds the child has started, plus the grade they picked last.
      const visible = stars > 0 || savedGrade === world.gradeId;
      card.hidden = !visible;
      if (!visible) continue;
      shown += 1;
      if (savedGrade === world.gradeId) container?.prepend(card);

      const total = world.missions.length;
      const missionsText = L(`${done} de ${total} misiones`, `${done} of ${total} missions`);
      const bar = card.querySelector<HTMLElement>('[data-world-bar]');
      if (bar) {
        bar.setAttribute('aria-label', missionsText);
        const fill = bar.querySelector<HTMLElement>('span');
        if (fill) fill.style.width = `${total ? Math.round((done / total) * 100) : 0}%`;
      }
      const missionsEl = card.querySelector('[data-world-missions]');
      if (missionsEl) missionsEl.textContent = missionsText;
      const starsEl = card.querySelector('[data-world-stars]');
      if (starsEl) starsEl.textContent = number(stars);
      const link = card.querySelector('[data-world-link]');
      if (link) link.textContent = stars > 0 ? L('Seguir', 'Continue') : L('Empezar', 'Start');
    }

    const empty = document.getElementById('prog-empty');
    if (empty) empty.hidden = shown > 0;

    setText('prog-stat-stars', number(state.stars));
    setText('prog-stat-missions', number(missionsDone));
    setText('prog-stat-solved', number(state.totalSolved));
    setText(
      'prog-stat-accuracy',
      state.totalAttempts > 0 ? `${Math.round((state.totalSolved / state.totalAttempts) * 100)}%` : '—'
    );

    const signedIn = Boolean(readStorage('mundoki_token'));
    const pending = state.pendingSyncAttempts.length;
    setText(
      'prog-save-status',
      !signedIn
        ? L(
            'Las estrellas se guardan solo en este dispositivo. Con una cuenta de la familia no se pierden y se ven en cualquier dispositivo.',
            'Stars are kept only on this device. With a family account they are never lost and show on any device.'
          )
        : pending > 0
          ? L(
              `Faltan guardar ${pending} respuestas en la cuenta. Se guardan solas cuando hay conexión.`,
              `${pending} answers are still waiting to be saved to the account. They save on their own when online.`
            )
          : L('Todo está guardado en la cuenta de la familia.', 'Everything is saved to the family account.')
    );
    const accountLink = document.getElementById('prog-account-link');
    if (accountLink) accountLink.hidden = signedIn;
  }

  render();
  if (loadLocalGameState().pendingSyncAttempts.length) {
    void syncNow().then(render);
  }
}
