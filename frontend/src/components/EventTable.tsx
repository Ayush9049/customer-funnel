import type { EventItem } from '../types';
import { formatToIST, formatEventName } from '../utils/format';

interface EventTableProps {
  events: EventItem[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  eventName: string;
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
  eventName,
  onEventNameChange,
  onPageChange,
}: EventTableProps) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-subtle">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9CA3AF] font-medium">Event viewer</p>
          <h2 className="mt-1 text-2xl font-bold text-[#1a1a1a]">Recent Tracked Events</h2>
          <p className="mt-2 text-sm text-[#9CA3AF]">
            Showing {events.length} of {total.toLocaleString()} events
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:w-[420px]">
          <label className="flex flex-col gap-2 text-sm text-[#6B7280] font-medium">
            <span>Event Name</span>
            <select
              value={eventName}
              onChange={(event) => onEventNameChange(event.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-[#1a1a1a] outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/10 font-medium"
            >
              <option value="">All Events</option>
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {formatEventName(option)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-[#E5E7EB]">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.24em] text-[#9CA3AF] bg-[#FAFAFA] font-medium border-b border-[#E5E7EB]">
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
                <td className="px-4 py-6 text-[#9CA3AF]" colSpan={5}>
                  No events match the current filters.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-4 text-sm font-bold text-[#1a1a1a]">{formatEventName(event.event_name)}</td>
                  <td className="px-4 py-4 text-sm text-[#6B7280]">
                    <div className="customer-info">
                      <div className="customer-name font-medium text-[#1a1a1a]">
                        {(event.properties?.customer_name as string) || (event.properties?.customer_email as string) || event.user_id || '—'}
                      </div>
                      {event.user_id && (
                        <div className="customer-phone text-xs text-[#9CA3AF] mt-0.5">
                          {event.user_id}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#6B7280]">{event.anonymous_id ?? '—'}</td>
                  <td className="px-4 py-4 text-sm text-[#6B7280]">
                    <code
                      title={JSON.stringify(event.properties)}
                      className="max-w-[220px] truncate rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-1 text-[11px] text-[#1a1a1a] font-medium"
                    >
                      {JSON.stringify(event.properties)}
                    </code>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#9CA3AF]">{formatToIST(event.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">
          Page {page} of {Math.max(totalPages, 1)} · {pageSize} rows per page
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-lg px-3 py-2 text-sm font-bold text-[#1a1a1a] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:text-[#D1D5DB]"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded-lg px-3 py-2 text-sm font-bold text-[#1a1a1a] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:text-[#D1D5DB]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
