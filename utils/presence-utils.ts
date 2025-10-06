import { supabase } from '@/lib/supabaseClient'

/**
 * Initialize presence record for a user if it doesn't exist
 */
export async function initializeUserPresence(userId: string) {
  try {
    // First check if record exists
    const { data: existingRecord } = await supabase
      .from('user_presence')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()

    // Only insert if record doesn't exist
    if (!existingRecord) {
      const { error } = await supabase
        .from('user_presence')
        .insert({
          user_id: userId,
          is_online: false,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error initializing user presence:', error)
        return false
      }
    }
    return true
  } catch (err) {
    console.error('Error initializing user presence:', err)
    return false
  }
}

/**
 * Get user presence data safely (handles missing records)
 */
export async function getUserPresence(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_presence')
      .select('is_online, last_seen')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user presence:', error)
      return { is_online: false, last_seen: null }
    }

    return {
      is_online: data?.is_online || false,
      last_seen: data?.last_seen || null
    }
  } catch (err) {
    console.error('Error fetching user presence:', err)
    return { is_online: false, last_seen: null }
  }
}

/**
 * Update user presence (only for current user)
 */
export async function updateUserPresence(userId: string, isOnline: boolean, retries = 3) {
  try {
    // Only allow users to update their own presence
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== userId) {
      console.error('Cannot update presence for other users')
      return false
    }

    const { error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: userId,
        is_online: isOnline,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      // Retry on network errors
      if (error.message?.includes('NetworkError') && retries > 0) {
        console.log(`Retrying presence update, ${retries} attempts left...`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        return updateUserPresence(userId, isOnline, retries - 1)
      }
      console.error('Error updating user presence:', error)
      return false
    }
    return true
  } catch (err) {
    // Retry on network errors
    if (err instanceof Error && err.message.includes('NetworkError') && retries > 0) {
      console.log(`Retrying presence update due to network error, ${retries} attempts left...`)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      return updateUserPresence(userId, isOnline, retries - 1)
    }
    console.error('Error updating user presence:', err)
    return false
  }
}
