import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | SolarAtlas',
  description: 'The terms governing your use of SolarAtlas — what the site is, what it isn\'t, and the disclaimers that apply to the data and calculators.',
}

const LAST_UPDATED = 'June 21, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="text-slate-300 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">SolarAtlas</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Terms of Service</span>
        </div>

        <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <Section title="Agreement to terms">
          <p>
            By accessing or using SolarAtlas (the "Site"), you agree to these Terms of Service. If
            you don't agree with them, please don't use the Site. We may update these terms from
            time to time, and continued use of the Site after changes means you accept the updated
            terms.
          </p>
        </Section>

        <Section title="What SolarAtlas is">
          <p>
            SolarAtlas is a free, informational website providing estimated solar potential data —
            including solar scores, estimated savings, payback periods, and related figures — for US
            cities and states. It also includes an interactive calculator and a blog covering solar
            energy topics.
          </p>
          <p>
            SolarAtlas is <strong className="text-white">not</strong> a solar installer, financial
            advisor, tax advisor, or licensed contractor. We don't sell, install, or finance solar
            equipment. Nothing on this Site should be treated as professional financial, legal, or
            engineering advice.
          </p>
        </Section>

        <Section title="Estimates only — no guarantee of accuracy">
          <p>
            All figures on the Site — including solar scores, sun-hour data, electricity rate
            assumptions, incentive amounts, system costs, savings projections, and payback periods —
            are <strong className="text-white">estimates based on averages and modeling
            assumptions</strong>, not guarantees or quotes. Actual results depend on factors specific
            to your home and situation: roof angle and condition, shading, your specific utility
            company's rates and policies, the installer and equipment you choose, local permitting,
            and changes to tax law or incentive programs after publication.
          </p>
          <p>
            We make a reasonable effort to keep data accurate and current, but we don't warrant that
            any figure is error-free, complete, or up to date at the moment you view it. Always
            verify incentive eligibility with the relevant government agency and get a formal,
            written quote from a licensed installer before making any purchasing decision.
          </p>
        </Section>

        <Section title="No liability for decisions made using this Site">
          <p>
            To the fullest extent permitted by law, SolarAtlas and its operators are not liable for
            any decision you make, or any loss or damage you incur, based on information found on
            this Site — including decisions to purchase, lease, or finance a solar system, or to
            engage with any installer or company found through the Site.
          </p>
        </Section>

        <Section title="Third-party installers and links">
          <p>
            If the Site lists, links to, or in the future connects you with third-party solar
            installers or service providers, we are not responsible for their conduct, pricing,
            licensing, workmanship, or any agreement you enter into with them. Any transaction or
            contract is strictly between you and that third party.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>
            You agree not to: scrape or bulk-download the Site's data in a way that degrades service
            for other users; attempt to interfere with or disrupt the Site's infrastructure; use the
            Site to violate any applicable law; or misrepresent SolarAtlas data as your own
            proprietary research without attribution.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            The design, code, and compiled dataset presentation on SolarAtlas are the property of
            SolarAtlas. Underlying public data sources (such as NREL solar irradiance data) remain
            subject to their original public-domain or applicable licensing terms.
          </p>
        </Section>

        <Section title="Changes to the Site">
          <p>
            We may add, remove, or modify features, data, or content on the Site at any time without
            prior notice, including discontinuing the Site entirely.
          </p>
        </Section>

        <Section title="Disclaimer of warranties">
          <p>
            The Site is provided "as is" and "as available," without warranties of any kind, express
            or implied, including implied warranties of merchantability, fitness for a particular
            purpose, or non-infringement.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms can be sent to the contact details listed on our{' '}
            <Link href="/about" className="text-emerald-400 hover:text-emerald-300 transition">About page</Link>.
            For data-related concerns, see our{' '}
            <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition">Privacy Policy</Link>.
          </p>
        </Section>
      </div>
    </div>
  )
}
