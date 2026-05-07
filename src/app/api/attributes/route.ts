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
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };

    // 1. Fetch all top-level categories
    const catResponse = await fetch(`${API_URL}/products/categories?per_page=100&parent=0&hide_empty=true`, {
      headers,
      next: { revalidate: 3600 }
    });
    const categories = await catResponse.json();

    // 2. Fetch all attributes
    const attrResponse = await fetch(`${API_URL}/products/attributes?per_page=100`, {
      headers,
      next: { revalidate: 3600 }
    });
    const attributes = await attrResponse.json();

    // 3. For each category, find the matching attribute by name and fetch its terms
    const menuData = await Promise.all(categories.map(async (cat: any) => {
      // Find matching attribute (case insensitive)
      const matchingAttr = attributes.find((attr: any) => 
        attr.name.toLowerCase().includes(cat.name.toLowerCase()) || 
        cat.name.toLowerCase().includes(attr.name.toLowerCase())
      );

      let terms = [];
      if (matchingAttr) {
        const termsResponse = await fetch(`${API_URL}/products/attributes/${matchingAttr.id}/terms?per_page=100`, {
          headers,
          next: { revalidate: 3600 }
        });
        if (termsResponse.ok) {
          const termsData = await termsResponse.json();
          terms = termsData.map((t: any) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            description: t.description
          }));
        }
      }

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        terms: terms
      };
    }));

    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
