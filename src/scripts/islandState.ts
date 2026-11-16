export interface IslandState {current:number; solved:number; count:number}
export function initialIslandState(count:number):IslandState {
 if(!Number.isInteger(count)||count<1)throw new Error('An island mission needs checks');
 return {current:0,solved:0,count};
}
export function answerIsland(state:IslandState,question:number,correct:boolean):IslandState {
 if(!correct||question!==state.current||state.solved!==state.current)return state;
 return {...state,solved:state.solved+1};
}
export function nextIsland(state:IslandState):IslandState {
 return state.solved===state.current+1&&state.solved<state.count?{...state,current:state.current+1}:state;
}
export function islandStage(state:IslandState):'start'|'building'|'complete' {
 return state.solved===state.count?'complete':state.solved>0?'building':'start';
}
export function cleanIslandPreferences(value:unknown):{name:string;color:'teal'|'coral'|'gold'} {
 const v=value&&typeof value==='object'?value as Record<string,unknown>:{};
 return {name:typeof v.name==='string'?v.name.trim().slice(0,24):'',color:v.color==='coral'||v.color==='gold'?v.color:'teal'};
}
