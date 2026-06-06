import { useEffect, useState } from 'react';
import { getEvents, getFunnel, getOverview } from '../services/api';
import type { AnalyticsOverview, EventItem, FunnelResponse } from '../types';
import EventTable from '../components/EventTable';
import FunnelChart from '../components/FunnelChart';
import StatsCards from '../components/StatsCards';

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
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(103,232,249,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_26%),linear-gradient(180deg,_#081120_0%,_#0f172a_55%,_#0b1020_100%)]" />
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">Analytics Platform</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Funnel analytics for client-side product journeys.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Track login-to-purchase behavior, inspect individual events, and surface a concise dashboard for the
                product funnel.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 px-5 py-4 text-sm text-slate-300">
              <p className="uppercase tracking-[0.24em] text-slate-400">Backend endpoint</p>
              <p className="mt-2 font-medium text-white">http://localhost:8000</p>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-rose-100">{error}</div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
            Loading analytics dashboard...
          </div>
        ) : (
          <>
            <StatsCards overview={overview} />
            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <FunnelChart data={funnel} />
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-glow backdrop-blur">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">Snapshot</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Recent activity</h2>
                <div className="mt-6 space-y-4">
                  {(overview?.recent_events ?? []).map((event) => (
                    <div key={event.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-white">{event.event_name}</p>
                        <p className="text-xs text-slate-400">{new Date(event.created_at).toLocaleString()}</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">
                        {event.user_id ? `User ${event.user_id}` : `Anonymous ${event.anonymous_id ?? 'visitor'}`}
                      </p>
                    </div>
                  ))}
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
