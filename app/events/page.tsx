"use client"

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageBackground } from '@/components/page-background'
import { Calendar, MapPin, Clock, Users, BookOpen, Star } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function EventsPage() {
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set())

  const handleRegister = (eventId: string, eventTitle: string) => {
    setRegisteredEvents(prev => new Set([...prev, eventId]))
    toast({
      title: "Registration Successful",
      description: `You have successfully registered for ${eventTitle}`,
    })
  }

  const handleLearnMore = (eventTitle: string) => {
    toast({
      title: "Event Details",
      description: `More information about ${eventTitle} will be available soon.`,
    })
  }

  const handleCreateEvent = () => {
    toast({
      title: "Create Event",
      description: "Event creation feature will be available soon.",
    })
  }

  return (
    <ProtectedRoute>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">Events</h1>
            <p className="text-lg text-muted-foreground">Discover agricultural events, workshops, and networking opportunities</p>
          </div>

          {/* Featured Events */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Event Card 1 */}
              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-agribeta-orange text-white">
                    Featured
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Avocado Farming Workshop</CardTitle>
                  <CardDescription>Learn advanced techniques for avocado cultivation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>June 15, 2025 • 9:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Nairobi, Kenya</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>4 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>45 attendees</span>
                  </div>
                  <Button 
                    className="w-full bg-agribeta-green hover:bg-agribeta-green/90"
                    onClick={() => handleRegister('avocado-workshop', 'Avocado Farming Workshop')}
                    disabled={registeredEvents.has('avocado-workshop')}
                  >
                    {registeredEvents.has('avocado-workshop') ? 'Registered' : 'Register Now'}
                  </Button>
                </CardContent>
              </Card>

              {/* Event Card 2 */}
              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-blue-500 text-white">
                    New
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Rose Cultivation Seminar</CardTitle>
                  <CardDescription>Expert insights on rose farming and export</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>June 22, 2025 • 2:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Nakuru, Kenya</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>3 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>32 attendees</span>
                  </div>
                  <Button 
                    className="w-full bg-agribeta-green hover:bg-agribeta-green/90"
                    onClick={() => handleRegister('rose-seminar', 'Rose Cultivation Seminar')}
                    disabled={registeredEvents.has('rose-seminar')}
                  >
                    {registeredEvents.has('rose-seminar') ? 'Registered' : 'Register Now'}
                  </Button>
                </CardContent>
              </Card>

              {/* Event Card 3 */}
              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Star className="h-16 w-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-purple-500 text-white">
                    Premium
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Pest Management Summit</CardTitle>
                  <CardDescription>Advanced strategies for crop protection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>July 5, 2025 • 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Kisumu, Kenya</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>6 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>28 attendees</span>
                  </div>
                  <Button 
                    className="w-full bg-agribeta-green hover:bg-agribeta-green/90"
                    onClick={() => handleRegister('pest-summit', 'Pest Management Summit')}
                    disabled={registeredEvents.has('pest-summit')}
                  >
                    {registeredEvents.has('pest-summit') ? 'Registered' : 'Register Now'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Soil Health Workshop",
                  date: "June 30, 2025",
                  time: "1:00 PM",
                  location: "Mombasa, Kenya",
                  duration: "2 hours",
                  attendees: 18
                },
                {
                  title: "Irrigation Systems Training",
                  date: "July 12, 2025",
                  time: "9:00 AM",
                  location: "Eldoret, Kenya",
                  duration: "5 hours",
                  attendees: 25
                },
                {
                  title: "Organic Farming Certification",
                  date: "July 20, 2025",
                  time: "8:00 AM",
                  location: "Thika, Kenya",
                  duration: "8 hours",
                  attendees: 15
                }
              ].map((event, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant="outline">{event.duration}</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleLearnMore(event.title)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-agribeta-green mb-4">Host Your Own Event</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Share your expertise with the agricultural community. Host workshops, seminars, 
                  or networking events to connect with fellow farmers and agronomists.
                </p>
                <Button 
                  size="lg" 
                  className="bg-agribeta-green hover:bg-agribeta-green/90"
                  onClick={handleCreateEvent}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}


