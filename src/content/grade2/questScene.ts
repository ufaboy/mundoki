// Story state for the Grade 2 wizard quest, kept apart from the mission texts in
// wizardQuest.ts: the page script imports this, and must not bundle those texts.

/** Missions in the quest: 6 chapters × 6 missions (checked in premiumAccessSuite.ts). */
export const QUEST_MISSION_COUNT = 36;

/** Knots on each friend's spell: 6 missions × 2 challenges. */
export const KNOTS_PER_CHAPTER = 12;

/** Story state for mission `missionIndex` after `solved` challenges. Local to the page, not saved progress. */
export function questSceneState(missionIndex: number, solved: number) {
  const m = Math.max(0, Math.min(QUEST_MISSION_COUNT - 1, Math.floor(missionIndex)));
  const steps = Math.max(0, Math.min(2, Math.floor(solved)));
  const chapterIndex = Math.floor(m / 6);
  const untied = (m % 6) * 2 + steps;
  const friendFree = untied === KNOTS_PER_CHAPTER;
  return {
    chapterIndex,
    steps,
    untied,
    friendFree,
    /** Friends already free, in chapter order. */
    freedFriends: chapterIndex + (friendFree ? 1 : 0),
    wizardDefeated: m === QUEST_MISSION_COUNT - 1 && friendFree,
  };
}
