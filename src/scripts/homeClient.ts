// Home page: remember the grade a child picks, and wire the hero picker.

import { GRADE_STORAGE_KEY } from '../content/savedGrade';
import { initHero } from './heroClient';

export function initHome(): void {
  initHero();

  document.querySelectorAll<HTMLAnchorElement>('[data-grade-pick]').forEach((link) => {
    link.addEventListener('click', () => {
      const grade = link.dataset.gradePick;
      if (!grade) return;
      try {
        window.localStorage.setItem(GRADE_STORAGE_KEY, grade);
      } catch {
        // Storage blocked: the link still opens the grade.
      }
    });
  });
}
