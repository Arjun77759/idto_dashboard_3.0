import { motion } from 'framer-motion'

import { Skeleton } from '@/components/ui/skeleton'
import { useMonthlyUsage } from '@/hooks/useMonthlyUsage'

const formatNumber = (value: number | undefined | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--'
  return value.toLocaleString('en-IN')
}

const CurrentBalanceCard = () => {
  const { data, loading, error } = useMonthlyUsage()

  const usagePercentage =
    data?.total && typeof data.used === 'number'
      ? Math.min(100, Math.max(0, (data.used / data.total) * 100))
      : 0

  const usageSummary =
    data && typeof data.used === 'number' && typeof data.total === 'number'
      ? `${formatNumber(data.used)} credits used out of ${formatNumber(data.total)}`
      : '--'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white border border-[#e7e8ea] relative rounded-2xl w-full lg:w-[281px] h-full"
    >
      <div className="flex flex-col justify-between gap-6 p-6 h-full">
        <div className="flex flex-col gap-2.5">
          <p className="text-[12px] font-medium text-[#9296a0]">Live Credits Consumed</p>
          {loading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <p className="text-[20px] font-bold leading-[28px] text-[#616675]">{formatNumber(data?.balance)}</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[12px] font-medium text-[#9296a0]">Usage This Month</p>
          <div className="h-2.5 rounded-full bg-[#f2f2f6] relative overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#cfd6ff] via-[#b7c1ff] to-[#9faeff] animate-pulse" />
            ) : (
              <div
                className="absolute h-full left-0 top-0 rounded-full bg-gradient-to-r from-[#cfd6ff] via-[#b7c1ff] to-[#9faeff]"
                style={{ width: `${usagePercentage}%` }}
              />
            )}
          </div>
          {loading ? (
            <Skeleton className="h-4 w-48" />
          ) : error ? (
            <p className="text-xs text-red-600">{typeof error === 'string' ? error : 'Failed to load usage'}</p>
          ) : (
            <p className="text-[12px] text-[#9296a0]">{usageSummary}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CurrentBalanceCard
