"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  MessageCircle, 
  Users,
  Award,
  Building,
  Leaf,
  BarChart3,
  ArrowLeft,
  Share2,
  Mail,
  CheckCircle,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Flag
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { FollowConnectButton } from '@/components/follows/follow-connect-button'
import { ProfilePosts } from './profile-posts'
import { ProfileReviews } from './profile-reviews'
import { useMessaging } from '@/contexts/messaging-context'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PublicProfileViewProps {
  userId: string
}

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  role: string
  avatar_url?: string
  bio?: string
  country?: string
  is_verified: boolean
  created_at: string
  // Agronomist specific
  title?: string
  years_experience?: number
  specializations?: string[]
  average_rating?: number
  total_consultations?: number
  consultation_fee?: number
  // Farmer specific
  farm_name?: string
  primary_crop?: string
  total_diagnoses?: number
}

export function PublicProfileView({ userId }: PublicProfileViewProps) {
  const { user: currentUser, profile: currentProfile } = useAuth()
  const { startConversation } = useMessaging()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isStartingConversation, setIsStartingConversation] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [userId])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      
      // Fetch basic profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      let profileData: UserProfile = {
        id: profile.id,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        role: profile.role || 'user',
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        country: profile.country,
        is_verified: profile.is_verified || false,
        created_at: profile.created_at
      }

      // Fetch role-specific data
      if (profile.role === 'agronomist') {
        const { data: agronomistData } = await supabase
          .from('agronomist_profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (agronomistData) {
          profileData = {
            ...profileData,
            title: agronomistData.title,
            years_experience: agronomistData.years_experience,
            specializations: agronomistData.specializations,
            average_rating: agronomistData.average_rating,
            total_consultations: agronomistData.total_consultations,
            consultation_fee: agronomistData.consultation_fee
          }
        }
      } else if (profile.role === 'farmer') {
        const { data: farmerData } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (farmerData) {
          profileData = {
            ...profileData,
            farm_name: farmerData.farm_name,
            primary_crop: farmerData.primary_crop,
            total_diagnoses: farmerData.total_diagnoses
          }
        }
      }

      setUserProfile(profileData)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMessage = async () => {
    if (!currentUser || !userProfile) return

    setIsStartingConversation(true)
    try {
      await startConversation([userId])
      toast({
        title: "Conversation Started",
        description: `Started a conversation with ${userProfile.first_name} ${userProfile.last_name}`,
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
    router.push(`/agronomists/booking?agronomist=${userId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agribeta-green"></div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-600">The user profile you're looking for doesn't exist.</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  const isAgronomist = userProfile.role === 'agronomist'
  const isCurrentUser = currentUser?.id === userId

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Profile Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={userProfile.avatar_url} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-agribeta-green to-green-600 text-white">
                    {userProfile.first_name?.[0]}{userProfile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                {/* Contact/Share Icons */}
                <div className="absolute -bottom-2 -right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full bg-white shadow-md hover:bg-green-50"
                    onClick={() => navigator.share?.({ 
                      title: `${userProfile.first_name} ${userProfile.last_name}`,
                      text: `Check out ${userProfile.first_name}'s profile on AgriBeta`,
                      url: window.location.href 
                    })}
                  >
                    <Share2 className="h-4 w-4 text-agribeta-green" />
                  </Button>
                  
                  {!isCurrentUser && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full bg-white shadow-md hover:bg-green-50"
                      onClick={handleMessage}
                    >
                      <Mail className="h-4 w-4 text-agribeta-green" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="text-center lg:text-left flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {userProfile.first_name} {userProfile.last_name}
                    </h1>
                    {userProfile.is_verified && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-agribeta-green/10 to-green-100 text-agribeta-green border-agribeta-green/20 px-3 py-1"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                  </Badge>
                </div>
                
                {userProfile.bio && (
                  <p className="text-gray-600 max-w-2xl mb-4 leading-relaxed">{userProfile.bio}</p>
                )}
              </div>
            </div>

            <div className="flex-1">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {userProfile.country && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-green-100">
                    <div className="p-2 bg-green-100 rounded-full">
                      <MapPin className="h-4 w-4 text-agribeta-green" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{userProfile.country}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-green-100">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Joined {formatDistanceToNow(new Date(userProfile.created_at), { addSuffix: true })}
                  </span>
                </div>

                {isAgronomist && userProfile.years_experience && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-green-100">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{userProfile.years_experience}+ years experience</span>
                  </div>
                )}

                {isAgronomist && userProfile.average_rating && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-green-100">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Star className="h-4 w-4 text-yellow-600 fill-current" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">{userProfile.average_rating.toFixed(1)} rating</span>
                      {userProfile.total_consultations && (
                        <div className="text-xs text-gray-500">({userProfile.total_consultations} reviews)</div>
                      )}
                    </div>
                  </div>
                )}

                {!isAgronomist && userProfile.farm_name && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-green-100">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Building className="h-4 w-4 text-agribeta-green" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{userProfile.farm_name}</span>
                  </div>
                )}

                {!isAgronomist && userProfile.primary_crop && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-green-100">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Leaf className="h-4 w-4 text-agribeta-green" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{userProfile.primary_crop} farmer</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isCurrentUser && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <FollowConnectButton 
                    targetUserId={userId} 
                    targetUserRole={userProfile.role} 
                    className="flex-1"
                  />
                  
                  {isAgronomist ? (
                    <Button 
                      className="flex-1 bg-gradient-to-r from-agribeta-green to-green-600 hover:from-agribeta-green/90 hover:to-green-600/90 text-white shadow-lg"
                      onClick={handleBookConsultation}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Consultation
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      className="flex-1 border-agribeta-green text-agribeta-green hover:bg-agribeta-green hover:text-white"
                      onClick={handleMessage}
                      disabled={isStartingConversation}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {isStartingConversation ? "Starting..." : "Message"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 border border-green-100 shadow-sm">
          <TabsTrigger 
            value="posts" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-agribeta-green data-[state=active]:to-green-600 data-[state=active]:text-white"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Posts
          </TabsTrigger>
          {isAgronomist && (
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-agribeta-green data-[state=active]:to-green-600 data-[state=active]:text-white"
            >
              <Star className="mr-2 h-4 w-4" />
              Reviews
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <ProfilePosts userId={userId} />
        </TabsContent>

        {isAgronomist && (
          <TabsContent value="reviews" className="mt-6">
            <ProfileReviews userId={userId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
