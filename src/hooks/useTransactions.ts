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
    
    async function fetchTransactions() {
      try {
        setLoading(true)
        
        // Fetch all transactions without filters (client-side filtering approach)
        const { data } = await http.get<Transaction[]>('/usage/')
        
        if (!cancelled) {
          setData(data || [])
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || 'Failed to fetch transactions')
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
