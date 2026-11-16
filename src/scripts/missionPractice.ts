// "New numbers" inside a mission question: swaps the question's numbers for a
// freshly generated exercise of the same kind, and counts every answer.
// Each world's own script owns the mission flow; it calls these helpers with
// the elements of its question.

import type { Locale, TopicId } from '../math/core/types';
import { generatePractice, isPracticeSkill, missionOptionIndices, PRACTICE_TOPIC, type PracticeExercise } from '../math/practice/generators';
import { recordMissionCheck, recordPracticeAnswer } from './missionProgress';

export interface QuestionParts {
  title: HTMLElement;
  /** The question's two answer buttons, in page order. */
  answers: HTMLElement[];
  hint: HTMLElement | null;
  explanation: HTMLElement | null;
}

function freshSeed(previous: number): number {
  let seed = previous;
  while (seed === previous) {
    seed = 1 + Math.floor(Math.random() * 2_000_000_000);
  }
  return seed;
}

/**
 * Rewrites the question with new numbers. The right answer's position goes to
 * `question.dataset.answer`, which the world's script already compares against.
 * Returns the new exercise (its `scene` lets a world redraw the picture), or
 * null when this question has no generator.
 */
export function applyNewNumbers(question: HTMLElement, parts: QuestionParts, locale: Locale): PracticeExercise | null {
  const skill = question.dataset.practiceSkill;
  if (!isPracticeSkill(skill) || parts.answers.length !== 2) return null;

  const exercise = generatePractice(skill, freshSeed(Number(question.dataset.practiceSeed) || 0));
  const shown = missionOptionIndices(exercise);

  parts.title.textContent = exercise.prompt[locale];
  parts.answers.forEach((button, position) => {
    button.textContent = exercise.options[shown[position]][locale];
  });
  if (parts.hint) parts.hint.textContent = exercise.hint[locale];
  if (parts.explanation) parts.explanation.textContent = exercise.explanation[locale];
  parts.answers[0].closest('[role="group"]')?.setAttribute('aria-label', exercise.prompt[locale]);

  question.dataset.answer = String(shown.indexOf(exercise.answerIndex));
  question.dataset.practiceSeed = String(exercise.seed);
  question.dataset.practiceShown = shown.join(',');
  delete question.dataset.practiceCounted;
  return exercise;
}

/**
 * Counts an answer towards the child's results. Returns the new star total, or
 * null when nothing was counted (a repeat of something already counted).
 */
export function recordAnswer(
  question: HTMLElement,
  chosenPosition: number,
  isCorrect: boolean,
  mission: { lessonId: string; checkIndex: number; topicId: TopicId }
): number | null {
  const skill = question.dataset.practiceSkill;
  const seed = Number(question.dataset.practiceSeed);

  if (seed && isPracticeSkill(skill)) {
    if (question.dataset.practiceCounted === 'true') return null;
    if (isCorrect) question.dataset.practiceCounted = 'true';
    const shown = (question.dataset.practiceShown ?? '').split(',').map(Number);
    return recordPracticeAnswer({
      skill,
      seed,
      optionIndex: shown[chosenPosition],
      isCorrect,
      topicId: PRACTICE_TOPIC[skill],
    });
  }

  if (!isCorrect) return null;
  return recordMissionCheck({ ...mission, optionIndex: chosenPosition });
}

/** Shows the star total next to the challenge once something has been counted. */
export function showStars(root: ParentNode, stars: number | null): void {
  if (stars === null) return;
  const chip = root.querySelector<HTMLElement>('[data-mission-stars]');
  const value = chip?.querySelector<HTMLElement>('[data-mission-stars-value]');
  if (!chip || !value) return;
  value.textContent = String(stars);
  chip.hidden = false;
  chip.classList.remove('mk-pop');
  void chip.offsetWidth; // restart the pop animation
  chip.classList.add('mk-pop');
}
