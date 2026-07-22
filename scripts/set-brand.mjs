/**
 * Selects the active brand by copying its config into public/config.json, which
 * the app fetches at runtime. One codebase, one build — the brand is chosen at
 * dev/build time by this script (or by swapping config.json in the deployed
 * output).
 *
 *   node scripts/set-brand.mjs victoria
 *   node scripts/set-brand.mjs teru
 */
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brand = process.argv[2];

if (!brand) {
  console.error('Usage: node scripts/set-brand.mjs <brand>');
  process.exit(1);
}

const source = join(root, 'public', 'brands', `config.${brand}.json`);
const target = join(root, 'public', 'config.json');

if (!existsSync(source)) {
  console.error(`Unknown brand "${brand}" — expected ${source}`);
  process.exit(1);
}

copyFileSync(source, target);
console.log(`Active brand set to "${brand}" (public/config.json).`);
