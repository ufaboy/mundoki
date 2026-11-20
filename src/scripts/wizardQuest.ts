// Grade 2 mission page (QuestLesson.astro): answer checking, hints, rewards,
// and the story scene (knots untied, friend freed, wizard defeated).
// Each challenge has several versions (the authored one plus generated ones with
// new numbers). A wrong answer pauses the buttons, the wizard "changes the
// numbers" and the next version appears with Átomo's hint, so pressing every
// button in turn never unties a knot.
import { questSceneState } from '../content/grade2/questScene';

const PAUSE_MS = 2500;

const shuffle = (group: HTMLElement) => {
 const buttons = [...group.children];
 for (let i = buttons.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
 }
 group.append(...buttons);
};

document.querySelectorAll<HTMLElement>('[data-quest-lesson]').forEach(root => {
 const es = root.dataset.locale === 'es-AR';
 const index = Number(root.dataset.missionIndex);
 const get = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-quest-${name}]`)!;
 const questions = [...root.querySelectorAll<HTMLElement>('[data-quest-question]')];
 const stage = get('stage');
 const knots = get('knots');
 const feedback = get('feedback');
 let current = 0;
 let solved = 0;
 let paused = false;
 let pauseTimer = 0;

 const variants = (question: HTMLElement) => [...question.querySelectorAll<HTMLElement>('[data-quest-variant]')];
 const visible = (question: HTMLElement) => variants(question).find(v => !v.hidden)!;
 const controls = (variant: HTMLElement) => [...variant.querySelectorAll<HTMLButtonElement | HTMLInputElement>('[data-quest-answer], [data-quest-key], [data-quest-entry] button, [data-quest-entry-input]')];
 const setDisabled = (variant: HTMLElement, disabled: boolean) => controls(variant).forEach(c => { c.disabled = disabled; });

 const renderScene = () => {
  const state = questSceneState(index, solved);
  stage.dataset.steps = String(solved);
  stage.dataset.friendFree = String(state.friendFree);
  stage.dataset.wizardDefeated = String(state.wizardDefeated);
  knots.querySelectorAll('i').forEach((knot, i) => knot.classList.toggle('is-untied', i < state.untied));
  knots.setAttribute('aria-label', `${es ? knots.dataset.labelEs : knots.dataset.labelEn}: ${state.untied} / 12`);
  root.querySelectorAll<HTMLElement>('[data-quest-team-member]').forEach(member => {
   member.hidden = Number(member.dataset.questTeamMember) >= state.freedFriends;
  });
 };

 // Fresh order of the options every time a version is shown.
 const prepare = (variant: HTMLElement) => {
  const options = variant.querySelector<HTMLElement>('.road-options');
  if (options) shuffle(options);
  const input = variant.querySelector<HTMLInputElement>('[data-quest-entry-input]');
  if (input) input.value = '';
 };

 const showVariant = (question: HTMLElement, k: number) => {
  variants(question).forEach((v, j) => {
   v.hidden = j !== k;
   v.querySelector<HTMLElement>('[data-quest-hint]')!.hidden = true;
  });
  prepare(variants(question)[k]);
 };

 const succeed = (question: HTMLElement, variant: HTMLElement, i: number, chosen?: HTMLElement) => {
  solved++;
  setDisabled(variant, true);
  chosen?.classList.add('is-correct');
  variant.querySelector('[data-quest-entry]')?.classList.add('is-correct');
  variant.querySelector<HTMLElement>('[data-quest-hint]')!.hidden = true;
  variant.querySelector<HTMLElement>('[data-quest-explanation]')!.hidden = false;
  // The reward is rendered per hero by HeroText; copy it so CSS keeps choosing the hero.
  get('reward-text').replaceChildren(...[...variant.querySelector<HTMLElement>('[data-quest-reward-source]')!.childNodes].map(node => node.cloneNode(true)));
  get('reward').hidden = false;
  root.querySelector(`[data-quest-badge="${i}"]`)?.classList.add('is-done');
  get('next').hidden = solved === questions.length;
  get('finish').hidden = solved !== questions.length;
  feedback.textContent = es ? '¡Bien! Un nudo del hechizo se desató.' : 'Well done! One knot of the spell came undone.';
  if (solved === questions.length) root.querySelector<HTMLElement>('[data-quest-epilogue]')?.removeAttribute('hidden');
  renderScene();
 };

 // Wrong answer: pause, then the wizard swaps in the next version with its hint open.
 const fail = (question: HTMLElement, variant: HTMLElement) => {
  paused = true;
  setDisabled(variant, true);
  feedback.textContent = es
   ? 'No es esa. ¡Ja! El mago Embrollo está cambiando los números…'
   : 'That’s not it. Ha! Wizard Embrollo is changing the numbers…';
  pauseTimer = window.setTimeout(() => {
   paused = false;
   const all = variants(question);
   const next = (all.indexOf(variant) + 1) % all.length;
   setDisabled(variant, false);
   showVariant(question, next);
   const shown = all[next];
   shown.querySelector<HTMLElement>('[data-quest-hint]')!.hidden = false;
   feedback.textContent = es
    ? 'Ahora hay otros números. Átomo te deja una pista.'
    : 'Now there are new numbers. Átomo leaves you a hint.';
   shown.querySelector<HTMLElement>('[data-quest-question-title]')!.focus();
  }, PAUSE_MS);
 };

 const answer = (question: HTMLElement, i: number, isCorrect: boolean, chosen?: HTMLElement) => {
  if (i !== current || solved > i || paused) return;
  const variant = visible(question);
  if (isCorrect) succeed(question, variant, i, chosen); else fail(question, variant);
 };

 renderScene();

 questions.forEach((question, i) => {
  question.querySelectorAll<HTMLButtonElement>('[data-quest-place-value]').forEach(button => button.addEventListener('click', () => {
   const model = button.closest('.road-place-model')!;
   model.querySelectorAll('[data-quest-place-value]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
   model.querySelector<HTMLElement>('[data-quest-place-result]')!.textContent = button.dataset.questPlaceValue!;
  }));
  variants(question).forEach(variant => {
   const expected = Number(variant.dataset.answer);
   variant.querySelectorAll<HTMLButtonElement>('[data-quest-answer]').forEach(button => button.addEventListener('click', () => {
    answer(question, i, Number(button.dataset.questAnswer) === expected, button);
   }));
   const form = variant.querySelector<HTMLFormElement>('[data-quest-entry]');
   if (!form) return;
   const input = form.querySelector<HTMLInputElement>('[data-quest-entry-input]')!;
   input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 4); });
   form.querySelectorAll<HTMLButtonElement>('[data-quest-key]').forEach(key => key.addEventListener('click', () => {
    const value = key.dataset.questKey!;
    input.value = value === 'back' ? input.value.slice(0, -1) : (input.value + value).slice(0, 4);
   }));
   form.addEventListener('submit', event => {
    event.preventDefault();
    if (!input.value) {
     feedback.textContent = es ? 'Escribí un número con las teclas.' : 'Type a number with the keys.';
     input.focus();
     return;
    }
    answer(question, i, Number(input.value) === expected);
   });
  });
  prepare(variants(question)[0]);
 });

 get('next').addEventListener('click', () => {
  if (solved !== current + 1 || current >= questions.length - 1) return;
  current++;
  questions.forEach((q, i) => { q.hidden = i !== current; });
  get('next').hidden = true; get('reward').hidden = true; feedback.textContent = '';
  visible(questions[current]).querySelector<HTMLElement>('[data-quest-question-title]')!.focus();
 });
 get('help').addEventListener('click', () => {
  if (solved > current) return;
  visible(questions[current]).querySelector<HTMLElement>('[data-quest-hint]')!.hidden = false;
 });
 get('reset').addEventListener('click', () => {
  window.clearTimeout(pauseTimer);
  paused = false; current = 0; solved = 0;
  questions.forEach((q, i) => {
   q.hidden = i !== 0;
   variants(q).forEach(v => {
    v.querySelector<HTMLElement>('[data-quest-explanation]')!.hidden = true;
    setDisabled(v, false);
    v.querySelectorAll('.is-correct').forEach(b => b.classList.remove('is-correct'));
    v.querySelectorAll('[data-quest-place-value]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    const result = v.querySelector('[data-quest-place-result]'); if (result) result.textContent = '';
   });
   showVariant(q, 0);
  });
  root.querySelectorAll('[data-quest-badge]').forEach(b => b.classList.remove('is-done'));
  ['next', 'finish', 'reward'].forEach(name => { get(name).hidden = true; });
  feedback.textContent = '';
  root.querySelector<HTMLElement>('[data-quest-epilogue]')?.setAttribute('hidden', '');
  renderScene();
  visible(questions[0]).querySelector<HTMLElement>('[data-quest-question-title]')!.focus();
 });
});
