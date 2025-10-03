"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
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
          if (error) throw error
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
      } finally {
        setIsExchanging(false)
      }
    }
    ensureSession()
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast({ title: 'Weak password', description: 'Use at least 6 characters', variant: 'destructive' })
      return
    }
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please re-enter', variant: 'destructive' })
      return
    }
    setIsUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast({ title: 'Password updated', description: 'You can now sign in with your new password.' })
      router.push('/auth')
    } catch (err) {
      console.error('Update password error:', err)
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update password', variant: 'destructive' })
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
