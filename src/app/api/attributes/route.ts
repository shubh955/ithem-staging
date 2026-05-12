import { NextResponse } from 'next/server';
import { WOOCOMMERCE_CONFIG } from '@/lib/utils/constants';

export async function GET() {
  const { baseUrl: API_URL, consumerKey: CONSUMER_KEY, consumerSecret: CONSUMER_SECRET } = WOOCOMMERCE_CONFIG;

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

    // 3. For each category, find ALL matching attributes and merge their terms
    const menuData = await Promise.all(categories.map(async (cat: any) => {
      const normalizeMatch = (s: string) => (s || '').toLowerCase()
        .replace(/&amp;/g, '&')
        .replace(/multifunction/g, 'multifun')
        .replace(/[^a-z0-9]/g, '');
      
      const cleanCatName = normalizeMatch(cat.name);
      const catSlug = normalizeMatch(cat.slug);
      
      // Find matching attributes strictly
      const matchingAttrs = attributes.filter((attr: any) => {
        const cleanAttrName = normalizeMatch(attr.name);
        const attrSlug = normalizeMatch(attr.slug);
        
        // Exact or very close matches
        if (cleanAttrName === cleanCatName || attrSlug === catSlug) return true;
        
        // Strictly separate Multifunction from regular Timers/Counters
        const isMultifunCat = cleanCatName.includes('multifun');
        const isMultifunAttr = cleanAttrName.includes('multifun');

        if (isMultifunCat !== isMultifunAttr) return false;
        
        // Otherwise, allow matching only if there is a direct containment relationship
        // This avoids matching generic "Series" to everything
        return cleanAttrName.includes(cleanCatName) || 
               cleanCatName.includes(cleanAttrName) ||
               attrSlug.includes(catSlug) ||
               catSlug.includes(attrSlug);
      });

      let allTerms: any[] = [];
      
      // Fetch terms for ALL matching attributes
      if (matchingAttrs.length > 0) {
        const termsPromises = matchingAttrs.map(async (attr: any) => {
          const response = await fetch(`${API_URL}/products/attributes/${attr.id}/terms?per_page=100`, {
            headers,
            next: { revalidate: 3600 }
          });
          if (response.ok) return response.json();
          return [];
        });
        
        const results = await Promise.all(termsPromises);
        results.forEach(termsData => {
          if (Array.isArray(termsData)) {
            termsData.forEach((t: any) => {
              // Add only if not already present (avoid duplicates)
              if (!allTerms.find(existing => existing.slug === t.slug)) {
                allTerms.push({
                  id: t.id,
                  name: t.name.replace(/&amp;/g, '&'),
                  slug: t.slug,
                  description: t.description,
                  count: t.count
                });
              }
            });
          }
        });
      }

      // Also include sub-categories as a fallback/additional source
      const subCatResponse = await fetch(`${API_URL}/products/categories?per_page=100&parent=${cat.id}`, {
        headers,
        next: { revalidate: 3600 }
      });
      if (subCatResponse.ok) {
        const subData = await subCatResponse.json();
        subData.forEach((s: any) => {
          if (!allTerms.find(existing => existing.slug === s.slug)) {
            allTerms.push({
              id: s.id,
              name: s.name.replace(/&amp;/g, '&'),
              slug: s.slug,
              description: s.description,
              count: s.count
            });
          }
        });
      }

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        terms: allTerms
      };
    }));

    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
