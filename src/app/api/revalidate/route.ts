import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Support both custom header x-revalidation-secret and query parameter secret
  const querySecret = request.nextUrl.searchParams.get('secret')
  const secret = request.headers.get('x-revalidation-secret') || querySecret

  if (!secret || secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Try to get body to extract tag if sent, but fall back if it is empty/malformed
    let tag = 'wordpress'
    try {
      const body = await request.json()
      if (body?.type) tag = body.type
    } catch {
      // Body might be empty or not JSON, which is fine
    }

    // Perform a clean sweep of all WooCommerce related cache tags
    revalidateTag('wordpress')
    revalidateTag('products')
    revalidateTag('categories')
    revalidateTag('attributes')
    
    // Also revalidate the specific tag if one was specified in the body type
    if (tag !== 'wordpress') {
      revalidateTag(tag)
    }

    return NextResponse.json({ revalidated: true, tags: ['wordpress', 'products', 'categories', 'attributes', tag] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Bad request' }, { status: 400 })
  }
}
