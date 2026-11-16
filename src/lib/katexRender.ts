import katex from 'katex';

/**
 * Pre-renders LaTeX mathematical expressions into accessible HTML/MathML on the server.
 */
export function renderLatexToHtml(latex: string, displayMode = false): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode,
      output: 'htmlAndMathml',
    });
  } catch {
    return `<code>${latex}</code>`;
  }
}
