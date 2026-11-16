function whole(value:number,min:number,max:number){if(!Number.isInteger(value)||value<min||value>max)throw new RangeError('Outside model domain');return value;}
export function stickPattern(n:number){whole(n,1,12);return {n,sticks:3*n+1,added:3*(n-1),vertical:n+1,horizontal:2*n};}
export function formulaModel(width:number){if(!Number.isFinite(width)||width<0.5||width>10||width*2%1!==0)throw new RangeError('Invalid width');return {width,height:2,perimeter:2*width+4};}
export function angleModel(angle:number){whole(angle,10,170);return {angle,adjacent:180-angle,opposite:angle};}
export function scaleModel(width:number,height:number,factor:number){whole(width,1,6);whole(height,1,6);whole(factor,1,3);return {width,height,factor,newWidth:width*factor,newHeight:height*factor,perimeter:2*(width+height),newPerimeter:2*(width+height)*factor,area:width*height,newArea:width*height*factor*factor};}
export function boxModel(width:number,depth:number,height:number){whole(width,1,6);whole(depth,1,6);whole(height,1,6);const faces=[width*depth,width*height,depth*height];return {width,depth,height,layer:width*depth,volume:width*depth*height,faces,surface:2*faces.reduce((a,b)=>a+b,0)};}
// Recorded classroom data, not a random generator or a prediction.
export const COIN_RECORD = ['H','H','T','H','T','T','H','H','T','H','H','T','H','T','H','H','T','H','T','H'] as const;
export function frequencyModel(count:number){whole(count,1,COIN_RECORD.length);const sequence=COIN_RECORD.slice(0,count),heads=sequence.filter(v=>v==='H').length;return {sequence,heads,tails:count-heads,count,percent:heads/count*100};}
