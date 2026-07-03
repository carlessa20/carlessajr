/**
 * update-galleries.js
 *
 * Run this from the /website folder whenever you add or remove photos:
 *   node update-galleries.js
 *
 * It scans each stills folder listed below and writes gallery-data.json,
 * which the site reads to render photo grids automatically.
 *
 * To add a new gallery section:
 *   1. Add a new entry to GALLERY_MAP below
 *   2. Run: node update-galleries.js
 */

const fs   = require('fs');
const path = require('path');

const IMAGE_EXTS = /\.(jpg|jpeg|png|webp|gif)$/i;

// Map of: page → section key → relative path to stills folder
const GALLERY_MAP = {
  'peter-millar': {
    'hamptons': 'videos/peter millar/Spring Crown Weekend /stills',
    // Add more sections here as you create them, e.g.:
    // 'intentionally-done-right': 'videos/peter millar/Intentionally Done Right/stills',
    // 'masters-us-open':          'videos/peter millar/Masters US Open/stills',
    // 'performance':              'videos/peter millar/Performance/stills',
  },
  // Add other project pages here, e.g.:
  // 'triumph': {
  //   'brand-launch': 'videos/triumph/stills',
  // },
};

const data = {};

for (const [page, sections] of Object.entries(GALLERY_MAP)) {
  data[page] = {};

  for (const [section, folderPath] of Object.entries(sections)) {
    const fullPath = path.join(__dirname, folderPath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠  Folder not found: ${folderPath}`);
      data[page][section] = [];
      continue;
    }

    const files = fs.readdirSync(fullPath)
      .filter(f => IMAGE_EXTS.test(f))
      .sort((a, b) => {
        // Natural sort so 2 comes before 10
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      })
      .map(f => `${folderPath}/${f}`);

    data[page][section] = files;
    console.log(`✓  ${page} / ${section}: ${files.length} images`);
  }
}

fs.writeFileSync(
  path.join(__dirname, 'gallery-data.json'),
  JSON.stringify(data, null, 2)
);

console.log('\ngallery-data.json updated.');
