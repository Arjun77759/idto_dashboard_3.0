import { useUsageOverview } from '@/hooks/useUsageOverview'
import { useMemo } from 'react'

const TransactionsStatsGrid = () => {
  const { data, loading, error } = useUsageOverview()

  // Calculate success rate from API data
  const successRate = useMemo(() => {
    if (!data) return '0'
    const total = data.total_verifications?.count ?? 0
    const success = data.successful_verifications?.count ?? 0
    if (total === 0) return '0'
    return Math.round((success / total) * 100).toString()
  }, [data])

  // Calculate failed count
  const failedCount = useMemo(() => {
    return data?.failed_verifications?.count ?? 0
  }, [data])
  
  // Get total count
  const totalCount = useMemo(() => {
    return data?.total_verifications?.count ?? 0
  }, [data])

  // Format average verification time
  const averageTime = useMemo(() => {
    if (!data?.average_verification_time) return '--'
    const timeInSeconds = data.average_verification_time
    
    // Format based on duration
    if (timeInSeconds < 1) {
      return `${Math.round(timeInSeconds * 1000)}ms`
    } else if (timeInSeconds < 60) {
      return `${timeInSeconds.toFixed(1)}s`
    } else {
      const minutes = Math.floor(timeInSeconds / 60)
      const seconds = Math.round(timeInSeconds % 60)
      return `${minutes}m ${seconds}s`
    }
  }, [data])

  if (error) {
    console.error('Failed to load transaction stats:', error)
  }

  return (
    <div className="bg-white border border-[#e7e8ea] border-solid h-auto sm:h-[125px] relative rounded-2xl shrink-0 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 h-auto sm:h-[125px] overflow-hidden relative rounded-[inherit] w-full">
        {/* Total Transactions */}
        <div className="border-r border-[#e7e8ea] border-solid relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Total Transactions
            </p>
            {loading ? (
              <div className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            ) : (
              <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
                {totalCount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        {/* Success Rate */}
        <div className="border-r-0 sm:border-r border-[#e7e8ea] border-solid relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Success Rate
            </p>
            {loading ? (
              <div className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            ) : (
              <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
                {successRate}%
              </p>
            )}
          </div>
        </div>
        
        {/* Average Time */}
        <div className="border-r border-[#e7e8ea] border-solid relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Average Time
            </p>
            {loading ? (
              <div className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            ) : (
              <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
                {averageTime}
              </p>
            )}
          </div>
        </div>
        
        {/* Failed Transactions */}
        <div className="relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Failed Transactions
            </p>
            {loading ? (
              <div className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            ) : (
              <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
                {failedCount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionsStatsGrid
