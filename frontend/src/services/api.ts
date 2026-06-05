import type { AnalyticsOverview, EventListResponse, FunnelResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getOverview(): Promise<AnalyticsOverview> {
  return request<AnalyticsOverview>('/api/analytics/overview');
}

export async function getFunnel(): Promise<FunnelResponse> {
  return request<FunnelResponse>('/api/analytics/funnel');
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
  if (params.userId) {
    search.set('user_id', params.userId);
  }
  if (params.eventName) {
    search.set('event_name', params.eventName);
  }
  return request<EventListResponse>(`/api/events?${search.toString()}`);
}

export async function trackEvent(payload: {
  user_id?: string | null;
  anonymous_id?: string | null;
  event_name: string;
  properties?: Record<string, unknown>;
}): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}/api/events/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Tracking failed with status ${response.status}`);
  }

  return response.json();
}
