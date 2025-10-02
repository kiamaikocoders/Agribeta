import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

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
      cost 
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
        status: 'confirmed',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json({ 
        error: 'Failed to create booking' 
      }, { status: 500 })
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

    if (!userId || !userRole) {
      return NextResponse.json({ 
        error: 'User ID and role are required' 
      }, { status: 400 })
    }

    let query = supabase
      .from('consultations')
      .select(`
        *,
        farmer:profiles!consultations_farmer_id_fkey(first_name, last_name, email),
        agronomist:profiles!consultations_agronomist_id_fkey(first_name, last_name, email)
      `)

    if (userRole === 'farmer') {
      query = query.eq('farmer_id', userId)
    } else if (userRole === 'agronomist') {
      query = query.eq('agronomist_id', userId)
    }

    const { data: bookings, error } = await query.order('scheduled_date', { ascending: true })

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch bookings' 
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
