// Adds a small "Premium" badge to every link that leads to a mission needing
// Premium, unless the family already has it. Purely a signpost: the mission
// page checks access on the server.
import { LOCKED_LESSON_PATH } from '../lib/access/lockedLessonPath';

const LOCK_ICON = 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3';

export function markLockedLessonLinks(): void {
  if (document.documentElement.dataset.premium === 'true') return;
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    let path: string;
    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      path = url.pathname;
    } catch {
      return;
    }
    if (!LOCKED_LESSON_PATH.test(path) || link.querySelector('.mk-lock-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'mk-lock-badge';
    badge.innerHTML = `<svg class="mk-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${LOCK_ICON}" /></svg><span class="mk-lock-badge__text">Premium</span>`;
    link.classList.add('is-premium-locked');
    // Older world maps end each mission card with a "Play →" label: the badge takes its place.
    const playLabel = link.querySelector('[class$="-mission-play"]');
    if (playLabel) playLabel.replaceWith(badge);
    else link.append(badge);
  });
}
