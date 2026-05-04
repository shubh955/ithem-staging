import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/utils/constants'

export function CTASection() {
  const waUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hi, I need help selecting a temperature controller for my application.')}`

  return (
    <section className="relative overflow-hidden bg-dark py-20">
      {/* Orange gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-transparent to-transparent" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange">
          Get Started
        </p>
        <h2 className="text-3xl font-bold text-white md:text-5xl font-inter leading-tight">
          Not Sure Which Instrument
          <br />
          <span className="text-brand-orange">Fits Your Process?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/60 leading-relaxed">
          Our engineers have 28+ years of experience matching controllers to applications. Describe your requirement and we&apos;ll recommend the right solution.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-8 py-4 text-base font-bold text-white hover:bg-brand-orange-dark transition-colors shadow-lg shadow-brand-orange/20"
          >
            Talk to Our Engineers <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-8 py-4 text-base font-bold text-white hover:border-white/40 hover:bg-white/5 transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-green-400" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
