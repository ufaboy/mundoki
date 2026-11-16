import { createLessonFactory, check, type GradeOneCheck } from '../lessonModel';
const lesson = createLessonFactory(7);
export { check as q };
export function l(p:number,n:number,title:string,objective:string,warmup:string,story:string,
 steps:string[],items:string[],mistake:string,exit:string,checks:GradeOneCheck[]) {
 const result=lesson(p,n,title,objective,warmup,story,steps,items,
  'Esquema del ejemplo. Conservá el entero y las unidades indicadas; los símbolos no fijan medidas en pantalla.|Example schematic. Keep the stated whole and units; symbols do not set measurements on screen.',mistake,exit,checks);
 result.scene.layout='aligned';return result;
}


