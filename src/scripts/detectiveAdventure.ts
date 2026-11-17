// Grade 7 detective missions: challenge flow, pinned evidence cards, rewards,
// and the optional story puzzles (riddles, capsule lock, final deduction).
import { initialIslandState as initialState, answerIsland as answer, nextIsland as next, islandStage as stage } from './islandState';

document.querySelectorAll<HTMLElement>('[data-detective-root]').forEach((root) => {
  const es = root.dataset.locale === 'es-AR';
  const get = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-detective-${name}]`);
  const questions = [...root.querySelectorAll<HTMLElement>('[data-detective-question]')];
  if (questions.length) {
    let state = initialState(questions.length);
    const rewards = [...root.querySelectorAll<HTMLElement>('[data-detective-reward]')];
    const render = () => {
      const scene = get('stage');
      if (scene) scene.dataset.phase = stage(state);
      root.querySelectorAll<HTMLElement>('[data-detective-card]').forEach((card, i) => card.classList.toggle('is-pinned', i < state.solved));
      root.querySelectorAll<HTMLElement>('[data-park-model]').forEach((model) => {
        model.dataset.solved = String(Number(model.closest<HTMLElement>('[data-detective-question]')!.dataset.detectiveQuestion) < state.solved);
      });
      root.querySelectorAll('[data-detective-badge]').forEach((el, i) => el.classList.toggle('is-done', i < state.solved));
      const done = state.solved === state.count;
      const after = get('after'); if (after) after.hidden = !done;
      const finale = get('celebration'); if (finale) finale.hidden = !done;
    };
    questions.forEach((q, i) => q.querySelectorAll<HTMLButtonElement>('[data-detective-answer]').forEach((b) => b.addEventListener('click', () => {
      if (i !== state.current || state.solved !== state.current) return;
      const updated = answer(state, i, Number(b.dataset.detectiveAnswer) === Number(q.dataset.answer));
      if (updated === state) { get('feedback')!.textContent = es ? 'Todavía no. Revisá los datos o pedile una pista a Átomo.' : 'Not yet. Check the data or ask Átomo for a hint.'; return; }
      state = updated;
      q.querySelectorAll<HTMLButtonElement>('[data-detective-answer]').forEach((button) => { button.disabled = true; });
      b.classList.add('is-correct');
      q.querySelector<HTMLElement>('[data-detective-hint]')!.hidden = true;
      q.querySelector<HTMLElement>('[data-detective-explanation]')!.hidden = false;
      rewards.forEach((r, k) => { r.hidden = k !== i; });
      get('feedback')!.textContent = es ? '¡Pista encontrada! Mirá el expediente.' : 'Clue found! Look at the case board.';
      get('next')!.hidden = state.solved === state.count;
      get('finish')!.hidden = state.solved !== state.count;
      render();
    })));
    get('next')!.addEventListener('click', () => {
      const updated = next(state); if (updated === state) return; state = updated;
      questions.forEach((q, i) => { q.hidden = i !== state.current; });
      get('next')!.hidden = true; rewards.forEach((r) => { r.hidden = true; }); get('feedback')!.textContent = '';
      questions[state.current].querySelector<HTMLElement>('[data-detective-question-title]')!.focus();
    });
    get('help')!.addEventListener('click', () => {
      if (state.solved !== state.current) return;
      questions[state.current].querySelector<HTMLElement>('[data-detective-hint]')!.hidden = false;
    });
    get('reset')!.addEventListener('click', () => {
      state = initialState(questions.length);
      questions.forEach((q, i) => {
        q.hidden = i !== 0;
        q.querySelector<HTMLElement>('[data-detective-hint]')!.hidden = true;
        q.querySelector<HTMLElement>('[data-detective-explanation]')!.hidden = true;
        q.querySelectorAll<HTMLButtonElement>('[data-detective-answer]').forEach((b) => { b.disabled = false; b.classList.remove('is-correct'); });
      });
      ['next', 'finish'].forEach((name) => { get(name)!.hidden = true; });
      rewards.forEach((r) => { r.hidden = true; }); get('feedback')!.textContent = '';
      render();
      questions[0].querySelector<HTMLElement>('[data-detective-question-title]')!.focus();
    });
    render();
  }
  root.querySelectorAll<HTMLElement>('[data-detective-puzzle]').forEach((puzzle) => {
    const feedback = puzzle.querySelector<HTMLElement>('[data-puzzle-feedback]')!;
    puzzle.querySelectorAll<HTMLButtonElement>('[data-puzzle-option]').forEach((b) => b.addEventListener('click', () => {
      if (Number(b.dataset.puzzleOption) !== Number(puzzle.dataset.answer)) { feedback.textContent = feedback.dataset.wrong ?? ''; return; }
      puzzle.querySelectorAll<HTMLButtonElement>('[data-puzzle-option]').forEach((button) => { button.disabled = true; });
      b.classList.add('is-correct');
      feedback.textContent = es ? '¡Resuelto!' : 'Solved!';
      puzzle.querySelector<HTMLElement>('[data-puzzle-explanation]')!.hidden = false;
    }));
  });
});

function revealDetectiveAnchor() {
  let id: string; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = id ? document.getElementById(id) : null; if (!target?.closest('[data-detective-map]')) return;
  let parent: HTMLElement | null = target; while (parent) { if (parent instanceof HTMLDetailsElement) parent.open = true; parent = parent.parentElement; }
  requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
}
revealDetectiveAnchor(); window.addEventListener('hashchange', revealDetectiveAnchor);
