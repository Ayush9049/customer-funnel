import type { ModularFunnelData } from '../types';
import { formatEventName } from '../utils/format';

interface ModularFunnelWidgetProps {
  data: ModularFunnelData;
}

export default function ModularFunnelWidget({ data }: ModularFunnelWidgetProps) {
  const { name, stages, kpis } = data;

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-lg font-bold text-[#F8FAFC]">{name}</h3>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF]">Total Events</span>
          <span className="text-lg font-extrabold text-[#F8FAFC] mt-1.5">{kpis.total_events.toLocaleString()}</span>
        </div>
        <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF]">Unique Users</span>
          <span className="text-lg font-extrabold text-[#F8FAFC] mt-1.5">{kpis.unique_users.toLocaleString()}</span>
        </div>
        <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF]">Lost Users</span>
          <span className="text-lg font-extrabold text-rose-400 mt-1.5">{kpis.lost_users.toLocaleString()}</span>
        </div>
      </div>

      {/* Stages Funnel List */}
      <div className="space-y-4">
        {stages.map((stage, idx) => {
          const prevStage = idx > 0 ? stages[idx - 1] : null;
          const stageConversion = prevStage && prevStage.count > 0 
            ? Math.round((stage.count / prevStage.count) * 100) 
            : 100;
          const dropOff = prevStage ? Math.max(0, prevStage.count - stage.count) : 0;
          const widthPercentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;

          return (
            <div key={stage.event_name} className="relative">
              {/* Drop-off connector line indicator */}
              {idx > 0 && dropOff > 0 && (
                <div className="pl-4 py-1.5 flex items-center gap-2 text-xs font-semibold text-rose-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                  <span>Lost {dropOff.toLocaleString()} users ({100 - stageConversion}% drop)</span>
                </div>
              )}
              {idx > 0 && dropOff === 0 && (
                <div className="pl-4 py-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>100% Retained</span>
                </div>
              )}

              {/* Stage Content */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 hover:bg-slate-800 transition-colors duration-150">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="font-bold text-[#F8FAFC] flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-[#F8FAFC] text-[10px] font-extrabold">
                      {idx + 1}
                    </span>
                    {formatEventName(stage.event_name)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-[#9CA3AF] block font-medium">Events</span>
                      <span className="font-extrabold text-[#F8FAFC] text-sm">{stage.count.toLocaleString()}</span>
                    </div>
                    <div className="text-right border-l border-slate-800 pl-3">
                      <span className="text-xs text-[#9CA3AF] block font-medium">Users</span>
                      <span className="font-extrabold text-[#F8FAFC] text-sm">{stage.unique_users.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Bar display */}
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(widthPercentage, 1)}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
