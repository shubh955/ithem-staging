import { NextResponse } from 'next/server';

export async function GET() {
  const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.itherm.co.in/wp-json/wc/v3';

  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    return NextResponse.json({ error: 'WooCommerce credentials not configured' }, { status: 500 });
  }

  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await fetch(`${API_URL}/products/categories?per_page=100&hide_empty=true`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600, tags: ['wordpress', 'categories'] }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `WooCommerce API error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
