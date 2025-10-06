"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'
import { ProfileUpcomingSessions } from './profile-upcoming-sessions'
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown, 
  DollarSign, 
  Leaf, 
  Droplets, 
  Sun, 
  Thermometer,
  Calendar,
  Target,
  Award,
  PieChart,
  Activity,
  Zap
} from 'lucide-react'

interface AnalyticsData {
  farmPerformance: {
    totalYield: number
    yieldGrowth: number
    efficiency: number
    sustainability: number
  }
  cropAnalytics: {
    primaryCrop: {
      name: string
      yield: number
      quality: number
      revenue: number
    }
    secondaryCrops: Array<{
      name: string
      yield: number
      quality: number
      revenue: number
    }>
  }
  revenueTracking: {
    monthlyRevenue: Array<{
      month: string
      amount: number
    }>
    totalRevenue: number
    revenueGrowth: number
    profitMargin: number
  }
  weatherImpact: {
    temperature: number
    humidity: number
    rainfall: number
    impact: 'positive' | 'neutral' | 'negative'
  }
  goals: Array<{
    id: string
    title: string
    target: number
    current: number
    unit: string
    deadline: string
  }>
}

interface ProfileAnalyticsProps {
  userId?: string
}

export function ProfileAnalytics({ userId }: ProfileAnalyticsProps) {
  const { user, profile, farmerProfile } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('6months')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

    const fetchAnalytics = async () => {
      try {
        setLoading(true)

      // Mock analytics data - in a real app, this would come from your analytics API
      const mockData: AnalyticsData = {
        farmPerformance: {
          totalYield: 1250,
          yieldGrowth: 15.2,
          efficiency: 87,
          sustainability: 92
        },
        cropAnalytics: {
          primaryCrop: {
            name: farmerProfile?.primary_crop || 'Avocado',
            yield: 850,
            quality: 94,
            revenue: 12750
          },
          secondaryCrops: [
            {
              name: 'Roses',
              yield: 500,
              quality: 90,
              revenue: 1500
            }
          ]
        },
        revenueTracking: {
          monthlyRevenue: [
            { month: 'Jan', amount: 2100 },
            { month: 'Feb', amount: 2300 },
            { month: 'Mar', amount: 2800 },
            { month: 'Apr', amount: 3200 },
            { month: 'May', amount: 3100 },
            { month: 'Jun', amount: 2850 }
          ],
          totalRevenue: 16350,
          revenueGrowth: 12.5,
          profitMargin: 68
        },
        weatherImpact: {
          temperature: 24,
          humidity: 65,
          rainfall: 45,
          impact: 'positive' as const
        },
        goals: [
          {
            id: '1',
            title: 'Increase Avocado Yield',
            target: 1000,
            current: 850,
            unit: 'kg',
            deadline: 'Dec 2024'
          },
          {
            id: '2',
            title: 'Improve Water Efficiency',
            target: 95,
            current: 87,
            unit: '%',
            deadline: 'Oct 2024'
          },
          {
            id: '3',
            title: 'Monthly Revenue Target',
            target: 3500,
            current: 2850,
            unit: '$',
            deadline: 'Dec 2024'
          }
        ]
      }

      setAnalyticsData(mockData)
      } catch (error) {
        console.error('Error fetching analytics:', error)
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
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">📊 Analytics</h3>
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

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">📊 Analytics</h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h4>
          <p className="text-gray-600">Start tracking your farm performance to see detailed analytics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl font-semibold text-gray-900">📊 Farm Analytics</h3>
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

      {/* Farm Performance Overview */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">🏡 Farm Performance</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Yield</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.farmPerformance.totalYield} kg</p>
              </div>
              <Leaf className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getGrowthIcon(analyticsData.farmPerformance.yieldGrowth)}
              <span className={`text-sm ${getGrowthColor(analyticsData.farmPerformance.yieldGrowth)}`}>
                +{analyticsData.farmPerformance.yieldGrowth}%
              </span>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.farmPerformance.efficiency}%</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${analyticsData.farmPerformance.efficiency}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sustainability</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.farmPerformance.sustainability}%</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${analyticsData.farmPerformance.sustainability}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analyticsData.revenueTracking.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getGrowthIcon(analyticsData.revenueTracking.revenueGrowth)}
              <span className={`text-sm ${getGrowthColor(analyticsData.revenueTracking.revenueGrowth)}`}>
                +{analyticsData.revenueTracking.revenueGrowth}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Analytics */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">🌱 Crop Analytics</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primary Crop */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-900">Primary Crop: {analyticsData.cropAnalytics.primaryCrop.name}</h5>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Primary</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Yield</span>
                <span className="font-medium">{analyticsData.cropAnalytics.primaryCrop.yield} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quality Score</span>
                <span className="font-medium">{analyticsData.cropAnalytics.primaryCrop.quality}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(analyticsData.cropAnalytics.primaryCrop.revenue)}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Crops */}
          <div className="bg-white border rounded-lg p-6">
            <h5 className="font-medium text-gray-900 mb-4">Secondary Crops</h5>
            <div className="space-y-4">
              {analyticsData.cropAnalytics.secondaryCrops.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{crop.name}</p>
                    <p className="text-sm text-gray-600">{crop.yield} kg • {crop.quality}% quality</p>
                  </div>
                  <p className="font-medium text-green-600">
                    {formatCurrency(crop.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Tracking */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">💰 Revenue Tracking</h4>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border rounded-lg p-6">
            <h5 className="font-medium text-gray-900 mb-4">Monthly Revenue Trend</h5>
            <div className="space-y-3">
              {analyticsData.revenueTracking.monthlyRevenue.map((month, index) => (
                <div key={month.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-600">{month.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(month.amount / Math.max(...analyticsData.revenueTracking.monthlyRevenue.map(m => m.amount))) * 100}%` 
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

          <div className="bg-white border rounded-lg p-6">
            <h5 className="font-medium text-gray-900 mb-4">Financial Health</h5>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData.revenueTracking.profitMargin}%
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Revenue Growth</p>
                <div className="flex items-center justify-center gap-1">
                  {getGrowthIcon(analyticsData.revenueTracking.revenueGrowth)}
                  <span className={`text-lg font-bold ${getGrowthColor(analyticsData.revenueTracking.revenueGrowth)}`}>
                    +{analyticsData.revenueTracking.revenueGrowth}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals & Targets */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">🎯 Goals & Targets</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            return (
              <div key={goal.id} className="bg-white border rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 text-sm">{goal.title}</h5>
                  <Badge variant="outline" className="text-xs">
                    {goal.deadline}
                  </Badge>
                </div>
                
                <div className="space-y-2">
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
              </div>
            )
          })}
        </div>
      </div>

      {/* Weather Impact */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">🌤️ Weather Impact</h4>
        <div className="bg-white border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-xl font-bold text-gray-900">{analyticsData.weatherImpact.temperature}°C</p>
            </div>
            
            <div className="text-center">
              <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-xl font-bold text-gray-900">{analyticsData.weatherImpact.humidity}%</p>
            </div>
            
            <div className="text-center">
              <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Rainfall</p>
              <p className="text-xl font-bold text-gray-900">{analyticsData.weatherImpact.rainfall}mm</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Weather conditions are favorable for crop growth
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions for Farmers */}
      <ProfileUpcomingSessions userId={userId} />
    </div>
  )
}