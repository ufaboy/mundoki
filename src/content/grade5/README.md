# Grade 5 — CABA primaria

38 micro-lessons in 13 packages from `lesson-creation-plan.md`, authored in es-AR and en-US. Packages 01–12 have three lessons each; package 13 has two. Grade 5 belongs to CABA primaria. English translates the same course; it does not switch educational systems.

- `calculation.ts`: natural-number strategies (01) and multistep modeling (09).
- `fractions.ts`: meanings, improper fractions, equivalence, comparison, addition and subtraction (02–05).
- `decimals.ts`: place value, comparisons, fraction connections, addition and subtraction (06–08).
- `world.ts`: quadrilateral properties, constructions/nets, measurements, precision, categorical/discrete data, mode, recipe and budget (10–13).
- `assessments.ts`: 65 fresh package questions; with 76 lesson questions, **141 bilingual checks**.
- `index.ts`: ordered catalog, prerequisite links, final project and adult-review rubric.

Every lesson includes an objective, warmup, contextual situation, three worked steps, schematic cards, a misconception, two guided checks with feedback, and an open drawing/explanation task. Suggested duration: 12–18 minutes; practical work can take longer. The shared route generates 76 localized pages.

Interactive models (`GradeFiveLab.astro`, `gradeFiveLabs.ts`, `gradeFiveModels.ts`) cover common fractional units, comparison and addition/subtraction including quantities above one; hundredths grids and exact decimal arithmetic; editable frequencies with one/multiple modes. Fractions use exact integer common-denominator calculations; decimals use integer hundredths. The model explicitly handles no data and uniform frequencies (no distinguished mode), and limits subtraction practice to nonnegative results. Construction and measurement tasks are performed with paper and instruments, not an online geometry editor.

Five-question package checks cover recognition, two procedures, application, and reasoning. The inherited four-out-of-five practice threshold (including application and reasoning) is an editorial heuristic, not a validated mastery diagnosis. Open responses require adult review; later review is suggested, not scheduled. Answers do not persist to game progress or award rewards. No backend generators or progress schema were added.

CABA is the project reference in `AGENTS.md`; content alignment remains editorial pending verification against specific curriculum indicators and classroom review. The catalog maps Grades 1–7 to primaria and Grades 8–12 to secondary years 1–5. Existing grade URLs are preserved; secondary navigation splits years 1–2 and 3–5 without claiming a separate US middle-school stage.

Validation: `npm run lint`, `npm test`, `npm run build:worker`. The Grade 5 suite covers package counts, translations, prerequisites, routes, unique questions, exact rational/decimal arithmetic, mode edge cases, and CABA grade mapping. Browser checks cover fraction addition, answer feedback, and a change from two modes to one.

Local previews: http://localhost:3333/es-ar/matematicas/grado/5-grado/ and http://localhost:3333/en-us/mathematics/grade/grade-5/.
