import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/utils/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE = SITE_CONFIG.url

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/solutions`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/industries`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/clients`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/resources`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/resources/blog`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${BASE}/resources/case-studies`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/resources/faqs`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/resources/catalogs`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/custom-solutions`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
