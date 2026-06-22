import { useEffect, useState } from 'react'
import { getUsageVolumeTimeseries, type UsageVolumeTimeseriesFilters } from '@/api/usageApi'

export type UsageVolumePoint = {
  month: string
  count: number
}

type TimeseriesResponse = {
  series: UsageVolumePoint[]
}

// Helper to format date as "Month Year" (e.g., "November 2025")
const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// Helper to get start and end dates for last N months
const getDateRange = (monthsBack: number = 5): { start: string; end: string } => {
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - monthsBack)
  return {
    start: formatMonthYear(start),
    end: formatMonthYear(end)
  }
}

export function useUsageVolumeTimeseries(
  monthsBack: number = 5,
  filters?: UsageVolumeTimeseriesFilters
) {
  const [data, setData] = useState<UsageVolumePoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchSeries() {
      setLoading(true)
      setError(null)
      try {
        const { start, end } = getDateRange(monthsBack)

        const response = await getUsageVolumeTimeseries(start, end, filters)

        if (!cancelled) setData(response.series)
      } catch (e: any) {
        if (!cancelled) {
          // Handle different error response structures
          let errorMessage = 'Failed to load volume timeseries'

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
    fetchSeries()
    return () => {
      cancelled = true
    }
  }, [monthsBack, filters?.region, filters?.api_name, filters?.device_type])

  return { data, loading, error }
}

