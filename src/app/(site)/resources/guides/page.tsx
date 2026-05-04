import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
export const metadata: Metadata = { title: 'Guides & Manuals', description: 'I-Therm installation guides, operation manuals, and instrument selection guides.' }
export default function GuidesPage() {
  return (
    <>
      <PageHeroSection title="Guides & Manuals" description="Installation guides, operation manuals, and instrument selection resources." breadcrumbs={[{ label: 'Resources', href: '/resources' }, { label: 'Guides' }]} tag="Technical Resources" />
      <section className="py-16 bg-gray-50"><div className="mx-auto max-w-7xl px-4"><p className="text-gray-500">Guides will load from WordPress CMS.</p></div></section>
    </>
  )
}
