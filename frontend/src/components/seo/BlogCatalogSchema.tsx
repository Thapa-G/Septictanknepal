import React from 'react';
import { CompanyDetails, Blog } from '@/types';

interface BlogCatalogSchemaProps {
  blogs: Blog[];
  company?: CompanyDetails | null;
}

export default function BlogCatalogSchema({
  blogs,
  company,
}: BlogCatalogSchemaProps) {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np'
  ).replace(/\/+$/, '');

  let companyName = 'Septic-Tank Nepal';

  if (company) {
    if (company.company_name) {
      companyName = company.company_name;
    }
  }

  const itemListElements = blogs.map((blog, index) => {
    const blogUrl = `${siteUrl}/blog/${blog.slug}`;
    let imageUrl: string | null = null;
    if (blog.cover_image) {
      imageUrl = blog.cover_image.startsWith('http')
        ? blog.cover_image
        : `${siteUrl}${blog.cover_image.startsWith('/') ? '' : '/'}${blog.cover_image}`;
    }

    const item: Record<string, any> = {
      '@type': 'BlogPosting',
      '@id': `${blogUrl}#article`,
      headline: blog.title,
      description: blog.excerpt ? blog.excerpt : blog.title,
      url: blogUrl,
      author: {
        '@type': 'Person',
        name: blog.author || companyName,
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: companyName,
      },
    };

    if (imageUrl) {
      item.image = imageUrl;
    }

    if (blog.published_at) {
      item.datePublished = blog.published_at;
    }

    if (blog.category) {
      item.articleSection = blog.category;
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
        '@id': `${siteUrl}/blog#webpage`,
        url: `${siteUrl}/blog`,
        name: 'Expert Plumbing, Drainage & Septic Tank Insights',
        description:
          'Read the latest guides, tips, and insights on plumbing, drainage, septic tank maintenance, drain cleaning, sewage management, water boring, and well construction in Kathmandu Valley.',
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
          '@id': `${siteUrl}/blog#breadcrumb`,
        },
        mainEntity: {
          '@id': `${siteUrl}/blog#itemlist`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/blog#breadcrumb`,
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
            name: 'Blog',
            item: `${siteUrl}/blog`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/blog#itemlist`,
        name: 'Plumbing & Drainage Insights',
        description:
          'Latest articles, guides, and practical sanitation tips published by Septic-Tank Nepal.',
        numberOfItems: blogs.length,
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
