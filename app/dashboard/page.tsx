"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && profile) {
      // Redirect to role-specific dashboard
      if (profile.role === 'admin') {
        router.push('/dashboard/admin')
      } else if (profile.role === 'farmer') {
        router.push('/dashboard/farmer')
      } else if (profile.role === 'agronomist') {
        router.push('/dashboard/agronomist')
      } else {
        router.push('/dashboard/networks')
      }
    }
  }, [user, profile, loading, router])

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-agribeta-green mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
