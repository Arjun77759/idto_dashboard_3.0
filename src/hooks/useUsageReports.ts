import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  exportUsageReportsCsv,
  getUsageReports,
  type UsageReportsParams,
  type UsageReportsResponse,
} from '@/api/usageApi'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

const emptyReportsResponse = (month: number, year: number): UsageReportsResponse => ({
  customer_id: '',
  customer_name: '',
  reports: [],
  total_count: 0,
  page: 1,
  limit: 100,
  month,
  year,
  api_name: null,
  api_names: [],
})

export function useUsageReports(params: UsageReportsParams) {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const [data, setData] = useState<UsageReportsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchReports() {
      setLoading(true)
      setError(null)
      try {
        if (!isProduction) {
          if (!cancelled) setData(emptyReportsResponse(params.month, params.year))
          return
        }

        const response = await getUsageReports(params)
        if (!cancelled) setData(response)
      } catch (e: any) {
        if (!cancelled) {
          const detail = e?.response?.data?.detail
          setError(typeof detail === 'string' ? detail : e?.message || 'Failed to load reports')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchReports()

    return () => {
      cancelled = true
    }
  }, [
    isProduction,
    params.month,
    params.year,
    params.page,
    params.limit,
    params.api_name,
    refreshToken,
  ])

  return {
    data,
    loading,
    error,
    refetch: () => setRefreshToken((value) => value + 1),
  }
}

export function useExportUsageReportsCsv() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportCsv = async (params: Pick<UsageReportsParams, 'month' | 'year' | 'api_name'>) => {
    try {
      setLoading(true)
      setError(null)
      const { blob, filename } = await exportUsageReportsCsv(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Report CSV exported successfully.')
    } catch (e: any) {
      const detail = e?.response?.data?.detail
      const message = typeof detail === 'string' ? detail : e?.message || 'Failed to export report CSV'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return { exportCsv, loading, error }
}
