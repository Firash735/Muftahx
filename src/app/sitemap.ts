import type { MetadataRoute } from 'next';
import { knowledgeArticles, products } from '@/lib/marketData';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = siteUrl;
  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/knowledge`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/support`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...products.map(product => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...knowledgeArticles.map(article => ({
      url: `${baseUrl}/knowledge/${article.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}
