// Grade 1 world: "A day with {name}". The places of the day, the icon of every
// mission, and which missions already use the design-system lesson page.
// Story map and rules: .agents/skills/grade-1-lesson-authoring/SKILL.md
import { text } from './model';
import type { LocalizedText } from '../../math/core/types';
import { GRADE_ONE_LESSONS } from './index';
import { GRADE_ONE_ADVENTURES } from './adventures';

export interface DayPlace {
  id: 'home' | 'friends' | 'park' | 'garden' | 'return';
  icon: string;
  name: LocalizedText;
  line: LocalizedText;
  /** Lesson indexes [first, end) in GRADE_ONE_LESSONS. */
  range: [number, number];
}

export const DAY_PLACES: DayPlace[] = [
  { id: 'home', icon: '🏡', name: text('Nos preparamos|Getting ready'), line: text('Contamos lo que llevamos. ¡Nos vamos!|We count what we take. Let’s go!'), range: [0, 9] },
  { id: 'friends', icon: '👋', name: text('Con los amigos|Meet our friends'), line: text('Todos juntos, empieza la aventura.|Together, the adventure begins.'), range: [9, 11] },
  { id: 'park', icon: '🛝', name: text('¡A jugar!|Let’s play!'), line: text('Saltos, pelotas y una ciudad de juguete.|Hops, balls, and a tiny toy town.'), range: [11, 23] },
  { id: 'garden', icon: '🌳', name: text('Exploramos el jardín|Explore the garden'), line: text('Seguí el camino y plantá una semilla.|Follow the path and plant a seed.'), range: [23, 31] },
  { id: 'return', icon: '🏠', name: text('Volvemos a casa|Back home'), line: text('Revisamos que vuelva todo. ¡Y una foto!|We check that everything comes back. And a photo!'), range: [31, 35] },
];

/** One icon per mission, in lesson order. */
export const DAY_MISSION_ICONS = [
  '🎒', '🐚', '⭐', '🖍️', '🎁', '📦', '🎈', '📒', '☎',
  '👋', '⚑', '🐦', '🚗', '👟', '🚧', '★', '⚽', '🧺', '🔟', '📦', '⚑', '🐸', '♫',
  '🥛', '🌳', '△', '🎲', '🎀', '🌉', '🌱', '📅', '🧩', '📷', '📖', '🏠',
];

export function dayPlaceOf(lessonIndex: number): { place: DayPlace; number: number } {
  const number = DAY_PLACES.findIndex((place) => lessonIndex >= place.range[0] && lessonIndex < place.range[1]);
  return { place: DAY_PLACES[number], number: number + 1 };
}

export function dayMissionTitle(lessonIndex: number): LocalizedText {
  const lesson = GRADE_ONE_LESSONS[lessonIndex];
  return GRADE_ONE_ADVENTURES.find((adventure) => adventure.id === lesson.id)?.title ?? lesson.title;
}
