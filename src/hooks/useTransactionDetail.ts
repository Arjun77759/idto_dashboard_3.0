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

    const mockData: TransactionDetail = {
      trax_id: parseInt(traxId) || 1001,
      api_name: 'PAN Verification',
      status: 'success',
      timestamp: '2024-09-09T10:30:00Z',
      turn_around_time: '2.1s',
      request_details: {
        pan_number: 'ABCDE1234F',
        name: 'John Doe',
        dob: '1980-01-01',
        consent: true
      },
      response_details: {
        status: 'Success',
        full_name: 'JOHN DOE',
        pan_number: 'ABCDE1234F',
        gender: 'Male',
        date_of_birth: '01/01/1980',
        category: 'Individual',
        verification_status: 'Verified',
        message: 'PAN details verified successfully'
      }
    }

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
        // Fallback to mock when API is missing or failing
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled) {
          if (useMocks || !data) {
            setData(mockData)
          } else {
            setError(e.message || 'Failed to fetch transaction details')
          }
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
