"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserRow {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: string
  subscription_tier: string
  is_active?: boolean
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers(data || [])
  }

  const toggleAll = (checked: boolean) => {
    const m: Record<string, boolean> = {}
    users.forEach(u => m[u.id] = checked)
    setSelected(m)
  }

  const exportCSV = () => {
    const header = ['id','email','first_name','last_name','role','subscription_tier','is_active']
    const rows = users.map(u => [u.id, u.email, u.first_name || '', u.last_name || '', u.role, u.subscription_tier, String(u.is_active)])
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'users.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const bulkSetRole = async (role: 'farmer'|'agronomist'|'admin') => {
    const ids = Object.keys(selected).filter(id => selected[id])
    if (ids.length === 0) return
    await supabase.from('profiles').update({ role }).in('id', ids)
    await load()
  }

  const bulkSetActive = async (is_active: boolean) => {
    const ids = Object.keys(selected).filter(id => selected[id])
    if (ids.length === 0) return
    await supabase.from('profiles').update({ is_active }).in('id', ids)
    await load()
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
            <Button variant="outline" onClick={() => bulkSetRole('farmer')}>Set Farmer</Button>
            <Button variant="outline" onClick={() => bulkSetRole('agronomist')}>Set Agronomist</Button>
            <Button onClick={() => bulkSetRole('admin')}>Set Admin</Button>
            <Button variant="outline" onClick={() => bulkSetActive(true)}>Activate</Button>
            <Button variant="destructive" onClick={() => bulkSetActive(false)}>Suspend</Button>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2"><input type="checkbox" onChange={(e) => toggleAll(e.target.checked)} /></th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b">
                  <td className="py-2"><input type="checkbox" checked={!!selected[u.id]} onChange={(e) => setSelected({ ...selected, [u.id]: e.target.checked })} /></td>
                  <td>{u.email}</td>
                  <td>{u.first_name} {u.last_name}</td>
                  <td>{u.role}</td>
                  <td>{u.subscription_tier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}


