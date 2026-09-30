'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileNav from '@/components/layout/MobileNav';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import ServiceCard from '@/components/cards/ServiceCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import ServicesCatalogSchema from '@/components/seo/ServicesCatalogSchema';
import { servicesService } from '@/services/servicesService';
import { useCompany } from '@/context/CompanyContext';
import { Service } from '@/types';

import { DEFAULT_COMPANY } from '@/config/company';

export default function ServicesPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useCompany();

  useEffect(() => {
    async function loadData() {
      try {
        const servicesRes = await servicesService.getAll();
        if (Array.isArray(servicesRes)) {
          setServices(servicesRes);
        } else if (servicesRes && (servicesRes as any).data) {
          setServices((servicesRes as any).data);
        }
      } catch (err) {
        console.error('Error loading services page data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const phone = company?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const whatsapp = company?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np').replace(/\/+$/, '');

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] pb-18 md:pb-0">
      <title>24/7 Professional Drainage, Septic Tank, Plumbing & Boring Services in Kathmandu Valley</title>
      <meta
        name="description"
        content="Explore our complete range of expert drainage, septic tank, plumbing and boring 24/7 services across Kathmandu Valley, including Kathmandu, Bhaktapur, Lalitpur and Kirtipur."
      />
      <link rel="canonical" href={`${siteUrl}/services`} />

      {/* OpenGraph Tags */}
      <meta property="og:title" content="24/7 Professional Drainage, Septic Tank & Plumbing Services in Kathmandu Valley" />
      <meta property="og:description" content="Explore our complete range of expert drainage, septic tank, plumbing and boring 24/7 services across Kathmandu, Bhaktapur, Lalitpur and Kirtipur." />
      <meta property="og:url" content={`${siteUrl}/services`} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${siteUrl}/images/cleaingservicehomepage.jpeg`} />
      <meta property="og:image:alt" content="Our Professional Drainage & Plumbing Services" />
      <meta property="og:site_name" content="Septic-Tank Nepal" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Professional Drainage, Septic Tank & Plumbing Services in Kathmandu Valley" />
      <meta name="twitter:description" content="Explore our complete range of expert drainage, septic tank, plumbing and boring services across Kathmandu Valley." />
      <meta name="twitter:image" content={`${siteUrl}/images/cleaingservicehomepage.jpeg`} />

      <LocalBusinessSchema company={company} />
      <ServicesCatalogSchema services={services} company={company} />

      {/* Navigation */}
      <Navbar />
      <MobileHeader
        onMenuToggle={() => setMobileNavOpen(true)}
      />
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <main className="flex-grow pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="px-5 py-12 md:py-16 max-w-[1200px] mx-auto text-center bg-[#f1f5f9] rounded-2xl border border-[#cbd5e1] mb-12">
          <h1 className="text-[30px] md:text-[44px] font-bold text-[#0f172a] mb-4">
            24/7 Professional Drainage, Septic Tank, Plumbing & Boring Services in Kathmandu Valley
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#475569] max-w-2xl mx-auto leading-relaxed">
            We provide comprehensive solutions for residential, commercial, and industrial properties in Kathmandu Valley. We combine technical expertise with advanced high-pressure technology to guarantee clean, durable results.
          </p>
        </section>

        {/* Services Bento Grid */}
        <section className="px-5 max-w-[1200px] mx-auto bg-[#f1f5f9] rounded-2xl border border-[#cbd5e1] mb-16 py-8">
          <div className="mb-8 flex justify-between items-end border-b border-[#cbd5e1] pb-4">
            <div>
              <h2 className="text-[24px] font-bold text-[#0f172a]">Our Core Services</h2>
              <p className="text-[14px] text-[#475569] mt-1">
                Specialized technical solutions for every Drainage, Plumbing and Water related problems.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
              {services.map((service, index) => {
                const isWide = service.slug === 'hydro-jetting' || (index === 3 && services.length >= 4);
                return <ServiceCard key={service.id} service={service} isWide={isWide} />;
              })}
            </div>
          )}
        </section>

        {/* Pricing & Area Context */}
        <section className="px-5 max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8 pb-16">
          {/* Transparent Pricing */}
          <div className="flex-1 bg-white border border-[#cbd5e1] rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-sm">
            <span className="material-symbols-outlined text-[#1d4ed8] text-5xl mb-4">
              request_quote
            </span>
            <h3 className="text-[22px] font-bold text-[#0f172a] mb-2">
              Transparent Pricing
            </h3>
            <p className="text-[#475569] text-[15px] mb-6 max-w-md">
              Every drainage issue is unique. We provide expert level honest site assessments with upfront itemized quotes without hidden fees.
            </p>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined">chat</span>
              <span>Chat via WhatsApp</span>
            </a>
          </div>

          {/* Service Area Coverage */}
          <div className="flex-1 bg-[#0b1e3b] text-white rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center shadow-sm">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 100% 100%, #ffffff 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <div className="relative z-10 flex flex-col h-full justify-center">
              <span className="material-symbols-outlined text-[#38bdf8] text-5xl mb-4">
                map
              </span>
              <h3 className="text-[22px] font-bold text-white mb-3">
                Service Area Coverage
              </h3>
              <p className="text-[#94a3b8] text-[15px] mb-6 leading-relaxed">
                We deploy rapid response teams across major area of Kathmandu metropolitan and surrounding regions in Nepal with fully equipped trucks.
              </p>
              <ul className="grid grid-cols-2 gap-2 text-[14px] font-semibold text-[#e2e8f0]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#38bdf8]">check_circle</span>
                  Kathmandu
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#38bdf8]">check_circle</span>
                  Bhaktapur
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#38bdf8]">check_circle</span>
                  Lalitpur
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#38bdf8]">check_circle</span>
                  Thali
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#38bdf8]">check_circle</span>
                  Gokarneshwor
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#38bdf8]">check_circle</span>
                  Boudha
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer & Mobile Navs */}
      <Footer />
      <MobileActionBar />
      <FloatingButtons />
    </div>
  );
}
