---
name: grade-1-lesson-authoring
description: Create, revise, or review Mundoki Grade 1 lessons using concrete objects, visual reasoning, short instructions, and the Grade 1 course sequence. Use alongside the general lesson-authoring skill for any Grade 1 content.
metadata:
  short-description: Author lessons for Grade 1
---

# Author Grade 1 lessons

Use this skill together with `.agents/skills/lesson-authoring/SKILL.md` for every Grade 1 lesson or mission. Follow the Grade 1 section of `docs/lesson-creation-plan.md` and inspect neighboring lessons in `src/content/grade1/` before adding material. Grade 1 is the first year of CABA primaria; the English version translates this same course.

## Learner and course assumptions

- Do not assume prior formal schooling or fluency with written arithmetic. Begin from what the learner can see, move, group, compare, or count.
- Build number work gradually: start within 10 and 20, then extend toward 100 as readiness and the specific lesson sequence allow. Do not make 100 a prerequisite for every topic.
- Keep one main mathematical idea and one observable goal per micro-lesson. The plan suggests about 8–12 minutes for a digital lesson; hands-on activities may take longer.
- Respect the planned progression: counting and quantity, numerals and place value, comparison and order, position, meaningful addition and subtraction, part–whole relationships, patterns, spatial language and shapes, length, time, pictorial data, then integrated problem solving.

## Explain through action and images

- Introduce an idea with a familiar situation and visible or movable quantities. Use counters, fingers, ten-frames, simple drawings, number paths, shapes, calendars, or familiar classroom objects when they fit the objective.
- Move from **objects or action → picture or model → number sentence or numeral**. Show how each representation matches the same quantity. Do not start with a string of symbols and expect the learner to infer the situation.
- Use short sentences and one direction at a time. Prefer common, concrete words and familiar contexts. Avoid unexplained abstract or specialist vocabulary; when a mathematical word is needed, explain it with the example or model.
- For counting, make clear which objects are counted and support one number word per object. Include zero only with a visible empty set or an explicit “none” situation. When objects are rearranged, help the learner see that moving them does not change how many there are.
- For addition and subtraction, make the action clear: joining, adding, taking away, finding how many are missing, or comparing two groups. Do not treat all subtraction questions as “take away.”
- Keep quantities, pictures, labels, answer choices, and narration consistent. A visual model must not imply a different count or operation from the wording.

## Practice and feedback

- Demonstrate one fully worked example with explicit small steps before asking the learner to solve a similar task.
- Let the learner respond by counting, choosing a picture, moving or grouping objects, drawing, or selecting a number sentence. Do not require a long written explanation when a picture or demonstration can show the reasoning.
- Give hints that direct attention to the next action (for example, pair objects or count empty spaces), without stating the answer. After success, connect the explanation to what the learner did.
- Use small, purposeful number ranges in distractors. Wrong choices should reveal a likely counting or operation error without introducing unnecessary reading difficulty.

## Story and language

- Apply the general skill's core rule and story contract: the character's goal, the learner's mathematical action, and the visible story consequence should fit together.
- In Grade 1 the story lives in `src/content/grade1/adventures.ts`: `intro` is what the hero wants in the mission (shown in the hero's bubble), `steps[i].introduction` is the instruction above the picture for `checks[i]`, `steps[i].rows` (and `after`, `spread`, `track`) is the picture the child touches, `steps[i].reward` replaces the bubble after a right answer. Edit the episode step, the check in `numbers.ts`/`operations.ts`/`world.ts`, and `hints.ts[i]` together; the lesson's `story`/`steps`/`scene` is the worked example and stays in the same world with different numbers.
- Mission pages: `src/components/learn/DayLesson.astro` (frame for all 35), `src/lib/storyScene.ts` (picture kinds: groups, tens, track with page/step/day moves, cards, bars for ribbons and measuring blocks, a 3 × 3 route map), `src/scripts/dayLesson.ts` (flow, stars, new numbers). Episode kinds map onto those (people, shapes, solids, sorting, votes → groups; plant → cards; calendar → track; lengths, measure → bars). Every episode has `intro`; tracks and maps give `track`/`route` (no lesson-id special cases in components). Each mission whose first check has numbers to vary has a `g1-*` generator in `src/math/practice/generators.ts` that re-creates the story question **and** its picture (`scene`); the picture must show the marked answer (checked in `src/tests/practiceGenerators.ts`). Route, planting order and sorting have no generator.
- Use emoji that every phone draws (Emoji 11 or older): no 🪣, 🪀, 🪏. Symbols like ▰ read as black bars; avoid them as objects.
- The question itself must name Tomi's objects, not bare numbers. Not "Which quantity is smaller: 4 or 7?" but "7 friends are coming and there are 4 balloons. Which is fewer?" The picture rows must show exactly the quantities the question asks about, and the reward must say what the answer let the hero do.
- Conceptual questions ("When are quantities equal?") stay conceptual but point to the scene: "When is there one hat for each friend?" with hats and friends in the picture.
- Keep characters' goals and objects concrete and understandable to a first-year primary learner. The math story may use familiar play, home, school, neighborhood, animals, transport, or nature contexts; choose what actually serves the objective.
- The teaching explanation, exercise prompt, and story dialogue may use different wording. They need not repeat each other, but their quantities, actions, assumptions, and conclusion must agree. Keep each exercise understandable on its own.
- Write natural es-AR for the primary course and clear en-US as its translation. Preserve the same mathematical model and story action; do not substitute a different school system or change the task's cognitive demand.

## Story bible: "Un día con {name}" / "A day with {name}"

**Premise.** The chosen hero `{name}` (Tomi or Lola) spends a day out with friends: gets ready at home, meets friends, plays in the park, explores a garden, and comes back home. **Thread through the whole day:** before leaving, Grandma says "we take what we can count, so we bring everything back". What {name} counts, labels, and packs in the morning is checked again at the end of the day (G01-13, G01-14).

**Characters.**
- `{name}`: the child hero; decides and acts. Spanish around the name is gender-neutral ("{name} cuenta", not "{name} está listo"); English repeats the name instead of he/she. Do not use `{a|b}` inside `text()` strings (it splits on `|`).
- La abuela / Grandma: the grown-up who goes with {name}; asks the questions that need an answer; never solves for the child.
- Friends: Ana, Leo, Sol, Paz, Teo (fixed names, fixed line order Ana, Leo, Sol, Paz, Teo when they line up).
- Átomo, the robot fox: hints only.

**Objects** are emoji the child can tap: toys 🚗 🧸 ⚽ 🤖 ⛵, sand toys 🐚 ⭐ 🦀 (molds), crayons 🖍️ with one dot ● each, balloons 🎈, sun hats 🧢, friends 🙂, stickers ★, sheets of ten shown as a 10-dot strip, phone notebook pages as numbered cards.

**Places and missions** (`DAY_PLACES` in `src/content/grade1/day.ts`): home 1–9, friends 10–11, park 12–23, garden 24–31, back home 32–35.

### Place 1 — Nos preparamos / Getting ready (G01-01 … G01-03)

| Lesson | Need | Check 1 → result | Check 2 → result |
|---|---|---|---|
| G01-01-L01 Count each object once | Grandma: "Count the toys you take, so we bring them all back." Example: 3 toys on a chair counted with marks. | Shelf with 5 toys to pack: how many? (5) → "5" written on the backpack list. | {name} counted the ball twice and got 6. What helps? (mark each counted toy) → every toy has a ✓; the list is right. |
| G01-01-L02 Zero | The sand-toy pocket must be filled. Example: an empty lunch box = 0 sandwiches, then 2. | The pocket is empty; 3 sand toys wait outside. How many inside the pocket? (0) → the pocket label says 0: still to fill. | {name} puts them in saying 1, 2, 3. How many are inside? (3) → pocket label 3. |
| G01-01-L03 Moving does not change how many | The toy scoop is behind 4 molds; {name} spreads them to reach it. Example: 3 cups moved apart are still 3. | After spreading, how many molds? (4) → scoop reached; still 4 molds go in. | Why still 4? (none added or removed) → the bag gets 4 molds. |
| G01-02-L01 Quantity, dots, numeral | Each box gets a number label so nothing is lost. Example: 3 snack cookies → ●●● → 3. | Crayon box with ●●●●: which number? (4) → "4" on the crayon box. | What does the 6 on the other box tell? (how many) → both boxes labelled. |
| G01-02-L02 Ten and some more | Sticker gifts for friends. Example: 1 sheet + 2 loose = 12. | 1 sheet of 10 + 7 loose: how many? (17) → Leo's gift is labelled 17. | Why are two sheets 20? (10 + 10) → Ana's gift labelled 20. |
| G01-02-L03 Tens to 100 | The sticker box that stays at home is labelled too. Example: 3 sheets + 4 = 34. | 5 sheets + 2 loose: which number? (52) → box label 52. | Why does 40 have no loose ones? (four full tens) → box label 40. |
| G01-03-L01 Compare by pairing | {name} takes a balloon for each friend. Example: 5 cups and 3 plates paired. | 4 balloons, 7 friends: which is fewer? (balloons) → {name} blows up 3 more. | When is there one hat for each friend? (none left when pairing) → ready for the park. |
| G01-03-L02 Before and after | The friends' phone notebook. Example: page 8 is between 7 and 9. | Friends' numbers are on the page after 19. Which page? (20) → notebook opens at 20. | Ana is on the page before 7: why 6? (one step before) → tab placed on 6. |
| G01-03-L03 Order numbers | {name} calls friends in page order, front to back, so nobody is skipped. Example: cards 9, 3, 6 → 3, 6, 9. | Call cards 8, 2, 5: which row is in order? (2, 5, 8) → calls go 2, 5, 8. | Two cards left, 3 and 6: is a 4 card needed? (no) → everyone is called; meet at the park. |

### Places 2–5 (written; keep checks, episode steps, and rewards in step)

| Place | Missions and story need |
|---|---|
| 2 Con los amigos (G01-04) | Count the friends at the gate → one juice each; a swap keeps 5. The friend in fourth place carries the walk flag; “five friends” vs “the fifth friend”. |
| 3 ¡A jugar! (G01-05 … G01-08) | One pile of seed per bird (birds arrive); signs for the sand town (2 + 5, order swapped); hopscotch to the pebble on 7; take barriers off the toy road; stickers missing from an album row and unpaired stickers; fetch the ball 2 tiles back and check by moving forward; 8 balls in two baskets; fill the ten-board; fill the 10-box first; garland pattern; frog hops +2 and telling a new friend the rule; a dance that repeats 1, 2, 3. |
| 4 El jardín (G01-09 … G01-12) | The cup between book and ball at the picnic, agreeing on a viewpoint; route on the map from the house to the garden (two orders); triangle roof and turned square for the garden sign; ball/die/can town (sphere, cube); ribbon B for the big gift, aligning starts; 5-block bridge strip and gaps; planting order and the step card; the day after Sunday and day changes to Thursday’s visit. |
| 5 De vuelta (G01-13, G01-14) | Put pieces away by shape, then by size; vote for the photo decoration (only these 8 voted); album stories (Leo gives 2, Sol receives 5); at home Grandma checks the morning list with two ways of counting — everything came back. |

## Grade 1 completion check

Before finishing, check that a learner can tell what to look at or do, can connect the picture to the quantity or operation, and can see how a correct response helps the story goal. A child who cannot read yet will hear Tomi's speech and the question one after the other: together they must describe one situation, with the same objects and numbers. Check number bounds against the lesson's place in the course, and read both locales aloud for short, natural instructions. If an objective genuinely requires a new term or symbol, introduce it through a concrete example before expecting independent use.
