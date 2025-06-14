import Link from "next/link"
import Image from "next/image"
import { MobileNav } from "@/components/mobile-nav"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Sun } from "lucide-react"
import { Suspense } from "react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/favicon.ico" alt="AgriBeta Logo" width={32} height={32} className="h-10 w-auto" />
        </Link>
        <MainNav />
        <Suspense fallback={null}>
          <MobileNav />
        </Suspense>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Suspense fallback={null}>
              <ThemeToggle />
            </Suspense>
            <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "default" })}>
              <Sun className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
