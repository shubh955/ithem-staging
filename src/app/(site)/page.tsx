import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { ProductCategoriesSection } from '@/components/sections/ProductCategoriesSection'
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection'
import { ApplicationsSection } from '@/components/sections/ApplicationsSection'
import { WhyIThermSection } from '@/components/sections/WhyIThermSection'
import { IndustriesSection } from '@/components/sections/IndustriesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTASection } from '@/components/sections/CTASection'
import { SITE_CONFIG } from '@/lib/utils/constants'

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Precision Temperature Controllers & Industrial Instruments`,
  description: SITE_CONFIG.description,
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProductCategoriesSection />
      <FeaturedProductsSection />
      {/* <ApplicationsSection /> */}
      <WhyIThermSection />
      <IndustriesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
