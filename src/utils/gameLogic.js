import { CATEGORIES } from '../data/characters';

// ── Word Memory (localStorage) ──
// Stores character NAMES (strings) for recent word tracking

export function getRecentWords(category) {
  const key = `imposter_recent_${category}`;
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}

export function saveRecentWord(category, charName) {
  const key = `imposter_recent_${category}`;
  const recent = getRecentWords(category);
  const updated = [charName, ...recent.filter(w => w !== charName)].slice(0, 10);
  localStorage.setItem(key, JSON.stringify(updated));
}

// Returns a full character OBJECT { name, fullName, image }
export function selectSecretWord(category) {
  const all = CATEGORIES[category];
  const recent = getRecentWords(category);
  const available = all.filter(c => !recent.includes(c.name));
  const pool = available.length > 0 ? available : all;
  const char = pool[Math.floor(Math.random() * pool.length)];
  saveRecentWord(category, char.name);
  return char;
}

// ── Imposter Selection ──

export function selectRandomImposter(playerCount, previousImposter) {
  let idx;
  if (playerCount <= 1) return 0;
  do {
    idx = Math.floor(Math.random() * playerCount);
  } while (idx === previousImposter && playerCount > 1);
  return idx;
}

// ── Guess Options ──
// Returns array of 7 character OBJECTS from the same category

export function generateGuessOptions(category, secretCharObj) {
  const all = CATEGORIES[category];
  const others = all.filter(c => c.name !== secretCharObj.name);
  const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 6);
  return [...shuffled, secretCharObj].sort(() => Math.random() - 0.5);
}

// ── Score Updates ──

export function updateScores(scores, players, imposterIndex, imposterWon) {
  const next = { ...scores };
  if (imposterWon) {
    const name = players[imposterIndex];
    next[name] = (next[name] || 0) + 2;
  } else {
    players.forEach((name, i) => {
      if (i !== imposterIndex) {
        next[name] = (next[name] || 0) + 1;
      }
    });
  }
  return next;
}

// ── Shuffle array (Fisher-Yates) ──

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Format timer ──

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
