import { moveOnStoryMap } from './tomiStoryMovement';
// Local story effects only: no mastery flags, points, or progress API writes.
document.querySelectorAll<HTMLElement>('[data-story-adventure]').forEach(root => {
  const es = root.dataset.locale === 'es-AR';
  const el = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-story-${name}]`)!;
  const questions = [...root.querySelectorAll<HTMLElement>('[data-story-question]')];
  const scenes = [...root.querySelectorAll<HTMLElement>('[data-story-scene]')];
  let current = 0;
  let solved = [false, false];
  const say = (a: string, b: string) => { el('feedback').textContent = es ? a : b; };
  const resets: Array<() => void> = [];
  const finishScene: Array<() => void> = [];

  scenes.forEach((scene, sceneIndex) => {
    const model = scene.querySelector<HTMLElement>('[data-story-model]')!;
    const items = [...model.querySelectorAll<HTMLButtonElement>('[data-story-item]')];
    const views = [...model.querySelectorAll<HTMLElement>('[data-story-view]')];
    const status = model.querySelector<HTMLElement>('[data-story-explore-status]')!;
    const kind = model.dataset.kind;
    const start = Number(model.dataset.start);
    const direction = Number(model.dataset.direction);
    let position = start;
    let routePosition = 6;
    let moves = 0;
    let version = 0;
    let sequence = -1;
    const firstItems = [...views[0].querySelectorAll<HTMLButtonElement>('[data-story-item]')];
    const setPosition = () => {
      firstItems.forEach((item, i) => {
        item.classList.toggle('is-position', i === (kind === 'route' ? routePosition : position));
        if (i === (kind === 'route' ? routePosition : position)) item.setAttribute('aria-current', 'step');
        else item.removeAttribute('aria-current');
      });
    };
    const showView = (n: number) => { version = n; views.forEach((view,i) => { view.hidden = i !== n; }); };
    const reset = () => {
      position = start; routePosition = 6; moves = 0; sequence = -1;
      showView(0); status.textContent = '';
      model.classList.remove('is-rotated', 'is-shifted', 'has-gaps');
      items.forEach(item => { item.setAttribute('aria-pressed','false'); item.classList.remove('is-position', 'is-visited'); item.removeAttribute('aria-current'); });
      if (kind === 'track' || kind === 'route') setPosition();
    };
    reset(); resets.push(reset);
    finishScene.push(() => {
      if (views.length > 1) showView(1);
      if (kind === 'track') { position = model.dataset.target !== undefined ? Number(model.dataset.target) : direction < 0 ? 0 : firstItems.length - 1; setPosition(); }
      if (kind === 'route') { routePosition = 2; setPosition(); }
      if (kind === 'shapes' && sceneIndex === 1) model.classList.add('is-rotated');
      if (kind === 'measure' || kind === 'lengths') model.classList.remove('is-shifted','has-gaps');
      if (kind === 'plant') firstItems.forEach(item => item.classList.add('is-visited'));
    });
    items.forEach(item => item.addEventListener('click', () => {
      // Marking is exploration, never a correctness signal.
      const active = item.getAttribute('aria-pressed') !== 'true';
      item.setAttribute('aria-pressed', String(active));
      status.textContent = `${item.dataset.itemValue}: ${es ? (active ? 'marcado' : 'sin marca') : (active ? 'marked' : 'unmarked')}.`;
    }));
    model.querySelector('[data-story-transform]')?.addEventListener('click', () => {
      showView(version === 0 ? 1 : 0);
      status.textContent = es ? 'Observá qué cambió y qué se mantuvo igual.' : 'Look at what changed and what stayed the same.';
    });
    model.querySelector('[data-story-hop]')?.addEventListener('click', () => {
      const next = position + direction;
      if (next < 0 || next >= firstItems.length) {
        status.textContent = es ? 'Llegaste al final de esta pista. Reiniciá para probar otra vez.' : 'You reached the end of this track. Reset to try again.'; return;
      }
      position = next; moves++; setPosition();
      status.textContent = es ? `Movimientos: ${moves}. Ahora estás en ${firstItems[position].dataset.itemValue}.` : `Moves: ${moves}. Now on ${firstItems[position].dataset.itemValue}.`;
    });
    model.querySelectorAll<HTMLButtonElement>('[data-story-direction]').forEach(button => button.addEventListener('click', () => {
      const d = button.dataset.storyDirection;
      const nextPosition = moveOnStoryMap(routePosition, d ?? '');
      if (nextPosition === routePosition) {
        status.textContent = es ? 'Ese paso sale del mapa. Probá otra dirección.' : 'That step leaves the map. Try another direction.'; return;
      }
      firstItems[routePosition].classList.add('is-visited');
      routePosition = nextPosition;
      moves++; setPosition();
      status.textContent = (es ? `Pasos: ${moves}. Fila ${Math.floor(routePosition / 3)+1} desde arriba, columna ${routePosition%3+1} desde la izquierda.` : `Steps: ${moves}. Row ${Math.floor(routePosition / 3)+1} from the top, column ${routePosition%3+1} from the left.`) + (routePosition === 2 ? (es ? ' ¡Llegaste al jardín!' : ' You reached the garden!') : '');
    }));
    model.querySelector('[data-story-rotate]')?.addEventListener('click', () => { model.classList.toggle('is-rotated'); status.textContent = es ? 'El cuadrado gira. Sus lados y sus esquinas siguen iguales.' : 'The square turns. Its sides and corners stay the same.'; });
    model.querySelector('[data-story-align]')?.addEventListener('click', () => { model.classList.toggle('is-shifted'); status.textContent = es ? 'Compará después de alinear el inicio de las dos cintas.' : 'Compare after aligning the starts of both ribbons.'; });
    model.querySelector('[data-story-gaps]')?.addEventListener('click', () => { model.classList.toggle('has-gaps'); status.textContent = es ? 'La tira sigue igual de larga. Mirá los pedacitos que quedan sin cubrir.' : 'The strip is still just as long. Look at the parts left uncovered.'; });
    model.querySelector('[data-story-sequence]')?.addEventListener('click', () => {
      sequence = (sequence + 1) % firstItems.length;
      firstItems.forEach((item,i) => item.classList.toggle('is-visited', i <= sequence));
      status.textContent = `${sequence+1}. ${firstItems[sequence].dataset.itemValue}`;
    });
    model.querySelector('[data-story-scene-reset]')?.addEventListener('click', reset);
  });

  questions.forEach((question,index) => {
    const buttons = [...question.querySelectorAll<HTMLButtonElement>('[data-story-answer]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      if (current !== index || solved[index]) return;
      if (Number(button.dataset.storyAnswer) !== Number(question.dataset.answer)) {
        say('Probemos otra vez. Podés explorar la escena o pedir una pista.', 'Let’s try again. You can explore the scene or ask for a hint.'); return;
      }
      solved[index] = true;
      buttons.forEach(b => { b.disabled = true; }); button.classList.add('is-correct');
      finishScene[index]();
      scenes[index].querySelector<HTMLElement>('[data-story-prize]')!.hidden = false;
      el('speech').textContent = scenes[index].querySelector('[data-story-prize] p')!.textContent;
      root.querySelector<HTMLElement>(`[data-story-checkpoint="${index}"]`)!.classList.add('is-done');
      question.querySelector<HTMLElement>('[data-story-hint]')!.hidden = true;
      question.querySelector<HTMLElement>('[data-story-explanation]')!.hidden = false;
      say(index === 0 ? '¡Lo lograste! Seguimos con el próximo paso.' : '¡Misión cumplida! Podés volver a jugar o seguir el recorrido.', index === 0 ? 'You did it! Let’s continue to the next step.' : 'Mission complete! You can play again or continue the journey.');
      el('next').hidden = index !== 0; el('finish').hidden = index !== 1;
      const finale = root.querySelector<HTMLElement>('[data-story-finale]');
      if (finale && index === 1) finale.hidden = false;
    }));
  });
  el('next').addEventListener('click', () => {
    if (!solved[0] || current !== 0) return;
    current = 1;
    questions.forEach((q,i) => { q.hidden = i !== current; }); scenes.forEach((s,i) => { s.hidden = i !== current; });
    el('speech').textContent = questions[1].dataset.intro!;
    el('feedback').textContent = ''; el('next').hidden = true;
    questions[1].querySelector<HTMLElement>('[data-story-question-heading]')!.focus();
  });
  el('help').addEventListener('click', () => {
    if (solved[current]) return;
    questions[current].querySelector<HTMLElement>('[data-story-hint]')!.hidden = false;
    say('Mirá la pista y probá con los objetos de la escena. Después elegí tu respuesta.', 'Read the hint and try the scene objects. Then choose your answer.');
  });
  el('replay').addEventListener('click', () => {
    current = 0; solved = [false,false]; resets.forEach(reset => reset());
    questions.forEach((q,i) => {
      q.hidden = i !== 0; q.querySelector<HTMLElement>('[data-story-hint]')!.hidden = true;
      q.querySelector<HTMLElement>('[data-story-explanation]')!.hidden = true;
      q.querySelectorAll<HTMLButtonElement>('[data-story-answer]').forEach(b => { b.disabled = false; b.classList.remove('is-correct'); });
    });
    scenes.forEach((s,i) => { s.hidden = i !== 0; s.querySelector<HTMLElement>('[data-story-prize]')!.hidden = true; });
    root.querySelectorAll('[data-story-checkpoint]').forEach(c => c.classList.remove('is-done'));
    root.querySelector<HTMLElement>('[data-story-finale]')?.setAttribute('hidden','');
    el('next').hidden = true; el('finish').hidden = true; el('feedback').textContent = '';
    el('speech').textContent = questions[0].dataset.intro!;
    questions[0].querySelector<HTMLElement>('[data-story-question-heading]')!.focus();
  });
});
