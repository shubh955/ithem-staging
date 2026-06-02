import type { Metadata } from 'next'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { ContactForm } from '@/components/sections/ContactForm'
import { Phone, Mail, Globe, Building2, MessageCircle, Clock } from 'lucide-react'
import { getSiteSettings, getTelHref } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Contact Us | I-Therm',
  description: 'Get in touch with I-Therm for sales and technical support. Head Office in Vasai (East), Palghar.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const waUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hi, I have an inquiry about I-Therm.')}`
    : ''

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
                      {settings.addressLines.map((line, index) => (
                        <span key={line}>
                          {line}
                          {index < settings.addressLines.length - 1 && <br />}
                        </span>
                      ))}
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
                      <p>
                        <span className="font-medium text-dark">Sales:</span> 
                        <a href={getTelHref(settings.phone1)} className="hover:text-brand-orange">{settings.phone1}</a> /
                        <a href={getTelHref(settings.phone2)} className="hover:text-brand-orange">{settings.phone2}</a>
                        </p>
                      {/* <p><span className="font-medium text-dark">Sales 2:</span> </p> */}
                      <p><span className="font-medium text-dark">Support:</span> <a href={getTelHref(settings.supportNumber)} className="hover:text-brand-orange">{settings.supportNumber}</a></p>
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
                      <a href={`mailto:${settings.email}`} className="block text-sm text-gray-600 truncate hover:text-brand-orange">{settings.email}</a>
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
                {/* {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium btn-whatsapp-fill flex items-center justify-center gap-2 rounded-2xl p-5 font-bold shadow-sm"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp Support
                  </a>
                )} */}
              </div>
            </div>

            {/* Inquiry Form Column */}
            <div className="lg:col-span-7">
              <ContactForm />
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
