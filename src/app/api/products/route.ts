import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { WOOCOMMERCE_CONFIG } from '@/lib/utils/constants'

const {
  baseUrl: WOOCOMMERCE_URL_BASE,
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
} = WOOCOMMERCE_CONFIG

const PRODUCTS_URL = `${WOOCOMMERCE_URL_BASE}/products`
const CACHE_SECONDS = 30

export const dynamic = 'force-dynamic'

type WooCategory = {
  id: number
  name?: string
  slug?: string
}

type WooAttribute = {
  id: number
  name?: string
  slug?: string
}

type WooTerm = {
  id: number
  name?: string
  slug?: string
}

let categoriesCache: Promise<WooCategory[]> | null = null
let attributesCache: Promise<WooAttribute[]> | null = null
const attributeTermsCache = new Map<number, Promise<WooTerm[]>>()

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

function cleanProductData(data: any): any {
  if (typeof data === 'string') {
    return data.replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  }
  if (Array.isArray(data)) {
    return data.map((item) => cleanProductData(item))
  }
  if (data !== null && typeof data === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (['description', 'short_description', 'src', 'href'].includes(key)) {
        cleaned[key] = value
      } else {
        cleaned[key] = cleanProductData(value)
      }
    }
    return cleaned
  }
  return data
}

async function findCategoryId(category: string, headers: HeadersInit) {
  if (/^\d+$/.test(category)) return category

  const categories = await getCategories(headers)
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

async function fetchWooCollection<T>(url: string, headers: HeadersInit) {
  const items: T[] = []
  let page = 1
  let totalPages = 1

  do {
    const separator = url.includes('?') ? '&' : '?'
    const response = await fetch(`${url}${separator}per_page=100&page=${page}`, {
      headers,
      next: { revalidate: CACHE_SECONDS, tags: ['wordpress', 'products'] },
    })

    if (!response.ok) break

    const data = await response.json()
    if (Array.isArray(data)) items.push(...data)

    totalPages = Number(response.headers.get('x-wp-totalpages') || 1)
    page += 1
  } while (page <= totalPages)

  return items
}

function getCategories(headers: HeadersInit) {
  if (!categoriesCache) {
    categoriesCache = fetchWooCollection<WooCategory>(
      `${WOOCOMMERCE_URL_BASE}/products/categories?hide_empty=false`,
      headers
    )
  }

  return categoriesCache
}

function getAttributes(headers: HeadersInit) {
  if (!attributesCache) {
    attributesCache = fetchWooCollection<WooAttribute>(`${WOOCOMMERCE_URL_BASE}/products/attributes`, headers)
  }

  return attributesCache
}

function getAttributeTerms(attributeId: number, headers: HeadersInit) {
  const cached = attributeTermsCache.get(attributeId)
  if (cached) return cached

  const request = fetchWooCollection<WooTerm>(
    `${WOOCOMMERCE_URL_BASE}/products/attributes/${attributeId}/terms`,
    headers
  )

  attributeTermsCache.set(attributeId, request)
  return request
}

async function findAttributeFilter(terms: string[], headers: HeadersInit) {
  const cleanTerms = terms.map((term) => term.trim()).filter(Boolean)
  if (cleanTerms.length === 0) return null

  const attributes = await getAttributes(headers)
  if (!Array.isArray(attributes)) return null

  for (const attr of attributes) {
    if (!attr.slug) continue

    const attrTerms = await getAttributeTerms(attr.id, headers)
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
      .filter((term): term is WooTerm => Boolean(term))

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
  const fetchAll = searchParams.get('all') === 'true'
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
    const bypass = searchParams.get('revalidate') === 'true' ||
                   request.headers.get('cache-control') === 'no-cache' ||
                   request.headers.get('pragma') === 'no-cache';

    if (bypass) {
      revalidateTag('wordpress')
      revalidateTag('products')
      if (id) {
        revalidateTag(`product-${id}`)
      }
    }

    const headers = wooHeaders()

    if (id) {
      const response = await fetch(`${PRODUCTS_URL}/${id}`, {
        headers,
        next: { revalidate: CACHE_SECONDS, tags: ['wordpress', 'products', `product-${id}`] },
      })

      if (!response.ok) throw new Error(`WooCommerce API Error: ${response.statusText}`)

      const product = await response.json()
      if (product?.status !== 'publish') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      return NextResponse.json(cleanProductData(product))
    }

    const params = new URLSearchParams({
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

    if (fetchAll) {
      const products = await fetchWooCollection<any>(`${PRODUCTS_URL}?${params}`, headers)

      return NextResponse.json({
        products: cleanProductData(products),
        total: products.length,
        totalPages: Math.max(1, Math.ceil(products.length / perPage)),
        page,
        perPage,
      })
    }

    params.set('per_page', String(perPage))
    params.set('page', String(page))

    const response = await fetch(`${PRODUCTS_URL}?${params}`, {
      headers,
      next: { revalidate: CACHE_SECONDS, tags: ['wordpress', 'products'] },
    })

    if (!response.ok) throw new Error(`WooCommerce API Error: ${response.statusText}`)

    const products = await response.json()
    const total = Number(response.headers.get('x-wp-total') || products.length || 0)
    const totalPages = Number(response.headers.get('x-wp-totalpages') || 1)

    return NextResponse.json({
      products: cleanProductData(Array.isArray(products) ? products : []),
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
