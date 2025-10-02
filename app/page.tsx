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
      {/* Hero Section with Background Image */}
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
          <div className="flex flex-col gap-6 min-[400px]:flex-row">
            <Link href="/auth">
              <Button size="lg" className="bg-agribeta-orange hover:bg-agribeta-orange/90 text-white font-semibold px-10 py-4 text-lg rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105">
                Start 30-Day Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 font-semibold px-10 py-4 text-lg rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
              >
                Watch 2-Min Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Suite Section */}
      <section className="w-full py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-agribeta-green mb-4">SPECIALIZED FOR AVOCADO & ROSE FARMERS</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered solutions designed specifically for avocado and rose farming in Africa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Agribeta Pinpoint - Primary Product */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-agribeta-orange dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
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
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-200 dark:border-green-800">
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-agribeta-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">📈</span>
                </div>
                <CardTitle className="text-2xl text-agribeta-green mb-2">Agribeta Predict</CardTitle>
                <CardDescription className="text-base">Early warning system for avocado and rose pest outbreaks</CardDescription>
              </CardContent>
            </Card>

            {/* Agribeta Protect */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-200 dark:border-green-800">
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

      {/* AI-Powered Features Section */}
      <section className="w-full py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-agribeta-green mb-4">TRAINED ON 50,000+ AVOCADO & ROSE DISEASE IMAGES</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI is specifically trained on African avocado and rose diseases to provide accurate, localized diagnoses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-agribeta-green mb-2">Predict</h3>
              <p className="text-muted-foreground">Early warning for avocado anthracnose and rose black spot</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-agribeta-green mb-2">Pinpoint</h3>
              <p className="text-muted-foreground">94% accurate disease diagnosis in 30 seconds</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-agribeta-green mb-2">Protect</h3>
              <p className="text-muted-foreground">Localized treatment recommendations for African conditions</p>
            </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
      <section className="w-full py-16 bg-agribeta-green">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Protect Your Avocado & Rose Crops?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join 10,000+ avocado and rose farmers across Africa who are already using AgriBeta to detect diseases early and increase yields by 25%.
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-agribeta-green hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105">
              Start Free Trial
            </Button>
          </Link>
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
            <h2 className="text-2xl font-bold tracking-tighter text-agribeta-green">
              Join the Avocado & Rose Farming Revolution
            </h2>
            <p className="max-w-[600px] text-gray-600 dark:text-gray-400 md:text-lg">
              Connect with avocado and rose farmers across Africa. Get AI-powered disease detection, expert advice, and grow together.
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