import { roadSceneState } from '../content/grade2/roadTrip';

document.querySelectorAll<HTMLElement>('[data-road-lesson]').forEach(root=>{
 const es=root.dataset.locale==='es-AR';
 const index=Number(root.dataset.missionIndex);
 const get=<T extends HTMLElement>(name:string)=>root.querySelector<T>(`[data-road-${name}]`)!;
 const questions=[...root.querySelectorAll<HTMLElement>('[data-road-question]')];
 let current=0;
 let solved=0;
 let vehicle:'car'|'van'='car';
 const paint={gold:'#e9ad56',blue:'#7bb2c2',coral:'#df937e'};
 const renderCar=()=>{
  const state=roadSceneState(index,solved);
  root.querySelectorAll<SVGElement>('[data-car-part]').forEach(part=>{
   const partNumber=Number(part.dataset.carPart);
   const upgradeAt:Record<number,number>={28:4,32:8,34:10};
   part.classList.toggle('is-fitted',partNumber<=state.parts && (!(partNumber in upgradeAt) || state.upgrades>=upgradeAt[partNumber]));
  });
  get('stage').style.setProperty('--road-distance',`${state.distance}%`);
  get('stage').style.setProperty('--ferry-progress',`${state.ferryProgress}%`);
  get('stage').dataset.steps=String(solved);
  get('stage').dataset.purchased=String(state.purchased);
  get('stage').dataset.boarded=String(state.ferryProgress>=33);
  get('stage').dataset.ferryArrived=String(state.ferryProgress===100);
  get('stage').dataset.vanAvailable=String(state.vanAvailable);
  if(!state.vanAvailable) vehicle='car';
  get('car-art').hidden=vehicle==='van';get('van-art').hidden=vehicle==='car';
  root.querySelectorAll<HTMLButtonElement>('[data-road-vehicle]').forEach(button=>{
   button.disabled=button.dataset.roadVehicle==='van' && !state.vanAvailable;
   button.setAttribute('aria-pressed',String(button.dataset.roadVehicle===vehicle));
  });
  const garage=root.querySelector<HTMLElement>('[data-road-garage-status]');
  if(garage) garage.textContent=state.vanAvailable?(es?'Los dos están disponibles. Elegí cuál usar en esta misión.':'Both are available. Choose one for this mission.'):(es?'Completá esta misión para recibir la camioneta.':'Complete this mission to receive the van.');
  get('stage').classList.toggle('road-mission-done',solved===questions.length);
 };
 renderCar();
 root.querySelectorAll<HTMLButtonElement>('[data-road-vehicle]').forEach(button=>button.addEventListener('click',()=>{
  const requested=button.dataset.roadVehicle;
  if(requested==='van' && !roadSceneState(index,solved).vanAvailable) return;
  if(requested!=='car' && requested!=='van') return;
  vehicle=requested;renderCar();
 }));
 root.querySelectorAll<HTMLButtonElement>('[data-road-color]').forEach(button=>button.addEventListener('click',()=>{
  const color=button.dataset.roadColor as keyof typeof paint;
  root.style.setProperty('--car-paint',paint[color]);
  root.querySelectorAll('[data-road-color]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }));
 questions.forEach((question,i)=>{
  question.querySelectorAll<HTMLButtonElement>('[data-road-place-value]').forEach(button=>button.addEventListener('click',()=>{
   question.querySelectorAll('[data-road-place-value]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   question.querySelector<HTMLElement>('[data-road-place-result]')!.textContent=button.dataset.roadPlaceValue!;
  }));
  question.querySelectorAll<HTMLButtonElement>('[data-road-answer]').forEach(button=>button.addEventListener('click',()=>{
   if (i!==current || solved>i) return;
   if (Number(button.dataset.roadAnswer)!==Number(question.dataset.answer)) {
    get('feedback').textContent=es?'Probá otra vez. La pista y el ejemplo de arriba te pueden ayudar.':'Try again. The hint and the example above can help you.';
    return;
   }
   solved++;
   question.querySelectorAll<HTMLButtonElement>('[data-road-answer]').forEach(b=>{b.disabled=true;});
   button.classList.add('is-correct');
   question.querySelector<HTMLElement>('[data-road-hint]')!.hidden=true;
   question.querySelector<HTMLElement>('[data-road-explanation]')!.hidden=false;
   get('reward-text').textContent=question.dataset.reward!;
   get('reward').hidden=false;
   root.querySelector(`[data-road-badge="${i}"]`)?.classList.add('is-done');
   get('next').hidden=solved===questions.length;
   get('finish').hidden=solved!==questions.length;
   get('feedback').textContent=es?'¡Lo lograste! Mirá cómo avanza nuestra aventura.':'You did it! Look at our adventure moving forward.';
   if(solved===questions.length) root.querySelector<HTMLElement>('[data-road-postcard]')?.removeAttribute('hidden');
   renderCar();
  }));
 });
 get('next').addEventListener('click',()=>{
  if(solved!==current+1 || current>=questions.length-1) return;
  current++; questions.forEach((q,i)=>{q.hidden=i!==current;});
  get('next').hidden=true;get('reward').hidden=true;get('feedback').textContent='';
  questions[current].querySelector<HTMLElement>('[data-road-question-title]')!.focus();
 });
 get('help').addEventListener('click',()=>{if(solved>current) return;questions[current].querySelector<HTMLElement>('[data-road-hint]')!.hidden=false;});
 get('reset').addEventListener('click',()=>{
  current=0;solved=0;vehicle='car';
  questions.forEach((q,i)=>{
   q.hidden=i!==0;q.querySelector<HTMLElement>('[data-road-hint]')!.hidden=true;
   q.querySelector<HTMLElement>('[data-road-explanation]')!.hidden=true;
   q.querySelectorAll<HTMLButtonElement>('[data-road-answer]').forEach(b=>{b.disabled=false;b.classList.remove('is-correct');});
   q.querySelectorAll('[data-road-place-value]').forEach(b=>b.setAttribute('aria-pressed','false'));
   const result=q.querySelector('[data-road-place-result]');if(result) result.textContent='';
  });
  root.querySelectorAll('[data-road-badge]').forEach(b=>b.classList.remove('is-done'));
  ['next','finish','reward'].forEach(name=>{get(name).hidden=true;});
  get('feedback').textContent='';root.querySelector<HTMLElement>('[data-road-postcard]')?.setAttribute('hidden','');
  renderCar();questions[0].querySelector<HTMLElement>('[data-road-question-title]')!.focus();
 });
});
