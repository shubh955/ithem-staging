import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeroSection } from '@/components/sections/PageHeroSection'
import { WhyIThermSection } from '@/components/sections/WhyIThermSection'
import { CTASection } from '@/components/sections/CTASection'
import { 
  Target, 
  Compass, 
  Award, 
  ShieldCheck, 
  Users, 
  Zap, 
  Microscope, 
  Settings,
  CheckCircle2,
  TrendingUp
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Company | I-Therm',
  description: 'Innovative Instruments & Controls LLP (I-Therm) — foremost manufacturer of process control & measuring instruments since 1996, Vasai (East), Maharashtra.',
}

const stats = [
  { value: '1996', label: 'Year Founded', icon: TrendingUp },
  { value: '28+', label: 'Years of Experience', icon: Zap },
  { value: '50+', label: 'Product Models', icon: Settings },
  { value: '8+', label: 'Product Categories', icon: Microscope },
]

const expertise = [
  {
    title: 'Advanced R&D',
    description: 'Dedicated research and development focused on next-generation sensor technology and intelligent automation.',
    icon: Microscope,
  },
  {
    title: 'Precision Manufacturing',
    description: 'Equipped with state-of-the-art facilities at Vasai to ensure the highest standards of production quality.',
    icon: Settings,
  },
  {
    title: 'Expert Engineering',
    description: 'A well-manned team of experts delivering precision instruments for real-time critical process applications.',
    icon: Users,
  },
  {
    title: 'Quality Assurance',
    description: 'Rigorous testing protocols and compliance with international standards for long-term reliability.',
    icon: ShieldCheck,
  }
]

const certifications = [
  { name: 'ISO 9001:2015', organization: 'Quality Management System', status: 'Certified' },
  { name: 'CE Marking', organization: 'European Health, Safety & Environmental Standards', status: 'Compliant' },
  { name: 'RoHS', organization: 'Restriction of Hazardous Substances', status: 'Compliant' },
  { name: 'MSME', organization: 'Ministry of Micro, Small and Medium Enterprises', status: 'Registered' },
]

export default function AboutPage() {
  return (
    <>
      <PageHeroSection
        title="About Innovative Instruments & Controls LLP"
        description="Operating as I-Therm — foremost manufacturer of process control & measuring instruments in India since 1996."
        breadcrumbs={[{ label: 'Company' }]}
        tag="Company"
      />

      {/* Our Story Section */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-semibold text-brand-orange mb-6">
                <TrendingUp className="h-4 w-4" />
                Our Heritage
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl lg:text-5xl font-inter">
                Our Story of <span className="text-brand-orange">Innovation</span>
              </h2>
              <div className="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Innovative Instruments & Controls LLP — operating under the brand <strong className="text-dark">Itherm Precision Unrivalled</strong> — is the foremost manufacturer of Process Control & Measuring Instruments in the commercial capital of India since 1996.
                </p>
                <p>
                  With over a decade of advanced R&D facilities, we serve the process control and instrumentation sector across almost all major industries — from pharmaceutical and food processing to textile dyeing, plastics, and chemical plants.
                </p>
                <p>
                  Our state-of-the-art manufacturing facility at Vasai (East), Palghar is equipped with modern production capabilities and a well-manned expert team delivering precision instruments for real-time critical process applications.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-6 py-4 border border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-dark">ISO 9001:2015</div>
                    <div className="text-xs text-gray-500">Quality Certified</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-6 py-4 border border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-brand-navy/10 flex items-center justify-center text-brand-navy">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-dark">CE Compliant</div>
                    <div className="text-xs text-gray-500">Global Standards</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 overflow-hidden rounded-3xl shadow-2xl">
                  <Image 
                    src="/factory_precision_instruments_1778053952847.png" 
                    alt="I-Therm Manufacturing Facility" 
                    width={800} 
                    height={600} 
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="col-span-4 flex flex-col gap-4">
                  <div className="flex-1 overflow-hidden rounded-3xl shadow-xl">
                    <Image 
                      src="/rd_lab_precision_1778054176204.png" 
                      alt="I-Therm R&D Lab" 
                      width={400} 
                      height={400} 
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="rounded-3xl bg-brand-orange p-6 text-white shadow-xl">
                    <Zap className="h-8 w-8 mb-4" />
                    <div className="text-2xl font-bold">28+</div>
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Years</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-10 -left-10 z-20 hidden lg:block">
                <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
                  <div className="flex items-center gap-12">
                    {stats.slice(2, 4).map((stat) => (
                      <div key={stat.label}>
                        <div className="text-3xl font-bold text-brand-orange">{stat.value}</div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 z-20 hidden lg:block">
                <div className="rounded-2xl bg-brand-navy px-6 py-4 shadow-2xl flex items-center gap-4 text-white border border-white/10">
                  <TrendingUp className="h-5 w-5 text-brand-orange" />
                  <span className="text-sm font-bold tracking-wide">Since 1996</span>
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 lg:hidden">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-gray-50 p-6 border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-brand-orange">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="group relative overflow-hidden rounded-3xl bg-white p-5 md:p-10 shadow-sm transition-all hover:shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                <Target className="h-32 w-32 text-brand-navy" />
              </div>
              <div className="relative flex flex-col h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy text-white shadow-lg">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="mt-8 text-2xl font-bold text-dark">Our Vision</h3>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  To be a global leader in precision instrumentation, empowering industries with innovative and reliable process control solutions that set new standards in efficiency and accuracy.
                </p>
                <div className="mt-auto pt-8 flex items-center gap-2 text-brand-navy font-semibold">
                  <span>Global Excellence</span>
                  <div className="h-1 w-12 bg-brand-navy/20 rounded-full" />
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-brand-navy p-5 md:p-10 shadow-lg transition-all hover:shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                <Compass className="h-32 w-32 text-white" />
              </div>
              <div className="relative flex flex-col h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-lg">
                  <Compass className="h-7 w-7" />
                </div>
                <h3 className="mt-8 text-2xl font-bold text-white">Our Mission</h3>
                <p className="mt-4 text-lg text-white/80 leading-relaxed">
                  To deliver high-quality, cost-effective, and advanced measuring instruments through continuous R&D and customer-centric engineering, ensuring seamless integration for our global partners.
                </p>
                <div className="mt-auto pt-8 flex items-center gap-2 text-brand-orange font-semibold">
                  <span>Customer Centric</span>
                  <div className="h-1 w-12 bg-brand-orange/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Expertise Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-dark sm:text-4xl font-inter">Core Team Expertise</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our multidisciplinary team combines decades of industry experience with modern engineering practices.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item) => (
              <div key={item.title} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-2xl">
                {/* Sliding Background */}
                <div className="absolute top-0 left-0 w-full h-[5px] bg-[#1e3b69] transition-all duration-500 ease-in-out group-hover:h-full" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#1e3b69]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-dark transition-colors duration-300 group-hover:text-white">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-white/90">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-dark py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-orange/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-navy/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:flex lg:items-center lg:justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl font-inter">Commitment to Quality</h2>
              <p className="mt-4 text-lg text-white/60">
                We adhere to the most stringent international standards to ensure our products perform reliably in critical environments.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 border border-white/10 text-brand-orange">
                <Award className="h-5 w-5" />
                <span className="font-semibold">Industry Recognized</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <div key={cert.name} className="relative group overflow-hidden rounded-2xl bg-white/5 p-8 border border-white/10 transition-all hover:bg-white/10 hover:border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-10 w-10 rounded-lg bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-2 py-1 rounded">
                    {cert.status}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white">{cert.name}</h4>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {cert.organization}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyIThermSection />
      <CTASection />
    </>
  )
}
