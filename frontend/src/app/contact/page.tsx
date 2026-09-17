'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileNav from '@/components/layout/MobileNav';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import ContactForm from '@/components/forms/ContactForm';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import { useCompany } from '@/context/CompanyContext';

import { DEFAULT_COMPANY } from '@/config/company';

export default function ContactPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { company } = useCompany();

  const phone = company?.emergency_phone || DEFAULT_COMPANY.emergency_phone;
  const whatsapp = company?.whatsapp_number || DEFAULT_COMPANY.whatsapp_number;
  const address = company?.address || DEFAULT_COMPANY.address;
  const operatingHours = company?.operating_hours || DEFAULT_COMPANY.operating_hours;
  const companyName = company?.company_name || DEFAULT_COMPANY.company_name;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np').replace(/\/+$/, '');

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] pb-18 md:pb-0">
      <title>Contact Us | Septic-Tank Nepal</title>
      <meta
        name="description"
        content="Contact Septic-Tank Nepal for 24/7 emergency septic tank pumping, drain cleaning, sewage line unclogging, and plumbing services across Kathmandu Valley."
      />
      <link rel="canonical" href={`${siteUrl}/contact`} />

      {/* OpenGraph Tags */}
      <meta property="og:title" content="Contact Septic-Tank Nepal | 24/7 Sanitation & Plumbing Services" />
      <meta property="og:description" content="Reach our rapid response team 24/7 for septic tank pumping, drain cleaning, and plumbing emergencies across Kathmandu Valley." />
      <meta property="og:url" content={`${siteUrl}/contact`} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${siteUrl}/images/cleaingservicehomepage.jpeg`} />
      <meta property="og:site_name" content="Septic-Tank Nepal" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Contact Septic-Tank Nepal" />
      <meta name="twitter:description" content="24/7 emergency drainage, septic tank cleaning, and plumbing booking in Kathmandu Valley." />
      <meta name="twitter:image" content={`${siteUrl}/images/cleaingservicehomepage.jpeg`} />

      <LocalBusinessSchema company={company} />

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
        {/* Header Hero */}
        <section className="mb-10 text-center bg-[#f1f5f9] p-8 md:p-12 rounded-2xl border border-[#cbd5e1]">
          <h1 className="text-[32px] md:text-[44px] font-bold text-[#0f172a] mb-3">
            Contact {companyName}
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Have a question or need emergency drainage services? Reach out to our 24/7 team in Kathmandu Valley.
          </p>
        </section>

        {/* 2-Column Split: Direct Contact Cards vs Send Message Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left Column: Direct Info Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Emergency Phone Card */}
            <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 p-6 rounded-2xl flex items-start gap-4 shadow-sm min-h-[120px]">
              <div className="w-12 h-12 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  emergency
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-[#93000a] mb-1">Emergency Call</h3>
                <p className="text-[13px] text-[#93000a]/80 mb-2">Available 24/7 in Kathmandu Valley</p>
                {phone ? (
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                    className="text-[20px] font-bold text-[#ba1a1a] hover:underline block"
                  >
                    {phone}
                  </a>
                ) : (
                  <div className="h-7 w-44 bg-red-200/80 rounded-md animate-pulse mt-1" />
                )}
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-[#e6f4ea] border border-[#25D366]/40 p-6 rounded-2xl flex items-start gap-4 shadow-sm min-h-[120px]">
              <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  chat
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-[#005322] mb-1">WhatsApp Chat</h3>
                <p className="text-[13px] text-[#005322]/80 mb-3">Instant booking & live photo inspection</p>
                <a
                  href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#'}
                  target={whatsapp ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-block bg-[#25D366] text-white px-4 py-2 rounded-xl font-bold text-[14px] hover:bg-[#005322] transition-colors shadow-sm"
                >
                  Chat with Expert
                </a>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="bg-white border border-[#cbd5e1] p-6 rounded-2xl flex flex-col gap-4 shadow-sm flex-grow justify-center">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#1d4ed8] text-[24px] mt-0.5">
                  location_on
                </span>
                <div className="flex-1">
                  <h4 className="text-[15px] font-bold text-[#0f172a]">Main Workshop / Office</h4>
                  {address ? (
                    <p className="text-[14px] text-[#475569] mt-0.5 leading-relaxed">
                      {address}
                    </p>
                  ) : (
                    <div className="h-5 w-48 bg-[#e2e8f0] rounded-md animate-pulse mt-1" />
                  )}
                </div>
              </div>

              <div className="border-t border-[#cbd5e1] pt-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#1d4ed8] text-[24px] mt-0.5">
                  schedule
                </span>
                <div className="flex-1">
                  <h4 className="text-[15px] font-bold text-[#0f172a]">Operating Hours</h4>
                  <p className="text-[14px] text-[#475569] mt-0.5">
                    {operatingHours || '4:00 AM – 9:00 PM, 365 days a year'}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#cbd5e1] pt-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#1d4ed8] text-[24px] mt-0.5">
                  mail
                </span>
                <div className="flex-1">
                  <h4 className="text-[15px] font-bold text-[#0f172a]">Email Us</h4>
                  <a
                    href="mailto:nepalseptictank@gmail.com"
                    className="text-[14px] text-[#1d4ed8] hover:underline font-semibold mt-0.5 block break-all"
                  >
                    nepalseptictank@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* Lower Row: Scan to Review (Left 5 cols) & Google Maps (Right 7 cols below Inquiry Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          {/* Scan to Review Section (5 cols - beside the map) */}
          <div className="lg:col-span-5 flex flex-col">
            {company?.review_image_url ? (
              <div className="bg-white border border-[#cbd5e1] p-6 rounded-2xl flex flex-col items-center text-center shadow-sm h-full justify-center">
                <h3 className="text-[16px] font-bold text-[#1d4ed8] uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                  <span>Scan to Review</span>
                </h3>

                <div className="w-full max-w-[340px] bg-[#f8fafc] border border-[#cbd5e1] rounded-2xl overflow-hidden p-3 shadow-xs flex items-center justify-center">
                  <img
                    src={company.review_image_url}
                    alt={company.review_image_alt || 'Scan to Review'}
                    className="w-full h-auto max-h-[380px] object-contain rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#cbd5e1] p-6 rounded-2xl flex flex-col items-center justify-center text-center text-[#64748b] h-full min-h-[280px] shadow-sm">
                <span className="material-symbols-outlined text-4xl text-[#1d4ed8] mb-2">
                  verified
                </span>
                <h4 className="text-[16px] font-bold text-[#0f172a] mb-1">Trusted Sanitation Experts</h4>
                <p className="text-[13px] text-[#475569] max-w-xs">24/7 Professional drainage and septic tank services across Kathmandu Valley.</p>
              </div>
            )}
          </div>

          {/* Interactive Location Google Maps Section (7 cols - directly below Inquiry section) */}
          <div className="lg:col-span-7 flex flex-col">
            <section className="bg-[#f1f5f9] p-6 md:p-8 rounded-2xl border border-[#cbd5e1] flex flex-col flex-grow h-full shadow-sm">
              <h2 className="text-[20px] font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1d4ed8]">pin_drop</span>
                <span>Find Our Headquarters</span>
              </h2>
              <div className="w-full flex-grow min-h-[320px] md:min-h-[360px] rounded-xl overflow-hidden border border-[#cbd5e1] shadow-inner bg-[#e2e8f0]">
                <iframe
                  title="Septic Tank Nepal Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7066.447341036514!2d85.33855944656375!3d27.679481040356826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19ec5d899bf5%3A0x4212a4caa6dfd743!2sM8HR%2BP86%2C%2032%20Ward%2C%20Kathmandu%2C%20Bagmati%20Province%2044600!5e0!3m2!1sen!2snp!4v1788428225539!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>
        </div>

        {/* Service Areas Banner */}
        <section className="bg-[#0b1e3b] text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="text-[20px] font-bold text-white mb-1">Serving All Areas of Kathmandu Valley</h3>
            <p className="text-[#94a3b8] text-[14px]">
              Kathmandu • Bhaktapur • Lalitpur • Kritipur and Nearby Areas
            </p>
          </div>
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-3 rounded-xl font-bold text-[14px] transition-colors whitespace-nowrap shadow-md"
          >
            Call for Immediate Dispatch
          </a>
        </section>
      </main>

      <Footer />
      <MobileActionBar />
      <FloatingButtons />
    </div>
  );
}
