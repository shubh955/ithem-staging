import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'I-Therm solutions for process automation, furnace control, packaging, and more.',
}

export default function SolutionsPage() {
  return (
    <>
      <PageHeroSection
        title="Industrial Solutions"
        description="Application-specific instrument solutions for process automation, heat treatment, and precision control across industries."
        breadcrumbs={[{ label: 'Solutions' }]}
        tag="By Application"
      />
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500">Solutions will load from WordPress CMS once connected.</p>
        </div>
      </section>
    </>
  )
}
