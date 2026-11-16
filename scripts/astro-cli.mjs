#!/usr/bin/env node
import { cli } from '../node_modules/astro/dist/cli/index.js';

cli(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
