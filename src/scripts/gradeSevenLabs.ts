import { stickPattern,formulaModel,angleModel,scaleModel,boxModel,frequencyModel } from '../math/gradeSevenModels';
function init(){document.querySelectorAll<HTMLElement>('[data-g7-lab]').forEach(root=>{
 if(root.dataset.ready)return;root.dataset.ready='true';
 const es=root.dataset.locale==='es-AR',kind=root.dataset.g7Lab;
 const tr=(a:string,b:string)=>es?a:b;
 const fmt=(n:number)=>n.toLocaleString(es?'es-AR':'en-US',{maximumFractionDigits:2});
 const value=(name:string)=>Number(root.querySelector<HTMLInputElement>(`[name="${name}"]`)!.value);
 const result=root.querySelector<HTMLElement>('[data-result]')!,picture=root.querySelector<HTMLElement>('[data-picture]')!,tableHost=root.querySelector<HTMLElement>('[data-table]')!;
 const svgNS='http://www.w3.org/2000/svg';
 function node(tag:string,attrs:Record<string,string|number>,text?:string){const el=document.createElementNS(svgNS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=text;return el;}
 function svg(w:number,h:number,label:string){const el=node('svg',{viewBox:`0 0 ${w} ${h}`,role:'img','aria-label':label});picture.append(el);return el;}
 function line(s:Element,x1:number,y1:number,x2:number,y2:number,color='#007dab',width=3){s.append(node('line',{x1,y1,x2,y2,stroke:color,'stroke-width':width}));}
 function grid(s:Element,x:number,y:number,w:number,h:number,size:number,groupW=w,groupH=h){for(let row=0;row<h;row++)for(let col=0;col<w;col++)s.append(node('rect',{x:x+col*size,y:y+row*size,width:size,height:size,fill:(Math.floor(col/groupW)+Math.floor(row/groupH))%2?'#c4b5fd':'#bae6fd',stroke:'#64748b','stroke-width':0.6}));}
 function table(headers:string[],rows:(string|number)[][]){const t=document.createElement('table');const head=document.createElement('thead'),body=document.createElement('tbody'),hr=document.createElement('tr');headers.forEach(v=>{const th=document.createElement('th');th.scope='col';th.textContent=v;hr.append(th);});head.append(hr);rows.forEach(row=>{const r=document.createElement('tr');row.forEach(v=>{const d=document.createElement('td');d.textContent=typeof v==='number'?fmt(v):v;r.append(d);});body.append(r);});t.append(head,body);tableHost.append(t);}
 function render(){picture.replaceChildren();tableHost.replaceChildren();
  if(kind==='pattern'){
   const m=stickPattern(value('n'));result.textContent=`n = ${m.n}; 4 + 3 × ${m.n-1} = 3 × ${m.n} + 1 = ${m.sticks} ${tr('palitos','sticks')}.`;
   const s=svg(620,100,tr('Cuadrados contiguos con lados compartidos','Adjacent squares with shared sides')),step=48;
   for(let i=0;i<m.n;i++){line(s,20+i*step,20,20+(i+1)*step,20);line(s,20+i*step,68,20+(i+1)*step,68);}
   for(let i=0;i<=m.n;i++)line(s,20+i*step,20,20+i*step,68,'#7c3aed');
   table([tr('Cuadrados','Squares'),tr('Palitos','Sticks')],[1,2,3,m.n].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b).map(n=>[n,stickPattern(n).sticks]));
  }else if(kind==='formula'){
   const m=formulaModel(value('w'));result.textContent=`w = ${fmt(m.width)} cm; P = 2 × ${fmt(m.width)} + 4 = ${fmt(m.perimeter)} cm.`;
   const s=svg(600,280,tr('Gráfico: ancho horizontal en cm, perímetro vertical en cm','Graph: horizontal width in cm, vertical perimeter in cm'));
   const x=(v:number)=>45+v*48,y=(v:number)=>240-v*8;
   line(s,45,20,45,240,'#334155',1);line(s,45,240,550,240,'#334155',1);
   for(const v of [0,2,4,6,8,10])s.append(node('text',{x:x(v),y:260,'text-anchor':'middle','font-size':12},String(v)));
   for(const v of [0,4,8,12,16,20,24])s.append(node('text',{x:30,y:y(v)+4,'text-anchor':'end','font-size':12},String(v)));
   line(s,x(0),y(4),x(10),y(24));s.append(node('circle',{cx:x(0),cy:y(4),r:5,fill:'white',stroke:'#007dab','stroke-width':2}));
   s.append(node('circle',{cx:x(m.width),cy:y(m.perimeter),r:6,fill:'#7c3aed'}));
   s.append(node('text',{x:555,y:260,'font-size':12},'w (cm)'));s.append(node('text',{x:8,y:14,'font-size':12},'P (cm)'));
   table(['w (cm)','P (cm)'],[1,2,3,m.width].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b).map(w=>[w,formulaModel(w).perimeter]));
   const note=document.createElement('p');note.textContent=tr('El círculo vacío en w = 0 marca un valor excluido: no hay rectángulo de ancho cero.','The open circle at w = 0 marks an excluded value: there is no zero-width rectangle.');tableHost.append(note);
  }else if(kind==='angle'){
   const m=angleModel(value('a'));result.textContent=`${m.angle}° + ${m.adjacent}° = 180°; ${tr('opuesto','opposite')} = ${m.opposite}°.`;
   const s=svg(400,260,tr('Dos rectas secantes y el ángulo elegido','Two intersecting lines and the selected angle')),r=m.angle*Math.PI/180;
   line(s,40,130,360,130);line(s,200-110*Math.cos(r),130+110*Math.sin(r),200+110*Math.cos(r),130-110*Math.sin(r),'#7c3aed');
   s.append(node('path',{d:`M 240 130 A 40 40 0 0 0 ${200+40*Math.cos(r)} ${130-40*Math.sin(r)}`,fill:'none',stroke:'#d97706','stroke-width':3}));
   s.append(node('text',{x:200+60*Math.cos(r/2),y:130-60*Math.sin(r/2),'text-anchor':'middle','font-size':16},`${m.angle}°`));
   table([tr('Relación','Relationship'),tr('Grados','Degrees')],[[tr('Elegido','Selected'),m.angle],[tr('Adyacente en la recta','Adjacent on the line'),m.adjacent],[tr('Opuesto por el vértice','Vertically opposite'),m.opposite]]);
  }else if(kind==='scale'){
   const m=scaleModel(value('w'),value('h'),value('k'));result.textContent=`k = ${m.factor}; P: ${m.perimeter} → ${m.newPerimeter} cm; A: ${m.area} → ${m.newArea} cm².`;
   const s=svg(620,410,tr('Rectángulo original y ampliado en cuadrículas de la misma unidad','Original and enlarged rectangles on grids with the same unit'));
   s.append(node('text',{x:15,y:20,'font-size':14},tr('Original','Original')));s.append(node('text',{x:220,y:20,'font-size':14},tr('Ampliado','Enlarged')));
   grid(s,15,35,m.width,m.height,20);grid(s,220,35,m.newWidth,m.newHeight,20,m.width,m.height);
   table([tr('Magnitud','Quantity'),tr('Original','Original'),tr('Nuevo','New')],[[tr('Ancho (cm)','Width (cm)'),m.width,m.newWidth],[tr('Altura (cm)','Height (cm)'),m.height,m.newHeight],['P (cm)',m.perimeter,m.newPerimeter],['A (cm²)',m.area,m.newArea]]);
  }else if(kind==='box'){
   const m=boxModel(value('w'),value('d'),value('h'));result.textContent=`${m.layer} × ${m.height} = ${m.volume} cm³; S = 2 × (${m.faces.join(' + ')}) = ${m.surface} cm².`;
   const s=svg(620,210,tr('Una capa de cubitos y una cara de cada par','One cube layer and one face of each pair'));
   s.append(node('text',{x:10,y:18,'font-size':13},tr('Una capa','One layer')));grid(s,10,30,m.width,m.depth,20);
   [[m.width,m.depth],[m.width,m.height],[m.depth,m.height]].forEach(([w,h],i)=>{const x=180+i*145;s.append(node('text',{x,y:18,'font-size':12},`${w} × ${h} cm`));grid(s,x,30,w,h,18);});
   table([tr('Medida','Measurement'),tr('Valor','Value')],[[tr('Capas','Layers'),m.height],[tr('Cubitos por capa','Cubes per layer'),m.layer],[tr('Volumen (cm³)','Volume (cm³)'),m.volume],[tr('Superficie (cm²)','Surface area (cm²)'),m.surface]]);
  }else if(kind==='chance'){
   const m=frequencyModel(value('n'));result.textContent=`${tr('Cara','Heads')}: ${m.heads}/${m.count} = ${fmt(m.percent)}%; ${tr('frecuencia observada','observed frequency')}.`;
   const p=document.createElement('p');p.className='g7-record';p.textContent=m.sequence.map(v=>es?(v==='H'?'C':'X'):v).join(' · ');picture.append(p);
   table([tr('Resultado','Outcome'),tr('Frecuencia absoluta','Count')],[[tr('Cara','Heads'),m.heads],[tr('Cruz','Tails'),m.tails],[tr('Total','Total'),m.count]]);
  }
 }
 root.addEventListener('input',render);render();
});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
document.addEventListener('astro:page-load',init);
