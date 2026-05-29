import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    slug: 'temperature-controller',
    name: 'Temperature Controllers',
    description: 'Precision PID & ON/OFF controllers for critical industrial processes. Trusted for accuracy since 1996.',
    image: 'https://backend.itherm.co.in/wp-content/uploads/2025/01/1-Digital-Temp-Contro.jpg',
    href: '/products?category=temperature-controller',
    count: '24+ Models'
  },
  {
    slug: 'application-specific',
    name: 'Application Specific',
    description: 'Dedicated instruments for Humidity, Autoclaves, Pharmaceutical Validation, and Ultra-Low Temperature processes.',
    image: 'https://backend.itherm.co.in/wp-content/uploads/2025/01/2-PID-Temp-Contro.jpg',
    href: '/products?category=application-specific',
    count: '12+ Models'
  },
  {
    slug: 'process-controller',
    name: 'Process Controller',
    description: 'Advanced process controllers and indicators for precise measurement and automation of industrial parameters.',
    image: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/Cx-928-1-300x300.jpg',
    href: '/products?category=process-controller',
    count: '15+ Models'
  }
]

export function ProductCategoriesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* Decorative background glow */}
      <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-brand-orange/5 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 h-[500px] w-[500px] rounded-full bg-brand-orange/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
              Our Expertise
            </p>
            <h2 className="text-4xl font-extrabold text-dark md:text-5xl font-inter leading-tight">
              Product Categories
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Precision-engineered industrial instruments designed for accuracy, durability, and reliability across various manufacturing sectors.
            </p>
          </div>
          <Link
            href="/products"
            className="btn-premium btn-outline-orange-to-black group inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold shadow-sm"
          >
            Explore Full Range <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white transition-all duration-500 hover:shadow-[0_20px_50px_rgba(245,112,44,0.12)] hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[23px] transform-gpu isolation-isolate">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.03] transform-gpu"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent" />
                
                {/* Badge */}
                <div className="absolute left-4 top-4 rounded-[30px] bg-white px-[10px] py-[4px] text-[11px] font-bold uppercase tracking-wider text-black shadow-md z-10">
                  {cat.count}
                </div>

                {/* Inner Border Glow */}
                <div className="absolute inset-3 rounded-[16px] border border-white/10 pointer-events-none group-hover:border-white/30 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-dark group-hover:text-brand-orange transition-colors duration-300 font-inter">
                    {cat.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
                  {cat.description}
                </p>
                
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-gray-50 group-hover:border-brand-orange/10 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                    View Range
                  </span>
                  <div className="h-[1px] w-0 bg-brand-orange transition-all duration-300 group-hover:w-6" />
                  <ArrowRight className="h-3.5 w-3.5 ml-auto text-gray-300 group-hover:text-brand-orange transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
