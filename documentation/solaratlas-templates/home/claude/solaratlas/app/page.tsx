import type { Metadata } from 'next'
import Link from 'next/link'
import { Sun, DollarSign, Zap, MapPin, TrendingUp, Shield, Search, ArrowRight, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { getTopCities, getTopStates, nationalStats } from '@/lib/data'

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "SolarAtlas — America's Solar Potential Database | 24,847 Cities",
  description:
    'Free solar potential analysis for every US city. Interactive savings calculator, NREL-powered data, installer comparison — no signup required. Find out exactly how much solar can save you.',
  openGraph: {
    title: "SolarAtlas — America's Solar Potential Database",
    description: 'Solar analysis for 24,847 US cities. Free calculator, no signup.',
    images: [{ url: '/og-homepage.png', width: 1200, height: 630 }],
  },
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOP_CITIES  = getTopCities(12)
const TOP_STATES  = getTopStates(10)

const SCORE_COLOR = (s: number) =>
  s >= 90 ? 'text-emerald-400' : s >= 75 ? 'text-yellow-400' : 'text-orange-400'

const SCORE_BG = (s: number) =>
  s >= 90 ? 'bg-emerald-900/50 border-emerald-700' : s >= 75 ? 'bg-yellow-900/50 border-yellow-700' : 'bg-orange-900/50 border-orange-700'

// ─── Schema.org structured data ──────────────────────────────────────────────

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'SolarAtlas US Solar Potential Database',
  description: 'Solar potential scores, savings estimates, and payback calculations for 24,847 US cities',
  url: 'https://solaratlas.com',
  creator: { '@type': 'Organization', name: 'SolarAtlas' },
  temporalCoverage: '2026',
  spatialCoverage: { '@type': 'Place', name: 'United States of America' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Star size={12} fill="currentColor" />
            {nationalStats.totalCitiesAnalyzed.toLocaleString()} cities analyzed · Powered by NREL data
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            America&apos;s Solar<br />
            <span className="text-emerald-400">Potential Database</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Find out exactly how much solar can save you — free interactive calculator,
            installer comparison, and NREL-backed data for every US city.
            <span className="text-emerald-400 font-semibold"> No signup required.</span>
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="flex items-center gap-3 bg-slate-800 border-2 border-slate-600 hover:border-emerald-500 focus-within:border-emerald-500 rounded-2xl px-5 py-4 transition">
              <Search size={20} className="text-slate-400 shrink-0" />
              <input
                placeholder="Enter your city or state…"
                className="flex-1 bg-transparent outline-none text-white placeholder-slate-400 text-lg"
              />
              <button className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm transition">
                Search
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Popular:{' '}
            {['Phoenix', 'Austin', 'Las Vegas', 'Miami', 'Denver'].map((city, i) => (
              <span key={city}>
                <Link href={`/solar/${city.toLowerCase().replace(' ', '-')}`} className="text-slate-400 hover:text-emerald-400 transition">
                  {city}
                </Link>
                {i < 4 && <span className="mx-2 text-slate-700">·</span>}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ── NATIONAL STATS BAR ────────────────────────────────────────────── */}
      <section className="bg-slate-800 border-y border-slate-700 px-6 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Cities Analyzed',    value: nationalStats.totalCitiesAnalyzed.toLocaleString(), icon: <MapPin size={20} /> },
            { label: 'Avg Annual Savings', value: `$${nationalStats.avgNationalAnnualSavings.toLocaleString()}`, icon: <DollarSign size={20} /> },
            { label: 'Avg Solar Score',    value: `${nationalStats.avgNationalSolarScore}/100`, icon: <Sun size={20} /> },
            { label: 'Federal Tax Credit', value: '30%',  icon: <Shield size={20} /> },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div className="text-emerald-400">{stat.icon}</div>
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-3">How SolarAtlas Works</h2>
            <p className="text-slate-400">NREL irradiance data + local incentives + live electricity rates = your exact ROI</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <MapPin size={28} />,
                title: 'Find Your City',
                desc: 'Search any of 24,847 US cities or browse by state. Each city has a dedicated analysis page with NREL-sourced solar irradiance data.',
              },
              {
                step: '02',
                icon: <Zap size={28} />,
                title: 'See Your Solar Score',
                desc: 'We compute a 0–100 score based on sun hours, climate, local rates, and incentives. Scores 80+ are excellent ROI candidates.',
              },
              {
                step: '03',
                icon: <DollarSign size={28} />,
                title: 'Calculate Exact Savings',
                desc: 'Use the interactive calculator to dial in your system size and bill. See payback period, 25-year savings, and monthly output — instantly.',
              },
            ].map(card => (
              <div key={card.step} className="bg-slate-800 rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute top-5 right-5 text-6xl font-black text-slate-700/40 leading-none">
                  {card.step}
                </div>
                <div className="text-emerald-400 mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP CITIES ────────────────────────────────────────────────────── */}
      <section id="cities" className="px-6 py-20 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black mb-2">Best Solar Cities in America</h2>
              <p className="text-slate-400">Ranked by solar score · Click any city for full analysis</p>
            </div>
            <Link href="/solar" className="text-sm text-emerald-400 hover:text-emerald-300 transition hidden md:flex items-center gap-1">
              View all 24,847 cities <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOP_CITIES.map((city, i) => (
              <Link
                key={city.id}
                href={`/solar/${city.stateSlug}/${city.slug}`}
                className="group flex items-center gap-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-emerald-500 rounded-xl p-4 transition"
              >
                <div className="text-xl font-black text-slate-500 w-7 shrink-0">#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold group-hover:text-emerald-400 transition truncate">{city.name}</div>
                  <div className="text-xs text-slate-400">{city.state} · {city.abbr}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-lg font-black ${SCORE_COLOR(city.solarScore)}`}>{city.solarScore}</div>
                  <div className="text-xs text-slate-400">${city.annualSavings.toLocaleString()}/yr</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP STATES ────────────────────────────────────────────────────── */}
      <section id="states" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black mb-2">Best Solar States</h2>
              <p className="text-slate-400">State averages across all analyzed cities</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {TOP_STATES.map((state, i) => (
              <Link
                key={state.id}
                href={`/solar/${state.slug}`}
                className="group flex items-center gap-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-xl p-5 transition"
              >
                <div className="text-2xl font-black text-slate-600 w-8 shrink-0">#{i + 1}</div>

                <div className="flex-1">
                  <div className="font-bold text-lg group-hover:text-emerald-400 transition">{state.name}</div>
                  <div className="text-sm text-slate-400">{state.climateType} · {state.cityCount.toLocaleString()} cities</div>
                  {/* Score bar */}
                  <div className="mt-2 h-1.5 bg-slate-600 rounded-full w-48 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${state.solarScore}%` }}
                    />
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-3xl font-black ${SCORE_COLOR(state.solarScore)}`}>{state.solarScore}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    ${state.annualSavings.toLocaleString()}/yr avg
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK CALCULATOR TEASER ───────────────────────────────────────── */}
      <section id="calculator" className="px-6 py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-3">National Solar Calculator</h2>
          <p className="text-slate-400 mb-10">A rough estimate for any US homeowner — pick your state for city-precise numbers</p>

          <div className="bg-slate-700 rounded-2xl p-8 text-left">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: 'Avg US Savings (4 kW)', value: `$${nationalStats.avgNationalAnnualSavings.toLocaleString()}/yr` },
                { label: 'Avg Payback Period',    value: `${nationalStats.avgNationalPaybackYears} years` },
                { label: '25-Year Total Savings', value: `$${(nationalStats.avgNationalAnnualSavings * 25).toLocaleString()}` },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-black text-emerald-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-600 text-center">
              <p className="text-sm text-slate-400 mb-4">
                National averages. Your actual savings depend on city, roof orientation, and local rates.
              </p>
              <Link
                href="/solar/arizona/phoenix"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition"
              >
                Get City-Specific Calculator <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARE TEASER ────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Compare Any Two Cities</h2>
            <p className="text-slate-400">Side-by-side solar score, savings, payback, and incentives</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['phoenix', 'las-vegas',      'Phoenix vs Las Vegas'],
              ['austin', 'dallas',          'Austin vs Dallas'],
              ['miami', 'orlando',          'Miami vs Orlando'],
              ['los-angeles', 'san-diego',  'LA vs San Diego'],
            ].map(([a, b, label]) => (
              <Link
                key={label}
                href={`/compare/${a}-vs-${b}`}
                className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-xl p-5 text-center transition"
              >
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-sm group-hover:text-emerald-400 transition">{label}</div>
                <div className="text-xs text-slate-400 mt-1">Full comparison →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRUST US ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Why Trust SolarAtlas?</h2>
            <p className="text-slate-400">No ads. No affiliate kickbacks. Just data.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🏛️',
                title: 'NREL-Sourced Data',
                desc: 'All solar irradiance figures come directly from the National Renewable Energy Laboratory — the gold standard for US solar data.',
              },
              {
                icon: '🔢',
                title: 'Real Calculations',
                desc: 'We model actual panel degradation (0.5%/yr), utility rate inflation (3.2%/yr), and regional cost-of-living in every payback estimate.',
              },
              {
                icon: '🚫',
                title: 'Zero Ads or Bias',
                desc: 'SolarAtlas is not affiliated with any installer. We don\'t earn referral fees. Our rankings are purely algorithmic and data-driven.',
              },
            ].map(card => (
              <div key={card.title} className="bg-slate-700 rounded-2xl p-7 text-center">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (homepage) ────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-10 text-center">Solar FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How is the solar score calculated?',
                a: 'The score (0–100) weighs: peak sun hours (40%), local electricity rate (25%), state incentives (15%), climate type (10%), and installer competition (10%). A score above 80 indicates excellent ROI; above 90 is exceptional.',
              },
              {
                q: 'What does the federal 30% tax credit mean?',
                a: 'The Inflation Reduction Act (IRA) allows you to deduct 30% of your total solar installation cost from your federal income taxes. On a $12,000 system, that\'s $3,600 back — claimed the year of installation.',
              },
              {
                q: 'Is solar still worth it in cloudy states?',
                a: 'Often yes — especially where electricity rates are high (NY, MA, CT, NJ). Massachusetts homeowners save ~$1,032/year despite only 4.1 sun hours/day, because utility rates are $0.25+/kWh. Net metering policies matter more than sun hours alone.',
              },
              {
                q: 'How accurate are the savings estimates?',
                a: 'Our city averages are within ±15% of real-world outcomes for a standard 4 kW south-facing system with no major shading. Individual results vary based on roof angle, shading, local utility rates, and which installer you use.',
              },
              {
                q: 'What\'s the best system size for most homes?',
                a: 'The US average home uses ~10,500 kWh/year. In a city with 5 sun hours/day, a 6 kW system produces roughly that amount. Use the city-specific calculator to dial in based on your actual monthly bill.',
              },
            ].map((item, i) => (
              <details key={i} className="group border border-slate-700 rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-800 transition list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-emerald-400 group-open:rotate-180 transition-transform text-lg">↓</span>
                </summary>
                <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-gradient-to-r from-emerald-900 to-slate-800 border-t border-emerald-800">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-5">☀️</div>
          <h2 className="text-4xl font-black mb-4">Find Your City&apos;s Solar Score</h2>
          <p className="text-emerald-200 mb-10 text-lg">
            Free analysis · No signup · No spam · Instant results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/solar/arizona/phoenix"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold text-lg transition"
            >
              Browse Top Solar Cities
            </Link>
            <Link
              href="/solar/arizona"
              className="px-8 py-4 border-2 border-emerald-600 text-emerald-300 hover:bg-emerald-900 rounded-xl font-bold text-lg transition"
            >
              Browse by State
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 px-6 py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Sun size={15} className="text-white" />
                </div>
                <span className="font-black">Solar<span className="text-emerald-400">Atlas</span></span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Solar potential data for every US city. NREL-powered. No ads. No signup.
              </p>
            </div>

            {/* Link columns */}
            {[
              { title: 'Explore',  links: ['Top Cities', 'Top States', 'Compare Cities', 'Solar Calculator'] },
              { title: 'Learn',    links: ['Blog', 'Solar Guides', 'Incentives Guide', 'Installer Tips'] },
              { title: 'Company',  links: ['About Us', 'Methodology', 'Privacy Policy', 'Terms of Service'] },
              { title: 'Connect',  links: ['Twitter', 'LinkedIn', 'Newsletter', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <h3 className="font-bold text-white mb-3 text-sm">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm text-slate-400 hover:text-white transition">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <span>© 2026 SolarAtlas. All rights reserved.</span>
            <span>Data sourced from NREL (National Renewable Energy Laboratory). Last updated June 2026.</span>
          </div>
        </div>
      </footer>
    </>
  )
}
