// Script to download Demon Slayer character images from Fandom wiki
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import https from 'https';

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const request = (urlStr, redirectCount = 0) => {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      const parsedUrl = new URL(urlStr);
      https.get(parsedUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location, redirectCount + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
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

// Correct Fandom wiki URLs with revision hashes (from API query)
const demonSlayer = {
  tanjiro: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/0/05/Tanjiro_anime_right_face.png/revision/latest/scale-to-width-down/229?cb=20241228000706",
  nezuko: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/0/0e/Nezuko_anime_right_face.png/revision/latest/scale-to-width-down/239?cb=20241228000758",
  zenitsu: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/4/4f/Zenitsu_anime_right_face.png/revision/latest/scale-to-width-down/238?cb=20241228000445",
  inosuke: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/d/d4/Inosuke_anime.png/revision/latest/scale-to-width-down/280?cb=20181128204238",
  rengoku: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/d/de/Kyojuro_anime_right_face.png/revision/latest/scale-to-width-down/321?cb=20241228001647",
  akaza: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/9/99/Akaza_IC_anime_render.png/revision/latest/scale-to-width-down/353?cb=20250827171706",
  kokushibo: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/5/5f/Kokushibo_back_facing.png/revision/latest/scale-to-width-down/364?cb=20250827172040",
  muzan: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/0/0e/Muzan_Kibutsuji_Full_Body_%28Anime%29.png/revision/latest/scale-to-width-down/377?cb=20210731042132",
  daki: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/e/e7/Daki_Anime_%28Awakened%29.png/revision/latest/scale-to-width-down/301?cb=20240704040250",
  gyutaro: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/f/f4/Gyutaro_Anime.png/revision/latest/scale-to-width-down/304?cb=20251026044212",
  tengen: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/0/07/Tengen_anime.png/revision/latest/scale-to-width-down/280?cb=20191024210335",
  shinobu: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/e/e5/Shinobu_anime.png/revision/latest/scale-to-width-down/280?cb=20241010231126",
  giyu: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/4/43/Giyu_anime_design.png/revision/latest/scale-to-width-down/280?cb=20190831073602",
  mitsuri: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/7/74/Mitsuri_anime.png/revision/latest/scale-to-width-down/280?cb=20230614072150",
  sanemi: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/3/3f/Sanemi_Shinazugawa_Full_Body_%28Anime%29.png/revision/latest/scale-to-width-down/280?cb=20190831171507",
  obanai: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/7/70/Obanai_anime_right_face.png/revision/latest/scale-to-width-down/227?cb=20241228001105",
};

async function main() {
  const dsDir = 'public/characters/ds';
  if (!existsSync(dsDir)) await mkdir(dsDir, { recursive: true });

  console.log('=== Downloading Demon Slayer characters ===');
  for (const [name, url] of Object.entries(demonSlayer)) {
    try {
      const size = await downloadFile(url, `${dsDir}/${name}.png`);
      console.log(`✓ ${name}: ${(size / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.log(`✗ ${name}: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main();
