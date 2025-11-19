import { useSyncExternalStore } from 'react'
import http from '@/api/axiosInstance'
import { getAccessToken } from '@/lib/auth'

export type UserProfile = {
  customer_id: string
  id?: string // Alias for compatibility
  name: string
  email: string
  active: boolean
  pan_number?: string | null
  gst_number?: string | null
  mobile?: string | null
  business_address?: string | null
  industry?: string | null
  brand_name?: string | null
  registered_name?: string | null
}

type UserProfileStoreState = {
  data: UserProfile | null
  loading: boolean
  error: string | null
  hasFetched: boolean
}

type Listener = () => void

const listeners = new Set<Listener>()

let state: UserProfileStoreState = {
  data: null,
  loading: false,
  error: null,
  hasFetched: false,
}

// Track ongoing fetch to prevent concurrent calls
let fetchPromise: Promise<UserProfile | null> | null = null
let isFetching = false // Additional flag to prevent race conditions

const setState = (partial: Partial<UserProfileStoreState>) => {
  state = { ...state, ...partial }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: Listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useUserProfileStore = <T,>(
  selector: (store: UserProfileStoreState) => T
): T => {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state)
  )
}

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  // If a fetch is already in progress, return the existing promise
  if (fetchPromise) {
    return fetchPromise
  }
  
  // If we're already fetching (race condition guard), wait briefly for promise to be set
  if (isFetching) {
    // Since both are set synchronously, wait one tick and check again
    await new Promise(resolve => setTimeout(resolve, 0))
    if (fetchPromise) {
      return fetchPromise
    }
    // If still no promise after one tick, something went wrong, reset and continue
    isFetching = false
  }

  // If already fetched, return cached data immediately
  if (state.hasFetched && state.data) {
    return state.data
  }

  // Don't make API call if user is not authenticated
  const token = getAccessToken()
  if (!token) {
    setState({
      loading: false,
      hasFetched: false,
      error: null,
    })
    return null
  }

  // Set flags synchronously to prevent concurrent calls
  // These assignments happen atomically in JavaScript's single-threaded execution
  isFetching = true
  setState({ loading: true, error: null })

  // Create the fetch promise (this assignment is also synchronous)
  fetchPromise = (async () => {
    try {
      const { data } = await http.get<UserProfile>('/me/profile')
      setState({
        data,
        loading: false,
        hasFetched: true,
        error: null,
      })
      fetchPromise = null // Clear the promise after successful fetch
      isFetching = false
      return data
    } catch (error: any) {
      // Fallback to mock when API is missing or failing
      const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
      if (useMocks) {
        const mock: UserProfile = {
          customer_id: '1',
          id: '1',
          name: 'John Doe',
          email: 'john.doe@brightwave.com',
          active: true
        }
        setState({
          data: mock,
          loading: false,
          hasFetched: true,
          error: null,
        })
        fetchPromise = null
        isFetching = false
        return mock
      }
      
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load user profile'
      setState({
        error: message,
        loading: false,
        hasFetched: true,
      })
      fetchPromise = null // Clear the promise after error
      isFetching = false
      throw error
    }
  })()

  return fetchPromise
}

export const invalidateUserProfile = () => {
  fetchPromise = null
  isFetching = false
  setState({
    data: null,
    loading: false,
    error: null,
    hasFetched: false,
  })
}

export const resetUserProfileStore = () => {
  fetchPromise = null
  isFetching = false
  setState({
    data: null,
    loading: false,
    error: null,
    hasFetched: false,
  })
}

