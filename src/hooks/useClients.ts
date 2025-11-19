import { useEffect, useState } from 'react'
import { getClients, type Client } from '@/api/clientsApi'
import { getAccessToken } from '@/lib/auth'

export function useClients() {
  const [data, setData] = useState<Client[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Don't make API call if user is not authenticated
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }

    let cancelled = false
    async function fetchClients() {
      try {
        setLoading(true)
        setError(null)
        const clients = await getClients()
        if (!cancelled) {
          setData(clients)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.response?.data?.detail || e?.message || 'Failed to load clients')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    fetchClients()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}

export type { Client } from '@/api/clientsApi'

