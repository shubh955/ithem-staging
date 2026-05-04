'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/utils/constants'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1920&q=80',
    tag: 'Pharmaceutical Industry',
    headline: 'Precision Control\nfor Critical Processes',
    sub: 'Autoclave controllers, data loggers & temperature controllers trusted by pharma manufacturers across India.',
  },
  {
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80',
    tag: 'Industrial Automation',
    headline: 'Engineered for\nHarsh Environments',
    sub: 'Robust PID temperature controllers and process indicators built for 24/7 industrial operation since 1996.',
  },
  {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80',
    tag: 'Food & Beverage Processing',
    headline: 'From Ovens to\nCold Storage',
    sub: 'Temperature and humidity controllers for retorts, dryers, pasteurizers and cold chain management.',
  },
  {
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920&q=80',
    tag: 'Laboratory & Research',
    headline: 'Accuracy You\nCan Measure',
    sub: 'Multi-channel data loggers and ULT controllers for GMP-compliant validation and audit-ready records.',
  },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 700)
  }, [animating])

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo])


  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">

      {/* ── Background slides ── */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}
        >
          <Image
            src={slide.image}
            alt={slide.tag}
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Dark overlay — navy-tinted for brand consistency */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(120deg, rgba(10,10,10,0.90) 0%, rgba(18,40,80,0.80) 50%, rgba(10,10,10,0.65) 100%)' }} />
        </div>
      ))}

      {/* Orange left accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-brand-orange z-10" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">

          {/* Slide tag pill */}
          <div key={`tag-${current}`} className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-1.5 animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
              {slides[current].tag}
            </span>
          </div>

          {/* Logo */}
          {/* <div className="mb-4">
            <Image
              src="/logo.png"
              alt="I-Therm Precision Unrivalled"
              width={200}
              height={65}
              className="h-12 w-auto object-contain brightness-0 invert"
              priority
            />
          </div> */}

          {/* Headline — changes per slide */}
          <h1
            key={`h-${current}`}
            className="font-inter font-bold leading-none text-white animate-slide-up banner-heading-font"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 3rem)' }}
          >
            {slides[current].headline.split('\n').map((line, i) => (
              <span key={i}>
                {i === 0 ? <span className="text-brand-orange">{line}</span> : line}
                {i < slides[current].headline.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Subtext */}
          <p key={`p-${current}`} className="mt-5 max-w-xl text-lg text-white/70 leading-relaxed animate-fade-in">
            {slides[current].sub}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-8 py-4 text-base font-bold text-white hover:bg-brand-orange-dark transition-colors shadow-lg shadow-brand-orange/25"
            >
              Browse Products <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 px-8 py-4 text-base font-bold text-white hover:border-brand-orange/60 hover:bg-white/5 transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          {/* Trust bar */}
          {/* <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-8">
            {[
              { label: '28+', sub: 'Years Experience' },
              { label: '50+', sub: 'Product Models' },
              { label: '1000+', sub: 'Clients Served' },
              { label: 'Pan-India', sub: 'Distribution' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white font-inter">{stat.label}</div>
                <div className="text-xs text-white/40 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* ── Slider controls ── */}
      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-brand-orange hover:border-brand-orange transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-brand-orange hover:border-brand-orange transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-[15px] md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-brand-orange' : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Floating Call Button */}
      <a
        href={`tel:${SITE_CONFIG.phone1}`}
        className="absolute bottom-8 right-6 z-20 hidden items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-brand-orange-dark transition-colors lg:flex"
      >
        <Phone className="h-4 w-4" />
        {SITE_CONFIG.phone1}
      </a>
    </section>
  )
}
