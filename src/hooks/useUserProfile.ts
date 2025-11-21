import { useEffect } from 'react'
import {
  useUserProfileStore,
  fetchUserProfile,
  type UserProfile,
} from '@/store/userProfileStore'

export function useUserProfile() {
  const storeState = useUserProfileStore((store) => store)

  useEffect(() => {
    // Only fetch if not already fetched and not currently loading
    // The store's fetchUserProfile function has additional guards
    if (!storeState.hasFetched && !storeState.loading) {
      fetchUserProfile().catch(() => {
        // errors are stored in the shared store, so we intentionally swallow here
      })
    }
  }, [storeState.hasFetched, storeState.loading])

  return {
    data: storeState.data,
    loading: storeState.loading,
    error: storeState.error,
  }
}

export type { UserProfile } from '@/store/userProfileStore'
