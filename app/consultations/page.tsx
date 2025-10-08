"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth-context'
import { PageBackground } from '@/components/page-background'
import { ConsultationCard } from '@/components/consultations/consultation-card'
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
  Edit,
  Loader2,
  Plus,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'

interface Consultation {
  id: string
  farmer_id: string
  agronomist_id: string
  scheduled_date: string
  scheduled_time: string
  consultation_type: 'video' | 'phone' | 'farm_visit'
  duration_minutes: number
  message: string | null
  cost: number
  payment_status: 'pending' | 'paid' | 'refunded' | 'cancelled'
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  meeting_link: string | null
  rating: number | null
  review_text: string | null
  created_at: string
  farmer?: {
    id: string
    first_name: string
    last_name: string
    email: string
    avatar_url: string | null
  }
  agronomist?: {
    id: string
    first_name: string
    last_name: string
    email: string
    avatar_url: string | null
  }
}

export default function ConsultationsPage() {
  const { user, profile } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  // Fetch consultations from API
  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user || !profile) return

      try {
        setLoading(true)
        const response = await fetch(`/api/bookings?userId=${user.id}&role=${profile.role}`)
        const data = await response.json()

        if (response.ok) {
          setConsultations(data.bookings || [])
        } else {
          console.error('Error fetching consultations:', data.error)
          toast({
            title: "Error",
            description: "Failed to load consultations",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Error fetching consultations:', error)
        toast({
          title: "Error",
          description: "Failed to load consultations",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [user, profile])

  // Filter consultations based on status and search
  const filteredConsultations = consultations.filter(consultation => {
    const otherPerson = profile?.role === 'farmer' 
      ? `${consultation.agronomist?.first_name} ${consultation.agronomist?.last_name}`
      : `${consultation.farmer?.first_name} ${consultation.farmer?.last_name}`
    
    const matchesSearch = otherPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.message?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Get upcoming consultations
  const upcomingConsultations = consultations.filter(c => {
    const consultationDate = new Date(c.scheduled_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return consultationDate >= today && ['pending', 'confirmed'].includes(c.status)
  })

  // Get completed consultations
  const completedConsultations = consultations.filter(c => c.status === 'completed')

  // Get consultations with reviews
  const reviewedConsultations = consultations.filter(c => c.rating && c.rating > 0)

  // Calculate stats
  const totalConsultations = consultations.length
  const totalCompleted = completedConsultations.length
  const totalUpcoming = upcomingConsultations.length
  const averageRating = reviewedConsultations.length > 0
    ? (reviewedConsultations.reduce((sum, c) => sum + (c.rating || 0), 0) / reviewedConsultations.length).toFixed(1)
    : '0.0'

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'no_show': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <Video className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'farm_visit': return <MapPin className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return 'Video Call'
      case 'phone': return 'Phone Call'
      case 'farm_visit': return 'Farm Visit'
      default: return type
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          status: 'cancelled',
          cancelled_by: user?.id
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking cancelled successfully"
        })
        // Refresh consultations
        setConsultations(prev => prev.map(c => 
          c.id === bookingId ? { ...c, status: 'cancelled' as const } : c
        ))
      } else {
        throw new Error('Failed to cancel booking')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive"
      })
    }
  }

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          status: 'confirmed'
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking confirmed successfully"
        })
        setConsultations(prev => prev.map(c => 
          c.id === bookingId ? { ...c, status: 'confirmed' as const } : c
        ))
      } else {
        throw new Error('Failed to confirm booking')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm booking",
        variant: "destructive"
      })
    }
  }

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          status: 'completed'
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking marked as completed"
        })
        setConsultations(prev => prev.map(c => 
          c.id === bookingId ? { ...c, status: 'completed' as const } : c
        ))
      } else {
        throw new Error('Failed to complete booking')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete booking",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <div className="container py-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-agribeta-green mx-auto mb-4" />
              <p className="text-muted-foreground">Loading consultations...</p>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-agribeta-green">Consultations</h1>
              <p className="text-muted-foreground">Manage your consultation history and upcoming sessions</p>
            </div>
            <div className="flex gap-2">
              {profile?.role === 'farmer' && (
                <Button asChild className="bg-agribeta-green hover:bg-agribeta-green/90">
                  <Link href="/agronomists/booking">
                    <Plus className="h-4 w-4 mr-2" />
                    Book New
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
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
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{totalConsultations}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{totalCompleted}</div>
                  <p className="text-xs text-muted-foreground">Successfully finished</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{totalUpcoming}</div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {profile?.role === 'agronomist' ? 'Average Rating' : 'Total Spent'}
              </CardTitle>
              {profile?.role === 'agronomist' ? (
                <Star className="h-4 w-4 text-muted-foreground" />
              ) : (
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : profile?.role === 'agronomist' ? (
                <>
                  <div className="text-2xl font-bold">{averageRating}</div>
                  <p className="text-xs text-muted-foreground">Out of 5 stars</p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${consultations.reduce((sum, c) => sum + (c.cost || 0), 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">On consultations</p>
                </>
              )}
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
                {filteredConsultations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No consultations found</p>
                    {profile?.role === 'farmer' && (
                      <Button asChild className="mt-4" variant="outline">
                        <Link href="/agronomists/booking">Book your first consultation</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredConsultations.map((consultation) => (
                      <ConsultationCard
                        key={consultation.id}
                        consultation={consultation}
                        userRole={profile?.role === 'admin' ? 'agronomist' : profile?.role}
                        onConfirm={handleConfirmBooking}
                        onCancel={handleCancelBooking}
                        onComplete={handleCompleteBooking}
                      />
                    ))}
                  </div>
                )}
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
                {upcomingConsultations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming consultations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation) => (
                      <ConsultationCard
                        key={consultation.id}
                        consultation={consultation}
                        userRole={profile?.role === 'admin' ? 'agronomist' : profile?.role}
                        onConfirm={handleConfirmBooking}
                        onCancel={handleCancelBooking}
                        onComplete={handleCompleteBooking}
                      />
                    ))}
                  </div>
                )}
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
                {completedConsultations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No completed consultations yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedConsultations.map((consultation) => (
                      <ConsultationCard
                        key={consultation.id}
                        consultation={consultation}
                        userRole={profile?.role === 'admin' ? 'agronomist' : profile?.role}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{profile?.role === 'agronomist' ? 'Client Reviews' : 'Your Reviews'}</CardTitle>
                <CardDescription>Feedback from consultations</CardDescription>
              </CardHeader>
              <CardContent>
                {reviewedConsultations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewedConsultations.map((consultation) => (
                      <div key={consultation.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={
                                profile?.role === 'farmer' 
                                  ? consultation.agronomist?.avatar_url || '/placeholder-user.jpg'
                                  : consultation.farmer?.avatar_url || '/placeholder-user.jpg'
                              } />
                              <AvatarFallback>
                                {profile?.role === 'farmer' 
                                  ? `${consultation.agronomist?.first_name?.[0]}${consultation.agronomist?.last_name?.[0]}`
                                  : `${consultation.farmer?.first_name?.[0]}${consultation.farmer?.last_name?.[0]}`
                                }
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">
                                {profile?.role === 'farmer'
                                  ? `${consultation.agronomist?.first_name} ${consultation.agronomist?.last_name}`
                                  : `${consultation.farmer?.first_name} ${consultation.farmer?.last_name}`
                                }
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(consultation.scheduled_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < (consultation.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        {consultation.review_text && (
                          <p className="text-sm text-muted-foreground">"{consultation.review_text}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}
