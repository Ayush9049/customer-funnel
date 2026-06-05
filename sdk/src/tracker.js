function normalizeEndpoint(endpoint) {
  return endpoint.replace(/\/$/, '');
}

class Tracker {
  constructor({ apiKey, endpoint, anonymousId, userId = null }) {
    this.apiKey = apiKey;
    this.endpoint = normalizeEndpoint(endpoint);
    this.anonymousId = anonymousId;
    this.userId = userId;
  }

  setAnonymousId(anonymousId) {
    this.anonymousId = anonymousId;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  async track(eventName, properties = {}) {
    const payload = {
      user_id: this.userId,
      anonymous_id: this.anonymousId,
      event_name: eventName,
      properties,
    };

    try {
      const response = await fetch(`${this.endpoint}/api/events/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (!response.ok) {
        return { ok: false, status: response.status };
      }

      return { ok: true, data: await response.json() };
    } catch (error) {
      return { ok: false, error };
    }
  }
}

export { Tracker };
