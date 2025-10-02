"use client"

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useNotifications } from '@/contexts/notifications-context'
import { 
  Bell, 
  MessageCircle, 
  Heart, 
  UserPlus, 
  Calendar, 
  Activity,
  Settings,
  Check,
  X
} from 'lucide-react'

interface NotificationsDropdownProps {
  onClose: () => void
}

export function NotificationsDropdown({ onClose }: NotificationsDropdownProps) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    loading 
  } = useNotifications()
  
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-4 w-4" />
      case 'like':
        return <Heart className="h-4 w-4" />
      case 'comment':
        return <MessageCircle className="h-4 w-4" />
      case 'follow':
        return <UserPlus className="h-4 w-4" />
      case 'booking':
        return <Calendar className="h-4 w-4" />
      case 'diagnosis':
        return <Activity className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'text-blue-600'
      case 'like':
        return 'text-red-600'
      case 'comment':
        return 'text-green-600'
      case 'follow':
        return 'text-purple-600'
      case 'booking':
        return 'text-orange-600'
      case 'diagnosis':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 z-50"
    >
      <Card className="shadow-lg border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <CardDescription>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-agribeta-green mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                        
                        {notification.sender && (
                          <div className="flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={notification.sender.avatar_url} />
                              <AvatarFallback className="text-xs">
                                {notification.sender.first_name[0]}{notification.sender.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">
                              {notification.sender.first_name} {notification.sender.last_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {notifications.length > 10 && (
                <div className="p-3 text-center border-t">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View all notifications
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
