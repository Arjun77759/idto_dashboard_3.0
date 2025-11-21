import { useSyncExternalStore } from 'react'
import {
  checkBasicDetailsExists,
  checkBusinessExists,
  checkPANExists,
  checkGSTExists,
} from '@/api/onboardingApi'
import { getAccessToken } from '@/lib/auth'

export type OnboardingStepsStatus = {
  basicDetails: boolean | null
  businessInfo: boolean | null
  businessPAN: boolean | null
  gstin: boolean | null
  loading: boolean
}

type OnboardingStepsStoreState = {
  basicDetails: boolean | null
  businessInfo: boolean | null
  businessPAN: boolean | null
  gstin: boolean | null
  loading: boolean
  hasFetched: boolean
}

type Listener = () => void

const listeners = new Set<Listener>()

let state: OnboardingStepsStoreState = {
  basicDetails: null,
  businessInfo: null,
  businessPAN: null,
  gstin: null,
  loading: false,
  hasFetched: false,
}

// Track ongoing fetch to prevent concurrent calls
let fetchPromise: Promise<OnboardingStepsStatus> | null = null
let isFetching = false // Additional flag to prevent race conditions

const setState = (partial: Partial<OnboardingStepsStoreState>) => {
  state = { ...state, ...partial }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: Listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useOnboardingStepsStore = <T,>(
  selector: (store: OnboardingStepsStoreState) => T
): T => {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state)
  )
}

export const fetchOnboardingSteps = async (): Promise<OnboardingStepsStatus> => {
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
  if (state.hasFetched) {
    return {
      basicDetails: state.basicDetails,
      businessInfo: state.businessInfo,
      businessPAN: state.businessPAN,
      gstin: state.gstin,
      loading: false,
    }
  }

  // Don't make API call if user is not authenticated
  const token = getAccessToken()
  if (!token) {
    setState({
      loading: false,
      hasFetched: false,
      basicDetails: null,
      businessInfo: null,
      businessPAN: null,
      gstin: null,
    })
    return {
      basicDetails: null,
      businessInfo: null,
      businessPAN: null,
      gstin: null,
      loading: false,
    }
  }

  // Set flags synchronously to prevent concurrent calls
  // These assignments happen atomically in JavaScript's single-threaded execution
  isFetching = true
  setState({ loading: true })

  // Create the fetch promise (this assignment is also synchronous)
  fetchPromise = (async () => {
    try {
      const [basicDetails, businessInfo, businessPAN, gstin] = await Promise.all([
        checkBasicDetailsExists().catch(() => ({ exists: false })),
        checkBusinessExists().catch(() => ({ exists: false })),
        checkPANExists().catch(() => ({ exists: false })),
        checkGSTExists().catch(() => ({ exists: false })),
      ])

      const result: OnboardingStepsStatus = {
        basicDetails: basicDetails.exists,
        businessInfo: businessInfo.exists,
        businessPAN: businessPAN.exists,
        gstin: gstin.exists,
        loading: false,
      }

      setState({
        ...result,
        loading: false,
        hasFetched: true,
      })
      fetchPromise = null // Clear the promise after successful fetch
      isFetching = false
      return result
    } catch (error: any) {
      setState({
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

export const invalidateOnboardingSteps = () => {
  fetchPromise = null
  isFetching = false
  setState({
    basicDetails: null,
    businessInfo: null,
    businessPAN: null,
    gstin: null,
    loading: false,
    hasFetched: false,
  })
}

export const resetOnboardingStepsStore = () => {
  fetchPromise = null
  isFetching = false
  setState({
    basicDetails: null,
    businessInfo: null,
    businessPAN: null,
    gstin: null,
    loading: false,
    hasFetched: false,
  })
}

