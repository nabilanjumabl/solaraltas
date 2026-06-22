'use client'

import { useState } from 'react'
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Sun, DollarSign, ChevronDown, ArrowRight } from 'lucide-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface CityCompareData {
  name: string
  state: string
  stateSlug: string
  slug: string
  solarScore: number
  peakSunHours: number
  annualSavings: number
  paybackYears: number
  savings25Year: number
  netCost: number
  avgElectricRate: number
  installerCount: number
  cloudyDaysPerYear: number
  humidity: number
  avgTemperature: number
  monthlySunHours: number[]
  federalTaxCredit: number
  stateIncentives: number
}

function buildProsCons(city: CityCompareData, other: CityCompareData) {
  const pros: string[] = [
    `${city.solarScore}/100 solar score`,
    `$${city.annualSavings.toLocaleString()}/yr average savings`,
    `${city.peakSunHours} peak sun hours/day`,
    `${city.installerCount} installers for competitive pricing`,
  ]
  const cons: string[] = [
    city.solarScore < other.solarScore ? `Lower score (${city.solarScore}/100) vs ${other.name}` : `${city.cloudyDaysPerYear} cloudy days/year`,
    city.paybackYears > other.paybackYears ? `${city.paybackYears}-year payback is longer than ${other.name}` : `Net cost of $${city.netCost.toLocaleString()} requires upfront or financed investment`,
    city.humidity > 50 ? `Higher humidity (${city.humidity}%) may need more frequent cleaning` : `Desert dust can reduce output without cleaning`,
  ]
  return { pros, cons }
}

function computeWinner(a: CityCompareData, b: CityCompareData) {
  let aScore = 0, bScore = 0
  if (a.solarScore > b.solarScore) aScore += 2; else bScore += 2
  if (a.annualSavings > b.annualSavings) aScore += 2; else bScore += 2
  if (a.paybackYears < b.paybackYears) aScore += 2; else bScore += 2
  if (a.peakSunHours > b.peakSunHours) aScore += 1; else bScore += 1
  if (a.cloudyDaysPerYear < b.cloudyDaysPerYear) aScore += 1; else bScore += 1
  return aScore >= bScore ? a : b
}

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-800 transition">
        <span className="font-semibold pr-4 text-sm">{q}</span>
        <ChevronDown size={16} className={`text-emerald-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed">{a}</div>}
    </div>
  )
}

export default function ComparePageClient({
  cityA,
  cityB,
  faqItems,
  relatedComparisons,
}: {
  cityA: CityCompareData
  cityB: CityCompareData
  faqItems: { q: string; a: string }[]
  relatedComparisons: { slug: string; nameA: string; nameB: string }[]
}) {
  const winner = computeWinner(cityA, cityB)
  const loser = winner.name === cityA.name ? cityB : cityA
  const { pros: prosA, cons: consA } = buildProsCons(cityA, cityB)
  const { pros: prosB, cons: consB } = buildProsCons(cityB, cityA)

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const sunHoursData = MONTHS.map((m, i) => ({
    month: m,
    [cityA.name]: cityA.monthlySunHours[i],
    [cityB.name]: cityB.monthlySunHours[i],
  }))

  const radarData = [
    { subject: 'Solar Score', [cityA.name]: cityA.solarScore, [cityB.name]: cityB.solarScore },
    { subject: 'Sun Hours', [cityA.name]: Math.round((cityA.peakSunHours / 9) * 100), [cityB.name]: Math.round((cityB.peakSunHours / 9) * 100) },
    { subject: 'Savings', [cityA.name]: Math.round((cityA.annualSavings / 1200) * 100), [cityB.name]: Math.round((cityB.annualSavings / 1200) * 100) },
    { subject: 'Payback', [cityA.name]: Math.round(100 - cityA.paybackYears * 4), [cityB.name]: Math.round(100 - cityB.paybackYears * 4) },
    { subject: 'Clear Days', [cityA.name]: Math.round(((365 - cityA.cloudyDaysPerYear) / 365) * 100), [cityB.name]: Math.round(((365 - cityB.cloudyDaysPerYear) / 365) * 100) },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm text-slate-400 mb-8">
            <a href="/" className="hover:text-white transition">SolarAtlas</a>
            <span className="mx-2">/</span>
            <a href="/compare" className="hover:text-white transition">Compare</a>
            <span className="mx-2">/</span>
            <span className="text-white">{cityA.name} vs {cityB.name}</span>
          </div>

          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1.5 bg-emerald-900 text-emerald-300 text-xs rounded-full mb-4">
              ⚡ Solar City Comparison — Powered by NREL data
            </div>
            <h1 className="text-5xl font-black mb-4">
              <span className="text-emerald-400">{cityA.name}</span>
              <span className="text-slate-500 mx-4 font-light text-4xl">vs</span>
              <span className="text-blue-400">{cityB.name}</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Full solar potential comparison — scores, savings, payback, weather & incentives
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[cityA, cityB].map((city, ci) => {
              const isWinner = city.name === winner.name
              return (
                <div key={city.name} className={`rounded-2xl border-2 p-6 text-center ${
                  isWinner ? 'bg-emerald-950/60 border-emerald-600' : 'bg-slate-800 border-slate-700'
                }`}>
                  {isWinner && (
                    <div className="text-xs font-bold text-emerald-400 bg-emerald-900/60 rounded-full px-3 py-1 inline-block mb-3">
                      🏆 WINNER
                    </div>
                  )}
                  <div className="text-2xl font-black mb-1" style={{ color: ci === 0 ? '#34d399' : '#60a5fa' }}>
                    {city.name}
                  </div>
                  <div className="text-sm text-slate-400 mb-4">{city.state}</div>
                  <div className="text-5xl font-black text-white mb-1">{city.solarScore}</div>
                  <div className="text-xs text-slate-400 mb-4">Solar Score / 100</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-700/60 rounded-lg p-2">
                      <div className="font-bold text-emerald-400">${city.annualSavings.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Savings/yr</div>
                    </div>
                    <div className="bg-slate-700/60 rounded-lg p-2">
                      <div className="font-bold text-emerald-400">{city.paybackYears} yrs</div>
                      <div className="text-xs text-slate-400">Payback</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── QUICK COMPARISON TABLE ───────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Side-by-Side Comparison</h2>
          <div className="bg-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="px-6 py-4 text-left text-slate-400 font-medium w-1/3">Metric</th>
                  <th className="px-6 py-4 text-center text-emerald-400 font-bold">{cityA.name}</th>
                  <th className="px-6 py-4 text-center text-blue-400 font-bold">{cityB.name}</th>
                  <th className="px-6 py-4 text-center text-slate-400 font-medium">Winner</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Solar Score', a: `${cityA.solarScore}/100`, b: `${cityB.solarScore}/100`, winA: cityA.solarScore > cityB.solarScore },
                  { label: 'Peak Sun Hours', a: `${cityA.peakSunHours} hrs/day`, b: `${cityB.peakSunHours} hrs/day`, winA: cityA.peakSunHours > cityB.peakSunHours },
                  { label: 'Annual Savings', a: `$${cityA.annualSavings.toLocaleString()}`, b: `$${cityB.annualSavings.toLocaleString()}`, winA: cityA.annualSavings > cityB.annualSavings },
                  { label: 'Payback Period', a: `${cityA.paybackYears} years`, b: `${cityB.paybackYears} years`, winA: cityA.paybackYears < cityB.paybackYears },
                  { label: '25-Year Savings', a: `$${cityA.savings25Year.toLocaleString()}`, b: `$${cityB.savings25Year.toLocaleString()}`, winA: cityA.savings25Year > cityB.savings25Year },
                  { label: 'Net System Cost', a: `$${cityA.netCost.toLocaleString()}`, b: `$${cityB.netCost.toLocaleString()}`, winA: cityA.netCost < cityB.netCost },
                  { label: 'Electricity Rate', a: `$${cityA.avgElectricRate.toFixed(3)}/kWh`, b: `$${cityB.avgElectricRate.toFixed(3)}/kWh`, winA: cityA.avgElectricRate > cityB.avgElectricRate },
                  { label: 'Cloudy Days/Yr', a: `${cityA.cloudyDaysPerYear}`, b: `${cityB.cloudyDaysPerYear}`, winA: cityA.cloudyDaysPerYear < cityB.cloudyDaysPerYear },
                  { label: 'Humidity', a: `${cityA.humidity}%`, b: `${cityB.humidity}%`, winA: cityA.humidity < cityB.humidity },
                  { label: 'Avg Temperature', a: `${cityA.avgTemperature}°F`, b: `${cityB.avgTemperature}°F`, winA: cityA.avgTemperature > cityB.avgTemperature },
                  { label: 'Installer Count', a: `${cityA.installerCount}`, b: `${cityB.installerCount}`, winA: cityA.installerCount > cityB.installerCount },
                  { label: 'State Incentives', a: `$${cityA.stateIncentives.toLocaleString()}`, b: `$${cityB.stateIncentives.toLocaleString()}`, winA: cityA.stateIncentives > cityB.stateIncentives },
                ].map((row, i) => (
                  <tr key={row.label} className={`border-b border-slate-600/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-600/10'}`}>
                    <td className="px-6 py-3 text-slate-300">{row.label}</td>
                    <td className={`px-6 py-3 text-center font-semibold ${row.winA ? 'text-emerald-400' : 'text-slate-300'}`}>{row.a}</td>
                    <td className={`px-6 py-3 text-center font-semibold ${!row.winA ? 'text-emerald-400' : 'text-slate-300'}`}>{row.b}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        row.winA ? 'bg-emerald-900/60 text-emerald-400' : 'bg-blue-900/60 text-blue-400'
                      }`}>
                        {row.winA ? cityA.name : cityB.name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CHARTS ───────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Visual Comparison</h2>
          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Monthly Sun Hours</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={sunHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey={cityA.name} fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey={cityB.name} fill="#60a5fa" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Overall Profile</h3>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Radar name={cityA.name} dataKey={cityA.name} stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Radar name={cityB.name} dataKey={cityB.name} stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Annual Savings Comparison</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { label: 'Yr 1', [cityA.name]: cityA.annualSavings, [cityB.name]: cityB.annualSavings },
                  { label: 'Yr 5', [cityA.name]: cityA.annualSavings * 5, [cityB.name]: cityB.annualSavings * 5 },
                  { label: 'Yr 10', [cityA.name]: cityA.annualSavings * 10, [cityB.name]: cityB.annualSavings * 10 },
                  { label: 'Yr 25', [cityA.name]: cityA.savings25Year, [cityB.name]: cityB.savings25Year },
                ]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(v: any) => [`$${v.toLocaleString()}`]}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey={cityA.name} fill="#10b981" radius={[0, 3, 3, 0]} />
                  <Bar dataKey={cityB.name} fill="#60a5fa" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Payback Period & Net Cost</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Payback (yrs)', [cityA.name]: cityA.paybackYears, [cityB.name]: cityB.paybackYears },
                  { name: 'Net Cost ($k)', [cityA.name]: cityA.netCost / 1000, [cityB.name]: cityB.netCost / 1000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey={cityA.name} fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey={cityB.name} fill="#60a5fa" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-400 mt-3">Lower is better for both payback and net cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INCENTIVES COMPARISON ────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Incentives Comparison</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[cityA, cityB].map((city, ci) => (
              <div key={city.name} className={`rounded-2xl border ${ci === 0 ? 'border-emerald-700 bg-emerald-950/40' : 'border-blue-700 bg-blue-950/30'}`}>
                <div className={`px-6 py-4 border-b font-bold ${ci === 0 ? 'border-emerald-700/50 text-emerald-400' : 'border-blue-700/50 text-blue-400'}`}>
                  {city.name}, {city.state}
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: 'Federal Tax Credit (30%)', value: `$${city.federalTaxCredit.toLocaleString()}` },
                      { label: 'State Energy Credit', value: `$${city.stateIncentives.toLocaleString()}` },
                      { label: 'Total Incentives', value: `$${(city.federalTaxCredit + city.stateIncentives).toLocaleString()}` },
                      { label: 'Net System Cost', value: `$${city.netCost.toLocaleString()}` },
                    ].map((row, i) => (
                      <tr key={row.label} className={`border-b border-slate-700/50 last:border-0 ${i === 3 ? 'bg-slate-700/30' : ''}`}>
                        <td className="px-6 py-3 text-slate-300">{row.label}</td>
                        <td className={`px-6 py-3 text-right font-bold ${i === 3 ? 'text-white' : 'text-emerald-400'}`}>
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROS & CONS ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">{cityA.name} vs {cityB.name}: Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { city: cityA, pros: prosA, cons: consA, ci: 0 },
              { city: cityB, pros: prosB, cons: consB, ci: 1 },
            ].map(({ city, pros, cons, ci }) => (
              <div key={city.name} className="space-y-4">
                <div className={`rounded-2xl border p-5 ${ci === 0 ? 'bg-emerald-950/40 border-emerald-800' : 'bg-blue-950/30 border-blue-800'}`}>
                  <h3 className={`font-bold mb-3 ${ci === 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {city.name} Pros
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {pros.map(p => (
                      <li key={p} className="flex items-start gap-2 text-slate-200">
                        <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-950/40 border border-red-900 rounded-2xl p-5">
                  <h3 className="text-red-400 font-bold mb-3">{city.name} Cons</h3>
                  <ul className="space-y-2 text-sm">
                    {cons.map(c => (
                      <li key={c} className="flex items-start gap-2 text-slate-200">
                        <span className="text-red-400 mt-0.5 shrink-0">✗</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERDICTS ─────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Our Verdict</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={18} className="text-emerald-400" />
                <span className="font-bold">Financial Verdict</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="font-semibold text-emerald-400">{winner.name}</span> wins financially.
                It produces ${(winner.savings25Year - loser.savings25Year).toLocaleString()} more over 25 years
                and pays back {Math.abs(winner.paybackYears - loser.paybackYears).toFixed(1)} years faster.
              </p>
            </div>
            <div className="bg-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sun size={18} className="text-yellow-400" />
                <span className="font-bold">Lifestyle Verdict</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="font-semibold text-emerald-400">{winner.name}</span> has{' '}
                {winner.cloudyDaysPerYear < loser.cloudyDaysPerYear ? `${loser.cloudyDaysPerYear - winner.cloudyDaysPerYear} fewer cloudy days` : 'a comparable climate'} and
                {winner.humidity < loser.humidity ? ` lower humidity (${winner.humidity}% vs ${loser.humidity}%)` : ' a similar climate'}.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-950 to-slate-800 border-2 border-emerald-600 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Overall Winner</div>
            <h3 className="text-4xl font-black text-emerald-400 mb-3">{winner.name}</h3>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              {winner.name} beats {loser.name} on solar score ({winner.solarScore} vs {loser.solarScore}),
              annual savings (${winner.annualSavings.toLocaleString()} vs ${loser.annualSavings.toLocaleString()}),
              and payback period ({winner.paybackYears} vs {loser.paybackYears} years).
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <a href={`/solar/${winner.stateSlug}/${winner.slug}`} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition flex items-center gap-2">
                {winner.name} Full Analysis <ArrowRight size={16} />
              </a>
              <a href={`/solar/${loser.stateSlug}/${loser.slug}`} className="px-6 py-3 border border-slate-600 hover:border-slate-400 rounded-xl transition">
                {loser.name} Full Analysis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Comparison FAQ</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER COMPARISONS ────────────────────────────────────────────────── */}
      {relatedComparisons.length > 0 && (
        <section className="px-6 py-16 bg-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Compare Other Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedComparisons.map(rc => (
                <a
                  key={rc.slug}
                  href={`/compare/${rc.slug}`}
                  className="bg-slate-900 hover:bg-slate-700 border border-slate-700 hover:border-emerald-600 rounded-xl p-4 text-center transition"
                >
                  <div className="text-sm font-semibold">{rc.nameA}</div>
                  <div className="text-xs text-slate-400 my-1">vs</div>
                  <div className="text-sm font-semibold">{rc.nameB}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-14 bg-emerald-600 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-3">Ready to go solar in {winner.name}?</h2>
          <p className="text-emerald-100 mb-8">Get your personalized analysis and compare installer quotes — free, no commitment.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`/solar/${winner.stateSlug}/${winner.slug}`} className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition">
              Analyze {winner.name} →
            </a>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-emerald-700 transition">
              Get Free Installer Quotes
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
