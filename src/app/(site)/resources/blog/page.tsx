import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles, industry insights, and application guides from I-Therm engineers.',
}

export default function BlogPage() {
  return (
    <>
      <PageHeroSection
        title="Blog & Articles"
        description="Technical insights, industry trends, and application guides from I-Therm's engineering team."
        breadcrumbs={[{ label: 'Resources', href: '/resources' }, { label: 'Blog' }]}
        tag="Knowledge Hub"
      />
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500">Blog posts will load from WordPress CMS once connected.</p>
        </div>
      </section>
    </>
  )
}
