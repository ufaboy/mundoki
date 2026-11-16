#!/usr/bin/env node
process.env.CLOUDFLARE_DEPLOY = 'true';
await import('./astro-cli.mjs');

