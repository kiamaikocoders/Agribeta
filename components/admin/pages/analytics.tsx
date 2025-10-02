"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart } from '@/components/ui/chart'

export function AdminAnalyticsPage() {
  const [seriesUsers, setSeriesUsers] = useState<any[]>([])
  const [seriesPosts, setSeriesPosts] = useState<any[]>([])

  useEffect(() => { load() }, [])

  const load = async () => {
    // simple time-bucketed users per day (approx)
    const { data: u } = await supabase.rpc('users_per_day')
    const { data: p } = await supabase.rpc('posts_per_day')

    setSeriesUsers([{ name: 'Users', data: (u || []).map((d: any) => ({ x: d.day, y: d.count })) }])
    setSeriesPosts([{ name: 'Posts', data: (p || []).map((d: any) => ({ x: d.day, y: d.count })) }])
  }

  return (
    <div className="container py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart type="line" series={seriesUsers} height={300} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts per Day</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart type="area" series={seriesPosts} height={300} />
        </CardContent>
      </Card>
    </div>
  )
}


