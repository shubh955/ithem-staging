import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/utils/constants'

const footerLinks = {
  Products: [
    { label: 'Temperature Controllers', href: '/products/temperature-controllers' },
    { label: 'Timers & Counters (I-Count)', href: '/products/timers-counters' },
    { label: 'Humidity Controllers', href: '/products/humidity-controllers' },
    { label: 'Data Loggers', href: '/products/data-loggers' },
    { label: 'ULT Controllers', href: '/products/ult-controllers' },
    { label: 'All Products', href: '/products' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Industries Served', href: '/industries' },
    { label: 'Application Specific', href: '/solutions' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Resources: [
    { label: 'Operating Manuals', href: '/resources/guides' },
    { label: 'Product Catalog 2024', href: '/resources/catalogs' },
    { label: 'FAQs', href: '/resources/faqs' },
    { label: 'Case Studies', href: '/resources/case-studies' },
  ],
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white text-gray-800 border-t">
      {/* Large Logo Watermark - Positioned Far Right & Vertically Centered */}
      <div className="absolute right-4 top-[64%] -translate-y-1/2 opacity-[0.04] pointer-events-none z-0 select-none hidden lg:block">
        <Image
          src="/logo.png"
          alt="Watermark"
          width={900}
          height={300}
          className="grayscale"
        />
      </div>

      {/* CTA Banner */}
      <div className="relative z-10 bg-brand-orange">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 sm:flex-row lg:px-8">
          <div>
            <h3 className="text-xl font-bold text-white">Need a custom temperature control solution?</h3>
            <p className="text-sm text-white/80 mt-1">Talk to our engineers. We build to your specifications.</p>
          </div>
          <Link
            href="/contact"
            className="btn-premium btn-outline-white-to-black flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold shrink-0"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="I-Therm Precision Unrivalled"
                width={160}
                height={52}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 text-xs text-gray-600 font-medium leading-relaxed max-w-xs">
              Innovative Instruments &amp; Controls LLP
            </p>
            <p className="mt-2 text-sm text-gray-800 leading-relaxed max-w-xs">
              Foremost manufacturer of process control &amp; measuring instruments — temperature controllers, timers, counters, data loggers, and humidity controllers. Since 1996.
            </p>
            <div className="mt-6 space-y-2.5">
              <a href={`tel:${SITE_CONFIG.phone1}`} className="flex items-center gap-2 text-sm text-gray-800 font-medium hover:text-brand-orange transition-colors">
                <Phone className="h-4 w-4 text-brand-orange" />
                {SITE_CONFIG.phone1}
              </a>
              <a href={`tel:${SITE_CONFIG.phone2}`} className="flex items-center gap-2 text-sm text-gray-800 font-medium hover:text-brand-orange transition-colors">
                <Phone className="h-4 w-4 text-brand-orange" />
                {SITE_CONFIG.phone1}
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 text-sm text-gray-800 font-medium hover:text-brand-orange transition-colors">
                <Mail className="h-4 w-4 text-brand-orange" />
                {SITE_CONFIG.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-800">
                <MapPin className="h-4 w-4 mt-0.5 text-brand-orange shrink-0" />
                <span className="text-xs font-medium leading-relaxed">
                  {SITE_CONFIG.addressLine1}<br />
                  {SITE_CONFIG.addressLine2}<br />
                  {SITE_CONFIG.addressLine3}
                </span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-orange">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-700 font-medium hover:text-brand-orange transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-gray-100 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500 font-medium">
            © {new Date().getFullYear()} {SITE_CONFIG.fullName}. All rights reserved.
          </p>

          {/* Developer Credit - Pill UI */}
          <div className="group relative p-[1px] rounded-full bg-gradient-to-r from-brand-orange via-brand-orange/40 to-brand-orange/10 hover:from-brand-orange hover:to-brand-orange transition-all duration-500 shadow-sm">
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-2">
              <span className="text-[12px] font-normal text-gray-800 tracking-tight">
                Designed & Developed by
              </span>
              <div className="h-3 w-px bg-gray-200" />
              <Link 
                href="https://weqtechnologies.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 mb-[-10px]"
              >
                <Image
                  src="/assets/weq-white-logo.svg"
                  alt="WEQ Technologies"
                  width={80}
                  height={22}
                  className="h-5 w-auto"
                />
              </Link>
            </div>
          </div>

          <div className="flex gap-6 text-xs text-gray-500 font-medium">
            <Link href="/about" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-brand-orange transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
