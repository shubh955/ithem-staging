import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { FeaturedProductsListing } from '@/components/sections/FeaturedProductsListing'

export const metadata: Metadata = {
  title: 'Featured Products',
  description: 'Browse I-Therm products marked as featured in WooCommerce.',
}

export default function FeaturedProductsPage() {
  return (
    <div className="bg-white">
      <PageHeroSection
        title="Featured Products"
        description="Selected I-Therm instruments marked as featured by our team."
        tag="Featured Catalog"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Featured Products' },
        ]}
      />

      <Suspense fallback={<div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-orange" /></div>}>
        <FeaturedProductsListing />
      </Suspense>
    </div>
  )
}
