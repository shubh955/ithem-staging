
export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
}

const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.itherm.co.in/wp-json/wc/v3';

export async function fetchWooCommerce<T>(endpoint: string): Promise<T> {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getProductCategories(): Promise<WooCommerceCategory[]> {
  return fetchWooCommerce<WooCommerceCategory[]>('/products/categories?per_page=100&hide_empty=true');
}
