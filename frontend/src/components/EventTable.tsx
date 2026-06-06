gimport type { EventItem } from '../types';

interface EventTableProps {
  events: EventItem[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  userId: string;
  eventName: string;
  onUserIdChange: (value: string) => void;
  onEventNameChange: (value: string) => void;
  onPageChange: (value: number) => void;
}

const filterOptions = ['login', 'product_view', 'add_to_cart', 'checkout_started', 'purchase'];

export default function EventTable({
  events,
  page,
  totalPages,
  total,
  pageSize,
  userId,
  eventName,
  onUserIdChange,
  onEventNameChange,
  onPageChange,
}: EventTableProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">Event viewer</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Recent tracked events</h2>
          <p className="mt-2 text-sm text-slate-400">
            Showing {events.length} of {total.toLocaleString()} events
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            User ID
            <input
              value={userId}
              onChange={(event) => onUserIdChange(event.target.value)}
              placeholder="user-1001"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Event name
            <select
              value={eventName}
              onChange={(event) => onEventNameChange(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-300/60"
            >
              <option value="">All events</option>
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/5 text-sm uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Anonymous</th>
              <th className="px-4 py-3">Properties</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-slate-950/30 text-sm text-slate-200">
            {events.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={5}>
                  No events match the current filters.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-white/5">
                  <td className="px-4 py-4 font-medium text-white">{event.event_name}</td>
                  <td className="px-4 py-4 text-slate-300">{event.user_id ?? '—'}</td>
                  <td className="px-4 py-4 text-slate-300">{event.anonymous_id ?? '—'}</td>
                  <td className="px-4 py-4 text-slate-300">
                    <pre className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-200">
                      {JSON.stringify(event.properties)}
                    </pre>
                  </td>
                  <td className="px-4 py-4 text-slate-400">{new Date(event.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {page} of {Math.max(totalPages, 1)} · {pageSize} rows per page
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
