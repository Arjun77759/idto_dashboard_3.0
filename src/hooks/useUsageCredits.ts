import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

export type UsageCredits = {
  balance: number
  last_recharge: string
  last_recharge_amount: string
}

type UsageOverview = {
  total: number
  success: number
  failed: number
  balance: number
}

// Good mock data for credits 
function getMockUsageCredits(): UsageCredits {
  return {
    balance: 7420.50,
    last_recharge: '2024-06-25 14:35:08',
    last_recharge_amount: '3000'
  }
}

export function useUsageCredits() {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const [data, setData] = useState<UsageCredits | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCredits() {
      setLoading(true)
      setError(null)
      try {
        if (!isProduction) {
          // Use mock data for non-production
          if (!cancelled) {
            setData(getMockUsageCredits())
            setLoading(false)
            setError(null)
          }
          return
        }
        // Try credits endpoint first
        try {
          const { data: creditsData } = await http.get<UsageCredits>('/usage/credits')
          if (!cancelled) setData(creditsData)
        } catch (creditsError: any) {
          // If credits API not available (404/501), use overview as fallback
          if (creditsError?.response?.status === 404 || creditsError?.response?.status === 501) {
            console.warn('Credits API not available, using overview fallback')
            const { data: overviewData } = await http.get<UsageOverview>('/usage/overview')
            if (!cancelled) {
              // Transform overview data to credits format
              const transformedData: UsageCredits = {
                balance: overviewData.balance,
                last_recharge: 'Never',
                last_recharge_amount: '0'
              }
              setData(transformedData)
            }
          } else {
            throw creditsError
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          // Handle different error response structures
          let errorMessage = 'Failed to load credits'
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

    fetchCredits()

    return () => {
      cancelled = true
    }
  }, [isProduction])

  return { data, loading, error }
}

