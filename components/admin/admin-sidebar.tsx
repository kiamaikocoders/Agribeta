"use client"

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function AdminSidebar() {
  const pathname = usePathname()

  const Item = ({ href, label }: { href: string, label: string }) => (
    <Link href={href} className={cn('block px-3 py-2 rounded hover:bg-accent', pathname === href && 'bg-accent font-medium')}>
      {label}
    </Link>
  )

  return (
    <aside className="col-span-3 lg:col-span-2 border-r min-h-[80vh] p-4 sticky top-16">
      <div className="text-sm text-muted-foreground mb-2">ADMIN MENU</div>
      <nav className="space-y-1">
        <Item href="/dashboard/admin" label="Dashboard" />
        <Item href="/dashboard/admin/users" label="Users" />
        <Item href="/dashboard/admin/moderation" label="Moderation" />
        <Item href="/dashboard/admin/communications" label="Communications" />
        <Item href="/dashboard/admin/analytics" label="Analytics" />
        <Item href="/dashboard/admin/finance" label="Finance" />
        <Item href="/dashboard/admin/system" label="System" />
      </nav>
    </aside>
  )
}
