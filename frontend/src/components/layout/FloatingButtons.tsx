'use client';

import React from 'react';

import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';

interface FloatingButtonsProps {
  phone?: string;
  whatsapp?: string;
}

export default function FloatingButtons({
  phone,
  whatsapp,
}: FloatingButtonsProps) {
  const { company: contextCompany } = useCompany();
  const activePhone = phone || contextCompany?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const activeWhatsapp = whatsapp || contextCompany?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;

  return (
    <div className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-center">
      {/* WhatsApp Button */}
      <a
        href={activeWhatsapp ? `https://wa.me/${activeWhatsapp.replace(/[^0-9]/g, '')}` : '#'}
        target={activeWhatsapp ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 group relative"
      >
        <span className="material-symbols-outlined text-[28px] md:text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          chat
        </span>
        {/* Tooltip on hover for desktop */}
        <span className="hidden md:group-hover:block absolute right-16 bg-[#0f172a] text-white text-[12px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-md pointer-events-none transition-opacity">
          WhatsApp Us
        </span>
      </a>

      {/* Call Button */}
      <a
        href={activePhone ? `tel:${activePhone.replace(/[^0-9+]/g, '')}` : '#'}
        aria-label="Call Now"
        className="w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#0b1e3b] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 group relative border border-white/20"
      >
        <span className="material-symbols-outlined text-[28px] md:text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          call
        </span>
        {/* Tooltip on hover for desktop */}
        <span className="hidden md:group-hover:block absolute right-16 bg-[#0f172a] text-white text-[12px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-md pointer-events-none transition-opacity">
          Call Us
        </span>
      </a>
    </div>
  );
}
