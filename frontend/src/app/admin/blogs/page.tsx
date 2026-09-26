'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayoutShell from '@/components/layout/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';
import { blogsService } from '@/services/blogsService';
import { Blog, PaginatedResponse } from '@/types';

export default function AdminBlogsListPage() {
  const [blogsData, setBlogsData] = useState<PaginatedResponse<Blog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogsService.getAll({
        page: currentPage,
        search: search || undefined,
        per_page: 10,
      });
      setBlogsData(res);
    } catch (err) {
      console.error('Error loading blogs for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [currentPage, search]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete post "${title}"?`)) return;
    setDeletingId(id);
    try {
      await blogsService.delete(id);
      loadBlogs();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete blog post');
    } finally {
      setDeletingId(null);
    }
  };

  const blogsList = blogsData?.data || [];

  return (
    <AdminLayoutShell
      title="Manage Blog Posts"
      subtitle="Publish guides, emergency drainage advice, and news"
      actions={
        <Link
          href="/admin/blogs/create"
          className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-4 py-2.5 rounded-xl text-[14px] font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add New Post</span>
        </Link>
      }
    >
      <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
        {/* Top Filter Bar */}
        <div className="p-5 border-b border-[#cbd5e1] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#f1f5f9]">
          <div className="relative max-w-sm w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-[#cbd5e1] rounded-xl pl-10 pr-3 py-2 text-[14px] form-input shadow-sm"
            />
          </div>

          <span className="text-[13px] font-semibold text-[#475569]">
            Total: {blogsData?.total || 0} Articles
          </span>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading articles..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#f8fafc] text-[#475569] font-bold text-[12px] uppercase border-b border-[#cbd5e1]">
                <tr>
                  <th className="px-6 py-3.5">Cover</th>
                  <th className="px-6 py-3.5">Article Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Author</th>
                  <th className="px-6 py-3.5">Featured</th>
                  <th className="px-6 py-3.5">Published Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd5e1]">
                {blogsList.length > 0 ? (
                  blogsList.map((blog) => (
                    <tr key={blog.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-14 h-10 rounded-lg bg-[#e2e8f0] overflow-hidden border border-[#cbd5e1] flex items-center justify-center">
                          {blog.cover_image ? (
                            <img
                              src={blog.cover_image}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-sm text-slate-400">
                              article
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0f172a] max-w-sm line-clamp-1">{blog.title}</div>
                        <div className="text-[12px] text-[#64748b] font-mono">/{blog.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        {blog.category ? (
                          <span className="bg-[#dbeafe] text-[#1e40af] px-2.5 py-1 rounded-md text-[12px] font-bold">
                            {blog.category}
                          </span>
                        ) : (
                          <span className="text-[#64748b] italic text-[12px]">
                            No Category
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#475569] whitespace-nowrap">
                        {blog.author}
                      </td>
                      <td className="px-6 py-4">
                        {blog.is_featured ? (
                          <span className="bg-[#dbeafe] text-[#1e40af] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                            Featured
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#64748b]">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#64748b] text-[12px] whitespace-nowrap">
                        {new Date(blog.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="inline-flex items-center gap-1 bg-[#0b1e3b] text-white px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-[#1d4ed8] transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
                          disabled={deletingId === blog.id}
                          className="inline-flex items-center gap-1 bg-[#ffdad6] text-[#ba1a1a] px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-[#ba1a1a] hover:text-white transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>{deletingId === blog.id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#64748b]">
                      No blog posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {blogsData && blogsData.last_page > 1 && (
          <div className="p-4 border-t border-[#cbd5e1] flex justify-center">
            <Pagination
              currentPage={blogsData.current_page}
              lastPage={blogsData.last_page}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
