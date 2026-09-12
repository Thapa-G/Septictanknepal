import React from 'react';

import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';

interface WhatsAppCtaSectionProps {
  whatsapp?: string;
  phone?: string;
}

export default function WhatsAppCtaSection({
  whatsapp,
  phone,
}: WhatsAppCtaSectionProps) {
  const { company: contextCompany } = useCompany();
  const activePhone = phone || contextCompany?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const activeWhatsapp = whatsapp || contextCompany?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;

  return (
    <section className="w-full bg-[#f1f5f9] border-t border-b border-[#cbd5e1] py-16">
      <div className="max-w-[1200px] mx-auto px-5 text-center">
        <h2 className="text-[28px] md:text-[40px] font-bold text-[#0f172a] mb-2">
          Ready to Solve Your Drain Problems?
        </h2>
        <p className="text-[20px] font-bold text-[#1d4ed8] mb-4">
          Talk and Book Now via WhatsApp
        </p>
        <p className="text-[16px] text-[#475569] max-w-[700px] mx-auto mb-8 leading-relaxed">
          Get instant professional advice and schedule your service in minutes. Our rapid response team is standing by to help you with any drainage or plumbing emergency across Kathmandu Valley.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={activeWhatsapp ? `https://wa.me/${activeWhatsapp.replace(/[^0-9]/g, '')}` : '#'}
            target={activeWhatsapp ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white h-16 px-10 rounded-xl flex items-center justify-center gap-3 text-[16px] font-bold transition-all shadow-lg hover:scale-105 active:scale-95 min-w-[240px]"
          >
            <span className="material-symbols-outlined text-[24px]">chat</span>
            <span>Book Now via WhatsApp</span>
          </a>

          <a
            href={activePhone ? `tel:${activePhone.replace(/[^0-9+]/g, '')}` : '#'}
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white h-16 px-8 rounded-xl flex items-center justify-center gap-2 text-[16px] font-bold transition-all shadow-md hover:scale-105 active:scale-95 min-w-[200px]"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              call
            </span>
            <span>{activePhone ? `Call ${activePhone}` : 'Call Directly'}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
