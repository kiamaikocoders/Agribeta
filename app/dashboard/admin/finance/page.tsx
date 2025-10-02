import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminFinancePage } from '@/components/admin/pages/finance'

export default function AdminFinanceRoute() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminFinancePage />
    </ProtectedRoute>
  )
}


