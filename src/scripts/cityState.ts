export type CityColor='terracotta'|'sage'|'blue';
export interface CityPreferences {name:string;color:CityColor}
export function cleanCityPreferences(value:unknown):CityPreferences {
 const v=(value && typeof value==='object'?value:{}) as Record<string,unknown>;
 return {name:typeof v.name==='string'?v.name.trim().slice(0,24):'',color:['terracotta','sage','blue'].includes(String(v.color))?v.color as CityColor:'terracotta'};
}
export function citySceneState(index:number,solved:number) {
 const mission=Math.max(0,Math.min(40,Number.isFinite(index)?Math.floor(index):0));
 const steps=Math.max(0,Math.min(2,Number.isFinite(solved)?Math.floor(solved):0));
 return {steps,buildings:Math.floor((mission*2+steps)*7/82),complete:mission===40&&steps===2};
}
