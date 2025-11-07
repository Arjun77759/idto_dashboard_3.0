import { motion } from 'framer-motion'
import { useUsageOverview } from '@/hooks/useUsageOverview'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'

const AnalyticsStatsGrid = () => {
  const { filters } = useAnalyticsFilters()
  // TODO: Pass filters to API hook when backend supports filtering
  // const { data, loading, error } = useUsageOverview(filters)
  const { data, loading, error } = useUsageOverview()

  // Log current filter state for debugging
  console.log('AnalyticsStatsGrid filters:', filters)

  // Extract counts from comparison API response
  const totalCount = data?.total_verifications?.count ?? 0
  const successCount = data?.successful_verifications?.count ?? 0
  const failedCount = data?.failed_verifications?.count ?? 0

  // Calculate average verification time if available
  // Note: API doesn't currently provide this metric (see API_Gaps.md)
  // When available, it should be in the UsageComparisonResponse
  const avgVerificationTime = data?.average_verification_time ?? null

  // Calculate stats from API data
  const stats = [
    {
      label: "Total Verifications",
      value: totalCount.toLocaleString()
    },
    {
      label: "Successful Rate",
      value: totalCount > 0 
        ? `${Math.round((successCount / totalCount) * 100)}%` 
        : "0%"
    },
    {
      label: "Failed Rate",
      value: totalCount > 0 
        ? `${Math.round((failedCount / totalCount) * 100)}%` 
        : "0%"
    },
    {
      label: "Avg. Verification Time",
      value: avgVerificationTime ? `${avgVerificationTime}s` : "N/A"
    }
  ]

  // Show error state if needed
  if (error) {
    console.error('Failed to load analytics stats:', error)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white border border-[#e7e8ea] border-solid h-auto sm:h-[125px] relative rounded-2xl shrink-0 w-full"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 h-auto sm:h-[125px] overflow-hidden relative rounded-[inherit] w-full">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid relative shrink-0 ${
              index % 2 === 1 ? 'border-r-0' : 'border-r'
            } sm:border-r ${
              index === stats.length - 1 ? 'sm:border-r-0' : ''
            }`}
          >
            <div className="flex flex-col font-medium gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
              <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
                {stat.label}
              </p>
              {loading ? (
                <div className="w-20 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
              ) : (
                <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
                  {stat.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default AnalyticsStatsGrid
