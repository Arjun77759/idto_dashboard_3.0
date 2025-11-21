import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { subMonths } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { useOnboardingStatus } from '../hooks/useOnboardingStatus' // Assuming this location, adjust as needed

export interface AnalyticsFilters {
  dateRange: DateRange | undefined
  region: string
  verificationType: string
  deviceType: string
}

interface AnalyticsFilterContextType {
  filters: AnalyticsFilters
  setDateRange: (dateRange: DateRange | undefined) => void
  setRegion: (region: string) => void
  setVerificationType: (type: string) => void
  setDeviceType: (type: string) => void
  resetFilters: () => void
}

const AnalyticsFilterContext = createContext<AnalyticsFilterContextType | undefined>(undefined)

// Default values as per requirements
const getDefaultDateRange = (): DateRange => {
  const today = new Date()
  const sixMonthsAgo = subMonths(today, 6)
  return {
    from: sixMonthsAgo,
    to: today
  }
}

const DEFAULT_FILTERS: AnalyticsFilters = {
  dateRange: getDefaultDateRange(),
  region: 'all',
  verificationType: 'all',
  deviceType: 'desktop'
}

// Mock good data for development when not onboarded
const MOCK_FILTERS: AnalyticsFilters = {
  dateRange: getDefaultDateRange(),
  region: 'mock-region',
  verificationType: 'mock-verification',
  deviceType: 'mock-device'
}

export const AnalyticsFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use onboarding status to determine if in production
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  // Conditionally pick default filters (real vs mock)
  const initialFilters = isProduction ? DEFAULT_FILTERS : MOCK_FILTERS

  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialFilters.dateRange)
  const [region, setRegion] = useState<string>(initialFilters.region)
  const [verificationType, setVerificationType] = useState<string>(initialFilters.verificationType)
  const [deviceType, setDeviceType] = useState<string>(initialFilters.deviceType)

  const resetFilters = () => {
    // Reset to the proper set based on environment
    if (isProduction) {
      setDateRange(getDefaultDateRange())
      setRegion(DEFAULT_FILTERS.region)
      setVerificationType(DEFAULT_FILTERS.verificationType)
      setDeviceType(DEFAULT_FILTERS.deviceType)
    } else {
      setDateRange(getDefaultDateRange()) // Mock and default both use the same function for date
      setRegion(MOCK_FILTERS.region)
      setVerificationType(MOCK_FILTERS.verificationType)
      setDeviceType(MOCK_FILTERS.deviceType)
    }
  }

  const value = useMemo(
    () => ({
      filters: {
        dateRange,
        region,
        verificationType,
        deviceType
      },
      setDateRange,
      setRegion,
      setVerificationType,
      setDeviceType,
      resetFilters
    }),
    [dateRange, region, verificationType, deviceType]
  )

  return (
    <AnalyticsFilterContext.Provider value={value}>
      {children}
    </AnalyticsFilterContext.Provider>
  )
}

export const useAnalyticsFilters = () => {
  const context = useContext(AnalyticsFilterContext)
  if (context === undefined) {
    throw new Error('useAnalyticsFilters must be used within an AnalyticsFilterProvider')
  }
  return context
}
