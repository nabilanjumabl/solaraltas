import type { Metadata } from 'next'
import Link from 'next/link'
import { Sun, Database, Cpu, ShieldCheck } from 'lucide-react'
import { allCities, allStates } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About SolarAtlas',
  description: 'SolarAtlas is an independent solar potential database covering US cities and states — how it works, where the data comes from, and who built it.',
}

export default function AboutPage() {
  const cityCount = allCities.length
  const stateCount = allStates.length

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">SolarAtlas</Link>
          <span className="mx-2">/</span>
          <span className="text-white">About</span>
        </div>

        <h1 className="text-4xl font-black mb-6">About SolarAtlas</h1>

        <p className="text-slate-300 leading-relaxed mb-6">
          SolarAtlas is a free, independent reference tool for understanding solar potential
          across the United States. We currently cover {cityCount} cities across all {stateCount} states,
          with the goal of growing that coverage over time. There&apos;s no signup, no paywall, and
          no account required to use the data or the calculator.
        </p>

        <p className="text-slate-300 leading-relaxed mb-12">
          The project started from a simple frustration: most online solar calculators either
          require handing over your phone number before showing you a single number, or give
          estimates so generic they&apos;re not useful for a specific city. SolarAtlas tries to do
          the opposite — show the numbers first, openly, and let you decide what to do next.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {[
            {
              icon: <Database size={22} />,
              title: 'Where the data comes from',
              desc: 'Solar irradiance and peak sun hour figures are derived from publicly available NREL (National Renewable Energy Laboratory) datasets. Electricity rates are based on published state-level averages. Incentive figures reflect commonly available federal and state programs at time of writing and may not capture every local utility rebate.',
            },
            {
              icon: <Cpu size={22} />,
              title: 'How the numbers are calculated',
              desc: 'Solar scores, payback periods, and savings estimates are calculated using a consistent formula across every city and state — combining sun hours, local electricity rates, system cost assumptions, and the federal 30% tax credit. The methodology is the same whether you\'re a top-ranked city or not, so comparisons between cities are apples-to-apples.',
            },
            {
              icon: <Sun size={22} />,
              title: 'Blog content',
              desc: 'Articles on the SolarAtlas blog are generated with AI assistance and published on a regular schedule, drawing on the same underlying dataset and general solar industry knowledge. We disclose this openly rather than presenting it as independently reported journalism.',
            },
            {
              icon: <ShieldCheck size={22} />,
              title: 'Estimates, not guarantees',
              desc: 'Every figure on this site — savings, payback period, system cost — is an estimate based on averages and assumptions, not a quote. Your actual costs and savings depend on your roof, your specific utility, local permitting, and the installer you choose. Always get a real quote before making a decision.',
            },
          ].map(card => (
            <div key={card.title} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="text-emerald-400 mb-3">{card.icon}</div>
              <h2 className="font-bold mb-2">{card.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-3">Independence</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          SolarAtlas is not owned by, or affiliated with, any solar panel manufacturer, installer,
          or financing company. Rankings and scores are calculated the same way for every location
          and are not influenced by payment from any company. If that changes in the future — for
          example, through installer referral partnerships — we&apos;ll disclose it clearly on the
          relevant pages rather than hiding it in fine print.
        </p>

        <h2 className="text-xl font-bold mb-3">Questions or corrections</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          If you spot a data error, an outdated incentive figure, or anything that looks wrong for
          your city, we want to know. Reach us at{' '}
          <a href="mailto:hello@solaratlas.com" className="text-emerald-400 hover:text-emerald-300 transition">
            hello@solaratlas.com
          </a>.
        </p>

        <p className="text-slate-300 leading-relaxed">
          See our{' '}
          <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition">Privacy Policy</Link>{' '}
          for more on how the site operates.
        </p>
      </div>
    </div>
  )
}
