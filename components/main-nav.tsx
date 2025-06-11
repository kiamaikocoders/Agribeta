import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { TreesIcon as Plant, Shield, Users, BarChart2, Leaf } from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
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
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className="hidden md:flex items-center text-sm font-medium transition-colors hover:text-agribeta-green"
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
