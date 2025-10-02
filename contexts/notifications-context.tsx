"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './auth-context'

interface Notification {
  id: string
  user_id: string
  type: 'message' | 'like' | 'comment' | 'follow' | 'booking' | 'diagnosis' | 'system'
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
  sender_id?: string
  sender?: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => Promise<void>
  refreshNotifications: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Fetch notifications for the current user
  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:profiles!notifications_sender_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications(data || [])
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) throw error

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [user])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [user])

  // Add a new notification
  const addNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notificationData,
          user_id: user.id
        })
        .select(`
          *,
          sender:profiles!notifications_sender_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      setNotifications(prev => [data, ...prev])
    } catch (err) {
      console.error('Error adding notification:', err)
    }
  }, [user])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return

    // Subscribe to new notifications
    const notificationsSubscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const newNotification = payload.new as Notification
        setNotifications(prev => [newNotification, ...prev])
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const updatedNotification = payload.new as Notification
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === updatedNotification.id 
              ? updatedNotification 
              : notification
          )
        )
      })
      .subscribe()

    return () => {
      notificationsSubscription.unsubscribe()
    }
  }, [user])

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    addNotification,
    refreshNotifications: fetchNotifications
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}
