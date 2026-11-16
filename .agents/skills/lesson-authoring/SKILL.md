---
name: lesson-authoring
description: Create, revise, audit, or review Mundoki lessons so that every story challenge is a mathematical decision the character actually needs, and success visibly changes the story. Use for lesson content, checks, hints, explanations, mission copy, rewards, scenes, chapter progression, and for fixing lessons whose exercises are disconnected from the game narrative.
metadata:
  short-description: Author story-integrated Mundoki lessons
---

# Author Mundoki lessons

Use this skill when creating, rewriting, auditing, or reviewing lesson content or its game narrative. Read `AGENTS.md` and `docs/lesson-creation-plan.md` for project constraints, course scope, and grade expectations. Use the matching grade skill when one exists (`.agents/skills/grade-1-lesson-authoring/`, `.agents/skills/grade-2-lesson-authoring/` — the latter also holds the Grade 2 story map); for other grades take age, vocabulary, and number ranges from the plan and from neighboring lessons.

## The core rule

In a story mission, **the challenge is the plot step.** A learner answers a challenge because a character needs that answer to decide or do something; the answer then changes the scene.

**Character goal → concrete situation with story quantities → challenge whose answer is a decision or an action → reward/scene showing what that specific answer made possible → next mission follows.**

Quick test for every challenge: *could this question be moved into a different lesson's story unchanged?* If yes, it is disconnected. A themed background, a character name, a badge, generic praise, or a reward like "First label checked" after a question about something else does **not** create a connection.

## Where the pieces live (edit them together)

Each lesson is split across two layers that are rendered on the same page:

| Layer | Grade 2 example | Other grades |
|---|---|---|
| Curriculum lesson: `story` (worked example context), `steps`, `scene`, `misconception`, `checks[i].prompt/options/explanation` | `src/content/grade2/numbers.ts`, `operations.ts`, `groups.ts`, `world.ts` | `src/content/gradeN/*.ts` built with `createLessonFactory` (`src/content/lessonModel.ts`) or `author.ts` |
| Hints per challenge | `src/content/grade2/hints.ts` (`hints[lessonId][i]`) | `src/content/gradeN/hints.ts` |
| Game layer: mission `title`, `introduction`, `rewards[i]`, chapters, scene state | `src/content/grade2/roadTrip.ts` | grade1 `adventures.ts`, grade3 `cityAdventure.ts`, grade4 `islandAdventure.ts`, grade5 `moonAdventure.ts`, grade6 `oceanAdventure.ts`, grade7 `parkAdventure.ts` |
| Package checks (separate practice) | `src/content/gradeN/assessments.ts` | same |

`rewards[i]` (or adventure `steps[i]`) is shown right after `checks[i]` is solved; `hints[i]` belongs to `checks[i]`. Treat **mission intro + check i + hint i + explanation i + reward i** as one unit and rewrite them together.

Older code comments say the checks are "the single source of truth" and that missions are "not replacements for the quantities or contexts of the original questions". That described the old bolt-on approach; it is **not** a constraint. You may and should rewrite check prompts, options, quantities, and contexts to fit the story, as long as the learning objective and difficulty are preserved. Update such comments when you touch those files.

## Preserve the learning goal

- Keep the mathematics accurate and matched to the lesson `objective`. Change the story beat, not the objective, when they do not fit.
- Preserve cognitive demand: same number range, same operation meaning, same kind of reasoning (e.g. a "why" question stays a reasoning question, now about story quantities). Keep the likely-error distractor.
- Provide every quantity, unit, and assumption the learner needs inside the prompt. A challenge must be solvable from its own text and visual, without remembering earlier dialogue.
- Keep `es-AR` and `en-US` equivalent in mathematics, assumptions, learner agency, and story outcome. English translates the same CABA-oriented course.

## Design the story from the math, not the other way round

1. For each chapter, list the objectives of its lessons in order. Then pick story beats in which those exact operations are the natural way to decide something (compare prices → choose; decompose an amount → pay with notes; share equally → load boxes; measure → check the part fits).
2. If an existing beat cannot need the math (e.g. "use jumps of ten to test the dashboard"), **change the beat**: rewrite mission title, introduction, and rewards. Adjust neighboring missions only as needed to keep the arc plausible, and keep `ROAD_CHAPTERS`/scene-state logic consistent if chapter meaning changes.
3. Make consequences proportional: one comparison can choose a car card; it cannot buy, repair, and paint the car. Two challenges = two visible sub-steps toward the mission goal.
4. Keep money and purchases fictional and age-appropriate (play money, a toy shop, a game catalog). Numbers must stay within the grade range even if real prices would not.

## The worked example

The worked example (`lesson.story`, `steps`, `scene`) is shown under the mission header. Put it in the **same story world** but on a **different case** with different numbers, so it teaches the method without giving away the challenge answers (e.g. the first car tag in the example, other tags in the challenges). It need not repeat dialogue, but its quantities, model, and assumptions must agree with the challenges. Do not leave an unrelated context (pencils, libraries) directly under a car-shop mission.

## Practice pauses are the exception

Package checks in `assessments.ts` are general practice and may use any context. Inside a story mission, every `checks[i]` should be story-integrated. Use a standalone practice item there only when no plausible beat fits after trying step 2 above; then say so explicitly in the prompt (e.g. "Pausa de práctica: …") and give it a neutral reward that does not claim a plot effect. Record the reason in your report. More than one such item per chapter means the arc needs redesign.

## Story contract (write it before editing)

For each lesson, draft this table first (in your notes or report), then write the content from it:

| | Character's need | Challenge (math) | Correct answer means… | Reward / scene change |
|---|---|---|---|---|
| Intro | goal of the mission | — | — | — |
| Check 1 | sub-decision | prompt + numbers | what it decides | what visibly changes |
| Check 2 | next sub-decision | … | … | … |

Then verify: the hint for each check points to the next action **on the story objects**, the explanation restates why the answer enables the decision, and the next mission starts from the state the last reward created.

## Workflow for fixing existing lessons

1. **Audit** a whole grade (or chapter): classify each lesson as connected / weak (themed but no decision) / disconnected, quoting the mission intro, each prompt, and each reward. Report this before large rewrites.
2. **Arc first**: fix chapter beats where the math cannot be needed (see above).
3. **Rewrite per lesson** with the story contract, editing curriculum lesson, hints, and mission together.
4. Keep test invariants: one hint per check, hints differ from explanations, assessments keep prompts distinct from lesson checks, both locales present. Note that `check()` places the correct option by prompt length, so do not hard-code answer positions elsewhere.
5. Run `npm run lint` and `npm test`; read the rendered lesson page in both locales when possible.

## Review checklist

Read the learner-facing sequence: mission header → worked example → each challenge, hint, explanation, reward → next mission. Fail the lesson if any of these is true:

- a challenge passes the "could be moved to another story" test;
- a reward names an object or action that the challenge did not involve;
- the worked example uses an unrelated context or reveals a challenge answer;
- a hint mentions numbers or objects not in its challenge (common after rewriting prompts);
- the story claims more was achieved than the answers established;
- mathematics, number range, or difficulty drifted from the objective;
- es-AR and en-US differ in quantities, assumptions, or outcome.

## Example: place value in a car showroom (G02-01-L01)

Disconnected (current): mission "We are looking for our first car… read the shop labels"; worked example about 243 school pencils; check "What is the value of 6 in 461?"; reward "First label checked." Nothing in the answer chooses or affects a car.

Connected (the full Grade 2 map is in `.agents/skills/grade-2-lesson-authoring/SKILL.md`):

- Intro: "Each car tag shows its price in play coins: boxes of 100, packs of 10, and loose coins. {name} copies every price onto the shopping card."
- Worked example: the red car's tag shows 2 boxes, 4 packs, 3 loose coins → 243 coins; steps decompose it.
- Check 1: "The blue car's tag says 461. How much is the 6 worth?" → 60 / 6. Reward: "The blue car goes on the card: 400 + 60 + 1 coins."
- Check 2: "The green car costs 222. Why is one 2 worth 200, another 20, and another 2?" → positions. Reward: "Green car added. The card is ready to compare prices." — leading to G02-01-L03, where the learner compares and chooses.
- Hint 1: "Find the 6 on the blue tag. Is it in the boxes, the packs, or the loose coins?"
