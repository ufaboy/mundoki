import { areaProduct, divisionModel, fractionModel } from '../math/schoolModels';
const ns = 'http://www.w3.org/2000/svg';
function svgElement(name: string, attributes: Record<string,string|number>, parent: Element) {
 const node = document.createElementNS(ns,name);
 for (const [key,value] of Object.entries(attributes)) node.setAttribute(key,String(value));
 parent.append(node); return node;
}
function startLabs() {
 document.querySelectorAll<HTMLElement>('[data-upper-lab]').forEach(root => {
  if (root.dataset.ready) return;
  root.dataset.ready = 'true';
  const es = root.dataset.locale === 'es-AR';
  const first = root.querySelector<HTMLInputElement>('[data-first]')!;
  const second = root.querySelector<HTMLInputElement>('[data-second]');
  const denominator = root.querySelector<HTMLSelectElement>('[data-denominator]');
  const summary = root.querySelector<HTMLElement>('[data-upper-summary]')!;
  const model = root.querySelector<HTMLElement>('[data-upper-model]')!;
  const strip = (count:number,filled:number) => {
   const row = document.createElement('div'); row.className='upper-strip';
   row.style.gridTemplateColumns=`repeat(${count},1fr)`;
   for(let i=0;i<count;i++) { const cell=document.createElement('span'); cell.className=i<filled?'is-filled':''; row.append(cell); }
   model.append(row);
  };
  const update = () => {
   const a=first.valueAsNumber, b=second?.valueAsNumber ?? 0;
   model.replaceChildren();
   if(root.dataset.upperLab==='fraction') {
    const d=Number(denominator!.value); first.max=String(d); const n=Math.min(a,d); first.value=String(n);
    const f=fractionModel(n,d); strip(d,n); strip(8,f.eighths);
    const relation=f.value===0.5?'=':f.value<0.5?'<':'>';
    summary.textContent=`${n}/${d} = ${f.eighths}/8; ${n}/${d} ${relation} 1/2. `+(es?'El entero conserva su tamaño.':'The whole keeps its size.');
   } else if(root.dataset.upperLab==='decimal') {
    const grid=document.createElement('div');grid.className='upper-hundred';model.append(grid);
    for(let i=0;i<100;i++){const cell=document.createElement('span');cell.className=i<a?'is-filled':'';grid.append(cell);}
    const decimal=(a/100).toLocaleString(es?'es-AR':'en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    summary.textContent=`${a}/100 = ${decimal}. `+(es?`${Math.floor(a/10)} décimos y ${a%10} centésimos.`:`${Math.floor(a/10)} tenths and ${a%10} hundredths.`);
   } else if(root.dataset.upperLab==='angle') {
    const svg=svgElement('svg',{viewBox:'0 0 340 210'},model); const rad=a*Math.PI/180;
    svgElement('line',{x1:170,y1:170,x2:310,y2:170,stroke:'currentColor','stroke-width':3},svg);
    svgElement('line',{x1:170,y1:170,x2:170+b*Math.cos(rad),y2:170-b*Math.sin(rad),stroke:'#2563eb','stroke-width':4},svg);
    if(a>0)svgElement('path',{d:`M 205 170 A 35 35 0 0 0 ${170+35*Math.cos(rad)} ${170-35*Math.sin(rad)}`,fill:'none',stroke:'#b45309','stroke-width':3},svg);
    svgElement('circle',{cx:170,cy:170,r:4,fill:'currentColor'},svg);
    const name=a===0?(es?'nulo':'zero'):a<90?(es?'agudo':'acute'):a===90?(es?'recto':'right'):a<180?(es?'obtuso':'obtuse'):(es?'llano':'straight');
    summary.textContent=`${a}°: ${name}. `+(es?'Cambiar el largo del rayo no cambia el giro.':'Changing ray length does not change the turn.');
   } else if(root.dataset.upperLab==='product') {
    const p=areaProduct(a,b), svg=svgElement('svg',{viewBox:'0 0 350 245'},model);
    const scale=Math.min(300/a,195/b), x=25,y=25;
    const parts=[[x,y,p.tensA,p.tensB],[x+p.tensA*scale,y,p.onesA,p.tensB],[x,y+p.tensB*scale,p.tensA,p.onesB],[x+p.tensA*scale,y+p.tensB*scale,p.onesA,p.onesB]];
    parts.forEach(([left,top,width,height],i)=>{if(width&&height)svgElement('rect',{x:left,y:top,width:width*scale,height:height*scale,fill:['#93c5fd','#fde68a','#a7f3d0','#fbcfe8'][i],stroke:'#334155','stroke-width':1},svg);});
    svgElement('text',{x:25,y:16,fill:'currentColor'},svg).textContent=`${a} = ${p.tensA} + ${p.onesA}`;
    svgElement('text',{x:25,y:238,fill:'currentColor'},svg).textContent=`${b} = ${p.tensB} + ${p.onesB}`;
    summary.textContent=`${a} × ${b} = ${p.parts.join(' + ')} = ${p.total}.`;
   } else {
    const d=divisionModel(a,b);
    summary.textContent=`${a} = ${b} × ${d.quotient} + ${d.remainder}. `+(es?`${d.quotient} recipientes completos, ${d.remainder} objetos restantes; ${d.containers} recipientes para guardar todo.`:`${d.quotient} full containers, ${d.remainder} objects remaining; ${d.containers} containers to store everything.`);
    const row=document.createElement('div');row.className='upper-division';
    for(const label of [`${d.quotient} × ${b} = ${d.quotient*b}`,`+ ${d.remainder}`,`= ${a}`]){const card=document.createElement('span');card.textContent=label;row.append(card);} model.append(row);
    strip(b,d.remainder);
   }
  };
  root.addEventListener('input',update);update();
 });
}
startLabs();
document.addEventListener('astro:page-load',startLabs);
