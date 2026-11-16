import { equalGroupModel, placeValueParts, type GroupModelMode } from '../math/primaryModels';

document.querySelectorAll<HTMLElement>('[data-g2-lab]').forEach(lab => {
  const es = lab.dataset.locale === 'es-AR';
  const summary = lab.querySelector<HTMLElement>('[data-lab-summary]')!;
  const model = lab.querySelector<HTMLElement>('[data-lab-model]')!;
  const addRow = (label: string, count: number, item: string, className: string) => {
    const row = document.createElement('div'); row.className = 'g2-model-row';
    const heading = document.createElement('strong'); heading.textContent = label; row.append(heading);
    for (let index = 0; index < count; index++) {
      const token = document.createElement('span'); token.className = className; token.textContent = item; row.append(token);
    }
    if (count === 0) row.append(document.createTextNode('0'));
    model.append(row);
  };
  const invalid = () => {
    model.replaceChildren();
    summary.textContent = es ? 'Usá números enteros dentro de los límites indicados.' : 'Use whole numbers within the stated limits.';
  };
  if (lab.dataset.g2Lab === 'place') {
    const input = lab.querySelector<HTMLInputElement>('[data-place-number]')!;
    const exchange = lab.querySelector<HTMLInputElement>('[data-place-exchange]')!;
    const buttons = lab.querySelectorAll<HTMLButtonElement>('[data-place-step]');
    const render = () => {
      const value = input.valueAsNumber;
      buttons.forEach(button => {
        const next = value + Number(button.dataset.placeStep);
        button.disabled = !Number.isInteger(value) || next < 0 || next > 1000;
      });
      if (!Number.isInteger(value) || value < 0 || value > 1000) { invalid(); return; }
      exchange.disabled = value < 100;
      if (exchange.disabled) exchange.checked = false;
      const parts = placeValueParts(value, exchange.checked);
      summary.textContent = `${value} = ${parts.hundreds * 100} + ${parts.tens * 10} + ${parts.ones}. ` + (es
        ? `${parts.hundreds} centenas, ${parts.tens} decenas y ${parts.ones} unidades.`
        : `${parts.hundreds} hundreds, ${parts.tens} tens, and ${parts.ones} ones.`);
      model.replaceChildren();
      addRow(es ? 'Centenas' : 'Hundreds', parts.hundreds, '100', 'g2-hundred');
      addRow(es ? 'Decenas' : 'Tens', parts.tens, '10', 'g2-ten');
      addRow(es ? 'Unidades' : 'Ones', parts.ones, '1', 'g2-one');
    };
    input.addEventListener('input', render); exchange.addEventListener('change', render);
    buttons.forEach(button => button.addEventListener('click', () => { input.value = String(input.valueAsNumber + Number(button.dataset.placeStep)); render(); }));
    render();
  } else {
    const mode = lab.querySelector<HTMLSelectElement>('[data-group-mode]')!;
    const first = lab.querySelector<HTMLInputElement>('[data-group-first]')!;
    const second = lab.querySelector<HTMLInputElement>('[data-group-second]')!;
    const render = () => {
      const multiply = mode.value === 'multiply';
      first.max = multiply ? '6' : '36';
      lab.querySelector<HTMLElement>('[data-first-label]')!.textContent = multiply ? (es ? 'Grupos (0–6)' : 'Groups (0–6)') : (es ? 'Total de objetos (0–36)' : 'Total objects (0–36)');
      lab.querySelector<HTMLElement>('[data-second-label]')!.textContent = mode.value === 'share' ? (es ? 'Grupos que reciben (1–6)' : 'Receiving groups (1–6)') : (es ? 'Objetos por grupo (1–6)' : 'Objects per group (1–6)');
      let result: ReturnType<typeof equalGroupModel>;
      try { result = equalGroupModel(mode.value as GroupModelMode, first.valueAsNumber, second.valueAsNumber); }
      catch { invalid(); return; }
      model.replaceChildren();
      for (let index = 0; index < result.groups; index++) addRow(`${es ? 'Grupo' : 'Group'} ${index + 1}`, result.each, '●', 'g2-dot');
      if (result.remainder) addRow(es ? 'Sin agrupar' : 'Ungrouped', result.remainder, '●', 'g2-dot');
      const equation = `${result.groups} × ${result.each} + ${result.remainder} = ${result.total}. `;
      summary.textContent = equation + (es
        ? `${result.groups} grupos de ${result.each}; ${result.remainder} sin agrupar.`
        : `${result.groups} groups of ${result.each}; ${result.remainder} ungrouped.`);
      if (result.remainder) summary.textContent += es ? ' Para un reparto exacto, elegí otro total o tamaño de grupo.' : ' For exact sharing, choose a different total or group size.';
    };
    mode.addEventListener('change', () => {
      first.value = mode.value === 'multiply' ? '4' : '18';
      second.value = mode.value === 'multiply' ? '6' : '3';
      render();
    });
    first.addEventListener('input', render); second.addEventListener('input', render); render();
  }
});
