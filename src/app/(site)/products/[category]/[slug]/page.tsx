'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Download, Phone, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { ProductImageSlider } from '@/components/ui/ProductImageSlider'
import { SITE_CONFIG } from '@/lib/utils/constants'
import { getProductBySlug, getRelatedProducts } from '@/lib/utils/products-data'

type Tab = 'overview' | 'specs' | 'applications'

export default function ProductDetailPage({
  params,
}: {
  params: { category: string; slug: string }
}) {
  const product = getProductBySlug(params.category, params.slug)
  if (!product) notFound()

  const related = getRelatedProducts(product, 3)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <>
      <PageHeroSection
        title={product.name}
        description={product.tagline}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: product.categoryName, href: `/products/${product.category}` },
          { label: product.model },
        ]}
        tag={product.categoryName}
      />

      {/* Main Content */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* LEFT: Image slider — sticky */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">

              {/* Image Slider */}
              {(product.images && product.images.length > 0) || product.image ? (
                <ProductImageSlider
                  images={
                    product.images && product.images.length > 0
                      ? product.images
                      : product.image ? [product.image] : []
                  }
                  productName={product.name}
                />
              ) : null}

              {/* Quick Spec Card */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Quick Specs</p>
                <dl className="space-y-3">
                  {product.specs.slice(0, 6).map((spec: { label: string; value: string }) => (
                    <div key={spec.label} className="flex justify-between gap-2">
                      <dt className="text-xs text-gray-400 shrink-0">{spec.label}</dt>
                      <dd className="text-xs font-semibold text-dark text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* RIGHT: Content + sidebar cards */}
            <div className="space-y-6">

              {/* Model header */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-bold text-brand-orange bg-orange-50 rounded-lg px-3 py-1.5">
                  {product.model}
                </span>
                <span className="text-sm text-gray-400 font-mono">{product.size}</span>
                <span className="text-sm text-gray-400">·</span>
                <span className="text-sm text-gray-400">{product.type}</span>
                {product.badge && (
                  <span className="rounded-full bg-dark text-white text-xs font-semibold px-3 py-1">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Tab navigation */}
              <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
                {(['overview', 'specs', 'applications'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-white text-dark shadow-sm'
                        : 'text-gray-400 hover:text-dark'
                    }`}
                  >
                    {tab === 'overview' ? 'Overview' : tab === 'specs' ? 'Specifications' : 'Applications'}
                  </button>
                ))}
              </div>

              {/* Tab: Overview */}
              {activeTab === 'overview' && (
                <div>
                  <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>

                  <h3 className="mt-8 mb-4 text-base font-bold text-dark">Key Features</h3>
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {product.features.map((f: string) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Inputs / Outputs / Comms */}
                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {product.inputs && product.inputs.length > 0 && (
                      <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                        <p className="text-xs font-bold text-dark uppercase tracking-wide mb-2">Inputs</p>
                        <ul className="space-y-1">
                          {product.inputs.map((i: string) => (
                            <li key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                              <span className="h-1 w-1 rounded-full bg-brand-orange shrink-0" />
                              {i}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.outputs && product.outputs.length > 0 && (
                      <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                        <p className="text-xs font-bold text-dark uppercase tracking-wide mb-2">Outputs</p>
                        <ul className="space-y-1">
                          {product.outputs.map((o: string) => (
                            <li key={o} className="flex items-center gap-1.5 text-xs text-gray-500">
                              <span className="h-1 w-1 rounded-full bg-brand-orange shrink-0" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.communication && product.communication.length > 0 && (
                      <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                        <p className="text-xs font-bold text-dark uppercase tracking-wide mb-2">Communication</p>
                        <ul className="space-y-1">
                          {product.communication.map((c: string) => (
                            <li key={c} className="flex items-center gap-1.5 text-xs text-gray-500">
                              <span className="h-1 w-1 rounded-full bg-brand-orange shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Specifications */}
              {activeTab === 'specs' && (
                <div>
                  <div className="overflow-hidden rounded-2xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-2/5">
                            Parameter
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.specs.map((spec: { label: string; value: string }, i: number) => (
                          <tr
                            key={spec.label}
                            className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                          >
                            <td className="px-5 py-3.5 text-gray-500 font-medium">{spec.label}</td>
                            <td className="px-5 py-3.5 text-dark font-medium">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {product.supply && (
                    <p className="mt-4 text-xs text-gray-400">
                      Supply: <span className="text-dark font-medium">{product.supply}</span>
                    </p>
                  )}
                  {product.approvals && product.approvals.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {product.approvals.map((a: string) => (
                        <span
                          key={a}
                          className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Applications */}
              {activeTab === 'applications' && (
                <div>
                  <p className="text-sm text-gray-500 mb-6">
                    The {product.model} is used across the following industries and applications:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {product.applications.map((app: string) => (
                      <div
                        key={app}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                      >
                        <span className="h-2 w-2 rounded-full bg-brand-orange shrink-0" />
                        <span className="text-sm text-dark font-medium">{app}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-100 p-6">
                    <p className="text-sm font-bold text-dark mb-1">
                      Need this for your specific application?
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Our engineers can recommend the right model and accessories for your process requirements.
                    </p>
                    <Link
                      href="/contact"
                      className="btn-premium btn-orange-to-black inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-md"
                    >
                      Talk to an Engineer <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Enquire Card */}
              <div className="rounded-2xl border border-brand-orange/20 bg-dark p-5">
                <p className="text-sm font-bold text-white mb-1">Get a Quote</p>
                <p className="text-xs text-white/50 mb-5">
                  Send us your requirements and we&apos;ll respond within 24 hours.
                </p>
                <Link
                  href={`/contact?product=${product.model}`}
                  className="btn-premium btn-orange-to-black mb-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-md"
                >
                  <MessageSquare className="h-4 w-4" /> Request Quote
                </Link>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi, I'm interested in ${product.model}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium btn-whatsapp-fill mb-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm"
                >
                  <svg 
                    className="h-4 w-4 fill-current" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp Us
                </a>
                <a
                  href={`tel:${SITE_CONFIG.phone1}`}
                  className="flex w-full items-center justify-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" /> {SITE_CONFIG.phone1}
                </a>
              </div>

              {/* Download */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Downloads</p>
                <Link
                  href="/resources/catalogs"
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:border-brand-orange/30 transition-colors"
                >
                  <Download className="h-4 w-4 text-brand-orange shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-dark">Product Catalog 2024</p>
                    <p className="text-[10px] text-gray-400">Full I-Therm catalog PDF</p>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange mb-1">
                  Same Category
                </p>
                <h2 className="text-xl font-bold text-dark font-inter">Related Products</h2>
              </div>
              <Link
                href={`/products/${product.category}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:gap-2.5 transition-all"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel: { slug: string; category: string; model: string; size: string; name: string; tagline: string }) => (
                <Link
                  key={rel.slug}
                  href={`/products/${rel.category}/${rel.slug}`}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 hover:border-brand-orange/30 hover:shadow-md transition-all"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-orange bg-orange-50 rounded px-2.5 py-1">
                      {rel.model}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{rel.size}</span>
                  </div>
                  <h3 className="text-sm font-bold text-dark leading-snug group-hover:text-brand-orange transition-colors">
                    {rel.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-500 flex-1">{rel.tagline}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-orange">
                    View Details <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-dark py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <p className="text-white font-bold text-lg">Ready to order the {product.model}?</p>
              <p className="text-white/50 text-sm mt-0.5">
                Contact us for pricing, lead time, and volume discounts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/contact?product=${product.model}`}
                className="btn-premium btn-orange-to-black inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-md"
              >
                Get Pricing <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phone1}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40 transition-colors"
              >
                <Phone className="h-4 w-4" /> {SITE_CONFIG.phone1}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
