# Supabase Calendly Wrapper Integration

This guide shows how to use the **Supabase Calendly Wrapper** (which you already have available) to integrate Calendly with AgriBeta for automatic availability management.

## 🎯 Overview

The Supabase Calendly Wrapper creates **foreign tables** in your Supabase database that automatically sync with your Calendly data. This is much more powerful than manual API integration.

## 📋 Setup Steps

### 1. Get Calendly API Credentials

1. **Go to Calendly**: https://calendly.com
2. **Settings** → **Integrations** → **API & Webhooks**
3. **Create Personal Access Token**:
   - Click "Create Token"
   - Name: "AgriBeta Integration"
   - Copy the token (starts with `eyJ...`)

4. **Get Organization ID**:
   - Go to Settings → Account
   - Your organization URL: `https://calendly.com/your-username`
   - Or use API to get organization ID

### 2. Configure Supabase Wrapper

In your Supabase dashboard (Integrations → Calendly Wrapper):

**Wrapper Configuration:**
- **Wrapper Name**: `agribeta_calendly`
- **Organization URL**: `https://api.calendly.com/organizations/YOUR_ORG_ID`
- **API URL**: `https://api.calendly.com` (default)
- **API Key ID**: `YOUR_PERSONAL_ACCESS_TOKEN`

**Foreign Tables to Add:**
- ✅ **Events** - Consultation bookings
- ✅ **Event Types** - Consultation types (30min, 60min, etc.)
- ✅ **Users** - Agronomist profiles
- ✅ **Scheduled Events** - Actual bookings

### 3. Create the Wrapper

Click "Create wrapper" and wait for setup to complete.

## 🗄️ Database Schema Updates

After the wrapper is created, you'll have these foreign tables:

```sql
-- Calendly foreign tables (read-only)
calendly_events
calendly_event_types  
calendly_users
calendly_scheduled_events
```

### Update Agronomist Profiles

Add Calendly fields to your existing `agronomist_profiles` table:

```sql
-- Add to agronomist_profiles table
ALTER TABLE agronomist_profiles
ADD COLUMN calendly_user_id TEXT,
ADD COLUMN calendly_username TEXT,
ADD COLUMN calendly_event_type_id TEXT;

-- Add index for lookups
CREATE INDEX idx_agronomist_calendly_user 
ON agronomist_profiles(calendly_user_id);
```

## 🔄 Integration Points

### 1. Agronomist Profile Setup

Allow agronomists to connect their Calendly account:

```tsx
// In agronomist profile settings
<div>
  <Label>Calendly Username</Label>
  <Input 
    placeholder="your-username"
    value={calendlyUsername}
    onChange={(e) => setCalendlyUsername(e.target.value)}
  />
  <p className="text-sm text-muted-foreground">
    Your Calendly URL: https://calendly.com/{calendlyUsername}
  </p>
</div>
```

### 2. Availability Check

Query Calendly for real-time availability:

```typescript
// Check agronomist availability
export async function getAgronomistAvailability(
  agronomistId: string, 
  date: string
) {
  const { data: agronomist } = await supabase
    .from('agronomist_profiles')
    .select('calendly_user_id')
    .eq('id', agronomistId)
    .single()

  if (!agronomist?.calendly_user_id) {
    return [] // No Calendly connected
  }

  // Query Calendly foreign table
  const { data: events } = await supabase
    .from('calendly_scheduled_events')
    .select('start_time, end_time')
    .eq('user', agronomist.calendly_user_id)
    .gte('start_time', `${date}T00:00:00Z`)
    .lt('start_time', `${date}T23:59:59Z`)

  // Calculate available slots
  return calculateAvailableSlots(events, date)
}
```

### 3. Booking Sync

When a booking is created in AgriBeta, sync with Calendly:

```typescript
// Create booking in both systems
export async function createBookingWithCalendly(bookingData: {
  farmer_id: string
  agronomist_id: string
  scheduled_date: string
  scheduled_time: string
  consultation_type: string
  duration: number
  message?: string
}) {
  // 1. Create in AgriBeta database
  const { data: booking } = await supabase
    .from('consultations')
    .insert([{
      ...bookingData,
      status: 'pending',
      payment_status: 'pending'
    }])
    .select()
    .single()

  // 2. Get agronomist's Calendly info
  const { data: agronomist } = await supabase
    .from('agronomist_profiles')
    .select('calendly_user_id, calendly_event_type_id')
    .eq('id', bookingData.agronomist_id)
    .single()

  if (agronomist?.calendly_user_id) {
    // 3. Create event in Calendly (via API)
    await createCalendlyEvent({
      user_id: agronomist.calendly_user_id,
      event_type_id: agronomist.calendly_event_type_id,
      start_time: `${bookingData.scheduled_date}T${bookingData.scheduled_time}:00Z`,
      invitee_email: bookingData.farmer_email,
      invitee_name: bookingData.farmer_name
    })

    // 4. Update booking with Calendly event ID
    await supabase
      .from('consultations')
      .update({ calendly_event_id: event.id })
      .eq('id', booking.id)
  }

  return booking
}
```

## 🎨 UI Updates

### 1. Availability Display

Replace hardcoded times with real Calendly availability:

```tsx
// In booking page - Step 2 (Schedule)
const [availableTimes, setAvailableTimes] = useState<string[]>([])

useEffect(() => {
  if (selectedAgronomist && selectedDate) {
    getAgronomistAvailability(selectedAgronomist.id, selectedDate)
      .then(times => setAvailableTimes(times))
  }
}, [selectedAgronomist, selectedDate])

// Display real availability
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

### 2. Agronomist Dashboard

Show Calendly integration status:

```tsx
// In agronomist profile
{agronomist.calendly_username ? (
  <div className="flex items-center gap-2 text-green-600">
    <CheckCircle className="h-4 w-4" />
    <span>Calendly Connected</span>
    <a 
      href={`https://calendly.com/${agronomist.calendly_username}`}
      target="_blank"
      className="text-sm underline"
    >
      View Calendar
    </a>
  </div>
) : (
  <div className="flex items-center gap-2 text-yellow-600">
    <AlertCircle className="h-4 w-4" />
    <span>Connect Calendly for automatic availability</span>
  </div>
)}
```

## 🔄 Sync Strategies

### 1. Real-time Sync (Recommended)

Use Calendly webhooks to sync changes:

```typescript
// Webhook endpoint: /api/calendly/webhook
export async function POST(request: NextRequest) {
  const event = await request.json()
  
  switch (event.event) {
    case 'invitee.created':
      // New booking in Calendly
      await syncBookingFromCalendly(event.payload)
      break
    
    case 'invitee.canceled':
      // Cancellation in Calendly
      await cancelBookingFromCalendly(event.payload)
      break
  }
}
```

### 2. Scheduled Sync (Fallback)

Daily sync to catch any missed updates:

```typescript
// Cron job or scheduled function
export async function syncCalendlyData() {
  // Sync all agronomists' Calendly data
  const { data: agronomists } = await supabase
    .from('agronomist_profiles')
    .select('id, calendly_user_id')
    .not('calendly_user_id', 'is', null)

  for (const agronomist of agronomists) {
    await syncAgronomistCalendlyData(agronomist.id)
  }
}
```

## 🎯 Benefits of Supabase Wrapper

✅ **Automatic Sync**: Data stays in sync between Calendly and Supabase  
✅ **No API Rate Limits**: Direct database access  
✅ **Real-time Updates**: Changes reflect immediately  
✅ **Complex Queries**: Use SQL to query Calendly data  
✅ **Reliable**: No network issues or API failures  
✅ **Scalable**: Handles large amounts of data  

## 🚀 Implementation Steps

1. **Set up the wrapper** (5 minutes)
   - Configure with your Calendly credentials
   - Add foreign tables
   - Create wrapper

2. **Update database schema** (2 minutes)
   - Add Calendly fields to `agronomist_profiles`
   - Run migration

3. **Update agronomist profiles** (10 minutes)
   - Add Calendly username field
   - Allow agronomists to connect accounts

4. **Update booking flow** (15 minutes)
   - Replace hardcoded availability with Calendly queries
   - Sync bookings with Calendly

5. **Test integration** (10 minutes)
   - Create test booking
   - Verify sync works
   - Check availability display

## 🔧 Troubleshooting

### Wrapper Not Working
- Check API credentials are correct
- Verify organization URL format
- Check Supabase logs for errors

### Data Not Syncing
- Ensure foreign tables are created
- Check Calendly permissions
- Verify webhook endpoints

### Availability Not Showing
- Check agronomist has Calendly connected
- Verify event types are configured
- Check timezone settings

## 📊 Monitoring

Track these metrics:
- **Sync Success Rate**: Successful syncs / Total attempts
- **Availability Accuracy**: Real vs displayed availability
- **Booking Conflicts**: Double-bookings prevented
- **Response Time**: Time to fetch availability

---

**Result**: Automatic availability management with zero manual work! 🎉

The Supabase Calendly Wrapper gives you the best of both worlds - Calendly's scheduling power with your database's reliability and query capabilities.
