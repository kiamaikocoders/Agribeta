"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageBackground } from '@/components/page-background'
import { MessagingProvider } from '@/contexts/messaging-context'
import { ResponsiveMessagingInterface } from '@/components/messaging/responsive-messaging-interface'
import { MessagingErrorBoundary } from '@/components/messaging/messaging-error-boundary'

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagingProvider>
        <div className="h-screen overflow-hidden">
          {/* Messaging Interface */}
          <MessagingErrorBoundary>
            <ResponsiveMessagingInterface />
          </MessagingErrorBoundary>
        </div>
      </MessagingProvider>
    </ProtectedRoute>
  )
}
