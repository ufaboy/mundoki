# mathGround — Master Product Specification & AI Development Prompt

**Status:** Consolidated MVP specification  
**Primary authoring language:** English  
**Product locales:** Español (Argentina) `es-AR` and English (United States) `en-US`  
**Initial audience:** Primary-school and middle-school learners  
**Initial subject:** Mathematics  
**Delivery:** One lightweight Astro application deployed on Cloudflare

> **Instruction for an AI development agent:** Implement a functional, maintainable MVP based on this document. Do not stop at a design concept, static mockup, or architecture proposal. Build working educational content, an actual mathematics exercise engine, a playable character progression loop, and a free demo before expanding backend and subscription features. Report honestly what is complete, mocked, or unconfigured.

---

## 1. Product Vision

Build **mathGround**, a visual-first mathematics learning and gamified practice platform for children and students. It should feel like a combination of an illustrated math book and a lightweight educational adventure game—not a conventional long-form textbook and not a heavy browser game.

The platform has **two clearly distinct, connected experiences**:

1. **Learn:** Short illustrated article-style lessons that explain mathematical ideas through diagrams, graphical examples, visual sequences, and minimal age-appropriate text.
2. **Play:** Interactive mathematics exercises presented as a game. Correct answers help an original mascot earn clothes and accessories, obtain vehicles, travel to new planets, overcome friendly cartoon opponents, and complete adventures.

Every meaningful game reward must relate to real practice or demonstrated skill. Learning must remain accessible even when animations are disabled.

**Primary design constraints:**

- Works on low-end Android phones, older computers, small screens, and slow or unstable networks.
- Provides an immediately usable **Free Demo without registration or payment**.
- Offers **Premium via a recurring subscription**, with secure server-side entitlement checks.
- Supports Argentine Spanish and US English from the start.
- Starts with Mathematics, but supports adding other disciplines later without redesigning the platform.
- Favors a small dependency set, plain web technologies, predictable code, and low maintenance costs.

## 2. School Stages, Scope, and Curriculum

The content model must recognize **three school stages**:

| Stage | Product status | Instructional approach | Example topics |
|---|---|---|---|
| **Primary School** | **Implement in MVP** | Concrete objects, short explanations, bright visual examples, small steps | Addition, subtraction, multiplication, division, fractions, decimals, basic geometry, introductory percentages |
| **Middle School** | **Implement in MVP** | Diagrams, number lines, graphs, proportional reasoning, multi-step examples | Integers, negative numbers, rational numbers, percentages, proportions, powers, roots, basic algebra, linear equations, coordinate geometry |
| **High School** | Future only | More abstract representations, algebraic graphs, more advanced proofs and methods | Quadratic equations, functions, trigonometry, systems of equations, introductory calculus |

**MVP content minimum:** Publish **at least three complete learning topics for Primary School and at least three for Middle School**, each with a visual lesson and working practice exercises. The minimum is six complete topics, not merely six cards or placeholders.

Suggested first six topics:

- **Primary:** Addition and subtraction; multiplication and division; fractions.
- **Middle:** Negative numbers; percentages and proportions; linear equations.

The implementation can provide extra generators (e.g., decimals, powers and roots) if time and quality allow, but complete the six end-to-end topics first.

Curriculum stages must be modeled independently of a country's exact grade numbers. Later we can map stages and topics to Argentine and US curricula. **Do not publish empty High School pages or suggest that unsupported content is available.**

## 3. Approved Technology Stack

### Client and presentation

- **Astro** (latest stable release at implementation time): routing, rendering, content collections, and UI composition.
- **TypeScript** for application and math logic.
- **Native HTML and plain CSS**, including CSS variables for design tokens.
- **Vanilla TypeScript**, small page-scoped modules, and native browser APIs for interactivity.
- **SVG** for lightweight diagrams, mascots, overlays, outfits, vehicles, and game scenes.
- **CSS animations/transitions** for affordable, nonessential motion.
- **KaTeX** for mathematical notation, pre-rendered when feasible.

### Server and persistence

- **Astro Server Endpoints** running on **Cloudflare Workers**.
- **Cloudflare D1 (SQLite)** as the application database.
- **Drizzle ORM** for typed queries and schema migrations.
- **Better Auth** for authentication and session management, integrated with D1/Drizzle using Worker-compatible APIs.
- **Mercado Pago** for recurring Premium subscriptions in Argentina, behind a minimal payment-provider interface.
- **Cloudflare CDN and static assets** for public lessons and resources.

### Explicitly avoid for the MVP

- Next.js, React, Vue, Angular, Redux, or heavy client-side application frameworks.
- Separate NestJS/Express/Fastify backend services; microservices; always-on Node.js servers.
- Unity, Phaser, WebGL, heavy animation engines, or an invented general-purpose game framework.
- Redis, complex job queues, Kubernetes, Docker requirements, and premature distributed architecture.
- Large UI kits, chart libraries, third-party tracking scripts, or unnecessary dependencies.

The application should live in **one repository**, with one Astro project and Worker-compatible server logic. Add a dependency only when its benefits clearly outweigh size and maintenance costs.

### Why TypeScript stays

TypeScript is for **development-time correctness and maintainability**, not for adding a runtime to the browser. Its types are removed during compilation. Use it especially for:

- Math problem definitions and answer formats.
- Validation results and deterministic exercise generators.
- Mascot/game state and reward events.
- D1 database models and queries.
- Authentication, API responses, and subscription states.

Keep types readable and pragmatic. Avoid unnecessarily elaborate generics, large class hierarchies, and speculative abstractions. TypeScript does not replace mathematical unit tests or runtime input validation.

## 4. System Architecture and Separation of Responsibilities

```text
Low-end browser / smartphone
  |
  |-- Astro pre-rendered HTML + CSS + SVG + minimal JS
  |      |-- Learn: illustrated lessons; ideally no JS
  |      '-- Play: local TypeScript exercise engine and small game state
  |
  '-- HTTPS requests only when needed
         |
         '-- Astro Server Endpoints on Cloudflare Workers
                |-- Better Auth / sessions / account security
                |-- Premium entitlement and protected lessons
                |-- Trusted score and reward verification
                |-- Progress sync and user dashboard data
                |-- Mercado Pago checkout and verified webhooks
                '-- Cloudflare D1 via Drizzle
```

**Static-first:** Public lessons should be pre-rendered and delivered by the CDN. Use dynamic server rendering only for account information, Premium access, protected content, and server-side operations.

**Local-first:** An exercise must not require a network call after every answer. The browser validates simple challenges immediately, updates the scene, and queues results for later synchronization.

**Server authority:** The browser may provide immediate feedback and *provisional* rewards, but official progress, Premium access, and permanently saved unlocks require server-side authorization and independent validation. Never rely on a client-submitted boolean like `isCorrect: true`.

**Future extensibility:** Use a data hierarchy such as `Subject → School Stage → Topic → Lesson → Exercise → Attempt`, while keeping the mathematics engine and game rules independent from presentation.

## 5. Localization and Language Experience

Support **exactly these two locales** initially:

- `es-AR` — natural Argentine Spanish.
- `en-US` — natural US English.

Requirements:

- Detect browser language, default to `es-AR` when unsupported, and allow manual switching.
- Store a logged-in user's preferred locale.
- Localize menus, navigation, errors, lesson text, exercise prompts, hints, solutions, mascot dialogue, rewards, account forms, and pricing copy.
- Use locale-aware number/date display and handle decimal separators carefully in numeric inputs.
- Keep math logic language-neutral and content/translations outside UI code.
- Do not make a language switch silently change subscription currency or billing eligibility.

Example localized routes:

```text
/es-ar/
/es-ar/matematicas/
/es-ar/matematicas/fracciones/
/es-ar/jugar/fracciones/

/en-us/
/en-us/mathematics/
/en-us/mathematics/fractions/
/en-us/play/fractions/
```

Build a simple locale-routing strategy with canonical, accessible links. Translation completeness is part of release testing.

## 6. Product Pages and Navigation

### Main navigation

- Home
- Learn
- Play
- My Progress (authenticated)
- Premium
- Language selector
- Account

### Homepage

A concise product explanation, a real **Start Free** CTA, visual previews of lessons and mascot gameplay, age/stage selection, Free/Premium comparison, and accessible footer. No registration wall before trying a lesson or exercise.

### School Stage and Topic Catalogs

Choose **Primary School** or **Middle School**, then a topic. Each topic clearly exposes **Learn** and **Play** actions, difficulty/age level, and Free or Premium availability. High School can be mentioned as a future stage but should not lead to empty course pages.

### Learn Lesson

A short visually explained article with diagrams, worked examples, optional details, 1–2 quick understanding checks, and a clear **Start Adventure** or **Practice This Topic** action.

### Play Practice

A focused game scene with mascot, one mathematical challenge at a time, large answer controls, hint, answer feedback, visible adventure progress, and a session summary.

### My Progress / Dashboard

Show completed topics, practice accuracy, active stage, current adventure, unlocked outfits, achievements, practice history, and subscription status. Use plain HTML/CSS and simple graphics; avoid heavy chart packages.

### Account and Pricing

Email/password sign-up and login, password reset, locale preference, subscription status and management. Pricing must show accurate current configuration and clear adult-oriented payment controls.

## 7. Learn Mode: Visual-First Article Design

Each lesson is a **short illustrated article**, not a wall of text or a slideshow full of quizzes.

### Content principles

1. Teach **one idea at a time**.
2. Show a concrete visual model *before* introducing symbolic notation.
3. Prefer diagrams, number lines, fraction bars, counters, grouped objects, geometry figures, simple graphs, and balance illustrations over paragraphs.
4. Use concise, age-appropriate language and clear labels.
5. Show each transformation as an understandable step.
6. Explain **why** a rule works, not only what to memorize.
7. Include a quick common-mistake example.
8. Offer optional collapsible additional explanation for students who need more detail.
9. Include text alternatives/captions for essential visuals and never rely solely on color.
10. Ensure formulas, diagrams, and interactions remain readable on narrow mobile screens.

### Standard article structure

1. **What is this?** One-sentence introduction and illustration.
2. **See it visually.** One clear diagram or visual sequence.
3. **Let's solve one.** Worked example in 2–5 small steps.
4. **Watch out for this.** Brief common misconception.
5. **Check understanding.** One or two optional questions.
6. **Practice in Play Mode.** Prominent action linked to this topic.

### Concrete lesson examples

**Fractions:** Draw a pizza divided into four equal slices, highlight one slice, then introduce **1/4** as “one of four equal parts.” Show other objects to establish generality, not merely a pizza metaphor.

**Multiplication:** Show three groups of four counters; visually link `4 + 4 + 4 = 12` to `3 × 4 = 12`.

**Equations:** Represent `x + 3 = 7` on a balance or equivalent visual model. Remove three from both sides to reveal `x = 4`, and explain why balance is maintained.

### Content storage

Use **Astro Content Collections** for *public* lessons. Store localized text and reusable diagram definitions in repository files. Use Markdown or MDX only where genuinely helpful.

```text
src/content/lessons/
  es-ar/mathematics/primary/...
  es-ar/mathematics/middle/...
  en-us/mathematics/primary/...
  en-us/mathematics/middle/...
```

Represent each lesson with metadata such as `subject`, `stage`, `topic`, `locale`, `title`, `summary`, `accessLevel`, visual blocks, explanation steps, and related exercise types.

**Never put restricted Premium lesson text or answer banks in public static assets, generated public routes, or downloadable client bundles.** Serve protected material from authenticated Worker routes after checking entitlement.

## 8. Play Mode: Mathematical Adventure and Reward Loop

The practice experience should feel like a **small educational adventure**, not a plain worksheet with decorative art.

### Core game loop

1. Choose a stage and topic.
2. Open a scene featuring the original mathGround mascot.
3. Present a mathematically generated question.
4. Accept an answer using accessible controls.
5. Validate locally where possible.
6. On success, visibly advance the current mission and show constructive feedback.
7. On a wrong answer, explain or hint, allow a retry, and never shame or frighten the player.
8. After a series of challenges, unlock a story event, cosmetic item, new vehicle, or destination.
9. Start another challenge or show a session summary.

### MVP adventure theme

**Use space exploration as the main adventure.** Each planet can represent a topic or practice milestone. This gives mathGround a coherent progression system while supporting future themed worlds.

### Required working reward mechanics

At least **three distinct mechanisms** must be implemented and connected to validated exercise outcomes:

1. **Appearance/customization:** Earn and equip a hat, shirt, shoes, or another cosmetic item. Show the item on the mascot.
2. **Vehicle/spaceship progression:** Correct answers contribute energy or construction progress; reaching a target visibly upgrades or launches a vehicle.
3. **New destination/challenge:** A completed mission unlocks a planet or a friendly cartoon-style boss/obstacle challenge.

Possible future expansions include cars, elaborate outfits, new planets, robots, silly monsters, and puzzle guardians. Do not attempt a huge game world in the MVP.

### Reward pacing

- Every correct answer gives immediate, non-monetary feedback (movement, energy, stars, etc.).
- Several correct answers complete a small milestone.
- Completing a topic or mission unlocks a meaningful cosmetic or location.
- Hints and retries should support learning rather than create a punitive score loop.
- No loot boxes, gambling-like rewards, in-game currency sales, or pay-to-win shortcuts.

### Mascot specification

Create **one original, simple, recognizable, child-friendly mascot**. It should support layered SVG elements for body, outfit, and accessories. Implement a few reusable states: idle, thinking, happy, celebrating, traveling, and overcoming an obstacle.

Prefer accessible SVG plus CSS transitions over complex animation technology. Respect `prefers-reduced-motion`, provide a skip/low-motion option, and keep essential progress visible when motion is disabled. Do not include graphic violence or frightening boss scenes.

### Game engineering

Use a compact state machine or equivalent explicit state transitions. Separate **exercise result events** from **game progression rules**. For example:

```ts
type AnswerResult =
  | { status: 'correct'; exerciseId: string }
  | { status: 'incorrect'; exerciseId: string; hint?: string };

type GameEvent =
  | { type: 'ENERGY_EARNED'; amount: number }
  | { type: 'OUTFIT_UNLOCKED'; itemId: string }
  | { type: 'PLANET_UNLOCKED'; planetId: string };
```

This is illustrative, not a requirement to add a large event framework.

## 9. Mathematics Engine

The mathematics engine is a **standalone TypeScript module** with no dependence on Astro, Cloudflare, payment APIs, or specific UI components.

### Exercise definition

Each exercise should provide:

- Stable reference or reproducible definition.
- Subject, stage, topic, and difficulty.
- Prompt or language-neutral prompt parameters.
- Answer type and validation rules.
- Correct mathematical result.
- Optional visual representation.
- Progressive hints.
- Clear step-by-step solution.
- Optional server-verification metadata.

### Initial generators

Implement and test generators used by the six complete MVP topics: addition, subtraction, multiplication, division, fractions, negative numbers, percentages/proportions, and simple linear equations. Decimals, geometry, powers, and roots can follow in later increments.

### Exercise types

- Numeric responses.
- Multiple choice.
- Visual choice (e.g., select the shaded fraction or correct point).
- Lightweight matching where justified.

### Math validation rules

- Use deterministic mathematical logic, not AI model responses.
- Support mathematically equivalent fractional answers, including simplification and sign normalization.
- Handle negative numbers, invalid inputs, zero denominators, division by zero, and appropriate number bounds.
- Clearly define accepted decimal precision and tolerances rather than relying on arbitrary string equality.
- Avoid accidental float-comparison errors; use integers/rational representations where suitable.
- Test exercise generators over representative seeds and difficulty settings.
- Ensure worked solution steps are mathematically consistent with the generated question.

### Browser and trusted results

Run routine generation and validation locally for responsive gameplay. For trusted progress, issue server-controlled exercise sessions/challenge definitions, validate submitted work independently on the server, and prevent duplicate credit through unique attempt IDs or other idempotency mechanisms. Never award permanent progression solely because the browser reports a success flag.

**Security trade-off:** Because client-side practice code is inspectable, do not claim that browser-only exercises are cheat-proof. Distinguish low-stakes game feedback from server-verifiable recorded progress. Keep the verification design proportionate to the MVP.

## 10. Free Demo vs Premium

| Capability | Free Demo | Premium subscription |
|---|---|---|
| Register before first lesson | **No** | Account required for saved entitlement |
| Lessons | Selected complete lessons | All published/entitled lessons |
| Exercise practice | Limited daily/session practice | Unlimited within reasonable abuse protections |
| Mathematical validation | Immediate/local | Immediate/local when appropriate |
| Step-by-step help | Basic examples/hints | Full explanations and advanced practice |
| Mascot | One playable mascot | Same mascot with expanded progression |
| Adventures | Sample space mission | More worlds and missions |
| Cosmetics | A few sample rewards | Full available rewards |
| Long-term progress | Local/browser only | Saved and synchronized to account |
| Practice history | Limited local history | Personal history and summaries |

Anonymous demo limits stored in the browser are **best-effort UX limits**, not a secure restriction. Do not falsely advertise them as resistant to manipulation. If abuse becomes material, introduce proportionate rate limiting for server resources.

Prices must be **configurable**, not hardcoded into logic. Start with monthly recurring Premium billing in **ARS**, using Mercado Pago for Argentina. Localization and billing eligibility are separate concerns.

Purchases should be handled by an adult/appropriate account holder, not embedded as pressure tactics in a child's game experience.

## 11. Authentication and Child-Safety Boundaries

Use **Better Auth** with a compatible D1/Drizzle adapter.

- Email/password sign-up and sign-in.
- Secure session cookies, logout, session expiry.
- Password reset and email verification when the selected email delivery service is configured.
- Protected account and Premium endpoints.
- Server-side checks for identity, ownership, and entitlement.
- Safe errors and basic rate limits for sensitive auth endpoints.

Do not write custom password hashing, session cryptography, or payment-card handling.

**Children and privacy:** Minimize personal data and avoid collecting sensitive information about minors. Before launch, confirm applicable privacy, parental consent, marketing, and payment obligations for Argentina and any other target market. The MVP must not assume that ordinary account creation or billing flows are automatically appropriate for young children.

A parent/guardian payment or account-holder flow may be needed in production. Keep the architecture flexible for that without inventing a complex household-account system before requirements are confirmed.

## 12. Cloudflare D1 and Data Model

Use **D1 as the single operational database** and **Drizzle** for schema management and typed queries. D1 is SQLite-based; it is **not** Supabase and does not bundle its own authentication or PostgreSQL Row Level Security.

Suggested tables:

| Table | Purpose |
|---|---|
| Better Auth tables | Users, sessions, credentials/accounts, verification as required by the supported schema |
| `profiles` | Locale, display preferences, profile metadata |
| `subjects` | Extensible academic subject registry |
| `school_stages` | Primary, Middle, High School metadata |
| `topics` | Subject/stage, topic slug, sort order, entitlement level |
| `exercise_sessions` | Server-controlled challenge session state where necessary |
| `exercise_attempts` | Deduplicated, verified attempt records |
| `user_progress` | Topic aggregates and mastery indicators |
| `user_game_state` | Current adventure, progress, equipped cosmetics |
| `unlocked_rewards` | Persistent earned items/achievements |
| `subscriptions` | Provider IDs, state, entitlement dates |
| `payment_events` | Verified, idempotently processed provider notifications |

Only add tables needed by the current vertical slice. Prefer static files for public lessons, diagrams, and game configuration, and D1 for user-specific dynamic data.

Required controls:

- Foreign keys, indexes, uniqueness constraints, migrations.
- Parameterized queries.
- Authorized queries scoped to the current user.
- Explicit server-side role/entitlement checks.
- Never expose D1 credentials/bindings in client JavaScript.
- Idempotent attempt ingestion and payment-event handling.

**Performance:** D1 is a reasonable MVP choice, but measure write-heavy workloads and keep progress sync batched. Account for the latency of the database primary location when serving Argentina. Edge delivery of static pages does not eliminate all database round trips.

## 13. Payments and Premium Entitlement

Integrate **Mercado Pago** recurring subscriptions with a small interface so another provider can be supported later. Use currently supported Mercado Pago APIs/flows and verify exact subscription behavior during implementation; do not assume every billing feature is available in every region or account.

Required behavior:

1. An eligible account holder chooses Premium.
2. Astro Server Endpoint creates or initiates a provider subscription/checkout.
3. Payment takes place in the provider's secure flow.
4. Cloudflare Worker receives the provider's notification/webhook.
5. Backend verifies authenticity, validates the current authoritative provider status, and processes the event idempotently.
6. D1 subscription record is updated accordingly.
7. Premium endpoints grant access only when the verified entitlement is active.
8. Support cancellation, expiry, and subscription-status reconciliation.

Do not trust client claims of payment success. Do not store payment-card details. Store credentials in **Cloudflare secrets**, not committed source files.

When live Mercado Pago credentials are unavailable, provide a **development-only mock provider** with explicit labels. It must never silently enable Premium in production or masquerade as real billing.

## 14. Offline and Slow-Network Behavior

- Public lessons are cached/pre-rendered and load with minimal assets.
- Anonymous exercises can be generated and answered locally after their code and required assets have loaded.
- Save unfinished practice sessions and temporary game state using browser storage.
- Retry progress synchronization after connection failures.
- Send progress in **small batches**, not one request per answer.
- Use idempotency keys to avoid duplicate saved attempts/rewards.
- Treat unsynchronized permanent rewards as provisional and reconcile on server confirmation.
- Never cache tokens, private user data, or protected Premium content in publicly accessible caches.
- A lightweight service worker may be added only if it meaningfully improves offline reliability; avoid a complex offline framework in the MVP.

Distinguish **usable after initial load** from **fully offline from a cold start**. Do not claim the latter unless service-worker caching is explicitly implemented and tested.

## 15. Performance and Accessibility Budgets

Target **budget smartphones, unstable mobile internet, reduced CPU/memory, and accessible input methods**.

Suggested initial compressed transfer targets (measure actual builds):

| Asset type | Target |
|---|---|
| JavaScript for public reading-only lesson | Ideally 0–15 KB |
| JavaScript for a simple exercise interaction | Prefer under 50 KB |
| Page-specific CSS | Prefer under 30 KB |
| Visual diagrams and game scenes | SVG/CSS, optimized and lazy-loaded |

These are goals, not promises. Optimize actual interaction latency, download size, and mobile usability.

Practical implementation choices:

- Pre-render HTML and KaTeX where practical.
- Use system fonts by default.
- Lazy-load game assets and modules only when Play opens.
- Prefer icons and illustrations built as compact SVG assets.
- Avoid enormous spritesheets, high-res textures, background videos, autoplay audio, and continuous high-frequency animation loops.
- Reduce layout shifts and support small touchscreens.
- Respect `prefers-reduced-motion` and provide skippable effects.
- Provide keyboard navigation, visible focus, good contrast, large controls, and screen-reader equivalents for mathematical visuals.
- Communicate correct/incorrect feedback by text and symbols, not color alone.
- Provide non-punitive retry and accessible input formats.

## 16. Security and Integrity

Security requirements include:

- Protected API endpoints verify authentication and authorization on every sensitive operation.
- Premium entitlements are checked server-side, not in UI state.
- Input schemas validate request payloads; TypeScript types alone are insufficient.
- Sensitive cookies use secure configurations and appropriate CSRF defenses.
- Authenticated D1 operations enforce row ownership in application queries.
- Rate-limit sensitive authentication, checkout, and resource-intensive endpoints as feasible.
- Mercado Pago webhooks are authenticated, verified, replay-safe/idempotent, and reconciled with authoritative state.
- Protect against accidental inclusion of premium text or secrets in static bundles.
- Return safe errors without leaking tokens, identifiers, or private data.
- Keep logs and retained personal data minimal, especially for children.

## 17. Suggested Repository Structure

```text
mathground/
├── src/
│   ├── components/
│   │   ├── learn/
│   │   ├── play/
│   │   └── shared/
│   ├── layouts/
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── exercises/
│   │   │   ├── progress/
│   │   │   ├── subscriptions/
│   │   │   └── webhooks/
│   │   └── [locale]/
│   ├── content/
│   │   └── lessons/
│   │       ├── es-ar/
│   │       └── en-us/
│   ├── math/
│   │   ├── core/
│   │   └── topics/
│   ├── game/
│   │   ├── core/
│   │   ├── mascot/
│   │   ├── adventures/
│   │   └── assets/
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── payments/
│   │   └── server/
│   ├── i18n/
│   └── styles/
├── drizzle/
├── public/
├── tests/
├── astro.config.mjs
├── drizzle.config.ts
├── wrangler.jsonc
├── package.json
├── tsconfig.json
├── .dev.vars.example
└── README.md
```

Adapt exact route paths to Astro's and Better Auth's current integration conventions. Do not preserve a proposed folder structure at the expense of correctness.

## 18. Delivery Phases and Definition of Done

### Phase 1 — Learn Mode and Public Demo

- Initialize Astro, TypeScript, plain CSS, localization, Cloudflare adapter.
- Build home, stage, topic, and lesson pages.
- Implement visual educational components (fraction bar, counters, number line, equation balance).
- Publish at least three **complete** Primary and three **complete** Middle School lessons, in both locales.
- Implement a functional mathematics engine covering their core practice needs.
- Provide a no-registration demo with local session tracking.

**Phase 1 done when:** A user on a slow connection can learn a concept and solve related problems without creating an account.

### Phase 2 — Playable Adventure Vertical Slice

- Create one original SVG mascot.
- Build an accessible Play interface and local result feedback.
- Implement a space-adventure scene.
- Connect correct answers to energy/vehicle movement.
- Add working outfit unlocking/equipping and a planet (or friendly boss) milestone.
- Persist temporary local state and provide reduced-motion fallbacks.

**Phase 2 done when:** An actual answered math problem visibly changes the mascot's adventure, and a completed session grants a working reward.

### Phase 3 — Accounts, D1, and Trusted Progress

- Set up D1, Drizzle schema/migrations, Better Auth.
- Build account flows, secure API routes, and user dashboard.
- Add server-verifiable exercise sessions/attempts and deduplicated sync.
- Store mastery/progress and durable rewards.
- Implement strict user-data isolation.

**Phase 3 done when:** A registered user can return on another device and see validated saved progress/rewards.

### Phase 4 — Premium Subscriptions

- Build accurate Free/Premium pricing UI.
- Integrate Mercado Pago and secure webhook handling.
- Add cancellation, expiry, reconciliation, and account management.
- Protect Premium content and expanded exercises/adventures on the server.
- Use explicit development mock only when credentials are absent.

**Phase 4 done when:** Entitlement is enforced independently of browser state and is synchronized with verified provider status.

### Phase 5 — Hardening and Release

- Test mobile performance under throttling.
- Complete accessibility and both locale reviews.
- Run mathematics, auth, progress, reward, and subscription automated tests.
- Verify deployment with Wrangler, secrets, and D1 migrations.
- Write setup, environment, deployment, and troubleshooting documentation.
- Confirm child privacy/consent and billing compliance before public release.

## 19. Testing Requirements

### Mathematics tests

- Each generator produces valid questions across representative seeds.
- Correct answers pass and incorrect answers fail.
- Equivalent fractions are accepted.
- Decimal precision rules are consistent.
- Negative numbers, invalid entries, division by zero, and empty inputs are handled.
- Hints and worked examples align with each generated question.

### Game tests

- Correct results advance progress according to rules.
- Incorrect results do not grant permanent rewards.
- Milestone unlocks are consistent and not duplicated.
- Equipped outfits render and persist.
- Offline provisional progress reconciles safely.
- Reduced-motion mode does not block play.

### Backend and commerce tests

- Unauthenticated users cannot reach protected resources.
- One user cannot read or mutate another user's records.
- Premium content requires verified entitlement.
- Duplicate attempts and duplicate webhooks do not duplicate credit.
- Subscription expiry and cancellation remove access as intended.
- Invalid provider callbacks cannot enable Premium.

### Functional acceptance checks

- All six MVP topics have both Learn and Play experiences in `es-AR` and `en-US`.
- The demo runs without registration and without per-answer server calls.
- Mascot outfit, vehicle, and destination progression truly respond to exercises.
- Public theory pages require very little JavaScript and work on low-end devices.
- High School and other disciplines remain future-ready in the schema but are not falsely displayed as complete.

## 20. Implementation Instructions to the Development Agent

1. **Build working software, not just a plan or static UI.** Prioritize a functional end-to-end slice before producing more pages.
2. Start with: **one illustrated lesson → one playable practice session → verified correct answer → mascot progress → unlocked reward**.
3. Expand that tested slice into at least three Primary and three Middle School topics with localized content.
4. Implement backend accounts, persistence, and billing in the later phases, maintaining strict separation between provisional local state and trusted server state.
5. Use current, officially supported Astro/Cloudflare/Better Auth/Drizzle integration patterns and check API compatibility at implementation time.
6. Keep the code understandable; avoid adding architecture that is unnecessary for the MVP.
7. Never label a mocked or unfinished feature as functional in production.
8. Do not expose protected lessons or sensitive configuration through static builds.
9. Provide the complete source and a useful README with installation, local development, Cloudflare setup, D1 migrations, secrets, auth/email configuration, Mercado Pago configuration, tests, and deployment commands.
10. At the end, provide a brief checklist identifying **Implemented**, **Mocked / Requires Credentials**, and **Not Yet Implemented** items.

### Required developer handoff

- Working Astro project source code.
- Configured Cloudflare Workers adapter and D1 binding.
- Drizzle schema and repeatable migrations.
- Better Auth integration and secure route guards.
- Functional deterministic math exercise engine with tests.
- Six complete bilingual visual lessons and corresponding practice experiences.
- Original mascot SVG assets, customization, vehicle and adventure progression.
- Free demo without registration.
- Account dashboard and synchronized progress.
- Secure subscription integration or explicitly isolated development mock.
- `.dev.vars.example`, deployment instructions, and environment/security notes.

---

## Summary of Fixed Decisions

| Decision | Chosen approach |
|---|---|
| Framework | Astro |
| Client interactivity | Vanilla TypeScript |
| Styling | Native CSS |
| Lesson presentation | Short, graphic-rich illustrated articles |
| Practice presentation | Lightweight mascot adventure game |
| First game theme | Space exploration |
| Active school stages | Primary and Middle School |
| Future stage | High School |
| First subject | Mathematics; schema supports future disciplines |
| Backend runtime | Cloudflare Workers using Astro Server Endpoints |
| Database | Cloudflare D1 / SQLite |
| Data layer | Drizzle ORM |
| Authentication | Better Auth |
| Recurring subscriptions | Mercado Pago |
| Product locales | es-AR and en-US |
| Free access | Anonymous demo; no card required |
| Premium access | Recurring subscription, server-verified |
| Performance strategy | Static-first lessons, local exercises, lazy-loaded game, batched sync |
| TypeScript rationale | Type safety and maintainability; no browser TypeScript runtime |

**North star:** A student should be able to understand a concept from a few clear diagrams, immediately practice it in a fun, responsive adventure, and see meaningful mascot progress—even on an inexpensive phone with an unreliable internet connection.
