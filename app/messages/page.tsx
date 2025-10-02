"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageBackground } from '@/components/page-background'
import { MessagingProvider } from '@/contexts/messaging-context'
import { MessagingInterface } from '@/components/messaging/messaging-interface'

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagingProvider>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <div className="container py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-agribeta-green mb-2">Messages</h1>
              <p className="text-lg text-muted-foreground">
                Connect and communicate with agronomists and fellow farmers.
              </p>
            </div>

            <MessagingInterface />
          </div>
        </PageBackground>
      </MessagingProvider>
    </ProtectedRoute>
  )
}
