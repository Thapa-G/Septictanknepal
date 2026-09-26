import React from 'react';
import Link from 'next/link';
import { Blog } from '@/types';

interface BlogCardProps {
  blog: Blog;
  variant?: 'featured' | 'standard' | 'with-image';
}

export default function BlogCard({ blog, variant = 'standard' }: BlogCardProps) {
  const altText = blog.cover_image_alt || blog.title;

  if (variant === 'featured') {
    return (
      <Link
        href={`/blog/${blog.slug}`}
        className="bg-white border border-[#cbd5e1] rounded-2xl overflow-hidden hover:bg-[#f1f5f9] transition-all duration-300 group cursor-pointer flex flex-col md:flex-row mb-8 shadow-sm hover:shadow-md block"
      >
        <div className="h-64 md:h-auto md:w-1/2 relative bg-[#e2e8f0] overflow-hidden flex items-center justify-center">
          {blog.cover_image ? (
            <img
              src={blog.cover_image}
              alt={altText}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="material-symbols-outlined text-5xl text-slate-400">article</span>
          )}
        </div>
        <div className="p-6 md:p-8 flex-grow flex flex-col justify-between md:w-1/2">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {blog.category && (
                <span className="bg-[#1d4ed8] text-white text-[12px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {blog.category}
                </span>
              )}
              <span className="text-[12px] text-[#475569]">
                {new Date(blog.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-[24px] font-bold text-[#0f172a] mb-3 group-hover:text-[#1d4ed8] transition-colors leading-tight">
              {blog.title}
            </h2>
            <p className="text-[#475569] text-[15px] leading-relaxed mb-4 line-clamp-3">
              {blog.excerpt}
            </p>
          </div>
          <div className="text-[#1d4ed8] group-hover:text-[#1e40af] font-bold text-[14px] flex items-center gap-1 mt-auto">
            <span>Read Full Article</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'with-image' || blog.cover_image) {
    return (
      <Link
        href={`/blog/${blog.slug}`}
        className="bg-white border border-[#cbd5e1] rounded-2xl overflow-hidden hover:bg-[#f1f5f9] transition-all duration-300 group cursor-pointer flex flex-col shadow-sm hover:shadow-md block h-full"
      >
        <div className="h-48 bg-[#e2e8f0] relative overflow-hidden flex items-center justify-center">
          {blog.cover_image ? (
            <img
              src={blog.cover_image}
              alt={altText}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="material-symbols-outlined text-4xl text-slate-400">article</span>
          )}
        </div>
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            {blog.category && (
              <span className="text-[#1d4ed8] text-[12px] font-bold uppercase tracking-wider mb-2 block">
                {blog.category}
              </span>
            )}
            <h3 className="text-[18px] font-bold text-[#0f172a] mb-2 group-hover:text-[#1d4ed8] transition-colors leading-snug">
              {blog.title}
            </h3>
            <p className="text-[#475569] text-[14px] leading-relaxed mb-4 line-clamp-2">
              {blog.excerpt}
            </p>
          </div>
          <div className="text-[#1d4ed8] group-hover:text-[#1e40af] font-bold text-[14px] flex items-center gap-1 mt-auto">
            <span>Read More</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="bg-white border border-[#cbd5e1] rounded-2xl p-6 hover:bg-[#f1f5f9] transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md block h-full"
    >
      <div>
        <div className="mb-3">
          <span
            className="material-symbols-outlined text-[#1d4ed8] text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {blog.icon || 'water_drop'}
          </span>
        </div>
        {blog.category && (
          <span className="text-[#1d4ed8] text-[12px] font-bold uppercase tracking-wider mb-2 block">
            {blog.category}
          </span>
        )}
        <h3 className="text-[18px] font-bold text-[#0f172a] mb-2 group-hover:text-[#1d4ed8] transition-colors leading-snug">
          {blog.title}
        </h3>
        <p className="text-[#475569] text-[14px] leading-relaxed mb-4 line-clamp-3">
          {blog.excerpt}
        </p>
      </div>
      <div className="text-[#1d4ed8] group-hover:text-[#1e40af] font-bold text-[14px] flex items-center gap-1 mt-auto">
        <span>Read More</span>
        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </div>
    </Link>
  );
}
