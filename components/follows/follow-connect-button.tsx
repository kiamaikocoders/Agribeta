"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFollows } from '@/contexts/follows-context'
import { useAuth } from '@/contexts/auth-context'
import { UserPlus, UserCheck, UserX } from 'lucide-react'

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
    followers,
    followUser,
    unfollowUser,
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

  // Determine if the target user is following the current user
  const isFollowedByTarget = followers.some(f => f.follower_id === targetUserId)

  // Unified follow button with states: Follow, Following, Follow Back
  const following = isFollowing(targetUserId)

  return (
    <Button
      variant={following ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={loading}
      className={className}
    >
      {following ? (
        <>
          <UserCheck className="mr-2 h-4 w-4" />
          Following
        </>
      ) : isFollowedByTarget ? (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow Back
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
