import {cleanIslandPreferences} from './islandState';
export {initialIslandState as initialOceanState,answerIsland as answerOcean,nextIsland as nextOcean,islandStage as oceanStage} from './islandState';
export function cleanOceanPreferences(value:unknown){
 const v=value&&typeof value==='object'?value as Record<string,unknown>:{};
 return {...cleanIslandPreferences(value),emblem:v.emblem==='wave'||v.emblem==='anchor'?v.emblem:'star' as const};
}
