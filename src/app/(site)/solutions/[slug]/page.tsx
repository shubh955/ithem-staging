import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'

function slugToTitle(slug: string) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = slugToTitle(params.slug)
  return { title: name, description: `I-Therm ${name} solution.` }
}

export default function SolutionDetailPage({ params }: { params: { slug: string } }) {
  const name = slugToTitle(params.slug)
  return (
    <>
      <PageHeroSection
        title={name}
        breadcrumbs={[{ label: 'Solutions', href: '/solutions' }, { label: name }]}
        tag="Solution"
      />
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500">Solution detail will load from WordPress CMS.</p>
        </div>
      </section>
    </>
  )
}
