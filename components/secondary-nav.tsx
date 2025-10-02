"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Calendar, MessageCircle, ShoppingCart } from "lucide-react"

export function SecondaryNav() {
  const pathname = usePathname()

  const secondaryItems = [
    {
      title: "Programs",
      href: "/programs",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    },
    {
      title: "Events",
      href: "/events",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: <MessageCircle className="mr-2 h-4 w-4" />,
    },
    {
      title: "Shop",
      href: "/shop",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
    }
  ]

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <nav className="flex items-center space-x-6">
          {secondaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
