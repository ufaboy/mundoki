import assert from 'node:assert/strict';
import { SCHOOL_COURSES, getSchoolPackage } from '../content/schoolCourses';
import { getGradeById } from '../math/curriculum';
import { buildSchoolLessonUrl } from '../i18n/routes';
import { areaProduct, divisionModel, fractionModel } from '../math/schoolModels';
import { getGradeThreeHints } from '../content/grade3/hints';
import { getGradeFourHints } from '../content/grade4/hints';

export function runUpperPrimaryTests() {
 const all=SCHOOL_COURSES.flatMap(c=>c.lessons);
 assert.equal(new Set(all.map(l=>l.id)).size,all.length,'Unique lesson IDs across grades');
 const visited=new Set<string>();
 function graph(id:string,path=new Set<string>()) {
  assert(!path.has(id),`Prerequisite cycle ${id}`); if(visited.has(id))return;
  path.add(id);for(const dep of getSchoolPackage(id).prerequisites)graph(dep,path);
  path.delete(id);visited.add(id);
 }
 function localized(value:unknown) {
  if(!value||typeof value!=='object')return;
  if('es-AR' in value||'en-US' in value)for(const locale of ['es-AR','en-US']) {
   const v=(value as Record<string,unknown>)[locale];
   assert(typeof v==='string'&&v.trim().length>0&&!v.includes('|'),`Invalid translation ${locale}`);
   assert(!/[\u0400-\u04ff]/u.test(v),'Accidental Cyrillic in lesson translation');
  }
  Object.values(value).forEach(localized);
 }
 for(const course of SCHOOL_COURSES.filter(c=>c.gradeNumber>=3 && c.gradeNumber<=4)) {
  assert.equal(course.lessons.length,41);assert.equal(course.packages.length,14);
  assert.equal(getGradeById(course.gradeId).lessons.length,41);
  localized(course);
  assert.equal(Object.keys(course.assessments).length,14);
  for(const [i,pack] of course.packages.entries()) {
   graph(pack.id);
   const lessons=course.lessons.filter(l=>l.packageId===pack.id);
   assert.equal(lessons.length,i===13?2:3,pack.id);
   assert.deepEqual(lessons.map(l=>l.id),lessons.map((_,j)=>`${pack.id}-L0${j+1}`));
   const checks=course.assessments[pack.id];assert.equal(checks.length,5);
   const practice=new Set(lessons.flatMap(l=>l.checks.map(c=>c.prompt['en-US'])));
   assert.equal(new Set(checks.map(c=>c.prompt['en-US'])).size,5);
   checks.forEach(c=>assert(!practice.has(c.prompt['en-US']),`Repeated assessment ${pack.id}`));
  }
  for(const lesson of course.lessons) {
   assert.equal(lesson.steps.length,3);assert.equal(lesson.checks.length,2);
   if(course.gradeNumber===3 || course.gradeNumber===4) {
    const hints=course.gradeNumber===3?getGradeThreeHints(lesson.id):getGradeFourHints(lesson.id);
    assert.equal(hints.length,lesson.checks.length);
    localized(hints);
    hints.forEach((hint,i)=>{for(const locale of ['es-AR','en-US'] as const)assert.notEqual(hint[locale],lesson.checks[i].explanation[locale],`Hint must guide rather than repeat feedback: ${lesson.id}`);});
    if(lesson.packageId==='G03-09') {
     const rows=lesson.scene.items.map(row=>row.split(' '));
     assert.equal(rows.length,3);
     assert(rows.every(row=>row.length===rows[0].length),'Map rows must align');
    }
   }
   assert(lesson.scene.items.length>0);
   assert.equal(buildSchoolLessonUrl('es-AR',course.gradeId,lesson.id),`/es-ar/matematicas/grado/${course.gradeNumber}-grado/${lesson.id.toLowerCase()}/`);
   assert.equal(buildSchoolLessonUrl('en-US',course.gradeId,lesson.id),`/en-us/mathematics/grade/${course.gradeId}/${lesson.id.toLowerCase()}/`);
  }
  const checks=[...course.lessons.flatMap(l=>l.checks),...Object.values(course.assessments).flat()];
  assert.equal(checks.length,152);
  for(const check of checks){assert(Number.isInteger(check.answer)&&check.answer>=0&&check.answer<check.options.length);for(const locale of ['es-AR','en-US'] as const)assert.equal(new Set(check.options.map(o=>o[locale])).size,check.options.length);}
 }
 for(const d of [2,4,8])for(let n=0;n<=d;n++){const f=fractionModel(n,d);assert.equal(f.eighths/8,n/d);assert(Number.isInteger(f.eighths));}
 for(let a=10;a<=49;a++)for(let b=2;b<=29;b++){const p=areaProduct(a,b);assert.equal(p.parts.reduce((s,n)=>s+n,0),a*b);assert.equal(p.tensA+p.onesA,a);assert.equal(p.tensB+p.onesB,b);}
 for(let n=0;n<=999;n++)for(let d=2;d<=9;d++){const m=divisionModel(n,d);assert.equal(m.quotient*d+m.remainder,n);assert(m.remainder>=0&&m.remainder<d);assert.equal(m.containers,Math.ceil(n/d));}
 assert.throws(()=>fractionModel(5,4));assert.throws(()=>fractionModel(1,3));assert.throws(()=>areaProduct(NaN,3));assert.throws(()=>divisionModel(12,0));
 console.log('PASS [Grades 3–4] 82 lessons, 28 packages, 304 bilingual checks, prerequisites, routes, and model invariants');
}
