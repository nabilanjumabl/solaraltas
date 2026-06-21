import type { Metadata } from 'next'
import Link from 'next/link'
import { getTopCities } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Compare Solar Potential Between Cities | SolarAtlas',
  description: 'Side-by-side solar comparisons for the top US cities — savings, payback period, sun hours, and more.',
}

export default function CompareIndexPage() {
  const topCities = getTopCities(20)

  const pairs: { a: typeof topCities[0]; b: typeof topCities[0]; slug: string }[] = []
  for (let i = 0; i < topCities.length; i++) {
    for (let j = i + 1; j < topCities.length; j++) {
      pairs.push({
        a: topCities[i],
        b: topCities[j],
        slug: `${topCities[i].slug}-vs-${topCities[j].slug}`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">SolarAtlas</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Compare</span>
        </div>

        <h1 className="text-4xl font-black mb-3">Compare Cities</h1>
        <p className="text-slate-400 mb-12">
          {pairs.length} head-to-head comparisons across the top {topCities.length} solar cities in the US.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {pairs.map(p => (
            <Link
              key={p.slug}
              href={`/compare/${p.slug}`}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-600 rounded-xl p-5 transition group flex items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="font-semibold group-hover:text-emerald-400 transition">
                  {p.a.name} <span className="text-slate-500">vs</span> {p.b.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">{p.a.state} · {p.b.state}</div>
              </div>
              <div className="flex items-center gap-3 text-sm shrink-0">
                <span className="text-emerald-400 font-bold">{p.a.solarScore}</span>
                <span className="text-slate-600">vs</span>
                <span className="text-emerald-400 font-bold">{p.b.solarScore}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
