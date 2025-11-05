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
  average_verification_time?: number  // Average time in seconds (currently not provided by API)
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
