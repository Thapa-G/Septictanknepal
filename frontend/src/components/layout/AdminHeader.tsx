'use client';

import React from 'react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  onMenuToggle,
  actions,
}: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-[#cbd5e1] sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-[#475569] hover:bg-[#e2e8f0] rounded-lg lg:hidden"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <div>
          <h1 className="text-[20px] md:text-[24px] font-bold text-[#0f172a] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-[#475569] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
