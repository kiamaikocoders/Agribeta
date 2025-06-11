'use client'

import { usePathname } from 'next/navigation'
import { Analytics } from './analytics'

export function AnalyticsWrapper() {
  const pathname = usePathname()
  // Only render Analytics if NOT on the 404 page
  if (pathname === '/404') {
    return null
  }
  return <Analytics />
} 