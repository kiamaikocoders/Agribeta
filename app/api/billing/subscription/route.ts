import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's current subscription
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_tier, ai_predictions_used, ai_predictions_limit, subscription_start_date, subscription_end_date')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching subscription:', error)
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
    }

    return NextResponse.json({ subscription: profile })
  } catch (error) {
    console.error('Subscription API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, planId, paymentMethodId } = body

    if (!userId || !planId) {
      return NextResponse.json({ error: 'User ID and plan ID are required' }, { status: 400 })
    }

    // Define plan limits
    const planLimits = {
      free: { ai_predictions_limit: 5, consultations_limit: 0 },
      basic: { ai_predictions_limit: 50, consultations_limit: 2 },
      premium: { ai_predictions_limit: -1, consultations_limit: 10 } // -1 means unlimited
    }

    const limits = planLimits[planId as keyof typeof planLimits]
    if (!limits) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 })
    }

    // Update user's subscription
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: planId,
        ai_predictions_limit: limits.ai_predictions_limit,
        consultations_limit: limits.consultations_limit,
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        ai_predictions_used: 0, // Reset usage counter
        consultations_used: 0 // Reset consultations usage counter
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    // Here you would integrate with Stripe or your payment processor
    // For now, we'll just return success
    console.log(`Subscription updated for user ${userId} to plan ${planId}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription updated successfully',
      subscription: {
        tier: planId,
        limits: limits
      }
    })
  } catch (error) {
    console.error('Subscription update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
