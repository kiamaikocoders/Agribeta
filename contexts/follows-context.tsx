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
  connections: Connection[]
  pendingConnections: Connection[]
  loading: boolean
  error: string | null
  followUser: (userId: string) => Promise<void>
  unfollowUser: (userId: string) => Promise<void>
  sendConnectionRequest: (userId: string) => Promise<void>
  acceptConnection: (connectionId: string) => Promise<void>
  rejectConnection: (connectionId: string) => Promise<void>
  isFollowing: (userId: string) => boolean
  isConnected: (userId: string) => boolean
  hasPendingConnection: (userId: string) => boolean
  refreshData: () => Promise<void>
}

const FollowsContext = createContext<FollowsContextType | undefined>(undefined)

export function FollowsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [followers, setFollowers] = useState<Follow[]>([])
  const [following, setFollowing] = useState<Follow[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [pendingConnections, setPendingConnections] = useState<Connection[]>([])
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

      // Fetch connections where user is requester or receiver
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select(`
          *,
          requester:profiles!connections_requester_id_fkey(
            first_name,
            last_name,
            avatar_url,
            role
          ),
          receiver:profiles!connections_receiver_id_fkey(
            first_name,
            last_name,
            avatar_url,
            role
          )
        `)
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)

      if (connectionsError) throw connectionsError

      setFollowers(followersData || [])
      setFollowing(followingData || [])
      setConnections(connectionsData || [])
      setPendingConnections(
        (connectionsData || []).filter(conn => 
          conn.receiver_id === user.id && conn.status === 'pending'
        )
      )
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

  // Send connection request
  const sendConnectionRequest = useCallback(async (userId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          receiver_id: userId,
          status: 'pending'
        })

      if (error) throw error

      // Refresh data
      await fetchData()

      // Create notification for the receiver
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'follow',
          title: 'Connection Request',
          message: `${user.user_metadata?.first_name || 'Someone'} wants to connect with you`,
          sender_id: user.id
        })
    } catch (err) {
      console.error('Error sending connection request:', err)
      setError(err instanceof Error ? err.message : 'Failed to send connection request')
    }
  }, [user, fetchData])

  // Accept connection
  const acceptConnection = useCallback(async (connectionId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId)
        .eq('receiver_id', user.id)

      if (error) throw error

      // Refresh data
      await fetchData()
    } catch (err) {
      console.error('Error accepting connection:', err)
      setError(err instanceof Error ? err.message : 'Failed to accept connection')
    }
  }, [user, fetchData])

  // Reject connection
  const rejectConnection = useCallback(async (connectionId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', connectionId)
        .eq('receiver_id', user.id)

      if (error) throw error

      // Refresh data
      await fetchData()
    } catch (err) {
      console.error('Error rejecting connection:', err)
      setError(err instanceof Error ? err.message : 'Failed to reject connection')
    }
  }, [user, fetchData])

  // Check if following a user
  const isFollowing = useCallback((userId: string) => {
    return following.some(follow => follow.following_id === userId)
  }, [following])

  // Check if connected to a user
  const isConnected = useCallback((userId: string) => {
    return connections.some(conn => 
      (conn.requester_id === user?.id && conn.receiver_id === userId && conn.status === 'accepted') ||
      (conn.receiver_id === user?.id && conn.requester_id === userId && conn.status === 'accepted')
    )
  }, [connections, user])

  // Check if there's a pending connection
  const hasPendingConnection = useCallback((userId: string) => {
    return connections.some(conn => 
      (conn.requester_id === user?.id && conn.receiver_id === userId && conn.status === 'pending') ||
      (conn.receiver_id === user?.id && conn.requester_id === userId && conn.status === 'pending')
    )
  }, [connections, user])

  // Load data on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const value: FollowsContextType = {
    followers,
    following,
    connections,
    pendingConnections,
    loading,
    error,
    followUser,
    unfollowUser,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    isFollowing,
    isConnected,
    hasPendingConnection,
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
