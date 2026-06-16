import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-[#020817] text-white">
      <div className="hidden md:flex w-1/2 p-12 flex-col justify-center gap-8 bg-gradient-to-b from-[#020817] to-[#020817]">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-[#071126] flex items-center justify-center border border-[#1e293b]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h18" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6h18" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Funnel Analytics</h1>
              <p className="text-sm text-[#94a3b8]">Track customer journeys. Measure conversions.</p>
            </div>
          </div>

          <h2 className="text-3xl font-semibold mb-4">Understand your funnel</h2>
          <p className="text-[#94a3b8] mb-6">Measure drop-offs and optimize revenue with enterprise-grade analytics built for product teams.</p>

          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#2563eb] mt-2" />
              <span className="text-[#94a3b8]">Event-level analytics with flexible segmentation</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#2563eb] mt-2" />
              <span className="text-[#94a3b8]">Real-time funnel reporting</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#2563eb] mt-2" />
              <span className="text-[#94a3b8]">Secure role-based access</span>
            </li>
          </ul>
        </div>

        <div className="mt-auto flex items-center gap-4 text-sm text-[#94a3b8]">
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
            <rect x="2" y="8" width="60" height="40" rx="6" stroke="#1e293b" strokeWidth="1.5" fill="#071126" />
            <path d="M8 40L22 24L36 32L48 16" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div className="text-sm">Funnel Analytics</div>
            <div className="text-xs text-[#94a3b8]">Analytics platform for growth teams</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-[#071126] border border-[#1e293b] rounded-xl shadow-md p-8">
            {children}
          </div>

          <div className="mt-6 text-center text-sm text-[#94a3b8]">
            Don't have an account? <span className="text-[#2563eb]">Contact Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
