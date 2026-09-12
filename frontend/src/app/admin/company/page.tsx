'use client';

import React, { useEffect, useState } from 'react';
import AdminLayoutShell from '@/components/layout/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { companyService } from '@/services/companyService';
import { CompanyDetails } from '@/types';
import { DEFAULT_COMPANY } from '@/config/company';
import { useCompany } from '@/context/CompanyContext';

export default function AdminCompanyDetailsPage() {
  const { refreshCompany } = useCompany();
  const [formData, setFormData] = useState<Partial<CompanyDetails>>(DEFAULT_COMPANY);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingReviewImage, setUploadingReviewImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        const data = await companyService.getDetails();
        if (data) {
          setFormData(data);
        }
      } catch (err) {
        console.error('Error loading company details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, []);

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReviewImage(true);
    try {
      const res = await companyService.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        review_image_url: res.url,
        review_image_alt: prev.review_image_alt || 'Scan to Review',
      }));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingReviewImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await companyService.updateDetails(formData);
      await refreshCompany();
      setSuccessMessage(res.message || 'Company details updated successfully!');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update company details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayoutShell
      title="Company & Contact Information"
      subtitle="Update public phone numbers, WhatsApp, physical address, review image, and hours"
    >
      {loading ? (
        <LoadingSpinner text="Loading company information..." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
          {successMessage && (
            <div className="p-4 bg-[#e6f4ea] border border-[#25D366] text-[#005322] rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="text-[14px] font-bold">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-[#ffdad6] border border-[#ba1a1a] text-[#93000a] rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span className="text-[14px] font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Core Info */}
          <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-[18px] font-bold text-[#0f172a] border-b border-[#cbd5e1] pb-3">
              Brand & Contact Numbers
            </h2>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Company Name <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                  Emergency Phone Number <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.emergency_phone || ''}
                  onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                  required
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input font-mono"
                />
                <p className="text-[12px] text-[#64748b] mt-1">
                  Shown in hero cards, emergency badges, and call buttons.
                </p>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                  WhatsApp Direct Number <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.whatsapp_number || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  required
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input font-mono"
                />
                <p className="text-[12px] text-[#64748b] mt-1">
                  Used for all WhatsApp chat links (e.g. 9800000000 or 9779765355755).
                </p>
              </div>
            </div>
          </div>

          {/* Scan to Review Section */}
          <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#cbd5e1] pb-3">
              <div>
                <h2 className="text-[18px] font-bold text-[#0f172a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1d4ed8]">qr_code_2</span>
                  <span>Contact Page - &quot;Scan to Review&quot; Image</span>
                </h2>
                <p className="text-[13px] text-[#64748b] mt-0.5">
                  Upload your Google Review QR code or review graphic to display in the public Contact section.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Image Preview / Box */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-2xl min-h-[180px]">
                {formData.review_image_url ? (
                  <div className="space-y-3 text-center w-full">
                    <div className="w-36 h-36 mx-auto bg-white rounded-xl border border-[#cbd5e1] overflow-hidden p-2 shadow-xs flex items-center justify-center">
                      <img
                        src={formData.review_image_url}
                        alt={formData.review_image_alt || 'Scan to Review'}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="text-[12px] font-bold text-[#166534] bg-[#dcfce7] px-2.5 py-0.5 rounded-full inline-block">
                      Active on Contact Page
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-[#64748b] p-4">
                    <span className="material-symbols-outlined text-4xl text-[#94a3b8] mb-1">
                      qr_code_scanner
                    </span>
                    <div className="text-[13px] font-semibold text-[#0f172a]">No Review Image</div>
                    <div className="text-[11px] text-[#64748b] mt-0.5">Upload a QR code or image below</div>
                  </div>
                )}
              </div>

              {/* Upload Controls & URL Input */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                    Upload Review QR Code / Image File
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-colors inline-flex items-center gap-2 shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                      <span>{uploadingReviewImage ? 'Uploading...' : 'Choose Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReviewImageUpload}
                        disabled={uploadingReviewImage}
                        className="hidden"
                      />
                    </label>

                    {formData.review_image_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, review_image_url: null })}
                        className="text-[13px] text-[#ba1a1a] hover:underline font-semibold"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#475569] mb-1">
                    Or Image URL directly
                  </label>
                  <input
                    type="url"
                    value={formData.review_image_url || ''}
                    onChange={(e) => setFormData({ ...formData, review_image_url: e.target.value })}
                    placeholder="https://example.com/google-review-qr.png"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-2.5 text-[13px] form-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#475569] mb-1">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.review_image_alt || ''}
                    onChange={(e) => setFormData({ ...formData, review_image_alt: e.target.value })}
                    placeholder="Scan to Review"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-2.5 text-[13px] form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location & Schedule */}
          <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-[18px] font-bold text-[#0f172a] border-b border-[#cbd5e1] pb-3">
              Location & Operating Hours
            </h2>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                Physical Workshop / Office Address <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={formData.operating_hours || ''}
                  onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                  Map Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude || ''}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input font-mono"
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5">
                  Map Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude || ''}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input font-mono"
                />
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {saving ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  <span>Save Company Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </AdminLayoutShell>
  );
}
