import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { WhyIThermSection } from '@/components/sections/WhyIThermSection'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Company',
  description: 'Innovative Instruments & Controls LLP (I-Therm) — foremost manufacturer of process control & measuring instruments since 1996, Vasai (East), Maharashtra.',
}

export default function AboutPage() {
  return (
    <>
      <PageHeroSection
        title="About Innovative Instruments & Controls LLP"
        description="Operating as I-Therm — foremost manufacturer of process control & measuring instruments in India since 1996."
        breadcrumbs={[{ label: 'Company' }]}
        tag="Company"
      />

      {/* Company Overview */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-dark md:text-3xl font-inter">Our Story</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Innovative Instruments &amp; Controls LLP — operating under the brand <strong>Itherm Precision Unrivalled</strong> — is the foremost manufacturer of Process Control &amp; Measuring Instruments in the commercial capital of India since 1996.
              </p>
              <p className="mt-3 text-gray-600 leading-relaxed">
                With over a decade of advanced R&amp;D facilities, we serve the process control and instrumentation sector across almost all major industries — from pharmaceutical and food processing to textile dyeing, plastics, and chemical plants.
              </p>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Our state-of-the-art manufacturing facility at Vasai (East), Palghar is equipped with modern production capabilities and a well-manned expert team delivering precision instruments for real-time critical process applications.
              </p>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Our product range spans temperature, humidity, pressure, and flow measurement — along with precision timers, counters, data loggers, and autoclave controllers for full automation system integration.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '1996', label: 'Year Founded' },
                { value: '28+', label: 'Years of Experience' },
                { value: '50+', label: 'Product Models' },
                { value: '8+', label: 'Product Categories' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-gray-50 p-6 text-center border border-gray-100">
                  <div className="text-3xl font-bold text-brand-orange">{s.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="mt-14">
            <h3 className="text-xl font-bold text-dark font-inter mb-6">Core Capabilities</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Temperature Control', desc: 'TC & RTD inputs, PID & ON-OFF, auto-tune, multiple panel sizes' },
                { title: 'Humidity & Temp', desc: 'Dual PID for %rH and temperature in a single instrument' },
                { title: 'Data Logging', desc: 'Multi-channel loggers for pharmaceutical validation and compliance' },
                { title: 'Custom Engineering', desc: 'OEM instruments engineered to specification for system integrators' },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <h4 className="text-md font-bold text-dark">{c.title}</h4>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyIThermSection />
      <CTASection />
    </>
  )
}
