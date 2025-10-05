import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { password, accessToken } = await request.json()

    if (!password || !accessToken) {
      return NextResponse.json(
        { error: 'Password and access token are required' },
        { status: 400 }
      )
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // First, get the user from the access token
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 401 }
      )
    }

    console.log('Updating password for user:', user.id)

    // Update the user's password using the admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password }
    )

    if (error) {
      console.error('Password update error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log('Password updated successfully for user:', user.id)

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
