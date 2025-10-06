"use client"

import { AuthForm } from '@/components/auth/auth-form'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

export default function AuthPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user just logged out
    if (typeof window !== 'undefined' && localStorage.getItem('agribeta_logout') === 'true') {
      // Clear the logout flag and don't redirect
      localStorage.removeItem('agribeta_logout')
      return
    }

    if (!loading && user && profile) {
      console.log('Auth page: User authenticated, redirecting...', { role: profile.role })
      // User is already authenticated, redirect to appropriate dashboard
      let redirectPath = '/dashboard/networks'
      if (profile.role === 'admin') {
        redirectPath = '/dashboard/admin'
      } else if (profile.role === 'farmer') {
        redirectPath = '/dashboard/farmer'
      } else if (profile.role === 'agronomist') {
        redirectPath = '/dashboard/agronomist'
      }
      
      router.replace(redirectPath)
      
      // Fallback redirect if router doesn't work
      setTimeout(() => {
        if (window.location.pathname === '/auth') {
          console.log('Router redirect failed, using window.location...')
          window.location.href = redirectPath
        }
      }, 1000)
    } else if (!loading && user && !profile) {
      // User is authenticated but profile is still loading or missing
      console.log('Auth page: User authenticated but profile missing, redirecting to profile...')
      router.replace('/profile')
      
      // Fallback redirect
      setTimeout(() => {
        if (window.location.pathname === '/auth') {
          console.log('Router redirect failed, using window.location...')
          window.location.href = '/profile'
        }
      }, 1000)
    }
  }, [user, profile, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-agribeta-green" />
      </div>
    )
  }

  // If user is authenticated, don't show auth form (redirect will happen)
  if (user && profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-agribeta-green" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/smart-agriculture-bg.png"
          alt="Smart Agriculture Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/90"></div>
      </div>
      
      <div className="relative z-10">
        <AuthForm />
      </div>
    </div>
  )
}
