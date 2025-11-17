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

    if (state.hasFetched || state.loading) {
      return
    }

    fetchOnboardingStatus().catch(() => {
      // errors are stored in the shared store, so we intentionally swallow here
    })
  }, [enabled, state.hasFetched, state.loading])

  return state
}

export type { OnboardingStatus } from '@/store/onboardingStore'
