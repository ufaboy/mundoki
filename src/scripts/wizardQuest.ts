// Grade 2 mission page (QuestLesson.astro): answer checking, hints, rewards,
// and the story scene (knots untied, friend freed, wizard defeated).
import { questSceneState } from '../content/grade2/questScene';

document.querySelectorAll<HTMLElement>('[data-quest-lesson]').forEach(root => {
 const es = root.dataset.locale === 'es-AR';
 const index = Number(root.dataset.missionIndex);
 const get = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-quest-${name}]`)!;
 const questions = [...root.querySelectorAll<HTMLElement>('[data-quest-question]')];
 const stage = get('stage');
 const knots = get('knots');
 let current = 0;
 let solved = 0;

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
 renderScene();

 questions.forEach((question, i) => {
  question.querySelectorAll<HTMLButtonElement>('[data-quest-place-value]').forEach(button => button.addEventListener('click', () => {
   question.querySelectorAll('[data-quest-place-value]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
   question.querySelector<HTMLElement>('[data-quest-place-result]')!.textContent = button.dataset.questPlaceValue!;
  }));
  question.querySelectorAll<HTMLButtonElement>('[data-quest-answer]').forEach(button => button.addEventListener('click', () => {
   if (i !== current || solved > i) return;
   if (Number(button.dataset.questAnswer) !== Number(question.dataset.answer)) {
    get('feedback').textContent = es ? 'Probá otra vez. La pista de Átomo y el ejemplo te pueden ayudar.' : 'Try again. Átomo’s hint and the example can help you.';
    return;
   }
   solved++;
   question.querySelectorAll<HTMLButtonElement>('[data-quest-answer]').forEach(b => { b.disabled = true; });
   button.classList.add('is-correct');
   question.querySelector<HTMLElement>('[data-quest-hint]')!.hidden = true;
   question.querySelector<HTMLElement>('[data-quest-explanation]')!.hidden = false;
   // The reward is rendered per hero by HeroText; copy it so CSS keeps choosing the hero.
   get('reward-text').replaceChildren(...[...question.querySelector<HTMLElement>('[data-quest-reward-source]')!.childNodes].map(node => node.cloneNode(true)));
   get('reward').hidden = false;
   root.querySelector(`[data-quest-badge="${i}"]`)?.classList.add('is-done');
   get('next').hidden = solved === questions.length;
   get('finish').hidden = solved !== questions.length;
   get('feedback').textContent = es ? '¡Bien! Un nudo del hechizo se desató.' : 'Well done! One knot of the spell came undone.';
   if (solved === questions.length) root.querySelector<HTMLElement>('[data-quest-epilogue]')?.removeAttribute('hidden');
   renderScene();
  }));
 });

 get('next').addEventListener('click', () => {
  if (solved !== current + 1 || current >= questions.length - 1) return;
  current++;
  questions.forEach((q, i) => { q.hidden = i !== current; });
  get('next').hidden = true; get('reward').hidden = true; get('feedback').textContent = '';
  questions[current].querySelector<HTMLElement>('[data-quest-question-title]')!.focus();
 });
 get('help').addEventListener('click', () => {
  if (solved > current) return;
  questions[current].querySelector<HTMLElement>('[data-quest-hint]')!.hidden = false;
 });
 get('reset').addEventListener('click', () => {
  current = 0; solved = 0;
  questions.forEach((q, i) => {
   q.hidden = i !== 0;
   q.querySelector<HTMLElement>('[data-quest-hint]')!.hidden = true;
   q.querySelector<HTMLElement>('[data-quest-explanation]')!.hidden = true;
   q.querySelectorAll<HTMLButtonElement>('[data-quest-answer]').forEach(b => { b.disabled = false; b.classList.remove('is-correct'); });
   q.querySelectorAll('[data-quest-place-value]').forEach(b => b.setAttribute('aria-pressed', 'false'));
   const result = q.querySelector('[data-quest-place-result]'); if (result) result.textContent = '';
  });
  root.querySelectorAll('[data-quest-badge]').forEach(b => b.classList.remove('is-done'));
  ['next', 'finish', 'reward'].forEach(name => { get(name).hidden = true; });
  get('feedback').textContent = '';
  root.querySelector<HTMLElement>('[data-quest-epilogue]')?.setAttribute('hidden', '');
  renderScene();
  questions[0].querySelector<HTMLElement>('[data-quest-question-title]')!.focus();
 });
});
