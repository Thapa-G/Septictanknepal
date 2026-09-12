import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://omganeshayasarsafai.com.np').replace(/\/+$/, '');
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

  const now = new Date();

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Dynamic Services
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/services`, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const services = Array.isArray(data) ? data : data.data || [];

      servicePages = services
        .filter((service: { slug?: string; id?: number }) => Boolean(service.slug || service.id))
        .map((service: { slug?: string; id?: number; updated_at?: string; created_at?: string }) => ({
          url: `${siteUrl}/services/${service.slug || service.id}`,
          lastModified: service.updated_at
            ? new Date(service.updated_at)
            : service.created_at
            ? new Date(service.created_at)
            : now,
          changeFrequency: 'weekly' as const,
          priority: 0.85,
        }));
    }
  } catch (error) {
    console.error('[Sitemap] Failed to fetch services for dynamic sitemap:', error);
  }

  // 3. Dynamic Blogs
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/blogs?per_page=1000`, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const blogs = Array.isArray(data) ? data : data.data || [];

      blogPages = blogs
        .filter((blog: { slug?: string; id?: number }) => Boolean(blog.slug || blog.id))
        .map((blog: { slug?: string; id?: number; updated_at?: string; published_at?: string; created_at?: string }) => ({
          url: `${siteUrl}/blog/${blog.slug || blog.id}`,
          lastModified: blog.updated_at
            ? new Date(blog.updated_at)
            : blog.published_at
            ? new Date(blog.published_at)
            : blog.created_at
            ? new Date(blog.created_at)
            : now,
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }));
    }
  } catch (error) {
    console.error('[Sitemap] Failed to fetch blogs for dynamic sitemap:', error);
  }

  return [...staticPages, ...servicePages, ...blogPages];
}
