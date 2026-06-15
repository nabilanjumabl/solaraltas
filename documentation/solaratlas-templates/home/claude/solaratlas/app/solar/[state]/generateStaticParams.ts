// app/solar/[state]/generateStaticParams.ts
// Re-export for use in page.tsx — Next.js 14 App Router pattern

import { getAllStateSlugs } from '@/lib/data'

export function generateStaticParams() {
  return getAllStateSlugs()
}
