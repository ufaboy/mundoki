# Cloudflare Workers deployment

Target: Worker `mundoki`, production URL `https://mundoki.mercosur.workers.dev`.
The source configuration is `wrangler.jsonc`. Astro's Cloudflare adapter generates
`dist/server/wrangler.json` and `.wrangler/deploy/config.json`; Wrangler automatically
uses that generated configuration after `npm run build:worker`. Do not edit generated
files or deploy the output of the ordinary `npm run build` command.

## Cloudflare dashboard / Git integration

Create or connect a **Worker**, not a Pages project. Use the directory containing
`package.json` as the root directory and configure:

| Setting | Value |
| --- | --- |
| Worker name | `mundoki` |
| Build command | `npm run build:worker` |
| Deploy command | `npx wrangler deploy` |

Use `npm ci` for dependency installation. Do not set a Pages output directory.
Do not enable automatic non-production deployments against the production D1 binding;
prepare a separate database/configuration before enabling branch previews.

## Production bindings and variables

- `DB` is bound to existing D1 database `mundoki-d1`, ID
  `e99ffef6-d0ac-4d9b-abb0-585033cd6519`. Verify that this database belongs to the
  deployment account; replace the ID if publishing to another account. Local dry-run
  checks do not verify remote database ownership or migration state.
- `ASSETS` serves the generated client files. The adapter supplies the Worker entrypoint.
- `APP_URL` and `BETTER_AUTH_URL` are set to the production URL. Change both for a custom
  domain or another workers.dev subdomain, and update OAuth callback registrations.
- Optional provider variables entered in the dashboard are preserved by `keep_vars`.
  Values explicitly present in `wrangler.jsonc` take precedence.
- Logs are enabled; traces sample 1% of requests. The existing compatibility date and
  `nodejs_compat` are retained.

## Secrets and initial database setup

Authenticate to the intended Cloudflare account, then set a strong, unique
`BETTER_AUTH_SECRET` as a **Worker runtime secret**, not a build variable:

```sh
npx wrangler login
npx wrangler secret put BETTER_AUTH_SECRET
npm run db:migrate:remote
```

These commands change the remote Worker/database. Enter secrets at the interactive
prompt, never in command arguments or committed files. Local `.env` / `.dev.vars`
files are not uploaded as Worker runtime secrets.

For email delivery, configure secret `RESEND_API_KEY` and variable `EMAIL_FROM` with
a verified sender. For live subscriptions, configure secrets `MP_ACCESS_TOKEN` and
`MP_WEBHOOK_SECRET`, and use `/api/webhooks/mercadopago` as the webhook endpoint.
Without these integrations, the application retains its labeled development/mock
flows; a successful deployment does not make payments or email delivery live.
OAuth is optional: configure provider IDs/secrets only when enabling those providers.

## Validate and publish from a terminal

```sh
npm ci
npm run cf:types
npm run lint
npm test
npm run deploy:check
# When ready to publish (rebuilds before deploying):
npm run deploy
```

`deploy:check` builds and packages without publishing. Run migrations before publishing
code that depends on them. The deployment command intentionally does not migrate the
production database automatically.

`cf:types` generates `worker-configuration.d.ts` at the project root. It is kept outside
the shared browser TypeScript compilation to avoid conflicts between Workers and DOM
runtime globals.

For local Worker testing, run `npm run db:migrate:local`, build with
`npm run build:worker`, then use `npm run preview:worker`. Ordinary `npm run dev`
continues to use port 3333. Local secret templates use localhost and must not be
copied into production variables unchanged.

References: [Astro on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/),
[Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/),
[Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/).
