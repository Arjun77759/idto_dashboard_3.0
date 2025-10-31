import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type MonthlyUsage = {
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
        const { data } = await http.get<MonthlyUsage>('/usage/month-summary')
        if (!cancelled) setData(data)
      } catch (e: any) {
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled && useMocks) {
          setData({ used: 600, total: 1000 })
          setError(null)
        } else if (!cancelled) {
          setError(e?.response?.data?.detail || e?.message || 'Failed to load monthly usage')
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


