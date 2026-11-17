# Grade 3 – scenario plan for “A House for Our Family”

Draft game layer to replace the current Grade 3 story (building a city, `src/content/grade3/cityAdventure.ts`). The educational content and the order of the lessons do not change: 14 packages G03-01 … G03-14, **41 lessons, 2 tasks per lesson = 82 tasks** (`docs/lesson-creation-plan.md`, section Grade 3). What changes: the scenes, who needs each answer and why, and what visibly changes after a correct answer.

Decisions made (November 2026):

- The hero builds a **house for their own family**. The family has bought an empty lot; at the end of the year they move in and throw a housewarming party.
- **No villain.** Tension comes from the building site itself: deliveries, missing materials, a rain forecast, the moving date, and a puppy that gets in the way.
- **41 lessons × 2 tasks**, grouped into **8 chapters = 8 building stages** of different length (3–6 lessons), because the package order is fixed.
- Every correct answer adds **one visible piece to the house** (82 pieces). At the end of each chapter a building stage is complete.
- Status: **added to the code (November 2026):** `src/content/grade3/houseStory.ts` (missions, rewards, epilogue), lessons in `numbers.ts`, `products.ts`, `strategies.ts`, `space.ts`, `measurement.ts`, hints in `hints.ts`, scene `HouseScene.astro`. The exact es-AR / en-US texts are in the code; a few worked examples differ in detail from this plan. The story map for authors is `.agents/skills/grade-3-lesson-authoring/SKILL.md`.

The task texts below are planning wording, not final copy. They keep the mathematics, number range, and typical-error distractor of the current Grade 3 checks; only the context changes.

---

## 1. Story bible

**World.** A neighbourhood in Buenos Aires. The hero’s family lives in a small rented flat. They have bought an empty lot (*un terreno*) and will build their own house.

**Goal.** Finish the house before moving day. The final scene is the housewarming party (*la fiesta de la casa nueva*).

**Characters.**

| Character | Role |
|---|---|
| `{name}` (Tomi or Lola) | Makes decisions on the building site. The learner helps by doing the maths. |
| **Rosa**, *maestra mayor de obras* (site manager) | Runs the building site, keeps the site notebook (*libreta de obra*), asks the questions that need numbers. Calm and kind. |
| **Átomo**, the robot fox | Hints only (`hints.ts`). Never gives the answer. Sometimes makes a typical mistake on purpose so the child can find it. |
| **Abuela Tita** | Will live in the house too. Wants a garden and a lemon tree. Has her own clever calculation methods. |
| **Canela**, the puppy | Comic soft obstacle: digs holes, steps in wet concrete, hides screws. Never causes real damage. |
| The family | Appears as “la familia de {name}”, without fixing parents’ roles, so every child can see their own family in it. |

**How progress works.** The screen shows the house growing on the lot. Each correct answer adds one piece (a stack of bricks, a row of the wall, a roof sheet, a window, a piece of furniture). Rosa ticks one line in the site notebook. When all pieces of a chapter are in place, the building stage is complete and the next stage begins from that state.

**Brick model for place value (chapter 1, reused later).**

| Value | es-AR | en-US |
|---|---|---|
| 1,000 | un **palé** de ladrillos | a **pallet** of bricks |
| 100 | una **pila** de 100 | a **stack** of 100 |
| 10 | un **paquete** de 10 | a **pack** of 10 |
| 1 | ladrillos **sueltos** | **loose** bricks |

The corralón (building-supply yard) is a natural Argentine setting. No money is needed for the core tasks; if prices appear, they are play money. Every lesson names all of its own numbers; nothing is carried over between lessons.

**Tone.** Warm, practical, a little funny. Every task answers a real question on the building site: how many bricks to order, is there enough water, will the roof be finished before the rain, does the bed fit.

---

## 2. Writing for 8–9-year-olds

Grade 3 children read on their own but may still use read-aloud. Rules (an extension of the Grade 2 rules):

- Short sentences: one idea each, about 12–14 words at most.
- First the situation, then one question.
- Familiar words: *ladrillo, pila, paquete, pared, techo, chapa, caño, cinta métrica*. Explain a new building word with a picture the first time.
- A number always comes with its object or unit: «457 ladrillos», «46 cm».
- “Why” answers are one short sentence in a child’s words.
- es-AR uses voseo (*mirá, calculá, fijate*). `{name}` only in mission introductions, rewards, and the epilogue; gender-neutral Spanish around it.
- Two answer options per task; the wrong option shows a typical error (digit instead of its value, forgotten carry, wrong operation, ignoring the remainder, confused units).

---

## 3. Link to the Argentine Year 3 expectations (`docs/ARG_deep_research.md`)

| Year 3 benchmark | Where in the scenario |
|---|---|
| Numbers to about 10,000; place value units-tens-hundreds-thousands | Ch. 1: bricks at the corralón in pallets, stacks, packs |
| Reading, writing, comparing large numbers | Ch. 1: order dictated by phone, “is 8,999 enough?” |
| Addition and subtraction, building the standard algorithms | Ch. 2: foundation – sand and gravel for concrete, iron rods, blocks left over |
| Estimating and checking results | Ch. 2: water tank estimate; Ch. 5: cable roll estimate; every “check with the inverse operation” task |
| Multiplication: arrays, known facts, one-digit multiplier | Ch. 3: brick walls as rows × columns, glass-block window, 47 × 3 for the last wall |
| Division as *reparto* and *partición*; remainder | Ch. 4: roof tiles in rows, screws for helpers, extra trips for the leftovers |
| Proportional series | Ch. 5: “boxes of tiles – number of tiles” table |
| Solving problems with all four operations, several steps | Ch. 5: shelves and screws; Ch. 8: housewarming guests and empanadas |
| Reading and drawing plans of a familiar place | Ch. 6: plan of the new house, legend, route for the movers |
| Classifying shapes and solids by properties; reconstructing from a description | Ch. 6: windows, moving boxes, mailbox name plate |
| Measuring length **and mass** | Ch. 7: carpet, gap for the washing machine, bed; box of books in kg |
| Clock and calendar | Ch. 7: moving truck times, duration of unloading, date of the party |
| Explaining and checking a solution | Task 2 of almost every lesson is “why” or “how do you check” |

Honest notes:

- **Data (Ch. 8, G03-13)** is an editorial continuation, as the plan already says: the explicit federal data progression starts in Year 4; in Year 3 it is simple counting and reading information.
- **Mass** is in the research for Year 3, but the current G03-11 checks cover length only. This scenario adds mass in G03-11-L01 (worked example and task 2) without changing the lesson objective about units.
- The research recommends four task levels (recognise → do → apply → explain). With two tasks per lesson: task 1 = calculation in a site situation, task 2 = explanation or check. Recognition and extra practice come from the package checks (`assessments.ts`) and the “new numbers” button.

---

## 4. Scenario plan by lesson

Notation: **✔** correct answer, **✘** wrong option (the typical error in brackets), **→** what changes in the scene. *Example* = the worked example under the mission header: same scene, different numbers.

### Chapter 1 – The lot and the corralón (G03-01) · 3 lessons · stage: materials on the lot

*Opening.* The family stands on an empty lot full of weeds. Rosa unrolls the house drawing. “First we need bricks. Lots of bricks.” {name}, Átomo, and Canela go to the corralón.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G03-01-L01 Thousands and place values | The corralón board shows bricks as pallets, stacks, packs, loose. *Example:* 2 pallets, 3 stacks, 4 packs, 6 loose = 2,346 bricks. | The yard has 3,528 red bricks. How many bricks are in the stacks – what is the 5 worth? ✔ 500 ✘ 50 (digit place confused) → Rosa reserves the 5 stacks. | The seller has no whole pallet, only stacks of 100. Why do 10 stacks make 1 pallet? ✔ because 10 × 100 = 1,000 ✘ because 100 + 10 = 1,000 → 10 stacks are loaded as one pallet. |
| G03-01-L02 Read, write, compare to 10,000 | Rosa orders by phone; the seller writes the number. *Example:* two yards have 5,072 and 5,702 bricks; compare from the thousands. | Rosa says «ocho mil nueve ladrillos». Which number goes on the order form? ✔ 8,009 ✘ 8,090 (zero in the wrong place) → the order form is right. | The yard has 8,999 bricks; the house needs 9,000. Why is 9,000 more? ✔ 8,999 needs one more brick to reach 9,000 ✘ 8,999 is more because 9 is more than 0 → Rosa adds one loose brick; the order is complete. |
| G03-01-L03 Several decompositions | The truck unloads; one pallet was unpacked into stacks on the way. *Example:* 3,405 = 3,000 + 400 + 5 = 2,000 + 1,400 + 5. | The delivery note says 4,512 bricks. Which unloading also gives 4,512? ✔ 3,000 + 1,500 + 12 ✘ 3,000 + 500 + 12 (lost the unpacked thousand) → Rosa signs the delivery note. | The tile note says 6,000 + 230; what arrived is 5,000 + 1,230. Same amount? ✔ yes: one thousand moved from one part to another ✘ no: there are 1,000 fewer → the tiles are accepted. **Stage complete: the materials are on the lot.** |

### Chapter 2 – The foundation (G03-02, G03-03) · 6 lessons · stage: foundation and floor slab

*Opening.* Rosa marks the house outline with string. “Before walls, a strong foundation.” Concrete needs sand, gravel, and water; the foundation needs blocks and iron rods.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G03-02-L01 Adding by place-value columns | Blocks for the foundation trench, written in Rosa’s notebook in columns. *Example:* 243 + 125 = 368 blocks for two sides. | The long side needs 421 blocks; the corner needs 36 more. How many in all? ✔ 457 ✘ 781 (36 written under the hundreds) → the wheelbarrows carry exactly 457 blocks. | Why do we write ones under ones in the notebook? ✔ so ones, tens, and hundreds match ✘ to add all digits as ones → the trench is lined with blocks. |
| G03-02-L02 Ten ones make a ten | The concrete mixer needs buckets of sand and gravel. *Example:* 276 + 148 = 424 with two carries. | 185 buckets of sand and 237 buckets of gravel. How many buckets go into the mixer? ✔ 422 ✘ 412 (forgot the carry) → the mixer is loaded. | Átomo carries a 1 into the tens column. What does he move? ✔ ten ones ✘ one one → the concrete is ready and poured. |
| G03-02-L03 Estimate and check a sum | Water tank on the site: 1,000 litres. *Example:* 398 + 205 is about 400 + 200 = 600. | The mixer uses 602 litres in the morning and 197 in the afternoon. Which estimate helps decide if the tank is enough? ✔ about 800 ✘ about 400 → the tank is enough for the day. | Why also check the exact total with a subtraction? ✔ an estimate does not catch small mistakes ✘ estimating is always wrong → Rosa writes the exact 799 litres in the notebook. |
| G03-03-L01 Unpack a ten to subtract | Iron rods for the foundation. *Example:* 52 − 17 = 35 rods. | There were 61 rods; 35 went into the foundation. How many are left? ✔ 26 ✘ 34 (took the smaller digit from the larger in each column) → 26 rods are saved for the columns. | Why not just take the smaller digit from the larger one? ✔ it would change the subtraction ✘ tens can never be exchanged → Rosa trusts the count. |
| G03-03-L02 Subtracting with zeros | Concrete blocks left after the foundation. *Example:* 400 − 128 = 272. | 503 blocks arrived; 286 are in the foundation. How many are left for the walls? ✔ 217 ✘ 283 (exchange done wrong) → 217 blocks are stacked for the walls. | The tank has 700 litres; washing the tools takes 156. Which split of 700 helps to subtract? ✔ 600 + 90 + 10 ✘ 600 + 100 + 10 (adds up to 710) → the hose is turned off at the right moment. |
| G03-03-L03 Addition checks subtraction | Rosa checks the notebook before the slab dries. *Example:* 500 − 180 = 320, checked by 320 + 180 = 500. | Rosa wrote 900 − 275 = 625 bricks left. Which sum checks it? ✔ 625 + 275 = 900 ✘ 900 + 275 = 1,175 → the notebook line gets a tick. | If the check gives a different total, what do we do? ✔ check both the subtraction and the check sum ✘ keep the first result → **Stage complete: the floor slab is dry.** Canela left paw prints in one corner; the family keeps them as a souvenir. |

### Chapter 3 – The walls (G03-04, G03-05) · 6 lessons · stage: walls up, window openings ready

*Opening.* “Now the house grows upwards!” A brick wall is rows and columns – a living array.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G03-04-L01 Rows and columns | Glass-block window for the bathroom. *Example:* a garden wall of 5 rows of 6 bricks = 30. | The glass window has 7 rows of 4 glass blocks. How many blocks? ✔ 28 ✘ 11 (added rows and columns) → the glass window shines. | Rosa’s drawing has one empty place. When can we count rows × columns? ✔ when all rows are equal and no place is missing ✘ even if any block is missing → the gap is filled. |
| G03-04-L02 Turning the array | Rosa’s drawing seen from the side. *Example:* 3 rows of 5 = 5 rows of 3. | The wall is 6 rows of 8 bricks. {name} turns the drawing: 8 rows of 6. How many bricks? ✔ 48 ✘ 14 (added) → the order stays the same. | There were 8 window frames; 3 are fitted. Átomo writes 3 − 8. Can we swap the numbers in a subtraction too? ✔ no: swapping changes a subtraction ✘ yes: every operation can be swapped → the notebook shows 8 − 3 = 5 frames left. |
| G03-04-L03 Products we already know | The kitchen wall grows one row at a time. *Example:* 4 × 6 from 3 × 6 + 6. | The wall has 5 rows of 7 bricks = 35. One more row is added. How many now? ✔ 42 ✘ 36 (added 1, not a row of 7) → the wall reaches window height. | The children’s room has two equal walls. Why is 8 × 4 the double of 4 × 4? ✔ 8 rows split into two groups of 4 rows ✘ because 8 and 4 are the same number → both walls are built. |
| G03-05-L01 Cutting a big array | The front wall is long; Rosa cuts the drawing into parts. *Example:* 4 × 13 = 4 × 10 + 4 × 3. | The front wall has 3 rows of 24 bricks. How many bricks? ✔ 72 ✘ 64 → the front wall is up to the door frame. | What must we avoid when cutting the drawing? ✔ counting bricks twice or leaving some out ✘ calculating the parts separately → the exact number of bricks is ordered. |
| G03-05-L02 Multiplying each part | Bedroom and kitchen walls. *Example:* 25 × 4 = 20 × 4 + 5 × 4. | Each of the 3 bedroom walls needs 48 bricks. Which calculation gives 48 × 3? ✔ 40 × 3 + 8 × 3 ✘ 40 × 3 + 8 (forgot to multiply the 8) → the bedroom walls rise. | For 36 × 4, Abuela Tita uses 30 + 6 and {name} uses 20 + 16. Why do both work? ✔ both parts make 36 and each is repeated 4 times ✘ the product does not depend on the numbers → the kitchen walls are done. |
| G03-05-L03 Written multiplication | The last wall, written vertically in the notebook. *Example:* 26 × 3 = 78. | The last wall has 47 bricks in each of 3 sections. How many bricks? ✔ 141 ✘ 121 (forgot the carried 2) → the last wall stands. | After 7 × 3 = 21, Rosa carries the 2. What does it stand for? ✔ two tens ✘ two ones → **Stage complete: all walls up, window holes ready.** |

### Chapter 4 – The roof before the rain (G03-06) · 3 lessons · stage: roof on

*Opening.* The radio says: rain on Friday. “We must close the roof before Friday!” Roof sheets and tiles are shared out in equal rows.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G03-06-L01 Multiplication helps to divide | Roof sheets in equal rows. *Example:* 20 sheets in 4 rows: 4 × 5 = 20, so 5 per row. | 36 roof sheets go in 9 equal rows. How many per row? ✔ 4 ✘ 27 (subtracted) → the first side of the roof is covered. | 42 screws are shared equally into 6 little boxes. How do you check the sharing? ✔ multiply the boxes by the screws in each box ✘ add the two numbers → every helper gets a full box. |
| G03-06-L02 Sharing and grouping | Roof tiles for the porch. *Example:* 24 tiles, rows of 4 → 6 rows; 24 tiles for 4 helpers → 6 each. | 48 tiles, 6 in each row. What does the answer 8 count? ✔ 8 rows ✘ 8 tiles per row → the rows are chalked on the roof. | 32 nails are shared equally among 4 workers: 32 ÷ 4. What does the 4 count? ✔ the workers who get nails ✘ the nails each one gets → everybody hammers at once. |
| G03-06-L03 When some are left over | Last tiles and rolls lifted by a hoist. *Example:* 17 tiles in rows of 5 → 3 rows, 2 left over. | 34 tiles in rows of 6. How many full rows and how many left? ✔ 5 rows, 4 left ✘ 4 rows, 10 left (stopped too early) → the 4 extra tiles cover the dog house. | 23 rolls of roof sheet; the hoist lifts 5 per trip. Are 4 trips enough? ✔ no: 5 trips are needed ✘ yes: ignore the rest → **Stage complete: the roof closes just as the rain starts.** The family watches the rain from inside – dry. |

### Chapter 5 – Water, light, and colour (G03-07, G03-08) · 6 lessons · stage: pipes, cables, tiles, shelves

*Opening.* The house is closed but dark and dry inside. Now pipes, cables, tiles, and paint. Quick calculations at the corralón save trips.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G03-07-L01 Exact mental calculation | Cables for the lights. *Example:* 199 m + 45 m = 200 m + 44 m. | One room needs 99 m of cable, the next 27 m. How many metres? ✔ 126 ✘ 127 (rounded 99 up but did not take 1 off) → the cable is cut to size. | Why does 398 m + 25 m become 400 m + 23 m? ✔ two metres move from one part to the other ✘ two metres are added to the total → the lights switch on. |
| G03-07-L02 An approximate answer | A roll of cable has 300 m. *Example:* 31 × 4 is about 30 × 4 = 120. | 6 rooms need 49 m of cable each. Which estimate fits 49 × 6? ✔ about 300 ✘ about 3,000 → one roll looks about right. | We used 50 instead of 49. Is the estimate above or below the real need? ✔ above ✘ below → the real need is less than 300 m: one roll is enough. |
| G03-07-L03 Choosing and comparing methods | Bathroom water and tiles. *Example:* 300 − 98 two ways. | The tank has 400 litres; the first bath uses 99. How much is left (use 400 − 100 + 1)? ✔ 301 ✘ 299 (gave the 1 back the wrong way) → the water flows. | There were 500 tiles; 198 are on the wall. Abuela Tita computes 500 − 200 + 2. Why does it work? ✔ she took 2 too many and gives them back ✘ any number can be changed to finish faster → the bathroom wall is tiled. |
| G03-08-L01 Which operation do we need? | Kitchen tiles come in boxes. *Example:* 30 tiles in boxes of 5 → 30 ÷ 5. | 84 tiles are packed 7 per box. Which calculation gives the number of boxes? ✔ 84 ÷ 7 ✘ 84 + 7 → the boxes are counted. | 6 boxes with 24 tiles each. What does 6 × 24 count? ✔ tiles in all ✘ number of boxes → the kitchen tiles are ordered. |
| G03-08-L02 A plan with several steps | Shelves for the pantry. *Example:* 3 boxes of 10 screws, 6 lost, 4 shelves → 6 each. | 5 boxes of 10 screws. Canela hides 8 in the grass. The rest go equally on 6 shelves. How many per shelf? ✔ 7 ✘ 8 (forgot to take away the hidden ones) → each shelf gets its screws. | Why does Rosa write units at each step? ✔ to tell apart the total, what is left, and each group’s share ✘ to avoid checking → the shelves are up. |
| G03-08-L03 Tables of packs | A table “boxes – tiles” for the hall. *Example:* boxes of 6: 1→6, 2→12, 4→24. | Each box has 9 tiles; 4 boxes have 36. How many in 8 boxes? ✔ 72 ✘ 40 (added 4 instead of doubling) → the hall floor is tiled. | When can we add two rows of the table to get another row? ✔ when every box has the same number of tiles ✘ even if the box size changes → **Stage complete: water, light, tiles, and colour.** |

### Chapter 6 – The house plan (G03-09, G03-10) · 6 lessons · stage: windows, boxes, and the moving-day plan

*Opening.* Moving day is coming. The movers have never seen the house. {name} draws a plan so they know where everything goes. Rosa finishes windows and the mailbox.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G03-09-L01 A plan of a known place | Plan of the new house. *Example:* plan of {name}’s current room seen from above. | Which view do we use for the house plan? ✔ from above ✘ only the front door from the front → the plan shows all rooms. | Why draw the front door on the plan? ✔ it helps to turn the plan the right way ✘ it makes every distance exact → the movers can read the plan. |
| G03-09-L02 Symbols everyone understands | Legend on the plan; one room has wet paint. *Example:* ○ = plant, △ = lamp. | The legend says ■. What does ■ mean? ✔ a closed area (wet paint, do not pass) ✘ a free square → the wet room is marked. | Abuela Tita prints the plan in black and white. Why is red and green alone not enough? ✔ the plan must be readable without colour ✘ colours change the distances → the legend uses shapes. |
| G03-09-L03 Testing a route | Grid plan: ★ front door, M = place for the sofa, ■ closed. *Example:* a shorter route on another grid. | Is “right, up, right, right, up” a good route for the sofa? ✔ no: it goes into a closed area ✘ yes: it ends at M → the movers will avoid the wet paint. | Why can two different routes both be right? ✔ both follow the rules and reach M ✘ obstacles can be ignored → the moving-day route is ready. |
| G03-10-L01 Families of shapes | Window frames ordered from the carpenter. *Example:* triangles sorted by sides. | Can the square window go on the list of rectangular windows? ✔ yes: it has four right angles ✘ no: a shape cannot be in two families → the frames are ordered together. | The triangular attic window is fitted turned around. Does it stop having three sides? ✔ no, its properties stay ✘ yes, it changes family → the attic window is in. |
| G03-10-L02 Solids and their parts | Moving boxes are rectangular prisms. *Example:* Canela’s doghouse roof, a pyramid: 5 vertices, 5 faces. | Átomo puts a corner protector on every vertex of a moving box. How many? ✔ 8 ✘ 6 (counted faces) → the boxes are protected. | {name} puts a label on every face but counts only the faces in view. Why is that wrong? ✔ other faces are behind or underneath ✘ boxes change when turned → every box is labelled. |
| G03-10-L03 Drawing from a description | Name plate for the mailbox, ordered by phone. *Example:* “a square with 3 cm sides” is enough to draw. | The order says “a rectangle 5 cm long”. What is missing to fix its size? ✔ the width ✘ the colour of the pencil → the carpenter can cut the plate. | The plate arrives turned upright. Does it still match the order? ✔ yes, if no direction was asked for ✘ no, it must always lie flat → **Stage complete: the plate with the family name is on the mailbox.** |

### Chapter 7 – Moving day (G03-11, G03-12) · 6 lessons · stage: the family moves in

*Opening.* The truck is booked, the boxes are packed. Everything must fit, and everything must be on time.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G03-11-L01 Units of length and mass | Measuring tape and a bathroom scale. *Example:* 2 m = 200 cm; a bag of cement weighs 25 kg. | The hall is 3 m long. The carpet seller asks in centimetres. How many? ✔ 300 cm ✘ 30 cm → the carpet fits the hall. | The moving list says: “box of books: 25”. Why must we write the unit? ✔ to know what was measured: 25 kg is weight ✘ all units are the same → the movers know the heavy box. |
| G03-11-L02 Estimate first, then measure | Gap for the washing machine. *Example:* estimate 80 cm for the door, measured 78 cm. | You estimated 50 cm; the tape shows 46 cm. How far off was the estimate? ✔ 4 cm ✘ 96 cm (added) → the real 46 cm goes on the plan. | Why estimate before measuring? ✔ to check and improve what we know about sizes ✘ to replace the tape always → {name}’s next estimates get closer. |
| G03-11-L03 Equal measures, different units | Where does the bed go? *Example:* 100 cm and 1 m are the same length. | The bed is 2 m long; one wall has 150 cm free. Which is longer? ✔ 2 m ✘ 150 cm (compared the numbers only) → the bed goes on the longer wall. | The tape says 200 cm; Rosa says 2 m. Why can both be right? ✔ different units can show the same length ✘ any number works → the bed is in place. |
| G03-12-L01 Hours and minutes | The clock in the kitchen. *Example:* long hand on 3 → 15 minutes. | The long hand is on 9. How many minutes past the hour? ✔ 45 ✘ 9 (read the number, not the minutes) → the family is ready when the truck arrives. | The truck comes at 7:30. Where is the short hand? ✔ between 7 and 8 ✘ exactly on 7 → the alarm is set. |
| G03-12-L02 How long does it last? | Unloading the truck. *Example:* 9:45 to 10:05 is 20 minutes. | Unloading goes from 11:50 to 12:20. How long? ✔ 30 minutes ✘ 70 minutes (counted 100 minutes in an hour) → lunch is on time. | Rosa writes 1 h 15 min; Átomo writes 115 minutes. Why is that wrong? ✔ one hour is 60 minutes ✘ one hour is 100 minutes → the moving-day timetable is right. |
| G03-12-L03 Counting days on the calendar | Calendar on the fridge. *Example:* Friday 3 + 7 days = Friday 10. | The family moves in on Tuesday 6. The party is 7 days later. Which date? ✔ Tuesday 13 ✘ Monday 12 → the invitations get their date. | Why do we need to know how many days the month has? ✔ to carry on correctly into the next month ✘ every week has a different length → **Stage complete: the first night in the new house.** |

### Chapter 8 – The housewarming party (G03-13, G03-14) · 5 lessons · stage: the party

*Opening.* “Let’s have a party for everyone who helped!” The family decides together, so {name} asks questions and reads the answers.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G03-13-L01 A question to investigate | What food for the party? *Example:* 5 people asked about the garden colour → 5 answers. | {name} asks 8 relatives; each picks one food. How many answers do we expect? ✔ 8 ✘ 24 → the survey sheet is ready. | Why must everyone get the same question? ✔ so we can compare the answers ✘ so everyone chooses the same → the answers are collected. |
| G03-13-L02 From table to chart | Tally of empanada fillings, then a bar chart on the fridge. *Example:* colours 4, 2, 1. | The rows show 6 (beef), 3 (ham and cheese), 2 (vegetable) votes. How many answers in all? ✔ 11 ✘ 9 (missed a row) → the chart is drawn. | Why keep the filling name next to each bar? ✔ so we know what each number is about ✘ the chart changes the answers → everyone can read the chart. |
| G03-13-L03 What can we conclude? | Which tree for the garden? *Example:* 6 votes of 10 is more than half. | Lemon tree 4 votes of 10, the other two trees 3 and 3. Does the lemon tree have more than half? ✔ no ✘ yes → the family talks again before choosing. | Can we say the neighbours want a lemon tree too? ✔ no: we only know what the family said ✘ yes: one group speaks for everyone → Abuela Tita plants the tree the family agreed on. |
| G03-14-L01 Planning the trip | Relatives come from another town in vans. *Example:* 46 guests, vans of 15 seats → 4 vans. | 65 guests; each van has 20 seats. How many vans are needed? ✔ 4 ✘ 3 (ignored the leftover guests) → the vans are booked. | After 3 full vans, 5 guests are left. Why do we need another van? ✔ they need seats too ✘ the leftover is always dropped → every guest arrives. |
| G03-14-L02 Two solutions under the magnifying glass | Empanadas for the party, two ways. *Example:* 29 × 5 = 30 × 5 − 5. | 7 trays with 48 empanadas each. Which calculation gives 48 × 7? ✔ 50 × 7 − 2 × 7 ✘ 50 × 7 − 2 (took away 2 once, not 7 times) → the empanadas are counted. | {name} and Abuela Tita solved it differently and both are right. How do we choose? ✔ compare which is clearer and easier without losing the meaning ✘ take only the one with more steps → **Epilogue.** |

**Epilogue.** The family, Rosa, the neighbours, and the relatives stand in front of the finished house. {name} cuts the ribbon. Abuela Tita’s lemon tree is in the garden, Canela’s paw prints are in the floor, and the site notebook has all 82 ticks. The final picture is the whole house, built piece by piece from the learner’s answers.

---

## 5. Chapter overview

| # | Chapter / building stage | Packages | Lessons | Pieces |
|---|---|---|---|---|
| 1 | The lot and the corralón | G03-01 | 3 | 6 |
| 2 | The foundation | G03-02, G03-03 | 6 | 12 |
| 3 | The walls | G03-04, G03-05 | 6 | 12 |
| 4 | The roof before the rain | G03-06 | 3 | 6 |
| 5 | Water, light, and colour | G03-07, G03-08 | 6 | 12 |
| 6 | The house plan | G03-09, G03-10 | 6 | 12 |
| 7 | Moving day | G03-11, G03-12 | 6 | 12 |
| 8 | The housewarming party | G03-13, G03-14 | 5 | 10 |
| | **Total** | 14 | **41** | **82** |

## 6. Implementation notes (for later)

- Game layer: replace `src/content/grade3/cityAdventure.ts` (`CITY_CHAPTERS`) with a house story file; chapters become the 8 stages above instead of 14 package chapters. Mission order must stay aligned with the 41 lessons.
- Lessons: rewrite `story`, `steps`, `scene`, and `checks` in `numbers.ts`, `products.ts`, `strategies.ts`, `space.ts`, `measurement.ts` to the building-site context; keep numbers and distractors listed above. Update `hints.ts` (one hint per check, about the site objects).
- Scene: a house picture with 82 pieces that appear one by one; the site notebook (*libreta de obra*) as the progress list.
- Create a `grade-3-lesson-authoring` skill with this story map once the scenario is approved, as was done for Grade 2.
- Package checks in `assessments.ts` stay outside the story.
