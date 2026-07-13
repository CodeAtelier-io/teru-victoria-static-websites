/**
 * Generates lightweight branded placeholder SVGs for each brand so the site
 * renders end-to-end before real photography is supplied. Replace the files in
 * public/images/<brand>/ with real assets when available.
 *
 *   node scripts/gen-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const brands = {
  victoria: { name: 'Victoria 111', accent: '#f07335', dark: '#d55e24' },
  teru: { name: 'Teru Credit', accent: '#1f8a70', dark: '#166a56' },
};

const assets = [
  { file: 'hero.svg', w: 800, h: 600, label: '' },
  { file: 'about.svg', w: 720, h: 576, label: '' },
  { file: 'product-online.svg', w: 640, h: 360, label: 'Online' },
  { file: 'product-instalment.svg', w: 640, h: 360, label: 'Instalments' },
];

function svg({ name, accent, dark }, { w, h, label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.82}" cy="${h * 0.2}" r="${h * 0.32}" fill="#ffffff" opacity="0.10"/>
  <circle cx="${w * 0.18}" cy="${h * 0.86}" r="${h * 0.24}" fill="#000000" opacity="0.08"/>
  <rect x="${w * 0.08}" y="${h * 0.62}" width="${w * 0.5}" height="10" rx="5" fill="#ffffff" opacity="0.35"/>
  <rect x="${w * 0.08}" y="${h * 0.68}" width="${w * 0.34}" height="10" rx="5" fill="#ffffff" opacity="0.22"/>
  <text x="${w * 0.08}" y="${h * 0.5}" fill="#ffffff" font-family="'Open Sans',Arial,sans-serif" font-size="${h * 0.11}" font-weight="800">${name}</text>
  ${label ? `<text x="${w * 0.08}" y="${h * 0.5 + h * 0.13}" fill="#ffffff" opacity="0.85" font-family="'Open Sans',Arial,sans-serif" font-size="${h * 0.06}" font-weight="600">${label}</text>` : ''}
</svg>
`;
}

for (const [slug, brand] of Object.entries(brands)) {
  const dir = join(root, 'public', 'images', slug);
  mkdirSync(dir, { recursive: true });
  for (const asset of assets) {
    writeFileSync(join(dir, asset.file), svg(brand, asset));
  }
  console.log(`Generated ${assets.length} placeholder images for ${brand.name}`);
}
