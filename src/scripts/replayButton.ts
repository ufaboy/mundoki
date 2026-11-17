// "Play again" in the mission worlds (city, island, moon, race, park, road).
// Each world's own script does the actual reset. This module makes the button
// honest: it is hidden while there is nothing to replay, and pressing it always
// shows a visible reaction (a short message, the first challenge back in view).

const WORLDS = ['city', 'island', 'moon', 'race', 'park', 'road'] as const;

function setup(world: (typeof WORLDS)[number], button: HTMLElement): void {
  const root = button.closest<HTMLElement>(`[data-${world}-root]`) ?? button.closest<HTMLElement>('[data-locale]');
  if (!root) return;
  const es = root.dataset.locale !== 'en-US';

  // Nothing answered yet: nothing to replay.
  button.hidden = true;
  root.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(`[data-${world}-answer]`)) button.hidden = false;
  });

  button.addEventListener('click', () => {
    // Run after the world's own reset handler, which clears the feedback line.
    window.setTimeout(() => {
      button.hidden = true;
      const feedback = root.querySelector<HTMLElement>(`[data-${world}-feedback]`);
      if (feedback) feedback.textContent = es ? 'Empezamos de nuevo.' : 'Starting again.';
      const first = root.querySelector<HTMLElement>(`[data-${world}-question]:not([hidden])`);
      first?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 0);
  });
}

for (const world of WORLDS) {
  document.querySelectorAll<HTMLElement>(`[data-${world}-reset]`).forEach((button) => setup(world, button));
}
