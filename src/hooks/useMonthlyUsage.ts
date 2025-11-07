import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type MonthlyUsage = {
  balance: number
  used: number
  total: number
}

export function useMonthlyUsage() {
  const [data, setData] = useState<MonthlyUsage | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchMonthlyUsage() {
      try {
        setLoading(true)
        const response = await http.get<MonthlyUsage>('/usage/credits/monthly')
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
    fetchMonthlyUsage()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}


