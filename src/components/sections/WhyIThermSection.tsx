import { Factory, Award, Settings, MapPin, CheckCircle } from 'lucide-react'

const reasons = [
  {
    icon: Factory,
    title: 'In-house Manufacturing',
    description: 'Every instrument designed, manufactured, and tested at our Mumbai facility — full control over quality.',
    points: ['ISO-compliant production', 'In-house tool room', 'QA at every stage'],
    colorClass: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    icon: Award,
    title: '28+ Years of Experience',
    description: 'Trusted by OEMs and industry leaders since 1996. Deep domain knowledge across 10+ industries.',
    points: ['1000+ satisfied clients', 'Pan-India presence', 'Repeat customer rate >80%'],
    colorClass: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    icon: Settings,
    title: 'Custom OEM Solutions',
    description: 'From concept to production — we engineer instruments to your exact panel size, range, and communication protocol.',
    points: ['Turnkey project delivery', 'Prototype in 2 weeks', 'RS485 / Modbus ready'],
    colorClass: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    icon: MapPin,
    title: 'Pan-India Support',
    description: 'Dealer and service network across India for fast delivery and on-site technical assistance.',
    points: ['30+ dealer locations', 'Same-day dispatch', 'Technical helpdesk'],
    colorClass: 'bg-teal-50',
    iconColor: 'text-teal-500',
  },
]

export function WhyIThermSection() {
  return (
    <section className="relative bg-white py-20 md:py-28">
      {/* Subtle dotted grid background container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.3]" 
          style={{ 
            backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
      </div>
      
      {/* Faint gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Heading */}
          <div className="lg:sticky lg:top-28">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange">
              Why Choose Us
            </p>
            <h2 className="text-3xl font-bold text-dark md:text-4xl font-inter leading-tight">
              Why 1000+ Industries Trust I-Therm
            </h2>
            <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-md">
              We combine engineering depth, manufacturing capability, and domain expertise to deliver instruments that perform in the harshest industrial environments.
            </p>

            {/* Quick Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { value: '28+', label: 'Years in Business' },
                { value: '500+', label: 'Product Models' },
                { value: '1000+', label: 'Happy Clients' },
                { value: '10+', label: 'Industries Served' },
              ].map((s) => (
                <div key={s.label} className="group rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:shadow-lg hover:border-brand-orange/20">
                  <div className="text-3xl font-bold text-brand-orange">{s.value}</div>
                  <div className="text-sm font-medium text-dark/70 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Reason Cards */}
          <div className="space-y-5">
            {reasons.map((r) => {
              const Icon = r.icon
              return (
                <div 
                  key={r.title} 
                  className="group flex gap-5 rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-[linear-gradient(90deg,#237bb812_0%,#FFFFFF_100%)] hover:border-[#237bb94d]"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:bg-white ${r.colorClass}`}>
                    <Icon className={`h-6 w-6 ${r.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark">{r.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{r.description}</p>
                    <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {r.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 shrink-0 text-brand-orange" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
