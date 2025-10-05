"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './auth-context'

interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
  follower?: {
    first_name: string
    last_name: string
    avatar_url?: string
    role: string
  }
  following?: {
    first_name: string
    last_name: string
    avatar_url?: string
    role: string
  }
}

interface Connection {
  id: string
  requester_id: string
  receiver_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
  requester?: {
    first_name: string
    last_name: string
    avatar_url?: string
    role: string
  }
  receiver?: {
    first_name: string
    last_name: string
    avatar_url?: string
    role: string
  }
}

interface FollowsContextType {
  followers: Follow[]
  following: Follow[]
  loading: boolean
  error: string | null
  followUser: (userId: string) => Promise<void>
  unfollowUser: (userId: string) => Promise<void>
  isFollowing: (userId: string) => boolean
  refreshData: () => Promise<void>
}

const FollowsContext = createContext<FollowsContextType | undefined>(undefined)

export function FollowsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [followers, setFollowers] = useState<Follow[]>([])
  const [following, setFollowing] = useState<Follow[]>([])
  // Deprecated connections in favor of one-way follows
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all follow and connection data
  const fetchData = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch followers (people who follow the current user)
      const { data: followersData, error: followersError } = await supabase
        .from('follows')
        .select(`
          *,
          follower:profiles!follows_follower_id_fkey(
            first_name,
            last_name,
            avatar_url,
            role
          )
        `)
        .eq('following_id', user.id)

      if (followersError) throw followersError

      // Fetch following (people the current user follows)
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select(`
          *,
          following:profiles!follows_following_id_fkey(
            first_name,
            last_name,
            avatar_url,
            role
          )
        `)
        .eq('follower_id', user.id)

      if (followingError) throw followingError

      setFollowers(followersData || [])
      setFollowing(followingData || [])
      
    } catch (err) {
      console.error('Error fetching follow/connection data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Follow a user
  const followUser = useCallback(async (userId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: userId
        })

      if (error) throw error

      // Refresh data
      await fetchData()

      // Create notification for the followed user
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'follow',
          title: 'New Follower',
          message: `${user.user_metadata?.first_name || 'Someone'} started following you`,
          sender_id: user.id
        })
    } catch (err) {
      console.error('Error following user:', err)
      setError(err instanceof Error ? err.message : 'Failed to follow user')
    }
  }, [user, fetchData])

  // Unfollow a user
  const unfollowUser = useCallback(async (userId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId)

      if (error) throw error

      // Refresh data
      await fetchData()
    } catch (err) {
      console.error('Error unfollowing user:', err)
      setError(err instanceof Error ? err.message : 'Failed to unfollow user')
    }
  }, [user, fetchData])


  // Check if following a user
  const isFollowing = useCallback((userId: string) => {
    return following.some(follow => follow.following_id === userId)
  }, [following])



  // Load data on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const value: FollowsContextType = {
    followers,
    following,
    loading,
    error,
    followUser,
    unfollowUser,
    isFollowing,
    refreshData: fetchData
  }

  return (
    <FollowsContext.Provider value={value}>
      {children}
    </FollowsContext.Provider>
  )
}

export function useFollows() {
  const context = useContext(FollowsContext)
  if (context === undefined) {
    throw new Error('useFollows must be used within a FollowsProvider')
  }
  return context
}
