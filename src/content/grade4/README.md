# Grade 4

Covers the 14 Grade 4 packages in `lesson-creation-plan.md`: **41 micro-lessons** (three per package, two in the final project package), fully authored in **es-AR and en-US**.

Large numbers; multistep problems; written multiplication and division; mental, written, and calculator strategies; common fractions and equivalence; tenths and hundredths; units; angles; triangles; shapes and nets; tables and charts; a school-purchase project.

Each lesson includes an objective, entry activity, problem situation, visual cards, three worked steps, a misconception, two practice questions with explanations, and an open drawing/explanation task. There are **82 lesson questions + 70 new package questions = 152 bilingual checks**. Each five-question package check covers recognition, two procedures, application, and reasoning. The final project has an adult review rubric.

Lessons are missions of the plane story «La Golondrina» (`planeAdventure.ts`, scenario in `docs/grade-4-plane-scenario.md`); all 41 lessons are story-integrated missions. Lessons show their worked examples before the challenges. `hints.ts` provides 82 bilingual action hints, separate from explanations shown after correct answers; replay hides both. `IslandWorkedDiagram.astro` adds triangle classification cards, a compass construction diagram, and a bar chart with labeled axes and a uniform scale. Practical constructions still require paper and tools. These editorial improvements have not been tested with children.

`index.ts` defines lessons, prerequisites, and the final project. `assessments.ts` defines package checks. Content uses the `gradeFourLessons` Astro collection and the shared school catalog and lesson route, generating **82 localized lesson pages**. Prerequisites link across grades; previous/next navigation stays in this grade.

Interactive models in `UpperPrimaryLab.astro` and `upperPrimaryLabs.ts` show proportional multiplication areas and exact division with remainders. Grade 4 additionally has equal-whole fraction strips, a hundred grid for decimals, and an angle model with independent ray-length and turn controls. Other constructions and data activities use diagrams and paper/object tasks, not a digital geometry editor. Suggested duration: 12–18 minutes; practical tasks may take longer.

The inherited four-out-of-five threshold, including application and reasoning, is an editorial practice heuristic, not a validated mastery diagnosis. Answers stay on the page: no game rewards, persisted progress, automatic review scheduling, or server exercise generators are added. Open work requires adult review. Curriculum alignment is editorial pending primary-source verification and classroom review; these pages do not claim official certification.

Validation: `npm run lint`, `npm test`, `npm run build:worker`. `upperPrimarySuite.ts` checks coverage, unique IDs, bilingual fields, prerequisite cycles, question structure, new assessment prompts, localized routes, and exhaustive fraction/product/division model invariants.

Local catalog: http://localhost:3333/es-ar/matematicas/grado/4-grado/ or http://localhost:3333/en-us/mathematics/grade/grade-4/.
