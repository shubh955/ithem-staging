import { WOOCOMMERCE_CONFIG } from '@/lib/utils/constants';

/**
 * WooCommerce API Utility
 * This handles direct calls to the backend to avoid proxy issues and Vercel serverless failures.
 */

const { baseUrl: API_URL, consumerKey: CK, consumerSecret: CS } = WOOCOMMERCE_CONFIG;

export async function fetchWoo(endpoint: string, options: RequestInit = {}) {
  // Construct the full URL with credentials as query parameters
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${API_URL}${endpoint}${separator}consumer_key=${CK}&consumer_secret=${CS}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `WooCommerce API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function getMappedAttributes() {
  try {
    // 1. Fetch all top-level categories
    const categories = await fetchWoo('/products/categories?per_page=100&parent=0&hide_empty=true');

    // 2. Fetch all attributes
    const attributes = await fetchWoo('/products/attributes?per_page=100');

    // 3. For each category, find the matching attribute by name and fetch its terms
    const menuData = await Promise.all(categories.map(async (cat: any) => {
      // Find matching attribute (case insensitive)
      const matchingAttr = attributes.find((attr: any) => 
        attr.name.toLowerCase().includes(cat.name.toLowerCase()) || 
        cat.name.toLowerCase().includes(attr.name.toLowerCase())
      );

      let terms = [];
      if (matchingAttr) {
        try {
          const termsData = await fetchWoo(`/products/attributes/${matchingAttr.id}/terms?per_page=100`);
          terms = termsData.map((t: any) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            description: t.description
          }));
        } catch (e) {
          console.error(`Failed to fetch terms for attr ${matchingAttr.id}`, e);
        }
      }

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        terms: terms
      };
    }));

    return menuData;
  } catch (error) {
    console.error('Error fetching mapped attributes:', error);
    throw error;
  }
}
