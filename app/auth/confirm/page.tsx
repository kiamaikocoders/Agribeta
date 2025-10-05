"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

export default function AuthConfirmPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const url = new URL(window.location.href)
        const hashParams = new URLSearchParams(url.hash.substring(1)); // Parse the hash fragment

        // Handle different auth callback types
        const type = hashParams.get('type') || url.searchParams.get('type'); // Check hash first, then search params
        const code = url.searchParams.get('code'); // Code is usually in search params
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        console.log('AuthConfirmPage Debug:')
        console.log('URL:', window.location.href)
        console.log('Search params:', url.searchParams.toString())
        console.log('Hash:', window.location.hash)
        console.log('Parsed Hash Params:', { type, accessToken, refreshToken })
        console.log('Parsed Search Params:', { code, type: url.searchParams.get('type') })
        
        if (code) {
          console.log('Found code parameter:', code)
          console.log('Type:', type)
          
          // Handle email confirmation or password reset
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('Code exchange error:', error)
            throw error
          }
          
          if (type === 'recovery') {
            // Password reset - redirect to reset password page
            toast.success('✅ Reset link verified!', {
              description: 'Please set your new password.',
            })
            router.push('/auth/reset-password/confirm')
            return
          } else {
            // Email confirmation
            toast.success('✅ Email confirmed!', {
              description: 'Your email has been verified. You can now sign in.',
            })
            router.push('/auth')
            return
          }
        }
        
        if (type === 'recovery' && accessToken && refreshToken) {
          // This path is for password reset links where tokens are directly in the hash
          console.log('Detected password recovery with tokens in hash.')
          console.log('Access token present:', !!accessToken)
          console.log('Refresh token present:', !!refreshToken)
          
          // Supabase client should automatically pick up tokens from hash and establish session
          // We just need to ensure the session is active and redirect to the password reset form
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('Error getting session after recovery:', sessionError)
            toast.error('❌ Session error', {
              description: 'There was an error processing your reset link. Please try again.',
            })
            setError('Session error after recovery.')
            router.push('/auth/reset-password')
            return
          }

          if (session) {
            console.log('Session active for recovery. Redirecting to password reset form.')
            toast.success('✅ Reset link verified!', {
              description: 'Please set your new password.',
            })
            router.push('/auth/reset-password/confirm')
            return
          } else {
            console.warn('No active session after recovery, but tokens were present in hash.')
            toast.error('❌ Authentication Failed', {
              description: 'Could not establish session from reset link. Please try again.',
            })
            setError('Authentication failed from recovery link.')
            router.push('/auth/reset-password')
            return
          }
        }
        
        // If no valid parameters, show error
        console.log('No valid authentication parameters found')
        console.log('URL:', window.location.href)
        console.log('Search params:', url.searchParams.toString())
        console.log('Hash:', window.location.hash)
        
        setError('Invalid or missing authentication parameters. Please check your email link.')
        
      } catch (err) {
        console.error('Auth callback error:', err)
        toast.error('❌ Authentication error', {
          description: err instanceof Error ? err.message : 'Authentication failed',
        })
        setError(err instanceof Error ? err.message : 'Authentication failed')
      } finally {
        setIsLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agribeta-green"></div>
              <span>Processing authentication...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">❌ Authentication Failed</CardTitle>
            <CardDescription>There was an error processing your authentication request.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => router.push('/auth')} 
              className="w-full bg-agribeta-green hover:bg-agribeta-green/90"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-agribeta-green">✅ Authentication Successful</CardTitle>
            <CardDescription>Redirecting you to your dashboard...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-agribeta-green"></div>
              <span>Redirecting...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
