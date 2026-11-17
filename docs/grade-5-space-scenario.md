# Grade 5 – scenario plan for “The Cóndor: to the Moon, Mars, and Phobos”

Draft game layer to replace the current Grade 5 story (`src/content/grade5/moonAdventure.ts`, where each package is a chapter with one generic reward per lesson). The educational content and the order of the lessons do not change: 13 packages G05-01 … G05-13, **38 lessons, 2 tasks per lesson = 76 tasks** (`docs/lesson-creation-plan.md`, section Grade 5; `src/content/grade5/README.md`). What changes: the scenes, who needs each answer and why, and what visibly changes after a correct answer.

Decisions made (November 2026):

- The hero **builds a spaceship, flies to the Moon, then to Mars and its moon Phobos, and comes home**.
- **No villain.** Tension comes from space itself: the launch window, a fuel leak, moon dust on the solar panels, a long trip with limited supplies, a Martian dust storm, the weak gravity of Phobos.
- **Crew:** an engineer in the hangar, a pilot on board, Átomo (hints), and a small helper robot for comic moments.
- **Light realism:** real facts (no air on the Moon, Mars is red and cold, the trip to Mars takes months, Phobos is tiny), simplified numbers that fit Grade 5.
- **38 lessons × 2 tasks**, grouped into **9 chapters** of different length (2–6 lessons), because the package order is fixed.
- Status: **scenario for discussion.** Not yet in code. Learner-facing texts will be written in es-AR and en-US with the same numbers and meaning.

The task texts below are planning wording, not final copy. They keep the mathematics, the number range, and the typical-error distractor of the current Grade 5 checks; only the context changes. Where a number had to change to fit the story, the new number keeps the same operation and difficulty.

---

## 1. Story bible

**World.** *Base Patagonia*, a fictional Argentine spaceport on the windy steppe. In its hangar stands an empty launch frame. The ship will be called **Cóndor**, after the Andean bird that flies higher than any other.

**Goal.** Build the Cóndor, reach the Moon, refuel at the lunar base, fly to Mars, collect samples on Phobos, and come home. The final scene is the return to Earth and the presentation of the findings at the hero's school.

**Characters.**

| Character | Role |
|---|---|
| `{name}` (Tomi or Lola) | Young crew member. Makes the decisions; the learner helps by doing the maths. |
| **Ingeniera Vera** | Chief engineer of Base Patagonia. Runs the hangar, keeps the mission log (*bitácora de misión*), asks the questions that need numbers. Calm, precise, likes to double-check. Talks to the ship by radio after launch. |
| **Capitán Leo**, the pilot | Experienced astronaut, flies the Cóndor. Calm, a little funny, trusts the crew's calculations. Always asks “¿Lo comprobamos?” before a manoeuvre. |
| **Átomo**, the robot fox | Hints only (`hints.ts`). Never gives the answer. Sometimes makes a typical mistake on purpose so the child can find it. |
| **Tuerca**, the helper robot | A small round robot on wheels (later with magnetic feet). Comic soft obstacle: presses wrong calculator keys, rolls away in low gravity, sneezes moon dust. Never causes real danger. |

**How progress works.**

- **Chapters 1–3 (building):** the screen shows the Cóndor growing in the hangar. Each correct answer adds one visible part (a panel, a bolt row, a tank, a gauge). 30 parts in all.
- **Chapters 4–9 (flight):** the screen shows a route map Earth → Moon → Mars → Phobos → Earth. Each correct answer moves the ship one step or switches on one system at the current stop. 46 steps in all.
- Ingeniera Vera ticks one line in the mission log after every correct answer. At the end of each chapter a mission stage is complete and the next chapter starts from that state.

**Space facts used in the story (light realism).**

| Fact | Where it appears |
|---|---|
| The Moon has no air: the crew needs oxygen tanks | Ch. 3 (tanks), Ch. 5 (lunar base) |
| On the Moon things weigh about 1/6 of what they weigh on Earth | Ch. 5 opening (a fact, not a task) |
| Moon dust sticks to everything and covers solar panels | Ch. 5 |
| The trip to Mars takes months; supplies must last | Ch. 6 |
| Mars is cold and red; there is ice; dust storms can cover the planet | Ch. 7 |
| Phobos is small (about 22 km across), full of craters, gravity is so weak you could jump very far | Ch. 8 |

**Money.** Purchases use fictional *créditos de misión* (mission credits), never real prices. Every lesson names all of its own numbers; nothing is carried over between lessons.

**Tone.** Curious, practical, a little funny. Every task answers a real question of the mission: is the crane strong enough, which tank has more oxygen, does the cable reach, how much water is left, where do we take samples.

---

## 2. Writing for 10–11-year-olds

Grade 5 children read on their own. Rules (an extension of the Grade 3 rules):

- Sentences up to about 15–18 words; first the situation, then one question.
- Mission words are welcome but explained with a picture the first time: *casco* (hull), *escotilla* (hatch), *tanque*, *panel solar*, *tablero* (console), *órbita*, *módulo*, *rover*, *cráter*, *muestra*.
- A number always comes with its object or unit: «3/4 del tanque», «1,25 m», «750 mL».
- es-AR number format: `3,5`, `1.000`, `25 %`. The answer checker accepts both `,` and `.` as a decimal separator.
- “Why” answers are one sentence in a child's words.
- es-AR uses voseo (*mirá, calculá, fijate, comprobá*). `{name}` only in mission introductions, rewards, and the epilogue; gender-neutral Spanish around it.
- Two answer options per task; the wrong option shows a typical error (added numerators and denominators, larger denominator = larger fraction, digits aligned at the right edge instead of by place, units not converted, estimate taken as exact, mode confused with the largest value).

---

## 3. Link to the Argentine Year 5 expectations (`docs/ARG_deep_research.md`)

| Year 5 benchmark | Where in the scenario |
|---|---|
| Confident use of natural numbers; exact and approximate calculation with the four operations | Ch. 1: rivets, heat-shield tiles, crane load |
| Checking with a calculator; judging if a result is reasonable | Ch. 1: Tuerca's extra zero on the calculator; every “check” task |
| Fractions in different meanings: part of a whole, part of a set, measure, more than one whole | Ch. 2: bolts of a hatch, ladder steps, the fuel pipe |
| Equivalent fractions and simplifying | Ch. 2: solar-panel cells, insulation plates, the nose label |
| Comparing and ordering fractions | Ch. 3: fuel, water, and oxygen gauges; crates for the crane |
| Different strategies to add and subtract fractions | Ch. 3: filling tanks, oxygen used in tests |
| Decimals: reading place value, comparing, number line | Ch. 4: console displays during the countdown and the flight |
| Moving between fraction and decimal; explaining 0,75 = 3/4 | Ch. 5: battery gauge, fuel pump, solar field on the Moon |
| Adding and subtracting decimals, including with measurements | Ch. 5: rover arm, fuel, drinking water |
| Multi-operation problems; choosing natural, fraction, or decimal form | Ch. 6: supplies for the months to Mars |
| Constructing figures and solids from their properties | Ch. 7: panels and boxes for the Mars shelter |
| Estimating and measuring length, mass, and capacity | Ch. 7: ice water, sample tubes, rover tracks |
| Collecting categorical and discrete data, tables and graphs, the mode for a decision | Ch. 8: craters and stones on Phobos |
| Explaining and checking a solution (Aprender: *resolución de problemas*) | Ch. 9: return supplies, the report to Earth; task 2 of almost every lesson |

Honest notes:

- **Mean (promedio)** is a Year 6 expectation (IPAP), so it is not in this scenario. Grade 5 uses only the mode, as the plan says.
- **Constructing** shapes is limited by the two-option task format: the tasks check conditions (right angles, matching edges). Real drawing stays in the open task of each lesson (drawing/explanation) and in the final project.
- **Calculator** work: the child does not use a real calculator in the task; Tuerca's calculator shows a result, and the child decides how to check it.
- The research recommends four task levels (recognise → do → apply → explain). With two tasks per lesson: task 1 = apply in a mission situation, task 2 = explain, check, or find the error. Recognition and extra practice come from the package checks (`assessments.ts`) and the “new numbers” button.

---

## 4. Scenario plan by lesson

Notation: **✔** correct answer, **✘** wrong option (the typical error in brackets), **→** what changes in the scene. *Example* = the worked example under the mission header: same scene, different numbers.

### Chapter 1 – The hangar at Base Patagonia (G05-01) · 3 lessons · stage: launch frame and rocket base

*Opening.* {name} enters the huge hangar. Ingeniera Vera unrolls the plan of the Cóndor. “Thousands of parts, and every number must be right. Let's start with the base.” Tuerca rolls in carrying a calculator twice its size.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G05-01-L01 Properties for calculation | Ordering rivets and tiles. *Example:* 25 × 36 bolts = 25 × 4 × 9 = 100 × 9 = 900. | Each of the 6 fins needs 48 rivets. Vera wants a quick way. Which calculation equals 48 × 6? ✔ (50 − 2) × 6 = 300 − 12 ✘ 50 × 6 − 2 (took the 2 away only once) → 288 rivets are ordered. | The heat shield arrives in 28 boxes of 25 tiles. How many tiles? ✔ 700 ✘ 600 → the tiles are stacked next to the rocket nose. |
| G05-01-L02 Exactness and approximation | The crane can lift up to 5.000 kg. *Example:* 12 boxes of 198 bolts: about 12 × 200 = 2.400; exactly 2.376. | 8 fuel-line segments weigh 403 kg each. Which estimate helps decide if the crane can lift them? ✔ about 3.200 kg ✘ about 32.000 kg (one zero too many) → the crane can do it; it starts lifting. | For the mission log Vera needs the exact mass. How much is 403 × 8? ✔ 3.224 kg ✘ 3.200 kg (kept the estimate) → the log shows the exact load. |
| G05-01-L03 Check a calculator | Tuerca types on the big calculator. *Example:* for 247 × 32 the display shows 79.040; 250 × 30 = 7.500, so Tuerca pressed one zero too many: 7.904. | 180 cables and 60 more cables are shared equally among 6 engine modules. How many per module: (180 + 60) ÷ 6? ✔ 40 ✘ 190 (divided only the 60) → each module gets 40 cables. | Tuerca's calculator shows a result. How can we check it without pressing the same keys again? ✔ calculate in parts or check the multiplication with a division ✘ copy the display without checking → **Stage complete: the rocket base stands on the launch frame.** |

### Chapter 2 – Building the hull (G05-02, G05-03) · 6 lessons · stage: hull, hatch, solar panels, nose

*Opening.* “Now the body of the Cóndor: the hull.” The plans are full of fractions: parts of panels, parts of bolt sets, lengths in fractions of a metre.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G05-02-L01 Part of a whole and of a set | The hatch and its bolts. *Example:* 1/4 of a 12 m sealing strip is 3 m; 1/4 of 12 bolts is 3 bolts. | The hatch is fixed with 12 bolts; 1/4 of them are titanium. How many titanium bolts? ✔ 3 ✘ 4 (took the denominator as the answer) → the titanium bolts go into the corners. | Half the bolts of the small hatch (10 bolts) and half the bolts of the big hatch (18 bolts) are titanium. Why are there not the same number? ✔ the whole changed ✘ “half” means something different each time → both hatches are bolted. |
| G05-02-L02 Fractions as measures | The ladder to the cockpit. *Example:* a handrail of 3 steps of 1/4 m is 3/4 m. | The ladder needs 5 steps of 1/8 m between rungs. How long is it? ✔ 5/8 m ✘ 8/5 m (swapped the numbers) → the ladder is cut and fitted. | Vera switches to a longer reference bar as the unit. Must the measurements be checked again? ✔ yes ✘ no → the measurements are redone; the ladder still fits. |
| G05-02-L03 More than one whole | The fuel pipe along the hull. *Example:* 7/4 m on the measuring line is 1 whole and 3/4. | The fuel pipe is 9/4 m long. Which mixed number goes on the order sheet? ✔ 2 1/4 m ✘ 1 2/4 m → the pipe is cut. | The antenna mount is at 5/3 m from the base. Where is that on the scale? ✔ between 1 m and 2 m ✘ between 0 m and 1 m → the mount is marked on the hull. |
| G05-03-L01 Subdivide without changing the amount | Solar panels for the wings. *Example:* a panel in thirds; each third split in 2 → sixths, the shaded part stays the same. | A panel is split into thirds; each third is split into 4 cells. How many cells in the whole panel? ✔ 12 ✘ 7 (added 3 + 4) → the panel is wired. | 2/3 of the panel must face the Sun. How many twelfths is that? ✔ 8 ✘ 2 → the panel is installed. |
| G05-03-L02 Multiply numerator and denominator | Insulation for the tanks. *Example:* 3/5 of a wall written in twentieths: 12/20. | The plan says 4/7 of the tank wall needs insulation. The factory makes walls in 21 plates. Which equals 4/7? ✔ 12/21 ✘ 7/10 (added 3 to both) → the plates are ordered. | Tuerca says 1/2 = 2/3 “because I added one on top and below”. Why is that wrong? ✔ adding one to both does not keep the value ✘ a fraction cannot be written another way → Tuerca's note is crossed out. |
| G05-03-L03 Group to simplify | Painting the nose. *Example:* 6 of 8 parts painted → group in twos → 3/4. | 10/15 of the nose is painted. Which simpler fraction goes on the label? ✔ 2/3 ✘ 5/10 → the label is printed. | Can we divide only the numerator by 2? ✔ no, it changes the value ✘ yes, it always keeps the fraction → **Stage complete: the hull of the Cóndor is closed.** |

### Chapter 3 – Fuel, water, and oxygen (G05-04, G05-05) · 6 lessons · stage: tanks full, ship ready

*Opening.* “The Moon has no air. We take oxygen, water, and fuel from here.” Every tank has a gauge marked in fractions. All tanks of one kind have the same size.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G05-04-L01 Compare same-sized parts | Fuel and water gauges. *Example:* 3/8 vs 5/8; then 3/4 vs 3/8. | Two equal fuel tanks show 4/9 and 7/9. Which tank has more fuel? ✔ 7/9 ✘ 4/9 → the fuller tank is connected to the main engine. | Two equal water tanks show 2/5 and 2/3. Which has more water? ✔ 2/3 ✘ 2/5 (larger denominator taken as larger) → the hose goes to the other tank first. |
| G05-04-L02 A common unit for comparison | Oxygen bottles. *Example:* 2/3 vs 3/4 of the same bottle → 8/12 vs 9/12. | Two equal oxygen bottles show 5/6 and 3/4. Which has more? ✔ 5/6 ✘ 3/4 → that bottle is loaded on board first. | Why do twelfths work for comparing thirds and quarters? ✔ each third and each quarter is a whole number of twelfths ✘ twelve is always the numerator → the gauges get a twelfths scale. |
| G05-04-L03 Order on the number line | Fuel trucks and supply crates. *Example:* order 3/8, 2/3, 5/4 of a tank on the line. | Two fuel trucks bring 7/8 and 9/8 of a tank. Which load fits into one empty tank? ✔ 7/8 (less than one) ✘ 9/8 → the first truck unloads; the second fills a tank and a spare drum. | The crane lifts the lightest crate first. Crates weigh 1/3 t, 3/4 t, and 4/3 t. Which order is right? ✔ 1/3 < 3/4 < 4/3 ✘ 4/3 < 1/3 < 3/4 → the crates go up in the right order. |
| G05-05-L01 Add and subtract equal parts | Coolant and water. *Example:* 2/7 + 3/7 − 1/7 of a tank. | The coolant tank is filled with 3/8 and then 4/8. How full is it? ✔ 7/8 ✘ 7/16 (added the denominators) → the engine coolant is ready. | The water tank was 9/10 full; a pipe test used 2/10. How full is it now? ✔ 7/10 ✘ 7/0 → the test is logged. |
| G05-05-L02 Find a common fractional part | Fuel pumps and oxygen tests. *Example:* 1/2 + 1/3 of a tank = 3/6 + 2/6 = 5/6. | One pump fills 1/4 of the tank, another 1/6. How much do they fill together? ✔ 5/12 ✘ 2/10 (added tops and bottoms) → the pumps keep running. | An oxygen bottle was 5/6 full; the leak test used 1/2. How much is left? ✔ 1/3 ✘ 4/4 → Vera orders a top-up. |
| G05-05-L03 Fractions in a story | The last tests before launch. *Example:* 2 m of sealing tape; 3/4 m and 2/3 m are used. | A 1 L drinking-water bottle: the crew uses 1/3 L for the plant experiment and 1/4 L for a taste test. How much is left? ✔ 5/12 L ✘ 7/12 L (gave the amount used) → the rest is stored for launch day. | How do we check a subtraction of amounts? ✔ used plus left gives back the start ✘ change units without converting → **Stage complete: all tanks are full; the Cóndor stands ready on the pad.** |

### Chapter 4 – Countdown and the flight to the Moon (G05-06) · 3 lessons · stage: launch, orbit, Moon landing

*Opening.* The crew puts on spacesuits. The console shows decimal numbers everywhere. Capitán Leo: “Read them carefully. One wrong place, and we fly somewhere else.”

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G05-06-L01 A decimal place-value chart | The pressure display. *Example:* 2,347 in a chart of ones, tenths, hundredths, thousandths. | The fuel-pressure display shows 1,062. What is the 6 worth? ✔ 6/100 ✘ 6/10 → Vera sets the valve right. | The altimeter counts thousandths of a kilometre. How many thousandths make one hundredth? ✔ 10 ✘ 100 → the countdown starts: 10… 9… 8… |
| G05-06-L02 Zeros that preserve value | The throttle checklist. *Example:* 0,5, 0,50, and 0,05 on three screens. | The checklist says throttle 0,7. Which screen shows the same value? ✔ 0,70 ✘ 0,07 → the engines ignite. | Tuerca wants to delete the zero in 1,03 to “clean” the screen. Can it be removed? ✔ no ✘ yes → **liftoff!** The Cóndor leaves the pad. |
| G05-06-L03 Compare decimals on a line | Burns on the way to the Moon. *Example:* 0,8 and 0,75 on the segment from 0 to 1. | Two engine burns are proposed: 0,63 and 0,7 (minutes). Leo needs the longer one. Which is it? ✔ 0,7 ✘ 0,63 → the ship turns towards the Moon. | The safe landing speed must be between 0,4 and 0,5 (km per minute). Which value fits? ✔ 0,45 ✘ 0,54 → **Stage complete: the Cóndor lands on the Moon.** |

### Chapter 5 – The lunar base (G05-07, G05-08) · 6 lessons · stage: solar field cleaned, fuel and water ready for Mars

*Opening.* Grey dust, black sky, the Earth in the window. Tuerca jumps – and floats: here everything weighs about 1/6 of its weight on Earth. At the small base *Luna Sur* the crew must recharge, refuel, and repair the rover. The base machines use decimals; the crew's plans use fractions.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G05-07-L01 Fractions in the decimal grid | The base solar field is a 10 × 10 grid of cells. *Example:* 3 of 4 equal regions shaded = 75 cells = 0,75. | The battery is 3/4 charged; the base display shows decimals. Which value is it? ✔ 0,75 ✘ 0,34 → the base display confirms the charge. | Dust covers the field; 2/5 of the 100 cells are cleaned. How many cells? ✔ 40 ✘ 25 → 40 cells shine and the base gets power. |
| G05-07-L02 Useful correspondences | A table on the base wall: halves, quarters, fifths, eighths. *Example:* 1/2 = 0,5; 1/4 = 0,25; 1/5 = 0,2. | The plan says to pump 1/8 of a tank. The pump accepts only decimals. Which is exactly 1/8? ✔ 0,125 ✘ 0,18 → the pump delivers the right amount. | Leo types 0,33 for 1/3 of the oxygen. Is 0,33 exactly one third? ✔ no, it is an approximation ✘ yes, always → Leo adds a small safety reserve. |
| G05-07-L03 Choose a useful representation | Repairing the rover. *Example:* is a 3/4 m or a 0,8 m cable longer? 0,75 < 0,8. | Two cable pieces: 0,25 m and 1/2 m. Which exact conversion helps to add them? ✔ 1/2 m = 0,5 m ✘ 1/2 m = 0,12 m → the cable is joined: 0,75 m. | A sheet of insulation foil is shared equally by the 4 crew members for their boots. What does each get? ✔ 1/4 of the sheet ✘ 4 whole sheets → everyone's boots are sealed against the dust. |
| G05-08-L01 Add matching place values | The rover arm. *Example:* 2,35 m + 0,8 m = 3,15 m. | The arm has two segments: 1,25 m and 0,6 m. How long is it? ✔ 1,85 m ✘ 1,31 m (aligned the right edges) → the arm reaches the rock. | Which places are added in the same column? ✔ tenths with tenths, hundredths with hundredths ✘ always the last digits → the rover picks up its first moon rock. |
| G05-08-L02 Subtract with decimal regrouping | Fuel for Mars. *Example:* 3,00 t − 1,47 t = 1,53 t. | The spare tank holds 2 t; 0,65 t goes into the Cóndor. How much is left in the spare tank? ✔ 1,35 t ✘ 2,65 t (added) → the base keeps a reserve. | Vera wrote 4,1 − 2,35 = 1,75. Which addition checks it? ✔ 1,75 + 2,35 = 4,10 ✘ 1,75 + 4,1 = 2,35 → the fuel log is correct. |
| G05-08-L03 Decimals and compatible measurements | Water and the antenna. *Example:* 2,4 m of tape; 85 cm is used → 2,40 m − 0,85 m = 1,55 m. | The crew has 1,5 L of drinking water; 250 mL are poured for tea. How much is left? ✔ 1,25 L ✘ 1,75 L (added) → the bottle is packed for the trip. | The antenna rod is 1,55 m; the hole in the plan is 155 cm. Are they the same length? ✔ yes ✘ no → **Stage complete: the Cóndor lifts off from the Moon towards Mars.** |

### Chapter 6 – The long road to Mars (G05-09) · 3 lessons · stage: supplies last the whole trip

*Opening.* Leo: “Seven months to Mars. Nobody brings us a delivery out here.” The crew plans food, water, and the small greenhouse on board.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G05-09-L01 Model several steps | Meal bars. *Example:* 3 packs of 12 bars; 1/3 of all bars are eaten in the first week → 36 bars, 12 eaten, 24 left. | The greenhouse box has 48 seed packets; 1/4 is planted now. How many packets are left for later? ✔ 36 ✘ 12 (gave the planted packets) → the first lettuce sprouts. | We eat one third of all the bars in 3 packs. Why do we first find the total number of bars? ✔ the fraction is about that whole set ✘ every task starts by multiplying → the food plan is approved. |
| G05-09-L02 Choose number forms for the model | Watering the greenhouse. *Example:* 2 bottles of 3/4 L and 0,25 L more → 1,5 L + 0,25 L = 1,75 L. | The plants get 1/2 L, 1/2 L, and 0,2 L. How much water in all? ✔ 1,2 L ✘ 0,7 L → the plants are watered. | The log says “four 0,5 L containers”. What does the 4 describe? ✔ the number of containers ✘ the litres in each → the water stock is counted right. |
| G05-09-L03 Compare strategies with evidence | Fixing a tear in the solar sail. *Example:* from 1,5 m of tape we cut 3/4 m; Vera works in cm, Leo in m. | Leo measures 140 cm of tape, Vera writes 1,4 m. Are they the same? ✔ yes ✘ no → the tear is sealed. | In a second repair one person writes 75 cm and another 75 m. Does the same number mean the same length? ✔ no, check the units ✘ yes, only the number matters → **Stage complete: Mars appears in the window, red and huge.** |

### Chapter 7 – Mars and the dust storm (G05-10, G05-11) · 6 lessons · stage: shelter built, storm survived

*Opening.* The landing module touches the red ground. Vera on the radio: “A dust storm is coming in three days. Build the shelter from the panel kit!” The shelter is made of flat panels and boxes; each must have the right shape.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G05-10-L01 Families of quadrilaterals | Sorting panels into bins: parallelograms, rectangles, rhombuses, squares. *Example:* a square fits in several bins. | The rhombus bin takes panels with 4 equal sides. Can the square panel go in it? ✔ yes, it has 4 equal sides ✘ no, it looks different when turned → the bin is full and the floor is laid. | Must every rectangular panel have 4 equal sides? ✔ no ✘ yes → the long wall panels are accepted. |
| G05-10-L02 Construct and check conditions | The door of the shelter. *Example:* a 6 cm × 4 cm rectangle on the scale drawing. | A panel has sides 6, 4, 6, and 4 dm. What angles must it have to be a rectangle? ✔ four 90° angles ✘ only the equal opposite sides matter → the door closes tight. | The panel is fitted turned sideways. If all conditions still hold, is it still right? ✔ yes ✘ no → the side wall stands. |
| G05-10-L03 Faces that form a solid | A storage box folded from a net. *Example:* a box 6 × 4 × 3 dm and its net. | The box is 6 dm long, 4 dm wide, and 3 dm tall. How many 6 × 4 dm faces does it have? ✔ 2 ✘ 4 → top and bottom are cut. | In Tuerca's net a 3 dm edge must join a 4 dm edge. Can they join without bending? ✔ no ✘ yes → the net is fixed and the box closes. |
| G05-11-L01 Choose quantity and tool | Melting ice for water. *Example:* a table, a bag of rocks, and a jug: which tool measures what? | Which tool measures how much water a bottle of melted ice holds? ✔ a container marked in mL ✘ a ruler in cm → the water is measured. | Which length is reasonable for a sample tube? ✔ 18 cm ✘ 18 km → the right tubes are unpacked. |
| G05-11-L02 Conversion preserves measurement | Rocks and tracks. *Example:* one rock bag weighs 1,25 kg, another 750 g → 1.250 g + 750 g = 2 kg. | The melted ice gives 0,75 L of water. The filter is marked in mL. How many mL? ✔ 750 mL ✘ 75 mL → the water is filtered. | The rover moved 340 cm towards the shelter. How many metres? ✔ 3,4 m ✘ 34 m → the rover is parked inside. |
| G05-11-L03 Precision and reasonable results | Measuring before the storm. *Example:* estimated 1,5 m; the tape marked in cm shows 148 cm. | The ruler marks only centimetres. How do we record a rock that is 23 cm long? ✔ approximately 23 cm ✘ exactly 23,000001 cm → the rock is labelled honestly. | {name} estimated the crack in the door at 80 cm and measured 76 cm. How big was the difference? ✔ 4 cm ✘ 156 cm (added) → the crack is sealed. **Stage complete: the storm passes over a closed shelter.** |

### Chapter 8 – Phobos (G05-12) · 3 lessons · stage: samples chosen and collected

*Opening.* Phobos is a small grey moon of Mars, about 22 km across, full of craters. Gravity is so weak that Tuerca gets magnetic feet so as not to fly away. Vera: “We can take only a few samples. Let's collect data first and decide where to dig.” The crew divides the landing area into squares.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G05-12-L01 Categories and countable quantities | The data sheet for each square: stone colour and number of craters. *Example:* “grey” is a category; “3 craters” is a count. | Which information do we get by counting one by one? ✔ the number of craters in a square ✘ the colour of the stone → the crater column is filled in. | On the sheet grey stones are coded 1 and dark stones 2. Does 2 mean “twice as much” as 1? ✔ no, it is only a label ✘ yes → the colour codes are used correctly. |
| G05-12-L02 From records to table and graph | Craters in 8 squares: 0, 1, 1, 2, 2, 2, 3, 3. *Example:* the frequency table and its bar chart. | In how many squares did we find exactly 2 craters? ✔ 3 ✘ 2 (gave the crater count, not the squares) → the table is complete. | In the bar chart, what does the height of each bar count? ✔ the number of squares ✘ the size of the craters in metres → the chart is sent to Vera. |
| G05-12-L03 Mode and decisions | Choosing where to dig. *Example:* the crew votes for a site: crater edge 5, flat plain 5, ridge 2 → two modes. | Craters in 5 new squares: 2, 2, 2, 7, 9. What is the mode? ✔ 2 ✘ 9 (took the largest value) → the crew digs in a typical square, not a rare one. | A second area: 1, 1, 3, 3, 4. What are the modes? ✔ 1 and 3 ✘ only 4 → samples are taken from both kinds of squares. **Stage complete: the sample boxes are sealed; the Cóndor turns towards Earth.** |

### Chapter 9 – Coming home (G05-13) · 2 lessons · stage: splash-down and the report

*Opening.* The Earth grows in the window. Before landing the crew plans a welcome meal for the base team and prepares a report: “We must show what we found, and prove every number.”

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G05-13-L01 Recipe and class purchases | Space pancakes for the welcome. *Example:* one batch uses 3/4 kg of flour and 0,5 L of milk; two batches use 1,5 kg and 1 L. | The galley has 2 kg of flour; two batches use 1,5 kg. How much flour is left? ✔ 0,5 kg ✘ 1,5 kg (gave the amount used) → the pancakes are ready. | The welcome budget is 10 mission credits; the crew spent 6,60. How much is left? ✔ 3,40 ✘ 4,40 (forgot to regroup) → the change buys a cake for Tuerca's “birthday”. |
| G05-13-L02 Present and defend a proposal | Naming the new crater. *Example:* how to present a vote fairly. | 12 base workers vote for a name: A gets 6 votes, B 4, C 2. What can we say? ✔ A was chosen most among those who voted ✘ more than half of all people in Argentina chose A → the crater gets its name. | What must the report show so another person can check the costs and amounts? ✔ quantities, units, operations, and a check ✘ only a total without explanation → **Epilogue.** |

**Epilogue.** The capsule lands under its parachutes near Base Patagonia. Vera, the family of {name}, and the whole base team wait at the landing site. Tuerca rolls out first and falls over: Earth gravity again. At school {name} presents the report: the photos of the Moon, the shelter on Mars, the crater chart from Phobos, and the mission log with all 76 ticks. The final picture shows the whole route Earth → Moon → Mars → Phobos → Earth, each step lit by one of the learner's answers.

---

## 5. Chapter overview

| # | Chapter / mission stage | Packages | Lessons | Steps |
|---|---|---|---|---|
| 1 | The hangar at Base Patagonia | G05-01 | 3 | 6 |
| 2 | Building the hull | G05-02, G05-03 | 6 | 12 |
| 3 | Fuel, water, and oxygen | G05-04, G05-05 | 6 | 12 |
| 4 | Countdown and the flight to the Moon | G05-06 | 3 | 6 |
| 5 | The lunar base | G05-07, G05-08 | 6 | 12 |
| 6 | The long road to Mars | G05-09 | 3 | 6 |
| 7 | Mars and the dust storm | G05-10, G05-11 | 6 | 12 |
| 8 | Phobos | G05-12 | 3 | 6 |
| 9 | Coming home | G05-13 | 2 | 4 |
| | **Total** | 13 | **38** | **76** |

## 6. Implementation notes (for later)

- Game layer: replace `src/content/grade5/moonAdventure.ts` (`MOON_CHAPTERS`, one chapter per package, two generic rewards per scene) with a space-journey story file; chapters become the 9 stages above. Mission order must stay aligned with the 38 lessons. Each mission gets its own introduction and one reward per task (76 rewards), as in Grade 2 `wizardQuest.ts`.
- Lessons: rewrite `story`, `steps`, `scene`, and `checks` in `calculation.ts`, `fractions.ts`, `decimals.ts`, `world.ts` to the mission context; keep numbers and distractors listed above. Changed numbers: none of the check answers change; only units and objects change (e.g. G05-10-L02/L03 use dm instead of cm for real-size panels; G05-12-L02 bars count squares instead of people).
- Update `hints.ts` (one hint per check, about the mission objects) — the current hints name buttons, ribbons, and books and will no longer match.
- Scene: the Cóndor in the hangar with 30 parts that appear one by one (Ch. 1–3), then a route map with 46 lit steps (Ch. 4–9); the mission log (*bitácora de misión*) as the progress list.
- Final project (`GRADE_FIVE_PROJECT` in `index.ts`, recipe and budget) can stay as is, reframed as “plan the welcome for the next crew”.
- Create a `grade-5-lesson-authoring` skill with this story map once the scenario is approved, as was done for Grade 2.
- Package checks in `assessments.ts` stay outside the story.
