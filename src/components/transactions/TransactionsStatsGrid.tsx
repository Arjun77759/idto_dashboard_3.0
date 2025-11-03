import { useUsageOverview } from '@/hooks/useUsageOverview'
import { useMemo } from 'react'

const TransactionsStatsGrid = () => {
  const { data, loading, error } = useUsageOverview()

  // Calculate success rate from API data
  const successRate = useMemo(() => {
    if (!data || data.total === 0) return '0'
    return Math.round((data.success / data.total) * 100).toString()
  }, [data])

  // Calculate failed count
  const failedCount = useMemo(() => {
    return data?.failed || 0
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
                {data?.total.toLocaleString() || '0'}
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
            <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
              --
            </p>
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
