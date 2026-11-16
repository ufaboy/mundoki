// Grade 1 mission flow ("A day with {name}"): two challenges, each solved on a
// picture the child can touch. A right answer shows the explanation, the
// story reward in the hero's bubble, and counts towards the child's stars.
// "New numbers" swaps the first challenge (question and picture) for a fresh
// one of the same kind; every right answer counts.

import type { Locale, TopicId } from '../math/core/types';
import { DEFAULT_HERO, isHeroId, personalize } from '../content/heroes';
import { localizeScene, storySceneHtml, wireStoryScene, type WiredScene } from '../lib/storyScene';
import { applyNewNumbers, recordAnswer, showStars } from './missionPractice';
import { initListenButtons } from './speech';

function heroText(template: string): string {
  const hero = document.documentElement.dataset.hero;
  return personalize(template, isHeroId(hero) ? hero : DEFAULT_HERO.hero);
}

document.querySelectorAll<HTMLElement>('[data-day-lesson]').forEach((root) => {
  const locale: Locale = root.dataset.locale === 'en-US' ? 'en-US' : 'es-AR';
  const es = locale === 'es-AR';
  const questions = [...root.querySelectorAll<HTMLElement>('[data-day-question]')];
  const progress = [...root.querySelectorAll<HTMLElement>('[data-day-step]')];
  const speech = root.querySelector<HTMLElement>('[data-day-speech]')!;
  const retry = root.querySelector<HTMLElement>('[data-day-retry]')!;
  const status = root.querySelector<HTMLElement>('[data-day-status]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-day-next]')!;
  const finish = root.querySelector<HTMLAnchorElement>('[data-day-finish]')!;
  const mission = { lessonId: root.dataset.lessonId!, topicId: root.dataset.topicId as TopicId };

  let current = 0;
  /** A challenge counts as done once answered right, even if new numbers come after. */
  const done = questions.map(() => false);
  const scenes: WiredScene[] = [];

  const say = (template: string) => {
    speech.textContent = heroText(template);
  };
  const part = <T extends HTMLElement>(question: HTMLElement, name: string) => question.querySelector<T>(`[data-day-${name}]`)!;

  const wire = (question: HTMLElement, index: number) => {
    const holder = part(question, 'scene');
    const scene = holder.querySelector<HTMLElement>('[data-mk-scene]');
    if (scene) scenes[index] = wireStoryScene(scene, locale);
  };
  questions.forEach(wire);

  const showProgress = () => {
    progress.forEach((step, index) => {
      step.classList.toggle('is-done', done[index]);
      step.classList.toggle('is-now', index === current && !done[index]);
    });
  };

  const resetAnswers = (question: HTMLElement) => {
    question.querySelectorAll<HTMLButtonElement>('[data-day-answer]').forEach((button) => {
      button.disabled = false;
      button.classList.remove('is-correct', 'is-retry');
    });
    part(question, 'hint').hidden = true;
    part(question, 'explanation').hidden = true;
    delete question.dataset.solved;
  };

  const showControls = () => {
    const solvedNow = done[current];
    next.hidden = !(solvedNow && current < questions.length - 1);
    finish.hidden = !done.every(Boolean);
  };

  questions.forEach((question, index) => {
    question.querySelectorAll<HTMLButtonElement>('[data-day-answer]').forEach((button) => {
      button.addEventListener('click', () => {
        if (index !== current || question.dataset.solved === 'true') return;
        const chosen = Number(button.dataset.dayAnswer);
        const correct = chosen === Number(question.dataset.answer);
        const stars = recordAnswer(question, chosen, correct, { ...mission, checkIndex: index });

        if (!correct) {
          button.classList.add('is-retry');
          retry.hidden = false;
          status.textContent = es ? 'Casi. Probá otra vez.' : 'Almost. Try again.';
          return;
        }

        question.dataset.solved = 'true';
        question.querySelectorAll<HTMLButtonElement>('[data-day-answer]').forEach((other) => {
          other.disabled = true;
          other.classList.remove('is-retry');
        });
        button.classList.add('is-correct');
        retry.hidden = true;
        part(question, 'hint').hidden = true;
        part(question, 'explanation').hidden = false;
        scenes[index]?.finish();
        say(question.dataset.reward ?? '');
        done[index] = true;
        showStars(root, stars);
        showProgress();
        showControls();
        status.textContent = heroText(question.dataset.reward ?? '');
      });
    });

    question.querySelector<HTMLButtonElement>('[data-day-new-numbers]')?.addEventListener('click', () => {
      const title = part(question, 'title');
      const answers = [...question.querySelectorAll<HTMLElement>('[data-day-option]')];
      const exercise = applyNewNumbers(
        question,
        { title, answers, hint: part(question, 'hint-text'), explanation: part(question, 'explanation-text') },
        locale
      );
      if (!exercise) return;
      resetAnswers(question);
      retry.hidden = true;
      if (exercise.scene) {
        part(question, 'scene').innerHTML = storySceneHtml(localizeScene(exercise.scene, locale), locale);
        wire(question, index);
        if (exercise.scene.intro) part(question, 'step-text').textContent = heroText(exercise.scene.intro[locale]);
        if (exercise.scene.reward) question.dataset.reward = exercise.scene.reward[locale];
      }
      say(root.dataset.intro ?? '');
      showControls();
      title.focus();
    });
  });

  next.addEventListener('click', () => {
    if (!done[current] || current >= questions.length - 1) return;
    current += 1;
    questions.forEach((question, index) => {
      question.hidden = index !== current;
    });
    retry.hidden = true;
    status.textContent = '';
    showProgress();
    showControls();
    part(questions[current], 'title').focus();
  });

  root.querySelector('[data-day-help]')?.addEventListener('click', () => {
    const question = questions[current];
    if (question.dataset.solved === 'true') return;
    part(question, 'hint').hidden = false;
    status.textContent = part(question, 'hint-text').textContent ?? '';
  });

  showProgress();
  void initListenButtons(root);
});
