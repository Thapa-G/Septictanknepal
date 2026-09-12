'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Manage Services', href: '/admin/services', icon: 'plumbing' },
    { name: 'Manage Blogs', href: '/admin/blogs', icon: 'article' },
    { name: 'Photo Gallery', href: '/admin/gallery', icon: 'photo_library' },
    { name: 'Company Details', href: '/admin/company', icon: 'storefront' },
  ];

  const handleLogout = async () => {
    await authService.logout();
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0b1e3b] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-[#334155] flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <img
                src="/images/logo.jpg"
                alt="Septic-Tank Nepal"
                className="h-9 w-auto max-w-[120px] object-contain rounded-md bg-white p-0.5 shadow-xs"
              />
              <div>
                <div className="font-bold text-[15px] text-white leading-tight">Admin Console</div>
                <div className="text-[11px] text-[#94a3b8]">Septic-Tank Nepal</div>
              </div>
            </Link>
            <button onClick={onClose} className="p-1 text-[#94a3b8] hover:text-white lg:hidden">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#1d4ed8] text-white shadow-sm'
                      : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#334155] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>View Live Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] text-[#fca5a5] hover:text-white hover:bg-[#ba1a1a]/20 transition-colors font-medium text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
