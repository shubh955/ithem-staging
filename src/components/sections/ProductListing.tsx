'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, Loader2, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { fetchWoo, getMappedAttributes } from '@/lib/api/woo'

interface Product {
  id: number
  name: string
  slug: string
  images: { src: string; alt: string }[]
  categories: { id: number; name: string; slug: string }[]
  attributes: { name: string; options: string[] }[]
  short_description: string
}

interface Attribute {
  id: number
  name: string
  slug: string
  terms: { name: string; slug: string }[]
}

export function ProductListing() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fetchInitiated = useRef(false)
  
  const [products, setProducts] = useState<Product[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'))
  const [selectedTerms, setSelectedTerms] = useState<string[]>(searchParams.get('term') ? [searchParams.get('term')!] : [])
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    if (fetchInitiated.current) return
    fetchInitiated.current = true

    const loadData = async () => {
      try {
        setLoading(true)
        
        // 1. Initial Quick Load (12 products + attributes)
        const [initialRes, attrRes] = await Promise.all([
          fetch('/api/products?initial=true'),
          fetch('/api/attributes')
        ])
        
        const initialProducts = await initialRes.json()
        const attrData = await attrRes.json()
        
        setProducts(initialProducts)
        setAttributes(attrData)
        setLoading(false) // Show the first 12 items immediately

        // 2. Background Load (The remaining 100+ products)
        const fullRes = await fetch('/api/products')
        const fullProducts = await fullRes.json()
        if (Array.isArray(fullProducts) && fullProducts.length > initialProducts.length) {
          setProducts(fullProducts)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    const term = searchParams.get('term')
    setSelectedCategory(cat)
    if (term) {
      setSelectedTerms(prev => prev.includes(term) ? prev : [...prev, term])
    }
    setCurrentPage(1)
  }, [searchParams])

  const availableSeriesTerms = useMemo(() => {
    if (!selectedCategory) return []
    const categoryProducts = products.filter(p => p.categories.some(c => c.slug === selectedCategory))
    const seriesOptions = categoryProducts.flatMap(p => 
      p.attributes.filter(a => a.name.toLowerCase().includes('series')).flatMap(a => a.options)
    )
    return Array.from(new Set(seriesOptions))
  }, [products, selectedCategory])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchQuery || 
                           product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.short_description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = !selectedCategory || product.categories.some(c => c.slug === selectedCategory)
      
      const matchesTerms = selectedTerms.length === 0 || selectedTerms.some(term => 
        product.attributes.some(attr => 
          attr.options.some(opt => {
            const optLower = opt.toLowerCase()
            const termLower = term.toLowerCase().replace(/-/g, ' ')
            return optLower === termLower || optLower.includes(termLower) || termLower.includes(optLower)
          })
        )
      )

      return matchesSearch && matchesCategory && matchesTerms
    })
  }, [products, searchQuery, selectedCategory, selectedTerms])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage])

  const toggleTerm = (term: string) => {
    setSelectedTerms(prev => 
      prev.includes(term) ? prev.filter(t => t !== term) : [...prev, term]
    )
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedTerms([])
    setSearchQuery('')
    router.push('/products', { scroll: false })
  }

  const currentCategoryName = useMemo(() => {
    if (!selectedCategory) return 'Our Products'
    const cat = attributes.find(a => a.slug === selectedCategory)
    return cat ? cat.name : selectedCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }, [selectedCategory, attributes])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-10 flex items-center text-[11px] font-bold uppercase tracking-widest text-gray-400">
        <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
        <span className="mx-3 h-px w-4 bg-gray-200"></span>
        <span className="text-brand-orange">{currentCategoryName}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* SIDEBAR */}
        <aside className="lg:w-72 shrink-0">
          <div className="sticky top-28 space-y-8">
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="bg-[#2980b9] px-6 py-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Filter className="h-4 w-4 text-white" />
                  Find Your Products
                </h2>
              </div>
              
              <div className="p-0 divide-y divide-gray-50">
                {/* Search */}
                <div className="p-5 bg-gray-50/50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-xs focus:border-[#2980b9] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Attributes */}
                {attributes.map((attr) => {
                  const isSeries = attr.name.toLowerCase().includes('series')
                  const displayTerms = isSeries && selectedCategory
                    ? attr.terms.filter(t => availableSeriesTerms.some(opt => opt.toLowerCase() === t.name.toLowerCase() || t.name.toLowerCase().includes(opt.toLowerCase())))
                    : attr.terms

                  if (isSeries && selectedCategory && displayTerms.length === 0) return null

                  return (
                    <div key={attr.id} className="p-5">
                      <h3 className="mb-4 text-xs font-bold text-dark uppercase tracking-wide border-b border-gray-100 pb-2">
                        {isSeries && selectedCategory ? `${attr.name} (${currentCategoryName})` : attr.name}
                      </h3>
                      <div className="space-y-2.5">
                        {displayTerms.map((term) => (
                          <label key={term.slug} className="flex items-center gap-3 group cursor-pointer">
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedTerms.includes(term.slug)}
                                onChange={() => toggleTerm(term.slug)}
                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-[#2980b9] checked:border-[#2980b9] transition-all"
                              />
                              <svg className="absolute left-0 top-0 h-4 w-4 scale-0 peer-checked:scale-100 text-white transition-transform p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-500 group-hover:text-dark transition-colors">
                              {term.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {(selectedCategory || selectedTerms.length > 0 || searchQuery) && (
                  <div className="p-5">
                    <button
                      onClick={clearFilters}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-200 transition-all"
                    >
                      <X className="h-3 w-3" /> Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN Grid */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4">
            <h1 className="text-xl font-bold text-dark">{currentCategoryName}</h1>
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-400 font-medium">
                {filteredProducts.length > 0 
                  ? `Showing ${(currentPage-1)*itemsPerPage + 1}–${Math.min(currentPage*itemsPerPage, filteredProducts.length)} of ${filteredProducts.length} results`
                  : 'Product Listing'}
              </p>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProducts.map((product) => {
              const sizeAttr = product.attributes.find(a => a.name.toLowerCase() === 'size')?.options[0]
              const displayAttr = product.attributes.find(a => a.name.toLowerCase().includes('digit') || a.name.toLowerCase().includes('display'))?.options[0]
              const inputAttr = product.attributes.find(a => a.name.toLowerCase().includes('input'))?.options[0]
              
              return (
                <div
                  key={product.id}
                  className="group flex flex-col border border-gray-200 bg-white transition-all duration-300"
                >
                  <Link
                    href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}`}
                    className="relative aspect-square overflow-hidden bg-white p-6"
                  >
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.images[0].alt || product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-200">
                        <span className="font-mono text-sm font-bold opacity-10">I-Therm</span>
                      </div>
                    )}
                  </Link>

                  <div className="p-6 pt-0 flex flex-col items-center text-center">
                    <Link
                      href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}`}
                      className="text-[16px] font-bold text-[#0070bc] hover:underline mb-1"
                    >
                      {product.name}
                    </Link>
                    
                    <div className="space-y-1">
                      {sizeAttr && <p className="text-[14px] font-bold text-dark">{sizeAttr}</p>}
                      {displayAttr && <p className="text-[14px] font-medium text-dark">{displayAttr}</p>}
                      {inputAttr && <p className="text-[14px] font-medium text-dark">{inputAttr}</p>}
                      {!sizeAttr && !displayAttr && !inputAttr && (
                        <div 
                          className="text-[14px] text-gray-500 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: product.short_description }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 flex items-center justify-center rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "h-9 w-9 rounded text-sm font-bold transition-all border",
                    currentPage === i + 1
                      ? "bg-[#0070bc] border-[#0070bc] text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:border-[#0070bc]"
                  )}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-9 w-9 flex items-center justify-center rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
