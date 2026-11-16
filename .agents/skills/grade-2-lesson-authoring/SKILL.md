---
name: grade-2-lesson-authoring
description: Create, revise, or review Mundoki Grade 2 lessons and the Grade 2 road-trip story (buy a car with play coins, repair and upgrade it, cross on a ferry, explore an island, deliver kits to the island school). Holds the story bible and the lesson-by-lesson map that links each skill to the story decision it drives. Use alongside the general lesson-authoring skill for any Grade 2 content.
metadata:
  short-description: Author Grade 2 road-trip lessons
---

# Author Grade 2 lessons

Use this skill together with `.agents/skills/lesson-authoring/SKILL.md` (core rule, story contract, review checklist). Grade 2 is the second year of CABA primaria; numbers go up to about 1,000. The skills and their order come from the Grade 2 section of `docs/lesson-creation-plan.md` (packages G02-01 … G02-13). The English version translates the same course.

## Learner assumptions

- The child reads short sentences but may still use read-aloud. One idea per sentence, one instruction per step, concrete words.
- Grade 1 gave counting, numbers to 100, joining and taking away, and halves of small quantities. Grade 2 builds place value to 1,000, mental strategies, and first meanings of multiplication and division.
- Keep the visible model first: boxes of 100, packs of 10, and loose units; number lines; bar models; equal groups. Then the number sentence.
- Keep two answer options per challenge (`check()` in `src/content/lessonModel.ts`); the wrong option must show a typical error (digit value instead of place value, wrong operation, unequal parts).

## Story bible

**Premise.** In the Mundoki world, the island school *Escuela del Muelle* has asked for classroom kits. The chosen hero `{name}` (Tomi or Lola) and Tía Marta, a mechanic, decide to take them there. They need a car: they buy an old one with saved **monedas Mundoki** (play coins), repair it, upgrade it, load it, cross on a ferry, find the way across the island, and deliver the kits.

**Characters.**
- `{name}`: the child hero the learner chose. Makes the decisions; the learner helps by doing the math.
- Tía Marta: the grown-up. She drives (children never drive), handles tools, and asks the questions that need an answer. Use "Tía Marta / Aunt Marta".
- Átomo, the robot fox: gives hints only (`hints.ts`), never the answer.
- Minor roles as needed: the car seller, the ferry worker, the island teacher, island children.

**Money.** Prices are in monedas Mundoki. A **caja** holds 100 coins, a **paquete** holds 10, and coins can be **sueltas** (loose) — the same model as hundreds, tens, and ones. Purchases are fictional. Do not keep a running balance across lessons: every lesson states all the quantities it uses, and a later lesson never depends on an amount "left over" from an earlier one unless that lesson repeats it.

**Car.** A small white second-hand car priced **619 coins** (chosen in G02-01-L03, paid in G02-02). Later a van joins it (G02-12-L01). Keep the white car and its price consistent wherever they appear.

**Tone.** Warm, practical, a little adventurous. Problems come from real needs of the trip (a price to read, a part to count, cargo to share), not from tests invented for their own sake.

## Writing for the chosen hero

- Write `{name}` where the hero acts. The app fills it with `personalize()` from `src/content/heroes.ts`.
- `text()` in `lessonModel.ts` splits on the first `|` into es-AR and en-US, so **do not use** the `{masculine|feminine}` form inside lesson or mission strings. Write gender-neutral Spanish around the name: "{name} mira el precio", "{name} tiene que elegir", not "{name} está listo". In English, repeat the name instead of using he/she.
- Prerequisite in code: `RoadTripLesson.astro` must render mission introductions, rewards, check prompts, explanations, hints, and the worked example through `HeroText` (`src/components/shared/HeroText.astro`) so `{name}` is replaced. If it does not yet, make that change first, or "{name}" will appear literally on the page.

## Where Grade 2 content lives

- Lessons (worked example `story`, `steps`, `scene`, `misconception`, `checks`): `src/content/grade2/numbers.ts` (G02-01…03), `operations.ts` (G02-04…06), `groups.ts` (G02-07…08), `world.ts` (G02-09…13).
- Hints, two per lesson, one per check: `src/content/grade2/hints.ts`.
- Missions (title, introduction, `rewards[i]` shown after `checks[i]`) and chapters: `src/content/grade2/roadTrip.ts`. `ROAD_MISSIONS` order must stay aligned with the 36 lessons; `ROAD_CHAPTERS` and `roadSceneState()` use mission indices for scenes (shop 0–5, repair 6–11, upgrade 12–17, harbor 18–20, ferry 21–23, island 24–29, bridge at 29, delivery 30–35). Keep those boundaries unless you also update the scene logic and its test.
- Package checks: `src/content/grade2/assessments.ts` — practice outside the story; any context; prompts must differ from lesson checks.
- Tests: `src/tests/gradeTwoSuite.ts` (one hint per check, hints differ from explanations, both locales, fresh assessment prompts).

## Lesson-by-lesson story map

For each lesson: the **need** (why the characters need math), what each **check** decides, and the **reward** that shows the result. Suggested numbers keep the current checks' range and difficulty; you may change them if the difficulty stays the same and every related string (example, hint, explanation, reward) changes with them. The worked example is always a different case in the same scene.

### Chapter 1 — Compramos un auto (shop: G02-01, G02-02)

| Lesson | Need | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-01-L01 Hundreds, tens, ones | At the car lot, price tags show coins as boxes, packs, and loose coins. {name} copies each price onto a shopping card. Example: red car = 2 boxes, 4 packs, 3 loose = 243. | Blue car tag 461: what is the 6 worth? (60) → the blue car's price goes on the card as 400 + 60 + 1. | Green car tag 222: why is each 2 worth something different? → the green car's price is on the card; the card is ready. |
| G02-01-L02 Reading and writing to 1,000 | The seller says some prices aloud; {name} writes them as numerals. Example: "cuatrocientos seis" → 406. | Seller says "novecientos treinta" for the big truck → 930. Result: written on the card; too big for this trip, crossed out. | Yellow car tag 507: what does the zero show? (no loose packs) → Tía Marta notes that it is paid with 5 boxes and 7 loose coins. |
| G02-01-L03 Comparing | Two white cars remain; they choose the cheaper one so coins remain for repairs. Example: 368 vs 386 on the number line. | 619 or 691: which is greater? → they pick the white car at **619**. | The seller says every car here costs less than 700. Why is 699 less than 700? → the choice fits the 700 coins they saved. |
| G02-02-L01 Taking a number apart | {name} fills the payment envelope. Example: 347 coins → 3 boxes, 4 packs, 7 loose. | Which sum is 619? (600 + 10 + 9) → envelope: 6 boxes, 1 pack, 9 loose. | The number plate costs 304: why 300 + 4? (no packs) → the plate is paid without opening a pack. |
| G02-02-L02 Exchanging a hundred | The parking machine at the lot only takes packs of 10, so they exchange a box at the counter. Example: open one box of 100 → 10 packs. | How many tens equal one hundred? → they get 10 packs for one box. | The envelope changed from 300 + 50 to 200 + 150. Why is it still 350? → nothing lost; the machine accepts the packs. |
| G02-02-L03 Two ways to write a number | Seller's receipt and {name}'s envelope are written differently; they must match before the keys are handed over. Example: 347 = 300 + 40 + 7 = 200 + 140 + 7. | Receipt says 619 = 600 + 10 + 9; which envelope matches? (500 + 110 + 9) → the payment matches. | Is 500 + 20 + 8 equal to 400 + 120 + 8 (the plate and papers)? → yes, 528; the keys are handed over. Ends chapter: off to the workshop. |

### Chapter 2 — Lo reparamos (repair: G02-03, G02-04)

| Lesson | Need | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-03-L01 Jumps of 10 and 100 | Tía Marta tests the trip counter: each long lap of the block adds 100 m, each short lap adds 10 m. If the counter shows the predicted number, it works. Example: from 125 by tens and by hundreds. | 360, 460, 560 → next long lap? (660) → the counter shows 660: it works. | Why does 275 become 285 after a short lap? → the short-lap count works too; dashboard repaired. |
| G02-03-L02 Steps of 20 and 50 | Charging the battery: the charger adds 50 points each time; full is 300. A new cable is sold in 20 cm pieces. Example: 20, 40 … 100 and 50, 100 … 200. | 150, 200, 250 → next? (300) → the battery is full. | Why do 5 pieces of 20 cm make 100 cm, the cable length needed? → the cable reaches; the battery works. |
| G02-03-L03 10 or 100 more and less | The workshop storeroom numbers its boxes in steps of 10. Bulbs for the headlights are in specific boxes. Example: 347 → 447 and 337. | The bulb is 10 boxes before box 208 → 198. Result: first bulb found, first headlight on. | The second bulb is 10 after box 99. Why is it not 100? (109) → second headlight on. |
| G02-04-L01 Joining and changing | Fixing the wheels needs bolts. Example: a box of 23 and a box of 15 vs 23 then 15 more arrive. | There were 42 bolts and 12 were used on the first wheels. How many remain? (30) → enough for the rest; first wheels done. | Why can both bolt stories use 23 + 15? → Tía Marta joins the two boxes; wheels repaired. |
| G02-04-L02 Comparing: how many more | Window clips: the driver window needs more clips than the small rear window. Example: 36 vs 24 on two bars. | Driver window 27 clips, rear 19. How many more for the driver window? (8) → 8 extra clips in its tray. | Which question would 27 + 19 answer? → how many clips for both windows together; windows repaired. Use the chosen numbers consistently in the option text. |
| G02-04-L03 The missing part | The engine cover needs 60 screws; some are already in. Example: 50 = 32 + ?. | 46 of 60 screws are in. How many are missing? (14) → the last screws go in. | How do we check a missing part? (join it with the known part) → 46 + 14 = 60; the car comes down from the lift. |

### Chapter 3 — Mejoramos el auto (upgrade: G02-05, G02-06)

| Lesson | Need | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-05-L01 Convenient sums | The paint shop mixes cups of blue and white for a light-blue car; the mixer must be set to the total. Example: 34 + 25 split into tens and ones. | 52 + 36 cups? (88) → mixer set; first coat on. | Why can 41 + 28 be done as 41 + 20 + 8 (second coat)? → second coat on; the car is light blue. |
| G02-05-L02 Crossing a ten | {name} decorates a stripe with star stickers. Example: 28 + 7 through 30; 42 − 6 through 40. | The stripe has 36 stars; 8 more go on. How many? (44) → stripe finished on the hood. | A sheet had 51 stars; 6 used. Why compute 51 − 1 − 5? → the sheet count is updated; decoration complete. |
| G02-05-L03 Checking by undoing | Before leaving, Tía Marta checks the fuel notes. Example: 63 − 27 = 36, check with 36 + 27. | The tank had 72 L, the test drive used 28, the note says 44. Which calculation checks it? (44 + 28 = 72) → note confirmed. | Another note says 54 − 16 = 30, but 30 + 16 = 46. What does that show? → they correct the note before leaving; engine ready. |
| G02-06-L01 Doubles | New side mirrors: both sides get the same number of screws. Example: 12 cards for each of two teams. | Each mirror takes 16 screws; two mirrors? (32) → both mirrors fitted. | The right mirror got 9 screws and the left 8. Why is 8 + 9 not double 8? → they fix the right one; mirrors equal. |
| G02-06-L02 Halves | The first kits for the island arrive. Half go in the new roof box, half in the trunk, to keep the car balanced. Example: 18 bags shared between two places. | 30 kit bags, half in each place? (15) → the roof box is loaded. | Why are 7 and 13 not halves of 20 (water bottles)? → bottles moved until both sides hold 10. |
| G02-06-L03 Known doubles | The departure checklist. Example: 7 + 7 = 14 helps with 7 + 8. | Trunk 15 kits, roof box 16. If 15 + 15 = 30, how many in all? (31) → checklist total written. | Double 14 is 28; there are 28 sandwiches for two days. What is half of 28? → 14 per day; the gate to the harbor opens. |

### Chapter 4 — Cruzamos en ferry (harbor/ferry: G02-07, G02-08)

| Lesson | Need | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-07-L01 Equal groups | Loading boxes of notebooks onto the car at the harbor. Example: 4 bags with 6 each. | 5 boxes with 3 notebooks each? (15) → the boxes are on board. | When can we count with the same number per box? → the ferry worker accepts the box list. |
| G02-07-L02 Repeated addition → multiplication | Cars wait in lanes; the ticket uses a short way to write the count. Example: 3 lanes of 4 cars, 4 + 4 + 4 = 3 × 4. | Which multiplication is 5 + 5 + 5? (3 × 5) → the ticket shows 3 × 5 cars in their area. | On deck, 2 rows of 8 cars: 2 × 8. What does 2 count? → their row is assigned. |
| G02-07-L03 Packs table | The cargo list is a table: boxes and pieces of chalk. Example: packs of 6 stickers. | 4 boxes with 5 chalk each? (20) → table row filled; cargo ready. | Why does doubling the boxes double the chalk? → the table is completed for 8 boxes. |
| G02-08-L01 Sharing equally | On the ferry, snacks are shared among the children on board. Example: 18 snacks for 3 children. | 12 fruit bars for 3 children? (4 each) → everyone gets the same; the ramp lowers. | In 18 ÷ 3 = 6, what does 6 mean? (snacks per child) → the car rolls onto the deck. |
| G02-08-L02 How many groups | The ferry seats passengers in rows of the same size. Example: 18 candies, 3 per bag. | 20 passengers, 5 per row. How many rows? (4) → the ferry leaves the harbor. | What does the 4 count? (complete rows) → halfway across the bay. |
| G02-08-L03 Same calculation, two questions | Gift packs of cookies for the island children. Example: 12 counters, 3 people or bags of 3. | 24 cookies in packs of 6: what does 4 mean? (four packs) → packs ready; island dock in sight. | Why does 4 count different things in the two stories? → they dock; the car leaves the ferry. |

### Chapter 5 — Exploramos la isla (island: G02-09, G02-10, G02-11-L01)

| Lesson | Need | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-09-L01 Sides and vertices | Island road signs have lost their reflective corners; Tía Marta must put tape on each vertex. Example: describe a sign shape so another person can draw it. | The school-zone sign has 5 sides. How many corners get tape? (5) → the first sign shines. | Is "four sides" enough to find the square sign? (no: a long rectangle too) → they pick the right sign; the junction barrier opens. |
| G02-09-L02 Faces and surfaces | Before the tunnel road, cargo must be secured: what rolls and what stands. Example: die, ball, can. | Which item has no flat faces and must be tied down? (sphere: the ball) → ball secured; tunnel lights on. | Why can a can roll and also stand? → cans stand on their bases; they cross the tunnel. |
| G02-09-L03 Guessing from properties | A riddle card from the island children describes the sign that marks the turn to school. Example: "four equal sides" — only a square? | Flat, 3 straight sides, 3 vertices? (triangle) → they find the triangle sign. | Why does "can roll" not tell a sphere from a cylinder? → they ask for one more clue; the school road is found. |
| G02-10-L01 Reading a plan | The island plan shows ★ (start), 🏫 (school), ■ (fallen tree). Example: the grid described. | Which path from ★ avoids the tree? (↑ ↑ → →) → route chosen. | What is the key for? → {name} reads the map symbols; they know where to go. |
| G02-10-L02 Giving route instructions | {name} writes directions for the teacher's van to meet them. Example: 3 × 4 grid. | How many steps does this route take? (5) → the first instructions are sent. | Can two different instructions both be correct? (yes) → the teacher confirms a route. |
| G02-11-L01 Measuring with a ruler (bridge scene) | A small bridge has a gap in its railing; the new board must match the gap. Example: ribbon from 0 to 7 cm. | The gap on the ruler goes from 3 to 8. How long is it? (5) → the board is cut; first section fitted. | Why start counting at zero? → the second board is measured correctly; the bridge is repaired. |

### Chapter 6 — Un garaje y una misión (delivery: G02-11-L02 … G02-13)

| Lesson | Need | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-11-L02 Mass and capacity | A picnic stop by the sea: fruit is weighed, juice measured. Example: rice vs cotton; how much water a bottle holds. | Which instrument compares masses? (scale) → the fruit bags are balanced. | Why are two bottles' heights not enough? → they use a measuring jug; the basket is ready. |
| G02-11-L03 Clocks and calendars | The school can receive them during class time on a given day. Example: visit Wednesday at nine. | Class from 14:00 to 16:00: how long can they stay? (2 hours) → the visit time is set. | What do they need to find next Tuesday's date? (calendar) → the return visit is written down. |
| G02-12-L01 From counting to a table | The supplies don't fit the small car; they count them to plan a van. Example: triangles, circles, squares counted. | The table says 5 pencil boxes, 3 eraser boxes, 4 ruler boxes. How many boxes? (12) → too many for the car; they get the van (game coins). | Why write the category beside the number? → the cargo list is clear; the van is theirs. |
| G02-12-L02 Pictograph | Island children vote which kits to open first. Example: 8 votes drawing, 6 reading, ★ = 2. | If ★ = 2 votes, how many votes do 5 stars show? (10) → that kit is unloaded first. | Why must both rows use the same key? → the result is fair; they reach the school. |
| G02-13-L01 Preparing kits | At the school, kits are put together and shared among tables. Example: 4 kits of 6 pencils; 18 erasers among 3 tables. | 3 kits with 8 pencils each? (24) → the first kits are delivered. | 16 erasers for 4 tables: which sum checks 4 each? (4 + 4 + 4 + 4) → supplies reach every table. |
| G02-13-L02 Explaining and checking | The school's supply room record. Example: 347 sheets, +100 arrive, −10 used. | Start 428, +100 arrive, −10 used: how many? (518) → the final record is written. | How do you check two changes? (undo the last first) → record confirmed; mission complete: two vehicles in the garage, an island explored. |

## Grade 2 checks before finishing

- Each mission introduction states the goal and the quantities needed in the first check; each `rewards[i]` names what the answer of `checks[i]` made possible.
- The worked example sits in the same scene as the challenges but uses different numbers.
- Hints talk about the story objects (boxes, packs, bolts, seats) and point to the next action.
- Numbers stay within 1,000; additive and mental-calculation work stays within 100 unless the plan's lesson says otherwise.
- `{name}` sentences are gender-neutral in Spanish; English repeats the name; Tía Marta drives.
- Prices and amounts mentioned in several lessons (the 619 car, 700 saved coins) agree everywhere they appear.
- Run `npm run lint` and `npm test`.
