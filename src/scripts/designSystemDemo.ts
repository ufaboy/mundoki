// Design-system showcase: lesson-stage switcher and a clickable exercise sample.
// The switcher is a demo only: on real pages the stage comes from the grade in
// the URL and is already in the HTML.

const STAGE_KEY = 'mundoki_ds_stage';

function setPressed(buttons: NodeListOf<HTMLButtonElement>, active: HTMLButtonElement): void {
  buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));
}

function initStageSwitcher(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-set-stage]');
  const lessons = document.querySelectorAll<HTMLElement>('[data-ds-lesson]');
  if (!buttons.length) return;

  const apply = (stage: string): void => {
    if (!Array.from(buttons).some((button) => button.dataset.setStage === stage)) return;
    lessons.forEach((lesson) => {
      lesson.dataset.stage = stage;
    });
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.setStage === stage));
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const stage = button.dataset.setStage ?? '2';
      apply(stage);
      try {
        window.localStorage.setItem(STAGE_KEY, stage);
      } catch {
        // Storage can be unavailable; the switcher still works for this visit.
      }
    });
  });

  try {
    const saved = window.localStorage.getItem(STAGE_KEY);
    if (saved) apply(saved);
  } catch {
    // Ignore storage errors.
  }
}

function initExerciseSample(): void {
  const root = document.querySelector<HTMLElement>('[data-ds-exercise]');
  if (!root) return;

  const choices = root.querySelectorAll<HTMLButtonElement>('.mk-choice');
  const feedbacks = root.querySelectorAll<HTMLElement>('[data-ds-feedback]');

  choices.forEach((choice) => {
    choice.addEventListener('click', () => {
      const correct = choice.dataset.correct === 'true';
      choices.forEach((other) => other.classList.remove('is-correct', 'is-retry', 'mk-pop'));
      setPressed(choices, choice);
      choice.classList.add(correct ? 'is-correct' : 'is-retry', 'mk-pop');
      feedbacks.forEach((feedback) => {
        feedback.hidden = feedback.dataset.dsFeedback !== (correct ? 'correct' : 'retry');
      });
    });
  });
}

export function initDesignSystemDemo(): void {
  initStageSwitcher();
  initExerciseSample();
}
