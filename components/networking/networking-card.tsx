"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Clock, Users, MessageCircle, Calendar, User, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { FollowConnectButton } from '@/components/follows/follow-connect-button'
import { useAuth } from '@/contexts/auth-context'
import { useMessaging } from '@/contexts/messaging-context'
import { toast } from '@/components/ui/use-toast'

interface NetworkingCardProps {
  user: {
    id: string
    first_name: string
    last_name: string
    role: 'farmer' | 'agronomist'
    avatar_url?: string
    bio?: string
    location?: string
    is_verified: boolean
    // Agronomist specific fields
    title?: string
    years_experience?: number
    specializations?: string[]
    average_rating?: number
    total_consultations?: number
    consultation_fee?: number
    response_time_minutes?: number
    // Farmer specific fields
    farm_name?: string
    farm_size?: number
    primary_crop?: string
    total_diagnoses?: number
  }
}

export function NetworkingCard({ user }: NetworkingCardProps) {
  const { profile } = useAuth()
  const { startConversation } = useMessaging()
  const [isStartingConversation, setIsStartingConversation] = useState(false)

  const isAgronomist = user.role === 'agronomist'
  const isCurrentUser = profile?.id === user.id

  const handleMessage = async () => {
    if (!profile || isCurrentUser) return

    setIsStartingConversation(true)
    try {
      await startConversation([user.id])
      toast({
        title: "Conversation Started",
        description: `Started a conversation with ${user.first_name} ${user.last_name}`,
      })
    } catch (error) {
      console.error('Error starting conversation:', error)
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStartingConversation(false)
    }
  }

  const handleBookConsultation = () => {
    // Route to booking page with agronomist pre-selected
    window.location.href = `/agronomists/booking?agronomist=${user.id}`
  }

  if (isCurrentUser) return null

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} alt={`${user.first_name} ${user.last_name}`} />
            <AvatarFallback className="text-xl">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-lg">{user.first_name} {user.last_name}</CardTitle>
        
        {isAgronomist ? (
          <CardDescription>
            {user.title} • {user.years_experience}+ Years Experience
          </CardDescription>
        ) : (
          <CardDescription>
            {user.farm_name && `${user.farm_name} Farm`} • {user.primary_crop && `${user.primary_crop} Farmer`}
          </CardDescription>
        )}

        <div className="flex justify-center gap-2 mt-2">
          <Badge variant="secondary" className={user.is_verified ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
            {user.is_verified ? "Verified" : "Unverified"}
          </Badge>
          <Badge variant="outline">
            {isAgronomist ? "Agronomist" : "Farmer"}
          </Badge>
          {isAgronomist && user.specializations?.[0] && (
            <Badge variant="outline">{user.specializations[0]} Expert</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {user.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{user.location}</span>
          </div>
        )}

        {isAgronomist && user.average_rating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{user.average_rating.toFixed(1)} ({user.total_consultations} consultations)</span>
          </div>
        )}

        {isAgronomist && user.response_time_minutes && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Usually responds in {Math.round(user.response_time_minutes / 60)} hours</span>
          </div>
        )}

        {!isAgronomist && user.total_diagnoses && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{user.total_diagnoses} diagnoses completed</span>
          </div>
        )}

        {user.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
        )}

        {isAgronomist && user.consultation_fee && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Consultation fee:</span>
            <span className="font-semibold">${user.consultation_fee}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <FollowConnectButton 
            targetUserId={user.id} 
            targetUserRole={user.role} 
            className="flex-1"
          />
          
          {isAgronomist ? (
            <Button 
              className="flex-1 bg-agribeta-green hover:bg-agribeta-green/90"
              onClick={handleBookConsultation}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleMessage}
              disabled={isStartingConversation}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {isStartingConversation ? "Starting..." : "Message"}
            </Button>
          )}
        </div>

        {/* Specializations for Agronomists */}
        {isAgronomist && user.specializations && user.specializations.length > 1 && (
          <div className="pt-2 border-t">
            <div className="flex flex-wrap gap-1">
              {user.specializations.slice(1).map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
