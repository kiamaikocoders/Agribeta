import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminModerationPage } from '@/components/admin/pages/moderation'

export default function AdminModerationRoute() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminModerationPage />
    </ProtectedRoute>
  )
}


