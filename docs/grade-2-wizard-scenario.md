# Grade 2 - scenario plan for “Six Friends and the Magician Embrollo”
Draft plot to replace the current Grade 2 story (car ride to the island). The educational content and order of the lessons do not change: 13 packages G02-01 ... G02-13, 36 lessons, 2 tasks per lesson (docs/lesson-creation-plan.md, section Grade 2). Only the game layer changes: the scenes, who solves the problem and why, what changes after the correct answer.
Decisions made (November 2026):
- The villain is not scary. The spell is undone one knot at a time: each correct answer unties the knot of the spell. In the finale, the magician's power disappears, his friends are free, the magician admits defeat, and the hero invites him to a holiday.
- **6 friends** - one per chapter. At the end of the chapter, the friend is freed and helps with his talent in the next chapter.
- **36 lessons × 2 tasks**, as now: falls on the current code (missions, hints.ts, tests).
- The text is read by **children 7–8 years old**. Everything that the child sees is written in simple language (section 2).
- **Status:** added to the code (November 2026): src/content/grade2/wizardQuest.ts, lessons in numbers.ts, operations.ts, groups.ts, world.ts, tips in hints.ts. The exact texts es-AR / en-US are in the code; this file is a script for discussion.
The exercise texts below are planning examples; the learner-facing versions are in Spanish and English. In the code they are written in es-AR and en-US with the same numbers and meaning. Keep translations concise; do not make the learner-facing text longer than needed.
---

## 1. Plot Bible
**World.** Mundoki Valley. Every year there is *Fiesta de los Faroles* - Lantern Festival. The lanterns are lit by the little dragon Chispa.
**Villain.** *El mago Embrollo* (in en-US - *Wizard Embrollo*; “embrollo” - confusion). He was not invited to the holiday. He was offended, mixed up all the numbers in the valley and locked up six of the hero’s friends. His charms look like colored knots of thread. He grumbles, brags and asks riddles, but does not offend anyone. In each chapter he appears twice: at the beginning he sets a trap, at the end he flies away on a cloud of thread to the next place.
**Hero.** {name} - Tomi or Lola, whoever the child chose. The hero decides what to do; the student helps him count. Next to the hero is the robot fox Atomo and friends who have already been freed.
**Atomo.** Hints only (hints.ts), the answer does not say.
**How we win.** Each friend is held by a magic rope with 12 knots (6 lessons × 2 tasks). Each correct answer removes one visible knot. When all the knots are gone, the friend is free.
**Six Friends**
| Chapter | Place | Friend | How does it help later |
|---|---|---|---|
| 1 | Gem Market (*Mercado de las Gemas*) | Pipa, squirrel | knows the path to the river |
| 2 | River of Jumping Stones (*Río de las Piedras*) | Tuco, the beaver | builds raft and planks |
| 3 | Mirror Lake (*Lago Espejo*) | Mora, the owl | looks from above and draws a map |
| 4 | Crystal Mine (*Mina de los Cristales*) | Ramon, the mole | digs tunnels |
| 5 | Forest of Figures (*Bosque de las Figuras*) | Theo, the deer | takes everyone to the tower |
| 6 | Tangled Tower (*Torre Enredada*) | Chispa, the dragoness | lights holiday lanterns |
**Gems are a model of hundreds, tens and units.** Only simple words that the child already knows:
| Meaning | es-AR | en-US | in this regard |
|---|---|---|---|
| 100 | una **caja** de gemas | a **box** of gems | box |
| 10 | una **bolsita** de gemas | a **bag** of gems | pouch |
| 1 | gemas **sueltas** | **loose** gems | gems one at a time |
Purchases are fictional. The remainder is not carried over between lessons: each lesson names all its numbers itself.
**Tone.** Warm, funny, with a touch of adventure. Every story task should serve the scene: read the price, open the lock, divide equally, measure the board.
---

## 2. How to write for children 7–8 years old
The child is just learning to read (can listen to the text out loud). That's why:
- **Short sentences.** One thought - one sentence, up to 10-12 words.
- **One action per question.** First the situation, then one question.
- **Simple words.** Box, bag, stone, door. Without “print”, “combination”, “equivalent”, “corresponds”.
- **The number is always with the item.** “15 crystals”, not “15”.
- **Questions “why” - with simple answers.** Each answer option is one short sentence in the child’s language.
- **The magician’s remarks are short and funny.** For example: “¡Ja! ¡Nunca lo van a encontrar!”
- **Spanish around {name} - without gender:** “{name} mira el candado”, not “{name} está listo”. In English we repeat the name instead of he/she.
Other rules from grade-2-lesson-authoring:
- Each task has two answer options. The incorrect one shows a typical error: a number instead of its meaning, the wrong action, unequal parts.
- An example of a lesson - in the same scene, but with different numbers, so as not to give away the answer.
- Numbers up to 1000. Mental counting and addition and subtraction tasks - up to 100.
- The reward only names what exactly this answer did.
---

## 3. Connection with recommendations for the 2nd year (by docs/ARG_deep_research.md)
| Year 2 Benchmark | Where in the script |
|---|---|
| Read, write, compare numbers up to approximately 1000 | Ch. 1: market price tags, prices out loud, lock with two numbers |
| Positional value, additive decomposition | Ch. 1: magic box with three windows, box change |
| Scales 10 / 20 / 50 / 100; "10/100 more and less" | Ch. 2: stones across the river, melting ice, nests with numbers |
| Meanings of addition and subtraction problems, mental calculation | Ch. 2: beaver dam; Ch. 3: Potion, Stars on the Sail, Backfire Check |
| Double and Half | Ch. 3: mirror lake where everything doubles |
| Multiplication as repeated addition and proportional series | Ch. 4: trolleys and lanterns in the mine, table of boxes |
| Division: distribution equally (*reparto*) and “how many groups” (*partición*) | Ch. 4: fireflies, trolleys, door with two locks |
| Description of space and routes | Ch. 5: Mora Map, Ramon's Path |
| Shapes and bodies: sides, vertices, edges | Ch. 5: gate-figures, riddles of the magician |
| Measuring, choosing the right tool | Ch. 5: fence board; Ch. 6: scales, measuring jug |
| Time and calendar | Ch. 6: clock tower, holiday day |
| Solving the problem with explanation and verification | The second task of almost every lesson is “why” or “how to check” |
The final problem (G02-13-L02) is based on a test example from the study: the number **347**, “100 more”, “10 less”, checking in reverse steps.
Two honest disclaimers:
- Data (table, pictogram, Chapter 6) - selection of our plan. In the study, the apparent federal progression in the data begins in year 4; for the 2nd year it is only simple counting and reading pictures with information.
- The study recommends 4 levels of tasks (learn → calculate → apply → explain). With 2 tasks per lesson: task 1 - calculation or task in a situation, task 2 - explanation or verification. Recognition and training are provided by package test tasks ( assessments.ts ) and the “new numbers” button.
---

## 4. Scenario plan for lessons
Designations: **✔** - correct answer, **✘** - incorrect option (in parentheses - what error it is), **→** - what changes in the scene.
### Chapter 1 - Gems Market (G02-01, G02-02) · freeing Pipa
*Beginning.* There are a few days before the holiday.  {name} and Atomo come to the market. In the center of the square is a cage. It contains Pip the squirrel. The magician mixed up all the price tags. The hero has 700 gems.
| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G02-01-L01 Hundreds, tens, ones | The magician turned prices into piles of gems.  {name} writes prices in numbers. Example: flashlight - 2 boxes, 4 bags and 3 gems. This is 243. | The rope costs 461 gems. What does the number 6 mean? ✔ 60 ✘ 6 (number instead of value) → the price of the rope is visible again: 400 + 60 + 1. | The card costs 222. Why is one deuce worth 200, the other 20, and the third 2? ✔ It is important where the number is ✘ All twos are the same → the benches light up again. Pipa waves from her cage. |
| G02-01-L02 Read and write up to 1000 | The numbers on the price tags have disappeared. Sellers say prices out loud. Example: "cuatrocientos seis" is 406. | The seller says: “novecientos treinta.” How much does a key cost? ✔ 930 ✘ 9030 (recorded as heard) → key price 930. The hero only has 700. You can’t buy the key. | A magic lantern costs 507. What does zero mean? ✔ There are no bags ✘ Nothing, it can be erased → {name} pays 5 boxes and 7 gems. The flashlight shines on the cage: there is a lock with numbers on it. |
| G02-01-L03 Comparison and the number line | The magician's riddle on the lock: "Opens a larger number." Example: 368 and 386 on the number line. | The lock has 619 and 691. Which number is greater? ✔ 691 ✘ 619 (looked at the last digit) → the first wheel of the lock turned. | Second riddle: “Name a number less than 700.” Why is 699 less than 700? ✔ There are six hundred in 699, seven in 700 ✘ There are more nines in 699 → the second wheel clicked. What remains is the magic box. |
| G02-02-L01 Number expansion | On the cage there is a magic box with three windows: one for boxes, bags and gems. Example: 347 is 3 boxes, 4 bags and 7 gems. | The box asks for 619 gems. What sum is 619? ✔ 600 + 10 + 9 ✘ 60 + 10 + 9 (the number 6 was taken as 60) → the first window closed. The knot is untied. | The box asks for 304. Why is it 300 + 4? ✔ There are no bags ✘ You need 30 + 4 → the second window is closed. |
| G02-02-L02 Exchange of hundreds | The last window only takes bags. This is a magician's trick. You can change the box at the market. Example: open the box - there are 10 bags inside. | How many bags of 10 are in one box? ✔ 10 ✘ 100 (confused bags and gems) → {name} changes the box to 10 bags. | It was 300 + 50. Now it’s 200 + 150. Is it still 350? ✔ Yes, one box became 10 bags ✘ No, 100 are gone → the window takes the bags. The box opened. |
| G02-02-L03 Two ways to write a number | There are two mirrors on the cage. One number is written in two ways. The entries must match. Example: 347 = 300 + 40 + 7 = 200 + 140 + 7. | In the left mirror there are 619 = 600 + 10 + 9. What should be in the right? ✔ 500 + 110 + 9 ✘ 500 + 10 + 9 (lost a hundred) → the left bars are gone. | Are 500 + 20 + 8 and 400 + 120 + 8 the same number? ✔ Yes, both are 528 ✘ No, hundreds are different → the cage is open. **Pipa is free!** The magician flies away: “¡Al río!” Pipa knows the path to the river. |
### Chapter 2 - River of Jumping Stones (G02-03, G02-04) · free Tuco
*Beginning.* The magician broke the beaver dam. Tuco the beaver froze in a piece of ice. There are stones with numbers across the river. Only keep stones with the correct number.
| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G02-03-L01 Steps 10 and 100 | Small stone - plus 10. Large stone - plus 100. Example: from 125 we step by 10 and by 100. | Big rocks: 360, 460, 560. What's on next? ✔ 660 ✘ 570 (added 10) → {name} jumps and does not fall. | Why is there 285 after the small stone 275? ✔ There are one more ten ✘ The units have changed → everyone is on an island in the middle of the river. |
| G02-03-L02 Steps 20 and 50 | The ice around Tuco is melting from the sun mirror. Each turn is 50 drops. At 300 the ice will crack. Example: 20, 40 … 100 and 50, 100 … 200. | There were 150, 200, 250 drops. How long after the next turn? ✔ 300 ✘ 260 → the ice cracks. | The rope is 5 pieces of 20 cm each. Why is there 100 cm in it? ✔ 20 + 20 + 20 + 20 + 20 = 100 ✘ 5 + 20 = 25 → the rope reaches the ice. She was tied up. |
| G02-03-L03 10 and 100 more and less | Tuco's tools are hidden in nests. The nests have numbers. Example: from 347 to 447 to 337. | Hammer - in the slot 10 less than 208. What is the number? ✔ 198 ✘ 108 (subtracted 100, not 10) → hammer found. | The chisel is 10 more in the socket than 99. Why is it not 100? ✔ 99 + 10 = 109 ✘ After 99 there is always 100 → bit found. |
| G02-04-L01 Merger and change | We repair the dam with logs. Example: 23 logs and 15 more logs. | There were 42 logs. 12 went to the wall. How many are left? ✔ 30 ✘ 54 (folded, but needs to be taken away) → there are enough logs for the second wall. | One pile is 23 logs, the other is 15. Or there were 23, but they brought 15. Why are both stories 23 + 15? ✔ In both, two parts give the whole ✘ In both there is the word “still” → the walls are standing. |
| G02-04-L02 Comparison: how much more | The left side of the dam needs more stones than the right. Example: 36 and 24 on two stripes. | The left side needs 27 stones. The right one is 19. How much more than the left one? ✔ 8 ✘ 46 (folded) → there are 8 extra stones on the left side. | What question does 27 + 19 answer? ✔ How many stones are needed in total ✘ How many more are left than the left one → both sides are ready. |
| G02-04-L03 Unknown part | The dam gate needs 60 sticks. Some of it is already standing. Example: 50 = 32 + ?. | There are 46 sticks out of 60. How many are missing? ✔ 14 ✘ 106 (folded) → last sticks in place. | How to check answer 14? ✔ 46 + 14 = 60 ✘ 60 + 14 = 74 → water leaves, ice melts. **Tuco is free!** Mage: “¡Al Lago Espejo!” Tuco is building a raft. |
### Chapter 3 - Mirror Lake (G02-05, G02-06) · freeing Mora
*Start.* Mora the owl is trapped in a reflection at the bottom of the lake. Water is enchanted: everything doubles in it, and the magician’s examples are not true. Everyone is floating on Tuco's raft.
| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G02-05-L01 Convenient terms | You need a potion to see through water. Blue and white drops are poured into the cauldron. Example: 34 + 25 - first tens, then ones. | 52 blue drops and 36 white drops. How much in total? ✔ 88 ✘ 78 (error in tens) → the first potion is ready. The water is getting brighter. | Why can 41 + 28 be counted as 41 + 20 + 8? ✔ 28 is 20 and 8 ✘ This will make more → the second potion is ready. The water is clear. |
| G02-05-L02 Transition through ten | Glowing stars are glued to the sail. Example: 28 + 7 through 30; 42 − 6 through 40. | There are 36 stars on the sail. Added 8. How much is it? ✔ 44 ✘ 34 (forgot the new ten) → the sail glows. | There were 51 stars. 6 stars are glued. Why is it convenient to count 51 − 1 − 5? ✔ First we reach 50 ✘ So subtract less → raft in the middle of the lake. |
| G02-05-L03 Reverse action check | The magician writes examples on the water. True or false? Example: 63 − 27 = 36. Check: 36 + 27 = 63. | On the water: 72 − 28 = 44. How to check? ✔ 44 + 28 = 72 ✘ 72 + 28 → this is true. The bridge of light holds. | On water: 54 − 16 = 30. But 30 + 16 = 46. What does this mean? ✔ 54 − 16 is not 30 ✘ Error in addition → falsehood bursts. The path to Mora is open. |
| G02-06-L01 Doubling | Everything has a reflection in the lake. Example: 12 water lilies and 12 in reflection - 24. | There are 16 fireflies on the shield. There's just as much in the reflection. How much in total? ✔ 32 ✘ 26 (error in tens) → shield opens. | There are 8 fish on the left. In reflection 9. Why is 8 + 9 not double 8? ✔ Double is 8 + 8 ✘ 8 and 9 are almost the same → the false reflection disappears. |
| G02-06-L02 Half | 30 moonstones should be placed equally on two banks. Example: 18 shells in two equal piles. | How many stones are there on each bank? ✔ 15 ✘ 20 (parts are not equal) → magic lake scales are even. | Why are 7 and 13 not half 20? ✔ The halves are equal: 10 each ✘ 7 + 13 does not equal 20 → there are 10 stones on each bank. |
| G02-06-L03 Known Doublings | The last mirror lock. Example: 7 + 7 = 14, so 7 + 8 = 15. | There are 15 stones on one bank and 16 on the other. 15 + 15 = 30. How many are there in total? ✔ 31 ✘ 30 → mirror in cracks. | Double 14 is 28. What is half 28? ✔ 14 ✘ 56 (double instead of half) → the mirror bursts into sparks. **Mora is free!** Mage: “¡A la mina!” Maura will be watching from above. |
### Chapter 4 - Crystal Mine (G02-07, G02-08) · free Ramon
*Begin.* Ramon the mole is locked deep in the mine, behind a crystal door. The magician turned off the lights. The door will open only if everything is laid out equally.
| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G02-07-L01 Equal groups | Crystals are loaded into trolleys. Example: 4 trolleys, each with 6 crystals. | 5 trolleys. Each contains 3 crystals. How many crystals? ✔ 15 ✘ 8 (added 5 and 3) → the trolleys are moving. | When can you count “3 in each”? ✔ When all trolleys have equal shares ✘ Always → the trolleys have passed the first turn. |
| G02-07-L02 From addition to multiplication | Lanterns hang in rows. Example: 3 rows of 4 lanterns. 4 + 4 + 4 = 3 × 4. | How to write 5 + 5 + 5 by multiplication? ✔ 3 × 5 ✘ 3 + 5 → the first sign is lit. | There are 2 rows of 8 lights on the ceiling: 2 × 8. What does the number 2 count? ✔ Rows ✘ Lanterns in one row → the ceiling glows. |
| G02-07-L03 Table “boxes - crystals” | Table in stock. Each box contains 5 crystals. Example: packs of 6 stickers. | 4 boxes of 5 crystals. How many crystals? ✔ 20 ✘ 9 (added 4 and 5) → table row is complete. | There are 2 times more boxes. Why are there also 2 times more crystals? ✔ There are still 5 in each box ✘ In tables it’s always like this → the table is ready. The warehouse is open. |
| G02-08-L01 Distribute equally | Three fireflies shine if each has an equal amount of crystals. Example: 18 crystals for 3 fireflies. | 12 crystals for 3 fireflies. How much for each? ✔ 4 ✘ 9 (subtracted 3) → fireflies shine equally. | 18 : 3 = 6. What does 6 mean? ✔ How many crystals does one firefly have ✘ How many fireflies → it’s light in the mine. |
| G02-08-L02 How many groups | The crystals are brought to the door. Place 5 in a trolley. Example: 18 crystals, 3 in a bag. | 20 crystals, 5 per trolley. How many trolleys? ✔ 4 ✘ 15 (subtracted 5) → trolleys at the door. | What does the number 4 count? ✔ Full trolleys ✘ Crystals in one trolley → trolleys stood at the locks. |
| G02-08-L03 One calculation - two questions | There are two locks on the door. Each one has a story about 24 crystals. Example: 12 chips for 3 children or 3 per bag. | 24 crystals were placed 6 in a bag. It turned out to be 4. What does 4 mean? ✔ 4 bags ✘ 4 crystals per bag → the first lock is open. | 24 crystals were given to 6 dwarves. Everyone has 4. Why does 4 mean something different here? ✔ There are 4 crystals for one gnome ✘ It’s the same story → the door is open. **Ramon is free!** Mage: “¡Al bosque!” Ramon is digging a tunnel. |
### Chapter 5 - Forest of Figures (G02-09, G02-10, G02-11-L01) · free Theo
*Start.* Theo the deer is locked behind a fence in the forest. On the way there are gates in the shape of figures. The magician mixed up the signs.
| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G02-09-L01 Sides and vertices | The gate-figures went out. A firefly should be planted in each corner (vertex). Example: describe a figure so that a friend will draw it. | The gate has 5 sides. How many fireflies do you need? ✔ 5 ✘ 10 (added the sides and corners) → the first gate is lit. | We need to find the square gate. Is “they have 4 sides” enough? ✔ No, the rectangle also has 4 ✘ Yes → the required gate has been found and opened. |
| G02-09-L02 Faces and surfaces | The Ramona Tunnel is going down. What will roll and what will stand? Example: cube, ball, jar. | What needs to be tied down to prevent it from rolling away? ✔ Ball ✘ Cube → ball is tied. | Why can a log both roll and stand? ✔ The sides are round and the ends are flat ✘ The log has no flat parts → the logs stand. The tunnel has been completed. |
| G02-09-L03 Figure as described | The magician left a riddle about the gate to Theo. Example: “four equal sides” - what kind of figure is this? | “Flat. 3 straight sides. 3 corners." What gate? ✔ Triangle ✘ Square → triangular gate found. | In the riddle: “She can roll.” Why can't you tell the difference between a ball and a log? ✔ Both are rolling, we need another hint ✘ Only the ball is rolling → {name} asks for another hint and finds the path. |
| G02-10-L01 Reading plan | Mora flies from above and draws a plan: ★ - us, 🦌 - Theo, ■ - a fallen tree. Example: what is drawn in the cells of the plan. | Which path from ★ goes around the tree? ✔ ↑ ↑ → ​​→ ✘ → ↑ → ↑ (through tree) → path selected. | Why are there captions for the icons on the plan? ✔ To understand what each icon means ✘ For beauty → {name} understands the plan. |
| G02-10-L02 Path for another |  {name} writes to Ramon where to dig. Example: path on a 3×4 grid. | How many steps are there on this path? ✔ 5 ✘ 4 (didn't count the last step) → Ramon digs. | Two different paths lead to the fence. Can both be true? ✔ Yes, if they lead you to one place ✘ No, only one is correct → Ramon comes out at the fence. |
| G02-11-L01 Length and ruler | There is a hole in the fence. Tuco saws the board straight across the hole. The board is the key to the gate. Example: ribbon from 0 to 7 cm. | The hole on the ruler is from 3 to 8. How long is the board? ✔ 5 cm ✘ 8 cm (looked only at the end) → first board in place. | Why do they start measuring from scratch? ✔ Otherwise we will count extra centimeters ✘ Because 0 is drawn first → the gate is open. **Theo is free!** Mage: “¡Nunca van a llegar a mi torre!” Theo takes everyone to the tower. |
### Chapter 6 - Tangled Tower (G02-11-L02 ... G02-13) · freeing Chispa
*Start.* Holiday on Tuesday. At the top of the tower, the magician holds the dragon Chispa. Her fire is locked in a glass lantern. Without Chispa the lanterns will not light.
| Lesson | Scene and example | Task 1 → result | Task 2 → result |
|---|---|---|---|
| G02-11-L02 Weight and capacity | The first door is with scales, the second is with a fountain. Example: rice or cotton wool - which is heavier? How much water is in the bottle? | How do you know which bag is heavier? ✔ With scales ✘ With a ruler → even scales. The first door is open. | There are two bottles. Why not know by the height which one will receive more water? ✔ The shapes are different, you need a measuring jug ✘ The tall one always contains more → the fountain is full. The second door is open. |
| G02-11-L03 Clock and calendar | The staircase is not always open. The holiday is on Tuesday. Example: meeting on Wednesday at nine. | The staircase is open from 2 to 4 p.m. How many hours does it take to get up? ✔ 2 hours ✘ 4 hours (taken the end time) → we have time to get up. | How to find out what date it will be on Tuesday? ✔ By calendar ✘ By hour → holiday day found. |
| G02-12-L01 From counting to table | The magician stole the things of the valley. They are considered to be returned. Example: counting triangles, circles, squares. | In the table: 5 lanterns, 3 bells, 4 flags. How many things are there? ✔ 12 ✘ 9 (missed a line) → the list is ready. | Why write a word next to a number? ✔ Otherwise you won’t understand what they were counting ✘ It’s more beautiful → things are laid out in baskets. |
| G02-12-L02 Pictogram | Friends vote on which door to go through. ★ is 2 votes. Example: 8 votes for one door, 6 for another. | ★ is 2 votes. How many votes does 5 stars have? ✔ 10 ✘ 5 (one star - one vote) → chose the door with the most votes. | Why should ★ on both lines mean the same thing? ✔ Otherwise it’s unfair to compare ✘ It’s easier to draw → everything is at the top of the tower. |
| G02-13-L01 Preparing lanterns | Holiday lights are needed to free Chispa's fire. Example: 4 lanterns with 6 candles each; 18 sparks for 3 lights. | 3 lanterns. Each contains 8 candles. How many candles? ✔ 24 ✘ 11 (added 3 and 8) → three lanterns are ready. | 16 sparks equally distributed among 4 flashlights. How to check that everyone has 4? ✔ 4 + 4 + 4 + 4 ✘ 4 + 16 → the glass around the fire cracks. |
| G02-13-L02 Explain and check (final) | The magician's last spell is the number 347. He changes it twice: “¡Ja! ¡No lo van a arreglar!” Example: 428, plus 100, minus 10 - 518. | The magician added one hundred to 347. Then he subtracted 10. What number came out? ✔ 437 ✘ 457 (added 10, not subtracted) → the spell weakens. | How to return 347? ✔ Cancel from the end: 437 + 10 = 447, 447 − 100 = 347 ✘ Subtract 100 and 10 again → the last knot is untied. **Chispa is free!** |
### Epilogue - Lantern Festival
The magician's staff became a simple stick. The spell is gone. The magician sits on the step and sighs: “You have won...” {name} approaches him: “Will you come with us to the holiday?” The magician is surprised. He smiles for the first time. Chispa lights the lanterns, and everyone - six friends, Atomo, {name} and the magician - go to the celebration.
Epilogue - a scene without tasks (a picture and 4-5 short remarks). This closes the grievance with which it all began: the magician was not invited - now they have been called.
---

## 5. What was changed in the code
- src/content/grade2/wizardQuest.ts (instead of roadTrip.ts): 36 missions (title, intro, rewards), 6 chapters with places and friends, stage state questSceneState() - 12 nodes per chapter.
- numbers.ts, operations.ts, groups.ts, world.ts: example lesson and texts of tasks - in new scenes, in simple language. The numbers are almost always the same, the difficulty is the same.
- hints.ts: Atomo's hints about scene objects, one per task.
- Pages: QuestMap.astro (map), QuestLesson.astro (mission and epilogue), QuestStage.astro (scene), src/scripts/wizardQuest.ts. Old trip components have been removed.
- Skill .agents/skills/grade-2-lesson-authoring/SKILL.md: new plot bible, simple language rules, lesson map.
- Pictures from emoji and CSS so far (the hero is a general drawing of Tomi/Lola). Separate drawings of 6 places, friends and a magician are the next step.