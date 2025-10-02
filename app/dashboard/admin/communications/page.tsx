import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminCommunicationsPage } from '@/components/admin/pages/communications'

export default function AdminCommsRoute() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminCommunicationsPage />
    </ProtectedRoute>
  )
}


