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
                <a 
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] p-5 text-white font-bold hover:bg-[#128C7E] transition-colors shadow-sm"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Support
                </a>
              </div>
            </div>

            {/* Inquiry Form Column */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white p-6 md:p-10 shadow-xl border border-gray-50">
                <h2 className="text-xl font-bold text-dark mb-1">Send an Inquiry</h2>
                <p className="text-sm text-gray-500 mb-8">Fill out the form and we'll get back to you within 24 hours.</p>
                
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

                  <button className="group w-full rounded-xl bg-brand-orange py-4 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-orange-dark transition-all flex items-center justify-center gap-2">
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
