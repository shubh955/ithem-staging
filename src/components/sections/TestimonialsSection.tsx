import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Rajesh Sharma',
    designation: 'Plant Manager',
    company: 'Hindustan Pharmaceuticals Ltd.',
    industry: 'Pharmaceutical',
    content: 'I-Therm controllers have been running in our autoclave lines for 7 years without failure. Their after-sales support is exceptional — same-day response every time.',
    rating: 5,
  },
  {
    name: 'Priya Mehta',
    designation: 'Production Head',
    company: 'Surya Food Industries',
    industry: 'Food Processing',
    content: 'We replaced 3 different brands with I-Therm controllers across our retort lines. The consistency and accuracy at the price point is unbeatable.',
    rating: 5,
  },
  {
    name: 'Anil Desai',
    designation: 'Technical Director',
    company: 'Polymer Tech India',
    industry: 'Plastics',
    content: 'Our injection moulding machines run on I-Therm PID controllers. Custom OEM build was delivered in 3 weeks with full Modbus support. Highly recommended.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-orange">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold text-dark md:text-4xl font-inter">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="relative flex flex-col rounded-2xl bg-white p-7 shadow-sm border border-gray-100">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-orange/10" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className="h-4 w-4 fill-brand-orange text-brand-orange" />
                ))}
              </div>

              <p className="flex-1 text-sm text-gray-600 leading-relaxed italic">&ldquo;{t.content}&rdquo;</p>

              <div className="mt-6 flex items-center gap-3 border-t border-gray-50 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-dark">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.designation}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
