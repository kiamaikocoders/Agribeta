"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Star,
  Zap,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface FinanceStats {
  totalUsers: number
  freeUsers: number
  basicUsers: number
  premiumUsers: number
  totalRevenue: number
  monthlyRevenue: number
  conversionRate: number
  churnRate: number
  averageRevenuePerUser: number
}

interface RevenueData {
  month: string
  revenue: number
  users: number
}

export function AdminFinancePage() {
  const [stats, setStats] = useState<FinanceStats>({
    totalUsers: 0,
    freeUsers: 0,
    basicUsers: 0,
    premiumUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    churnRate: 0,
    averageRevenuePerUser: 0
  })
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFinanceData()
  }, [])

  const loadFinanceData = async () => {
    try {
      // Get user subscription data
      const { data: profiles } = await supabase
        .from('profiles')
        .select('subscription_tier, created_at, ai_predictions_used, ai_predictions_limit')

      if (!profiles) return

      // Calculate stats
      const totalUsers = profiles.length
      const freeUsers = profiles.filter(p => p.subscription_tier === 'free').length
      const basicUsers = profiles.filter(p => p.subscription_tier === 'basic').length
      const premiumUsers = profiles.filter(p => p.subscription_tier === 'premium').length
      
      // Calculate revenue (mock data for now)
      const totalRevenue = (basicUsers * 29) + (premiumUsers * 79)
      const monthlyRevenue = totalRevenue
      const conversionRate = ((basicUsers + premiumUsers) / totalUsers) * 100
      const churnRate = 5.2 // Mock churn rate
      const averageRevenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0

      setStats({
        totalUsers,
        freeUsers,
        basicUsers,
        premiumUsers,
        totalRevenue,
        monthlyRevenue,
        conversionRate,
        churnRate,
        averageRevenuePerUser
      })

      // Mock revenue data for charts
      setRevenueData([
        { month: 'Jan', revenue: 1200, users: 45 },
        { month: 'Feb', revenue: 1800, users: 52 },
        { month: 'Mar', revenue: 2200, users: 58 },
        { month: 'Apr', revenue: 1900, users: 55 },
        { month: 'May', revenue: 2500, users: 62 },
        { month: 'Jun', revenue: 2800, users: 68 }
      ])

    } catch (error) {
      console.error('Error loading finance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, color = "default" }: {
    title: string
    value: string | number
    change?: number
    icon: any
    color?: "default" | "green" | "red" | "blue" | "yellow"
  }) => {
    const colorClasses = {
      default: "bg-gray-100 text-gray-600",
      green: "bg-green-100 text-green-600",
      red: "bg-red-100 text-red-600",
      blue: "bg-blue-100 text-blue-600",
      yellow: "bg-yellow-100 text-yellow-600"
    }

    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {change !== undefined && (
                <div className="flex items-center mt-1">
                  {change > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(change)}%
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-agribeta-green mb-2">Finance Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor revenue, subscriptions, and financial performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change={8.2}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          change={-2.1}
          icon={Activity}
          color="yellow"
        />
        <StatCard
          title="ARPU"
          value={`$${stats.averageRevenuePerUser.toFixed(2)}`}
          change={15.3}
          icon={BarChart3}
          color="default"
        />
      </div>

      {/* Subscription Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Subscription Breakdown
            </CardTitle>
            <CardDescription>
              Current user distribution across subscription tiers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="font-medium">Free Users</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{stats.freeUsers}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({((stats.freeUsers / stats.totalUsers) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Progress value={(stats.freeUsers / stats.totalUsers) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Basic Plan</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{stats.basicUsers}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({((stats.basicUsers / stats.totalUsers) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Progress value={(stats.basicUsers / stats.totalUsers) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Premium Plan</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{stats.premiumUsers}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Progress value={(stats.premiumUsers / stats.totalUsers) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue by Plan
            </CardTitle>
            <CardDescription>
              Monthly revenue breakdown by subscription tier
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Basic Plan</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">${(stats.basicUsers * 29).toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground ml-2">/month</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Premium Plan</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">${(stats.premiumUsers * 79).toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground ml-2">/month</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Free Plan</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">$0</span>
                  <span className="text-sm text-muted-foreground ml-2">/month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Monthly revenue and user growth over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-agribeta-green/10 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-agribeta-green">{data.month}</span>
                      </div>
                      <div>
                        <p className="font-medium">Revenue: ${data.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{data.users} active users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {index > 0 && data.revenue > revenueData[index - 1].revenue ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : index > 0 ? (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        ) : null}
                        {index > 0 ? 
                          `${((data.revenue - revenueData[index - 1].revenue) / revenueData[index - 1].revenue * 100).toFixed(1)}%` 
                          : 'Baseline'
                        }
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>
                Manage user subscriptions and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-bold text-2xl">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="font-bold text-2xl">{stats.basicUsers + stats.premiumUsers}</p>
                  <p className="text-sm text-muted-foreground">Paying Users</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="font-bold text-2xl">{stats.churnRate}%</p>
                  <p className="text-sm text-muted-foreground">Churn Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Insights</CardTitle>
              <CardDescription>
                Key performance indicators and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Growth Opportunity</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {stats.freeUsers} free users could be converted to paid plans. 
                    Potential revenue: ${(stats.freeUsers * 29).toLocaleString()}/month
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Performance</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Current conversion rate is {stats.conversionRate.toFixed(1)}%. 
                    Industry average is 15-20%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


