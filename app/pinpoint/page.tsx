import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageBackground } from '@/components/page-background'
import { Leaf, Camera, Upload, BarChart3, Target, Shield, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function PinpointPage() {
  return (
    <ProtectedRoute>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">AgriBeta Pinpoint</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AI-powered disease diagnosis and plant health monitoring. Get instant, accurate identification 
              of plant diseases and receive personalized treatment recommendations.
            </p>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-0">
              <CardContent className="pt-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-agribeta-green mb-4">
                      Diagnose Plant Diseases in Seconds
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Simply upload a photo of your plant and our advanced AI will instantly identify 
                      diseases, pests, and health issues. Get expert treatment recommendations tailored to your specific situation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/diagnosis">
                        <Button size="lg" className="bg-agribeta-green hover:bg-agribeta-green/90">
                          <Camera className="mr-2 h-5 w-5" />
                          Start Diagnosis
                        </Button>
                      </Link>
                      <Button size="lg" variant="outline">
                        <Upload className="mr-2 h-5 w-5" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                      <Leaf className="h-16 w-16 text-green-600 dark:text-green-400" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
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
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    Get disease identification in under 30 seconds with 95%+ accuracy
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Treatment Plans</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive personalized treatment recommendations and prevention strategies
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Health Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your plants' health over time with detailed analytics
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified of potential issues before they become serious problems
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Image Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced computer vision technology for precise disease detection
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Expert Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    All diagnoses are validated by certified agronomists
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Supported Crops */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Supported Crops</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Avocado', icon: '🥑', color: 'bg-green-100' },
                { name: 'Roses', icon: '🌹', color: 'bg-red-100' },
                { name: 'Maize', icon: '🌽', color: 'bg-yellow-100' },
                { name: 'Tomatoes', icon: '🍅', color: 'bg-red-100' },
                { name: 'Potatoes', icon: '🥔', color: 'bg-yellow-100' },
                { name: 'Beans', icon: '🫘', color: 'bg-green-100' },
                { name: 'Coffee', icon: '☕', color: 'bg-brown-100' },
                { name: 'Tea', icon: '🫖', color: 'bg-green-100' },
                { name: 'Bananas', icon: '🍌', color: 'bg-yellow-100' },
                { name: 'Oranges', icon: '🍊', color: 'bg-orange-100' },
                { name: 'Mangoes', icon: '🥭', color: 'bg-yellow-100' },
                { name: 'Pineapples', icon: '🍍', color: 'bg-yellow-100' }
              ].map((crop) => (
                <Card key={crop.name} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="text-3xl mb-2">{crop.icon}</div>
                    <p className="text-sm font-medium">{crop.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <CardTitle>Upload Photo</CardTitle>
                  <CardDescription>Take a clear photo of the affected plant part</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
                  </div>
                  <CardTitle>AI Analysis</CardTitle>
                  <CardDescription>Our AI analyzes the image for disease patterns</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</span>
                  </div>
                  <CardTitle>Get Results</CardTitle>
                  <CardDescription>Receive diagnosis and treatment recommendations</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-agribeta-green mb-4">Ready to Diagnose Your Plants?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join thousands of farmers who trust AgriBeta Pinpoint for accurate disease diagnosis 
                  and expert treatment recommendations.
                </p>
                <Link href="/diagnosis">
                  <Button size="lg" className="bg-agribeta-green hover:bg-agribeta-green/90">
                    <Camera className="mr-2 h-5 w-5" />
                    Start Your First Diagnosis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}


