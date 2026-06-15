// app/solar/[state]/[city]/generateStaticParams.ts

import { getAllCitySlugs } from '@/lib/data'

export function generateStaticParams() {
  return getAllCitySlugs()
}
