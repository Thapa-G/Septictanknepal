'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  phone?: string;
  logoUrl?: string | null;
  companyName?: string;
}

export default function MobileNav({
  isOpen,
  onClose,
  phone,
  logoUrl,
  companyName,
}: MobileNavProps) {
  const pathname = usePathname();
  const { company: contextCompany } = useCompany();

  const activePhone = phone || contextCompany?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const activeCompanyName = companyName || contextCompany?.company_name || DEFAULT_COMPANY.company_name;

  const navLinks = [
    { name: 'Home', href: '/', icon: 'home' },
    { name: 'Services', href: '/services', icon: 'plumbing' },
    { name: 'Gallery', href: '/gallery', icon: 'photo_library' },
    { name: 'Blog', href: '/blog', icon: 'article' },
    { name: 'Contact', href: '/contact', icon: 'contact_support' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 bg-[#f1f5f9] border-b border-[#cbd5e1] flex justify-between items-center">
          <div className="flex flex-col">
            <img
              src={logoUrl || '/images/logo.jpg'}
              alt={activeCompanyName}
              className="h-12 w-auto max-w-[170px] object-contain rounded-lg bg-white p-0.5 shadow-xs mb-1.5"
            />
            <p className="text-[12px] text-[#475569]">Professional Plumbing & Drainage</p>
          </div>
          <button onClick={onClose} className="p-1 text-[#475569] hover:text-[#0f172a]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 p-3 rounded-lg text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1d4ed8] text-white font-bold shadow-sm'
                    : 'text-[#475569] hover:bg-[#e2e8f0]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {activePhone && (
          <div className="p-4 bg-[#f1f5f9] border-t border-[#cbd5e1]">
            <a
              href={`tel:${activePhone.replace(/[^0-9+]/g, '')}`}
              className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg text-[14px] font-bold text-center block hover:bg-[#1d4ed8] transition-colors shadow-sm"
            >
              Emergency Call: {activePhone}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
