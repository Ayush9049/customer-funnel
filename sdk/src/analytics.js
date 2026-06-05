import { getAnonymousId, setAnonymousId } from './storage.js';
import { Tracker } from './tracker.js';

const defaultConfig = {
  apiKey: '',
  endpoint: 'http://localhost:8000',
};

const state = {
  config: { ...defaultConfig },
  tracker: null,
  userId: null,
  anonymousId: null,
};

function init(config = {}) {
  state.config = {
    ...defaultConfig,
    ...config,
  };

  state.anonymousId = setAnonymousId(config.anonymous_id ?? getAnonymousId());
  state.userId = config.user_id ?? null;
  state.tracker = new Tracker({
    apiKey: state.config.apiKey,
    endpoint: state.config.endpoint,
    anonymousId: state.anonymousId,
    userId: state.userId,
  });

  return {
    anonymousId: state.anonymousId,
    endpoint: state.config.endpoint,
  };
}

async function track(eventName, properties = {}) {
  if (!state.tracker) {
    init();
  }

  try {
    const result = await state.tracker.track(eventName, properties);
    if (!result.ok) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Analytics track failed', result.status ?? result.error);
      }
      return false;
    }
    return true;
  } catch (error) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('Analytics track error', error);
    }
    return false;
  }
}

function identify(userId) {
  state.userId = userId;
  if (state.tracker) {
    state.tracker.setUserId(userId);
  }
  return userId;
}

function reset() {
  state.userId = null;
  state.anonymousId = setAnonymousId(null);
  if (state.tracker) {
    state.tracker.setAnonymousId(state.anonymousId);
    state.tracker.setUserId(null);
  }
}

function getAnonymous() {
  if (!state.anonymousId) {
    state.anonymousId = setAnonymousId(getAnonymousId());
  }
  return state.anonymousId;
}

const Analytics = {
  init,
  track,
  identify,
  reset,
  getAnonymousId: getAnonymous,
};

if (typeof window !== 'undefined') {
  window.Analytics = Analytics;
}

export default Analytics;
export { Analytics };
