import React from 'react';

import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';

interface HeroSectionProps {
  phone?: string;
  whatsapp?: string;
}

export default function HeroSection({
  phone,
  whatsapp,
}: HeroSectionProps) {
  const { company: contextCompany } = useCompany();
  const activePhone = phone || contextCompany?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const activeWhatsapp = whatsapp || contextCompany?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;
  const activeCompanyName = contextCompany?.company_name || DEFAULT_COMPANY.company_name;

  const trustPoints = [
    { icon: 'verified', text: '10+ Years of Experience' },
    { icon: 'check_circle', text: 'Free Site Inspection' },
    { icon: 'build', text: 'Modern Cleaning Equipment' },
    { icon: 'event_available', text: '365-Day Availability' },
  ];

  return (
    <section className="w-full min-h-[700px] lg:min-h-[850px] bg-[#f8fafc] flex items-center relative pt-20 md:pt-24 pb-12 overflow-hidden border-b border-[#cbd5e1]">
      <div className="max-w-[1200px] mx-auto px-5 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text column */}
        <div className="flex flex-col justify-center">
          <h1 className="text-[32px] md:text-[48px] font-bold text-[#0f172a] leading-[1.15] tracking-tight mb-4">
            Fast, Professional Drainage Construction & Maintenance in Kathmandu Valley
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#475569] max-w-[600px] leading-relaxed mb-6">
            We provide fast and professional drainage construction and maintenance services (Including Inspection, Pumping and Cleaning) across Kathmandu Valley, helping residential and commercial properties maintain efficient, reliable drainage systems.
          </p>

          <div className="flex flex-wrap gap-3 mb-8 min-h-[56px]">
            <a
              href={`tel:${activePhone.replace(/[^0-9+]/g, '')}`}
              className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white h-14 px-8 rounded-lg flex items-center justify-center gap-2 text-[15px] font-bold transition-all shadow-sm active:scale-95 min-w-[200px]"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                call
              </span>
              <span>Call {activePhone}</span>
            </a>

            <a
              href={`https://wa.me/${activeWhatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white h-14 px-8 rounded-lg flex items-center justify-center gap-2 text-[15px] font-bold transition-all shadow-sm active:scale-95 min-w-[200px]"
            >
              <span className="material-symbols-outlined">chat</span>
              <span>Chat via WhatsApp</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-[#cbd5e1]">
            {trustPoints.map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-[#0f172a] text-[13px] font-semibold">
                <span
                  className="material-symbols-outlined text-[#1d4ed8] text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual Column */}
        <div className="relative h-[380px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-xl border border-[#cbd5e1] group">
          <img
            src="/images/cleaingservicehomepage.jpeg"
            alt="Professional drainage technician in Kathmandu"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Floating Emergency Badge */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#cbd5e1] shadow-lg flex flex-col gap-2 min-h-[110px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  warning
                </span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a]">Emergency Service</h3>
                <p className="text-[12px] text-[#475569]">Available 24/7 in Kathmandu Valley</p>
              </div>
            </div>
            <a
              href={`tel:${activePhone.replace(/[^0-9+]/g, '')}`}
              className="text-[20px] font-bold text-[#1d4ed8] hover:text-[#1e40af] text-center pt-2 border-t border-[#cbd5e1] transition-colors block"
            >
              {activePhone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
