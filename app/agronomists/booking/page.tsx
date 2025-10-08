"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'
import { PageBackground } from '@/components/page-background'
import { useUsage } from '@/hooks/use-usage'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Users, 
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Video,
  MapPin as LocationIcon
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Agronomist {
  id: string
  name: string
  title: string
  rating: number
  reviews: number
  specializations: string[]
  hourly_rate: number
  consultation_fee: number
  avatar_url?: string
  bio: string
  experience: number
  location: string
  availability: string[]
}

export default function AgronomistBookingPage() {
  const { user, profile } = useAuth()
  const { usage, canUseService, trackUsage } = useUsage()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [agronomists, setAgronomists] = useState<Agronomist[]>([])
  const [selectedAgronomist, setSelectedAgronomist] = useState<Agronomist | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [consultationType, setConsultationType] = useState<'video' | 'phone' | 'farm_visit'>('video')
  const [duration, setDuration] = useState(60)
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'select' | 'schedule' | 'confirm'>('select')

  // Fetch agronomist data from API
  useEffect(() => {
    const fetchAgronomists = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/networking/users?role=agronomist')
        const data = await response.json()
        
        if (response.ok && data.users) {
          // Transform API data to match our interface
          const transformedAgronomists: Agronomist[] = data.users.map((user: any) => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            title: user.title || 'Agricultural Consultant',
            rating: user.average_rating || 4.5,
            reviews: user.total_consultations || 0,
            specializations: user.specializations || ['General Agriculture'],
            hourly_rate: user.consultation_fee || 100,
            consultation_fee: user.consultation_fee || 100,
            avatar_url: user.avatar_url,
            bio: user.bio || 'Experienced agricultural consultant ready to help with your farming needs.',
            experience: user.years_experience || 5,
            location: user.location || 'Location not specified',
            availability: ['09:00', '10:00', '14:00', '15:00'] // Default availability
          }))
          
          setAgronomists(transformedAgronomists)
          
          // If there's an agronomist parameter in URL, pre-select it
          const agronomistId = searchParams.get('agronomist')
          if (agronomistId) {
            const foundAgronomist = transformedAgronomists.find(ag => ag.id === agronomistId)
            if (foundAgronomist) {
              setSelectedAgronomist(foundAgronomist)
              setStep('schedule') // Skip selection step if agronomist is pre-selected
            }
          }
        } else {
          console.error('Failed to fetch agronomists:', data.error)
          // Fallback to mock data if API fails
          const mockAgronomists: Agronomist[] = [
            {
              id: '1',
              name: 'Dr. Sarah Kimani',
              title: 'Senior Agronomist',
              rating: 4.9,
              reviews: 127,
              specializations: ['Avocado Farming', 'Pest Management', 'Soil Health'],
              hourly_rate: 75,
              consultation_fee: 150,
              bio: 'Expert in tropical fruit farming with 15+ years experience',
              experience: 15,
              location: 'Nairobi, Kenya',
              availability: ['09:00', '10:00', '14:00', '15:00']
            }
          ]
          setAgronomists(mockAgronomists)
        }
      } catch (error) {
        console.error('Error fetching agronomists:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAgronomists()
  }, [searchParams])

  const handleSelectAgronomist = (agronomist: Agronomist) => {
    setSelectedAgronomist(agronomist)
    setStep('schedule')
  }

  const handleScheduleConsultation = () => {
    if (!selectedAgronomist || !selectedDate || !selectedTime) {
      alert('Please select date and time')
      return
    }
    setStep('confirm')
  }

  const handleConfirmBooking = async () => {
    if (!selectedAgronomist || !user || !profile) return

    setLoading(true)

    try {
      // Check if user can book consultation
      if (!canUseService('consultation')) {
        alert('You have reached your consultation limit. Please upgrade your plan.')
        setLoading(false)
        return
      }

      // Get user's timezone (default to Africa/Nairobi)
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Nairobi'

      // Create booking via API
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmer_id: user.id,
          agronomist_id: selectedAgronomist.id,
          date: selectedDate,
          time: selectedTime,
          type: consultationType,
          duration: duration,
          message: message || null,
          cost: selectedAgronomist.consultation_fee,
          farmer_timezone: userTimezone,
          agronomist_timezone: selectedAgronomist.timezone || 'Africa/Nairobi'
        })
      })

      const bookingData = await bookingResponse.json()

      if (!bookingResponse.ok) {
        throw new Error(bookingData.error || 'Failed to create booking')
      }

      // Only track usage after successful booking
      const usageResult = await trackUsage('consultation', 1)
      if (!usageResult.success) {
        // Booking was created but usage tracking failed
        // We should still show success since booking exists
        console.warn('Booking created but usage tracking failed:', usageResult.error)
      }

      console.log('Booking created successfully:', bookingData.booking)
      
      // Show success message
      alert('Consultation booked successfully! The agronomist has been notified and you will receive a confirmation email.')
      
      // Redirect to consultations page
      router.push('/consultations')
    } catch (error) {
      console.error('Booking error:', error)
      alert(`Failed to book consultation: ${error instanceof Error ? error.message : 'Please try again.'}`)
      setLoading(false)
    }
  }

  const getTotalCost = () => {
    if (!selectedAgronomist) return 0
    return selectedAgronomist.consultation_fee
  }

  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">Book Agronomist Consultation</h1>
            <p className="text-lg text-muted-foreground">
              Connect with expert agronomists for personalized farming advice.
            </p>
          </div>

          {/* Usage Status */}
          {usage && (
            <div className="mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Consultation Credits</h3>
                      <p className="text-sm text-muted-foreground">
                        {usage.consultations.used}/{usage.consultations.limit === -1 ? '∞' : usage.consultations.limit} used this month
                      </p>
                    </div>
                    {!canUseService('consultation') && (
                      <Badge variant="destructive">Limit Reached</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 1: Select Agronomist */}
          {step === 'select' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose an Agronomist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agronomists.map((agronomist) => (
                  <Card key={agronomist.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={agronomist.avatar_url} />
                          <AvatarFallback className="bg-agribeta-green/10 text-agribeta-green">
                            {agronomist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{agronomist.name}</CardTitle>
                          <CardDescription>{agronomist.title}</CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{agronomist.rating}</span>
                            <span className="text-sm text-muted-foreground">({agronomist.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm">Specializations</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {agronomist.specializations.map((spec, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{agronomist.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{agronomist.experience} years experience</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-muted-foreground">Consultation fee:</span>
                            <span className="font-semibold ml-1">${agronomist.consultation_fee}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{agronomist.bio}</p>
                      </div>
                      
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handleSelectAgronomist(agronomist)}
                      >
                        Select Agronomist
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Schedule Consultation */}
          {step === 'schedule' && selectedAgronomist && (
            <div>
              <div className="mb-6">
                <Button variant="outline" onClick={() => setStep('select')}>
                  ← Back to Agronomists
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Schedule Your Consultation</h2>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {selectedAgronomist.name}
                      </CardTitle>
                      <CardDescription>{selectedAgronomist.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="consultation-type">Consultation Type</Label>
                        <Select value={consultationType} onValueChange={(value: any) => setConsultationType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                Video Call
                              </div>
                            </SelectItem>
                            <SelectItem value="phone">
                              <div className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Phone Call
                              </div>
                            </SelectItem>
                            <SelectItem value="farm_visit">
                              <div className="flex items-center gap-2">
                                <LocationIcon className="h-4 w-4" />
                                Farm Visit
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedAgronomist.availability.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Describe your farming challenges or questions..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <Button onClick={handleScheduleConsultation} className="w-full">
                        Continue to Confirmation
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Consultation Summary</h3>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={selectedAgronomist.avatar_url} />
                            <AvatarFallback className="bg-agribeta-green/10 text-agribeta-green">
                              {selectedAgronomist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{selectedAgronomist.name}</h4>
                            <p className="text-sm text-muted-foreground">{selectedAgronomist.title}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Type:</span>
                            <span className="text-sm font-medium capitalize">
                              {consultationType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Duration:</span>
                            <span className="text-sm font-medium">{duration} minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Cost:</span>
                            <span className="text-sm font-medium">${getTotalCost()}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span>${getTotalCost()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirm' && selectedAgronomist && (
            <div>
              <div className="mb-6">
                <Button variant="outline" onClick={() => setStep('schedule')}>
                  ← Back to Schedule
                </Button>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Confirm Your Booking</h2>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Ready to Book?</h3>
                        <p className="text-muted-foreground">
                          Please review your consultation details before confirming.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Agronomist:</span>
                          <span className="font-medium">{selectedAgronomist.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium capitalize">
                            {consultationType.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{duration} minutes</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                          <span>Total Cost:</span>
                          <span>${getTotalCost()}</span>
                        </div>
                      </div>

                      {message && (
                        <div>
                          <h4 className="font-medium mb-2">Your Message:</h4>
                          <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                            {message}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setStep('schedule')}
                        >
                          Edit Details
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={handleConfirmBooking}
                          disabled={loading}
                        >
                          {loading ? 'Booking...' : 'Confirm Booking'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}
