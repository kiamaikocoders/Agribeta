"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, Crown, Star, Zap, Users, BarChart3, DollarSign, Calendar, CreditCard, Shield, Globe, Target } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for getting started',
      icon: <Zap className="h-8 w-8 text-gray-500" />,
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
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'For growing farms',
      icon: <Star className="h-8 w-8 text-agribeta-green" />,
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
      buttonText: 'Register',
      buttonVariant: 'default' as const
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 79,
      period: 'month',
      description: 'For professional operations',
      icon: <Crown className="h-8 w-8 text-yellow-500" />,
      features: [
        'Unlimited AI predictions',
        '10 agronomist consultations',
        '24/7 priority support',
        'Advanced analytics & reporting',
        'Real-time weather alerts',
        'Complete crop planning suite',
        'Market analysis tools',
        'Custom integrations'
      ],
      limitations: [],
      popular: false,
      buttonText: 'Register',
      buttonVariant: 'default' as const
    }
  ]

  const handlePlanSelect = (planId: string) => {
    // Store selected plan in localStorage for signup flow
    localStorage.setItem('selectedPlan', planId)
    // Redirect to auth with plan parameter
    window.location.href = `/auth?plan=${planId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create your account and start with our 7-day free trial. No credit card required. 
            Upgrade or downgrade at any time.
          </p>
          
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 text-green-600 mb-8">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Create account & start trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>No setup fees</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto">
          {/* Mobile: Horizontal scroll with center focus */}
          <div className="md:hidden">
            <div className="relative">
              {/* Scroll container */}
              <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide px-4" style={{ scrollPaddingLeft: 'calc(50vw - 150px)' }}>
                {/* Spacer to center first card */}
                <div className="flex-shrink-0 w-[calc(50vw-150px)]"></div>
                
                {plans.map((plan, index) => (
                  <Card 
                    key={plan.id} 
                    className={`relative min-w-[300px] flex-shrink-0 ${plan.popular ? 'border-agribeta-green shadow-xl' : 'border-gray-200'} transition-all duration-300 hover:shadow-lg`}
                    style={{ scrollSnapAlign: 'center' }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-agribeta-green text-white px-4 py-2 text-sm font-semibold shadow-lg">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-6 pt-8">
                      <div className="flex justify-center mb-4">
                        {plan.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-300 mb-4">
                        {plan.description}
                      </CardDescription>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">
                          ${plan.price}
                        </span>
                        <span className="text-gray-300 ml-1">/{plan.period}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Features */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">What's included:</h4>
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-200 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Limitations */}
                      {plan.limitations.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-white">Limitations:</h4>
                          {plan.limitations.map((limitation, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-red-300 text-sm">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA Button */}
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-agribeta-green hover:bg-agribeta-green/90 text-white' : 'text-white'}`}
                        variant={plan.buttonVariant}
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        {plan.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Spacer to center last card */}
                <div className="flex-shrink-0 w-[calc(50vw-150px)]"></div>
              </div>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-agribeta-green shadow-xl scale-105' : 'border-gray-200'} transition-all duration-300 hover:shadow-lg`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-agribeta-green text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-300 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-300 ml-1">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">What's included:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-200">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white">Limitations:</h4>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-red-300">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-agribeta-green hover:bg-agribeta-green/90 text-white' : 'text-white'}`}
                    variant={plan.buttonVariant}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What happens after my free trial?</h3>
              <p className="text-gray-600">
                After 7 days, you'll be automatically charged for your selected plan. You can cancel anytime before the trial ends.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Is there a setup fee?</h3>
              <p className="text-gray-600">
                No setup fees, no hidden costs. You only pay the monthly subscription fee for your chosen plan.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of farmers already using AgriBeta to increase their yields.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-agribeta-green hover:bg-agribeta-green/90 text-white px-8 py-4 text-lg">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}