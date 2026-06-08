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
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {items.map((item) => {
        const value = overview?.[item.key as keyof AnalyticsOverview] ?? 0;
        return (
          <div key={item.label} className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-subtle hover:shadow-md transition-shadow">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#9CA3AF] font-medium">{item.label}</p>
            <p className="mt-4 text-3xl font-bold text-[#1a1a1a]">{value.toLocaleString()}</p>
            <p className="mt-3 inline-flex rounded-lg border border-[#E5E7EB] bg-[#F0F9FF] px-3 py-1 text-[11px] font-semibold text-[#16A34A]">
              {item.change} vs last week
            </p>
          </div>
        );
      })}
    </div>
  );
}
