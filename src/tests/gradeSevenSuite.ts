import assert from 'node:assert/strict';
import { GRADE_SEVEN_LESSONS, GRADE_SEVEN_PACKAGES, GRADE_SEVEN_PROJECT } from '../content/grade7';
import { GRADE_SEVEN_ASSESSMENTS } from '../content/grade7/assessments';
import { SCHOOL_COURSES, getSchoolPackage } from '../content/schoolCourses';
import { GRADES_CATALOG, SCHOOL_BLOCKS, getGradeById } from '../math/curriculum';
import { buildSchoolLessonUrl } from '../i18n/routes';
import { stickPattern,formulaModel,angleModel,scaleModel,boxModel,frequencyModel,COIN_RECORD } from '../math/gradeSevenModels';
export function runGradeSevenTests(){
 assert.equal(GRADE_SEVEN_LESSONS.length,33);assert.equal(GRADE_SEVEN_PACKAGES.length,11);
 assert.equal(getGradeById('grade-7').lessons.length,33);
 const all=SCHOOL_COURSES.flatMap(c=>c.lessons);assert.equal(new Set(all.map(l=>l.id)).size,all.length);
 const complete=new Set<string>();
 function graph(id:string,path=new Set<string>()){assert(!path.has(id),`Cycle: ${id}`);if(complete.has(id))return;path.add(id);getSchoolPackage(id).prerequisites.forEach(dep=>graph(dep,path));path.delete(id);complete.add(id);}
 function localized(v:unknown){if(!v||typeof v!=='object')return;if('es-AR' in v||'en-US' in v)for(const locale of ['es-AR','en-US']){const s=(v as Record<string,unknown>)[locale];assert(typeof s==='string'&&s.trim()&&!s.includes('|')&&!/[\u0400-\u04ff]/u.test(s));}Object.values(v).forEach(localized);}
 localized([GRADE_SEVEN_LESSONS,GRADE_SEVEN_PACKAGES,GRADE_SEVEN_PROJECT,GRADE_SEVEN_ASSESSMENTS]);
 for(const [i,p] of GRADE_SEVEN_PACKAGES.entries()){
  graph(p.id);const lessons=GRADE_SEVEN_LESSONS.filter(l=>l.packageId===p.id);assert.equal(lessons.length,3);
  assert.deepEqual(lessons.map(l=>l.id),lessons.map((_,j)=>`${p.id}-L0${j+1}`));
  const checks=GRADE_SEVEN_ASSESSMENTS[p.id];assert.equal(checks.length,5);assert.equal(new Set(checks.map(c=>c.prompt['en-US'])).size,5);
  const prompts=new Set(lessons.flatMap(l=>l.checks.map(c=>c.prompt['en-US'])));checks.forEach(c=>assert(!prompts.has(c.prompt['en-US'])));
 }
 const checks=[...GRADE_SEVEN_LESSONS.flatMap(l=>l.checks),...Object.values(GRADE_SEVEN_ASSESSMENTS).flat()];assert.equal(checks.length,121);
 for(const c of checks){assert(Number.isInteger(c.answer)&&c.answer>=0&&c.answer<c.options.length);for(const locale of ['es-AR','en-US'] as const)assert.equal(new Set(c.options.map(o=>o[locale])).size,c.options.length);}
 for(const l of GRADE_SEVEN_LESSONS){assert.equal(l.steps.length,3);assert.equal(l.checks.length,2);assert(l.scene.items.length>0);assert.equal(buildSchoolLessonUrl('es-AR','grade-7',l.id),`/es-ar/matematicas/grado/7-grado/${l.id.toLowerCase()}/`);assert.equal(buildSchoolLessonUrl('en-US','grade-7',l.id),`/en-us/mathematics/grade/grade-7/${l.id.toLowerCase()}/`);}

 // Count the independently drawn unique segments, not just the closed formula.
 for(let n=1;n<=12;n++){const segments=new Set<string>();for(let i=0;i<n;i++){segments.add(`h${i},0`);segments.add(`h${i},1`);segments.add(`v${i}`);segments.add(`v${i+1}`);}assert.equal(stickPattern(n).sticks,segments.size);}
 for(let w=0.5;w<=10;w+=0.5)assert.equal(formulaModel(w).perimeter,w+2+w+2);
 for(let a=10;a<=170;a++){const m=angleModel(a);assert.equal(m.angle+m.adjacent,180);assert.equal(2*m.angle+2*m.adjacent,360);assert.equal(m.angle,m.opposite);}
 for(let w=1;w<=6;w++)for(let h=1;h<=6;h++)for(let k=1;k<=3;k++){const m=scaleModel(w,h,k);assert.equal(m.newPerimeter,2*(m.newWidth+m.newHeight));assert.equal(m.newArea,m.newWidth*m.newHeight);assert.equal(m.newArea/m.area,k*k);}
 for(let w=1;w<=6;w++)for(let d=1;d<=6;d++)for(let h=1;h<=6;h++){
  let cubes=0,exposed=0;for(let x=0;x<w;x++)for(let y=0;y<d;y++)for(let z=0;z<h;z++){cubes++;for(const [dx,dy,dz]of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]])if(x+dx<0||x+dx>=w||y+dy<0||y+dy>=d||z+dz<0||z+dz>=h)exposed++;}
  const m=boxModel(w,d,h);assert.equal(m.volume,cubes);assert.equal(m.surface,exposed);
 }
 assert.equal(boxModel(2,3,4).volume,boxModel(1,4,6).volume);assert.notEqual(boxModel(2,3,4).surface,boxModel(1,4,6).surface);
 for(let n=1;n<=20;n++){const m=frequencyModel(n);assert.equal(m.heads+m.tails,n);assert.equal(m.sequence.join(''),COIN_RECORD.slice(0,n).join(''));assert(Math.abs(m.percent/100*n-m.heads)<1e-10);}
 assert.equal(frequencyModel(20).heads,12);assert.equal(frequencyModel(20).percent,60);
 assert.throws(()=>stickPattern(0));assert.throws(()=>formulaModel(0));assert.throws(()=>angleModel(NaN));assert.throws(()=>scaleModel(2,3,0));assert.throws(()=>boxModel(1,1,1.5));assert.throws(()=>frequencyModel(21));
 assert.equal(getGradeById('grade-7').stage,'primary');
 const final=GRADE_SEVEN_PACKAGES.at(-1)!;assert(!final.prerequisites.includes('G07-05'));assert(!final.prerequisites.includes('G07-10'));
 console.log('PASS [Grade 7 / CABA] 33 lessons, 11 packages, 121 bilingual checks; pattern, formula, angle, scaling, solid and frequency invariants');
}
