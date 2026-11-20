// Grade 4 mission page (IslandLesson.astro): crew preferences, the challenges and
// the story scene. Each challenge has several versions (the authored one plus
// generated ones with new numbers). A wrong answer pauses the buttons, Nina works
// the problem out again with other numbers, and the next version appears with its
// hint open, so pressing every button in turn never completes a mission.
import {initialIslandState,answerIsland,nextIsland,islandStage,cleanIslandPreferences} from './islandState';
import {checkSecondaryAnswer} from '../math/core/secondaryAnswer';

const PAUSE_MS=2500;
const MAX_CHARS=12;
const shuffle=(group:HTMLElement)=>{
 const buttons=[...group.children];
 for(let i=buttons.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[buttons[i],buttons[j]]=[buttons[j],buttons[i]];}
 group.append(...buttons);
};
document.querySelectorAll<HTMLElement>('[data-island-root]').forEach(root=>{
 const es=root.dataset.locale==='es-AR';
 const get=<T extends HTMLElement>(name:string)=>root.querySelector<T>(`[data-island-${name}]`)!;
 let preferences=cleanIslandPreferences(null);
 try{preferences=cleanIslandPreferences(JSON.parse(localStorage.getItem('mundoki-island-style-v1')??'null'));}catch{}
 const renderPreferences=()=>{
  root.style.setProperty('--island-paint',({teal:'#378d8b',coral:'#cd806b',gold:'#c59a39'})[preferences.color]);
  root.querySelectorAll('[data-island-name-display]').forEach(el=>{el.textContent=preferences.name||(es?'Bitácora de vuelo':'Flight logbook');});
  root.querySelectorAll<HTMLElement>('[data-island-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.islandColor===preferences.color)));
 };
 const save=()=>{try{localStorage.setItem('mundoki-island-style-v1',JSON.stringify(preferences));}catch{}};
 get<HTMLInputElement>('name').value=preferences.name;renderPreferences();
 get<HTMLInputElement>('name').addEventListener('input',e=>{preferences=cleanIslandPreferences({...preferences,name:(e.target as HTMLInputElement).value});renderPreferences();save();});
 root.querySelectorAll<HTMLElement>('[data-island-color]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanIslandPreferences({...preferences,color:b.dataset.islandColor});renderPreferences();save();}));
 if(!root.hasAttribute('data-island-lesson'))return;
 const questions=[...root.querySelectorAll<HTMLElement>('[data-island-question]')];
 let state=initialIslandState(questions.length);
 let paused=false,pauseTimer=0;
 const render=()=>{
  get('stage').dataset.phase=islandStage(state);
  root.querySelectorAll('[data-island-badge]').forEach((el,i)=>el.classList.toggle('is-done',i<state.solved));
  const finale=root.querySelector<HTMLElement>('[data-island-celebration]');if(finale)finale.hidden=state.solved!==state.count;
 };
 const variants=(question:HTMLElement)=>[...question.querySelectorAll<HTMLElement>('[data-island-variant]')];
 const visible=(question:HTMLElement)=>variants(question).find(v=>!v.hidden)!;
 const controls=(variant:HTMLElement)=>[...variant.querySelectorAll<HTMLButtonElement|HTMLInputElement>('[data-island-answer], [data-island-key], [data-island-entry] button, [data-island-entry-input]')];
 const setDisabled=(variant:HTMLElement,disabled:boolean)=>controls(variant).forEach(c=>{c.disabled=disabled;});
 // Fresh order of the options every time a version is shown.
 const prepare=(variant:HTMLElement)=>{
  const options=variant.querySelector<HTMLElement>('.city-answer-options');if(options)shuffle(options);
  const input=variant.querySelector<HTMLInputElement>('[data-island-entry-input]');if(input)input.value='';
 };
 const showVariant=(question:HTMLElement,k:number)=>{
  variants(question).forEach((v,j)=>{v.hidden=j!==k;v.querySelector<HTMLElement>('[data-island-hint]')!.hidden=true;});
  prepare(variants(question)[k]);
 };
 const succeed=(question:HTMLElement,variant:HTMLElement,i:number,chosen?:HTMLElement)=>{
  state=answerIsland(state,i,true);
  setDisabled(variant,true);chosen?.classList.add('is-correct');variant.querySelector('[data-island-entry]')?.classList.add('is-correct');
  variant.querySelector<HTMLElement>('[data-island-hint]')!.hidden=true;variant.querySelector<HTMLElement>('[data-island-explanation]')!.hidden=false;
  // The reward is rendered per hero by HeroText; copy it so CSS keeps choosing the hero.
  get('reward').replaceChildren(...[...variant.querySelector<HTMLElement>('[data-island-reward-source]')!.childNodes].map(node=>node.cloneNode(true)));get('reward').hidden=false;
  get('feedback').textContent=es?'¡Lo lograste! Mirá la escena.':'You did it! Look at the scene.';
  get('next').hidden=state.solved===state.count;get('finish').hidden=state.solved!==state.count;render();
 };
 // Wrong answer: pause, then Nina works the problem out again with other numbers, hint open.
 const fail=(question:HTMLElement,variant:HTMLElement)=>{
  paused=true;setDisabled(variant,true);
  get('feedback').textContent=es?'No es esa. Nina vuelve a calcular con otros números…':'That’s not it. Nina works it out again with other numbers…';
  pauseTimer=window.setTimeout(()=>{
   paused=false;
   const all=variants(question),next=(all.indexOf(variant)+1)%all.length;
   setDisabled(variant,false);showVariant(question,next);
   const shown=all[next];shown.querySelector<HTMLElement>('[data-island-hint]')!.hidden=false;
   get('feedback').textContent=es?'Ahora hay otros números. Te dejamos una pista.':'Now there are new numbers. Here is a hint.';
   shown.querySelector<HTMLElement>('[data-island-question-title]')!.focus();
  },PAUSE_MS);
 };
 const answer=(question:HTMLElement,i:number,correct:boolean,chosen?:HTMLElement)=>{
  if(i!==state.current||state.solved!==state.current||paused)return;
  const variant=visible(question);
  if(correct)succeed(question,variant,i,chosen);else fail(question,variant);
 };
 questions.forEach((question,i)=>{
  variants(question).forEach(variant=>{
   variant.querySelectorAll<HTMLButtonElement>('[data-island-answer]').forEach(button=>button.addEventListener('click',()=>{
    answer(question,i,Number(button.dataset.islandAnswer)===Number(variant.dataset.answer),button);
   }));
   const form=variant.querySelector<HTMLFormElement>('[data-island-entry]');
   if(!form)return;
   const input=form.querySelector<HTMLInputElement>('[data-island-entry-input]')!;
   input.addEventListener('input',()=>{input.value=input.value.replace(/[^\d.,/]/g,'').slice(0,MAX_CHARS);});
   form.querySelectorAll<HTMLButtonElement>('[data-island-key]').forEach(key=>key.addEventListener('click',()=>{
    const value=key.dataset.islandKey!;
    input.value=value==='back'?input.value.slice(0,-1):(input.value+value).slice(0,MAX_CHARS);
   }));
   form.addEventListener('submit',event=>{
    event.preventDefault();
    // Exact check: equal values count (2/4 = 1/2, 2,08 = 2.08); something that is not a number is not a try.
    const verdict=checkSecondaryAnswer({kind:'number',value:variant.dataset.value!},input.value);
    if(verdict==='invalid'){get('feedback').textContent=es?'Escribí un número con las teclas.':'Type a number with the keys.';input.focus();return;}
    answer(question,i,verdict==='correct');
   });
  });
  prepare(variants(question)[0]);
 });
 get('next').addEventListener('click',()=>{
  const updated=nextIsland(state);if(updated===state)return;state=updated;
  questions.forEach((q,i)=>{q.hidden=i!==state.current;});get('next').hidden=true;get('reward').hidden=true;get('feedback').textContent='';visible(questions[state.current]).querySelector<HTMLElement>('[data-island-question-title]')!.focus();
 });
 get('help').addEventListener('click',()=>{if(state.solved>state.current)return;visible(questions[state.current]).querySelector<HTMLElement>('[data-island-hint]')!.hidden=false;});
 get('reset').addEventListener('click',()=>{
  window.clearTimeout(pauseTimer);paused=false;state=initialIslandState(questions.length);
  questions.forEach((q,i)=>{
   q.hidden=i!==0;
   variants(q).forEach(v=>{v.querySelector<HTMLElement>('[data-island-explanation]')!.hidden=true;setDisabled(v,false);v.querySelectorAll('.is-correct').forEach(b=>b.classList.remove('is-correct'));});
   showVariant(q,0);
  });
  ['next','finish','reward'].forEach(name=>{get(name).hidden=true;});get('reward').textContent='';get('feedback').textContent='';render();visible(questions[0]).querySelector<HTMLElement>('[data-island-question-title]')!.focus();
 });render();
});
function revealIslandAnchor(){
 let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target?.closest('[data-island-map]'))return;
 let parent:HTMLElement|null=target;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
revealIslandAnchor();window.addEventListener('hashchange',revealIslandAnchor);
