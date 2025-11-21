import { useEffect } from 'react'
import {
  fetchOnboardingStatus,
  useOnboardingStore,
  type OnboardingStatus,
} from '@/store/onboardingStore'

type UseOnboardingStatusOptions = {
  enabled?: boolean
}

export function useOnboardingStatus(options: UseOnboardingStatusOptions = {}) {
  const { enabled = true } = options
  const state = useOnboardingStore((store) => store)

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Only fetch if not already fetched and not currently loading
    // The store's fetchOnboardingStatus function has additional guards
    if (!state.hasFetched && !state.loading) {
      fetchOnboardingStatus().catch(() => {
        // errors are stored in the shared store, so we intentionally swallow here
      })
    }
  }, [enabled, state.hasFetched, state.loading])

  return state
}

export type { OnboardingStatus } from '@/store/onboardingStore'
