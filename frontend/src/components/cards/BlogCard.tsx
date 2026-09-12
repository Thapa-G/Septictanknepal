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
        <div className="h-64 md:h-auto md:w-1/2 relative bg-[#e2e8f0] overflow-hidden">
          <img
            src={blog.cover_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7uCIPYHm8EJZvPor5srfBzNextPUXCaos7r2pCTm3SiAdwvzp1ubpEjJyZ2XK6brPp9fvNP2A9-T1lVbucFsU7SYSPtm76PCDrspXJz-gm-dw6qpQ5h9DSlRVPXF3B8SxvUdUuwc4X4tp6nopGhp1Jarw5T6vsrBgA__6JOUQ_FfER5fN_MScHsxotURzXukGl0TRlWhmnDYtm4S6LmTIzBPW21jjlESHN80Oy0DGU1rwVcwo8Lhx'}
            alt={altText}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
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
        <div className="h-48 bg-[#e2e8f0] relative overflow-hidden">
          <img
            src={blog.cover_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYuVZT2DynhdwpfW7IzexYgrslMyc6nPUghtckJiSwyMlfS8FIi0Z2G_TgSbFEv4kkk_2MldhzyHDQ01IoRY90LDGWL7gbrk2WT2D-VOtwG4W9vFrFKMiHTYIxx_yh1Gl9APLhsChYXfjP_I9OksTuYVc6ohff8tP1ckeyjqYEN87i4LSAa589cibKZBgRN-q7kVHQ1HFzPodpgu9PAvwExEq3vOtzfLI__7UKJra161o-kcWQuy3w'}
            alt={altText}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
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
