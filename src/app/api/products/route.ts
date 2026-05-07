import { NextResponse } from 'next/server'

const WOOCOMMERCE_URL = 'https://backend.itherm.co.in/wp-json/wc/v3/products'
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isInitial = searchParams.get('initial') === 'true'

  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    }

    // If initial load, only get 12 products for speed
    const perPage = isInitial ? '12' : '100'
    
    // We use a longer cache for products since they don't change often
    // 'force-cache' or a high revalidate number
    const res1 = await fetch(`${WOOCOMMERCE_URL}?per_page=${perPage}&page=1&status=publish`, { 
      headers,
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!res1.ok) throw new Error(`WooCommerce API Error: ${res1.statusText}`)
    const data1 = await res1.json()

    let allProducts = Array.isArray(data1) ? data1 : []

    // If not initial, get the second page as well
    if (!isInitial) {
      const res2 = await fetch(`${WOOCOMMERCE_URL}?per_page=100&page=2&status=publish`, { 
        headers,
        next: { revalidate: 86400 }
      })
      if (res2.ok) {
        const data2 = await res2.json()
        if (Array.isArray(data2)) allProducts = [...allProducts, ...data2]
      }
    }
    
    return NextResponse.json(allProducts)
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
