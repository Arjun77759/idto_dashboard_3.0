import { useSyncExternalStore } from 'react'
import http from '@/api/axiosInstance'

export type OnboardingStatus = {
  customer_id: string
  is_onboarded: boolean
  industry: string | null
  brand_name: string | null
  registered_name: string | null
  pan: string | null
  gst_number: string | null
  has_clients: boolean
  organization_id: string
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

export const fetchOnboardingStatus = async () => {
  setState({ loading: true, error: null })
  try {
    const { data } = await http.get<OnboardingStatus>('/onboard/check')
    setState({
      data,
      loading: false,
      hasFetched: true,
      error: null,
    })
    return data
  } catch (error: any) {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'Failed to fetch onboarding status'
    setState({
      error: message,
      loading: false,
      hasFetched: true,
    })
    throw error
  }
}

export const resetOnboardingStore = () => {
  setState({
    data: null,
    loading: false,
    error: null,
    hasFetched: false,
  })
}

