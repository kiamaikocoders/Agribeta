"use client"

import { useState, useEffect } from 'react'
import { getUserPresence } from '@/utils/presence-utils'

interface OnlineStatusProps {
  userId?: string
}

export function OnlineStatus({ userId }: OnlineStatusProps) {
  const [isOnline, setIsOnline] = useState(false)
  const [lastSeen, setLastSeen] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    // Get initial presence data
    const checkPresence = async () => {
      try {
        const presence = await getUserPresence(userId)
        setIsOnline(presence.is_online)
        setLastSeen(presence.last_seen)
      } catch (error) {
        console.error('Error checking presence:', error)
      }
    }

    checkPresence()

    // Set up interval to check for updates (polling approach to avoid subscription conflicts)
    const interval = setInterval(checkPresence, 10000) // Check every 10 seconds

    return () => {
      clearInterval(interval)
    }
  }, [userId])

  if (!userId) return null

  return (
    <div className="absolute -bottom-1 -right-1">
      {isOnline ? (
        <div className="h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
      ) : (
        <div className="h-3 w-3 bg-gray-400 border-2 border-white rounded-full" />
      )}
    </div>
  )
}

export function LastSeenText({ userId }: OnlineStatusProps) {
  const [lastSeen, setLastSeen] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    // Get initial presence data
    const checkLastSeen = async () => {
      try {
        const presence = await getUserPresence(userId)
        setLastSeen(presence.last_seen)
      } catch (error) {
        console.error('Error checking last seen:', error)
      }
    }

    checkLastSeen()

    // Set up interval to check for updates (polling approach to avoid subscription conflicts)
    const interval = setInterval(checkLastSeen, 10000) // Check every 10 seconds

    return () => {
      clearInterval(interval)
    }
  }, [userId])

  if (!lastSeen) return null

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Online'
    if (diffInSeconds < 3600) return `Last seen ${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `Last seen ${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `Last seen ${Math.floor(diffInSeconds / 86400)}d ago`
    return `Last seen ${date.toLocaleDateString()}`
  }

  return (
    <span className="text-xs text-muted-foreground">
      {formatLastSeen(lastSeen)}
    </span>
  )
}
