"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Check, X } from 'lucide-react'
import { useNotifications } from '@/contexts/notifications-context'
import { NotificationsDropdown } from './notifications-dropdown'

export function NotificationsBell() {
  const { unreadCount } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {open && (
        <NotificationsDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  )
}
