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
      try {
        setLoading(true)
        
        // Try comparison API first, fallback to basic overview if not available
        try {
          const response = await getUsageComparison(period)
          if (!cancelled) setData(response)
        } catch (comparisonError: any) {
          // If comparison API not available (404/501), use basic overview
          if (comparisonError?.response?.status === 404 || comparisonError?.response?.status === 501) {
            console.warn('Comparison API not available, using basic overview')
            const basicData = await getUsageOverview()
            if (!cancelled) {
              // Transform basic data to comparison format with null change_percent
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
          // Handle different error response structures
          let errorMessage = 'Failed to load overview'
          
          if (e?.response?.data?.detail) {
            const detail = e.response.data.detail
            // Handle array of validation errors
            if (Array.isArray(detail)) {
              errorMessage = detail.map((err: any) => err.msg || JSON.stringify(err)).join(', ')
            } 
            // Handle object with msg property
            else if (typeof detail === 'object' && detail.msg) {
              errorMessage = detail.msg
            }
            // Handle string
            else if (typeof detail === 'string') {
              errorMessage = detail
            }
            // Fallback for unknown object structure
            else if (typeof detail === 'object') {
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


