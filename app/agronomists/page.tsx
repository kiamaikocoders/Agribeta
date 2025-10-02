"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageBackground } from '@/components/page-background'
import { Search, Filter, Star, MapPin, Clock, Users, Award, MessageCircle, Calendar } from 'lucide-react'
import Link from 'next/link'
import { FollowsProvider } from '@/contexts/follows-context'
import { FollowConnectButton } from '@/components/follows/follow-connect-button'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'

export default function AgronomistsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    toast({
      title: "Search",
      description: `Searching for agronomists matching "${query}"`,
    })
  }

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization)
    toast({
      title: "Filter Applied",
      description: `Filtering by specialization: ${specialization}`,
    })
  }

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)
    toast({
      title: "Filter Applied",
      description: `Filtering by location: ${location}`,
    })
  }

  return (
    <ProtectedRoute>
      <FollowsProvider>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-agribeta-green mb-2">Find Agronomists</h1>
                <p className="text-lg text-muted-foreground">Connect with experienced agricultural experts for personalized advice</p>
              </div>
              <Button asChild className="bg-agribeta-green hover:bg-agribeta-green/90">
                <Link href="/agronomists/booking">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Consultation
                </Link>
              </Button>
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
                        placeholder="Search agronomists by name, specialization, or location..."
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
                      <SelectItem value="maize">Maize Production</SelectItem>
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
                      <SelectItem value="kenya">Kenya</SelectItem>
                      <SelectItem value="tanzania">Tanzania</SelectItem>
                      <SelectItem value="uganda">Uganda</SelectItem>
                      <SelectItem value="ethiopia">Ethiopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agronomists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Agronomist Card 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-user.jpg" alt="Dr. Johnson" />
                    <AvatarFallback className="text-xl">DJ</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-lg">Dr. Johnson Mwangi</CardTitle>
                <CardDescription>Senior Agronomist • 15+ Years Experience</CardDescription>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Verified
                  </Badge>
                  <Badge variant="outline">Avocado Expert</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Nairobi, Kenya</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.9 (127 reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Usually responds in 2 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>1,234 farmers helped</span>
                </div>
                <div className="flex gap-2">
                  <FollowConnectButton 
                    targetUserId="agronomist-1" 
                    targetUserRole="agronomist" 
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agronomist Card 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-user.jpg" alt="Sarah Kimani" />
                    <AvatarFallback className="text-xl">SK</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-lg">Sarah Kimani</CardTitle>
                <CardDescription>Rose Cultivation Specialist • 8+ Years Experience</CardDescription>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Verified
                  </Badge>
                  <Badge variant="outline">Rose Expert</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Nakuru, Kenya</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.8 (89 reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Usually responds in 4 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>567 farmers helped</span>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-agribeta-green hover:bg-agribeta-green/90">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agronomist Card 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-user.jpg" alt="Michael Ochieng" />
                    <AvatarFallback className="text-xl">MO</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-lg">Michael Ochieng</CardTitle>
                <CardDescription>Pest Management Expert • 12+ Years Experience</CardDescription>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Verified
                  </Badge>
                  <Badge variant="outline">Pest Control</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Kisumu, Kenya</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.7 (156 reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Usually responds in 6 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>892 farmers helped</span>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-agribeta-green hover:bg-agribeta-green/90">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Agronomists
            </Button>
          </div>
        </div>
      </PageBackground>
      </FollowsProvider>
    </ProtectedRoute>
  )
}


