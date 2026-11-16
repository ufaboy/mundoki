import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const pkgPath = path.resolve(process.cwd(), 'package.json');

function parseSemver(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(version).trim());
  if (!match) {
    throw new Error(`Invalid semver version: "${version}"`);
  }
  return match.slice(1).map(Number);
}

function compareSemver(a, b) {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

function readGitPackageVersion(ref) {
  try {
    const raw = execSync(`git show ${ref}:package.json`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(raw).version;
  } catch {
    return null;
  }
}

const args = process.argv.slice(2);
const checkIdx = args.indexOf('--check-against');

if (checkIdx !== -1) {
  const baseRef = args[checkIdx + 1] || 'origin/main';
  const currentPkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const baseVersion = readGitPackageVersion(baseRef);
  if (!baseVersion) {
    process.exit(0);
  }
  if (compareSemver(currentPkg.version, baseVersion) <= 0) {
    console.error(
      `[version-check] package.json version (${currentPkg.version}) must be greater than ${baseRef} (${baseVersion}).`
    );
    process.exit(1);
  }
  process.exit(0);
}

if (args.includes('--check-staged')) {
  const headVersion = readGitPackageVersion('HEAD');
  const stagedVersion = readGitPackageVersion('');
  if (headVersion && stagedVersion && compareSemver(stagedVersion, headVersion) > 0) {
    process.exit(0);
  }
  process.exit(1);
}

const bumpType = args.includes('--major')
  ? 'major'
  : args.includes('--minor')
    ? 'minor'
    : 'patch';

const raw = readFileSync(pkgPath, 'utf8');
const pkg = JSON.parse(raw);
const [major, minor, patch] = parseSemver(pkg.version);

const nextVersion =
  bumpType === 'major'
    ? `${major + 1}.0.0`
    : bumpType === 'minor'
      ? `${major}.${minor + 1}.0`
      : `${major}.${minor}.${patch + 1}`;

const updated = raw.replace(
  /"version"\s*:\s*"[^"]+"/,
  `"version": "${nextVersion}"`
);

writeFileSync(pkgPath, updated, 'utf8');
console.log(`[version:bump] ${pkg.version} -> ${nextVersion}`);
