// When a Grade 1 chapter check counts as learned: at least 4 of 5 right, including
// the two "apply" and "explain" questions. Separate from assessments.ts so the
// browser script can use it without bundling every chapter's questions.
export function hasGradeOneEvidence(correct: boolean[]): boolean {
  return correct.length === 5 && correct.filter(Boolean).length >= 4 && correct[3] && correct[4];
}
