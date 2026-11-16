import assert from 'node:assert/strict';
import {ISLAND_MISSIONS,ISLAND_CHAPTERS} from '../content/grade4/islandAdventure';
import {GRADE_FOUR_LESSONS,GRADE_FOUR_PACKAGES} from '../content/grade4';
import {initialIslandState,answerIsland,nextIsland,islandStage,cleanIslandPreferences} from '../scripts/islandState';
export function runIslandAdventureTests(){
 assert.deepEqual(ISLAND_MISSIONS.map(m=>m.id),GRADE_FOUR_LESSONS.map(l=>l.id));
 assert.deepEqual(ISLAND_CHAPTERS.map(c=>c.id),GRADE_FOUR_PACKAGES.map(p=>p.id));
 assert.deepEqual(ISLAND_CHAPTERS.flatMap(c=>c.missions.map(m=>m.id)),ISLAND_MISSIONS.map(m=>m.id));
 for(const [i,m] of ISLAND_MISSIONS.entries()){
  assert.equal(m.checks,GRADE_FOUR_LESSONS[i].checks,'Preserve authored checks');
  assert.equal(m.rewards.length,m.checks.length);
  for(const text of [m.title,m.introduction,...m.rewards])for(const locale of ['es-AR','en-US'] as const)assert(text[locale].trim()&&!text[locale].includes('|'));
 }
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
 console.log('PASS [Island adventure] Complete bilingual coverage, original checks, variable question counts, gating, restart and preferences');
}
