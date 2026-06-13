import type {
  AnalyticsOverview,
  EventListResponse,
  FunnelResponse,
  Project,
  ModularFunnelsResponse,
} from "../types";


export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "" : "https://customer-funnel-production.up.railway.app");

const API_KEY =
  import.meta.env.VITE_ANALYTICS_API_KEY ??
  import.meta.env.VITE_API_KEY ??
  "demo-key";

async function request<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  console.log("Fetching analytics...", url);

  const response = await fetch(url);
  const text = await response.text();

  console.log("Response:", {
    url,
    status: response.status,
    statusText: response.statusText,
    body: text,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${text}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch (parseError) {
    throw new Error(`Failed to parse JSON response from ${url}: ${parseError}`);
  }
}

export async function getProjects(): Promise<Project[]> {
  return request("/api/projects");
}

export async function getOverview(
  projectId: number
): Promise<AnalyticsOverview> {
  return request(`/api/analytics/overview?project_id=${projectId}`);
}

export async function getFunnel(
  projectId: number
): Promise<FunnelResponse> {
  return request(`/api/analytics/funnel?project_id=${projectId}`);
}

export async function getModularFunnels(
  projectId: number
): Promise<ModularFunnelsResponse> {
  return request(`/api/analytics/modular-funnels?project_id=${projectId}`);
}


export async function getEvents(params: {
  projectId: number;
  page?: number;
  pageSize?: number;
  eventName?: string;
}): Promise<EventListResponse> {
  const search = new URLSearchParams();

  search.set("project_id", String(params.projectId));
  search.set("page", String(params.page ?? 1));
  search.set("page_size", String(params.pageSize ?? 10));

  if (params.eventName) {
    search.set("event_name", params.eventName);
  }

  return request(`/api/events?${search.toString()}`);
}

export async function trackEvent(payload: {
  user_id?: string | null;
  anonymous_id?: string | null;
  event_name: string;
  properties?: Record<string, unknown>;
}) {
  if (typeof window === "undefined") {
    throw new Error("trackEvent can only run in the browser");
  }

  if (!API_KEY) {
    throw new Error(
      "Missing analytics API key. Set VITE_ANALYTICS_API_KEY or VITE_API_KEY."
    );
  }

  const storedAnonymousId =
    window.localStorage.getItem("analytics_anonymous_id");

  const anonymousId =
    payload.anonymous_id ??
    storedAnonymousId ??
    `anon-${crypto.randomUUID()}`;

  if (!storedAnonymousId) {
    window.localStorage.setItem(
      "analytics_anonymous_id",
      anonymousId
    );
  }

  const eventName = payload.event_name.trim();

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/events/track`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: API_KEY,
          user_id: payload.user_id ?? null,
          anonymous_id: anonymousId,
          event_name: eventName,
          properties: payload.properties ?? {},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Tracking failed with status ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Tracking event failed:", error);
    throw error;
  }
}