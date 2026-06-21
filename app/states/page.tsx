import type { Metadata } from 'next'
import Link from 'next/link'
import { getTopStates } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Solar Potential by State | All 50 States Ranked | SolarAtlas',
  description: 'Compare solar potential across all 50 US states — ranked by solar score, average savings, and payback period.',
}

export default function StatesIndexPage() {
  const states = getTopStates(50)

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">SolarAtlas</Link>
          <span className="mx-2">/</span>
          <span className="text-white">All States</span>
        </div>

        <h1 className="text-4xl font-black mb-3">Solar Potential by State</h1>
        <p className="text-slate-400 mb-12">All 50 states ranked by average solar score.</p>

        <div className="grid md:grid-cols-2 gap-3">
          {states.map((s, i) => (
            <Link
              key={s.slug}
              href={`/solar/${s.slug}`}
              className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-600 rounded-xl p-4 transition group"
            >
              <div className="text-xl font-black text-slate-500 w-8 shrink-0">#{i + 1}</div>
              <div className="flex-1">
                <div className="font-bold group-hover:text-emerald-400 transition">{s.name}</div>
                <div className="text-xs text-slate-400">{s.cityCount} cities · {s.climateType}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-emerald-400">{s.solarScore}/100</div>
                <div className="text-xs text-slate-400">${s.annualSavings}/yr</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
