import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type UsageOverview = {
  total: number
  success: number
  failed: number
  balance: number
}

export function useUsageOverview() {
  const [data, setData] = useState<UsageOverview | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchOverview() {
      try {
        setLoading(true)
        const { data } = await http.get<UsageOverview>('/usage/overview')
        if (!cancelled) setData(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.response?.data?.detail || e?.message || 'Failed to load overview')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchOverview()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}


