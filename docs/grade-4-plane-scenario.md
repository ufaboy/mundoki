# Grade 4 – story reference: “La Golondrina: a Plane Around Argentina”

This document preserves the original planning brief for the implemented Grade 4 story. The current learner-facing content lives in `src/content/grade4/planeAdventure.ts`, the Grade 4 lesson files, and `src/content/grade4/README.md`; those files are authoritative wherever this older plan differs. The course has 14 packages G04-01 … G04-14, 41 lessons, and 82 challenge steps.

Decisions made (November 2026):

- The hero **rebuilds an old two-seat plane** with a retired aviator and then **flies around Argentina** with her, visiting landmarks.
- **Build first, then fly.** Lessons 1–15 (G04-01 … G04-05): building in the hangar, ending with a test flight over CABA. Lessons 16–36 (G04-06 … G04-12): a loop around the country, one landmark per topic. Lessons 37–41 (G04-13, G04-14): back home, preparing the aeroclub festival.
- **Mentor:** Tía Nina, a retired pilot and mechanic (a fictional character, not a real aviator).
- **No villain.** Tension comes from weather, wind, fuel, weight, mountain height, and the festival date. Comic relief: Rulo, a hornero bird who keeps building mud nests on the plane.
- **Route (a loop):** Aeroclub → CABA (Obelisco) → Cataratas del Iguazú → Quebrada de Humahuaca / Purmamarca → Mendoza and Aconcagua → Perito Moreno glacier → Ushuaia → Península Valdés → back to the aeroclub.
- **41 lessons × 2 tasks**, grouped into **12 chapters** of different length (2–6 lessons), because the package order is fixed.
- Status: **implemented.** All 12 chapters and 41 missions are in `src/content/grade4/planeAdventure.ts`; learner-facing lesson text and hints are authored in es-AR and en-US. The content has not been validated through classroom usability testing.

The task texts below are planning wording, not final copy. They keep the mathematics, number range, and typical-error distractor of the current Grade 4 checks; only the context changes. Where a task’s numbers were changed or the two tasks of a lesson were swapped, this is marked.

---

## 1. Story bible

**World.** A small fictional aeroclub near Buenos Aires, *Aeroclub El Ceibo*. In its oldest hangar, under a dusty tarp, stands **La Golondrina**, a two-seat plane that has not flown for years. Nina flew it when she was young.

**Goal.** Rebuild La Golondrina, fly it around Argentina, and come back in time for the aeroclub festival (*el festival del aeroclub*), where the plane, the route map, and the flight logbook will be shown to everyone.

**Characters.**

| Character | Role |
|---|---|
| `{name}` (Tomi or Lola) | Mechanic’s helper in the hangar, then co-pilot and navigator in the air. The learner helps by doing the maths. |
| **Tía Nina**, retired pilot and mechanic | Leads the work, is always the pilot in command, keeps the flight logbook (*bitácora de vuelo*), asks the questions that need numbers. Experienced, patient, likes old maps. |
| **Átomo**, the robot fox | Hints only (`hints.ts`). Never gives the answer. Sometimes makes a typical mistake on purpose so the child can find it (presses the wrong calculator key, forgets a zero). |
| **Rulo**, the hornero | Comic soft obstacle. Builds mud nests on the engine cover, sits on the map, follows the plane to every stop. Never causes real danger. |
| People at the stops | Doña Elva, a weaver at the Purmamarca market (Ch. 6); a park ranger at the glacier (Ch. 8); a whale guide at Puerto Pirámides (Ch. 10). They appear briefly and ask one need each. |

**Safety rule for the story.** The child never flies alone and never takes off or lands. Nina is the pilot; `{name}` reads the map, the fuel gauge, the compass, and the load sheet. All refuelling, repairs, and decisions are made together with Nina.

**How progress works.**

- **Hangar (Ch. 1–4):** the screen shows the plane being rebuilt. Each correct answer adds **one visible part** (engine, rivet rows, wing panels, instruments) – 30 parts in all. Nina ticks a line in the repair list.
- **Journey (Ch. 5–10):** a map of Argentina. Each correct answer draws **one stretch of the route or adds one stamp** to the logbook (fuel checked, landing made, photo taken) – 42 stamps.
- **Festival (Ch. 11–12):** the aeroclub fills with a poster, chairs, and visitors – 10 steps.
- At the end of each chapter a stage is complete: a part of the plane, or a landmark reached.

**The plane is fictional.** No real model or brand. Its abilities are invented only where a task needs them (for example, “La Golondrina can climb to 4 km”) and stay the same throughout the story.

**Money.** Only in Ch. 12, as play money (*unidades*), like the current project lesson.

**Tone.** Warm, adventurous, a little funny. Every task answers a real question of the hangar or the flight: which engine to choose, how many rivets, is the fuel enough, can we fly over the mountain, which way to turn.

---

## 2. Writing for 9–10-year-olds

Grade 4 children read on their own; read-aloud stays available. Rules (an extension of the Grade 3 rules):

- Short sentences, one idea each, about 14–16 words at most.
- First the situation, then one question.
- New aviation words are explained with a picture the first time: *hélice* (propeller), *ala* (wing), *remache* (rivet), *costilla del ala* (wing rib), *alerón* (aileron), *tablero* (instrument panel), *indicador de combustible* (fuel gauge), *rumbo* (heading), *pista* (runway), *bitácora* (logbook).
- A number always comes with its object or unit: «8.240 remaches», «0,40 m», «4 km».
- Landmark facts are short and correct, and appear in the scene text, not in the questions, except where the task needs them (Aconcagua’s height in Ch. 7).
- “Why” answers are one short sentence in a child’s words.
- es-AR uses voseo (*mirá, calculá, fijate*). `{name}` only in mission introductions, rewards, and the epilogue; gender-neutral Spanish around it. Numbers in es-AR: `8.240`, `0,25`, `2,08 m`.
- Two answer options per task; the wrong option shows a typical error (digit instead of its value, lost zero, remainder larger than the divisor, bigger denominator = bigger fraction, confused units, reading the protractor from the wrong zero).

---

## 3. Link to the Argentine Year 4 expectations (`docs/ARG_deep_research.md`)

| Year 4 benchmark | Where in the scenario |
|---|---|
| Read, write, and compare natural numbers up to millions | Ch. 1: the aeroclub warehouse register, engine kilometre counters, rivet count on a scale |
| Multi-step problems with addition, subtraction, and multiplication | Ch. 2: screws and rivets for the fuselage, diagrams, checking the unit |
| Written multiplication | Ch. 3: rivet rows on wing panels as an area model, partial products, estimate |
| Written division, remainder, and checking | Ch. 3: bolts shared among wing ribs, trays, bags of screws, cars for the helpers |
| Mental, written, and calculator calculation; estimate first | Ch. 4: fuses for the panel, trip kilometres, a wrong calculator key |
| Common fractions: halves, quarters, eighths; fraction on a number line | Ch. 5: the fuel gauge and the route line from the aeroclub (0) to Iguazú (1) |
| Comparing and equivalent fractions | Ch. 5: trails at the falls, gauge and pump marks, “more than half a tank?” |
| First decimal forms (tenths, hundredths, 1/2 = 0,5) | Ch. 6: a 10 × 10 woven tapestry and woven strips measured in m and cm |
| Units of length, mass, and capacity/volume | Ch. 7: load sheet, tie-down rope, water cups, cargo cubes, 4 km vs Aconcagua |
| Angles | Ch. 8: turns along the glacier, heading drawn on the chart with a protractor |
| Constructing and classifying triangles | Ch. 9: triangular braces to repair a wing strut after the Ushuaia wind |
| Constructing shapes and solids | Ch. 10: wing patches copied with a set square; gift boxes from nets |
| Data in tables, pictograms, and bar charts (IPAP Year 4) | Ch. 11: survey for the festival poster |
| Explaining and checking a solution | Task 2 of almost every lesson is “why” or “how do you check”; Ch. 12 finds and repairs a wrong solution |

Honest notes:

- The research document gives federal Year 4 expectations; CABA is the project’s reference (`AGENTS.md`). The Grade 4 lessons claim only **editorial** alignment until CABA documents for 4.º grado are checked. The scenario does not change that status.
- The research recommends four task levels (recognise → do → apply → explain). With two tasks per lesson: task 1 = a calculation or reading in a flight situation, task 2 = an explanation or check. Recognition and extra practice come from the package checks (`assessments.ts`) and the “new numbers” button.
- Constructions with a protractor, ruler, and set square (Ch. 8–10) still need paper and tools; the story asks the child to draw “on Nina’s chart” but cannot check a drawing automatically.
- Landmark facts used in the text (Aconcagua 6.961 m, southern right whales at Península Valdés, the Garganta del Diablo at Iguazú, the Perito Moreno ice front) must be checked again before publishing.

---

## 4. Scenario plan by lesson

Notation: **✔** correct answer, **✘** wrong option (the typical error in brackets), **→** what changes in the scene. *Example* = the worked example under the mission header: same scene, different numbers.

### Chapter 1 – The old hangar (G04-01) · 3 lessons · stage: the plane is found and the parts are counted

*Opening.* Nina opens the old hangar of Aeroclub El Ceibo. Under a dusty tarp: La Golondrina. Rulo has built a mud nest on the engine cover. “If we rebuild her, we can fly around Argentina – and be back for the festival.” First stop: the aeroclub warehouse, where everything is counted in huge numbers.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-01-L01 From thousands to millions | The warehouse register. *Example:* the register says 2.305.040 small parts; Nina reads them in groups of three digits: 2 millions, 305 thousands, 40. | The register says 3.702.040 rivets. The rivets are stored in crates of 100.000. What is the 7 worth? ✔ 700.000 ✘ 7.000 (wrong place) → Nina finds the 7 crates of 100.000 rivets. | Átomo copies the number as “3.742”, without the zeros. Why do the zeros in the middle matter? ✔ they keep the other digits in their places ✘ they are decoration and can always be erased → the register is copied correctly; the first part goes onto the repair list. |
| G04-01-L02 Ordering large quantities | Spare engines in the warehouse, each with a kilometre counter. *Example:* three engines on the left shelf flew 360.500 km, 306.500 km, and 360.050 km; order them from the left (the task uses other engines). | Two more engines: one counter shows 999.999 km, the other 1.000.000 km. Which engine has flown more? ✔ the one with 1.000.000 ✘ the one with 999.999 (more nines look bigger) → the 1.000.000-km engine goes to the museum shelf. | Nina wants the engine with the fewest kilometres. When do we stop comparing the places? ✔ at the first different place from the left ✘ after comparing only the units → the 405.900-km engine is mounted on La Golondrina. |
| G04-01-L03 Locating and approximating | A number line on the hangar board. *Example:* the old rivet drum had 248.600 rivets, between 200.000 and 300.000. | The wings need 8.240 rivets. On the board’s line from 8.000 to 9.000, which thousand is 8.240 nearer to? ✔ 8.000 ✘ 9.000 → Nina marks the point on the line and writes “about 8.000 rivets” on the plan. | Átomo writes “about 8.200”. Why can both approximations be useful? ✔ they round to different units ✘ any nearby number is exact → **Stage complete: the hangar is clean, the engine is chosen, and the rivets are counted.** Rulo moves his nest to the hangar roof. |

### Chapter 2 – The fuselage (G04-02) · 3 lessons · stage: the body of the plane is closed and painted

*Opening.* The body of the plane (*el fuselaje*) has holes. New metal panels must be screwed and riveted. “Before calculating, draw what you know,” says Nina.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-02-L01 Diagramming the information | Nina’s whiteboard. *Example:* the hangar buys 18 boxes of 425 rivets and already had 350 rivets; Nina draws a diagram. | 18 boxes arrive with 425 rivets each. What does 18 × 425 count? ✔ rivets ✘ boxes → the diagram labels the product “rivets”. | Why draw a diagram before calculating? ✔ it shows how the data are related ✘ so we do not need to read the question → Nina pins the diagram over the workbench. |
| G04-02-L02 Ordering the steps | Screws for the fuselage panels. *Example:* 350 rivets + 18 boxes of 425 − 200 used = 7.800 rivets left. | There are 5 bags of 120 screws and 50 loose screws. The panels use 80 screws. How many are left? ✔ 570 ✘ 650 (forgot the screws used) → the 570 screws go back into the labelled drawer. | Why does Nina write each intermediate result? ✔ to know what quantity each step stands for ✘ to add all the results at the end → the side panels are screwed on. |
| G04-02-L03 Taking the answer back to the story | Painting the fuselage. *Example:* Nina rereads the rivet solution (7.800 left): data, operations, unit, reasonableness. | There were 600 mL of blue paint; the stripe used 80 mL. Átomo wrote 600 − 80 = 520. Which calculation checks it? ✔ 520 + 80 = 600 ✘ 520 − 80 = 440 → the blue stripe is painted. | Átomo counted the screws left and wrote “570 boxes”. What must be corrected? ✔ the unit: we counted screws ✘ the operation: we must always count boxes → **Stage complete: the fuselage is closed, and the name “La Golondrina” is painted on it.** *(Task 2 now uses the screws from L02 instead of “7800 boxes” so the example does not give it away.)* |

### Chapter 3 – The wings (G04-03, G04-04) · 6 lessons · stage: both wings are riveted and mounted

*Opening.* The wings are long rectangles covered with rows of rivets. “A wing panel is a multiplication you can touch,” says Nina. Then bolts, rivets, and screws must be shared out fairly.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-03-L01 Multiplication as area | A left-wing panel: 23 columns and 14 rows of rivets. *Example:* Nina cuts the drawing into 20 + 3 columns and 10 + 4 rows. | The small corner part has 3 columns and 4 rows of rivets. How many rivets? ✔ 12 ✘ 7 (added) → the corner rivets are placed. | Why do we add all four parts? ✔ together they cover the panel without overlapping ✘ adding the sides gives the area → the left-wing panel is riveted: 322 rivets. |
| G04-03-L02 Partial products | The right-wing panel. *Example:* 23 × 14 = 23 × 10 + 23 × 4 = 230 + 92. | The right panel has 34 columns and 25 rows. What is the part for the two tens of rows, 34 × 20? ✔ 680 ✘ 68 (multiplied by 2, not 20) → that part of the panel is riveted. | Átomo writes 23 + 92 for 23 × 14. Why is that wrong? ✔ it uses 1 where it should be 10 ✘ because 92 is not 23 × 4 → Átomo corrects it to 230 + 92 = 322. |
| G04-03-L03 Multiplication algorithm and estimate | The ailerons, written vertically in the notebook. *Example:* the flap has 47 rows of 23 rivets: 47 × 23 = 1.081. | The aileron has 32 rows of 14 rivets. How many rivets? ✔ 448 ✘ 160 (used 32 instead of 32 × 10) → both ailerons are riveted. | Átomo’s calculator says 47 × 23 = 10.810. What does an estimate tell us? ✔ it is too large: we expect about one thousand ✘ it is close enough to 1.000 → the flap count is corrected to 1.081. |
| G04-04-L01 Sharing in large batches | Bolts for the wing ribs (*costillas*). *Example:* 156 bolts for 6 ribs: 20 each uses 120, then 6 each uses 36 → 26 each. | 132 bolts for 6 ribs. Nina gives 20 to each rib first. How many bolts does that use? ✔ 120 ✘ 20 (counted one rib) → 12 bolts are left to share. | Why may we choose different batch sizes (20, 10, 2…)? ✔ if we track what is used and add the parts of the quotient ✘ because the remainder does not matter → each rib gets its 22 bolts. |
| G04-04-L02 From partial quotients to the algorithm | Rivets shared into trays, one for each wing half. *Example:* 936 rivets in 3 trays: 300 + 10 + 2 = 312 each. | 816 rivets go into 4 equal trays. How many in each? ✔ 204 ✘ 24 (lost the zero in the tens) → each tray is filled. | Átomo says 906 ÷ 3 = 32. Why is that wrong? ✔ the hundreds would be lost: it is 302 ✘ a number with a zero cannot be divided → the three mechanics get 302 bolts each. |
| G04-04-L03 Checking quotient and remainder | Small bags of spare screws. *Example:* 157 washers in bags of 7 → 22 bags and 3 left; check 22 × 7 + 3 = 157. | 95 screws go in bags of 4. How many full bags and how many left? ✔ 23 bags, 3 left ✘ 22 bags, 7 left (remainder bigger than the bag) → the 3 spare screws go in the toolbox. | 22 aeroclub helpers come to carry the wings. Each car has 6 seats: 22 ÷ 6 = 3, remainder 4. Why can’t the 4 helpers left over be ignored? ✔ they need seats too: 4 cars ✘ remainders never have units → **Stage complete: both wings are mounted.** |

### Chapter 4 – The instrument panel and the first flight (G04-05) · 3 lessons · stage: test flight over CABA

*Opening.* The plane looks complete, but the instrument panel (*el tablero*) is empty, and the trip still needs a plan. “A pilot always knows roughly what answer to expect,” says Nina.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-05-L01 Convenient calculations | Wiring the instrument panel. *Example:* 25 boxes of 16 cable clips: 25 × 16 = 25 × 4 × 4 = 400. | Nina orders 50 small boxes with 18 fuses each. How many fuses? ✔ 900 ✘ 1.800 (doubled instead of halving) → the fuse box is full. | Átomo calculates 50 × 18 as 100 × 9. What makes such a shortcut valid? ✔ it keeps the relationships and the result ✘ only that it looks quick → the panel is wired. |
| G04-05-L02 Estimating before calculating | Planning the trip on the map of Argentina. *Example:* before 398 × 21, estimate 400 × 20 = 8.000. | La Golondrina will fly about 299 km a day for 31 days. What size of total do we expect for 299 × 31? ✔ near 9.000 km ✘ near 90.000 km → the map gets the right scale. | Does the estimate alone tell us the last digit? ✔ no, we still need the exact calculation ✘ yes, every nearby result is correct → Nina writes the exact 9.269 km in the logbook as the planned distance. |
| G04-05-L03 Checking the calculator too | Fuel for the first flight. *Example:* the calculator shows 76.500 for 425 × 18; the estimate says about 8.000, so a key was wrong. | Nina must enter 63 × 4 (4 cans of 63 L). Átomo pressed 63 × 40. How does the result change? ✔ it is ten times larger ✘ it is four more → the right amount, 252 L, is ordered. | The screen shows a result nobody expected. What should we check? ✔ the data, the operation, and the estimate ✘ just accept the screen → **Stage complete: first flight!** La Golondrina takes off and circles over CABA: the Obelisco, the Río de la Plata, the Puente de la Mujer. Rulo flies alongside. |

### Chapter 5 – To the Iguazú Falls (G04-06, G04-07) · 6 lessons · stage: landing at Iguazú, full tank for the next leg

*Opening.* Nina unrolls the map. A straight line goes from the aeroclub (0) to Iguazú (1). The fuel gauge has marks for halves, quarters, and eighths. In Misiones the jungle is green and the falls roar.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-06-L01 Equal parts of one whole | The route ribbon on the map. *Example:* the route is cut into 4 equal legs; after three legs we have flown 3/4. | The fuel gauge shows 3/4. What does the 4 count? ✔ the equal parts of the full tank ✘ only the full parts → Nina reads the gauge correctly. | Two of the four equal legs are flown. Which fraction of the route is that? ✔ 2/4 ✘ 4/2 → the map marks 2/4 of the route. |
| G04-06-L02 Halves, quarters, and eighths | Nina folds the paper map in 2, then 4, then 8 equal parts. *Example:* the folds of the same map. | The route has 8 equal parts. The refuelling stop is at one quarter of the route. How many eighths make one quarter? ✔ 2 ✘ 4 → the refuelling stop is marked after 2 eighths. | How many quarters make the whole route? ✔ 4 ✘ 2 → the plan shows four legs. |
| G04-06-L03 Fractions on a number line | The route as a number line from 0 to 1. *Example:* the line from 0 to 1 is cut into 4 equal intervals. | The line is cut into 8 equal intervals. Nina must call the radio at 3/8. Where is it? ✔ at the third step from 0 ✘ at the eighth step → the radio call is made on time. | Which quarter mark is at Iguazú, the 1? ✔ 4/4 ✘ 1/4 → La Golondrina lands at Iguazú. *(Tasks swapped so that landing comes last.)* |
| G04-07-L01 Compare using the same whole | The walkways (*pasarelas*) to the Garganta del Diablo. *Example:* two equal strips show 1/4 and 1/8. | On the same walkway, Nina walks 1/4 and Átomo stops to take photos after 1/8. Who has walked further? ✔ Nina, 1/4 ✘ Átomo, 1/8 (bigger denominator = bigger part) → they wait for Átomo. | On the park map, one trail is 20 cm long and another is 40 cm. Is half of each trail the same length on the map? ✔ no: 10 cm and 20 cm ✘ yes: both are a half → the group chooses the shorter half before the boat ride. |
| G04-07-L02 Equivalent fractions | Refuelling at the airfield. *Example:* split each half of a strip into two, then each quarter into two; the shading stays. | The plane’s gauge shows 1/2; the pump’s gauge shows only quarters. Which mark equals 1/2? ✔ 2/4 ✘ 1/4 → the two gauges agree. | Nina wants the tank at 3/4; the pump counts in eighths. How many eighths? ✔ 6 ✘ 3 → the attendant stops at the right mark. |
| G04-07-L03 Compare with half and one | Before the next leg. *Example:* order 3/8, 1/2, and 7/8 using the half and the whole. | To fly on, the tank must be more than half full. Which level is enough: 5/8 or 3/8? ✔ 5/8 ✘ 3/8 → Nina decides to fill up. | The gauge shows 7/8. How much is missing to a full tank? ✔ 1/8 ✘ 1/7 → **Stage complete: full tank and a rainbow over the Garganta del Diablo.** Next leg: the northwest. |

### Chapter 6 – The Quebrada de Humahuaca (G04-08) · 3 lessons · stage: a woven gift for the cockpit

*Opening.* La Golondrina lands in Jujuy. At the market in Purmamarca, under the Cerro de los Siete Colores, Doña Elva weaves cloths with squares of many colours. Her tapestry has 10 rows of 10 squares.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-08-L01 Tenths and hundredths | The 10 × 10 tapestry. *Example:* each row has 10 squares; the whole tapestry has 100; one row is 0,1. | How many hundredths (small squares) are in one tenth (one row)? ✔ 10 ✘ 100 → Doña Elva starts the first row. | 7 small squares are red. What does 0,07 of the tapestry stand for? ✔ 7/100 ✘ 7/10 → the colour recipe is written down. |
| G04-08-L02 Decimals in measurement | Woven strips (*fajas*) measured with a tape. *Example:* a strip is 1 m and 25 cm = 1,25 m. | Doña Elva’s label says 0,40 m. How many centimetres? ✔ 40 cm ✘ 4 cm → the strip is cut to size. | A runner for the cockpit is 2 m and 8 cm. How do we write it in metres? ✔ 2,08 m ✘ 2,8 m → the label is right. |
| G04-08-L03 Half is also 0,5 | Half of a tapestry is red. *Example:* 50 of 100 squares shaded. | Which decimal shows half of the tapestry? ✔ 0,5 ✘ 0,05 → the red half is finished. | One corner pattern is 0,25 of the tapestry. How many squares of 100? ✔ 25 ✘ 5 → **Stage complete: Doña Elva’s small tapestry hangs in the cockpit.** Next leg: Mendoza. |

### Chapter 7 – Mendoza and the Aconcagua (G04-09) · 3 lessons · stage: load checked, route along the mountains

*Opening.* In Mendoza the Andes rise like a wall. The Aconcagua, 6.961 m high, is the highest mountain in the Americas. Before the long flight south, everything must be weighed, measured, and packed.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-09-L01 Length and mass | The load sheet and a rope. *Example:* compare a 2 m 30 cm rope with a 215 cm rope; a 1 kg bag with a 750 g bag. | Nina’s toolbox weighs 2 kg. The load sheet asks for grams. How many? ✔ 2.000 g ✘ 200 g → the load sheet is filled in. | It is windy at the airfield. To tie the plane down, Nina needs the longer rope: 150 cm or 1 m? ✔ 150 cm ✘ 1 m (compared only the numbers) → the plane is tied down safely. |
| G04-09-L02 Capacity and volume | Water and cargo for the trip. *Example:* a 1 L bottle; a cargo pile of 12 equal cubes. | How many 250 mL cups can be filled from a 1 L bottle? ✔ 4 ✘ 2 → everyone has water for the flight. | The cargo hold is packed with cube boxes in two layers of six, with no gaps. How many boxes? ✔ 12 ✘ 6 (counted one layer) → the cargo is packed. |
| G04-09-L03 Choose and convert units | A short hike to the Aconcagua viewpoint. *Example:* the hike is 3 km; they carry 2 L of water and 1.500 g of fruit. | La Golondrina can climb to 4 km. How many metres is that? ✔ 4.000 m ✘ 400 m → 4.000 m is less than 6.961 m: Nina plans the route along the foothills, not over the summit. | Which unit suits the capacity of a thermos cup? ✔ mL ✘ kg → **Stage complete: a photo at the viewpoint with the Aconcagua behind.** Next leg: south to Patagonia. |

### Chapter 8 – The Perito Moreno glacier (G04-10) · 3 lessons · stage: flight along the ice front

*Opening.* Near El Calafate, the Perito Moreno glacier ends in a high wall of blue ice over Lago Argentino. A park ranger asks pilots to keep a safe distance and turn exactly as planned. Turns are angles.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-10-L01 Angle as a turn | The plane’s arrow on the chart. *Example:* the arrow turns from pointing right to pointing up: a quarter turn, 90°. | To fly back along the ice front, the plane makes half a turn. How many degrees? ✔ 180° ✘ 90° → La Golondrina faces back along the glacier. | Nina draws the turn with short lines; Átomo draws it again with long lines, without turning them. Does the angle change? ✔ no ✘ yes → the heading on the chart stays the same. |
| G04-10-L02 Right, acute, and obtuse | The flight plan lists every turn by type. *Example:* turns of 40°, 90°, and 120°. | The turn over the lake is 65°. Which column of the plan does it go in? ✔ acute ✘ obtuse → the turn is written in the plan. | The turn back to the airfield is 135°. Which column? ✔ obtuse ✘ right → the route over the lake is complete. |
| G04-10-L03 Measure and construct an angle | Drawing a new heading on the chart with a protractor. *Example:* a 60° heading drawn from a horizontal line. | Where does the centre of the protractor go? ✔ on the vertex, where the plane is ✘ at the far end of the line → the heading is drawn from the right point. | Nina wanted 60° but the drawing shows an obtuse angle. What should be checked? ✔ whether the scale was read from the right zero ✘ only the length of the lines → **Stage complete: the plane flies along the ice front, and a block of ice falls into the lake.** Next leg: Ushuaia. |

### Chapter 9 – Ushuaia, at the end of the world (G04-11) · 3 lessons · stage: the wing strut is repaired

*Opening.* Over the Beagle Channel the wind is very strong. After landing in Ushuaia, Nina finds a bent wing strut. In the airfield workshop she will add triangular braces: “Triangles do not bend out of shape.” First, she tests each brace as a small paper model.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-11-L01 Triangles by sides and angles | Brace drawings on the workbench. *Example:* a brace drawn with sides 3 cm, 4 cm, and 5 cm and a right angle. | One drawing has three sides of 4 cm. Which exact name describes its sides? ✔ equilateral ✘ scalene → the drawing is labelled. | Another drawing has a 100° angle. What is it by its angles? ✔ obtuse ✘ acute → the brace drawings are sorted. |
| G04-11-L02 Construct from conditions | Paper models of the braces. *Example:* Nina builds a 4 cm, 4 cm, 6 cm model. | Can 3 cm, 3 cm, and 4 cm strips close a triangle? ✔ yes ✘ no → this brace is cut from metal. | Can 2 cm, 3 cm, and 5 cm strips close a triangle? ✔ no: 2 + 3 is only as long as 5, so it stays flat ✘ yes → those strips go back in the box. |
| G04-11-L03 Compare properties | Fitting the braces on the strut. *Example:* two braces with sides 5, 5, 6 cm and 5, 6, 7 cm. | A 6, 6, 8 cm brace is fitted turned around. Does it stop being isosceles? ✔ no ✘ yes → the brace is fitted. | What proves that a brace is scalene? ✔ all three sides have different lengths ✘ it is drawn tilted → **Stage complete: the strut is repaired, and the wind calms down.** Photo at the lighthouse in the Beagle Channel. Next leg: north along the coast. |

### Chapter 10 – Península Valdés (G04-12) · 3 lessons · stage: the wing is patched and gift boxes are ready

*Opening.* At Puerto Pirámides the southern right whales jump in the sea. A whale guide gives postcards of the whales. The wing fabric got two scratches in Patagonia, and the postcards need boxes for the friends at the aeroclub.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-12-L01 Copy a figure | Patches for the wing. *Example:* copying a 6 cm × 3 cm rectangular patch with ruler and set square. | Which tool helps copy the right angles of the patch? ✔ the set square ✘ the scales → the first patch fits. | The second patch is a parallelogram. We know the lengths of two neighbouring sides. What else do we need to copy its shape? ✔ its angles ✘ its colour → the second patch fits. |
| G04-12-L02 Faces, edges, and vertices | A box for the whale postcards. *Example:* a rectangular box, counting hidden faces too. | The postcard box is a cube. Átomo puts tape along every edge. How many edges? ✔ 12 ✘ 8 (counted vertices) → the box is taped. | Where do three edges of the box meet? ✔ at a vertex ✘ in the middle of a face → the corners get protectors. |
| G04-12-L03 From a net to a solid | More gift boxes from card. *Example:* four squares in a row, one above the second and one below the second. | How many square faces must a cube net have? ✔ 6 ✘ 4 → the net is cut out. | How do we check a proposed net? ✔ fold it and look for gaps or overlaps ✘ just count six squares → **Stage complete: the wing is patched and the gift boxes are folded.** Last leg: home to the aeroclub. |

### Chapter 11 – Home: the festival poster (G04-13) · 3 lessons · stage: the poster is ready

*Opening.* Back at Aeroclub El Ceibo, the festival is one week away. The poster will show the trip. Which landmark should be the biggest picture? {name} asks the aeroclub kids.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-13-L01 A question and a table | The survey sheet. *Example:* 12 kids each choose one landmark: Iguazú, the glacier, or the whales. | In another group, 15 people answered once, but the table adds up to 16. What do we do? ✔ check the records and count again ✘ accept it without checking → the table is corrected. | Whom does the survey of 12 aeroclub kids describe? ✔ the kids who answered ✘ all the children in Argentina → the poster says “chosen by the aeroclub kids”. |
| G04-13-L02 Pictographs with a key | A pictograph on the hangar wall. *Example:* Iguazú 6, glacier 4, whales 2, with ★ = 2 votes. | With the key ★ = 2 votes, how many votes do five stars show? ✔ 10 ✘ 5 (counted stars as votes) → that row is read correctly. | With the same key, how many stars show 8 votes? ✔ 4 ✘ 8 → the pictograph is finished. |
| G04-13-L03 Bars and scale | A bar chart for the poster. *Example:* the 6, 4, and 2 votes as bars. | The scale goes up in twos. Which value comes after 6? ✔ 8 ✘ 7 → the axis is drawn evenly. | Iguazú has 6 of 12 votes. Does it have more than half? ✔ no, exactly half ✘ yes, because it has the tallest bar → **Stage complete: the poster shows Iguazú biggest, with the glacier and the whales beside it.** |

### Chapter 12 – The aeroclub festival (G04-14) · 2 lessons · stage: the festival opens

*Opening.* The aeroclub has a play budget of 1.200 unidades for the festival. There will be postcards of the trip and rows of chairs for visitors. Nina asks {name} to check every calculation – including other people’s.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G04-14-L01 Shopping for a project | Postcards of the trip. *Example:* 8 packs of 25 postcards at 140 unidades per pack: 200 postcards cost 1.120 unidades; one quarter is kept for the visitors’ book. | How many postcards are one quarter of 200? ✔ 50 postcards ✘ 25 postcards → 50 postcards go to the visitors’ book. | How much of the 1.200 unidades is left after spending 1.120? ✔ 80 ✘ 180 → the money left pays for balloons. |
| G04-14-L02 Find and repair an error | Chairs and postcards for the visitors. *Example:* someone calculated 24 × 13 as 24 × 1 + 24 × 3 = 96 and must repair it. | The volunteers set out 32 rows of 12 chairs and wrote 32 × 12 = 32 + 64. Which partial product is wrong? ✔ it should be 32 × 10 = 320, not 32 ✘ it should be 32 × 100 = 3.200 → there are 384 chairs, enough for everyone. | Why is half of 80 postcards 40 postcards? ✔ two groups of 40 make the 80 again ✘ because 0,5 always means half a postcard → **Epilogue.** |

**Epilogue.** The festival opens. La Golondrina stands in front of the hangar, shining, with Doña Elva’s tapestry in the cockpit and the patched wing. Children sit in the cockpit (on the ground) and follow the route on the big map: Obelisco, Iguazú, Humahuaca, Aconcagua, Perito Moreno, Ushuaia, Valdés, and back. Nina gives {name} the flight logbook with all 82 stamps. Rulo has built his newest nest on the festival poster.

---

## 5. Chapter overview

| # | Chapter / stage | Packages | Lessons | Steps (parts / stamps) |
|---|---|---|---|---|
| 1 | The old hangar | G04-01 | 3 | 6 parts |
| 2 | The fuselage | G04-02 | 3 | 6 parts |
| 3 | The wings | G04-03, G04-04 | 6 | 12 parts |
| 4 | The instrument panel and the first flight (CABA) | G04-05 | 3 | 6 parts |
| 5 | To the Iguazú Falls | G04-06, G04-07 | 6 | 12 stamps |
| 6 | The Quebrada de Humahuaca | G04-08 | 3 | 6 stamps |
| 7 | Mendoza and the Aconcagua | G04-09 | 3 | 6 stamps |
| 8 | The Perito Moreno glacier | G04-10 | 3 | 6 stamps |
| 9 | Ushuaia, at the end of the world | G04-11 | 3 | 6 stamps |
| 10 | Península Valdés | G04-12 | 3 | 6 stamps |
| 11 | Home: the festival poster | G04-13 | 3 | 6 steps |
| 12 | The aeroclub festival | G04-14 | 2 | 4 steps |
| | **Total** | 14 | **41** | **82** |

## 6. Implementation record

- Implemented game content: `src/content/grade4/planeAdventure.ts`; lesson content and hints: `src/content/grade4/`; learner page and scene: `src/components/learn/IslandLesson.astro` and `src/components/learn/PlaneScene.astro`.
- The route, lesson order, bilingual question data, and plane scene progression are covered by `src/tests/planeAdventureSuite.ts` and `src/tests/upperPrimarySuite.ts`.
- `IslandLesson` and `IslandWorkedDiagram` are legacy component names; they currently render Grade 4 plane content. Renaming them is separate cleanup, not pending story work.
- Package assessments and the final project remain outside the story missions.
