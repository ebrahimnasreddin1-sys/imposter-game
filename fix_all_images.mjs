// Comprehensive script to download correct high-quality character images
// for ALL Brawl Stars characters + fix specific JJK and DS characters
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import https from 'https';
import http from 'http';

async function downloadFile(url, dest, label = '') {
  return new Promise((resolve, reject) => {
    const request = (urlStr, redirectCount = 0) => {
      if (redirectCount > 10) return reject(new Error('Too many redirects'));
      const parsedUrl = new URL(urlStr);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      client.get(parsedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': 'https://brawlstars.fandom.com/',
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectUrl = res.headers.location;
          if (redirectUrl.startsWith('/')) {
            redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
          }
          return request(redirectUrl, redirectCount + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          if (buffer.length < 500) {
            return reject(new Error(`Too small: ${buffer.length} bytes`));
          }
          writeFile(dest, buffer).then(() => resolve(buffer.length)).catch(reject);
        });
        res.on('error', reject);
      }).on('error', reject);
    };
    request(url);
  });
}

// === BRAWL STARS ===
// Using Brawl Stars Fandom wiki API to get correct character images
// Each character's wiki page has a proper portrait/render

// Brawl Stars character -> Fandom wiki page title mapping
const bsWikiPages = {
  leon: 'Leon',
  crow: 'Crow',
  spike: 'Spike',
  shelly: 'Shelly',
  colt: 'Colt',
  edgar: 'Edgar',
  mortis: 'Mortis',
  fang: 'Fang',
  buzz: 'Buzz',
  surge: 'Surge',
  cordelius: 'Cordelius',
  chester: 'Chester',
  kit: 'Kit',
  stu: 'Stu',
  melodie: 'Melodie',
  kenji: 'Kenji',
};

// JJK characters that need fixing
const jjkWikiPages = {
  hakari: 'Kinji_Hakari',
  nanami: 'Kento_Nanami',
  yuta: 'Yuta_Okkotsu',
  kashimo: 'Hajime_Kashimo',
};

// DS characters that need fixing
const dsWikiPages = {
  nezuko: 'Nezuko_Kamado',
};

async function getWikiImageUrl(wikiBase, pageTitle, thumbSize = 400) {
  const apiUrl = `${wikiBase}/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=${thumbSize}`;
  
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(apiUrl);
    https.get(parsedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        const redirectUrl = new URL(res.headers.location);
        https.get(redirectUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
          const chunks = [];
          res2.on('data', chunk => chunks.push(chunk));
          res2.on('end', () => {
            try {
              const data = JSON.parse(Buffer.concat(chunks).toString());
              const pages = data.query?.pages || {};
              const page = Object.values(pages)[0];
              resolve(page?.thumbnail?.source || null);
            } catch { resolve(null); }
          });
        }).on('error', () => resolve(null));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString());
          const pages = data.query?.pages || {};
          const page = Object.values(pages)[0];
          resolve(page?.thumbnail?.source || null);
        } catch { resolve(null); }
      });
      res.on('error', () => resolve(null));
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const bsDir = 'public/characters/bs';
  const jjkDir = 'public/characters/jjk';
  const dsDir = 'public/characters/ds';
  
  for (const dir of [bsDir, jjkDir, dsDir]) {
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  }

  // === BRAWL STARS - Download from Fandom wiki ===
  console.log('=== Downloading Brawl Stars Character Images ===\n');
  const bsWikiBase = 'https://brawlstars.fandom.com';
  
  for (const [name, pageTitle] of Object.entries(bsWikiPages)) {
    const dest = `${bsDir}/${name}.png`;
    
    // Try wiki API first (gets the main page image)
    console.log(`  Fetching wiki image for ${name} (${pageTitle})...`);
    const wikiImageUrl = await getWikiImageUrl(bsWikiBase, pageTitle, 500);
    
    if (wikiImageUrl) {
      try {
        const size = await downloadFile(wikiImageUrl, dest, name);
        console.log(`  ✓ ${name}: ${(size / 1024).toFixed(1)} KB (wiki)\n`);
        continue;
      } catch (err) {
        console.log(`  ✗ Wiki download failed: ${err.message}`);
      }
    } else {
      console.log(`  ✗ No wiki image found`);
    }
    
    // Fallback: try Brawlify CDN model images (high-res full body)
    const brawlerIds = {
      leon: '16000014', crow: '16000009', spike: '16000008',
      shelly: '16000000', colt: '16000001', edgar: '16000049',
      mortis: '16000018', fang: '16000054', buzz: '16000050',
      surge: '16000045', cordelius: '16000068', chester: '16000063',
      kit: '16000072', stu: '16000047', melodie: '16000074',
      kenji: '16000078',
    };
    
    const id = brawlerIds[name];
    if (id) {
      const cdnUrls = [
        `https://cdn.brawlify.com/brawlers/model/${id}.png`,
        `https://cdn.brawlify.com/brawlers/portraits/${id}.png`,
      ];
      
      for (const url of cdnUrls) {
        try {
          const size = await downloadFile(url, dest, name);
          console.log(`  ✓ ${name}: ${(size / 1024).toFixed(1)} KB (CDN: ${url.includes('model') ? 'model' : 'portrait'})\n`);
          break;
        } catch (err) {
          // Try next
        }
      }
    }
  }

  // === JJK - Fix specific characters ===
  console.log('\n=== Fixing JJK Character Images (Hakari, Nanami, Yuta, Kashimo) ===\n');
  const jjkWikiBase = 'https://jujutsu-kaisen.fandom.com';
  
  for (const [name, pageTitle] of Object.entries(jjkWikiPages)) {
    const dest = `${jjkDir}/${name}.png`;
    console.log(`  Fetching wiki image for ${name} (${pageTitle})...`);
    const wikiImageUrl = await getWikiImageUrl(jjkWikiBase, pageTitle, 500);
    
    if (wikiImageUrl) {
      try {
        const size = await downloadFile(wikiImageUrl, dest, name);
        console.log(`  ✓ ${name}: ${(size / 1024).toFixed(1)} KB (wiki)\n`);
      } catch (err) {
        console.log(`  ✗ ${name}: Download failed: ${err.message}\n`);
      }
    } else {
      console.log(`  ✗ ${name}: No wiki image found\n`);
    }
  }

  // === DS - Fix Nezuko ===
  console.log('\n=== Fixing DS Character Image (Nezuko) ===\n');
  const dsWikiBase = 'https://kimetsu-no-yaiba.fandom.com';
  
  for (const [name, pageTitle] of Object.entries(dsWikiPages)) {
    const dest = `${dsDir}/${name}.png`;
    console.log(`  Fetching wiki image for ${name} (${pageTitle})...`);
    const wikiImageUrl = await getWikiImageUrl(dsWikiBase, pageTitle, 500);
    
    if (wikiImageUrl) {
      try {
        const size = await downloadFile(wikiImageUrl, dest, name);
        console.log(`  ✓ ${name}: ${(size / 1024).toFixed(1)} KB (wiki)\n`);
      } catch (err) {
        console.log(`  ✗ ${name}: Download failed: ${err.message}\n`);
      }
    } else {
      console.log(`  ✗ ${name}: No wiki image found\n`);
    }
  }

  console.log('\n=== Done! ===');
}

main().catch(console.error);
