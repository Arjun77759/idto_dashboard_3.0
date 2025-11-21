import { useEffect, useState } from 'react'
import { getUsageVolumeTimeseries, type UsageVolumeTimeseriesFilters } from '@/api/usageApi'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

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

// Helper to generate mock volume series for last N months (realistic, ascending/descending numbers)
function getMockUsageVolumeTimeseries(monthsBack: number = 5): UsageVolumePoint[] {
  const now = new Date()
  // Build months oldest to newest
  const arr: UsageVolumePoint[] = []
  for (let i = monthsBack; i >= 0; i--) {
    const d = new Date(now)
    d.setMonth(now.getMonth() - i)
    arr.push({
      month: formatMonthYear(d),
      count: 180 + Math.floor(Math.random() * 60) + i * 30 // rising trend, capped randomness
    })
  }
  return arr
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
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const [data, setData] = useState<UsageVolumePoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchSeries() {
      setLoading(true)
      setError(null)
      if (!isProduction) {
        // Use mock data for non-production
        if (!cancelled) {
          setData(getMockUsageVolumeTimeseries(monthsBack))
          setLoading(false)
          setError(null)
        }
        return
      }
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
  }, [monthsBack, isProduction, filters?.region, filters?.api_name, filters?.device_type])

  return { data, loading, error }
}

