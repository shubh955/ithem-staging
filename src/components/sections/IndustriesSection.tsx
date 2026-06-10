'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const industries = [
  {
    name: 'Pharmaceutical',
    slug: 'pharmaceutical',
    description: 'Autoclave controllers, incubator temperature control, stability chamber logging, and cold storage monitoring.',
    image: '/assets/images/industries/industries-serve-1.webp',
  },
  {
    name: 'Food Processing',
    slug: 'food-processing',
    description: 'Retort temperature control, oven & dryer management, pasteurization systems, and cold storage.',
    image: '/assets/images/industries/industries-serve-2.webp',
  },
  {
    name: 'Textile Dyeing',
    slug: 'textile',
    description: 'Dye bath temperature regulation, machine run-time counting, and batch process timing.',
    image: '/assets/images/industries/industries-serve-1.webp',
  },
  {
    name: 'Plastics & Rubber',
    slug: 'plastics',
    description: 'Injection moulding barrel control, extrusion line temperature, and blow moulding cycle timing.',
    image: '/assets/images/industries/industries-serve-3.webp',
  },
  {
    name: 'Chemical Plants',
    slug: 'chemical',
    description: 'Reactor temperature control, distillation column monitoring, and batch process management.',
    image: '/assets/images/industries/industries-serve-2.webp',
  },
  {
    name: 'Furnaces & Ovens',
    slug: 'furnaces-ovens',
    description: 'High-temperature PID control for heat treatment, annealing, and industrial heating applications.',
    image: '/assets/images/industries/industries-serve-1.webp',
  },
  {
    name: 'Medical & Laboratory',
    slug: 'medical-lab',
    description: 'Environmental chambers, autoclave validation, incubator control, and test equipment.',
    image: '/assets/images/industries/industries-serve-3.webp',
  },
  {
    name: 'General Automation',
    slug: 'automation',
    description: 'Process control integration with PLCs, SCADA systems, and Modbus RS485 communication.',
    image: '/assets/images/industries/industries-serve-2.webp',
  },
]

export function IndustriesSection() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const next = useCallback(() => goTo((current + 1) % industries.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + industries.length) % industries.length), [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-orange">
              Industries
            </p>
            <h2 className="text-4xl font-bold text-dark md:text-5xl font-inter">
              Industries We Serve
            </h2>
          </div>
          {/* <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-base font-semibold text-brand-orange hover:gap-3 transition-all"
          >
            All Industries <ArrowRight className="h-5 w-5" />
          </Link> */}
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden rounded-2xl h-[480px]">
          {industries.map((ind, i) => (
            <div
              key={ind.slug}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            >
              <Image
                src={ind.image}
                alt={ind.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority={i === 0}
              />
              {/* Gradient overlay — strong at bottom for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

              {/* Text */}
              <div className="slider-inner-space absolute bottom-0 left-0 right-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-orange">
                  Industry
                </p>
                <h3 className="text-3xl font-bold text-white md:text-4xl font-inter mb-3">
                  {ind.name}
                </h3>
                <p className="max-w-xl text-base text-white/70 leading-relaxed mb-6">
                  {ind.description}
                </p>
                {/* <Link
                  href={`/industries/${ind.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link> */}
              </div>
            </div>
          ))}

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="prev-btn absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 border border-white/20 text-white hover:bg-brand-orange hover:border-brand-orange transition-all"
            aria-label="Previous industry"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="next-btn absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 border border-white/20 text-white hover:bg-brand-orange hover:border-brand-orange transition-all"
            aria-label="Next industry"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Industry name tabs / dots */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {industries.map((ind, i) => (
            <button
              key={ind.slug}
              onClick={() => goTo(i)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                i === current
                  ? 'bg-brand-orange text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-orange/40 hover:text-brand-orange'
              }`}
            >
              {ind.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
