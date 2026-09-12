'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import LoadingSpinner from '../ui/LoadingSpinner';
import { authService } from '@/services/authService';

interface AdminLayoutShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminLayoutShell({
  title,
  subtitle,
  actions,
  children,
}: AdminLayoutShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <LoadingSpinner text="Checking authentication..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <meta name="robots" content="noindex, nofollow" />
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setSidebarOpen(true)}
          actions={actions}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
