import type { Metadata } from 'next'
import { ProductListing } from '@/components/sections/ProductListing'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse I-Therm temperature controllers, timers & counters, humidity controllers, and more industrial instruments.',
}

export default function ProductsPage() {
  return (
    <div className="pt-24 bg-white">
      <ProductListing />

      {/* Sizes Banner */}
      <section className="bg-dark py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div>
              <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-2">Technical Standards</p>
              <h3 className="text-white font-bold text-xl mb-3">Available Panel Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {['48×48 MM', '48×96 MM', '72×72 MM', '96×48 MM', '96×96 MM'].map((size) => (
                  <span key={size} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/70">
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-8 py-4 text-sm font-bold text-white hover:bg-brand-orange-dark transition-all shadow-lg hover:shadow-brand-orange/20"
            >
              Request a Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
