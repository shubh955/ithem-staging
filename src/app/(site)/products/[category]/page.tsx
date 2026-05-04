import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { PRODUCT_CATEGORIES } from '@/lib/utils/constants'
import { getProductsByCategory } from '@/lib/utils/products-data'

type Props = { params: { category: string } }

// Build a lookup from the const data
const CATEGORY_MAP = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.slug, c])
)

export async function generateStaticParams() {
  return PRODUCT_CATEGORIES.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = CATEGORY_MAP[params.category]
  if (!cat) return { title: 'Products' }
  return {
    title: cat.name,
    description: `${cat.description} Browse I-Therm's ${cat.name} range.`,
  }
}

export default function ProductCategoryPage({ params }: Props) {
  const cat = CATEGORY_MAP[params.category]
  if (!cat) notFound()

  const products = getProductsByCategory(params.category)

  return (
    <>
      <PageHeroSection
        title={cat.name}
        description={cat.description}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: cat.name },
        ]}
        tag="Product Category"
      />

      {/* Products Grid */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Category Meta */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-orange uppercase tracking-widest mb-1">
                {cat.count}
              </p>
              <h2 className="text-2xl font-bold text-dark font-inter">
                {cat.name}
              </h2>
            </div>
            {/* Model chips */}
            <div className="hidden md:flex flex-wrap gap-1.5 max-w-sm justify-end">
              {cat.models.slice(0, 5).map((m) => (
                <span
                  key={m}
                  className="font-mono text-[10px] bg-orange-100 text-brand-orange rounded px-2 py-0.5 font-bold"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${params.category}/${product.slug}`}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-brand-orange/30 hover:shadow-md transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-gray-50 border-b border-gray-100 overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-200">
                        <span className="font-mono text-sm font-bold">{product.model}</span>
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute top-3 left-3 rounded-full bg-brand-orange text-white text-[10px] font-bold px-2.5 py-0.5 z-10">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-brand-orange bg-orange-50 rounded px-2.5 py-1">
                      {product.model}
                    </span>
                  </div>

                  {/* Name & meta */}
                  <h3 className="text-base font-bold text-dark leading-snug group-hover:text-brand-orange transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400 font-mono">
                    {product.size} · {product.type}
                  </p>

                  {/* Tagline */}
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed flex-1">
                    {product.tagline}
                  </p>

                  {/* Key specs */}
                  <ul className="mt-4 space-y-1.5 border-t border-gray-50 pt-4">
                    {product.specs.slice(0, 3).map((spec) => (
                      <li key={spec.label} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{spec.label}</span>
                        <span className="font-medium text-dark">{spec.value}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand-orange">
                    View Full Specs
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Placeholder if no static data yet */
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center">
              <p className="text-gray-400 text-sm">
                Product listings for <strong>{cat.name}</strong> will be available soon.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:gap-2.5 transition-all"
              >
                Enquire about this range <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-dark py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <p className="text-white font-bold text-lg">Need a specific model?</p>
              <p className="text-white/50 text-sm mt-0.5">
                Contact us for custom sizes, OEM variants, or technical datasheets.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-bold text-white hover:bg-brand-orange-dark transition-colors"
              >
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/resources/catalogs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40 transition-colors"
              >
                Download Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* All Categories */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Other Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.filter((c) => c.slug !== params.category).map((c) => (
              <Link
                key={c.slug}
                href={`/products/${c.slug}`}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-dark hover:border-brand-orange/40 hover:text-brand-orange transition-colors"
              >
                {c.name}
                <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
