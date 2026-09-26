'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileNav from '@/components/layout/MobileNav';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import FaqAccordion from '@/components/sections/FaqAccordion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import RichTextRenderer from '@/components/ui/RichTextRenderer';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import ServiceDetailSchema from '@/components/seo/ServiceDetailSchema';
import { servicesService } from '@/services/servicesService';
import { useCompany } from '@/context/CompanyContext';
import { DEFAULT_COMPANY } from '@/config/company';
import { Service } from '@/types';

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const { company } = useCompany();

  useEffect(() => {
    async function loadDetail() {
      try {
        const serviceData = await servicesService.getBySlug(slug);
        setService(serviceData);
      } catch (err: unknown) {
        console.error('Error fetching service detail:', err);
        setError('Service not found or unable to load details.');
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [slug]);

  const phone = company?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const whatsapp = company?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-24">
          <LoadingSpinner text="Loading service details..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar phone={phone} whatsapp={whatsapp} />
        <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-16 px-5 text-center">
          <span className="material-symbols-outlined text-[64px] text-[#ba1a1a] mb-4">error</span>
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">Service Not Found</h1>
          <p className="text-[#475569] mb-6">{error || 'The requested service does not exist.'}</p>
          <Link
            href="/services"
            className="bg-[#0b1e3b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors"
          >
            View All Services
          </Link>
        </main>
        <Footer phone={phone} />
      </div>
    );
  }

  // Extract YouTube ID if present
  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(service.video_url);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] pb-18 md:pb-0">
      {/* Dynamic SEO */}
      <title>{service.heading || service.title}</title>
      <meta name="description" content={service.meta_description || service.short_description || ''} />
      {service.meta_keywords && <meta name="keywords" content={service.meta_keywords} />}
      <link rel="canonical" href={service.canonical_url || `https://omganeshayasarsafai.com.np/services/${slug}`} />
      
      {/* OpenGraph Protocol */}
      <meta property="og:title" content={service.heading || service.title} />
      <meta property="og:description" content={service.short_description || service.meta_description || ''} />
      {service.cover_image && (
        <meta property="og:image" content={service.cover_image} />
      )}
      {(service.cover_image_alt || service.title) && (
        <meta property="og:image:alt" content={service.cover_image_alt || service.title} />
      )}
      <meta property="og:type" content="website" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={service.heading || service.title} />
      <meta name="twitter:description" content={service.short_description || service.meta_description || ''} />
      {service.cover_image && (
        <meta name="twitter:image" content={service.cover_image} />
      )}
      {(service.cover_image_alt || service.title) && (
        <meta property="twitter:image:alt" content={service.cover_image_alt || service.title} />
      )}

      {/* Structured Data / Schemas */}
      <LocalBusinessSchema company={company} />
      <ServiceDetailSchema service={service} company={company} />

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
          <Link href="/services" className="hover:text-[#1d4ed8]">Services</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#0f172a] font-semibold">{service.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* Main Content Column */}
          <article className="lg:col-span-8">
            <header className="mb-6">
              <span className="bg-[#dbeafe] text-[#1e40af] px-3.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider mb-3 inline-block">
                {service.category}
              </span>
              <h1 className="text-[30px] md:text-[42px] font-bold text-[#0f172a] leading-tight mb-4">
                {service.heading || service.title}
              </h1>
              <p className="text-[17px] text-[#475569] leading-relaxed">
                {service.short_description}
              </p>
            </header>

            {/* Featured Hero Media */}
            {service.cover_image && (
              <div className="w-full rounded-2xl overflow-hidden mb-8 border border-[#cbd5e1] shadow-sm bg-[#e2e8f0]">
                <img
                  src={service.cover_image}
                  alt={service.cover_image_alt || service.title}
                  className="w-full h-auto object-cover aspect-video"
                />
              </div>
            )}

            {/* Full Formatted Description / Prose */}
            <div className="mb-8">
              <RichTextRenderer content={service.full_description || service.short_description} />
            </div>

            {/* Embedded Video Player */}
            {service.video_url && (
              <div className="w-full aspect-video mb-10 rounded-2xl overflow-hidden shadow-sm border border-[#cbd5e1] bg-[#0b1e3b] flex items-center justify-center relative">
                {isPlayingVideo && youtubeEmbedUrl ? (
                  <iframe
                    src={youtubeEmbedUrl}
                    title={service.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    onClick={() => setIsPlayingVideo(true)}
                    className="relative w-full h-full flex items-center justify-center group cursor-pointer"
                  >
                    {service.cover_image && (
                      <img
                        src={service.cover_image}
                        alt="Video thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                      />
                    )}
                    <div className="z-10 w-20 h-14 bg-[#1d4ed8] rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Interactive FAQs Accordion */}
            {service.faqs && service.faqs.length > 0 && (
              <FaqAccordion faqs={service.faqs} />
            )}
          </article>

          {/* Right Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Need Help Box */}
            <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1] shadow-sm">
              <h3 className="text-[20px] font-bold text-[#0f172a] mb-2">
                Need Help Now?
              </h3>
              <p className="text-[14px] text-[#475569] mb-6 leading-relaxed">
                Experiencing severe clogs, overflowing tanks, or plumbing emergencies? Don&apos;t wait for catastrophic damage.
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

              {/* Service Features checklist */}
              <div className="mt-6 pt-6 border-t border-[#cbd5e1] space-y-2.5 text-[13px] text-[#0f172a] font-medium">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1d4ed8] text-[18px]">check_circle</span>
                  <span>Same-Day Emergency Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1d4ed8] text-[18px]">check_circle</span>
                  <span>Free Initial On-Site Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1d4ed8] text-[18px]">check_circle</span>
                  <span>Transparent Upfront Rates</span>
                </div>
              </div>
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
