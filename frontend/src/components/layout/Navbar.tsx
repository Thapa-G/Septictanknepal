'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';

interface NavbarProps {
  phone?: string;
  whatsapp?: string;
  logoUrl?: string | null;
  companyName?: string;
}

export default function Navbar({
  phone,
  whatsapp,
  logoUrl,
  companyName,
}: NavbarProps) {
  const pathname = usePathname();
  const { company: contextCompany } = useCompany();

  const activePhone = phone || contextCompany?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const activeWhatsapp = whatsapp || contextCompany?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;
  const activeCompanyName = companyName || contextCompany?.company_name || DEFAULT_COMPANY.company_name;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 w-full z-50 bg-[#1e3a8a] backdrop-blur-md border-b border-[#1e40af] shadow-md">
      <div className="max-w-[1200px] w-full mx-auto px-5 h-16 flex justify-between items-center">
        {/* Brand Logo */}
        <Link
          href="/"
          className="hover:opacity-90 transition-opacity flex items-center gap-2.5 py-1 min-h-[52px]"
        >
          <img
            src={logoUrl || '/images/logo.jpg'}
            alt={activeCompanyName}
            className="h-13 w-auto max-w-[220px] object-contain rounded-lg bg-white p-0.5 shadow-sm"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-2 text-[14px] font-semibold items-center">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-all duration-200 px-3.5 py-1.5 rounded-lg ${isActive
                    ? 'bg-white/20 text-white font-bold shadow-sm'
                    : 'text-blue-50 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Contact & WhatsApp CTA */}
        <div className="flex gap-4 items-center min-w-[280px] justify-end">
          <a
            href={`tel:${activePhone.replace(/[^0-9+]/g, '')}`}
            className="text-[14px] font-semibold text-white hover:text-blue-100 transition-colors flex items-center gap-1.5 whitespace-nowrap min-w-[130px]"
          >
            <span className="material-symbols-outlined text-white text-[18px]">
              call
            </span>
            <span>{activePhone}</span>
          </a>

          <a
            href={`https://wa.me/${activeWhatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-4 py-2 rounded-xl text-[14px] font-bold hover:bg-[#20ba5a] transition-all flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 border border-white/20 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Chat via WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
