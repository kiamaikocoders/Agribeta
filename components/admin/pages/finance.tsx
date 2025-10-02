"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AdminFinancePage() {
  const [counts, setCounts] = useState({ free: 0, paid: 0, total: 0 })
  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('profiles').select('subscription_tier')
    const free = (data || []).filter(d => d.subscription_tier === 'free').length
    const paid = (data || []).filter(d => d.subscription_tier !== 'free').length
    setCounts({ free, paid, total: (data || []).length })
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">{counts.total}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{counts.paid}</div>
              <div className="text-sm text-muted-foreground">Paid</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{counts.free}</div>
              <div className="text-sm text-muted-foreground">Free</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


