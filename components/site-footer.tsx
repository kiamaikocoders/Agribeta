import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/agribeta-logo.png" 
              alt="AgriBeta Logo" 
              width={100} 
              height={35} 
              className="h-10 w-auto" 
              priority 
            />
          </Link>
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; {new Date().getFullYear()} AgriBeta. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/terms" className="text-sm underline underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm underline underline-offset-4">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
