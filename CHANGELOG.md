# Changelog

All notable product and platform changes to **Mundoki** are documented in this file.
Release notes describe user-facing and product impact — never include secrets, tokens, keys, credentials, or sensitive operational details.

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
