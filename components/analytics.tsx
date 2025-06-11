"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // You can implement your analytics tracking here
    // For example, using Google Analytics or a custom solution
    const url = `${pathname}${searchParams ? `?${searchParams}` : ""}`
    console.log(`Page view: ${url}`)
  }, [pathname, searchParams])

  return null
}
