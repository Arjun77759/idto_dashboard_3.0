import { useEffect } from 'react'
import {
  useOnboardingStepsStore,
  fetchOnboardingSteps,
  type OnboardingStepsStatus,
} from '@/store/onboardingStepsStore'

export function useOnboardingSteps() {
  const storeState = useOnboardingStepsStore((store) => store)

  useEffect(() => {
    // Only fetch if not already fetched and not currently loading
    if (!storeState.hasFetched && !storeState.loading) {
      fetchOnboardingSteps().catch(() => {
        // errors are stored in the shared store, so we intentionally swallow here
      })
    }
  }, [storeState.hasFetched, storeState.loading])

  return {
    basicDetails: storeState.basicDetails,
    businessInfo: storeState.businessInfo,
    businessPAN: storeState.businessPAN,
    gstin: storeState.gstin,
    loading: storeState.loading,
  } as OnboardingStepsStatus
}

export type { OnboardingStepsStatus } from '@/store/onboardingStepsStore'

