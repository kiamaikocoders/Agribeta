"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { 
  Calendar, 
  MessageCircle, 
  Video, 
  Phone, 
  MapPin,
  Clock,
  User
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface UpcomingSession {
  id: string
  type: 'consultation' | 'diagnosis' | 'advice' | 'meeting'
  title: string
  description: string
  agronomist_name: string
  agronomist_avatar: string
  agronomist_rating: number
  date: string
  duration: number
  status: 'confirmed' | 'pending' | 'cancelled'
  location: 'online' | 'on-site'
  meeting_link?: string
}

interface ProfileUpcomingSessionsProps {
  userId?: string
}

export function ProfileUpcomingSessions({ userId }: ProfileUpcomingSessionsProps) {
  const { user, profile } = useAuth()
  const [sessions, setSessions] = useState<UpcomingSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingSessions()
  }, [])

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true)
      
      // Mock data - in a real app, this would come from your bookings API
      const mockSessions: UpcomingSession[] = [
        {
          id: '1',
          type: 'consultation',
          title: 'Pest Management Consultation',
          description: 'Discussing aphid control strategies for tomato crops',
          agronomist_name: 'Dr. Sarah Johnson',
          agronomist_avatar: '',
          agronomist_rating: 4.8,
          date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          duration: 60,
          status: 'confirmed',
          location: 'online',
          meeting_link: 'https://meet.agribeta.com/session-123'
        },
        {
          id: '2',
          type: 'diagnosis',
          title: 'Soil Analysis Review',
          description: 'Review soil test results and fertilizer recommendations',
          agronomist_name: 'Dr. Michael Brown',
          agronomist_avatar: '',
          agronomist_rating: 4.9,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          duration: 45,
          status: 'confirmed',
          location: 'online'
        },
        {
          id: '3',
          type: 'advice',
          title: 'Irrigation System Optimization',
          description: 'Getting advice on improving water efficiency',
          agronomist_name: 'Dr. Emily Davis',
          agronomist_avatar: '',
          agronomist_rating: 4.7,
          date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          duration: 30,
          status: 'pending',
          location: 'on-site'
        }
      ]

      setSessions(mockSessions)
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800'
      case 'diagnosis':
        return 'bg-red-100 text-red-800'
      case 'advice':
        return 'bg-green-100 text-green-800'
      case 'meeting':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLocationIcon = (location: string) => {
    return location === 'online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">📅 Upcoming Sessions</h3>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Book New Session
          </Button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">📅 Upcoming Sessions</h3>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Book New Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h4>
          <p className="text-gray-600 mb-4">
            Book a consultation with an agronomist to get expert advice for your farm.
          </p>
          <Button>
            <User className="h-4 w-4 mr-2" />
            Find Agronomists
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.agronomist_avatar} />
                    <AvatarFallback>
                      {session.agronomist_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{session.title}</h4>
                        <p className="text-sm text-gray-600">{session.description}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getSessionTypeColor(session.type)}`}
                        >
                          {session.type}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(session.status)}`}
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {session.agronomist_name}
                      </div>
                      <div className="flex items-center gap-1">
                        ⭐ {session.agronomist_rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1">
                        {getLocationIcon(session.location)}
                        {session.location === 'online' ? 'Online' : 'On-site'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.duration}min
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      {session.location === 'online' && session.meeting_link && (
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Reschedule
                      </Button>
                      
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
