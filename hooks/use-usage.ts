import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface UsageData {
  ai_predictions: {
    used: number
    limit: number
    remaining: number
  }
  consultations: {
    used: number
    limit: number
    remaining: number
  }
  subscription_tier: string
}

export function useUsage() {
  const { user } = useAuth()
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsage = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/billing/usage?userId=${user.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch usage')
      }

      console.log('Usage data fetched:', data.usage)
      setUsage(data.usage)
    } catch (err) {
      console.error('Error fetching usage:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const trackUsage = async (serviceType: 'ai_prediction' | 'consultation', amount: number = 1) => {
    if (!user) return { success: false, error: 'User not authenticated' }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/billing/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          serviceType,
          amount
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.limitReached) {
          return { 
            success: false, 
            limitReached: true, 
            error: data.error,
            currentUsage: data.currentUsage,
            limit: data.limit
          }
        }
        throw new Error(data.error || 'Failed to track usage')
      }

      // Update local usage state
      if (usage) {
        const newUsage = { ...usage }
        if (serviceType === 'ai_prediction') {
          newUsage.ai_predictions.used = data.usage.current
          newUsage.ai_predictions.remaining = data.usage.remaining
        } else if (serviceType === 'consultation') {
          newUsage.consultations.used = data.usage.current
          newUsage.consultations.remaining = data.usage.remaining
        }
        console.log('Usage updated locally:', newUsage)
        setUsage(newUsage)
      }

      return { success: true, usage: data.usage }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    } finally {
      setLoading(false)
    }
  }

  const canUseService = (serviceType: 'ai_prediction' | 'consultation'): boolean => {
    if (!usage) return false

    if (serviceType === 'ai_prediction') {
      return usage.ai_predictions.limit === -1 || usage.ai_predictions.remaining > 0
    } else if (serviceType === 'consultation') {
      return usage.consultations.limit === -1 || usage.consultations.remaining > 0
    }

    return false
  }

  const getUsagePercentage = (serviceType: 'ai_prediction' | 'consultation'): number => {
    if (!usage) return 0

    if (serviceType === 'ai_prediction') {
      if (usage.ai_predictions.limit === -1) return 0 // Unlimited
      return (usage.ai_predictions.used / usage.ai_predictions.limit) * 100
    } else if (serviceType === 'consultation') {
      if (usage.consultations.limit === -1) return 0 // Unlimited
      return (usage.consultations.used / usage.consultations.limit) * 100
    }

    return 0
  }

  useEffect(() => {
    if (user) {
      fetchUsage()
    }
  }, [user])

  // Also refresh usage data when the component mounts (useful for navigation)
  useEffect(() => {
    if (user && !usage) {
      fetchUsage()
    }
  }, [])

  return {
    usage,
    loading,
    error,
    fetchUsage,
    trackUsage,
    canUseService,
    getUsagePercentage
  }
}
