'use client'

import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { DOWNLOADS, type DownloadItem } from '@/lib/data/downloads'
import { FileDown, Binary, Monitor, Settings, Download, ExternalLink, ChevronRight, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

export default function DownloadsPage() {
  const catalogs = DOWNLOADS.filter(d => d.type === 'catalog')
  const software = DOWNLOADS.filter(d => d.type === 'software')

  return (
    <main className="min-h-screen bg-white">
      <PageHeroSection 
        title="Downloads & Software"
        description="Access our latest product catalogs and technical software utilities for configuration and monitoring."
        breadcrumbs={[
          { label: 'Resources', href: '/datasheets' },
          { label: 'Downloads' }
        ]}
        tag="Support Center"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        
        {/* Section: Product Catalogs */}
        <section className="mb-20 relative overflow-hidden rounded-[40px] bg-[#fdfaf8] p-8 lg:p-10 border border-orange-100/50">
          <div className="absolute top-0 right-0 h-96 w-96 translate-x-32 -translate-y-32 rounded-full bg-brand-orange/5 blur-3xl" />
          
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-1.5 bg-brand-orange rounded-full" />
                <h2 className="text-3xl font-bold text-dark">Product Catalogs</h2>
              </div>
              <p className="mb-8 text-base text-gray-600 leading-relaxed max-w-xl">
                Access our comprehensive technical documentation. Download the complete I-Therm product range catalog featuring our latest innovations.
              </p>

              <div className="space-y-4">
                {catalogs.map((item) => (
                  <div 
                    key={item.id}
                    className="group relative rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-orange/40 hover:shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-brand-orange">
                          <FileDown className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-dark group-hover:text-brand-orange transition-colors">
                            {item.title}
                          </h3>
                          {item.fileSize && (
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              PDF • {item.fileSize}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <a 
                          href={item.fileUrl}
                          target="_blank"
                          className="flex h-10 items-center gap-2 rounded-lg bg-dark px-4 text-xs font-bold text-white transition-all hover:bg-brand-orange"
                        >
                          View
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <a 
                          href={item.fileUrl}
                          download
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-brand-orange hover:text-brand-orange"
                        >
                          <Download className="h-4.5 w-4.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Scaled Down Image Mockup */}
            <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-[32px] shadow-xl border-4 border-white mx-auto w-full max-w-[380px]">
              <Image 
                src="/catalog_mockup.png" 
                alt="I-Therm Catalog Mockup" 
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Section: Software & Utilities */}
        <section>
          <div className="mb-10 flex items-end justify-between border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-3xl font-bold text-dark">Software & Utilities</h2>
              <p className="mt-2 text-gray-500">Configuration tools and PC applications for our instruments.</p>
            </div>
            <Monitor className="h-10 w-10 text-gray-100" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {software.map((item) => (
              <div 
                key={item.id}
                className="group p-[1.5px] rounded-[28px] bg-gradient-to-br from-[#f5702c] to-white transition-all hover:shadow-2xl hover:shadow-brand-orange/10"
              >
                <div className="h-full flex flex-col justify-between rounded-[27px] bg-white p-6">
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="rounded-xl bg-gray-50 p-3 text-gray-400 group-hover:text-brand-orange transition-colors">
                        <Binary className="h-6 w-6" />
                      </div>
                      {item.version && (
                        <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                          {item.version}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-dark leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-500 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    <a 
                      href={item.fileUrl}
                      download
                      target="_blank"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-5 py-4 text-sm font-bold text-dark transition-all hover:bg-brand-orange hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                      Download {item.fileUrl.endsWith('/') ? 'Package' : 'ZIP File'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-dark py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <Settings className="mx-auto h-16 w-16 text-brand-orange mb-8 animate-spin-slow" />
          <h2 className="text-3xl font-bold text-white mb-6">Need a custom software solution?</h2>
          <p className="text-xl text-white/60 mb-10">We provide custom communication protocols and monitoring software tailored to your industrial automation requirements.</p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-brand-orange/30 hover:bg-orange-600 transition-all hover:-translate-y-1"
          >
            Inquire for Custom Software
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
