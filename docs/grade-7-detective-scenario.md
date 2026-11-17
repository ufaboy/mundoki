# Grade 7 – scenario plan for “Agencia Lupa and the Riddles of the Sphinx”

Draft game layer to replace the current Grade 7 story (`src/content/grade7/parkAdventure.ts`, a park-design project). The educational content and the order of the lessons do not change: 11 packages G07-01 … G07-11, **33 lessons, 2 tasks per lesson = 66 tasks** (`docs/lesson-creation-plan.md`, section Grade 7; `src/content/grade7/README.md`). What changes: the scenes, who needs each answer and why, and what the detectives learn after a correct answer.

Decisions made (November 2026):

- The game is a **detective story**: the learner investigates, solves riddles, and collects evidence.
- **One big case for the whole year + an episode per chapter.** Each chapter is a closed mini-investigation that also gives one clue to the big case.
- **Mysteries and riddles only, no crimes.** Nobody steals, hurts, or cheats. The “suspects” are candidates for *who is the mysterious riddle-maker*; the “false clues” are friendly mistakes or pranks.
- **Setting: Buenos Aires, real neighbourhoods** (Boedo, Avenida de Mayo, San Telmo, La Boca, Palermo, Parque Centenario…). Places such as the school, the café, and the shops, and all people, are fictional.
- **Task numbers may change** to fit the investigation, as long as the lesson objective, the difficulty, and the typical-error distractor stay the same. Every changed task below lists its new numbers; the current check it replaces is kept in spirit.
- 11 chapters = 11 packages, 3 lessons each. **Chapters 5 (G07-05) and 10 (G07-10) are side cases** (*expedientes extra*): the README marks these packages as additional explorations that nothing is locked behind, so the main case never depends on them.
- Status: **implemented** (November 2026): `src/content/grade7/detectiveStory.ts`, `DetectiveLesson.astro`, `DetectiveMap.astro`, `DetectiveScene.astro`, `DetectivePuzzle.astro`, `CandidateBoard.astro`, `src/scripts/detectiveAdventure.ts`; tests in `src/tests/detectiveAdventureSuite.ts`. Learner-facing texts exist in es-AR and en-US with the same numbers and meaning.

The task texts below are planning wording, not final copy.

---

## 1. Story bible

**World.** Buenos Aires today. `{name}` is in **7.º grado**, the last year of primaria in CABA, at a fictional neighbourhood school in **Boedo**, *Escuela N.º 7 “Rayuela”*. With a classmate they run a small school detective club, **Agencia Lupa**.

**The big case.** On the first day of the school year an envelope appears in the school library. It is sealed with a drawing of a sphinx and says: *«Si estás en séptimo, seguí los números. — La Esfinge.»* Each riddle leads to a place in the city and to the next riddle. Who is the Sphinx, and where do the riddles end?

**The answer (revealed only in Chapter 11).** Fifty years ago the school’s very first 7.º grado buried a **time capsule** in the schoolyard and forgot where. One of those pupils, **Don Aurelio Ríos**, is now the school caretaker; for years he wrote the riddle column of a newspaper under the pen name *La Esfinge*. He prepared the riddle trail so that this year’s egresados (the graduating 7.º grado) would find the capsule. Señora Inés, the librarian, helped him place the envelopes. Nothing bad happened at any point: the mystery is a gift.

**Characters.**

| Character | Role |
|---|---|
| `{name}` (Tomi or Lola) | Lead detective of Agencia Lupa. Makes the decisions; the learner does the maths. |
| **Juli**, partner detective | Keeps the case notebook (*cuaderno del caso*) and the evidence board. Careful, asks “¿cómo lo sabemos?”. Voices the “why” questions. |
| **Átomo**, the robot fox | Hints only (`hints.ts`). A fox with a magnifying-glass eye that “sniffs” the important number. Never gives the answer. |
| **Los Halcones** | A friendly rival club from the other 7.º grado section. Fast, confident, often jump to conclusions: they voice the typical-error distractors. They join Agencia Lupa for the finale. |
| **La Esfinge** | Never seen. Speaks only through notes in typewriter letters, always polite and a little funny. |
| **The candidates** | Four adults who might be the Sphinx (see below). Each is kind and helpful; investigating them is a game, not an accusation. |

**The candidate board (who could be the Sphinx?).** The evidence board starts with four candidate cards. The main chapters add or remove marks; the learner can see why.

| Candidate | Who | Ruled in / out |
|---|---|---|
| **Don Aurelio**, school caretaker, rides a bicycle | the Sphinx | could reach the café by 9:10 (Ch. 3); the courier sender came by bicycle (Ch. 3); the parcel was posted in Boedo near the school (Ch. 8); the riddle column was signed *A. Ríos* (Ch. 9); class photo (Ch. 5, extra); named by the learner, then confirms (Ch. 11) |
| **Señora Inés**, librarian | the helper | seen in the library at 9:05, too far to reach the café by 9:10 (Ch. 3), so she did not deliver it; but a Palermo note is written on a library index card (Ch. 6): she is involved somehow; revealed as the helper (Ch. 11) |
| **Ramón**, waiter at the café | not the Sphinx | was at the café, so possible (Ch. 3); the café delivery bike also fits the courier clue (Ch. 3); was on his café shift when the parcel was posted in Boedo (Ch. 8) ✘ |
| **Profe Clara**, math teacher | not the Sphinx | at 9:00 she was too far away to reach the café by 9:10 (Ch. 3) ✘ |

The board is a real logic puzzle: no single clue names the Sphinx. Each main chapter adds at most one mark, and the learner names the Sphinx before anyone confesses (Chapter 11).

**Money.** Purchases (a used book, tables for the party) are paid in **lupas**, the game currency of the club’s cash box (an icon of a small magnifying glass). Amounts are small and fictional, so no real price goes out of date. The café receipts in Chapter 2 are old receipts from the Sphinx’s youth and carry no currency.

**Distances.** In Buenos Aires people measure walks in *cuadras* (blocks). The story says once, with a picture: **1 cuadra ≈ 100 m, so 10 cuadras ≈ 1 km.** All speeds are in cuadras per minute; 2,5 cuadras per minute ≈ 15 km/h, a normal bicycle speed.

**Tone.** Curious, clever, a little funny, never scary. Every task answers a real question of the investigation: which locker, which table, who could have been there, which receipt matches, where to dig.

---

## 2. Game elements

| Element | How it works | Link to lessons |
|---|---|---|
| **Evidence board** (*tablero del caso*) | Every correct answer pins one evidence card on a corkboard (66 cards). A red string links it to the chapter’s place on the city map. | Progress display; replaces the park build. |
| **City map** | A map of CABA with 11 pins (school, café, transport, San Telmo, La Boca, Palermo, print shop, post office, newspaper archive, Parque Centenario, schoolyard). A pin lights when its chapter is solved. | Chapter = place. |
| **Torn map of the Sphinx** | Each **main** chapter (1–4, 6–9) ends with one piece of an old torn map: 8 pieces. In Chapter 11 the pieces form the schoolyard plan. | Gives the year-long goal a visible collection. |
| **Number cipher** | On the back of each map piece is a number: 1, 3, 6, 10, 15, 21, 28, 36 (piece *k* shows 1 + 2 + … + *k*). The capsule’s two-digit lock needs the next number. The learner sees the sequence grow all year; in Chapter 11 they find the rule and open the lock with **45**. | Sequences and patterns (extends G07-04). Story step, not a lesson check. |
| **Logic riddle of the Sphinx** | One optional riddle per chapter (section 6): truth-tellers, elimination grids, “if… then…”. Solving it gives a gold evidence card; skipping it blocks nothing. | Logical reasoning, beyond the 66 lesson checks. |
| **Final deduction** | Before the confession, the learner names the Sphinx from the candidate board and picks the evidence that rules out each other candidate. | Argumentation (Aprender: *resolución de problemas*). Story step, not a lesson check. |
| **Candidate board** | Four candidate cards; evidence adds ✔ or ✘ marks with a one-line reason. | Logic and data comparison (Ch. 3, 9, 11). |
| **False clue of the Halcones** | In most chapters the Halcones propose a quick conclusion. Task 2 often asks the learner to test it. A refuted false clue is stamped *PISTA FALSA*. | Typical errors, counterexamples, reasoning (type D items). |
| **Sphinx’s challenge** (*Desafío de la Esfinge*) | The open exit task of each lesson, written as a riddle in typewriter letters. Optional; reviewed by an adult with the existing rubric. | Existing `exit` field; open explanations. |
| **Side cases** | Chapters 5 and 10 open as yellow folders marked *Expediente extra*. Their rewards are bonus clues (an old photo, a lucky coin) that add details to the finale but are never required. | G07-05 and G07-10 stay unlocked and optional. |
| **Detective rank** | Badges after Chapters 3, 6, 9, 11: *Aprendiz*, *Detective*, *Detective principal*, *Detective de la Esfinge* (gender-neutral in Spanish). | Motivation over a long year. |

---

## 3. Writing for 12–13-year-olds

- Sentences up to about 20 words. First the situation, then one question. A riddle note may be a little old-fashioned in style, but its maths must be unambiguous.
- Detective words, explained once with a picture: *pista* (clue), *coartada* (alibi), *sospecha*, *hipótesis*, *expediente*, *contraejemplo*, *registro*, *testigo* (witness).
- A number always comes with its unit or object: «20 cuadras en 8 minutos», «escala 1:20.000», «2 × 2 × 6 cm».
- es-AR number format: `3,5`, `1.000`, `25 %`. The answer checker accepts both `,` and `.`.
- es-AR uses voseo (*fijate, calculá, comprobá, explicá*). `{name}` only in chapter openings, rewards, and the epilogue.
- “Why” answers are one sentence in the child’s words. Two answer options per task; the wrong one is a typical error, often voiced by the Halcones.
- No crime vocabulary (*robo, ladrón, culpable, arresto*). Use *misterio, enigma, quién envía los sobres, a quién corresponde la pista*.

---

## 4. Link to the Argentine Year 7 expectations (`docs/ARG_deep_research.md`)

| Year 7 benchmark | Where in the scenario |
|---|---|
| Natural and rational numbers; the decimal system; formal properties of divisibility | Ch. 1: shelf numbers, remainders, lockers, refuting the Sphinx’s false rule |
| Different ways to calculate with natural numbers, fractions, and decimals; judging if a result is reasonable | Ch. 2: old receipts and recipes at the café; Halcones’ impossible result |
| Direct proportionality; relations between quantities; percentages and scale | Ch. 3: speed and the alibi table, courier rates on a graph, city map scale, a discount |
| First systematic algebraic generalisations | Ch. 4: iron gate patterns in San Telmo; rule for the n-th gate |
| Formulas; table ↔ formula ↔ graph (PBA 1.º secundaria axis *Introducción al Álgebra*) | Ch. 5 (side case): picture frames in La Boca |
| Angles and geometric reasoning; properties of figures | Ch. 6: street angles in Palermo, triangular square, locating a point with compass arcs |
| How area and perimeter change | Ch. 7: photo enlargements, garden beds with the same fence |
| Properties of solids | Ch. 8: the Sphinx’s puzzle box, nets, cubes, wrapping paper |
| Statistical graphs and the mean | Ch. 9: a misleading bar chart, mean and mode, comparing two groups of letters |
| Experimental probability (PBA axis *Probabilidad y Estadística*) | Ch. 10 (side case): dice, a bag of marbles, a coin at the school fair |
| Problem solving: recognise information, choose procedures, check reasonableness, argue (*Aprender*) | Ch. 11: the schoolyard plan, the party budget, the final report; task 2 of most lessons |

The six detective skills from the request map to the chapters as follows: **patterns** (Ch. 1, 4), **tables** (Ch. 3 alibi table, 5, 9), **comparing data** (Ch. 3, 9), **sequences** (Ch. 4, 10, the number cipher all year), **logic** (counterexamples in Ch. 1, 6, 7, 8, 11; the candidate board; an optional logic riddle in every chapter; the final deduction), **graphs** (Ch. 3, 5, 9). The speed–distance–time alibi from the request is Chapter 3, lesson 1.

Honest notes:

- This is an editorial game layer, not a curriculum certification. The CABA alignment of individual indicators still needs the verified documents listed in `ARG_deep_research.md`.
- G07-05 and G07-10 remain additional explorations, as in the current README.

---

## 5. Scenario plan by lesson

Notation: **✔** correct answer, **✘** wrong option (the typical error in brackets), **→** what the detectives learn or what changes on the board. *Example* = the worked example under the mission header: same scene, different numbers.

### Chapter 1 – The first envelope (G07-01) · school library, Boedo · 3 lessons · piece 1 of the torn map

*Opening.* First day of 7.º grado. In the library, Juli finds a sealed envelope with a sphinx drawn on it: *«Si estás en séptimo, seguí los números. — La Esfinge.»* Inside: a list of shelf numbers and a small padlock with one digit wheel. Señora Inés says she has no idea who left it.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-01-L01 Decompose to explain | The note: *«352 y 325 guardan el mismo secreto ante el 9.»* *Example:* 352 = 3 × 99 + 5 × 9 + 10 and 325 = 3 × 99 + 2 × 9 + 10: same remainder when divided by 9. | The note continues: *«El libro está en la página que vale el 4 de 2405.»* Which page? ✔ 400 ✘ 40 (read the tens place) → page 400 of the old atlas hides a second note. | The padlock opens with *«el resto de 451 al dividir por 9»*. Which digit? ✔ 1 ✘ 10 (stopped at the digit sum; a remainder is less than 9) → the padlock clicks open. |
| G07-01-L02 Properties of divisibility | Inside the padlocked box: book cards in bundles. *Example:* 18 and 30 cards are bundles of 6, so 18 + 30 = 6 × 8 and 30 − 18 = 6 × 2 are bundles of 6 too. | Two carts hold 35 and 45 books in rows of 5. Without counting, what is the total? ✔ another multiple of 5 ✘ always a prime number → all 80 books fit in rows of 5; the shelf behind them shows a locker key. | The Halcones say: *“2 + 4 = 6 is divisible by 3, so the boxes of 2 and of 4 books can each be split into 3 equal groups.”* Is that right? ✔ no ✘ yes (a divisible sum does not make each addend divisible) → **first PISTA FALSA stamp.** |
| G07-01-L03 One example is not a general proof | The key opens a cabinet with lockers 11 and 15. A riddle on the door: *«Todo impar mayor que uno es primo. Abrí el casillero que me desmiente.»* *Example:* 3, 5, 7 agree; 9 = 3 × 3 is odd and not prime. | Which locker shows the rule is false? ✔ 15 (= 3 × 5) ✘ 11 (one more agreeing example) → locker 15 opens: a café napkin with the address of a café on Avenida de Mayo. | A last line on the napkin: *«Los primos son impares… salvo uno.»* Why is 2 the exception? ✔ it is prime and even ✘ it is not prime → **Chapter solved: piece 1 of the torn map.** |

### Chapter 2 – The café on Avenida de Mayo (G07-02) · 3 lessons · piece 2

*Opening.* An old café with marble tables. Ramón the waiter keeps a box of receipts and recipe cards “that a regular customer left for the kids who would come asking”. Every card has a calculation.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-02-L01 Choose a useful representation | Old receipts in fractions, the café’s measuring jugs in decimals. *Example:* 1/3 + 1/6 of a jug = 1/2; three medialunas at 0,75 = 2,25. | A receipt says *7/8 L de chocolate*. Which mark on the decimal jug is exactly that? ✔ 0,875 L ✘ 0,87 L (a rounded value written as equal) → the jug matches; under it, the next card. | The card shows *0,33 + 0,33 + 0,33 = 1* with the Sphinx’s note *«¿exacto?»*. Is it? ✔ no, it is 0,99 ✘ yes → Juli writes in the notebook: *the Sphinx tests whether we check exactness.* |
| G07-02-L02 Mixed operations with meaning | A recipe card for the Sphinx’s favourite *submarino*. *Example:* 3/4 L of milk + 2 × 1/8 L of cream = 1 L. | The recipe: *1/2 taza + 3 × 1/6 taza de cacao*. How many cups of cocoa? ✔ 1 ✘ 7/12 (added before multiplying) → Ramón makes the drink; the cup has a number at the bottom. | *(0,6 + 0,4) ÷ 2 kg de café* go into two jars. How much in each? ✔ 0,5 kg ✘ 0,8 kg (divided only 0,4) → the jars are filled; one jar label says *«mesa»*. |
| G07-02-L03 Estimate first and verify afterward | *Example:* 3,6 L of coffee in cups of 0,4 L: more than 3,6 cups; 36 ÷ 4 = 9; check 9 × 0,4 = 3,6. | The jar note: *«Cuántas tazas de 0,3 L salen de 2,4 L: esa es mi mesa.»* ✔ 8 ✘ 0,8 (dividing by less than one makes the result larger) → under table 8: an envelope and a courier receipt. | The Halcones arrive: *“5 coffees at 0,2 each cost more than 5.”* Can 5 × 0,2 be greater than 5? ✔ no, it is 1 ✘ yes, every product increases → **Chapter solved: piece 2.** Ramón remembers: *“The envelope was left at 9:10.”* |

### Chapter 3 – Who could have been there? (G07-03) · transport and Avenida Corrientes · 3 lessons · piece 3

*Opening.* The case gets serious: who left the envelope at the café at 9:10? Juli draws an **alibi table** with, for each candidate, where they were at 9:00, how far that is from the café, and how they travel:

| Candidate | At 9:00 | Distance to the café | Travels by |
|---|---|---|---|
| Don Aurelio | leaves the school | 25 cuadras | bicycle |
| Profe Clara | leaves her home | 30 cuadras | colectivo |
| Señora Inés | in the school library (the detectives see her there at 9:05) | 25 cuadras | — |
| Ramón | already working at the café | 0 cuadras | — |

The speeds are found in lesson 1; the table is completed in its task 2.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-03-L01 Unit rates let us compare | Each candidate’s trip, in cuadras and minutes. *Example:* Profe Clara’s colectivo did 30 cuadras in 15 min: 30 ÷ 15 = 2 cuadras per minute. | Don Aurelio’s bicycle did 20 cuadras in 8 min. How many cuadras per minute? ✔ 2,5 ✘ 160 (multiplied instead of dividing) → Aurelio’s speed goes on his card. | How can we compare trips of different lengths and times? ✔ by the distance in the same unit of time (cuadras per minute) ✘ by the total distance only → **Alibi table:** Aurelio: 25 ÷ 2,5 = 10 min, arrives 9:10 ✔ possible. Clara: 30 ÷ 2 = 15 min, arrives 9:15 ✘. Inés: still in the library at 9:05; even by bicycle she would need 10 min and arrive 9:15 ✘. Ramón: at the café ✔ possible. Two candidates remain. |
| G07-03-L02 Table and graph of a proportion | The courier receipt from table 8: *3 km, total 14*. Two courier companies are in the phone book. *Example:* Mensajería Rayo charges 4 per km, no fixed fee: y = 4x; table (0; 0), (1; 4), (2; 8). | For Rayo, y = 4x. What does a 2,5 km trip cost? ✔ 10 ✘ 6,5 (added 4 instead of multiplying) → the point (2,5; 10) is on Rayo’s line, which starts at (0; 0). | Mensajería Cóndor charges y = 4x + 2. Why is its price not proportional to the distance? ✔ the ratio y/x changes ✘ because it does not increase → the receipt (3 km → 14) fits only Cóndor’s line. Cóndor’s register: the signature is unreadable, but the clerk remembers *“came by bicycle”*. Both remaining candidates fit: Aurelio rides a bicycle, and the café has a delivery bike that Ramón uses. |
| G07-03-L03 Percentages and scales | The envelope holds a map of the city, scale 1:20.000, and an advert for a used bookshop on Corrientes. *Example:* 3 cm on the map = 60.000 cm = 600 m. | The bookshop is 5 cm from the café on the map. How far is it really? ✔ 1 km ✘ 100.000 m (did not convert centimetres) → the detectives walk 10 cuadras to the bookshop. | The book with the next riddle costs 80 lupas, with 25 % off for students. How much do they pay from the club’s box? ✔ 60 lupas ✘ 20 lupas (that is the discount, not the price) → **Chapter solved: piece 3, rank *Aprendiz*.** The book has a pencil mark: *Defensa 1000, San Telmo.* |

### Chapter 4 – The iron gates of San Telmo (G07-04) · 3 lessons · piece 4

*Opening.* Sunday market on calle Defensa. Old houses have iron gates made of square frames that share bars. The Sphinx’s riddle: *«Contá mis barrotes y encontrarás mi puerta.»*

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-04-L01 A row of squares | A gate of squares in a row; each new square shares one bar. *Example:* 1 square = 4 bars, 2 = 7, 3 = 10. | A gate has 4 squares in a row. How many bars? ✔ 13 ✘ 16 (counted shared bars twice) → the counting matches the real gate. | How many bars does each new square add? ✔ 3 ✘ 4 → Juli writes the pattern 4, 7, 10, 13 in the notebook. |
| G07-04-L02 State a general rule | The riddle names a gate of 20 squares. *Example:* 4 + 3 × 19 = 61, or 20 top + 20 bottom + 21 upright = 61. | For a gate of 12 squares, how many squares come after the first? ✔ 11 ✘ 12 (counted the first one again) → 4 + 3 × 11 = 37 bars; that gate is a decoy with a note *«Más corto.»* | The Halcones saw three gates with 4, 7, 10 bars and say the rule is now certain. Are three numbers enough? ✔ no, we must know how the gate is built ✘ yes → **PISTA FALSA**: their guessed door is wrong. |
| G07-04-L03 A letter for any position | *«Mi puerta es 3n + 1.»* *Example:* n squares → 4 + 3(n − 1) = 3n + 1; for n = 8: 25. | The riddle adds: *«…con n = 6.»* What is the door number? ✔ 19 ✘ 37 (wrote 3 and 6 side by side) → door 19: the antique dealer hands over a parcel. | Could a gate have n = 2,5 squares? ✔ no, n counts whole squares ✘ yes → **Chapter solved: piece 4.** In the parcel: a gate key and a ticket for La Boca. |

### Chapter 5 – Side case: the unsigned frame (G07-05) · La Boca · 3 lessons · bonus clue: the old class photo

*Opening.* Yellow folder: *Expediente extra.* In a framing workshop near Caminito, a frame-maker kept an order “for the kids of Agencia Lupa”: an old photo that needs a frame. The order card says only *P = 2w + 4*, frames 2 cm high.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-05-L01 What can vary | Narrow frames, height fixed at 2 cm, width w cm. *Example:* w + 2 + w + 2 = 2w + 4. | On the order card, what does w mean? ✔ the width in cm ✘ the area in cm² → the frame-maker nods: the formula is about the moulding strip. | Which unit belongs to P? ✔ cm ✘ cm² (perimeter is a length) → she picks the right roll of moulding. |
| G07-05-L02 Substitute and check | *Example:* w = 3,5: 2 × 3,5 + 4 = 11 cm; check 3,5 + 2 + 3,5 + 2 = 11. | The photo is 7 cm wide. How much moulding? ✔ 18 cm ✘ 22 cm (calculated 2(w + 4)) → the strip is cut. | How can we check the length without the formula? ✔ add the four sides ✘ multiply width by height (that is the area) → the frame closes perfectly. |
| G07-05-L03 Three representations of a relationship | The workshop’s price chart: table, formula, and graph. *Example:* w = 1, 2, 3 → P = 6, 8, 10. | Which point belongs to the chart P = 2w + 4? ✔ (4; 12) ✘ (4; 8) → the chart is complete. | Is P directly proportional to w? ✔ no, P/w is 6 for w = 1 and 4 for w = 2 ✘ yes → **Side case closed. Bonus clue:** the framed photo shows the school’s first 7.º grado, 50 years ago; one boy holds a box and a shovel. |

### Chapter 6 – The angles of Palermo (G07-06) · 3 lessons · piece 5

*Opening.* The La Boca ticket leads to Palermo. The Sphinx’s note is a street plan with angles and the line *«No midas: deducí.»*

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-06-L01 Related angles | A diagonal avenue crosses a straight street. *Example:* 130° on one side of a straight line → 50° on the other. | The diagonal makes 72° with the street. What angle is on the other side of the same straight street? ✔ 108° ✘ 18° (used 90° instead of 180°) → the detectives choose the right sidewalk. | Across the crossing, opposite the 72° angle, what angle is there? ✔ 72° ✘ 108° (confused vertically opposite and adjacent) → it matches the corner on the note. |
| G07-06-L02 Properties for finding angles | A small triangular square at the corner. *Example:* 50° + 60° + 70° = 180°. | Two corners of the triangular square measure 35° and 85°. What is the third? ✔ 60° ✘ 240° (added instead of subtracting from 180°) → the bench at the 60° corner has a note under it. | The note shows a four-sided block. Why do its angles add up to 360°? ✔ a diagonal splits it into two triangles ✘ we assume four right angles → the block is found on the plan. The note is written on a **library index card** from the school: **Inés is involved somehow** (candidate board). |
| G07-06-L03 Construct and justify | The final point is hidden by distances on the plan. *Example:* a compass arc of radius 3 cm from A marks every point 3 cm from A. | The Halcones suggest three strings of 2, 4, and 7 cm to make the triangle on the plan. Can they form a triangle? ✔ no, 2 + 4 is less than 7 ✘ yes → **PISTA FALSA**; the detectives use the correct lengths. | What does an arc of radius 4 cm from one end of the base guarantee? ✔ the vertex is 4 cm from that end ✘ all angles measure 4° → **Chapter solved: piece 5, rank *Detective*.** The vertex marks a print shop. |

### Chapter 7 – The enlarged photo (G07-07) · print shop and community garden · 3 lessons · piece 6

*Opening.* The print shop owner has a small negative left by *«un señor muy amable»*. The Sphinx’s instruction: *«Ampliá con justicia.»*

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-07-L01 Enlarge every length | *Example:* a 3 × 5 cm photo enlarged by 2 is 6 × 10 cm and looks the same. | The negative is 2 × 7 cm and must be enlarged by 3. What size is the print? ✔ 6 × 21 cm ✘ 5 × 10 cm (added 3 to each side) → the print shows a garden with numbered beds. | The Halcones add 3 cm to both sides of their own copy. Does that keep the shape? ✔ no ✘ yes → their stretched copy is put aside. |
| G07-07-L02 Perimeter by k, area by k² | Paper and frame for the print. *Example:* factor 2: perimeter × 2, area × 4. | With factor 3 on the sides, how many times more paper does the print need? ✔ 9 ✘ 3 → the right sheet is bought. | Juli also wants a pocket copy with both sides halved. What happens to the frame length? ✔ it is halved ✘ it is divided by 4 → both copies are ready. |
| G07-07-L03 Same boundary length, different area | The photo leads to a community garden. The Sphinx: *«Mi cantero tiene el mismo cerco que su vecino, pero más tierra.»* *Example:* 5 × 5 and 7 × 3 have perimeter 20, areas 25 and 21. | The Halcones say beds 3 × 4 m and 2 × 6 m have the same fence because both have area 12 m². Do they? ✔ no, 14 m and 16 m ✘ yes, both have area 12 → **PISTA FALSA.** | Which pair of beds shows that equal fences do not mean equal areas? ✔ 6 × 4 and 8 × 2 ✘ two identical squares → the 6 × 4 bed has the bigger area: under its sign is **piece 6** and an address of a post office. |

### Chapter 8 – The puzzle box (G07-08) · post office · 3 lessons · piece 7

*Opening.* At the post office a parcel is waiting for Agencia Lupa: a wooden puzzle box, 2 × 3 × 4, and a bag of little cubes. The postmark reads *Boedo, martes 8:15*: posted near the school. That Tuesday Ramón started his shift at the café on Avenida de Mayo at 7:00 and the café owner confirms he did not leave: **✘ Ramón** on the candidate board.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-08-L01 From solid to net | The box opens only if each face is pressed together with its twin. *Example:* a 2 × 3 face pairs with the opposite 2 × 3 face. | Which face pairs with a 2 × 4 face? ✔ another 2 × 4 face ✘ a 3 × 4 face → the first latch opens. | Inside: six paper squares in a row and the note *«¿Soy un cubo?»* Does every arrangement of six squares fold into a cube? ✔ no ✘ yes → a valid net is drawn; the second latch opens. |
| G07-08-L02 Cover or fill | Inside, a small compartment for the cubes. *Example:* a 1 × 2 × 3 compartment holds 6 cubes of 1 cm³. | Which unit measures the space the cubes fill? ✔ cm³ ✘ cm² → the right measuring card is chosen. | The compartment is 2 × 2 × 3. How many unit cubes fit? ✔ 12 ✘ 7 (added the dimensions) → the compartment is filled and a drawer slides out with **piece 7**. |
| G07-08-L03 Equal volume, another box | Agencia Lupa must send a reply box with 24 cubes using the least wrapping paper. *Example:* 2 × 3 × 4 and 1 × 4 × 6 both hold 24 cubes; surfaces 52 and 68 cm². | What is the surface of a closed 2 × 2 × 6 cm box? ✔ 56 cm² ✘ 24 cm² (that is the volume) → the 2 × 3 × 4 box (52 cm²) uses less paper. | What makes this paper comparison fair? ✔ same volume and paper without thickness ✘ comparing only the height → the reply is posted with the question *«¿Quién sos?»* |

### Chapter 9 – The newspaper archive (G07-09) · 3 lessons · piece 8

*Opening.* The Sphinx answers: *«Buscame en los diarios viejos.»* In the newspaper archive (*hemeroteca*), the detectives find a riddle column signed *La Esfinge*, and a school survey published next to it.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-09-L01 What a graph shows and hides | A survey of 20 pupils of 7.º grado: what to do at the end-of-year trip — reading 8, drawing 6, sport 6. *Example:* reading 8 of 20 = 40 %. | What percentage chose drawing? ✔ 30 % ✘ 6 % (used the count as a percentage) → the table is complete. | In the newspaper chart the axis starts at 5, so the bars for 8 and 6 look like 3 to 1. Is 8 three times 6? ✔ no ✘ yes → Juli redraws the chart from zero. |
| G07-09-L02 Mean and mode answer different questions | How many riddles the column printed per week in one month: 2, 2, 4, 8. *Example:* data 3, 3, 5, 9: mean 5, mode 3. | What was the mean number of riddles per week? ✔ 4 ✘ 2 (gave the mode) → the mean goes into the notebook. | What number of riddles per week was most common? ✔ 2 ✘ 8 (the largest value is not the mode) → *“usually two a week”*: the same habit as the envelopes this year. |
| G07-09-L03 Compare groups without hiding differences | Letter heights in mm: group A, four Sphinx notes: 4, 4, 4, 4 (typewriter); group B, a note the Halcones “found”: 2, 3, 5, 6. *Example:* both groups have mean 4 mm, but very different spreads. | Which group has the bigger difference between the highest and lowest value? ✔ B ✘ A → group B is handwritten: the Halcones admit it was a joke note. Group A matches the typewriter letters of the newspaper column: **the column’s author and the Sphinx are the same person.** | The Halcones checked four people on the street and claim: *“the whole city loves riddles.”* Can four observations say that without knowing how they were chosen? ✔ no ✘ yes, if we calculate the mean → **Chapter solved: piece 8, rank *Detective principal*.** The column’s old pay slip says *A. Ríos*. |

### Chapter 10 – Side case: the coin at the school fair (G07-10) · Parque Centenario · 3 lessons · bonus clue: the lucky coin

*Opening.* Yellow folder. At the school fair (*kermés*) in Parque Centenario a stall called *«Los juegos de la Esfinge»* asks visitors to explain games of chance before playing. The prize is an old coin.

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-10-L01 List possible outcomes | A die game. *Example:* the outcomes of one roll are 1, 2, 3, 4, 5, 6; “even” is 2, 4, 6. | Which outcomes make “less than three”? ✔ 1 and 2 ✘ 1, 2, and 3 → the first game card is correct. | The stall has a hand-carved wooden die. Does listing six faces prove all six are equally likely? ✔ no ✘ yes → the stall keeper smiles: *“Good. Not every die is fair.”* |
| G07-10-L02 Impossible, possible, and certain | A bag with 3 red marbles and 1 blue marble. *Example:* drawing green is impossible. | Is drawing blue impossible, possible, or certain? ✔ possible ✘ impossible (unlikely is not impossible) → the event card is placed. | Which event is certain with this bag? ✔ red or blue ✘ red → the second game card is correct. |
| G07-10-L03 Record a series of trials | The coin is tossed 15 times and recorded. *Example:* 12 heads in 20 tosses = 60 %. | 9 heads in 15 tosses: what is the relative frequency? ✔ 60 % ✘ 9 % → the record is complete. | The Halcones say: *“After three heads in a row, the next must be tails.”* ✔ no, the tosses are independent ✘ yes → **Side case closed. Bonus clue:** the old coin is from the year the time capsule was buried. |

### Chapter 11 – The time capsule (G07-11) · the schoolyard · 3 lessons · the case is solved

*Opening.* The 8 pieces of the torn map fit together: it is a plan of **the school’s own yard**, scale 1:100, drawn 50 years ago. The last note: *«Donde no se lee, se cava.»*

| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G07-11-L01 A proposal in several representations | The yard garden is 8 m × 6 m; a 2 m × 6 m reading strip with benches crosses it. *Example:* a 5 m × 4 m area without a 1 m × 4 m path leaves 16 m². | The capsule is outside the reading strip. How much ground must be searched? ✔ 36 m² ✘ 12 m² (that is the strip) → the search area is marked with tape. | On the old plan at 1:100, how long is the 6 m side of the garden? ✔ 6 cm ✘ 0,06 cm → the plan is lined up with the real garden; the cross on the plan points to one corner. The metal box is found, closed with a two-digit lock. **Number cipher (story step):** the backs of the map pieces read 1, 3, 6, 10, 15, 21, 28, 36; each number adds one more than the last (+2, +3, … +8), so the next adds 9: **45**. The lock opens; on top lies a typed card: *«¿Quién soy?»* |
| *Final deduction (story step between L01 and L02)* | The candidate board fills the screen. The learner names the Sphinx and, for each other candidate, picks the evidence that rules them out. | ✔ **Don Aurelio**: could reach the café by 9:10, rides a bicycle, the parcel came from Boedo, the column was signed *A. Ríos*. Clara ✘ (arrives 9:15), Ramón ✘ (on shift when the parcel was posted), Inés ✘ as deliverer (in the library at 9:05) — but the index card shows she helped. | A wrong name gets one gentle hint from Átomo pointing to the missing evidence card; no penalty. |
| G07-11-L02 Compare strategies and assumptions | Don Aurelio walks into the yard, smiling: *“Bien deducido.”* He tells the story of the first 7.º grado; Señora Inés confesses she placed the envelopes. He proposes opening the capsule at the egresados party. The detectives plan the party, paying in lupas. *Example:* a 20 % discount on 50 lupas: 50 − 10 or 50 × 0,8 give 40 lupas. | The rental shop gives 30 % off the tables. Which factor gives the new price? ✔ 0,70 ✘ 0,30 (that is the discount) → the tables are booked. | The discount is only for tables. Can it be applied to the total with chairs and lights? ✔ no ✘ yes → the budget is correct; the party is set. |
| G07-11-L03 Diagnostic: explain and revise | Before the party, Agencia Lupa and the Halcones check their joint case report for mistakes. *Example:* a 1 × 3 m bed with doubled sides becomes 2 × 6 m: area 3 → 12 m², four times. | The report says the capsule’s old garden bed (10 m²) “doubled its sides, so its area is 20 m²”. What is the right area? ✔ 40 m² ✘ 20 m² → the report is corrected. | The report claims *“the courier cost is proportional to the distance because it grows”*. What must be checked? ✔ a constant ratio and no fixed fee ✘ only that it grows → **Case solved: rank *Detective de la Esfinge*.** At the party the capsule opens: letters from the first 7.º grado to the new egresados, the photo (if found in Ch. 5), and a coin like the one from the fair (if found in Ch. 10). |

---

## 6. Logic riddles of the Sphinx (optional, one per chapter)

Shown after the chapter’s last lesson as a typed card. Not part of the 66 lesson checks; no lock depends on them; a correct answer gives a gold evidence card. The answer is chosen from options; the learner may then explain in one sentence (adult review, as for exit tasks). Wording below is planning text.

| Ch. | Riddle | Answer and reasoning |
|---|---|---|
| 1 | Three lockers A, B, C; one holds a key. Notes: A *«La llave no está aquí.»* B *«La llave está en A.»* C *«La llave no está en B.»* **Only one note is true.** Where is the key? | **B.** If it were in A, notes B and C would both be true. If in C, notes A and C would both be true. In B, only note A is true. |
| 2 | Ana, Beto, and Caro sit in a row and order café, té, submarino. The person with té sits in the middle. Ana does not sit in the middle. Neither Ana nor Beto drinks café. Who ordered what? | **Caro café, Beto té, Ana submarino.** Only Caro can have café. Té is in the middle, and Ana is not in the middle, so té is Beto’s; submarino is left for Ana. |
| 3 | *«Si alguien vino en colectivo, llegó después de las 9:10.»* Profe Clara came by colectivo. Don Aurelio arrived before 9:10. What can we conclude about each? | **Clara arrived after 9:10; Aurelio did not come by colectivo.** The second is the “if… then” read backwards: if he had come by colectivo, he would have been late. |
| 4 | Doors on Defensa: 2, 4, 8, … The Halcones say the next is 16. The Sphinx adds: *«La cuarta es 14.»* What is the fifth door? | **22.** With 14 the differences are +2, +4, +6, so the next difference is +8. Three numbers alone did not fix the rule (as in G07-04-L02). |
| 5 (extra) | Three frames: red, blue, green. Red is longer than blue. Green is not the shortest. Green is shorter than red. Order them from longest. | **Red, green, blue.** Blue is shortest (red and green are not); green is shorter than red. |
| 6 | Benches stand at the corners of the triangular square (35°, 85°, 60°). *«Mi nota no está en el ángulo mayor ni en el de 60°.»* Which corner? | **35°.** Lesson G07-06-L02 found the third angle; elimination leaves one corner. |
| 7 | Garden beds 1–4 in a row: tomato, lettuce, squash, basil. Squash is in bed 2. Lettuce is at an end. Tomato is next to basil. Basil is not in bed 4. Where is the tomato? | **Bed 4.** If lettuce were in bed 4, beds 1 and 3 would be left, not neighbours. So lettuce 1, and basil 3, tomato 4. |
| 8 | Three boxes labelled *cubos*, *llaves*, *cubos y llaves*. **Every label is wrong.** You may take out one object from one box. Which box do you open to fix all labels? | **The box labelled *cubos y llaves*.** It holds only one kind; the object shows which. The other two labels are then forced. |
| 9 | Four newspapers A, B, C, D; one printed the Sphinx’s column. *«Si estaba en B, tenía crucigrama.»* The column’s paper had no crossword. *«Si no es A, es C.»* It is not C. Which paper? | **A.** Not B (it would have had a crossword). Not C. If it were not A, it would be C, which is false; so it is A. |
| 10 (extra) | The Halcones propose a coin game: *“Heads, I win; tails, you lose.”* Is the game fair? | **No.** Both outcomes mean the Halcones win; listing the outcomes shows it (as in G07-10-L01). |
| 11 | The final deduction (above) is the riddle of this chapter. | Don Aurelio, with the evidence chain. |

---

## 7. Chapter overview

| # | Chapter / place | Package | Type | Lessons | Steps | Reward |
|---|---|---|---|---|---|---|
| 1 | The first envelope · library, Boedo | G07-01 | main | 3 | 6 | map piece 1 |
| 2 | The café on Avenida de Mayo | G07-02 | main | 3 | 6 | map piece 2 |
| 3 | Who could have been there? · transport, Corrientes | G07-03 | main | 3 | 6 | map piece 3, rank *Aprendiz* |
| 4 | The iron gates of San Telmo | G07-04 | main | 3 | 6 | map piece 4 |
| 5 | The unsigned frame · La Boca | G07-05 | side case | 3 | 6 | bonus: old class photo |
| 6 | The angles of Palermo | G07-06 | main | 3 | 6 | map piece 5, rank *Detective* |
| 7 | The enlarged photo · print shop, garden | G07-07 | main | 3 | 6 | map piece 6 |
| 8 | The puzzle box · post office | G07-08 | main | 3 | 6 | map piece 7 |
| 9 | The newspaper archive | G07-09 | main | 3 | 6 | map piece 8, rank *Detective principal* |
| 10 | The coin at the school fair · Parque Centenario | G07-10 | side case | 3 | 6 | bonus: lucky coin |
| 11 | The time capsule · schoolyard | G07-11 | finale | 3 | 6 | case solved, rank *Detective de la Esfinge* |
| | **Total** | 11 | | **33** | **66** | |

Story continuity checks:

- Chapter 4 ends with a ticket to La Boca (side case 5). Chapter 6 must also open without it: the Palermo plan is in the same San Telmo parcel, so a learner who skips Chapter 5 continues directly.
- Clue order on the candidate board: Ch. 3 rules out Clara and Inés (as deliverer) and leaves two bicycle riders; Ch. 6 links Inés to the riddles; Ch. 8 rules out Ramón; Ch. 9 gives the first name evidence, *A. Ríos*. No earlier clue gives the name away.
- The learner names the Sphinx in the final deduction (Ch. 11, between L01 and L02); Aurelio confirms only after that.
- The number cipher needs all 8 map pieces, which come from main chapters only, so side cases are never required.
- Side-case clues appear in the finale only with “if found”.

## 8. Implementation notes (for later)

- Game layer: replace `src/content/grade7/parkAdventure.ts` (`ParkScene`, 11 scenes, generic rewards) with a detective story file; keep one chapter per package. Each mission gets its own introduction and one reward per task (66 rewards), as in Grade 2 `wizardQuest.ts`. Rename scenes to the chapter places above.
- Lessons: rewrite `story`, `steps`, `items`, `checks`, and `exit` (as *Desafío de la Esfinge*) in `numbers.ts`, `relations.ts`, `space.ts`, `data.ts`. Changed numbers: G07-01-L02 task 1 (35 + 45 books), G07-03-L01 (cuadras and minutes instead of labels and price), G07-03-L03 task 1 (scale 1:20.000, 5 cm → 1 km instead of 1:200 → 10 m), G07-09-L01 (same counts 8, 6, 6; activities renamed reading/drawing/sport), G07-09-L03 (letter heights 4, 4, 4, 4 and 2, 3, 5, 6 mm instead of 4, 4, 4, 4 and 1, 1, 7, 7 minutes; both keep equal means and different ranges). All other answers and distractors stay as in the current checks.
- Interactive models in `parkModels.ts` (shared-stick pattern, formula/table/graph, angles, scaling, cube layers, coin sequence) keep their maths; only labels change (bars of a gate, frame strip, street angles, photo, puzzle box, fair coin).
- Update `hints.ts` (one hint per check, about the case objects); hints must differ from explanations.
- Scene: corkboard with 66 evidence cards (+ up to 11 gold cards from logic riddles), the city map with 11 pins, the torn map (8 pieces with cipher numbers on the back), and the candidate board.
- New story steps outside the lesson checks: 11 logic riddles (section 6), the number-cipher lock, and the final deduction. They need their own simple answer data (choice options + explanation) in the story file; they do not count toward lesson mastery or package checks.
- Currency: show amounts in *lupas* with a small icon; es-AR and en-US keep the same word.
- Final project (fair-design project in `index.ts`) can be reframed as “plan the egresados party and the capsule opening”.
- Create a `grade-7-lesson-authoring` skill with this story map once the scenario is approved, as was done for Grade 2.
- Package checks in `assessments.ts` stay outside the story.
