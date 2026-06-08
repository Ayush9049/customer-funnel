import type { EventItem } from '../types';
import { formatToIST } from '../utils/format';

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
    <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#6B7280]">Event viewer</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#18181B]">Recent tracked events</h2>
          <p className="mt-2 text-sm text-slate-500">
            Showing {events.length} of {total.toLocaleString()} events
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:w-[420px]">
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            <span>User ID</span>
            <input
              value={userId}
              onChange={(event) => onUserIdChange(event.target.value)}
              placeholder="user-1001"
              className="rounded-[8px] border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            <span>Event name</span>
            <select
              value={eventName}
              onChange={(event) => onEventNameChange(event.target.value)}
              className="rounded-[8px] border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
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

      <div className="mt-6 overflow-hidden rounded-[8px] border border-[#E5E7EB]">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.24em] text-[#6B7280]">
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Anonymous</th>
              <th className="px-4 py-3">Properties</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                  No events match the current filters.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-b border-[#E5E7EB] hover:bg-slate-50">
                  <td className="px-4 py-4 text-sm font-medium text-[#18181B]">{event.event_name}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{event.user_id ?? '—'}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{event.anonymous_id ?? '—'}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    <code
                      title={JSON.stringify(event.properties)}
                      className="max-w-[220px] truncate rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-1 text-[11px] text-[#18181B]"
                    >
                      {JSON.stringify(event.properties)}
                    </code>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">{formatToIST(event.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {page} of {Math.max(totalPages, 1)} · {pageSize} rows per page
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded px-3 py-2 text-sm font-medium text-[#18181B] transition hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded px-3 py-2 text-sm font-medium text-[#18181B] transition hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
