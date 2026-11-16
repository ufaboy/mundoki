import assert from 'node:assert/strict';
import {MOON_MISSIONS,MOON_CHAPTERS} from '../content/grade5/moonAdventure';
import {GRADE_FIVE_LESSONS,GRADE_FIVE_PACKAGES} from '../content/grade5';
import {initialMoonState,answerMoon,nextMoon,moonStage,cleanMoonPreferences} from '../scripts/moonState';
export function runMoonAdventureTests(){
 assert.deepEqual(MOON_MISSIONS.map(m=>m.id),GRADE_FIVE_LESSONS.map(l=>l.id));
 assert.deepEqual(MOON_CHAPTERS.map(c=>c.id),GRADE_FIVE_PACKAGES.map(p=>p.id));
 assert.deepEqual(MOON_CHAPTERS.flatMap(c=>c.missions.map(m=>m.id)),MOON_MISSIONS.map(m=>m.id));
 for(const [i,m] of MOON_MISSIONS.entries()){
  assert.equal(m.checks,GRADE_FIVE_LESSONS[i].checks,'Preserve authored checks');
  assert.equal(m.rewards.length,m.checks.length);
  for(const text of [m.title,m.introduction,...m.rewards])for(const locale of ['es-AR','en-US'] as const)assert(text[locale].trim()&&!text[locale].includes('|'));
 }
 assert.equal(MOON_MISSIONS[0].scene,'hangar');
 assert.equal(MOON_MISSIONS.at(-1)!.scene,'home');
 assert(MOON_MISSIONS.findIndex(m=>m.scene==='launch')<MOON_MISSIONS.findIndex(m=>m.scene==='landing'));
 assert(MOON_MISSIONS.findIndex(m=>m.scene==='landing')<MOON_MISSIONS.findIndex(m=>m.scene==='rover'));
 assert.equal(cleanMoonPreferences({emblem:'planet'}).emblem,'planet');
 assert.equal(cleanMoonPreferences({emblem:'<script>'}).emblem,'star');
 for(const count of [1,2,3,5]){
  let state=initialMoonState(count);assert.equal(moonStage(state),'start');
  for(let i=0;i<count;i++){
   assert.equal(nextMoon(state),state,'Cannot skip');
   assert.equal(answerMoon(state,i,false),state,'Wrong answers preserve scene');
   assert.equal(answerMoon(state,i+1,true),state,'Cannot answer future questions');
   state=answerMoon(state,i,true);
   assert.equal(state.solved,i+1);
   assert.equal(answerMoon(state,i,true),state,'No duplicate rewards');
   assert.equal(moonStage(state),i===count-1?'complete':'building');
   state=nextMoon(state);
  }
  assert.equal(state.solved,count);assert.equal(nextMoon(state),state);
  assert.equal(moonStage(initialMoonState(count)),'start');
 }
 assert.deepEqual(cleanMoonPreferences({name:'  Voyager  ',color:'coral'}),{name:'Voyager',color:'coral',emblem:'star'});
 assert.equal(cleanMoonPreferences({name:'x'.repeat(50)}).name.length,24);
 assert.deepEqual(cleanMoonPreferences({name:42,color:'invalid'}),{name:'',color:'teal',emblem:'star'});
 assert.deepEqual(cleanMoonPreferences(null),{name:'',color:'teal',emblem:'star'});
 console.log('PASS [Moon adventure] Complete bilingual coverage, original checks, variable question counts, gating, restart and preferences');
}
