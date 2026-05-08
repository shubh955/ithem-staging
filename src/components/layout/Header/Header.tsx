'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, ChevronDown, Search, Mail, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { getMappedAttributes } from '@/lib/api/woo'
import { NAV_ITEMS, type NavChild } from './nav.config'
import { SITE_CONFIG } from '@/lib/utils/constants'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<NavChild | null>(null)
  const [attributes, setAttributes] = useState<any[]>([])
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await fetch('/api/attributes')
        const data = await res.json()
        if (Array.isArray(data)) {
          setAttributes(data)
        }
      } catch (err) {
        console.error('Failed to fetch attributes:', err)
      }
    }

    const fetchAllProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (Array.isArray(data)) {
          setAllProducts(data)
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
    }

    fetchAttributes()
    fetchAllProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categories.some((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, allProducts])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinkClass = 'flex desktop-menu-links items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-700 hover:bg-orange-50 hover:text-brand-orange'

  const defaultProducts = allProducts.slice(0, 5)

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
        
        {/* Top bar */}
        <div className="hidden bg-dark py-2 text-[11px] font-semibold tracking-wider text-gray-300 border-b border-white/5 md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8 gap-8">
            <a href="mailto:sales@itherm.co.in" className="flex items-center gap-2 hover:text-brand-orange transition-all duration-300">
              <Mail className="h-3.5 w-3.5 text-brand-orange" />
              SALES@ITHERM.CO.IN
            </a>
            <a href="tel:+918591939916" className="flex items-center gap-2 hover:text-brand-orange transition-all duration-300">
              <Phone className="h-3.5 w-3.5 text-brand-orange" />
              +91 8591939916
            </a>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 desktop-padd-0 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="I-Therm — Precision Unrivalled"
              width={150}
              height={48}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 lg:flex self-stretch">
            {NAV_ITEMS.map((item) => {
              const displayItem = { ...item }
              if (item.label === 'Products' && attributes.length > 0) {
                displayItem.children = attributes.map(cat => ({
                  heading: cat.name,
                  items: cat.terms.length > 0 
                    ? cat.terms.map((term: any) => ({
                        label: term.name,
                        href: `/products?category=${cat.slug}&term=${term.slug}`,
                        description: term.description || `High-quality ${term.name} solutions for industrial process control.`,
                        image: item.defaultImage
                      }))
                    : [{
                        label: `All ${cat.name}`,
                        href: `/products/${cat.slug}`,
                        description: `Explore our complete range of ${cat.name}.`,
                        image: item.defaultImage
                      }]
                }))
              }

              return (
                <div
                  key={item.label}
                  className="flex items-center h-full padd-control"
                  onMouseEnter={() => displayItem.children && setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {item.href ? (
                    <Link href={item.href} className={navLinkClass}>
                      {item.label}
                      {displayItem.children && (
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', activeMenu === item.label && 'rotate-180')} />
                      )}
                    </Link>
                  ) : (
                    <button className={navLinkClass}>
                      {item.label}
                      <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', activeMenu === item.label && 'rotate-180')} />
                    </button>
                  )}

                  {/* Mega Menu */}
                  {displayItem.children && activeMenu === item.label && (
                    <div
                      className="absolute left-0 right-0 top-[calc(100%-2px)] z-50 bg-white border-b border-gray-100 shadow-2xl"
                      onMouseEnter={() => setActiveMenu(item.label)}
                      onMouseLeave={() => {
                        setActiveMenu(null)
                        setHoveredItem(null)
                      }}
                    >
                      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex items-start gap-8">
                          {/* Left: Preview Card (Sticky) */}
                          <div className="w-[300px] shrink-0 border-r border-gray-100 pr-8 sticky top-0 self-start">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg bg-gray-50">
                              <Image
                                src={hoveredItem?.image || item.defaultImage || '/logo.png'}
                                alt={hoveredItem?.label || item.label}
                                fill
                                className="object-cover transition-all duration-700 hover:scale-110"
                                sizes="300px"
                              />
                            </div>
                            <div className="mt-5">
                              <h4 className="text-base font-bold text-dark truncate">
                                {hoveredItem?.label || item.label}
                              </h4>
                              <p className="mt-2 text-sm text-gray-500 leading-relaxed min-h-[80px]">
                                {hoveredItem?.description || 'Innovative Instruments & Controls LLP (I-Therm) — foremost manufacturer of process control instruments since 1996.'}
                              </p>
                            </div>
                          </div>

                          {/* Right: Nav Links (Scrollable) */}
                          <div className="flex-1 max-h-[70vh] overflow-y-auto pl-8 custom-scrollbar">
                            <div className={cn(
                              "grid gap-y-10 gap-x-8",
                              displayItem.children.length > 4 ? "grid-cols-3" : `grid-cols-${displayItem.children.length}`
                            )}>
                              {displayItem.children.map((col, ci) => (
                                <div key={ci}>
                                  {col.heading && (
                                    <p className="mb-3 text-[14px] font-bold uppercase tracking-[0.15em] text-brand-orange border-b border-brand-orange/10 pb-1.5">
                                      {col.heading}
                                    </p>
                                  )}
                                  <ul className="space-y-1">
                                    {col.items.map((child) => (
                                      <li key={child.href}>
                                        <Link
                                          href={child.href}
                                          className="group/link block rounded-xl px-2.5 py-1.5 transition-all hover:bg-orange-50"
                                          onMouseEnter={() => setHoveredItem(child)}
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-700 group-hover/link:text-brand-orange">
                                              {child.label}
                                            </span>
                                            <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 group-hover/link:opacity-100 transition-all group-hover/link:translate-x-1" />
                                          </div>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Search + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearch(true)
                  }}
                  onFocus={() => setShowSearch(true)}
                  className="w-64 rounded-full border border-[#00000066] bg-gray-50 px-4 py-2 pl-10 text-xs focus:border-brand-orange focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Search Results Dropdown */}
              {showSearch && (searchQuery.trim().length > 0 || allProducts.length > 0) && (
                <div className="absolute right-0 mt-2 w-[400px] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 z-[60]">
                  <div className="max-h-[480px] overflow-y-auto custom-scrollbar p-2">
                    {searchQuery.trim().length > 0 ? (
                      searchResults.length > 0 ? (
                        <div className="space-y-1">
                          <p className="px-3 py-2 text-[14px] font-bold uppercase tracking-[0.15em] text-brand-orange border-b border-gray-50 mb-1">Search Results</p>
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}`}
                              onClick={() => {
                                setShowSearch(false)
                                setSearchQuery('')
                              }}
                              className="flex items-center gap-4 rounded-lg p-3 hover:bg-orange-50 transition-colors group"
                            >
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                                <Image
                                  src={product.images[0]?.src || '/logo.png'}
                                  alt={product.name}
                                  fill
                                  className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[15px] font-bold text-gray-800 truncate group-hover:text-brand-orange transition-colors">{product.name}</h4>
                                <p className="text-[13px] font-medium text-gray-500 truncate mt-0.5">
                                  {product.categories.map((c: any) => c.name).join(', ')}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm font-medium text-gray-500">No products found for "{searchQuery}"</p>
                          <div className="mt-6 border-t border-gray-100 pt-6">
                            <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left px-1">Recommended Products</p>
                            <div className="space-y-1">
                              {defaultProducts.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}`}
                                  onClick={() => {
                                    setShowSearch(false)
                                    setSearchQuery('')
                                  }}
                                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-gray-50">
                                    <Image src={product.images[0]?.src || '/logo.png'} alt={product.name} fill className="object-contain p-1" />
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700 truncate">{product.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="p-2">
                        <p className="px-3 py-2 text-[14px] font-bold uppercase tracking-[0.15em] text-brand-orange border-b border-gray-50 mb-1">Featured Products</p>
                        <div className="space-y-1">
                          {defaultProducts.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}`}
                              onClick={() => {
                                setShowSearch(false)
                                setSearchQuery('')
                              }}
                              className="flex items-center gap-4 rounded-lg p-3 hover:bg-orange-50 transition-colors group"
                            >
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                                <Image
                                  src={product.images[0]?.src || '/logo.png'}
                                  alt={product.name}
                                  fill
                                  className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <h4 className="text-[15px] font-bold text-gray-800 truncate group-hover:text-brand-orange transition-colors">{product.name}</h4>
                                <p className="text-[13px] font-medium text-gray-500 truncate mt-0.5">
                                  {product.categories.map((c: any) => c.name).join(', ')}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 transition-colors lg:hidden text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white lg:hidden max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#00000066] bg-gray-50 px-4 py-2.5 pl-10 text-sm focus:border-brand-orange focus:bg-white focus:outline-none transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const displayItem = { ...item }
                  if (item.label === 'Products' && attributes.length > 0) {
                    displayItem.children = attributes.map(cat => ({
                      heading: cat.name,
                      items: cat.terms.length > 0
                        ? cat.terms.map((term: any) => ({
                            label: term.name,
                            href: `/products?category=${cat.slug}&term=${term.slug}`,
                            description: term.description || `Explore ${term.name}`
                          }))
                        : [{
                            label: `All ${cat.name}`,
                            href: `/products/${cat.slug}`,
                            description: `Explore our complete range of ${cat.name}.`
                          }]
                    }))
                  }

                  return (
                    <div key={item.label}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange"
                          >
                            {item.label}
                            <ChevronDown className={cn('h-4 w-4 transition-transform', expandedMobile === item.label && 'rotate-180')} />
                          </button>
                          {expandedMobile === item.label && displayItem.children && (
                            <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-orange-100 pl-3">
                              {displayItem.children.flatMap((col) =>
                                col.items.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-lg px-2 py-2 text-sm text-gray-600 hover:text-brand-orange"
                                  >
                                    {child.label}
                                  </Link>
                                ))
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex flex-col gap-2 px-3 text-xs text-gray-500">
                  <a href="tel:+918591939916" className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> +91 8591939916
                  </a>
                  <a href="mailto:sales@itherm.co.in" className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> sales@itherm.co.in
                  </a>
                </div>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-lg bg-brand-orange px-4 py-3 text-center text-sm font-semibold text-white hover:bg-orange-600 shadow-md"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
