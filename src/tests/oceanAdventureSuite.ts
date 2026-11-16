import assert from 'node:assert/strict';
import {OCEAN_MISSIONS,OCEAN_CHAPTERS} from '../content/grade6/oceanAdventure';
import {GRADE_SIX_LESSONS,GRADE_SIX_PACKAGES} from '../content/grade6';
import {initialOceanState,answerOcean,nextOcean,oceanStage,cleanOceanPreferences} from '../scripts/oceanState';
export function runOceanAdventureTests(){
 assert.deepEqual(OCEAN_MISSIONS.map(m=>m.id),GRADE_SIX_LESSONS.map(l=>l.id));
 assert.deepEqual(OCEAN_CHAPTERS.map(c=>c.id),GRADE_SIX_PACKAGES.map(p=>p.id));
 assert.deepEqual(OCEAN_CHAPTERS.flatMap(c=>c.missions.map(m=>m.id)),OCEAN_MISSIONS.map(m=>m.id));
 for(const [i,m] of OCEAN_MISSIONS.entries()){
  assert.equal(m.checks,GRADE_SIX_LESSONS[i].checks,'Preserve authored checks');
  assert.equal(m.rewards.length,m.checks.length);
  for(const text of [m.title,m.introduction,...m.rewards])for(const locale of ['es-AR','en-US'] as const)assert(text[locale].trim()&&!text[locale].includes('|'));
 }
 assert.equal(OCEAN_MISSIONS[0].scene,'archive');
 assert.equal(OCEAN_MISSIONS.at(-1)!.scene,'park');
 assert(OCEAN_MISSIONS.findIndex(m=>m.scene==='supplies')<OCEAN_MISSIONS.findIndex(m=>m.scene==='sub'));
 assert(OCEAN_MISSIONS.findIndex(m=>m.scene==='sub')<OCEAN_MISSIONS.findIndex(m=>m.scene==='robots'));
 assert.equal(cleanOceanPreferences({emblem:'anchor'}).emblem,'anchor');
 assert.equal(cleanOceanPreferences({emblem:'<script>'}).emblem,'star');
 for(const count of [1,2,3,5]){
  let state=initialOceanState(count);assert.equal(oceanStage(state),'start');
  for(let i=0;i<count;i++){
   assert.equal(nextOcean(state),state,'Cannot skip');
   assert.equal(answerOcean(state,i,false),state,'Wrong answers preserve scene');
   assert.equal(answerOcean(state,i+1,true),state,'Cannot answer future questions');
   state=answerOcean(state,i,true);
   assert.equal(state.solved,i+1);
   assert.equal(answerOcean(state,i,true),state,'No duplicate rewards');
   assert.equal(oceanStage(state),i===count-1?'complete':'building');
   state=nextOcean(state);
  }
  assert.equal(state.solved,count);assert.equal(nextOcean(state),state);
  assert.equal(oceanStage(initialOceanState(count)),'start');
 }
 assert.deepEqual(cleanOceanPreferences({name:'  Voyager  ',color:'coral'}),{name:'Voyager',color:'coral',emblem:'star'});
 assert.equal(cleanOceanPreferences({name:'x'.repeat(50)}).name.length,24);
 assert.deepEqual(cleanOceanPreferences({name:42,color:'invalid'}),{name:'',color:'teal',emblem:'star'});
 assert.deepEqual(cleanOceanPreferences(null),{name:'',color:'teal',emblem:'star'});
 console.log('PASS [Ocean adventure] Complete bilingual coverage, original checks, variable question counts, gating, restart and preferences');
}
