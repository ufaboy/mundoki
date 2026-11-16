# Grade 1 lesson content

The 30 shared Tomi story episodes show a worked example before the game. `hints.ts` provides two bilingual action hints per episode; these are separate from the answer explanations shown after success. Child-facing prompts use concrete actions and objects; adult guidance remains in expandable sections.

Implements the 14 Grade 1 packages from `lesson-creation-plan.md`: 35 lessons, each with es-AR and en-US content. `numbers.ts` covers packages 01–04, `operations.ts` covers 05–08, and `world.ts` covers 09–14. `index.ts` assembles the catalog, prerequisites, and final project. Astro's `gradeOneLessons` collection validates the content and builds 70 localized lesson pages.

Each lesson has an observable objective, an oral/action-based entry check, a story, a visual scene, three worked steps, a misconception, two guided questions, and an open exit task with adult review guidance. The 14 package assessments contain five fresh items each: recognition, two procedural items, application, and reasoning. There are 140 authored questions in total, each translated into both locales.

The two-choice questions provide practice evidence, not a validated diagnosis. A package's practice message requires at least four correct answers, including the application and reasoning items. Drawing and oral explanation remain separately reviewed by an adult. No mastery or game rewards are submitted from this client-side practice. Answers reset on navigation/reload; these lessons do not add persistent progress or new infinite exercise generators.

Visual cards can be marked with pointer or keyboard, and counters can be spread without changing their quantity. Spatial rows preserve their horizontal order; measurement examples align their starting edge. Hands-on activities explicitly use real objects alongside the on-screen representations.

Curriculum alignment remains `editorial`, based on the supplied research and plan; no independently verified normative alignment is claimed. The suggested ten-minute duration and assessment threshold require a classroom pilot. Follow-up practice after 7–14 days uses new objects and explanations with an adult; automatic scheduling is not implemented.

Validation: `npm run lint`, `npm test`, `npm run build:worker`. The Grade 1 suite verifies plan coverage, stable IDs, translation completeness, prerequisites, distinct assessment prompts, localized links, and the application/reasoning threshold. Browser QA covers Spanish and English pages, marked counters, practice feedback, failed reasoning despite 4/5, successful 5/5, and spatial layout.
