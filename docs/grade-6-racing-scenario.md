# Grade 6 – scenario plan for “Math Racing: the Copa Mundoki”

Draft game layer to replace the current Grade 6 story (`src/content/grade6/oceanAdventure.ts`, an ocean expedition with one generic reward per lesson). The educational content and the order of the lessons do not change: 13 packages G06-01 … G06-13, **39 lessons, 2 tasks per lesson = 78 tasks** (`docs/lesson-creation-plan.md`, section 7; `src/content/grade6/README.md`). What changes: the scenes, who needs each answer and why, and what each correct answer does in the race.

Decisions made (November 2026):

- The hero is a **rookie driver of a real race car** (*bólido*) in a fictional junior championship, the **Copa Mundoki**.
- Format: a **season of races** across Argentina. Each chapter = garage/preparation + one Grand Prix. Between races the team upgrades the car.
- **Friendly rival**, no villain. Tension comes from the track, the weather, the energy budget, wear, and a strong, fair rival team.
- **39 lessons × 2 tasks**, grouped into **8 chapters** (preseason, 6 Grands Prix, the Grand Final). Chapter length follows the fixed package order.
- Status: **implemented** (November 2026) in `src/content/grade6/racingAdventure.ts` and the lesson files, es-AR and en-US. Differences from this plan: the preseason ends with qualifying as a 🏆 result; G06-02-L02 task 2 happens in a 50-lap free practice (an 18-lap race has no lap 45); G06-03-L01 task 1 asks about “a rookie car” in general. Built later the same week: **Chispa’s garage** (13 car parts, each installed by one upgrade answer; shown on every mission page and as the season’s upgrade tree on the map) and the **duel with Nico** at the end of each chapter (replays the stage’s advantages; results: qualifying lap solo, then behind, ahead ×4, photo-finish tie, ahead in the final). Also built: the “New numbers” button with stars on the first challenge of 36 missions. Not built yet: the weather card and cosmetic liveries for stars; the family project is still the schoolyard plan.

The task texts below are planning wording, not final copy. They keep the mathematics, the number range, and the typical-error distractor of the current Grade 6 checks; only the context changes. Where a number had to change to fit the story, it is marked **(changed)** and keeps the same operation and difficulty.

---

## 1. Story bible

**World.** The **Copa Mundoki de Bólidos Junior**, a fictional championship for young drivers. Six Grands Prix on fictional circuits in real Argentine regions, then the Grand Final back home. Safety is part of the world: helmet, fireproof suit, barriers, marshals with flags. The championship rules include **rutas alternativas** — optional route variants that a team may take only if its navigation is calculated correctly (this is how “shortcuts” stay fair).

**Goal.** Win the Copa with the team car **Chispa**. The final scene is the Grand Final and the podium celebration with the whole team and the rival.

**Characters.**

| Character | Role |
|---|---|
| `{name}` (Tomi or Lola) | Rookie driver of the **Escudería Pampa**. Makes the decisions on track; the learner does the maths that makes them possible. |
| **Marga Quiroga**, race engineer | Runs the pit wall and the radio, reads the telemetry, plans the strategy. Calm and exact; always asks “¿Con qué datos lo decimos?” |
| **Pocho**, veteran mechanic | Knows every bolt of Chispa, works “a ojo” (by eye). Comic soft obstacle: proposes quick estimates and old habits that the child checks. Never causes real danger. |
| **Átomo**, the robot fox | Hints only (`hints.ts`), speaks from a small screen on the steering wheel. Never gives the answer. |
| **Nico Viento**, rival driver | Driver of team **Viento Sur**. Confident, fast, fair; teases a little, congratulates sincerely. Sometimes states a wrong claim (a typical error) that the child refutes. |

**Tone.** Fast, bright, a little funny. Every task answers a real question of the team: which part to buy, how much energy to keep, when to stop in the pits, which route is shorter, which graph tells the truth.

**Money.** Purchases use fictional *créditos de escudería* (team credits), never real prices.

**Light realism.** Fictional circuits in real regions with real facts: thin air and long climbs in the Andes, rain and humidity in Misiones, strong wind in Patagonia, short winter days in Ushuaia. Speeds and energy values are simplified to fit Grade 6. No real teams, brands, or championships are named.

---

## 2. Game mechanics

Each correct answer triggers **one** visible effect, proportional to what the answer decided. A wrong answer never causes a crash or a penalty: the car keeps racing at normal pace, the opportunity stays open, and the child can retry or press “new numbers”.

| Icon | Mechanic (es-AR / en-US) | What the child sees | Typical maths behind it |
|---|---|---|---|
| ⚡ | **Acelerón / Boost** | Short speed burst, speed lines | energy and fraction calculations |
| 🔥 | **Turbo / Turbo** | Turbo charge on the dashboard, used on a straight | multiples, fractions of a tank, percent |
| 🛣 | **Ruta alternativa / Alternative route** | A shorter route variant opens on the map | scale, distances, comparisons |
| 🔧 | **Mejora / Upgrade** | A new part appears on Chispa in the garage (tires, wing, brakes, battery, cooling, telemetry) | prices, proportionality, divisibility |
| ⏱ | **Pit stop perfecto / Perfect pit stop** | Pit timer runs faster, crew moves in sync | grouping, common divisors, inverse proportion |
| 🌀 | **Rebufo / Slipstream** | Chispa tucks behind the rival and gains speed | common multiples, timing |
| 📡 | **Telemetría / Telemetry** | Marga's screen shows a new live graph | decimals, graphs, mean |
| 🏁 | **Posición / Position** | Grid slot or race position changes | comparisons, conclusions from data |
| 🏆 | **Puntos / Points** | Championship table updates at the end of a chapter | chapter completion |

Extra game moments (not tasks, between lessons):

- **Garage view** between Grands Prix: Chispa with all upgrades earned so far (a visual upgrade tree).
- **Duelo con Nico**: a short scene at the end of each chapter where both cars fight on the last lap; the boosts the child earned in that chapter are played out here.
- **Clima**: the weather card at the start of each GP (sun, rain, wind, night) that explains why some calculations matter.
- **Pintura**: cosmetic livery stickers bought with stars (*Estrellas*), never needed for progress.

**Results are story-fixed.** The race results in the chapter openings and endings are written into the story (the child always reaches the Grand Final). Correct answers add visible boosts and stars; they do not decide the standings. This keeps progress safe for children who need several attempts.

---

## 3. Writing for 11–12-year-olds

- Sentences up to about 18–20 words; first the situation, then one question.
- Racing words are welcome but explained with a picture the first time: *boxes* (pits), *grilla* (grid), *vuelta* (lap), *recta* (straight), *curva*, *alerón* (wing), *neumáticos*, *telemetría*, *rebufo*, *bandera a cuadros*.
- A number always comes with its object or unit: «3/4 L de refrigerante», «2,4 km», «25 %».
- es-AR number format: `3,5`, `1.000`, `25 %`. The checker accepts `,` and `.` as decimal separators.
- “Why” answers are one sentence in a child's words.
- es-AR uses voseo (*mirá, calculá, fijate, comprobá*). `{name}` only in mission introductions, rewards, and the epilogue; gender-neutral Spanish around it.
- Two answer options per task; the wrong option shows the typical error kept from the current checks.

---

## 4. Link to the Argentine Year 6 expectations (`docs/ARG_deep_research.md`)

| Year 6 benchmark (NAP / IPAP, PBA plan 2026) | Where in the scenario |
|---|---|
| Comparing numeral systems and properties of the decimal system | Ch. 1: credits board, Roman pit numbers, telemetry in powers of ten |
| Multi-step problems with the four operations | every chapter; especially Ch. 2 (crews, sets) and Ch. 8 |
| Multiples, divisors, divisibility | Ch. 2: pit crews, stint lengths, turbo laps, bolts, car number, crew kits |
| Fraction as the result of a division and as *reparto* | Ch. 3: energy shared among mountain sections, coolant among radiators |
| Fractions and decimals, operations and estimation | Ch. 3: battery display, turbo fluid, regenerative braking |
| Direct proportionality with natural and rational numbers | Ch. 4: parts prices, unit price, energy table and graph |
| Inverse proportionality | Ch. 4: mechanics and rebuild time, energy per lap, speed and time |
| Percentages | Ch. 5: battery %, turbo +%, discount, recovering the whole race length |
| Area and perimeter | Ch. 6: pit-box barrier and floor, composite tent floor, charging pad |
| Scale | Ch. 6: wind-tunnel model, circuit map and alternative route, pit-box plan |
| Creating and interpreting graphs | Ch. 7: tire choices, fan vote, rival's misleading poster, telemetry axes |
| Arithmetic mean (IPAP) and its meaning vs the mode | Ch. 7: battery balancing, turbo gains, pit-stop times |
| Problem solving, comparing strategies, error analysis, argumentation (Aprender, PBA plan) | task 2 of almost every lesson; Nico's and Pocho's wrong claims; Ch. 8 |

Honest notes:

- **CABA alignment.** CABA is the reference: Grade 6 is *6.º grado de primaria*, not the end of primary school. The table above uses federal NAP/IPAP and the PBA plan as cited in the research; indicator-level CABA alignment still needs a check against the CABA Diseño Curricular 2024/2025 before any claim of formal alignment.
- **Four task levels** (recognise → do → apply → explain): with two tasks per lesson, task 1 = apply in a race situation, task 2 = explain, check, or find the error. Recognition and extra practice come from `assessments.ts` and the “new numbers” button.
- **Drawing tasks** (plans, graphs) are checked in the two-option format only by conditions; real drawing stays in each lesson's open task and in the final project.
- **Roman numerals** are not a core Year 6 benchmark but are the existing vehicle for “comparing numeral systems” in G06-01-L02.
- **Realism.** A child driving a real race car is the fantasy of the game; the world shows safety equipment and adult supervision. Energy, speed, and lap numbers are simplified.

---

## 5. Scenario plan by lesson

Notation: **✔** correct answer, **✘** wrong option (the typical error in brackets), **→** what the answer does in the game. *Example* = the worked example under the mission header: same scene, different numbers.

### Chapter 1 – Preseason at the Escudería Pampa (G06-01) · 3 lessons · stage: the car is registered and qualified

*Opening.* {name} enters the Escudería Pampa garage for the first time. Under a cover stands Chispa, still without number or stickers. Marga: “In a week, qualifying. Every number on this car must be right.” Pocho waves a wrench; Átomo blinks on the steering wheel. Across the paddock, Nico Viento polishes his blue car and shouts: “Welcome, rookie!”

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G06-01-L01 Position gives value | The credits board of the team. *Example:* the chassis code 5050 — the left 5 is worth 5.000, the other 50; the zeros keep the places. | The parts store pays in chips of 10.000, 1.000, 100, 10 and 1 credits. The team has 30.604 credits. How much is the 6 worth? ✔ 600 ✘ 60 (read the wrong place) → 🔧 Pocho pays with six 100-chips: a new steering wheel is mounted. | The chassis needs 1.000 bolts; bolts come in bags of 10. How many bags? ✔ 100 ✘ 10 (counted thousands as tens) → 🔧 the chassis is bolted together. |
| G06-01-L02 Compare numeral systems | The old historic paddock numbers its pit boxes in Roman numerals. *Example:* pit box XXII is box 22: 10 + 10 + 1 + 1; in 22 the position gives each 2 its value. | The team is assigned pit box XXV. Which number is that? ✔ 25 ✘ 205 (wrote each symbol as a digit) → 🏁 the team truck parks at box 25. | The grid board shows {name} at IV. Nico laughs: “IV or VI, the same thing!” Why are IV and VI different? ✔ order gives addition or subtraction rules ✘ V changes from five to fifty → 🏁 {name} starts 4th, not 6th. |
| G06-01-L03 Powers of ten | Marga connects the telemetry. *Example:* in one test day the car sends 10⁶ = 1.000.000 data points; the exponent counts factors of ten. | The radio sends 10⁴ data points per lap. How many is that? ✔ 10.000 ✘ 40 (multiplied 10 × 4) → 📡 Marga's screen shows Chispa's data live. | One simulator lap uses 3,5 Wh; {name} drives 100 simulator laps. How much energy? ✔ 350 Wh ✘ 3,500 Wh (the value did not change, the comma was only written differently) → ⚡ {name} knows the track: first boost charged. **Stage complete: Chispa qualifies.** 🏆 |

### Chapter 2 – Gran Premio del Río (G06-02, G06-03) · 6 lessons · stage: first race, a street circuit by the river in Buenos Aires

*Opening.* Clima: sun, a little wind from the river. A street circuit with tight corners: pit stops and timing will decide everything. Marga: “Today we win in the boxes.”

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G06-02-L01 Groups without leftovers | Volunteers join the pit crew. *Example:* 24 tires stacked in rows of 6 → 4 full rows; rows of 5 → 4 rows and 4 left over. | 28 volunteers want to form pit crews of 7. Is that possible without anyone left out? ✔ yes: four crews ✘ no → ⏱ four complete crews in yellow vests. | Pocho suggests crews of 5. Is 5 a divisor of 28? ✔ no: 3 people would be left ✘ yes: the quotient is close to 6 → ⏱ crews of 7 stay; nobody waits without a job. |
| G06-02-L02 Multiples and divisors | Strategy for the race. *Example:* turbo zones every 4 laps: 4, 8, 12, 16, 20…; a 20-lap race splits into stints 1 × 20, 2 × 10, 4 × 5. | The race is 18 laps. Marga wants stints of equal length with no broken stint. Which stint length works? ✔ 6 laps ✘ 12 laps (12 does not divide 18) → ⏱ plan: 3 stints of 6 laps, 2 pit stops. | The rules allow the turbo only on laps that are multiples of 9. Which lap can {name} use? ✔ lap 45 ✘ lap 49 → 🔥 turbo saved for lap 45, the final attack. |
| G06-02-L03 Divisibility rules with reasons | The tire warmers are fixed with bolts in groups of 3. *Example:* 234 bolts: last digit 4 is even → divisible by 2; digit sum 9 → divisible by 3 and 9. | 372 bolts arrive. Without a calculator: can they all be used in groups of 3? ✔ yes: 3 + 7 + 2 = 12 ✘ no → 🔧 tire warmers installed: warm tires at the start. | Pocho wants to use the 9-slot rack instead. Is 372 divisible by 9? ✔ no: 12 is not a multiple of 9 ✘ yes → the 3-slot rack is used; no bolt is left loose in the garage. |
| G06-03-L01 Prime and composite numbers | Rookies must race with a prime number. *Example:* 2 and 7 are prime; 12 is composite (2, 3, 4, 6); 1 is neither. | {name} wants number 21. Is 21 prime? ✔ no: 3 × 7 = 21 ✘ yes: it is odd → {name} chooses 23; 🔧 the number is painted on Chispa. | Nico races with number 2. Pocho: “Even numbers can't be prime!” Why is 2 prime? ✔ it has exactly two divisors, 1 and 2 ✘ all even numbers are prime → Nico's number is valid; the rivals shake hands. |
| G06-03-L02 Common divisors for sharing | Crew kits for the race. *Example:* 12 water bottles and 18 cereal bars → 6 kits of 2 bottles and 3 bars. | 16 water bottles and 24 cereal bars go into identical kits, using everything. What is the greatest number of kits? ✔ 8 ✘ 48 (took a common multiple) → ⏱ 8 kits for 8 crew members: the crew is fresh for the stops. | What is inside each of the 8 kits? ✔ 2 bottles and 3 bars ✘ 8 of each (mixed kits with items per kit) → ⏱ kits handed out; pit stop timer improves. |
| G06-03-L03 Common multiples and coincidences | Two power systems recharge on different laps. *Example:* boost zone every 4 laps, slipstream sensor every 6 → both on lap 12, not only on lap 24. | The battery boost is ready every 6 laps, the slipstream sensor every 8. Both were ready at the start. On which lap are both ready again? ✔ lap 24 ✘ lap 48 (multiplied 6 × 8) → 🌀🔥 on lap 24 {name} slipstreams behind Nico and fires the turbo. | Marga asks: “Why isn't lap 0 the answer?” ✔ it is the start, not a later coincidence ✘ zero is never a multiple → **Chequered flag: {name} finishes 2nd, just behind Nico.** 🏆 |

### Chapter 3 – Gran Premio de los Andes (G06-04, G06-05) · 6 lessons · stage: mountain race near Mendoza

*Opening.* Clima: cold and clear, thin air. A long climb to a mountain pass and a fast descent. Marga: “Here the battery decides. We share the energy well, or we stop halfway up.”

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G06-04-L01 Share fewer wholes than people | Energy for the climb. *Example:* Pocho shares 3 alfajores equally among 4 mechanics: 3 ÷ 4 = 3/4 of an alfajor each. | 2 full battery packs of energy are shared equally among 5 mountain sections. How much for each section? ✔ 2/5 of a pack ✘ 5/2 of a pack (swapped the numbers) → ⚡ energy plan loaded section by section. | 3 spare wheels are shared among 4 junior teams. Pocho: “Give each team 3/4 of a wheel!” Is that a valid share? ✔ no: a cut wheel can't be used ✘ yes: we always cut objects → the teams take turns with whole wheels; Chispa keeps a full spare. |
| G06-04-L02 A fraction names a quotient | Coolant for the radiators. *Example:* 7 L shared among 4 tanks: 7/4 L = 1 3/4 L each. | 5 L of coolant are shared equally among 3 radiators. How much in each? ✔ 5/3 L ✘ 3/5 L (divided in the wrong order) → 🔧 cooling filled: the engine will not overheat on the climb. | How do we check that the share is exact? ✔ 3 × 5/3 = 5 L ✘ 5/3 + 3 = 5 L → Marga's check is green on the screen. |
| G06-04-L03 Divide to obtain a decimal | The dashboard shows only decimals. *Example:* 3 ÷ 4 = 0,75; 1 ÷ 3 = 0,333…, so 0,33 is only an approximation. | The battery is at 5/8. What should the display show exactly? ✔ 0,625 ✘ 0,58 (wrote the digits of the fraction) → 📡 dashboard calibrated. | A sign says “sharp curve at 2/3 of the stage”; the GPS shows 0,67. Which sign goes between 2/3 and 0,67? ✔ ≈ ✘ = → {name} brakes a little early; a clean corner. |
| G06-05-L01 A fraction of a quantity | The climb profile. *Example:* 3/4 of 28 bends are uphill: 28 ÷ 4 × 3 = 21. | The mountain stage is 35 km; 2/5 of it is the steep climb. How long is the climb? ✔ 14 km ✘ 7 km (took only one fifth) → ⚡ energy saved for exactly 14 km. | The battery holds 28 kWh; the plan uses 3/4 of it on the climb. Nico: “3/4 of 28 is more than 28, multiplying makes bigger!” Why is it less? ✔ we take a part smaller than the whole ✘ every multiplication makes smaller → 21 kWh used, 7 kWh left: 🔥 turbo at the pass. |
| G06-05-L02 Scale and count fractional portions | The turbo fluid tank. *Example:* half of 3/4 L is 3/8 L; in a fresh 3/4 L tank, 1/4 L shots give 3 shots. | The tank holds 2/3 L of turbo fluid; the rules allow half of it on the climb. How much is that? ✔ 1/3 L ✘ 2/6 + 1 L → 🔥 turbo used on the climb, still legal. | A fresh tank of 3/4 L; each turbo shot uses 1/8 L. How many shots? ✔ 6 ✘ 3 (counted quarters) → 🔥 six turbo marks light up on the dashboard. |
| G06-05-L03 Multiply and divide decimals | The descent and the final straight. *Example:* 1,2 × 0,4 = 0,48; 1,2 ÷ 0,3 = 12 ÷ 3 = 4. | Each braking uses 0,8 kWh; regenerative brakes recover 0,5 of it. How much is recovered per braking? ✔ 0,4 kWh ✘ 4 kWh (comma placed wrong) → ⚡ battery refills on the descent. | The final straight is 2,4 km; each turbo burst covers 0,6 km. How many bursts cover the straight? ✔ 4 ✘ 0,4 → **{name} wins by a nose over Nico!** 🏆 |

### Chapter 4 – Gran Premio de las Sierras (G06-06, G06-07) · 6 lessons · stage: fast circuit in the hills of Córdoba

*Opening.* Clima: warm and dry. A fast circuit with long straights. After the Andes, Chispa needs repairs and new parts. Marga opens the parts catalogue: “Let's buy smart.”

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G06-06-L01 Two quantities that grow together | Prices in the parts catalogue. *Example:* tire valves cost 3 credits each: 1 → 3, 2 → 6, 4 → 12; with 5 credits shipping: 8, 11, 17 — not proportional. | Each wing fin costs 5 credits, with no extra charges. Chispa needs 6. How much? ✔ 30 ✘ 11 (added 5 + 6) → 🔧 new wing: faster in corners. | Another shop sells fins at 5 credits each plus 3 credits fixed delivery. Is that cost proportional? ✔ no ✘ yes, because it increases → Marga buys from the first shop. |
| G06-06-L02 Find the value per one | Brakes and body tape. *Example:* 6 m of reinforced tape cost 24 credits: 4 per metre, so 9 m cost 36. | 3 sets of brake pads cost 21 credits at a constant price. The team needs 5 sets. How much? ✔ 35 ✘ 23 (added 2 to the cost) → 🔧 new brakes: later braking. | Tape costs 24 credits for 6 m. What unit does 24 ÷ 6 have? ✔ credits per metre ✘ metres per credit **(distractor changed** from “meters per notebook”, keeps the swapped-units error) → the price label is correct in the catalogue. |
| G06-06-L03 Proportional table and graph | Energy use on the straight. In this model Chispa uses 3 energy units per km and nothing when not moving. *Example:* table (0, 0), (1, 3), (2, 6), (3, 9) on a line through the origin. | The qualifying sprint is 2,5 km. How much energy? ✔ 7,5 ✘ 5,5 (added 2,5 + 3) → 📡 energy graph on the pit wall. | What does the point (0, 0) mean here? ✔ 0 km use 0 energy ✘ there is always a fixed cost → ⚡ the graph is trusted: {name} uses the extra energy as a boost. |
| G06-07-L01 Fixed work and equal teams | Rebuilding the engine overnight. *Example:* the job takes one mechanic 24 hours; 2 take 12, 4 take 6, if they work at the same rate and the job can be split. | Under these conditions, how long do 3 mechanics take? ✔ 8 hours ✘ 72 hours (multiplied) → 🔧 engine ready by morning. | Which condition do we need to use this model? ✔ equal rate and work that can be split ✘ only knowing there are more people → Marga gives each mechanic a separate part of the engine. |
| G06-07-L02 A product that stays constant | The energy budget per lap. *Example:* 24 energy units: 2 laps → 12 per lap, 3 laps → 8, 6 laps → 4; laps × units = 24. | The plan was 5 laps at 6 units each. The race is extended to 10 laps with the same total energy. How much per lap? ✔ 3 ✘ 12 (doubled instead of halving) → ⚡ “modo ahorro” on: Chispa lasts the whole race. | Átomo's strategy screen glitches and types 0 laps into y = 24 ÷ x. Can we share among 0 laps? ✔ no: we can't divide by zero ✘ yes: each lap gets zero → the glitch is fixed; the strategy loads. |
| G06-07-L03 Direct, inverse, or neither | Speed and time on a 30 km stage. *Example:* table A y = 4x (direct), B y = 24/x (inverse), C y = x + 5 (neither). | Marga's table for the stage: (2 km/min, 15 min), (3, 10), (5, 6). What do the pairs have? ✔ constant product 30 ✘ constant ratio 30 → 🏁 {name} understands: faster pace, less time; Chispa attacks. | Laps left = 10 − laps done. Pocho: “It goes down, so it's inverse!” Is it inverse proportional? ✔ no: 2 × 8 = 16 but 3 × 7 = 21 ✘ yes, because it decreases → ⏱ pit call at the right lap: **{name} wins with a perfect stop.** 🏆 |

### Chapter 5 – Gran Premio de la Selva (G06-08) · 3 lessons · stage: rain race in Misiones, near the Iguazú falls

*Opening.* Clima: tropical rain, red soil, humidity in the air. The dashboard shows everything in percent. Nico: “In the rain, the best tires win.”

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G06-08-L01 Percent means out of every hundred | The dashboard in percent. *Example:* a 100-cell battery icon with 25 cells lit: 25 % = 25/100 = 1/4 = 0,25. | The battery shows 40 %. The strategy software needs a decimal. Which one? ✔ 0,4 ✘ 40 → 📡 strategy updated. | Rain covers 3/4 of the track. The weather board shows percent. Which percent? ✔ 75 % ✘ 34 % (wrote the digits 3 and 4) → 🔧 rain tires chosen. |
| G06-08-L02 Percent of a quantity | Turbo power. *Example:* 15 % of 240 = 10 % + 5 % = 24 + 12 = 36. | Chispa runs at 150 km/h; the turbo adds 20 % of that speed. How many km/h does it add? ✔ 30 km/h ✘ 20 km/h (took the percent as the amount) → 🔥 turbo: 180 km/h on the straight. | Two energy pickups: A gives 50 % of 60 units, B gives 25 % of 160 units. Which gives more? ✔ B: 40 units ✘ A: 50 % sounds bigger → 🛣 {name} takes the lane with pickup B. |
| G06-08-L03 Discount and unknown whole | The circuit shop and the race length. *Example:* rain visor costs 500 credits with 20 % off: 400; if 80 % is 400, 1 % is 5 and 100 % is 500. | Rain tires cost 80 credits with a 25 % discount. How much does the team pay? ✔ 60 ✘ 20 (paid only the discount) → 🔧 rain tires on Chispa. | At half distance the board says “35 km done = 50 %”. How long is the race? ✔ 70 km ✘ 17,5 km (took half again) → ⚡ energy planned for the remaining 35 km: **{name} finishes 2nd in the storm, Nico 3rd.** 🏆 |

### Chapter 6 – Gran Premio del Viento (G06-09, G06-10) · 6 lessons · stage: Patagonian circuit with alternative routes

*Opening.* Clima: strong wind from the west, open steppe. The paddock is built from tents and barriers. This circuit has two **rutas alternativas**: only teams with a correct map calculation may use them.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G06-09-L01 Boundary and surface | The team's pit area is 6 m × 4 m. *Example:* barrier around it 6 + 4 + 6 + 4 = 20 m; floor mats 24 m². | The wind blows things away: the team must put a safety barrier around its rectangular pit area. Which measure is needed? ✔ perimeter ✘ area → ⏱ barrier up: tools stay in place. | The rubber floor of the pit box measures 5 m × 3 m. How much mat is needed? ✔ 15 m² ✘ 16 m (calculated the border) → ⏱ non-slip floor: the crew moves faster. |
| G06-09-L02 Decompose surfaces | The tent floor. *Example:* 8 × 6 m with a 3 × 2 m corner removed: 48 − 6 = 42 m², or 5 × 6 + 3 × 4. | The tent floor is 7 m × 5 m; a 2 m × 2 m corner holds the tool cabinet. How much floor needs mats? ✔ 31 m² ✘ 33 m² (subtracted the side 2 instead of the corner's area 2 × 2) → the mats arrive in exactly the right amount. | Pocho cut mat pieces that overlap a little. When can we add the pieces' areas to get the total? ✔ when they cover the floor without overlapping ✘ the same parts can be counted twice → Pocho recuts the pieces; the floor is flat. |
| G06-09-L03 Same perimeter, different area | The solar charging pad. *Example:* rectangles 6 × 4 and 8 × 2 both have perimeter 20 m but areas 24 and 16 m². | The pad must be edged with 20 m of cable. A square of side 5 m is one option. What is its area? ✔ 25 m² ✘ 20 m² (used the perimeter) → ⚡ the bigger pad charges Chispa faster. | Two tent options both have 12 m² of floor. Pocho: “Then they need the same wind fence.” Is that true? ✔ no: 3 × 4 and 2 × 6 give 14 m and 16 m ✘ yes, always → the 3 × 4 tent needs less fence; it is set up before the wind gets stronger. |
| G06-10-L01 A scale preserves proportions | The wind-tunnel model of Chispa. *Example:* the model at 1:100: 1 cm on the model = 100 cm = 1 m on the car. | The second model is at scale 1:50. What does 1 cm on the model represent? ✔ 50 real cm ✘ 50 real m → 🔧 wind-tunnel test valid: a new rear wing against the wind. | Pocho wants to make the model narrower only in width, to fit the tunnel. Can we halve the width and keep the length? ✔ no: the shape would be distorted ✘ yes → the model stays proportional; the test results are trusted. |
| G06-10-L02 From plan to real distance | The circuit map at **scale 1:10.000 (changed** from 1:200, same operation: multiply by the factor, then convert cm → m). *Example:* the main route measures 7,5 cm: 7,5 × 10.000 = 75.000 cm = 750 m. | The alternative route measures 3 cm on the map. How long is it in reality? ✔ 300 m ✘ 30.000 m (did not convert cm to m) → 🛣 alternative route open: shorter than the main route. | Why do we divide 30.000 cm by 100 to get metres? ✔ each metre groups 100 cm ✘ because the map always divides by one hundred → 🛣 navigation loaded into Chispa. |
| G06-10-L03 Construct your own plan | {name} draws the pit-box plan for the race officials. *Example:* the box is 12 m × 8 m; at 1:200 it is 6 cm × 4 cm. | The pit entrance is 2 m wide. How wide is it on the 1:200 plan? ✔ 1 cm ✘ 2 cm (did not apply the scale) → ⏱ plan approved: the team gets the box closest to the pit exit. | What must go with the drawing so others can read distances? ✔ scale and units ✘ only colours → **{name} takes the alternative route on the last lap and wins!** 🏆 |

### Chapter 7 – Gran Premio del Fin del Mundo (G06-11, G06-12) · 6 lessons · stage: night race in Ushuaia

*Opening.* Clima: cold, early darkness, wet asphalt. At night the driver sees little; the team races with telemetry graphs and data. Nico and {name} are now close in the standings.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G06-11-L01 Choose a graph for the question | Marga sets up the pit-wall screens. *Example:* bars for tire choices of the teams; connected points for track temperature every hour. | Marga wants to compare how many teams chose soft, medium, and hard tires. Which graph? ✔ bars ✘ a line that assumes continuity between categories → 🔧 {name} chooses the tire most teams avoided — less traffic in the pits. | A telemetry axis only says 5, 10, 15. What is missing? ✔ what quantity and unit it shows ✘ a decoration → 📡 the axis gets “tire wear (%)”; the graph is readable. |
| G06-11-L02 From a table to points and bars | The fan vote and the laps-led board. *Example:* 20 fans: A 8, B 6, C 6; axis from 0 in steps of 2. | On the board each block = 3 laps led. {name} led 12 laps. How many blocks? ✔ 4 ✘ 12 → 🏁 the board shows {name}'s lead correctly. | Fans vote the best overtake: A ({name}) 8, B 6, C 6. Nico: “A got double B!” What does the table justify? ✔ A has 2 more votes than B ✘ A has twice as many as B → 🏆 {name}'s overtake wins the prize — with an honest claim. |
| G06-11-L03 Scales that exaggerate | Nico's team poster. *Example:* bars 50 and 55 with the axis starting at 49 look like 1 and 6. | The poster shows Viento Sur's top speed 55 and Chispa's 50 on an axis starting at 49. Is 55 six times 50? ✔ no ✘ yes, if the axis starts at 49 → {name} keeps the setup; no unnecessary changes before the race. | Pocho's wear graph has equally spaced marks 0, 10, 30. What is wrong? ✔ equal spaces show different increases ✘ nothing → ⏱ Marga redraws it, sees the real wear, and calls the pit stop on time. |
| G06-12-L01 Mean as balanced sharing | Battery balancing. *Example:* modules with 2, 4, 6 units balance to 4, 4, 4. | Three battery modules hold 1, 3, and 8 units. The balancer levels them. How much in each? ✔ 4 ✘ 3 (took the middle value) → ⚡ balanced battery: steady power at night. | What stays the same during balancing? ✔ the total energy ✘ each module's level → 📡 Marga checks: 12 units before and after. |
| G06-12-L02 Calculate a mean | Turbo gains. *Example:* pit times 3, 5, 6, 10 s: total 24, mean 6 s; check 6 × 4 = 24. | Turbo gains in four laps: 0, 4, 4, and 8 tenths of a second (in lap 1 the turbo failed). What is the mean gain? ✔ 4 tenths ✘ 16/3 (left out the zero) → 🔥 Marga plans turbo use from an honest average. | All pit stops took between 3 and 10 seconds. Pocho's stopwatch says the mean was 14 s. Can that be? ✔ no: the mean lies between minimum and maximum ✘ yes, always → ⏱ broken stopwatch replaced. |
| G06-12-L03 What the mean does not tell | Two pit crews. *Example:* crew A: 4, 4, 4, 4 s; crew B: 1, 1, 1, 13 s — both mean 4. | Viento Sur's stops: 2, 2, 2, 10 s. What are the mean and the mode? ✔ mean 4, mode 2 ✘ mean 2, mode 4 → 📡 Marga sees one slow stop hidden in Nico's average. | Does the same mean guarantee the same stops every time? ✔ no ✘ yes → ⏱ Marga trusts the steady crew. **{name} and Nico arrive at the Grand Final with equal points.** 🏆 |

### Chapter 8 – La Gran Final (G06-13) · 3 lessons · stage: the Grand Final back in Buenos Aires

*Opening.* Both teams are level. The final circuit is new, with a large pit area to set up. Marga: “Everything we learned this season, in one race.” The open project of the lesson package becomes the team's own pit-area plan.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G06-13-L01 Review before the project | Simulator checklist before the final. *Example:* 3/4 of 40 laps = 30; 4 m of tape for 28 credits → 7 per m; a 5 × 3 m box: 15 m², 16 m. | The battery holds 64 units; the final turbo uses 25 % of it. How many units? ✔ 16 ✘ 25 → 🔥 final turbo reserved. | In the simulator Átomo notices that {name} mixes metres and square metres on the pit plan. Which topic to review? ✔ boundary and surface ✘ only Roman numerals → 🔧 driver upgrade: {name} repeats exactly that lesson and gains confidence. |
| G06-13-L02 The final pit-area plan | The final pit area is 20 m × 12 m; 25 % is reserved for the fan zone. *Example:* area 240 m², perimeter 64 m, plan 10 × 6 cm at 1:200. | The fan zone takes 25 % = 60 m². What area stays for the team? ✔ 180 m² ✘ 215 m² (subtracted 25 instead of 25 %) → ⏱ team area laid out. | 24 water bottles and 36 towels go into crew kits with equal contents and nothing left over. Why at most 12 kits? ✔ 12 is the greatest common divisor of 24 and 36 ✘ dividing the 24 bottles by 12 is enough → ⏱ 12 kits: every crew position is ready. |
| G06-13-L03 Defend and correct the plan | The final laps. *Example:* the team writes a short race report with table, graph from zero, labelled plan, and one correction. | Energy recovered in the last four laps: 10, 14, 16, 20 units. Viento Sur's engineer says the mean is 20. Which calculation shows the mean is 15? ✔ 15 × 4 = 60, the total ✘ 15 is the greatest value → ⚡ Marga plans the last attack with 60 units. | To unlock the “super turbo” the team needs 25 % of 240 energy units. Pocho calculated 25 units. What must be corrected? ✔ apply 25/100 to the whole 240: 60 units ✘ only change the colour of the plan → 🔥 super turbo on the final straight: **{name} wins the Copa Mundoki by a few centimetres!** 🏆 |

*Epilogue.* Podium: {name} first, Nico second. Nico hugs {name}: “Next season, a rematch.” Marga shows the season's telemetry: every boost, every upgrade, every correct route — all of them came from a calculation. Pocho admits: “A ojo, no. With numbers, yes.” The final project card opens: design your own pit area and defend it (existing `GRADE_SIX_PROJECT`, re-themed).

---

## 6. Notes for implementation (later, not part of this draft)

- `oceanAdventure.ts` → a new `racingAdventure.ts`: 8 chapters instead of the current scene list; scene states: `garage`, `river`, `andes`, `sierras`, `jungle`, `wind`, `night`, `final`.
- Each challenge carries an effect type (`boost`, `turbo`, `route`, `upgrade`, `pit`, `slipstream`, `telemetry`, `position`) so the UI can animate the right one; the reward text still names the specific object from the challenge.
- Rewrite `checks[i]` prompts in `numbers.ts`, `rational.ts`, `proportions.ts`, `space.ts`, `data.ts` together with `hints.ts`, explanations, and worked examples (lesson-authoring skill: one unit = intro + check + hint + explanation + reward).
- Changed items to re-test: G06-06-L02 task 2 distractor; G06-10-L02 scale 1:200 → 1:10.000 (example and both tasks).
- Re-theme `GRADE_SIX_PROJECT` (schoolyard → pit area of the Grand Final) only if the user approves; the mathematics of the rubric stays the same.
