import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { WOOCOMMERCE_CONFIG } from '@/lib/utils/constants';

export const dynamic = 'force-dynamic';

const CACHE_SECONDS = 30;

const normalizeText = (value: string) => (value || '')
  .toLowerCase()
  .replace(/&amp;/g, '&')
  .replace(/multifunction/g, 'multifun')
  .replace(/controllers/g, 'controller')
  .replace(/indicators/g, 'indicator')
  .replace(/counters/g, 'counter')
  .replace(/timers/g, 'timer')
  .replace(/transmitters/g, 'transmitter')
  .replace(/[^a-z0-9]/g, '');

const tokenise = (value: string) => (value || '')
  .toLowerCase()
  .replace(/&amp;/g, '&')
  .replace(/[^a-z0-9]+/g, ' ')
  .split(' ')
  .map(token => token
    .replace(/controllers$/, 'controller')
    .replace(/indicators$/, 'indicator')
    .replace(/counters$/, 'counter')
    .replace(/timers$/, 'timer')
    .replace(/transmitters$/, 'transmitter'))
  .filter(token => token.length >= 4 && !['series', 'product', 'products', 'controller', 'process'].includes(token));

async function fetchWooCollection(apiUrl: string, endpoint: string, headers: HeadersInit) {
  const items: any[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const separator = endpoint.includes('?') ? '&' : '?';
    const response = await fetch(`${apiUrl}${endpoint}${separator}per_page=100&page=${page}`, {
      headers,
      next: { revalidate: CACHE_SECONDS, tags: ['wordpress', 'attributes'] },
    });

    if (!response.ok) break;

    const data = await response.json();
    if (Array.isArray(data)) items.push(...data);

    totalPages = Number(response.headers.get('x-wp-totalpages') || 1);
    page += 1;
  } while (page <= totalPages);

  return items;
}

export async function GET(request: Request) {
  const { baseUrl: API_URL, consumerKey: CONSUMER_KEY, consumerSecret: CONSUMER_SECRET } = WOOCOMMERCE_CONFIG;

  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    return NextResponse.json({ error: 'WooCommerce credentials not configured' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const bypass = searchParams.get('revalidate') === 'true' ||
                   request.headers.get('cache-control') === 'no-cache' ||
                   request.headers.get('pragma') === 'no-cache';

    if (bypass) {
      revalidateTag('wordpress');
      revalidateTag('attributes');
    }
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };

    // Fetch categories and attributes in parallel so the header menu can open fast.
    const [categories, attributes] = await Promise.all([
      fetchWooCollection(API_URL, '/products/categories?hide_empty=false', headers),
      fetchWooCollection(API_URL, '/products/attributes', headers),
    ]);

    // 3. For each category, find ALL matching attributes and merge their terms
    const sortedCategories = Array.isArray(categories)
      ? categories
        .filter((cat: any) => cat?.name && cat.slug !== 'uncategorized')
        .sort((a: any, b: any) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
      : [];

    const categoryMatches = new Map<number, any[]>();
    const matchedAttributes = new Map<number, any>();

    sortedCategories.forEach((cat: any) => {
      const cleanCatName = normalizeText(cat.name);
      const catSlug = normalizeText(cat.slug);
      const catTokens = tokenise(`${cat.name} ${cat.slug}`);

      const matchingAttrs = Array.isArray(attributes) ? attributes.filter((attr: any) => {
        const cleanAttrName = normalizeText(attr.name);
        const attrSlug = normalizeText(attr.slug);
        const attrTokens = tokenise(`${attr.name} ${attr.slug}`);

        // Exact or very close matches
        if (cleanAttrName === cleanCatName || attrSlug === catSlug) return true;

        // Strictly separate Multifunction from regular Timers/Counters
        const isMultifunCat = cleanCatName.includes('multifun');
        const isMultifunAttr = cleanAttrName.includes('multifun');

        if (isMultifunCat !== isMultifunAttr) return false;

        // Otherwise, allow matching if the category and attribute share a
        // meaningful word, e.g. "Process Indicators" -> "Process Indicator Series".
        const hasSharedMeaningfulToken = catTokens.some(token => attrTokens.includes(token));
        if (hasSharedMeaningfulToken) return true;

        // Finally, allow direct containment for compact slugs/names.
        return cleanAttrName.includes(cleanCatName) ||
          cleanCatName.includes(cleanAttrName) ||
          attrSlug.includes(catSlug) ||
          catSlug.includes(attrSlug);
      }) : [];

      categoryMatches.set(cat.id, matchingAttrs);
      matchingAttrs.forEach((attr: any) => matchedAttributes.set(attr.id, attr));
    });

    const attrTermsEntries = await Promise.all(
      Array.from(matchedAttributes.values()).map(async (attr: any) => {
        const terms = await fetchWooCollection(API_URL, `/products/attributes/${attr.id}/terms`, headers);
        return [attr.id, terms] as const;
      })
    );
    const termsByAttributeId = new Map(attrTermsEntries);

    const childCategoriesByParent = new Map<number, any[]>();
    categories.forEach((cat: any) => {
      if (!cat.parent) return;
      const children = childCategoriesByParent.get(cat.parent) || [];
      children.push(cat);
      childCategoriesByParent.set(cat.parent, children);
    });

    const menuData = sortedCategories.map((cat: any) => {
      const matchingAttrs = categoryMatches.get(cat.id) || [];
      let allTerms: any[] = [];

      matchingAttrs.forEach((attr: any) => {
        const termsData = termsByAttributeId.get(attr.id) || [];
        termsData.forEach((t: any) => {
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
      });

      // Also include sub-categories as a fallback/additional source
      (childCategoriesByParent.get(cat.id) || []).forEach((s: any) => {
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

      allTerms.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        terms: allTerms
      };
    });

    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
