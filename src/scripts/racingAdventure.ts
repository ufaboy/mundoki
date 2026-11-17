// Grade 6 Math Racing (RaceLesson.astro, RaceMap.astro): team look, answer
// checking, hints, race effects, and Chispa's progress along the track.
import {initialRaceState,answerRace,nextRace,raceStage,cleanRacePreferences,RACE_COLORS,RACE_EMBLEMS} from './raceState';
import {applyNewNumbers,recordAnswer,showStars} from './missionPractice';
import type {TopicId} from '../math/core/types';
const STORAGE_KEY='mundoki-race-style-v1';
document.querySelectorAll<HTMLElement>('[data-race-root]').forEach(root=>{
 const es=root.dataset.locale==='es-AR';
 const get=<T extends HTMLElement>(name:string)=>root.querySelector<T>(`[data-race-${name}]`)!;
 let preferences=cleanRacePreferences(null);
 try{preferences=cleanRacePreferences(JSON.parse(localStorage.getItem(STORAGE_KEY)??'null'));}catch{}
 const renderPreferences=()=>{
  root.style.setProperty('--race-paint',RACE_COLORS[preferences.color]);
  root.querySelectorAll('[data-race-emblem-display]').forEach(el=>{el.textContent=RACE_EMBLEMS[preferences.emblem];});
  root.querySelectorAll('[data-race-name-display]').forEach(el=>{el.textContent=preferences.name||'Escudería Pampa';});
  root.querySelectorAll<HTMLElement>('[data-race-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.raceColor===preferences.color)));
  root.querySelectorAll<HTMLElement>('[data-race-emblem]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.raceEmblem===preferences.emblem)));
 };
 const save=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(preferences));}catch{}};
 const nameInput=get<HTMLInputElement>('name');
 nameInput.value=preferences.name;renderPreferences();
 nameInput.addEventListener('input',()=>{preferences=cleanRacePreferences({...preferences,name:nameInput.value});renderPreferences();save();});
 root.querySelectorAll<HTMLElement>('[data-race-color]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanRacePreferences({...preferences,color:b.dataset.raceColor});renderPreferences();save();}));
 root.querySelectorAll<HTMLElement>('[data-race-emblem]').forEach(b=>b.addEventListener('click',()=>{preferences=cleanRacePreferences({...preferences,emblem:b.dataset.raceEmblem});renderPreferences();save();}));
 if(!root.hasAttribute('data-race-lesson'))return;
 const questions=[...root.querySelectorAll<HTMLElement>('[data-race-question]')];
 let state=initialRaceState(questions.length);
 const render=()=>{
  get('stage').dataset.phase=raceStage(state);
  root.querySelectorAll<HTMLElement>('[data-race-model]').forEach(model=>{model.dataset.solved=String(Number(model.closest<HTMLElement>('[data-race-question]')!.dataset.raceQuestion)<state.solved);});
  root.querySelectorAll('[data-race-power]').forEach((el,i)=>el.classList.toggle('is-done',i<state.solved));
  const podium=root.querySelector<HTMLElement>('[data-race-celebration]');if(podium)podium.hidden=state.solved!==state.count;
  // Garage: parts this mission installs light up once their challenge is solved.
  root.querySelectorAll<HTMLElement>('[data-race-part-question]').forEach(part=>{
   const done=Number(part.dataset.racePartQuestion)<state.solved;part.dataset.state=done?'installed':'incoming';
   root.querySelectorAll<HTMLElement>(`[data-race-part-item="${part.dataset.racePart}"]`).forEach(item=>{item.dataset.state=part.dataset.state!;});
  });
  const count=root.querySelector<HTMLElement>('[data-race-garage-count]');
  if(count)count.textContent=String(new Set([...root.querySelectorAll<HTMLElement>('[data-race-part][data-state="installed"]')].map(p=>p.dataset.racePart)).size);
  // Chapter duel: shown and played when the chapter's last mission is complete.
  const duel=root.querySelector<HTMLElement>('[data-race-duel]');
  if(duel){const show=state.solved===state.count;if(show&&duel.hidden)playDuel(duel);duel.hidden=!show;if(!show)duel.dataset.playing='false';}
 };
 const playDuel=(duel:HTMLElement)=>{duel.dataset.playing='false';void duel.offsetWidth;duel.dataset.playing='true';};
 root.querySelector<HTMLElement>('[data-race-duel-replay]')?.addEventListener('click',()=>playDuel(root.querySelector<HTMLElement>('[data-race-duel]')!));
 const finishQuestion=(q:HTMLElement,b:HTMLButtonElement)=>{
  q.querySelectorAll<HTMLButtonElement>('[data-race-answer]').forEach(button=>{button.disabled=true;});b.classList.add('is-correct');
  q.querySelector<HTMLElement>('[data-race-hint]')!.hidden=true;q.querySelector<HTMLElement>('[data-race-explanation]')!.hidden=false;
 };
 questions.forEach((q,i)=>q.querySelectorAll<HTMLButtonElement>('[data-race-answer]').forEach(b=>b.addEventListener('click',()=>{
  // After "new numbers" on a solved challenge the child may answer again: it counts, Chispa does not move twice.
  const replay=q.dataset.replay==='true';
  if(i!==state.current||(state.solved!==state.current&&!replay))return;
  const correct=Number(b.dataset.raceAnswer)===Number(q.dataset.answer);
  const stars=recordAnswer(q,Number(b.dataset.raceAnswer),correct,{lessonId:root.dataset.lessonId!,checkIndex:i,topicId:root.dataset.topicId as TopicId});
  if(!correct){get('feedback').textContent=es?'Probá otra vez. Chispa sigue en carrera: pedí una pista a Átomo.':'Try again. Chispa is still racing: ask Átomo for a hint.';return;}
  showStars(root,stars);
  finishQuestion(q,b);
  if(replay){delete q.dataset.replay;get('feedback').textContent=es?'¡Muy bien! Otra cuenta correcta para el equipo.':'Well done! Another correct calculation for the team.';return;}
  state=answerRace(state,i,true);
  // Generated numbers get a reward that names no story numbers.
  const source=q.dataset.practiceSeed?'[data-race-generated-reward]':'[data-race-reward-source]';
  get('reward').innerHTML=q.querySelector<HTMLElement>(source)!.innerHTML;get('reward').hidden=false;
  get('feedback').textContent=es?'¡Bien! Mirá qué ventaja ganó Chispa.':'Well done! See what advantage Chispa gained.';
  get('next').hidden=state.solved===state.count;get('finish').hidden=state.solved!==state.count;render();
 })));
 // "New numbers": the same challenge with fresh numbers, always available on the current challenge.
 questions.forEach((q,i)=>q.querySelector<HTMLButtonElement>('[data-race-new-numbers]')?.addEventListener('click',()=>{
  if(i!==state.current)return;
  const title=q.querySelector<HTMLElement>('[data-race-question-title]')!;
  const hint=q.querySelector<HTMLElement>('[data-race-hint]')!,explanation=q.querySelector<HTMLElement>('[data-race-explanation]')!;
  const answers=[...q.querySelectorAll<HTMLButtonElement>('[data-race-answer]')];
  if(!applyNewNumbers(q,{title,answers,hint,explanation},es?'es-AR':'en-US'))return;
  if(state.solved>i)q.dataset.replay='true';
  answers.forEach(b=>{b.disabled=false;b.classList.remove('is-correct');});hint.hidden=true;explanation.hidden=true;
  // The challenge-data figure shows the original numbers only.
  const model=q.querySelector<HTMLElement>('[data-race-model]');if(model)model.hidden=true;
  get('feedback').textContent='';title.focus();
 }));
 get('next').addEventListener('click',()=>{
  const updated=nextRace(state);if(updated===state)return;state=updated;
  questions.forEach((q,i)=>{q.hidden=i!==state.current;});get('next').hidden=true;get('reward').hidden=true;get('feedback').textContent='';
  questions[state.current].querySelector<HTMLElement>('[data-race-question-title]')!.focus();
 });
 get('help').addEventListener('click',()=>{if(state.solved!==state.current)return;questions[state.current].querySelector<HTMLElement>('[data-race-hint]')!.hidden=false;});
 get('reset').addEventListener('click',()=>{
  state=initialRaceState(questions.length);
  questions.forEach((q,i)=>{delete q.dataset.replay;q.hidden=i!==0;q.querySelector<HTMLElement>('[data-race-hint]')!.hidden=true;q.querySelector<HTMLElement>('[data-race-explanation]')!.hidden=true;q.querySelectorAll<HTMLButtonElement>('[data-race-answer]').forEach(b=>{b.disabled=false;b.classList.remove('is-correct');});});
  ['next','finish','reward'].forEach(name=>{get(name).hidden=true;});get('reward').textContent='';get('feedback').textContent='';render();
  questions[0].querySelector<HTMLElement>('[data-race-question-title]')!.focus();
 });
 render();
});
function revealRaceAnchor(){
 let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=id?document.getElementById(id):null;if(!target?.closest('[data-race-map]'))return;
 let parent:HTMLElement|null=target;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
revealRaceAnchor();window.addEventListener('hashchange',revealRaceAnchor);
