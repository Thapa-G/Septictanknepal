import React from 'react';
import { CompanyDetails, Service } from '@/types';

interface ServiceDetailSchemaProps {
  service: Service;
  company?: CompanyDetails | null;
}

export default function ServiceDetailSchema({
  service,
  company,
}: ServiceDetailSchemaProps) {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np'
  ).replace(/\/+$/, '');

  let companyName = 'Septic-Tank Nepal';
  let phone = '+977 9706970481';

  if (company) {
    if (company.company_name) {
      companyName = company.company_name;
    }
    if (company.emergency_phone) {
      phone = company.emergency_phone;
    }
  }

  const serviceUrl = `${siteUrl}/services/${service.slug}`;

  // Image URL formatting
  let imageUrl: string | null = null;
  if (service.cover_image) {
    imageUrl = service.cover_image.startsWith('http')
      ? service.cover_image
      : `${siteUrl}${service.cover_image.startsWith('/') ? '' : '/'}${service.cover_image}`;
  }

  // Extract YouTube ID if present for VideoObject
  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match
      ? `https://www.youtube-nocookie.com/embed/${match[1]}`
      : null;
  };

  const videoEmbedUrl = getYouTubeEmbedUrl(service.video_url);

  // 1. Primary Service Entity Schema
  const serviceEntity: Record<string, any> = {
    '@type': 'Service',
    '@id': `${serviceUrl}#service`,
    name: service.title,
    headline: service.heading ? service.heading : service.title,
    description: service.meta_description
      ? service.meta_description
      : service.short_description
      ? service.short_description
      : service.title,
    url: serviceUrl,
    category: service.category,
    serviceType: service.category,
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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${serviceUrl}#webpage`,
    },
  };

  if (imageUrl) {
    serviceEntity.image = imageUrl;
  }

  // 2. WebPage Schema
  const webPageEntity: Record<string, any> = {
    '@type': 'WebPage',
    '@id': `${serviceUrl}#webpage`,
    url: serviceUrl,
    name: service.meta_title
      ? service.meta_title
      : service.heading
      ? service.heading
      : `${service.title} | ${companyName}`,
    description: service.meta_description
      ? service.meta_description
      : service.short_description
      ? service.short_description
      : service.title,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: companyName,
    },
    about: {
      '@id': `${siteUrl}/#organization`,
    },
    breadcrumb: {
      '@id': `${serviceUrl}#breadcrumb`,
    },
    mainEntity: {
      '@id': `${serviceUrl}#service`,
    },
  };

  // 3. BreadcrumbList Schema (3-step)
  const breadcrumbEntity = {
    '@type': 'BreadcrumbList',
    '@id': `${serviceUrl}#breadcrumb`,
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
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: serviceUrl,
      },
    ],
  };

  // Build the complete graph
  const graph: any[] = [webPageEntity, breadcrumbEntity, serviceEntity];

  // 4. FAQPage Schema (Conditional)
  if (service.faqs && service.faqs.length > 0) {
    const validFaqs = service.faqs.filter(
      (faq) => faq.question && faq.question.trim() && faq.answer && faq.answer.trim()
    );

    if (validFaqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${serviceUrl}#faq`,
        mainEntity: validFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question.trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer.trim(),
          },
        })),
      });
    }
  }

  // 5. VideoObject Schema (Conditional)
  if (videoEmbedUrl) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${serviceUrl}#video`,
      name: `${service.title} Video Demonstration`,
      description: service.short_description
        ? service.short_description
        : service.title,
      embedUrl: videoEmbedUrl,
      ...(imageUrl ? { thumbnailUrl: imageUrl } : {}),
      uploadDate: service.created_at || '2026-01-01T00:00:00Z',
    });
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
