"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { PageBackground } from '@/components/page-background'
import { 
  Leaf, 
  Target, 
  Shield, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

export default function FarmerDashboard() {
  const { profile, farmerProfile } = useAuth()

  // Quick Actions
  const quickActions = [
    {
      title: "New Diagnosis",
      description: "AI-powered disease pinpointing",
      icon: <Leaf className="h-6 w-6" />,
      href: "/diagnosis",
      color: "bg-green-500",
      usage: profile?.ai_predictions_used || 0,
      limit: profile?.ai_predictions_limit || 5
    },
    {
      title: "Book Agronomist",
      description: "Get expert consultation",
      icon: <Users className="h-6 w-6" />,
      href: "/agronomists",
      color: "bg-blue-500"
    },
    {
      title: "View Learning Content",
      description: "Educational resources",
      icon: <Target className="h-6 w-6" />,
      href: "/learn",
      color: "bg-purple-500"
    },
    {
      title: "Community Post",
      description: "Share with the network",
      icon: <Users className="h-6 w-6" />,
      href: "/dashboard/networks",
      color: "bg-orange-500"
    }
  ]

  // Mock analytics data
  const analytics = {
    diseaseHistory: [
      { disease: "Anthracnose", date: "2024-01-15", status: "Resolved", treatment: "Fungicide spray" },
      { disease: "Root Rot", date: "2024-01-08", status: "Resolved", treatment: "Soil treatment" },
      { disease: "Leaf Spot", date: "2024-01-02", status: "Monitoring", treatment: "Pruning" }
    ],
    treatmentSuccessRate: 85,
    aiPredictionsUsed: profile?.ai_predictions_used || 0,
    costSavings: 1250
  }

  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">Farmer Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, {profile?.first_name || 'Farmer'}! Here's your farm overview.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">🎯 Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${action.color} text-white`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                          {action.usage !== undefined && (
                            <div className="text-xs text-gray-500 mt-1">
                              {action.usage}/{action.limit} used this month
                            </div>
                          )}
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Farm Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">📊 My Farm Analytics</h2>
              
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Treatment Success Rate</h3>
                        <p className="text-2xl font-bold text-green-600">{analytics.treatmentSuccessRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">AI Predictions Used</h3>
                        <p className="text-2xl font-bold text-blue-600">{analytics.aiPredictionsUsed}</p>
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
                        <h3 className="font-semibold">Cost Savings</h3>
                        <p className="text-2xl font-bold text-green-600">${analytics.costSavings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Active Issues</h3>
                        <p className="text-2xl font-bold text-orange-600">1</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Disease History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Disease History
                  </CardTitle>
                  <CardDescription>Recent disease incidents and treatments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.diseaseHistory.map((incident, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            incident.status === 'Resolved' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            {incident.status === 'Resolved' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{incident.disease}</h4>
                            <p className="text-sm text-muted-foreground">{incident.treatment}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={incident.status === 'Resolved' ? 'default' : 'secondary'}>
                            {incident.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{incident.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* My Network */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    My Network
                  </CardTitle>
                  <CardDescription>Your connections and recent activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Followed Agronomists</h4>
                      <p className="text-sm text-muted-foreground">3 experts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Recent Consultations</h4>
                      <p className="text-sm text-muted-foreground">2 this month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Community Activity</h4>
                      <p className="text-sm text-muted-foreground">5 posts, 12 likes</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/networks">View Network</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Subscription & Billing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Subscription & Billing
                  </CardTitle>
                  <CardDescription>Manage your plan and usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Plan</span>
                    <Badge variant="secondary">
                      {profile?.subscription_tier ? profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1) : 'Free'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Usage Limits</span>
                    <span className="text-sm text-muted-foreground">
                      {profile?.ai_predictions_used || 0}/{profile?.ai_predictions_limit || 5} AI predictions
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payment History</span>
                    <span className="text-sm text-muted-foreground">All up to date</span>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href="/billing">Upgrade Options</Link>
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
