import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { ProductCategoriesSection } from '@/components/sections/ProductCategoriesSection'
import { FEATURED_PRODUCTS } from '@/lib/utils/constants'
import { ArrowRight, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse I-Therm temperature controllers (AI-5442, AI-7982), timers & counters (KCN series), humidity controllers (Humi-Temp), data loggers, and ULT controllers.',
}

export default function ProductsPage() {
  return (
    <>
      <PageHeroSection
        title="Product Catalogue"
        description="Precision process control & measuring instruments — 50+ models across 8 categories. Available in 48×48, 72×72, 96×96 MM and more panel sizes."
        breadcrumbs={[{ label: 'Products' }]}
        tag="I-Therm Products"
      />

      <ProductCategoriesSection />

      {/* Featured Products */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand-orange">Popular Models</p>
              <h2 className="text-2xl font-bold text-dark md:text-3xl font-inter">Featured Products</h2>
            </div>
            <Link href="/resources/catalogs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:gap-2.5 transition-all">
              <Download className="h-4 w-4" /> Download Full Catalog
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_PRODUCTS.map((product) => (
              <Link
                key={product.model}
                href={`/products/${product.category}/${product.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-brand-orange/30 hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative h-40 bg-gray-50 border-b border-gray-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 rounded-full bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 z-10">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <span className="font-mono text-xs font-bold text-brand-orange bg-orange-50 rounded px-2 py-0.5 self-start mb-2">
                    {product.model}
                  </span>
                  <h3 className="text-sm font-bold text-dark leading-snug group-hover:text-brand-orange transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{product.size} · {product.type}</p>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed flex-1">{product.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-orange">
                    View Details <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sizes Banner */}
      <section className="bg-dark py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Available Panel Sizes</p>
              <div className="flex flex-wrap gap-2">
                {['48×48 MM', '48×96 MM', '72×72 MM', '96×48 MM', '96×96 MM'].map((size) => (
                  <span key={size} className="rounded-lg border border-white/20 px-3 py-1 text-sm font-mono text-white/70">
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-bold text-white hover:bg-brand-orange-dark transition-colors"
            >
              Request a Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
