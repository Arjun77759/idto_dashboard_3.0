import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

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

export function useUsageCredits() {
  const [data, setData] = useState<UsageCredits | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchCredits() {
      try {
        setLoading(true)
        
        // Try credits endpoint first, fallback to overview if not available
        try {
          const { data } = await http.get<UsageCredits>('/usage/credits')
          if (!cancelled) setData(data)
        } catch (creditsError: any) {
          // If credits API not available (404/501), use basic overview
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
    fetchCredits()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}


