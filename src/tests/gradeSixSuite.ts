import assert from 'node:assert/strict';
import { GRADE_SIX_LESSONS, GRADE_SIX_PACKAGES, GRADE_SIX_PROJECT } from '../content/grade6';
import { GRADE_SIX_ASSESSMENTS } from '../content/grade6/assessments';
import { SCHOOL_COURSES, getSchoolPackage } from '../content/schoolCourses';
import { GRADES_CATALOG, SCHOOL_BLOCKS, getGradeById } from '../math/curriculum';
import { buildSchoolLessonUrl } from '../i18n/routes';
import { divisorModel, proportionModel, percentModel, rectangleModel, meanModel } from '../math/gradeSixModels';
export function runGradeSixTests(){
 assert.equal(GRADE_SIX_LESSONS.length,39);assert.equal(GRADE_SIX_PACKAGES.length,13);
 assert.equal(getGradeById('grade-6').lessons.length,39);
 const all=SCHOOL_COURSES.flatMap(c=>c.lessons);assert.equal(new Set(all.map(l=>l.id)).size,all.length);
 const complete=new Set<string>();
 function graph(id:string,path=new Set<string>()){assert(!path.has(id),`Cycle: ${id}`);if(complete.has(id))return;path.add(id);getSchoolPackage(id).prerequisites.forEach(dep=>graph(dep,path));path.delete(id);complete.add(id);}
 function localized(v:unknown){if(!v||typeof v!=='object')return;if('es-AR' in v||'en-US' in v)for(const locale of ['es-AR','en-US']){const s=(v as Record<string,unknown>)[locale];assert(typeof s==='string'&&s.trim()&&!s.includes('|')&&!/[\u0400-\u04ff]/u.test(s));}Object.values(v).forEach(localized);}
 localized([GRADE_SIX_LESSONS,GRADE_SIX_PACKAGES,GRADE_SIX_PROJECT,GRADE_SIX_ASSESSMENTS]);
 for(const [i,p] of GRADE_SIX_PACKAGES.entries()){
  graph(p.id);const lessons=GRADE_SIX_LESSONS.filter(l=>l.packageId===p.id);assert.equal(lessons.length,3);
  assert.deepEqual(lessons.map(l=>l.id),lessons.map((_,j)=>`${p.id}-L0${j+1}`));
  const checks=GRADE_SIX_ASSESSMENTS[p.id];assert.equal(checks.length,5);assert.equal(new Set(checks.map(c=>c.prompt['en-US'])).size,5);
  const prompts=new Set(lessons.flatMap(l=>l.checks.map(c=>c.prompt['en-US'])));checks.forEach(c=>assert(!prompts.has(c.prompt['en-US'])));
 }
 const checks=[...GRADE_SIX_LESSONS.flatMap(l=>l.checks),...Object.values(GRADE_SIX_ASSESSMENTS).flat()];assert.equal(checks.length,143);
 for(const c of checks){assert(Number.isInteger(c.answer)&&c.answer>=0&&c.answer<c.options.length);for(const locale of ['es-AR','en-US'] as const)assert.equal(new Set(c.options.map(o=>o[locale])).size,c.options.length);}
 for(const l of GRADE_SIX_LESSONS){assert.equal(l.steps.length,3);assert.equal(l.checks.length,2);assert(l.scene.items.length>0);assert.equal(buildSchoolLessonUrl('es-AR','grade-6',l.id),`/es-ar/matematicas/grado/6-grado/${l.id.toLowerCase()}/`);assert.equal(buildSchoolLessonUrl('en-US','grade-6',l.id),`/en-us/mathematics/grade/grade-6/${l.id.toLowerCase()}/`);}
 // Exact model invariants, boundary cases, and mathematically independent checks.
 for(let a=1;a<=60;a++)for(let b=1;b<=60;b++){
  const m=divisorModel(a,b);assert(m.a.every(d=>a%d===0));assert(m.b.every(d=>b%d===0));
  assert.equal(m.gcd,Math.max(...m.a.filter(d=>m.b.includes(d))));
  assert.equal(m.lcm%a,0);assert.equal(m.lcm%b,0);assert.equal(m.gcd*m.lcm,a*b);
  for(let n=Math.max(a,b);n<m.lcm;n++)assert(!(n%a===0&&n%b===0));
 }
 for(const x of [1,2,3,4,6,8,12]){assert.equal(proportionModel('direct',x)/x,3);assert.equal(proportionModel('inverse',x)*x,24);}
 assert.notEqual(proportionModel('fixed',2)/2,proportionModel('fixed',4)/4);
 for(let total=20;total<=400;total+=20)for(let p=0;p<=100;p+=5){const m=percentModel(total,p);assert.equal(m.part+m.remaining,total);assert.equal(m.part*100,total*p);}
 for(let w=1;w<=12;w++)for(let h=1;h<=12;h++){const m=rectangleModel(w,h);assert.equal(m.area,w*h);assert.equal(m.perimeter,w+w+h+h);assert.equal(m.planWidthCm*200,w*100);assert.equal(m.planHeightCm*200,h*100);}
 assert.equal(rectangleModel(6,4).perimeter,rectangleModel(8,2).perimeter);assert.notEqual(rectangleModel(6,4).area,rectangleModel(8,2).area);
 for(let a=0;a<=12;a++)for(let b=0;b<=12;b++)for(let c=0;c<=12;c++)for(let d=0;d<=12;d++){const values=[a,b,c,d],m=meanModel(values);assert.equal(m.mean*m.count,m.total);assert(m.mean>=Math.min(...values)&&m.mean<=Math.max(...values));}
 assert.equal(meanModel([0,0,0,0]).mean,0);assert.equal(meanModel([1,2,3,5]).mean,2.75);
 assert.throws(()=>divisorModel(0,12));assert.throws(()=>proportionModel('inverse',0));assert.throws(()=>percentModel(100,101));assert.throws(()=>rectangleModel(NaN,4));assert.throws(()=>meanModel([]));
 // CABA: seven primary years; secondary years 1–5 retain Grade 8–12 URLs.
 for(const grade of GRADES_CATALOG)assert.equal(grade.stage,grade.gradeNumber<=7?'primary':grade.gradeNumber<=9?'middle':'high');
 assert.deepEqual(SCHOOL_BLOCKS.flatMap(b=>[...b.gradeNumbers]),[1,2,3,4,5,6,7,8,9,10,11,12]);
 for(const block of SCHOOL_BLOCKS)assert.deepEqual(GRADES_CATALOG.filter(g=>g.stage===block.id).map(g=>g.gradeNumber),[...block.gradeNumbers]);
 console.log('PASS [Grade 6 / CABA] 39 lessons, 13 packages, 143 bilingual checks; divisor, proportion, percent, area/scale and mean model invariants');
}
