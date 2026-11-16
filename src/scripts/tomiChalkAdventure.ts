document.querySelectorAll<HTMLElement>('[data-chalk-adventure]').forEach(root => {
  const es = root.dataset.locale === 'es-AR';
  const el = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-chalk-${name}]`)!;
  const sticks = [...root.querySelectorAll<HTMLButtonElement>('[data-chalk-stick]')];
  const dots = [...root.querySelectorAll<HTMLElement>('[data-chalk-dot]')];
  const answers = [...root.querySelectorAll<HTMLButtonElement>('[data-chalk-answer]')];
  const reasons = [...root.querySelectorAll<HTMLButtonElement>('[data-chalk-reason]')];
  let stage: 'count' | 'labelled' | 'meaning' | 'complete' = 'count';
  const text = (name: string, a: string, b: string) => { el(name).textContent = es ? a : b; };
  const label = (n: string) => {
    el('label').textContent = n;
    el('label').setAttribute('aria-label', n === '?' ? (es ? 'Etiqueta sin número' : 'Label without a number') : (es ? `Etiqueta: ${n} tizas` : `Label: ${n} pieces of chalk`));
  };
  sticks.forEach((stick, i) => stick.addEventListener('click', () => {
    if (stick.hidden || stick.getAttribute('aria-pressed') === 'true' || stage === 'complete') return;
    stick.setAttribute('aria-pressed', 'true'); dots[i].classList.add('is-marked');
    const n = sticks.filter(s => !s.hidden && s.getAttribute('aria-pressed') === 'true').length;
    text('feedback', `${n} ${n === 1 ? 'tiza marcada' : 'tizas marcadas'}. El punto muestra la misma tiza.`, `${n} ${n === 1 ? 'piece marked' : 'pieces marked'}. The dot represents the same piece of chalk.`);
  }));
  answers.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'count') return;
    if (button.dataset.chalkAnswer !== '4') {
      text('feedback', 'Contá cada tiza una vez. La etiqueta no es otra tiza, y los puntos muestran las mismas tizas.', 'Count each piece once. The label is not another piece, and the dots show the same chalk.'); return;
    }
    stage = 'labelled'; label('4'); root.classList.add('chalk-labelled');
    button.classList.add('is-correct'); answers.forEach(b => { b.disabled = true; }); el('next').hidden = false;
    text('speech', '¡Cuatro tizas, cuatro puntos y un 4 en la etiqueta!', 'Four pieces of chalk, four dots, and a 4 on the label!');
    text('feedback', '¡Sí! El número 4 representa las cuatro tizas. La primera caja está lista.', 'Yes! The number 4 represents the four pieces of chalk. The first box is ready.');
  }));
  el('next').addEventListener('click', () => {
    if (stage !== 'labelled') return;
    stage = 'meaning'; root.classList.remove('chalk-labelled'); root.classList.add('chalk-second-box');
    sticks.forEach(s => { s.hidden = false; s.setAttribute('aria-pressed', 'false'); });
    dots.forEach(d => { d.hidden = false; d.classList.remove('is-marked'); });
    label('6'); text('box-title', 'OTRA CAJA · 6 TIZAS', 'ANOTHER BOX · 6 PIECES');
    el('answers').hidden = true; el('next').hidden = true; el('reasons').hidden = false;
    text('step', '2', '2'); text('eyebrow', '¿QUÉ NOS DICE EL NÚMERO?', 'WHAT DOES THE NUMBER TELL US?');
    text('question', '¿Para qué sirve el 6 en esta otra caja?', 'What does the 6 on this other box do?');
    text('instruction', 'Ahora miramos otra caja, con seis tizas. La etiqueta está afuera.', 'Now we are looking at a different box, with six pieces of chalk. The label is outside.');
    text('speech', 'Esta es otra caja: tiene seis tizas. ¿Qué nos cuenta su etiqueta?', 'This is a different box: it has six pieces of chalk. What does its label tell us?');
    text('feedback', '', ''); reasons[0].focus();
  });
  reasons.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'meaning') return;
    if (button.dataset.chalkReason !== 'total') {
      text('feedback', 'Mirá las tizas adentro y la etiqueta afuera. Escribir un número no agrega objetos.', 'Look at the chalk inside and the label outside. Writing a number does not add objects.'); return;
    }
    stage = 'complete'; root.classList.add('chalk-labelled'); button.classList.add('is-correct');
    reasons.forEach(b => { b.disabled = true; }); el('finish').hidden = false;
    text('step', '✓', '✓'); text('instruction', 'La etiqueta nombra la cantidad. No se cuenta como otra tiza.', 'The label names the quantity. It does not count as another piece of chalk.');
    text('speech', '¡Las dos cajas listas! Ahora sabemos cuántas tizas hay en cada una.', 'Both boxes are ready! Now we know how much chalk is in each one.');
    text('feedback', '¡Exacto! El 6 indica cuántas tizas hay. No agrega ninguna. ¡Misión cumplida!', 'Exactly! The 6 tells how many pieces of chalk there are. It adds none. Mission complete!');
    text('reset', 'Jugar otra vez ↻', 'Play again ↻');
  }));
  el('help').addEventListener('click', () => {
    if (stage === 'count' || stage === 'labelled') text('feedback', 'Tocá cada tiza una sola vez. Cada una tiene un punto en el dibujo: son dos formas de mostrar la misma cantidad.', 'Tap each piece once. Each one has a dot in the picture: these are two ways to show the same quantity.');
    else text('feedback', 'Contá solamente las tizas. El 6 es una etiqueta que dice el total.', 'Count only the pieces of chalk. The 6 is a label telling us the total.');
  });
  el('reset').addEventListener('click', () => {
    stage = 'count'; root.classList.remove('chalk-labelled', 'chalk-second-box');
    sticks.forEach((s,i) => { s.hidden = i >= 4; s.setAttribute('aria-pressed','false'); });
    dots.forEach((d,i) => { d.hidden = i >= 4; d.classList.remove('is-marked'); });
    [...answers,...reasons].forEach(b => { b.disabled = false; b.classList.remove('is-correct'); });
    label('?'); text('box-title', 'CAJA PEQUEÑA', 'SMALL BOX');
    el('answers').hidden = false; el('reasons').hidden = true; el('next').hidden = true; el('finish').hidden = true;
    text('step', '1', '1'); text('eyebrow', 'CONTÁ Y PONÉ LA ETIQUETA', 'COUNT AND LABEL');
    text('question', '¿Qué número representa estas tizas?', 'Which number represents these pieces of chalk?');
    text('instruction', 'Tocá cada tiza para marcarla. Cada punto representa una tiza.', 'Tap each piece to mark it. Each dot represents one piece of chalk.');
    text('speech', '¡Llevemos tizas para dibujar! ¿Qué número ponemos en esta caja?', 'Let’s take chalk to draw! Which number belongs on this box?');
    text('feedback', '', ''); text('reset', 'Empezar de nuevo', 'Start again'); sticks[0].focus();
  });
});
