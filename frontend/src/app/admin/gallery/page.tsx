'use client';

import React, { useEffect, useState, useRef } from 'react';
import AdminLayoutShell from '@/components/layout/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { galleryService } from '@/services/galleryService';
import { api } from '@/lib/api';
import { GalleryItem } from '@/types';

const MAX_PHOTOS = 20;

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [altTextInput, setAltTextInput] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [updatingAlt, setUpdatingAlt] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const res = await galleryService.getAll();
      if (Array.isArray(res)) {
        setPhotos(res);
      } else if (res && Array.isArray(res.data)) {
        setPhotos(res.data);
      }
    } catch (err) {
      console.error('Failed to load gallery photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const isLimitReached = photos.length >= MAX_PHOTOS;

  // Handle direct file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isLimitReached) {
      setErrorMessage(`Photo limit reached (Maximum ${MAX_PHOTOS} photos allowed). Please delete existing photos before uploading new ones.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append('image', file);

      // 1. Upload asset to backend
      const uploadRes = await api.post<{ url: string; path: string }>('/admin/upload', formData);

      if (uploadRes && uploadRes.url) {
        // 2. Save directly to gallery with user-defined or default alt text
        await galleryService.create({
          image_url: uploadRes.url,
          alt_text: altTextInput.trim() || file.name.replace(/\.[^/.]+$/, ''),
        });

        setAltTextInput('');
        setSuccessMessage('Photo uploaded and added to gallery successfully!');
        await loadPhotos();
      }
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      setErrorMessage(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to upload photo. Please check image format & size.'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle adding via direct image URL
  const handleAddViaUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;

    if (isLimitReached) {
      setErrorMessage(`Photo limit reached (Maximum ${MAX_PHOTOS} photos allowed). Please delete existing photos before adding new ones.`);
      return;
    }

    try {
      setUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await galleryService.create({
        image_url: imageUrlInput.trim(),
        alt_text: altTextInput.trim() || null,
      });

      setImageUrlInput('');
      setAltTextInput('');
      setSuccessMessage('Photo added to gallery successfully!');
      await loadPhotos();
    } catch (err: any) {
      console.error('Failed to add image via URL:', err);
      setErrorMessage(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to add photo URL.'
      );
    } finally {
      setUploading(false);
    }
  };

  // Save updated alt text
  const handleSaveAltText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      setUpdatingAlt(true);
      await galleryService.update(editingPhoto.id, {
        alt_text: editAltText.trim() || null,
      });

      setSuccessMessage('Image alt text updated successfully.');
      setEditingPhoto(null);
      setEditAltText('');
      await loadPhotos();
    } catch (err: any) {
      console.error('Failed to update alt text:', err);
      alert('Failed to update alt text.');
    } finally {
      setUpdatingAlt(false);
    }
  };

  // Delete Photo
  const handleDelete = async (id: number) => {
    try {
      await galleryService.delete(id);
      setDeleteConfirmId(null);
      setSuccessMessage('Photo deleted successfully.');
      setErrorMessage(null);
      await loadPhotos();
    } catch (err) {
      console.error('Failed to delete photo:', err);
      alert('Failed to delete photo.');
    }
  };

  return (
    <AdminLayoutShell
      title="Photo Gallery"
      subtitle={`Manage public photos and SEO image descriptions (Maximum limit: ${MAX_PHOTOS} photos).`}
    >
      {/* Upload Image Section */}
      <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-[17px] font-bold text-[#0f172a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1d4ed8]">add_photo_alternate</span>
            <span>Add New Photo</span>
          </h2>

          {/* Photo Limit Counter Badge */}
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-semibold text-[#475569]">
              Capacity: <strong className={isLimitReached ? 'text-[#ba1a1a]' : 'text-[#0f172a]'}>{photos.length}</strong> / {MAX_PHOTOS} photos
            </div>
            <div className="w-24 h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isLimitReached ? 'bg-[#ba1a1a]' : photos.length >= 15 ? 'bg-[#f59e0b]' : 'bg-[#1d4ed8]'
                }`}
                style={{ width: `${Math.min(100, (photos.length / MAX_PHOTOS) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {isLimitReached && (
          <div className="mb-5 p-3.5 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#92400e] text-[13px] font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#d97706]">warning</span>
            <span>
              <strong>Limit Reached:</strong> The gallery has reached its maximum capacity of {MAX_PHOTOS} photos. Please delete existing photos before uploading new ones.
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-[#ba1a1a] text-[13px] font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl text-[#166534] text-[13px] font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Common Alt Text Field for New Upload */}
        <div className="mb-5 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4">
          <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">description</span>
            <span>Image Alt Text (for SEO & Accessibility)</span>
          </label>
          <input
            type="text"
            value={altTextInput}
            onChange={(e) => setAltTextInput(e.target.value)}
            disabled={isLimitReached || uploading}
            placeholder="e.g. Septic tank pumping and pipe jetting work in Kathmandu"
            className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input disabled:opacity-50"
          />
          <p className="text-[12px] text-[#64748b] mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#166534]">info</span>
            <span>Type the alt description here before clicking upload or adding via URL below.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* File Drag & Drop / Click Upload Box */}
          <div
            onClick={() => !isLimitReached && !uploading && fileInputRef.current?.click()}
            className={`md:col-span-7 border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[140px] ${
              isLimitReached
                ? 'border-[#cbd5e1] bg-[#f1f5f9] opacity-60 cursor-not-allowed'
                : 'border-[#cbd5e1] hover:border-[#1d4ed8] cursor-pointer bg-[#f8fafc] hover:bg-[#eff6ff]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              disabled={isLimitReached || uploading}
              className="hidden"
            />
            {uploading ? (
              <LoadingSpinner text="Uploading photo..." />
            ) : (
              <>
                <span className={`material-symbols-outlined text-4xl mb-1.5 ${isLimitReached ? 'text-[#94a3b8]' : 'text-[#1d4ed8]'}`}>
                  cloud_upload
                </span>
                <div className="text-[14px] font-bold text-[#0f172a]">
                  {isLimitReached ? 'Photo Limit Reached (Max 20)' : 'Click to select and upload image'}
                </div>
                <div className="text-[12px] text-[#64748b] mt-0.5">
                  {isLimitReached ? 'Delete photos below to upload more' : 'PNG, JPG, WEBP up to 5MB (Uploaded with Alt text)'}
                </div>
              </>
            )}
          </div>

          <div className="hidden md:flex md:col-span-1 justify-center items-center text-[#94a3b8] font-bold text-[12px] uppercase">
            OR
          </div>

          {/* Paste URL Input Form */}
          <form onSubmit={handleAddViaUrl} className="md:col-span-4 space-y-2">
            <label className="block text-[13px] font-bold text-[#475569]">
              Add via Image URL
            </label>
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              disabled={isLimitReached || uploading}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-2.5 text-[13px] form-input font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={uploading || !imageUrlInput.trim() || isLimitReached}
              className="w-full bg-[#0b1e3b] hover:bg-[#1d4ed8] text-white py-2.5 px-4 rounded-xl text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">add_link</span>
              <span>Add URL to Gallery</span>
            </button>
          </form>
        </div>
      </div>

      {/* Gallery Photos Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-[#0f172a]">
          Uploaded Photos <span className="text-[#64748b] font-normal text-[14px]">({photos.length} / {MAX_PHOTOS})</span>
        </h3>
      </div>

      {/* Photo Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Loading gallery photos..." />
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#cbd5e1] p-12 text-center shadow-xs">
          <span className="material-symbols-outlined text-5xl text-[#94a3b8] mb-2 block">
            image
          </span>
          <h4 className="text-[18px] font-bold text-[#0f172a] mb-1">No photos yet</h4>
          <p className="text-[#64748b] text-[13px]">
            Upload your first photo above (up to {MAX_PHOTOS} photos) to display on the public gallery page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#cbd5e1] shadow-xs flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-4/3 bg-[#e2e8f0] overflow-hidden">
                <img
                  src={photo.image_url}
                  alt={photo.alt_text || 'Gallery photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Photo Index Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                  #{index + 1}
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPhoto(photo);
                      setEditAltText(photo.alt_text || '');
                    }}
                    className="bg-white/90 hover:bg-white text-[#0f172a] p-1.5 rounded-lg shadow-sm transition-transform hover:scale-110 flex items-center justify-center"
                    title="Edit Alt Text"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(photo.id)}
                    className="bg-[#ba1a1a]/90 hover:bg-[#ba1a1a] text-white p-1.5 rounded-lg shadow-sm transition-transform hover:scale-110 flex items-center justify-center"
                    title="Delete Photo"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Photo Alt Text & Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between bg-white border-t border-[#f1f5f9]">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[#64748b] mb-1 flex items-center justify-between">
                    <span>Image Alt Text</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPhoto(photo);
                        setEditAltText(photo.alt_text || '');
                      }}
                      className="text-[#1d4ed8] hover:underline text-[11px] font-semibold lowercase flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[12px]">edit</span>
                      <span>edit</span>
                    </button>
                  </div>
                  <p className="text-[13px] text-[#0f172a] font-medium line-clamp-2" title={photo.alt_text || 'No alt text set'}>
                    {photo.alt_text ? (
                      photo.alt_text
                    ) : (
                      <span className="text-[#94a3b8] italic">No alt text provided</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Alt Text Modal */}
      {editingPhoto !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#cbd5e1] max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-bold text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1d4ed8]">edit_note</span>
                <span>Edit Image Alt Text</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="text-[#64748b] hover:text-[#0f172a]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-[#e2e8f0] border border-[#cbd5e1] max-h-36">
              <img
                src={editingPhoto.image_url}
                alt={editAltText || 'Photo Preview'}
                className="w-full h-full object-cover"
              />
            </div>

            <form onSubmit={handleSaveAltText} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#0f172a] mb-1.5">
                  Image Alt Text (for SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  placeholder="e.g. Septic tank pumping service in Kathmandu Valley"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] form-input"
                  autoFocus
                />
                <p className="text-[12px] text-[#64748b] mt-1">
                  Descriptive text for Google Images and screen readers.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-[13px] font-bold text-[#475569] hover:bg-[#f1f5f9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingAlt}
                  className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-5 py-2 rounded-xl text-[13px] font-bold transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {updatingAlt ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Save Alt Text</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#cbd5e1] max-w-sm w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-[#fee2e2] text-[#ba1a1a] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[26px]">delete</span>
            </div>
            <h3 className="text-[17px] font-bold text-[#0f172a] mb-1.5">Delete Photo?</h3>
            <p className="text-[13px] text-[#64748b] leading-relaxed mb-5">
              Are you sure you want to remove this photo from the gallery?
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-[13px] font-bold text-[#475569] hover:bg-[#f1f5f9]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="bg-[#ba1a1a] text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-[#93000a] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutShell>
  );
}
