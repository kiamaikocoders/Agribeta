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

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (profile && !allowedRoles.includes(profile.role)) {
        router.push('/unauthorized')
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
    return null
  }

  return <>{children}</>
}
