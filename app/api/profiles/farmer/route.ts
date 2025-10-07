import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      id,
      farm_size,
      farm_location,
      primary_crop,
      secondary_crops,
      planting_season,
      irrigation_type,
      pest_management_method,
      soil_type,
      farm_name,
    } = body || {}

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    // Validate caller identity against provided id
    const { data: user, error: userError } = await supabaseAdmin().auth.getUser(token)
    if (userError) {
      console.error('Token validation error:', userError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    if (!user?.user?.id) {
      console.error('No user ID in token')
      return NextResponse.json({ error: 'No user ID in token' }, { status: 401 })
    }
    if (user.user.id !== id) {
      console.error('User ID mismatch:', { tokenUserId: user.user.id, requestId: id })
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 })
    }

    // Ensure main profile exists and role is farmer; also update farm_name if provided
    await supabaseAdmin().from('profiles').update({ 
      farm_name,
      role: 'farmer'
    }).eq('id', id)

    // Upsert farmer profile using service role to bypass RLS, while still enforcing identity checks above
    const { error: upsertError } = await supabaseAdmin().from('farmer_profiles').upsert({
      id,
      farm_size,
      farm_location,
      primary_crop,
      secondary_crops,
      planting_season,
      irrigation_type,
      pest_management_method,
      soil_type,
    })

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
