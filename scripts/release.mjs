import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function capture(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function extractChangelogSection(version) {
  const changelogPath = path.resolve(process.cwd(), 'CHANGELOG.md');
  const content = readFileSync(changelogPath, 'utf8');
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headingRegex = new RegExp(`^## \\[(?:v)?${escaped}\\](?:\\s*-\\s*.*)?$`, 'm');
  const match = headingRegex.exec(content);
  if (!match) {
    throw new Error(
      `[release] Missing section "## [${version}]" in CHANGELOG.md. Add product-level release notes before releasing.`
    );
  }
  const start = match.index + match[0].length;
  const rest = content.slice(start);
  const nextHeading = /^## \[/m.exec(rest);
  const body = (nextHeading ? rest.slice(0, nextHeading.index) : rest).trim();
  if (!body) {
    throw new Error(`[release] Section "## [${version}]" in CHANGELOG.md is empty.`);
  }
  return body;
}

function assertNoSensitiveData(notes) {
  const forbiddenPatterns = [
    /\b(sk_live|sk_test|pk_live|pk_test|APP_USR-|re_[A-Za-z0-9_]{16,}|ghp_|gho_|github_pat_|AIza[0-9A-Za-z_-]{20,}|AKIA[0-9A-Z]{16})\b/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(BETTER_AUTH_SECRET|MP_ACCESS_TOKEN|MERCADOPAGO_ACCESS_TOKEN|MP_WEBHOOK_SECRET|MERCADOPAGO_WEBHOOK_SECRET|RESEND_API_KEY|GOOGLE_CLIENT_SECRET|FACEBOOK_CLIENT_SECRET|APPLE_CLIENT_SECRET)\s*[:=]\s*\S+/,
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(notes)) {
      throw new Error('[release] Refusing release: potential sensitive information detected in CHANGELOG.md notes.');
    }
  }
}

const branch = capture('git rev-parse --abbrev-ref HEAD');
if (branch !== 'main') {
  console.error(`[release] Must be on "main" branch (current: "${branch}").`);
  process.exit(1);
}

const status = capture('git status --porcelain');
if (status) {
  console.error('[release] Working tree is not clean. Commit or stash changes before releasing.');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
const tag = `v${pkg.version}`;
const releaseNotes = extractChangelogSection(pkg.version);
assertNoSensitiveData(releaseNotes);

const existingTag = capture(`git tag -l ${tag}`);
if (!existingTag) {
  run(`git tag -a ${tag} -m "Release ${tag}"`);
} else {
  console.log(`[release] Tag ${tag} already exists locally.`);
}

run('git push origin main');
run(`git push origin ${tag}`);

try {
  execSync(`gh release view ${tag}`, { stdio: 'ignore' });
  console.log(`[release] GitHub release ${tag} already exists.`);
} catch {
  const notesFile = path.join(os.tmpdir(), `mundoki-release-${pkg.version}.md`);
  writeFileSync(notesFile, releaseNotes, 'utf8');
  try {
    run(`gh release create ${tag} --title "${tag}" --notes-file "${notesFile}"`);
  } finally {
    try {
      unlinkSync(notesFile);
    } catch {
      // ignore temp cleanup failure
    }
  }
}

run('npm run deploy');

if (process.argv.includes('--with-promo')) {
  run('npm run promo:deploy');
}
