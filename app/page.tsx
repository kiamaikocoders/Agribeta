"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, profile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirect logged-in users to their appropriate dashboard
      if (profile?.role === 'farmer') {
        router.push('/dashboard/farmer')
      } else if (profile?.role === 'agronomist') {
        router.push('/dashboard/agronomist')
      } else if (profile?.role === 'admin') {
        router.push('/dashboard/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, profile, router])

  // Show loading while redirecting
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-agribeta-green mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Original Hero Section with Background Image */}
      <section className="w-full py-24 md:py-32 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/smart-agriculture-bg.png"
            alt="Smart Agriculture Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10 text-white flex flex-col items-center justify-center text-center min-h-[70vh]">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none mb-6 uppercase">
            AGRIBETA
          </h1>
          <h2 className="text-5xl sm:text-7xl xl:text-8xl/none font-extrabold text-agribeta-orange uppercase mb-8">
            WE POWER. YOU GROW.
          </h2>
          <p className="max-w-[900px] text-xl md:text-2xl lg:text-3xl mb-12 leading-relaxed">
            AI-Powered Disease Detection for Avocado & Rose Farmers in Africa
          </p>
          <div className="flex flex-col gap-4 sm:gap-6 min-[400px]:flex-row">
            <Link href="/auth">
              <Button size="lg" className="bg-agribeta-orange hover:bg-agribeta-orange/90 text-white font-bold px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg rounded-full shadow-xl transition-all duration-300 ease-in-out hover:scale-105 w-full min-[400px]:w-auto border-2 border-white/20">
                Create Account
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 font-bold px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg rounded-full shadow-xl transition-all duration-300 ease-in-out hover:scale-105 w-full min-[400px]:w-auto"
              >
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AGRIBETA ONE Section */}
      <section className="w-full py-16 bg-gradient-to-br from-green-50 to-green-100">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Section - Text Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-green-800 mb-4">AGRIBETA ONE</h2>
              <p className="text-xl text-gray-600 mb-6 font-medium">
                Smart Pest & Disease Management Platform
              </p>
              
              {/* Three Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 text-base rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                  PREDICT
                </Button>
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 text-base rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                  DETECT
                </Button>
                <Button 
                  size="lg" 
                  className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 text-base rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                  PROTECT
                </Button>
              </div>

              {/* Feature List */}
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Easy-to-use interface for farmers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Real-time alerts & smart advice</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Works offline in remote areas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Supports local languages</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Tracks pest & disease trends</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Empowers better farm decisions</span>
                </div>
              </div>
            </div>

            {/* Right Section - Mobile App Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-64 h-[480px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-green-800 rounded-[2rem] overflow-hidden relative">
                    {/* App Header */}
                    <div className="bg-green-900 px-4 py-3 flex items-center gap-3">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-green-900 rounded-full"></div>
                      </div>
                      <h3 className="text-white font-semibold text-base">PREDICT</h3>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-4 space-y-4">
                      {/* Risk Assessment Icons */}
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-1">
                            <div className="text-white text-lg">🐛</div>
                          </div>
                          <p className="text-white text-xs font-medium">PEST RISK</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="text-white text-2xl">🍀</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-1">
                            <div className="text-white text-lg">🦠</div>
                          </div>
                          <p className="text-white text-xs font-medium">DISEASE RISK</p>
                        </div>
                      </div>

                      {/* Risk Assessment Card */}
                      <div className="bg-white rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium text-sm">Pest Risk:</span>
                          <span className="text-red-600 font-bold text-sm">High</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium text-sm">Disease Risk:</span>
                          <span className="text-orange-600 font-bold text-sm">Moderate</span>
                        </div>
                        <div className="border-t pt-2">
                          <h4 className="text-gray-900 font-bold mb-1 text-sm">RECOMMENDATIONS</h4>
                          <p className="text-gray-600 text-xs">
                            Apply biological pest at early sign of infestation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Pest & Disease Management Section */}
      <section className="w-full py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">INTEGRATED PEST & DISEASE MANAGEMENT</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Holistic, comprehensive, multi-faceted, multi-layered, preventive & curative measures
            </p>
          </div>
          
          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:hidden">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {/* PREDICT */}
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl min-w-[280px] snap-center">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">📊</span>
                  </div>
                  <CardTitle className="text-2xl text-green-800 mb-4">1. PREDICTION</CardTitle>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">Environmental data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">Observational data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">Pest & disease trends</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">Early warning systems</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DETECT */}
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl min-w-[280px] snap-center">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <CardTitle className="text-2xl text-orange-800 mb-4">2. DETECTION</CardTitle>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Image recognition through</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">machine learning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Real-time analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">94% accuracy rate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PROTECT */}
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-300 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl min-w-[280px] snap-center">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">🚜</span>
                  </div>
                  <CardTitle className="text-2xl text-green-800 mb-4">3. PROTECTION</CardTitle>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                      <span className="text-gray-700">Precision agriculture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                      <span className="text-gray-700">Technology, data & innovative practices</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                      <span className="text-gray-700">Optimize efficiency, precision</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                      <span className="text-gray-700">& sustainability of operations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {/* PREDICT */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <CardTitle className="text-2xl text-green-800 mb-4">1. PREDICTION</CardTitle>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Environmental data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Observational data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Pest & disease trends</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Early warning systems</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DETECT */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">🔍</span>
                </div>
                <CardTitle className="text-2xl text-orange-800 mb-4">2. DETECTION</CardTitle>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Image recognition through</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">machine learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Real-time analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">94% accuracy rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PROTECT */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-300 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">🚜</span>
                </div>
                <CardTitle className="text-2xl text-green-800 mb-4">3. PROTECTION</CardTitle>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                    <span className="text-gray-700">Precision agriculture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                    <span className="text-gray-700">Technology, data & innovative practices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                    <span className="text-gray-700">Optimize efficiency, precision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                    <span className="text-gray-700">& sustainability of operations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="w-full py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-agribeta-orange mb-4">WHY WE EXIST</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We're on a mission to transform avocado and rose farming in Africa through AI-powered disease detection—empowering every farmer to detect problems early, treat effectively, and maximize their harvest.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-agribeta-green mb-2">Empower Farmers</h3>
              <p className="text-muted-foreground">Providing tools and knowledge to enhance agricultural practices</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-agribeta-green mb-2">Enable Trade</h3>
              <p className="text-muted-foreground">Facilitating better market access and fair trade for farmers</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-agribeta-green mb-2">Build Resilience</h3>
              <p className="text-muted-foreground">Strengthening agricultural systems against challenges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized for Avocado & Rose Farmers Section */}
      <section className="w-full py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-agribeta-green mb-4">SPECIALIZED FOR AVOCADO & ROSE FARMERS</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered solutions designed specifically for avocado and rose farming in Africa
            </p>
          </div>
          
          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:hidden">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {/* Agribeta Pinpoint - Primary Product */}
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-agribeta-orange dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl min-w-[280px] snap-center">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-agribeta-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <CardTitle className="text-2xl text-agribeta-green mb-2">Agribeta Pinpoint</CardTitle>
                  <CardDescription className="text-base mb-4">AI-powered disease diagnosis for avocados and roses with 94% accuracy</CardDescription>
                  <div className="bg-agribeta-green/10 text-agribeta-green px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </CardContent>
              </Card>

              {/* Agribeta Predict */}
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-200 dark:border-green-800 rounded-2xl min-w-[280px] snap-center">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-agribeta-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">📈</span>
              </div>
                  <CardTitle className="text-2xl text-agribeta-green mb-2">Agribeta Predict</CardTitle>
                  <CardDescription className="text-base">Early warning system for avocado and rose pest outbreaks</CardDescription>
                </CardContent>
              </Card>

              {/* Agribeta Protect */}
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-200 dark:border-green-800 rounded-2xl min-w-[280px] snap-center">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-agribeta-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <CardTitle className="text-2xl text-agribeta-green mb-2">Agribeta Protect</CardTitle>
                  <CardDescription className="text-base">Timely treatment recommendations for avocado and rose diseases</CardDescription>
                </CardContent>
              </Card>
            </div>
            </div>
            
          {/* Desktop: Grid layout */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {/* Agribeta Pinpoint - Primary Product */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-agribeta-orange dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl">
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-agribeta-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🎯</span>
              </div>
                <CardTitle className="text-2xl text-agribeta-green mb-2">Agribeta Pinpoint</CardTitle>
                <CardDescription className="text-base mb-4">AI-powered disease diagnosis for avocados and roses with 94% accuracy</CardDescription>
                <div className="bg-agribeta-green/10 text-agribeta-green px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </CardContent>
            </Card>

            {/* Agribeta Predict */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-200 dark:border-green-800 rounded-2xl">
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-agribeta-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">📈</span>
            </div>
                <CardTitle className="text-2xl text-agribeta-green mb-2">Agribeta Predict</CardTitle>
                <CardDescription className="text-base">Early warning system for avocado and rose pest outbreaks</CardDescription>
              </CardContent>
            </Card>

            {/* Agribeta Protect */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-200 dark:border-green-800 rounded-2xl">
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-agribeta-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🛡️</span>
              </div>
                <CardTitle className="text-2xl text-agribeta-green mb-2">Agribeta Protect</CardTitle>
                <CardDescription className="text-base">Timely treatment recommendations for avocado and rose diseases</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="w-full py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-agribeta-orange mb-4">OUR VALUES</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide our mission and drive our innovation
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-bold text-agribeta-green">Integrity</h3>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-bold text-agribeta-green">Resilience</h3>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-bold text-agribeta-green">Clarity</h3>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-agribeta-green">Empowerment</h3>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-bold text-agribeta-green">Innovation</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-16 bg-green-800">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Farm with AGRIBETA ONE?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers across Africa who are already using AGRIBETA ONE to predict, detect, and protect their crops with AI-powered precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth">
              <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105">
              Start Free Trial
            </Button>
          </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 font-semibold px-8 py-3 text-lg rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/agribeta-logo.png" 
                alt="AgriBeta Logo" 
                width={80} 
                height={30} 
                className="h-8 w-auto" 
                priority 
              />
              <span className="text-xl font-bold text-agribeta-green">AgriBeta</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tighter text-green-800">
              Join the AGRIBETA ONE Revolution
            </h2>
            <p className="max-w-[600px] text-gray-600 dark:text-gray-400 md:text-lg">
              Connect with farmers across Africa using AGRIBETA ONE. Get AI-powered pest and disease management, expert advice, and grow together.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-agribeta-green hover:bg-agribeta-green/90">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}