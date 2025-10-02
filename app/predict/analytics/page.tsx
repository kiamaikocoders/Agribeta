"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageBackground } from '@/components/page-background'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Droplets,
  Sun,
  Wind
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface PredictionData {
  disease_risk: {
    high: number
    medium: number
    low: number
  }
  weather_impact: {
    temperature: number
    humidity: number
    rainfall: number
  }
  seasonal_trends: {
    month: string
    risk_level: number
    common_diseases: string[]
  }[]
  farm_performance: {
    total_predictions: number
    accuracy_rate: number
    cost_savings: number
    prevented_losses: number
  }
}

export default function PredictAnalyticsPage() {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockData: PredictionData = {
      disease_risk: {
        high: 15,
        medium: 35,
        low: 50
      },
      weather_impact: {
        temperature: 28,
        humidity: 75,
        rainfall: 15
      },
      seasonal_trends: [
        { month: 'Jan', risk_level: 0.3, common_diseases: ['Anthracnose', 'Root Rot'] },
        { month: 'Feb', risk_level: 0.4, common_diseases: ['Anthracnose', 'Leaf Spot'] },
        { month: 'Mar', risk_level: 0.6, common_diseases: ['Anthracnose', 'Leaf Spot', 'Powdery Mildew'] },
        { month: 'Apr', risk_level: 0.7, common_diseases: ['Anthracnose', 'Leaf Spot', 'Powdery Mildew'] },
        { month: 'May', risk_level: 0.5, common_diseases: ['Leaf Spot', 'Root Rot'] },
        { month: 'Jun', risk_level: 0.3, common_diseases: ['Root Rot'] },
        { month: 'Jul', risk_level: 0.2, common_diseases: ['Root Rot'] },
        { month: 'Aug', risk_level: 0.3, common_diseases: ['Root Rot', 'Anthracnose'] },
        { month: 'Sep', risk_level: 0.5, common_diseases: ['Anthracnose', 'Leaf Spot'] },
        { month: 'Oct', risk_level: 0.6, common_diseases: ['Anthracnose', 'Leaf Spot', 'Powdery Mildew'] },
        { month: 'Nov', risk_level: 0.4, common_diseases: ['Anthracnose', 'Leaf Spot'] },
        { month: 'Dec', risk_level: 0.3, common_diseases: ['Anthracnose', 'Root Rot'] }
      ],
      farm_performance: {
        total_predictions: 45,
        accuracy_rate: 92,
        cost_savings: 1250,
        prevented_losses: 3500
      }
    }

    setTimeout(() => {
      setPredictionData(mockData)
      setLoading(false)
    }, 1000)
  }, [selectedPeriod])

  if (loading) {
    return (
      <ProtectedRoute>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <div className="container py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agribeta-green mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading analytics...</p>
              </div>
            </div>
          </div>
        </PageBackground>
      </ProtectedRoute>
    )
  }

  if (!predictionData) {
    return (
      <ProtectedRoute>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <div className="container py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">No Data Available</h1>
              <p className="text-muted-foreground">Analytics data is not available at the moment.</p>
            </div>
          </div>
        </PageBackground>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">Predict Analytics</h1>
            <p className="text-lg text-muted-foreground">
              AI-powered insights and predictions for your farm's disease risk management.
            </p>
          </div>

          {/* Period Selector */}
          <div className="mb-6">
            <div className="flex gap-2">
              {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          {/* Farm Performance Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Farm Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Total Predictions</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {predictionData.farm_performance.total_predictions}
                      </p>
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
                      <h3 className="font-semibold">Accuracy Rate</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {predictionData.farm_performance.accuracy_rate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Cost Savings</h3>
                      <p className="text-2xl font-bold text-green-600">
                        ${predictionData.farm_performance.cost_savings}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Prevented Losses</h3>
                      <p className="text-2xl font-bold text-purple-600">
                        ${predictionData.farm_performance.prevented_losses}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Disease Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Disease Risk Distribution
                </CardTitle>
                <CardDescription>
                  Current risk levels across your farm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm">High Risk</span>
                    </div>
                    <span className="font-semibold">{predictionData.disease_risk.high}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${predictionData.disease_risk.high}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm">Medium Risk</span>
                    </div>
                    <span className="font-semibold">{predictionData.disease_risk.medium}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${predictionData.disease_risk.medium}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm">Low Risk</span>
                    </div>
                    <span className="font-semibold">{predictionData.disease_risk.low}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${predictionData.disease_risk.low}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Weather Impact Analysis
                </CardTitle>
                <CardDescription>
                  Current weather conditions affecting disease risk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium">Temperature</span>
                  </div>
                  <span className="font-semibold">{predictionData.weather_impact.temperature}°C</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Humidity</span>
                  </div>
                  <span className="font-semibold">{predictionData.weather_impact.humidity}%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Rainfall</span>
                  </div>
                  <span className="font-semibold">{predictionData.weather_impact.rainfall}mm</span>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Risk Assessment</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Current weather conditions indicate moderate disease risk. 
                    Monitor for early signs of fungal infections.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seasonal Trends */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Seasonal Disease Trends</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Risk Levels
                </CardTitle>
                <CardDescription>
                  Disease risk patterns throughout the year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {predictionData.seasonal_trends.map((trend) => (
                    <div key={trend.month} className="text-center">
                      <div className="mb-2">
                        <div 
                          className={`w-full h-16 rounded-lg flex items-end justify-center ${
                            trend.risk_level > 0.6 ? 'bg-red-500' :
                            trend.risk_level > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ height: `${trend.risk_level * 64}px` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {Math.round(trend.risk_level * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{trend.month}</p>
                      <div className="mt-1">
                        {trend.common_diseases.slice(0, 2).map((disease, index) => (
                          <Badge key={index} variant="secondary" className="text-xs mr-1">
                            {disease}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Immediate Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">High Priority</h4>
                        <p className="text-sm text-red-700">
                          Apply preventative fungicide to high-risk areas within 48 hours.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">This Week</h4>
                        <p className="text-sm text-yellow-700">
                          Schedule additional monitoring for areas with medium risk levels.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Long-term Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Next Month</h4>
                        <p className="text-sm text-blue-700">
                          Plan irrigation schedule adjustments to reduce humidity levels.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Seasonal Prep</h4>
                        <p className="text-sm text-green-700">
                          Prepare for increased disease risk during the upcoming wet season.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}
