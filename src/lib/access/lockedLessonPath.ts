// Client-safe twin of isFreeLesson (src/content/premiumAccess.ts): mission URLs end in
// the lesson id, e.g. /g03-02-l01/, and every grade's first chapter is package 01.
// Only used to show "Premium" badges; the server decides access on the mission page.
// Grades 1–7 only: secundaria year pages render their own badges (content/secondary).
export const LOCKED_LESSON_PATH = /\/g0[1-7]-(?!01-)\d{2}-l\d{2}\/?$/i;
