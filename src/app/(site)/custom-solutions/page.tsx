import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { CTASection } from '@/components/sections/CTASection'
import { CheckCircle } from 'lucide-react'
export const metadata: Metadata = { title: 'Custom Solutions', description: 'I-Therm custom OEM instruments, turnkey projects, and process automation integration.' }
const offerings = [
  { title: 'OEM Instrument Development', desc: 'Custom-branded instruments to your panel size, range, and communication protocol. Prototype in 2 weeks.', points: ['Custom housing & labelling', 'Any sensor input range', 'RS485 / Modbus / 4-20mA'] },
  { title: 'Turnkey Projects', desc: 'End-to-end project delivery — from requirements to commissioned control panels and enclosures.', points: ['Panel design & fabrication', 'Wiring & commissioning', 'Site testing & handover'] },
  { title: 'Process Automation Integration', desc: 'Integrate I-Therm controllers into your SCADA or PLC system for full automation.', points: ['SCADA connectivity', 'PLC integration support', 'Data logging setup'] },
]
export default function CustomSolutionsPage() {
  return (
    <>
      <PageHeroSection title="Custom Solutions" description="OEM instruments, turnkey projects, and process automation solutions engineered to your exact specifications." breadcrumbs={[{ label: 'Custom Solutions' }]} tag="OEM & Turnkey" />
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {offerings.map((o) => (
              <div key={o.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-7 hover:border-brand-orange/20 hover:bg-orange-50/30 transition-colors">
                <h3 className="text-lg font-bold text-dark font-inter">{o.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{o.desc}</p>
                <ul className="mt-4 space-y-2">
                  {o.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 shrink-0 text-brand-orange" /> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  )
}
