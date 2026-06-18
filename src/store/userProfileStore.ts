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
  business_state?: string | null
  industry?: string | null
  brand_name?: string | null
  registered_name?: string | null
  entity_type?: string | null
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
let fetchedForToken: string | null = null
let fetchPromiseToken: string | null = null

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
  const token = getAccessToken()

  // If a fetch is already in progress, return the existing promise
  if (fetchPromise && fetchPromiseToken === token) {
    return fetchPromise
  }
  
  // If we're already fetching (race condition guard), wait briefly for promise to be set
  if (isFetching && fetchPromiseToken === token) {
    // Since both are set synchronously, wait one tick and check again
    await new Promise(resolve => setTimeout(resolve, 0))
    if (fetchPromise && fetchPromiseToken === token) {
      return fetchPromise
    }
    // If still no promise after one tick, something went wrong, reset and continue
    isFetching = false
  }

  // If already fetched for the current authenticated user, return cached data immediately.
  if (state.hasFetched && state.data && fetchedForToken === token) {
    return state.data
  }

  if (!token) {
    fetchedForToken = null
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
  fetchPromiseToken = token
  setState({
    loading: true,
    error: null,
    ...(fetchedForToken !== token ? { data: null, hasFetched: false } : {}),
  })

  // Create the fetch promise (this assignment is also synchronous)
  fetchPromise = (async () => {
    const requestToken = token
    try {
      const { data } = await http.get<UserProfile>('/me/profile')
      if (getAccessToken() === requestToken) {
        setState({
          data,
          loading: false,
          hasFetched: true,
          error: null,
        })
        fetchedForToken = requestToken
      }
      fetchPromise = null // Clear the promise after successful fetch
      fetchPromiseToken = null
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
        if (getAccessToken() === requestToken) {
          setState({
            data: mock,
            loading: false,
            hasFetched: true,
            error: null,
          })
          fetchedForToken = requestToken
        }
        fetchPromise = null
        fetchPromiseToken = null
        isFetching = false
        return mock
      }
      
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load user profile'
      if (getAccessToken() === requestToken) {
        setState({
          error: message,
          loading: false,
          hasFetched: true,
        })
      }
      fetchPromise = null // Clear the promise after error
      fetchPromiseToken = null
      isFetching = false
      throw error
    }
  })()

  return fetchPromise
}

export const invalidateUserProfile = () => {
  fetchPromise = null
  isFetching = false
  fetchedForToken = null
  fetchPromiseToken = null
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
  fetchedForToken = null
  fetchPromiseToken = null
  setState({
    data: null,
    loading: false,
    error: null,
    hasFetched: false,
  })
}

