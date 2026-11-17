import { fractionPair,decimalPair,modeModel,gcd } from '../math/gradeFiveModels';
function start(){document.querySelectorAll<HTMLElement>('[data-g5-lab]').forEach(root=>{
 if(root.dataset.ready)return;root.dataset.ready='true';
 const es=root.dataset.locale==='es-AR',kind=root.dataset.g5Lab;
 const nums=Array.from(root.querySelectorAll<HTMLInputElement>('[data-num]'));
 const dens=Array.from(root.querySelectorAll<HTMLSelectElement>('[data-den]'));
 const frequencies=Array.from(root.querySelectorAll<HTMLInputElement>('[data-frequency]'));
 const operation=root.querySelector<HTMLSelectElement>('[data-operation]');
 const summary=root.querySelector<HTMLElement>('[data-g5-summary]')!,model=root.querySelector<HTMLElement>('[data-g5-model]')!;
 const decimal=(n:number)=>(n/100).toLocaleString(es?'es-AR':'en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 function caption(value:string){const p=document.createElement('p');p.textContent=value;model.append(p);}
 function strip(n:number,d:number){
  for(let unit=0;unit<Math.max(1,Math.ceil(n/d));unit++){
   const row=document.createElement('div');row.className='upper-strip';row.style.gridTemplateColumns=`repeat(${d},1fr)`;row.setAttribute('aria-hidden','true');
   for(let j=0;j<d;j++){const cell=document.createElement('span');cell.className=unit*d+j<n?'is-filled':'';row.append(cell);}model.append(row);
  }
 }
 function grid(n:number){
  const group=document.createElement('div');group.className='g5-grids';group.setAttribute('aria-hidden','true');
  for(let unit=0;unit<Math.max(1,Math.ceil(n/100));unit++){const row=document.createElement('div');row.className='upper-hundred';
   for(let j=0;j<100;j++){const cell=document.createElement('span');cell.className=unit*100+j<n?'is-filled':'';row.append(cell);}group.append(row);
  }model.append(group);
 }
 function update(){model.replaceChildren();
  if(kind==='fractions'){
   const [b,d]=dens.map(x=>Number(x.value));
   nums.forEach((input,i)=>{const max=2*(i===0?b:d);const n=Math.min(input.valueAsNumber,max);input.max=String(max);input.value=String(n);});
   const [a,c]=nums.map(x=>x.valueAsNumber),p=fractionPair(a,b,c,d);
   caption(`A: ${a}/${b} = ${p.left}/${p.common}`);strip(p.left,p.common);
   caption(`B: ${c}/${d} = ${p.right}/${p.common}`);strip(p.right,p.common);
   const prefix=`${a}/${b} = ${p.left}/${p.common}; ${c}/${d} = ${p.right}/${p.common}. `;
   if(operation!.value==='compare')summary.textContent=prefix+`A ${p.left<p.right?'<':p.left>p.right?'>':'='} B.`;
   else if(operation!.value==='add'){
    summary.textContent=prefix+`A + B = ${p.sum}/${p.common} = ${p.reducedNumerator}/${p.reducedDenominator}.`;
    caption(es?'Suma':'Sum');strip(p.sum,p.common);
   }else if(p.difference<0)summary.textContent=es?'Para explorar una resta no negativa, aumentá A o disminuí B.':'To explore a nonnegative subtraction, increase A or decrease B.';
   else{const g=gcd(p.difference,p.common);summary.textContent=prefix+`A − B = ${p.difference}/${p.common} = ${p.difference/g}/${p.common/g}.`;caption(es?'Diferencia':'Difference');strip(p.difference,p.common);}
  }else if(kind==='decimals'){
   const [a,b]=nums.map(x=>x.valueAsNumber),p=decimalPair(a,b);
   for(const [i,n] of [a,b].entries()){caption(`${i===0?'A':'B'}: ${decimal(n)} = ${n}/100`);grid(n);}
   if(operation!.value==='compare')summary.textContent=`${decimal(a)} ${a<b?'<':a>b?'>':'='} ${decimal(b)}. ${a}/100 ${a<b?'<':a>b?'>':'='} ${b}/100.`;
   else if(operation!.value==='add')summary.textContent=`${decimal(a)} + ${decimal(b)} = ${decimal(p.sum)}; ${a} + ${b} = ${p.sum}`+(es?' centésimos.':' hundredths.');
   else summary.textContent=p.difference<0?(es?'Para esta resta, elegí A mayor o igual que B.':'For this subtraction, choose A greater than or equal to B.'):`${decimal(a)} − ${decimal(b)} = ${decimal(p.difference)}; ${a} − ${b} = ${p.difference}`+(es?' centésimos.':' hundredths.');
  }else{
   const counts=frequencies.map(x=>x.valueAsNumber),m=modeModel(counts);
   summary.textContent=(es?`Total: ${m.total} cuadrados. `:`Total: ${m.total} squares. `)+(m.total===0?(es?'Sin datos.':'No data.'):m.uniform?(es?'Todos los valores observados empatan: no hay moda destacada.':'All observed values tie: no distinguished mode.'):(es?`Moda(s): ${m.modes.join(', ')} cráteres; frecuencia ${m.max}.`:`Mode(s): ${m.modes.join(', ')} craters; frequency ${m.max}.`));
   const table=document.createElement('table');table.className='g5-frequency-table';
   const head=document.createElement('tr');for(const label of es?['Cráteres','Cuadrados (frecuencia)']:['Craters','Squares (frequency)']){const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);}table.append(head);
   counts.forEach((count,value)=>{const tr=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');th.scope='row';th.textContent=String(value);td.textContent=String(count);const bar=document.createElement('span');bar.className='g5-bar';bar.style.width=`${count*8}%`;bar.setAttribute('aria-hidden','true');td.append(bar);tr.append(th,td);table.append(tr);});model.append(table);
   caption(es?'Escala: cada cuadrado más añade el mismo largo a la barra; cero no tiene barra.':'Scale: each extra square adds the same bar length; zero has no bar.');
  }
 }
 root.addEventListener('input',update);update();
});}
start();document.addEventListener('astro:page-load',start);
