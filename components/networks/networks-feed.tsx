"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useUsage } from '@/hooks/use-usage'
import { supabase } from '@/lib/supabaseClient'
import { cn } from '@/lib/utils'
import { Heart, MessageCircle, Share, Users, Target, Leaf, Shield, TrendingUp, Calendar, BookOpen, Zap, BarChart2, TreesIcon } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { PostCreator } from './post-creator'
import { PostInteractions } from './post-interactions'
import { PostActions } from './post-actions'
import { SecondaryNav } from '@/components/secondary-nav'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: string
  user_id: string
  content: string
  media_urls?: string[]
  media_types?: string[]
  created_at: string
  // User profile data
  profiles?: {
    first_name: string
    last_name: string
    role: string
    avatar_url?: string
    is_verified: boolean
    farm_name?: string
    company?: string
    email?: string
  }
}

export function NetworksFeed() {
  const { user, profile } = useAuth()
  const { usage } = useUsage()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  // Quick action services
  const quickActions = [
    {
      title: "AgriBeta Pinpoint",
      description: "AI Disease Diagnosis",
      icon: <Leaf className="h-5 w-5" />,
      href: "/diagnosis",
      color: "bg-green-500",
      usage: usage?.ai_predictions.used || 0,
      limit: usage?.ai_predictions.limit || 5
    },
    {
      title: "AgriBeta Predict",
      description: "Crop Analytics",
      icon: <Target className="h-5 w-5" />,
      href: "/dashboard/predict",
      color: "bg-blue-500"
    },
    {
      title: "AgriBeta Protect",
      description: "FCM Compliance",
      icon: <Shield className="h-5 w-5" />,
      href: "/fcm-management",
      color: "bg-purple-500"
    },
    {
      title: "Analytics",
      description: "Farm Insights",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/analytics",
      color: "bg-orange-500"
    }
  ]

  // Network suggestions fetched from real profiles (farmers + agronomists)
  const [suggestions, setSuggestions] = useState<any[]>([])

  // Trending topics
  const trendingTopics = [
    { name: "Disease Prevention", posts: 45 },
    { name: "Organic Farming", posts: 32 },
    { name: "FCM Management", posts: 28 },
    { name: "Irrigation Tips", posts: 21 }
  ]

  useEffect(() => {
    if (user) {
      fetchPosts()
      fetchSuggestions()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            role,
            avatar_url,
            is_verified,
            farm_name,
            company
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error fetching posts:', error)
        return
      }

      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      if (!user) return
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, avatar_url, farm_name, company, is_verified')
        .in('role', ['farmer', 'agronomist'])
        .neq('id', user.id)
        .limit(10)

      if (error) throw error
      setSuggestions(data || [])
    } catch (e) {
      console.error('Error fetching suggestions:', e)
    }
  }

  // Post creation is handled by PostCreator component
  // This function is kept for compatibility but should not be used
  const createPost = async () => {
    console.warn('createPost in NetworksFeed should not be used. Use PostCreator component instead.')
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <SecondaryNav />
      <div className="container mx-auto px-4 py-4 lg:py-8">
        {/* Mobile: Single column, Desktop: Grid layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6 min-h-screen">
        {/* Left Sidebar - User Profile & Quick Actions - Hidden on mobile */}
        <div className="hidden lg:block lg:col-span-1 space-y-6 sticky top-0 max-h-screen overflow-y-auto">
          {/* User Profile Card */}
          <Card className="bg-gradient-to-br from-agribeta-green to-agribeta-green/80 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-4 border-2 border-white">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white text-agribeta-green text-lg font-bold">
                    {profile?.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">
                  {profile?.first_name} {profile?.last_name}
                </h3>
                <p className="text-white/80 text-sm mb-2">
                  {profile?.farm_name || profile?.company || 'AgriBeta Member'}
                </p>
                <Badge variant="secondary" className="mb-4">
                  {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'User'}
                </Badge>
                
                {/* Usage Stats */}
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Profile Views</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Network Connections</span>
                    <span className="font-semibold">24</span>
                  </div>
                  {profile?.role === 'farmer' && (
                    <div className="flex justify-between text-sm">
                      <span>AI Diagnoses Used</span>
                      <span className="font-semibold">{usage?.ai_predictions.used || 0}/{usage?.ai_predictions.limit || 5}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-agribeta-green flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                      {action.usage !== undefined && (
                        <div className="text-xs text-gray-400">
                          {action.usage}/{action.limit} used
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Feed - Full width on mobile, 2 columns on desktop */}
        <div className="w-full lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
          {/* Post Creation */}
          <PostCreator onPostCreated={fetchPosts} />

          {/* Posts Feed */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={post.profiles?.avatar_url} />
                        <AvatarFallback>
                          {post.profiles?.first_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {post.profiles?.first_name && post.profiles?.last_name 
                                ? `${post.profiles.first_name} ${post.profiles.last_name}`
                                : post.profiles?.first_name || post.profiles?.email || 'User'
                              }
                            </span>
                            {post.profiles?.is_verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {post.profiles?.role ? post.profiles.role.charAt(0).toUpperCase() + post.profiles.role.slice(1) : 'User'}
                            </Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(post.created_at)}
                            </span>
                          </div>
                          <PostActions post={post} onUpdate={fetchPosts} />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {post.profiles?.farm_name || post.profiles?.company}
                        </div>
                        <div className="mb-4">
                          <p className="text-gray-800 dark:text-gray-200 break-words">{post.content}</p>
                        </div>
                        
                        {/* Media Content */}
                        {post.media_urls && post.media_urls.length > 0 && (
                          <div className="mb-4">
                            <div className="space-y-2">
                              {post.media_urls.map((url, index) => (
                                <div key={index} className="relative w-full max-w-full overflow-hidden rounded-lg">
                                  {post.media_types?.[index] === 'video' ? (
                                    <video 
                                      src={url} 
                                      controls 
                                      className="w-full h-auto max-w-full rounded-lg"
                                    />
                                        ) : (
                                          <Image
                                            src={url}
                                            alt={`Post media ${index + 1}`}
                                            width={500}
                                            height={300}
                                            className="w-full h-auto max-w-full rounded-lg object-cover"
                                            priority={index === 0}
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                          />
                                        )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Post Interactions */}
                        <PostInteractions post={post} onUpdate={fetchPosts} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Network Growth & Trending - Hidden on mobile */}
        <div className="hidden lg:block lg:col-span-1 space-y-6 sticky top-0 max-h-screen overflow-y-auto">
          {/* Grow Your Network */}
          <Card>
            <CardHeader>
              <CardTitle className="text-agribeta-green">Grow Your Network</CardTitle>
              <CardDescription>
                Discover and connect with experts and peers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={s.avatar_url} />
                    <AvatarFallback>{(s.first_name || 'U')[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{s.first_name} {s.last_name}</span>
                      {s.is_verified && (
                        <Badge variant="secondary" className="text-xs">✓</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {s.role === 'farmer' ? (s.farm_name || 'Farmer') : (s.company || 'Agronomist')}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs" asChild>
                    <Link href={`/profile?u=${s.id}`}>View</Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/agronomists">
                  <Users className="mr-2 h-4 w-4" />
                  Find Connections
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-agribeta-green">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>No upcoming events scheduled.</span>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/events">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore All Events
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-agribeta-green">Trending Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">#{topic.name}</span>
                  <span className="text-xs text-gray-500">{topic.posts} posts</span>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs">
                View All Topics →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  )
}
