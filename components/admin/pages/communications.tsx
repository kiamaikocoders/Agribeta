"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Megaphone } from 'lucide-react'

export function AdminCommunicationsPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const send = async () => {
    if (!subject || !message) return
    setSending(true)
    await supabase.from('announcements').insert([{ subject, message }])
    setSubject(''); setMessage(''); setSending(false)
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-w-2xl">
            <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Subject" />
            <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full border rounded px-3 py-2 h-40" placeholder="Message" />
            <Button onClick={send} disabled={sending}><Megaphone className="h-4 w-4 mr-2"/>{sending ? 'Sending...' : 'Send'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


