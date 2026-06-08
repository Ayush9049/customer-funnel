import type { FunnelResponse } from '../types';

interface FunnelChartProps {
  data: FunnelResponse | null;
}

const stages = [
  { key: 'login', label: 'Login', opacity: 1.0 },
  { key: 'product_view', label: 'Product View', opacity: 0.8 },
  { key: 'add_to_cart', label: 'Add to Cart', opacity: 0.6 },
  { key: 'checkout_started', label: 'Checkout Started', opacity: 0.4 },
  { key: 'purchase', label: 'Purchase', opacity: 0.2 },
];

export default function FunnelChart({ data }: FunnelChartProps) {
  const values = stages.map((stage) => ({
    ...stage,
    value: data?.[stage.key as keyof FunnelResponse] ?? 0,
  }));

  const maxValue = Math.max(...values.map((stage) => stage.value), 1);

  return (
    <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-6 shadow-soft">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#6B7280]">Funnel</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#18181B]">Conversion journey</h2>
        </div>
        <p className="text-sm text-slate-500">Live event counts across the primary funnel</p>
      </div>

      <div className="space-y-5">
        {values.map((stage, index) => {
          const previousValue = index === 0 ? stage.value : values[index - 1].value;
          const conversion = previousValue > 0 ? Math.round((stage.value / previousValue) * 100) : 0;
          const width = Math.max((stage.value / maxValue) * 100, 4);

          return (
            <div key={stage.key} className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-[#18181B]">
                <span>{stage.label}</span>
                <span className="text-sm font-normal text-slate-500">
                  {stage.value.toLocaleString()} · {conversion}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#F3F4F6]">
                <div
                  className="h-full rounded-full bg-[#2563EB]"
                  style={{ width: `${width}%`, opacity: stage.opacity }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
