function integer(n:number,min:number,max:number){if(!Number.isInteger(n)||n<min||n>max)throw new RangeError('Invalid model input');}
function gcd(a:number,b:number):number{while(b)[a,b]=[b,a%b];return a;}
export function divisorModel(a:number,b:number){
 integer(a,1,60);integer(b,1,60);
 const divisors=(n:number)=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
 const common=gcd(a,b);
 return {a:divisors(a),b:divisors(b),gcd:common,lcm:a/common*b};
}
export function proportionModel(mode:'direct'|'inverse'|'fixed',x:number){
 if(!['direct','inverse','fixed'].includes(mode)||![1,2,3,4,6,8,12].includes(x))throw new RangeError('Invalid proportion model');
 return mode==='direct'?3*x:mode==='inverse'?24/x:3*x+5;
}
export function percentModel(total:number,percent:number){
 integer(total,20,400);integer(percent,0,100);
 return {numerator:total*percent,denominator:100,part:total*percent/100,remaining:total*(100-percent)/100};
}
export function rectangleModel(width:number,height:number){
 integer(width,1,12);integer(height,1,12);
 return {perimeter:2*(width+height),area:width*height,planWidthCm:width/2,planHeightCm:height/2};
}
export function meanModel(values:number[]){
 if(values.length!==4)throw new RangeError('Four values required');values.forEach(v=>integer(v,0,12));
 const total=values.reduce((s,v)=>s+v,0);
 return {total,count:4,mean:total/4};
}
