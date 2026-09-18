import React from 'react';
import { CompanyDetails, Service } from '@/types';

interface ServicesCatalogSchemaProps {
  services: Service[];
  company?: CompanyDetails | null;
}

export default function ServicesCatalogSchema({
  services,
  company,
}: ServicesCatalogSchemaProps) {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np'
  ).replace(/\/+$/, '');

  let companyName = 'Septic-Tank Nepal';
  let phone = '+977 9841169351';

  if (company) {
    if (company.company_name) {
      companyName = company.company_name;
    }
    if (company.emergency_phone) {
      phone = company.emergency_phone;
    }
  }

  const itemListElements = services.map((service, index) => {
    const serviceUrl = `${siteUrl}/services/${service.slug}`;
    let imageUrl: string | null = null;
    if (service.cover_image) {
      imageUrl = service.cover_image.startsWith('http')
        ? service.cover_image
        : `${siteUrl}${service.cover_image.startsWith('/') ? '' : '/'}${service.cover_image}`;
    }

    const item: Record<string, any> = {
      '@type': 'Service',
      '@id': `${serviceUrl}#service`,
      name: service.title,
      description: service.short_description
        ? service.short_description
        : service.title,
      url: serviceUrl,
      category: service.category,
      provider: {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#organization`,
        name: companyName,
        telephone: phone,
        url: siteUrl,
      },
      areaServed: [
        { '@type': 'City', name: 'Kathmandu' },
        { '@type': 'City', name: 'Lalitpur' },
        { '@type': 'City', name: 'Bhaktapur' },
        { '@type': 'City', name: 'Kirtipur' },
        { '@type': 'AdministrativeArea', name: 'Kathmandu Valley' },
      ],
    };

    if (imageUrl) {
      item.image = imageUrl;
    }

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: item,
    };
  });

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/services#webpage`,
        url: `${siteUrl}/services`,
        name: 'Professional Drainage, Septic Tank, Plumbing & Boring Services in Kathmandu Valley',
        description:
          'Explore our complete range of expert drainage, septic tank, plumbing and boring services across Kathmandu Valley, including Kathmandu, Bhaktapur, Lalitpur and Kirtipur.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          url: siteUrl,
          name: companyName,
        },
        breadcrumb: {
          '@id': `${siteUrl}/services#breadcrumb`,
        },
        mainEntity: {
          '@id': `${siteUrl}/services#itemlist`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/services#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: `${siteUrl}/services`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/services#itemlist`,
        name: 'Our Professional Services',
        description:
          'Comprehensive list of drainage unclogging, septic tank pumping, pipe inspection, and plumbing services in Kathmandu Valley.',
        numberOfItems: services.length,
        itemListElement: itemListElements,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}
