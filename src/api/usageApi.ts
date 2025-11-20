import http from './axiosInstance'

/**
 * Usage & Analytics API
 */

export type UsageOverview = {
  total: number
  success: number
  failed: number
  balance: number
}

export type UsageComparisonMetric = {
  count: number
  change_percent: number | null
}

export type MonthlySpendMetric = {
  amount: number
  change_percent: number | null
}

export type UsageComparisonPeriod = {
  requested_month: number
  current_year: number
  current_month_window: {
    start: string
    end: string
  }
  previous_month_window: {
    start: string
    end: string
  }
}

export type UsageComparisonResponse = {
  total_verifications: UsageComparisonMetric
  successful_verifications: UsageComparisonMetric
  failed_verifications: UsageComparisonMetric
  monthly_spend: MonthlySpendMetric
  period: UsageComparisonPeriod
  average_verification_time?: number  // Average time in seconds
}

/**
 * Get usage overview (basic stats)
 */
export async function getUsageOverview(): Promise<UsageOverview> {
  const { data } = await http.get<UsageOverview>('/usage/overview')
  return data
}

/**
 * Get usage comparison with previous period
 * @param period - Month number (1-12), defaults to current month
 */
export async function getUsageComparison(period?: number): Promise<UsageComparisonResponse> {
  // Default to current month if not specified
  const currentMonth = period || new Date().getMonth() + 1 // getMonth() returns 0-11, so add 1
  const { data } = await http.get<UsageComparisonResponse>('/usage/overview/compare', { 
    params: { period: currentMonth } 
  })
  return data
}

export type UsageMonthlyFilters = {
  start_date?: string  // ISO date string
  end_date?: string    // ISO date string
  region?: string
  api_name?: string
  device_type?: string
}

/**
 * Get monthly usage with optional filters
 */
export async function getMonthlyUsage(filters?: UsageMonthlyFilters): Promise<any[]> {
  const params: Record<string, string> = {}
  if (filters?.start_date) params.start_date = filters.start_date
  if (filters?.end_date) params.end_date = filters.end_date
  if (filters?.region) params.region = filters.region
  if (filters?.api_name) params.api_name = filters.api_name
  if (filters?.device_type) params.device_type = filters.device_type
  
  const { data } = await http.get<any[]>('/usage/monthly', { params })
  return data
}

export type UsageVolumeTimeseriesFilters = {
  start_date?: string  // ISO date string
  end_date?: string    // ISO date string
  region?: string
  api_name?: string
  device_type?: string
}

/**
 * Get usage volume timeseries with optional filters
 */
export async function getUsageVolumeTimeseries(
  start: string, 
  end: string, 
  filters?: UsageVolumeTimeseriesFilters
): Promise<{ series: any[] }> {
  const params: Record<string, string> = { start, end }
  if (filters?.region) params.region = filters.region
  if (filters?.api_name) params.api_name = filters.api_name
  if (filters?.device_type) params.device_type = filters.device_type
  
  const { data } = await http.get<{ series: any[] }>('/usage/volume/timeseries', { params })
  return data
}
