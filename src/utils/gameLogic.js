import { CATEGORIES } from '../data/characters';

// ── Settings (localStorage) ──
export function getEnabledCharacters(category) {
  const key = `imposter_enabled_${category}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  // Default: all characters enabled
  return CATEGORIES[category].map(c => c.name);
}

export function saveEnabledCharacters(category, enabledNames) {
  const key = `imposter_enabled_${category}`;
  localStorage.setItem(key, JSON.stringify(enabledNames));
}

export function getActiveCharacters(category) {
  const enabledNames = getEnabledCharacters(category);
  const active = CATEGORIES[category].filter(c => enabledNames.includes(c.name));
  if (active.length < 7) {
    return CATEGORIES[category]; // Safety fallback
  }
  return active;
}

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

// Returns a full character OBJECT { name }
export function selectSecretWord(category) {
  const active = getActiveCharacters(category);
  const recent = getRecentWords(category);
  const available = active.filter(c => !recent.includes(c.name));
  const pool = available.length > 0 ? available : active;
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
// Returns array of 7 character OBJECTS from the active category list

export function generateGuessOptions(category, secretCharObj) {
  const active = getActiveCharacters(category);
  const others = active.filter(c => c.name !== secretCharObj.name);
  const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 6);
  return [...shuffled, secretCharObj].sort(() => Math.random() - 0.5);
}

// ── Score Updates ──

// updateScores now takes the votes array: { [voterName]: votedForName }
export function updateScores(scores, players, imposterIndex, imposterWon, votes) {
  const next = { ...scores };
  const imposterName = players[imposterIndex];

  // Crewmate scoring: +1 for voting the imposter correctly
  // Imposter scoring: +1 for every crewmate who does NOT vote for the imposter
  let stealthPoints = 0;

  players.forEach((playerName, i) => {
    if (i !== imposterIndex) {
      const vote = votes[playerName];
      if (vote === imposterName) {
        // Crewmate voted correctly
        next[playerName] = (next[playerName] || 0) + 1;
      } else {
        // Crewmate voted wrong (or didn't vote imposter)
        stealthPoints += 1;
      }
    }
  });

  // Imposter gets stealth points
  next[imposterName] = (next[imposterName] || 0) + stealthPoints;

  // Imposter gets +1 if they guessed the secret word correctly
  if (imposterWon) {
    next[imposterName] = (next[imposterName] || 0) + 1;
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
