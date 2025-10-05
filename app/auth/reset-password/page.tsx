"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase, getSiteUrl } from '@/lib/supabaseClient'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Use the utility function to get the correct site URL
      const siteUrl = getSiteUrl()
      const redirectTo = `${siteUrl}auth/confirm`
      
      console.log('=== DEBUG INFO ===')
      console.log('Email:', email)
      console.log('Site URL:', siteUrl)
      console.log('Redirect URL:', redirectTo)
      console.log('NODE_ENV:', process.env.NODE_ENV)
      console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
      console.log('==================')
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) throw error
      setEmailSent(true)
      toast.success('✅ Reset link sent!', {
        description: `Password reset email has been sent to ${email}. Please check your inbox and spam folder.`,
      })
    } catch (err) {
      console.error('Reset password error:', err)
      toast.error('❌ Failed to send reset email', {
        description: err instanceof Error ? err.message : 'Please check your email address and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-agribeta-green">Reset Password</CardTitle>
          <CardDescription>
            {emailSent 
              ? `Reset link sent to ${email}. Check your inbox and spam folder.`
              : 'Enter your email to receive a reset link.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <div className="space-y-4 text-center">
              <div className="text-green-600 text-sm">
                ✅ Reset link has been sent to your email address.
              </div>
              <div className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or request a new link.
              </div>
              <Button 
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                }} 
                variant="outline" 
                className="w-full"
              >
                Send Another Link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-agribeta-green hover:bg-agribeta-green/90">
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


