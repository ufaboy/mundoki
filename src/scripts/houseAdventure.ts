// Grade 3 house story: house name and wall colour, the two challenges of a
// mission, and the house growing one piece per correct answer.
// Each challenge has several versions (the authored one plus generated ones with
// new numbers). A wrong answer pauses the buttons, Rosa writes the problem again
// with other numbers, and the next version appears with Átomo's hint, so
// pressing every button in turn never adds a house piece.
import {houseSceneState,housePieceVisible,cleanHousePreferences,type HouseColor} from './houseState';
import {showStars} from './missionPractice';
import {recordMissionCheck} from './missionProgress';
import type {TopicId} from '../math/core/types';

const PAUSE_MS=2500;
const MAX_DIGITS=5;
const shuffle=(group:HTMLElement)=>{
 const buttons=[...group.children];
 for(let i=buttons.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[buttons[i],buttons[j]]=[buttons[j],buttons[i]];}
 group.append(...buttons);
};

document.querySelectorAll<HTMLElement>('[data-city-root]').forEach(root=>{
 const es=root.dataset.locale==='es-AR';
 const key='mundoki-house-style-v1';
 let preferences=cleanHousePreferences(null);
 try {preferences=cleanHousePreferences(JSON.parse(localStorage.getItem(key)??'null'));}catch {/* Preferences are optional. */}
 const paints:Record<HouseColor,string>={terracotta:'#ce9879',sage:'#a4b58a',blue:'#8eb1bb'};
 const nameInput=root.querySelector<HTMLInputElement>('[data-city-name]');
 const renderPreferences=()=>{
  root.style.setProperty('--city-paint',paints[preferences.color]);
  root.querySelectorAll('[data-city-name-display]').forEach(el=>{el.textContent=preferences.name||(es?'Nuestra casa':'Our house');});
  root.querySelectorAll('[data-city-color]').forEach(button=>button.setAttribute('aria-pressed',String((button as HTMLElement).dataset.cityColor===preferences.color)));
 };
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(preferences));}catch{/* Keep the current session usable when storage is blocked. */}};
 if(nameInput)nameInput.value=preferences.name;
 renderPreferences();
 nameInput?.addEventListener('input',()=>{preferences=cleanHousePreferences({...preferences,name:nameInput.value});renderPreferences();save();});
 root.querySelectorAll<HTMLButtonElement>('[data-city-color]').forEach(button=>button.addEventListener('click',()=>{preferences=cleanHousePreferences({...preferences,color:button.dataset.cityColor});renderPreferences();save();}));
 if(!root.hasAttribute('data-city-lesson'))return;
 const get=<T extends HTMLElement>(name:string)=>root.querySelector<T>(`[data-city-${name}]`)!;
 const questions=[...root.querySelectorAll<HTMLElement>('[data-city-question]')];
 const rewards=[...root.querySelectorAll<HTMLElement>('[data-city-reward]')];
 const count=root.querySelector<HTMLElement>('[data-house-count]');
 const index=Number(root.dataset.cityIndex);
 let current=0,solved=0;
 const render=()=>{
  const state=houseSceneState(index,solved);
  get('stage').querySelectorAll<SVGElement>('[data-house-piece]').forEach(piece=>{
   const until=piece.dataset.houseUntil?Number(piece.dataset.houseUntil):undefined;
   piece.classList.toggle('is-hidden',!housePieceVisible(Number(piece.dataset.housePiece),state.pieces,until));
  });
  if(count)count.textContent=String(state.pieces);
  root.querySelectorAll<HTMLElement>('[data-city-badge]').forEach((badge,i)=>badge.classList.toggle('is-done',i<solved));
  const finale=root.querySelector<HTMLElement>('[data-city-celebration]');if(finale)finale.hidden=!state.complete;
 };
 const showReward=(i:number|null)=>rewards.forEach((reward,j)=>{reward.hidden=j!==i;});
 render();
 root.querySelectorAll<HTMLButtonElement>('[data-city-place]').forEach(button=>button.addEventListener('click',()=>{
  // Each version of the first challenge has its own model of its own number.
  const model=button.closest('.city-place-model')!;
  model.querySelectorAll('[data-city-place]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  model.querySelector<HTMLElement>('[data-city-place-result]')!.textContent=button.dataset.cityPlace!;
 }));
 const variants=(question:HTMLElement)=>[...question.querySelectorAll<HTMLElement>('[data-city-variant]')];
 const visible=(question:HTMLElement)=>variants(question).find(v=>!v.hidden)!;
 const controls=(variant:HTMLElement)=>[...variant.querySelectorAll<HTMLButtonElement|HTMLInputElement>('[data-city-answer], [data-city-key], [data-city-entry] button, [data-city-entry-input]')];
 const setDisabled=(variant:HTMLElement,disabled:boolean)=>controls(variant).forEach(c=>{c.disabled=disabled;});
 let paused=false,pauseTimer=0;
 // Fresh order of the options every time a version is shown.
 const prepare=(variant:HTMLElement)=>{
  const options=variant.querySelector<HTMLElement>('.city-answer-options');if(options)shuffle(options);
  const input=variant.querySelector<HTMLInputElement>('[data-city-entry-input]');if(input)input.value='';
 };
 const showVariant=(question:HTMLElement,k:number)=>{
  variants(question).forEach((v,j)=>{v.hidden=j!==k;v.querySelector<HTMLElement>('[data-city-hint]')!.hidden=true;});
  prepare(variants(question)[k]);
 };
 const succeed=(variant:HTMLElement,i:number,answer:string,chosen?:HTMLElement)=>{
  solved++;setDisabled(variant,true);
  chosen?.classList.add('is-correct');variant.querySelector('[data-city-entry]')?.classList.add('is-correct');
  variant.querySelector<HTMLElement>('[data-city-hint]')!.hidden=true;
  variant.querySelector<HTMLElement>('[data-city-explanation]')!.hidden=false;
  // The reward is rendered per hero by HeroText; copy it so CSS keeps choosing the hero.
  const source=variant.querySelector<HTMLElement>('[data-city-reward-source]');
  if(source&&rewards[i])rewards[i].replaceChildren(...[...source.childNodes].map(node=>node.cloneNode(true)));
  showReward(i);
  // Counts once per mission challenge; the server rebuilds the shown version from its seed.
  const seed=Number(variant.dataset.seed)||0;
  showStars(root,recordMissionCheck({lessonId:root.dataset.lessonId!,checkIndex:i,answer,variantSeed:seed||undefined,topicId:root.dataset.topicId as TopicId}));
  get('feedback').textContent=es?'¡Lo lograste! Mirá qué cambió en la casa.':'You did it! Look at what changed in the house.';
  get('next').hidden=solved===questions.length;get('finish').hidden=solved!==questions.length;render();
 };
 // Wrong answer: pause, then Rosa writes the next version with Átomo's hint open.
 const fail=(question:HTMLElement,variant:HTMLElement)=>{
  paused=true;setDisabled(variant,true);
  get('feedback').textContent=es?'No es esa. Rosa anota la cuenta otra vez, con otros números…':'That’s not it. Rosa writes the problem again, with other numbers…';
  pauseTimer=window.setTimeout(()=>{
   paused=false;
   const all=variants(question),next=(all.indexOf(variant)+1)%all.length;
   setDisabled(variant,false);showVariant(question,next);
   const shown=all[next];shown.querySelector<HTMLElement>('[data-city-hint]')!.hidden=false;
   get('feedback').textContent=es?'Ahora hay otros números. Átomo te deja una pista.':'Now there are new numbers. Átomo leaves you a hint.';
   shown.querySelector<HTMLElement>('[data-city-question-title]')!.focus();
  },PAUSE_MS);
 };
 const answer=(question:HTMLElement,i:number,isCorrect:boolean,value:string,chosen?:HTMLElement)=>{
  if(i!==current||solved>i||paused)return;
  const variant=visible(question);
  if(isCorrect)succeed(variant,i,value,chosen);else fail(question,variant);
 };
 questions.forEach((question,i)=>{
  variants(question).forEach(variant=>{
   const expected=Number(variant.dataset.answer);
   variant.querySelectorAll<HTMLButtonElement>('[data-city-answer]').forEach(button=>button.addEventListener('click',()=>{
    answer(question,i,Number(button.dataset.cityAnswer)===expected,button.dataset.cityAnswer!,button);
   }));
   const form=variant.querySelector<HTMLFormElement>('[data-city-entry]');
   if(!form)return;
   const input=form.querySelector<HTMLInputElement>('[data-city-entry-input]')!;
   input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(0,MAX_DIGITS);});
   form.querySelectorAll<HTMLButtonElement>('[data-city-key]').forEach(key=>key.addEventListener('click',()=>{
    const value=key.dataset.cityKey!;
    input.value=value==='back'?input.value.slice(0,-1):(input.value+value).slice(0,MAX_DIGITS);
   }));
   form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!input.value){get('feedback').textContent=es?'Escribí un número con las teclas.':'Type a number with the keys.';input.focus();return;}
    answer(question,i,Number(input.value)===expected,String(Number(input.value)));
   });
  });
  prepare(variants(question)[0]);
 });
 get('next').addEventListener('click',()=>{
  if(solved!==current+1||current===questions.length-1)return;
  current++;questions.forEach((q,i)=>{q.hidden=i!==current;});get('next').hidden=true;showReward(null);get('feedback').textContent='';
  visible(questions[current]).querySelector<HTMLElement>('[data-city-question-title]')!.focus();
 });
 get('help').addEventListener('click',()=>{if(solved>current)return;visible(questions[current]).querySelector<HTMLElement>('[data-city-hint]')!.hidden=false;});
 get('reset').addEventListener('click',()=>{
  window.clearTimeout(pauseTimer);paused=false;current=0;solved=0;
  questions.forEach((q,i)=>{
   q.hidden=i!==0;
   variants(q).forEach(v=>{
    v.querySelector<HTMLElement>('[data-city-explanation]')!.hidden=true;setDisabled(v,false);
    v.querySelectorAll('.is-correct').forEach(b=>b.classList.remove('is-correct'));
   });
   showVariant(q,0);
  });
  ['next','finish'].forEach(name=>{get(name).hidden=true;});showReward(null);get('feedback').textContent='';
  root.querySelectorAll('[data-city-place]').forEach(b=>b.setAttribute('aria-pressed','false'));
  root.querySelectorAll('[data-city-place-result]').forEach(result=>{result.textContent='';});
  render();visible(questions[0]).querySelector<HTMLElement>('[data-city-question-title]')!.focus();
 });
});

function revealHouseAnchor(){
 let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target?.closest('[data-city-map]'))return;
 let parent:HTMLElement|null=target;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
revealHouseAnchor();window.addEventListener('hashchange',revealHouseAnchor);
