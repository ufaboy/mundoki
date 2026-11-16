function whole(n:number,min:number,max:number){if(!Number.isInteger(n)||n<min||n>max)throw new RangeError('Invalid model value');}
export function gcd(a:number,b:number):number {while(b){[a,b]=[b,a%b];}return a;}
export function fractionPair(a:number,b:number,c:number,d:number){
 for(const denominator of [b,d])if(![2,3,4,6,8,12].includes(denominator))throw new RangeError('Unsupported denominator');
 whole(a,0,2*b);whole(c,0,2*d);
 const common=b/gcd(b,d)*d,left=a*(common/b),right=c*(common/d);
 const sum=left+right,difference=left-right,factor=gcd(sum,common);
 return {common,left,right,sum,difference,reducedNumerator:sum/factor,reducedDenominator:common/factor};
}
export function decimalPair(a:number,b:number){whole(a,0,200);whole(b,0,200);return {left:a,right:b,sum:a+b,difference:a-b};}
export function modeModel(counts:number[]){
 if(counts.length!==5)throw new RangeError('Five frequencies required');counts.forEach(n=>whole(n,0,10));
 const total=counts.reduce((a,b)=>a+b,0),max=Math.max(...counts);
 const observed=counts.map((frequency,value)=>({frequency,value})).filter(x=>x.frequency>0);
 const uniform=observed.length>1&&observed.every(x=>x.frequency===max);
 return {total,max,uniform,modes:total===0||uniform?[]:observed.filter(x=>x.frequency===max).map(x=>x.value)};
}
