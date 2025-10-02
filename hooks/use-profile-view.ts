import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/auth-context'

export function useProfileView(profileId: string) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !profileId || user.id === profileId) return

    const trackView = async () => {
      try {
        await supabase.rpc('track_profile_view', {
          target_profile_id: profileId
        })
      } catch (error) {
        console.error('Error tracking profile view:', error)
      }
    }

    // Track view after a short delay to ensure it's a real visit
    const timer = setTimeout(trackView, 2000)
    
    return () => clearTimeout(timer)
  }, [user, profileId])
}
