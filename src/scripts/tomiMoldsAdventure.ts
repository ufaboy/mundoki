document.querySelectorAll<HTMLElement>('[data-molds-adventure]').forEach(root => {
  const es = root.dataset.locale === 'es-AR';
  const el = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-mold-${name}]`)!;
  const pieces = [...root.querySelectorAll<HTMLButtonElement>('[data-mold-piece]')];
  const answers = [...root.querySelectorAll<HTMLButtonElement>('[data-mold-answer]')];
  const reasons = [...root.querySelectorAll<HTMLButtonElement>('[data-mold-reason]')];
  let stage: 'explore' | 'count' | 'counted' | 'reason' | 'complete' = 'explore';
  let spread = false;
  const text = (name: string, a: string, b: string) => { el(name).textContent = es ? a : b; };
  const layout = () => {
    root.classList.toggle('molds-spread', spread);
    text('arrange', spread ? '→← Juntar los moldes' : '↔ Separar los moldes', spread ? '→← Bring the molds together' : '↔ Spread the molds out');
    text('layout', spread ? 'Separados' : 'Juntos', spread ? 'Spread out' : 'Close together');
  };
  el('arrange').addEventListener('click', () => {
    spread = !spread; layout();
    if (stage === 'explore') { stage = 'count'; answers.forEach(b => { b.disabled = false; }); }
    text('feedback', 'Cambiamos la separación. Podés volver a contar los mismos moldes.', 'We changed the spacing. You can count the same molds again.');
  });
  pieces.forEach(piece => piece.addEventListener('click', () => {
    if (piece.getAttribute('aria-pressed') === 'true') return;
    piece.setAttribute('aria-pressed', 'true');
    const n = pieces.filter(p => p.getAttribute('aria-pressed') === 'true').length;
    text('feedback', `${n} ${n === 1 ? 'molde marcado' : 'moldes marcados'}.`, `${n} ${n === 1 ? 'mold marked' : 'molds marked'}.`);
  }));
  answers.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'count') return;
    if (button.dataset.moldAnswer !== '4') {
      text('feedback', 'Una fila más larga no siempre tiene más objetos. Contá cada molde una sola vez.', 'A longer row does not always have more objects. Count each mold once.');
      return;
    }
    stage = 'counted'; root.classList.add('molds-found'); button.classList.add('is-correct');
    answers.forEach(b => { b.disabled = true; }); el('next').hidden = false;
    text('speech', '¡Siguen siendo cuatro! Ahora puedo alcanzar el cucharón.', 'There are still four! Now I can reach the scoop.');
    text('feedback', '¡Sí, cuatro! Solo cambiamos sus lugares. Tomi toma el cucharón.', 'Yes, four! We only changed their positions. Tomi picks up the scoop.');
  }));
  el('next').addEventListener('click', () => {
    if (stage !== 'counted') return;
    stage = 'reason'; el('next').hidden = true; el('answers').hidden = true; el('reasons').hidden = false;
    text('step', '2', '2'); text('eyebrow', 'CONTÁ CÓMO LO SABÉS', 'EXPLAIN HOW YOU KNOW');
    text('question', '¿Por qué sigue habiendo cuatro moldes?', 'Why are there still four molds?');
    text('instruction', 'Podés juntarlos y separarlos otra vez. Elegí la explicación.', 'You can bring them together and spread them out again. Choose the explanation.');
    text('feedback', '', ''); reasons[0].focus();
  });
  reasons.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'reason') return;
    if (button.dataset.moldReason !== 'same') {
      text('feedback', 'El espacio cambió, pero mirá los objetos: ¿apareció o desapareció algún molde?', 'The spacing changed, but look at the objects: did any mold appear or disappear?');
      return;
    }
    stage = 'complete'; spread = false; layout(); root.classList.add('molds-complete');
    button.classList.add('is-correct'); reasons.forEach(b => { b.disabled = true; });
    el('finish').hidden = false;
    text('step', '✓', '✓'); text('speech', '¡Todo ordenado! Los cuatro moldes están juntos y el cucharón ya está listo.', 'All tidy! The four molds are together and the scoop is ready.');
    text('feedback', '¡Exacto! No agregamos ni sacamos ninguno. Cambió la separación, no la cantidad.', 'Exactly! We did not add or remove any. The spacing changed, not the number.');
    text('reset', 'Jugar otra vez ↻', 'Play again ↻');
    el<HTMLButtonElement>('arrange').disabled = true;
  }));
  el('help').addEventListener('click', () => {
    text('feedback', stage === 'explore' ? 'Primero contá los moldes juntos. Después tocá «Separar los moldes».' : 'Seguí cada figura: círculo, estrella, corazón y cuadrado. Son las mismas antes y después.', stage === 'explore' ? 'First count the molds together. Then choose “Spread the molds out.”' : 'Follow each shape: circle, star, heart, and square. They are the same before and after.');
  });
  el('reset').addEventListener('click', () => {
    stage = 'explore'; spread = false; layout(); root.classList.remove('molds-found', 'molds-complete');
    pieces.forEach(p => p.setAttribute('aria-pressed', 'false'));
    answers.forEach(b => { b.disabled = true; b.classList.remove('is-correct'); });
    reasons.forEach(b => { b.disabled = false; b.classList.remove('is-correct'); });
    el<HTMLButtonElement>('arrange').disabled = false;
    el('answers').hidden = false; el('reasons').hidden = true; el('next').hidden = true; el('finish').hidden = true;
    text('step', '1', '1'); text('eyebrow', 'MOVÉ, CONTÁ Y COMPARÁ', 'MOVE, COUNT, AND COMPARE');
    text('question', 'Separá los moldes. ¿Cuántos hay ahora?', 'Spread the molds out. How many are there now?');
    text('instruction', 'Primero separalos con el botón. Podés tocar cada molde para contarlo.', 'First use the button to spread them out. You can tap each mold to count it.');
    text('speech', 'El cucharón quedó detrás de los moldes. ¡Separemos los cuatro para alcanzarlo!', 'The scoop is behind the molds. Let’s spread the four molds out to reach it!');
    text('feedback', '', ''); text('reset', 'Empezar de nuevo', 'Start again'); el('arrange').focus();
  });
});
