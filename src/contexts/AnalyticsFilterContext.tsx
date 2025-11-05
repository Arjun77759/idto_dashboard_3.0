import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { subMonths } from 'date-fns'
import type { DateRange } from 'react-day-picker'

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

export const AnalyticsFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(DEFAULT_FILTERS.dateRange)
  const [region, setRegion] = useState<string>(DEFAULT_FILTERS.region)
  const [verificationType, setVerificationType] = useState<string>(DEFAULT_FILTERS.verificationType)
  const [deviceType, setDeviceType] = useState<string>(DEFAULT_FILTERS.deviceType)

  const resetFilters = () => {
    setDateRange(getDefaultDateRange())
    setRegion(DEFAULT_FILTERS.region)
    setVerificationType(DEFAULT_FILTERS.verificationType)
    setDeviceType(DEFAULT_FILTERS.deviceType)
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

