'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileNav from '@/components/layout/MobileNav';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import HeroSection from '@/components/sections/HeroSection';
import WhereWeWorkSection from '@/components/sections/WhereWeWorkSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import WhatsAppCtaSection from '@/components/sections/WhatsAppCtaSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ServiceCard from '@/components/cards/ServiceCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import { servicesService } from '@/services/servicesService';
import { companyService } from '@/services/companyService';
import { useCompany } from '@/context/CompanyContext';
import { Service, Testimonial } from '@/types';

import { DEFAULT_COMPANY } from '@/config/company';

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useCompany();

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, testimonialsRes] = await Promise.allSettled([
          servicesService.getAll({ per_page: 6 }),
          companyService.getTestimonials(),
        ]);

        if (servicesRes.status === 'fulfilled') {
          const sData = servicesRes.value;
          if (Array.isArray(sData)) {
            setServices(sData.slice(0, 3));
          } else if (sData && sData.data) {
            setServices(sData.data.slice(0, 3));
          }
        }

        if (testimonialsRes.status === 'fulfilled') {
          setTestimonials(testimonialsRes.value);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const phone = company?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const whatsapp = company?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np').replace(/\/+$/, '');

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'Septic-Tank Nepal',
    description: 'Professional 24/7 drainage, septic tank pumping, and plumbing services across Kathmandu Valley.',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] overflow-x-hidden pb-18 md:pb-0">
      <title>Septic-Tank Nepal | Professional Drainage, Septic Tank & Plumbing Services in Kathmandu Valley</title>
      <meta
        name="description"
        content="Fast, reliable septic tank pumping, drain cleaning, sewage line unclogging, and 24/7 plumbing emergency service across Kathmandu, Lalitpur, and Bhaktapur."
      />
      <link rel="canonical" href={siteUrl} />
      
      {/* OpenGraph Tags */}
      <meta property="og:title" content="Septic-Tank Nepal | 24/7 Drainage, Septic Tank & Plumbing Solutions" />
      <meta property="og:description" content="Fast, reliable septic tank pumping, drain cleaning, sewage line unclogging, and 24/7 plumbing emergency service across Kathmandu, Lalitpur, and Bhaktapur." />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${siteUrl}/images/cleaingservicehomepage.jpeg`} />
      <meta property="og:image:alt" content="Septic-Tank Nepal Professional Services" />
      <meta property="og:site_name" content="Septic-Tank Nepal" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Septic-Tank Nepal | 24/7 Drainage, Septic Tank & Plumbing Solutions" />
      <meta name="twitter:description" content="Fast, reliable septic tank pumping, drain cleaning, sewage line unclogging, and 24/7 emergency service in Kathmandu Valley." />
      <meta name="twitter:image" content={`${siteUrl}/images/cleaingservicehomepage.jpeg`} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <LocalBusinessSchema company={company} />

      {/* Navigation Shell */}
      <Navbar />
      <MobileHeader
        onMenuToggle={() => setMobileNavOpen(true)}
      />
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Where We Work Bento Section */}
      <WhereWeWorkSection />

      {/* Immediate Help Banner */}
      <section className="w-full bg-[#f1f5f9] py-12 border-b border-[#cbd5e1]">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <h2 className="text-[24px] font-bold text-[#0f172a] mb-6">
            Need immediate help?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white h-14 px-8 rounded-xl flex items-center justify-center gap-2 text-[15px] font-bold transition-all shadow-sm min-w-[220px] active:scale-95"
              >
                <span className="material-symbols-outlined">chat</span>
                <span>Chat via WhatsApp</span>
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white h-14 px-8 rounded-xl flex items-center justify-center gap-2 text-[15px] font-bold transition-all shadow-sm min-w-[220px] active:scale-95"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  call
                </span>
                <span>Call Directly</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Expert Solutions Service Cards */}
      <section className="w-full bg-[#f8fafc] py-16 border-b border-[#cbd5e1]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-[28px] md:text-[40px] font-bold text-[#0f172a] mb-3">
              Expert Solutions for Every Drainage Problem
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#475569] max-w-[650px] mx-auto leading-relaxed">
              We specialize in reliable, fast, and hygienic drainage solutions tailored to both residential homes and commercial establishments across the Valley.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-[#cbd5e1] rounded-2xl overflow-hidden shadow-sm h-full flex flex-col animate-pulse">
                  <div className="h-48 w-full bg-slate-200" />
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
                      <div className="h-4 w-full bg-slate-200 rounded" />
                      <div className="h-4 w-5/6 bg-slate-200 rounded" />
                    </div>
                    <div className="pt-4 border-t border-[#cbd5e1] flex justify-between items-center">
                      <div className="h-9 w-28 bg-slate-200 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center flex justify-center">
            <Link
              href="/services"
              className="bg-[#0b1e3b] hover:bg-[#1d4ed8] text-white h-14 px-8 rounded-xl flex items-center justify-center gap-2 text-[15px] font-bold transition-colors shadow-sm"
            >
              <span>See More Services</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Ready to Solve CTA Banner */}
      <WhatsAppCtaSection />

      {/* Customer Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Footer & Floating CTAs */}
      <Footer />
      <MobileActionBar />
      <FloatingButtons />
    </div>
  );
}
