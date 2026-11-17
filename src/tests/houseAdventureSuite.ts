import assert from 'node:assert/strict';
import { HOUSE_CHAPTERS, HOUSE_MISSIONS, HOUSE_EPILOGUE, HOUSE_PIECES, houseChapterAt } from '../content/grade3/houseStory';
import { GRADE_THREE_LESSONS } from '../content/grade3';
import { getGradeThreeHints } from '../content/grade3/hints';
import { houseSceneState, housePieceVisible, cleanHousePreferences, HOUSE_TOTAL_PIECES } from '../scripts/houseState';

export function runHouseAdventureTests() {
  assert.equal(HOUSE_CHAPTERS.length, 8, 'Eight building stages');
  assert.deepEqual(HOUSE_MISSIONS.map(m => m.id), GRADE_THREE_LESSONS.map(l => l.id), 'All 41 lessons have exactly one ordered house mission');
  assert.equal(HOUSE_PIECES, 82);
  assert.equal(HOUSE_TOTAL_PIECES, HOUSE_PIECES);
  assert.deepEqual(HOUSE_CHAPTERS.map(c => c.missions.length), [3, 6, 6, 3, 6, 6, 6, 5]);
  for (const [i, chapter] of HOUSE_CHAPTERS.entries()) {
    assert.equal(chapter.start, i === 0 ? 0 : HOUSE_CHAPTERS[i - 1].end, 'Chapters follow each other');
    assert.equal(chapter.end - chapter.start, chapter.missions.length);
    // A chapter never splits a curriculum package.
    const packages = new Set(chapter.missions.map(m => m.id.slice(0, 6)));
    for (const pack of packages) assert(GRADE_THREE_LESSONS.filter(l => l.packageId === pack).every(l => chapter.missions.some(m => m.id === l.id)), `${pack} stays in one chapter`);
    for (let index = chapter.start; index < chapter.end; index++) assert.equal(houseChapterAt(index), chapter);
  }
  const story = [HOUSE_EPILOGUE, ...HOUSE_CHAPTERS.flatMap(c => [c.title, c.stage]), ...HOUSE_MISSIONS.flatMap(m => [m.title, m.introduction, ...m.rewards])];
  for (const value of story) for (const locale of ['es-AR', 'en-US'] as const) {
    assert(value[locale].trim()); assert(!value[locale].includes('|')); assert(!/[Ѐ-ӿ]/u.test(value[locale]));
  }
  for (const mission of HOUSE_MISSIONS) {
    assert.equal(mission.rewards.length, 2);
    assert(!mission.title['es-AR'].includes('{name}'), 'Titles are shown outside HeroText');
  }
  // {name} is personalized only in story texts rendered through HeroText.
  for (const lesson of GRADE_THREE_LESSONS) {
    const hints = getGradeThreeHints(lesson.id);
    for (const value of [lesson.title, lesson.story, lesson.scene.caption, lesson.misconception, ...lesson.steps, ...hints, ...lesson.checks.flatMap(c => [c.prompt, c.explanation, ...c.options])])
      for (const locale of ['es-AR', 'en-US'] as const) assert(!value[locale].includes('{'), `Lesson text is not personalized: ${lesson.id}`);
  }
  assert.equal(houseSceneState(0, 0).pieces, 0);
  assert.equal(houseSceneState(40, 1).complete, false);
  assert.deepEqual(houseSceneState(40, 2), { steps: 2, pieces: 82, complete: true });
  for (let i = 0; i < 41; i++) {
    const a = houseSceneState(i, 0), b = houseSceneState(i, 1), c = houseSceneState(i, 2);
    assert.equal(b.pieces, a.pieces + 1); assert.equal(c.pieces, b.pieces + 1);
    if (i < 40) assert.equal(c.pieces, houseSceneState(i + 1, 0).pieces, 'The house continues into the next mission');
  }
  assert.deepEqual(houseSceneState(NaN, NaN), houseSceneState(0, 0));
  assert.deepEqual(houseSceneState(99, 9), houseSceneState(40, 2));
  assert(housePieceVisible(5, 5)); assert(!housePieceVisible(6, 5));
  assert(housePieceVisible(1, 30, 31)); assert(!housePieceVisible(1, 31, 31), 'Materials are used up');
  assert.deepEqual(cleanHousePreferences(null), { name: '', color: 'terracotta' });
  assert.deepEqual(cleanHousePreferences({ name: '  Casa Limón  ', color: 'blue' }), { name: 'Casa Limón', color: 'blue' });
  assert.equal(cleanHousePreferences({ name: 'x'.repeat(200), color: 'invalid' }).name.length, 24);
  assert.equal(cleanHousePreferences({ name: 42, color: 'invalid' }).color, 'terracotta');
  console.log('PASS [House adventure] 41 bilingual missions in 8 building stages, 82 house pieces, hero-only story text, and validated preferences');
}
