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
      title,
      years_experience,
      specializations,
      certifications,
      hourly_rate,
      consultation_fee,
      timezone,
      company,
    } = body || {}

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    // Validate caller identity against provided id
    const { data: user, error: userError } = await supabaseAdmin().auth.getUser(token)
    if (userError || !user?.user?.id || user.user.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (company) {
      await supabaseAdmin().from('profiles').update({ company }).eq('id', id)
    }

    const { error: upsertError } = await supabaseAdmin().from('agronomist_profiles').upsert({
      id,
      title,
      years_experience,
      specializations,
      certifications,
      hourly_rate,
      consultation_fee,
      timezone,
    })

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
