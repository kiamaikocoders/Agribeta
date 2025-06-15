'use client';

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"
import { TreesIcon as Plant, Shield, Users, BarChart2, Leaf, ShoppingCart } from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Leaf className="mr-2 h-4 w-4" />,
    },
    {
      href: "/diagnosis",
      label: "Agribeta Pinpoint",
      icon: <Plant className="mr-2 h-4 w-4" />,
    },
    {
      href: "/fcm-management",
      label: "Agribeta Protect",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
    {
      href: "/community",
      label: "Agribeta Network",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
    {
      href: "/shop",
      label: "Shop",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-6 lg:space-x-8", className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "hidden md:flex items-center text-sm font-medium transition-colors px-3 py-2 -my-2 rounded-md",
            pathname === route.href
              ? "bg-agribeta-green text-white"
              : "bg-white text-gray-700 hover:bg-agribeta-orange hover:text-white"
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
