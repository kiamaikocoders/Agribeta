"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { TreesIcon as Plant, Shield, Users, BarChart2, Leaf, Target, LineChart, Calendar, MessageCircle, BookOpen } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function MainNav() {
  const pathname = usePathname()
  const { user, profile } = useAuth()

  if (!user) return null

  // Core navigation items - always visible (max 5)
  const coreNavigationItems = [
    {
      title: "Home",
      href: "/dashboard/networks",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
        {
          title: "Network",
          href: "/agronomists",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    }
  ]


  // Agronomist-specific navigation items (moved to profile dropdown)
  const agronomistItems = [
    {
      title: "Earnings",
      href: "/earnings",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
    {
      title: "Schedule",
      href: "/schedule",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      title: "Consultations",
      href: "/consultations",
      icon: <MessageCircle className="mr-2 h-4 w-4" />,
    },
    {
      title: "Templates",
      href: "/templates",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    },
    {
      title: "Knowledge Base",
      href: "/knowledge-base",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    }
  ]

  // Enterprise services available
  const enterpriseServices = [
    {
      title: "AgriBeta Pinpoint",
      href: "/pinpoint",
      description: "AI-powered disease diagnosis",
      icon: <Leaf className="h-4 w-4" />,
      isPremium: true
    },
    {
      title: "AgriBeta Predict",
      href: "/predict",
      description: "Predictive analytics for farming",
      icon: <Target className="h-4 w-4" />,
      isPremium: true
    },
    {
      title: "AgriBeta Protect",
      href: "/fcm-management",
      description: "FCM compliance monitoring",
      icon: <Shield className="h-4 w-4" />,
      isPremium: true
    }
  ]

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Core Navigation Items */}
          {coreNavigationItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    (pathname === item.href || (item.href === '/profile' && pathname?.startsWith('/profile'))) && "bg-accent"
                  )}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.title}</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}



          {/* Enterprise Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-10">
              <Plant className="mr-2 h-4 w-4" />
              Enterprise
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <div className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/enterprise"
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    >
                      <Plant className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        AgriBeta Enterprise
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Access all premium agricultural management tools
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
                {enterpriseServices.map((service) => (
                  <div key={service.href} className="relative">
                    <NavigationMenuLink asChild>
                      <Link
                        href={service.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          {service.icon}
                          <div className="text-sm font-medium leading-none">{service.title}</div>
                          {service.isPremium && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {service.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Admin Menu (if admin) */}
          {profile?.role === 'admin' && (
            <NavigationMenuItem>
              <Link href="/dashboard/admin" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    pathname?.startsWith("/dashboard/admin") && "bg-accent"
                  )}
                >
                  <LineChart className="mr-2 h-4 w-4" />
                  Admin
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}