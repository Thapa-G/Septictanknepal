'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';
import { servicesService } from '@/services/servicesService';
import { Service } from '@/types';

interface FooterProps {
  phone?: string;
  whatsapp?: string;
  address?: string;
  logoUrl?: string | null;
  companyName?: string;
}

export default function Footer({
  phone,
  whatsapp,
  address,
  logoUrl,
  companyName,
}: FooterProps) {
  const { company: contextCompany } = useCompany();
  const [services, setServices] = useState<Service[]>([]);

  const activePhone = phone || contextCompany?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const activeWhatsapp = whatsapp || contextCompany?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;
  const activeAddress = address || contextCompany?.address || DEFAULT_COMPANY.address;
  const activeCompanyName = companyName || contextCompany?.company_name || DEFAULT_COMPANY.company_name;

  useEffect(() => {
    let isMounted = true;
    async function loadFooterServices() {
      try {
        const res = await servicesService.getAll({ per_page: 5 });
        if (isMounted) {
          if (Array.isArray(res)) {
            setServices(res.slice(0, 5));
          } else if (res && (res as any).data) {
            setServices((res as any).data.slice(0, 5));
          }
        }
      } catch (err) {
        console.error('Failed to load footer dynamic services:', err);
      }
    }
    loadFooterServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="bg-[#1e3a8a] text-white w-full py-12 px-5 mt-auto border-t border-[#1e40af] shadow-inner">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="inline-block mb-4 min-h-[64px]">
            <img
              src={'/images/logo.jpg'}
              alt={activeCompanyName}
              className="h-16 md:h-20 w-auto max-w-[240px] object-contain rounded-xl bg-white p-1 shadow-md"
            />
          </Link>
          <p className="text-blue-100 text-sm leading-relaxed">
            Professional Plumbing &amp; Drainage solutions across Kathmandu Valley. Fast, reliable, and hygienic waste management.
          </p>
        </div>

        <div className="col-span-1">
          <h4 className="font-bold text-white mb-4 text-[16px]">Services</h4>
          <ul className="flex flex-col gap-2 text-sm">
            {services.length > 0 ? (
              services.map((srv) => (
                <li key={srv.id}>
                  <Link
                    href={`/services/${srv.slug || srv.id}`}
                    className="text-blue-100 hover:text-white hover:underline transition-colors line-clamp-1"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li>
                  <Link href="/services" className="text-blue-100 hover:text-white hover:underline transition-colors">
                    Drain & Pipe Cleaning
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-blue-100 hover:text-white hover:underline transition-colors">
                    Sewer Line Cleaning
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-blue-100 hover:text-white hover:underline transition-colors">
                    Septic Tank Pumping
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-blue-100 hover:text-white hover:underline transition-colors">
                    Hydro Jetting
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="font-bold text-white mb-4 text-[16px]">Quick Links</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/" className="text-blue-100 hover:text-white hover:underline transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-blue-100 hover:text-white hover:underline transition-colors">
                All Services
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-blue-100 hover:text-white hover:underline transition-colors">
                Photo Gallery
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-blue-100 hover:text-white hover:underline transition-colors">
                Plumbing Insights &amp; Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-blue-100 hover:text-white hover:underline transition-colors">
                Contact &amp; Booking
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="font-bold text-white mb-4 text-[16px]">Contact</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-blue-100">
            <li className="flex items-center gap-2 min-h-[22px]">
              <span className="material-symbols-outlined text-[18px] text-white">location_on</span>
              <span>{activeAddress}</span>
            </li>
            <li className="flex items-center gap-2 min-h-[22px]">
              <span className="material-symbols-outlined text-[18px] text-white">call</span>
              <a
                href={`tel:${activePhone.replace(/[^0-9+]/g, '')}`}
                className="hover:text-white hover:underline transition-colors font-semibold"
              >
                {activePhone}
              </a>
            </li>
            <li className="flex items-center gap-2 min-h-[22px]">
              <span className="material-symbols-outlined text-[18px] text-[#25D366]">chat</span>
              <a
                href={`https://wa.me/${activeWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-green-300 transition-colors font-medium"
              >
                24/7 WhatsApp: {activeWhatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2 min-h-[22px]">
              <span className="material-symbols-outlined text-[18px] text-white">mail</span>
              <a
                href="mailto:nepalseptictank@gmail.com"
                className="hover:text-white hover:underline transition-colors break-all"
              >
                nepalseptictank@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto mt-8 pt-4 border-t border-white/20 text-center flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-blue-100">
        <p>© 2026 {activeCompanyName}. All rights reserved.</p>
        <Link href="/admin/login" className="text-[12px] text-blue-200 hover:text-white transition-colors">
          Admin Portal
        </Link>
      </div>
    </footer>
  );
}

