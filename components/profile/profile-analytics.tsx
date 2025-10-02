"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { 
  Eye, 
  Users, 
  UserPlus, 
  MessageCircle, 
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react'

interface ProfileView {
  id: string
  viewer_id: string
  viewed_at: string
  viewer: {
    first_name: string
    last_name: string
    avatar_url?: string
    role: string
  }
}

interface AnalyticsData {
  totalViews: number
  uniqueViewers: number
  recentViews: ProfileView[]
  followersCount: number
  followingCount: number
  connectionsCount: number
  viewsThisWeek: number
  viewsThisMonth: number
}

export function ProfileAnalytics() {
  const { user, profile } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchAnalytics = async () => {
      try {
        setLoading(true)

        // Fetch profile views
        const { data: viewsData, error: viewsError } = await supabase
          .from('profile_views')
          .select(`
            *,
            viewer:profiles!profile_views_viewer_id_fkey(
              first_name,
              last_name,
              avatar_url,
              role
            )
          `)
          .eq('profile_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(10)

        if (viewsError) throw viewsError

        // Fetch followers count
        const { count: followersCount, error: followersError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', user.id)

        if (followersError) throw followersError

        // Fetch following count
        const { count: followingCount, error: followingError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', user.id)

        if (followingError) throw followingError

        // Fetch connections count
        const { count: connectionsCount, error: connectionsError } = await supabase
          .from('connections')
          .select('*', { count: 'exact', head: true })
          .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .eq('status', 'accepted')

        if (connectionsError) throw connectionsError

        // Calculate weekly and monthly views
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        const viewsThisWeek = viewsData?.filter(view => 
          new Date(view.viewed_at) >= weekAgo
        ).length || 0

        const viewsThisMonth = viewsData?.filter(view => 
          new Date(view.viewed_at) >= monthAgo
        ).length || 0

        setAnalytics({
          totalViews: viewsData?.length || 0,
          uniqueViewers: new Set(viewsData?.map(v => v.viewer_id)).size,
          recentViews: viewsData || [],
          followersCount: followersCount || 0,
          followingCount: followingCount || 0,
          connectionsCount: connectionsCount || 0,
          viewsThisWeek,
          viewsThisMonth
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Profile Analytics
          </CardTitle>
          <CardDescription>Loading your profile statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Profile Analytics
          </CardTitle>
          <CardDescription>Unable to load analytics data</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Profile Analytics
          </CardTitle>
          <CardDescription>Your profile performance and engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-agribeta-green">{analytics.totalViews}</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.uniqueViewers}</div>
              <div className="text-sm text-muted-foreground">Unique Viewers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.followersCount}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.connectionsCount}</div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly/Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-agribeta-green mb-2">
              {analytics.viewsThisWeek}
            </div>
            <div className="text-sm text-muted-foreground">Profile views this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics.viewsThisMonth}
            </div>
            <div className="text-sm text-muted-foreground">Profile views this month</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Viewers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Profile Views
          </CardTitle>
          <CardDescription>People who recently viewed your profile</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentViews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No profile views yet</p>
              <p className="text-sm">Your profile views will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.recentViews.map((view) => (
                <div key={view.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={view.viewer.avatar_url} />
                    <AvatarFallback>
                      {view.viewer.first_name[0]}{view.viewer.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">
                        {view.viewer.first_name} {view.viewer.last_name}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {view.viewer.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatTimeAgo(view.viewed_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Network Summary
          </CardTitle>
          <CardDescription>Your connections and followers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <UserPlus className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{analytics.followersCount}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{analytics.followingCount}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{analytics.connectionsCount}</div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
