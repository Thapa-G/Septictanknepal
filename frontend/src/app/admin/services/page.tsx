'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayoutShell from '@/components/layout/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { servicesService } from '@/services/servicesService';
import { Service } from '@/types';

export default function AdminServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const loadServices = async () => {
    try {
      const res = await servicesService.getAll();
      if (Array.isArray(res)) {
        setServices(res);
      } else if (res && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete service "${title}"?`)) return;
    setDeletingId(id);
    try {
      await servicesService.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete service');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayoutShell
      title="Manage Services"
      subtitle="View, create, edit, and organize public services"
      actions={
        <Link
          href="/admin/services/create"
          className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-4 py-2.5 rounded-xl text-[14px] font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add New Service</span>
        </Link>
      }
    >
      <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
        {/* Top Controls */}
        <div className="p-5 border-b border-[#cbd5e1] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#f1f5f9]">
          <div className="relative max-w-sm w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#cbd5e1] rounded-xl pl-10 pr-3 py-2 text-[14px] form-input shadow-sm"
            />
          </div>

          <span className="text-[13px] font-semibold text-[#475569]">
            Total: {services.length} Services
          </span>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading services..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#f8fafc] text-[#475569] font-bold text-[12px] uppercase border-b border-[#cbd5e1]">
                <tr>
                  <th className="px-6 py-3.5">Cover</th>
                  <th className="px-6 py-3.5">Service Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Featured</th>
                  <th className="px-6 py-3.5">FAQs</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd5e1]">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-14 h-10 rounded-lg bg-[#e2e8f0] overflow-hidden border border-[#cbd5e1] flex items-center justify-center">
                          {service.cover_image ? (
                            <img
                              src={service.cover_image}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-sm text-slate-400">
                              {service.icon || 'image'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0f172a]">{service.title}</div>
                        <div className="text-[12px] text-[#64748b] font-mono">/{service.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        {service.category || 'Drainage'}
                      </td>
                      <td className="px-6 py-4">
                        {service.is_featured ? (
                          <span className="bg-[#dbeafe] text-[#1e40af] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                            Featured
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#64748b]">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#475569] font-semibold">
                        {service.faqs?.length || 0} Questions
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="inline-flex items-center gap-1 bg-[#0b1e3b] text-white px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-[#1d4ed8] transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(service.id, service.title)}
                          disabled={deletingId === service.id}
                          className="inline-flex items-center gap-1 bg-[#ffdad6] text-[#ba1a1a] px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-[#ba1a1a] hover:text-white transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>{deletingId === service.id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#64748b]">
                      No services match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
