import { useEffect, useState } from 'react'
import {
  getMerchantWorkflowAssignments,
  getMerchantSdkConfig,
  type MerchantWorkflowAssignment,
  type SdkConfig,
} from '@/api/workflowApi'

export function useMerchantWorkflowAssignments() {
  const [data, setData] = useState<MerchantWorkflowAssignment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAssignments() {
      try {
        setLoading(true)
        setError(null)
        const result = await getMerchantWorkflowAssignments()
        if (!cancelled) setData(result || [])
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load workflows')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAssignments()

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}

export function useMerchantSdkConfig(assignmentId: string | null) {
  const [data, setData] = useState<SdkConfig | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!assignmentId) {
      setData(null)
      return
    }

    let cancelled = false

    async function fetchSdkConfig() {
      try {
        setLoading(true)
        setError(null)
        const result = await getMerchantSdkConfig(assignmentId!)
        if (!cancelled) setData(result)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load SDK config')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSdkConfig()

    return () => {
      cancelled = true
    }
  }, [assignmentId])

  return { data, loading, error }
}
