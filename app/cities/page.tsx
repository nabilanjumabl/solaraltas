import type { Metadata } from 'next'
import Link from 'next/link'
import { allCities, allStates } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Solar Potential by City | 228 US Cities Analyzed | SolarAtlas',
  description: 'Browse solar potential data for 228 US cities across all 50 states — savings, payback period, sun hours, and more.',
}

export default function CitiesIndexPage() {
  const stateOrder = [...allStates].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">SolarAtlas</Link>
          <span className="mx-2">/</span>
          <span className="text-white">All Cities</span>
        </div>

        <h1 className="text-4xl font-black mb-3">Solar Potential by City</h1>
        <p className="text-slate-400 mb-12">{allCities.length} cities analyzed across all 50 states.</p>

        <div className="space-y-10">
          {stateOrder.map(state => {
            const cities = allCities
              .filter(c => c.stateSlug === state.slug)
              .sort((a, b) => b.solarScore - a.solarScore)

            if (cities.length === 0) return null

            return (
              <div key={state.slug}>
                <Link
                  href={`/solar/${state.slug}`}
                  className="text-lg font-bold mb-3 inline-flex items-center gap-2 hover:text-emerald-400 transition"
                >
                  {state.name}
                  <span className="text-xs text-slate-500 font-normal">({cities.length})</span>
                </Link>
                <div className="flex flex-wrap gap-2 mt-3">
                  {cities.map(c => (
                    <Link
                      key={c.slug}
                      href={`/solar/${c.stateSlug}/${c.slug}`}
                      className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-600 rounded-lg px-3 py-1.5 transition hover:text-emerald-400"
                    >
                      {c.name} <span className="text-slate-500 text-xs">{c.solarScore}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
