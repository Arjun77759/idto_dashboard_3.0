import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export interface TransactionDetail {
  trax_id: number
  api_name: string
  request_details: any
  response_details: any
  status: 'success' | 'failed'
  timestamp: string
  turn_around_time?: string
}

export function useTransactionDetail(traxId: string | undefined) {
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
        const { data } = await http.get<TransactionDetail>(`/usage/${traxId}`)

        if (!cancelled) {
          // Parse JSON strings if needed
          if (typeof data.request_details === 'string') {
            try {
              data.request_details = JSON.parse(data.request_details)
            } catch {
              // Keep as string if parsing fails
            }
          }
          if (typeof data.response_details === 'string') {
            try {
              data.response_details = JSON.parse(data.response_details)
            } catch {
              // Keep as string if parsing fails
            }
          }
          setData(data)
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
  }, [traxId])

  return { data, loading, error }
}
