import { useEffect, useState } from 'react'

import { getConfiguredApis, type ConfiguredApisResponse } from '@/api/usageApi'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

const emptyConfiguredApisResponse: ConfiguredApisResponse = {
  customer_id: '',
  apis: [],
  total_count: 0,
}

export function useConfiguredApis() {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const [data, setData] = useState<ConfiguredApisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchConfiguredApis() {
      setLoading(true)
      setError(null)
      try {
        if (!isProduction) {
          if (!cancelled) setData(emptyConfiguredApisResponse)
          return
        }

        const response = await getConfiguredApis()
        if (!cancelled) setData(response)
      } catch (e: any) {
        if (!cancelled) {
          const detail = e?.response?.data?.detail
          setError(typeof detail === 'string' ? detail : e?.message || 'Failed to load configured APIs')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchConfiguredApis()

    return () => {
      cancelled = true
    }
  }, [isProduction])

  return { data, loading, error }
}
