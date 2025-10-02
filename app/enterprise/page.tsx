import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageBackground } from '@/components/page-background'
import { Leaf, Target, Shield, BarChart3, Users, Zap, Award, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function EnterprisePage() {
  return (
    <ProtectedRoute>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">AgriBeta Enterprise</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive agricultural management solutions designed for modern farming operations. 
              Access premium tools, expert insights, and advanced analytics to optimize your farm's performance.
            </p>
          </div>

          {/* Enterprise Suite Overview */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Our Enterprise Suite</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pinpoint */}
              <Card className="hover:shadow-lg transition-shadow border-2 border-green-200 dark:border-green-800">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl text-green-700 dark:text-green-300">AgriBeta Pinpoint</CardTitle>
                  <CardDescription>AI-powered disease diagnosis and plant health monitoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Instant disease identification</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Treatment recommendations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Prevention strategies</span>
                    </div>
                  </div>
                  <Link href="/pinpoint">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Predict */}
              <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200 dark:border-orange-800">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-xl text-orange-700 dark:text-orange-300">AgriBeta Predict</CardTitle>
                  <CardDescription>Predictive analytics for crop planning and risk management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Weather-based predictions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Pest outbreak forecasting</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Optimal planting schedules</span>
                    </div>
                  </div>
                  <Link href="/predict">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Protect */}
              <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-blue-700 dark:text-blue-300">AgriBeta Protect</CardTitle>
                  <CardDescription>Compliance monitoring and quality assurance systems</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>FCM compliance tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Quality standards monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Audit trail management</span>
                    </div>
                  </div>
                  <Link href="/fcm-management">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Enterprise Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive insights and reporting</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Team Management</h3>
                  <p className="text-sm text-muted-foreground">Collaborate with your farm team</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">Live monitoring and alerts</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Premium Support</h3>
                  <p className="text-sm text-muted-foreground">Priority customer service</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <Card className="border-2">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-3xl font-bold">$0<span className="text-lg text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Basic disease diagnosis (5/month)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Community access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Basic analytics</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Basic Tier */}
              <Card className="border-2 border-agribeta-green">
                <CardHeader className="text-center">
                  <Badge className="w-fit mx-auto mb-2 bg-agribeta-green text-white">Popular</Badge>
                  <CardTitle className="text-xl">Basic</CardTitle>
                  <CardDescription>For growing farms</CardDescription>
                  <div className="text-3xl font-bold">$29<span className="text-lg text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Unlimited disease diagnosis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Priority support</span>
                    </div>
                  </div>
                  <Button className="w-full bg-agribeta-green hover:bg-agribeta-green/90">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Tier */}
              <Card className="border-2 border-agribeta-orange">
                <CardHeader className="text-center">
                  <Badge className="w-fit mx-auto mb-2 bg-agribeta-orange text-white">Enterprise</Badge>
                  <CardTitle className="text-xl">Premium</CardTitle>
                  <CardDescription>For large operations</CardDescription>
                  <div className="text-3xl font-bold">$99<span className="text-lg text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>All Basic features</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Team management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Custom integrations</span>
                    </div>
                  </div>
                  <Button className="w-full bg-agribeta-orange hover:bg-agribeta-orange/90">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-agribeta-green mb-4">Ready to Transform Your Farm?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join thousands of farmers who are already using AgriBeta Enterprise to increase yields, 
                  reduce costs, and make data-driven decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-agribeta-green hover:bg-agribeta-green/90">
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
} 