// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { allCities } from '@/lib/data'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const SITE_URL = 'https://solaraltas.vercel.app'
const CITY_COUNT = allCities.length

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SolarAtlas — America\'s Solar Potential Database',
    template: '%s | SolarAtlas',
  },
  description: `Free solar potential analysis for ${CITY_COUNT} US cities across all 50 states. Savings calculator, installer comparison, and NREL-powered data — no signup required.`,
  keywords: ['solar potential', 'solar savings calculator', 'solar panels', 'solar energy', 'solar ROI'],
  openGraph: {
    type: 'website',
    siteName: 'SolarAtlas',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SolarAtlas',
      url: SITE_URL,
      description: `Solar potential database for ${CITY_COUNT} US cities`,
    }),
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-900 text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
