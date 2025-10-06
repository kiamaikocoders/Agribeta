"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/contexts/auth-context'
import { PageBackground } from '@/components/page-background'
import { EnhancedProfileEditor } from '@/components/profile/enhanced-profile-editor'
import { FollowsProvider } from '@/contexts/follows-context'
import { PostsProvider } from '@/contexts/posts-context'

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agribeta-green"></div>
      </div>
    )
  }

  // If user doesn't have a role set, show role selection
  if (user && (!profile || !profile.role)) {
    return (
      <ProtectedRoute>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-agribeta-green mb-4">Welcome to AgriBeta!</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Your profile is being set up automatically. Please wait a moment...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agribeta-green mx-auto"></div>
              </div>
            </div>
          </div>
        </PageBackground>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <FollowsProvider>
        <PostsProvider>
          <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-agribeta-green mb-2">Profile</h1>
                <p className="text-lg text-muted-foreground">Manage your profile and account settings</p>
              </div>

              {/* Enhanced Profile Editor with Role-Based Tabs */}
              <EnhancedProfileEditor onUpdate={() => window.location.reload()} />
            </div>
          </PageBackground>
        </PostsProvider>
      </FollowsProvider>
    </ProtectedRoute>
  )
}


