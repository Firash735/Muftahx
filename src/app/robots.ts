import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/owner-735', '/buyer/dashboard', '/seller/dashboard', '/signup/complete'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
