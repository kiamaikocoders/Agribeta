"use client"

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

export function AuthDebug() {
  const { user, profile, session, loading, clearAuthState, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClearAuth = () => {
    clearAuthState()
    console.log('Auth state cleared manually')
  }

  const handleForceLogout = async () => {
    try {
      await signOut()
      console.log('Force logout completed')
    } catch (error) {
      console.error('Force logout error:', error)
    }
  }

  const checkLocalStorage = () => {
    if (typeof window === 'undefined') return []
    
    const keys = Object.keys(localStorage)
    return keys.filter(key => key.includes('auth') || key.startsWith('sb-'))
  }

  if (process.env.NODE_ENV === 'production' || !mounted) {
    return null // Don't show in production or before mounting
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background border-2 border-orange-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-orange-600">Auth Debug (Dev Only)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>Loading:</strong> <Badge variant={loading ? "destructive" : "secondary"}>{loading ? "Yes" : "No"}</Badge>
        </div>
        <div>
          <strong>User:</strong> {user ? `${user.email} (${user.id.slice(0, 8)}...)` : "None"}
        </div>
        <div>
          <strong>Profile:</strong> {profile ? `${profile.role} - ${profile.first_name} ${profile.last_name}` : "None"}
        </div>
        <div>
          <strong>Session:</strong> {session ? "Active" : "None"}
        </div>
        <div>
          <strong>LocalStorage Auth Keys:</strong>
          <div className="mt-1">
            {checkLocalStorage().map(key => (
              <div key={key} className="text-xs text-muted-foreground">{key}</div>
            ))}
          </div>
        </div>
        <div className="flex gap-1 pt-2">
          <Button size="sm" variant="outline" onClick={handleClearAuth}>
            Clear State
          </Button>
          <Button size="sm" variant="destructive" onClick={handleForceLogout}>
            Force Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
