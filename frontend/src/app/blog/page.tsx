'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileNav from '@/components/layout/MobileNav';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import BlogCard from '@/components/cards/BlogCard';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import BlogCatalogSchema from '@/components/seo/BlogCatalogSchema';
import { blogsService } from '@/services/blogsService';
import { categoriesService } from '@/services/categoriesService';
import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';
import { Blog, Category, PaginatedResponse } from '@/types';

export default function BlogListPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [blogsData, setBlogsData] = useState<PaginatedResponse<Blog> | null>(null);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const { company } = useCompany();

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await categoriesService.getAll();
        setCategoriesList(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      try {
        const blogsRes = await blogsService.getAll({
          page: currentPage,
          category: selectedCategory && selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
        });
        setBlogsData(blogsRes);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBlogs();
  }, [currentPage, selectedCategory, searchQuery]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const phone = company?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const whatsapp = company?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np').replace(/\/+$/, '');

  const blogsList = blogsData?.data || [];
  const featuredBlog = blogsList.find((b) => b.is_featured) || blogsList[0];
  const otherBlogs = featuredBlog ? blogsList.filter((b) => b.id !== featuredBlog.id) : blogsList;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] pb-18 md:pb-0">
      <title>Expert Plumbing, Drainage & Septic Tank Insights | Septic-Tank Nepal</title>
      <meta
        name="description"
        content="Read the latest guides, tips, and insights on plumbing, drainage, septic tank maintenance, drain cleaning, sewage management, water boring, and well construction in Kathmandu Valley."
      />
      <link rel="canonical" href={`${siteUrl}/blog`} />

      {/* OpenGraph Tags */}
      <meta property="og:title" content="Expert Plumbing, Drainage & Septic Tank Insights" />
      <meta property="og:description" content="Guides, tips, and insights on plumbing, drainage, septic tank maintenance, and sewage management in Kathmandu Valley." />
      <meta property="og:url" content={`${siteUrl}/blog`} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${siteUrl}/images/cleaingservicehomepage.jpeg`} />
      <meta property="og:site_name" content="Septic-Tank Nepal" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Expert Plumbing, Drainage & Septic Tank Insights" />
      <meta name="twitter:description" content="Read our latest guides and tips on drainage and plumbing solutions across Kathmandu Valley." />
      <meta name="twitter:image" content={`${siteUrl}/images/cleaingservicehomepage.jpeg`} />

      <LocalBusinessSchema company={company} />
      <BlogCatalogSchema blogs={blogsList} company={company} />

      {/* Navigation */}
      <Navbar />
      <MobileHeader
        onMenuToggle={() => setMobileNavOpen(true)}
      />
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <main className="max-w-[1200px] mx-auto px-5 py-8 pt-20 md:pt-24 flex-grow w-full">
        {/* Header Hero */}
        <section className="mb-10 text-center md:text-left bg-[#f1f5f9] p-8 md:p-12 rounded-2xl border border-[#cbd5e1]">
          <h1 className="text-[32px] md:text-[44px] font-bold text-[#0f172a] mb-3">
            Expert Plumbing, Drainage & Septic Tank Insights
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#475569] max-w-2xl leading-relaxed">
            Get expert tips, practical guides, and helpful insights on plumbing, drainage, septic tank maintenance, drain cleaning, sewage management, water boring, and well construction from leading Drainage and Plumbing Specialist.
          </p>

          {/* Search & Categories */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569]">
                search
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search plumbing articles..."
                className="w-full bg-white border border-[#cbd5e1] rounded-xl pl-11 pr-4 py-3 text-[14px] form-input shadow-sm"
              />
            </form>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {['All', ...categoriesList.map((c) => c.name)].map((cat) => {
                const isSelected = (cat === 'All' && !selectedCategory) || selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat === 'All' ? '' : cat);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${isSelected
                      ? 'bg-[#1d4ed8] text-white shadow-sm'
                      : 'bg-white text-[#475569] border border-[#cbd5e1] hover:bg-[#e2e8f0]'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed (8 cols) */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="space-y-6">
                <div className="bg-white border border-[#cbd5e1] rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row animate-pulse h-72">
                  <div className="md:w-1/2 bg-slate-200" />
                  <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
                      <div className="h-4 w-full bg-slate-200 rounded" />
                      <div className="h-4 w-5/6 bg-slate-200 rounded" />
                    </div>
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white border border-[#cbd5e1] rounded-2xl overflow-hidden shadow-sm h-80 flex flex-col animate-pulse">
                      <div className="h-44 w-full bg-slate-200" />
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-3">
                        <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-1/2 bg-slate-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : blogsList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#cbd5e1] p-8">
                <span className="material-symbols-outlined text-5xl text-[#64748b] mb-3">
                  search_off
                </span>
                <h3 className="text-[20px] font-bold text-[#0f172a] mb-2">No articles found</h3>
                <p className="text-[#475569] text-[14px]">
                  Try searching for a different keyword or selecting another category.
                </p>
              </div>
            ) : (
              <>
                {/* Featured / Hero First Post */}
                {featuredBlog && currentPage === 1 && !searchQuery && (
                  <BlogCard blog={featuredBlog} variant="featured" />
                )}

                {/* Grid of Remaining Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>

                {/* Pagination */}
                {blogsData && (
                  <Pagination
                    currentPage={blogsData.current_page}
                    lastPage={blogsData.last_page}
                    onPageChange={(p) => setCurrentPage(p)}
                  />
                )}
              </>
            )}
          </div>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Emergency CTA Box */}
            <div className="bg-[#0b1e3b] text-white rounded-2xl p-6 border-l-4 border-[#1d4ed8] shadow-md min-h-[190px]">
              <h3 className="text-[20px] font-bold text-white mb-2">Need Help Now?</h3>
              <p className="text-[14px] text-[#94a3b8] mb-6 leading-relaxed">
                Available 24/7 for fast plumbing emergencies in Kathmandu Valley.
              </p>
              <div className="space-y-3">
                <a
                  href={phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '#'}
                  className="w-full bg-[#1d4ed8] text-white text-[14px] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1e40af] transition-colors shadow-sm min-h-[48px]"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    call
                  </span>
                  <span>{phone ? `Call ${phone}` : 'Call Helpline'}</span>
                </a>

                <a
                  href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#'}
                  target={whatsapp ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white text-[14px] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-colors shadow-sm min-h-[48px]"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Chat via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm">
              <h3 className="text-[18px] font-bold text-[#0f172a] mb-4 border-b border-[#cbd5e1] pb-3">
                Recent Posts
              </h3>
              <ul className="flex flex-col gap-4">
                {blogsList.slice(0, 4).map((post) => (
                  <li key={post.id} className="border-b border-[#cbd5e1]/60 pb-3 last:border-0 last:pb-0">
                    <Link href={`/blog/${post.slug}`} className="group flex gap-3 items-start">
                      <span className="material-symbols-outlined text-[#64748b] group-hover:text-[#1d4ed8] transition-colors text-[20px] mt-0.5">
                        description
                      </span>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[#0f172a] group-hover:text-[#1d4ed8] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                        <span className="text-[12px] text-[#475569] mt-1 block">
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <MobileActionBar />
      <FloatingButtons />
    </div>
  );
}
