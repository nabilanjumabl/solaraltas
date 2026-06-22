import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import compareDetails from '@/public/data/compare-details.json'
import { getAllCompareSlugs } from '@/lib/data'
import ComparePageClient from './ComparePageClient'

const SITE_URL = 'https://solaraltas.vercel.app'

// ─── Static generation for all 190 real comparisons ────────────────────────
export async function generateStaticParams() {
  return getAllCompareSlugs()
}

type ComparePageParams = Promise<{ slug: string }>

export async function generateMetadata(
  { params }: { params: ComparePageParams }
): Promise<Metadata> {
  const { slug } = await params
  const pair = (compareDetails as Record<string, any>)[slug]

  if (!pair) {
    return { title: 'Comparison Not Found | SolarAtlas' }
  }

  const { cityA, cityB } = pair
  return {
    title: `${cityA.name} vs ${cityB.name} Solar Comparison | SolarAtlas`,
    description: `${cityA.name} (${cityA.solarScore}/100) vs ${cityB.name} (${cityB.solarScore}/100). Full savings, payback & incentives comparison.`,
    alternates: {
      canonical: `${SITE_URL}/compare/${slug}`,
    },
  }
}

function computeWinner(a: any, b: any) {
  let aScore = 0, bScore = 0
  if (a.solarScore > b.solarScore) aScore += 2; else bScore += 2
  if (a.annualSavings > b.annualSavings) aScore += 2; else bScore += 2
  if (a.paybackYears < b.paybackYears) aScore += 2; else bScore += 2
  if (a.peakSunHours > b.peakSunHours) aScore += 1; else bScore += 1
  if (a.cloudyDaysPerYear < b.cloudyDaysPerYear) aScore += 1; else bScore += 1
  return aScore >= bScore ? a : b
}

function buildFaqItems(cityA: any, cityB: any) {
  const winner = computeWinner(cityA, cityB)
  const loser = winner.name === cityA.name ? cityB : cityA
  return [
    {
      q: `Which city is better for solar — ${cityA.name} or ${cityB.name}?`,
      a: `${winner.name} wins on overall solar suitability with a ${winner.solarScore}/100 score vs ${loser.solarScore}/100. ${winner.name} also offers $${winner.annualSavings.toLocaleString()}/year vs $${loser.annualSavings.toLocaleString()}/year in ${loser.name}, with a faster ${winner.paybackYears}-year payback.`,
    },
    {
      q: `How much more can I save in ${winner.name} vs ${loser.name}?`,
      a: `Over 25 years, ${winner.name} saves $${winner.savings25Year.toLocaleString()} vs ${loser.name}'s $${loser.savings25Year.toLocaleString()} — a difference of $${(winner.savings25Year - loser.savings25Year).toLocaleString()}.`,
    },
    {
      q: `Is ${loser.name} still a good city for solar?`,
      a: `Yes — ${loser.name} scores ${loser.solarScore}/100, which is still ${loser.solarScore >= 80 ? 'above average nationally' : 'decent'}. It saves $${loser.annualSavings.toLocaleString()}/year and remains a valid choice, especially for homeowners who plan to stay 20+ years.`,
    },
    {
      q: `What if I'm moving between these cities?`,
      a: `Solar panels don't move with you. ${winner.paybackYears}-year payback in ${winner.name} means you need that long of ownership to fully profit. Home resale value typically offsets a shorter stay either way.`,
    },
  ]
}

export default async function ComparePage(
  { params }: { params: ComparePageParams }
) {
  const { slug } = await params
  const pair = (compareDetails as Record<string, any>)[slug]

  // No silent fallback to Phoenix vs Austin — unknown pairs 404 properly
  if (!pair) {
    notFound()
  }

  const { cityA, cityB } = pair
  const faqItems = buildFaqItems(cityA, cityB)

  // Real related comparisons — any other pair sharing one of these two cities
  const relatedComparisons = Object.entries(compareDetails as Record<string, any>)
    .filter(([key, p]) =>
      key !== slug &&
      (p.cityA.slug === cityA.slug || p.cityB.slug === cityA.slug || p.cityA.slug === cityB.slug || p.cityB.slug === cityB.slug)
    )
    .slice(0, 4)
    .map(([key, p]) => ({ slug: key, nameA: p.cityA.name, nameB: p.cityB.name }))


  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SolarAtlas', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE_URL}/compare` },
      { '@type': 'ListItem', position: 3, name: `${cityA.name} vs ${cityB.name}`, item: `${SITE_URL}/compare/${slug}` },
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
      <ComparePageClient cityA={cityA} cityB={cityB} faqItems={faqItems} relatedComparisons={relatedComparisons} />
    </>
  )
}
