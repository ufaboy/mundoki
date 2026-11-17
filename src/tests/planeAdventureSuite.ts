import assert from 'node:assert/strict';
import {PLANE_MISSIONS,PLANE_CHAPTERS,PLANE_STORY_PIECES} from '../content/grade4/planeAdventure';
import {GRADE_FOUR_LESSONS,GRADE_FOUR_PACKAGES} from '../content/grade4';
import {initialIslandState,answerIsland,nextIsland,islandStage,cleanIslandPreferences} from '../scripts/islandState';
export function runIslandAdventureTests(){
 assert.deepEqual(PLANE_MISSIONS.map(m=>m.id),GRADE_FOUR_LESSONS.map(l=>l.id));
 assert.equal(PLANE_CHAPTERS.length,12,'Twelve story chapters');
 assert.deepEqual(PLANE_CHAPTERS.flatMap(c=>c.packages),GRADE_FOUR_PACKAGES.map(p=>p.id),'Chapters cover every package once, in order');
 assert.deepEqual(PLANE_CHAPTERS.flatMap(c=>c.missions.map(m=>m.id)),PLANE_MISSIONS.map(m=>m.id));
 for(const [i,m] of PLANE_MISSIONS.entries()){
  assert.equal(m.checks,GRADE_FOUR_LESSONS[i].checks,'Missions use the authored lesson checks');
  assert.equal(m.rewards.length,m.checks.length);
  for(const text of [m.title,m.introduction,...m.rewards])for(const locale of ['es-AR','en-US'] as const)assert(text[locale].trim()&&!text[locale].includes('|'));
  assert.equal(new Set(m.rewards.map(r=>r['es-AR'])).size,m.rewards.length,`${m.id}: each reward names its own step`);
  for(const text of [m.title,...m.checks.flatMap(c=>[c.prompt,...c.options,c.explanation])])for(const locale of ['es-AR','en-US'] as const)assert(!text[locale].includes('{name}'),`${m.id}: {name} only in introductions and rewards`);
 }
 const hangarStory=PLANE_CHAPTERS.slice(0,4).flatMap(c=>c.missions);
 assert.deepEqual(hangarStory.map(m=>m.scene.before),[0,2,4,6,8,10,12,14,16,18,20,22,24,26,28],'Each story mission adds two hangar parts');
 assert.equal(PLANE_STORY_PIECES,30);
 const iguazu=PLANE_CHAPTERS[4].missions;
 assert.deepEqual(iguazu.map(m=>m.scene.before),[0,2,4,6,8,10],'Journey parts restart in each chapter');
 const humahuaca=PLANE_CHAPTERS[5].missions;
 assert.deepEqual(humahuaca.map(m=>m.scene.before),[0,2,4],'Journey parts restart in each chapter');
 const mendoza=PLANE_CHAPTERS[6].missions;
 assert.deepEqual(mendoza.map(m=>m.scene.before),[0,2,4]);
 const glacier=PLANE_CHAPTERS[7].missions;
 assert.deepEqual(glacier.map(m=>m.scene.before),[0,2,4]);
 const ushuaia=PLANE_CHAPTERS[8].missions;
 assert.deepEqual(ushuaia.map(m=>m.scene.before),[0,2,4]);
 const valdes=PLANE_CHAPTERS[9].missions;
 assert.deepEqual(valdes.map(m=>m.scene.before),[0,2,4]);
 const poster=PLANE_CHAPTERS[10].missions;
 const festival=PLANE_CHAPTERS[11].missions;
 assert.deepEqual(festival.map(m=>m.scene.before),[0,2]);
 assert.deepEqual(poster.map(m=>m.scene.before),[0,2,4]);
 for(const count of [1,2,3,5]){
  let state=initialIslandState(count);assert.equal(islandStage(state),'start');
  for(let i=0;i<count;i++){
   assert.equal(nextIsland(state),state,'Cannot skip');
   assert.equal(answerIsland(state,i,false),state,'Wrong answers preserve scene');
   assert.equal(answerIsland(state,i+1,true),state,'Cannot answer future questions');
   state=answerIsland(state,i,true);
   assert.equal(state.solved,i+1);
   assert.equal(answerIsland(state,i,true),state,'No duplicate rewards');
   assert.equal(islandStage(state),i===count-1?'complete':'building');
   state=nextIsland(state);
  }
  assert.equal(state.solved,count);assert.equal(nextIsland(state),state);
  assert.equal(islandStage(initialIslandState(count)),'start');
 }
 assert.deepEqual(cleanIslandPreferences({name:'  Voyager  ',color:'coral'}),{name:'Voyager',color:'coral'});
 assert.equal(cleanIslandPreferences({name:'x'.repeat(50)}).name.length,24);
 assert.deepEqual(cleanIslandPreferences({name:42,color:'invalid'}),{name:'',color:'teal'});
 assert.deepEqual(cleanIslandPreferences(null),{name:'',color:'teal'});
 console.log('PASS [Plane adventure] Twelve chapters, bilingual missions, all 41 story missions with their parts, variable question counts, gating, restart and preferences');
}
