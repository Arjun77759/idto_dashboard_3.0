import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

export interface ApiSubscription {
  api_name: string
  cost: string // Rupees per unit
  total_calls: string
}

/**
 * Hook to fetch subscribed APIs for the current user
 * Returns the list of APIs that the user has access to
 */
type UseApiSubscriptionsOptions = {
  forceBackend?: boolean
}

export function useApiSubscriptions(options: UseApiSubscriptionsOptions = {}) {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const [data, setData] = useState<ApiSubscription[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchSubscriptions() {
      try {
        setLoading(true)
        if (!isProduction && !options.forceBackend) {
          // Mock data for non-production environments
          if (!cancelled) {
            setData([])
            setError(null)
          }
        } else {
          const response = await http.get<ApiSubscription[]>('/me/subscribed-apis')
          if (!cancelled) setData(response.data)
        }
      } catch (e: any) {
        if (!cancelled) {
          let errorMessage = 'Failed to load subscribed APIs'
          if (e?.response?.data?.detail) {
            const detail = e.response.data.detail
            if (Array.isArray(detail)) {
              errorMessage = detail.map((err: any) => err.msg || JSON.stringify(err)).join(', ')
            } else if (typeof detail === 'object' && detail.msg) {
              errorMessage = detail.msg
            } else if (typeof detail === 'string') {
              errorMessage = detail
            } else if (typeof detail === 'object') {
              errorMessage = JSON.stringify(detail)
            }
          } else if (e?.message) {
            errorMessage = e.message
          }
          setError(errorMessage)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchSubscriptions()
    return () => {
      cancelled = true
    }
  }, [isProduction, options.forceBackend])

  return { data, loading, error }
}
