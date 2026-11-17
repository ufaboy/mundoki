// Client-safe twin of isFreeLesson (src/content/premiumAccess.ts): mission URLs end in
// the lesson id, e.g. /g03-02-l01/, and every grade's first chapter is package 01.
// Only used to show "Premium" badges; the server decides access on the mission page.
export const LOCKED_LESSON_PATH = /\/g0\d-(?!01-)\d{2}-l\d{2}\/?$/i;
