"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { PageBackground } from '@/components/page-background'
import { 
  CheckCircle, 
  Crown, 
  Star, 
  Zap, 
  ArrowLeft,
  CreditCard,
  Shield,
  Clock
} from 'lucide-react'

export default function BillingUpgradePage() {
  const { profile } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const planId = searchParams.get('plan')

  useEffect(() => {
    if (planId) {
      setSelectedPlan(planId)
    }
  }, [planId])

  const plans = {
    free: {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      icon: <Zap className="h-8 w-8 text-gray-500" />,
      features: [
        '5 AI predictions per month',
        'Basic community access',
        'Standard support',
        'Basic analytics'
      ]
    },
    basic: {
      name: 'Basic',
      price: 29,
      description: 'For growing farms',
      icon: <Star className="h-8 w-8 text-blue-500" />,
      features: [
        '50 AI predictions per month',
        '2 agronomist consultations',
        'Priority support',
        'Advanced analytics',
        'Weather alerts',
        'Crop planning tools'
      ]
    },
    premium: {
      name: 'Premium',
      price: 79,
      description: 'For professional operations',
      icon: <Crown className="h-8 w-8 text-yellow-500" />,
      features: [
        'Unlimited AI predictions',
        '10 agronomist consultations',
        '24/7 priority support',
        'Advanced analytics & reporting',
        'Custom weather alerts',
        'Full crop planning suite',
        'API access',
        'Custom integrations'
      ]
    }
  }

  const currentPlan = profile?.subscription_tier || 'free'
  const targetPlan = selectedPlan ? plans[selectedPlan as keyof typeof plans] : null

  const handlePayment = async () => {
    if (!targetPlan) return
    
    setLoading(true)
    
    try {
      // Here you would integrate with Stripe or your payment processor
      // For now, we'll simulate the payment process
      console.log(`Processing payment for ${targetPlan.name} plan`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to success page or back to billing
      router.push('/billing?success=true')
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!targetPlan) {
    return (
      <ProtectedRoute>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <div className="container py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Plan</h1>
              <p className="text-gray-600 mb-6">The selected plan is not available.</p>
              <Button onClick={() => router.push('/billing')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Billing
              </Button>
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/billing')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Billing
              </Button>
              <h1 className="text-4xl font-bold text-agribeta-green mb-2">
                Upgrade to {targetPlan.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                Complete your upgrade to unlock advanced features
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Plan Details */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {targetPlan.icon}
                      <div>
                        <div className="text-2xl font-bold">{targetPlan.name} Plan</div>
                        <div className="text-sm text-muted-foreground">{targetPlan.description}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-agribeta-green mb-4">
                      ${targetPlan.price}
                      <span className="text-lg text-muted-foreground">/month</span>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">What you'll get:</h4>
                      {targetPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Current Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{plans[currentPlan as keyof typeof plans].name}</div>
                        <div className="text-sm text-muted-foreground">
                          {plans[currentPlan as keyof typeof plans].description}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        Current
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Form */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                    <CardDescription>
                      Secure payment powered by Stripe
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Payment form would go here */}
                    <div className="space-y-4">
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Payment form integration coming soon
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          This will be connected to Stripe for secure payments
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security & Guarantees */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security & Guarantees
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm">256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Cancel anytime</span>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-agribeta-green hover:bg-agribeta-green/90"
                    size="lg"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Complete Upgrade - ${targetPlan.price}/month
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500">
                    By upgrading, you agree to our Terms of Service and Privacy Policy.
                    You can cancel your subscription at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}
