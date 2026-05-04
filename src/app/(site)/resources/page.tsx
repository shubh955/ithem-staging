import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { BookOpen, FileText, HelpCircle, BookMarked, Archive } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'I-Therm knowledge hub — blogs, case studies, FAQs, product catalogs, and guides.',
}

const resourceLinks = [
  { href: '/resources/blog', icon: BookOpen, title: 'Blog & Articles', description: 'Technical articles and industry insights' },
  { href: '/resources/case-studies', icon: FileText, title: 'Case Studies', description: 'Real-world application examples' },
  { href: '/resources/faqs', icon: HelpCircle, title: 'FAQs', description: 'Common questions answered by our engineers' },
  { href: '/resources/guides', icon: BookMarked, title: 'Guides & Manuals', description: 'Installation and operation guides' },
  { href: '/resources/catalogs', icon: Archive, title: 'Product Catalogs', description: 'Downloadable datasheets and catalogs' },
]

export default function ResourcesPage() {
  return (
    <>
      <PageHeroSection
        title="Resources & Knowledge Hub"
        description="Technical documentation, application guides, case studies, and FAQs for I-Therm products."
        breadcrumbs={[{ label: 'Resources' }]}
        tag="Knowledge Hub"
      />
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resourceLinks.map((r) => {
              const Icon = r.icon
              return (
                <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl bg-white p-6 border border-gray-100 hover:border-brand-orange/20 hover:shadow-md transition-all">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 shrink-0 group-hover:bg-brand-orange/10">
                    <Icon className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark group-hover:text-brand-orange transition-colors">{r.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{r.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
