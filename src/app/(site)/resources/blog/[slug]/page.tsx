import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'

function slugToTitle(slug: string) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return { title: slugToTitle(params.slug) }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <PageHeroSection
        title={slugToTitle(params.slug)}
        breadcrumbs={[{ label: 'Resources', href: '/resources' }, { label: 'Blog', href: '/resources/blog' }, { label: slugToTitle(params.slug) }]}
      />
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-gray-500">Blog post will load from WordPress CMS.</p>
        </div>
      </section>
    </>
  )
}
