// Script to:
// 1. Copy AI-generated Demon Slayer images from brain folder to public/characters/ds/
// 2. Download high-quality Brawl Stars portraits from Brawlify CDN
import { writeFile, mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import https from 'https';
import path from 'path';

const BRAIN_DIR = path.join(process.env.USERPROFILE, '.gemini', 'antigravity', 'brain', 'd9a0d103-3b6f-4bba-8b1f-6fd32d3cd271');

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const request = (urlStr, redirectCount = 0) => {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      const parsedUrl = new URL(urlStr);
      https.get(parsedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location, redirectCount + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${urlStr}`));
        }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          writeFile(dest, buffer).then(() => resolve(buffer.length)).catch(reject);
        });
        res.on('error', reject);
      }).on('error', reject);
    };
    request(url);
  });
}

// Demon Slayer: copy AI-generated images from brain folder
const dsCharacters = [
  'tanjiro', 'nezuko', 'zenitsu', 'inosuke', 'rengoku', 'akaza',
  'kokushibo', 'muzan', 'daki', 'gyutaro', 'tengen', 'shinobu',
  'giyu', 'mitsuri', 'sanemi', 'obanai'
];

// Map DS character name to the generated image file (latest version)
// These were generated with names like ds_tanjiro_<timestamp>.png
async function findGeneratedImage(charName) {
  const { readdir } = await import('fs/promises');
  const files = await readdir(BRAIN_DIR);
  // Find files matching ds_<charName>_<timestamp>.png
  const matches = files.filter(f => f.startsWith(`ds_${charName}_`) && f.endsWith('.png'));
  if (matches.length > 0) {
    // Get the latest one
    matches.sort();
    return path.join(BRAIN_DIR, matches[matches.length - 1]);
  }
  return null;
}

// Brawl Stars character IDs for CDN
// Using portraits folder (up to 800px) which are high quality
const bsBrawlerIds = {
  leon: '16000014',
  crow: '16000009',
  spike: '16000008',
  shelly: '16000000',
  colt: '16000001',
  edgar: '16000049',
  mortis: '16000018',
  fang: '16000054',
  buzz: '16000050',
  surge: '16000045',
  cordelius: '16000068',
  chester: '16000063',
  kit: '16000072',
  stu: '16000047',
  melodie: '16000074',
  kenji: '16000078',
};

// Also try Leon generated image from brain
async function findBsGeneratedImage(charName) {
  const { readdir } = await import('fs/promises');
  const files = await readdir(BRAIN_DIR);
  const matches = files.filter(f => f.startsWith(`bs_${charName}_`) && f.endsWith('.png'));
  if (matches.length > 0) {
    matches.sort();
    return path.join(BRAIN_DIR, matches[matches.length - 1]);
  }
  return null;
}

async function main() {
  const dsDir = 'public/characters/ds';
  const bsDir = 'public/characters/bs';
  if (!existsSync(dsDir)) await mkdir(dsDir, { recursive: true });
  if (!existsSync(bsDir)) await mkdir(bsDir, { recursive: true });

  // === DEMON SLAYER ===
  console.log('=== Copying AI-Generated Demon Slayer Images ===');
  let dsCopied = 0;
  for (const name of dsCharacters) {
    const src = await findGeneratedImage(name);
    if (src) {
      const dest = path.join(dsDir, `${name}.png`);
      await copyFile(src, dest);
      const { stat } = await import('fs/promises');
      const stats = await stat(dest);
      console.log(`✓ ${name}: ${(stats.size / 1024).toFixed(1)} KB (AI-generated)`);
      dsCopied++;
    } else {
      console.log(`✗ ${name}: No AI-generated image found, keeping existing file`);
    }
  }
  console.log(`\nDemon Slayer: ${dsCopied}/${dsCharacters.length} images updated\n`);

  // === BRAWL STARS ===
  console.log('=== Downloading/Copying Brawl Stars Images ===');
  let bsUpdated = 0;

  for (const [name, id] of Object.entries(bsBrawlerIds)) {
    // First check if there's an AI-generated image
    const genImage = await findBsGeneratedImage(name);
    if (genImage) {
      const dest = path.join(bsDir, `${name}.png`);
      await copyFile(genImage, dest);
      const { stat } = await import('fs/promises');
      const stats = await stat(dest);
      console.log(`✓ ${name}: ${(stats.size / 1024).toFixed(1)} KB (AI-generated)`);
      bsUpdated++;
      continue;
    }

    // Try different CDN paths in order of quality
    const urls = [
      `https://cdn.brawlify.com/brawlers/portraits/${id}.png`,
      `https://cdn.brawlify.com/brawlers/model/${id}.png`,
      `https://cdn.brawlify.com/brawlers/borders/${id}.png`,
      `https://cdn.brawlify.com/brawlers/borderless/${id}.png`,
    ];

    let downloaded = false;
    for (const url of urls) {
      try {
        const dest = path.join(bsDir, `${name}.png`);
        const size = await downloadFile(url, dest);
        if (size > 1000) { // At least 1KB to be a real image
          console.log(`✓ ${name}: ${(size / 1024).toFixed(1)} KB from ${url.split('/').slice(-2).join('/')}`);
          bsUpdated++;
          downloaded = true;
          break;
        }
      } catch (err) {
        // Try next URL
      }
    }
    if (!downloaded) {
      console.log(`✗ ${name}: All CDN URLs failed, keeping existing file`);
    }
  }
  console.log(`\nBrawl Stars: ${bsUpdated}/${Object.keys(bsBrawlerIds).length} images updated\n`);
  console.log('Done!');
}

main().catch(console.error);
