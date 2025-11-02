import { useEffect, useState } from 'react'
import { getUsers } from '@/api/usersApi'
import type { User, UsersListParams } from '@/api/usersApi'

export function useUsers(params?: UsersListParams) {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    let cancelled = false
    
    // Mock data for development
    const mockData: User[] = [
      {
        user_id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'Active',
        last_login: '2 hours ago',
        created_at: '2024-01-15T10:00:00Z',
        phone: '+91 98765 43210',
        company: 'ABC Corp'
      },
      {
        user_id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'User',
        status: 'Active',
        last_login: '1 day ago',
        created_at: '2024-02-20T14:30:00Z',
        phone: '+91 98765 43211',
        company: 'XYZ Ltd'
      },
      {
        user_id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'User',
        status: 'Inactive',
        last_login: '1 week ago',
        created_at: '2024-01-10T09:15:00Z',
        phone: '+91 98765 43212'
      },
      {
        user_id: '4',
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'Moderator',
        status: 'Active',
        last_login: '3 hours ago',
        created_at: '2024-03-05T11:45:00Z',
        phone: '+91 98765 43213',
        company: 'Tech Solutions'
      },
      {
        user_id: '5',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'User',
        status: 'Active',
        last_login: '5 hours ago',
        created_at: '2024-02-28T16:20:00Z',
        phone: '+91 98765 43214'
      },
      {
        user_id: '6',
        name: 'Diana Prince',
        email: 'diana@example.com',
        role: 'Admin',
        status: 'Active',
        last_login: '1 hour ago',
        created_at: '2024-01-01T08:00:00Z',
        phone: '+91 98765 43215',
        company: 'Wonder Corp'
      },
      {
        user_id: '7',
        name: 'Ethan Hunt',
        email: 'ethan@example.com',
        role: 'Moderator',
        status: 'Active',
        last_login: '4 hours ago',
        created_at: '2024-02-15T13:30:00Z',
        phone: '+91 98765 43216'
      },
      {
        user_id: '8',
        name: 'Fiona Green',
        email: 'fiona@example.com',
        role: 'User',
        status: 'Inactive',
        last_login: '2 weeks ago',
        created_at: '2024-01-20T10:45:00Z',
        phone: '+91 98765 43217',
        company: 'Green Solutions'
      }
    ]
    
    async function fetchUsers() {
      try {
        setLoading(true)
        const response = await getUsers(params)
        
        // Use mock data if API returns empty or if mocks are enabled
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled) {
          if (useMocks || !response.users || response.users.length === 0) {
            setData(mockData)
            setTotal(mockData.length)
          } else {
            setData(response.users)
            setTotal(response.total)
          }
        }
      } catch (e: any) {
        // Fallback to mock when API is missing or failing
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled) {
          if (useMocks) {
            setData(mockData)
            setTotal(mockData.length)
          } else {
            setError(e.message || 'Failed to fetch users')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchUsers()

    return () => {
      cancelled = true
    }
  }, [params?.search, params?.role, params?.status, params?.limit, params?.offset])

  return { data, loading, error, total }
}
