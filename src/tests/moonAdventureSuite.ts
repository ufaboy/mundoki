import assert from 'node:assert/strict';
import {MOON_MISSIONS,MOON_CHAPTERS,MOON_EPILOGUE} from '../content/grade5/moonAdventure';
import {getGradeFiveHints} from '../content/grade5/hints';
import {GRADE_FIVE_LESSONS,GRADE_FIVE_PACKAGES} from '../content/grade5';
import {initialMoonState,answerMoon,nextMoon,moonStage,cleanMoonPreferences} from '../scripts/moonState';
export function runMoonAdventureTests(){
 assert.deepEqual(MOON_MISSIONS.map(m=>m.id),GRADE_FIVE_LESSONS.map(l=>l.id));
 // Nine story chapters (docs/grade-5-space-scenario.md); a package never spans two chapters.
 assert.deepEqual(MOON_CHAPTERS.map(c=>c.missions.length),[3,6,6,3,6,3,6,3,2]);
 for(const p of GRADE_FIVE_PACKAGES)assert.equal(new Set(MOON_CHAPTERS.filter(c=>c.missions.some(m=>m.packageId===p.id)).map(c=>c.id)).size,1,`Package ${p.id} split across chapters`);
 assert.deepEqual(MOON_CHAPTERS.flatMap(c=>c.missions.map(m=>m.id)),MOON_MISSIONS.map(m=>m.id));
 for(const [i,m] of MOON_MISSIONS.entries()){
  assert.equal(m.checks,GRADE_FIVE_LESSONS[i].checks,'Preserve authored checks');
  assert.equal(m.rewards.length,m.checks.length);
  for(const text of [m.title,m.introduction,...m.rewards])for(const locale of ['es-AR','en-US'] as const)assert(text[locale].trim()&&!text[locale].includes('|'));
  // {name} is rendered only through HeroText (introductions, rewards, epilogue).
  for(const text of [m.title,...m.checks.flatMap(c=>[c.prompt,c.explanation,...c.options]),...getGradeFiveHints(m.id)])for(const locale of ['es-AR','en-US'] as const)assert(!text[locale].includes('{name}'),`No hero name outside HeroText: ${m.id}`);
  assert.notEqual(m.rewards[0]['en-US'],m.rewards[1]['en-US'],`Each answer has its own reward: ${m.id}`);
 }
 assert.equal(MOON_MISSIONS[0].scene,'hangar');
 assert.equal(MOON_MISSIONS.at(-1)!.scene,'home');
 assert(MOON_MISSIONS.findIndex(m=>m.scene==='launch')<MOON_MISSIONS.findIndex(m=>m.scene==='landing'));
 assert(MOON_MISSIONS.findIndex(m=>m.scene==='landing')<MOON_MISSIONS.findIndex(m=>m.scene==='rover'));
 const first=(scene:string)=>MOON_MISSIONS.findIndex(m=>m.scene===scene);
 assert(first('rover')<first('cruise')&&first('cruise')<first('mars')&&first('mars')<first('phobos')&&first('phobos')<first('home'),'Earth → Moon → Mars → Phobos → Earth');
 assert(MOON_EPILOGUE['es-AR'].includes('{name}')&&MOON_EPILOGUE['en-US'].includes('{name}'));
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
