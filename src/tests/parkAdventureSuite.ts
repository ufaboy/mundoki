import {PARK_MODELS} from '../content/grade7/parkModels';
import assert from 'node:assert/strict';
import {PARK_MISSIONS,PARK_CHAPTERS,nextParkMission} from '../content/grade7/parkAdventure';
import {GRADE_SEVEN_LESSONS,GRADE_SEVEN_PACKAGES} from '../content/grade7';
import {initialParkState,answerPark,nextPark,parkStage,cleanParkPreferences} from '../scripts/parkState';
export function runParkAdventureTests(){
 assert.deepEqual(PARK_MISSIONS.map(m=>m.id),GRADE_SEVEN_LESSONS.map(l=>l.id));
 assert.deepEqual(PARK_CHAPTERS.map(c=>c.id),GRADE_SEVEN_PACKAGES.map(p=>p.id));
 assert.deepEqual(PARK_CHAPTERS.flatMap(c=>c.missions.map(m=>m.id)),PARK_MISSIONS.map(m=>m.id));
 for(const [i,m] of PARK_MISSIONS.entries()){
  assert.equal(m.checks,GRADE_SEVEN_LESSONS[i].checks,'Preserve authored checks');
  assert.equal(m.rewards.length,m.checks.length);
  assert.equal(PARK_MODELS[m.id].length,m.checks.length);
  for(const row of PARK_MODELS[m.id])for(const value of row)for(const locale of ['es-AR','en-US'] as const)assert(value[locale].trim());
  for(const text of [m.title,m.introduction,...m.rewards])for(const locale of ['es-AR','en-US'] as const)assert(text[locale].trim()&&!text[locale].includes('|'));
 }
 assert.equal(PARK_MISSIONS[0].scene,'archive');
 assert.equal(PARK_MISSIONS.at(-1)!.scene,'opening');
 assert.equal(nextParkMission('G07-04-L03')?.id,'G07-06-L01');
 assert.equal(nextParkMission('G07-09-L03')?.id,'G07-11-L01');
 assert.equal(nextParkMission('G07-05-L01')?.id,'G07-05-L02');
 assert.equal(nextParkMission('G07-05-L03')?.id,'G07-06-L01');
 assert.equal(nextParkMission('G07-10-L03')?.id,'G07-11-L01');
 assert.equal(nextParkMission(PARK_MISSIONS.at(-1)!.id),undefined);
 assert.equal(nextParkMission('missing'),undefined);
 assert.equal(cleanParkPreferences({emblem:'anchor'}).emblem,'anchor');
 assert.equal(cleanParkPreferences({emblem:'<script>'}).emblem,'star');
 for(const count of [1,2,3,5]){
  let state=initialParkState(count);assert.equal(parkStage(state),'start');
  for(let i=0;i<count;i++){
   assert.equal(nextPark(state),state,'Cannot skip');
   assert.equal(answerPark(state,i,false),state,'Wrong answers preserve scene');
   assert.equal(answerPark(state,i+1,true),state,'Cannot answer future questions');
   state=answerPark(state,i,true);
   assert.equal(state.solved,i+1);
   assert.equal(answerPark(state,i,true),state,'No duplicate rewards');
   assert.equal(parkStage(state),i===count-1?'complete':'building');
   state=nextPark(state);
  }
  assert.equal(state.solved,count);assert.equal(nextPark(state),state);
  assert.equal(parkStage(initialParkState(count)),'start');
 }
 assert.deepEqual(cleanParkPreferences({name:'  Voyager  ',color:'coral'}),{name:'Voyager',color:'coral',emblem:'star'});
 assert.equal(cleanParkPreferences({name:'x'.repeat(50)}).name.length,24);
 assert.deepEqual(cleanParkPreferences({name:42,color:'invalid'}),{name:'',color:'teal',emblem:'star'});
 assert.deepEqual(cleanParkPreferences(null),{name:'',color:'teal',emblem:'star'});
 console.log('PASS [Park adventure] Complete bilingual coverage, original checks, variable question counts, gating, restart and preferences');
}
