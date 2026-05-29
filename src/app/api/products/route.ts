import { NextResponse } from 'next/server'
import { WOOCOMMERCE_CONFIG } from '@/lib/utils/constants'

const {
  baseUrl: WOOCOMMERCE_URL_BASE,
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
} = WOOCOMMERCE_CONFIG

const PRODUCTS_URL = `${WOOCOMMERCE_URL_BASE}/products`
const CACHE_SECONDS = 0

export const dynamic = 'force-dynamic'

function wooHeaders() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')

  return {
    Authorization: `Basic ${auth}`,
    'Content-Type': 'application/json',
  }
}

function clampNumber(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, Math.floor(parsed)))
}

async function findCategoryId(category: string, headers: HeadersInit) {
  if (/^\d+$/.test(category)) return category

  const params = new URLSearchParams({
    per_page: '100',
    hide_empty: 'false',
    search: category,
  })

  const response = await fetch(`${WOOCOMMERCE_URL_BASE}/products/categories?${params}`, {
    headers,
    cache: 'no-store',
  })

  if (!response.ok) return null

  const categories = await response.json()
  const normalized = category.toLowerCase()
  const match = Array.isArray(categories)
    ? categories.find(
      (cat) =>
        cat.slug?.toLowerCase() === normalized ||
        cat.name?.toLowerCase() === normalized ||
        cat.name?.toLowerCase().replace(/&amp;/g, '&') === normalized
    )
    : null

  return match?.id ? String(match.id) : null
}

async function findAttributeFilter(terms: string[], headers: HeadersInit) {
  const cleanTerms = terms.map((term) => term.trim()).filter(Boolean)
  if (cleanTerms.length === 0) return null

  const attrResponse = await fetch(`${WOOCOMMERCE_URL_BASE}/products/attributes?per_page=100`, {
    headers,
    cache: 'no-store',
  })

  if (!attrResponse.ok) return null

  const attributes = await attrResponse.json()
  if (!Array.isArray(attributes)) return null

  for (const attr of attributes) {
    const termsResponse = await fetch(
      `${WOOCOMMERCE_URL_BASE}/products/attributes/${attr.id}/terms?per_page=100`,
      {
        headers,
        cache: 'no-store',
      }
    )

    if (!termsResponse.ok) continue

    const attrTerms = await termsResponse.json()
    if (!Array.isArray(attrTerms)) continue

    const matches = cleanTerms
      .map((selectedTerm) => {
        const normalized = selectedTerm.toLowerCase()
        return attrTerms.find(
          (term) =>
            term.slug?.toLowerCase() === normalized ||
            term.name?.toLowerCase() === normalized ||
            term.name?.toLowerCase().replace(/&amp;/g, '&') === normalized
        )
      })
      .filter(Boolean)

    if (matches.length > 0) {
      return {
        attribute: attr.slug,
        attributeTerm: matches.map((term) => String(term.id)).join(','),
      }
    }
  }

  return null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const isInitial = searchParams.get('initial') === 'true'
  const page = clampNumber(searchParams.get('page'), 1, 1, 9999)
  const perPage = isInitial
    ? 6
    : clampNumber(searchParams.get('per_page'), searchParams.has('page') ? 9 : 12, 1, 100)
  const search = searchParams.get('search')?.trim()
  const category = searchParams.get('category')?.trim()
  const featured = searchParams.get('featured') === 'true'
  const terms = (searchParams.get('terms') || searchParams.get('term') || '')
    .split(',')
    .map((term) => decodeURIComponent(term))
    .filter(Boolean)

  try {
    const headers = wooHeaders()

    if (id) {
      const response = await fetch(`${PRODUCTS_URL}/${id}`, {
        headers,
        cache: 'no-store',
      })

      if (!response.ok) throw new Error(`WooCommerce API Error: ${response.statusText}`)

      const product = await response.json()
      if (product?.status !== 'publish') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      return NextResponse.json(product)
    }

    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      status: 'publish',
    })

    if (search) params.set('search', search)
    if (featured) params.set('featured', 'true')

    if (category) {
      const categoryId = await findCategoryId(category, headers)
      if (categoryId) params.set('category', categoryId)
    }

    const attrFilter = await findAttributeFilter(terms, headers)
    if (attrFilter) {
      params.set('attribute', attrFilter.attribute)
      params.set('attribute_term', attrFilter.attributeTerm)
    }

    const response = await fetch(`${PRODUCTS_URL}?${params}`, {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) throw new Error(`WooCommerce API Error: ${response.statusText}`)

    const products = await response.json()
    const total = Number(response.headers.get('x-wp-total') || products.length || 0)
    const totalPages = Number(response.headers.get('x-wp-totalpages') || 1)

    return NextResponse.json({
      products: Array.isArray(products) ? products : [],
      total,
      totalPages,
      page,
      perPage,
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
