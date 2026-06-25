import { useSyncExternalStore } from 'react'
import http from '@/api/axiosInstance'
import { getAccessToken } from '@/lib/auth'

export type OnboardingStatus = {
  customer_id: string
  is_onboarded: boolean
  production_onboarding_step:
    | 'basic-details'
    | 'pan-gst'
    | 'director-kyc'
    | 'bank-account'
    | 'bank-final-review'
    | 'completed'
  production_steps: {
    basic_details: boolean
    pan: boolean
    gst: boolean
    digilocker: boolean
    bank: boolean
  }
}

type OnboardingStoreState = {
  data: OnboardingStatus | null
  loading: boolean
  error: string | null
  hasFetched: boolean
}

type Listener = () => void

const listeners = new Set<Listener>()

let state: OnboardingStoreState = {
  data: null,
  loading: false,
  error: null,
  hasFetched: false,
}

// Track ongoing fetch to prevent concurrent calls
let fetchPromise: Promise<OnboardingStatus | null> | null = null
let isFetching = false // Additional flag to prevent race conditions
let fetchedForToken: string | null = null
let fetchPromiseToken: string | null = null

const setState = (partial: Partial<OnboardingStoreState>) => {
  state = { ...state, ...partial }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: Listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useOnboardingStore = <T,>(
  selector: (store: OnboardingStoreState) => T
): T => {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state)
  )
}

export const fetchOnboardingStatus = async (force = false) => {
  const token = getAccessToken()

  // If a fetch is already in progress, return the existing promise
  if (fetchPromise && fetchPromiseToken === token) {
    return fetchPromise
  }
  
  // If we're already fetching (race condition guard), create a promise that waits for the actual one
  // This handles the case where another call just set isFetching but hasn't created promise yet
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
  if (!force && state.hasFetched && state.data && fetchedForToken === token) {
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
      const { data } = await http.get<OnboardingStatus>('/onboard/check')
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
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch onboarding status'
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

export const invalidateOnboardingStatus = () => {
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

export const resetOnboardingStore = () => {
  fetchPromise = null // Clear any ongoing fetch
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

