import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useUsageMonthly } from '@/hooks/useUsageMonthly'
import { useMemo } from 'react'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'
import { format } from 'date-fns'
import type { UsageMonthlyFilters } from '@/api/usageApi'

const BarChart = () => {
  const { filters } = useAnalyticsFilters()
  
  // Prepare filters for API
  const apiFilters = useMemo<UsageMonthlyFilters | undefined>(() => {
    const hasFilters = filters.dateRange?.from || 
                      filters.dateRange?.to ||
                      filters.region !== 'all' || 
                      filters.verificationType !== 'all' || 
                      filters.deviceType !== 'desktop'
    
    if (!hasFilters) return undefined
    
    return {
      start_date: filters.dateRange?.from ? format(filters.dateRange.from, 'yyyy-MM-dd') : undefined,
      end_date: filters.dateRange?.to ? format(filters.dateRange.to, 'yyyy-MM-dd') : undefined,
      region: filters.region !== 'all' ? filters.region : undefined,
      api_name: filters.verificationType !== 'all' ? filters.verificationType : undefined,
      device_type: filters.deviceType !== 'desktop' ? filters.deviceType : undefined
    }
  }, [filters.dateRange, filters.region, filters.verificationType, filters.deviceType])

  const { data, loading, error } = useUsageMonthly(apiFilters)

  // Log current filter state for debugging
  console.log('BarChart filters:', filters)

  // Format date range from filters for display
  const dateRangeLabel = useMemo(() => {
    if (filters.dateRange?.from && filters.dateRange?.to) {
      return `${format(filters.dateRange.from, 'MMM yyyy')} - ${format(filters.dateRange.to, 'MMM yyyy')}`
    }
    return 'Jan 2025 - Aug 2025' // Fallback
  }, [filters.dateRange])

  // Get top 5 APIs by transaction count and calculate bar widths
  const categories = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    // Sort by transaction count and take top 5
    const sortedData = [...data]
      .sort((a, b) => b.number_of_transactions - a.number_of_transactions)
      .slice(0, 5)

    // Calculate max for scaling bar widths
    const maxTransactions = sortedData[0]?.number_of_transactions || 1
    const maxWidth = 321 // pixels

    return sortedData.map(item => {
      const width = Math.max(103, (item.number_of_transactions / maxTransactions) * maxWidth)
      return {
        name: item.api_name,
        width: `w-[${Math.round(width)}px]`,
        count: item.number_of_transactions
      }
    })
  }, [data])

  if (error) {
    console.error('Failed to load API usage:', error)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      className="bg-white border border-[#e7e8ea] border-solid h-[245px] min-w-[280px] relative rounded-2xl shrink-0 w-full flex-1"
    >
      <div className="flex flex-col h-[245px] items-start justify-between min-w-inherit overflow-hidden p-4 relative rounded-[inherit] w-full">
        <div className="flex flex-col gap-4 grow items-start min-h-0 min-w-px relative shrink-0 w-full">
          {/* Header */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <div className="flex flex-wrap gap-2 items-center relative rounded shrink-0 w-full max-w-[238px]">
              <div className="flex flex-col items-start justify-center relative rounded shrink-0">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#616675] tracking-[-0.12px] w-full">
                  Top API Usage
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center self-stretch">
              <div className="flex gap-1 h-full items-center justify-center overflow-hidden px-2 py-0 relative rounded-lg shrink-0">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  {dateRangeLabel}
                </p>
                <Calendar className="size-4 text-[#9296a0]" />
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
            {loading ? (
              <div className="w-full space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-[30px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-[12px] text-[#9296a0] text-center w-full py-4">
                No data available
              </div>
            ) : (
              categories.map((category, index) => (
                <div key={category.name} className="bg-white flex flex-col gap-2.5 h-[30px] items-start justify-center overflow-hidden relative rounded shrink-0 w-full">
                  <div className={`bg-gradient-to-r flex gap-2.5 grow items-center min-h-0 min-w-px overflow-hidden px-[18px] py-0 relative rounded shrink-0 ${category.width} ${
                    index % 2 === 0 
                      ? 'from-[#e6e8ff] to-[#8a95ff]' 
                      : 'from-[#e6fcf5] to-[#54eebe]'
                  }`}>
                    <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                      {category.name}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BarChart
