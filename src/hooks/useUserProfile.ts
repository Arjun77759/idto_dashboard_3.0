import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type UserProfile = {
  user_id: string
  name: string
  email: string
  company_name: string
  role: 'admin' | 'user'
  status: 'sandbox' | 'production'
  created_at: string
}

export function useUserProfile() {
  const [data, setData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchUserProfile() {
      try {
        setLoading(true)
        const { data } = await http.get<UserProfile>('/me')
        if (!cancelled) {
          setData(data)
          setError(null)
        }
      } catch (e: any) {
        // Fallback to mock when API is missing or failing
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled && useMocks) {
          const mock: UserProfile = {
            user_id: '1',
            name: 'John Doe',
            email: 'john.doe@brightwave.com',
            company_name: 'Brightwave Solutions',
            role: 'admin',
            status: 'sandbox',
            created_at: new Date().toISOString()
          }
          setData(mock)
          setError(null)
        } else if (!cancelled) {
          setError(e?.response?.data?.detail || e?.message || 'Failed to load user profile')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchUserProfile()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
