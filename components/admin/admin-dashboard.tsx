"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { Users, Activity, Shield, BarChart3, CheckCircle, XCircle, AlertTriangle, TrendingUp, Trash2, Megaphone, DollarSign, Edit3 } from 'lucide-react'
import Image from 'next/image'

interface DashboardStats {
  totalUsers: number
  totalFarmers: number
  totalAgronomists: number
  totalDiagnoses: number
  totalServiceUsage: number
  pendingVerifications: number
  activeSubscriptions: number
}

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  is_verified: boolean
  subscription_tier: string
  created_at: string
  ai_predictions_used: number
  total_diagnoses: number
}

interface PostItem {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles?: {
    first_name?: string
    last_name?: string
    email?: string
  }
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalFarmers: 0,
    totalAgronomists: 0,
    totalDiagnoses: 0,
    totalServiceUsage: 0,
    pendingVerifications: 0,
    activeSubscriptions: 0
  })
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<PostItem[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user statistics
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')

      if (usersError) {
        console.error('Error fetching users:', usersError)
        return
      }

      // Fetch diagnosis count
      const { count: diagnosisCount } = await supabase
        .from('diagnosis_results')
        .select('*', { count: 'exact', head: true })

      // Fetch service usage count
      const { count: serviceUsageCount } = await supabase
        .from('service_usage')
        .select('*', { count: 'exact', head: true })

      // Calculate statistics
      const totalUsers = users?.length || 0
      const totalFarmers = users?.filter(u => u.role === 'farmer').length || 0
      const totalAgronomists = users?.filter(u => u.role === 'agronomist').length || 0
      const pendingVerifications = users?.filter(u => u.role === 'agronomist' && !u.is_verified).length || 0

      setStats({
        totalUsers,
        totalFarmers,
        totalAgronomists,
        totalDiagnoses: diagnosisCount || 0,
        totalServiceUsage: serviceUsageCount || 0,
        pendingVerifications,
        activeSubscriptions: users?.filter(u => u.subscription_tier !== 'free').length || 0
      })

      // Set recent users (last 10)
      const sortedUsers = users?.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 10) || []
      
      setRecentUsers(sortedUsers)

      // Fetch latest posts for moderation
      const { data: postData } = await supabase
        .from('posts')
        .select(`*, profiles:user_id (first_name, last_name, email)`) 
        .order('created_at', { ascending: false })
        .limit(20)
      setPosts(postData || [])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
      if (error) {
        console.error('Error deleting post:', error)
        return
      }
      setPosts(prev => prev.filter(p => p.id !== postId))
    } catch (e) {
      console.error('Error deleting post:', e)
    }
  }

  const handleChangeUserRole = async (userId: string, newRole: 'farmer' | 'agronomist' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
      if (error) {
        console.error('Error updating role:', error)
        return
      }
      fetchDashboardData()
    } catch (e) {
      console.error('Error updating role:', e)
    }
  }

  const handleVerifyUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', userId)

      if (error) {
        console.error('Error verifying user:', error)
        return
      }

      // Refresh data
      fetchDashboardData()
    } catch (error) {
      console.error('Error verifying user:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FA]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/greenhouse-robotics.png"
          alt="Greenhouse Robotics"
          fill
          className="object-cover opacity-5"
          priority
        />
      </div>
      
      <div className="relative z-10 container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-agribeta-green mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage users, monitor platform activity, and oversee system operations
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-agribeta-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalFarmers} farmers, {stats.totalAgronomists} agronomists
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Diagnoses</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDiagnoses}</div>
              <p className="text-xs text-muted-foreground">
                AI-powered disease diagnoses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Usage</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServiceUsage}</div>
              <p className="text-xs text-muted-foreground">
                Total service interactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">
                Agronomists awaiting verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-7 mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="communications">Comms</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  Latest user registrations on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 animate-pulse">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {user.first_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.role === 'farmer' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.subscription_tier === 'free' ? 'outline' : 'default'}>
                            {user.subscription_tier}
                          </Badge>
                          {user.is_verified && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {formatDate(user.created_at)}
                          </span>
                          <div className="ml-2">
                            <select
                              className="border rounded px-2 py-1 text-sm"
                              value={user.role}
                              onChange={(e) => handleChangeUserRole(user.id, e.target.value as any)}
                            >
                              <option value="farmer">Farmer</option>
                              <option value="agronomist">Agronomist</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Agronomist Verifications</CardTitle>
                <CardDescription>
                  Review and approve agronomist verification requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers
                    .filter(user => user.role === 'agronomist' && !user.is_verified)
                    .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.first_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Registered: {formatDate(user.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleVerifyUser(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {recentUsers.filter(user => user.role === 'agronomist' && !user.is_verified).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending verification requests
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Users</span>
                      <span className="font-semibold">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Premium Users</span>
                      <span className="font-semibold">{stats.activeSubscriptions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Service Usage</span>
                      <span className="font-semibold">{stats.totalServiceUsage}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Farmers</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-agribeta-green h-2 rounded-full" 
                            style={{ width: `${(stats.totalFarmers / stats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{stats.totalFarmers}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Agronomists</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(stats.totalAgronomists / stats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{stats.totalAgronomists}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage (approx)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between"><span>Diagnoses</span><span>{stats.totalDiagnoses}</span></div>
                    <div className="flex justify-between"><span>Total Service Usage</span><span>{stats.totalServiceUsage}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Monitor system performance and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Authentication Service</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Services</span>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storage System</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Moderation</CardTitle>
                <CardDescription>Review and remove inappropriate posts</CardDescription>
              </CardHeader>
              <CardContent>
                {(posts || []).length === 0 ? (
                  <div className="text-sm text-muted-foreground">No posts to review</div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((p) => (
                      <div key={p.id} className="flex items-start justify-between p-3 border rounded-md">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            {p.profiles?.first_name} {p.profiles?.last_name} • {new Date(p.created_at).toLocaleString()}
                          </div>
                          <div className="mt-1">{p.content}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="destructive" size="sm" onClick={() => handleDeletePost(p.id)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Announcement</CardTitle>
                <CardDescription>Simple placeholder – wire up to email/notifications later</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <input className="w-full border rounded px-3 py-2" placeholder="Subject" />
                  <textarea className="w-full border rounded px-3 py-2 h-28" placeholder="Message to all users" />
                  <Button className=""><Megaphone className="h-4 w-4 mr-2"/>Send (placeholder)</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions Overview</CardTitle>
                <CardDescription>Distribution of subscription tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Premium/Basic</span><span>{(recentUsers || []).filter(u => u.subscription_tier !== 'free').length}</span></div>
                  <div className="flex justify-between"><span>Free</span><span>{(recentUsers || []).filter(u => u.subscription_tier === 'free').length}</span></div>
                  <div className="flex justify-between font-semibold"><span>Total</span><span>{stats.totalUsers}</span></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
