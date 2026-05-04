'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { NAV_ITEMS } from './nav.config'
import { SITE_CONFIG } from '@/lib/utils/constants'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinkClass = 'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-700 hover:bg-orange-50 hover:text-brand-orange'

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
        {/* Top info bar — only when scrolled */}
        {/* {isScrolled && (
          <div className="hidden border-b border-gray-100 bg-gray-50 py-1.5 text-xs text-gray-500 md:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <span>Innovative Instruments &amp; Controls LLP — Itherm Precision Unrivalled | Since 1996</span>
              <a href={`tel:${SITE_CONFIG.phone1}`} className="flex items-center gap-1.5 hover:text-brand-orange">
                <Phone className="h-3 w-3" />
                {SITE_CONFIG.phone1}
              </a>
            </div>
          </div>
        )} */}

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="I-Therm — Precision Unrivalled"
              width={160}
              height={52}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {item.href ? (
                  <Link href={item.href} className={navLinkClass}>
                    {item.label}
                  </Link>
                ) : (
                  <button className={navLinkClass}>
                    {item.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', activeMenu === item.label && 'rotate-180')} />
                  </button>
                )}

                {/* Mega Menu — always white */}
                {item.children && activeMenu === item.label && (
                  <div
                    className="absolute left-0 top-full z-50 mt-2 min-w-[480px] rounded-xl border border-gray-100 bg-white p-5 shadow-2xl"
                    onMouseEnter={() => setActiveMenu(item.label)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <div className={cn('grid gap-6', item.children.length > 2 ? 'grid-cols-3' : 'grid-cols-2')}>
                      {item.children.map((col, ci) => (
                        <div key={ci}>
                          {col.heading && (
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-orange">
                              {col.heading}
                            </p>
                          )}
                          <ul className="space-y-0.5">
                            {col.items.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="block rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                                >
                                  <span className="font-medium">{child.label}</span>
                                  {child.description && (
                                    <span className="block text-xs text-gray-400">{child.description}</span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* <Link
              href="/contact"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold transition-colors lg:block bg-brand-orange text-white hover:bg-orange-600"
            >
              Get a Quote
            </Link> */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 transition-colors lg:hidden text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu — always white */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white lg:hidden max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
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
                      {expandedMobile === item.label && item.children && (
                        <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-orange-100 pl-3">
                          {item.children.flatMap((col) =>
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
              ))}
              <div className="pt-3 border-t border-gray-100">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-lg bg-brand-orange px-4 py-3 text-center text-sm font-semibold text-white hover:bg-orange-600"
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
