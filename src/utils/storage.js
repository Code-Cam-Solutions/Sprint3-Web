const KEYS = {
  HISTORY: "codecam_history",
  STATS: "codecam_stats",
};

function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getHistory() {
  return get(KEYS.HISTORY, []);
}

export function saveHistoryEntry(entry) {
  const history = getHistory();
  const updated = [entry, ...history];
  set(KEYS.HISTORY, updated);
  return updated;
}

export function removeHistoryEntry(id) {
  const history = getHistory();
  set(
    KEYS.HISTORY,
    history.filter((e) => e.id !== id),
  );
}

export function clearHistory() {
  set(KEYS.HISTORY, []);
}

function defaultStats() {
  return {
    summariesGenerated: 0,
    flashcardsGenerated: 0,
    sessionsStarted: 0,
    firstUsedAt: null,
    lastUsedAt: null,
  };
}

export function getStats() {
  return get(KEYS.STATS, defaultStats());
}

export function incrementStats(delta) {
  const stats = getStats();
  const now = new Date().toISOString();
  const updated = { ...stats };

  for (const [k, v] of Object.entries(delta)) {
    if (typeof updated[k] === "number") updated[k] += v;
  }

  if (!updated.firstUsedAt) updated.firstUsedAt = now;
  updated.lastUsedAt = now;

  set(KEYS.STATS, updated);
  return updated;
}
