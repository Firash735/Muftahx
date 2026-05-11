import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/owner-735'],
    },
    sitemap: 'https://muftahx.com/sitemap.xml',
  };
}
