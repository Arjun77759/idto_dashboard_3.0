import { useEffect, useState } from 'react'
import { getMonthlyUsage, type UsageMonthlyFilters } from '@/api/usageApi'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

// Type for each monthly usage entry
export type UsageMonthlyItem = {
  api_name: string
  number_of_transactions: number
  unit_price: number
  total_cost: number
}

// Generate good mock monthly usage data
function getMockUsageMonthly(): UsageMonthlyItem[] {
  return [
    {
      api_name: 'aadhar_verification',
      number_of_transactions: 1560,
      unit_price: 1.75,
      total_cost: Number((1560 * 1.75).toFixed(2)),
    },
    {
      api_name: 'pan_verification',
      number_of_transactions: 1120,
      unit_price: 2.1,
      total_cost: Number((1120 * 2.1).toFixed(2)),
    },
    {
      api_name: 'dl_verification',
      number_of_transactions: 430,
      unit_price: 3.0,
      total_cost: Number((430 * 3.0).toFixed(2)),
    },
    {
      api_name: 'voter_id_verification',
      number_of_transactions: 330,
      unit_price: 2.0,
      total_cost: Number((330 * 2.0).toFixed(2)),
    },
    {
      api_name: 'passport_verification',
      number_of_transactions: 140,
      unit_price: 6.0,
      total_cost: Number((140 * 6.0).toFixed(2)),
    },
  ]
}

export function useUsageMonthly(filters?: UsageMonthlyFilters) {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const [data, setData] = useState<UsageMonthlyItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchMonthly() {
      setLoading(true)
      setError(null)
      try {
        if (!isProduction) {
          // Provide good mock monthly usage data if not in production
          if (!cancelled) {
            setData(getMockUsageMonthly())
            setLoading(false)
            setError(null)
          }
          return
        }
        // Real API fetch if production
        const response = await getMonthlyUsage(filters)
        if (!cancelled) setData(response)
      } catch (e: any) {
        if (!cancelled) {
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
    fetchMonthly()
    return () => {
      cancelled = true
    }
  }, [isProduction, filters?.start_date, filters?.end_date, filters?.region, filters?.api_name, filters?.device_type])

  return { data, loading, error }
}

