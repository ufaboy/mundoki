# Grade 3

Covers the 14 Grade 3 packages in `lesson-creation-plan.md`: **41 micro-lessons** (three per package, two in the final project package), fully authored in **es-AR and en-US**.

Numbers to 10,000; written addition and subtraction; multiplication facts; one-digit multiplication; division and remainders; calculation strategies; multistep problems; plans; shapes and solids; measurement; time; data; a school-trip project.

Each lesson includes an objective, entry activity, problem situation, visual cards, three worked steps, a misconception, two practice questions with explanations, and an open drawing/explanation task. There are **82 lesson questions + 70 new package questions = 152 bilingual checks**. Each five-question package check covers recognition, two procedures, application, and reasoning. The final project has an adult review rubric.

**Story (game layer):** the hero builds a house for the family — 8 chapters = 8 building stages, every correct answer adds one of 82 house pieces. Missions, rewards, and the epilogue live in `houseStory.ts`; the scene is `HouseScene.astro`, the page `HouseLesson.astro`, the map `HouseMap.astro`, the script `src/scripts/houseAdventure.ts` (state in `houseState.ts`). Lesson checks, worked examples, and hints are written in the same building-site world. Scenario: `docs/grade-3-house-scenario.md`; authoring rules and story map: `.agents/skills/grade-3-lesson-authoring/SKILL.md`.

The mission page shows its worked example before the challenges. Plans and symbol keys for G03-09 also appear beside the challenges as aligned grids. `hints.ts` supplies 82 bilingual action hints; the answer explanation appears only after a correct answer. Reset hides both hints and explanations. Questions explain coordinate notation where it is used, and use concrete objects and plain language for division, shape families, and survey totals. These editorial changes have not been tested with children.

`index.ts` defines lessons, prerequisites, and the final project. `assessments.ts` defines package checks. Content uses the `gradeThreeLessons` Astro collection and the shared school catalog and lesson route, generating **82 localized lesson pages**. Prerequisites link across grades; previous/next navigation stays in this grade.

Interactive models in `UpperPrimaryLab.astro` and `upperPrimaryLabs.ts` show proportional multiplication areas and exact division with remainders. Grade 4 additionally has equal-whole fraction strips, a hundred grid for decimals, and an angle model with independent ray-length and turn controls. Other constructions and data activities use diagrams and paper/object tasks, not a digital geometry editor. Suggested duration: 8–12 minutes; practical tasks may take longer.

The inherited four-out-of-five threshold, including application and reasoning, is an editorial practice heuristic, not a validated mastery diagnosis. Open work requires adult review. Curriculum alignment is editorial pending primary-source verification and classroom review; these pages do not claim official certification.

Validation: `npm run lint`, `npm test`, `npm run build:worker`. `upperPrimarySuite.ts` checks coverage, unique IDs, bilingual fields, prerequisite cycles, question structure, new assessment prompts, localized routes, and exhaustive fraction/product/division model invariants.

Local catalog: http://localhost:3333/es-ar/matematicas/grado/3-grado/ or http://localhost:3333/en-us/mathematics/grade/grade-3/.
