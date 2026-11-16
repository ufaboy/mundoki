document.querySelectorAll<HTMLElement>('[data-backpack-adventure]').forEach(root => {
  const es = root.dataset.locale === 'es-AR';
  const el = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-pack-${name}]`)!;
  const toys = [...root.querySelectorAll<HTMLButtonElement>('[data-pack-toy]')];
  const emptyAnswers = [...root.querySelectorAll<HTMLButtonElement>('[data-pack-empty]')];
  const totals = [...root.querySelectorAll<HTMLButtonElement>('[data-pack-total]')];
  let stage: 'empty' | 'ready' | 'count' | 'complete' = 'empty';
  let count = 0;
  const text = (name: string, spanish: string, english: string) => { el(name).textContent = es ? spanish : english; };
  emptyAnswers.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'empty') return;
    if (button.dataset.packEmpty !== '0') {
      root.classList.add('backpack-hint');
      text('feedback', 'Mirá adentro: todavía no guardamos ningún juguete. Los de afuera no cuentan dentro.', 'Look inside: we haven’t packed any toys yet. The toys outside do not count as inside.');
      return;
    }
    stage = 'ready';
    button.classList.add('is-correct'); emptyAnswers.forEach(b => { b.disabled = true; });
    el('zero').hidden = false; el('next').hidden = false;
    text('caption', 'Vacío', 'Empty');
    text('speech', '¡Cero! El bolsillo está vacío. Hay lugar para nuestros juguetes.', 'Zero! The pocket is empty. There’s room for our toys.');
    text('feedback', '¡Sí! Ningún juguete significa 0 juguetes.', 'Yes! No toys means 0 toys.');
  }));
  el('next').addEventListener('click', () => {
    if (stage !== 'ready') return;
    stage = 'count'; el('next').hidden = true; el('empty-answers').hidden = true; el('total-answers').hidden = false;
    root.classList.remove('backpack-hint'); root.classList.add('backpack-counting');
    toys.forEach(t => { t.disabled = false; });
    text('step', '2', '2'); text('eyebrow', 'CONTÁ LOS JUGUETES', 'COUNT THE TOYS');
    text('question', '¿Cuántos juguetes preparamos para llevar?', 'How many toys did we prepare to take?');
    text('instruction', 'Tocá los juguetes de afuera, uno por uno. Después elegí el total.', 'Tap the toys outside, one by one. Then choose the total.');
    text('speech', 'Un balde, una palita y un molde. ¡Contemos sin repetir!', 'A bucket, a shovel, and a mold. Let’s count each one once!');
    text('feedback', '', ''); toys[0].focus();
  });
  toys.forEach(toy => toy.addEventListener('click', () => {
    if (stage !== 'count' || toy.getAttribute('aria-pressed') === 'true') return;
    count++;
    toy.setAttribute('aria-pressed', 'true');
    toy.querySelector<HTMLElement>('.backpack-number')!.textContent = String(count);
    text('feedback', count === 3 ? 'Uno, dos, tres. ¿Qué número dice cuántos hay en total?' : `${count} ${count === 1 ? 'juguete marcado' : 'juguetes marcados'}.`, count === 3 ? 'One, two, three. Which number tells us how many altogether?' : `${count} ${count === 1 ? 'toy marked' : 'toys marked'}.`);
  }));
  totals.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'count') return;
    if (button.dataset.packTotal !== '3') {
      text('feedback', 'Contemos cada juguete una vez. El último número nos dice el total.', 'Let’s count each toy once. The last number tells us the total.');
      return;
    }
    el('toys').setAttribute('aria-label', es ? 'Tres juguetes dentro del bolsillo' : 'Three toys inside the pocket');
    text('instruction', '¡El bolsillo ya tiene los tres juguetes!', 'The pocket now holds all three toys!');
    stage = 'complete'; root.classList.add('backpack-packed');
    el('zero').hidden = true; el('finish').hidden = false;
    button.classList.add('is-correct'); totals.forEach(b => { b.disabled = true; });
    toys.forEach(t => { t.disabled = true; });
    text('step', '✓', '✓'); text('caption', '3 juguetes', '3 toys');
    text('speech', '¡Los tres adentro! Ya tenemos todo para jugar en la arena.', 'All three packed! We’re ready to play in the sand.');
    text('feedback', '¡Muy bien! Contamos 1, 2, 3: preparamos tres juguetes y los guardamos.', 'Well done! We counted 1, 2, 3: we prepared three toys and packed them.');
    text('reset', 'Jugar otra vez ↻', 'Play again ↻');
  }));
  el('help').addEventListener('click', () => {
    if (stage === 'empty' || stage === 'ready') {
      root.classList.add('backpack-hint');
      text('feedback', 'El bolsillo está vacío: no hay objetos para contar dentro. Eso se llama cero.', 'The pocket is empty: there are no objects to count inside. That is called zero.');
    } else if (stage === 'count') text('feedback', 'Marcá el balde, la palita y el molde una sola vez. El último número es el total.', 'Mark the bucket, shovel, and mold once each. The last number is the total.');
    else text('feedback', 'Antes había cero adentro. Ahora guardamos los tres juguetes.', 'There were zero inside before. Now we have packed all three toys.');
  });
  el('reset').addEventListener('click', () => {
    stage = 'empty'; count = 0;
    el('toys').setAttribute('aria-label', es ? 'Tres juguetes fuera del bolsillo' : 'Three toys outside the pocket');
    root.classList.remove('backpack-hint', 'backpack-counting', 'backpack-packed');
    toys.forEach(t => { t.disabled = true; t.setAttribute('aria-pressed', 'false'); t.querySelector<HTMLElement>('.backpack-number')!.textContent = ''; });
    [...emptyAnswers, ...totals].forEach(b => { b.disabled = false; b.classList.remove('is-correct'); });
    el('zero').hidden = true; el('next').hidden = true; el('finish').hidden = true; el('total-answers').hidden = true; el('empty-answers').hidden = false;
    text('step', '1', '1'); text('caption', 'Mirá adentro', 'Look inside');
    text('eyebrow', 'MIRÁ EL BOLSILLO', 'LOOK INSIDE THE POCKET');
    text('question', '¿Cuántos juguetes hay dentro del bolsillo?', 'How many toys are inside the pocket?');
    text('instruction', 'Los juguetes están afuera. Mirá solamente dentro del bolsillo.', 'The toys are outside. Look only inside the pocket.');
    text('speech', '¡El autito ya está listo! Ahora preparemos los juguetes para la arena.', 'The toy car is ready! Now let’s pack our sand toys.');
    text('feedback', '', ''); text('reset', 'Empezar de nuevo', 'Start again'); emptyAnswers[0].focus();
  });
});
