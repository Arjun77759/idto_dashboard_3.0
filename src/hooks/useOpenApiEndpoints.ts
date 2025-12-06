import { useEffect, useState } from 'react'
import type { ApiEndpoint } from '@/config/apiEndpoints'
import { fetchOpenAPISpec, transformOpenAPIToEndpoints } from '@/utils/openApiParser'

// Cache for OpenAPI spec
let cachedSpec: ApiEndpoint[] | null = null
let cachePromise: Promise<ApiEndpoint[]> | null = null

export function useOpenApiEndpoints() {
  const [data, setData] = useState<ApiEndpoint[] | null>(cachedSpec)
  const [loading, setLoading] = useState<boolean>(!cachedSpec)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If we have cached data, use it immediately
    if (cachedSpec) {
      setData(cachedSpec)
      setLoading(false)
      return
    }

    // If there's already a fetch in progress, wait for it
    if (cachePromise) {
      cachePromise
        .then((endpoints) => {
          setData(endpoints)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message || 'Failed to load API endpoints')
          setLoading(false)
        })
      return
    }

    // Start new fetch
    let cancelled = false
    cachePromise = (async () => {
      try {
        const spec = await fetchOpenAPISpec()
        const endpoints = transformOpenAPIToEndpoints(spec)
        if (!cancelled) {
          cachedSpec = endpoints
          setData(endpoints)
          setLoading(false)
        }
        return endpoints
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to load API endpoints')
          setLoading(false)
        }
        throw err
      } finally {
        cachePromise = null
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}

// Helper function to get API by ID
export function getApiById(endpoints: ApiEndpoint[] | null, id: string): ApiEndpoint | undefined {
  if (!endpoints) return undefined
  return endpoints.find((api) => api.id === id)
}

// Helper function to get all categories
export function getAllCategories(endpoints: ApiEndpoint[] | null): string[] {
  if (!endpoints) return ['All']
  const categories = [...new Set(endpoints.map((api) => api.category))]
  return ['All', ...categories.sort()]
}

// Helper function to get all methods
export function getAllMethods(endpoints: ApiEndpoint[] | null): string[] {
  if (!endpoints) return ['All']
  const methods = [...new Set(endpoints.map((api) => api.method))]
  return ['All', ...methods.sort()]
}

// Helper function to get all unique tags
export function getAllTags(endpoints: ApiEndpoint[] | null): string[] {
  if (!endpoints) return ['All']
  const allTags = endpoints.flatMap((api) => api.tags || [])
  const uniqueTags = [...new Set(allTags)]
  return ['All', ...uniqueTags.sort()]
}

// Helper function to get tags filtered by category
export function getTagsByCategory(endpoints: ApiEndpoint[] | null, category: string): string[] {
  if (!endpoints) return ['All']
  if (category === 'All') {
    return getAllTags(endpoints)
  }
  const filteredEndpoints = endpoints.filter((api) => api.category === category)
  const allTags = filteredEndpoints.flatMap((api) => api.tags || [])
  const uniqueTags = [...new Set(allTags)]
  return ['All', ...uniqueTags.sort()]
}

