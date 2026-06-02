'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, ChevronDown, Search, Mail, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { fetchCachedJson } from '@/lib/api/client-cache'
import { getTelHref, type SiteSettings } from '@/lib/settings'
import { NAV_ITEMS, type NavChild, type NavColumn, type NavItem } from './nav.config'

type MenuTerm = {
  id?: number
  name: string
  slug: string
  description?: string
  count?: number
}

type MenuCategory = {
  id: number
  name: string
  slug: string
  terms?: MenuTerm[]
}

const cleanLabel = (value: string) => value
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/\bMultifun\b/g, 'Multifunction')

const sortByLabel = <T extends { name: string }>(items: T[]) =>
  [...items].sort((a, b) => cleanLabel(a.name).localeCompare(cleanLabel(b.name), undefined, {
    numeric: true,
    sensitivity: 'base',
  }))

const normalizeMenuKey = (value: string) => cleanLabel(value)
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/\bcontrollers\b/g, 'controller')
  .replace(/\bindicators\b/g, 'indicator')
  .replace(/\bcounters\b/g, 'counter')
  .replace(/\btimers\b/g, 'timer')
  .replace(/\btransmitters\b/g, 'transmitter')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

const PRODUCT_CATEGORY_ORDER = [
  'temperature controller',
  'process controller',
  'process indicator',
  'counter',
  'timer',
  'multifunction timer and counter',
  'application specific',
  'transmitter',
]

const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  'temperature controller': 'Temperature Controller',
  'process controller': 'Process Controller',
  'process indicator': 'Process Indicators',
  counter: 'Counters',
  timer: 'Timers',
  'multifunction timer and counter': 'Multifunction Timers & Counters',
  'application specific': 'Application Specific',
  transmitter: 'Transmitter',
}

const PRODUCT_TERM_ORDER: Record<string, string[]> = {
  'temperature controller': ['ai 5 series', 'ai 7 series', 'px series'],
  'process controller': ['fx series'],
  'process indicator': ['pi series', 'pi jd series'],
  counter: ['bl series'],
  timer: ['ktm series', 'xtm series'],
  'multifunction timer and counter': ['cx series', 'ctr series', 'xtc series'],
  'application specific': ['data logger', 'humidity controller', 'auto clave controller', 'ult controller'],
  transmitter: ['head mounted'],
}

const getOrderedIndex = (order: string[], value: string) => {
  const key = normalizeMenuKey(value)
  const exactIndex = order.indexOf(key)
  if (exactIndex >= 0) return exactIndex

  const fuzzyIndex = order.findIndex((orderedKey) => key.includes(orderedKey) || orderedKey.includes(key))
  return fuzzyIndex >= 0 ? fuzzyIndex : Number.MAX_SAFE_INTEGER
}

const sortProductCategories = (categories: MenuCategory[]) =>
  [...categories].sort((a, b) => {
    const orderDiff = getOrderedIndex(PRODUCT_CATEGORY_ORDER, a.name) - getOrderedIndex(PRODUCT_CATEGORY_ORDER, b.name)
    if (orderDiff !== 0) return orderDiff
    return cleanLabel(a.name).localeCompare(cleanLabel(b.name), undefined, { numeric: true, sensitivity: 'base' })
  })

const sortProductTerms = (categoryName: string, terms: MenuTerm[]) => {
  const categoryKey = PRODUCT_CATEGORY_ORDER[getOrderedIndex(PRODUCT_CATEGORY_ORDER, categoryName)]
  const termOrder = categoryKey ? PRODUCT_TERM_ORDER[categoryKey] : undefined

  if (!termOrder) return sortByLabel(terms)

  return [...terms].sort((a, b) => {
    const orderDiff = getOrderedIndex(termOrder, a.name) - getOrderedIndex(termOrder, b.name)
    if (orderDiff !== 0) return orderDiff
    return cleanLabel(a.name).localeCompare(cleanLabel(b.name), undefined, { numeric: true, sensitivity: 'base' })
  })
}

const isDiscontinuedCategory = (category: MenuCategory) => {
  const name = normalizeMenuKey(category.name)
  const slug = normalizeMenuKey(category.slug)
  return name.includes('discontinued') || slug.includes('discontinued')
}

const buildProductMenuColumn = (cat: MenuCategory, allProducts: any[]): NavColumn => {
  const categoryKey = PRODUCT_CATEGORY_ORDER[getOrderedIndex(PRODUCT_CATEGORY_ORDER, cat.name)]
  const heading = categoryKey ? PRODUCT_CATEGORY_LABELS[categoryKey] : cleanLabel(cat.name)
  const validTerms = (cat.terms || []).filter(term => typeof term.count !== 'number' || term.count > 0)
  const terms = sortProductTerms(cat.name, validTerms)

  return {
    heading,
    headingHref: `/products?category=${cat.slug}`,
    items: terms.map((term, index) => {
      const termNameLower = term.name.toLowerCase();
      const t = termNameLower.trim();
      const termSlugLower = term.slug?.toLowerCase() || '';

      const matchedProducts = allProducts.filter(p => {
        return p.name?.toLowerCase().includes(t) ||
          p.categories?.some((c: any) => c.slug?.toLowerCase().includes(t) || c.name?.toLowerCase().includes(t) || (termSlugLower && c.slug?.toLowerCase() === termSlugLower)) ||
          p.attributes?.some((a: any) => a.options?.some((opt: string) => opt.toLowerCase().includes(t)));
      });

      const matchedProductsWithImages = matchedProducts.filter(p => p.images?.[0]?.src);
      const selectedProduct = matchedProductsWithImages.length > 0
        ? matchedProductsWithImages[index % matchedProductsWithImages.length]
        : null;

      const finalSlug = term.name === 'AI-7 Series' ? 'ai-7-series' : (term.slug || term.name);
      return {
        label: cleanLabel(term.name),
        href: `/products?category=${cat.slug}&terms=${encodeURIComponent(finalSlug)}`,
        description: term.description || `High-quality ${cleanLabel(term.name)} solutions for industrial process control.`,
        image: selectedProduct?.images?.[0]?.src || undefined,
      }
    }),
  }
}

const getProductsMenuColumns = (item: NavItem, categories: MenuCategory[], allProducts: any[]): NavColumn[] => {
  return sortProductCategories(categories)
    .filter((cat) => !isDiscontinuedCategory(cat))
    .map((cat) => buildProductMenuColumn(cat, allProducts))
}

const getDiscontinuedProductsMenuColumn = (categories: MenuCategory[], allProducts: any[]) => {
  const discontinuedCategory = categories.find(isDiscontinuedCategory)
  return discontinuedCategory ? buildProductMenuColumn(discontinuedCategory, allProducts) : null
}

const getGridColumnsClass = (count: number) => {
  if (count >= 4) return 'grid-cols-4'
  if (count === 3) return 'grid-cols-3'
  if (count === 2) return 'grid-cols-2'
  return 'grid-cols-1'
}

const getProductGridColumnsClass = (count: number) => {
  if (count >= 4) return 'grid-cols-4'
  return getGridColumnsClass(count)
}

type HeaderProps = {
  settings: SiteSettings
}

export function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<NavChild | null>(null)
  const [hoveredDynamicImage, setHoveredDynamicImage] = useState<string | null>(null)
  const [attributes, setAttributes] = useState<MenuCategory[]>([])
  const [productsMenuLoading, setProductsMenuLoading] = useState(true)

  useEffect(() => {
    setHoveredDynamicImage(null)
    if (!hoveredItem || hoveredItem.image || !hoveredItem.href?.includes('terms=')) {
      return
    }

    let isMounted = true
    const fetchDynamicImage = async () => {
      try {
        const url = new URL(hoveredItem.href, window.location.origin)
        const terms = url.searchParams.get('terms')
        if (!terms) return

        const res = await fetch(`/api/products?search=${encodeURIComponent(terms.replace(/-/g, ' '))}&per_page=1`)
        if (!isMounted) return
        const data = await res.json()
        if (data?.products?.[0]?.images?.[0]?.src) {
          setHoveredDynamicImage(data.products[0].images[0].src)
        }
      } catch (err) {
        // ignore errors for dynamic prefetch
      }
    }
    fetchDynamicImage()

    return () => {
      isMounted = false
    }
  }, [hoveredItem])

  // Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const data = await fetchCachedJson<MenuCategory[]>('/api/attributes')
        if (Array.isArray(data)) {
          setAttributes(data)
        }
      } catch (err) {
        console.error('Failed to fetch attributes:', err)
      } finally {
        setProductsMenuLoading(false)
      }
    }

    const fetchAllProducts = async () => {
      try {
        const data = await fetchCachedJson<{ products?: any[] }>('/api/products?per_page=100')
        if (Array.isArray(data)) {
          setAllProducts(data)
        } else if (Array.isArray(data?.products)) {
          setAllProducts(data.products)
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
    }

    fetchAttributes()
    fetchAllProducts()
  }, [])

  useEffect(() => {
    const query = searchQuery.trim()

    if (query.length === 0) {
      setSearchResults([])
      return
    }

    const loadSearchResults = async () => {
      try {
        const params = new URLSearchParams({
          search: query,
          per_page: '6',
          page: '1',
        })
        const data = await fetchCachedJson<{ products?: any[] }>(`/api/products?${params.toString()}`)
        setSearchResults(Array.isArray(data) ? data.slice(0, 6) : data.products || [])
      } catch (err) {
        console.error('Failed to search products:', err)
        setSearchResults([])
      }
    }

    loadSearchResults()
  }, [searchQuery])

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
            <a href={`mailto:${settings.email}`} className="group flex items-center gap-2 text-[12px] font-medium transition-all duration-300">
              <Mail className="h-3.5 w-3.5 text-white group-hover:text-brand-orange transition-colors duration-300" />
              <span className="text-white group-hover:text-brand-orange transition-colors duration-300">{settings.email}</span>
            </a>
            <a href={getTelHref(settings.phone1)} className="group flex items-center gap-2 text-[12px] font-medium transition-all duration-300">
              <Phone className="h-3.5 w-3.5 text-white group-hover:text-brand-orange transition-colors duration-300" />
              <span className="text-white group-hover:text-brand-orange transition-colors duration-300">{settings.phone1}</span>
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
              const isProductsMenu = item.label === 'Products'
              if (isProductsMenu && attributes.length > 0) {
                displayItem.children = getProductsMenuColumns(item, attributes, allProducts)
              }
              const discontinuedProductsColumn = isProductsMenu && attributes.length > 0
                ? getDiscontinuedProductsMenuColumn(attributes, allProducts)
                : null
              const hasMegaMenu = Boolean(displayItem.children) || isProductsMenu

              const dynamicDefaultProduct = isProductsMenu && allProducts.length > 0
                ? allProducts.find((p: any) => p.featured && p.images?.[0]?.src) || allProducts.find((p: any) => p.images?.[0]?.src)
                : null;

              const displayImage = hoveredDynamicImage || hoveredItem?.image || dynamicDefaultProduct?.images?.[0]?.src || item.defaultImage || '/logo.png';
              const displayLabel = hoveredItem?.label || (isProductsMenu ? 'Industrial Instruments' : item.label);
              const displayDesc = hoveredItem?.description || (isProductsMenu ? 'Explore our comprehensive range of high-quality process control instruments.' : 'Innovative Instruments & Controls LLP (I-Therm) — foremost manufacturer of process control instruments since 1996.');

              return (
                <div
                  key={item.label}
                  className="flex items-center h-full padd-control"
                  onMouseEnter={() => hasMegaMenu && setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {item.href ? (
                    <Link href={item.href} className={navLinkClass}>
                      {item.label}
                      {hasMegaMenu && (
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
                  {hasMegaMenu && activeMenu === item.label && (
                    <div
                      className="absolute left-0 right-0 top-[calc(100%-2px)] z-50 bg-white border-b border-gray-100 shadow-2xl"
                      onMouseEnter={() => setActiveMenu(item.label)}
                      onMouseLeave={() => {
                        setActiveMenu(null)
                        setHoveredItem(null)
                      }}
                    >
                      <div className={cn(
                        "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
                        isProductsMenu ? "py-5" : "py-8"
                      )}>
                        <div className={cn("flex items-start", isProductsMenu ? "gap-6" : "gap-8")}>
                          {/* Left: Preview Card (Sticky) */}
                          <div className={cn(
                            "shrink-0 sticky top-0 self-start",
                            isProductsMenu
                              ? "w-[220px] border-r border-gray-100 pr-5"
                              : "w-[300px] border-r border-gray-100 pr-8"
                          )}>
                            <div className={cn(
                              "relative overflow-hidden bg-gray-50",
                              isProductsMenu ? "aspect-[16/10] rounded-xl shadow-md" : "aspect-[4/3] rounded-2xl shadow-lg"
                            )}>
                              <Image
                                src={displayImage}
                                alt={displayLabel}
                                fill
                                className="object-cover transition-all duration-700 hover:scale-110"
                                sizes={isProductsMenu ? "220px" : "300px"}
                              />
                            </div>
                            <div className={cn(isProductsMenu ? "mt-3" : "mt-5")}>
                              <h4 className={cn(
                                "font-bold text-dark truncate",
                                isProductsMenu ? "text-sm" : "text-base"
                              )}>
                                {displayLabel}
                              </h4>
                              <p className={cn(
                                "mt-2 text-gray-500 overflow-hidden",
                                isProductsMenu ? "max-h-[60px] text-xs leading-5" : "min-h-[80px] text-sm leading-relaxed"
                              )}>
                                {displayDesc}
                              </p>
                            </div>
                          </div>

                          {/* Right: Nav Links (Scrollable) */}
                          <div className={cn(
                            "flex-1 custom-scrollbar",
                            isProductsMenu
                              ? "max-h-[calc(100vh-130px)] overflow-y-auto"
                              : "max-h-[70vh] overflow-y-auto pl-8"
                          )}>
                            {isProductsMenu && productsMenuLoading ? (
                              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                                <Loader2 className="h-7 w-7 animate-spin text-brand-orange" />
                                <p className="mt-4 text-sm font-semibold text-gray-700">Loading product categories...</p>
                                <p className="mt-1 text-xs text-gray-400">Syncing latest WooCommerce menu</p>
                              </div>
                            ) : (displayItem.children && displayItem.children.length > 0) || discontinuedProductsColumn ? (
                              <div>
                                {displayItem.children && displayItem.children.length > 0 && (
                                  <div className={cn(
                                    "grid",
                                    isProductsMenu ? "gap-y-6 gap-x-7" : "gap-y-10 gap-x-8",
                                    isProductsMenu
                                      ? getProductGridColumnsClass(displayItem.children.length)
                                      : getGridColumnsClass(displayItem.children.length)
                                  )}>
                                    {displayItem.children.map((col, ci) => (
                                      <div key={ci}>
                                        {col.heading && (col.headingHref ? (
                                          <a
                                            href={col.headingHref}
                                            className={cn(
                                              "block font-bold tracking-normal text-brand-orange transition-colors hover:text-orange-600",
                                              isProductsMenu ? "mb-2 text-[13px] leading-snug" : "mb-3 text-[14px]"
                                            )}
                                            onClick={() => setActiveMenu(null)}
                                          >
                                            {col.heading}
                                          </a>
                                        ) : (
                                          <p className={cn(
                                            "font-bold tracking-normal text-brand-orange",
                                            isProductsMenu ? "mb-2 text-[13px] leading-snug" : "mb-3 text-[14px]"
                                          )}>
                                            {col.heading}
                                          </p>
                                        ))}
                                        {col.items.length > 0 && <ul className={cn(isProductsMenu ? "space-y-0.5" : "space-y-1")}>
                                          {col.items.map((child) => (
                                            <li key={child.href}>
                                              <a
                                                href={child.href}
                                                className={cn(
                                                  "group/link block transition-all hover:bg-orange-50",
                                                  isProductsMenu ? "rounded-lg px-1.5" : "rounded-xl px-2.5 py-1.5"
                                                )}
                                                onMouseEnter={() => setHoveredItem(child)}
                                                onClick={() => setActiveMenu(null)}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <span className={cn(
                                                    "font-semibold text-gray-700 group-hover/link:text-brand-orange",
                                                    isProductsMenu ? "text-[13px] leading-6" : "text-sm"
                                                  )}>
                                                    {child.label}
                                                  </span>
                                                  <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 group-hover/link:opacity-100 transition-all group-hover/link:translate-x-1" />
                                                </div>
                                              </a>
                                            </li>
                                          ))}
                                        </ul>}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {isProductsMenu && discontinuedProductsColumn && (
                                  <div className="dis-area border-t border-red-100 pt-3">
                                    <a
                                      href={discontinuedProductsColumn.headingHref || '/products'}
                                      className="inline-flex text-[13px] leading-snug font-semibold text-gray-700 transition-colors"
                                      onClick={() => setActiveMenu(null)}
                                    >
                                     To view discontinued products:<p className="click-here">  Click Here</p>
                                    </a>
                                       {/* {discontinuedProductsColumn.heading || 'Discontinued Products'} */}
                                    {discontinuedProductsColumn.items.length > 0 && (
                                      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                        {discontinuedProductsColumn.items.map((child) => (
                                          <li key={child.href}>
                                            <a
                                              href={child.href}
                                              className="text-[13px] font-semibold leading-6 text-red-500 underline decoration-red-200 underline-offset-4 transition-colors hover:text-red-700"
                                              onMouseEnter={() => setHoveredItem(child)}
                                              onClick={() => setActiveMenu(null)}
                                            >
                                              {child.label}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex min-h-[220px] items-center justify-center text-sm font-semibold text-gray-500">
                                Product categories are not available right now.
                              </div>
                            )}
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
                            <a
                              key={product.id}
                              href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}?id=${product.id}`}
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
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm font-medium text-gray-500">No products found for &quot;{searchQuery}&quot;</p>
                          <div className="mt-6 border-t border-gray-100 pt-6">
                            <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left px-1">Recommended Products</p>
                            <div className="space-y-1">
                              {defaultProducts.map((product) => (
                                <a
                                  key={product.id}
                                  href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}?id=${product.id}`}
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
                                </a>
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
                            <a
                              key={product.id}
                              href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}?id=${product.id}`}
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
                            </a>
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
                  const isProductsMenu = item.label === 'Products'
                  if (isProductsMenu && attributes.length > 0) {
                    displayItem.children = getProductsMenuColumns(item, attributes, allProducts)
                  }
                  const discontinuedProductsColumn = isProductsMenu && attributes.length > 0
                    ? getDiscontinuedProductsMenuColumn(attributes, allProducts)
                    : null
                  const hasMegaMenu = Boolean(displayItem.children) || isProductsMenu

                  return (
                    <div key={item.label}>
                      {hasMegaMenu ? (
                        <>
                          <button
                            onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange"
                          >
                            {item.label}
                            <ChevronDown className={cn('h-4 w-4 transition-transform', expandedMobile === item.label && 'rotate-180')} />
                          </button>
                          {expandedMobile === item.label && (
                            <div className="ml-3 mt-1 space-y-3 border-l-2 border-orange-100 pl-3">
                              {isProductsMenu && productsMenuLoading ? (
                                <div className="flex items-center gap-2 px-2 py-3 text-sm font-semibold text-gray-500">
                                  <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
                                  Loading product categories...
                                </div>
                              ) : (displayItem.children && displayItem.children.length > 0) || discontinuedProductsColumn ? (
                                <>
                                  {isProductsMenu && discontinuedProductsColumn && (
                                    <div className="border-b border-red-100 pb-3">
                                      <a
                                        href={discontinuedProductsColumn.headingHref || '/products'}
                                        onClick={() => setMobileOpen(false)}
                                        className="block rounded-lg px-2 py-1.5 text-sm font-extrabold text-red-600 underline decoration-red-300 decoration-2 underline-offset-4"
                                      >
                                        {discontinuedProductsColumn.heading || 'Discontinued Products'}
                                      </a>
                                      {discontinuedProductsColumn.items.map((child) => (
                                        <a
                                          key={child.href}
                                          href={child.href}
                                          onClick={() => setMobileOpen(false)}
                                          className="block rounded-lg px-2 py-1 text-sm font-semibold text-red-500 underline decoration-red-200 underline-offset-4"
                                        >
                                          {child.label}
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                  {displayItem.children?.map((col) => (
                                    <div key={col.heading || col.items[0]?.href}>
                                      {col.heading && (
                                        <a
                                          href={col.headingHref || '#'}
                                          onClick={() => setMobileOpen(false)}
                                          className="block rounded-lg px-2 py-1.5 text-sm font-bold text-brand-orange"
                                        >
                                          {col.heading}
                                        </a>
                                      )}
                                      {col.items.map((child) => (
                                        <a
                                          key={child.href}
                                          href={child.href}
                                          onClick={() => setMobileOpen(false)}
                                          className="block rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:text-brand-orange"
                                        >
                                          {child.label}
                                        </a>
                                      ))}
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <div className="px-2 py-3 text-sm font-semibold text-gray-500">
                                  Product categories are not available right now.
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        null
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex flex-col gap-2 px-3 text-xs text-gray-500">
                  <a href={getTelHref(settings.phone1)} className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> {settings.phone1}
                  </a>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {settings.email}
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
