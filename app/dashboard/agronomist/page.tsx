"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { PageBackground } from '@/components/page-background'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  Clock, 
  Target, 
  BookOpen, 
  TrendingUp,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

export default function AgronomistDashboard() {
  const { profile, agronomistProfile } = useAuth()

  // Schedule Management
  const upcomingConsultations = [
    {
      id: 1,
      farmer: "John Doe",
      type: "Video Call",
      date: "2024-01-20",
      time: "10:00 AM",
      duration: 60,
      status: "Confirmed"
    },
    {
      id: 2,
      farmer: "Sarah Kimani",
      type: "Farm Visit",
      date: "2024-01-22",
      time: "2:00 PM",
      duration: 120,
      status: "Pending"
    }
  ]

  // Consultation History
  const recentSessions = [
    {
      id: 1,
      farmer: "Michael Ochieng",
      date: "2024-01-18",
      rating: 5,
      review: "Excellent advice on pest management",
      earnings: 150
    },
    {
      id: 2,
      farmer: "Grace Wanjiku",
      date: "2024-01-15",
      rating: 4,
      review: "Very helpful with soil analysis",
      earnings: 120
    }
  ]

  // Performance Metrics
  const metrics = {
    responseTime: 2.5, // hours
    successRate: 92,
    clientSatisfaction: 4.6,
    totalEarnings: 2850,
    totalConsultations: 45
  }

  return (
    <ProtectedRoute allowedRoles={['agronomist']}>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">Agronomist Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, {profile?.first_name || 'Agronomist'}! Manage your consultations and grow your practice.
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">📈 Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Response Time</h3>
                      <p className="text-2xl font-bold text-blue-600">{metrics.responseTime}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Success Rate</h3>
                      <p className="text-2xl font-bold text-green-600">{metrics.successRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Client Satisfaction</h3>
                      <p className="text-2xl font-bold text-yellow-600">{metrics.clientSatisfaction}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Total Earnings</h3>
                      <p className="text-2xl font-bold text-green-600">${metrics.totalEarnings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Schedule Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule Management
                  </CardTitle>
                  <CardDescription>Upcoming consultations and availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{consultation.farmer}</h4>
                            <p className="text-sm text-muted-foreground">
                              {consultation.type} • {consultation.duration} minutes
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={consultation.status === 'Confirmed' ? 'default' : 'secondary'}>
                            {consultation.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {consultation.date} at {consultation.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/schedule">View Full Schedule</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href="/schedule/availability">Update Availability</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Consultation History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Consultation History
                  </CardTitle>
                  <CardDescription>Recent sessions and client feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{session.farmer}</h4>
                            <p className="text-sm text-muted-foreground">{session.review}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < session.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-green-600">${session.earnings}</p>
                          <p className="text-sm text-muted-foreground">{session.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/consultations">View All Consultations</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Expert Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Expert Tools
                  </CardTitle>
                  <CardDescription>Professional resources and tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/diagnosis/requests">
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Diagnosis Requests</h4>
                        <p className="text-sm text-muted-foreground">3 pending</p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/templates">
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Treatment Templates</h4>
                        <p className="text-sm text-muted-foreground">12 templates</p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/knowledge-base">
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Knowledge Base</h4>
                        <p className="text-sm text-muted-foreground">Research & resources</p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Network Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Network Management
                  </CardTitle>
                  <CardDescription>Your professional network</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Connected Farmers</span>
                    <span className="text-sm text-muted-foreground">24</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pending Requests</span>
                    <Badge variant="secondary">3</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Community Posts</span>
                    <span className="text-sm text-muted-foreground">8 this month</span>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/network">Manage Network</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Earnings Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Earnings Overview
                  </CardTitle>
                  <CardDescription>Your financial performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">This Month</span>
                    <span className="text-sm font-bold text-green-600">$850</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Consultations</span>
                    <span className="text-sm text-muted-foreground">{metrics.totalConsultations}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{metrics.clientSatisfaction}</span>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href="/earnings">View Detailed Earnings</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}
