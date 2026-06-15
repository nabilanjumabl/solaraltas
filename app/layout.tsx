// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://solaratlas.com'),
  title: {
    default: 'SolarAtlas — America\'s Solar Potential Database',
    template: '%s | SolarAtlas',
  },
  description: 'Free solar potential analysis for 24,847 US cities. Savings calculator, installer comparison, and NREL-powered data — no signup required.',
  keywords: ['solar potential', 'solar savings calculator', 'solar panels', 'solar energy', 'solar ROI'],
  openGraph: {
    type: 'website',
    siteName: 'SolarAtlas',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@solaratlas',
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SolarAtlas',
      url: 'https://solaratlas.com',
      description: 'Solar potential database for 24,847 US cities',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://solaratlas.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
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
