"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
        setFarmerProfile(null)
        setAgronomistProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch main profile (should exist due to trigger)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        setLoading(false)
        return
      }

      setProfile(profileData)

      // Fetch role-specific profile if it exists
      if (profileData.role === 'farmer') {
        const { data: farmerData } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        setFarmerProfile(farmerData)
      } else if (profileData.role === 'agronomist') {
        const { data: agronomistData } = await supabase
          .from('agronomist_profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        setAgronomistProfile(agronomistData)
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

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) return { error: authError }

      if (authData.user) {
        console.log('User created successfully:', authData.user.id)
        
        // Immediately complete profile setup with the provided data
        const profileResult = await completeProfileSetup(userData, authData.user.id)
        if (profileResult.error) {
          console.error('Error completing profile setup:', profileResult.error)
          // Don't fail the signup, but log the error
        }

        // If the email is allowlisted, promote to admin
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
    await supabase.auth.signOut()
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
      if (userData.role === 'farmer') {
        const { error: farmerError } = await supabase
          .from('farmer_profiles')
          .insert([{
            id: targetUserId,
            farm_size: userData.farm_size,
            farm_location: userData.farm_location,
            primary_crop: userData.primary_crop,
            secondary_crops: userData.secondary_crops,
            planting_season: userData.planting_season,
            irrigation_type: userData.irrigation_type,
            pest_management_method: userData.pest_management_method,
            soil_type: userData.soil_type,
          }])
        
        if (farmerError) {
          console.error('Error creating farmer profile:', farmerError)
        }
      } else if (userData.role === 'agronomist') {
        const { error: agronomistError } = await supabase
          .from('agronomist_profiles')
          .insert([{
            id: targetUserId,
            title: userData.title,
            years_experience: userData.years_experience,
            specializations: userData.specializations,
            certifications: userData.certifications,
            hourly_rate: userData.hourly_rate,
            consultation_fee: userData.consultation_fee,
            timezone: userData.timezone,
          }])
        
        if (agronomistError) {
          console.error('Error creating agronomist profile:', agronomistError)
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
