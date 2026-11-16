# Grade 2

Story: the hero frees six friends held by Wizard Embrollo; every correct answer unties one knot of his spell (`wizardQuest.ts`, scenario in `docs/grade-2-wizard-scenario.md`). Mission pages display the worked example and available hands-on model before the challenges. Route challenges also display their map beside the questions. `hints.ts` supplies 72 bilingual action hints; answer explanations appear separately after success. Restart clears both hints and explanations.

Implements all 13 Grade 2 packages in `lesson-creation-plan.md`: 36 micro-lessons, each fully authored in es-AR and en-US. Counts by package: 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 2.

- `numbers.ts`: numbers to 1,000, positional and alternative decompositions, scales and boundary crossings.
- `operations.ts`: additive stories, comparison and missing parts, mental methods, inverse checks, doubles and halves.
- `groups.ts`: equal groups, repeated addition, pack tables, sharing and grouping interpretations of division.
- `world.ts`: shape properties, routes, measurement tools, tables and pictographs, integrated tasks.
- `assessments.ts`: 65 new package questions, in addition to 72 guided lesson questions (137 total, each in both languages).
- `index.ts`: prerequisite links, including Grade 1 review, scene layout, and classroom-kit project with review rubric.

The shared Astro lesson route generates 72 Grade 2 pages. Existing Grade 1 URLs remain unchanged. Shared catalog rendering resolves prerequisite links across grades and keeps previous/next navigation within each grade. Content is validated through the `gradeTwoLessons` Astro collection.

Interactive models support numbers from 0 to 1,000, exchange of one hundred for ten tens, and equal-group construction/sharing/packing. Their exact integer invariants are tested. Small remainders are displayed explicitly instead of silently dropping objects; exact division remains the instructional focus. Visual blocks label their value and are schematic rather than geometrically to scale.

Every lesson includes an objective, entry activity, contextual problem, three worked steps, visual representation, common misconception, two practice questions, and an open explanation/drawing task. End-of-package checks use recognition, two procedures, application, and reasoning. The inherited practice threshold requires four of five correct, including the last two; it is an editorial practice heuristic, not a validated diagnostic.

Like Grade 1, responses are local to the page and do not save mastery; the story scene (knots, freed friends) is rebuilt from the mission number on each visit. No additional server exercise generators or progress schema are introduced. Open explanations and the project require adult review; later review after 7–14 days is suggested, not scheduled. Alignment remains editorial pending source verification and classroom review.

Required checks: `npm run lint`, `npm test`, `npm run build:worker`. The suite checks Grade 1 regressions, complete Grade 2 coverage, bilingual content, fresh assessment prompts, cross-grade dependency cycles, localized routes, and quantity conservation in the visual models.
