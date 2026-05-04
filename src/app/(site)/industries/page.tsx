import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { IndustriesSection } from '@/components/sections/IndustriesSection'

export const metadata: Metadata = {
  title: 'Industries Served',
  description: 'I-Therm instruments trusted across pharmaceutical, food processing, plastics, chemical, and more.',
}

export default function IndustriesPage() {
  return (
    <>
      <PageHeroSection
        title="Industries We Serve"
        description="I-Therm instruments are trusted across 10+ industries for reliable, precise process control."
        breadcrumbs={[{ label: 'Industries' }]}
        tag="By Industry"
      />
      <IndustriesSection />
    </>
  )
}
