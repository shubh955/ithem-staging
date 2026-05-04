import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/utils/constants'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Innovative Instruments & Controls LLP (I-Therm) — +91 85919 39916 — Vasai (East), Palghar, Maharashtra.',
}

export default function ContactPage() {
  const waUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hi, I have an inquiry about I-Therm instruments.')}`

  return (
    <>
      <PageHeroSection
        title="Contact Us"
        description="Reach out for product inquiries, custom solutions, dealer inquiries, or technical support."
        breadcrumbs={[{ label: 'Contact' }]}
        tag="Get in Touch"
      />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-dark font-inter">Get In Touch</h2>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: 'Phone 1', value: SITE_CONFIG.phone1, href: `tel:${SITE_CONFIG.phone1}` },
                  { icon: Phone, label: 'Phone 2', value: SITE_CONFIG.phone2, href: `tel:${SITE_CONFIG.phone2}` },
                  { icon: Phone, label: 'Phone 3', value: SITE_CONFIG.phone3, href: `tel:${SITE_CONFIG.phone3}` },
                  { icon: Mail, label: 'Email', value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                  { icon: MapPin, label: 'Address', value: `${SITE_CONFIG.addressLine1} ${SITE_CONFIG.addressLine2} ${SITE_CONFIG.addressLine3}`, href: undefined },
                ].map((c) => {
                  const Icon = c.icon
                  const inner = (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange shrink-0">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{c.label}</div>
                        <div className="text-sm text-dark mt-0.5">{c.value}</div>
                      </div>
                    </div>
                  )
                  return c.href ? (
                    <a key={c.label} href={c.href} className="block hover:opacity-80 transition-opacity">{inner}</a>
                  ) : (
                    <div key={c.label}>{inner}</div>
                  )
                })}
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white hover:bg-green-600 transition-colors w-fit"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 lg:col-span-2">
              <h2 className="mb-6 text-xl font-bold text-dark font-inter">Send an Inquiry</h2>
              <form className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input type="text" name="name" required className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange" placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                    <input type="text" name="company" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange" placeholder="Your Company" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input type="email" name="email" required className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                    <input type="tel" name="phone" required className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product of Interest</label>
                    <select name="productInterest" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange">
                      <option value="">Select a product</option>
                      <option>Temperature Controllers</option>
                      <option>Timers & Counters</option>
                      <option>ULT Controllers</option>
                      <option>Custom Instruments</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Inquiry Type</label>
                    <select name="inquiryType" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange">
                      <option value="product">Product Inquiry</option>
                      <option value="custom">Custom Solution</option>
                      <option value="dealer">Dealer / Distributor</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea name="message" rows={4} required className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange resize-none" placeholder="Describe your requirement, application, or question..." />
                </div>
                <button type="submit" className="w-full rounded-xl bg-brand-orange px-6 py-3.5 text-base font-bold text-white hover:bg-brand-orange-dark transition-colors">
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
