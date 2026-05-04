import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { Download } from 'lucide-react'
export const metadata: Metadata = { title: 'Product Catalogs', description: 'Download I-Therm product catalogs and datasheets.' }
const catalogs = [
  { title: 'Temperature Controllers Catalog 2024', category: 'Temperature Controllers', size: '4.2 MB' },
  { title: 'Timers & Counters Catalog 2024', category: 'Timers & Counters', size: '2.8 MB' },
  { title: 'ULT Controllers Datasheet', category: 'ULT Controllers', size: '1.5 MB' },
  { title: 'Complete Product Range 2024', category: 'All Products', size: '8.1 MB' },
]
export default function CatalogsPage() {
  return (
    <>
      <PageHeroSection title="Product Catalogs & Datasheets" description="Download the latest I-Therm product catalogs, datasheets, and specification sheets." breadcrumbs={[{ label: 'Resources', href: '/resources' }, { label: 'Catalogs' }]} tag="Downloads" />
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogs.map((c) => (
              <div key={c.title} className="flex items-start justify-between gap-4 rounded-2xl bg-white border border-gray-100 p-6 hover:border-brand-orange/20 hover:shadow-sm transition-all">
                <div>
                  <p className="text-xs text-brand-orange font-semibold mb-1">{c.category}</p>
                  <h3 className="text-sm font-bold text-dark">{c.title}</h3>
                  <p className="mt-1 text-xs text-gray-400">PDF · {c.size}</p>
                </div>
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-brand-orange hover:bg-brand-orange hover:text-white transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
