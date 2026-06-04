'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Loader2, Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { fetchCachedJson } from '@/lib/api/client-cache'

interface Product {
  id: number
  name: string
  slug: string
  images: { src: string; alt?: string }[]
  categories: { name: string; slug: string }[]
  short_description: string
  attributes: { name: string; options: string[] }[]
}

export function FeaturedProductsListing() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    const loadProducts = async () => {
      const params = new URLSearchParams({
        featured: 'true',
        page: String(currentPage),
        per_page: String(itemsPerPage),
      })

      try {
        setLoading(true)
        const data = await fetchCachedJson<{
          products?: Product[]
          total?: number
          totalPages?: number
        }>(`/api/products?${params.toString()}`)

        const nextProducts = Array.isArray(data) ? data : data.products || []
        setProducts(nextProducts)
        setTotalProducts(Array.isArray(data) ? nextProducts.length : data.total || nextProducts.length)
        setTotalPages(Array.isArray(data) ? 1 : data.totalPages || 1)
      } catch (error) {
        console.error('Error loading featured products:', error)
        setProducts([])
        setTotalProducts(0)
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentPage])

  const paginationItems = useMemo(() => {
    const items: Array<number | 'ellipsis-start' | 'ellipsis-end'> = []

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    items.push(1)

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    if (start > 2) items.push('ellipsis-start')

    for (let page = start; page <= end; page += 1) {
      items.push(page)
    }

    if (end < totalPages - 1) items.push('ellipsis-end')

    items.push(totalPages)
    return items
  }, [currentPage, totalPages])

  return (
    <section className="bg-light-grey py-14 md:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
              <Star className="h-4 w-4 fill-brand-orange" />
              Curated Selection
            </p>
            <h2 className="text-2xl font-bold text-dark md:text-3xl">
              Showing {products.length} of {totalProducts} Featured Products
            </h2>
          </div>
          {totalPages > 1 && (
            <p className="text-sm font-semibold text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white">
            <Loader2 className="h-10 w-10 animate-spin text-[#0070bc]" />
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">
              Loading Featured Products
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const mainCategory = product.categories[0]?.slug || 'uncategorized'
              const image = product.images[0]?.src || '/logo.png'
              const size = product.attributes.find(a => a.name.toLowerCase().includes('size'))?.options[0] || 'Standard'

              return (
                <a
                  key={product.id}
                  href={`/products/${product.slug}?id=${product.id}`}
                  className="group feature-product-card flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-xl"
                >
                  <div className="upper-cover relative flex h-48 items-center justify-center overflow-hidden border-b border-gray-100 bg-gray-50">
                    <Image
                      src={image}
                      alt={product.images[0]?.alt || product.name}
                      fill
                      className="product-image object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white shadow-sm">
                      <Star className="h-3 w-3 fill-white" />
                      Featured
                    </span>
                    <span className="black-color absolute right-3 top-3 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium">
                      {size}
                    </span>
                  </div>

                  <div className="feature-card-content flex flex-1 flex-col items-start p-5 text-left">
                    <h3 className="line-clamp-1 w-full text-left text-base font-bold leading-snug text-dark transition-colors group-hover:text-brand-orange">
                      {product.name}
                    </h3>

                    <div className="mt-4 flex-1 text-left text-base leading-relaxed text-gray-500 line-clamp-2">
                      {product.attributes
                        .filter(attr => !attr.name.toLowerCase().includes('size'))
                        .slice(0, 2)
                        .map((attr, index) => (
                          <div key={`${attr.name}-${index}`} className="block truncate">
                            {attr.options[0]}
                          </div>
                        ))}
                    </div>

                    <div className="mt-5 flex w-full items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-sm font-semibold text-brand-orange">View Details</span>
                      <ArrowRight className="h-4 w-4 text-brand-orange opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center">
            <p className="text-sm font-semibold text-gray-500">
              No featured products are published yet.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 transition-all duration-300 hover:border-[#0070bc] hover:text-[#0070bc] disabled:opacity-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-1.5">
              {paginationItems.map((item) => {
                if (typeof item !== 'number') {
                  return (
                    <span key={item} className="flex h-10 min-w-8 items-center justify-center px-1 text-[11px] font-black text-gray-300">
                      ...
                    </span>
                  )
                }

                return (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={cn(
                      'h-10 min-w-10 rounded-xl px-4 text-[11px] font-black transition-all duration-300',
                      currentPage === item
                        ? 'border border-gray-100 bg-white text-[#0070bc] shadow-md'
                        : 'text-gray-400 hover:text-dark'
                    )}
                  >
                    {String(item).padStart(2, '0')}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 transition-all duration-300 hover:border-[#0070bc] hover:text-[#0070bc] disabled:opacity-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
