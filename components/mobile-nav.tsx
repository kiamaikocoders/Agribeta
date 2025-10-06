"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TreesIcon as Plant, Shield, Users, BarChart2, Menu, Leaf, Sun, Moon, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const { user, profile, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const routes = [
    {
      href: "/dashboard/networks",
      label: "Home",
      icon: <Leaf className="mr-2 h-4 w-4" />,
    },
    {
      href: "/agronomists",
      label: "AgriBeta Network",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/diagnosis",
      label: "AgriBeta Pinpoint",
      icon: <Plant className="mr-2 h-4 w-4" />,
    },
    {
      href: "/fcm-management",
      label: "AgriBeta Protect",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
  ]

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
  }

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
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Main navigation menu for AgriBeta platform
        </SheetDescription>
        <Link href="/" className="flex items-center space-x-2 mb-4" onClick={() => setOpen(false)}>
          <Image 
            src="/agribeta-logo.png" 
            alt="AgriBeta Logo" 
            width={180} 
            height={60} 
            className="h-16 w-auto" 
            priority 
          />
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
            
            <Separator className="my-4" />
            
            {/* Admin Section - Only show if user is admin */}
            {profile?.role === 'admin' && (
              <>
                <Link
                  href="/dashboard/admin"
                  className="flex items-center py-2 text-base font-medium transition-colors hover:text-agribeta-green"
                  onClick={() => setOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
                <Separator className="my-4" />
              </>
            )}
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-base font-medium">Theme</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-8 w-8 p-0"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            {/* Logout */}
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex items-center py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
