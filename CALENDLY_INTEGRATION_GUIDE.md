# Calendly Integration Guide

This guide explains how to integrate Calendly with AgriBeta for managing agronomist availability and scheduling.

## Overview

Calendly can be integrated to:
- Manage agronomist availability automatically
- Prevent double-bookings
- Generate meeting links for video consultations
- Sync calendars across platforms

## Setup Instructions

### 1. Create a Calendly Account

1. Sign up at [calendly.com](https://calendly.com)
2. Create an account for your organization
3. Set up event types for different consultation types:
   - **30-minute Video Consultation**
   - **60-minute Video Consultation**
   - **90-minute Farm Visit Planning**
   - **Phone Consultation**

### 2. Get Calendly API Access

1. Go to **Integrations** > **API & Webhooks**
2. Generate a Personal Access Token
3. Copy the token (you'll need it for environment variables)

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Calendly Integration
CALENDLY_API_KEY=your_personal_access_token_here
CALENDLY_WEBHOOK_SECRET=your_webhook_signing_key
NEXT_PUBLIC_CALENDLY_EMBED=true
```

### 4. Install Calendly SDK

```bash
npm install @calendly/calendly-js
```

### 5. Create Calendly Service (Optional Advanced Integration)

Create `/lib/calendly-service.ts`:

```typescript
import { Calendly } from '@calendly/calendly-js'

const calendly = new Calendly({
  apiKey: process.env.CALENDLY_API_KEY!
})

export async function createCalendlyEvent(data: {
  email: string
  name: string
  start_time: string
  end_time: string
  event_type: string
}) {
  // Create event via Calendly API
  const event = await calendly.scheduling.createEvent({
    invitee_email: data.email,
    invitee_name: data.name,
    event_start_time: data.start_time,
    event_end_time: data.end_time
  })
  
  return event
}

export async function getAvailableTimes(
  agronomistCalendlyUrl: string,
  date: string
) {
  // Fetch available times for a specific date
  const availability = await calendly.availability.get({
    user: agronomistCalendlyUrl,
    date: date
  })
  
  return availability
}
```

## Implementation Options

### Option 1: Embedded Calendly Widget (Easiest)

Add Calendly widget directly in the booking page:

```tsx
// In /app/agronomists/booking/page.tsx

import { useEffect } from 'react'

// Add Calendly script
useEffect(() => {
  const script = document.createElement('script')
  script.src = 'https://assets.calendly.com/assets/external/widget.js'
  script.async = true
  document.body.appendChild(script)
  
  return () => {
    document.body.removeChild(script)
  }
}, [])

// In your JSX (Step 2 - Schedule):
<div 
  className="calendly-inline-widget" 
  data-url={`https://calendly.com/${selectedAgronomist.calendly_username}`}
  style={{ minWidth: '320px', height: '630px' }}
/>
```

### Option 2: API Integration (Advanced)

Fetch availability via API and display in custom UI:

```typescript
// Update agronomist_profiles table to store Calendly URL
ALTER TABLE agronomist_profiles 
ADD COLUMN calendly_url TEXT;
ADD COLUMN calendly_event_type_id TEXT;

// Fetch availability
const getAvailability = async (agronomistId: string, date: string) => {
  const response = await fetch('/api/calendly/availability', {
    method: 'POST',
    body: JSON.stringify({ agronomistId, date })
  })
  
  return response.json()
}
```

### Option 3: Webhook Integration (Real-time Sync)

Set up webhooks to sync Calendly events with your database:

```typescript
// /app/api/calendly/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  // Verify webhook signature
  const signature = request.headers.get('calendly-webhook-signature')
  const body = await request.text()
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.CALENDLY_WEBHOOK_SECRET!)
    .update(body)
    .digest('base64')
  
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const event = JSON.parse(body)
  
  // Handle different webhook events
  switch (event.event) {
    case 'invitee.created':
      // Booking was created in Calendly
      await syncBookingFromCalendly(event.payload)
      break
    
    case 'invitee.canceled':
      // Booking was canceled in Calendly
      await cancelBookingFromCalendly(event.payload)
      break
  }
  
  return NextResponse.json({ success: true })
}

async function syncBookingFromCalendly(payload: any) {
  // Extract booking details
  const { event, invitee } = payload
  
  // Create or update booking in database
  await supabaseAdmin()
    .from('consultations')
    .upsert({
      calendly_event_id: event.uuid,
      meeting_link: event.location.join_url,
      // ... other fields
    })
}
```

## Database Schema Updates

Add Calendly-related fields to `agronomist_profiles`:

```sql
-- Migration: 008_add_calendly_fields.sql

ALTER TABLE agronomist_profiles
ADD COLUMN calendly_url TEXT,
ADD COLUMN calendly_event_type_id TEXT,
ADD COLUMN calendly_user_id TEXT;

-- Add index for lookups
CREATE INDEX idx_agronomist_calendly_user 
ON agronomist_profiles(calendly_user_id);
```

## Agronomist Profile Update

Allow agronomists to set their Calendly URL in their profile:

```tsx
// In profile settings
<div>
  <Label>Calendly URL</Label>
  <Input 
    placeholder="https://calendly.com/your-username"
    value={calendlyUrl}
    onChange={(e) => setCalendlyUrl(e.target.value)}
  />
  <p className="text-sm text-muted-foreground mt-1">
    Connect your Calendly account to manage availability
  </p>
</div>
```

## Current Implementation (Without Calendly)

Currently, the system uses:
- **Hardcoded availability**: Default time slots (09:00, 10:00, 14:00, 15:00)
- **Manual confirmation**: Agronomists manually confirm bookings
- **No double-booking prevention**: Relies on agronomists managing their calendar

## Benefits of Calendly Integration

✅ **Automatic Availability**: Real-time availability based on agronomist's calendar  
✅ **No Double-Bookings**: Calendly prevents conflicts automatically  
✅ **Calendar Sync**: Integrates with Google Calendar, Outlook, etc.  
✅ **Meeting Links**: Automatically generates Zoom/Google Meet links  
✅ **Reminders**: Calendly sends automatic reminders  
✅ **Time Zones**: Handles time zone conversions automatically  
✅ **Rescheduling**: Easy rescheduling through Calendly  

## Testing Without Calendly

For development/testing without Calendly:
1. Use the hardcoded availability (already implemented)
2. Manually manage bookings through the consultations page
3. Set `meeting_link` manually when confirming bookings

## Production Recommendation

For production use, we recommend:
1. **Option 1 (Embedded Widget)** for quickest implementation
2. **Option 3 (Webhook Integration)** for best user experience
3. Store `calendly_event_id` in database for reference
4. Allow agronomists to choose between manual or Calendly booking

## Next Steps

1. Choose integration option based on your needs
2. Set up Calendly account and API access
3. Update agronomist profile schema
4. Implement chosen integration method
5. Test thoroughly with test accounts
6. Deploy and monitor

## Support

For Calendly API documentation: https://developer.calendly.com/  
For AgriBeta support: Contact your development team

---

**Note**: The current booking system is fully functional without Calendly. Calendly is an optional enhancement for better availability management.

