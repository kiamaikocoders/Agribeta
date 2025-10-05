"use client"

import Link from "next/link"
import Image from "next/image"
import { MobileNav } from "@/components/mobile-nav"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { Bell, User, Settings, LogOut, BarChart2, Calendar, MessageCircle, BookOpen } from "lucide-react"
import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { NotificationsProvider } from "@/contexts/notifications-context"
import { NotificationsBell } from "@/components/notifications/notifications-bell"

export function SiteHeader() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      // The signOut function now handles the redirect with window.location.replace('/')
      // No need for additional navigation here
    } catch (error) {
      console.error('Error signing out:', error)
      // Force redirect even if there's an error
      if (typeof window !== 'undefined') {
        window.location.replace('/')
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center relative">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image 
            src="/agribeta-logo.png" 
            alt="AgriBeta Logo" 
            width={200} 
            height={70} 
            className="h-16 w-auto" 
            priority 
          />
        </Link>
        
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-agribeta-green"></div>
          </div>
        ) : user ? (
          <>
        <MainNav />
        <Suspense fallback={null}>
        <MobileNav />
        </Suspense>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Suspense fallback={null}>
            <ThemeToggle />
            </Suspense>
                
                {/* Notifications */}
                <NotificationsProvider>
                  <NotificationsBell />
                </NotificationsProvider>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-auto rounded-full px-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || "User"} />
                          <AvatarFallback>
                            {profile?.first_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium hidden sm:block">
                          {profile?.first_name && profile?.last_name 
                            ? `${profile.first_name} ${profile.last_name}`
                            : profile?.first_name || profile?.email || 'User'
                          }
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.first_name && profile?.last_name 
                            ? `${profile.first_name} ${profile.last_name}`
                            : profile?.first_name || profile?.email || 'User'
                          }
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {profile?.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            profile?.role === 'farmer' ? 'bg-green-100 text-green-800' :
                            profile?.role === 'agronomist' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                          </span>
                          {profile?.is_verified && (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={profile?.role === 'agronomist' ? '/dashboard/agronomist' : profile?.role === 'farmer' ? '/dashboard/farmer' : '/dashboard'} className="flex items-center">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {/* Agronomist-specific items */}
                    {profile?.role === 'agronomist' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                          Agronomist Dashboard
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href="/earnings" className="flex items-center">
                            <BarChart2 className="mr-2 h-4 w-4" />
                            <span>Earnings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/schedule" className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Schedule</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/consultations" className="flex items-center">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            <span>Consultations</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/templates" className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>Templates</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/knowledge-base" className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>Knowledge Base</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Suspense fallback={null}>
                <ThemeToggle />
              </Suspense>
              <Link href="/auth" className={buttonVariants({ variant: "ghost", size: "default" })}>
                Sign In
              </Link>
              <Link href="/auth" className={buttonVariants({ variant: "default", size: "default" })}>
                Sign Up
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}