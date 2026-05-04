import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
export const metadata: Metadata = { title: 'Case Studies', description: 'I-Therm real-world application case studies.' }
export default function CaseStudiesPage() {
  return (
    <>
      <PageHeroSection title="Case Studies" description="Real-world applications and results from I-Therm instrument deployments." breadcrumbs={[{ label: 'Resources', href: '/resources' }, { label: 'Case Studies' }]} tag="Case Studies" />
      <section className="py-16 bg-gray-50"><div className="mx-auto max-w-7xl px-4"><p className="text-gray-500">Case studies will load from WordPress CMS.</p></div></section>
    </>
  )
}
