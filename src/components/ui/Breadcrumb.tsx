'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  light?: boolean
}

export function Breadcrumb({ items, className, light }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-wrap items-center gap-1 text-sm', className)}>
      <Link
        href="/"
        className={cn('hover:underline', light ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-700')}
      >
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className={cn('h-3 w-3 shrink-0', light ? 'text-white/50' : 'text-gray-400')} />
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className={cn('hover:underline', light ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-700')}
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn('font-medium', light ? 'text-white' : 'text-gray-900')}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
