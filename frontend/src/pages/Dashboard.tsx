import { useEffect, useState } from 'react';
import { getEvents, getFunnel, getOverview } from '../services/api';
import type { AnalyticsOverview, EventItem, FunnelResponse } from '../types';
import EventTable from '../components/EventTable';
import FunnelChart from '../components/FunnelChart';
import StatsCards from '../components/StatsCards';
import { formatToIST, formatEventName } from '../utils/format';

const navItems = ['Dashboard', 'Events', 'Funnels', 'Settings'];

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
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [funnel, setFunnel] = useState<FunnelResponse | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState('');
  const [eventName, setEventName] = useState('');
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | null = null;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [overviewData, funnelData, eventsData] = await Promise.all([
          getOverview(),
          getFunnel(),
          getEvents({ page, pageSize, userId, eventName }),
        ]);

        if (!cancelled) {
          setOverview(overviewData);
          setFunnel(funnelData);
          setEvents(eventsData.data);
          setTotal(eventsData.total);
          setTotalPages(eventsData.total_pages || 1);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load analytics data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    intervalId = window.setInterval(() => {
      void loadData();
    }, 15000);

    return () => {
      cancelled = true;
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [eventName, page, pageSize, userId]);

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 rounded-lg border border-[#E5E7EB] bg-white px-5 py-4 shadow-subtle">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-sm font-bold text-white">S</div>
              <span className="text-sm font-bold text-[#1a1a1a]">Shoption Analytics</span>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-[#6B7280]">
              {navItems.map((item) => (
                <a key={item} href="#" className="transition hover:text-[#1a1a1a] flex items-center gap-2">
                  <span>{item}</span>
                  {item === 'Events' && total > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-[#1a1a1a] text-white text-xs font-bold">
                      {total}
                    </span>
                  )}
                </a>
              ))}
            </div>
            <div className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-sm text-[#1a1a1a] font-medium">
              Last 30 days
            </div>
          </div>
        </nav>

        <section className="mb-8 rounded-lg border border-[#E5E7EB] bg-white px-6 py-6 shadow-subtle">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Funnel analytics for client-side product journeys.</h1>
              <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                Track login-to-purchase behavior, inspect individual events, and surface a concise dashboard for the
                product funnel.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#9CA3AF] font-medium">Backend endpoint</span>
              <span className="inline-flex rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-sm text-[#1a1a1a] font-medium">
                http://localhost:8000
              </span>
            </div>
          </div>
        </section>

        {error ? (
          <div className="mb-6 rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B] font-medium">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-lg border border-[#E5E7EB] bg-white px-6 py-10 text-center text-[#6B7280] shadow-subtle font-medium">
            Loading analytics dashboard...
          </div>
        ) : (
          <>
            <StatsCards overview={overview} />
            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <FunnelChart data={funnel} />
              <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-subtle">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#9CA3AF] font-medium">Live Feed</p>
                    <h2 className="mt-1 text-xl font-bold text-[#1a1a1a]">Recent Activity</h2>
                  </div>
                  <div className="divide-y divide-[#E5E7EB]">
                    {(overview?.recent_events ?? []).map((event) => {
                      const style = getEventStyle(event.event_name);
                      return (
                        <div key={event.id} className={`flex items-center gap-3 border-l-4 ${style} py-4 pl-4`}>
                          <span className={`inline-flex h-2.5 w-2.5 rounded-full ${style}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#1a1a1a]">{formatEventName(event.event_name)}</p>
                            <p className="mt-1 text-sm text-[#9CA3AF] truncate">
                              {event.user_id ?? event.anonymous_id ?? 'Anonymous user'}
                            </p>
                          </div>
                          <p className="ml-auto text-xs text-[#9CA3AF]">{formatToIST(event.created_at)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <EventTable
              events={events}
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              userId={userId}
              eventName={eventName}
              onUserIdChange={(value) => {
                setPage(1);
                setUserId(value);
              }}
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
