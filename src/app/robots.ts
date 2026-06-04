import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/utils/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  }
}
