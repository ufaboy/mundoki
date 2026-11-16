import {initialMoonState,answerMoon,nextMoon,moonStage,cleanMoonPreferences} from './moonState';
document.querySelectorAll<HTMLElement>('[data-moon-root]').forEach(root=>{
 const es=root.dataset.locale==='es-AR';
 const get=<T extends HTMLElement>(name:string)=>root.querySelector<T>(`[data-moon-${name}]`)!;
 let preferences=cleanMoonPreferences(null);
 try{preferences=cleanMoonPreferences(JSON.parse(localStorage.getItem('mundoki-moon-style-v1')??'null'));}catch{}
 const renderPreferences=()=>{
  root.style.setProperty('--moon-paint',({teal:'#378d8b',coral:'#cd806b',gold:'#c59a39'})[preferences.color]);
  root.querySelectorAll('[data-moon-emblem-display]').forEach(el=>{el.textContent=({star:'★',moon:'☾',planet:'♄'})[preferences.emblem];});
  root.querySelectorAll<HTMLElement>('[data-moon-emblem]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.moonEmblem===preferences.emblem)));
  root.querySelectorAll('[data-moon-name-display]').forEach(el=>{el.textContent=preferences.name||(es?'Mi expedición':'My expedition');});
  root.querySelectorAll<HTMLElement>('[data-moon-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.moonColor===preferences.color)));
 };
 const save=()=>{try{localStorage.setItem('mundoki-moon-style-v1',JSON.stringify(preferences));}catch{}};
 get<HTMLInputElement>('name').value=preferences.name;renderPreferences();
 get<HTMLInputElement>('name').addEventListener('input',e=>{preferences=cleanMoonPreferences({...preferences,name:(e.target as HTMLInputElement).value});renderPreferences();save();});
 root.querySelectorAll<HTMLElement>('[data-moon-color]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanMoonPreferences({...preferences,color:b.dataset.moonColor});renderPreferences();save();}));
 root.querySelectorAll<HTMLElement>('[data-moon-emblem]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanMoonPreferences({...preferences,emblem:b.dataset.moonEmblem});renderPreferences();save();}));
 if(!root.hasAttribute('data-moon-lesson'))return;
 const questions=[...root.querySelectorAll<HTMLElement>('[data-moon-question]')];
 let state=initialMoonState(questions.length);
 const render=()=>{
  get('stage').dataset.phase=moonStage(state);
  root.querySelectorAll<HTMLElement>('[data-moon-model]').forEach((model,i)=>{model.dataset.solved=String(Number(model.closest<HTMLElement>('[data-moon-question]')!.dataset.moonQuestion)<state.solved);});
  root.querySelectorAll('[data-moon-badge]').forEach((el,i)=>el.classList.toggle('is-done',i<state.solved));
  const finale=root.querySelector<HTMLElement>('[data-moon-celebration]');if(finale)finale.hidden=state.solved!==state.count;
 };
 questions.forEach((q,i)=>q.querySelectorAll<HTMLButtonElement>('[data-moon-answer]').forEach(b=>b.addEventListener('click',()=>{
  if(i!==state.current||state.solved!==state.current)return;
  const updated=answerMoon(state,i,Number(b.dataset.moonAnswer)===Number(q.dataset.answer));
  if(updated===state){get('feedback').textContent=es?'Probá otra vez. Mirá el ejemplo de arriba o pedí una pista.':'Try again. Look at the example above or ask for a hint.';return;}
  state=updated;q.querySelectorAll<HTMLButtonElement>('[data-moon-answer]').forEach(button=>{button.disabled=true;});b.classList.add('is-correct');q.querySelector<HTMLElement>('[data-moon-hint]')!.hidden=true;q.querySelector<HTMLElement>('[data-moon-explanation]')!.hidden=false;
  get('reward').textContent=q.dataset.reward!;get('reward').hidden=false;
  get('feedback').textContent=es?'¡Lo lograste! Mirá qué cambió en la misión.':'You did it! Look at what changed in the mission.';
  get('next').hidden=state.solved===state.count;get('finish').hidden=state.solved!==state.count;render();
 })));
 get('next').addEventListener('click',()=>{
  const updated=nextMoon(state);if(updated===state)return;state=updated;
  questions.forEach((q,i)=>{q.hidden=i!==state.current;});get('next').hidden=true;get('reward').hidden=true;get('feedback').textContent='';questions[state.current].querySelector<HTMLElement>('[data-moon-question-title]')!.focus();
 });
 get('help').addEventListener('click',()=>{if(state.solved>state.current)return;questions[state.current].querySelector<HTMLElement>('[data-moon-hint]')!.hidden=false;});
 get('reset').addEventListener('click',()=>{
  state=initialMoonState(questions.length);questions.forEach((q,i)=>{q.hidden=i!==0;q.querySelector<HTMLElement>('[data-moon-hint]')!.hidden=true;q.querySelector<HTMLElement>('[data-moon-explanation]')!.hidden=true;q.querySelectorAll<HTMLButtonElement>('[data-moon-answer]').forEach(b=>{b.disabled=false;b.classList.remove('is-correct');});});
  ['next','finish','reward'].forEach(name=>{get(name).hidden=true;});get('reward').textContent='';get('feedback').textContent='';render();questions[0].querySelector<HTMLElement>('[data-moon-question-title]')!.focus();
 });render();
});
function revealMoonAnchor(){
 let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target?.closest('[data-moon-map]'))return;
 let parent:HTMLElement|null=target;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
revealMoonAnchor();window.addEventListener('hashchange',revealMoonAnchor);
