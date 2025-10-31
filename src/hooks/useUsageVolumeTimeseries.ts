import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type UsageVolumePoint = {
  month: string
  volume: number
}

export function useUsageVolumeTimeseries(period: 'month' | 'week' = 'month') {
  const [data, setData] = useState<UsageVolumePoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchSeries() {
      try {
        setLoading(true)
        const { data } = await http.get<UsageVolumePoint[]>(`/usage/volume/timeseries`, { params: { period } })
        if (!cancelled) setData(data)
      } catch (e: any) {
        // Fallback to mock when API is missing or failing
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled && useMocks) {
          const mock: UsageVolumePoint[] = [
            { month: 'Jan', volume: 1200 },
            { month: 'Feb', volume: 1900 },
            { month: 'Mar', volume: 3000 },
            { month: 'Apr', volume: 2800 },
            { month: 'May', volume: 1890 },
            { month: 'Jun', volume: 2390 }
          ]
          setData(mock)
          setError(null)
        } else if (!cancelled) {
          setError(e?.response?.data?.detail || e?.message || 'Failed to load volume timeseries')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchSeries()
    return () => {
      cancelled = true
    }
  }, [period])

  return { data, loading, error }
}


