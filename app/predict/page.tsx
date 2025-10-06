import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageBackground } from '@/components/page-background'
import { Target, TrendingUp, Cloud, Calendar, AlertTriangle, BarChart3, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function PredictPage() {
  return (
    <ProtectedRoute>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">AgriBeta Predict</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Predictive analytics for smart farming. Use weather data, historical patterns, and AI algorithms 
              to forecast pest outbreaks, optimize planting schedules, and make data-driven decisions.
            </p>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-0">
              <CardContent className="pt-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-agribeta-orange mb-4">
                      Predict the Future of Your Farm
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Leverage advanced AI and machine learning to predict pest outbreaks, weather patterns, 
                      and optimal farming conditions. Stay ahead of challenges and maximize your yields.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="bg-agribeta-orange hover:bg-agribeta-orange/90">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        View Predictions
                      </Button>
                      <Button size="lg" variant="outline">
                        <Calendar className="mr-2 h-5 w-5" />
                        Schedule Analysis
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
                      <Target className="h-16 w-16 text-orange-600 dark:text-orange-400" />
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      AI-Powered
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Weather Forecasting</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced weather predictions for optimal farming decisions
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Pest Outbreak Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Early warning system for pest and disease outbreaks
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Optimal Planting</h3>
                  <p className="text-sm text-muted-foreground">
                    Data-driven recommendations for best planting times
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Yield Predictions</h3>
                  <p className="text-sm text-muted-foreground">
                    Forecast crop yields based on current conditions
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Live data updates and instant notifications
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Risk Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive risk analysis and mitigation strategies
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Prediction Types */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">What We Predict</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                    Pest & Disease Outbreaks
                  </CardTitle>
                  <CardDescription>Early pinpointing and prevention strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>False Codling Moth infestations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Fungal disease outbreaks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Viral disease spread</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Insect population trends</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Cloud className="h-5 w-5" />
                    Weather & Climate
                  </CardTitle>
                  <CardDescription>Environmental condition forecasting</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Rainfall patterns</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Temperature fluctuations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Humidity levels</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Wind conditions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Calendar className="h-5 w-5" />
                    Optimal Timing
                  </CardTitle>
                  <CardDescription>Best practices scheduling</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Planting windows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Harvest timing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Irrigation schedules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Treatment applications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <BarChart3 className="h-5 w-5" />
                    Yield Forecasting
                  </CardTitle>
                  <CardDescription>Production predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Crop yield estimates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Quality predictions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Market timing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Resource planning</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">How Our AI Predicts</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <CardTitle>Data Collection</CardTitle>
                  <CardDescription>Gather weather, soil, and historical data</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
                  </div>
                  <CardTitle>AI Analysis</CardTitle>
                  <CardDescription>Machine learning algorithms process data</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</span>
                  </div>
                  <CardTitle>Pattern Recognition</CardTitle>
                  <CardDescription>Identify trends and correlations</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">4</span>
                  </div>
                  <CardTitle>Predictions</CardTitle>
                  <CardDescription>Generate accurate forecasts</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-agribeta-orange mb-4">Ready to Predict Your Farm's Future?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join the smart farming revolution with AI-powered predictions that help you make 
                  better decisions and increase your farm's productivity.
                </p>
                <Button size="lg" className="bg-agribeta-orange hover:bg-agribeta-orange/90">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Access Predictions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}


