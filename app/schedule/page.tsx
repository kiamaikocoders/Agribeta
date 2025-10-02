"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
// import { PageBackground } from '@/components/page-background'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Video,
  Phone,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function SchedulePage() {
  const { profile, agronomistProfile } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('week')

  // Mock schedule data
  const scheduleData = {
    upcoming: [
      {
        id: 1,
        farmer: "John Doe",
        type: "Video Call",
        date: "2024-01-20",
        time: "10:00 AM",
        duration: 60,
        status: "Confirmed",
        topic: "Avocado Disease Management",
        location: "Online"
      },
      {
        id: 2,
        farmer: "Sarah Kimani",
        type: "Farm Visit",
        date: "2024-01-22",
        time: "2:00 PM",
        duration: 120,
        status: "Pending",
        topic: "Rose Pest Control",
        location: "Kiambu County"
      },
      {
        id: 3,
        farmer: "Michael Ochieng",
        type: "Phone Consultation",
        date: "2024-01-25",
        time: "9:00 AM",
        duration: 30,
        status: "Confirmed",
        topic: "Soil Testing Results",
        location: "Phone"
      }
    ],
    today: [
      {
        id: 4,
        farmer: "Grace Wanjiku",
        type: "Video Call",
        time: "11:00 AM",
        duration: 45,
        status: "Confirmed",
        topic: "Avocado Harvest Timing"
      }
    ],
    thisWeek: [
      { day: "Mon", date: "20", appointments: 2 },
      { day: "Tue", date: "21", appointments: 1 },
      { day: "Wed", date: "22", appointments: 3 },
      { day: "Thu", date: "23", appointments: 0 },
      { day: "Fri", date: "24", appointments: 2 },
      { day: "Sat", date: "25", appointments: 1 },
      { day: "Sun", date: "26", appointments: 0 }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800'
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
      default: return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-agribeta-green">Schedule Management</h1>
            <p className="text-muted-foreground">Manage your consultations and availability</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/schedule/availability">
                <Plus className="h-4 w-4 mr-2" />
                Set Availability
              </Link>
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
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduleData.today.length}</div>
              <p className="text-xs text-muted-foreground">1 confirmed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-muted-foreground">Total appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Ready to go</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Consultations</CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduleData.upcoming.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-agribeta-green/10 rounded-full flex items-center justify-center">
                          {getTypeIcon(appointment.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{appointment.farmer}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.topic}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {appointment.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{appointment.duration} min</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="today" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduleData.today.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-agribeta-green/10 rounded-full flex items-center justify-center">
                          {getTypeIcon(appointment.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{appointment.farmer}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.topic}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.time}
                            </span>
                            <span>{appointment.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
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

          <TabsContent value="week" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>This Week's Schedule</CardTitle>
                <CardDescription>Overview of your weekly appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4">
                  {scheduleData.thisWeek.map((day) => (
                    <div key={day.day} className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">{day.day}</div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        day.appointments > 0 ? 'bg-agribeta-green text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {day.date}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.appointments} appointment{day.appointments !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>Full calendar of your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Calendar view coming soon</p>
                  <p className="text-sm text-muted-foreground">Full calendar integration will be available in the next update</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
