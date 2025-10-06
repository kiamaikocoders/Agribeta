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
  const { user, profile, loading, fetchUserProfile } = useProfileCompleteAuth()
  const router = useRouter()
  const [role, setRole] = useState<'farmer' | 'agronomist'>('farmer')
  const [saving, setSaving] = useState(false)

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

  const handleContinue = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id)

      if (error) throw error

      await fetchUserProfile(user.id)
      toast({ title: 'Profile initialized', description: 'Let’s finish setting up your profile.' })
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
          <CardTitle className="text-agribeta-green">Welcome! Choose your role</CardTitle>
          <CardDescription>After confirming your email, select your role to start.</CardDescription>
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
            <Button onClick={handleContinue} disabled={saving} className="w-full bg-agribeta-green hover:bg-agribeta-green/90">
              {saving ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Local hook to surface fetchUserProfile from context via a thin wrapper
function useProfileCompleteAuth() {
  const auth = useAuth() as ReturnType<typeof useAuth> & { fetchUserProfile?: (id: string) => Promise<void> }
  // Using internal method via cast for this page
  const fetchUserProfile = (auth as any).fetchUserProfile || (async () => {})
  return { ...auth, fetchUserProfile }
}



