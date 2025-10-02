"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Edit, Trash2, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from '@/lib/supabaseClient'

// Helper for initial form state
const initialTrapState = [
  { location: '', count: '' },
  { location: '', count: '' },
  { location: '', count: '' },
  { location: '', count: '' },
]
const initialScoutingState = [
  { location: '', findings: '' },
  { location: '', findings: '' },
]

export function FCMMonitoring() {
  // Form state
  const [greenhouse, setGreenhouse] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [traps, setTraps] = useState(initialTrapState)
  const [trapNotes, setTrapNotes] = useState('')
  const [scouting, setScouting] = useState(initialScoutingState)
  const [scoutingNotes, setScoutingNotes] = useState('')
  const [tab, setTab] = useState('traps')

  // Monitoring data state
  const [monitoring, setMonitoring] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>(null)

  // Fetch and subscribe to monitoring data
  useEffect(() => {
    let subscription: any
    const fetchMonitoring = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('fcm_monitoring').select('*').order('date', { ascending: false })
      if (!error && data) setMonitoring(data)
      setLoading(false)
    }
    fetchMonitoring()
    // Real-time subscription
    subscription = supabase
      .channel('fcm_monitoring_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fcm_monitoring' }, (payload) => {
        fetchMonitoring()
      })
      .subscribe()
    return () => {
      if (subscription) supabase.removeChannel(subscription)
    }
  }, [])

  // Handle form input changes
  const handleTrapChange = (idx: number, field: string, value: string) => {
    setTraps((prev) => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t))
  }
  const handleScoutingChange = (idx: number, field: string, value: string) => {
    setScouting((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  // Save new monitoring record
  const handleSave = async () => {
    setSaving(true)
    const record = {
      greenhouse_id: greenhouse,
      date: date ? date.toISOString().split('T')[0] : null,
      trap_data: JSON.stringify(traps),
      trap_notes: trapNotes,
      scouting_data: JSON.stringify(scouting),
      scouting_notes: scoutingNotes,
    }
    const { error } = await supabase.from('fcm_monitoring').insert([record])
    setSaving(false)
    if (!error) {
      setGreenhouse('')
      setDate(new Date())
      setTraps(initialTrapState)
      setTrapNotes('')
      setScouting(initialScoutingState)
      setScoutingNotes('')
    } else {
      alert('Error saving: ' + error.message)
    }
  }

  // Start editing a record
  const startEdit = (row: any) => {
    setEditingId(row.id)
    setEditForm({
      greenhouse: row.greenhouse_id,
      date: row.date,
      traps: row.trap_data ? JSON.parse(row.trap_data) : initialTrapState,
      trapNotes: row.trap_notes || '',
      scouting: row.scouting_data ? JSON.parse(row.scouting_data) : initialScoutingState,
      scoutingNotes: row.scouting_notes || '',
    })
  }

  // Handle edit form changes
  const handleEditTrapChange = (idx: number, field: string, value: string) => {
    setEditForm((prev: any) => ({ ...prev, traps: prev.traps.map((t: any, i: number) => i === idx ? { ...t, [field]: value } : t) }))
  }
  const handleEditScoutingChange = (idx: number, field: string, value: string) => {
    setEditForm((prev: any) => ({ ...prev, scouting: prev.scouting.map((s: any, i: number) => i === idx ? { ...s, [field]: value } : s) }))
  }

  // Save edit
  const handleEditSave = async (id: string) => {
    setSaving(true)
    const record = {
      greenhouse_id: editForm.greenhouse,
      date: editForm.date,
      trap_data: JSON.stringify(editForm.traps),
      trap_notes: editForm.trapNotes,
      scouting_data: JSON.stringify(editForm.scouting),
      scouting_notes: editForm.scoutingNotes,
    }
    const { error } = await supabase.from('fcm_monitoring').update(record).eq('id', id)
    setSaving(false)
    if (!error) setEditingId(null)
    else alert('Error updating: ' + error.message)
  }

  // Delete record
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record?')) return
    await supabase.from('fcm_monitoring').delete().eq('id', id)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Schedule</CardTitle>
          <CardDescription>Conduct all monitoring activities twice weekly with documented results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="greenhouse">Greenhouse</Label>
              <div className="flex gap-2 mt-1">
                <Input id="greenhouse" placeholder="Select greenhouse" value={greenhouse} onChange={e => setGreenhouse(e.target.value)} />
                <Button variant="outline" size="icon" onClick={() => setGreenhouse('')}><X className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal mt-1", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="traps">Pheromone Traps</TabsTrigger>
              <TabsTrigger value="scouting">Scouting</TabsTrigger>
            </TabsList>
            <TabsContent value="traps" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {traps.map((trap, i) => (
                    <div className="border rounded-lg p-4" key={`trap-${i}`}>
                      <h3 className="font-medium mb-2">Trap #{i + 1}</h3>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`trap${i + 1}-location`}>Location</Label>
                          <Input id={`trap${i + 1}-location`} placeholder="Enter location" className="mt-1" value={trap.location} onChange={e => handleTrapChange(i, 'location', e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor={`trap${i + 1}-count`}>FCM Count</Label>
                          <Input id={`trap${i + 1}-count`} type="number" placeholder="0" className="mt-1" value={trap.count} onChange={e => handleTrapChange(i, 'count', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <Label htmlFor="trap-notes">Notes</Label>
                  <textarea
                    id="trap-notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    placeholder="Enter any additional observations or notes"
                    value={trapNotes}
                    onChange={e => setTrapNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Trap Data'}</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="scouting" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scouting.map((area, i) => (
                    <div className="border rounded-lg p-4" key={`scouting-${i}`}>
                      <h3 className="font-medium mb-2">Scouting Area {i + 1}</h3>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`area${i + 1}-location`}>Location</Label>
                          <Input id={`area${i + 1}-location`} placeholder="Enter location" className="mt-1" value={area.location} onChange={e => handleScoutingChange(i, 'location', e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor={`area${i + 1}-findings`}>Findings</Label>
                          <textarea
                            id={`area${i + 1}-findings`}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            placeholder="Describe any signs of FCM presence"
                            value={area.findings}
                            onChange={e => handleScoutingChange(i, 'findings', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <Label htmlFor="scouting-notes">General Notes</Label>
                  <textarea
                    id="scouting-notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    placeholder="Enter any additional observations or notes"
                    value={scoutingNotes}
                    onChange={e => setScoutingNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Scouting Data'}</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring History</CardTitle>
          <CardDescription>View past monitoring records and trends</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading monitoring data...</div>
          ) : monitoring.length === 0 ? (
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-500">No monitoring data available yet. Start recording data to see history.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#167539]/10">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Greenhouse</th>
                    <th className="px-4 py-2">Trap Data</th>
                    <th className="px-4 py-2">Scouting Data</th>
                    <th className="px-4 py-2">Notes</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoring.map((m) => (
                    editingId === m.id ? (
                      <tr key={m.id} className="border-b bg-yellow-50">
                        <td className="px-2 py-1">
                          <Input type="date" value={editForm.date} onChange={e => setEditForm((prev: any) => ({ ...prev, date: e.target.value }))} />
                        </td>
                        <td className="px-2 py-1">
                          <Input value={editForm.greenhouse} onChange={e => setEditForm((prev: any) => ({ ...prev, greenhouse: e.target.value }))} />
                        </td>
                        <td className="px-2 py-1">
                          {editForm && editForm.traps.map((trap: any, i: number) => (
                            <div key={`edit-trap-${i}`} className="mb-1">
                              <Input placeholder="Location" value={trap.location} onChange={e => handleEditTrapChange(i, 'location', e.target.value)} className="mb-1" />
                              <Input type="number" placeholder="Count" value={trap.count} onChange={e => handleEditTrapChange(i, 'count', e.target.value)} />
                            </div>
                          ))}
                          <textarea value={editForm.trapNotes} onChange={e => setEditForm((prev: any) => ({ ...prev, trapNotes: e.target.value }))} className="w-full mt-1" />
                        </td>
                        <td className="px-2 py-1">
                          {editForm && editForm.scouting.map((area: any, i: number) => (
                            <div key={`edit-scouting-${i}`} className="mb-1">
                              <Input placeholder="Location" value={area.location} onChange={e => handleEditScoutingChange(i, 'location', e.target.value)} className="mb-1" />
                              <textarea placeholder="Findings" value={area.findings} onChange={e => handleEditScoutingChange(i, 'findings', e.target.value)} className="w-full" />
                            </div>
                          ))}
                          <textarea value={editForm.scoutingNotes} onChange={e => setEditForm((prev: any) => ({ ...prev, scoutingNotes: e.target.value }))} className="w-full mt-1" />
                        </td>
                        <td className="px-2 py-1">-</td>
                        <td className="px-2 py-1 flex gap-1">
                          <Button size="icon" variant="outline" onClick={() => handleEditSave(m.id)} disabled={saving}><Check className="h-4 w-4" /></Button>
                          <Button size="icon" variant="outline" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={m.id} className="border-b">
                        <td className="px-4 py-2">{m.date}</td>
                        <td className="px-4 py-2">{m.greenhouse_id}</td>
                        <td className="px-4 py-2">
                          {m.trap_data && JSON.parse(m.trap_data).map((trap: any, i: number) => (
                            <div key={`trap-${i}`}>#{i + 1}: {trap.location} ({trap.count})</div>
                          ))}
                          {m.trap_notes && <div className="text-xs text-gray-500 mt-1">Notes: {m.trap_notes}</div>}
                        </td>
                        <td className="px-4 py-2">
                          {m.scouting_data && JSON.parse(m.scouting_data).map((area: any, i: number) => (
                            <div key={`scouting-${i}`}>Area {i + 1}: {area.location} - {area.findings}</div>
                          ))}
                          {m.scouting_notes && <div className="text-xs text-gray-500 mt-1">Notes: {m.scouting_notes}</div>}
                        </td>
                        <td className="px-4 py-2">-</td>
                        <td className="px-4 py-2 flex gap-1">
                          <Button size="icon" variant="outline" onClick={() => startEdit(m)}><Edit className="h-4 w-4" /></Button>
                          <Button size="icon" variant="destructive" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
