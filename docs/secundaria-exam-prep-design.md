# Secundaria (Grades 8–12): exam-prep mode — design note

Status: **draft for review**. Product direction decided on 2026-11-18; screens, data model, and pricing details below are proposals until approved.

## 1. Why a different format

The primaria format (Grades 1–7) is a story game: the child picks Tomi or Lola, Átomo the robot fox gives hints, each correct answer adds a piece to a world (house, plane, ship…), and most challenges offer two answer options (`check()` in `src/content/lessonModel.ts`).

For learners aged 13–17 the same format is expected to fail:

- **Looking childish is the main reason teens drop a product.** Child heroes, a puppy, and a cartoon world signal "made for my little brother".
- **Story rewards stop working.** "Your answer added a roof tile" does not motivate a teenager; competence, a visible result, and real usefulness do.
- **Two options invite guessing.** A 50% chance is obvious to a teen and empties the practice of meaning.
- **Friendly narration feels patronising** at this age.

What does motivate this group, especially in Argentina, is **passing**: the next *prueba*, the end-of-term assessment, and above all not ending up with a subject carried over (*materia previa*) to the December or February/March examination periods. Parents feel this pain strongly and are the ones who pay.

**Decision:** Grades 8–12 get an **exam-prep mode**: calm, adult presentation; no child heroes, no world-building rewards; the promise is "understand the topic and arrive ready for the test".

Grades 1–7 keep the story games unchanged.

## 2. Target users and promise

| User | Situation | What they need from Mundoki |
|---|---|---|
| Student, regular | Has a *prueba* in 1–3 weeks on a few topics | Fast explanation of what they missed, practice until confident, a signal that they are ready |
| Student, at risk | Failing the term or carrying a *previa* | A full pass through the year's topics, prioritised by weakness, with a deadline |
| Student, self-driven | Wants to be ahead or understand better | Free access to any topic, harder challenges |
| Parent | Pays; worries about repeating the year | A plain report: what is ready, what is not, whether the child is actually practising |

Promise (product language, both locales): *Entendé el tema y llegá preparado a la prueba.* / *Understand the topic and walk into the test ready.*

## 3. Modes

### 3.1 Topic from zero (*Tema desde cero*)

A single skill package (e.g. G09-06 "Systems of linear equations") from `docs/lesson-creation-plan.md`, following the existing lesson structure: short prerequisite check → visual exploration → worked example → typical mistake → practice → exit ticket. Length 15–25 minutes, as the plan already states for Grades 8–12.

### 3.2 Preparing for a test (*Me preparo para la prueba*)

1. The student picks their year and the topics on the test (multi-select from the year's packages), and optionally the test date.
2. A **diagnostic** of 1–2 items per topic (types B and C from the plan's A–D mastery model) finds the weak topics.
3. Mundoki builds a **plan**: weak topics first, short daily sessions spread up to the date, with spaced re-checks.
4. A **readiness indicator** per topic and overall (see §5).
5. Before the date: a **mock test** (*simulacro*): mixed items, timed (timer optional), no hints, with a full breakdown afterwards.

### 3.3 Carried-over subject (*Previa / recuperatorio*)

The same as 3.2, but the scope is the whole year (or the topics the teacher listed) and the horizon is longer (weeks, not days). Mundoki suggests a weekly rhythm and shows the share of the year covered so far.

> The examination periods and names (*períodos de apoyo y acompañamiento*, *mesas examinadoras*, months) must be checked against current CABA regulations before they appear in product copy. Until then use the neutral wording "your test date".

## 4. Exercises

- **Typed answers by default**: numeric, fraction, expression or equation. The existing answer types (`numeric`, `fraction`, `equation` in `src/math/core/types.ts`) and the validator cover the start; expression equivalence (e.g. `2(x+3)` vs `2x+6`) needs a new deterministic checker.
- **Choice only where choosing is the skill** (pick the model, the graph, the right argument, the step with the error), and then with 4 options, not 2.
- **Multi-step items**: the student enters intermediate results; feedback points to the **first wrong step**, not just "wrong".
- **Typical-mistake analysis**: every generator lists its common errors (sign error, forgetting to distribute, adding instead of multiplying the scale factor, confusing P(A|B) with P(B|A)…) and the matching short explanation. When a wrong answer matches a known error, the student sees that explanation.
- **One hint per exercise**: a nudge (what to notice, which rule applies), never the computation or the result. Using it may lower the readiness credit for that item but never blocks progress. *(Decided 2026-11-18, replacing a three-step hint ladder.)*
- **No worked solution inside exercises** *(decided 2026-11-18)*: a solution shown after a wrong try let students copy the answer. The lesson's worked example is the full solution; a stuck student goes back to it. A step-by-step breakdown returns only after a mock test, where the answers are already final.
- **Interactive visuals** where they explain the idea (sliders for `a` and `b` in `y = ax + b`, parabola vertex, intersecting lines for systems, area model for polynomials). These count as "explore", not as graded items.
- **Server verification** stays as it is: `POST /api/progress/sync` recomputes correctness from `(topicId, difficulty, seed)` and the answer, deduplicated by `attemptId`.

## 5. Progress and readiness

Replace world pieces and stars with **mastery per skill package**, using the plan's existing model:

- Item types A (recognise), B (do), C (apply), D (explain / find the error).
- A skill counts as **mastered** after 4 of 5 correct including C and D, then **confirmed** by a short re-check after 7–14 days (thresholds to calibrate in a pilot).
- **Readiness for a test** = share of the selected skills that are mastered, adjusted down for skills not re-checked recently. Shown as a plain percentage plus a list "ready / almost / not yet".

Honesty rule: readiness is an estimate of practice coverage, not a predicted grade. Copy must never promise a mark.

## 6. Parent report (Familia area)

One plain screen per child, no technical terms:

- Upcoming test date and topics (if the student entered them).
- Readiness: ready / almost / not yet, per topic.
- Activity: practice days and minutes in the last 7 days.
- One suggested action ("Two short sessions on systems of equations before Friday").

The student must know what the parent can see; the report shows effort and coverage, not every wrong answer.

## 7. Visual style and tone

- Uses the shared design system (`src/styles/design-system.css`) and the existing Grade 8–12 lesson size stage on `.mk-lesson`.
- Calm, clean, more white space; one accent colour per year as already planned for grade pages; no cartoon world illustrations inside lessons.
- **No child heroes and no hero picker** for Grades 8–12.
- **Átomo** appears only as a small icon on the hint button: no dialogue, praise, animations or story lines. *(Decided 2026-11-18.)*
- Tone: direct and respectful, still voseo in es-AR (*calculá*, *revisá*), no exclamation-heavy praise. Feedback names the mistake specifically.
- Mobile first, as everywhere: many teens will practise on a phone; typed math input must work well on a phone keyboard (dedicated buttons for `x`, `^`, `√`, fraction, `±`).

## 8. Premium

The current model says "Premium secondary topics". Split for this mode *(decided 2026-11-18)*:

- Free: "Topic from zero" for the first package of each year, and the diagnostic for any test.
- Premium: all packages, test plans, mock tests, the previa mode, and the parent report beyond the current week.

The diagnostic being free is deliberate: it shows the parent the gap before asking for payment.

## 9. What we reuse and what is new

| Reuse as-is | Extend | New |
|---|---|---|
| Deterministic generators and seeds | Answer types: expression equivalence, multi-step items | Test plan (topics, date, schedule) |
| Server re-check in `/api/progress/sync` | Generators gain a list of typical errors with explanations | Diagnostic and mock test flows |
| KaTeX rendering | Mastery model A–D per skill | Readiness calculation |
| es-AR / en-US routing and translations | Phone-friendly math input | Parent report screen |
| Design system and lesson size stages | | |

Data changes (new tables for test plans and per-skill mastery) follow the normal process: `src/lib/db/schema.ts` plus a new `drizzle/000X_*.sql` migration.

## 10. Rollout

1. **Validate before building content.** Show 5–8 teenagers (Grades 8–10) one existing Grade 3 lesson and a clickable mock of the exam-prep flow; watch where they stay and what they skip. Talk to 3–5 parents about the previa situation and what they would pay for.
2. **Pilot years: Grade 8 and Grade 9 together** (1.º and 2.º año secundaria CABA) *(decided 2026-11-18)*. Build 3–4 packages per year fully, plus the diagnostic, plan, and mock test shared by both:
   - Grade 8: G08-02 (operations with integers), G08-04 (expressions), G08-05 (table, graph, formula), G08-07 (first linear equations; extends the existing `linear-equations` topic).
   - Grade 9: G09-03 (linear relationship), G09-04 (linear equations), G09-06 (systems), G09-08 (Pythagoras).
   The two years share the linear thread (expression → equation → linear function → system), so the pilot also tests whether readiness and the diagnostic work across a year boundary.
   **Status (2026-11-18):** pilot content built — year pages for Grades 8 and 9, the lesson template, and all eight pilot packages (3 lessons each, 24 lessons, 168 items) in `src/content/secondary/`. Free packages are now G08-02 and G09-03 (first in plan order). The old `linear-equations` topic page and the space-themed Grade 8/9 units were removed; `linear-equations` stays only as the internal results bucket. Diagnostic, plan, mock test, and readiness are the next step.
3. Measure: share of students who finish the diagnostic, return on a second day, and complete a mock test; parent conversion after the diagnostic.
4. Then extend to Grade 10, and afterwards Grades 11–12, following the plan's stages.

## 11. Product decisions (2026-11-18)

1. **Átomo in secundaria:** kept only as a small hint-button icon; no narration (§7).
2. **Pilot years:** Grade 8 and Grade 9 together (§10).
3. **Social features** (comparing with classmates, class codes for teachers): **out of scope** for now; revisit after the base mode is validated.
4. **Premium split:** free diagnostic for any test plus the first package of each year; everything else Premium (§8).
5. **Accounts:** as today, a parent creates the account and the teen uses the child profile; no teen self-signup.

The status line at the top stays "draft" until screens and the data model are approved.
