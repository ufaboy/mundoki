---
name: grade-2-lesson-authoring
description: Create, revise, or review Mundoki Grade 2 lessons and the Grade 2 story (the hero frees six friends held by Wizard Embrollo; every correct answer unties one knot of his spell). Holds the story bible, the plain-language rules for 7–8-year-olds, and the lesson-by-lesson map that links each skill to the story step it drives. Use alongside the general lesson-authoring skill for any Grade 2 content.
metadata:
  short-description: Author Grade 2 wizard-quest lessons
---

# Author Grade 2 lessons

Use this skill together with `.agents/skills/lesson-authoring/SKILL.md` (core rule, story contract, review checklist). Grade 2 is the second year of CABA primaria; numbers go up to about 1,000. The skills and their order come from the Grade 2 section of `docs/lesson-creation-plan.md` (packages G02-01 … G02-13). The full scenario, with every scene and task in Russian and its link to the Argentine 2nd-year expectations, is `docs/grade-2-wizard-scenario.md`. The English version translates the same course.

## Learner assumptions

- The child is 7–8 and may still listen to the text read aloud. Grade 1 gave counting, numbers to 100, joining and taking away, and halves of small quantities. Grade 2 builds place value to 1,000, mental strategies, and first meanings of multiplication and division.
- Keep the visible model first: boxes of 100, bags of 10, and loose gems; number lines; bars; equal groups. Then the number sentence.
- Keep two answer options per challenge (`check()` in `src/content/lessonModel.ts`); the wrong option must show a typical error (digit value instead of place value, wrong operation, unequal parts).

## Plain language for 7–8-year-olds (mandatory)

- Short sentences: one idea each, about 10–12 words at most.
- One action per question: first the situation, then one question.
- Familiar words: caja, bolsita, piedra, puerta. Avoid «sello», «combinación», «equivalente», «corresponde».
- A number always comes with its object: «15 cristales», not «15».
- “Why” answers are one short sentence in the child’s words.
- The wizard’s lines are short and funny: «¡Ja! ¡No lo van a arreglar!»
- es-AR uses voseo (mirá, contá, probá).

## Story bible

**Premise.** In the Mundoki valley, the little dragon Chispa lights the lanterns of the *Fiesta de los Faroles*. Wizard Embrollo (*el mago Embrollo*; “embrollo” = a tangle) was not invited. Offended, he tangled the valley’s numbers and locked six friends of the hero in six enchanted places. Each friend is held by a spell with **12 knots** (6 missions × 2 challenges): every correct answer unties one knot. With the last knot the friend is free, joins the team, and helps in the next chapter. At the end the wizard loses his power, admits defeat, and the hero invites him to the festival.

**Characters.**
- `{name}`: the hero the learner chose (Tomi or Lola). Decides; the learner helps by doing the math.
- Átomo, the robot fox: gives hints only (`hints.ts`), never the answer.
- Wizard Embrollo: grumbles, boasts, leaves riddles; never hurts or frightens anyone. His spells look like coloured knots of yarn. He appears at the start of a chapter (sets the trap) and at its end (flies off: «¡Al río!»).
- The six friends (one per chapter): Pipa the squirrel 🐿️, Tuco the beaver 🦫, Mora the owl 🦉, Ramón the mole 🐾, Teo the deer 🦌, Chispa the little dragon 🐉.

**Gems.** Play gems come in a **caja** (box) of 100, a **bolsita** (bag) of 10, and **gemas sueltas** (loose gems) — the hundreds/tens/ones model. In English: box, bag, loose gems. Do not keep a running balance across lessons: every lesson states all the quantities it uses.

**Tone.** Warm, funny, a little adventurous. Problems come from real needs of the scene (read a price, open a lock, share crystals equally, measure a board), not tests invented for their own sake.

## Writing for the chosen hero

- `{name}` may appear **only** in mission introductions and rewards (`wizardQuest.ts`) and the epilogue, which `QuestLesson.astro` renders through `HeroText`. Lesson stories, steps, prompts, options, explanations, and hints never use `{name}` (they are also used outside HeroText, e.g. in `aria-label`). The Grade 2 test enforces this.
- `text()` splits on the first `|` into es-AR and en-US, so **do not use** the `{masculine|feminine}` form. Write gender-neutral Spanish around the name: «{name} mira el candado», not «{name} está listo». In English, repeat the name instead of he/she.

## Where Grade 2 content lives

- Lessons (worked example `story`, `steps`, `scene`, `misconception`, `checks`): `src/content/grade2/numbers.ts` (G02-01…03), `operations.ts` (G02-04…06), `groups.ts` (G02-07…08), `world.ts` (G02-09…13).
- Hints, one per check: `src/content/grade2/hints.ts`.
- Missions (title, introduction, `rewards[i]` shown after `checks[i]`), chapters (place, friend), and `questSceneState()`: `src/content/grade2/wizardQuest.ts`. `QUEST_MISSIONS` order must stay aligned with the 36 lessons; each chapter is exactly 6 missions (12 knots).
- Pages: `src/components/learn/QuestMap.astro` (grade map), `QuestLesson.astro` (mission page and epilogue), `QuestStage.astro` (scene), `src/scripts/wizardQuest.ts` (answers, hints, knots).
- Package checks: `src/content/grade2/assessments.ts` — practice outside the story; any context; prompts must differ from lesson checks.
- Tests: `src/tests/gradeTwoSuite.ts`.

## Lesson-by-lesson story map

Each row: the scene need, then check 1 → result, check 2 → result. Exact wording lives in the code; keep numbers, the typical-error distractor, and the reward together when editing.

### Chapter 1 — Mercado de las Gemas · free Pipa (missions 1–6)

| Lesson | Scene | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-01-L01 | Prices turned into gem piles; example lantern 243 | rope 461: value of 6 (60 / 6) → rope price visible | map 222: why each 2 differs → stalls shine |
| G02-01-L02 | Sellers say prices aloud; example 406 | «novecientos treinta» (930 / 9030) → key too dear for 700 | lantern 507: what the 0 shows → lantern reveals the lock |
| G02-01-L03 | Riddle lock «the greater opens»; example 368 vs 386 | 619 vs 691 (691 / 619) → first wheel | why 699 < 700 → second wheel |
| G02-02-L01 | Magic box with 3 windows; example 347 | 619 as 600 + 10 + 9 (/ 60 + 10 + 9) → window closes | 304 = 300 + 4: no bags → window closes |
| G02-02-L02 | Last window takes bags only; example 230 | bags in a box (10 / 100) → box traded | 300 + 50 vs 200 + 150 still 350 → box opens |
| G02-02-L03 | Two mirrors on the bars; example 347 two ways | 619 = 500 + 110 + 9 (/ 500 + 10 + 9) → left bars vanish | 500 + 20 + 8 = 400 + 120 + 8 → **Pipa free** |

### Chapter 2 — Río de las Piedras · free Tuco (missions 7–12)

| Lesson | Scene | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-03-L01 | Numbered stones: small +10, big +100; example from 125 | 360, 460, 560 → 660 (/ 570) → safe jump | why 275 → 285 → mid-river island |
| G02-03-L02 | Sun mirror melts Tuco’s ice by 50; rope of 20 cm pieces | 150, 200, 250 → 300 (/ 260) → ice cracks | 5 × 20 cm = 100 cm (/ 5 + 20) → rope tied |
| G02-03-L03 | Tools in numbered nests; example around 347 | 10 less than 208 → 198 (/ 108) → hammer | 10 more than 99 → 109 → chisel |
| G02-04-L01 | Logs for the dam; example 23 + 15 two stories | 42 − 12 → 30 (/ 54) → enough logs | why both stories are 23 + 15 → walls stand |
| G02-04-L02 | Stones for both sides; example bars 36 / 24 | 27 vs 19 → 8 (/ 46) → 8 extra stones | what 27 + 19 answers → both sides ready |
| G02-04-L03 | Gate needs sticks; example 50 = 32 + ? | 60 − 46 → 14 (/ 106) → last sticks | check 46 + 14 = 60 → **Tuco free** |

### Chapter 3 — Lago Espejo · free Mora (missions 13–18)

| Lesson | Scene | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-05-L01 | Clear-water potion; example 34 + 25 drops | 52 + 36 → 88 (/ 78) → water clears | why 41 + 20 + 8 → water clear |
| G02-05-L02 | Glowing stars on the sail; example 28 + 7, 42 − 6 | 36 + 8 → 44 (/ 34) → sail shines | why 51 − 1 − 5 → mid-lake |
| G02-05-L03 | Wizard writes sums on water; example 63 − 27 | check 72 − 28 = 44 with 44 + 28 → light bridge | 54 − 16 ≠ 30 since 30 + 16 = 46 → the lie pops |
| G02-06-L01 | Everything has a reflection; example 12 + 12 | double 16 → 32 (/ 26) → firefly shield opens | why 8 + 9 is not double 8 → fake reflection gone |
| G02-06-L02 | Moon stones on two shores; example 18 shells | half of 30 → 15 (/ 20) → lake calms | why 7 and 13 aren’t halves of 20 → 10 each |
| G02-06-L03 | Mirror’s last lock; example 7 + 8 from 7 + 7 | 15 + 16 from 15 + 15 → 31 (/ 30) → cracks | half of 28 from double 14 → **Mora free** |

### Chapter 4 — Mina de los Cristales · free Ramón (missions 19–24)

| Lesson | Scene | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-07-L01 | Crystal carts; example 4 × 6 | 5 carts × 3 → 15 (/ 8) → carts move | when “3 in each” works → first bend |
| G02-07-L02 | Lanterns in rows; example 3 × 4 | 5 + 5 + 5 = 3 × 5 (/ 3 + 5) → sign lights | in 2 × 8 the 2 counts rows → ceiling shines |
| G02-07-L03 | Storeroom table; example packs of 6 | 4 boxes × 5 → 20 (/ 9) → row filled | why double boxes double crystals → store opens |
| G02-08-L01 | 3 miner fireflies share crystals; example 18 ÷ 3 | 12 for 3 → 4 (/ 9) → equal light | in 18 ÷ 3 = 6, 6 is per firefly → tunnel lit |
| G02-08-L02 | Carts of 5 to the door; example bags of 3 | 20 in carts of 5 → 4 (/ 15) → carts arrive | the 4 counts full carts → carts at the locks |
| G02-08-L03 | Door with two locks, 24 crystals | 24 in bags of 6: 4 = bags → first lock | 24 for 6 gnomes: 4 = each one’s share → **Ramón free** |

### Chapter 5 — Bosque de las Figuras · free Teo (missions 25–30)

| Lesson | Scene | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-09-L01 | Dark shape gates, a light per vertex | 5 sides → 5 lights (/ 10) → gate shines | “4 sides” isn’t enough for a square → square gate opens |
| G02-09-L02 | Downhill tunnel: what rolls? | tie down the ball (/ the die) → nothing escapes | why a log rolls and stands → out of the tunnel |
| G02-09-L03 | Wizard’s riddles | 3 sides, 3 vertices → triangle (/ square) → gate appears | “can roll” doesn’t tell ball from log → asks another clue |
| G02-10-L01 | Mora’s map ★ → 🦌 around ■ | ↑ ↑ → → (/ → ↑ → ↑ through the tree) → path chosen | what the key is for → map understood |
| G02-10-L02 | Directions for Ramón to the fence 🏁 | 5 steps (/ 4) → Ramón digs | two different paths can both be right → Ramón at the fence |
| G02-11-L01 | Board for the fence gap | 3 → 8 on the ruler = 5 cm (/ 8 cm) → board fits | why start at 0 → **Teo free** |

### Chapter 6 — Torre Enredada · free Chispa (missions 31–36)

The festival is on Tuesday; the epilogue is the festival itself.

| Lesson | Scene | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G02-11-L02 | Two doors: scale and fountain | heavier bag → scale (/ ruler) → first door | height alone doesn’t give capacity → second door |
| G02-11-L03 | Stairs open at set hours | 2 to 4 pm → 2 hours (/ 4) → time to climb | festival date → calendar (/ clock) → on time |
| G02-12-L01 | Stolen things counted in a table | 5 + 3 + 4 → 12 (/ 9) → return list | why write the name beside the number → baskets sorted |
| G02-12-L02 | Friends vote on a door, ★ = 2 | 5 stars → 10 (/ 5) → door opens | same key in both rows → top of the tower |
| G02-13-L01 | Festival lanterns for Chispa’s fire | 3 × 8 candles → 24 (/ 11) → lanterns ready | 4 + 4 + 4 + 4 = 16 checks the sharing → glass cracks |
| G02-13-L02 | Last spell: 347, +100, −10; example 428 | 437 (/ 457) → spell weakens | undo the last change first → **Chispa free**, epilogue |

## Grade 2 checks before finishing

- Each mission introduction states the goal and the quantities needed in the first check; each `rewards[i]` names what the answer of `checks[i]` made possible.
- The worked example sits in the same scene as the challenges but uses different numbers.
- Hints talk about the story objects (gems, stones, crystals, lanterns) and point to the next action.
- Numbers stay within 1,000; additive and mental-calculation work stays within 100.
- Plain-language rules above are met in both locales.
- Run `npm run lint` and `npm test`.
