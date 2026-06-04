import type { Metadata } from 'next'
import ProductDetailClient from './ProductDetailClient'
import CategoryClient from './CategoryClient'
import { SITE_CONFIG, PRODUCT_CATEGORIES } from '@/lib/utils/constants'
import { notFound } from 'next/navigation'

const CATEGORY_MAP = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.slug, c])
)

export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }, 
  searchParams: { [key: string]: string | string[] | undefined } 
}): Promise<Metadata> {
  const isCategory = CATEGORY_MAP[params.slug];
  
  if (isCategory) {
    return {
      title: isCategory.name,
      description: `${isCategory.description} Browse I-Therm's ${isCategory.name} range.`,
    }
  }

  // Otherwise, it's a product
  const id = searchParams?.id as string | undefined;
  const productSlug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || SITE_CONFIG.url || 'http://localhost:3000';
  
  try {
    const productUrl = id
      ? `${baseUrl}/api/products?id=${id}`
      : `${baseUrl}/api/products?search=${encodeURIComponent(productSlug)}&per_page=1&page=1`;
      
    const res = await fetch(productUrl, { next: { revalidate: 3600 } });
    const data = await res.json();
    
    const product = id 
      ? data 
      : (data.products && (data.products.find((p: any) => p.slug === productSlug) || data.products[0]));
    
    if (product && product.name) {
      const plainDescription = (product.short_description || product.description || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
        
      const title = product.yoast_head_json?.og_title || product.yoast_head_json?.title || `${product.name} | I-Therm`;
      let desc = product.yoast_head_json?.og_description || product.yoast_head_json?.description || plainDescription || `Learn more about ${product.name} by I-Therm.`;
      
      // SEO Best Practice: Truncate description to max 160 characters cleanly
      if (desc.length > 160) {
        const truncated = desc.substring(0, 157);
        const lastSpace = truncated.lastIndexOf(' ');
        desc = (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
      }
      
      return {
        title,
        description: desc,
        alternates: {
          canonical: `/products/${params.slug}${id ? `?id=${id}` : ''}`
        },
        openGraph: {
          title,
          description: desc,
          type: 'website',
          images: product.images?.[0]?.src ? [product.images[0].src] : undefined,
        }
      }
    }
  } catch (e) {
    console.error('Error generating metadata for product:', e);
  }
  
  return {
    title: 'Products | I-Therm',
  }
}

export default function RouteHandler({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }, 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const isCategory = CATEGORY_MAP[params.slug];
  
  if (isCategory) {
    return <CategoryClient params={{ category: params.slug }} />
  }

  // Not a category, assume product detail page
  return <ProductDetailClient />
}
