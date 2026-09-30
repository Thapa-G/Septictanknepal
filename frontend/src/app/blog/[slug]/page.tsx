'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileNav from '@/components/layout/MobileNav';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import RichTextRenderer from '@/components/ui/RichTextRenderer';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import BlogDetailSchema from '@/components/seo/BlogDetailSchema';
import { blogsService } from '@/services/blogsService';
import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';
import { Blog } from '@/types';

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [recentPosts, setRecentPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { company } = useCompany();

  useEffect(() => {
    async function loadBlog() {
      try {
        const blogRes = await blogsService.getBySlug(slug);
        setBlog(blogRes.blog);
        setRecentPosts(blogRes.recent_posts || []);
      } catch (err: unknown) {
        console.error('Error loading blog post:', err);
        setError('Blog post not found or unable to load.');
      } finally {
        setLoading(false);
      }
    }

    loadBlog();
  }, [slug]);

  const phone = company?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const whatsapp = company?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-24">
          <LoadingSpinner text="Loading article..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar phone={phone} whatsapp={whatsapp} />
        <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-16 px-5 text-center">
          <span className="material-symbols-outlined text-[64px] text-[#ba1a1a] mb-4">article</span>
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">Article Not Found</h1>
          <p className="text-[#475569] mb-6">{error || 'The requested article does not exist.'}</p>
          <Link
            href="/blog"
            className="bg-[#0b1e3b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors"
          >
            View All Articles
          </Link>
        </main>
        <Footer phone={phone} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Dynamic SEO */}
      <title>{blog.meta_title || `${blog.title} | Septic-Tank Nepal`}</title>
      <meta name="description" content={blog.meta_description || blog.excerpt || ''} />
      {blog.meta_keywords && <meta name="keywords" content={blog.meta_keywords} />}
      <link rel="canonical" href={blog.canonical_url || `https://omganeshayasarsafai.com.np/blog/${slug}`} />

      {/* OpenGraph Protocol */}
      <meta property="og:title" content={blog.title} />
      <meta property="og:description" content={blog.excerpt || blog.meta_description || ''} />
      {blog.cover_image && (
        <meta property="og:image" content={blog.cover_image} />
      )}
      {(blog.cover_image_alt || blog.title) && (
        <meta property="og:image:alt" content={blog.cover_image_alt || blog.title} />
      )}
      <meta property="og:type" content="article" />
      {blog.published_at && <meta property="article:published_time" content={blog.published_at} />}
      {blog.author && <meta property="article:author" content={blog.author} />}
      {blog.category && <meta property="article:section" content={blog.category} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={blog.title} />
      <meta name="twitter:description" content={blog.excerpt || blog.meta_description || ''} />
      {blog.cover_image && (
        <meta name="twitter:image" content={blog.cover_image} />
      )}
      {(blog.cover_image_alt || blog.title) && (
        <meta name="twitter:image:alt" content={blog.cover_image_alt || blog.title} />
      )}

      {/* Structured Data Schemas */}
      <LocalBusinessSchema company={company} />
      <BlogDetailSchema blog={blog} company={company} />

      <Navbar />
      <MobileHeader
        onMenuToggle={() => setMobileNavOpen(true)}
      />
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <main className="max-w-[1200px] mx-auto px-5 py-8 pt-20 md:pt-24 flex-grow w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[14px] text-[#475569] mb-6">
          <Link href="/" className="hover:text-[#1d4ed8]">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link href="/blog" className="hover:text-[#1d4ed8]">Blog</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#0f172a] font-semibold truncate max-w-[200px] sm:max-w-none">
            {blog.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* Main Article Body */}
          <article className="lg:col-span-8">
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#dbeafe] text-[#1e40af] px-3.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
                  {blog.category}
                </span>
                <span className="text-[13px] text-[#475569]">
                  {new Date(blog.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-[13px] text-[#64748b]">•</span>
                <span className="text-[13px] text-[#475569]">By {blog.author}</span>
              </div>

              <h1 className="text-[28px] md:text-[40px] font-bold text-[#0f172a] leading-tight mb-4">
                {blog.title}
              </h1>

              <p className="text-[17px] text-[#475569] leading-relaxed font-medium">
                {blog.excerpt}
              </p>
            </header>

            {/* Featured Image */}
            {blog.cover_image && (
              <div className="w-full rounded-2xl overflow-hidden mb-8 border border-[#cbd5e1] shadow-sm bg-[#e2e8f0]">
                <img
                  src={blog.cover_image}
                  alt={blog.cover_image_alt || blog.title}
                  className="w-full h-auto object-cover aspect-video"
                />
              </div>
            )}

            {/* Article Formatted Content */}
            <div className="mb-12">
              <RichTextRenderer content={blog.content} />
            </div>

            {/* Share / Back footer */}
            <div className="pt-6 border-t border-[#cbd5e1] flex justify-between items-center">
              <Link
                href="/blog"
                className="text-[#1d4ed8] font-bold text-[14px] flex items-center gap-1 hover:text-[#1e40af] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to all articles</span>
              </Link>
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Need Help Box */}
            <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1] shadow-sm">
              <h3 className="text-[20px] font-bold text-[#0f172a] mb-2">
                Need Help Now?
              </h3>
              <p className="text-[14px] text-[#475569] mb-6 leading-relaxed">
                Experiencing any signs of a failing septic system? Don&apos;t wait for a complete backup.
              </p>
              <div className="space-y-3">
                <a
                  href={phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '#'}
                  className="w-full bg-[#1d4ed8] text-white text-[15px] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1e40af] transition-colors shadow-sm min-h-[48px]"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  <span>{phone ? `Call ${phone}` : 'Call Helpline'}</span>
                </a>

                <a
                  href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#'}
                  target={whatsapp ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white text-[15px] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-colors shadow-sm min-h-[48px]"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Other Recent Posts */}
            {recentPosts.length > 0 && (
              <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm">
                <h3 className="text-[18px] font-bold text-[#0f172a] mb-4 border-b border-[#cbd5e1] pb-3">
                  Related Articles
                </h3>
                <ul className="flex flex-col gap-4">
                  {recentPosts.map((post) => (
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
            )}
          </aside>
        </div>
      </main>

      <Footer />
      <MobileActionBar />
      <FloatingButtons />
    </div>
  );
}
