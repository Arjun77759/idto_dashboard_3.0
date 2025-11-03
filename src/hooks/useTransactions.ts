import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type Transaction = {
  trax_id: number
  api_name: string
  status: 'success' | 'failed'
  timestamp: string
  turn_around_time: string
}

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    
    const mockData: Transaction[] = [
      {
        trax_id: 1001,
        api_name: 'PAN Verification',
        status: 'success',
        timestamp: '2024-09-09T10:30:00Z',
        turn_around_time: '2.1s'
      },
      {
        trax_id: 1002,
        api_name: 'Aadhaar Verification',
        status: 'success',
        timestamp: '2024-09-09T11:15:00Z',
        turn_around_time: '1.8s'
      },
      {
        trax_id: 1003,
        api_name: 'Bank Account Verification',
        status: 'failed',
        timestamp: '2024-09-09T12:00:00Z',
        turn_around_time: '3.2s'
      },
      {
        trax_id: 1004,
        api_name: 'GST Verification',
        status: 'success',
        timestamp: '2024-09-09T14:45:00Z',
        turn_around_time: '2.5s'
      },
      {
        trax_id: 1005,
        api_name: 'Driving License Verification',
        status: 'success',
        timestamp: '2024-09-10T09:20:00Z',
        turn_around_time: '1.9s'
      },
      {
        trax_id: 1006,
        api_name: 'Passport Verification',
        status: 'failed',
        timestamp: '2024-09-10T10:15:00Z',
        turn_around_time: '2.8s'
      },
      {
        trax_id: 1007,
        api_name: 'Voter ID Verification',
        status: 'success',
        timestamp: '2024-09-10T11:30:00Z',
        turn_around_time: '1.5s'
      }
    ]
    
    async function fetchTransactions() {
      try {
        setLoading(true)
        const { data } = await http.get<Transaction[]>('/usage/')
        
        // Use mock data if API returns empty or if mocks are enabled
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled) {
          if (useMocks || !data || data.length === 0) {
            setData(mockData)
          } else {
            setData(data)
          }
        }
      } catch (e: any) {
        // Fallback to mock when API is missing or failing
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled) {
          if (useMocks) {
            setData(mockData)
          } else {
            setError(e.message || 'Failed to fetch transactions')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTransactions()

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
