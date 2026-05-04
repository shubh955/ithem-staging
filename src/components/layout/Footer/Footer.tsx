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
    <footer className="bg-white text-gray-800 border-t border-gray-100">
      {/* CTA Banner */}
      <div className="bg-brand-orange">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 sm:flex-row lg:px-8">
          <div>
            <h3 className="text-xl font-bold text-white">Need a custom temperature control solution?</h3>
            <p className="text-sm text-white/80 mt-1">Talk to our engineers. We build to your specifications.</p>
          </div>
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-brand-orange hover:bg-gray-100 transition-colors shrink-0"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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
            <p className="mt-3 text-xs text-gray-400 leading-relaxed max-w-xs">
              Innovative Instruments &amp; Controls LLP
            </p>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs">
              Foremost manufacturer of process control &amp; measuring instruments — temperature controllers, timers, counters, data loggers, and humidity controllers. Since 1996.
            </p>
            <div className="mt-6 space-y-2.5">
              <a href={`tel:${SITE_CONFIG.phone1}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors">
                <Phone className="h-4 w-4 text-brand-orange" />
                {SITE_CONFIG.phone1}
              </a>
              <a href={`tel:${SITE_CONFIG.phone2}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors">
                <Phone className="h-4 w-4 text-brand-orange" />
                {SITE_CONFIG.phone2}
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors">
                <Mail className="h-4 w-4 text-brand-orange" />
                {SITE_CONFIG.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mt-0.5 text-brand-orange shrink-0" />
                <span className="text-xs leading-relaxed">
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
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-orange">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-brand-orange transition-colors"
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
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {SITE_CONFIG.fullName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="/about" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/about" className="hover:text-gray-600">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
