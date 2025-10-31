import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type UsageMonthlyItem = {
  api_name: string
  number_of_transactions: number
  per_unit_cost?: number
  cost?: number
}

export function useUsageMonthly() {
  const [data, setData] = useState<UsageMonthlyItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchMonthly() {
      try {
        setLoading(true)
        const { data } = await http.get<UsageMonthlyItem[]>('/usage/monthly')
        if (!cancelled) setData(data)
      } catch (e: any) {
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled && useMocks) {
          const mock: UsageMonthlyItem[] = [
            { api_name: 'Digilocker Initiate Session', number_of_transactions: 6, per_unit_cost: 0, cost: 0 },
            { api_name: 'Pan Nsdl', number_of_transactions: 8, per_unit_cost: 1, cost: 7 },
            { api_name: 'Pan Verification', number_of_transactions: 7, per_unit_cost: 1, cost: 8 },
            { api_name: 'Mobile Verify OTP', number_of_transactions: 11, per_unit_cost: 1.5, cost: 10.5 },
            { api_name: 'Pan All In One', number_of_transactions: 7, per_unit_cost: 1.5, cost: 7 }
          ]
          setData(mock)
          setError(null)
        } else if (!cancelled) {
          setError(e?.response?.data?.detail || e?.message || 'Failed to load monthly usage')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchMonthly()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}


