"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabaseClient'

export default function ProfileCompletePage() {
  const { user, profile, loading, fetchUserProfile, completeProfileSetup } = useProfileCompleteAuth()
  const router = useRouter()
  const [role, setRole] = useState<'farmer' | 'agronomist'>('farmer')
  const [saving, setSaving] = useState(false)
  const [signupData, setSignupData] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile?.role === 'farmer' || profile?.role === 'agronomist') {
      // Already has a role, go to profile editor
      router.replace('/profile')
    }
  }, [profile, router])

  // Load signup data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('agribeta_signup_data')
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          setSignupData(data)
          setRole(data.role || 'farmer')
        } catch (error) {
          console.error('Error parsing signup data:', error)
        }
      }
    }
  }, [])

  const handleContinue = async () => {
    if (!user) return
    setSaving(true)
    try {
      // Use the completeProfileSetup function to save all signup data
      if (signupData && completeProfileSetup) {
        const { error } = await completeProfileSetup({
          ...signupData,
          role
        }, user.id)
        
        if (error) throw error
        
        // Clear the stored signup data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('agribeta_signup_data')
        }
      } else {
        // Fallback to just updating the role if no signup data
        const { error } = await supabase
          .from('profiles')
          .update({ role })
          .eq('id', user.id)

        if (error) throw error
      }

      await fetchUserProfile(user.id)
      toast({ title: 'Profile initialized', description: 'Let's finish setting up your profile.' })
      router.push('/profile')
    } catch (err) {
      console.error('Error initializing profile:', err)
      toast({ title: 'Error', description: 'Failed to initialize profile', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-agribeta-green">Welcome! Complete your profile</CardTitle>
          <CardDescription>
            {signupData 
              ? `We'll save your ${signupData.role} profile information and get you started.`
              : 'After confirming your email, select your role to start.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Role</Label>
              <RadioGroup value={role} onValueChange={(val) => setRole(val as 'farmer' | 'agronomist')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="farmer" id="farmer" />
                  <Label htmlFor="farmer">Farmer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="agronomist" id="agronomist" />
                  <Label htmlFor="agronomist">Agronomist</Label>
                </div>
              </RadioGroup>
            </div>
            {signupData && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p className="font-medium">Your profile data will include:</p>
                <ul className="mt-1 space-y-1">
                  {signupData.first_name && <li>• Name: {signupData.first_name} {signupData.last_name}</li>}
                  {signupData.bio && <li>• Bio: {signupData.bio.substring(0, 50)}...</li>}
                  {signupData.farm_name && <li>• Farm: {signupData.farm_name}</li>}
                  {signupData.company && <li>• Company: {signupData.company}</li>}
                  {signupData.industry && <li>• Industry: {signupData.industry}</li>}
                </ul>
              </div>
            )}
            <Button onClick={handleContinue} disabled={saving} className="w-full bg-agribeta-green hover:bg-agribeta-green/90">
              {saving ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Local hook to surface fetchUserProfile and completeProfileSetup from context via a thin wrapper
function useProfileCompleteAuth() {
  const auth = useAuth() as ReturnType<typeof useAuth> & { 
    fetchUserProfile?: (id: string) => Promise<void>
    completeProfileSetup?: (userData: any, userId?: string) => Promise<{ error: any }>
  }
  // Using internal methods via cast for this page
  const fetchUserProfile = (auth as any).fetchUserProfile || (async () => {})
  const completeProfileSetup = (auth as any).completeProfileSetup || (async () => ({ error: null }))
  return { ...auth, fetchUserProfile, completeProfileSetup }
}



