'use client';

import React, { useState } from 'react';
import { CustomMetaTag } from '@/types';

interface SeoMetadataManagerProps {
  metaTitle: string;
  onMetaTitleChange: (val: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (val: string) => void;
  metaKeywords: string;
  onMetaKeywordsChange: (val: string) => void;
  canonicalUrl: string;
  onCanonicalUrlChange: (val: string) => void;
  articleTitle?: string;
  briefDescription?: string;
  coverImage?: string;
  coverImageAlt?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
  urlSlug?: string;
  itemType?: 'service' | 'blog';
  // Optional backwards compatibility props
  ogImage?: string;
  onOgImageChange?: (val: string) => void;
  ogImageAlt?: string;
  onOgImageAltChange?: (val: string) => void;
  customMetadata?: CustomMetaTag[];
  onCustomMetadataChange?: (tags: CustomMetaTag[]) => void;
}

export default function SeoMetadataManager({
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  metaKeywords,
  onMetaKeywordsChange,
  canonicalUrl,
  onCanonicalUrlChange,
  articleTitle = '',
  briefDescription = '',
  coverImage = '',
  coverImageAlt = '',
  fallbackTitle = 'Septic Tank Nepal',
  fallbackDescription = 'Professional septic tank pumping, drain cleaning, and plumbing solutions in Kathmandu Valley.',
  fallbackImage = '',
  urlSlug = '',
  itemType = 'service',
}: SeoMetadataManagerProps) {
  const [activeTab, setActiveTab] = useState<'standard' | 'preview'>('standard');

  // Automatic OpenGraph & Twitter attributes - strictly use cover image alt
  const effectiveCoverImage = coverImage || fallbackImage;
  const effectiveImageAlt = coverImageAlt || '';
  const effectiveOgTitle = articleTitle || fallbackTitle;
  const effectiveOgDesc = briefDescription || fallbackDescription;

  // SERP Google attributes
  const displayTitle = metaTitle || articleTitle || fallbackTitle;
  const displayDesc = metaDescription || briefDescription || fallbackDescription;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np');
  const previewUrl = `${baseUrl}/${itemType === 'service' ? 'services' : 'blog'}/${urlSlug || 'sample-post'}`;

  return (
    <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#fe6b00]">troubleshoot</span>
            <h2 className="text-[18px] font-bold text-[#0f172a]">SEO & Social Sharing Manager</h2>
          </div>
          <p className="text-[13px] text-[#64748b] mt-0.5">
            Configure Google search metadata. Social share previews (WhatsApp, Facebook, Twitter) automatically use your cover image, article title, and brief description.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl border border-[#cbd5e1]">
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'standard'
                ? 'bg-white text-[#0f172a] shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Core SEO
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-white text-[#0f172a] shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Live SERP & Social Preview
          </button>
        </div>
      </div>

      {/* Tab 1: Standard Core SEO */}
      {activeTab === 'standard' && (
        <div className="space-y-6">
          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[14px] font-bold text-[#0f172a]">
                Meta Title Tag (Page SEO Title)
              </label>
              <span
                className={`text-[12px] font-semibold ${
                  metaTitle.length > 60 ? 'text-amber-600' : 'text-[#64748b]'
                }`}
              >
                {metaTitle.length} / 60 recommended characters
              </span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              placeholder={fallbackTitle ? `Default: ${fallbackTitle}` : 'e.g. Septic Tank Cleaning in Kathmandu | Fast Emergency Service'}
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
            />
            <p className="text-[12px] text-[#64748b] mt-1">
              Displays as the clickable blue headline in Google search results and browser tabs.
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[14px] font-bold text-[#0f172a]">
                Meta Description (Search Snippet)
              </label>
              <span
                className={`text-[12px] font-semibold ${
                  metaDescription.length > 160 ? 'text-amber-600' : 'text-[#64748b]'
                }`}
              >
                {metaDescription.length} / 160 recommended characters
              </span>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              placeholder={fallbackDescription ? `Default: ${fallbackDescription}` : 'Summarize the page content for search engines...'}
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
            />
            <p className="text-[12px] text-[#64748b] mt-1">
              Short summary displayed under the title in Google search results.
            </p>
          </div>

          {/* Keywords & Canonical URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Focus Keywords / Meta Keywords
              </label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => onMetaKeywordsChange(e.target.value)}
                placeholder="e.g. septic tank nepal, drain cleaning kathmandu, pipe unblocker"
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
              <p className="text-[12px] text-[#64748b] mt-1">
                Comma-separated target keywords for search indexing.
              </p>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Canonical URL (Optional)
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => onCanonicalUrlChange(e.target.value)}
                placeholder="https://omganeshayasarsafai.com.np/services/..."
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
              <p className="text-[12px] text-[#64748b] mt-1">
                Specifies the authoritative URL to avoid duplicate content penalties.
              </p>
            </div>
          </div>

          {/* Automatic OpenGraph & Social Sharing Integration Notice */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <span className="material-symbols-outlined text-[22px] text-[#16a34a] shrink-0 mt-0.5">verified</span>
            <div className="space-y-2 text-[13px]">
              <h4 className="font-bold text-[#14532d]">
                Automatic Social Media & OpenGraph Sharing (WhatsApp, Facebook, Twitter)
              </h4>
              <p className="text-[#166534] leading-relaxed">
                Social preview cards are dynamically configured from your content:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[12px] text-[#14532d]">
                <div className="bg-white/70 p-2.5 rounded-lg border border-[#86efac]">
                  <span className="font-sans font-bold text-[#166534] block text-[11px] uppercase tracking-wider mb-0.5">OG Image:</span>
                  <span className="truncate block" title={effectiveCoverImage || 'Cover image'}>
                    {coverImage ? 'Cover image linked' : (fallbackImage ? 'Using fallback image' : 'Cover image not set')}
                  </span>
                </div>
                <div className="bg-white/70 p-2.5 rounded-lg border border-[#86efac]">
                  <span className="font-sans font-bold text-[#166534] block text-[11px] uppercase tracking-wider mb-0.5">OG Image Alt:</span>
                  <span className="truncate block" title={coverImageAlt || 'Cover image alt text'}>
                    {coverImageAlt ? coverImageAlt : (coverImage ? 'No alt text set (add in Image Alt Text field)' : 'Cover image not set')}
                  </span>
                </div>
                <div className="bg-white/70 p-2.5 rounded-lg border border-[#86efac]">
                  <span className="font-sans font-bold text-[#166534] block text-[11px] uppercase tracking-wider mb-0.5">OG Title:</span>
                  <span className="truncate block" title={effectiveOgTitle}>
                    {articleTitle || (fallbackTitle ? `Default: ${fallbackTitle}` : 'Title not set')}
                  </span>
                </div>
                <div className="bg-white/70 p-2.5 rounded-lg border border-[#86efac]">
                  <span className="font-sans font-bold text-[#166534] block text-[11px] uppercase tracking-wider mb-0.5">OG Description:</span>
                  <span className="truncate block" title={effectiveOgDesc}>
                    {briefDescription || (fallbackDescription ? `Default: ${fallbackDescription}` : 'Description not set')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SERP & Social Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-8">
          {/* Google Search Snippet Preview */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-bold text-[#0f172a] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#1d4ed8]">search</span>
              Google Search Engine Result Snippet Preview
            </h3>

            <div className="bg-white border border-[#cbd5e1] rounded-2xl p-5 max-w-2xl shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-[12px] text-[#202124] mb-0.5">
                <div className="w-6 h-6 rounded-full bg-[#0b1e3b] text-white flex items-center justify-center text-[11px] font-black">
                  S
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[12px] font-semibold text-[#202124]">Septic-Tank Nepal</span>
                  <span className="text-[11px] text-[#5f6368] truncate max-w-md">{previewUrl}</span>
                </div>
              </div>
              <h4 className="text-[19px] font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
                {displayTitle}
              </h4>
              <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                {displayDesc}
              </p>
            </div>
          </div>

          {/* Social Media Card Preview */}
          <div className="space-y-3 border-t border-[#e2e8f0] pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#25D366]">share</span>
                WhatsApp, Facebook & Twitter Social Card Preview
              </h3>
              <span className="text-[11px] font-bold bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-2.5 py-1 rounded-full">
                Auto-Generated from Cover Image & Content
              </span>
            </div>

            <div className="bg-white border border-[#cbd5e1] rounded-2xl overflow-hidden max-w-md shadow-xs">
              {effectiveCoverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={effectiveCoverImage}
                  alt={effectiveImageAlt}
                  className="w-full h-48 object-cover border-b border-[#cbd5e1]"
                />
              ) : (
                <div className="w-full h-44 bg-[#f1f5f9] flex flex-col items-center justify-center text-[#94a3b8] border-b border-[#cbd5e1]">
                  <span className="material-symbols-outlined text-[48px]">image</span>
                  <span className="text-[12px]">Cover image not uploaded yet</span>
                </div>
              )}
              <div className="p-4 space-y-1 bg-[#f8fafc]">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  SEPTIC-TANKNEPAL.COM
                </span>
                <h4 className="text-[15px] font-bold text-[#0f172a] line-clamp-1 leading-snug">
                  {effectiveOgTitle}
                </h4>
                <p className="text-[12px] text-[#475569] line-clamp-2 leading-relaxed">
                  {effectiveOgDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
