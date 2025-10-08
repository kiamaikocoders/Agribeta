import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { emailService } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      farmer_id, 
      agronomist_id, 
      date, 
      time, 
      type, 
      duration, 
      message, 
      cost,
      farmer_timezone,
      agronomist_timezone
    } = body

    // Validate required fields
    if (!farmer_id || !agronomist_id || !date || !time || !type || !duration) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from('consultations')
      .insert([{
        farmer_id,
        agronomist_id,
        scheduled_date: date,
        scheduled_time: time,
        consultation_type: type,
        duration_minutes: duration,
        message: message || null,
        cost: cost || 0,
        status: 'pending',
        payment_status: 'pending',
        farmer_timezone: farmer_timezone || 'Africa/Nairobi',
        agronomist_timezone: agronomist_timezone || 'Africa/Nairobi',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json({ 
        error: 'Failed to create booking',
        details: error.message
      }, { status: 500 })
    }

    // Fetch farmer and agronomist details for notification
    const { data: farmer } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', farmer_id)
      .single()

    const { data: agronomist } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', agronomist_id)
      .single()

    // Create notification for agronomist
    await supabase
      .from('notifications')
      .insert([{
        user_id: agronomist_id,
        sender_id: farmer_id,
        type: 'booking',
        title: 'New Consultation Booking',
        message: `${farmer?.first_name} ${farmer?.last_name} has booked a ${type} consultation with you on ${date} at ${time}.`,
        data: {
          booking_id: booking.id,
          consultation_type: type,
          scheduled_date: date,
          scheduled_time: time,
          farmer_name: `${farmer?.first_name} ${farmer?.last_name}`
        },
        read: false
      }])

    // Create notification for farmer (confirmation)
    await supabase
      .from('notifications')
      .insert([{
        user_id: farmer_id,
        sender_id: agronomist_id,
        type: 'booking',
        title: 'Consultation Booking Confirmed',
        message: `Your ${type} consultation with ${agronomist?.first_name} ${agronomist?.last_name} has been booked for ${date} at ${time}.`,
        data: {
          booking_id: booking.id,
          consultation_type: type,
          scheduled_date: date,
          scheduled_time: time,
          agronomist_name: `${agronomist?.first_name} ${agronomist?.last_name}`
        },
        read: false
      }])

    // Send email notifications
    try {
      // Email to farmer (confirmation)
      await emailService.sendBookingConfirmationToFarmer({
        recipientName: `${farmer?.first_name} ${farmer?.last_name}`,
        recipientEmail: farmer?.email || '',
        bookerName: `${agronomist?.first_name} ${agronomist?.last_name}`,
        consultationType: type,
        scheduledDate: date,
        scheduledTime: time,
        duration: duration,
        cost: cost,
        message: message,
        bookingId: booking.id
      })

      // Email to agronomist (new booking notification)
      await emailService.sendBookingNotificationToAgronomist({
        recipientName: `${agronomist?.first_name} ${agronomist?.last_name}`,
        recipientEmail: agronomist?.email || '',
        bookerName: `${farmer?.first_name} ${farmer?.last_name}`,
        consultationType: type,
        scheduledDate: date,
        scheduledTime: time,
        duration: duration,
        cost: cost,
        message: message,
        bookingId: booking.id
      })

      console.log('Email notifications sent successfully')
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError)
      // Don't fail the booking if emails fail
    }

    return NextResponse.json({ 
      success: true, 
      booking 
    })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userRole = searchParams.get('role') // 'farmer' or 'agronomist'
    const status = searchParams.get('status') // Filter by status
    const upcoming = searchParams.get('upcoming') // 'true' to get only upcoming

    if (!userId || !userRole) {
      return NextResponse.json({ 
        error: 'User ID and role are required' 
      }, { status: 400 })
    }

    let query = supabase
      .from('consultations')
      .select(`
        *,
        farmer:profiles!consultations_farmer_id_fkey(
          id,
          first_name, 
          last_name, 
          email,
          avatar_url,
          country
        ),
        agronomist:profiles!consultations_agronomist_id_fkey(
          id,
          first_name, 
          last_name, 
          email,
          avatar_url,
          country
        )
      `)

    if (userRole === 'farmer') {
      query = query.eq('farmer_id', userId)
    } else if (userRole === 'agronomist') {
      query = query.eq('agronomist_id', userId)
    }

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status)
    }

    // Filter upcoming bookings
    if (upcoming === 'true') {
      const today = new Date().toISOString().split('T')[0]
      query = query
        .gte('scheduled_date', today)
        .in('status', ['pending', 'confirmed'])
    }

    const { data: bookings, error } = await query.order('scheduled_date', { ascending: true }).order('scheduled_time', { ascending: true })

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch bookings',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// PATCH endpoint for updating booking status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      booking_id, 
      status, 
      payment_status,
      meeting_link,
      notes,
      rating,
      review_text,
      cancelled_by,
      cancellation_reason
    } = body

    if (!booking_id) {
      return NextResponse.json({ 
        error: 'Booking ID is required' 
      }, { status: 400 })
    }

    const updateData: any = { updated_at: new Date().toISOString() }

    if (status) updateData.status = status
    if (payment_status) updateData.payment_status = payment_status
    if (meeting_link !== undefined) updateData.meeting_link = meeting_link
    if (notes !== undefined) updateData.notes = notes
    if (rating !== undefined) updateData.rating = rating
    if (review_text !== undefined) updateData.review_text = review_text

    // Handle cancellation
    if (status === 'cancelled' && cancelled_by) {
      updateData.cancelled_by = cancelled_by
      updateData.cancelled_at = new Date().toISOString()
      updateData.cancellation_reason = cancellation_reason || null
    }

    // Handle completion
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: booking, error } = await supabase
      .from('consultations')
      .update(updateData)
      .eq('id', booking_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating booking:', error)
      return NextResponse.json({ 
        error: 'Failed to update booking',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      booking 
    })
  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
