'use client'

import { notFound, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { ArrowRight, Download, Phone, CheckCircle2, ChevronRight, MessageSquare, FileText, ShieldCheck, Star } from 'lucide-react'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { ProductImageSlider } from '@/components/ui/ProductImageSlider'
import { SITE_CONFIG } from '@/lib/utils/constants'
import { fetchCachedJson } from '@/lib/api/client-cache'

type Tab = 'features' | 'specs' | 'applications'

interface ProductData {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  images: { src: string; alt: string }[];
  categories: { name: string; slug: string }[];
  attributes: { name: string; options: string[] }[];
  downloads?: { name: string; file: string }[];
  featured?: boolean;
  meta_data?: { key: string; value: string }[];
  replacement_product?: {
    id: number;
    name: string;
    slug: string;
    price?: string;
    image?: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const productSlug = params?.slug as string

  const productId = searchParams.get('id')
  const [product, setProduct] = useState<ProductData | null>(null)
  const [related, setRelated] = useState<any[]>([])
  const [tables, setTables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('features')

  useEffect(() => {
    async function loadData() {
      try {
        const productUrl = productId
          ? `/api/products?id=${productId}`
          : `/api/products?search=${encodeURIComponent(productSlug)}&per_page=1&page=1`

        const [productData, tablesData] = await Promise.all([
          fetchCachedJson<any>(productUrl),
          fetchCachedJson<any[]>('https://backend.itherm.co.in/wp-json/itherm/v1/tables')
        ])

        const nextProduct = productId
          ? productData
          : Array.isArray(productData.products)
            ? productData.products.find((p: ProductData) => p.slug === productSlug) || productData.products[0]
            : null

        if (nextProduct?.id) {
          setProduct(nextProduct)
          
          try {
            if (nextProduct.categories && nextProduct.categories.length > 0) {
              const categorySlug = nextProduct.categories[0].slug
              const relatedData = await fetchCachedJson<any>(`/api/products?category=${categorySlug}&per_page=4`)
              
              if (relatedData && Array.isArray(relatedData.products)) {
                const relatedProducts = relatedData.products
                  .filter((p: any) => p.id !== nextProduct.id)
                  .slice(0, 3)
                  .map((p: any) => ({
                    id: p.id,
                    slug: p.slug,
                    category: p.categories[0]?.slug || 'all',
                    name: p.name,
                    image: p.images[0]?.src || '',
                    model: (p.attributes.find((a: any) => a.name.toLowerCase().includes('model'))?.options[0] || p.name.split(' ').pop() || '').replace(/&amp;/g, '&'),
                    size: (p.attributes.find((a: any) => a.name.toLowerCase() === 'size')?.options[0] || '').replace(/&amp;/g, '&'),
                    display: (p.attributes.find((a: any) => a.name.toLowerCase().includes('digit') || a.name.toLowerCase().includes('display'))?.options[0] || '').replace(/&amp;/g, '&'),
                    input: (p.attributes.find((a: any) => a.name.toLowerCase().includes('input'))?.options[0] || '').replace(/&amp;/g, '&'),
                    short_description: p.short_description
                  }))
                setRelated(relatedProducts)
              } else {
                setRelated([])
              }
            } else {
              setRelated([])
            }
          } catch (error) {
            console.error('Error fetching related products:', error)
            setRelated([])
          }
        } else {
          setProduct(null)
          setRelated([])
        }
        if (Array.isArray(tablesData)) {
          setTables(tablesData)
        }
      } catch (error) {
        console.error('Error loading product details:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [productId, productSlug])

  // Mapping WooCommerce data to UI needs
  const uiProduct = useMemo(() => {
    if (!product) return null

    const specs = product.attributes.map(attr => ({
      label: attr.name,
      value: attr.options.join(', ')
    }))

    const extractFeatures = (html: string) => {
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const lis = doc.querySelectorAll('li')
      if (lis.length > 0) return Array.from(lis).map(li => li.textContent || '')
      return html.replace(/<[^>]*>/g, '').split('\n').filter(s => s.trim().length > 5).slice(0, 12)
    }

    const extractResources = (p: any) => {
      const resources: { label: string; url: string; sub: string }[] = []

      // 1. Native WooCommerce Downloads
      if (p.downloads && Array.isArray(p.downloads)) {
        p.downloads.forEach((d: any) => {
          resources.push({
            label: d.name,
            url: d.file,
            sub: d.name.toLowerCase().includes('manual') ? 'Installation Guide' : 'Technical PDF'
          })
        })
      }

      // 2. Extract from HTML Description
      const html = (p.description || '') + (p.short_description || '')
      if (html) {
        const doc = new DOMParser().parseFromString(html, 'text/html')
        const downloadSection = doc.querySelector('.download-tab-list, #tab-3, .download-section')
        const targets = downloadSection ? downloadSection.querySelectorAll('a') : doc.querySelectorAll('a')

        targets.forEach(a => {
          const text = a.textContent?.trim() || ''
          const href = a.getAttribute('href') || ''
          const isResource = text.toLowerCase().includes('data sheet') ||
            text.toLowerCase().includes('manual') ||
            text.toLowerCase().includes('download') ||
            href.includes('.pdf') ||
            href.includes('/ds-') ||
            href.includes('/oim-')

          if (isResource && href && !resources.find(r => r.url === href)) {
            resources.push({
              label: text,
              url: href,
              sub: text.toLowerCase().includes('manual') ? 'Installation Guide' : 'Technical PDF'
            })
          }
        })
      }
      return resources
    }

    const features = extractFeatures(product.short_description || product.description)
    const resources = extractResources(product)
    const model = product.attributes.find(a => a.name.toLowerCase().includes('model'))?.options[0] || product.name.split(' ').pop() || ''
    const size = product.attributes.find(a => a.name.toLowerCase().includes('size'))?.options[0] || ''
    const type = product.categories[0]?.name || ''
    const approvals = product.attributes.find(a => a.name.toLowerCase().includes('approval') || a.name.toLowerCase().includes('cert'))?.options || []

    // Safely extract metadata value as a string
    const getMetadataStringValue = (key: string): string => {
      const meta = product.meta_data?.find(m => m.key === key);
      if (!meta) return '';
      const val = meta.value;
      if (val === undefined || val === null) return '';
      if (typeof val === 'string') return val;
      if (Array.isArray(val)) {
        const first = val[0];
        if (first === undefined || first === null) return '';
        return typeof first === 'string' ? first : String(first);
      }
      return String(val);
    };

    // Extract YouTube video URLs from meta_data
    const nickxVideoUrl = getMetadataStringValue('_nickx_video_text_url');
    const rawVideoUrl = getMetadataStringValue('_video_url');
    
    // Prioritize _nickx_video_text_url if it has a value, otherwise fall back to _video_url
    const targetVideoUrl = nickxVideoUrl || rawVideoUrl;
    let videoEmbedUrl: string | null = null
    
    if (targetVideoUrl) {
      // Robust regex to extract exactly the 11-character YouTube video ID
      const ytMatch = targetVideoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (ytMatch && ytMatch[1]) {
        videoEmbedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
      }
    }

    return {
      name: product.name,
      model,
      size,
      type,
      tagline: product.short_description
        .replace(/<[^>]*>/g, ' ')
        .replace(/&#215;/g, '×')
        .replace(/&#8211;/g, '–')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160) + (product.short_description.length > 160 ? '...' : ''),
      description: product.description,
      features,
      specs,
      images: product.images.map(img => img.src),
      categoryName: product.categories[0]?.name || 'Products',
      category: product.categories[0]?.slug || 'all',
      approvals,
      resources,
      videoEmbedUrl,
      replacement_product: product.replacement_product
    }
  }, [product])

  // Find matching table for technical specs
  const activeTable = useMemo(() => {
    if (!uiProduct || !tables.length) return null
    // Clean model for matching
    const modelKey = uiProduct.model.toLowerCase().trim()
    return tables.find(t =>
      t.name.toLowerCase().includes(modelKey) ||
      modelKey.includes(t.name.toLowerCase()) ||
      uiProduct.name.toLowerCase().includes(t.name.toLowerCase())
    )
  }, [uiProduct, tables])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[#0070bc] animate-spin"></div>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Syncing Details...</p>
        </div>
      </div>
    )
  }

  if (!product || !uiProduct) return notFound()

  return (
    <>
      <PageHeroSection
        title={uiProduct.name}
        description={uiProduct.tagline}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: uiProduct.categoryName, href: `/products?category=${uiProduct.category}` },
          { label: uiProduct.model },
        ]}
        tag={uiProduct.categoryName}
      />

      {/* Main Content Grid */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* LEFT: Image slider + Quick Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <ProductImageSlider
                images={uiProduct.images}
                productName={uiProduct.name}
              />

              <div
                className="rounded-2xl bg-gray-50/50 p-5"
                style={{ border: '1px solid #00000014' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Core Model Parameters</p>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Model Series</dt>
                    <dd className="font-bold text-[#0070bc]">{uiProduct.model}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Standard Size</dt>
                    <dd className="font-bold text-dark">{uiProduct.size || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <dt className="text-gray-400">Product Type</dt>
                    <dd className="font-bold text-dark">{uiProduct.type}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* RIGHT: Header + Tabs + Cards */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {product.featured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-white" />
                    Featured
                  </span>
                )}
                {uiProduct.replacement_product && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 shadow-sm border border-red-200">
                    Discontinued
                  </span>
                )}
                <span className="font-mono text-sm font-bold text-brand-orange bg-orange-50 rounded-lg px-3 py-1.5">{uiProduct.model}</span>
                {uiProduct.name.toLowerCase() !== uiProduct.model.toLowerCase() && (
                  <span className="text-sm font-bold text-dark">{uiProduct.name}</span>
                )}
              </div>

              {uiProduct.replacement_product && (
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-red-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <h3 className="text-red-800 font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    Model Discontinued
                  </h3>
                  <p className="text-red-700/80 text-sm mb-4">This product has been discontinued and replaced by a newer model.</p>
                  <Link
                    href={`/products/${uiProduct.replacement_product.slug}?id=${uiProduct.replacement_product.id}`}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest shadow-md transition-colors"
                  >
                    View Replacement: {uiProduct.replacement_product.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {/* Tabs Navigation */}
              <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
                {(['features', 'specs'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-dark shadow-sm' : 'text-gray-400 hover:text-dark'
                      }`}
                  >
                    {tab === 'features' ? 'Key Features' : tab === 'specs' ? 'Specifications' : 'Applications'}
                  </button>
                ))}
              </div>

              {/* Tab Content with Scroller */}
              <div
                className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth bg-gray-50/30 rounded-2xl p-5"
                style={{ border: '1px solid #00000014' }}
              >
                {activeTab === 'features' && (
                  <ul className="space-y-3">
                    {uiProduct.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-[#0070bc] mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-600 font-medium leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-1">
                    {uiProduct.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-xs font-bold text-gray-400">{spec.label}</span>
                        <span className="text-xs font-bold text-dark text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'applications' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {['Automated Systems', 'Process Monitoring', 'OEM Equipment', 'Industrial Panels', 'Quality Control', 'Manufacturing'].map(app => (
                      <div
                        key={app}
                        className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm"
                        style={{ border: '1px solid #00000014' }}
                      >
                        <div className="h-2 w-2 rounded-full bg-brand-orange shadow-sm shadow-orange-200" />
                        <span className="text-xs font-bold text-dark">{app}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Inquiry & Support Card */}
              <div className="rounded-3xl border border-gray-100 bg-dark p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-32 w-32 bg-[#0070bc] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative">
                  <h3 className="text-white font-bold text-xl mb-2">Technical Assistance</h3>
                  <p className="text-white/40 text-sm mb-8 leading-relaxed">Need custom configurations or a formal quote? Our experts are ready to help.</p>
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/contact?product=${uiProduct.model}`}
                      className="btn-premium btn-orange-to-black flex items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold shadow-xl transition-transform hover:scale-[1.02]"
                    >
                      <MessageSquare className="h-4 w-4" /> Request Quote
                    </Link>
                    <a
                      href={`tel:${SITE_CONFIG.phone1}`}
                      className="flex items-center justify-center gap-3 py-3 text-sm font-bold text-white/70 hover:text-white transition-colors"
                    >
                      <Phone className="h-4 w-4" /> {SITE_CONFIG.phone1}
                    </a>
                  </div>
                </div>
              </div>

              {uiProduct.resources.length > 0 && (
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-dark mb-5">Product Resources</h4>
                  <div className="grid gap-3">
                    {uiProduct.resources.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-5 hover:border-[#0070bc]/30 hover:bg-white transition-all group"
                      >
                        <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:bg-[#0070bc] transition-colors">
                          <FileText className="h-5 w-5 text-[#0070bc] group-hover:text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-dark">{doc.label}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{doc.sub}</p>
                        </div>
                        <Download className="h-4 w-4 text-gray-300 group-hover:text-[#0070bc]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCT VIDEO SECTION */}
      {uiProduct.videoEmbedUrl && (
        <section className="bg-gray-50/50 py-16 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">Product Demo</p>
              <h2 className="text-3xl font-bold text-dark mb-4">See It In Action</h2>
              <div className="h-1.5 w-20 bg-[#0070bc] rounded-full"></div>
            </div>
            <div className="grid gap-10 lg:grid-cols-[2fr_1fr] items-start">
              {/* Video embed */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200 bg-black" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={uiProduct.videoEmbedUrl}
                  title={`${uiProduct.name} Product Demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              {/* Side info */}
              <div className="space-y-6">
                <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-dark mb-2">{uiProduct.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Watch this demonstration to see the {uiProduct.name} in operation, including setup, configuration, and real-world application scenarios.
                  </p>
                  <div className="h-px bg-gray-100 my-4" />
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-400 font-medium">Model</dt>
                      <dd className="font-bold text-[#0070bc]">{uiProduct.model}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400 font-medium">Category</dt>
                      <dd className="font-bold text-dark">{uiProduct.categoryName}</dd>
                    </div>
                  </dl>
                </div>
                <a
                  href={`/contact?product=${uiProduct.model}`}
                  className="btn-premium btn-orange-to-black flex items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold shadow-xl"
                >
                  <MessageSquare className="h-4 w-4" /> Request a Quote
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DYNAMIC SPECIFICATIONS TABLE (FROM API) */}
      <section id="specifications" className="bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Technical Specifications</h2>
            <div className="h-1.5 w-20 bg-[#0070bc] rounded-full"></div>
          </div>

          {activeTable ? (
            <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-2xl bg-white">
              <table className="w-full border-collapse text-[13px] leading-relaxed">
                <tbody>
                  {(() => {
                    const rawData = activeTable.data;
                    const rows = rawData.length;
                    const cols = rawData[0]?.length || 0;
                    const covered = Array.from({ length: rows }, () => Array(cols).fill(false));

                    return rawData.map((row: string[], r: number) => (
                      <tr key={r} className="border-b border-gray-300 last:border-0">
                        {row.map((cell, c) => {
                          if (covered[r][c] || cell === "#colspan#" || cell === "#rowspan#") return null;

                          let rowspan = 1;
                          let colspan = 1;

                          // Look ahead for colspans
                          for (let i = c + 1; i < cols; i++) {
                            if (row[i] === "#colspan#") {
                              colspan++;
                              covered[r][i] = true;
                            } else break;
                          }

                          // Look down for rowspans
                          for (let j = r + 1; j < rows; j++) {
                            if (rawData[j][c] === "#rowspan#") {
                              rowspan++;
                              for (let k = c; k < c + colspan; k++) {
                                covered[j][k] = true;
                              }
                            } else break;
                          }

                          const isHeading = cell.includes('t-heading') ||
                            cell.toLowerCase().includes('specification') ||
                            (c === 0 && colspan > 1);

                          return (
                            <td
                              key={c}
                              rowSpan={rowspan}
                              colSpan={colspan}
                              className={`px-6 py-4 border-r border-gray-300 last:border-0 align-top ${isHeading
                                ? 'bg-[#2e74b5] text-white font-bold uppercase tracking-wider text-center'
                                : c === 0 ? 'bg-gray-50/80 font-bold text-gray-600 w-[25%]' : 'text-dark font-medium'
                                }`}
                              dangerouslySetInnerHTML={{
                                __html: cell
                                  .replace(/<code[^>]*>/g, '')
                                  .replace(/<\/code>/g, '')
                                  .replace(/\n/g, '<br/>')
                              }}
                            />
                          );
                        })}
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Detailed technical specifications are being updated for this model.</p>
            </div>
          )}

          <p className="mt-6 text-[10px] text-gray-400 italic font-medium">* Technical specifications for {uiProduct.model} are subject to change without prior notice as per manufacturer updates.</p>
        </div>
      </section>



      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-gray-50/50 py-20 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-dark">Discover Similar Models</h2>
              <div className="h-1.5 w-16 bg-brand-orange mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel: any) => (
                <div
                  key={rel.slug}
                  className="group flex flex-col bg-white border hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl border-gray-100"
                >
                  {/* Image Section */}
                  <a
                    href={`/products/${rel.slug}?id=${rel.id}`}
                    className="relative w-full h-[220px] overflow-hidden bg-white group-hover:bg-gray-50/30 transition-colors duration-500"
                  >
                    {rel.image ? (
                      <Image
                        src={rel.image}
                        alt={rel.name}
                        fill
                        className="object-contain p-6 scale-95 group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-50">
                        <span className="font-bold text-[10px] text-gray-200 uppercase tracking-widest">I-Therm</span>
                      </div>
                    )}
                  </a>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1 border-t border-gray-50">
                    <div className="text-center mb-6">
                      <a
                        href={`/products/${rel.slug}?id=${rel.id}`}
                        className="text-lg font-bold text-[#0070bc] hover:text-dark transition-colors duration-300 block leading-snug"
                      >
                        {rel.name}
                      </a>
                      <span className="inline-block mt-2 font-mono text-[10px] font-bold text-gray-400 tracking-widest uppercase">{rel.model}</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {rel.size && (
                        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Dimension</span>
                          <span className="text-xs font-bold text-dark">{rel.size}</span>
                        </div>
                      )}
                      {rel.display && (
                        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Display</span>
                          <span className="text-xs font-semibold text-gray-600">{rel.display}</span>
                        </div>
                      )}
                      {rel.input && (
                        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Input</span>
                          <span className="text-xs font-semibold text-gray-600 truncate ml-4">{rel.input}</span>
                        </div>
                      )}
                      {!rel.size && !rel.display && !rel.input && (
                        <div
                          className="text-[12px] text-gray-500 line-clamp-2 font-medium text-center"
                          dangerouslySetInnerHTML={{ __html: rel.short_description }}
                        />
                      )}
                    </div>

                    <div className="mt-auto">
                      <a
                        href={`/products/${rel.slug}?id=${rel.id}`}
                        className="btn-premium btn-black-to-orange flex items-center justify-center gap-2 w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                      >
                        View Technical Data
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0070bc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #005a96;
        }
      `}</style>
    </>
  )
}

// React import for Fragment
import React from 'react';
