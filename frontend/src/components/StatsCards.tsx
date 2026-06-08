import type { AnalyticsOverview } from '../types';

interface StatsCardsProps {
  overview: AnalyticsOverview | null;
}

const items = [
  { label: 'Total Events', key: 'total_events', change: '+12%' },
  { label: 'Unique Users', key: 'unique_users', change: '+8%' },
  { label: 'Purchases', key: 'purchases', change: '+5%' },
];

export default function StatsCards({ overview }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const value = overview?.[item.key as keyof AnalyticsOverview] ?? 0;
        return (
          <div key={item.label} className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 shadow-soft">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#6B7280]">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-[#18181B]">{value.toLocaleString()}</p>
            <p className="mt-3 inline-flex rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1 text-[11px] font-medium text-[#16A34A]">
              {item.change} vs last week
            </p>
          </div>
        );
      })}
    </div>
  );
}
