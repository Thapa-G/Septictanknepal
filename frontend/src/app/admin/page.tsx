'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayoutShell from '@/components/layout/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { companyService } from '@/services/companyService';
import { contactService } from '@/services/contactService';
import { AdminStats, ContactMessage, PaginatedResponse } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [messagesData, setMessagesData] = useState<PaginatedResponse<ContactMessage> | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, messagesRes] = await Promise.all([
          companyService.getAdminStats(),
          contactService.getMessages(1),
        ]);
        setStats(statsRes);
        setMessagesData(messagesRes);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    setMarkingId(id);
    try {
      await contactService.markAsRead(id);
      setMessagesData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
        };
      });
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          unread_inquiries: Math.max(0, prev.unread_inquiries - 1),
        };
      });
    } catch (err) {
      console.error('Error marking message read:', err);
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <AdminLayoutShell
      title="Dashboard Overview"
      subtitle="Real-time performance metrics and customer inquiries"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/services/create"
            className="bg-[#0b1e3b] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Service</span>
          </Link>
          <Link
            href="/admin/blogs/create"
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-4 py-2 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Blog Post</span>
          </Link>
        </div>
      }
    >
      {loading ? (
        <LoadingSpinner text="Loading dashboard statistics..." />
      ) : (
        <div className="space-y-8">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Services */}
            <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">
                  Active Services
                </p>
                <h3 className="text-[32px] font-bold text-[#0f172a] mt-1">
                  {stats?.total_services || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#dbeafe] text-[#1e40af] flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">plumbing</span>
              </div>
            </div>

            {/* Total Blogs */}
            <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">
                  Published Posts
                </p>
                <h3 className="text-[32px] font-bold text-[#0f172a] mt-1">
                  {stats?.total_blogs || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#dbeafe] text-[#1e40af] flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">article</span>
              </div>
            </div>

            {/* Total Messages */}
            <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">
                  Total Inquiries
                </p>
                <h3 className="text-[32px] font-bold text-[#0f172a] mt-1">
                  {stats?.total_inquiries || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#f1f5f9] text-[#0f172a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">mail</span>
              </div>
            </div>

            {/* Unread Inquiries */}
            <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">
                  Pending Actions
                </p>
                <h3 className="text-[32px] font-bold text-[#ba1a1a] mt-1">
                  {stats?.unread_inquiries || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">mark_chat_unread</span>
              </div>
            </div>
          </div>

          {/* Recent Inquiries Table */}
          <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#cbd5e1] flex justify-between items-center">
              <div>
                <h2 className="text-[18px] font-bold text-[#0f172a]">
                  Recent Customer Inquiries
                </h2>
                <p className="text-[13px] text-[#475569] mt-0.5">
                  Submissions from the public contact & service booking form
                </p>
              </div>
              <span className="bg-[#f1f5f9] text-[#475569] text-[12px] font-bold px-3 py-1 rounded-full border border-[#cbd5e1]">
                {messagesData?.total || 0} Total Messages
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-[#f1f5f9] text-[#475569] font-bold text-[12px] uppercase border-b border-[#cbd5e1]">
                  <tr>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Customer Name</th>
                    <th className="px-6 py-3.5">Phone Number</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Service</th>
                    <th className="px-6 py-3.5">Message / Details</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cbd5e1]">
                  {messagesData?.data && messagesData.data.length > 0 ? (
                    messagesData.data.map((msg) => (
                      <tr
                        key={msg.id}
                        className={`hover:bg-[#f8fafc] transition-colors ${
                          !msg.is_read ? 'bg-[#ffdad6]/20 font-semibold' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          {msg.is_read ? (
                            <span className="inline-flex items-center gap-1 text-[#475569] text-[12px]">
                              <span className="w-2 h-2 rounded-full bg-[#94a3b8]" />
                              <span>Read</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#ba1a1a] text-[12px] font-bold">
                              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
                              <span>New</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#0f172a] font-bold whitespace-nowrap">
                          {msg.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`tel:${msg.phone.replace(/[^0-9+]/g, '')}`}
                            className="text-[#1d4ed8] hover:underline font-mono font-bold"
                          >
                            {msg.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-[#475569] whitespace-nowrap">
                          {msg.location || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-[#dbeafe] text-[#1e40af] px-2.5 py-1 rounded-md text-[12px] font-medium">
                            {msg.service_needed || 'General Inquiry'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#475569] max-w-xs truncate">
                          {msg.message || '—'}
                        </td>
                        <td className="px-6 py-4 text-[#64748b] text-[12px] whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {!msg.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(msg.id)}
                              disabled={markingId === msg.id}
                              className="text-[12px] bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg hover:bg-[#1e40af] transition-colors disabled:opacity-50 font-bold shadow-sm"
                            >
                              {markingId === msg.id ? 'Marking...' : 'Mark as Read'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-[#64748b]">
                        No customer messages received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutShell>
  );
}
