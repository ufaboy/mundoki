import { createLessonFactory, type GradeOneCheck } from '../lessonModel';
const lesson = createLessonFactory(4);
/** Compact authoring only: every explanation and question is authored in both locales. */
export function micro(p: number, n: number, title: string, objective: string, warmup: string,
  story: string, steps: string[], diagram: string[], mistake: string, exit: string, checks: GradeOneCheck[],
  caption = 'Esquema del ejemplo: las etiquetas indican los valores, no el tamaño en pantalla.|Example schematic: labels indicate values, not size on screen.') {
  const result = lesson(p,n,title,objective,warmup,story,steps,diagram,caption,mistake,exit,checks);
  result.scene.layout = 'aligned';
  return result;
}
