import type { FunnelResponse } from '../types';

interface FunnelChartProps {
  data: FunnelResponse | null;
}

const stages = [
  { key: 'login', label: 'Login' },
  { key: 'product_view', label: 'Product View' },
  { key: 'add_to_cart', label: 'Add to Cart' },
  { key: 'checkout_started', label: 'Checkout Started' },
  { key: 'purchase', label: 'Purchase' },
];

export default function FunnelChart({ data }: FunnelChartProps) {
  const values = stages.map((stage) => ({
    ...stage,
    value: data?.[stage.key as keyof FunnelResponse] ?? 0,
  }));

  const maxValue = Math.max(...values.map((stage) => stage.value), 1);

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-subtle">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9CA3AF] font-medium">Funnel</p>
          <h2 className="mt-1 text-2xl font-bold text-[#1a1a1a]">Conversion Journey</h2>
        </div>
        <p className="text-sm text-[#9CA3AF]">Live event counts across the primary funnel</p>
      </div>

      <div className="space-y-5">
        {values.map((stage, index) => {
          const previousValue = index === 0 ? stage.value : values[index - 1].value;
          const conversion = previousValue > 0 ? Math.round((stage.value / previousValue) * 100) : 0;
          const width = stage.value > 0 ? Math.max((stage.value / maxValue) * 100, 2) : 0;

          return (
            <div key={stage.key} className="space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold text-[#1a1a1a]">
                <span>{stage.label}</span>
                <span className="text-sm font-medium text-[#9CA3AF]">
                  {stage.value.toLocaleString()} · {conversion}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-[#D1D5DB] bg-[#F9FAFB]">
                <div
                  className="h-full rounded-full bg-[#D1D5DB] transition-all duration-300"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
