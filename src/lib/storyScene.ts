// The picture a young child works with in a story mission: rows of objects that
// can be tapped (marked), spread out, put in order, walked along (pages, steps,
// days), measured as strips of equal blocks, or crossed as a 3 × 3 map.
// One renderer for the server page and for "new numbers" in the browser, so a
// generated question draws exactly like an authored one. Styles: .mk-scene in
// design-system.css. Behaviour: wireStoryScene().
import type { Locale, LocalizedText } from '../math/core/types';

export interface StorySceneRow {
  label: string;
  items: string[];
}

export type StorySceneKind = 'groups' | 'tens' | 'track' | 'cards' | 'bars' | 'route';

export interface StorySceneTrack {
  start: number;
  target: number;
  direction: 1 | -1;
  /** What one move is called on the button. */
  unit?: 'page' | 'step' | 'day';
}

export interface StoryScene {
  kind: StorySceneKind;
  rows: StorySceneRow[];
  after?: StorySceneRow[];
  spread?: boolean;
  track?: StorySceneTrack;
  /** Route maps: 9 cells, left to right from the top row. */
  route?: { start: number; goal: number };
}

interface LocalizedRow {
  label: LocalizedText;
  items: (LocalizedText | string)[];
}

/** Authored episode kinds that draw with one of the scene kinds. */
const KIND_OF: Record<string, StorySceneKind> = {
  groups: 'groups', people: 'groups', shapes: 'groups', solids: 'groups', sorting: 'groups', votes: 'groups',
  tens: 'tens',
  track: 'track', calendar: 'track',
  cards: 'cards', plant: 'cards',
  bars: 'bars', lengths: 'bars', measure: 'bars',
  route: 'route',
};

/** Picks one language from authored (localized) or generated (plain) rows. */
export function localizeScene(
  scene: { kind: string; rows: LocalizedRow[]; after?: LocalizedRow[]; spread?: boolean; track?: StorySceneTrack; route?: StoryScene['route'] },
  locale: Locale
): StoryScene {
  const rows = (list: LocalizedRow[]) =>
    list.map((row) => ({ label: row.label[locale], items: row.items.map((item) => (typeof item === 'string' ? item : item[locale])) }));
  return {
    kind: KIND_OF[scene.kind] ?? 'groups',
    rows: rows(scene.rows),
    ...(scene.after ? { after: rows(scene.after) } : {}),
    ...(scene.spread ? { spread: true } : {}),
    ...(scene.track ? { track: scene.track } : {}),
    ...(scene.route ? { route: scene.route } : {}),
  };
}

const WORDS = {
  'es-AR': {
    empty: 'Vacío · 0', spread: 'Separar', gather: 'Juntar', order: 'Ordenar', mixed: 'Como estaban', change: 'Ver el cambio', before: 'Como estaba', clear: 'Borrar marcas',
    forward: { page: 'Pasar una página', step: 'Avanzar', day: 'Día siguiente' },
    back: { page: 'Volver una página', step: 'Retroceder', day: 'Día anterior' },
    up: 'Arriba', down: 'Abajo', left: 'Izquierda', right: 'Derecha', restart: 'Volver a la salida',
  },
  'en-US': {
    empty: 'Empty · 0', spread: 'Spread out', gather: 'Put together', order: 'Put in order', mixed: 'As they were', change: 'See the change', before: 'As before', clear: 'Clear marks',
    forward: { page: 'Turn one page', step: 'Move forward', day: 'Next day' },
    back: { page: 'Turn back one page', step: 'Move back', day: 'Day before' },
    up: 'Up', down: 'Down', left: 'Left', right: 'Right', restart: 'Back to the start',
  },
} as const;

function escape(value: string): string {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

/** Names and words get a text-sized card; emoji, digits and shapes stay big. */
const isWord = (value: string) => /\p{L}{2}/u.test(value);

function itemHtml(kind: StorySceneKind, label: string, value: string, index: number): string {
  if (kind === 'bars') {
    if (value === '·') return '<span class="mk-scene__gap" aria-hidden="true"></span>';
    return `<button type="button" class="mk-scene__unit" data-mk-scene-item data-value="${escape(value)}" aria-pressed="false" aria-label="${escape(`${label} · ${index + 1}`)}"><span class="mk-scene__mark" aria-hidden="true">✓</span></button>`;
  }
  const isTen = kind === 'tens' && value === '10';
  const content = isTen
    ? `<span class="mk-scene__ten" aria-hidden="true">${'<i></i>'.repeat(10)}</span><span>10</span>`
    : `<span class="mk-scene__thing">${escape(value)}</span>`;
  const classes = ['mk-scene__item', isTen ? 'mk-scene__item--ten' : '', !isTen && isWord(value) ? 'mk-scene__item--word' : ''].filter(Boolean).join(' ');
  return `<button type="button" class="${classes}" data-mk-scene-item data-value="${escape(value)}" aria-pressed="false" aria-label="${escape(`${label} · ${index + 1}: ${value}`)}">${content}<span class="mk-scene__mark" aria-hidden="true">✓</span></button>`;
}

function rowsHtml(scene: StoryScene, rows: StorySceneRow[], locale: Locale): string {
  return rows
    .map((row) => {
      const items = row.items.length
        ? row.items.map((value, index) => itemHtml(scene.kind, row.label, value, index)).join('')
        : `<span class="mk-scene__empty">${WORDS[locale].empty}</span>`;
      return `<div class="mk-scene__row"><p class="mk-label">${escape(row.label)}</p><div class="mk-scene__items">${items}</div></div>`;
    })
    .join('');
}

function routeHtml(scene: StoryScene, locale: Locale): string {
  const words = WORDS[locale];
  const row = scene.rows[0];
  const cells = row.items
    .map((value, index) => `<span class="mk-scene__cell" data-mk-scene-cell="${index}">${escape(value === '□' ? '' : value)}</span>`)
    .join('');
  const arrows = ([['up', '↑'], ['left', '←'], ['down', '↓'], ['right', '→']] as const)
    .map(([direction, arrow]) => `<button type="button" class="mk-btn mk-btn--icon" data-mk-scene-move="${direction}" aria-label="${words[direction]}">${arrow}</button>`)
    .join('');
  return `<div class="mk-scene__view" data-mk-scene-view="0"><div class="mk-scene__row"><p class="mk-label">${escape(row.label)}</p><div class="mk-scene__map" role="img" aria-label="${escape(row.label)}">${cells}</div></div><div class="mk-scene__arrows">${arrows}</div></div>`;
}

export function storySceneHtml(scene: StoryScene, locale: Locale): string {
  const words = WORDS[locale];
  const views =
    scene.kind === 'route'
      ? routeHtml(scene, locale)
      : [
          `<div class="mk-scene__view" data-mk-scene-view="0">${rowsHtml(scene, scene.rows, locale)}</div>`,
          scene.after ? `<div class="mk-scene__view${scene.spread ? ' mk-scene__view--spread' : ''}" data-mk-scene-view="1" hidden>${rowsHtml(scene, scene.after, locale)}</div>` : '',
        ].join('');
  const toggle = (() => {
    if (!scene.after) return '';
    const [on, off] = scene.spread ? [`↔ ${words.spread}`, words.gather] : scene.kind === 'cards' ? [words.order, words.mixed] : [words.change, words.before];
    return `<button type="button" class="mk-btn" data-mk-scene-toggle data-on="${on}" data-off="${off}">${on}</button>`;
  })();
  const unit = scene.track?.unit ?? 'step';
  const tools = [
    toggle,
    scene.track ? `<button type="button" class="mk-btn" data-mk-scene-hop>${scene.track.direction < 0 ? `← ${words.back[unit]}` : `${words.forward[unit]} →`}</button>` : '',
    scene.kind === 'route' ? `<button type="button" class="mk-btn mk-btn--quiet" data-mk-scene-clear>${words.restart}</button>` : `<button type="button" class="mk-btn mk-btn--quiet" data-mk-scene-clear>${words.clear}</button>`,
  ].join('');
  const attrs = [
    scene.track ? ` data-track-start="${scene.track.start}" data-track-target="${scene.track.target}" data-track-direction="${scene.track.direction}"` : '',
    scene.route ? ` data-route-start="${scene.route.start}" data-route-goal="${scene.route.goal}"` : '',
  ].join('');
  return `<div class="mk-scene mk-scene--${scene.kind}" data-mk-scene${attrs}>${views}<div class="mk-scene__tools">${tools}</div><p class="mk-scene__status" data-mk-scene-status role="status" aria-live="polite"></p></div>`;
}

/** One move on a 3 × 3 map, numbered left to right from the top row. Off the map: stays put. */
export function moveOnMap(position: number, direction: string): number {
  const row = Math.floor(position / 3);
  const column = position % 3;
  if (direction === 'up' && row > 0) return position - 3;
  if (direction === 'down' && row < 2) return position + 3;
  if (direction === 'left' && column > 0) return position - 1;
  if (direction === 'right' && column < 2) return position + 1;
  return position;
}

export interface WiredScene {
  /** Shows the solved state: the rearranged view, the marker on its target, or the walker at the goal. */
  finish(): void;
}

/** Makes a rendered scene interactive. Marking objects is exploration only, never an answer. */
export function wireStoryScene(element: HTMLElement, locale: Locale): WiredScene {
  const es = locale === 'es-AR';
  const status = element.querySelector<HTMLElement>('[data-mk-scene-status]');
  const views = [...element.querySelectorAll<HTMLElement>('[data-mk-scene-view]')];
  const toggle = element.querySelector<HTMLButtonElement>('[data-mk-scene-toggle]');
  const hop = element.querySelector<HTMLButtonElement>('[data-mk-scene-hop]');
  const pages = [...(views[0]?.querySelectorAll<HTMLButtonElement>('[data-mk-scene-item]') ?? [])];
  const cells = [...element.querySelectorAll<HTMLElement>('[data-mk-scene-cell]')];
  const start = Number(element.dataset.trackStart);
  const target = Number(element.dataset.trackTarget);
  const direction = Number(element.dataset.trackDirection) || 1;
  const routeStart = Number(element.dataset.routeStart);
  const routeGoal = Number(element.dataset.routeGoal);
  let position = start;
  let walker = routeStart;
  let moves = 0;
  let view = 0;

  const say = (message: string) => {
    if (status) status.textContent = message;
  };
  const showView = (next: number) => {
    view = next;
    views.forEach((item, index) => {
      item.hidden = index !== next;
    });
    if (toggle) toggle.textContent = (next === 0 ? toggle.dataset.on : toggle.dataset.off) ?? '';
  };
  const place = (next: number) => {
    position = next;
    pages.forEach((page, index) => {
      page.classList.toggle('is-position', index === position);
      if (index === position) page.setAttribute('aria-current', 'step');
      else page.removeAttribute('aria-current');
    });
  };
  const walk = (next: number, visited: boolean) => {
    if (visited) cells[walker]?.classList.add('is-visited');
    walker = next;
    cells.forEach((cell, index) => cell.classList.toggle('is-position', index === walker));
  };
  if (hop) place(start);
  if (cells.length) walk(routeStart, false);

  element.querySelectorAll<HTMLButtonElement>('[data-mk-scene-item]').forEach((item) => {
    item.addEventListener('click', () => {
      const marked = item.getAttribute('aria-pressed') !== 'true';
      item.setAttribute('aria-pressed', String(marked));
      const count = item.closest('[data-mk-scene-view]')?.querySelectorAll('[data-mk-scene-item][aria-pressed="true"]').length ?? 0;
      say(es ? `Marcados: ${count}.` : `Marked: ${count}.`);
    });
  });
  toggle?.addEventListener('click', () => {
    showView(view === 0 ? 1 : 0);
    say(es ? 'Mirá qué cambió y qué quedó igual.' : 'Look at what changed and what stayed the same.');
  });
  hop?.addEventListener('click', () => {
    const next = position + direction;
    if (next < 0 || next >= pages.length) {
      say(es ? 'No hay más lugar para este lado.' : 'There is no more room this way.');
      return;
    }
    place(next);
    moves += 1;
    say(es ? `Movimientos: ${moves}. Estás en ${pages[next].dataset.value}.` : `Moves: ${moves}. You are on ${pages[next].dataset.value}.`);
  });
  element.querySelectorAll<HTMLButtonElement>('[data-mk-scene-move]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = moveOnMap(walker, button.dataset.mkSceneMove ?? '');
      if (next === walker) {
        say(es ? 'Ese paso sale del mapa. Probá otra flecha.' : 'That step leaves the map. Try another arrow.');
        return;
      }
      walk(next, true);
      moves += 1;
      const arrived = walker === routeGoal;
      say(es ? `Pasos: ${moves}.${arrived ? ' ¡Llegaste!' : ''}` : `Steps: ${moves}.${arrived ? ' You made it!' : ''}`);
    });
  });
  element.querySelector('[data-mk-scene-clear]')?.addEventListener('click', () => {
    element.querySelectorAll('[data-mk-scene-item]').forEach((item) => item.setAttribute('aria-pressed', 'false'));
    moves = 0;
    if (hop) place(start);
    if (cells.length) {
      cells.forEach((cell) => cell.classList.remove('is-visited'));
      walk(routeStart, false);
    }
    if (views.length > 1) showView(0);
    say('');
  });

  return {
    finish() {
      if (views.length > 1) showView(1);
      if (hop && Number.isFinite(target)) place(target);
      if (cells.length && Number.isFinite(routeGoal)) walk(routeGoal, false);
    },
  };
}
