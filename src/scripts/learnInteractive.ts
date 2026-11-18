import { Locale } from '../math/core/types';

export function initInteractiveDiagrams(): void {
  const containers = document.querySelectorAll<HTMLElement>('[data-interactive-diagram]');
  containers.forEach((container) => {
    const topicId = container.dataset.interactiveDiagram;
    const locale = (container.dataset.locale || 'es-AR') as Locale;

    if (topicId === 'addition-subtraction') {
      const inputA = document.getElementById('add-input-a') as HTMLInputElement | null;
      const inputB = document.getElementById('add-input-b') as HTMLInputElement | null;
      const labelA = document.getElementById('add-label-a');
      const labelB = document.getElementById('add-label-b');
      const svg = document.getElementById('add-svg');
      if (!inputA || !inputB || !svg) return;

      const render = () => {
        const a = Number(inputA.value);
        const b = Number(inputB.value);
        const tensA = Math.floor(a / 10);
        const onesA = a % 10;
        const tensB = Math.floor(b / 10);
        const onesB = b % 10;
        const extraTen = Math.floor((onesA + onesB) / 10);
        const remOnes = (onesA + onesB) % 10;
        const total = a + b;

        if (labelA) labelA.textContent = `${a} (${tensA}×10 + ${onesA})`;
        if (labelB) labelB.textContent = `${b} (${tensB}×10 + ${onesB})`;

        let parts = `<text x="16" y="24" font-size="12" fill="#334155" font-weight="600">${
          locale === 'es-AR'
            ? `Barras de 10 (${tensA + tensB} decenas = ${(tensA + tensB) * 10})`
            : `Ten-Rods (${tensA + tensB} tens = ${(tensA + tensB) * 10})`
        }</text>`;

        for (let i = 0; i < tensA; i++) {
          parts += `<g transform="translate(${16 + i * 28}, 36)"><rect width="20" height="100" rx="3" fill="#0284C7" /></g>`;
        }
        for (let i = 0; i < tensB; i++) {
          parts += `<g transform="translate(${16 + (tensA + i) * 28}, 36)"><rect width="20" height="100" rx="3" fill="#059669" /></g>`;
        }
        if (extraTen > 0) {
          parts += `<g transform="translate(${16 + (tensA + tensB) * 28 + 10}, 36)">
            <rect width="22" height="100" rx="3" fill="#D97706" stroke="#FEF3C7" stroke-width="2" />
            <text x="11" y="116" text-anchor="middle" font-size="10" fill="#B45309" font-weight="700">+10</text>
          </g>`;
        }

        parts += `<text x="340" y="24" font-size="12" fill="#334155" font-weight="600">${
          locale === 'es-AR'
            ? `Unidades (${onesA} + ${onesB} = ${onesA + onesB})`
            : `Single Ones (${onesA} + ${onesB} = ${onesA + onesB})`
        }</text>`;

        for (let idx = 0; idx < onesA + onesB; idx++) {
          const isFromA = idx < onesA;
          const isBundled = extraTen > 0 && idx < 10;
          const col = idx % 5;
          const row = Math.floor(idx / 5);
          parts += `<g transform="translate(${340 + col * 26}, ${40 + row * 26})">
            <rect width="20" height="20" rx="3" fill="${isFromA ? '#38BDF8' : '#34D399'}" stroke="${
              isBundled ? '#D97706' : '#0F172A'
            }" stroke-width="${isBundled ? '2.5' : '0.8'}" />
          </g>`;
        }

        if (extraTen > 0) {
          parts += `<rect x="335" y="35" width="135" height="56" rx="6" fill="none" stroke="#D97706" stroke-width="2" stroke-dasharray="4 3" />`;
        }

        parts += `<text x="16" y="172" font-size="14" fill="#0F172A" font-weight="700">${
          locale === 'es-AR'
            ? `Total: ${(tensA + tensB) * 10} (decenas) + ${extraTen * 10} (nueva decena) + ${remOnes} (unidades) = ${total}`
            : `Total: ${(tensA + tensB) * 10} (tens) + ${extraTen * 10} (new ten) + ${remOnes} (ones) = ${total}`
        }</text>`;

        svg.innerHTML = parts;
      };

      inputA.addEventListener('input', render);
      inputB.addEventListener('input', render);
      render();
    }

    if (topicId === 'multiplication-division') {
      const inputRows = document.getElementById('mul-input-rows') as HTMLInputElement | null;
      const inputCols = document.getElementById('mul-input-cols') as HTMLInputElement | null;
      const labelRows = document.getElementById('mul-label-rows');
      const labelCols = document.getElementById('mul-label-cols');
      const svg = document.getElementById('mul-svg');
      if (!inputRows || !inputCols || !svg) return;

      const render = () => {
        const rows = Number(inputRows.value);
        const cols = Number(inputCols.value);
        const total = rows * cols;
        if (labelRows) labelRows.textContent = String(rows);
        if (labelCols) labelCols.textContent = String(cols);

        let parts = '';
        for (let r = 0; r < rows; r++) {
          parts += `<rect x="24" y="${20 + r * 30}" width="${cols * 34 + 8}" height="26" rx="6" fill="#F1F5F9" stroke="#CBD5E1" />`;
          for (let c = 0; c < cols; c++) {
            parts += `<circle cx="${44 + c * 34}" cy="${33 + r * 30}" r="9" fill="#0284C7" />`;
          }
          parts += `<text x="${38 + cols * 34}" y="${38 + r * 30}" font-size="12" fill="#475569" font-family="monospace">+${cols}</text>`;
        }

        const repeated = Array.from({ length: rows }, () => cols).join(' + ');
        parts += `<text x="355" y="75" font-size="16" fill="#0F172A" font-weight="700">${rows} × ${cols} = ${total}</text>`;
        parts += `<text x="355" y="105" font-size="13" fill="#475569" font-family="monospace">${repeated} = ${total}</text>`;
        parts += `<text x="355" y="140" font-size="14" fill="#059669" font-weight="700">${
          locale === 'es-AR'
            ? `División inversa: ${total} ÷ ${rows} = ${cols}`
            : `Inverse division: ${total} ÷ ${rows} = ${cols}`
        }</text>`;

        svg.innerHTML = parts;
      };

      inputRows.addEventListener('input', render);
      inputCols.addEventListener('input', render);
      render();
    }

    if (topicId === 'fractions') {
      const inputNum = document.getElementById('frac-input-num') as HTMLInputElement | null;
      const inputDen = document.getElementById('frac-input-den') as HTMLInputElement | null;
      const labelNum = document.getElementById('frac-label-num');
      const labelDen = document.getElementById('frac-label-den');
      const btnSplit = document.getElementById('frac-btn-split');
      const svg = document.getElementById('frac-svg');
      if (!inputNum || !inputDen || !svg) return;

      let mult = 1;
      const render = () => {
        const den = Number(inputDen.value);
        inputNum.max = String(den);
        if (Number(inputNum.value) > den) {
          inputNum.value = String(den);
        }
        const num = Number(inputNum.value);
        if (labelNum) labelNum.textContent = String(num);
        if (labelDen) labelDen.textContent = String(den);

        const dispNum = num * mult;
        const dispDen = den * mult;

        let parts = `<text x="115" y="25" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">${
          locale === 'es-AR' ? 'Modelo Circular (Pizza)' : 'Circular Disc Model'
        }</text><g transform="translate(115, 108)">`;

        for (let i = 0; i < dispDen; i++) {
          const startAngle = (i * 2 * Math.PI) / dispDen - Math.PI / 2;
          const endAngle = ((i + 1) * 2 * Math.PI) / dispDen - Math.PI / 2;
          const r = 64;
          const x1 = r * Math.cos(startAngle);
          const y1 = r * Math.sin(startAngle);
          const x2 = r * Math.cos(endAngle);
          const y2 = r * Math.sin(endAngle);
          const pathData = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
          parts += `<path d="${pathData}" fill="${i < dispNum ? '#0284C7' : '#F1F5F9'}" stroke="#0F172A" stroke-width="1.5" />`;
        }
        parts += `</g>`;

        parts += `<text x="410" y="25" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">${
          locale === 'es-AR' ? 'Modelo de Barra de Energía' : 'Rectangular Energy Bar Model'
        }</text><g transform="translate(250, 56)">`;

        const segW = 320 / dispDen;
        for (let i = 0; i < dispDen; i++) {
          parts += `<rect x="${i * segW}" y="0" width="${segW}" height="48" fill="${
            i < dispNum ? '#059669' : '#F1F5F9'
          }" stroke="#0F172A" stroke-width="1.5" />`;
        }
        parts += `</g>`;

        const eqLabel = mult === 2 ? `${num}/${den} = ${dispNum}/${dispDen}` : `${dispNum}/${dispDen}`;
        parts += `<text x="410" y="145" text-anchor="middle" font-size="18" fill="#0F172A" font-weight="700" font-family="monospace">${eqLabel}</text>`;
        parts += `<text x="410" y="170" text-anchor="middle" font-size="12" fill="#475569">${
          locale === 'es-AR'
            ? `${dispNum} de ${dispDen} partes iguales (${Math.round((num / den) * 100)}% del entero)`
            : `${dispNum} of ${dispDen} equal parts (${Math.round((num / den) * 100)}% of the whole)`
        }</text>`;

        svg.innerHTML = parts;
      };

      inputNum.addEventListener('input', render);
      inputDen.addEventListener('input', render);
      btnSplit?.addEventListener('click', () => {
        mult = mult === 1 ? 2 : 1;
        if (btnSplit) {
          btnSplit.textContent =
            mult === 1
              ? locale === 'es-AR'
                ? 'Partir cada trozo ×2 (Equivalente)'
                : 'Split each slice ×2 (Equivalent)'
              : locale === 'es-AR'
                ? 'Volver a fracción original'
                : 'Restore original slices';
        }
        render();
      });
      render();
    }

    if (topicId === 'negative-numbers') {
      const inputStart = document.getElementById('neg-input-start') as HTMLInputElement | null;
      const inputDelta = document.getElementById('neg-input-delta') as HTMLInputElement | null;
      const labelStart = document.getElementById('neg-label-start');
      const labelDelta = document.getElementById('neg-label-delta');
      const svg = document.getElementById('neg-svg');
      if (!inputStart || !inputDelta || !svg) return;

      const render = () => {
        const start = Number(inputStart.value);
        const delta = Number(inputDelta.value);
        const end = start + delta;
        const toX = (val: number) => 310 + val * 24;

        if (labelStart) labelStart.textContent = String(start);
        if (labelDelta) labelDelta.textContent = delta >= 0 ? `+${delta}` : String(delta);

        let parts = `<line x1="30" y1="110" x2="590" y2="110" stroke="#334155" stroke-width="2.5" />`;
        for (let i = 0; i < 21; i++) {
          const val = i - 10;
          const x = toX(val);
          const isZero = val === 0;
          parts += `<line x1="${x}" y1="${isZero ? 96 : 103}" x2="${x}" y2="${isZero ? 124 : 117}" stroke="${
            isZero ? '#0F172A' : '#64748B'
          }" stroke-width="${isZero ? 3 : 1.5}" />`;
          parts += `<text x="${x}" y="142" text-anchor="middle" font-size="11" font-family="monospace" fill="${
            isZero ? '#0F172A' : val < 0 ? '#0284C7' : '#059669'
          }" font-weight="${isZero ? '700' : '400'}">${val}</text>`;
        }

        if (delta !== 0) {
          parts += `<path d="M ${toX(start)} 104 Q ${(toX(start) + toX(end)) / 2} 35 ${toX(end)} 104" fill="none" stroke="${
            delta > 0 ? '#059669' : '#DC2626'
          }" stroke-width="3" stroke-dasharray="5 3" />`;
        }

        parts += `<circle cx="${toX(start)}" cy="110" r="7" fill="#0284C7" />`;
        parts += `<circle cx="${toX(end)}" cy="110" r="8" fill="#D97706" stroke="#FFFFFF" stroke-width="2" />`;
        parts += `<text x="310" y="32" text-anchor="middle" font-size="15" fill="#0F172A" font-weight="700" font-family="monospace">${start} ${
          delta >= 0 ? `+ ${delta}` : `− ${Math.abs(delta)}`
        } = ${end}</text>`;

        svg.innerHTML = parts;
      };

      inputStart.addEventListener('input', render);
      inputDelta.addEventListener('input', render);
      render();
    }

    if (topicId === 'percentages-proportions') {
      const inputVal = document.getElementById('pct-input-val') as HTMLInputElement | null;
      const inputTotal = document.getElementById('pct-input-total') as HTMLInputElement | null;
      const labelVal = document.getElementById('pct-label-val');
      const labelTotal = document.getElementById('pct-label-total');
      const svg = document.getElementById('pct-svg');
      if (!inputVal || !inputTotal || !svg) return;

      const render = () => {
        const pct = Number(inputVal.value);
        const total = Number(inputTotal.value);
        const part = Number(((pct * total) / 100).toFixed(2));
        if (labelVal) labelVal.textContent = `${pct}% (${pct}/100)`;
        if (labelTotal) labelTotal.textContent = String(total);

        const fillW = (560 * pct) / 100;
        let parts = `<text x="24" y="28" font-size="12" fill="#334155" font-weight="600">${
          locale === 'es-AR' ? `Escala Porcentual: ${pct}% de 100%` : `Percent Scale: ${pct}% out of 100%`
        }</text>`;
        parts += `<rect x="24" y="38" width="560" height="28" rx="6" fill="#F1F5F9" stroke="#CBD5E1" />`;
        parts += `<rect x="24" y="38" width="${fillW}" height="28" rx="6" fill="#0284C7" />`;

        parts += `<text x="24" y="96" font-size="12" fill="#334155" font-weight="600">${
          locale === 'es-AR'
            ? `Cantidad Proporcional: ${part} de ${total}`
            : `Proportional Value: ${part} out of ${total}`
        }</text>`;
        parts += `<rect x="24" y="106" width="560" height="28" rx="6" fill="#F1F5F9" stroke="#CBD5E1" />`;
        parts += `<rect x="24" y="106" width="${fillW}" height="28" rx="6" fill="#059669" />`;
        parts += `<text x="304" y="156" text-anchor="middle" font-size="14" fill="#0F172A" font-weight="700" font-family="monospace">${pct}% × ${total} = (${pct}/100) × ${total} = ${part}</text>`;

        svg.innerHTML = parts;
      };

      inputVal.addEventListener('input', render);
      inputTotal.addEventListener('input', render);
      render();
    }
  });

  // Initialize Quick Check cards on Lesson pages
  const quickCheckBlocks = document.querySelectorAll<HTMLElement>('[data-quick-check]');
  quickCheckBlocks.forEach((block) => {
    const feedbackEl = block.querySelector<HTMLElement>('[data-qc-feedback]');
    const buttons = block.querySelectorAll<HTMLButtonElement>('[data-qc-option]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.qcCorrect === 'true';
        const explanation = btn.dataset.qcExplanation || '';
        buttons.forEach((b) => {
          b.style.borderColor = 'var(--border-strong)';
          b.style.backgroundColor = 'var(--bg-surface)';
        });
        btn.style.borderColor = isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)';
        btn.style.backgroundColor = isCorrect ? 'var(--bg-callout-emerald)' : 'var(--bg-callout-rose)';
        if (feedbackEl) {
          feedbackEl.style.display = 'block';
          feedbackEl.className = isCorrect ? 'callout callout-emerald text-sm' : 'callout callout-rose text-sm';
          feedbackEl.textContent = `${isCorrect ? '✓ ' : '✗ '}${explanation}`;
        }
      });
    });
  });

  // Initialize Server-Protected Premium Masterclass loader on Lesson pages
  const masterclassBtn = document.getElementById('btn-load-masterclass') as HTMLButtonElement | null;
  const masterclassBox = document.getElementById('masterclass-result-box');
  if (masterclassBtn && masterclassBox) {
    masterclassBtn.addEventListener('click', async () => {
      const topicId = masterclassBtn.dataset.topicId || 'percentages-proportions';
      const locale = masterclassBtn.dataset.locale || 'es-AR';
      const token = window.localStorage.getItem('mundoki_token') || '';
      masterclassBox.style.display = 'block';
      masterclassBox.textContent = locale === 'es-AR' ? 'Verificando acceso en el servidor...' : 'Verifying entitlement on server...';

      try {
        const res = await fetch(
          `/api/lessons/premium-content?topicId=${encodeURIComponent(topicId)}&locale=${encodeURIComponent(locale)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await res.json();
        if (!res.ok || !data.entitled) {
          masterclassBox.className = 'callout callout-amber text-sm';
          masterclassBox.innerHTML = `<strong>${
            locale === 'es-AR' ? 'Acceso restringido por el servidor:' : 'Server-restricted access:'
          }</strong> ${data.error || 'Premium entitlement required.'} <a href="/${
            locale === 'en-US' ? 'en-us' : 'es-ar'
          }/premium/">${locale === 'es-AR' ? 'Ver planes Premium →' : 'View Premium plans →'}</a>`;
          return;
        }
        masterclassBox.className = 'callout callout-emerald stack-sm';
        masterclassBox.innerHTML = `
          <h4>${data.masterclass.title}</h4>
          <p>${data.masterclass.secretStrategy}</p>
          <pre class="card-subtle text-mono">${data.masterclass.challengeLatex}</pre>
          <p class="text-sm text-muted">${data.masterclass.workedProof}</p>
        `;
      } catch {
        masterclassBox.className = 'callout callout-rose text-sm';
        masterclassBox.textContent =
          locale === 'es-AR' ? 'No se pudo conectar con el servidor.' : 'Could not reach server.';
      }
    });
  }
}
