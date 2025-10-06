"use client"

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  MessageSquare, 
  BarChart3, 
  DollarSign, 
  Settings 
} from 'lucide-react'

export function AdminSidebar() {
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

  const Item = ({ href, label, icon: Icon }: { href: string, label: string, icon: any }) => (
    <Link 
      href={href} 
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-900', 
        pathname === href && 'bg-agribeta-green text-white hover:bg-agribeta-green hover:text-white'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  )

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        {/* Prominent Admin Menu Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ADMIN MENU</h2>
          <div className="w-12 h-1 bg-agribeta-green rounded-full"></div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Item 
              key={item.href}
              href={item.href} 
              label={item.label} 
              icon={item.icon}
            />
          ))}
        </nav>
      </div>
    </aside>
  )
}
