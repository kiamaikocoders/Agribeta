import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DiagnosisHistoryProvider } from "@/contexts/diagnosis-history-context"
import { cn } from "@/lib/utils"
import "@/app/globals.css"
import { Suspense } from "react"

export const metadata = {
  title: "AgriBeta - Agricultural Management Platform",
  description:
    "Comprehensive agricultural management platform for avocado disease diagnosis and FCM management in roses",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Suspense fallback={null}>
              <DiagnosisHistoryProvider>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <Suspense>
                    <div className="flex-1">{children}</div>
                  </Suspense>
                  <SiteFooter />
                </div>
                <Suspense fallback={null}>
                  <Toaster />
                </Suspense>
                <Suspense fallback={null}>
                  <Analytics />
                </Suspense>
              </DiagnosisHistoryProvider>
            </Suspense>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
