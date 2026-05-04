import Link from 'next/link'
import { ArrowRight, Thermometer, Timer, Droplets, BarChart3, Snowflake, FlaskConical } from 'lucide-react'

const applications = [
  {
    icon: Thermometer,
    title: 'Temperature Control',
    description: 'Precise PID and ON/OFF temperature control for ovens, furnaces, heat treatment, and industrial heating systems.',
    products: ['AI-5 Series', 'AI-7 Series', 'Fx Series'],
    href: '/solutions/temperature-control',
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  {
    icon: Timer,
    title: 'Batch & Count Control',
    description: 'Preset counters and timers for batch production, packaging lines, injection moulding, and conveyor counting.',
    products: ['KTM Series', 'Cx Series', 'BL Series'],
    href: '/solutions/batch-counting',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: Droplets,
    title: 'Humidity & Temp Control',
    description: 'Dual-loop PID control for environmental chambers, stability rooms, and cold storage with compressor protection.',
    products: ['Humi-Temp', 'RHTC-400'],
    href: '/solutions/humidity-control',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
  },
  {
    icon: BarChart3,
    title: 'Data Logging & Validation',
    description: 'Multi-channel data logging with USB transfer for pharmaceutical validation, GMP compliance, and audit trails.',
    products: ['AI-USB-Logger', 'VA-Logger'],
    href: '/solutions/data-logging',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: FlaskConical,
    title: 'Autoclave Sterilization',
    description: 'Automated sterilization cycle management with F0 calculation, guaranteed soak time, and safety abort logic.',
    products: ['FAAC+', 'VA-Clave'],
    href: '/solutions/autoclave-control',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    icon: Snowflake,
    title: 'Ultra-Low Temperature',
    description: 'Cascade refrigeration control for ULT freezers, cryo-storage, and sub-zero pharmaceutical storage.',
    products: ['ULT Series'],
    href: '/solutions/ult-control',
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
  },
]

export function ApplicationsSection() {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-orange">
            Applications
          </p>
          <h2 className="text-4xl font-bold text-dark md:text-5xl font-inter leading-tight">
            Built for Every Process
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500 leading-relaxed">
            From pharmaceutical sterilization to plastic extrusion — I-Therm instruments are engineered for the exact demands of your process.
          </p>
        </div>

        {/* Applications Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => {
            const Icon = app.icon
            return (
              <Link
                key={app.title}
                href={app.href}
                className={`group flex flex-col rounded-2xl border ${app.border} ${app.bg} p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white border ${app.border} mb-5`}>
                  <Icon className={`h-6 w-6 ${app.color}`} />
                </div>

                <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-brand-orange transition-colors font-inter">
                  {app.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {app.description}
                </p>

                {/* Product tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {app.products.map((p) => (
                    <span key={p} className="rounded-full bg-white/80 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                      {p}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-brand-orange">
                  Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Bottom link */}
        <div className="mt-12 text-center">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-dark px-8 py-3.5 text-base font-bold text-dark hover:bg-dark hover:text-white transition-colors"
          >
            View All Solutions <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
