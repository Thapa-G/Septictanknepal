import React from 'react';
import { CompanyDetails } from '@/types';

interface LocalBusinessSchemaProps {
  company?: CompanyDetails | null;
}

export default function LocalBusinessSchema({ company }: LocalBusinessSchemaProps) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np').replace(/\/+$/, '');
  const companyName = company?.company_name || 'Septic-Tank Nepal';
  const phone = company?.emergency_phone || '+977 9841169351';
  const whatsapp = company?.whatsapp_number || '9841169351';

  const address = company?.address || 'Kathmandu, Bagmati Province, Nepal';
  const lat = company?.latitude || 27.7172;
  const lng = company?.longitude || 85.324;
  const logo = company?.logo_url || `${siteUrl}/images/logo.jpg`;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: companyName,
    alternateName: 'Septic Tank Nepal Cleaning and Maintenance Service, Boring and Water Reserves Construction, and Drainage Service',
    url: siteUrl,
    logo: logo,
    image: logo,
    telephone: phone,
    priceRange: '$$',
    currenciesAccepted: 'NPR',
    paymentAccepted: ['Cash', 'eSewa', 'Khalti', 'Bank Transfer'],
    description: 'Professional 24/7 septic tank pumping and maintenance service, drain cleaning, drainage unclogging, sewage unblocking, pipe inspection, Boring and well construction plus plumbing emergency services across Kathmandu Valley.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Kathmandu',
      addressRegion: 'Bagmati Province',
      postalCode: '44600',
      addressCountry: 'NP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '04:00',
        closes: '21:00',
      },
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Kathmandu',
      },
      {
        '@type': 'City',
        name: 'Lalitpur',
      },
      {
        '@type': 'City',
        name: 'Bhaktapur',
      },
      {
        '@type': 'City',
        name: 'Kirtipur',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Kathmandu Valley',
      },
    ],
    sameAs: [
      whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : `https://wa.me/9841169351`,
    ].filter(Boolean),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: phone,
        contactType: 'emergency',
        areaServed: 'NP',
        availableLanguage: ['Nepali', 'English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: phone,
        contactType: 'customer support',
        areaServed: 'NP',
        availableLanguage: ['Nepali', 'English'],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
