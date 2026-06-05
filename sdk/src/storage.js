const ANONYMOUS_ID_KEY = 'analytics_platform_anonymous_id';

function createMemoryStorage() {
  const memory = new Map();
  return {
    getItem(key) {
      return memory.has(key) ? memory.get(key) : null;
    },
    setItem(key, value) {
      memory.set(key, value);
    },
    removeItem(key) {
      memory.delete(key);
    },
  };
}

function getStorage() {
  if (typeof window === 'undefined') {
    return createMemoryStorage();
  }

  try {
    const { localStorage } = window;
    const probeKey = '__analytics_probe__';
    localStorage.setItem(probeKey, '1');
    localStorage.removeItem(probeKey);
    return localStorage;
  } catch {
    return createMemoryStorage();
  }
}

function generateAnonymousId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `anon_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

function getAnonymousId() {
  const storage = getStorage();
  const existing = storage.getItem(ANONYMOUS_ID_KEY);
  if (existing) {
    return existing;
  }

  const anonymousId = generateAnonymousId();
  storage.setItem(ANONYMOUS_ID_KEY, anonymousId);
  return anonymousId;
}

function setAnonymousId(value) {
  if (!value) {
    return getAnonymousId();
  }

  getStorage().setItem(ANONYMOUS_ID_KEY, value);
  return value;
}

function clearAnonymousId() {
  getStorage().removeItem(ANONYMOUS_ID_KEY);
}

export { ANONYMOUS_ID_KEY, clearAnonymousId, generateAnonymousId, getAnonymousId, setAnonymousId };
