import assert from 'node:assert/strict';
import {RACE_MISSIONS,RACE_CHAPTERS,RACE_EFFECTS,RACE_EPILOGUE,RACE_PARTS,RACE_PART_STAGE,racePartsBefore} from '../content/grade6/racingAdventure';
import {GRADE_SIX_LESSONS,GRADE_SIX_PACKAGES} from '../content/grade6';
import {initialRaceState,answerRace,nextRace,raceStage,cleanRacePreferences} from '../scripts/raceState';
export function runRaceAdventureTests(){
 assert.deepEqual(RACE_MISSIONS.map(m=>m.id),GRADE_SIX_LESSONS.map(l=>l.id),'One mission per lesson, in course order');
 assert.deepEqual(RACE_CHAPTERS.flatMap(c=>c.packages),GRADE_SIX_PACKAGES.map(p=>p.id),'Chapters cover every package once, in order');
 assert.equal(RACE_CHAPTERS.length,8);
 assert.equal(RACE_CHAPTERS[0].scene,'garage');assert.equal(RACE_CHAPTERS.at(-1)!.scene,'final');
 const localized=(v:{'es-AR':string;'en-US':string})=>{for(const locale of ['es-AR','en-US'] as const)assert(v[locale].trim()&&!v[locale].includes('|'));};
 for(const chapter of RACE_CHAPTERS){
  localized(chapter.title);localized(chapter.opening);
  chapter.missions.forEach((m,step)=>{assert.equal(m.step,step);assert.equal(m.steps,chapter.missions.length);assert.equal(m.scene,chapter.scene);});
 }
 for(const [i,m] of RACE_MISSIONS.entries()){
  const lesson=GRADE_SIX_LESSONS[i];
  assert.equal(m.checks,lesson.checks,'Missions show the lesson checks');
  assert.equal(m.rewards.length,m.checks.length,`${m.id}: one reward per check`);
  for(const text of [m.title,m.introduction,...m.rewards.map(r=>r.text)])localized(text);
  for(const r of m.rewards)assert(r.effect in RACE_EFFECTS,`${m.id}: known effect`);
  // {name} only in story texts, never in the curriculum checks.
  for(const check of lesson.checks)for(const locale of ['es-AR','en-US'] as const)assert(!check.prompt[locale].includes('{name}')&&!check.explanation[locale].includes('{name}'));
 }
 localized(RACE_EPILOGUE);
 // Each chapter ends on its race result.
 for(const chapter of RACE_CHAPTERS)assert.equal(chapter.missions.at(-1)!.rewards.at(-1)!.effect,'points',`${chapter.id} ends with a result`);
 // Garage: every part is installed by exactly one upgrade/telemetry reward, in season order.
 const installs=RACE_MISSIONS.flatMap(m=>m.rewards.filter(r=>r.part));
 assert.deepEqual(installs.map(r=>r.part).sort(),Object.keys(RACE_PARTS).sort(),'Each part installed exactly once');
 for(const r of installs)assert(r.effect==='upgrade'||r.effect==='telemetry',`${r.part}: installed by an upgrade`);
 assert.deepEqual(racePartsBefore(0),[]);assert.equal(racePartsBefore(RACE_MISSIONS.length).length,Object.keys(RACE_PARTS).length);
 for(let i=1;i<=RACE_MISSIONS.length;i++)assert.deepEqual(racePartsBefore(i).slice(0,racePartsBefore(i-1).length),racePartsBefore(i-1),'Garage only grows');
 for(const [part,stage] of Object.entries(RACE_PART_STAGE))assert(stage>=1&&stage<=RACE_CHAPTERS.length,part);
 Object.values(RACE_PARTS).forEach(localized);
 // Duels: one per chapter, consistent with the story results.
 for(const chapter of RACE_CHAPTERS)localized(chapter.duel.text);
 assert.deepEqual(RACE_CHAPTERS.map(c=>c.duel.result),['solo','behind','ahead','ahead','ahead','ahead','tie','ahead']);
 for(const count of [1,2,3]){
  let state=initialRaceState(count);assert.equal(raceStage(state),'start');
  for(let i=0;i<count;i++){
   assert.equal(nextRace(state),state,'Cannot skip');
   assert.equal(answerRace(state,i,false),state,'Wrong answers keep the car where it is');
   assert.equal(answerRace(state,i+1,true),state,'Cannot answer future questions');
   state=answerRace(state,i,true);assert.equal(state.solved,i+1);
   assert.equal(answerRace(state,i,true),state,'No duplicate rewards');
   assert.equal(raceStage(state),i===count-1?'complete':'building');
   state=nextRace(state);
  }
  assert.equal(nextRace(state),state);
 }
 assert.throws(()=>initialRaceState(0));
 assert.deepEqual(cleanRacePreferences({name:'  Rayo  ',color:'gold',emblem:'bolt'}),{name:'Rayo',color:'gold',emblem:'bolt'});
 assert.deepEqual(cleanRacePreferences({name:42,color:'toString',emblem:'<script>'}),{name:'',color:'red',emblem:'star'});
 assert.equal(cleanRacePreferences({name:'x'.repeat(50)}).name.length,24);
 assert.deepEqual(cleanRacePreferences(null),{name:'',color:'red',emblem:'star'});
 console.log('PASS [Math Racing] 8 chapters, 39 missions, one race effect per check, 13 garage parts, chapter duels, gating, restart and team preferences');
}
