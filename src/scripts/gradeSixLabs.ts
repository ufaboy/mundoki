import { divisorModel,proportionModel,percentModel,rectangleModel,meanModel } from '../math/gradeSixModels';
function start(){document.querySelectorAll<HTMLElement>('[data-g6-lab]').forEach(root=>{
 if(root.dataset.ready)return;root.dataset.ready='true';
 const es=root.dataset.locale==='es-AR',kind=root.dataset.g6Lab;
 const inputs=Array.from(root.querySelectorAll<HTMLInputElement>('[data-value]'));
 const mode=root.querySelector<HTMLSelectElement>('[data-mode]'),xInput=root.querySelector<HTMLSelectElement>('[data-x]');
 const summary=root.querySelector<HTMLElement>('[data-g6-summary]')!,model=root.querySelector<HTMLElement>('[data-g6-model]')!;
 const fmt=(n:number)=>n.toLocaleString(es?'es-AR':'en-US',{maximumFractionDigits:2});
 function caption(s:string){const p=document.createElement('p');p.textContent=s;model.append(p);}
 function table(headers:string[],rows:(string|number)[][]){const t=document.createElement('table');t.className='g5-frequency-table';const head=document.createElement('tr');headers.forEach(label=>{const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);});t.append(head);rows.forEach(row=>{const tr=document.createElement('tr');row.forEach(value=>{const td=document.createElement('td');td.textContent=String(value);tr.append(td);});t.append(tr);});model.append(t);}
 function bars(values:number[]){const list=document.createElement('div');list.className='g6-bars';values.forEach((n,i)=>{const row=document.createElement('div');row.textContent=`${i+1}: ${fmt(n)}`;const bar=document.createElement('span');bar.className='g5-bar';bar.style.width=`${n/12*100}%`;bar.setAttribute('aria-hidden','true');row.append(bar);list.append(row);});model.append(list);}
 function svgNode(name:string,attrs:Record<string,string|number>,parent:Element){const node=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,String(v)));parent.append(node);return node;}
 function update(){model.replaceChildren();const values=inputs.map(i=>i.valueAsNumber);
  if(kind==='divisors'){
   const [a,b]=values,m=divisorModel(a,b);
   summary.textContent=`A = ${a}; B = ${b}. `+(es?`Mayor divisor común: ${m.gcd}. Menor múltiplo común positivo: ${m.lcm}.`:`Greatest common divisor: ${m.gcd}. Least positive common multiple: ${m.lcm}.`);
   table([es?'Número':'Number',es?'Divisores positivos':'Positive divisors'],[[a,m.a.join(', ')],[b,m.b.join(', ')]]);
   caption(`${a} = ${m.gcd} × ${a/m.gcd}; ${b} = ${m.gcd} × ${b/m.gcd}. ${m.lcm} = ${a} × ${m.lcm/a} = ${b} × ${m.lcm/b}.`);
  }else if(kind==='proportion'){
   const selected=mode!.value as 'direct'|'inverse'|'fixed',x=Number(xInput!.value),y=proportionModel(selected,x);
   const xs=selected==='inverse'?[1,2,3,4,6,8,12]:[0,1,2,3,4,6,8,12],ys=xs.map(n=>n===0?(selected==='fixed'?5:0):proportionModel(selected,n));
   const xLabel=selected==='inverse'?(es?'Recipientes':'Containers'):(es?'Metros':'Meters'),yLabel=selected==='inverse'?(es?'L por recipiente':'L per container'):(es?'Costo':'Cost');
   summary.textContent=`x = ${x}; y = ${y}. `+(selected==='direct'?'y/x = 3.':selected==='inverse'?'xy = 24.':es?'Ni razón ni producto constantes.':'Neither ratio nor product is constant.');
   table([xLabel,yLabel],xs.map((n,i)=>[n,ys[i]]));
   const svg=svgNode('svg',{viewBox:'0 0 370 270','aria-hidden':'true'},model);
   svgNode('path',{d:'M 45 15 V 225 H 345',fill:'none',stroke:'currentColor','stroke-width':2},svg);
   for(const n of [0,12,24,36,48]){const yy=225-n*4;svgNode('line',{x1:45,y1:yy,x2:345,y2:yy,stroke:'#94a3b8','stroke-width':0.5},svg);svgNode('text',{x:8,y:yy+4,fill:'currentColor'},svg).textContent=String(n);}
   for(const n of [0,4,8,12])svgNode('text',{x:40+n*24,y:244,fill:'currentColor'},svg).textContent=String(n);
   svgNode('text',{x:45,y:265,fill:'currentColor'},svg).textContent=`x: ${xLabel}; y: ${yLabel}`;
   if(selected!=='inverse')svgNode('line',{x1:45,y1:225-ys[0]*4,x2:333,y2:225-ys[ys.length-1]*4,stroke:'#2563eb','stroke-width':2},svg);
   xs.forEach((n,i)=>svgNode('circle',{cx:45+n*24,cy:225-ys[i]*4,r:n===x?6:4,fill:n===x?'#b45309':'#2563eb'},svg));
   caption(selected==='inverse'?(es?'Puntos de la tabla: el origen de ambos ejes es cero. No se unen los recipientes discretos como si admitieran cualquier cantidad fraccionaria.':'Table points: both axes start at zero. Discrete containers are not joined as if any fractional count were allowed.'):(es?'La cinta admite longitudes intermedias: unimos los puntos. Solo el costo sin cargo fijo pasa por el origen.':'Ribbon allows intermediate lengths: we join the points. Only cost without a fixed charge passes through the origin.'));
  }else if(kind==='percent'){
   const [total,p]=values,m=percentModel(total,p);
   summary.textContent=`${p}% ${es?'de':'of'} ${total} = ${fmt(m.part)}; ${es?'restante':'remaining'} = ${fmt(m.remaining)}. ${total} × ${p}/100 = ${fmt(m.part)}.`;
   const grid=document.createElement('div');grid.className='upper-hundred';grid.setAttribute('aria-hidden','true');for(let i=0;i<100;i++){const cell=document.createElement('span');cell.className=i<p?'is-filled':'';grid.append(cell);}model.append(grid);
   caption(es?`Cada casilla equivale a ${fmt(total/100)} de la cantidad elegida.`:`Each cell equals ${fmt(total/100)} of the chosen quantity.`);
  }else if(kind==='rectangle'){
   const [w,h]=values,m=rectangleModel(w,h);
   summary.textContent=`${w} m × ${h} m; P = ${m.perimeter} m; A = ${m.area} m². `+(es?'Plano 1:200: ':'Plan 1:200: ')+`${fmt(m.planWidthCm)} cm × ${fmt(m.planHeightCm)} cm.`;
   const svg=svgNode('svg',{viewBox:'0 0 260 270','aria-hidden':'true'},model);
   for(let row=0;row<h;row++)for(let col=0;col<w;col++)svgNode('rect',{x:10+col*19,y:10+row*19,width:19,height:19,fill:'#bfdbfe',stroke:'#334155','stroke-width':0.7},svg);
   svgNode('rect',{x:10,y:10,width:w*19,height:h*19,fill:'none',stroke:'#b45309','stroke-width':3},svg);
   svgNode('text',{x:10,y:262,fill:'currentColor'},svg).textContent=es?'Cada casilla: 1 m²':'Each cell: 1 m²';
  }else{
   const m=meanModel(values);summary.textContent=`(${values.join(' + ')}) ÷ 4 = ${fmt(m.mean)}. ${es?'Total':'Total'}: ${m.total}.`;
   caption(es?'Datos originales (escala común 0–12)':'Original data (common scale 0–12)');bars(values);
   caption(es?'Reparto uniforme del mismo total':'Uniform sharing of the same total');bars([m.mean,m.mean,m.mean,m.mean]);
  }
 }
 root.addEventListener('input',update);update();
});}
start();document.addEventListener('astro:page-load',start);
