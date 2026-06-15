'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Sun, DollarSign, TrendingUp, Award, Zap, ChevronDown, ArrowRight } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CitySnippet {
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
  pros: string[]
  cons: string[]
}

// ─── City database (expand with full cities.json) ─────────────────────────────

const CITY_DB: Record<string, CitySnippet> = {
  phoenix: {
    name: 'Phoenix', state: 'Arizona', stateSlug: 'arizona', slug: 'phoenix',
    solarScore: 98, peakSunHours: 6.5, annualSavings: 936, paybackYears: 12.8,
    savings25Year: 23400, netCost: 6400, avgElectricRate: 0.13, installerCount: 127,
    cloudyDaysPerYear: 85, humidity: 18, avgTemperature: 75,
    monthlySunHours: [5.2, 6.1, 7.0, 7.2, 7.3, 7.5, 7.3, 7.0, 6.5, 6.0, 5.4, 4.8],
    federalTaxCredit: 3600, stateIncentives: 2000,
    pros: ['Highest solar score in US (98/100)', '6.5 sun hours/day', '$936/yr avg savings', 'Fast 12.8yr payback', '127 installers = competitive prices'],
    cons: ['Extreme heat reduces panel efficiency', 'Dust storms require cleaning', 'High heat ages roofs faster'],
  },
  austin: {
    name: 'Austin', state: 'Texas', stateSlug: 'texas', slug: 'austin',
    solarScore: 86, peakSunHours: 5.4, annualSavings: 696, paybackYears: 17.2,
    savings25Year: 17400, netCost: 6900, avgElectricRate: 0.12, installerCount: 89,
    cloudyDaysPerYear: 104, humidity: 60, avgTemperature: 68,
    monthlySunHours: [3.9, 4.5, 5.6, 5.8, 6.2, 6.4, 6.4, 6.2, 5.6, 4.8, 3.9, 3.6],
    federalTaxCredit: 3600, stateIncentives: 1500,
    pros: ['Deregulated energy market boosts ROI', '$696/yr average savings', 'Lower installation costs', 'Growing solar incentive programs'],
    cons: ['Lower score (86/100) vs desert cities', '17.2yr payback is longer avg', 'Higher humidity reduces efficiency', '104 cloudy days/year'],
  },
  'las-vegas': {
    name: 'Las Vegas', state: 'Nevada', stateSlug: 'nevada', slug: 'las-vegas',
    solarScore: 96, peakSunHours: 6.3, annualSavings: 828, paybackYears: 14.5,
    savings25Year: 20700, netCost: 6600, avgElectricRate: 0.12, installerCount: 102,
    cloudyDaysPerYear: 70, humidity: 22, avgTemperature: 72,
    monthlySunHours: [5.0, 5.9, 7.0, 7.4, 7.7, 8.0, 7.7, 7.4, 6.6, 5.6, 4.8, 4.4],
    federalTaxCredit: 3600, stateIncentives: 1800,
    pros: ['2nd highest score in US (96/100)', '6.3 sun hours/day', '$828/yr savings', 'Only 70 cloudy days/yr', 'Excellent net metering'],
    cons: ['Smaller installer market (102 companies)', 'Fewer state incentives than AZ', 'Summer heat reduces efficiency'],
  },
  tucson: {
    name: 'Tucson', state: 'Arizona', stateSlug: 'arizona', slug: 'tucson',
    solarScore: 97, peakSunHours: 6.4, annualSavings: 923, paybackYears: 13.0,
    savings25Year: 23075, netCost: 6400, avgElectricRate: 0.13, installerCount: 95,
    cloudyDaysPerYear: 87, humidity: 20, avgTemperature: 72,
    monthlySunHours: [5.0, 5.9, 6.8, 7.0, 7.1, 7.3, 7.1, 6.8, 6.3, 5.8, 5.2, 4.6],
    federalTaxCredit: 3600, stateIncentives: 2000,
    pros: ['97/100 solar score', '$923/yr avg savings', '6.4 sun hours/day', 'Same AZ incentives as Phoenix', 'Lower home prices = better ROI ratio'],
    cons: ['Slightly fewer installers than Phoenix (95)', 'More monsoon rain than Phoenix', 'High summer heat'],
  },
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ─── Parse slug: "phoenix-vs-austin" → ["phoenix", "austin"] ─────────────────

function parseCitiesFromSlug(slug: string): [string, string] {
  const parts = slug.split('-vs-')
  if (parts.length === 2) return [parts[0], parts[1]]
  return ['phoenix', 'austin']
}

// ─── Winner logic ─────────────────────────────────────────────────────────────

function computeWinner(a: CitySnippet, b: CitySnippet) {
  let aScore = 0, bScore = 0
  if (a.solarScore > b.solarScore) aScore += 2; else bScore += 2
  if (a.annualSavings > b.annualSavings) aScore += 2; else bScore += 2
  if (a.paybackYears < b.paybackYears) aScore += 2; else bScore += 2
  if (a.peakSunHours > b.peakSunHours) aScore += 1; else bScore += 1
  if (a.cloudyDaysPerYear < b.cloudyDaysPerYear) aScore += 1; else bScore += 1
  return aScore >= bScore ? a : b
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────

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

// ─── Main component ───────────────────────────────────────────────────────────

export default function ComparePage() {
  const params = useParams()
  const slug = (params?.slug as string) || 'phoenix-vs-austin'
  const [cityAKey, cityBKey] = parseCitiesFromSlug(slug)

  const cityA = CITY_DB[cityAKey] || CITY_DB['phoenix']
  const cityB = CITY_DB[cityBKey] || CITY_DB['austin']
  const winner = computeWinner(cityA, cityB)
  const loser = winner.name === cityA.name ? cityB : cityA

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Chart: monthly sun hours comparison
  const sunHoursData = MONTHS.map((m, i) => ({
    month: m,
    [cityA.name]: cityA.monthlySunHours[i],
    [cityB.name]: cityB.monthlySunHours[i],
  }))

  // Chart: key metrics bar comparison
  const metricsData = [
    { metric: 'Solar Score', [cityA.name]: cityA.solarScore, [cityB.name]: cityB.solarScore, max: 100 },
    { metric: 'Sun Hrs/Day', [cityA.name]: cityA.peakSunHours * 10, [cityB.name]: cityB.peakSunHours * 10, max: 100 },
    { metric: 'Savings/Yr', [cityA.name]: Math.round(cityA.annualSavings / 12), [cityB.name]: Math.round(cityB.annualSavings / 12), max: 100 },
  ]

  // Radar data
  const radarData = [
    { subject: 'Solar Score', [cityA.name]: cityA.solarScore, [cityB.name]: cityB.solarScore },
    { subject: 'Sun Hours', [cityA.name]: Math.round((cityA.peakSunHours / 9) * 100), [cityB.name]: Math.round((cityB.peakSunHours / 9) * 100) },
    { subject: 'Savings', [cityA.name]: Math.round((cityA.annualSavings / 1200) * 100), [cityB.name]: Math.round((cityB.annualSavings / 1200) * 100) },
    { subject: 'Payback', [cityA.name]: Math.round(100 - cityA.paybackYears * 4), [cityB.name]: Math.round(100 - cityB.paybackYears * 4) },
    { subject: 'Clear Days', [cityA.name]: Math.round(((365 - cityA.cloudyDaysPerYear) / 365) * 100), [cityB.name]: Math.round(((365 - cityB.cloudyDaysPerYear) / 365) * 100) },
  ]

  const faqItems = [
    {
      q: `Which city is better for solar — ${cityA.name} or ${cityB.name}?`,
      a: `${winner.name} wins on overall solar suitability with a ${winner.solarScore}/100 score vs ${loser.solarScore}/100. ${winner.name} also offers $${winner.annualSavings.toLocaleString()}/year vs $${loser.annualSavings.toLocaleString()}/year in ${loser.name}, with a faster ${winner.paybackYears}-year payback (${loser.name}: ${loser.paybackYears} years).`,
    },
    {
      q: `How much more can I save in ${winner.name} vs ${loser.name}?`,
      a: `Over 25 years, ${winner.name} saves $${winner.savings25Year.toLocaleString()} vs ${loser.name}'s $${loser.savings25Year.toLocaleString()} — a difference of $${(winner.savings25Year - loser.savings25Year).toLocaleString()}. That gap widens further if electricity rates rise, which is expected at 3–5%/year.`,
    },
    {
      q: `Is ${loser.name} still a good city for solar?`,
      a: `Yes — ${loser.name} scores ${loser.solarScore}/100 which is still ${loser.solarScore >= 80 ? 'above average nationally' : 'decent'}. It saves $${loser.annualSavings.toLocaleString()}/year, and with ${loser.installerCount} installers and $${loser.stateIncentives.toLocaleString()} in state incentives, it remains a valid choice — especially for homeowners who plan to stay 20+ years.`,
    },
    {
      q: `What if I'm moving between these cities?`,
      a: `Solar panels don't move with you. If you're undecided between cities, choose based on where you'll stay the longest. ${winner.paybackYears}-year payback in ${winner.name} means you need ${winner.paybackYears}+ years of ownership to profit. If you're only staying 10 years, either city may not fully pay back without resale value.`,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <div className="text-sm text-slate-400 mb-8">
            <a href="/" className="hover:text-white transition">SolarAtlas</a>
            <span className="mx-2">/</span>
            <span>Compare</span>
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

          {/* Hero score cards */}
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
                  { label: 'Electricity Rate', a: `$0.${Math.round(cityA.avgElectricRate * 100)}/kWh`, b: `$0.${Math.round(cityB.avgElectricRate * 100)}/kWh`, winA: cityA.avgElectricRate > cityB.avgElectricRate },
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

            {/* Monthly sun hours */}
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

            {/* Radar chart */}
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

            {/* Annual savings comparison */}
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
                    formatter={(v: number) => [`$${v.toLocaleString()}`]}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey={cityA.name} fill="#10b981" radius={[0, 3, 3, 0]} />
                  <Bar dataKey={cityB.name} fill="#60a5fa" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payback comparison */}
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
                        <td className={`px-6 py-3 text-right font-bold ${i === 2 ? 'text-emerald-400' : i === 3 ? 'text-white' : 'text-emerald-400'}`}>
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
            {[cityA, cityB].map((city, ci) => (
              <div key={city.name} className="space-y-4">
                <div className={`rounded-2xl border p-5 ${ci === 0 ? 'bg-emerald-950/40 border-emerald-800' : 'bg-blue-950/30 border-blue-800'}`}>
                  <h3 className={`font-bold mb-3 ${ci === 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {city.name} Pros
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {city.pros.map(p => (
                      <li key={p} className="flex items-start gap-2 text-slate-200">
                        <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-950/40 border border-red-900 rounded-2xl p-5">
                  <h3 className="text-red-400 font-bold mb-3">{city.name} Cons</h3>
                  <ul className="space-y-2 text-sm">
                    {city.cons.map(c => (
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
                With {winner.peakSunHours} sun hours vs {loser.peakSunHours}, the output advantage compounds over time.
              </p>
            </div>
            <div className="bg-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sun size={18} className="text-yellow-400" />
                <span className="font-bold">Lifestyle Verdict</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="font-semibold text-emerald-400">{winner.name}</span> has{' '}
                {winner.cloudyDaysPerYear < loser.cloudyDaysPerYear ? `${loser.cloudyDaysPerYear - winner.cloudyDaysPerYear} fewer cloudy days` : 'better overall climate'} and
                {winner.humidity < loser.humidity ? ` lower humidity (${winner.humidity}% vs ${loser.humidity}%)` : ' comparable climate'}.
                Both cities are excellent for solar, but {winner.name}'s climate is more consistently favorable year-round.
              </p>
            </div>
          </div>

          {/* Winner announcement */}
          <div className="bg-gradient-to-r from-emerald-950 to-slate-800 border-2 border-emerald-600 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Overall Winner</div>
            <h3 className="text-4xl font-black text-emerald-400 mb-3">{winner.name}</h3>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              {winner.name} beats {loser.name} on solar score ({winner.solarScore} vs {loser.solarScore}),
              annual savings (${winner.annualSavings.toLocaleString()} vs ${loser.annualSavings.toLocaleString()}),
              and payback period ({winner.paybackYears} vs {loser.paybackYears} years). For pure solar ROI, {winner.name} is the clear choice.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <a
                href={`/solar/${winner.stateSlug}/${winner.slug}`}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition flex items-center gap-2"
              >
                {winner.name} Full Analysis <ArrowRight size={16} />
              </a>
              <a
                href={`/solar/${loser.stateSlug}/${loser.slug}`}
                className="px-6 py-3 border border-slate-600 hover:border-slate-400 rounded-xl transition"
              >
                {loser.name} Full Analysis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IF YOU MOVE ─────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">What If You Move Between Cities?</h2>
          <div className="bg-slate-800 rounded-2xl p-6 text-sm text-slate-300 leading-relaxed space-y-3">
            <p>
              Solar panels are fixed to your home — they don't move with you. When you sell, the system
              transfers to the buyer and typically adds <strong className="text-white">$15,000–$25,000</strong> to your home's resale value
              (based on Lawrence Berkeley National Lab studies).
            </p>
            <p>
              If you install in <strong className="text-emerald-400">{winner.name}</strong> and sell after 10 years,
              you'll have recovered ~${(winner.annualSavings * 10).toLocaleString()} in savings plus added value to your home.
              Net: you'll likely break even or profit even with a mid-term sale.
            </p>
            <p>
              In <strong className="text-blue-400">{loser.name}</strong> with a {loser.paybackYears}-year payback,
              selling before year {Math.round(loser.paybackYears)} means the panels may not have fully paid off —
              but home value uplift typically compensates.
            </p>
            <p className="text-slate-400 italic">
              Tip: If you're unsure how long you'll stay, choose the city with the shorter payback period ({winner.name}) or finance with a low-interest solar loan to keep cash flexible.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
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
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Compare Other Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['phoenix', 'las-vegas'],
              ['phoenix', 'tucson'],
              ['austin', 'las-vegas'],
              ['tucson', 'austin'],
            ].map(([a, b]) => {
              const cA = CITY_DB[a]
              const cB = CITY_DB[b]
              if (!cA || !cB) return null
              return (
                <a
                  key={`${a}-${b}`}
                  href={`/compare/${a}-vs-${b}`}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-600 rounded-xl p-4 text-center transition"
                >
                  <div className="text-sm font-semibold">{cA.name}</div>
                  <div className="text-xs text-slate-400 my-1">vs</div>
                  <div className="text-sm font-semibold">{cB.name}</div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

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
                {col.links.map(l => <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>)}
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
