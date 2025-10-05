import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, serviceType, amount = 1 } = body

    if (!userId || !serviceType) {
      return NextResponse.json({ error: 'User ID and service type are required' }, { status: 400 })
    }

    // Get current user profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError) {
      console.error('Error fetching user profile:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check usage limits
    let canUse = false
    let newUsage = 0

    if (serviceType === 'ai_prediction') {
      const currentUsage = profile.ai_predictions_used || 0
      const limit = profile.ai_predictions_limit || 5
      
      // Check if user has unlimited access (premium plan)
      if (limit === -1) {
        canUse = true
        newUsage = currentUsage + amount
      } else if (currentUsage + amount <= limit) {
        canUse = true
        newUsage = currentUsage + amount
      }
    } else if (serviceType === 'consultation') {
      const currentUsage = profile.consultations_used || 0
      const limit = profile.consultations_limit || 0
      
      if (limit === -1) {
        canUse = true
        newUsage = currentUsage + amount
      } else if (currentUsage + amount <= limit) {
        canUse = true
        newUsage = currentUsage + amount
      }
    }

    if (!canUse) {
      return NextResponse.json({ 
        error: 'Usage limit exceeded',
        limitReached: true,
        currentUsage: serviceType === 'ai_prediction' ? profile.ai_predictions_used : profile.consultations_used,
        limit: serviceType === 'ai_prediction' ? profile.ai_predictions_limit : profile.consultations_limit
      }, { status: 403 })
    }

    // Update usage counter
    const updateData: any = {}
    if (serviceType === 'ai_prediction') {
      updateData.ai_predictions_used = newUsage
    } else if (serviceType === 'consultation') {
      updateData.consultations_used = newUsage
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating usage:', updateError)
      return NextResponse.json({ error: 'Failed to update usage' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      usage: {
        current: newUsage,
        limit: serviceType === 'ai_prediction' ? profile.ai_predictions_limit : profile.consultations_limit,
        remaining: serviceType === 'ai_prediction' 
          ? (profile.ai_predictions_limit === -1 ? -1 : profile.ai_predictions_limit - newUsage)
          : (profile.consultations_limit === -1 ? -1 : profile.consultations_limit - newUsage)
      }
    })
  } catch (error) {
    console.error('Usage tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get current usage
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching usage:', error)
      return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      usage: {
        ai_predictions: {
          used: profile.ai_predictions_used || 0,
          limit: profile.ai_predictions_limit || 5,
          remaining: profile.ai_predictions_limit === -1 ? -1 : (profile.ai_predictions_limit || 5) - (profile.ai_predictions_used || 0)
        },
        consultations: {
          used: profile.consultations_used || 0,
          limit: profile.consultations_limit || 0,
          remaining: profile.consultations_limit === -1 ? -1 : (profile.consultations_limit || 0) - (profile.consultations_used || 0)
        },
        subscription_tier: profile.subscription_tier
      }
    })
  } catch (error) {
    console.error('Usage fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
