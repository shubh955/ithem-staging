import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
export const metadata: Metadata = { title: 'FAQs', description: 'Frequently asked questions about I-Therm instruments.' }
const faqs = [
  { q: 'What is the warranty on I-Therm products?', a: 'All I-Therm instruments come with a 12-month warranty against manufacturing defects from the date of purchase.' },
  { q: 'Do you offer custom instruments?', a: 'Yes, we specialize in OEM and turnkey instrument solutions. Prototypes can be ready in 2 weeks.' },
  { q: 'What communication protocols do your controllers support?', a: 'Most models support RS485 with Modbus RTU. Some models also support RS232 and 4-20mA output.' },
  { q: 'Where can I download product datasheets?', a: 'All datasheets are available in the Resources > Catalogs section or on individual product pages.' },
]
export default function FAQsPage() {
  return (
    <>
      <PageHeroSection title="Frequently Asked Questions" description="Common questions about I-Therm instruments, ordering, and support." breadcrumbs={[{ label: 'Resources', href: '/resources' }, { label: 'FAQs' }]} tag="Support" />
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-white border border-gray-100 p-6">
              <h3 className="text-base font-bold text-dark">{faq.q}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
