"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
// import { PageBackground } from '@/components/page-background'
import { 
  MessageCircle, 
  Calendar, 
  Clock, 
  Star,
  Video,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  Download,
  Eye,
  Edit
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ConsultationsPage() {
  const { profile, agronomistProfile } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock consultations data
  const consultationsData = {
    all: [
      {
        id: 1,
        farmer: "John Doe",
        type: "Video Call",
        date: "2024-01-18",
        time: "10:00 AM",
        duration: 60,
        status: "Completed",
        rating: 5,
        review: "Excellent advice on pest management",
        earnings: 150,
        topic: "Avocado Disease Management",
        location: "Online"
      },
      {
        id: 2,
        farmer: "Sarah Kimani",
        type: "Farm Visit",
        date: "2024-01-17",
        time: "2:00 PM",
        duration: 120,
        status: "Completed",
        rating: 4,
        review: "Very helpful with soil analysis",
        earnings: 200,
        topic: "Rose Pest Control",
        location: "Kiambu County"
      },
      {
        id: 3,
        farmer: "Michael Ochieng",
        type: "Phone Consultation",
        date: "2024-01-16",
        time: "9:00 AM",
        duration: 30,
        status: "Pending",
        rating: null,
        review: null,
        earnings: 100,
        topic: "Soil Testing Results",
        location: "Phone"
      },
      {
        id: 4,
        farmer: "Grace Wanjiku",
        type: "Video Call",
        date: "2024-01-15",
        time: "11:00 AM",
        duration: 45,
        status: "Cancelled",
        rating: null,
        review: null,
        earnings: 0,
        topic: "Avocado Harvest Timing",
        location: "Online"
      }
    ],
    upcoming: [
      {
        id: 5,
        farmer: "James Mwangi",
        type: "Farm Visit",
        date: "2024-01-20",
        time: "10:00 AM",
        duration: 90,
        status: "Confirmed",
        topic: "Avocado Tree Pruning",
        location: "Nakuru County"
      },
      {
        id: 6,
        farmer: "Mary Wanjiku",
        type: "Video Call",
        date: "2024-01-22",
        time: "2:00 PM",
        duration: 60,
        status: "Pending",
        topic: "Rose Disease Treatment",
        location: "Online"
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Confirmed': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Call': return <Video className="h-4 w-4" />
      case 'Phone Consultation': return <Phone className="h-4 w-4" />
      case 'Farm Visit': return <MapPin className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const filteredConsultations = consultationsData.all.filter(consultation => {
    const matchesSearch = consultation.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || consultation.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-agribeta-green">Consultations</h1>
            <p className="text-muted-foreground">Manage your consultation history and upcoming sessions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultationsData.all.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {consultationsData.all.filter(c => c.status === 'Completed').length}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultationsData.upcoming.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5</div>
              <p className="text-xs text-muted-foreground">Out of 5 stars</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Consultations</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Consultations</CardTitle>
                <CardDescription>Complete history of your consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredConsultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-agribeta-green/10 rounded-full flex items-center justify-center">
                          {getTypeIcon(consultation.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{consultation.farmer}</h4>
                          <p className="text-sm text-muted-foreground">{consultation.topic}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {consultation.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {consultation.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {consultation.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(consultation.status)}>
                          {consultation.status}
                        </Badge>
                        {consultation.earnings > 0 && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            ${consultation.earnings}
                          </p>
                        )}
                        {consultation.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
                                  i < consultation.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Consultations</CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultationsData.upcoming.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-agribeta-green/10 rounded-full flex items-center justify-center">
                          {getTypeIcon(consultation.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{consultation.farmer}</h4>
                          <p className="text-sm text-muted-foreground">{consultation.topic}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {consultation.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {consultation.time}
                            </span>
                            <span>{consultation.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(consultation.status)}>
                          {consultation.status}
                        </Badge>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm">Start Call</Button>
                          <Button size="sm" variant="outline">Reschedule</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Consultations</CardTitle>
                <CardDescription>Your finished consultation sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultationsData.all.filter(c => c.status === 'Completed').map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{consultation.farmer}</h4>
                          <p className="text-sm text-muted-foreground">{consultation.review}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{consultation.date}</span>
                            <span>{consultation.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < consultation.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium text-green-600">${consultation.earnings}</p>
                        <p className="text-sm text-muted-foreground">{consultation.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>Feedback from your consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultationsData.all.filter(c => c.rating).map((consultation) => (
                    <div key={consultation.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{consultation.farmer}</h4>
                          <p className="text-sm text-muted-foreground">{consultation.topic}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < consultation.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">"{consultation.review}"</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{consultation.date}</span>
                        <span>{consultation.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
