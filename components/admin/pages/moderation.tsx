"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, CheckCircle } from 'lucide-react'

interface ReportRow {
  id: string
  post_id: string
  reporter: string
  reason?: string
  status: string
  created_at: string
  posts?: { content: string }
}

export function AdminModerationPage() {
  const [reports, setReports] = useState<ReportRow[]>([])

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase
      .from('post_reports')
      .select('*, posts:post_id(content)')
      .order('created_at', { ascending: false })
    setReports(data || [])
  }

  const resolve = async (id: string) => {
    await supabase.from('post_reports').update({ status: 'resolved' }).eq('id', id)
    await load()
  }

  const removePost = async (postId: string) => {
    await supabase.from('posts').delete().eq('id', postId)
    await load()
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Flagged Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {(reports || []).length === 0 ? (
            <div className="text-sm text-muted-foreground">No reports</div>
          ) : (
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className="p-3 border rounded-md">
                  <div className="text-sm text-muted-foreground">Reported {new Date(r.created_at).toLocaleString()} • Status: {r.status}</div>
                  <div className="my-2">{r.posts?.content}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => resolve(r.id)}><CheckCircle className="h-4 w-4 mr-1"/>Resolve</Button>
                    <Button size="sm" variant="destructive" onClick={() => removePost(r.post_id)}><Trash2 className="h-4 w-4 mr-1"/>Remove Post</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


