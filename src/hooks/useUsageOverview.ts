import { useEffect, useState } from 'react'
import { getUsageComparison, getUsageOverview } from '@/api/usageApi'
import type { UsageComparisonResponse } from '@/api/usageApi'

export type UsageOverview = {
  total: number
  success: number
  failed: number
  balance: number
}

export function useUsageOverview(period?: number) {
  const [data, setData] = useState<UsageComparisonResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchOverview() {
      setLoading(true)

      try {
        // Try comparison API first, fallback to basic overview if not available
        try {
          const response = await getUsageComparison(period)
          if (!cancelled) setData(response)
        } catch (comparisonError: any) {
          if (
            comparisonError?.response?.status === 404 ||
            comparisonError?.response?.status === 501
          ) {
            console.warn('Comparison API not available, using basic overview')
            const basicData = await getUsageOverview()
            if (!cancelled) {
              const transformedData: UsageComparisonResponse = {
                total_verifications: { count: basicData.total, change_percent: null },
                successful_verifications: { count: basicData.success, change_percent: null },
                failed_verifications: { count: basicData.failed, change_percent: null },
                monthly_spend: { amount: basicData.balance, change_percent: null },
                period: {
                  requested_month: new Date().getMonth() + 1,
                  current_year: new Date().getFullYear(),
                  current_month_window: { start: '', end: '' },
                  previous_month_window: { start: '', end: '' }
                }
              }
              setData(transformedData)
            }
          } else {
            throw comparisonError
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          let errorMessage = 'Failed to load overview'

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
    fetchOverview()
    return () => {
      cancelled = true
    }
  }, [period])

  return { data, loading, error }
}
