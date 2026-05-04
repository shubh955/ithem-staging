import Link from 'next/link'
import { ArrowRight, Thermometer, Timer, Droplets, Database, Zap, FlaskConical, Activity, Clock } from 'lucide-react'

const categories = [
  {
    slug: 'temperature-controllers',
    name: 'Temperature Controllers',
    description: 'PID & ON/OFF controllers in 48×48, 72×72, 96×96 MM sizes. Models: AI-5442, AI-5742, AI-5942, AI-7481, AI-7982 and more.',
    icon: Thermometer,
    count: '20+ models',
    href: '/products/temperature-controllers',
    highlight: true,
    models: 'AI-5×42 · AI-7×8× Series',
    colorClass: 'bg-red-50',
    iconColor: 'text-red-500',
    hoverBgClass: 'hover:bg-red-50/50',
    hoverBorderClass: 'hover:border-red-200',
  },
  {
    slug: 'timers-counters',
    name: 'Timers & Counters',
    description: 'I-Count brand digital preset counters. Single & double set point. Models: KCN-444 to KCN-998 in 5 panel sizes.',
    icon: Timer,
    count: '10 models',
    href: '/products/timers-counters',
    highlight: false,
    models: 'KCN-444 · KCN-888 · KCN-998',
    colorClass: 'bg-blue-50',
    iconColor: 'text-blue-500',
    hoverBgClass: 'hover:bg-blue-50/50',
    hoverBorderClass: 'hover:border-blue-200',
  },
  {
    slug: 'humidity-controllers',
    name: 'Humidity Controllers',
    description: 'Humi-Temp series — dual PID control for temperature & %rH. Compressor delay, low water alert.',
    icon: Droplets,
    count: '2 models',
    href: '/products/humidity-controllers',
    highlight: false,
    models: 'Humi-Temp · RHTC-44',
    colorClass: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    hoverBgClass: 'hover:bg-cyan-50/50',
    hoverBorderClass: 'hover:border-cyan-200',
  },
  {
    slug: 'data-loggers',
    name: 'Data Loggers',
    description: 'Multi-channel data loggers for pharmaceutical validation. AI-Logger, USB Logger, and Autoclave VA-Logger.',
    icon: Database,
    count: '3 models',
    href: '/products/data-loggers',
    highlight: false,
    models: 'AI-Logger · AI-USB-Logger · VA-Logger',
    colorClass: 'bg-green-50',
    iconColor: 'text-green-500',
    hoverBgClass: 'hover:bg-green-50/50',
    hoverBorderClass: 'hover:border-green-200',
  },
  {
    slug: 'ult-controllers',
    name: 'ULT Controllers',
    description: 'Ultra-low temperature controllers for deep freezers, cryo-storage, and sub-zero industrial processes.',
    icon: Zap,
    count: 'Multiple models',
    href: '/products/ult-controllers',
    highlight: false,
    models: 'ULT Series',
    colorClass: 'bg-purple-50',
    iconColor: 'text-purple-500',
    hoverBgClass: 'hover:bg-purple-50/50',
    hoverBorderClass: 'hover:border-purple-200',
  },
  {
    slug: 'autoclave-controllers',
    name: 'Autoclave Controllers',
    description: 'Dedicated process controllers for autoclave sterilization cycles, validation, and data recording.',
    icon: FlaskConical,
    count: 'Custom',
    href: '/products/autoclave-controllers',
    highlight: false,
    models: 'Autoclave Series',
    colorClass: 'bg-rose-50',
    iconColor: 'text-rose-500',
    hoverBgClass: 'hover:bg-rose-50/50',
    hoverBorderClass: 'hover:border-rose-200',
  },
  {
    slug: 'process-indicators',
    name: 'Process Indicators',
    description: 'Multi-input process indicators for temperature, pressure, flow, and custom engineering unit display.',
    icon: Activity,
    count: 'Multiple models',
    href: '/products/process-indicators',
    highlight: false,
    models: 'AI Indicator Series',
    colorClass: 'bg-amber-50',
    iconColor: 'text-amber-500',
    hoverBgClass: 'hover:bg-amber-50/50',
    hoverBorderClass: 'hover:border-amber-200',
  },
  {
    slug: 'time-totalizers',
    name: 'Time Totalizers',
    description: 'Elapsed time and run-hour totalizer meters for machine maintenance scheduling and monitoring.',
    icon: Clock,
    count: 'Multiple models',
    href: '/products/time-totalizers',
    highlight: false,
    models: 'TT Series',
    colorClass: 'bg-teal-50',
    iconColor: 'text-teal-500',
    hoverBgClass: 'hover:bg-teal-50/50',
    hoverBorderClass: 'hover:border-teal-200',
  },
]

export function ProductCategoriesSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white py-20 md:py-28">
      {/* Decorative background glow */}
      <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-brand-orange/5 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 h-[500px] w-[500px] rounded-full bg-brand-orange/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-orange">
              Our Products
            </p>
            <h2 className="text-4xl font-bold text-dark md:text-5xl font-inter">
              Product Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-base font-semibold text-brand-orange hover:gap-3 transition-all"
          >
            View All Products <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className={`group product-card relative flex flex-col greey-border rounded-2xl bg-white border border-gray-100 p-6 text-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cat.hoverBgClass} ${cat.hoverBorderClass}`}
              >
                {/* Icon */}
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl white-gradient transition-colors group-hover:bg-white ${cat.colorClass}`}>
                  <Icon className={`h-6 w-6 ${cat.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold leading-snug mb-2 text-dark">
                  {cat.name}
                </h3>
                <p className="text-sm leading-relaxed flex-1 text-gray-500">
                  {cat.description}
                </p>

                {/* Models tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.models.split('·').map((model, i) => (
                    <span 
                      key={i}
                      className="pills-cover"
                    >
                      {model.trim()}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm font-bold text-brand-orange">
                    {cat.count}
                  </span>
                  <ArrowRight className="black-arrow h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-orange" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
