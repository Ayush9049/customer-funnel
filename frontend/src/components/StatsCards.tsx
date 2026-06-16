import type { AnalyticsOverview } from '../types';

interface StatsCardsProps {
  overview: AnalyticsOverview | null;
}

const items = [
  { label: 'Total Events', key: 'total_events' },
  { label: 'Unique Users', key: 'unique_users', change: '+8%' },
  { label: 'Purchases', key: 'purchases', change: '+5%' },
];

export default function StatsCards({ overview }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {items.map((item) => {
        const value = overview?.[item.key as keyof AnalyticsOverview] ?? 0;
        return (
          <div key={item.label} className="rounded-[28px] border border-[#DDD3C6] bg-[#FFFDF9] p-6 shadow-soft hover:shadow-md transition-shadow">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#6F665E] font-medium">{item.label}</p>
            <p className="mt-4 text-3xl font-bold text-[#3E362E]">{value.toLocaleString()}</p>
            {item.change ? <span className="mt-2 inline-flex text-sm text-[#7A9E7E] font-semibold">{item.change}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
