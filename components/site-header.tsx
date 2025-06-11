import Link from "next/link"
import Image from "next/image"
import { MobileNav } from "@/components/mobile-nav"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Sun } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/placeholder-logo.png" alt="AgriBeta Logo" width={120} height={40} className="h-10 w-auto" />
        </Link>
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
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
