import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

export type MonthlyUsage = {
  balance: number
  used: number
  total: number
}

// Mock data to use in development/non-production environments
const mockMonthlyUsage: MonthlyUsage = {
  balance: 1200,
  used: 300,
  total: 1500,
}

type Listener = () => void
const listeners = new Set<Listener>()

export const invalidateMonthlyUsage = () => {
  listeners.forEach((listener) => listener())
}

export function useMonthlyUsage() {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const [data, setData] = useState<MonthlyUsage | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    const listener: Listener = () => setRefreshToken((prev) => prev + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function fetchMonthlyUsage() {
      try {
        setLoading(true)
        if (!isProduction) {
          // Mock API response for non-production environments
          if (!cancelled) {
            setData(mockMonthlyUsage)
            setError(null)
          }
        } else {
          const response = await http.get<MonthlyUsage>('/usage/credits/monthly')
          if (!cancelled) setData(response.data)
        }
      } catch (e: any) {
        if (!cancelled) {
          // Handle different error response structures
          let errorMessage = 'Failed to load monthly usage'
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
    fetchMonthlyUsage()
    return () => {
      cancelled = true
    }
  // Depend on isProduction to react to onboarding status changes
  }, [isProduction, refreshToken])

  return { data, loading, error }
}

