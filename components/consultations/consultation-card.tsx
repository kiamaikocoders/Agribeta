"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  MapPin,
  Star,
  Video,
  Phone,
  CheckCircle
} from 'lucide-react'

interface ConsultationCardProps {
  consultation: {
    id: string
    scheduled_date: string
    scheduled_time: string
    consultation_type: 'video' | 'phone' | 'farm_visit'
    duration_minutes: number
    cost: number
    payment_status: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
    message: string | null
    rating: number | null
    review_text: string | null
    farmer?: {
      first_name: string
      last_name: string
      avatar_url: string | null
    }
    agronomist?: {
      first_name: string
      last_name: string
      avatar_url: string | null
    }
  }
  userRole?: 'farmer' | 'agronomist'
  onConfirm?: (id: string) => void
  onCancel?: (id: string) => void
  onComplete?: (id: string) => void
}

export function ConsultationCard({ consultation, userRole, onConfirm, onCancel, onComplete }: ConsultationCardProps) {
  const otherPerson = userRole === 'farmer' ? consultation.agronomist : consultation.farmer
  const isUpcoming = ['pending', 'confirmed'].includes(consultation.status)

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
      default: return <MapPin className="h-4 w-4" />
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    // Handle both HH:MM:SS and HH:MM formats
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 flex-1">
        <Avatar className="h-12 w-12">
          <AvatarImage src={otherPerson?.avatar_url || '/placeholder-user.jpg'} />
          <AvatarFallback>
            {otherPerson?.first_name?.[0]}{otherPerson?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h4 className="font-medium">
            {otherPerson?.first_name} {otherPerson?.last_name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {getTypeName(consultation.consultation_type)}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(consultation.scheduled_date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(consultation.scheduled_time)}
            </span>
            <span>{consultation.duration_minutes} min</span>
          </div>
          
          {consultation.message && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              "{consultation.message}"
            </p>
          )}
        </div>
      </div>

      <div className="text-right space-y-2">
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(consultation.status)}>
            {consultation.status}
          </Badge>
          {consultation.payment_status === 'paid' && (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Paid
            </Badge>
          )}
        </div>

        {userRole === 'farmer' && (
          <p className="text-sm font-medium text-muted-foreground">
            ${consultation.cost.toFixed(2)}
          </p>
        )}

        {consultation.rating && (
          <div className="flex items-center gap-1 justify-end">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${
                  i < (consultation.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          {userRole === 'agronomist' && consultation.status === 'pending' && onConfirm && (
            <Button 
              size="sm" 
              onClick={() => onConfirm(consultation.id)}
              className="bg-agribeta-green hover:bg-agribeta-green/90"
            >
              Confirm
            </Button>
          )}
          
          {isUpcoming && onCancel && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCancel(consultation.id)}
            >
              Cancel
            </Button>
          )}

          {consultation.status === 'confirmed' && onComplete && userRole === 'agronomist' && (
            <Button 
              size="sm" 
              variant="default"
              onClick={() => onComplete(consultation.id)}
            >
              Mark Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

