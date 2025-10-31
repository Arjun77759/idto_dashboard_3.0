import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useUsageOverview } from '@/hooks/useUsageOverview'
import { Skeleton } from '@/components/ui/skeleton'

const StatsGrid = () => {
  const { data, loading, error } = useUsageOverview()

  const stats = [
    {
      title: 'Total Verifications',
      value: data?.total ?? '-',
      change: '+12%',
      changeType: 'positive',
      description: 'From last month'
    },
    {
      title: 'Successful Verifications',
      value: data?.success ?? '-',
      change: '+8%',
      changeType: 'positive',
      description: 'From last month'
    },
    {
      title: 'Failed Verifications',
      value: data?.failed ?? '-',
      change: data && data.failed > 0 ? '-7%' : '+0%',
      changeType: data && data.failed > 0 ? 'negative' : 'positive',
      description: 'From last month'
    },
    {
      title: 'Monthly Spend',
      value: data?.balance ?? '-',
      change: '+12%',
      changeType: 'positive',
      description: 'Current balance'
    }
  ]

  const getTrendIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className='size-4 text-[#09de13]' />
      case 'negative':
        return <TrendingDown className='size-4 text-[#ff0000]' />
      default:
        return <TrendingUp className='size-4 text-[#09de13]' />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white border border-[#e7e8ea] border-solid h-auto sm:h-[125px] relative rounded-2xl w-full"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 h-auto sm:h-[125px] overflow-hidden relative rounded-[inherit] w-full">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className={
                `relative shrink-0 border-b border-[#e7e8ea] border-solid sm:border-b-0 ` +
                `${index % 2 === 0 ? 'border-r' : ''} ` +
                `${index === 3 ? 'border-r-0' : ''} ` +
                `${index === 2 ? 'lg:border-r-0' : ''}`
              }
            >
              <div className="flex flex-col gap-2 sm:gap-4 items-start p-3 sm:p-6 relative rounded-[inherit] size-full min-h-[100px] sm:min-h-0">
                <Skeleton className="h-3 w-24" />
                <div className="flex items-center justify-between relative w-full">
                  <Skeleton className="h-7 w-20 sm:w-28 lg:w-36" />
                  <div className="flex flex-col items-end gap-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : null}
        {error ? (
          <div className="col-span-2 lg:col-span-4 p-4 text-sm text-red-600">{error}</div>
        ) : null}
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className={`
              relative shrink-0
              border-b border-[#e7e8ea] border-solid
              sm:border-b-0
              ${index % 2 === 0 ? 'border-r' : ''}
              ${index % 2 === 1 ? '' : ''}
              ${index === stats.length - 1 ? 'border-r-0' : ''}
              ${index === stats.length - 2 ? 'lg:border-r-0' : ''}
            `}
          >
            {/* Custom vertical separator for desktop */}
            {index !== stats.length - 1 && index !== 0 && (
              <div
                className={
                  `
                  hidden lg:block absolute h-full right-0 w-px bg-[#e7e8ea]
                  ` + (
                    // On fourth card (last), hide the separator
                    index === stats.length - 1 ? ' lg:hidden' : ''
                  )
                }
              />
            )}
            {/* Custom horizontal separator for mobile/tablet */}
            {index < stats.length - 2 && (
              <div
                className="
                  block lg:hidden absolute left-6 right-6 bottom-0 h-px bg-[#e7e8ea]
                "
              />
            )}
            <div className="flex flex-col gap-2 sm:gap-4 items-start p-3 sm:p-6 relative rounded-[inherit] size-full min-h-[100px] sm:min-h-0">
              <p className="font-medium leading-[1.4] relative text-[10px] sm:text-[12px] text-[#9296a0] tracking-[-0.1px] sm:tracking-[-0.12px] w-full">
                {stat.title}
              </p>
              <div className="flex items-center justify-between relative w-full">
                <p className="font-medium leading-[1.24] relative text-[20px] sm:text-[24px] lg:text-[32px] text-[#131b31] text-nowrap tracking-[-0.2px] sm:tracking-[-0.24px] lg:tracking-[-0.32px] whitespace-pre">
                  {stat.value}
                </p>
                <div className="flex flex-col items-end relative">
                  <div className="flex gap-0.5 items-center relative">
                    <div className="overflow-hidden relative shrink-0 size-4 sm:size-5">
                      <div className="absolute flex inset-[30%_14.62%_22.91%_10%] items-center justify-center">
                        <div className="flex-none h-1.5 rotate-[345deg] w-3.5">
                          <div className="relative size-full -top-1">
                            {getTrendIcon(stat.changeType)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="font-bold leading-[1.4] relative text-[10px] sm:text-[12px] text-[#09de13] text-nowrap whitespace-pre">
                      {stat.change}
                    </p>
                  </div>
                  <p className="font-normal leading-[1.4] relative text-[10px] sm:text-[12px] text-[#9296a0] text-nowrap tracking-[-0.1px] sm:tracking-[-0.12px] whitespace-pre">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default StatsGrid
