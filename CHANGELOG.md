# Changelog

All notable product and platform changes to **Mundoki** are documented in this file.
Release notes describe user-facing and product impact — never include secrets, tokens, keys, credentials, or sensitive operational details.

## [2.2.10] - 2026-11-18

### Security
- Hardened social sign-in: the sign-in window now hands its result only to Mundoki itself, and an account with two-step verification is no longer left signed in before the second step is completed.
- Two-step verification recovery codes and authenticator secrets are now generated only with a cryptographically secure random generator.

## [2.2.9] - 2026-11-17

### Changed
- Hardened sign-in by requiring a private, sufficiently strong authentication secret for D1-backed Workers and blocking direct magic-link issuance without the configured flow.
- Stopped writing magic-link URLs and tokens to logs.

## [2.2.8] - 2026-11-17

### Changed
- Updated `AGENTS.md` release and pull-request workflow rules so `CHANGELOG.md` is updated prior to PR creation and direct `main` commits, and existing branch version bumps are preserved.

## [2.2.5] - 2026-11-17

### Changed
- Separated sign-in and registration (`/es-ar/login/`, `/en-us/login/`) from the family/admin account page (`/es-ar/cuenta/`, `/en-us/account/`), with server-side session checks redirecting unauthenticated visitors to login and authenticated visitors away from login.
- Protected `/admin/promos/` with a server-side admin check so unauthenticated or non-admin visitors are redirected to the home page, added common discount percentage presets, and updated the account header label to show `Admin account` (`Cuenta de administrador`) for administrators.
- Removed the redundant top breadcrumb/back-link bar (`nav.mk-crumb`) from grade hub and Grade 1 lesson pages.
- Updated `package.json` script references from `npm` to `pnpm`.

## [2.2.3] - 2026-11-17

### Changed
- Added an isolated staging environment with its own test database and Worker, giving the team a separate place to validate changes before production releases.
- Improved signup password autofill behavior so browsers can distinguish signup credentials from sign-in credentials.

## [2.2.1] - 2026-11-17

### Changed
- Removed the redundant three-step instructions from the Grade 2 adventure map so the mission list appears sooner.

## [2.2.0] - 2026-11-17

### Added
- Server-enforced Premium access rules (`first chapter` of each grade and skill-game level 1 free; remaining missions and game levels 2–3 require Premium) with a dedicated lock screen and Premium badges on locked mission links.
- Unified Pricing configuration (`9999` ARS/month) across the Premium page, Mercado Pago checkout, and promotional quotes.

### Changed
- Redesigned the Account, Progress (Stars), and Premium pages on the Mundoki design system, with automatic locale detection on `/`.
- Hardened magic-link sign-in to prevent account enumeration and disallow implicit registration via magic link.
- Separated Grade 1 and Grade 2 client story/evidence helpers from full lesson content so locked mission texts are not bundled to the browser.

### Removed
- Retired the legacy Play workspace and redirected `/es-ar/jugar/` and `/en-us/play/` routes to the skill-training hub.

## [2.1.0] - 2026-11-17

### Added
- Added six bilingual (`es-AR` / `en-US`) HTML5 Canvas skill-training mini-games under `/es-ar/entrenar/` and `/en-us/train/`: Water Locks (addition), Sky Balloon (subtraction), Angle Cannon (multiplication), Gem Express (division), Isometric Sea Cannon (`(X, Y)` coordinates), and Gear Bridge (combined operations).
- Added localized About, Privacy Policy, and Terms of Use pages (`/es-ar/acerca/`, `/es-ar/privacidad/`, `/es-ar/terminos/` and `/en-us/about/`, `/en-us/privacy/`, `/en-us/terms/`).

### Changed
- Unified all pages onto a single site layout (`AppLayout`) with a desktop top navigation bar, mobile side drawer, and stable scrollbar gutter to prevent header layout shifts across pages.

## [2.0.0] - 2026-11-17

### Changed
- Rebuilt the Grade 3–7 lesson adventures around each learner’s mission, so solving a task visibly advances the story.
- Reworked bilingual lesson prompts, examples, hints, explanations, and scenes to connect the mathematics to the story while preserving the course learning goals.

### Added
- Added generated Grade 6 practice with new numbers and server-verified answers during racing missions.

## [1.1.0] - 2026-11-16

### Changed
- Replaced Grade 2’s disconnected road-trip framing with a six-chapter wizard adventure. Lesson tasks now help the learner advance the story, free friends, and see a clear result from correct answers.
- Reworked Grade 2 lesson prompts and hints to fit the new story while preserving the mathematics and bilingual course.

## [1.0.2] - 2026-11-16

### Added
- Grade 1 "Day" interactive story adventure (`DayLesson` and `DayMap`) with bilingual missions, hints, and replayable practice.
- Worked visual diagrams and step-by-step hints across Grades 5–7 adventures (Moon, Ocean, and Park).
- Deterministic practice exercise generators across 41 skills and server-side mission attempt verification in progress sync.
- Unified grade hub experience and updated lesson-authoring guidelines.

## [1.0.1] - 2026-11-16

### Changed
- Reduced the background promo billing reconciliation schedule from every 10 minutes to every 6 hours to keep logs and Worker invocations lean while preserving reliable daily retries.

### Added
- Standardized release versioning, pre-push PR version checks, and automated Cloudflare Workers deployment workflow with product-level release notes.

## [1.0.0] - 2026-11-16

### Added
- Bilingual (`es-AR` / `en-US`) visual mathematics learning platform aligned with the CABA primary and secondary curriculum (Grades 1–7 and Secundaria 1–5).
- Interactive visual math playgrounds, guided adventures, deterministic exercise generation, and server-side answer verification.
- User accounts with email/password, magic link, and 2FA (TOTP + backup codes) authentication backed by Cloudflare D1.
- Premium subscription checkout and webhook synchronization via Mercado Pago, plus personal promotional invite management.
