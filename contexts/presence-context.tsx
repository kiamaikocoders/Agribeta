"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './auth-context'
import { updateUserPresence } from '@/utils/presence-utils'

interface PresenceContextType {
  isOnline: boolean
  updatePresence: (isOnline: boolean) => Promise<void>
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined)

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isOnline, setIsOnline] = useState(false)

  const updatePresence = useCallback(async (online: boolean) => {
    if (!user) return

    try {
      const success = await updateUserPresence(user.id, online)
      if (success) {
        setIsOnline(online)
      }
    } catch (err) {
      // Only log non-network errors to avoid spam
      if (err instanceof Error && !err.message.includes('NetworkError')) {
        console.error('Error updating presence:', err)
      }
    }
  }, [user])

  // Set user as online when they connect
  useEffect(() => {
    if (!user) return

    // Add a small delay to prevent race conditions during sign-in
    const timer = setTimeout(() => {
      updatePresence(true).catch(err => {
        // Only log non-network errors
        if (err instanceof Error && !err.message.includes('NetworkError')) {
          console.error('Error setting initial presence:', err)
        }
      })
    }, 2000) // 2 second delay for presence updates
    
    return () => clearTimeout(timer)

    // Set user as offline when they disconnect
    const handleBeforeUnload = () => {
      updatePresence(false).catch(err => {
        console.error('Error setting offline presence on unload:', err)
      })
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence(false).catch(err => {
          console.error('Error setting offline presence on visibility change:', err)
        })
      } else {
        updatePresence(true).catch(err => {
          console.error('Error setting online presence on visibility change:', err)
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      updatePresence(false).catch(err => {
        console.error('Error setting offline presence on cleanup:', err)
      })
    }
  }, [user, updatePresence])

  const value: PresenceContextType = {
    isOnline,
    updatePresence
  }

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  )
}

export function usePresence() {
  const context = useContext(PresenceContext)
  if (context === undefined) {
    throw new Error('usePresence must be used within a PresenceProvider')
  }
  return context
}
