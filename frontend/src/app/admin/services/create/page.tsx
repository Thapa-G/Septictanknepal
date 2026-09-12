'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayoutShell from '@/components/layout/AdminLayoutShell';
import SeoMetadataManager from '@/components/admin/SeoMetadataManager';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { servicesService } from '@/services/servicesService';
import { companyService } from '@/services/companyService';

export default function AdminCreateServicePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    heading: '',
    slug: '',
    category: 'Plumbing & Drainage',
    icon: 'plumbing',
    short_description: '',
    full_description: '',
    cover_image: '',
    cover_image_alt: '',
    video_url: '',
    is_featured: false,
    order: 0,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    og_image: '',
    og_image_alt: '',
  });

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([
    { question: '', answer: '' },
  ]);

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

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', val: string) => {
    setFaqs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const filteredFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());
      await servicesService.create({
        ...formData,
        faqs: filteredFaqs,
      });
      router.push('/admin/services');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create service');
      setSubmitting(false);
    }
  };

  return (
    <AdminLayoutShell
      title="Create New Service"
      subtitle="Add a specialized drainage or plumbing service offering"
      actions={
        <Link
          href="/admin/services"
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

        {/* Basic Info Card */}
        <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-[18px] font-bold text-[#0f172a] border-b border-[#cbd5e1] pb-3">
            Service Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Service Title <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Septic Tank Pumping"
                required
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
              <p className="text-[11px] text-[#64748b] mt-1">
                Shown on cards, navigation menus, and the all-services page.
              </p>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Slug (URL Path) <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. septic-tank-pumping"
                required
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
              Service Heading <span className="text-[12px] font-normal text-[#64748b]">(Optional H1 for Service Page)</span>
            </label>
            <input
              type="text"
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              placeholder="e.g. Professional Septic Tank Pumping & Cleaning in Kathmandu Valley"
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
            />
            <p className="text-[11px] text-[#64748b] mt-1">
              If left empty, the <strong>Service Title</strong> above will be used automatically as the page heading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Plumbing & Drainage"
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Icon (Material Icon Name)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. plumbing, waves, build"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input font-mono"
                />
                <div className="w-11 h-11 rounded-xl bg-[#f1f5f9] border border-[#cbd5e1] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#1d4ed8] text-[24px]">
                    {formData.icon || 'plumbing'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
              Short Summary Description <span className="text-[#ba1a1a]">*</span>
            </label>
            <textarea
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              rows={2}
              required
              placeholder="Brief 1-2 sentence overview for service catalog cards..."
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
            />
          </div>

          <div>
            <RichTextEditor
              label="Detailed Content (Service Description & Procedures)"
              value={formData.full_description}
              onChange={(val) => setFormData((prev) => ({ ...prev, full_description: val }))}
              placeholder="Comprehensive step-by-step description, equipment details, pricing guidelines, lists..."
              rows={10}
              required={false}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-[#cbd5e1] text-[#1d4ed8] focus:ring-[#1d4ed8]"
            />
            <label htmlFor="is_featured" className="text-[14px] font-bold text-[#0f172a] cursor-pointer">
              Feature this service prominently on Home Page & Wide Grid
            </label>
          </div>
        </div>

        {/* Media & Video Card */}
        <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-[18px] font-bold text-[#0f172a] border-b border-[#cbd5e1] pb-3">
            Media & Video
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
                  placeholder="e.g. Septic tank cleaning vehicle operating in Kathmandu"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
                />
                <p className="text-[12px] text-[#64748b] mt-1">
                  Descriptive text for screen readers and Google image search indexing.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                YouTube Video URL (Optional)
              </label>
              <input
                type="text"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
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

        {/* FAQs Dynamic Builder */}
        <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-[#cbd5e1] pb-3">
            <div>
              <h2 className="text-[18px] font-bold text-[#0f172a]">
                Frequently Asked Questions
              </h2>
              <p className="text-[13px] text-[#475569]">
                Common customer queries displayed in the expandable accordion on the service page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFaq}
              className="bg-[#f1f5f9] hover:bg-[#1d4ed8] hover:text-white text-[#0f172a] px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-1 border border-[#cbd5e1]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 bg-[#f8fafc] rounded-xl border border-[#cbd5e1] space-y-3 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-bold text-[#1d4ed8]">Question #{index + 1}</span>
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded transition-colors text-[12px] font-bold flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="e.g. How often should septic tanks be pumped?"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  className="w-full bg-white border border-[#cbd5e1] rounded-xl p-2.5 text-[14px] form-input font-medium"
                />

                <textarea
                  placeholder="e.g. For typical households, septic tanks should be inspected and pumped every 2-3 years..."
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-[#cbd5e1] rounded-xl p-2.5 text-[14px] form-input"
                />
              </div>
            ))}
          </div>
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
          briefDescription={formData.short_description}
          coverImage={formData.cover_image}
          coverImageAlt={formData.cover_image_alt}
          fallbackTitle="Septic Tank Services in Kathmandu | Septic-Tank Nepal"
          fallbackDescription="Professional septic tank pumping, drain cleaning, and plumbing solutions in Kathmandu Valley."
          fallbackImage={formData.cover_image}
          urlSlug={formData.slug}
          itemType="service"
        />

        {/* Submit Actions */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {submitting ? (
              <span>Saving Service...</span>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                <span>Publish Service</span>
              </>
            )}
          </button>
          <Link
            href="/admin/services"
            className="text-[14px] text-[#475569] hover:text-[#0f172a] font-bold px-4 py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </AdminLayoutShell>
  );
}
