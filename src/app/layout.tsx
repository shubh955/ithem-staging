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
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    siteName: SITE_CONFIG.fullName,
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: false, follow: false },
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
