import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Our Clients',
  description: 'I-Therm trusted by 1000+ clients across India — pharmaceutical, food processing, plastics, and more.',
}

const clients = [
  'Hindustan Pharmaceuticals', 'Surya Food Industries', 'Polymer Tech India',
  'Gujarat Chemical Works', 'Precision Plastics Ltd', 'National Furnaces',
  'BioLab Systems', 'Eastern Packaging', 'Westcoast Chemicals', 'IndoMed Devices',
  'Metro Plastics', 'Alpha Industries',
]

export default function ClientsPage() {
  return (
    <>
      <PageHeroSection
        title="Our Clients"
        description="Over 1000 industrial clients trust I-Therm instruments for precision process control."
        breadcrumbs={[{ label: 'Clients' }]}
        tag="Client Portfolio"
      />

      {/* Client Logos Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-dark font-inter">Trusted By Leading Companies</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {clients.map((client) => (
              <div key={client} className="flex items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-6 text-center text-sm font-medium text-gray-600 hover:border-brand-orange/20 hover:text-dark transition-colors min-h-[80px]">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
    </>
  )
}
