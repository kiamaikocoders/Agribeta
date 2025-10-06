"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageBackground } from '@/components/page-background'
import { Search, Filter, Star, MapPin, Clock, Users, Award, MessageCircle, Calendar, User, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { FollowsProvider } from '@/contexts/follows-context'
import { MessagingProvider } from '@/contexts/messaging-context'
import { FollowConnectButton } from '@/components/follows/follow-connect-button'
import { useAuth } from '@/contexts/auth-context'
import { useMessaging } from '@/contexts/messaging-context'
import { NetworkingCard } from '@/components/networking/networking-card'
import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'

// Networking Page Component
function NetworkingPage() {
  const { profile } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [activeTab, setActiveTab] = useState<'all' | 'agronomists' | 'farmers'>('all')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Convert tab value to API role parameter
  const getApiRole = (tab: string) => {
    switch (tab) {
      case 'agronomists': return 'agronomist'
      case 'farmers': return 'farmer'
      case 'all': return 'all'
      default: return 'all'
    }
  }

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Always fetch all users, then filter on frontend for better UX
      const params = new URLSearchParams({
        role: 'all', // Always fetch all users
        search: searchQuery,
        specialization: selectedSpecialization,
        location: selectedLocation,
      })

      const response = await fetch(`/api/networking/users?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      } else {
        console.error('Error fetching users:', data.error)
        toast({
          title: "Error",
          description: "Failed to fetch users. Using sample data.",
          variant: "destructive",
        })
        // Fallback to mock data if API fails
        setUsers(getMockUsers())
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers(getMockUsers())
    } finally {
      setLoading(false)
    }
  }

  // Mock data fallback
  const getMockUsers = () => [
    // Agronomists
    {
      id: 'agronomist-1',
      first_name: 'Dr. Johnson',
      last_name: 'Mwangi',
      role: 'agronomist' as const,
      avatar_url: '/placeholder-user.jpg',
      bio: 'Expert in tropical fruit farming with 15+ years experience',
      location: 'Nairobi, Kenya',
      is_verified: true,
      title: 'Senior Agronomist',
      years_experience: 15,
      specializations: ['Avocado Farming', 'Pest Management', 'Soil Health'],
      average_rating: 4.9,
      total_consultations: 127,
      consultation_fee: 150,
      response_time_minutes: 120
    },
    {
      id: 'agronomist-2',
      first_name: 'Sarah',
      last_name: 'Kimani',
      role: 'agronomist' as const,
      avatar_url: '/placeholder-user.jpg',
      bio: 'Specialized in rose cultivation and greenhouse management',
      location: 'Nakuru, Kenya',
      is_verified: true,
      title: 'Rose Cultivation Specialist',
      years_experience: 8,
      specializations: ['Rose Cultivation', 'Greenhouse Management', 'Flower Farming'],
      average_rating: 4.8,
      total_consultations: 89,
      consultation_fee: 120,
      response_time_minutes: 240
    },
    {
      id: 'agronomist-3',
      first_name: 'Michael',
      last_name: 'Ochieng',
      role: 'agronomist' as const,
      avatar_url: '/placeholder-user.jpg',
      bio: 'Leading expert in pest management and integrated pest control',
      location: 'Kisumu, Kenya',
      is_verified: true,
      title: 'Pest Management Expert',
      years_experience: 12,
      specializations: ['Pest Control', 'IPM', 'Crop Protection'],
      average_rating: 4.7,
      total_consultations: 156,
      consultation_fee: 140,
      response_time_minutes: 360
    },
    // Farmers
    {
      id: 'farmer-1',
      first_name: 'Grace',
      last_name: 'Wanjiku',
      role: 'farmer' as const,
      avatar_url: '/placeholder-user.jpg',
      bio: 'Passionate avocado farmer with 5 hectares of organic avocado trees',
      location: 'Murang\'a, Kenya',
      is_verified: false,
      farm_name: 'Green Valley Farm',
      farm_size: 5,
      primary_crop: 'Avocado',
      total_diagnoses: 23
    },
    {
      id: 'farmer-2',
      first_name: 'Peter',
      last_name: 'Mwangi',
      role: 'farmer' as const,
      avatar_url: '/placeholder-user.jpg',
      bio: 'Experienced rose farmer specializing in greenhouse rose cultivation',
      location: 'Naivasha, Kenya',
      is_verified: true,
      farm_name: 'Rose Garden Farm',
      farm_size: 2.5,
      primary_crop: 'Roses',
      total_diagnoses: 45
    },
    {
      id: 'farmer-3',
      first_name: 'Mary',
      last_name: 'Akinyi',
      role: 'farmer' as const,
      avatar_url: '/placeholder-user.jpg',
      bio: 'Avocado farmer with expertise in sustainable farming practices',
      location: 'Kiambu, Kenya',
      is_verified: false,
      farm_name: 'Green Valley Farm',
      farm_size: 3,
      primary_crop: 'Avocado',
      total_diagnoses: 67
    }
  ]

  // Fetch users when component mounts or filters change
  useEffect(() => {
    fetchUsers()
  }, [searchQuery, selectedSpecialization, selectedLocation])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization)
  }

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)
  }

  // Filter users based on active tab
  const agronomists = users.filter(user => user.role === 'agronomist')
  const farmers = users.filter(user => user.role === 'farmer')
  
  // Get filtered users based on active tab
  const getFilteredUsers = () => {
    switch (activeTab) {
      case 'agronomists': return agronomists
      case 'farmers': return farmers
      case 'all': 
      default: return users
    }
  }
  
  const filteredUsers = getFilteredUsers()
  
  // Debug logging
  console.log('Network Hub Debug:', {
    activeTab,
    totalUsers: users.length,
    agronomistsCount: agronomists.length,
    farmersCount: farmers.length,
    filteredUsersCount: filteredUsers.length,
    agronomists: agronomists.map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name}`, role: u.role }))
  })

  return (
    <MessagingProvider>
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-agribeta-green mb-2">Network Hub</h1>
              <p className="text-lg text-muted-foreground">Connect with agronomists and farmers to build your agricultural network</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/messages">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Messages
                </Link>
              </Button>
              {profile?.role === 'farmer' && (
                <Button asChild className="bg-agribeta-green hover:bg-agribeta-green/90">
                  <Link href="/agronomists/booking">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Consultation
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name, specialization, or location..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <Select value={selectedSpecialization} onValueChange={handleSpecializationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    <SelectItem value="avocado">Avocado Farming</SelectItem>
                    <SelectItem value="roses">Rose Cultivation</SelectItem>
                    <SelectItem value="vegetables">Vegetable Farming</SelectItem>
                    <SelectItem value="pest-management">Pest Management</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={handleLocationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="nairobi">Nairobi</SelectItem>
                    <SelectItem value="nakuru">Nakuru</SelectItem>
                    <SelectItem value="kisumu">Kisumu</SelectItem>
                    <SelectItem value="muranga">Murang'a</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Users ({filteredUsers.length})
            </TabsTrigger>
            <TabsTrigger value="agronomists" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Agronomists ({agronomists.length})
            </TabsTrigger>
            <TabsTrigger value="farmers" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Farmers ({farmers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agribeta-green mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <NetworkingCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="agronomists" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agribeta-green mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading agronomists...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <NetworkingCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="farmers" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agribeta-green mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading farmers...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <NetworkingCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Users
          </Button>
        </div>
      </div>
    </MessagingProvider>
  )
}

export default function AgronomistsPage() {
  return (
    <ProtectedRoute>
      <FollowsProvider>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <NetworkingPage />
        </PageBackground>
      </FollowsProvider>
    </ProtectedRoute>
  )
}


