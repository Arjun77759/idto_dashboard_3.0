import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useUsageCredits } from '@/hooks/useUsageCredits'
import { Skeleton } from '@/components/ui/skeleton'
import { useMonthlyUsage } from '@/hooks/useMonthlyUsage'

const CurrentBalanceCard = () => {
  const { data, loading, error } = useUsageCredits()
  const { data: monthUsage, loading: usageLoading, error: usageError } = useMonthlyUsage()
  const handleRechargeCredits = () => {
    console.log('Recharge credits')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl w-full lg:w-[281px] h-full"
    >
      <div className="flex flex-col gap-2.5 h-full items-start overflow-hidden relative rounded-[inherit] w-full">
        {/* Current Balance Section */}
        <div className="flex flex-col font-medium gap-4 items-start overflow-hidden p-6 relative shrink-0 w-full">
          <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
            Current Balance
          </p>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
              Rs. {data?.balance ?? '-'}
            </p>
          )}
        </div>

        {/* Usage Section */}
        <div className="flex flex-col gap-4 grow items-start min-h-0 min-w-0 p-6 relative shrink-0 w-full">
          <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
            Usage This Month
          </p>
          <div className="h-2.5 relative rounded-[30px] shrink-0 w-full bg-gray-200">
            {usageLoading ? (
              <div className="absolute h-2.5 left-0 top-0 w-1/2 bg-gradient-to-r from-[#8a95ff] to-[#54eebe] rounded-[30px] animate-pulse"></div>
            ) : (
              <div
                className="absolute h-2.5 left-0 top-0 bg-gradient-to-r from-[#8a95ff] to-[#54eebe] rounded-[30px]"
                style={{ width: `${Math.min(100, Math.max(0, monthUsage && monthUsage.total ? (monthUsage.used / monthUsage.total) * 100 : 0))}%` }}
              ></div>
            )}
          </div>
          <div className="flex flex-col items-start relative shrink-0">
            <div className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px]">
              {usageLoading ? (
                <Skeleton className="h-4 w-56" />
              ) : usageError ? (
                <p className="leading-[1.4] text-red-600">{usageError}</p>
              ) : (
                <p className="leading-[1.4] whitespace-pre">{monthUsage?.used ?? 0} credits used out of {monthUsage?.total ?? 0}</p>
              )}
            </div>
          </div>
          <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0 w-full">
            <button
              onClick={handleRechargeCredits}
              className="flex gap-2 h-10 items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit] w-full"
            >
              <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                Recharge Credits
              </p>
              <Plus className="size-4 text-[#0019ff]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CurrentBalanceCard
