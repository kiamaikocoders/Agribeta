import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminUsersPage } from '@/components/admin/pages/users'

export default function AdminUsersRoute() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminUsersPage />
    </ProtectedRoute>
  )
}


