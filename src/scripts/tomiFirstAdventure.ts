document.querySelectorAll<HTMLElement>('[data-tomi-adventure]').forEach(root => {
  const es = root.dataset.locale === 'es-AR';
  const el = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-tomi-${name}]`)!;
  const toys = [...root.querySelectorAll<HTMLButtonElement>('[data-tomi-toy]')];
  const answers = [...root.querySelectorAll<HTMLButtonElement>('[data-tomi-answer]')];
  const methods = [...root.querySelectorAll<HTMLButtonElement>('[data-tomi-method]')];
  let stage: 'count' | 'counted' | 'method' | 'complete' = 'count';
  const say = (spanish: string, english: string) => { el('feedback').textContent = es ? spanish : english; };
  toys.forEach(toy => toy.addEventListener('click', () => {
    if (stage !== 'count' || toy.getAttribute('aria-pressed') === 'true') return;
    toy.setAttribute('aria-pressed', 'true');
    const count = toys.filter(t => t.getAttribute('aria-pressed') === 'true').length;
    say(`${count} ${count === 1 ? 'juguete marcado' : 'juguetes marcados'}.`, `${count} ${count === 1 ? 'toy marked' : 'toys marked'}.`);
  }));
  answers.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'count') return;
    if (button.dataset.tomiAnswer !== '5') {
      say('Miremos juntos: marcá cada juguete una sola vez y volvé a contar.', 'Let’s look together: mark each toy once and count again.');
      root.classList.add('tomi-hint');
      return;
    }
    stage = 'counted';
    button.classList.add('is-correct');
    answers.forEach(a => { a.disabled = true; });
    root.classList.add('tomi-found');
    say('¡Sí, hay 5 juguetes! Tomi encontró su autito.', 'Yes, there are 5 toys! Tomi found his toy car.');
    el('speech').textContent = es ? '¡Cinco! Ahí está mi autito. ¡Gracias!' : 'Five! There’s my toy car. Thank you!';
    el('next').hidden = false;
  }));
  el('next').addEventListener('click', () => {
    if (stage !== 'counted') return;
    stage = 'method';
    el('count-answers').hidden = true;
    el('methods').hidden = false;
    el('next').hidden = true;
    el('step').textContent = '2';
    el('eyebrow').textContent = es ? 'CONTAMOS SIN REPETIR' : 'COUNTING EACH TOY ONCE';
    el('question').textContent = es ? '¿Qué ayuda a no contar un juguete dos veces?' : 'What helps us avoid counting a toy twice?';
    el('instruction').textContent = es ? 'Elegí una idea para ayudar a Tomi.' : 'Choose an idea to help Tomi.';
    el('feedback').textContent = '';
    methods[0].focus();
  });
  methods.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'method') return;
    if (button.dataset.tomiMethod !== 'mark') {
      say('Si contamos el mismo otra vez, parece que hay más. ¿Cómo podemos recordar cuáles contamos?', 'Counting the same toy again makes it seem like there are more. How can we remember which ones we counted?');
      return;
    }
    stage = 'complete';
    el('next-lesson').hidden = false;
    button.classList.add('is-correct');
    methods.forEach(m => { m.disabled = true; });
    toys.forEach(t => t.setAttribute('aria-pressed', 'true'));
    root.classList.add('tomi-complete');
    el('step').textContent = '✓';
    el('speech').textContent = es ? '¡Autito listo! Ya estamos un pasito más cerca de salir.' : 'Toy car ready! We’re one step closer to going out.';
    say('¡Exacto! Las marcas nos ayudan a contar cada juguete una vez. ¡Misión cumplida!', 'Exactly! The marks help us count each toy once. Mission complete!');
    el('reset').textContent = es ? 'Jugar otra vez ↻' : 'Play again ↻';
  }));
  el('help').addEventListener('click', () => {
    root.classList.add('tomi-hint');
    if (stage === 'count') say('Empezá por el osito y seguí hacia la derecha. Tocá un juguete nuevo cada vez.', 'Start with the teddy bear and move to the right. Tap a new toy each time.');
    else if (stage === 'method') say('Una marca te muestra cuáles ya contaste.', 'A mark shows you which ones you already counted.');
    else say('Cada juguete recibe un número. El último número nos dice cuántos hay.', 'Each toy gets one number. The last number tells us how many there are.');
  });
  el('reset').addEventListener('click', () => {
    stage = 'count';
    el('next-lesson').hidden = true;
    root.classList.remove('tomi-hint', 'tomi-found', 'tomi-complete');
    toys.forEach(t => t.setAttribute('aria-pressed', 'false'));
    [...answers, ...methods].forEach(b => { b.disabled = false; b.classList.remove('is-correct'); });
    el('count-answers').hidden = false; el('methods').hidden = true; el('next').hidden = true;
    el('step').textContent = '1';
    el('eyebrow').textContent = es ? 'CONTÁ Y ELEGÍ' : 'COUNT AND CHOOSE';
    el('question').textContent = es ? '¿Cuántos juguetes hay en el estante?' : 'How many toys are on the shelf?';
    el('instruction').textContent = es ? 'Tocá cada juguete una vez. Después elegí el número.' : 'Tap each toy once. Then choose the number.';
    el('speech').textContent = es ? '¡Hola! Quiero llevar mi autito. ¿Me ayudás a contar los juguetes?' : 'Hi! I want to take my toy car. Can you help me count the toys?';
    el('reset').textContent = es ? 'Empezar de nuevo' : 'Start again';
    el('feedback').textContent = ''; toys[0].focus();
  });
});
