# Mundoki — Learning & Skills Practice

**Mundoki is an application that helps learners understand new topics, practice skills, and reinforce what they have learned across different disciplines.** It combines short explanations, worked examples, visual models, exercises, and learning adventures.

**Mathematics is the first and currently available subject.** The broader product direction includes other disciplines; their content and practice tools will be added in later stages. The current mathematics implementation is the starting point for that direction.

The application supports Argentine Spanish (`es-AR`, the default) and English (`en-US`).

## Learning experience

- **Understand:** explore a topic through explanations, illustrations, and worked examples.
- **Practice:** solve exercises, use hints, and read feedback to understand the answer.
- **Reinforce:** revisit activities and try additional problems.
- **Explore:** use interactive models, practical tasks, and story-based lessons to connect ideas with concrete situations.

Games support the learning experience. Different courses use different stories and settings, including the city-building lessons and the space adventure with Átomo. A particular game theme does not define the scope of Mundoki.

Lessons can support independent practice or activities with a teacher or family member. Drawing tasks, practical investigations, and open explanations may need adult feedback.

## What is available now

| Area | Current implementation |
| --- | --- |
| Subject | Mathematics |
| Grade-based courses | Authored lesson sequences for Grades 1–7, with examples, practice questions, package checks, and projects |
| Topic-based practice | Addition and subtraction, multiplication and division, fractions, negative numbers, percentages and proportions, and linear equations |
| Learning formats | Visual lessons, interactive models, grade-specific adventures, and generated exercises |
| Languages | Argentine Spanish and English |
| Accounts | Email/password, email magic links, and two-factor authentication; OAuth providers are configured in code, but their UI buttons are currently hidden |
| Progress | Server-verified attempts in the generated exercise flow; grade adventures have their own behavior and do not all persist answers or award mastery points |
| Subscriptions | Mercado Pago integration; live billing requires provider configuration |

A catalog entry or grade identifier does not by itself mean that a full course is available. See [schoolCourses.ts](src/content/schoolCourses.ts) for the authored courses and [lesson-creation-plan.md](docs/lesson-creation-plan.md) for content planning.

## Educational organization

The project's educational reference is **Ciudad Autónoma de Buenos Aires (CABA), Argentina**. Its catalog uses the following convention:

- Grades 1–7 correspond to primary school, **1.º–7.º grado**.
- Grades 8–12 correspond to **1.º–5.º año** in the standard five-year secondary track.
- English translates the same CABA-oriented course; it does not switch the content to US grade standards.

Editorial coverage is not a claim of official curriculum certification. Content reviews and automated checks also do not replace classroom testing of clarity and learning outcomes.

## Technology

| Layer | Implementation |
| --- | --- |
| Application framework | Astro with server output and content collections |
| Browser interactivity | Vanilla TypeScript in `src/scripts/` |
| Styling | Native CSS and custom properties in `src/styles/global.css` |
| Mathematics | Deterministic exercise generators, answer validation, KaTeX, and visual models |
| Production runtime | Cloudflare Workers with Astro server endpoints |
| Database | Cloudflare D1 / SQLite with Drizzle ORM |
| Authentication | Better Auth |
| Payments | Mercado Pago |
| Localization | Shared routes and translations for `es-AR` and `en-US` |

## Repository guide

- `src/content/grade1/` through `src/content/grade7/` — grade-based mathematics lessons and checks.
- `src/content/lessons/` — topic lessons.
- `src/components/learn/` — lesson presentation and interactive models.
- `src/components/play/` — practice game presentation.
- `src/scripts/` — browser interactions and adventure behavior.
- `src/math/` — mathematics curriculum metadata, generators, and validation.
- `src/i18n/` — localized routes and shared interface text.
- `src/pages/api/` — authentication, progress, subscription, and webhook endpoints.
- `src/lib/db/` and `drizzle/` — database access, schema, and migrations.
- `src/tests/` — content, mathematics, game-state, and security checks.

## Local development

Install dependencies and start the development server:

```sh
npm ci
npm run dev
```

Open `http://localhost:3333`. Local configuration templates are available in [.env.example](.env.example) and [.dev.vars.example](.dev.vars.example). Configure the integrations needed for your workflow; keep actual secrets out of version control.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development on port 3333 |
| `npm run lint` | Run TypeScript checks |
| `npm test` | Run automated tests |
| `npm run build` | Build for the standard Node development workflow |
| `npm run build:worker` | Build the Cloudflare Worker and client assets |
| `npm run preview:worker` | Preview the built Worker locally |
| `npm run db:migrate:local` | Apply D1 migrations to the local database |
| `npm run deploy:check` | Build and package a deployment without publishing |
| `npm run deploy` | Build and publish the Worker |

Run `npm run lint` and `npm test` after code changes. Also run `npm run build:worker` when changing server code, routes, or Worker configuration. Use the Worker build for deployment; the ordinary `npm run build` output is not the deployment artifact.

Production bindings, secrets, remote migrations, and publication steps are documented in [DEPLOYMENT.md](DEPLOYMENT.md). Contributor rules are in [AGENTS.md](AGENTS.md).

## Main routes

| Page | Spanish | English |
| --- | --- | --- |
| Home | `/es-ar/` | `/en-us/` |
| Mathematics catalog | `/es-ar/matematicas/` | `/en-us/mathematics/` |
| Grade course, example | `/es-ar/matematicas/grado/3-grado/` | `/en-us/mathematics/grade/grade-3/` |
| Topic lesson | `/es-ar/matematicas/[topic]/` | `/en-us/mathematics/[topic]/` |
| Topic practice | `/es-ar/jugar/[topic]/` | `/en-us/play/[topic]/` |
| Progress | `/es-ar/progreso/` | `/en-us/progress/` |
| Subscription | `/es-ar/premium/` | `/en-us/premium/` |
| Account | `/es-ar/cuenta/` | `/en-us/account/` |

Topic slugs are localized. Use the helpers in [routes.ts](src/i18n/routes.ts) when generating links.
