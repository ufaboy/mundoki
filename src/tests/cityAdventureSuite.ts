import assert from 'node:assert/strict';
import {CITY_CHAPTERS,CITY_MISSIONS} from '../content/grade3/cityAdventure';
import {GRADE_THREE_LESSONS} from '../content/grade3';
import {citySceneState,cleanCityPreferences} from '../scripts/cityState';

export function runCityAdventureTests(){
 assert.equal(CITY_CHAPTERS.length,14);
 assert.deepEqual(CITY_MISSIONS.map(m=>m.id),GRADE_THREE_LESSONS.map(l=>l.id),'All 41 lessons have exactly one ordered city mission');
 assert.equal(new Set(CITY_MISSIONS.map(m=>m.scene)).size,7);
 for(const mission of CITY_MISSIONS){
  assert.equal(mission.rewards.length,2);
  for(const value of [mission.title,mission.introduction,...mission.rewards])for(const locale of ['es-AR','en-US'] as const){
   assert(value[locale].trim());assert(!value[locale].includes('|'));assert(!/[\u0400-\u04ff]/u.test(value[locale]));
  }
 }
 assert.equal(citySceneState(0,0).buildings,0);
 assert.equal(citySceneState(40,1).complete,false);
 assert.equal(citySceneState(40,2).complete,true);
 assert.equal(citySceneState(40,2).buildings,7,'All neighborhoods are visible at the opening');
 for(let i=0;i<41;i++){
  const a=citySceneState(i,0),b=citySceneState(i,1),c=citySceneState(i,2);
  assert(a.buildings<=b.buildings&&b.buildings<=c.buildings&&c.buildings<=7);
  if(i<40)assert.equal(c.buildings,citySceneState(i+1,0).buildings,'Neighborhood continues into the next scene');
 }
 assert.deepEqual(citySceneState(NaN,NaN),citySceneState(0,0));
 assert.deepEqual(cleanCityPreferences(null),{name:'',color:'terracotta'});
 assert.deepEqual(cleanCityPreferences({name:'  Sol  ',color:'blue'}),{name:'Sol',color:'blue'});
 assert.equal(cleanCityPreferences({name:'x'.repeat(200),color:'invalid'}).name.length,24);
 assert.equal(cleanCityPreferences({name:42,color:'invalid'}).color,'terracotta');
 console.log('PASS [City adventure] 41 bilingual missions, seven scenes, sequential neighborhoods, final celebration, and validated preferences');
}
