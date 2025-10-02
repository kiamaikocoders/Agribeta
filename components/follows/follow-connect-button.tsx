"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFollows } from '@/contexts/follows-context'
import { useAuth } from '@/contexts/auth-context'
import { UserPlus, UserCheck, UserX, Check, X } from 'lucide-react'

interface FollowConnectButtonProps {
  targetUserId: string
  targetUserRole: string
  className?: string
}

export function FollowConnectButton({ 
  targetUserId, 
  targetUserRole, 
  className 
}: FollowConnectButtonProps) {
  const { user } = useAuth()
  const {
    isFollowing,
    isConnected,
    hasPendingConnection,
    followUser,
    unfollowUser,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    pendingConnections
  } = useFollows()

  const [loading, setLoading] = useState(false)

  // Don't show button for current user
  if (user?.id === targetUserId) {
    return null
  }

  const handleFollow = async () => {
    setLoading(true)
    try {
      if (isFollowing(targetUserId)) {
        await unfollowUser(targetUserId)
      } else {
        await followUser(targetUserId)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    try {
      await sendConnectionRequest(targetUserId)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptConnection = async () => {
    const connection = pendingConnections.find(conn => conn.requester_id === targetUserId)
    if (connection) {
      setLoading(true)
      try {
        await acceptConnection(connection.id)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRejectConnection = async () => {
    const connection = pendingConnections.find(conn => conn.requester_id === targetUserId)
    if (connection) {
      setLoading(true)
      try {
        await rejectConnection(connection.id)
      } finally {
        setLoading(false)
      }
    }
  }

  // If already connected, show connected state
  if (isConnected(targetUserId)) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={className}
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Connected
      </Button>
    )
  }

  // If there's a pending connection request from this user
  const pendingConnection = pendingConnections.find(conn => conn.requester_id === targetUserId)
  if (pendingConnection) {
    return (
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={handleAcceptConnection}
          disabled={loading}
          className={className}
        >
          <Check className="mr-2 h-4 w-4" />
          Accept
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRejectConnection}
          disabled={loading}
        >
          <X className="mr-2 h-4 w-4" />
          Decline
        </Button>
      </div>
    )
  }

  // If there's a pending connection request to this user
  if (hasPendingConnection(targetUserId)) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={className}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Request Sent
      </Button>
    )
  }

  // For agronomists and farmers, show connect button
  if (targetUserRole === 'agronomist' || targetUserRole === 'farmer') {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={handleConnect}
        disabled={loading}
        className={className}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Connect
      </Button>
    )
  }

  // For other roles, show follow button
  return (
    <Button
      variant={isFollowing(targetUserId) ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={loading}
      className={className}
    >
      {isFollowing(targetUserId) ? (
        <>
          <UserX className="mr-2 h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  )
}
