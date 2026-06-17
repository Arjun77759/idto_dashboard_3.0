import { useEffect } from 'react'
import {
  useUserProfileStore,
  fetchUserProfile,
  type UserProfile,
} from '@/store/userProfileStore'

export function useUserProfile() {
  const storeState = useUserProfileStore((store) => store)

  useEffect(() => {
    // The shared store decides whether the active token has cached profile data.
    if (!storeState.loading) {
      fetchUserProfile().catch(() => {
        // errors are stored in the shared store, so we intentionally swallow here
      })
    }
  }, [storeState.loading])

  return {
    data: storeState.data,
    loading: storeState.loading,
    error: storeState.error,
  }
}

export type { UserProfile } from '@/store/userProfileStore'
