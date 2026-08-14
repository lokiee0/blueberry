import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const virtualStore = join(process.cwd(), 'node_modules', '.pnpm');

if (!existsSync(virtualStore)) {
  console.error('Dependencies are not installed. Run the package manager install command first.');
  process.exit(1);
}

const packages = new Map();

function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;

    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      scan(absolutePath);
      continue;
    }

    if (entry.name !== 'package.json') continue;

    const manifest = JSON.parse(readFileSync(absolutePath, 'utf8'));
    if (!manifest.name || !manifest.version) continue;

    const declaredLicense =
      typeof manifest.license === 'string'
        ? manifest.license
        : Array.isArray(manifest.licenses)
          ? manifest.licenses
              .map((license) => license.type)
              .filter(Boolean)
              .join(' OR ')
          : 'UNKNOWN';

    packages.set(`${manifest.name}@${manifest.version}`, declaredLicense);
  }
}

scan(virtualStore);

const unknown = [];
const blocked = [];
for (const [packageName, license] of packages) {
  if (license === 'UNKNOWN') unknown.push(packageName);
  if (/(?:^|\W)(?:AGPL|GPL)-?\d/i.test(license)) blocked.push(`${packageName} (${license})`);
}

if (unknown.length > 0 || blocked.length > 0) {
  if (unknown.length > 0)
    console.error(`Dependencies with no declared license:\n${unknown.join('\n')}`);
  if (blocked.length > 0) console.error(`Blocked dependency licenses:\n${blocked.join('\n')}`);
  process.exit(1);
}

const licenseGroups = new Set(packages.values());
console.log(
  `Dependency license scan passed (${packages.size} packages, ${licenseGroups.size} license groups).`,
);
