"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  Clock, 
  MessageCircle,
  Star,
  BarChart3,
  Target,
  Award,
  Activity,
  Zap,
  CheckCircle,
  AlertCircle,
  PieChart
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DashboardData {
  earnings: {
    totalEarnings: number
    monthlyEarnings: number
    earningsGrowth: number
    averageSessionValue: number
    monthlyBreakdown: Array<{
      month: string
      amount: number
    }>
  }
  consultations: {
    totalConsultations: number
    upcomingConsultations: number
    completedThisMonth: number
    averageRating: number
    responseTime: number
  }
  clients: {
    totalClients: number
    newClientsThisMonth: number
    returningClients: number
    clientSatisfaction: number
  }
  upcomingSessions: Array<{
    id: string
    client_name: string
    client_avatar: string
    subject: string
    date: string
    duration: number
    type: 'diagnosis' | 'consultation' | 'advice'
    status: 'confirmed' | 'pending' | 'cancelled'
  }>
  recentActivity: Array<{
    id: string
    type: 'consultation' | 'review' | 'payment' | 'message'
    title: string
    description: string
    date: string
    amount?: number
  }>
  goals: Array<{
    id: string
    title: string
    target: number
    current: number
    unit: string
    deadline: string
  }>
}

interface ProfileDashboardProps {
  userId?: string
}

export function ProfileDashboard({ userId }: ProfileDashboardProps) {
  const { user, profile } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('6months')

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Mock dashboard data - in a real app, this would come from your analytics API
      const mockData: DashboardData = {
        earnings: {
          totalEarnings: 15750,
          monthlyEarnings: 2850,
          earningsGrowth: 18.5,
          averageSessionValue: 125,
          monthlyBreakdown: [
            { month: 'Jan', amount: 2100 },
            { month: 'Feb', amount: 2300 },
            { month: 'Mar', amount: 2800 },
            { month: 'Apr', amount: 3200 },
            { month: 'May', amount: 3100 },
            { month: 'Jun', amount: 2850 }
          ]
        },
        consultations: {
          totalConsultations: 126,
          upcomingConsultations: 8,
          completedThisMonth: 24,
          averageRating: 4.6,
          responseTime: 2.5
        },
        clients: {
          totalClients: 45,
          newClientsThisMonth: 6,
          returningClients: 38,
          clientSatisfaction: 94
        },
        upcomingSessions: [
          {
            id: '1',
            client_name: 'John Doe',
            client_avatar: '',
            subject: 'Pest Management Consultation',
            date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            type: 'consultation',
            status: 'confirmed'
          },
          {
            id: '2',
            client_name: 'Sarah Wilson',
            client_avatar: '',
            subject: 'Soil Analysis Review',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration: 45,
            type: 'diagnosis',
            status: 'confirmed'
          },
          {
            id: '3',
            client_name: 'Michael Brown',
            client_avatar: '',
            subject: 'Irrigation System Design',
            date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            duration: 90,
            type: 'advice',
            status: 'pending'
          }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'payment',
            title: 'Payment Received',
            description: 'From John Doe for pest management consultation',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            amount: 150
          },
          {
            id: '2',
            type: 'review',
            title: 'New 5-Star Review',
            description: 'Sarah Wilson left a glowing review for your diagnosis',
            date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            type: 'consultation',
            title: 'Consultation Completed',
            description: 'Soil analysis consultation with Emily Davis',
            date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            amount: 120
          },
          {
            id: '4',
            type: 'message',
            title: 'New Message',
            description: 'Michael Brown sent a follow-up question',
            date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
          }
        ],
        goals: [
          {
            id: '1',
            title: 'Monthly Earnings Target',
            target: 3500,
            current: 2850,
            unit: '$',
            deadline: 'Dec 2024'
          },
          {
            id: '2',
            title: 'Client Satisfaction',
            target: 95,
            current: 94,
            unit: '%',
            deadline: 'Ongoing'
          },
          {
            id: '3',
            title: 'New Clients This Month',
            target: 10,
            current: 6,
            unit: 'clients',
            deadline: 'Dec 2024'
          }
        ]
      }

      setDashboardData(mockData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />
      case 'message':
        return <MessageCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'diagnosis':
        return 'bg-red-100 text-red-800'
      case 'consultation':
        return 'bg-blue-100 text-blue-800'
      case 'advice':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">📈 Professional Dashboard</h3>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">📈 Professional Dashboard</h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Dashboard Data</h4>
          <p className="text-gray-600">Start providing consultations to see your professional dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl font-semibold text-gray-900">📈 Professional Dashboard</h3>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData.earnings.totalEarnings)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="flex items-center gap-1 mt-2">
            {getGrowthIcon(dashboardData.earnings.earningsGrowth)}
            <span className={`text-sm ${getGrowthColor(dashboardData.earnings.earningsGrowth)}`}>
              +{dashboardData.earnings.earningsGrowth}%
            </span>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultations</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.consultations.totalConsultations}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {dashboardData.consultations.completedThisMonth} this month
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clients</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.clients.totalClients}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {dashboardData.clients.newClientsThisMonth} new this month
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.consultations.averageRating}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {dashboardData.clients.clientSatisfaction}% satisfaction
          </p>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">💰 Earnings Overview</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Earnings</span>
              <span className="font-medium">
                {formatCurrency(dashboardData.earnings.monthlyEarnings)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Session Value</span>
              <span className="font-medium">
                {formatCurrency(dashboardData.earnings.averageSessionValue)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="font-medium">
                {dashboardData.consultations.responseTime}h avg
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h5 className="font-medium text-gray-900 mb-3">Monthly Trend</h5>
            <div className="space-y-2">
              {dashboardData.earnings.monthlyBreakdown.map((month, index) => (
                <div key={month.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-600">{month.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(month.amount / Math.max(...dashboardData.earnings.monthlyBreakdown.map(m => m.amount))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium">
                    {formatCurrency(month.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">📅 Upcoming Sessions</h4>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          
          {dashboardData.upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming sessions</p>
              <Button className="mt-4" size="sm">
                Schedule Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.client_avatar} />
                    <AvatarFallback>
                      {session.client_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{session.client_name}</p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getSessionTypeColor(session.type)}`}
                      >
                        {session.type}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(session.status)}`}
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{session.subject}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{formatDistanceToNow(new Date(session.date), { addSuffix: true })}</span>
                      <span>{session.duration}min</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Goals & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">🎯 Goals & Targets</h4>
          
          <div className="space-y-4">
            {dashboardData.goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900 text-sm">{goal.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {goal.deadline}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        progress >= 80 ? 'bg-green-500' : 
                        progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-right">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">📈 Recent Activity</h4>
          
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900 text-sm">{activity.title}</h5>
                    {activity.amount && (
                      <span className="text-sm font-medium text-green-600">
                        +{formatCurrency(activity.amount)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">📊 Performance Metrics</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {dashboardData.consultations.averageRating}
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
            <div className="flex justify-center mt-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(dashboardData.consultations.averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {dashboardData.clients.clientSatisfaction}%
            </div>
            <p className="text-sm text-gray-600">Client Satisfaction</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${dashboardData.clients.clientSatisfaction}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {dashboardData.clients.returningClients}
            </div>
            <p className="text-sm text-gray-600">Returning Clients</p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((dashboardData.clients.returningClients / dashboardData.clients.totalClients) * 100)}% retention rate
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
