import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const excludedDirectories = new Set(['.git', 'node_modules', 'out', 'dist', 'coverage', 'docs']);
const scannedExtensions = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.svelte',
  '.ts',
  '.yaml',
  '.yml',
]);
const patterns = [
  ['AWS access key', /AKIA[0-9A-Z]{16}/g],
  ['GitHub token', new RegExp(`${['github', 'pat'].join('_')}_[A-Za-z0-9_]{20,}`, 'g')],
  ['Private key', new RegExp(`BEGIN ${['PRIVATE', 'KEY'].join(' ')}`, 'g')],
  ['Slack token', new RegExp(`xox${'b'}-[A-Za-z0-9-]{20,}`, 'g')],
];

function collectFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if (excludedDirectories.has(entry)) continue;
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);
    if (stats.isDirectory()) files.push(...collectFiles(absolutePath));
    else if (scannedExtensions.has(extname(entry))) files.push(absolutePath);
  }
  return files;
}

const findings = [];
for (const file of collectFiles(root)) {
  if (file.endsWith('scan-secrets.mjs')) continue;
  const content = readFileSync(file, 'utf8');
  for (const [name, pattern] of patterns) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) findings.push(`${relative(root, file)}: ${name}`);
  }
}

if (findings.length > 0) {
  console.error(`Potential secrets found:\n${findings.join('\n')}`);
  process.exit(1);
}

console.log('Secret scan passed.');
