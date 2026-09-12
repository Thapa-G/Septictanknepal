'use client';

import React from 'react';
import Link from 'next/link';

import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';

interface MobileActionBarProps {
  phone?: string;
  whatsapp?: string;
}

export default function MobileActionBar({
  phone,
  whatsapp,
}: MobileActionBarProps) {
  const { company: contextCompany } = useCompany();
  const activePhone = phone || contextCompany?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const activeWhatsapp = whatsapp || contextCompany?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 grid grid-cols-3 items-center px-4 pb-2 pt-2 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.1)] bg-[#f8fafc]/95 backdrop-blur-md h-18 border-t border-[#cbd5e1] rounded-t-xl">
      <a
        href={activePhone ? `tel:${activePhone.replace(/[^0-9+]/g, '')}` : '#'}
        className="flex flex-col items-center justify-center text-[#475569] hover:text-[#1d4ed8] active:bg-[#e2e8f0] rounded-xl px-2 py-1 text-[12px] font-medium transition-colors"
      >
        <span className="material-symbols-outlined text-[24px] text-[#1d4ed8]" style={{ fontVariationSettings: "'FILL' 1" }}>
          call
        </span>
        <span>Call</span>
      </a>

      <a
        href={activeWhatsapp ? `https://wa.me/${activeWhatsapp.replace(/[^0-9]/g, '')}` : '#'}
        target={activeWhatsapp ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center bg-[#25D366] text-white rounded-xl px-3 py-1.5 text-[12px] font-bold active:opacity-90 shadow-sm transition-all mx-1"
      >
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          chat
        </span>
        <span>WhatsApp</span>
      </a>

      <Link
        href="/contact"
        className="flex flex-col items-center justify-center text-[#475569] hover:text-[#1d4ed8] active:bg-[#e2e8f0] rounded-xl px-2 py-1 text-[12px] font-medium transition-colors"
      >
        <span className="material-symbols-outlined text-[24px]">
          event_available
        </span>
        <span>Request</span>
      </Link>
    </nav>
  );
}
