"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminMobileNav } from '@/components/admin/admin-mobile-nav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-screen">
          {/* Sticky Sidebar */}
          <div className="sticky top-0 h-screen overflow-y-auto">
            <AdminSidebar />
          </div>
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <main className="pb-20">
            {children}
          </main>
          <AdminMobileNav />
        </div>
      </div>
    </ProtectedRoute>
  )
}
