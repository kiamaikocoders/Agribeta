"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/auth-context'
// import { PageBackground } from '@/components/page-background'
import { 
  Clock, 
  Calendar, 
  Settings,
  Save,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AvailabilityPage() {
  const { profile, agronomistProfile } = useAuth()
  const [availability, setAvailability] = useState({
    isAvailable: true,
    workingHours: {
      start: '08:00',
      end: '17:00'
    },
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    consultationTypes: {
      videoCall: true,
      phoneCall: true,
      farmVisit: true
    },
    advanceBooking: 7, // days
    bufferTime: 30, // minutes
    maxConsultationsPerDay: 8
  })

  const [timeSlots, setTimeSlots] = useState([
    { id: 1, day: 'Monday', start: '09:00', end: '17:00', isActive: true },
    { id: 2, day: 'Tuesday', start: '09:00', end: '17:00', isActive: true },
    { id: 3, day: 'Wednesday', start: '09:00', end: '17:00', isActive: true },
    { id: 4, day: 'Thursday', start: '09:00', end: '17:00', isActive: true },
    { id: 5, day: 'Friday', start: '09:00', end: '17:00', isActive: true },
    { id: 6, day: 'Saturday', start: '10:00', end: '14:00', isActive: false },
    { id: 7, day: 'Sunday', start: '10:00', end: '14:00', isActive: false }
  ])

  const [specialDates, setSpecialDates] = useState([
    { id: 1, date: '2024-01-25', type: 'unavailable', reason: 'Personal appointment' },
    { id: 2, date: '2024-01-30', type: 'limited', reason: 'Conference attendance', hours: '10:00-14:00' }
  ])

  const handleSave = () => {
    // Save availability settings
    console.log('Saving availability settings...')
    // Here you would typically make an API call to save the settings
  }

  const addTimeSlot = () => {
    const newSlot = {
      id: timeSlots.length + 1,
      day: 'Monday',
      start: '09:00',
      end: '17:00',
      isActive: true
    }
    setTimeSlots([...timeSlots, newSlot])
  }

  const updateTimeSlot = (id: number, field: string, value: any) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ))
  }

  const deleteTimeSlot = (id: number) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id))
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-agribeta-green">Availability Settings</h1>
            <p className="text-muted-foreground">Manage your working hours and availability</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" asChild>
              <Link href="/schedule">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Availability
                </CardTitle>
                <CardDescription>Set your overall availability status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Available for Consultations</h4>
                    <p className="text-sm text-muted-foreground">Toggle your availability on/off</p>
                  </div>
                  <Switch 
                    checked={availability.isAvailable}
                    onCheckedChange={(checked) => setAvailability({
                      ...availability,
                      isAvailable: checked
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Working Hours</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="time"
                        value={availability.workingHours.start}
                        onChange={(e) => setAvailability({
                          ...availability,
                          workingHours: { ...availability.workingHours, start: e.target.value }
                        })}
                        className="border rounded px-2 py-1"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={availability.workingHours.end}
                        onChange={(e) => setAvailability({
                          ...availability,
                          workingHours: { ...availability.workingHours, end: e.target.value }
                        })}
                        className="border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Max Consultations/Day</label>
                    <input
                      type="number"
                      value={availability.maxConsultationsPerDay}
                      onChange={(e) => setAvailability({
                        ...availability,
                        maxConsultationsPerDay: parseInt(e.target.value)
                      })}
                      className="border rounded px-2 py-1 w-full mt-1"
                      min="1"
                      max="20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Working Days */}
            <Card>
              <CardHeader>
                <CardTitle>Working Days</CardTitle>
                <CardDescription>Select the days you're available for consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(availability.workingDays).map(([day, isActive]) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="capitalize">{day}</span>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => setAvailability({
                          ...availability,
                          workingDays: { ...availability.workingDays, [day]: checked }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Time Slots</span>
                  <Button size="sm" onClick={addTimeSlot}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slot
                  </Button>
                </CardTitle>
                <CardDescription>Set specific time slots for each day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <select
                          value={slot.day}
                          onChange={(e) => updateTimeSlot(slot.id, 'day', e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateTimeSlot(slot.id, 'start', e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateTimeSlot(slot.id, 'end', e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      </div>
                      <Switch
                        checked={slot.isActive}
                        onCheckedChange={(checked) => updateTimeSlot(slot.id, 'isActive', checked)}
                      />
                      <Button size="sm" variant="outline" onClick={() => deleteTimeSlot(slot.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consultation Types */}
            <Card>
              <CardHeader>
                <CardTitle>Consultation Types</CardTitle>
                <CardDescription>Available consultation methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(availability.consultationTypes).map(([type, isActive]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => setAvailability({
                        ...availability,
                        consultationTypes: { ...availability.consultationTypes, [type]: checked }
                      })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Booking Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Settings</CardTitle>
                <CardDescription>Configure booking preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Advance Booking (days)</label>
                  <input
                    type="number"
                    value={availability.advanceBooking}
                    onChange={(e) => setAvailability({
                      ...availability,
                      advanceBooking: parseInt(e.target.value)
                    })}
                    className="border rounded px-2 py-1 w-full mt-1"
                    min="1"
                    max="30"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Buffer Time (minutes)</label>
                  <input
                    type="number"
                    value={availability.bufferTime}
                    onChange={(e) => setAvailability({
                      ...availability,
                      bufferTime: parseInt(e.target.value)
                    })}
                    className="border rounded px-2 py-1 w-full mt-1"
                    min="0"
                    max="120"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Special Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Special Dates</CardTitle>
                <CardDescription>Mark unavailable or limited days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {specialDates.map((date) => (
                    <div key={date.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{date.date}</p>
                          <p className="text-sm text-muted-foreground">{date.reason}</p>
                          {date.hours && (
                            <p className="text-xs text-muted-foreground">{date.hours}</p>
                          )}
                        </div>
                        <Badge variant={date.type === 'unavailable' ? 'destructive' : 'secondary'}>
                          {date.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Special Date
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {availability.isAvailable ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={availability.isAvailable ? 'text-green-600' : 'text-red-600'}>
                    {availability.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Next available slot: Today at 2:00 PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
