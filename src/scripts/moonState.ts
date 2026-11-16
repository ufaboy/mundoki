import {cleanIslandPreferences} from './islandState';
export {initialIslandState as initialMoonState,answerIsland as answerMoon,nextIsland as nextMoon,islandStage as moonStage} from './islandState';
export function cleanMoonPreferences(value:unknown){
 const v=value&&typeof value==='object'?value as Record<string,unknown>:{};
 return {...cleanIslandPreferences(value),emblem:v.emblem==='moon'||v.emblem==='planet'?v.emblem:'star' as const};
}
