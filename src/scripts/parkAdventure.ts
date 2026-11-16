import {initialParkState,answerPark,nextPark,parkStage,cleanParkPreferences} from './parkState';
document.querySelectorAll<HTMLElement>('[data-park-root]').forEach(root=>{
 const es=root.dataset.locale==='es-AR';
 const get=<T extends HTMLElement>(name:string)=>root.querySelector<T>(`[data-park-${name}]`)!;
 let preferences=cleanParkPreferences(null);
 try{preferences=cleanParkPreferences(JSON.parse(localStorage.getItem('mundoki-park-style-v1')??'null'));}catch{}
 const renderPreferences=()=>{
  root.style.setProperty('--park-paint',({teal:'#378d8b',coral:'#cd806b',gold:'#c59a39'})[preferences.color]);
  root.querySelectorAll('[data-park-emblem-display]').forEach(el=>{el.textContent=({star:'★',wave:'≈',anchor:'⚓'})[preferences.emblem];});
  root.querySelectorAll<HTMLElement>('[data-park-emblem]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.parkEmblem===preferences.emblem)));
  root.querySelectorAll('[data-park-name-display]').forEach(el=>{el.textContent=preferences.name||(es?'Mi parque':'My park');});
  root.querySelectorAll<HTMLElement>('[data-park-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.parkColor===preferences.color)));
 };
 const save=()=>{try{localStorage.setItem('mundoki-park-style-v1',JSON.stringify(preferences));}catch{}};
 get<HTMLInputElement>('name').value=preferences.name;renderPreferences();
 get<HTMLInputElement>('name').addEventListener('input',e=>{preferences=cleanParkPreferences({...preferences,name:(e.target as HTMLInputElement).value});renderPreferences();save();});
 root.querySelectorAll<HTMLElement>('[data-park-color]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanParkPreferences({...preferences,color:b.dataset.parkColor});renderPreferences();save();}));
 root.querySelectorAll<HTMLElement>('[data-park-emblem]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanParkPreferences({...preferences,emblem:b.dataset.parkEmblem});renderPreferences();save();}));
 if(!root.hasAttribute('data-park-lesson'))return;
 const questions=[...root.querySelectorAll<HTMLElement>('[data-park-question]')];
 let state=initialParkState(questions.length);
 const render=()=>{
  get('stage').dataset.phase=parkStage(state);
  root.querySelectorAll<HTMLElement>('[data-park-model]').forEach((model,i)=>{model.dataset.solved=String(Number(model.closest<HTMLElement>('[data-park-question]')!.dataset.parkQuestion)<state.solved);});
  root.querySelectorAll('[data-park-badge]').forEach((el,i)=>el.classList.toggle('is-done',i<state.solved));
  const finale=root.querySelector<HTMLElement>('[data-park-celebration]');if(finale)finale.hidden=state.solved!==state.count;
 };
 questions.forEach((q,i)=>q.querySelectorAll<HTMLButtonElement>('[data-park-answer]').forEach(b=>b.addEventListener('click',()=>{
  if(i!==state.current||state.solved!==state.current)return;
  const updated=answerPark(state,i,Number(b.dataset.parkAnswer)===Number(q.dataset.answer));
  if(updated===state){get('feedback').textContent=es?'Probá otra vez. Tu equipo está bien. Podés pedir una pista.':'Try again. Your equipment is safe. You can ask for a hint.';return;}
  state=updated;q.querySelectorAll<HTMLButtonElement>('[data-park-answer]').forEach(button=>{button.disabled=true;});b.classList.add('is-correct');q.querySelector<HTMLElement>('[data-park-hint]')!.hidden=true;q.querySelector<HTMLElement>('[data-park-explanation]')!.hidden=false;
  get('reward').textContent=q.dataset.reward!;get('reward').hidden=false;
  get('feedback').textContent=es?'¡Lo lograste! Mirá qué cambió en la misión.':'You did it! Look at what changed in the mission.';
  get('next').hidden=state.solved===state.count;get('finish').hidden=state.solved!==state.count;render();
 })));
 get('next').addEventListener('click',()=>{
  const updated=nextPark(state);if(updated===state)return;state=updated;
  questions.forEach((q,i)=>{q.hidden=i!==state.current;});get('next').hidden=true;get('reward').hidden=true;get('feedback').textContent='';questions[state.current].querySelector<HTMLElement>('[data-park-question-title]')!.focus();
 });
 get('help').addEventListener('click',()=>{if(state.solved!==state.current)return;questions[state.current].querySelector<HTMLElement>('[data-park-hint]')!.hidden=false;});
 get('reset').addEventListener('click',()=>{
  state=initialParkState(questions.length);questions.forEach((q,i)=>{q.hidden=i!==0;q.querySelector<HTMLElement>('[data-park-hint]')!.hidden=true;q.querySelector<HTMLElement>('[data-park-explanation]')!.hidden=true;q.querySelectorAll<HTMLButtonElement>('[data-park-answer]').forEach(b=>{b.disabled=false;b.classList.remove('is-correct');});});
  ['next','finish','reward'].forEach(name=>{get(name).hidden=true;});get('reward').textContent='';get('feedback').textContent='';render();questions[0].querySelector<HTMLElement>('[data-park-question-title]')!.focus();
 });render();
});
function revealParkAnchor(){
 let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target?.closest('[data-park-map]'))return;
 let parent:HTMLElement|null=target;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
revealParkAnchor();window.addEventListener('hashchange',revealParkAnchor);
