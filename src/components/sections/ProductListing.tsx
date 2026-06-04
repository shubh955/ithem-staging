'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Search, X, Loader2, ChevronLeft, ChevronRight, Filter, Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { fetchCachedJson } from '@/lib/api/client-cache'
import { PageHeroSection } from '@/components/sections/PageHeroSection'

interface Product {
  id: number
  name: string
  slug: string
  images: { src: string; alt: string }[]
  categories: { id: number; name: string; slug: string }[]
  attributes: { name: string; options: string[] }[]
  short_description: string
  featured?: boolean
  replacement_product?: {
    id: number
    name: string
    slug: string
    price?: string
    image?: string
  }
}

interface Attribute {
  id: number
  name: string
  slug: string
  terms: { name: string; slug: string; count?: number }[]
}

// Unified normalization for engineering data and filters
const normalize = (s: string) => {
  if (!s) return '';
  return s.toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/multifun/g, 'multifunction')
    .replace(/[*x]/g, 'x')
    .replace(/[^a-z0-9x]/g, '')
    .trim();
};

const getTermsFromParams = (params: URLSearchParams) => {
  const terms = params.get('terms')?.split(',').filter(Boolean) || []
  const singleTerm = params.get('term')
  const finalTerms = [...terms]

  if (singleTerm && !finalTerms.some(t => normalize(t) === normalize(singleTerm))) {
    finalTerms.push(singleTerm)
  }

  return finalTerms
}

const areTermsEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false
  return a.every((term, index) => normalize(term) === normalize(b[index]))
}

const getFilterGroupName = (name: string) => {
  const lowerName = name.toLowerCase()

  if (lowerName.includes('series') || lowerName.includes('multifun') || lowerName.includes('multifunction')) return 'Series'
  if (lowerName.includes('size')) return 'Size'
  if (lowerName.includes('display') || lowerName.includes('digit')) return 'Display'
  if (lowerName.includes('output') && !lowerName.includes('type')) return 'No of Outputs'
  if (lowerName.includes('output') && lowerName.includes('type')) return 'Control Output 1 Type'
  if (lowerName.includes('comm')) return 'Communication'
  if (lowerName.includes('excitation')) return 'Excitation Voltage'

  return name
}

const groupTermsByFilter = (terms: string[], products: Product[]) => {
  const termGroups: Record<string, string[]> = {}

  terms.forEach(term => {
    const termNorm = normalize(term)
    let foundGroup = 'Other'

    for (const product of products) {
      if (product.categories.some(c => normalize(c.name) === termNorm || normalize(c.slug) === termNorm)) {
        foundGroup = 'Series'
        break
      }

      const attr = product.attributes.find(a => a.options.some(o => normalize(o) === termNorm))

      if (attr) {
        foundGroup = getFilterGroupName(attr.name)
        break
      }
    }

    if (!termGroups[foundGroup]) termGroups[foundGroup] = []
    termGroups[foundGroup].push(term)
  })

  return termGroups
}

const productMatchesTermGroup = (product: Product, groupName: string, termsInGroup: string[]) => {
  return termsInGroup.some(term => {
    const termNorm = normalize(term)

    if (groupName === 'Series') {
      const categoryMatch = product.categories.some(cat =>
        normalize(cat.name) === termNorm || normalize(cat.slug) === termNorm
      )

      if (categoryMatch) return true
    }

    return product.attributes.some(attr => {
      if (getFilterGroupName(attr.name) !== groupName) return false

      return attr.options.some(opt => {
        const optNorm = normalize(opt)
        return optNorm === termNorm || optNorm.includes(termNorm) || termNorm.includes(optNorm)
      })
    })
  })
}

const productMatchesTerms = (product: Product, terms: string[], sourceProducts: Product[]) => {
  if (terms.length === 0) return true

  const termGroups = groupTermsByFilter(terms, sourceProducts)

  return Object.entries(termGroups).every(([groupName, termsInGroup]) =>
    productMatchesTermGroup(product, groupName, termsInGroup)
  )
}

export function ProductListing() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initialTerms = useMemo(() => getTermsFromParams(searchParams), [searchParams])
  
  const [products, setProducts] = useState<Product[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'))
  const [selectedTerms, setSelectedTerms] = useState<string[]>(initialTerms)
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const data = await fetchCachedJson<Attribute[]>('/api/attributes')
        if (Array.isArray(data)) {
          setAttributes(data)
        }
      } catch (error) {
        console.error('Error loading attributes:', error)
      }
    }

    loadAttributes()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
      setCurrentPage(1)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const loadProducts = async () => {
      const params = new URLSearchParams({
        all: 'true',
        per_page: '100',
      })

      if (selectedCategory) params.set('category', selectedCategory)
      if (debouncedSearchQuery) params.set('search', debouncedSearchQuery)

      try {
        setLoading(true)
        const data = await fetchCachedJson<{
          products?: Product[]
          total?: number
          totalPages?: number
        }>(`/api/products?${params.toString()}`)

        const nextProducts = Array.isArray(data) ? data : data.products || []
        setProducts(nextProducts)
      } catch (error) {
        console.error('Error loading catalog:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [debouncedSearchQuery, selectedCategory])

  useEffect(() => {
    const category = searchParams.get('category')
    const finalTerms = getTermsFromParams(searchParams)

    setSelectedCategory(prev => prev === category ? prev : category)
    setSelectedTerms(prev => areTermsEqual(prev, finalTerms) ? prev : finalTerms)
    setCurrentPage(prev => prev === 1 ? prev : 1)
  }, [searchParams])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTerms])

  // 1. First, compute the base filtered products (only by search and category)
  const categoryProducts = useMemo(() => {
    // Precise slug matching and hierarchy awareness
    const selectedSlugNorm = selectedCategory ? normalize(selectedCategory) : null;
    
    // Find the category and its children from the attributes map to allow products in sub-categories
    const currentCatData = selectedSlugNorm ? attributes.find(a => 
      normalize(a.slug) === selectedSlugNorm || 
      normalize(a.name) === selectedSlugNorm
    ) : null;

    const allowedSlugs = new Set<string>();
    if (selectedSlugNorm) {
      allowedSlugs.add(selectedSlugNorm);
      // Fallback: also add raw slug
      allowedSlugs.add(selectedCategory!.toLowerCase());
      
      currentCatData?.terms.forEach(t => {
        allowedSlugs.add(normalize(t.slug));
        allowedSlugs.add(normalize(t.name));
      });
    }

    return products.filter(product => {
      // Robust search
      const matchesSearch = !debouncedSearchQuery ||
                           product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                           product.short_description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      
      // Flexible Category Matching: Ensures parent categories show products from child series
      if (!selectedCategory) return matchesSearch;

      const matchesCategory = product.categories.some(c => {
        const catSlugNorm = normalize(c.slug);
        const catNameNorm = normalize(c.name);
        return allowedSlugs.has(catSlugNorm) || allowedSlugs.has(catNameNorm);
      });

      return matchesSearch && matchesCategory
    })
  }, [products, debouncedSearchQuery, selectedCategory, attributes])

  // 2. Compute the fully filtered products (including terms)
  const filteredProducts = useMemo(() => {
    if (selectedTerms.length === 0) return categoryProducts;

    return categoryProducts.filter(product => productMatchesTerms(product, selectedTerms, categoryProducts));
  }, [categoryProducts, selectedTerms])

  // 3. Compute available filters (Always Static for full Multi-select)
  const availableFilters = useMemo(() => {
    const filterMap = new Map<string, Set<string>>();
    
    const preferredOrder = [
      'Series', 
      'Size', 
      'Display', 
      'No of Outputs', 
      'Control Output 1 Type', 
      'Communication', 
      'Excitation Voltage'
    ];
    
    preferredOrder.forEach(name => filterMap.set(name, new Set()));

    const selectedSlugNorm = selectedCategory ? normalize(selectedCategory) : null;
    const currentCatData = selectedSlugNorm ? attributes.find(a => 
      normalize(a.slug) === selectedSlugNorm || 
      normalize(a.name) === selectedSlugNorm
    ) : null;

    // Keep Series stable for the selected category. Product results are now
    // paginated/filtered by the server, so deriving Series only from products
    // would hide sibling terms like Data Logger when Auto Clave is selected.
    currentCatData?.terms.forEach(term => {
      if (term.name !== 'Discontinued' && (typeof term.count !== 'number' || term.count > 0)) {
        filterMap.get('Series')!.add(term.name);
      }
    });

    // Always use ALL products in the current category to find potential filters
    categoryProducts.forEach(product => {
      // 1. Extract Series
      product.categories.forEach(cat => {
        const isSelected = cat.slug === selectedCategory;
        const nameLower = cat.name.toLowerCase();
        const isParentCategory = 
          nameLower.includes('multifun') || 
          nameLower.includes('multifunction') || 
          nameLower === 'timers' || 
          nameLower === 'counters' || 
          nameLower.includes('temperature controller') ||
          nameLower.includes('process controller') ||
          nameLower.includes('application specific');
        
          if (cat.slug !== 'uncategorized' && !isSelected && !isParentCategory) {
            filterMap.get('Series')!.add(cat.name);
          }
      });

      // 2. Extract Attributes
      product.attributes.forEach(attr => {
        const name = attr.name.toLowerCase();
        let targetName = attr.name;
        
        targetName = getFilterGroupName(name);

        if (!filterMap.has(targetName)) {
          filterMap.set(targetName, new Set());
        }

        attr.options.forEach(opt => {
          filterMap.get(targetName)!.add(opt);
        });
      });
    });

    return Array.from(filterMap.entries())
      .filter(([name, options]) => options.size > 0)
      .map(([name, options]) => ({
        name,
        terms: Array.from(options)
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
          .map(opt => ({
            name: opt,
            slug: opt
          }))
      }));
  }, [attributes, categoryProducts, selectedCategory]);

  // 4. Robust Counting for Filter Visibility
  const filterCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};

    const selectedGroups = groupTermsByFilter(selectedTerms, categoryProducts);

    categoryProducts.forEach(product => {
      // Count Categories (Series)
      product.categories.forEach(cat => {
        const normName = normalize(cat.name);
        const normSlug = normalize(cat.slug);
        
        const matchesOtherGroups = Object.entries(selectedGroups).every(([gName, gTerms]) => {
          if (gName === 'Series') return true;
          return productMatchesTermGroup(product, gName, gTerms);
        });

        if (matchesOtherGroups) {
          counts[normName] = (counts[normName] || 0) + 1;
          if (normSlug !== normName) counts[normSlug] = (counts[normSlug] || 0) + 1;
        }
      });

      // Count Attributes
      product.attributes.forEach(attr => {
        const attrGroup = getFilterGroupName(attr.name);
        
        const matchesOtherGroups = Object.entries(selectedGroups).every(([gName, gTerms]) => {
          if (gName === attrGroup) return true;
          return productMatchesTermGroup(product, gName, gTerms);
        });

        if (matchesOtherGroups) {
          attr.options.forEach(opt => {
            const normOpt = normalize(opt);
            counts[normOpt] = (counts[normOpt] || 0) + 1;
          });
        }
      });
    });
    
    return counts;
  }, [categoryProducts, selectedTerms]);

  const totalProducts = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage))
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [currentPage, filteredProducts])
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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const toggleTerm = (term: string) => {
    const termNorm = normalize(term);
    
    const isCurrentlySelected = selectedTerms.some(t => normalize(t) === termNorm) || 
                               (selectedCategory && normalize(selectedCategory) === termNorm);

    let newTerms = [...selectedTerms];
    let newCategory = selectedCategory;

    if (isCurrentlySelected) {
      newTerms = newTerms.filter(t => normalize(t) !== termNorm);
      if (newCategory && normalize(newCategory) === termNorm) {
        newCategory = null;
      }
    } else {
      newTerms.push(term);
    }
    
    setSelectedTerms(newTerms);
    setSelectedCategory(newCategory);
    setCurrentPage(1);

    // Sync with URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('term'); // Clean up singular param to avoid "sticking"
    
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }

    if (newTerms.length > 0) {
      params.set('terms', newTerms.join(','));
    } else {
      params.delete('terms');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedTerms([])
    setSearchQuery('')
    router.push('/products', { scroll: false })
  }

  const currentCategoryName = useMemo(() => {
    if (!selectedCategory) return 'Our Products'
    const cat = attributes.find(a => normalize(a.slug) === normalize(selectedCategory))
    const name = cat ? cat.name : selectedCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    return name.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  }, [selectedCategory, attributes])

  return (
    <>
      <PageHeroSection
        title={currentCategoryName}
        tag="Product Catalog"
        breadcrumbs={[
          { label: currentCategoryName }
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-light-grey">
        <div className="flex flex-col lg:flex-row gap-30">
        
        {/* SIDEBAR - Premium Industrial Look */}
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-32 space-y-10">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="bg-[#0070bc] px-8 py-5">
                <h2 className="text-xs text-white flex items-center gap-3 uppercase tracking-widest">
                  <Filter className="h-3.5 w-3.5 text-white/80" />
                  Engineering Filter
                </h2>
              </div>
              
              <div className="p-0 divide-y divide-gray-50">
                {/* Search - Refined */}
                <div className="p-5 bg-gray-50/30">
                  <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0070bc] transition-colors" />
                    <input
                      type="text"
                      placeholder="Search series or model..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-xs font-medium placeholder:text-gray-400 focus:border-[#0070bc] focus:ring-4 focus:ring-[#0070bc]/5 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Dynamic Attributes Filters */}
                {availableFilters.map((filter) => {
                  return (
                    <div key={filter.name} className="p-5 border-light">
                      <h3 className="mb-5 text-[13px] text-dark uppercase line-imporve flex items-center justify-between">
                        {filter.name}
                        {/* <span className="h-px flex-1 mx-4 bg-gray-100"></span> */}
                      </h3>
                      <div className="space-y-4">
                      {filter.terms.map((term) => {
                        const isSelected = selectedTerms.some(t => normalize(t) === normalize(term.slug));
                        
                        const normTermName = normalize(term.name);
                        const normTermSlug = normalize(term.slug);
                        const count = filterCounts[normTermName] || filterCounts[normTermSlug] || 0;
                        
                        const isSeries = filter.name === 'Series';
                        const isAnyInGroupSelected = filter.terms.some(t => 
                          selectedTerms.some(st => normalize(st) === normalize(t.slug))
                        );
                        
                        if (count === 0 && !isSelected && !isAnyInGroupSelected && selectedTerms.length > 0 && !isSeries) return null;

                        return (
                          <label 
                            key={term.slug} 
                            className="flex items-center gap-3 group cursor-pointer transition-all duration-300"
                          >
                            <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleTerm(term.slug)}
                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:bg-[#0070bc] checked:border-[#0070bc] transition-all duration-300"
                              />
                              <svg className="absolute h-2.5 w-2.5 scale-0 peer-checked:scale-100 text-white transition-transform duration-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <span className={cn(
                                "text-[12px] font-bold transition-all duration-300",
                                isSelected ? "text-[#0070bc]" : "text-black group-hover:text-[#0070bc]"
                              )}>
                                {term.name.replace(/&amp;/g, '&').replace(/&quot;/g, '"')}
                              </span>
                              <span className={cn(
                                "text-[10px] font-mono opacity-40",
                                isSelected && "text-[#0070bc] opacity-100"
                              )}>
                                ({count})
                              </span>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

                {(selectedCategory || selectedTerms.length > 0 || searchQuery) && (
                  <div className="p-6">
                    <button
                      onClick={clearFilters}
                      className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-[#0070bc] hover:text-white transition-all duration-300"
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
          <div className="mb-8 flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#0070bc]">
                <Filter className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                  Filtered Results
                </p>
                <h2 className="text-[15px] font-bold text-dark">
                  Showing <span className="text-[#0070bc] font-black">{paginatedProducts.length}</span> of <span className="text-[#0070bc] font-black">{totalProducts}</span> Precision {totalProducts === 1 ? 'Instrument' : 'Instruments'}
                  {searchQuery && <span className="text-gray-400 font-medium"> matching &quot;{searchQuery}&quot;</span>}
                </h2>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
              <span className="h-2 w-2 rounded-full bg-[#0070bc] shadow-[0_0_8px_rgba(0,112,188,0.5)]" />
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Live Catalog</span>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 relative">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-48 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100/50 shadow-inner">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#0070bc]/10 rounded-full blur-2xl animate-pulse"></div>
                  <Loader2 className="h-12 w-12 animate-spin text-[#0070bc] relative z-10" strokeWidth={1.5} />
                </div>
                <p className="mt-8 text-[11px] font-bold text-[#0070bc] uppercase tracking-[0.3em] animate-pulse text-center">
                  Synchronizing Engineering Catalog...<br/>
                  <span className="text-[9px] text-gray-400 font-medium tracking-widest mt-2 block">Optimizing Filter Matrix</span>
                </p>
                <div className="mt-6 flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0070bc]/20 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0070bc]/40 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0070bc]/60 animate-bounce"></span>
                </div>
              </div>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => {
                const sizeAttr = product.attributes.find(a => a.name.toLowerCase() === 'size')?.options[0]
                const displayAttr = product.attributes.find(a => a.name.toLowerCase().includes('digit') || a.name.toLowerCase().includes('display'))?.options[0]
                const inputAttr = product.attributes.find(a => a.name.toLowerCase().includes('input'))?.options[0]
                
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-white border hover:shadow-2xl transition-all duration-500 overflow-hidden border-round"
                  >
                    {/* Image Section - Fixed Height to ensure consistency */}
                    <a
                      href={`/products/${product.slug}?id=${product.id}`}
                      className="relative w-full overflow-hidden bg-white group-hover:bg-gray-50/50 transition-colors duration-500 height-190"
                    >
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt || product.name}
                          fill
                          className="object-contain back-light-blue p-4 scale-100 group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-50">
                          <span className="font-bold text-[10px] text-gray-200 uppercase tracking-widest">I-Therm</span>
                        </div>
                      )}
                      {product.replacement_product ? (
                        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm animate-pulse">
                          Discontinued
                        </span>
                      ) : product.featured && (
                        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white shadow-sm">
                          <Star className="h-3 w-3 fill-white" />
                          Featured
                        </span>
                      )}
                    </a>
  
                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
                      <div className="text-center mb-6">
                        <a
                          href={`/products/${product.slug}?id=${product.id}`}
                          className="text-[16px] font-bold text-[#0070bc] hover:text-dark transition-colors duration-300 block leading-snug"
                        >
                          {product.name}
                        </a>
                      </div>
                      
                      <div className="space-y-3 mb-8">
                        {sizeAttr && (
                          <div className="flex items-center justify-between border-b-light border-gray-50 pb-2">
                            <span className="text-[12px] text-gray-400 tracking-widest">Dimension</span>
                            <span className="text-xs font-bold text-dark">{sizeAttr}</span>
                          </div>
                        )}
                        {displayAttr && (
                          <div className="flex items-center justify-between border-b-light border-gray-50 pb-2">
                            <span className="text-[12px] text-gray-400 tracking-widest">Display</span>
                            <span className="text-xs font-semibold text-gray-600">{displayAttr}</span>
                          </div>
                        )}
                        {inputAttr && (
                          <div className="flex items-center justify-between border-b-light border-gray-50 pb-2">
                            <span className="text-[12px] text-gray-400 tracking-widest">Input</span>
                            <span className="text-xs font-semibold text-gray-600 truncate ml-4">{inputAttr}</span>
                          </div>
                        )}
                        {!sizeAttr && !displayAttr && !inputAttr && (
                          <div 
                            className="text-[12px] text-gray-500 line-clamp-2 font-medium text-center"
                            dangerouslySetInnerHTML={{ __html: product.short_description }}
                          />
                        )}
                      </div>

                      <div className="mt-auto space-y-3">
                        {product.replacement_product && (
                          <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center mb-2">
                            <span className="block text-[10px] text-red-600 font-bold uppercase tracking-widest mb-1.5">Model Discontinued</span>
                            <a
                              href={`/products/${product.replacement_product.slug}?id=${product.replacement_product.id}`}
                              className="text-[11px] font-bold text-red-700 hover:text-red-800 underline decoration-red-300 underline-offset-2 transition-colors"
                            >
                              View Replacement: {product.replacement_product.name}
                            </a>
                          </div>
                        )}
                        <a
                          href={`/products/${product.slug}?id=${product.id}`}
                          className="btn-premium btn-black-to-orange flex items-center justify-center gap-2 w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-lg shadow-lg"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                  <Search className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">No matches found</h3>
                <p className="text-sm text-gray-500 mb-8 max-w-xs text-center">We couldn&apos;t find any products matching your current configuration filters.</p>
                <button
                  onClick={clearFilters}
                  className="btn-premium btn-black-to-orange rounded-full px-8 py-3 text-[11px] font-bold uppercase tracking-widest"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination - Premium Design */}
          {totalPages > 1 && (
            <div className="mt-20 flex items-center justify-center gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-200 disabled:opacity-20 hover:border-[#0070bc] hover:text-[#0070bc] transition-all duration-300 group"
              >
                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </button>
              
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                {paginationItems.map((item) => {
                  if (typeof item !== 'number') {
                    return (
                      <span
                        key={item}
                        className="flex h-10 min-w-8 items-center justify-center px-1 text-[11px] font-black text-gray-300"
                      >
                        ...
                      </span>
                    )
                  }

                  return (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={cn(
                        "h-10 min-w-10 px-4 rounded-xl text-[11px] font-black transition-all duration-300",
                        currentPage === item
                          ? "bg-white text-[#0070bc] shadow-md border border-gray-100"
                          : "text-gray-400 hover:text-dark"
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
                className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-200 disabled:opacity-20 hover:border-[#0070bc] hover:text-[#0070bc] transition-all duration-300 group"
              >
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  )
}
