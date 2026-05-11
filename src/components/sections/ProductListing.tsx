'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, Loader2, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { fetchWoo, getMappedAttributes } from '@/lib/api/woo'
import { PageHeroSection } from '@/components/sections/PageHeroSection'

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
  const pathname = usePathname()
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
        
        // Even if we have initial products, wait a bit for the UI to "form"
        // and images to start rendering before hiding the loader
        setTimeout(() => {
          if (Array.isArray(initialProducts) && initialProducts.length > 0) {
            setLoading(false)
          }
        }, 1200)

        // 2. Background Load (The remaining 100+ products)
        const fullRes = await fetch('/api/products')
        const fullProducts = await fullRes.json()
        if (Array.isArray(fullProducts)) {
          setProducts(fullProducts)
        }
        
        // Final safety delay to ensure smooth transition
        setTimeout(() => setLoading(false), 500)
      } catch (error) {
        console.error('Error loading data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    // Show loader during category/term transitions
    setLoading(true)
    
    const category = searchParams.get('category')
    const terms = searchParams.get('terms')?.split(',') || []
    const singleTerm = searchParams.get('term')
    const finalTerms = [...terms]
    if (singleTerm && !finalTerms.includes(singleTerm)) finalTerms.push(singleTerm)
    
    if (category) setSelectedCategory(category)
    setSelectedTerms(finalTerms)
    setCurrentPage(1)

    // Wait for the UI to transition and filter the data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchParams])

  // 1. First, compute the base filtered products (only by search and category)
  const categoryProducts = useMemo(() => {
    return products.filter(product => {
      // Robust search
      const matchesSearch = !searchQuery || 
                           product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.short_description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Flexible Category Matching: Ensures parent categories show products from child series
      if (!selectedCategory) return matchesSearch;

      const normalize = (s: string) => s.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]/g, '');
      const selectedSlugNorm = normalize(selectedCategory);

      const matchesCategory = product.categories.some(c => {
        const catSlugNorm = normalize(c.slug);
        return catSlugNorm === selectedSlugNorm || catSlugNorm.includes(selectedSlugNorm) || selectedSlugNorm.includes(catSlugNorm);
      });

      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  // 2. Compute the fully filtered products (including terms)
  const filteredProducts = useMemo(() => {
    if (selectedTerms.length === 0) return categoryProducts;

    // 1. Group selected terms by their attribute/category source for AND/OR logic
    const termGroups: { [key: string]: string[] } = {};
    
    selectedTerms.forEach(term => {
      const normalize = (s: string) => s.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]/g, '');
      const termNorm = normalize(term);
      let foundGroup = 'Other';

      // Find the group for this term by looking at categoryProducts
      for (const p of categoryProducts) {
        // Check if it's a category (Series)
        if (p.categories.some(c => normalize(c.name) === termNorm || normalize(c.slug) === termNorm)) {
          foundGroup = 'Series';
          break;
        }
        // Check attributes
        const attr = p.attributes.find(a => a.options.some(o => normalize(o) === termNorm));
        if (attr) {
          const name = attr.name.toLowerCase();
          if (name.includes('series') || name.includes('multifun') || name.includes('multifunction')) foundGroup = 'Series';
          else if (name.includes('size')) foundGroup = 'Size';
          else if (name.includes('display') || name.includes('digit')) foundGroup = 'Display';
          else if (name.includes('output') && !name.includes('type')) foundGroup = 'No of Outputs';
          else if (name.includes('output') && name.includes('type')) foundGroup = 'Control Output 1 Type';
          else if (name.includes('comm')) foundGroup = 'Communication';
          else if (name.includes('excitation')) foundGroup = 'Excitation Voltage';
          else foundGroup = attr.name;
          break;
        }
      }
      
      if (!termGroups[foundGroup]) termGroups[foundGroup] = [];
      termGroups[foundGroup].push(term);
    });

    // 2. Filter products: Must match ALL groups (AND), and at least one term in each group (OR)
    return categoryProducts.filter(product => {
      // Robust normalization for technical values
      const normalize = (s: string) => s.toLowerCase().replace(/[*x]/g, 'x').replace(/[^a-z0-9x]/g, '').trim();
      
      return Object.entries(termGroups).every(([groupName, termsInGroup]) => {
        // Product must match AT LEAST ONE term in this group
        return termsInGroup.some(term => {
          const termNorm = normalize(term);
          
          // If the group is "Series", also check categories
          if (groupName === 'Series') {
            const catMatch = product.categories.some(cat => {
              const catNameNorm = normalize(cat.name);
              const catSlugNorm = normalize(cat.slug);
              return catNameNorm === termNorm || catSlugNorm === termNorm;
            });
            if (catMatch) return true;
          }

          // Check attributes
          return product.attributes.some(attr => {
            // Only match against the correct attribute group for better accuracy
            const attrGroupName = (n: string) => {
              const ln = n.toLowerCase();
              if (ln.includes('series') || ln.includes('multifun') || ln.includes('multifunction')) return 'Series';
              if (ln.includes('size')) return 'Size';
              if (ln.includes('display') || ln.includes('digit')) return 'Display';
              if (ln.includes('output') && !ln.includes('type')) return 'No of Outputs';
              if (ln.includes('output') && ln.includes('type')) return 'Control Output 1 Type';
              if (ln.includes('comm')) return 'Communication';
              if (ln.includes('excitation')) return 'Excitation Voltage';
              return n;
            };

            if (attrGroupName(attr.name) !== groupName) return false;

            return attr.options.some(opt => {
              const optNorm = normalize(opt);
              return optNorm === termNorm || optNorm.includes(termNorm) || termNorm.includes(optNorm);
            });
          });
        });
      });
    });
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
          nameLower.includes('temperature controller');
        
        if (cat.slug !== 'uncategorized' && !isSelected && !isParentCategory) {
          // If a category is selected, only show series that belong to it
          if (selectedCategory) {
            const currentCatData = attributes.find(a => a.slug === selectedCategory);
            const isAllowedTerm = currentCatData?.terms.some(t => 
              t.slug === cat.slug || t.name === cat.name
            );
            if (!isAllowedTerm) return;
          }
          filterMap.get('Series')!.add(cat.name);
        }
      });

      // 2. Extract Attributes
      product.attributes.forEach(attr => {
        const name = attr.name.toLowerCase();
        let targetName = attr.name;
        
        if (name.includes('series') || name.includes('multifun') || name.includes('multifunction')) targetName = 'Series';
        else if (name.includes('size')) targetName = 'Size';
        else if (name.includes('display') || name.includes('digit')) targetName = 'Display';
        else if (name.includes('output') && !name.includes('type')) targetName = 'No of Outputs';
        else if (name.includes('output') && name.includes('type')) targetName = 'Control Output 1 Type';
        else if (name.includes('comm')) targetName = 'Communication';
        else if (name.includes('excitation')) targetName = 'Excitation Voltage';

        if (!filterMap.has(targetName)) {
          filterMap.set(targetName, new Set());
        }

        attr.options.forEach(opt => {
          // If a category is selected and we are in the Series group, validate against allowed terms
          if (selectedCategory && targetName === 'Series') {
            const currentCatData = attributes.find(a => a.slug === selectedCategory);
            const isAllowedTerm = currentCatData?.terms.some(t => 
              t.name === opt || t.slug === opt
            );
            if (!isAllowedTerm) return;
          }
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
  }, [categoryProducts]);

  // 4. Robust Counting for Filter Visibility
  const filterCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    const normalize = (s: string) => s.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]/g, '');
    
    // Count based on the products matching the CURRENT selection
    filteredProducts.forEach(product => {
      // Categories
      product.categories.forEach(cat => {
        const normName = normalize(cat.name);
        const normSlug = normalize(cat.slug);
        counts[normName] = (counts[normName] || 0) + 1;
        if (normSlug !== normName) counts[normSlug] = (counts[normSlug] || 0) + 1;
      });
      // Attributes
      product.attributes.forEach(attr => {
        attr.options.forEach(opt => {
          const normOpt = normalize(opt);
          counts[normOpt] = (counts[normOpt] || 0) + 1;
        });
      });
    });
    return counts;
  }, [filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage])

  const toggleTerm = (term: string) => {
    const newTerms = selectedTerms.includes(term) 
      ? selectedTerms.filter(t => t !== term) 
      : [...selectedTerms, term];
    
    setSelectedTerms(newTerms);
    setCurrentPage(1);

    // Sync with URL
    const params = new URLSearchParams(searchParams.toString());
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
    const cat = attributes.find(a => a.slug === selectedCategory)
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
                        const normalize = (s: string) => s.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]/g, '');
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
                  Showing <span className="text-[#0070bc] font-black">{filteredProducts.length}</span> Precision {filteredProducts.length === 1 ? 'Instrument' : 'Instruments'}
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
              <div className="col-span-full flex flex-col items-center justify-center py-32">
                <Loader2 className="h-10 w-10 animate-spin text-[#0070bc]" strokeWidth={1.5} />
                <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initialising Catalog...</p>
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
                    <Link
                      href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}`}
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
                    </Link>
  
                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
                      <div className="text-center mb-6">
                        <Link
                          href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}`}
                          className="text-[16px] font-bold text-[#0070bc] hover:text-dark transition-colors duration-300 block leading-snug"
                        >
                          {product.name}
                        </Link>
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

                      <div className="mt-auto">
                        <Link
                          href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}`}
                          className="btn-premium btn-black-to-orange flex items-center justify-center gap-2 w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-lg shadow-lg"
                        >
                          View Details
                        </Link>
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
                <p className="text-sm text-gray-500 mb-8 max-w-xs text-center">We couldn't find any products matching your current configuration filters.</p>
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
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "h-10 px-5 rounded-xl text-[11px] font-black transition-all duration-300",
                      currentPage === i + 1
                        ? "bg-white text-[#0070bc] shadow-md border border-gray-100"
                        : "text-gray-400 hover:text-dark"
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
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
