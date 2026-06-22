import { useEffect, useState } from 'react'
import {
  getMerchantAnalytics,
  getMerchantSessionDetail,
  type MerchantAnalytics,
  type MerchantSessionDetail,
} from '@/api/workflowApi'

export function useMerchantAnalytics(workflowTemplateId?: string) {
  const [data, setData] = useState<MerchantAnalytics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAnalytics() {
      try {
        setLoading(true)
        setError(null)
        const result = await getMerchantAnalytics(workflowTemplateId)
        if (!cancelled) setData(result)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load analytics')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAnalytics()

    return () => {
      cancelled = true
    }
  }, [workflowTemplateId])

  return { data, loading, error }
}

export function useMerchantSessionDetail(sessionId: string | null) {
  const [data, setData] = useState<MerchantSessionDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setData(null)
      return
    }

    let cancelled = false

    async function fetchDetail() {
      try {
        setLoading(true)
        setError(null)
        const result = await getMerchantSessionDetail(sessionId!)
        if (!cancelled) setData(result)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load session detail')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDetail()

    return () => {
      cancelled = true
    }
  }, [sessionId])

  return { data, loading, error }
}
