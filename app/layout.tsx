import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { AnalyticsWrapper } from "@/components/analytics-wrapper"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DiagnosisHistoryProvider } from "@/contexts/diagnosis-history-context"
import { AuthProvider } from "@/contexts/auth-context"
import { PresenceProvider } from "@/contexts/presence-context"
import { cn } from "@/lib/utils"
import "@/app/globals.css"
import { Suspense } from "react"

export const metadata = {
  title: "AgriBeta - Agricultural Management Platform",
  description:
    "Comprehensive agricultural management platform for Agribeta Pinpoint and Agribeta Protect in roses",
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
            <AuthProvider>
          <PresenceProvider>
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
            <SonnerToaster position="top-right" />
                </Suspense>
                <Suspense fallback={null}>
                  <AnalyticsWrapper />
                </Suspense>
          </DiagnosisHistoryProvider>
          </PresenceProvider>
            </AuthProvider>
            </Suspense>
        </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
