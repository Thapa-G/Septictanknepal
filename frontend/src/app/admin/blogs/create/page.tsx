'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayoutShell from '@/components/layout/AdminLayoutShell';
import CategoryManagerField from '@/components/admin/CategoryManagerField';
import RichTextEditor from '@/components/admin/RichTextEditor';
import SeoMetadataManager from '@/components/admin/SeoMetadataManager';
import { blogsService } from '@/services/blogsService';
import { companyService } from '@/services/companyService';

export default function AdminCreateBlogPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Maintenance',
    author: 'Septic-Tank Nepal Team',
    excerpt: '',
    content: '',
    icon: 'article',
    cover_image: '',
    cover_image_alt: '',
    is_featured: false,
    published_at: new Date().toISOString().slice(0, 10),
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    og_image: '',
    og_image_alt: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ? generatedSlug : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await companyService.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        cover_image: res.url,
        cover_image_alt: prev.cover_image_alt || '',
      }));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await blogsService.create({
        ...formData,
      });
      router.push('/admin/blogs');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to publish blog post');
      setSubmitting(false);
    }
  };

  return (
    <AdminLayoutShell
      title="Create New Blog Post"
      subtitle="Publish guides, emergency drainage advice, and plumbing insights"
      actions={
        <Link
          href="/admin/blogs"
          className="bg-white border border-[#cbd5e1] text-[#475569] hover:bg-[#e2e8f0] px-4 py-2 rounded-xl text-[13px] font-bold transition-colors"
        >
          Cancel
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {error && (
          <div className="p-4 bg-[#ffdad6] border border-[#ba1a1a] text-[#93000a] rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span className="text-[14px] font-medium">{error}</span>
          </div>
        )}

        {/* Article Details Card */}
        <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-[18px] font-bold text-[#0f172a] border-b border-[#cbd5e1] pb-3">
            Article Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Article Title <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. 5 Signs Your Septic Tank Needs Immediate Pumping"
                required
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Slug (URL Path) <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. 5-signs-septic-tank-needs-pumping"
                required
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <CategoryManagerField
              value={formData.category}
              onChange={(category) => setFormData({ ...formData, category })}
            />

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Publish Date
              </label>
              <input
                type="date"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
              Excerpt / Brief Summary <span className="text-[#ba1a1a]">*</span>
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              required
              placeholder="A brief snippet summary to display on the blog cards and SEO description..."
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
            />
          </div>

          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            required
          />

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-[#cbd5e1] text-[#1d4ed8] focus:ring-[#1d4ed8]"
            />
            <label htmlFor="is_featured" className="text-[14px] font-bold text-[#0f172a] cursor-pointer">
              Feature as Hero article on top of the Blog catalog
            </label>
          </div>
        </div>

        {/* Media & Cover Image Card */}
        <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-[18px] font-bold text-[#0f172a] border-b border-[#cbd5e1] pb-3">
            Cover Image
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://... or upload below"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input mb-3"
                />

                <div className="flex items-center gap-3">
                  <label className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] px-4 py-2 rounded-xl text-[13px] font-bold cursor-pointer transition-colors border border-[#cbd5e1]">
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {formData.cover_image && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cover_image: '', cover_image_alt: '' })}
                      className="text-[13px] text-[#ba1a1a] hover:underline"
                    >
                      Clear Image
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                  Image Alt Text (for SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={formData.cover_image_alt}
                  onChange={(e) => setFormData({ ...formData, cover_image_alt: e.target.value })}
                  placeholder="e.g. Technician checking septic tank water levels"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
                />
                <p className="text-[12px] text-[#64748b] mt-1">
                  Descriptive text for screen readers and Google image search indexing.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Icon (Fallback Material Symbol)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. article, water_drop, warning"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input font-mono"
                />
                <div className="w-11 h-11 rounded-xl bg-[#f1f5f9] border border-[#cbd5e1] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#1d4ed8] text-[24px]">
                    {formData.icon || 'article'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {formData.cover_image && (
            <div className="mt-4 w-48 h-32 rounded-xl overflow-hidden border border-[#cbd5e1] bg-[#e2e8f0]">
              <img
                src={formData.cover_image}
                alt={formData.cover_image_alt || formData.title || 'Preview'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* SEO & Metadata Manager */}
        <SeoMetadataManager
          metaTitle={formData.meta_title}
          onMetaTitleChange={(val) => setFormData((prev) => ({ ...prev, meta_title: val }))}
          metaDescription={formData.meta_description}
          onMetaDescriptionChange={(val) => setFormData((prev) => ({ ...prev, meta_description: val }))}
          metaKeywords={formData.meta_keywords}
          onMetaKeywordsChange={(val) => setFormData((prev) => ({ ...prev, meta_keywords: val }))}
          canonicalUrl={formData.canonical_url}
          onCanonicalUrlChange={(val) => setFormData((prev) => ({ ...prev, canonical_url: val }))}
          articleTitle={formData.title}
          briefDescription={formData.excerpt}
          coverImage={formData.cover_image}
          coverImageAlt={formData.cover_image_alt}
          fallbackTitle="Plumbing & Drainage Blog | Septic-Tank Nepal"
          fallbackDescription="Read the latest guides, tips, and insights on septic tank maintenance and drain cleaning in Kathmandu."
          fallbackImage={formData.cover_image}
          urlSlug={formData.slug}
          itemType="blog"
        />

        {/* Submit Actions */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {submitting ? (
              <span>Publishing...</span>
            ) : (
              <>
                <span className="material-symbols-outlined">publish</span>
                <span>Publish Blog Post</span>
              </>
            )}
          </button>
          <Link
            href="/admin/blogs"
            className="text-[14px] text-[#475569] hover:text-[#0f172a] font-bold px-4 py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </AdminLayoutShell>
  );
}
