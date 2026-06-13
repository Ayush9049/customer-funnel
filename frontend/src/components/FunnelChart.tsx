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

  // Calculate drop-offs between stages
  const dropOffs = values.map((stage, index) => {
    if (index === 0) return 0;
    return Math.max(values[index - 1].value - stage.value, 0);
  });

  // Find highest drop-off
  const highestDropOffIndex = dropOffs.indexOf(Math.max(...dropOffs));
  const highestDropOffStage = highestDropOffIndex > 0 
    ? `${stages[highestDropOffIndex - 1].label} → ${stages[highestDropOffIndex].label}`
    : null;

  // Calculate total lost users
  const totalLost = dropOffs.reduce((sum, d) => sum + d, 0);

  // Calculate overall conversion (first to last stage)
  const overallConversion = values[0].value > 0 
    ? Math.round((values[values.length - 1].value / values[0].value) * 100)
    : 0;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 shadow-subtle">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9CA3AF] font-medium">Funnel</p>
          <h2 className="mt-1 text-2xl font-bold text-[#F8FAFC]">Conversion Journey</h2>
        </div>
        <p className="text-sm text-[#9CA3AF]">Live event counts across the primary funnel</p>
      </div>

      <div className="space-y-5">
        {values.map((stage, index) => {
          const previousValue = index === 0 ? stage.value : values[index - 1].value;
          const conversion = previousValue > 0 ? Math.round((stage.value / previousValue) * 100) : 0;
          const width = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
          const dropOff = dropOffs[index];

          return (
            <div key={stage.key}>
              {/* Stage row with count and conversion % */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-[#F8FAFC]">
                  <span>{stage.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#F8FAFC]">{stage.value.toLocaleString()}</span>
                    {index > 0 && (
                      <span title="Conversion from previous step" className="text-xs font-medium text-[#9CA3AF] bg-slate-900 px-2 py-1 rounded">
                        {conversion}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 overflow-hidden rounded-full border border-slate-800 bg-slate-900">
                  <div
                    className="h-full rounded-full bg-slate-500 transition-all duration-300"
                    style={{ width: `${Math.max(width, 1)}%` }}
                  />
                </div>
              </div>

              {/* Drop-off indicator */}
              {dropOff > 0 && index < values.length - 1 && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#9CA3AF]">
                  <span>↓ Lost {dropOff} {dropOff === 1 ? 'user' : 'users'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel insights footer */}
      {values[0].value > 0 && (
        <div className="mt-8 border-t border-slate-800 pt-6 space-y-3">
          <div className="text-xs font-medium text-[#9CA3AF] uppercase tracking-[0.24em]">Funnel Insights</div>
          <div className="grid gap-4 sm:grid-cols-3">
            {highestDropOffStage && (
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3">
                <p className="text-xs text-[#9CA3AF] mb-1">Highest Drop-off</p>
                <p className="text-sm font-semibold text-[#F8FAFC]">{highestDropOffStage}</p>
              </div>
            )}
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-3">
              <p className="text-xs text-[#9CA3AF] mb-1">Lost Users</p>
              <p className="text-sm font-semibold text-[#F8FAFC]">{totalLost}</p>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-3">
              <p className="text-xs text-[#9CA3AF] mb-1">Overall Conversion</p>
              <p className="text-sm font-semibold text-[#F8FAFC]">{overallConversion}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
