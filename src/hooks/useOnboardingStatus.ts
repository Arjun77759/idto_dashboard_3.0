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

    // The shared store decides whether the active token has cached onboarding data.
    if (!state.loading) {
      fetchOnboardingStatus().catch(() => {
        // errors are stored in the shared store, so we intentionally swallow here
      })
    }
  }, [enabled, state.loading])

  return state
}

export type { OnboardingStatus } from '@/store/onboardingStore'
