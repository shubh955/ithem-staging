import type { MetadataRoute } from 'next'
import { SITE_CONFIG, PRODUCT_CATEGORIES, INDUSTRIES } from '@/lib/utils/constants'

const BASE = SITE_CONFIG.url
const WP_API = `${process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://itherm.co.in/wp-json/wp/v2'}`
const WOO_API = `${process.env.NEXT_PUBLIC_API_URL ?? 'https://backend.itherm.co.in/wp-json/wc/v3'}`
const WOO_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY ?? ''
const WOO_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET ?? ''

async function fetchSlugs(url: string, headers?: HeadersInit): Promise<string[]> {
  try {
    const res = await fetch(url, { headers, next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map((item: any) => item.slug).filter(Boolean)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/products`,                    lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/about`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,                     lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/solutions`,                   lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/industries`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/clients`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/custom-solutions`,            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/featured-products`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/resources`,                   lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/resources/blog`,              lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/resources/case-studies`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/resources/faqs`,              lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/resources/catalogs`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/resources/guides`,            lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/datasheets`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/downloads`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/operating-manuals`,           lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // ── Product category pages (from constants) ───────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = PRODUCT_CATEGORIES.map((cat) => ({
    url: `${BASE}/products/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // ── Industry pages (from constants) ──────────────────────────────────────
  const industryPages: MetadataRoute.Sitemap = INDUSTRIES.map((ind) => ({
    url: `${BASE}/industries/${ind.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // ── Dynamic: WooCommerce products ─────────────────────────────────────────
  const wooAuth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64')
  const productSlugs = await fetchSlugs(
    `${WOO_API}/products?per_page=100&status=publish`,
    { Authorization: `Basic ${wooAuth}`, 'Content-Type': 'application/json' }
  )
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE}/products/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // ── Dynamic: WordPress solutions ──────────────────────────────────────────
  const solutionSlugs = await fetchSlugs(`${WP_API}/solutions?per_page=100`)
  const solutionPages: MetadataRoute.Sitemap = solutionSlugs.map((slug) => ({
    url: `${BASE}/solutions/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // ── Dynamic: WordPress blog posts ─────────────────────────────────────────
  const blogSlugs = await fetchSlugs(`${WP_API}/posts?per_page=100&status=publish`)
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE}/resources/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // ── Dynamic: WordPress case studies ───────────────────────────────────────
  const caseSlugs = await fetchSlugs(`${WP_API}/case-studies?per_page=100`)
  const casePages: MetadataRoute.Sitemap = caseSlugs.map((slug) => ({
    url: `${BASE}/resources/case-studies/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...industryPages,
    ...productPages,
    ...solutionPages,
    ...blogPages,
    ...casePages,
  ]
}
