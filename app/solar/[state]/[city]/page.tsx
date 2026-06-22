import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cityDetails from '@/public/data/city-details.json'
import { getAllCitySlugs } from '@/lib/data'
import CityPageClient from './CityPageClient'

const SITE_URL = 'https://solaraltas.vercel.app'

// ─── Static generation for all 228 real cities ─────────────────────────────
export async function generateStaticParams() {
  return getAllCitySlugs()
}

type CityPageParams = Promise<{ state: string; city: string }>

export async function generateMetadata(
  { params }: { params: CityPageParams }
): Promise<Metadata> {
  const { state, city: citySlug } = await params
  const key = `${state}/${citySlug}`
  const city = (cityDetails as Record<string, any>)[key]

  if (!city) {
    return { title: 'City Not Found | SolarAtlas' }
  }

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/solar/${state}/${citySlug}`,
    },
  }
}

// Same FAQ logic the client component renders — computed once here so it can
// also power the FAQPage schema, instead of being duplicated in two places.
function buildFaqItems(city: any) {
  return [
    {
      q: `Is solar worth it in ${city.name}?`,
      a: `Yes — ${city.name} scores ${city.solarScore}/100 with ${city.peakSunHours} peak sun hours/day. At $0.${Math.round(city.avgElectricRate * 100)} per kWh and $${city.annualSavings}/year average savings, most homeowners break even in ${city.paybackYears} years.`,
    },
    {
      q: `How much does a solar system cost in ${city.name}?`,
      a: `A 4 kW system in ${city.name} costs ~$12,000 gross. After the 30% federal tax credit ($3,600) and $${city.stateIncentives.toLocaleString()} in ${city.state} incentives, your net cost is ~$${city.netCost.toLocaleString()}.`,
    },
    {
      q: `What's the payback period in ${city.name}?`,
      a: `Based on current electricity rates ($0.${Math.round(city.avgElectricRate * 100)}/kWh) and ${city.peakSunHours} sun hours, a standard 4 kW system pays back in ${city.paybackYears} years.`,
    },
    {
      q: `Who are the top solar installers in ${city.name}?`,
      a: `${city.topInstallers.join(', ')} all operate in ${city.name}. We recommend getting 3+ quotes — local installers often beat national brands on price by 10–20%.`,
    },
    {
      q: `Does ${city.name} have good net metering?`,
      a: `${city.state} has a rated net metering policy. Excess energy you export earns retail-rate credits on your bill, directly reducing your payback period.`,
    },
    {
      q: `What system size do most ${city.name} homeowners install?`,
      a: `Most ${city.name} homeowners with average usage install 5–7 kW. At ${city.peakSunHours} sun hours, a 6 kW system produces ~${Math.round(city.peakSunHours * 6 * 365).toLocaleString()} kWh/year.`,
    },
  ]
}

export default async function CityPage(
  { params }: { params: CityPageParams }
) {
  const { state, city: citySlug } = await params
  const key = `${state}/${citySlug}`
  const city = (cityDetails as Record<string, any>)[key]

  if (!city) {
    notFound()
  }

  const faqItems = buildFaqItems(city)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SolarAtlas', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: city.state, item: `${SITE_URL}/solar/${state}` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `${SITE_URL}/solar/${state}/${citySlug}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CityPageClient city={city} faqItems={faqItems} />
    </>
  )
}
