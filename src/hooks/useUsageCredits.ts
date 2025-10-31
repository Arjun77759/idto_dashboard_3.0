import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type UsageCredits = {
  balance: string
  last_recharge_amount: string
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
        const { data } = await http.get<UsageCredits>('/usage/credits')
        if (!cancelled) setData(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.response?.data?.detail || e?.message || 'Failed to load credits')
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


