'use client';

import React from 'react';
import Link from 'next/link';

import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  logoUrl?: string | null;
  companyName?: string;
}

export default function MobileHeader({
  onMenuToggle,
  logoUrl,
  companyName,
}: MobileHeaderProps) {
  const { company: contextCompany } = useCompany();
  const activeCompanyName = companyName || contextCompany?.company_name || DEFAULT_COMPANY.company_name;

  return (
    <header className="md:hidden fixed top-0 w-full z-40 bg-[#1e3a8a] h-16 flex items-center justify-between px-4 border-b border-[#1e40af] shadow-md">
      <button
        onClick={onMenuToggle}
        className="p-2 text-white hover:bg-white/15 rounded-xl transition-colors"
        aria-label="Open Menu"
      >
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>

      <Link href="/" className="flex items-center gap-2 min-h-[48px]">
        <img
          src={'/images/logo.jpg'}
          alt={activeCompanyName}
          className="h-12 w-auto max-w-[170px] object-contain rounded-lg bg-white p-0.5 shadow-sm"
        />
      </Link>

      <div className="w-8" />
    </header>
  );
}
