'use client'

import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts'
import { Sun, DollarSign, Zap, MapPin, ChevronDown, TrendingUp, Award, Shield, Battery, Home } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TopCity {
  name: string
  slug: string
  solarScore: number
  annualSavings: number
}

interface MonthlyRow {
  month: string
  sunHours: number
  avgKwh: number
  savings: number
}

interface StateData {
  id: number
  name: string
  slug: string
  abbreviation: string
  avgSolarScore: number
  avgSunHours: number
  avgAnnualSavings: number
  avgPaybackYears: number
  cityCount: number
  climateType: string
  avgTemperature: number
  cloudyDaysPerYear: number
  rainyDaysPerYear: number
  stateIncentives: {
    propertyTaxExemption: number
    energyTaxCredit: number
    netMetering: string
  }
  topCities: TopCity[]
  installerCount: number
  rating: number
  pros: string[]
  cons: string[]
  monthlyData: MonthlyRow[]
  metaTitle: string
  metaDescription: string
}

const SCORE_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-emerald-400' : score >= 75 ? 'text-yellow-400' : 'text-orange-400'
  const bg = score >= 90 ? 'bg-emerald-900/60 border-emerald-700' : score >= 75 ? 'bg-yellow-900/60 border-yellow-700' : 'bg-orange-900/60 border-orange-700'
  return (
    <div className={`inline-flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 ${bg}`}>
      <span className={`text-3xl font-black ${color}`}>{score}</span>
      <span className="text-xs text-slate-400 mt-0.5">/ 100</span>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-slate-600'}>★</span>
      ))}
    </div>
  )
}

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-800 transition"
      >
        <span className="font-semibold pr-4">{q}</span>
        <ChevronDown size={18} className={`text-emerald-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed">{a}</div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StatePageClient({ state }: { state: StateData }) {
  const monthlyData = state.monthlyData

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const FEDERAL_CREDIT = 0.30
  const SYSTEM_COST = 12000
  const netCost = SYSTEM_COST - SYSTEM_COST * FEDERAL_CREDIT - state.stateIncentives.energyTaxCredit - state.stateIncentives.propertyTaxExemption

  const faqItems = [
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
      a: `There are roughly ${state.installerCount} licensed solar installers active across ${state.name}. Major national operators include Sunrun, Tesla, SunPower, and Palmetto, alongside local firms with lower overhead costs.`,
    },
    {
      q: `What's the best time of year for solar in ${state.name}?`,
      a: `Peak production occurs in summer months (June–August) when sun hours reach ${Math.max(...monthlyData.map(m => m.sunHours))} hours/day. Even in ${state.name}'s slowest month the output is still viable at ${Math.min(...monthlyData.map(m => m.sunHours))} hours/day.`,
    },
    {
      q: `Does ${state.name} allow net metering?`,
      a: `Yes. Net metering in ${state.name} is rated "${state.stateIncentives.netMetering}". Excess solar power exported to the grid earns credits on your utility bill, improving overall ROI.`,
    },
    {
      q: `What system size do most ${state.name} homeowners install?`,
      a: `Most ${state.name} homeowners install 4–8 kW systems. Given ${state.avgSunHours} peak sun hours, a 6 kW system produces about ${Math.round(state.avgSunHours * 6 * 365)} kWh/year — enough to cover most of an average home's consumption.`,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <div className="text-sm text-slate-400 mb-8">
            <a href="/" className="hover:text-white transition">SolarAtlas</a>
            <span className="mx-2">/</span>
            <span className="text-white">{state.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">☀️</span>
                <StarRating rating={state.rating} />
                <span className="text-sm text-slate-400">State rating</span>
              </div>
              <h1 className="text-5xl font-black mb-4">
                {state.name} Solar<br />
                <span className="text-emerald-400">Potential</span>
              </h1>
              <p className="text-xl text-slate-300 mb-6 max-w-xl">
                {state.cityCount} cities analyzed · {state.climateType} climate ·
                {' '}{state.installerCount} certified installers
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#calculator"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition"
                >
                  Calculate My Savings
                </a>
                <a
                  href="#cities"
                  className="px-6 py-3 border border-slate-600 hover:border-emerald-400 rounded-lg transition"
                >
                  View All {state.cityCount} Cities
                </a>
              </div>
            </div>

            {/* Score + quick stats */}
            <div className="flex flex-col items-center gap-4">
              <ScoreBadge score={state.avgSolarScore} />
              <div className="text-sm text-slate-400 text-center">Avg solar score</div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { label: 'Sun hours/day', value: `${state.avgSunHours}h` },
                  { label: 'Avg savings/yr', value: `$${state.avgAnnualSavings.toLocaleString()}` },
                  { label: 'Payback period', value: `${state.avgPaybackYears} yrs` },
                  { label: 'Sunny days/yr', value: `${365 - state.cloudyDaysPerYear}` },
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-center min-w-[110px]">
                    <div className="text-lg font-bold text-emerald-400">{stat.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIMATE ANALYSIS ─────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Climate Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Sun size={24} />, label: 'Climate type', value: state.climateType },
              { icon: <Zap size={24} />, label: 'Avg temperature', value: `${state.avgTemperature}°F` },
              { icon: <MapPin size={24} />, label: 'Cloudy days/yr', value: `${state.cloudyDaysPerYear} days` },
              { icon: <TrendingUp size={24} />, label: 'Rainy days/yr', value: `${state.rainyDaysPerYear} days` },
            ].map(item => (
              <div key={item.label} className="bg-slate-700 p-5 rounded-xl flex items-start gap-3">
                <div className="text-emerald-400 mt-0.5">{item.icon}</div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                  <div className="font-bold">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINANCIAL SUMMARY ────────────────────────────────────────────────── */}
      <section id="calculator" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Financial Summary</h2>
          <div className="grid md:grid-cols-2 gap-8">

            {/* Cost breakdown table */}
            <div className="bg-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 font-semibold">
                Cost & Incentives — 4 kW System
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: 'Gross system cost', value: `$${SYSTEM_COST.toLocaleString()}`, accent: false },
                    { label: 'Federal tax credit (30%)', value: `-$${(SYSTEM_COST * 0.3).toLocaleString()}`, accent: true },
                    { label: `${state.name} energy credit`, value: `-$${state.stateIncentives.energyTaxCredit.toLocaleString()}`, accent: true },
                    { label: 'Property tax exemption', value: `-$${state.stateIncentives.propertyTaxExemption.toLocaleString()}`, accent: true },
                    { label: 'Your net cost', value: `$${Math.max(0, Math.round(netCost)).toLocaleString()}`, accent: false },
                  ].map(row => (
                    <tr key={row.label} className="border-b border-slate-700 last:border-0 last:bg-slate-700/50">
                      <td className="px-6 py-3 text-slate-300">{row.label}</td>
                      <td className={`px-6 py-3 text-right font-bold ${row.accent ? 'text-emerald-400' : 'text-white'}`}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 25-year projection */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <div className="font-semibold mb-4">25-Year Savings Projection</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={[5, 10, 15, 20, 25].map(yr => ({
                  year: `Yr ${yr}`,
                  savings: state.avgAnnualSavings * yr,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(v: any) => [`$${v.toLocaleString()}`, 'Total savings']}
                  />
                  <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 bg-emerald-900/40 border border-emerald-800 rounded-xl p-4 text-center">
                <div className="text-xs text-slate-400 mb-1">Total 25-year savings</div>
                <div className="text-3xl font-black text-emerald-400">
                  ${(state.avgAnnualSavings * 25).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INCENTIVES ───────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Incentives in {state.name}</h2>
          <p className="text-slate-400 mb-8 text-sm">All incentives stack — you can claim federal + state + local in the same year.</p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <Shield size={28} />,
                label: 'Federal ITC',
                title: '30% Tax Credit',
                desc: "Deduct 30% of total system cost from your federal income taxes. On a $12,000 system, that is $3,600 back.",
                amount: `$${(SYSTEM_COST * 0.3).toLocaleString()}`,
              },
              {
                icon: <Award size={28} />,
                label: `${state.name} Energy Credit`,
                title: `$${state.stateIncentives.energyTaxCredit.toLocaleString()} Credit`,
                desc: `${state.name} provides a state-level income tax credit on qualifying solar installations. Reduces state tax liability.`,
                amount: `$${state.stateIncentives.energyTaxCredit.toLocaleString()}`,
              },
              {
                icon: <Home size={28} />,
                label: 'Property Tax Exemption',
                title: `$${state.stateIncentives.propertyTaxExemption.toLocaleString()} Exemption`,
                desc: 'Solar adds value to your home, but in ' + state.name + ' that added value is exempt from property tax assessment.',
                amount: `$${state.stateIncentives.propertyTaxExemption.toLocaleString()}`,
              },
            ].map(item => (
              <div key={item.label} className="bg-slate-700 rounded-2xl p-6">
                <div className="text-emerald-400 mb-3">{item.icon}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-xl font-bold mb-2">{item.title}</div>
                <p className="text-sm text-slate-300 mb-4">{item.desc}</p>
                <div className="text-2xl font-black text-emerald-400">{item.amount}</div>
                <div className="text-xs text-slate-400">avg value</div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-slate-700/50 border border-slate-600 rounded-xl p-5 flex items-center gap-4">
            <Zap size={24} className="text-yellow-400 shrink-0" />
            <div>
              <span className="font-semibold">Net Metering: </span>
              <span className="text-emerald-400 font-bold">{state.stateIncentives.netMetering}</span>
              <span className="text-slate-300 text-sm ml-2">
                — {state.name} utilities credit exported solar power, improving payback time.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MONTHLY BREAKDOWN ────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Monthly Solar Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase tracking-wider">Peak Sun Hours by Month</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(v: any) => [`${v} hrs`, 'Sun hours']}
                  />
                  <Bar dataKey="sunHours" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase tracking-wider">Avg Monthly Savings (4 kW system)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(v: any) => [`$${v}`, 'Savings']}
                  />
                  <Line type="monotone" dataKey="savings" stroke="#34d399" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly table */}
          <div className="mt-6 bg-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  {['Month', 'Sun Hours', 'Avg kWh Output', 'Est. Savings'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, i) => (
                  <tr key={row.month} className={`border-b border-slate-700/50 ${i % 2 === 0 ? '' : 'bg-slate-700/20'}`}>
                    <td className="px-5 py-3 font-medium">{row.month}</td>
                    <td className="px-5 py-3 text-emerald-400">{row.sunHours} hrs</td>
                    <td className="px-5 py-3">{row.avgKwh.toLocaleString()} kWh</td>
                    <td className="px-5 py-3 text-emerald-400">${row.savings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TOP CITIES ───────────────────────────────────────────────────────── */}
      <section id="cities" className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Top Cities in {state.name}</h2>
          <p className="text-slate-400 mb-8 text-sm">Ranked by real solar score. Click any city for a full analysis.</p>

          {state.topCities.length === 0 ? (
            <p className="text-slate-400 text-sm">No cities analyzed yet for {state.name}.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {state.topCities.map((city, i) => (
                <a
                  key={city.slug}
                  href={`/solar/${state.slug}/${city.slug}`}
                  className="flex items-center gap-4 bg-slate-700 hover:bg-slate-600 rounded-xl p-4 transition group"
                >
                  <div className="text-2xl font-black text-slate-500 w-8 shrink-0">#{i + 1}</div>
                  <div className="flex-1">
                    <div className="font-bold group-hover:text-emerald-400 transition">{city.name}</div>
                    <div className="text-sm text-slate-400">{state.name} · {state.abbreviation}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">{city.solarScore}/100</div>
                    <div className="text-xs text-slate-400">${city.annualSavings}/yr</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROS & CONS ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Solar in {state.name}: Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-6">
              <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">✅</span> Why {state.name} is great for solar
              </h3>
              <ul className="space-y-3">
                {state.pros.map(pro => (
                  <li key={pro} className="flex items-start gap-3 text-sm text-emerald-100">
                    <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-950 border border-red-800 rounded-2xl p-6">
              <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">⚠️</span> Challenges to know about
              </h3>
              <ul className="space-y-3">
                {state.cons.map(con => (
                  <li key={con} className="flex items-start gap-3 text-sm text-red-100">
                    <span className="text-red-400 shrink-0 mt-0.5">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── BATTERY STORAGE ──────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Battery size={24} className="text-emerald-400" />
            <h2 className="text-2xl font-bold">Battery Storage in {state.name}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 text-sm">
            {[
              { title: 'Best use case', desc: 'Evening demand offset — solar charges battery during peak sun, discharges during peak utility rates (4–9 PM).' },
              { title: 'Popular models', desc: 'Tesla Powerwall 3 (13.5 kWh), Enphase IQ Battery 10, SunPower SunVault. All compatible with ' + state.name + ' net metering.' },
              { title: 'Typical ROI', desc: `In ${state.name}, battery payback is 8–12 years standalone, or 5–7 years when bundled with solar installation (saves on labor).` },
            ].map(card => (
              <div key={card.title} className="bg-slate-700 rounded-xl p-5">
                <div className="font-semibold mb-2 text-emerald-400">{card.title}</div>
                <p className="text-slate-300 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">{state.name} Solar FAQ</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <FAQItem
                key={i}
                q={item.q}
                a={item.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEXT STEPS ───────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to go solar in {state.name}?</h2>
          <p className="text-slate-400 mb-8">Pick your city for a personalized analysis — or get quotes from local installers now.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#cities" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition">
              Browse {state.name} Cities
            </a>
            <button className="px-8 py-4 border border-emerald-600 text-emerald-400 hover:bg-emerald-950 rounded-xl font-bold transition">
              Get Free Installer Quotes
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 px-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-slate-400 mb-10">
          {[
            { title: 'Product', links: ['Solar Calculator', 'Solar Data', 'Compare Cities'] },
            { title: 'Learn', links: ['Blog', 'Guides', 'FAQ'] },
            { title: 'Company', links: ['About Us', 'Privacy', 'Terms'] },
            { title: 'Social', links: ['Twitter', 'Facebook', 'LinkedIn'] },
          ].map(col => (
            <div key={col.title}>
              <h3 className="font-bold text-white mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          © 2026 SolarAtlas · Data sourced from NREL · No signup required
        </div>
      </footer>
    </div>
  )
}
