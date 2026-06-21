import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | SolarAtlas',
  description: 'How SolarAtlas handles data — what we collect, what we don\'t, and how to contact us about privacy.',
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">SolarAtlas</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Privacy Policy</span>
        </div>

        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <Section title="The short version">
          <p>
            SolarAtlas does not require an account, does not sell personal data, and does not run
            third-party advertising. The site works by serving static pages of solar data — you can
            use the calculator and browse every city or state page without giving us any information
            about yourself.
          </p>
        </Section>

        <Section title="What we collect today">
          <p>
            As of this writing, SolarAtlas does not have user accounts, login forms, or any feature
            that asks you to submit personal contact information. The search bar runs entirely in
            your browser against a local dataset and does not send your search queries to a server.
          </p>
          <p>
            Like virtually any website, our hosting provider (Vercel) and any analytics tooling we
            enable may automatically log standard technical information — things like your IP
            address, browser type, device type, and which pages you visited — for the purposes of
            keeping the site running, diagnosing errors, and understanding aggregate traffic. This is
            standard server-log behavior, not something we actively collect or review on an
            individual basis.
          </p>
        </Section>

        <Section title="What we may collect in the future">
          <p>
            We plan to introduce features such as installer quote request forms and an optional
            email newsletter signup. If and when those launch, this policy will be updated to
            describe exactly what's collected (for example: name, email, city, and electricity bill
            range for quote requests) and exactly who it's shared with (for example: a small number
            of vetted solar installers you've explicitly asked to be contacted by). We won't quietly
            start collecting new categories of personal data without updating this page first.
          </p>
        </Section>

        <Section title="Cookies and analytics">
          <p>
            We may use privacy-respecting analytics tools to understand which pages are useful and
            which aren't — this helps us prioritize which cities and states to improve. Any such
            tooling is configured to avoid collecting personally identifiable information where
            possible. We do not use cookies for cross-site advertising tracking.
          </p>
        </Section>

        <Section title="Third-party links">
          <p>
            Some pages link out to third parties — for example, solar installer websites, or
            government resources on tax incentives. Once you click through to a third-party site,
            that site's own privacy policy applies, not this one. We encourage you to review the
            privacy practices of any site you visit from a SolarAtlas link.
          </p>
        </Section>

        <Section title="Children's privacy">
          <p>
            SolarAtlas is intended for general audiences researching home solar decisions and is not
            directed at children under 13. We do not knowingly collect personal information from
            children.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            If we do collect personal information from you in the future (for example, through a
            quote request form), you can ask us at any time what data we hold about you, ask us to
            correct it, or ask us to delete it. Depending on your location, you may have additional
            rights under laws like the GDPR or CCPA. Contact us using the details below to make a
            request.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If this policy changes in a meaningful way — particularly around what data we collect —
            we'll update the "Last updated" date at the top of this page. We recommend checking back
            periodically if you have ongoing privacy concerns.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy or a request related to your data can be sent to the contact
            details listed on our{' '}
            <Link href="/about" className="text-emerald-400 hover:text-emerald-300 transition">About page</Link>.
          </p>
        </Section>
      </div>
    </div>
  )
}
