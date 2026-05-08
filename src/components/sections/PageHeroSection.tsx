import { Breadcrumb } from '@/components/ui/Breadcrumb'

interface PageHeroSectionProps {
  title: string
  description?: string
  breadcrumbs?: { label: string; href?: string }[]
  tag?: string
}

export function PageHeroSection({ title, description, breadcrumbs, tag }: PageHeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-dark pt-[160px] pb-[40px]">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-1 bg-brand-orange" />

      <div className="relative mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <Breadcrumb items={breadcrumbs} className="mb-5" light />
        )}
        {tag && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest pt-[20px] text-brand-orange ">
            {tag}
          </p>
        )}
        <h1 className="text-3xl font-bold text-white md:text-5xl font-inter leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-white/60 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
