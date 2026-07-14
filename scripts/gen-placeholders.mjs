/**
 * Generates soft, minimal on-brand placeholder SVGs for each brand so the site
 * renders end-to-end before real photography is supplied. Kept intentionally
 * low-key (light background, subtle tint) to read as clean and trustworthy.
 * Replace the files in public/images/<brand>/ with real assets when available.
 *
 *   node scripts/gen-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const brands = {
  victoria: { name: 'Victoria 111', accent: '#2f52cc', accent2: '#5673de' },
  teru: { name: 'Teru Credit', accent: '#0d8a7a', accent2: '#2fa596' },
};

const assets = [
  { file: 'hero.svg', w: 800, h: 600, label: '' },
  { file: 'about.svg', w: 720, h: 576, label: '' },
  { file: 'product-online.svg', w: 640, h: 360, label: 'Online' },
  { file: 'product-instalment.svg', w: 640, h: 360, label: 'Instalments' },
];

function svg({ name, accent, accent2 }, { w, h, label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#f4f5f9"/>
    </linearGradient>
    <linearGradient id="ac" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="${accent2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${w * 0.8}" cy="${h * 0.24}" r="${h * 0.26}" fill="${accent}" opacity="0.08"/>
  <circle cx="${w * 0.22}" cy="${h * 0.82}" r="${h * 0.2}" fill="${accent}" opacity="0.06"/>
  <rect x="${w * 0.1}" y="${h * 0.34}" width="${h * 0.14}" height="${h * 0.14}" rx="${h * 0.035}" fill="url(#ac)"/>
  <rect x="${w * 0.1}" y="${h * 0.56}" width="${w * 0.42}" height="10" rx="5" fill="#1a1c25" opacity="0.14"/>
  <rect x="${w * 0.1}" y="${h * 0.62}" width="${w * 0.3}" height="10" rx="5" fill="#1a1c25" opacity="0.09"/>
  <text x="${w * 0.1}" y="${h * 0.28}" fill="#1a1c25" font-family="'Inter',Arial,sans-serif" font-size="${h * 0.075}" font-weight="800" opacity="0.85">${name}</text>
  ${label ? `<text x="${w * 0.1}" y="${h * 0.74}" fill="${accent}" font-family="'Inter',Arial,sans-serif" font-size="${h * 0.055}" font-weight="700">${label}</text>` : ''}
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
