---
name: grade-3-lesson-authoring
description: Create, revise, or review Mundoki Grade 3 lessons and the Grade 3 story (the hero builds a house for the family; every correct answer adds one of 82 house pieces). Holds the story bible, the plain-language rules for 8–9-year-olds, and the lesson-by-lesson map that links each skill to the building step it drives. Use alongside the general lesson-authoring skill for any Grade 3 content.
metadata:
  short-description: Author Grade 3 house-building lessons
---

# Author Grade 3 lessons

Use this skill together with `.agents/skills/lesson-authoring/SKILL.md` (core rule, story contract, review checklist). Grade 3 is the third year of CABA primaria; numbers go up to about 10,000. The skills and their order come from the Grade 3 section of `docs/lesson-creation-plan.md` (packages G03-01 … G03-14, 41 lessons). The scenario with every scene, task, and its link to the Argentine Year 3 expectations is `docs/grade-3-house-scenario.md`. The English version translates the same course.

## Learner assumptions

- The child is 8–9, reads alone but may use read-aloud. Grade 2 gave place value to 1,000, mental addition and subtraction, and first meanings of multiplication and division. Grade 3 builds numbers to 10,000, written algorithms, multiplication facts and one-digit multiplication, division with remainders, strategies, plans, shapes and solids, length and mass, time, and data.
- Visible model first: bricks in **pallets of 1,000, stacks of 100, packs of 10, loose bricks** (es-AR: palé, pila, paquete, sueltos); brick walls as rows × columns; equal rows of roof tiles; tables of boxes.
- No two-option challenges: a child can pass them by pressing both buttons. Build Grade 3 challenges with `src/content/grade3/checks.ts`:
  - `entry(prompt, value, explanation, unit?)` when the answer is a number (whole numbers to 10,000) — the child types it on a number pad; the explanation must show the number;
  - `choice(prompt, correct, [wrong, wrong(, wrong)], explanation)` otherwise — 3–4 options, each wrong one a typical error (digit instead of its value, forgotten carry, smaller-from-larger subtraction, adding instead of multiplying, ignoring the remainder, confusing units). The page reshuffles the options on every attempt. No wrong option may be true in its own right.
- Every mission challenge has a **generator** in `src/content/grade3/variants/` (one file per building stage, builders in `kit.ts`). The mission page renders the authored challenge plus four generated versions; after a wrong answer the buttons pause, Rosa “writes the problem again with other numbers”, and the next version appears with its own hint open. A generator keeps the skill and the site object and changes the numbers; in “why” and “what does it count” questions it must also change **which** option is right (another number, a true and a false case, another context), so remembering a wrong button never helps. Each version brings its own `hint`, an explanation that shows a typed answer, and its own `reward` when the mission reward names the authored numbers. Versions use the same numbers in both languages and stay within 10,000; `gradeThreeSuite.ts` checks this over 400 seeds per generator. When you change an authored challenge, change its generator in the same edit.
- A correct answer is counted once per mission challenge. The page sends the shown version’s seed; the server rebuilds that version to check the answer (`src/lib/server/missionAttempts.ts`), so a generator must stay deterministic for a seed.

## Plain language for 8–9-year-olds (mandatory)

- Short sentences: one idea each, about 12–14 words at most.
- First the situation, then one question.
- Familiar words: ladrillo, pila, paquete, pared, techo, chapa, teja, caño, cinta métrica, balanza.
- A number always comes with its object or unit: «457 bloques», «46 cm».
- “Why” answers are one short sentence in the child’s words.
- es-AR uses voseo (mirá, calculá, fijate, probá).

## Story bible

**Premise.** The hero’s family has bought an empty lot in a Buenos Aires neighbourhood. They build their own house and move in; the epilogue is the housewarming party. **No villain**: tension comes from the site itself (deliveries, materials running out, rain on Friday, moving day).

**Characters.**
- `{name}`: the chosen hero (Tomi or Lola). Decides on the site; the learner does the maths.
- Rosa, *maestra mayor de obras* (site manager): runs the site, keeps the *libreta de obra* (site notebook).
- Átomo, the robot fox: hints only (`hints.ts`); sometimes makes a typical mistake on purpose for the child to find.
- Abuela Tita: will live in the house; wants a lemon tree; has her own calculation tricks.
- Canela, the puppy: comic soft obstacle (hides screws, paw prints in the concrete); never causes real damage.
- The family appears as «la familia de {name}», without fixed parents’ roles.

**Progress.** Each correct answer adds one piece of the house (`HouseScene.astro`, 82 pieces). Chapters are building stages. Do not keep running totals across lessons: every lesson states all its quantities. Prices are not needed; if any appear, they are play money.

## Writing for the chosen hero

- `{name}` may appear **only** in mission introductions, rewards, and the epilogue (`houseStory.ts`), rendered through `HeroText`. Lessons, prompts, options, explanations, and hints never use `{name}`; `houseAdventureSuite.ts` enforces this.
- `text()` splits on the first `|`, so do not use `{masculine|feminine}`. Write gender-neutral Spanish around the name: «{name} revisa el pedido», not «{name} está listo».

## Where Grade 3 content lives

- Lessons: `src/content/grade3/numbers.ts` (G03-01…03), `products.ts` (G03-04…06), `strategies.ts` (G03-07…08), `space.ts` (G03-09…10), `measurement.ts` (G03-11…14). Project and packages: `index.ts`.
- Hints, one per check: `src/content/grade3/hints.ts`.
- Missions, rewards (`rewards[i]` after `checks[i]`), chapters, epilogue: `src/content/grade3/houseStory.ts`. Mission order must match the 41 lessons; a chapter never splits a package.
- Pages: `HouseMap.astro` (grade map), `HouseLesson.astro` (mission page and epilogue), `HouseScene.astro` (house pieces), `HouseChoices.astro`; script `src/scripts/houseAdventure.ts`, state `src/scripts/houseState.ts`. CSS classes keep the shared `city-*` names used by other primary worlds.
- Challenge builders `entry()`, `choice()`: `src/content/grade3/checks.ts`. Generators, one per mission challenge: `src/content/grade3/variants/`. Grade 3 pages no longer show the shared “new numbers” button; generated versions replace it.
- Package checks: `assessments.ts` (outside the story; prompts must differ from lesson checks).
- Tests: `src/tests/houseAdventureSuite.ts`, `src/tests/upperPrimarySuite.ts`, `src/tests/gradeThreeSuite.ts` (formats and generators), `src/tests/missionProgress.ts` (server re-check of versions).

## Lesson-by-lesson story map

Each row: scene, then check 1 → result, check 2 → result. The value after «/» is the main typical error among the options.

| Ch. / stage | Lesson | Scene | Check 1 → result | Check 2 → result |
|---|---|---|---|---|
| 1 Lot & supply yard | G03-01-L01 | Bricks in pallets/stacks/packs; ex. 2,346 | 3,528: what the 5 is worth (500 / 50) → 5 stacks reserved | why 10 stacks = 1 pallet → first pallet |
| | G03-01-L02 | Phone order; ex. 5,072 vs 5,702 | «ocho mil nueve» (8009 / 8090) → order form right | why 9,000 > 8,999 → order complete |
| | G03-01-L03 | Pallet split into stacks; ex. 3,405 | 4,512 = 3000 + 1500 + 12 (/ + 500) → note signed | 6000 + 230 = 5000 + 1230 → tiles accepted |
| 2 Foundation | G03-02-L01 | Trench blocks; ex. 243 + 125 | 421 + 36 (457 / 781) → blocks carried | why ones under ones → trench lined |
| | G03-02-L02 | Mixer buckets; ex. 276 + 148 | 185 + 237 (422 / 412) → mixer loaded | carried 1 = ten ones → concrete poured |
| | G03-02-L03 | 1,000 L tank; ex. 398 + 205 | 602 + 197 ≈ 800 (/ 400) → tank enough | why also check exactly → 799 L noted |
| | G03-03-L01 | Iron rods in bundles; ex. 52 − 17 | 61 − 35 (26 / 34) → rods for columns | why not smaller-from-larger → count trusted |
| | G03-03-L02 | Blocks left; ex. 400 − 128 | 503 − 286 (217 / 283) → blocks for walls | 700 = 600 + 90 + 10 → hose off in time |
| | G03-03-L03 | Rosa’s notebook; ex. 500 − 180 | check 900 − 275 with 625 + 275 → tick | mismatch: check both → **floor dry**, paw prints |
| 3 Walls | G03-04-L01 | Wall rows; ex. 5 × 6 | glass window 7 × 4 (28 / 11) → window | rows × columns needs a full rectangle → gap filled |
| | G03-04-L02 | Turned drawing; ex. 3 × 5 = 5 × 3 | 8 × 6 = 48 (/ 14) → order same | 8 − 3 ≠ 3 − 8 (frames) → notebook right |
| | G03-04-L03 | One more row; ex. 4 × 6 from 3 × 6 | 6 × 7 from 35 (42 / 36) → window height | 8 × 4 = double 4 × 4 → children’s room |
| | G03-05-L01 | Front wall split; ex. 4 × 13 | 3 × 24 (72 / 64) → up to the door | don’t double-count → exact bricks ordered |
| | G03-05-L02 | Walls in parts; ex. 25 × 4 | 48 × 3 = 40 × 3 + 8 × 3 (/ + 8) → bedroom | 36 × 4 via 30 + 6 or 20 + 16 → kitchen |
| | G03-05-L03 | Written; ex. 26 × 3 | 47 × 3 (141 / 121) → last wall | carried 2 = two tens → **walls up** |
| 4 Roof before rain | G03-06-L01 | Roof sheets; ex. 20 ÷ 4 | 36 ÷ 9 (4 / 27) → first side | check 42 screws ÷ 6 by multiplying → boxes |
| | G03-06-L02 | Porch tiles; ex. 24 tiles two ways | 48 tiles, 6 per row: 8 = rows (/ per row) → rows chalked | in 32 ÷ 4 the 4 = workers → hammering |
| | G03-06-L03 | Leftovers; ex. 17 ÷ 5 | 34 ÷ 6 = 5 r 4 (/ 4 r 10) → dog-house roof | 23 rolls, 5 per trip: 5 trips → **roof closed in the rain** |
| 5 Water, light, colour | G03-07-L01 | Cables; ex. 199 + 45 | 99 + 27 (126 / 127) → cable cut | 398 + 25 = 400 + 23 → lights on |
| | G03-07-L02 | 300 m roll; ex. 31 × 4 | 49 × 6 ≈ 300 (/ 3000) → roll looks right | estimate is above → one roll enough |
| | G03-07-L03 | Bathroom; ex. 300 − 98 | 400 − 99 (301 / 299) → water runs | Tita’s 500 − 200 + 2 → wall tiled |
| | G03-08-L01 | Tile boxes; ex. 30 ÷ 5, 30 − 12 | boxes = 84 ÷ 7 (/ 84 + 7) → boxes counted | 6 × 24 = tiles in all → order placed |
| | G03-08-L02 | Shelves; ex. 3 × 10 − 6, ÷ 4 | 5 × 10 − 8, ÷ 6 (7 / 8) → screws per shelf | why units at each step → shelves up |
| | G03-08-L03 | Box table; ex. boxes of 6 | 9 per box: 8 boxes (72 / 40) → hall floor | add rows only with equal boxes → **water, light, tiles** |
| 6 House plan | G03-09-L01 | Plan of the current room | view from above (/ from the front) → plan | door as landmark → movers can read it |
| | G03-09-L02 | Garden plan key | ■ = closed area, wet paint (/ free) → room marked | shapes, not only colours → b/w print |
| | G03-09-L03 | Sofa route ★ → M | route through ■ is wrong (/ “ends at M”) → paint avoided | two routes can both be right → route ready |
| | G03-10-L01 | Window cards | square is a rectangle (/ one family only) → frames ordered | turned triangle keeps 3 sides → attic window |
| | G03-10-L02 | Dog-house pyramid; ex. 5 / 8 / 5 | box vertices 8 (/ 6 faces) → corner protectors | hidden faces count → boxes labelled |
| | G03-10-L03 | Tile order; ex. square 3 cm | width missing (/ pencil colour) → plate cut | turned plate still matches → **plate on the mailbox** |
| 7 Moving day | G03-11-L01 | Tape and scale; ex. 2 m, 25 kg | 3 m = 300 cm (/ 30) → carpet fits | why write the unit (kg) → heavy box known |
| | G03-11-L02 | Washing-machine gap; ex. 80 vs 78 | 50 − 46 = 4 cm (/ 96) → real measure on plan | why estimate first → better estimates |
| | G03-11-L03 | Bed; ex. 1 m 25 cm = 125 cm | 2 m > 150 cm (/ 150 cm) → longer wall | 200 cm = 2 m → bed in place |
| | G03-12-L01 | Kitchen clock; ex. 3:15 | long hand on 9 = 45 (/ 9) → ready for the truck | at 7:30 short hand between 7 and 8 → alarm set |
| | G03-12-L02 | Loading; ex. 9:45–10:05 | 11:50–12:20 = 30 min (/ 70) → lunch on time | 1 h 15 min ≠ 115 min → timetable right |
| | G03-12-L03 | Fridge calendar; ex. Fri 3 + 7 | Tue 6 + 7 = Tue 13 (/ Mon 12) → invitations | month length matters → **first night** |
| 8 Housewarming | G03-13-L01 | Gate colour survey; ex. 5 people | 8 relatives → 8 answers (/ 24) → survey sheet | same question for all → answers collected |
| | G03-13-L02 | Gate votes 4/2/1 | empanadas 6 + 3 + 2 = 11 (/ 9) → bar chart | keep the filling name → chart readable |
| | G03-13-L03 | Door colour 6 of 10 | lemon 4 of 10 is not > half (/ yes) → talk again | family ≠ neighbours → tree planted |
| | G03-14-L01 | Practice: 46 guests, vans of 15 | 65 guests, vans of 20 → 4 (/ 3) → vans booked | leftover guests need seats → everyone arrives |
| | G03-14-L02 | 5 trays × 29 two ways | 48 × 7 = 50 × 7 − 2 × 7 (/ − 2) → empanadas counted | choose the clearer correct method → **ribbon cut**, epilogue |

## Grade 3 checks before finishing

- Each mission introduction states the goal; each `rewards[i]` names what the answer of `checks[i]` made possible.
- The worked example sits in the same site but uses different numbers and never reveals a challenge answer.
- Hints talk about the site objects (bricks, buckets, rods, tiles, cables) and point to the next action.
- Numbers stay within 10,000; mental work uses friendly numbers.
- Plain-language rules are met in both locales.
- Run `npm run lint` and `npm test`; open a mission page in both locales.
