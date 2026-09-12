import React from 'react';
import { CompanyDetails, Blog } from '@/types';

interface BlogDetailSchemaProps {
  blog: Blog;
  company?: CompanyDetails | null;
}

export default function BlogDetailSchema({
  blog,
  company,
}: BlogDetailSchemaProps) {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np'
  ).replace(/\/+$/, '');

  let companyName = 'Septic-Tank Nepal';
  let companyLogo: string | null = null;

  if (company) {
    if (company.company_name) {
      companyName = company.company_name;
    }
    if (company.logo_url) {
      companyLogo = company.logo_url.startsWith('http')
        ? company.logo_url
        : `${siteUrl}${company.logo_url.startsWith('/') ? '' : '/'}${company.logo_url}`;
    }
  }

  const blogUrl = `${siteUrl}/blog/${blog.slug}`;

  // Image URL formatting
  let imageUrl: string | null = null;
  if (blog.cover_image) {
    imageUrl = blog.cover_image.startsWith('http')
      ? blog.cover_image
      : `${siteUrl}${blog.cover_image.startsWith('/') ? '' : '/'}${blog.cover_image}`;
  }

  // Plain-text content extraction for articleBody and wordCount
  const cleanBodyText = blog.content
    ? blog.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : '';
  const wordCount = cleanBodyText ? cleanBodyText.split(/\s+/).length : undefined;

  // 1. Primary BlogPosting Schema
  const blogPostingEntity: Record<string, any> = {
    '@type': 'BlogPosting',
    '@id': `${blogUrl}#article`,
    headline: blog.title,
    description: blog.excerpt
      ? blog.excerpt
      : blog.meta_description
      ? blog.meta_description
      : blog.title,
    url: blogUrl,
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${blogUrl}#webpage`,
    },
    author: {
      '@type': 'Person',
      name: blog.author ? blog.author : companyName,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: companyName,
      ...(companyLogo ? { logo: { '@type': 'ImageObject', url: companyLogo } } : {}),
    },
  };

  if (imageUrl) {
    blogPostingEntity.image = {
      '@type': 'ImageObject',
      url: imageUrl,
      ...(blog.cover_image_alt ? { caption: blog.cover_image_alt } : {}),
    };
  }

  if (blog.published_at) {
    blogPostingEntity.datePublished = blog.published_at;
  } else if (blog.created_at) {
    blogPostingEntity.datePublished = blog.created_at;
  }

  if (blog.updated_at) {
    blogPostingEntity.dateModified = blog.updated_at;
  } else if (blog.published_at) {
    blogPostingEntity.dateModified = blog.published_at;
  }

  if (blog.category) {
    blogPostingEntity.articleSection = blog.category;
  }

  if (cleanBodyText) {
    blogPostingEntity.articleBody = cleanBodyText;
  }

  if (wordCount && wordCount > 0) {
    blogPostingEntity.wordCount = wordCount;
  }

  // 2. WebPage Schema
  const webPageEntity: Record<string, any> = {
    '@type': 'WebPage',
    '@id': `${blogUrl}#webpage`,
    url: blogUrl,
    name: blog.meta_title
      ? blog.meta_title
      : `${blog.title} | ${companyName}`,
    description: blog.meta_description
      ? blog.meta_description
      : blog.excerpt
      ? blog.excerpt
      : blog.title,
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
      '@id': `${blogUrl}#breadcrumb`,
    },
    mainEntity: {
      '@id': `${blogUrl}#article`,
    },
  };

  // 3. BreadcrumbList Schema (3-step)
  const breadcrumbEntity = {
    '@type': 'BreadcrumbList',
    '@id': `${blogUrl}#breadcrumb`,
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
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: blogUrl,
      },
    ],
  };

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [webPageEntity, breadcrumbEntity, blogPostingEntity],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
