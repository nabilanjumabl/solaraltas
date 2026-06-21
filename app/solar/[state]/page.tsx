import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import stateDetails from '@/public/data/state-details.json'
import { getAllStateSlugs } from '@/lib/data'
import StatePageClient from './StatePageClient'

// ─── Static generation for all 50 real states ──────────────────────────────
export async function generateStaticParams() {
  return getAllStateSlugs() // [{ state: 'arizona' }, { state: 'texas' }, ...]
}

type StatePageParams = Promise<{ state: string }>

// ─── Real per-state <title> / <meta description> for Google ───────────────
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
      canonical: `https://solaraltas.vercel.app/solar/${stateSlug}`,
    },
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function StatePage(
  { params }: { params: StatePageParams }
) {
  const { state: stateSlug } = await params
  const state = (stateDetails as Record<string, any>)[stateSlug]

  // No silent fallback to Arizona — unknown state slugs 404 properly
  if (!state) {
    notFound()
  }

  return <StatePageClient state={state} />
}
