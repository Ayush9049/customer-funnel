import { useState } from 'react';
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
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

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

      <div className="mt-6 overflow-x-auto rounded-lg border border-[#E5E7EB]">
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
                    {(() => {
                      const properties = event.properties || {};
                      const entries = Object.entries(properties);
                      if (entries.length === 0) return <span className="text-[#9CA3AF]">—</span>;

                      const isExpanded = expandedRows[event.id];
                      const visibleEntries = isExpanded ? entries : entries.slice(0, 3);

                      return (
                        <div className="flex flex-col gap-2 max-w-[320px] md:max-w-[400px]">
                          {isExpanded ? (
                            <div className="relative">
                              <pre className="overflow-x-auto max-h-[160px] overflow-y-auto rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-[11px] text-[#1a1a1a] font-mono whitespace-pre-wrap break-all">
                                {JSON.stringify(properties, null, 2)}
                              </pre>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {visibleEntries.map(([key, value]) => {
                                if (value === null || value === undefined) return null;
                                const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                                return (
                                  <span
                                    key={key}
                                    className="inline-flex items-center gap-1 rounded bg-[#F8FAFC] border border-[#E5E7EB] px-2 py-0.5 text-[11px] text-[#1a1a1a] font-medium"
                                  >
                                    <span className="text-[#9CA3AF] font-normal">{key}:</span>
                                    <span className="truncate max-w-[120px]" title={stringValue}>
                                      {stringValue}
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {entries.length > 3 && (
                              <button
                                onClick={() => toggleExpand(event.id)}
                                className="inline-flex items-center rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[11px] text-[#2563EB] hover:bg-[#DBEAFE] font-semibold transition"
                              >
                                {isExpanded ? 'Show less' : `+${entries.length - 3} more`}
                              </button>
                            )}
                            <button
                              onClick={() => handleCopy(event.id, JSON.stringify(properties, null, 2))}
                              className="inline-flex items-center gap-1 rounded bg-[#F3F4F6] hover:bg-[#E5E7EB] px-2 py-0.5 text-[11px] text-[#4B5563] font-semibold transition"
                              title="Copy JSON to Clipboard"
                            >
                              {copiedId === event.id ? (
                                <>
                                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-green-600">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                  </svg>
                                  <span>Copy JSON</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })()}
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
