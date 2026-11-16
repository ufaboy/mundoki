import assert from 'node:assert/strict';
import { GRADE_FIVE_LESSONS, GRADE_FIVE_PACKAGES, GRADE_FIVE_PROJECT } from '../content/grade5';
import { GRADE_FIVE_ASSESSMENTS } from '../content/grade5/assessments';
import { getGradeFiveHints } from '../content/grade5/hints';
import { SCHOOL_COURSES, getSchoolPackage } from '../content/schoolCourses';
import { GRADES_CATALOG, SCHOOL_BLOCKS, getGradeById } from '../math/curriculum';
import { buildSchoolLessonUrl } from '../i18n/routes';
import { fractionPair, decimalPair, modeModel } from '../math/gradeFiveModels';
export function runGradeFiveTests(){
 assert.equal(GRADE_FIVE_LESSONS.length,38);assert.equal(GRADE_FIVE_PACKAGES.length,13);
 assert.equal(getGradeById('grade-5').lessons.length,38);
 const all=SCHOOL_COURSES.flatMap(c=>c.lessons);assert.equal(new Set(all.map(l=>l.id)).size,all.length);
 const complete=new Set<string>();
 function graph(id:string,path=new Set<string>()){assert(!path.has(id),`Cycle: ${id}`);if(complete.has(id))return;path.add(id);getSchoolPackage(id).prerequisites.forEach(dep=>graph(dep,path));path.delete(id);complete.add(id);}
 function localized(v:unknown){if(!v||typeof v!=='object')return;if('es-AR' in v||'en-US' in v)for(const locale of ['es-AR','en-US']){const s=(v as Record<string,unknown>)[locale];assert(typeof s==='string'&&s.trim()&&!s.includes('|')&&!/[\u0400-\u04ff]/u.test(s));}Object.values(v).forEach(localized);}
 localized([GRADE_FIVE_LESSONS,GRADE_FIVE_PACKAGES,GRADE_FIVE_PROJECT,GRADE_FIVE_ASSESSMENTS]);
 for(const lesson of GRADE_FIVE_LESSONS){
  const hints=getGradeFiveHints(lesson.id);localized(hints);
  assert.equal(hints.length,lesson.checks.length);
  hints.forEach((hint,i)=>{for(const locale of ['es-AR','en-US'] as const)assert.notEqual(hint[locale],lesson.checks[i].explanation[locale],`Separate hint and feedback: ${lesson.id}`);});
 }
 for(const [i,p] of GRADE_FIVE_PACKAGES.entries()){
  graph(p.id);const lessons=GRADE_FIVE_LESSONS.filter(l=>l.packageId===p.id);assert.equal(lessons.length,i===12?2:3);
  assert.deepEqual(lessons.map(l=>l.id),lessons.map((_,j)=>`${p.id}-L0${j+1}`));
  const checks=GRADE_FIVE_ASSESSMENTS[p.id];assert.equal(checks.length,5);assert.equal(new Set(checks.map(c=>c.prompt['en-US'])).size,5);
  const prompts=new Set(lessons.flatMap(l=>l.checks.map(c=>c.prompt['en-US'])));checks.forEach(c=>assert(!prompts.has(c.prompt['en-US'])));
 }
 const checks=[...GRADE_FIVE_LESSONS.flatMap(l=>l.checks),...Object.values(GRADE_FIVE_ASSESSMENTS).flat()];assert.equal(checks.length,141);
 for(const c of checks){assert(Number.isInteger(c.answer)&&c.answer>=0&&c.answer<c.options.length);for(const locale of ['es-AR','en-US'] as const)assert.equal(new Set(c.options.map(o=>o[locale])).size,c.options.length);}
 for(const l of GRADE_FIVE_LESSONS){assert.equal(l.steps.length,3);assert.equal(l.checks.length,2);assert(l.scene.items.length>0);assert.equal(buildSchoolLessonUrl('es-AR','grade-5',l.id),`/es-ar/matematicas/grado/5-grado/${l.id.toLowerCase()}/`);assert.equal(buildSchoolLessonUrl('en-US','grade-5',l.id),`/en-us/mathematics/grade/grade-5/${l.id.toLowerCase()}/`);}
 // Cross-multiplication checks equality without floating-point comparisons.
 for(const b of [2,3,4,6,8,12])for(const d of [2,3,4,6,8,12])for(let a=0;a<=2*b;a++)for(let c=0;c<=2*d;c++){
  const p=fractionPair(a,b,c,d);assert.equal(p.left*b,a*p.common);assert.equal(p.right*d,c*p.common);
  assert.equal(p.sum*b*d,(a*d+c*b)*p.common);assert.equal(p.difference*b*d,(a*d-c*b)*p.common);
  assert.equal(p.reducedNumerator*p.common,p.sum*p.reducedDenominator);
 }
 assert.equal(decimalPair(10,20).sum,30);assert.equal(decimalPair(200,65).difference,135);
 for(let a=0;a<=200;a++)for(let b=0;b<=200;b++){const p=decimalPair(a,b);assert.equal(p.sum-p.right,p.left);assert.equal(p.difference+p.right,p.left);}
 assert.deepEqual(modeModel([0,0,0,0,0]),{total:0,max:0,uniform:false,modes:[]});
 assert.deepEqual(modeModel([1,3,3,0,2]).modes,[1,2]);assert.deepEqual(modeModel([1,1,1,1,1]).modes,[]);
 assert.deepEqual(modeModel([0,0,4,0,0]).modes,[2]);
 assert.throws(()=>fractionPair(1,0,1,2));assert.throws(()=>fractionPair(7,3,1,2));assert.throws(()=>decimalPair(NaN,1));assert.throws(()=>modeModel([1,2]));
 // CABA: seven primary years; secondary years 1–5 retain Grade 8–12 URLs.
 for(const grade of GRADES_CATALOG)assert.equal(grade.stage,grade.gradeNumber<=7?'primary':grade.gradeNumber<=9?'middle':'high');
 assert.deepEqual(SCHOOL_BLOCKS.flatMap(b=>[...b.gradeNumbers]),[1,2,3,4,5,6,7,8,9,10,11,12]);
 for(const block of SCHOOL_BLOCKS)assert.deepEqual(GRADES_CATALOG.filter(g=>g.stage===block.id).map(g=>g.gradeNumber),[...block.gradeNumbers]);
 console.log('PASS [Grade 5 / CABA] 38 lessons, 13 packages, 141 bilingual checks; exact rational/decimal models, modes, prerequisites, routes, seven primary years');
}
