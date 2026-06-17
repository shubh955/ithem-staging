import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SITE_CONFIG } from '@/lib/utils/constants'
import { getSiteSettings } from '@/lib/settings'
import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  referrer: 'strict-origin-when-cross-origin',
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'temperature controller', 'PID controller', 'industrial instruments',
    'process control', 'humidity controller', 'data logger', 'autoclave controller',
    'I-Therm', 'Innovative Instruments', 'timers counters', 'temperature measurement',
  ],
  authors: [{ name: SITE_CONFIG.fullName, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.fullName,
  publisher: SITE_CONFIG.fullName,
  openGraph: {
    siteName: SITE_CONFIG.fullName,
    locale: 'en_IN',
    type: 'website',
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  icons: {
    icon: '/favicon-logo.png',
    shortcut: '/favicon-logo.png',
    apple: '/favicon-logo.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings()

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-inter antialiased">
        <Header settings={siteSettings} />
        <main>{children}</main>
        <Footer settings={siteSettings} />
      </body>
    </html>
  )
}
