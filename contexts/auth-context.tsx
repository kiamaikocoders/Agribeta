"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, getSiteUrl } from '@/lib/supabaseClient'

export type UserRole = 'farmer' | 'agronomist' | 'admin'

export interface UserProfile {
  id: string
  first_name?: string
  last_name?: string
  email: string
  role: UserRole
  avatar_url?: string
  bio?: string
  phone?: string
  country?: string
  industry?: string
  facebook_url?: string
  date_of_birth?: string
  farm_name?: string
  company?: string
  is_verified: boolean
  subscription_tier: 'free' | 'basic' | 'premium'
  ai_predictions_used: number
  ai_predictions_limit: number
  total_diagnoses: number
  created_at: string
}

export interface FarmerProfile {
  id: string
  farm_name?: string
  farm_size?: number
  farm_location?: string
  primary_crop?: string
  secondary_crops?: string[]
  planting_season?: string
  irrigation_type?: string
  pest_management_method?: string
  soil_type?: string
  successful_treatments: number
  total_spent: number
}

export interface AgronomistProfile {
  id: string
  company?: string
  title?: string
  years_experience?: number
  specializations?: string[]
  certifications?: string[]
  hourly_rate?: number
  consultation_fee?: number
  availability_schedule?: any
  timezone?: string
  total_consultations: number
  average_rating?: number
  response_time_minutes?: number
  success_rate?: number
  is_verified: boolean
  total_earnings: number
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  farmerProfile: FarmerProfile | null
  agronomistProfile: AgronomistProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
  fetchUserProfile: (userId: string) => Promise<void>
  clearAuthState: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Allowlisted admin emails to auto-promote
  const ADMIN_EMAILS = ['savagetheelit@gmail.com']
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null)
  const [agronomistProfile, setAgronomistProfile] = useState<AgronomistProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    // Check if user just logged out
    if (typeof window !== 'undefined' && localStorage.getItem('agribeta_logout') === 'true') {
      localStorage.removeItem('agribeta_logout')
      setLoading(false)
      return // Don't restore session if user just logged out
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user && !isLoggingOut) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state change:', event, session?.user?.id)
      }
      
      // Don't restore session if user is logging out
      if (isLoggingOut) {
        return
      }
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_OUT') {
        // Explicitly clear all state on sign out
        setProfile(null)
        setFarmerProfile(null)
        setAgronomistProfile(null)
        setLoading(false)
      } else if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
        setFarmerProfile(null)
        setAgronomistProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [isLoggingOut])

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch main profile (should exist due to trigger)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        // Only log non-network errors to avoid spam
        if (!profileError.message?.includes('NetworkError')) {
          console.error('Error fetching profile:', profileError)
        }
        setLoading(false)
        return
      }

      setProfile(profileData)

      // Fetch role-specific profile if it exists
      if (profileData.role === 'farmer') {
        const { data: farmerData, error: farmerError } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (farmerError) {
          // Only log non-network errors
          if (!farmerError.message?.includes('NetworkError')) {
            console.warn('Farmer profile not found or access denied:', farmerError)
          }
          // Don't block the auth flow if farmer profile is missing
          setFarmerProfile(null)
        } else {
          setFarmerProfile(farmerData)
        }
      } else if (profileData.role === 'agronomist') {
        const { data: agronomistData, error: agronomistError } = await supabase
          .from('agronomist_profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (agronomistError) {
          // Only log non-network errors
          if (!agronomistError.message?.includes('NetworkError')) {
            console.warn('Agronomist profile not found or access denied:', agronomistError)
          }
          // Don't block the auth flow if agronomist profile is missing
          setAgronomistProfile(null)
        } else {
          setAgronomistProfile(agronomistData)
        }
      }

      // Auto-promote allowlisted emails to admin if needed
      if (profileData?.email && ADMIN_EMAILS.includes(profileData.email) && profileData.role !== 'admin') {
        await supabase
          .from('profiles')
          .update({ role: 'admin', is_verified: true })
          .eq('id', userId)
        const { data: refreshed } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        if (refreshed) setProfile(refreshed)
      }
    } catch (error) {
      console.error('Error fetching user profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, _userData: any) => {
    try {
      // Use the utility function to get the correct site URL
      const siteUrl = getSiteUrl()
      const emailRedirectTo = `${siteUrl}profile/complete`

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: emailRedirectTo ? { emailRedirectTo } : undefined,
      })

      if (authError) return { error: authError }

      if (authData.user) {
        console.log('User created successfully:', authData.user.id)
        // Do NOT attempt profile writes now; user may not have a session yet due to email verification.
        // Profile completion will be handled after first sign-in from the client using a secure API route.
        if (ADMIN_EMAILS.includes(email)) {
          await supabase
            .from('profiles')
            .update({ role: 'admin', is_verified: true })
            .eq('id', authData.user.id)
        }
      }

      return { error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    try {
      setIsLoggingOut(true)
      
      // Clear all auth state first
      setUser(null)
      setProfile(null)
      setFarmerProfile(null)
      setAgronomistProfile(null)
      setSession(null)

      // Sign out from Supabase
      await supabase.auth.signOut()

      // Clear any cached data in localStorage/sessionStorage
      if (typeof window !== 'undefined') {
        // Set a logout flag to prevent session restoration
        localStorage.setItem('agribeta_logout', 'true')
        
        // Clear ALL Supabase-related data more aggressively
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
            localStorage.removeItem(key)
          }
        })

        // Clear session storage completely
        sessionStorage.clear()

        // Clear any other auth-related data
        localStorage.removeItem('supabase.auth.token')
        localStorage.removeItem('supabase.auth.refresh_token')
        localStorage.removeItem('supabase.auth.access_token')

        // Force a hard refresh to clear any cached auth state
        // This prevents Supabase from restoring the session
        window.location.replace('/')
      }
    } catch (error) {
      console.error('Error during sign out:', error)
      // Even if there's an error, clear the local state and force redirect
      setUser(null)
      setProfile(null)
      setFarmerProfile(null)
      setAgronomistProfile(null)
      setSession(null)
      
      if (typeof window !== 'undefined') {
        window.location.replace('/')
      }
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }

    return { error }
  }

  // Function to complete profile setup after first sign in
  const completeProfileSetup = async (userData: any, userId?: string) => {
    const targetUserId = userId || user?.id
    if (!targetUserId) return { error: 'No user ID provided' }

    try {
      // Update the basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: userData.role,
          first_name: userData.first_name,
          last_name: userData.last_name,
          bio: userData.bio,
          farm_name: userData.farm_name,
          company: userData.company,
          industry: userData.industry,
          country: userData.country,
          phone: userData.phone,
          linkedin_url: userData.linkedin_url,
        })
        .eq('id', targetUserId)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        return { error: profileError }
      }

      // Create role-specific profile
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        // Cannot create role-specific profile without a user session
        return { error: 'No session available for secure profile creation' }
      }

      if (userData.role === 'farmer') {
        const res = await fetch('/api/profiles/farmer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: targetUserId,
            farm_size: userData.farm_size,
            farm_location: userData.farm_location,
            primary_crop: userData.primary_crop,
            secondary_crops: userData.secondary_crops,
            planting_season: userData.planting_season,
            irrigation_type: userData.irrigation_type,
            pest_management_method: userData.pest_management_method,
            soil_type: userData.soil_type,
            farm_name: userData.farm_name,
          }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          console.error('Error creating farmer profile (api):', err)
          return { error: err?.error || 'Failed to create farmer profile' }
        }
      } else if (userData.role === 'agronomist') {
        const res = await fetch('/api/profiles/agronomist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: targetUserId,
            title: userData.title,
            years_experience: userData.years_experience,
            specializations: userData.specializations,
            certifications: userData.certifications,
            hourly_rate: userData.hourly_rate,
            consultation_fee: userData.consultation_fee,
            timezone: userData.timezone,
            company: userData.company,
          }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          console.error('Error creating agronomist profile (api):', err)
          return { error: err?.error || 'Failed to create agronomist profile' }
        }
      }

      // Refresh the profile data if user is logged in
      if (user) {
        await fetchUserProfile(user.id)
      }

      return { error: null }
    } catch (error) {
      console.error('Error completing profile setup:', error)
      return { error }
    }
  }

  // Function to force clear auth state (useful for debugging or manual logout)
  const clearAuthState = () => {
    setUser(null)
    setProfile(null)
    setFarmerProfile(null)
    setAgronomistProfile(null)
    setSession(null)
    setLoading(false)

    if (typeof window !== 'undefined') {
      // Clear ALL Supabase-related data more aggressively
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
          localStorage.removeItem(key)
        }
      })
      
      // Clear session storage completely
      sessionStorage.clear()
      
      // Clear any other auth-related data
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('supabase.auth.refresh_token')
      localStorage.removeItem('supabase.auth.access_token')

      // Force a hard refresh to clear any cached auth state
      window.location.replace('/')
    }
  }

  const value = {
    user,
    profile,
    farmerProfile,
    agronomistProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    completeProfileSetup,
    fetchUserProfile,
    clearAuthState,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
