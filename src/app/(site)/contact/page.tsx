import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { Phone, Mail, MapPin, Globe, Building2, MessageCircle, Clock, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/utils/constants'

export const metadata: Metadata = {
  title: 'Contact Us | I-Therm',
  description: 'Get in touch with I-Therm for sales and technical support. Head Office in Vasai (East), Palghar.',
}

export default function ContactPage() {
  const waUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hi, I have an inquiry about I-Therm.')}`

  return (
    <div className="bg-white">
      <PageHeroSection
        title="Contact Us"
        description="Connect with our experts for guidance on process control instruments and custom automation solutions."
        breadcrumbs={[{ label: 'Contact' }]}
        tag="Get in Touch"
      />

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 items-start">

            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-dark font-inter">Contact Information</h2>
                <p className="mt-2 text-gray-600 text-sm">Reach out to our head office for sales, support, or general inquiries.</p>
              </div>

              <div className="space-y-4">
                {/* Office Card */}
                <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-base mb-[10px]">Head Office</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-semibold text-dark">Innovative Instruments & Controls LLP</span><br />
                      {SITE_CONFIG.addressLine1}<br />
                      {SITE_CONFIG.addressLine2}<br />
                      {SITE_CONFIG.addressLine3}
                    </p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-brand-orange">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-dark text-base mb-[10px]">Phone & Inquiries</h3>
                    <div className="text-sm text-gray-600 space-y-1.5">
                      <p><span className="font-medium text-dark">Sales:</span> {SITE_CONFIG.phone1} / 17 / {SITE_CONFIG.phone3}</p>
                      <p><span className="font-medium text-dark">Support:</span> {SITE_CONFIG.supportPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Email & Web Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/30">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark text-base mb-[10px]">Email</h3>
                      <p className="text-sm text-gray-600 truncate">{SITE_CONFIG.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/30">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark text-base mb-[10px]">Website</h3>
                      <p className="text-sm text-gray-600">www.itherm.co.in</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extras: Hours & WhatsApp */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="p-5 rounded-2xl bg-dark text-white text-xs">
                  <div className="flex items-center gap-2 mb-3 text-brand-orange">
                    <Clock className="h-4 w-4" />
                    <span className="font-bold uppercase tracking-wider">Business Hours</span>
                  </div>
                  <div className="space-y-2 opacity-80">
                    <div className="flex justify-between">
                      <span>Monday - Saturday</span>
                      <span className="font-semibold">09:30 AM - 06:30 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-brand-orange font-bold uppercase">Closed</span>
                    </div>
                  </div>
                </div>
                {/* <a 
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium btn-whatsapp-fill flex items-center justify-center gap-2 rounded-2xl p-5 font-bold shadow-sm"
                >
                  <svg 
                    className="h-5 w-5 fill-current" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp Support
                </a> */}
              </div>
            </div>

            {/* Inquiry Form Column */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white p-6 md:p-10 shadow-xl border border-gray-50">
                <h2 className="text-xl font-bold text-dark mb-1">Send an Inquiry</h2>
                <p className="text-sm text-gray-500 mb-8">Fill out the form and we&apos;ll get back to you within 24 hours.</p>

                <form className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-dark uppercase ml-1">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all" placeholder="John Doe" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-dark uppercase ml-1">Phone Number <span className="text-red-500">*</span></label>
                      <input type="tel" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all" placeholder="+91 00000 00000" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark uppercase ml-1">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all" placeholder="john@company.com" />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-dark uppercase ml-1">Inquiry Type</label>
                      <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all bg-white cursor-pointer">
                        <option>Product Inquiry</option>
                        <option>Technical Support</option>
                        <option>Custom Automation</option>
                        <option>Dealer Opportunity</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-dark uppercase ml-1">Company</label>
                      <input type="text" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all" placeholder="Your Company Name" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark uppercase ml-1">Message <span className="text-red-500">*</span></label>
                    <textarea required rows={4} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all resize-none" placeholder="How can we help you?"></textarea>
                  </div>

                  <button className="btn-premium btn-orange-to-black group w-full rounded-xl py-4 text-sm font-bold shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2">
                    Send Inquiry
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[450px] relative md:grayscale hover:md:grayscale-0 transition-all duration-700 overflow-hidden">
        <iframe
          src="https://maps.google.com/maps?q=Innovative%20Instruments%20%26%20Controls%20LLP%20Vasai%20East&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="I-Therm Head Office Location"
        />
      </section>
    </div>
  )
}
