"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { PageBackground } from '@/components/page-background'
import { ProfileEditor } from '@/components/profile/profile-editor'
import { FollowsProvider } from '@/contexts/follows-context'
import { User, Mail, Phone, MapPin, Building, Calendar, Shield, Edit } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, farmerProfile, agronomistProfile } = useAuth()

  return (
    <ProtectedRoute>
      <FollowsProvider>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-agribeta-green mb-2">Profile</h1>
              <p className="text-lg text-muted-foreground">Manage your profile and account settings</p>
            </div>

            {/* Profile Editor */}
            <ProfileEditor onUpdate={() => window.location.reload()} />
          </div>
        </PageBackground>
      </FollowsProvider>
    </ProtectedRoute>
  )
}


