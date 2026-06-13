import { useEffect, useState } from 'react';
import { API_BASE_URL, API_KEY, getEvents, getFunnel, getOverview, getProjects, getModularFunnels } from '../services/api';
import type { AnalyticsOverview, EventItem, FunnelResponse, Project, ModularFunnelsResponse } from '../types';
import EventTable from '../components/EventTable';
import FunnelChart from '../components/FunnelChart';
import StatsCards from '../components/StatsCards';
import ModularFunnelWidget from '../components/ModularFunnelWidget';
import { formatToIST, formatEventName } from '../utils/format';
import logoImage from '../assets/funnel_logo.png';

const eventTypeStyles: Record<string, string> = {
  purchase: 'border-[#16A34A] text-[#16A34A]',
  add_to_cart: 'border-[#2563EB] text-[#2563EB]',
  product_view: 'border-[#2563EB] text-[#2563EB]',
  checkout_started: 'border-[#2563EB] text-[#2563EB]',
  login: 'border-[#F97316] text-[#F97316]',
};

function getEventStyle(eventName: string) {
  return eventTypeStyles[eventName] ?? 'border-[#CBD5E1] text-[#6B7280]';
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [funnel, setFunnel] = useState<FunnelResponse | null>(null);
  const [modularFunnels, setModularFunnels] = useState<ModularFunnelsResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'modular'>('overview');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [eventName, setEventName] = useState('');
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectsDebugPayload, setProjectsDebugPayload] = useState<unknown>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);

      try {
        const list = await getProjects();
        console.log('Current API Key:', API_KEY);
        console.log('API Base URL:', API_BASE_URL);
        console.log('Projects Response (raw):', list);
        console.log('Projects Response type:', typeof list, Array.isArray(list));
        console.log('Projects Count (raw):', (list as any)?.length);
        console.log('Projects keys:', (list as any)?.map?.((p: any) => ({ id: p.id, api_key: p.api_key })));
        setProjects(list);
        setProjectsDebugPayload(list);

        if (list.length > 0) {
          setSelectedProject(list[0]);
        } else {
          setError(
            `No projects available for API key ${API_KEY}. Projects returned: ${list.length}. Response payload: ${JSON.stringify(
              list
            )}`
          );
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
        setError(e instanceof Error ? e.message : 'Failed to load projects.');
        setLoading(false);
      }
    }
    void fetchProjects();
  }, []);

  const activeProjectId = selectedProject?.id;

  useEffect(() => {
    if (!activeProjectId) {
      return;
    }

    const projectId = activeProjectId;
    let cancelled = false;
    let intervalId: number | null = null;

    async function loadData(isAutoRefresh = false) {
      const isInitialLoad = !isAutoRefresh;
      
      if (isInitialLoad) {
        setLoading(true);
      } else {
        console.log('🔄 [AUTO-REFRESH] Refreshing events and analytics...', {
          projectId,
          timestamp: new Date().toISOString(),
          page,
          eventName,
          pageSize,
        });
        setIsAutoRefreshing(true);
      }
      
      setError(null);

      try {
        const startTime = performance.now();
        
        const [overviewData, funnelData, eventsData, modularData] = await Promise.all([
          getOverview(projectId),
          getFunnel(projectId),
          getEvents({ projectId, page, pageSize, eventName }),
          getModularFunnels(projectId),
        ]);

        const endTime = performance.now();
        const fetchDuration = Math.round(endTime - startTime);

        if (!cancelled) {
          setOverview(overviewData);
          setFunnel(funnelData);
          setModularFunnels(modularData);
          const rawEventsData = eventsData as any;

          const eventsArray = rawEventsData?.data ?? rawEventsData?.items ?? rawEventsData?.results ?? rawEventsData?.events ?? [];
          setEvents(eventsArray);

          const totalCount =
            rawEventsData?.total ?? rawEventsData?.total_count ?? rawEventsData?.count ?? eventsArray.length;

          setTotal(totalCount);
          setTotalPages(eventsData?.total_pages ?? Math.max(1, Math.ceil(totalCount / pageSize)));

          const now = new Date();
          setLastRefreshTime(now);

          if (isAutoRefresh) {
            console.log('✅ [AUTO-REFRESH] Events updated successfully', {
              eventsCount: eventsArray.length,
              totalEvents: totalCount,
              fetchDurationMs: fetchDuration,
              timestamp: now.toISOString(),
            });
          } else {
            console.log('✅ [INITIAL LOAD] Dashboard loaded', {
              eventsCount: eventsArray.length,
              totalEvents: totalCount,
              fetchDurationMs: fetchDuration,
              timestamp: now.toISOString(),
            });
          }
        }
      } catch (fetchError) {
        console.error('❌ [REFRESH ERROR] Failed to load analytics data:', {
          projectId,
          isAutoRefresh,
          error: fetchError instanceof Error ? fetchError.message : String(fetchError),
          timestamp: new Date().toISOString(),
        });
        
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load analytics data');
        }
      } finally {
        if (!cancelled) {
          if (isInitialLoad) {
            setLoading(false);
          } else {
            setIsAutoRefreshing(false);
          }
        }
      }
    }

    // Initial load
    loadData(false);

    // Set up auto-refresh interval (every 15 seconds)
    intervalId = window.setInterval(() => {
      void loadData(true);
    }, 15000);

    console.log('📊 [DASHBOARD] Auto-refresh initialized', {
      projectId,
      intervalMs: 15000,
      timestamp: new Date().toISOString(),
    });

    return () => {
      cancelled = true;
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        console.log('🛑 [DASHBOARD] Auto-refresh cleanup', {
          projectId,
          timestamp: new Date().toISOString(),
        });
      }
    };
  }, [activeProjectId, eventName, page, pageSize]);


  return (
    <main className="min-h-screen bg-[#000000]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg border border-slate-800 bg-slate-950 px-5 py-4 shadow-subtle flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Funnel Analytics logo" className="h-16 w-16 object-contain" />
            <span className="text-sm font-bold text-[#F8FAFC]">Funnel Analytics</span>
          </div>
          <div className="flex items-center gap-3">
          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">Project:</span>
              <select
                value={selectedProject?.id ?? ''}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const proj = projects.find((p) => p.id === id);
                  if (proj) setSelectedProject(proj);
                }}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-[#F8FAFC] font-bold outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-[#F8FAFC] font-medium">
            Last 30 days
          </div>
          {lastRefreshTime && (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-[#9CA3AF] font-medium">
              <svg className={`h-3 w-3 ${isAutoRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Updated {lastRefreshTime.toLocaleTimeString()}</span>
            </div>
          )}
          </div>
        </div>

        <section className="mb-8 rounded-lg border border-slate-800 bg-slate-950 px-6 py-6 shadow-subtle">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">Funnel Analytics</h1>
              <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">
                Track login-to-purchase behavior, inspect individual events, and surface a concise dashboard for the
                product funnel.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#9CA3AF] font-medium">Backend endpoint</span>
              <span className="inline-flex rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-[#F8FAFC] font-medium">
                {API_BASE_URL || 'http://localhost:8000 (proxy)'}
              </span>
            </div>
          </div>
        </section>
        {error ? (
          <div className="mb-6 rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B] font-medium">
            {error}
          </div>
        ) : null}

        {/* Tab switcher */}
        <div className="mb-8 flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-bold border-b-2 border-l-0 transition-all ${
              activeTab === 'overview'
                ? 'border-[#F8FAFC] text-[#F8FAFC]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#D1D5DB]'
            }`}
          >
            Overview Dashboard
          </button>
          <button
            onClick={() => setActiveTab('modular')}
            className={`pb-3 text-sm font-bold border-b-2 border-l-0 transition-all ${
              activeTab === 'modular'
                ? 'border-[#F8FAFC] text-[#F8FAFC]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#D1D5DB]'
            }`}
          >
            Categorized Funnels
          </button>
        </div>

        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950 px-6 py-10 text-center text-[#F8FAFC] shadow-subtle font-medium">
            Loading analytics dashboard...
          </div>
        ) : (
          <>
            {activeTab === 'overview' ? (
              <>
                <StatsCards overview={overview} />
                <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] mb-8">
                  <FunnelChart data={funnel} />
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 shadow-subtle">
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9CA3AF] font-medium">Live Feed</p>
                        <h2 className="mt-1 text-xl font-bold text-[#F8FAFC]">Recent Activity</h2>
                      </div>
                      <div className="divide-y divide-slate-800">
                        {(overview?.recent_events ?? []).map((event) => {
                          const style = getEventStyle(event.event_name);
                          return (
                            <div key={event.id} className={`flex items-center gap-3 border-l-4 ${style} py-4 pl-4`}>
                              <span className={`inline-flex h-2.5 w-2.5 rounded-full ${style}`} />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[#F8FAFC]">{formatEventName(event.event_name)}</p>
                                <div className="customer-info mt-1">
                                  <div className="customer-name text-sm text-[#F8FAFC] font-medium truncate">
                                    {event.properties?.customer_name || event.properties?.customer_email || event.user_id || event.anonymous_id || 'Anonymous user'}
                                  </div>
                                  {event.user_id && (
                                    <div className="customer-phone text-xs text-[#9CA3AF] mt-0.5">
                                      {event.user_id}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="ml-auto text-xs text-[#9CA3AF]">{formatToIST(event.created_at)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {modularFunnels ? (
                  <div className="grid gap-8 md:grid-cols-2 mb-8">
                    <ModularFunnelWidget data={modularFunnels.authentication} />
                    <ModularFunnelWidget data={modularFunnels.discovery} />
                    <ModularFunnelWidget data={modularFunnels.cart} />
                    <ModularFunnelWidget data={modularFunnels.checkout} />
                    <ModularFunnelWidget data={modularFunnels.orders} />
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-800 bg-slate-950 px-6 py-10 text-center text-[#F8FAFC] shadow-subtle font-medium mb-8">
                    No modular funnels data available.
                  </div>
                )}
              </>
            )}

            <EventTable
              events={events}
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              eventName={eventName}
              onEventNameChange={(value) => {
                setPage(1);
                setEventName(value);
              }}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </main>
  );
}

