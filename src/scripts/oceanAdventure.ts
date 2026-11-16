import {initialOceanState,answerOcean,nextOcean,oceanStage,cleanOceanPreferences} from './oceanState';
document.querySelectorAll<HTMLElement>('[data-ocean-root]').forEach(root=>{
 const es=root.dataset.locale==='es-AR';
 const get=<T extends HTMLElement>(name:string)=>root.querySelector<T>(`[data-ocean-${name}]`)!;
 let preferences=cleanOceanPreferences(null);
 try{preferences=cleanOceanPreferences(JSON.parse(localStorage.getItem('mundoki-ocean-style-v1')??'null'));}catch{}
 const renderPreferences=()=>{
  root.style.setProperty('--ocean-paint',({teal:'#378d8b',coral:'#cd806b',gold:'#c59a39'})[preferences.color]);
  root.querySelectorAll('[data-ocean-emblem-display]').forEach(el=>{el.textContent=({star:'★',wave:'≈',anchor:'⚓'})[preferences.emblem];});
  root.querySelectorAll<HTMLElement>('[data-ocean-emblem]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.oceanEmblem===preferences.emblem)));
  root.querySelectorAll('[data-ocean-name-display]').forEach(el=>{el.textContent=preferences.name||(es?'Mi expedición':'My expedition');});
  root.querySelectorAll<HTMLElement>('[data-ocean-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.oceanColor===preferences.color)));
 };
 const save=()=>{try{localStorage.setItem('mundoki-ocean-style-v1',JSON.stringify(preferences));}catch{}};
 get<HTMLInputElement>('name').value=preferences.name;renderPreferences();
 get<HTMLInputElement>('name').addEventListener('input',e=>{preferences=cleanOceanPreferences({...preferences,name:(e.target as HTMLInputElement).value});renderPreferences();save();});
 root.querySelectorAll<HTMLElement>('[data-ocean-color]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanOceanPreferences({...preferences,color:b.dataset.oceanColor});renderPreferences();save();}));
 root.querySelectorAll<HTMLElement>('[data-ocean-emblem]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanOceanPreferences({...preferences,emblem:b.dataset.oceanEmblem});renderPreferences();save();}));
 if(!root.hasAttribute('data-ocean-lesson'))return;
 const questions=[...root.querySelectorAll<HTMLElement>('[data-ocean-question]')];
 let state=initialOceanState(questions.length);
 const render=()=>{
  get('stage').dataset.phase=oceanStage(state);
  root.querySelectorAll<HTMLElement>('[data-ocean-model]').forEach((model,i)=>{model.dataset.solved=String(Number(model.closest<HTMLElement>('[data-ocean-question]')!.dataset.oceanQuestion)<state.solved);});
  root.querySelectorAll('[data-ocean-badge]').forEach((el,i)=>el.classList.toggle('is-done',i<state.solved));
  const finale=root.querySelector<HTMLElement>('[data-ocean-celebration]');if(finale)finale.hidden=state.solved!==state.count;
 };
 questions.forEach((q,i)=>q.querySelectorAll<HTMLButtonElement>('[data-ocean-answer]').forEach(b=>b.addEventListener('click',()=>{
  if(i!==state.current||state.solved!==state.current)return;
  const updated=answerOcean(state,i,Number(b.dataset.oceanAnswer)===Number(q.dataset.answer));
  if(updated===state){get('feedback').textContent=es?'Probá otra vez. Tu equipo está bien. Podés pedir una pista.':'Try again. Your equipment is safe. You can ask for a hint.';return;}
  state=updated;q.querySelectorAll<HTMLButtonElement>('[data-ocean-answer]').forEach(button=>{button.disabled=true;});b.classList.add('is-correct');q.querySelector<HTMLElement>('[data-ocean-hint]')!.hidden=false;
  get('reward').textContent=q.dataset.reward!;get('reward').hidden=false;
  get('feedback').textContent=es?'¡Lo lograste! Mirá qué cambió en la misión.':'You did it! Look at what changed in the mission.';
  get('next').hidden=state.solved===state.count;get('finish').hidden=state.solved!==state.count;render();
 })));
 get('next').addEventListener('click',()=>{
  const updated=nextOcean(state);if(updated===state)return;state=updated;
  questions.forEach((q,i)=>{q.hidden=i!==state.current;});get('next').hidden=true;get('reward').hidden=true;get('feedback').textContent='';questions[state.current].querySelector<HTMLElement>('[data-ocean-question-title]')!.focus();
 });
 get('help').addEventListener('click',()=>{questions[state.current].querySelector<HTMLElement>('[data-ocean-hint]')!.hidden=false;});
 get('reset').addEventListener('click',()=>{
  state=initialOceanState(questions.length);questions.forEach((q,i)=>{q.hidden=i!==0;q.querySelector<HTMLElement>('[data-ocean-hint]')!.hidden=true;q.querySelectorAll<HTMLButtonElement>('[data-ocean-answer]').forEach(b=>{b.disabled=false;b.classList.remove('is-correct');});});
  ['next','finish','reward'].forEach(name=>{get(name).hidden=true;});get('reward').textContent='';get('feedback').textContent='';render();questions[0].querySelector<HTMLElement>('[data-ocean-question-title]')!.focus();
 });render();
});
function revealOceanAnchor(){
 let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target?.closest('[data-ocean-map]'))return;
 let parent:HTMLElement|null=target;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
revealOceanAnchor();window.addEventListener('hashchange',revealOceanAnchor);
