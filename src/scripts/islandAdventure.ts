import {initialIslandState,answerIsland,nextIsland,islandStage,cleanIslandPreferences} from './islandState';
document.querySelectorAll<HTMLElement>('[data-island-root]').forEach(root=>{
 const es=root.dataset.locale==='es-AR';
 const get=<T extends HTMLElement>(name:string)=>root.querySelector<T>(`[data-island-${name}]`)!;
 let preferences=cleanIslandPreferences(null);
 try{preferences=cleanIslandPreferences(JSON.parse(localStorage.getItem('mundoki-island-style-v1')??'null'));}catch{}
 const renderPreferences=()=>{
  root.style.setProperty('--island-paint',({teal:'#378d8b',coral:'#cd806b',gold:'#c59a39'})[preferences.color]);
  root.querySelectorAll('[data-island-name-display]').forEach(el=>{el.textContent=preferences.name||(es?'Mi expedición':'My expedition');});
  root.querySelectorAll<HTMLElement>('[data-island-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.islandColor===preferences.color)));
 };
 const save=()=>{try{localStorage.setItem('mundoki-island-style-v1',JSON.stringify(preferences));}catch{}};
 get<HTMLInputElement>('name').value=preferences.name;renderPreferences();
 get<HTMLInputElement>('name').addEventListener('input',e=>{preferences=cleanIslandPreferences({...preferences,name:(e.target as HTMLInputElement).value});renderPreferences();save();});
 root.querySelectorAll<HTMLElement>('[data-island-color]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanIslandPreferences({...preferences,color:b.dataset.islandColor});renderPreferences();save();}));
 if(!root.hasAttribute('data-island-lesson'))return;
 const questions=[...root.querySelectorAll<HTMLElement>('[data-island-question]')];
 let state=initialIslandState(questions.length);
 const render=()=>{
  get('stage').dataset.phase=islandStage(state);
  root.querySelectorAll('[data-island-badge]').forEach((el,i)=>el.classList.toggle('is-done',i<state.solved));
  const finale=root.querySelector<HTMLElement>('[data-island-celebration]');if(finale)finale.hidden=state.solved!==state.count;
 };
 questions.forEach((q,i)=>q.querySelectorAll<HTMLButtonElement>('[data-island-answer]').forEach(b=>b.addEventListener('click',()=>{
  if(i!==state.current||state.solved!==state.current)return;
  const updated=answerIsland(state,i,Number(b.dataset.islandAnswer)===Number(q.dataset.answer));
  if(updated===state){get('feedback').textContent=es?'Probá otra vez. Mirá el ejemplo de arriba o pedí una pista.':'Try again. Look at the example above or ask for a hint.';return;}
  state=updated;q.querySelectorAll<HTMLButtonElement>('[data-island-answer]').forEach(button=>{button.disabled=true;});b.classList.add('is-correct');q.querySelector<HTMLElement>('[data-island-hint]')!.hidden=true;q.querySelector<HTMLElement>('[data-island-explanation]')!.hidden=false;
  get('reward').textContent=q.dataset.reward!;get('reward').hidden=false;
  get('feedback').textContent=es?'¡Lo lograste! Mirá tu invento.':'You did it! Look at your invention.';
  get('next').hidden=state.solved===state.count;get('finish').hidden=state.solved!==state.count;render();
 })));
 get('next').addEventListener('click',()=>{
  const updated=nextIsland(state);if(updated===state)return;state=updated;
  questions.forEach((q,i)=>{q.hidden=i!==state.current;});get('next').hidden=true;get('reward').hidden=true;get('feedback').textContent='';questions[state.current].querySelector<HTMLElement>('[data-island-question-title]')!.focus();
 });
 get('help').addEventListener('click',()=>{if(state.solved>state.current)return;questions[state.current].querySelector<HTMLElement>('[data-island-hint]')!.hidden=false;});
 get('reset').addEventListener('click',()=>{
  state=initialIslandState(questions.length);questions.forEach((q,i)=>{q.hidden=i!==0;q.querySelector<HTMLElement>('[data-island-hint]')!.hidden=true;q.querySelector<HTMLElement>('[data-island-explanation]')!.hidden=true;q.querySelectorAll<HTMLButtonElement>('[data-island-answer]').forEach(b=>{b.disabled=false;b.classList.remove('is-correct');});});
  ['next','finish','reward'].forEach(name=>{get(name).hidden=true;});get('reward').textContent='';get('feedback').textContent='';render();questions[0].querySelector<HTMLElement>('[data-island-question-title]')!.focus();
 });render();
});
function revealIslandAnchor(){
 let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target?.closest('[data-island-map]'))return;
 let parent:HTMLElement|null=target;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
revealIslandAnchor();window.addEventListener('hashchange',revealIslandAnchor);
