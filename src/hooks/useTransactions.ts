import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'
import { useOnboardingStatus } from './useOnboardingStatus'

export type Transaction = {
  trax_id: string
  api_name: string
  status: string
  timestamp: string
  turn_around_time?: string | null
}

type TransactionApiResponse = Omit<Transaction, 'trax_id'> & {
  trax_id: string | number
}

// Example good mock data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    trax_id: '1',
    api_name: 'getUserData',
    status: 'success',
    timestamp: '2024-06-01T10:00:00Z',
    turn_around_time: '1500'
  },
  {
    trax_id: '2',
    api_name: 'updateProfile',
    status: 'failure',
    timestamp: '2024-06-01T12:30:00Z',
    turn_around_time: '2000'
  },
  {
    trax_id: '3',
    api_name: 'exportCSV',
    status: 'success',
    timestamp: '2024-06-02T09:22:00Z',
    turn_around_time: null
  },
  {
    trax_id: '4',
    api_name: 'verifyDocument',
    status: 'success',
    timestamp: '2024-06-02T13:40:00Z',
    turn_around_time: '1750'
  },
  {
    trax_id: '5',
    api_name: 'getUserData',
    status: 'failure',
    timestamp: '2024-06-04T11:15:00Z',
    turn_around_time: '1950'
  },
  {
    trax_id: '6',
    api_name: 'getUserData',
    status: 'success',
    timestamp: '2024-06-05T14:10:00Z',
    turn_around_time: '1625'
  },
  {
    trax_id: '7',
    api_name: 'updateProfile',
    status: 'success',
    timestamp: '2024-06-07T09:00:00Z',
    turn_around_time: '1800'
  },
  {
    trax_id: '8',
    api_name: 'getUserData',
    status: 'success',
    timestamp: '2024-06-08T10:29:00Z',
    turn_around_time: '1400'
  },
  {
    trax_id: '9',
    api_name: 'verifyDocument',
    status: 'failure',
    timestamp: '2024-06-09T12:30:00Z',
    turn_around_time: '2300'
  },
  {
    trax_id: '10',
    api_name: 'getUserData',
    status: 'success',
    timestamp: '2024-06-10T16:18:00Z',
    turn_around_time: '1503'
  },
  {
    trax_id: '11',
    api_name: 'exportCSV',
    status: 'success',
    timestamp: '2024-06-11T09:44:00Z',
    turn_around_time: '1150'
  },
  {
    trax_id: '12',
    api_name: 'verifyDocument',
    status: 'success',
    timestamp: '2024-06-12T11:26:00Z',
    turn_around_time: '1322'
  },
  {
    trax_id: '13',
    api_name: 'updateProfile',
    status: 'failure',
    timestamp: '2024-06-13T18:02:00Z',
    turn_around_time: '2100'
  },
  {
    trax_id: '14',
    api_name: 'updateProfile',
    status: 'success',
    timestamp: '2024-06-14T10:55:00Z',
    turn_around_time: '1861'
  },
  {
    trax_id: '15',
    api_name: 'getUserData',
    status: 'success',
    timestamp: '2024-06-15T13:47:00Z',
    turn_around_time: '1577'
  },
  {
    trax_id: '16',
    api_name: 'exportCSV',
    status: 'failure',
    timestamp: '2024-06-16T10:20:00Z',
    turn_around_time: null
  },
  {
    trax_id: '17',
    api_name: 'verifyDocument',
    status: 'success',
    timestamp: '2024-06-17T14:36:00Z',
    turn_around_time: '1870'
  },
  {
    trax_id: '18',
    api_name: 'getUserData',
    status: 'success',
    timestamp: '2024-06-18T09:35:00Z',
    turn_around_time: '1432'
  },
  {
    trax_id: '19',
    api_name: 'updateProfile',
    status: 'success',
    timestamp: '2024-06-19T12:24:00Z',
    turn_around_time: '1782'
  },
  {
    trax_id: '20',
    api_name: 'verifyDocument',
    status: 'failure',
    timestamp: '2024-06-20T08:59:00Z',
    turn_around_time: '2199'
  }
]

export function useTransactions() {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTransactions() {
      try {
        setLoading(true)
        setError(null)

        if (!isProduction) {
          // Use mock data if not onboarded
          if (!cancelled) {
            setData(MOCK_TRANSACTIONS)
            setLoading(false)
          }
          return
        }

        // Fetch all transactions without filters (client-side filtering approach)
        const { data } = await http.get<TransactionApiResponse[]>('/usage/')

        if (!cancelled) {
          setData(
            (data || []).map(transaction => ({
              ...transaction,
              trax_id: String(transaction.trax_id)
            }))
          )
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
  }, [isProduction])

  return { data, loading, error }
}
