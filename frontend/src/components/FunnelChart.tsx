import {
  Cell,
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { FunnelResponse } from '../types';

interface FunnelChartProps {
  data: FunnelResponse | null;
}

const funnelData = (data: FunnelResponse | null) => [
  { name: 'login', value: data?.login ?? 0 },
  { name: 'product_view', value: data?.product_view ?? 0 },
  { name: 'add_to_cart', value: data?.add_to_cart ?? 0 },
  { name: 'checkout_started', value: data?.checkout_started ?? 0 },
  { name: 'purchase', value: data?.purchase ?? 0 },
];

export default function FunnelChart({ data }: FunnelChartProps) {
  const chartData = funnelData(data);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">Funnel</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Conversion journey</h2>
        </div>
        <p className="text-sm text-slate-300">Live event counts across the primary funnel</p>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsFunnelChart>
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Funnel dataKey="value" data={chartData} isAnimationActive>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={['#67e8f9', '#22d3ee', '#38bdf8', '#818cf8', '#f59e0b'][index]} />
              ))}
              <LabelList position="right" fill="#e2e8f0" dataKey="name" />
              <LabelList position="insideLeft" fill="#020617" dataKey="value" />
            </Funnel>
          </RechartsFunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
