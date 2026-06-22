import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import stateDetails from '@/public/data/state-details.json'
import { getAllStateSlugs } from '@/lib/data'
import StatePageClient from './StatePageClient'

const SITE_URL = 'https://solaraltas.vercel.app'

export async function generateStaticParams() {
  return getAllStateSlugs()
}

type StatePageParams = Promise<{ state: string }>

export async function generateMetadata(
  { params }: { params: StatePageParams }
): Promise<Metadata> {
  const { state: stateSlug } = await params
  const state = (stateDetails as Record<string, any>)[stateSlug]

  if (!state) {
    return { title: 'State Not Found | SolarAtlas' }
  }

  return {
    title: state.metaTitle,
    description: state.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/solar/${stateSlug}`,
    },
  }
}

function buildFaqItems(state: any, monthlyData: any[]) {
  return [
    {
      q: `Is solar worth it in ${state.name}?`,
      a: `Absolutely. ${state.name} ranks with a ${state.avgSolarScore}/100 score and ${state.avgSunHours} peak sun hours daily. Average homeowners save $${state.avgAnnualSavings}/year, with a payback period of ${state.avgPaybackYears} years.`,
    },
    {
      q: `What incentives are available in ${state.name}?`,
      a: `${state.name} residents qualify for the federal 30% tax credit ($3,600 on a $12,000 system) plus a $${state.stateIncentives.propertyTaxExemption.toLocaleString()} property tax exemption and $${state.stateIncentives.energyTaxCredit.toLocaleString()} state energy credit. Net metering is rated "${state.stateIncentives.netMetering}".`,
    },
    {
      q: `How many installers operate in ${state.name}?`,
      a: `There are roughly ${state.installerCount} licensed solar installers active across ${state.name}.`,
    },
    {
      q: `What's the best time of year for solar in ${state.name}?`,
      a: `Peak production occurs in summer months when sun hours reach ${Math.max(...monthlyData.map((m: any) => m.sunHours))} hours/day. Even in the slowest month, output is still viable at ${Math.min(...monthlyData.map((m: any) => m.sunHours))} hours/day.`,
    },
    {
      q: `Does ${state.name} allow net metering?`,
      a: `Yes. Net metering in ${state.name} is rated "${state.stateIncentives.netMetering}".`,
    },
    {
      q: `What system size do most ${state.name} homeowners install?`,
      a: `Most ${state.name} homeowners install 4–8 kW systems. Given ${state.avgSunHours} peak sun hours, a 6 kW system produces about ${Math.round(state.avgSunHours * 6 * 365)} kWh/year.`,
    },
  ]
}

export default async function StatePage(
  { params }: { params: StatePageParams }
) {
  const { state: stateSlug } = await params
  const state = (stateDetails as Record<string, any>)[stateSlug]

  if (!state) {
    notFound()
  }

  const faqItems = buildFaqItems(state, state.monthlyData)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SolarAtlas', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: state.name, item: `${SITE_URL}/solar/${stateSlug}` },
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
      <StatePageClient state={state} faqItems={faqItems} />
    </>
  )
}
