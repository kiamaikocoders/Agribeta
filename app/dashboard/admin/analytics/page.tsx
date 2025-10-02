import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminAnalyticsPage } from '@/components/admin/pages/analytics'

export default function AdminAnalyticsRoute() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminAnalyticsPage />
    </ProtectedRoute>
  )
}


