import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="grid grid-cols-12 gap-4">
        <AdminSidebar />
        <main className="col-span-9 lg:col-span-10">
          <AdminDashboard />
        </main>
      </div>
    </ProtectedRoute>
  )
}
