import type { AnalyticsOverview, EventListResponse, FunnelResponse } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:8000' : 'https://customer-funnel-production.up.railway.app');
const API_KEY = import.meta.env.VITE_ANALYTICS_API_KEY ?? import.meta.env.VITE_API_KEY ?? 'demo-key';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getOverview(): Promise<AnalyticsOverview> {
  return request('/api/analytics/overview');
}

export async function getFunnel(): Promise<FunnelResponse> {
  return request('/api/analytics/funnel');
}

export async function getEvents(params: {
  page?: number;
  pageSize?: number;
  userId?: string;
  eventName?: string;
} = {}): Promise<EventListResponse> {
  const search = new URLSearchParams();

  search.set('page', String(params.page ?? 1));
  search.set('page_size', String(params.pageSize ?? 10));

  if (params.userId) search.set('user_id', params.userId);
  if (params.eventName) search.set('event_name', params.eventName);

  return request(`/api/events?${search.toString()}`);
}

export async function trackEvent(payload: {
  user_id?: string | null;
  anonymous_id?: string | null;
  event_name: string;
  properties?: Record<string, unknown>;
}) {
  if (typeof window === 'undefined') {
    throw new Error('trackEvent can only run in the browser');
  }

  if (!API_KEY) {
    throw new Error('Missing analytics API key. Set VITE_ANALYTICS_API_KEY or VITE_API_KEY.');
  }

  const storedAnonymousId = window.localStorage.getItem('analytics_anonymous_id');
  const anonymousId = payload.anonymous_id ?? storedAnonymousId ?? `anon-${crypto.randomUUID()}`;

  if (!storedAnonymousId) {
    window.localStorage.setItem('analytics_anonymous_id', anonymousId);
  }

  const eventName = payload.event_name.trim();
  console.log('Tracking event:', eventName);

  try {
    const response = await fetch(`${API_BASE_URL}/api/events/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: API_KEY,
        user_id: payload.user_id ?? null,
        anonymous_id: anonymousId,
        event_name: eventName,
        properties: payload.properties ?? {},
      }),
    });

    console.log('Tracking response status:', response.status);

    if (!response.ok) {
      throw new Error(`Tracking failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Tracking event failed:', error);
    throw error;
  }
}