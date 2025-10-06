"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { Loader2, User, Briefcase, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const { signIn, signUp, profile, user, loading } = useAuth()
  const router = useRouter()

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  })

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'farmer' as 'farmer' | 'agronomist',
    bio: '',
    farm_name: '',
    company: '',
    industry: '',
    country: '',
    phone: '',
    linkedin_url: '',
    // Farmer specific
    farm_size: '',
    farm_location: '',
    primary_crop: '',
    secondary_crops: [] as string[],
    planting_season: '',
    irrigation_type: '',
    pest_management_method: '',
    soil_type: '',
    // Agronomist specific
    title: '',
    years_experience: '',
    specializations: [] as string[],
    certifications: [] as string[],
    hourly_rate: '',
    consultation_fee: '',
    timezone: '',
  })

  // Profile completion will be handled on `/profile/complete` after email confirmation

  // Don't render the form if user is already authenticated
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-agribeta-green" />
      </div>
    )
  }

  if (user && profile) {
    return null // The parent component will handle the redirect
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)


    // Client-side validation
    if (!signInData.email || !signInData.password) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    if (!signInData.email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    const { error } = await signIn(signInData.email, signInData.password)

    if (error) {
      console.error('Signin error details:', error)
      let errorMessage = 'Failed to sign in. Please try again.'
      let errorTitle = 'Sign In Error'
      
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the verification link before signing in.'
        errorTitle = 'Email Verification Required'
      } else if (error.message?.includes('Invalid login credentials') || error.message?.includes('invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        errorTitle = 'Invalid Credentials'
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Too many failed attempts. Please wait a few minutes before trying again.'
        errorTitle = 'Too Many Attempts'
      } else if (error.message?.includes('Signups not allowed')) {
        errorMessage = 'This account may not exist. Try signing up first.'
        errorTitle = 'Account Not Found'
      } else if (error.message?.includes('User not found')) {
        errorMessage = 'No account found with this email address. Please check your email or sign up for a new account.'
        errorTitle = 'Account Not Found'
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.'
        errorTitle = 'Invalid Email'
      } else if (error.message?.includes('Password is too weak')) {
        errorMessage = 'Password is too weak. Please use a stronger password.'
        errorTitle = 'Weak Password'
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
        errorTitle = 'Connection Error'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      // Fallback for any unrecognized error
      if (errorMessage === 'Failed to sign in. Please try again.') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        errorTitle = 'Invalid Credentials'
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Welcome Back!',
        description: 'You have been signed in successfully.',
      })
      // Redirect based on user role
      if (profile?.role === 'admin') {
        router.push('/dashboard/admin')
      } else if (profile?.role === 'farmer') {
        router.push('/dashboard/farmer')
      } else if (profile?.role === 'agronomist') {
        router.push('/dashboard/agronomist')
      } else {
        router.push('/dashboard/networks')
      }
    }

    setIsLoading(false)
  }

      const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      // Client-side validation
      if (!signUpData.email || !signUpData.password || !signUpData.first_name || !signUpData.last_name) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      if (!signUpData.email.includes('@')) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      if (signUpData.password.length < 6) {
        toast({
          title: 'Password Too Short',
          description: 'Password must be at least 6 characters long.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      const { error } = await signUp(signUpData.email, signUpData.password, null)

      // No profile creation here; handled post-confirmation

      if (error) {
        console.error('Signup error details:', error)
        let errorMessage = 'Failed to create account. Please try again.'
        let errorTitle = 'Signup Error'
        
        if (error.message?.includes('User already registered')) {
          errorMessage = 'This email is already registered. Try signing in instead.'
          errorTitle = 'Email Already Registered'
          setActiveTab('signin')
        } else if (error.message?.includes('Password should be')) {
          errorMessage = 'Password must be at least 6 characters long.'
          errorTitle = 'Password Too Short'
        } else if (error.message?.includes('signup is disabled')) {
          errorMessage = 'Account registration is currently disabled.'
          errorTitle = 'Registration Disabled'
        } else if (error.message?.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.'
          errorTitle = 'Invalid Email'
        } else if (error.message?.includes('Password is too weak')) {
          errorMessage = 'Password is too weak. Please use a stronger password with at least 6 characters.'
          errorTitle = 'Weak Password'
        } else if (error.message?.includes('Email rate limit exceeded')) {
          errorMessage = 'Too many verification emails sent. Please wait before requesting another.'
          errorTitle = 'Email Rate Limit'
        } else if (error.message?.includes('Network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.'
          errorTitle = 'Connection Error'
        } else if (error.message) {
          errorMessage = error.message
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Account Created!',
          description: 'Check your email to confirm your account, then complete your profile.',
        })
        // Don't redirect immediately - let user verify email first
        setActiveTab('signin')
      }

      setIsLoading(false)
    }

  const industries = [
    'Avocado Farming',
    'Rose Cultivation',
    'Vegetable Farming',
    'Fruit Farming',
    'Organic Farming',
    'Greenhouse Management',
    'Agricultural Consulting',
    'Research & Development',
    'Other'
  ]

  const crops = [
    'Avocado',
    'Roses',
    'Tomatoes',
    'Peppers',
    'Lettuce',
    'Spinach',
    'Herbs',
    'Cucumber',
    'Beans',
    'Other'
  ]

  const specializations = [
    'Disease Management',
    'Pest Control',
    'Soil Health',
    'Irrigation Systems',
    'Organic Farming',
    'Greenhouse Technology',
    'Crop Nutrition',
    'Post-Harvest Handling',
    'Integrated Pest Management',
    'Sustainable Agriculture'
  ]

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-agribeta-green">Welcome to AgriBeta</CardTitle>
          <CardDescription>
            Join the leading agricultural management platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-agribeta-green hover:bg-agribeta-green/90"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
                <div className="text-center text-sm">
                  <Link href="/auth/reset-password" className="text-agribeta-green hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">I am a:</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Card 
                      className={`cursor-pointer transition-all ${signUpData.role === 'farmer' ? 'ring-2 ring-agribeta-green bg-agribeta-green/5' : 'hover:bg-gray-50'}`}
                      onClick={() => setSignUpData(prev => ({ ...prev, role: 'farmer' }))}
                    >
                      <CardContent className="flex flex-col items-center p-6">
                        <User className="h-8 w-8 text-agribeta-green mb-2" />
                        <h3 className="font-semibold">Farmer</h3>
                        <p className="text-sm text-gray-600 text-center">
                          Grow crops, manage farm operations, get expert advice
                        </p>
                      </CardContent>
                    </Card>
                    <Card 
                      className={`cursor-pointer transition-all ${signUpData.role === 'agronomist' ? 'ring-2 ring-agribeta-green bg-agribeta-green/5' : 'hover:bg-gray-50'}`}
                      onClick={() => setSignUpData(prev => ({ ...prev, role: 'agronomist' }))}
                    >
                      <CardContent className="flex flex-col items-center p-6">
                        <Briefcase className="h-8 w-8 text-agribeta-green mb-2" />
                        <h3 className="font-semibold">Agronomist</h3>
                        <p className="text-sm text-gray-600 text-center">
                          Provide expert advice, consultations, and guidance
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={signUpData.first_name}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={signUpData.last_name}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={signUpData.country}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, country: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={signUpData.phone}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={signUpData.industry} onValueChange={(value) => setSignUpData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Role-specific fields */}
                {signUpData.role === 'farmer' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-agribeta-green">Farm Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farm_name">Farm Name</Label>
                        <Input
                          id="farm_name"
                          value={signUpData.farm_name}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, farm_name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farm_size">Farm Size (hectares)</Label>
                        <Input
                          id="farm_size"
                          type="number"
                          step="0.1"
                          value={signUpData.farm_size}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, farm_size: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farm_location">Farm Location</Label>
                        <Input
                          id="farm_location"
                          value={signUpData.farm_location}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, farm_location: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primary_crop">Primary Crop</Label>
                        <Select value={signUpData.primary_crop} onValueChange={(value) => setSignUpData(prev => ({ ...prev, primary_crop: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select primary crop" />
                          </SelectTrigger>
                          <SelectContent>
                            {crops.map((crop) => (
                              <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {signUpData.role === 'agronomist' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-agribeta-green">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={signUpData.company}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={signUpData.title}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="years_experience">Years of Experience</Label>
                        <Input
                          id="years_experience"
                          type="number"
                          value={signUpData.years_experience}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, years_experience: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="consultation_fee">Consultation Fee (USD)</Label>
                        <Input
                          id="consultation_fee"
                          type="number"
                          step="0.01"
                          value={signUpData.consultation_fee}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, consultation_fee: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={signUpData.bio}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-agribeta-green hover:bg-agribeta-green/90"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
