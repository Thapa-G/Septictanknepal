'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileNav from '@/components/layout/MobileNav';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { galleryService } from '@/services/galleryService';
import { useCompany } from '@/context/CompanyContext';
import { GalleryItem } from '@/types';

import { DEFAULT_COMPANY } from '@/config/company';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';

export default function PublicGalleryPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { company } = useCompany();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const galleryRes = await galleryService.getAll();
        if (Array.isArray(galleryRes)) {
          setPhotos(galleryRes);
        } else if (galleryRes && Array.isArray((galleryRes as any).data)) {
          setPhotos((galleryRes as any).data);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (lightboxIndex === null || photos.length === 0) return;
    setLightboxIndex((prev) => ((prev ?? 0) + 1) % photos.length);
  };

  const prevPhoto = () => {
    if (lightboxIndex === null || photos.length === 0) return;
    setLightboxIndex((prev) => ((prev ?? 0) - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, photos.length]);

  const phone = company?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const whatsapp = company?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;
  const companyName = company?.company_name || DEFAULT_COMPANY.company_name;

  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://omganeshayasarsafai.com.np/gallery#webpage',
    url: 'https://omganeshayasarsafai.com.np/gallery',
    name: `Photo Gallery | ${companyName}`,
    isPartOf: {
      '@id': 'https://omganeshayasarsafai.com.np/#website',
    },
    description: 'View our on-site work and project photo gallery across Kathmandu Valley.',
    about: {
      '@id': 'https://omganeshayasarsafai.com.np/#organization',
    },
    hasPart: photos.slice(0, 12).map((photo) => ({
      '@type': 'ImageObject',
      contentUrl: photo.image_url,
      caption: photo.alt_text || 'Septic tank cleaning and suction project in Kathmandu',
      name: photo.alt_text || 'Septic tank service photo',
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] pb-18 md:pb-0">
      <title>{`Photo Gallery | ${companyName}`}</title>
      <meta
        name="description"
        content="View our on-site work and project photo gallery across Kathmandu Valley. Professional septic tank pumping, drain cleaning, and sewage clearance."
      />
      <link rel="canonical" href="https://omganeshayasarsafai.com.np/gallery" />

      {/* OpenGraph Protocol */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`Photo Gallery | ${companyName}`} />
      <meta
        property="og:description"
        content="View our on-site work and project photo gallery across Kathmandu Valley. Professional septic tank pumping, drain cleaning, and sewage clearance."
      />
      <meta property="og:url" content="https://omganeshayasarsafai.com.np/gallery" />
      <meta property="og:image" content="https://omganeshayasarsafai.com.np/images/logo.jpg" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`Photo Gallery | ${companyName}`} />
      <meta
        name="twitter:description"
        content="View our on-site work and project photo gallery across Kathmandu Valley. Professional septic tank pumping, drain cleaning, and sewage clearance."
      />
      <meta name="twitter:image" content="https://omganeshayasarsafai.com.np/images/logo.jpg" />

      {/* Schemas */}
      <LocalBusinessSchema company={company} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />

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
        {/* Simple & Clean Header */}
        <section className="mb-10 text-center">
          <h1 className="text-[32px] md:text-[44px] font-extrabold text-[#0f172a] mb-2 tracking-tight">
            Photo Gallery
          </h1>
          <p className="text-[16px] text-[#475569] max-w-xl mx-auto leading-relaxed">
            A visual showcase of our on-site plumbing, septic tank pumping, and drainage projects across Kathmandu Valley.
          </p>
        </section>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-slate-200 border border-[#cbd5e1] rounded-2xl aspect-square animate-pulse"
              />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#cbd5e1] p-12 text-center my-8 shadow-xs">
            <span className="material-symbols-outlined text-5xl text-[#94a3b8] mb-2 block">
              image
            </span>
            <h3 className="text-[18px] font-bold text-[#0f172a] mb-1">No photos in gallery yet</h3>
            <p className="text-[#64748b] text-[14px]">
              Photos will appear here once uploaded by the administrator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
            {photos.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="bg-white border border-[#cbd5e1] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group cursor-pointer aspect-square relative"
              >
                <img
                  src={item.image_url}
                  alt={item.alt_text || 'Gallery photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-[#0f172a] flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[22px]">zoom_in</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 select-none"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-20"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[26px]">close</span>
          </button>

          {/* Prev Button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all z-20 hover:scale-110"
              aria-label="Previous"
            >
              <span className="material-symbols-outlined text-[28px]">chevron_left</span>
            </button>
          )}

          {/* Next Button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all z-20 hover:scale-110"
              aria-label="Next"
            >
              <span className="material-symbols-outlined text-[28px]">chevron_right</span>
            </button>
          )}

          {/* Photo Frame */}
          <div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex].image_url}
              alt={photos[lightboxIndex].alt_text || 'Septic Tank Nepal project gallery photo'}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />
            {photos[lightboxIndex].alt_text && (
              <div className="mt-3 bg-black/70 backdrop-blur-md text-white text-[13px] md:text-[14px] px-5 py-2 rounded-xl max-w-xl text-center shadow-lg border border-white/10">
                {photos[lightboxIndex].alt_text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <FloatingButtons />
      <MobileActionBar />

      {/* Footer */}
      <Footer />
    </div>
  );
}
