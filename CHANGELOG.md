# Changelog

All notable product and platform changes to **Mundoki** are documented in this file.
Release notes describe user-facing and product impact — never include secrets, tokens, keys, credentials, or sensitive operational details.

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
