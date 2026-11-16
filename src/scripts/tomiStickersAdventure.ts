document.querySelectorAll<HTMLElement>('[data-stickers-adventure]').forEach(root => {
  const es = root.dataset.locale === 'es-AR';
  const el = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-sticker-${name}]`)!;
  const pieces = [...root.querySelectorAll<HTMLButtonElement>('[data-sticker-piece]')];
  const answers = [...root.querySelectorAll<HTMLButtonElement>('[data-sticker-answer]')];
  const reasons = [...root.querySelectorAll<HTMLButtonElement>('[data-sticker-reason]')];
  const second = root.querySelector<HTMLElement>('[data-sticker-group="1"]')!;
  const secondTitle = root.querySelector<HTMLElement>('[data-sticker-group-title="1"]')!;
  const secondCaption = root.querySelector<HTMLElement>('[data-sticker-caption="1"]')!;
  let stage: 'count' | 'saved' | 'tens' | 'complete' = 'count';
  const text = (name: string, a: string, b: string) => { el(name).textContent = es ? a : b; };
  pieces.forEach(piece => piece.addEventListener('click', () => {
    if (piece.hidden || stage === 'complete' || piece.getAttribute('aria-pressed') === 'true') return;
    piece.setAttribute('aria-pressed', 'true');
    const group = piece.dataset.stickerGroupIndex;
    const n = pieces.filter(p => !p.hidden && p.dataset.stickerGroupIndex === group && p.getAttribute('aria-pressed') === 'true').length;
    text('feedback', `${n} ${n === 1 ? 'figurita marcada' : 'figuritas marcadas'} ${group === '0' ? 'en la primera hoja' : 'en el segundo grupo'}.`, `${n} ${n === 1 ? 'sticker marked' : 'stickers marked'} ${group === '0' ? 'on the first sheet' : 'in the second group'}.`);
  }));
  answers.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'count') return;
    if (button.dataset.stickerAnswer !== '17') {
      text('feedback', 'Siete son las sueltas. No olvides las diez de la hoja: diez, once, doce…', 'Seven is just the loose ones. Remember the ten on the sheet: ten, eleven, twelve…'); return;
    }
    stage = 'saved'; text('total', '17', '17'); root.classList.add('stickers-success');
    button.classList.add('is-correct'); answers.forEach(b => { b.disabled = true; });
    el('reward').hidden = false; el('next').hidden = false;
    text('reward-text', '17 figuritas listas para el álbum', '17 stickers ready for the album');
    text('speech', '¡Diecisiete! Una decena y siete sueltas. ¡La primera colección está lista!', 'Seventeen! One ten and seven loose ones. The first collection is ready!');
    text('feedback', '¡Sí! 10 + 7 = 17. Guardamos esta colección para compartir.', 'Yes! 10 + 7 = 17. This collection is ready to share.');
  }));
  el('next').addEventListener('click', () => {
    if (stage !== 'saved') return;
    stage = 'tens'; root.classList.remove('stickers-success');
    el('keepsake').hidden = false; el('reward').hidden = true; el('next').hidden = true; el('answers').hidden = true; el('reasons').hidden = false;
    pieces.forEach(p => { p.hidden = false; p.setAttribute('aria-pressed', 'false'); });
    second.classList.remove('stickers-loose');
    secondTitle.textContent = es ? 'Otra decena' : 'Another ten';
    secondCaption.textContent = es ? '10 figuritas en otra hoja' : '10 stickers on another sheet';
    text('part', '10', '10'); text('total', '20', '20'); text('step', '2', '2');
    text('eyebrow', 'OTRO REGALO · DOS HOJAS COMPLETAS', 'ANOTHER GIFT · TWO FULL SHEETS');
    text('question', '¿Por qué veinte figuritas son dos decenas?', 'Why are twenty stickers two tens?');
    text('instruction', 'Ahora preparamos otro regalo con dos hojas completas. Mirá cuántas figuritas tiene cada hoja.', 'Now we are preparing a different gift with two full sheets. Look at how many stickers each sheet holds.');
    text('speech', 'La colección de diecisiete ya está guardada. Para otro amigo, preparemos dos hojas de diez.', 'The collection of seventeen is already packed. For another friend, let’s prepare two sheets of ten.');
    text('feedback', '', ''); reasons[0].focus();
  });
  reasons.forEach(button => button.addEventListener('click', () => {
    if (stage !== 'tens') return;
    if (button.dataset.stickerReason !== 'tens') {
      text('feedback', 'Hay dos hojas, pero cada hoja tiene diez figuritas. Contá las figuritas, no solo las hojas.', 'There are two sheets, but each sheet has ten stickers. Count the stickers, not just the sheets.'); return;
    }
    stage = 'complete'; root.classList.add('stickers-success'); button.classList.add('is-correct'); reasons.forEach(b => { b.disabled = true; });
    el('reward').hidden = false; el('finish').hidden = false;
    text('reward-text', '20 figuritas en el segundo regalo', '20 stickers in the second gift');
    text('step', '✓', '✓'); text('reset', 'Jugar otra vez ↻', 'Play again ↻');
    text('speech', '¡Diez y diez son veinte! Los regalos están listos para mis amigos.', 'Ten and ten make twenty! The gifts are ready for my friends.');
    text('feedback', '¡Exacto! Cada decena tiene diez unidades: 10 + 10 = 20.', 'Exactly! Each ten contains ten ones: 10 + 10 = 20.');
  }));
  el('help').addEventListener('click', () => {
    if (stage === 'count' || stage === 'saved') text('feedback', 'La hoja tiene dos filas de cinco: diez. Después seguí con las siete sueltas.', 'The sheet has two rows of five: ten. Then count on with the seven loose ones.');
    else text('feedback', 'Una hoja tiene diez figuritas. La otra también. Juntamos dos grupos de diez.', 'One sheet holds ten stickers. The other does too. We join two groups of ten.');
  });
  el('reset').addEventListener('click', () => {
    stage = 'count'; root.classList.remove('stickers-success');
    pieces.forEach(p => { p.hidden = p.dataset.stickerGroupIndex === '1' && Number(p.dataset.stickerPiece!.split('-')[1]) >= 7; p.setAttribute('aria-pressed', 'false'); });
    [...answers,...reasons].forEach(b => { b.disabled = false; b.classList.remove('is-correct'); });
    second.classList.add('stickers-loose'); secondTitle.textContent = es ? 'Siete sueltas' : 'Seven loose ones'; secondCaption.textContent = es ? '7 figuritas fuera de la hoja' : '7 stickers outside the sheet';
    el('answers').hidden = false; el('reasons').hidden = true; el('keepsake').hidden = true; el('reward').hidden = true; el('next').hidden = true; el('finish').hidden = true;
    text('part', '7', '7'); text('total', '?', '?'); text('step', '1', '1'); text('eyebrow', 'UNA DECENA Y ALGUNAS MÁS', 'ONE TEN AND SOME MORE');
    text('question', 'Una decena y siete unidades: ¿cuántas figuritas hay?', 'One ten and seven ones: how many stickers are there?');
    text('instruction', 'La hoja completa vale diez. Seguí contando las sueltas: once, doce… Podés marcar cada figurita.', 'The full sheet stands for ten. Count on with the loose ones: eleven, twelve… You can mark each sticker.');
    text('speech', '¡Llevemos figuritas! Esta hoja tiene diez, y acá hay siete sueltas.', 'Let’s bring stickers! This sheet has ten, and here are seven loose ones.');
    text('feedback', '', ''); text('reset', 'Empezar de nuevo', 'Start again'); pieces[0].focus();
  });
});
