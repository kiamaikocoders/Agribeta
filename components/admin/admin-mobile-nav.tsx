"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  MessageSquare, 
  BarChart3, 
  DollarSign, 
  Settings 
} from 'lucide-react'

export function AdminMobileNav() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/moderation", label: "Moderation", icon: Shield },
    { href: "/dashboard/admin/communications", label: "Communications", icon: MessageSquare },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/admin/finance", label: "Finance", icon: DollarSign },
    { href: "/dashboard/admin/system", label: "System", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
      <div className="flex items-center overflow-x-auto scrollbar-hide py-2 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-4 min-w-[80px] flex-shrink-0 transition-colors duration-200',
                isActive 
                  ? 'text-agribeta-green' 
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 mb-1',
                isActive && 'text-agribeta-green'
              )} />
              <span className={cn(
                'text-xs font-medium text-center whitespace-nowrap',
                isActive && 'text-agribeta-green'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
