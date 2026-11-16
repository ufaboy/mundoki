# Grade 6 — CABA primaria

39 micro-lessons across all 13 Grade 6 packages in `lesson-creation-plan.md` (three lessons per package), fully authored in es-AR and en-US. CABA primaria continues through Grade 7; this course is not labeled as primary graduation.

- `numbers.ts`: decimal place value, Roman notation comparison, powers of ten, divisibility, primes and common divisors/multiples (01–03).
- `rational.ts`: fractions as quotients, exact/approximate decimals, fractions of quantities, fractional scaling/division and decimal products/quotients (04–05).
- `proportions.ts`: direct/inverse proportionality with explicit assumptions, nonproportional examples, percentages, discounts and recovering a whole (06–08).
- `space.ts`: perimeter versus area, composite areas, counterexamples, scale and labeled plans (09–10).
- `data.ts`: chart choice, honest scales, mean as redistribution, limits of the mean, review and schoolyard project (11–13).
- `assessments.ts`: 65 new package checks plus 78 lesson questions: **143 bilingual checks**.
- `index.ts`: lessons, prerequisites including prior grades, and final project with adult-review rubric.

The `gradeSixLessons` collection and shared Astro route generate 78 localized pages. Each lesson includes objective, entry task, context, three worked steps, visual cards, misconception, two explained questions and an open drawing/explanation task. Suggested duration: 12–18 minutes; practical work may take longer. Negative-number content remains linked as optional exploration outside the 39 lessons.

Five interactive models cover divisors/common multiples, direct/inverse/fixed-charge relationships with tables and graphs, a percentage grid, rectangle perimeter/area and scale, and redistribution to the mean. Inputs are bounded. Graphs label variables and start axes at zero; continuous ribbon lengths are connected while discrete container counts are not. Scale dimensions are calculated rather than measured in screen centimeters.

The inherited package threshold (four of five including application and reasoning) is an editorial practice heuristic, not a validated diagnosis. Open work requires adult review. Review after 7–14 days is suggested rather than scheduled. Practice does not persist to game progress or award rewards. No new server generators or schema are included. CABA is the educational reference; official indicator-level alignment still requires primary-source verification and classroom review.

Validation: `npm run lint`, `npm test`, `npm run build:worker`. The Grade 6 suite checks coverage, translations, IDs, fresh prompts, prerequisite graph, routes, divisor/proportion/percentage/area/scale invariants and mean boundaries.

Local catalogs: http://localhost:3333/es-ar/matematicas/grado/6-grado/ and http://localhost:3333/en-us/mathematics/grade/grade-6/.
