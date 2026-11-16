import {cleanIslandPreferences} from './islandState';
export {initialIslandState as initialParkState,answerIsland as answerPark,nextIsland as nextPark,islandStage as parkStage} from './islandState';
export function cleanParkPreferences(value:unknown){
 const v=value&&typeof value==='object'?value as Record<string,unknown>:{};
 return {...cleanIslandPreferences(value),emblem:v.emblem==='wave'||v.emblem==='anchor'?v.emblem:'star' as const};
}
