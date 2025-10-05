"use client"

import { useAuth, UserRole } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ['farmer', 'agronomist', 'admin'],
  redirectTo = '/auth'
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  // Force redirect if user is not authenticated and we're not loading
  useEffect(() => {
    if (!loading && !user && typeof window !== 'undefined') {
      console.log('ProtectedRoute: Force redirecting to', redirectTo)
      window.location.href = redirectTo
    }
  }, [loading, user, redirectTo])

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('ProtectedRoute: No user, redirecting to', redirectTo)
        router.replace(redirectTo)
        return
      }

      if (profile && !allowedRoles.includes(profile.role)) {
        console.log('ProtectedRoute: User role not allowed, redirecting to /unauthorized')
        router.replace('/unauthorized')
        return
      }
    }
  }, [user, profile, loading, router, allowedRoles, redirectTo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-agribeta-green" />
      </div>
    )
  }

  if (!user || (profile && !allowedRoles.includes(profile.role))) {
    // Show loading while redirecting
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-agribeta-green mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
