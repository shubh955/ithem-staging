import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { FEATURED_PRODUCTS } from '@/lib/utils/constants'

const badges: Record<string, { label: string; className: string }> = {
  Popular: { label: 'Popular', className: 'bg-brand-orange text-white' },
  Specialty: { label: 'Specialty', className: 'bg-dark text-white' },
}

export function FeaturedProductsSection() {
  return (
    <section className="greey-background relative overflow-hidden bg-white py-16 md:py-20">
      {/* Subtle dotted grid background */}
      <div 
        className="absolute inset-0 opacity-[0.4]" 
        style={{ 
          backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)', 
          backgroundSize: '24px 24px' 
        }} 
      />
      
      {/* Faint gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-orange">
              Best Sellers
            </p>
            <h2 className="text-4xl font-bold text-dark md:text-5xl font-inter leading-tight">
              Featured Products
            </h2>
            <p className="mt-3 max-w-lg text-base text-gray-500 leading-relaxed">
              Our most trusted instruments — chosen by OEMs and engineers across India.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 text-base font-semibold text-brand-orange hover:gap-3 transition-all"
          >
            View all products <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.model}
              href={`/products/${product.category}/${product.slug}`}
              className="group feature-product-card flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-brand-orange/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              {/* Image area */}
              <div className="upper-cover relative flex items-center justify-center bg-gray-50 h-48 overflow-hidden border-b border-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="product-image object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Badge */}
                {product.badge && badges[product.badge] && (
                  <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold z-10 ${badges[product.badge].className}`}>
                    {badges[product.badge].label}
                  </span>
                )}

                {/* Panel size chip */}
                <span className="absolute black-color top-3 right-3 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium z-10">
                  {product.size}
                </span>

                {/* Product type chip */}
                <span className="absolute bottom-3 left-3 rounded-full border border-gray-200 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-orange uppercase tracking-wider z-10">
                  {product.type}
                </span>
              </div>

              {/* Content */}
              <div className="feature-card-content flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold text-dark leading-snug group-hover:text-brand-orange transition-colors">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed flex-1">
                  {product.description}
                </p>

                {/* Key specs */}
                {/* <ul className="mt-4 space-y-2">
                  {product.specs.slice(0, 3).map((spec) => (
                    <li key={spec} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-orange" />
                      {spec}
                    </li>
                  ))}
                </ul> */}

                {/* CTA row */}
                <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-brand-orange">View Details</span>
                  <ArrowRight className="h-4 w-4 text-brand-orange opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="mt-12 rounded-2xl bg-dark px-8 py-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-bold text-brand-orange mb-1">Custom Requirements?</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Panel sizes from 48×48 to 96×96 MM. Multiple output and communication options available.
            </p>
          </div>
          <Link
            href="/custom-solutions"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
          >
            Request Custom OEM Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
