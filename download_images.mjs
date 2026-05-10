// Script to download character images for Demon Slayer and Brawl Stars
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import https from 'https';
import http from 'http';

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = (urlStr, redirectCount = 0) => {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      protocol.get(urlStr, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
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

// Demon Slayer characters - Fandom Wiki image URLs
// These are from kimetsu-no-yaiba.fandom.com static CDN
const demonSlayer = {
  tanjiro: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/5/55/Tanjiro_anime_design.png",
  nezuko: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/1/1d/Nezuko_anime_design.png",
  zenitsu: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/8/89/Zenitsu_anime_design.png",
  inosuke: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/5/53/Inosuke_anime_design.png",
  rengoku: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/b/bc/Kyojuro_anime_design.png",
  akaza: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/1/16/Akaza_anime_design.png",
  kokushibo: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/c/c7/Kokushibo_anime_design.png",
  muzan: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/b/b5/Muzan_anime_design.png",
  daki: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/5/5e/Daki_anime_design.png",
  gyutaro: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/6/62/Gyutaro_anime_design.png",
  tengen: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/1/18/Tengen_anime_design.png",
  shinobu: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/1/1f/Shinobu_anime_design.png",
  giyu: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/1/10/Giyu_anime_design.png",
  mitsuri: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/2/20/Mitsuri_anime_design.png",
  sanemi: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/a/a2/Sanemi_anime_design.png",
  obanai: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/a/a0/Obanai_anime_design.png",
};

// Brawl Stars - Brawlify CDN borderless portraits
// IDs from the Brawl Stars API
const brawlStars = {
  shelly: "https://cdn.brawlify.com/brawlers/borderless/16000000.png",
  colt: "https://cdn.brawlify.com/brawlers/borderless/16000001.png",
  spike: "https://cdn.brawlify.com/brawlers/borderless/16000008.png",
  crow: "https://cdn.brawlify.com/brawlers/borderless/16000009.png",
  leon: "https://cdn.brawlify.com/brawlers/borderless/16000014.png",
  mortis: "https://cdn.brawlify.com/brawlers/borderless/16000018.png",
  surge: "https://cdn.brawlify.com/brawlers/borderless/16000046.png",
  edgar: "https://cdn.brawlify.com/brawlers/borderless/16000049.png",
  buzz: "https://cdn.brawlify.com/brawlers/borderless/16000050.png",
  fang: "https://cdn.brawlify.com/brawlers/borderless/16000054.png",
  chester: "https://cdn.brawlify.com/brawlers/borderless/16000061.png",
  cordelius: "https://cdn.brawlify.com/brawlers/borderless/16000066.png",
  kit: "https://cdn.brawlify.com/brawlers/borderless/16000068.png",
  melodie: "https://cdn.brawlify.com/brawlers/borderless/16000070.png",
  stu: "https://cdn.brawlify.com/brawlers/borderless/16000048.png",
  kenji: "https://cdn.brawlify.com/brawlers/borderless/16000074.png",
};

async function main() {
  // Ensure directories exist
  const dsDir = 'public/characters/ds';
  const bsDir = 'public/characters/bs';
  if (!existsSync(dsDir)) await mkdir(dsDir, { recursive: true });
  if (!existsSync(bsDir)) await mkdir(bsDir, { recursive: true });

  console.log('=== Downloading Demon Slayer characters ===');
  for (const [name, url] of Object.entries(demonSlayer)) {
    try {
      const size = await downloadFile(url, `${dsDir}/${name}.png`);
      console.log(`✓ ${name}: ${(size / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.log(`✗ ${name}: ${err.message}`);
    }
  }

  console.log('\n=== Downloading Brawl Stars characters ===');
  for (const [name, url] of Object.entries(brawlStars)) {
    try {
      const size = await downloadFile(url, `${bsDir}/${name}.png`);
      console.log(`✓ ${name}: ${(size / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.log(`✗ ${name}: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main();
