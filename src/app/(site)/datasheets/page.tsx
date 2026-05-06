'use client'

import { useState, useMemo, useEffect } from 'react'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { DATASHEETS, type DatasheetItem } from '@/lib/data/datasheets'
import { Search, Download, FileText, ChevronRight, ChevronDown, Filter, X, Check } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const ITEMS_PER_PAGE = 6

export default function DatasheetsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(DATASHEETS.map(d => d.category)))]
    return cats
  }, [])

  // Filter datasheets based on search and category
  const filteredDatasheets = useMemo(() => {
    return DATASHEETS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.series.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  // Pagination calculations
  const totalPages = Math.ceil(filteredDatasheets.length / ITEMS_PER_PAGE)
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredDatasheets.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredDatasheets, currentPage])

  // Group by series for better structure (on the current page's items)
  const groupedDatasheets = useMemo(() => {
    const groups: Record<string, { category: string; items: DatasheetItem[] }> = {}
    paginatedItems.forEach(item => {
      const key = `${item.category} > ${item.series}`
      if (!groups[key]) {
        groups[key] = { category: item.category, items: [] }
      }
      groups[key].items.push(item)
    })
    return groups
  }, [paginatedItems])

  return (
    <main className="min-h-screen bg-white">
      <PageHeroSection 
        title="Technical Datasheets"
        description="Access comprehensive technical specifications and documentation for our complete range of process control instruments."
        breadcrumbs={[
          { label: 'Technical Datasheets' }
        ]}
        tag="Resources"
      />

      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row">
            
            {/* Sidebar: Filters & Search */}
            <aside className="w-full shrink-0 lg:w-[320px]">
              <div className="sticky top-32 space-y-8">
                {/* Search Box */}
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-dark">Search Models</h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="e.g. AI-5441..."
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-dark">Categories</h3>
                    <Filter className="h-4 w-4 text-gray-400" />
                  </div>

                  {/* Mobile Dropdown */}
                  <div className="lg:hidden">
                    <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-2 py-3 text-base font-bold text-dark shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-orange-50 p-1.5 text-brand-orange">
                          <Filter className="h-4 w-4" />
                        </div>
                        {selectedCategory}
                      </div>
                      <ChevronDown className={cn("h-5 w-5 transition-transform", isFilterOpen && "rotate-180")} />
                    </button>
                    
                    {isFilterOpen && (
                      <div className="mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-10">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsFilterOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between px-5 py-4 text-base font-bold transition-all border-b border-gray-50 last:border-0",
                              selectedCategory === cat ? "bg-orange-50 text-brand-orange" : "text-gray-600 active:bg-gray-50"
                            )}
                          >
                            {cat}
                            {selectedCategory === cat && <Check className="h-5 w-5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Desktop List Filter */}
                  <div className="hidden lg:flex lg:flex-col lg:gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold transition-all text-left",
                          selectedCategory === cat 
                            ? "bg-brand-orange/10 text-brand-orange" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-dark"
                        )}
                      >
                        {cat}
                        {selectedCategory === cat && <ChevronRight className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Filters */}
                {(searchQuery || selectedCategory !== 'All') && (
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-xs font-bold text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-all"
                  >
                    <X className="h-3 w-3" />
                    Reset All Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Main Content: Cards Grid */}
            <div className="flex-1">
              <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
                <p className="text-sm font-medium text-gray-500">
                  Showing <span className="text-dark font-bold">{filteredDatasheets.length}</span> results
                </p>
                <div className="hidden items-center gap-2 lg:flex">
                   {/* <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Layout:</span>
                   <div className="flex gap-1">
                      <div className="h-4 w-4 rounded-sm bg-gray-200" />
                      <div className="h-4 w-4 rounded-sm bg-gray-200" />
                   </div> */}
                </div>
              </div>

              {paginatedItems.length > 0 ? (
                <div className="space-y-12">
                  {Object.entries(groupedDatasheets).map(([groupName, data]) => (
                    <div key={groupName} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-6 flex items-center gap-4">
                        <h2 className="text-lg font-bold text-dark">{groupName}</h2>
                        <div className="h-px flex-1 bg-gray-100" />
                      </div>
                      
                      <div className="grid gap-6 sm:grid-cols-2">
                        {data.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="group relative flex flex-col justify-between rounded-[24px] border border-[#0000003d] bg-white p-5 transition-all hover:border-brand-orange/40 hover:shadow-xl"
                          >
                            <div>
                              <div className="mb-5 flex items-start justify-between">
                                <div className="rounded-xl bg-orange-50 p-3 text-brand-orange">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider black-color">
                                  Ref: {item.id.toUpperCase()}
                                </div>
                              </div>
                              <h3 className="text-lg font-bold text-dark group-hover:text-brand-orange transition-colors leading-tight mb-2">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                Technical specification sheet for {item.series}.
                              </p>
                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                              <a 
                                href={item.downloadUrl}
                                download
                                target="_blank"
                                className="flex items-center justify-center gap-2 rounded-xl bg-dark px-6 py-4 text-sm font-bold text-white transition-all hover:bg-brand-orange shadow-lg shadow-dark/5"
                              >
                                <Download className="h-4 w-4" />
                                Download PDF
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-2">
                       <button 
                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                         disabled={currentPage === 1}
                         className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                       >
                         <ChevronRight className="h-5 w-5 rotate-180" />
                       </button>
                       
                       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                         <button 
                           key={page}
                           onClick={() => setCurrentPage(page)}
                           className={cn(
                             "flex h-12 w-12 items-center justify-center rounded-2xl font-bold transition-all",
                             currentPage === page 
                               ? "bg-brand-orange text-white shadow-xl shadow-brand-orange/20" 
                               : "border border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange"
                           )}
                         >
                           {page}
                         </button>
                       ))}

                       <button 
                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                         disabled={currentPage === totalPages}
                         className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                       >
                         <ChevronRight className="h-5 w-5" />
                       </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-gray-300 shadow-sm">
                    <Search className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-dark">No matching data sheets</h3>
                  <p className="mt-2 text-gray-500">Try a different keyword or category.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Need Help CTA */}
      <section className="bg-gray-50 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-bold text-dark mb-6">Can&apos;t find the data sheet you need?</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">Our technical team can provide you with the exact specifications for any of our custom process control solutions.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact" 
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-brand-orange px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-brand-orange/30 hover:bg-orange-600 hover:-translate-y-1 transition-all"
            >
              Contact Technical Support
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link 
              href="tel:+912212345678" 
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white border border-gray-200 px-10 py-5 text-lg font-bold text-dark hover:bg-gray-50 transition-all"
            >
              Call Us Directly
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
