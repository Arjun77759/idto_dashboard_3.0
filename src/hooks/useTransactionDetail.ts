import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { getSandboxTransactionDetail } from '@/mocks/sandboxTransactions'

export interface TransactionDetail {
  trax_id: string
  api_name: string
  request_details: unknown
  response_details: unknown
  status: string
  timestamp: string
  turn_around_time?: string | null
}

type TransactionDetailApiResponse = Omit<TransactionDetail, 'trax_id'> & {
  trax_id: string | number
}

const parseJsonLikeField = (value: unknown) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return value
  }

  try {
    return JSON.parse(trimmedValue)
  } catch {
    // Continue with normalization attempts
  }

  if (!trimmedValue.startsWith('{') && !trimmedValue.startsWith('[')) {
    return value
  }

  const normalizedValue = trimmedValue
    .replace(/'/g, '"')
    .replace(/\bNone\b/g, 'null')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')

  try {
    return JSON.parse(normalizedValue)
  } catch {
    return value
  }
}

export function useTransactionDetail(traxId: string | undefined) {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const [data, setData] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!traxId) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchTransactionDetail() {
      try {
        setLoading(true)
        setError(null)

        if (!isProduction) {
          if (!cancelled) {
            setData(getSandboxTransactionDetail(traxId))
          }
          return
        }

        const { data } = await http.get<TransactionDetailApiResponse>(
          `/usage/transaction/${traxId}`
        )

        if (!cancelled) {
          const normalized: TransactionDetail = {
            ...data,
            trax_id: String(data.trax_id),
            request_details: parseJsonLikeField(data.request_details),
            response_details: parseJsonLikeField(data.response_details)
          }

          setData(normalized)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || 'Failed to fetch transaction details')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTransactionDetail()

    return () => {
      cancelled = true
    }
  }, [isProduction, traxId])

  return { data, loading, error }
}
