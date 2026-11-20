import { hasGradeOneEvidence } from '../content/grade1/evidence';

document.querySelectorAll<HTMLFormElement>('[data-g1-checks]').forEach(form => {
  const es = form.dataset.locale === 'es-AR';
  const summary = form.querySelector<HTMLElement>('[data-summary]')!;
  const clearFeedback = () => {
    form.querySelectorAll<HTMLElement>('[data-feedback]').forEach(p => { p.hidden = true; });
    summary.textContent = '';
  };
  form.addEventListener('change', clearFeedback);
  form.addEventListener('reset', clearFeedback);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const correct = Array.from(form.querySelectorAll<HTMLFieldSetElement>('fieldset')).map(field => {
      // Typed-number checks (Grade 2) keep the expected number in data-answer.
      const chosen = field.querySelector<HTMLInputElement>('input[data-entry]') ?? field.querySelector<HTMLInputElement>('input:checked');
      const value = chosen?.value.trim() ?? '';
      const matches = /^\d+$/.test(value) && Number(value) === Number(field.dataset.answer);
      field.querySelector<HTMLElement>('[data-result]')!.textContent = matches
        ? (es ? 'Correcto.' : 'Correct.') : (es ? 'Revisemos.' : 'Let’s review.');
      field.querySelector<HTMLElement>('[data-feedback]')!.hidden = false;
      return matches;
    });
    const score = correct.filter(Boolean).length;
    summary.textContent = `${score} / ${correct.length}. `;
    if (form.dataset.assessment === 'true') {
      summary.textContent += hasGradeOneEvidence(correct)
        ? (es ? 'Resolviste también la aplicación y la explicación. Mostrá ahora tu idea con un dibujo y volvé a practicar en una o dos semanas.' : 'You also solved the application and explanation. Now show your idea with a drawing and practice again in one or two weeks.')
        : (es ? 'Revisá las explicaciones, especialmente las preguntas 4 y 5. Volvé al ejemplo que necesites antes de probar otra vez.' : 'Review the explanations, especially questions 4 and 5. Revisit the example you need before trying again.');
    } else {
      summary.textContent += es ? 'Leé las explicaciones y contá cómo pensaste.' : 'Read the explanations and tell how you thought about it.';
    }
  });
});

document.querySelectorAll<HTMLElement>('[data-scene]').forEach(scene => {
  const cards = scene.querySelectorAll<HTMLButtonElement>('[data-scene-item]');
  cards.forEach(card => card.addEventListener('click', () => {
    card.setAttribute('aria-pressed', String(card.getAttribute('aria-pressed') !== 'true'));
  }));
  scene.querySelector('[data-scene-reset]')?.addEventListener('click', () => {
    cards.forEach(card => card.setAttribute('aria-pressed', 'false'));
    scene.querySelector('[data-scene-items]')?.classList.remove('g1-spread');
  });
  scene.querySelector('[data-scene-arrange]')?.addEventListener('click', () => {
    scene.querySelector('[data-scene-items]')?.classList.toggle('g1-spread');
  });
});
