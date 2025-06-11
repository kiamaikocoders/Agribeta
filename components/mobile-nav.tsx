"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TreesIcon as Plant, Shield, Users, BarChart2, Menu, Leaf } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Leaf className="mr-2 h-4 w-4" />,
    },
    {
      href: "/diagnosis",
      label: "Disease Diagnosis",
      icon: <Plant className="mr-2 h-4 w-4" />,
    },
    {
      href: "/fcm-management",
      label: "FCM Management",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
    {
      href: "/community",
      label: "Community",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="flex items-center space-x-2 mb-4" onClick={() => setOpen(false)}>
          <Image src="/agribeta-logo.jpeg" alt="AgriBeta Logo" width={120} height={40} className="h-10 w-auto" />
        </Link>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <div className="flex flex-col space-y-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center py-2 text-base font-medium transition-colors hover:text-agribeta-green",
                )}
                onClick={() => setOpen(false)}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
