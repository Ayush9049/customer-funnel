import type { AnalyticsOverview } from '../types';

interface StatsCardsProps {
  overview: AnalyticsOverview | null;
}

const cardStyles = [
  'from-cyan-500/20 to-cyan-400/5 border-cyan-400/25',
  'from-amber-500/20 to-amber-400/5 border-amber-400/25',
  'from-rose-500/20 to-rose-400/5 border-rose-400/25',
];

export default function StatsCards({ overview }: StatsCardsProps) {
  const items = [
    { label: 'Total Events', value: overview?.total_events ?? 0 },
    { label: 'Unique Users', value: overview?.unique_users ?? 0 },
    { label: 'Purchases', value: overview?.purchases ?? 0 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`rounded-3xl border bg-gradient-to-br ${cardStyles[index]} p-5 shadow-glow backdrop-blur`}
        >
          <p className="text-sm uppercase tracking-[0.24em] text-slate-300">{item.label}</p>
          <p className="mt-3 text-4xl font-semibold text-white">{item.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
