"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useUsage } from '@/hooks/use-usage'
import { PageBackground } from '@/components/page-background'
import { 
  CheckCircle, 
  X, 
  Crown, 
  Star, 
  Zap, 
  Users, 
  BarChart3,
  DollarSign,
  Calendar,
  CreditCard
} from 'lucide-react'
import { useState } from 'react'

export default function BillingPage() {
  const { profile } = useAuth()
  const { usage } = useUsage()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        '5 AI predictions per month',
        'Basic community access',
        'Standard support',
        'Basic analytics'
      ],
      limitations: [
        'Limited AI predictions',
        'No priority support',
        'Basic features only'
      ],
      popular: false,
      current: profile?.subscription_tier === 'free'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'For growing farms',
      features: [
        '50 AI predictions per month',
        '2 agronomist consultations',
        'Priority support',
        'Advanced analytics',
        'Weather alerts',
        'Crop planning tools'
      ],
      limitations: [
        'Limited consultations',
        'Standard response time'
      ],
      popular: true,
      current: profile?.subscription_tier === 'basic'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 79,
      period: 'month',
      description: 'For professional operations',
      features: [
        'Unlimited AI predictions',
        '10 agronomist consultations',
        '24/7 priority support',
        'Advanced analytics & reporting',
        'Custom weather alerts',
        'Full crop planning suite',
        'API access',
        'Custom integrations'
      ],
      limitations: [],
      popular: false,
      current: profile?.subscription_tier === 'premium'
    }
  ]

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId)
    
    // Check if user is logged in
    if (!user) {
      // Store selected plan and redirect to auth
      localStorage.setItem('selectedPlan', planId)
      window.location.href = `/auth?plan=${planId}`
      return
    }

    // For existing users, redirect to payment flow
    window.location.href = `/billing/upgrade?plan=${planId}`
  }

  return (
    <ProtectedRoute>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">Billing & Subscriptions</h1>
            <p className="text-lg text-muted-foreground">
              Choose the perfect plan for your farming needs and manage your subscription.
            </p>
          </div>

          {/* Current Plan Status */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Current Plan</h3>
                    <p className="text-muted-foreground">
                      {profile?.subscription_tier ? profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1) : 'Free'} Plan
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {profile?.subscription_tier === 'free' ? 'Free' : 'Active'}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {usage?.ai_predictions.used || 0}/{usage?.ai_predictions.limit || 5} AI predictions used
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${
                    plan.popular ? 'border-2 border-agribeta-green shadow-lg' : ''
                  } ${
                    plan.current ? 'bg-green-50 border-green-200' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-agribeta-green text-white">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      {plan.id === 'free' && <Users className="h-8 w-8 text-gray-600" />}
                      {plan.id === 'basic' && <Star className="h-8 w-8 text-blue-600" />}
                      {plan.id === 'premium' && <Crown className="h-8 w-8 text-yellow-600" />}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div className="space-y-2 pt-2 border-t">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4">
                      {plan.current ? (
                        <Button disabled className="w-full">
                          Current Plan
                        </Button>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => handleUpgrade(plan.id)}
                        >
                          {plan.price === 0 ? 'Downgrade' : 'Upgrade'} to {plan.name}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Usage Analytics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Usage Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Predictions</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {usage?.ai_predictions.used || 0}/{usage?.ai_predictions.limit || 5}
                      </p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Consultations</h3>
                      <p className="text-2xl font-bold text-green-600">0/0</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Analytics Views</h3>
                      <p className="text-2xl font-bold text-purple-600">12</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment History */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Payment History</h3>
                  <p className="text-muted-foreground">
                    You're currently on the free plan. Upgrade to see your payment history.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Billing Information</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Next Billing Date</h3>
                    <p className="text-muted-foreground">
                      {profile?.subscription_tier === 'free' ? 'No billing date' : 'Coming soon'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <p className="text-muted-foreground">
                      {profile?.subscription_tier === 'free' ? 'No payment method' : 'Add payment method'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}
