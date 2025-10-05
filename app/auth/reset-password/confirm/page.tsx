"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

function parseHashParams(hash: string): Record<string, string> {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const result: Record<string, string> = {}
  params.forEach((value, key) => { result[key] = value })
  return result
}

export default function ResetPasswordConfirmPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isExchanging, setIsExchanging] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const ensureSession = async () => {
      try {
        // Try to exchange `code` param for a session (email recovery flow)
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('Code exchange error:', error)
            toast({
              title: '❌ Invalid reset link',
              description: 'This password reset link is invalid or expired. Please request a new one.',
              variant: 'destructive',
              duration: 5000,
            })
            router.push('/auth/reset-password')
            return
          }
          toast({
            title: '✅ Link verified!',
            description: 'Please set your new password below.',
            duration: 3000,
          })
          setIsExchanging(false)
          return
        }
        // Fallback: handle access_token/refresh_token in URL hash
        const hashParams = parseHashParams(window.location.hash)
        const access_token = hashParams['access_token']
        const refresh_token = hashParams['refresh_token']
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) throw error
        }
      } catch (err) {
        console.error('Session establishment error:', err)
        toast({
          title: '❌ Session error',
          description: 'There was an error processing your reset link. Please try again.',
          variant: 'destructive',
          duration: 5000,
        })
        router.push('/auth/reset-password')
      } finally {
        setIsExchanging(false)
      }
    }
    ensureSession()
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('❌ Weak password', {
        description: 'Password must be at least 6 characters long',
      })
      return
    }
    if (password !== confirmPassword) {
      toast.error('❌ Passwords do not match', {
        description: 'Please make sure both password fields match',
      })
      return
    }
    setIsUpdating(true)
    console.log('Starting password update...')
    
    // Check current session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Current session before update:', { session: !!session, sessionError })
    
    if (!session) {
      console.error('No active session found!')
      toast.error('❌ Session expired', {
        description: 'Your session has expired. Please request a new password reset link.',
      })
      setIsUpdating(false)
      router.push('/auth/reset-password')
      return
    }
    
    try {
      console.log('Calling API route for password update...')
      
      // Use API route instead of direct Supabase call
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          accessToken: session.access_token
        }),
      })

      const result = await response.json()
      console.log('API response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password')
      }
      
      console.log('Password updated successfully!')
      toast.success('✅ Password updated successfully!', {
        description: 'Your password has been changed. You can now sign in with your new password.',
      })
      
      console.log('Redirecting to /auth...')
      
      // Use setTimeout to ensure the toast shows before redirect
      setTimeout(() => {
        console.log('Attempting redirect to /auth...')
        router.push('/auth')
        
        // Fallback redirect if router.push doesn't work
        setTimeout(() => {
          console.log('Fallback redirect using window.location...')
          window.location.href = '/auth'
        }, 2000)
      }, 1500)
      
    } catch (err) {
      console.error('Update password error:', err)
      toast.error('❌ Failed to update password', {
        description: err instanceof Error ? err.message : 'There was an error updating your password. Please try again.',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-agribeta-green">Set New Password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {isExchanging ? (
            <div>Preparing your secure session...</div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button type="submit" disabled={isUpdating} className="w-full bg-agribeta-green hover:bg-agribeta-green/90">
                {isUpdating ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

