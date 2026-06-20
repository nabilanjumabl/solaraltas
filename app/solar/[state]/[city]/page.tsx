import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cityDetails from '@/public/data/city-details.json'
import { getAllCitySlugs } from '@/lib/data'
import CityPageClient from './CityPageClient'

// ─── Static generation for all 228 real cities ─────────────────────────────
// Pulls directly from lib/data.ts so this route always matches your cities.json
export async function generateStaticParams() {
  return getAllCitySlugs() // [{ state: 'texas', city: 'houston' }, ...]
}

// ─── Real per-city <title> / <meta description> for Google ────────────────
export async function generateMetadata(
  { params }: { params: { state: string; city: string } }
): Promise<Metadata> {
  const key = `${params.state}/${params.city}`
  const city = (cityDetails as Record<string, any>)[key]

  if (!city) {
    return { title: 'City Not Found | SolarAtlas' }
  }

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: {
      canonical: `https://solaraltas.vercel.app/solar/${params.state}/${params.city}`,
    },
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function CityPage(
  { params }: { params: { state: string; city: string } }
) {
  const key = `${params.state}/${params.city}`
  const city = (cityDetails as Record<string, any>)[key]

  // No silent fallback to Phoenix — unknown city/state combos 404 properly
  if (!city) {
    notFound()
  }

  return <CityPageClient city={city} />
}
