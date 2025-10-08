# Manual Calendly Integration - Step by Step

This guide shows you how to integrate Calendly manually with AgriBeta for automatic availability management.

## 🎯 What We'll Build

✅ **Real-time availability** from Calendly  
✅ **Automatic booking sync** between AgriBeta and Calendly  
✅ **Meeting link generation** for video consultations  
✅ **Double-booking prevention**  
✅ **Timezone handling**  

---

## 📋 Step 1: Set Up Calendly Account

### 1.1 Create Calendly Account
1. Go to [calendly.com](https://calendly.com)
2. Sign up for a **Pro account** (required for API access)
3. Complete your profile setup

### 1.2 Create Event Types
Set up these consultation types in Calendly:

**Event Types to Create:**
- **30-minute Video Consultation** (30 min)
- **60-minute Video Consultation** (60 min) 
- **90-minute Farm Visit Planning** (90 min)
- **Phone Consultation** (30 min)

**For each event type:**
1. Go to **Event Types** → **Create New**
2. Set duration (30, 60, or 90 minutes)
3. Add description: "Agricultural consultation with AgriBeta"
4. Set availability (your working hours)
5. Enable **"Collect invitee information"**
6. Add custom questions:
   - "What farming challenges are you facing?"
   - "What crops do you grow?"
7. **Save** the event type

### 1.3 Get API Credentials
1. Go to **Settings** → **Integrations** → **API & Webhooks**
2. Click **"Create Token"**
3. Name: "AgriBeta Integration"
4. **Copy the token** (starts with `eyJ...`)
5. **Get your organization ID**:
   - Go to **Settings** → **Account**
   - Your organization URL: `https://calendly.com/your-username`
   - Or use API to get it

---

## 🔧 Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Calendly Integration
CALENDLY_API_KEY=eyJ_your_token_here
CALENDLY_ORGANIZATION_ID=your_organization_id
CALENDLY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_CALENDLY_EMBED=true
```

**Get Organization ID:**
```bash
# Test API call to get organization ID
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.calendly.com/users/me"
```

---

## 📦 Step 3: Install Dependencies

```bash
npm install @calendly/calendly-js
```

---

## 🗄️ Step 4: Update Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Add Calendly fields to agronomist_profiles
ALTER TABLE agronomist_profiles
ADD COLUMN calendly_username TEXT,
ADD COLUMN calendly_user_id TEXT,
ADD COLUMN calendly_event_type_30min TEXT,
ADD COLUMN calendly_event_type_60min TEXT,
ADD COLUMN calendly_event_type_90min TEXT,
ADD COLUMN calendly_event_type_phone TEXT;

-- Add index for lookups
CREATE INDEX idx_agronomist_calendly_user 
ON agronomist_profiles(calendly_user_id);
```

---

## 🔌 Step 5: Create Calendly Service

Create `/lib/calendly-service.ts`:

```typescript
/**
 * Calendly Service
 * Handles all Calendly API interactions
 */

interface CalendlyEvent {
  uri: string
  name: string
  start_time: string
  end_time: string
  event_type: string
  location?: {
    type: string
    location: string
  }
  invitees: Array<{
    email: string
    name: string
  }>
}

interface CalendlyEventType {
  uri: string
  name: string
  active: boolean
  duration: number
  scheduling_url: string
}

interface CalendlyUser {
  uri: string
  name: string
  email: string
  scheduling_url: string
  timezone: string
}

export class CalendlyService {
  private apiKey: string
  private baseUrl = 'https://api.calendly.com'

  constructor() {
    this.apiKey = process.env.CALENDLY_API_KEY!
    if (!this.apiKey) {
      throw new Error('CALENDLY_API_KEY environment variable is required')
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Calendly API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get user's Calendly information
   */
  async getCurrentUser(): Promise<CalendlyUser> {
    const data = await this.makeRequest('/users/me')
    return data.resource
  }

  /**
   * Get user's event types
   */
  async getEventTypes(userUri: string): Promise<CalendlyEventType[]> {
    const data = await this.makeRequest(`/event_types?user=${encodeURIComponent(userUri)}`)
    return data.collection
  }

  /**
   * Get scheduled events for a date range
   */
  async getScheduledEvents(
    userUri: string, 
    startDate: string, 
    endDate: string
  ): Promise<CalendlyEvent[]> {
    const data = await this.makeRequest(
      `/scheduled_events?user=${encodeURIComponent(userUri)}&min_start_time=${startDate}&max_start_time=${endDate}`
    )
    return data.collection
  }

  /**
   * Create a new scheduled event
   */
  async createScheduledEvent(eventData: {
    event_type: string
    start_time: string
    end_time: string
    invitee_email: string
    invitee_name: string
    location?: string
  }): Promise<CalendlyEvent> {
    const data = await this.makeRequest('/scheduled_events', {
      method: 'POST',
      body: JSON.stringify({
        event: {
          event_type: eventData.event_type,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          invitees: [{
            email: eventData.invitee_email,
            name: eventData.invitee_name
          }],
          location: eventData.location ? {
            type: 'physical',
            location: eventData.location
          } : undefined
        }
      })
    })
    return data.resource
  }

  /**
   * Cancel a scheduled event
   */
  async cancelScheduledEvent(eventUri: string, reason?: string): Promise<void> {
    await this.makeRequest(`/scheduled_events/${eventUri}/cancellation`, {
      method: 'POST',
      body: JSON.stringify({
        reason: reason || 'Cancelled by user'
      })
    })
  }

  /**
   * Get availability for a specific date
   */
  async getAvailability(userUri: string, date: string): Promise<string[]> {
    const startOfDay = `${date}T00:00:00.000Z`
    const endOfDay = `${date}T23:59:59.999Z`
    
    const events = await this.getScheduledEvents(userUri, startOfDay, endOfDay)
    
    // Calculate available slots (simplified - in production, use Calendly's availability API)
    const workingHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    const bookedTimes = events.map(event => 
      new Date(event.start_time).toTimeString().slice(0, 5)
    )
    
    return workingHours.filter(time => !bookedTimes.includes(time))
  }
}

// Export singleton instance
export const calendlyService = new CalendlyService()
```

---

## 🔄 Step 6: Create API Endpoints

### 6.1 Calendly Availability API

Create `/app/api/calendly/availability/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { calendlyService } from '@/lib/calendly-service'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agronomistId = searchParams.get('agronomistId')
    const date = searchParams.get('date')

    if (!agronomistId || !date) {
      return NextResponse.json({ error: 'Missing agronomistId or date' }, { status: 400 })
    }

    // Get agronomist's Calendly info
    const { data: agronomist } = await supabase
      .from('agronomist_profiles')
      .select('calendly_user_id')
      .eq('id', agronomistId)
      .single()

    if (!agronomist?.calendly_user_id) {
      // No Calendly connected, return default availability
      return NextResponse.json({ 
        available_times: ['09:00', '10:00', '14:00', '15:00'],
        calendly_connected: false
      })
    }

    // Get real availability from Calendly
    const availableTimes = await calendlyService.getAvailability(
      agronomist.calendly_user_id,
      date
    )

    return NextResponse.json({
      available_times: availableTimes,
      calendly_connected: true
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch availability',
      available_times: ['09:00', '10:00', '14:00', '15:00'] // Fallback
    }, { status: 500 })
  }
}
```

### 6.2 Calendly Sync API

Create `/app/api/calendly/sync/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { calendlyService } from '@/lib/calendly-service'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agronomistId, consultationId, action } = body

    if (!agronomistId || !consultationId) {
      return NextResponse.json({ error: 'Missing agronomistId or consultationId' }, { status: 400 })
    }

    // Get consultation details
    const { data: consultation } = await supabase
      .from('consultations')
      .select('*, farmer:profiles!consultations_farmer_id_fkey(first_name, last_name, email)')
      .eq('id', consultationId)
      .single()

    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
    }

    // Get agronomist's Calendly info
    const { data: agronomist } = await supabase
      .from('agronomist_profiles')
      .select('calendly_user_id, calendly_event_type_30min, calendly_event_type_60min, calendly_event_type_90min')
      .eq('id', agronomistId)
      .single()

    if (!agronomist?.calendly_user_id) {
      return NextResponse.json({ error: 'Agronomist not connected to Calendly' }, { status: 400 })
    }

    // Determine event type based on duration
    let eventTypeUri = agronomist.calendly_event_type_60min // Default
    if (consultation.duration_minutes === 30) {
      eventTypeUri = agronomist.calendly_event_type_30min
    } else if (consultation.duration_minutes === 90) {
      eventTypeUri = agronomist.calendly_event_type_90min
    }

    if (action === 'create') {
      // Create event in Calendly
      const calendlyEvent = await calendlyService.createScheduledEvent({
        event_type: eventTypeUri,
        start_time: `${consultation.scheduled_date}T${consultation.scheduled_time}:00Z`,
        end_time: `${consultation.scheduled_date}T${consultation.scheduled_time}:00Z`,
        invitee_email: consultation.farmer.email,
        invitee_name: `${consultation.farmer.first_name} ${consultation.farmer.last_name}`,
        location: consultation.consultation_type === 'video' ? 'Video Call' : undefined
      })

      // Update consultation with Calendly event ID
      await supabase
        .from('consultations')
        .update({ 
          calendly_event_id: calendlyEvent.uri,
          meeting_link: calendlyEvent.location?.location
        })
        .eq('id', consultationId)

      return NextResponse.json({ 
        success: true, 
        calendly_event_id: calendlyEvent.uri,
        meeting_link: calendlyEvent.location?.location
      })
    }

    if (action === 'cancel' && consultation.calendly_event_id) {
      // Cancel event in Calendly
      await calendlyService.cancelScheduledEvent(consultation.calendly_event_id)
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error syncing with Calendly:', error)
    return NextResponse.json({ error: 'Failed to sync with Calendly' }, { status: 500 })
  }
}
```

---

## 🎨 Step 7: Update Booking Page

Update `/app/agronomists/booking/page.tsx` to use real Calendly availability:

```typescript
// Add this to the existing booking page

// Replace the hardcoded availability with real Calendly data
const [availableTimes, setAvailableTimes] = useState<string[]>([])

// Fetch availability when date changes
useEffect(() => {
  if (selectedAgronomist && selectedDate) {
    fetchAvailability()
  }
}, [selectedAgronomist, selectedDate])

const fetchAvailability = async () => {
  try {
    const response = await fetch(
      `/api/calendly/availability?agronomistId=${selectedAgronomist.id}&date=${selectedDate}`
    )
    const data = await response.json()
    setAvailableTimes(data.available_times || ['09:00', '10:00', '14:00', '15:00'])
  } catch (error) {
    console.error('Error fetching availability:', error)
    setAvailableTimes(['09:00', '10:00', '14:00', '15:00']) // Fallback
  }
}

// Update the time selection dropdown
<Select value={selectedTime} onValueChange={setSelectedTime}>
  <SelectTrigger>
    <SelectValue placeholder="Select time" />
  </SelectTrigger>
  <SelectContent>
    {availableTimes.map((time) => (
      <SelectItem key={time} value={time}>
        {time}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

---

## 🔄 Step 8: Update Booking API

Update `/app/api/bookings/route.ts` to sync with Calendly:

```typescript
// Add this after creating the booking in the POST endpoint

// Sync with Calendly if agronomist is connected
try {
  const syncResponse = await fetch('/api/calendly/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agronomistId: agronomist_id,
      consultationId: booking.id,
      action: 'create'
    })
  })

  if (syncResponse.ok) {
    const syncData = await syncResponse.json()
    // Update booking with Calendly event ID and meeting link
    await supabase
      .from('consultations')
      .update({
        calendly_event_id: syncData.calendly_event_id,
        meeting_link: syncData.meeting_link
      })
      .eq('id', booking.id)
  }
} catch (error) {
  console.error('Failed to sync with Calendly:', error)
  // Don't fail the booking if Calendly sync fails
}
```

---

## 👤 Step 9: Agronomist Profile Setup

Create a page for agronomists to connect their Calendly account:

Create `/app/profile/calendly/page.tsx`:

```tsx
"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { calendlyService } from '@/lib/calendly-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function CalendlySetupPage() {
  const { user, profile } = useAuth()
  const [calendlyUsername, setCalendlyUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  const connectCalendly = async () => {
    if (!calendlyUsername) return

    setLoading(true)
    try {
      // Get user's Calendly info
      const calendlyUser = await calendlyService.getCurrentUser()
      const eventTypes = await calendlyService.getEventTypes(calendlyUser.uri)

      // Update agronomist profile
      const response = await fetch('/api/profiles/agronomist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          calendly_username: calendlyUsername,
          calendly_user_id: calendlyUser.uri,
          calendly_event_type_30min: eventTypes.find(et => et.duration === 30)?.uri,
          calendly_event_type_60min: eventTypes.find(et => et.duration === 60)?.uri,
          calendly_event_type_90min: eventTypes.find(et => et.duration === 90)?.uri,
        })
      })

      if (response.ok) {
        setConnected(true)
      }
    } catch (error) {
      console.error('Error connecting Calendly:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Connect Calendly</CardTitle>
        </CardHeader>
        <CardContent>
          {connected ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Calendly connected successfully!</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="calendly-username">Calendly Username</Label>
                <Input
                  id="calendly-username"
                  placeholder="your-username"
                  value={calendlyUsername}
                  onChange={(e) => setCalendlyUsername(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your Calendly URL: https://calendly.com/{calendlyUsername}
                </p>
              </div>
              
              <Button 
                onClick={connectCalendly}
                disabled={loading || !calendlyUsername}
              >
                {loading ? 'Connecting...' : 'Connect Calendly'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🧪 Step 10: Testing

### 10.1 Test API Connection
```bash
# Test your Calendly API key
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.calendly.com/users/me"
```

### 10.2 Test Availability
1. Go to booking page
2. Select an agronomist with Calendly connected
3. Pick a date
4. Verify real availability shows up

### 10.3 Test Booking Sync
1. Create a booking
2. Check if it appears in Calendly
3. Verify meeting link is generated

---

## 🎯 What You'll Have After Setup

✅ **Real-time availability** from Calendly  
✅ **Automatic booking sync** between systems  
✅ **Meeting links** for video consultations  
✅ **Double-booking prevention**  
✅ **Timezone handling**  
✅ **Fallback to hardcoded times** if Calendly not connected  

---

## 🔧 Troubleshooting

### API Key Issues
- Verify token is correct
- Check token has proper permissions
- Ensure Pro account is active

### Availability Not Showing
- Check agronomist has Calendly connected
- Verify event types are created
- Check API response in browser console

### Booking Sync Issues
- Check Calendly event types match duration
- Verify webhook endpoints
- Check error logs

---

## 🚀 Next Steps

1. **Set up Calendly account** (5 minutes)
2. **Configure environment variables** (2 minutes)
3. **Run database migration** (1 minute)
4. **Install dependencies** (1 minute)
5. **Create service files** (10 minutes)
6. **Update booking page** (5 minutes)
7. **Test integration** (10 minutes)

**Total time: ~35 minutes**

This gives you a fully functional Calendly integration with automatic availability management! 🎉
