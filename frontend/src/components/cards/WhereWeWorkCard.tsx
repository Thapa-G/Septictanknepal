import React from 'react';

interface WhereWeWorkCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function WhereWeWorkCard({ icon, title, description }: WhereWeWorkCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1] hover:border-[#1d4ed8] transition-all group shadow-sm hover:shadow-md">
      <div className="w-12 h-12 rounded-xl bg-[#1d4ed8] text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-[26px]">{icon}</span>
      </div>
      <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">{title}</h3>
      <p className="text-[#475569] text-[14px] leading-relaxed">{description}</p>
    </div>
  );
}
