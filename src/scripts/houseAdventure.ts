// Grade 3 house story: house name and wall colour, the two challenges of a
// mission, and the house growing one piece per correct answer.
import {houseSceneState,housePieceVisible,cleanHousePreferences,type HouseColor} from './houseState';
import {applyNewNumbers,recordAnswer,showStars} from './missionPractice';
import type {TopicId} from '../math/core/types';

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
  root.querySelectorAll('[data-city-place]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  get('place-result').textContent=button.dataset.cityPlace!;
 }));
 questions.forEach((question,i)=>question.querySelectorAll<HTMLButtonElement>('[data-city-answer]').forEach(button=>button.addEventListener('click',()=>{
  // After "new numbers" on a solved challenge the child may answer again: it counts, the mission step stays done.
  const replay=question.dataset.replay==='true';
  if(i!==current||(solved>i&&!replay))return;
  const correct=Number(button.dataset.cityAnswer)===Number(question.dataset.answer);
  const stars=recordAnswer(question,Number(button.dataset.cityAnswer),correct,{lessonId:root.dataset.lessonId!,checkIndex:i,topicId:root.dataset.topicId as TopicId});
  if(correct)showStars(root,stars);
  if(!correct){
   get('feedback').textContent=es?'Probá otra vez. Mirá el ejemplo de arriba o pedile una pista a Átomo.':'Try again. Look at the example above or ask Átomo for a hint.';return;
  }
  if(replay){
   delete question.dataset.replay;question.querySelectorAll<HTMLButtonElement>('[data-city-answer]').forEach(b=>{b.disabled=true;});button.classList.add('is-correct');
   question.querySelector<HTMLElement>('[data-city-hint]')!.hidden=true;question.querySelector<HTMLElement>('[data-city-explanation]')!.hidden=false;
   get('feedback').textContent=es?'¡Muy bien!':'Well done!';return;
  }
  solved++;question.querySelectorAll<HTMLButtonElement>('[data-city-answer]').forEach(b=>{b.disabled=true;});button.classList.add('is-correct');
  question.querySelector<HTMLElement>('[data-city-hint]')!.hidden=true;
  question.querySelector<HTMLElement>('[data-city-explanation]')!.hidden=false;
  showReward(i);
  get('feedback').textContent=es?'¡Lo lograste! Mirá qué cambió en la casa.':'You did it! Look at what changed in the house.';
  get('next').hidden=solved===questions.length;get('finish').hidden=solved!==questions.length;render();
 })));
 get('next').addEventListener('click',()=>{
  if(solved!==current+1||current===questions.length-1)return;
  current++;questions.forEach((q,i)=>{q.hidden=i!==current;});get('next').hidden=true;showReward(null);get('feedback').textContent='';
  questions[current].querySelector<HTMLElement>('[data-city-question-title]')!.focus();
 });
 get('help').addEventListener('click',()=>{if(solved>current)return;questions[current].querySelector<HTMLElement>('[data-city-hint]')!.hidden=false;});
 // "New numbers": the same question with fresh numbers, always available.
 questions.forEach((question,i)=>question.querySelector<HTMLButtonElement>('[data-city-new-numbers]')?.addEventListener('click',()=>{
  if(i!==current)return;
  const title=question.querySelector<HTMLElement>('[data-city-question-title]')!;
  const hint=question.querySelector<HTMLElement>('[data-city-hint]')!,explanation=question.querySelector<HTMLElement>('[data-city-explanation]')!;
  const answers=[...question.querySelectorAll<HTMLButtonElement>('[data-city-answer]')];
  if(!applyNewNumbers(question,{title,answers,hint,explanation},es?'es-AR':'en-US'))return;
  if(solved>i)question.dataset.replay='true';
  answers.forEach(b=>{b.disabled=false;b.classList.remove('is-correct');});hint.hidden=true;explanation.hidden=true;
  // The tap-a-digit model belongs to the original number only.
  const model=question.querySelector<HTMLElement>('.city-place-model');if(model)model.hidden=true;
  get('feedback').textContent='';title.focus();
 }));
 get('reset').addEventListener('click',()=>{
  current=0;solved=0;questions.forEach((q,i)=>{delete q.dataset.replay;q.hidden=i!==0;q.querySelector<HTMLElement>('[data-city-hint]')!.hidden=true;q.querySelector<HTMLElement>('[data-city-explanation]')!.hidden=true;q.querySelectorAll<HTMLButtonElement>('[data-city-answer]').forEach(b=>{b.disabled=false;b.classList.remove('is-correct');});});
  ['next','finish'].forEach(name=>{get(name).hidden=true;});showReward(null);get('feedback').textContent='';
  root.querySelectorAll('[data-city-place]').forEach(b=>b.setAttribute('aria-pressed','false'));
  const place=root.querySelector('[data-city-place-result]');if(place)place.textContent='';
  render();questions[0].querySelector<HTMLElement>('[data-city-question-title]')!.focus();
 });
});

function revealHouseAnchor(){
 let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target?.closest('[data-city-map]'))return;
 let parent:HTMLElement|null=target;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
revealHouseAnchor();window.addEventListener('hashchange',revealHouseAnchor);
