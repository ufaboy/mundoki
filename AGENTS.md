# AGENTS.md — Mundoki Project Rules

This file defines mandatory rules for working on the **Mundoki** codebase (a bilingual `es-AR` / `en-US` visual mathematics platform built for Cloudflare Workers + D1).

## Educational Reference — CABA

- **The primary educational reference is Ciudad Autónoma de Buenos Aires (CABA), Argentina.** Use the CABA curriculum, terminology, and school-year structure when organizing lessons and labeling the catalog.
- **Primaria includes 1.º through 7.º grado, inclusive.** In the standard five-year secondary track, secundaria follows with 1.º through 5.º año. Technical and other specialized tracks may differ; do not silently apply their structures to the default catalog.
- Internal `Grade N` / `schooling_year = N` counts years from the start of primary education: Grades 1–7 map to CABA primaria; Grades 8–12 map to secundaria years 1–5. Grade 5 is primary, not middle/secondary school.
- `en-US` is a language translation of the same CABA-oriented course, not a switch to US grade standards. Do not label the old 1–4 / 5–8 / 9–12 product groupings as official school stages.
- Other jurisdictions, including Provincia de Buenos Aires (PBA), may be used only as explicitly labeled comparisons; they do not override the default CABA mapping. Cite verified CABA curriculum documents before claiming formal curriculum alignment; editorial coverage alone is not certification.
- Official structure reference: https://www.estadisticaciudad.gob.ar/eyc/glosario/nivel-de-ensenanza-educacion/ . Curriculum planning: `lesson-creation-plan.md`.

## 1. Stack & Architectural Constraints

- **Lesson authoring:** For creating, rewriting, adapting, or reviewing lesson content and game narrative, use [`.agents/skills/lesson-authoring/SKILL.md`](.agents/skills/lesson-authoring/SKILL.md) together with the matching grade skill when one exists. For Grade 1 use [`.agents/skills/grade-1-lesson-authoring/SKILL.md`](.agents/skills/grade-1-lesson-authoring/SKILL.md); for Grade 2 use [`.agents/skills/grade-2-lesson-authoring/SKILL.md`](.agents/skills/grade-2-lesson-authoring/SKILL.md), which also holds the Grade 2 story map. Preserve the learning objective and connect contextual exercises causally to the story; explanations, exercise wording, and story dialogue may differ if their mathematics and assumptions agree.
- **Language of project-authored materials:** Write project documentation, lesson plans, scenarios, design notes, and other authored reference materials in English by default. This applies to repository content, not conversation: communicate with the user in the language they use or request. Keep learner-facing `es-AR` and `en-US` lesson text in their respective locales.

- **Framework:** Astro (`output: 'server'`) in `astro.config.mjs`.
  - When `CLOUDFLARE_DEPLOY=true` (via `scripts/cf-cli.mjs`), `@astrojs/cloudflare` v14 is used.
  - Standard `npm run dev` and `npm run build` use `src/lib/server/workerEntrypoint.ts` without an external `workerd` daemon.
- **Client Interactivity:** **Vanilla TypeScript** only (`src/scripts/*.ts`). Do not add React, Vue, Angular, or a client-side TS runtime.
- **Styling:** **Native CSS** only (`src/styles/global.css` with CSS custom properties). Do not add Tailwind CSS.
- **Localization:** All user-facing pages and strings must support both locales — `es-AR` (default) and `en-US` (`src/i18n/routes.ts`, `src/i18n/translations.ts`).
- **Lessons & Math:** Deterministic generators (`src/math/topics/generators.ts`), answer validation (`src/math/core/validator.ts`), content collections (`src/content/lessons/`), and KaTeX (`src/lib/katexRender.ts`).

## 2. Cloudflare Workers, D1 & Environment Variables

- **Accessing `env` and secrets:** Always use `getRuntimeEnv()` from `src/lib/server/runtimeEnv.ts` (reads `cloudflare:workers` inside a Worker, falls back to `process.env` in Node dev/test).
  - **Do not** use `Astro.locals.runtime.env` (removed in `@astrojs/cloudflare` v14).
  - **Do not** rely on filesystem writes (`node:fs` / `.data/`) in the Worker runtime: production data must go through the `env.DB` binding (Cloudflare D1). Local `.data/mundoki-d1.json` in `src/lib/db/d1Store.ts` is only a fallback when `env.DB` is absent.
- **DB Schema & Migrations (`drizzle/`):**
  - Table definitions: `src/lib/db/schema.ts`.
  - SQL migrations: `drizzle/0000_initial.sql`, `drizzle/0001_better_auth.sql`.
  - Whenever changing the schema, update `src/lib/db/schema.ts` and add a new migration `drizzle/000X_*.sql`, then apply it:
    - locally: `npx wrangler d1 migrations apply mundoki-d1 --local`
    - remotely: `npx wrangler d1 migrations apply mundoki-d1 --remote`
- **Wrangler Config:** `wrangler.jsonc` is configured for a **Cloudflare Worker** (`main: "@astrojs/cloudflare/entrypoints/server"`, `assets.binding: "ASSETS"`, `d1_databases[0].binding: "DB"`). Do not reintroduce `pages_build_output_dir`.

## 3. Authentication (`better-auth`)

- The `better-auth` configuration lives in `src/lib/auth/betterAuth.ts` (`createBetterAuthInstance`):
  - Uses `drizzleAdapter` over D1 tables (`users`, `sessions`, `accounts`, `verifications`, `twoFactors`).
  - Enables plugins: `bearer()`, `twoFactor({ issuer: 'Mundoki', allowPasswordless: true })`, and `magicLink(...)`.
- `src/pages/api/auth/[...all].ts` handles the UI API contract (`/api/auth/me`, `signup`, `signin`, `signout`, `locale`, `oauth/*`, `magic-link/*`, `2fa/*`) via `better-auth` + D1 and delegates native routes to `auth.handler(request)`.
- `socialProviders` configures `google`, `facebook`, and `apple` (GitHub was removed). The OAuth buttons section in `src/components/shared/AccountPortal.astro` is temporarily hidden (`hidden style="display:none;"`) — primary sign-in is currently `Email / Password` (alongside Magic Link and 2FA).
- `BETTER_AUTH_API_KEY` is not used by `better-auth` core; production session signing and 2FA encryption require the `BETTER_AUTH_SECRET` secret (`npx wrangler secret put BETTER_AUTH_SECRET`).

## 4. Security, Progress & Payments

- **Server-side exercise verification:** `POST /api/progress/sync` must never trust a client-submitted correctness flag — always recompute and validate deterministically on the server from `(topicId, difficulty, seed)` and `userAnswer`, deduplicating by `attemptId`.
- **Mercado Pago subscriptions:** `src/pages/api/webhooks/mercadopago.ts` must verify the webhook signature (`MERCADOPAGO_WEBHOOK_SECRET` / `MP_WEBHOOK_SECRET`) and enforce idempotency by `eventId` in the `payment_events` table.
- **Secrets:** Never commit `.env`, `.dev.vars`, `.wrangler/`, `.data/`, or real keys/tokens. Keep variable templates up to date in `.env.example` and `.dev.vars.example`.

## 5. Standard Commands & Pre-Delivery Checks

```powershell
# Local development
npm run dev

# Type-checking (required after edits)
npm run lint

# Automated tests (math engine, game progression, 2FA, curriculum)
npm test

# Build Cloudflare Worker and client assets
npm run build:worker

# Local preview of the built Worker
npm run preview:worker

# Deploy Worker to Cloudflare (https://mundoki.mercosur.workers.dev)
npm run deploy
```

Before finishing any code change, always run `npm run lint` and `npm test` (and also `npm run build:worker` when modifying server code, routes, or Wrangler configuration).

## 6. Versioning, Release & Deployment Workflow

- **Commit to `main`:** Every commit on `main` must bump the `package.json` version (automated via `.githooks/pre-commit`, which runs `node scripts/bump-version.mjs --patch` if `package.json` version was not already bumped).
- **Pull Requests to `main`:** Before creating a PR targeting `main` from any branch, bump `package.json` version (`npm run version:bump`, or `--minor` / `--major`) and commit it. `.githooks/pre-push` verifies that the branch's `package.json` version is greater than `origin/main` before pushing.
- **Release & Wrangler Deploy (Mandatory after `main` updates):** After any commit to `main` or merge into `main`, always create a release and deploy with Wrangler:
  - Update `CHANGELOG.md` with a `## [<version>] - YYYY-MM-DD` section containing a **product-level explanation** of changes (not raw commit logs). Never include secrets, keys, tokens, credentials, or sensitive operational details in `CHANGELOG.md`.
  - Run `npm run release` (extracts and secret-checks the `CHANGELOG.md` entry, creates git tag `v<version>`, pushes `main` and the tag, creates a GitHub Release via `gh release create`, and runs `npm run deploy`).
  - If `wrangler.promo.jsonc`, `src/workers/promoScheduler.ts`, or `src/lib/promos/` changed, also run `npm run promo:deploy` (or `npm run release -- --with-promo`).
