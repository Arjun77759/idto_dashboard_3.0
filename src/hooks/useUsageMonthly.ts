import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type UsageMonthlyItem = {
  api_name: string
  number_of_transactions: number
  unit_price: number
  total_cost: number
}

export function useUsageMonthly() {
  const [data, setData] = useState<UsageMonthlyItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchMonthly() {
      try {
        setLoading(true)
        const response = await http.get<UsageMonthlyItem[]>('/usage/monthly')
        if (!cancelled) setData(response.data)
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
    fetchMonthly()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}


