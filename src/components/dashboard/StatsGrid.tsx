import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Timer, TrendingDown, TrendingUp } from 'lucide-react'
import { useUsageOverview } from '@/hooks/useUsageOverview'
import { Skeleton } from '@/components/ui/skeleton'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

const sandboxStats = [
  {
    title: 'Verifications (sandbox)',
    value: '1,248',
    change: '+12.4%',
    icon: ShieldCheck,
  },
  {
    title: 'Success rate',
    value: '98.7%',
    change: '+0.3%',
    icon: TrendingUp,
  },
  {
    title: 'Avg. latency',
    value: '412 ms',
    change: '-18 ms',
    icon: Timer,
  },
  {
    title: 'Active APIs',
    value: '6 / 14',
    change: '5 unused',
    icon: Activity,
  },
]

const StatsGrid = () => {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const { data, loading, error } = useUsageOverview()

  if (!isProduction) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="w-full overflow-hidden rounded-[21.483px] border-[0.895px] border-[#e1e5ea] bg-white p-[20.895px] shadow-[0_0.895px_1.79px_rgba(17,22,31,0.04),0_0.895px_2.685px_rgba(17,22,31,0.06)]"
      >
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase leading-[15px] tracking-[1.6px] text-[#5e6a7a]">
            Overview
          </p>
          <h2 className="pt-0.5 text-[24px] font-bold leading-8 tracking-[-0.6px] text-[#091123]">
            Today at a glance
          </h2>
          <p className="text-[14px] font-normal leading-5 text-[#5e6a7a]">
            Sandbox traffic from the last 24 hours.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sandboxStats.map((stat) => {
            const Icon = stat.icon
            return (
              <article
                key={stat.title}
                className="h-[148px] rounded-[22px] border border-[#e0e5eb] bg-white p-[21px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-9 place-items-center rounded-[14px] bg-[#fff2d0] text-[#f09c17]">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[12px] font-normal leading-4 text-[#5b6472]">
                    {stat.change}
                  </span>
                </div>
                <p className="pt-3.5 text-[30px] font-medium leading-8 tracking-[-0.6px] text-[#0a121f]">
                  {stat.value}
                </p>
                <p className="text-[14px] font-normal leading-5 text-[#5b6472]">
                  {stat.title}
                </p>
              </article>
            )
          })}
        </div>
      </motion.section>
    )
  }

  // Helper function to format change percentage
  const formatChange = (changePercent: number | null): string => {
    if (changePercent === null) return '+0%'
    const sign = changePercent >= 0 ? '+' : ''
    return `${sign}${changePercent.toFixed(2)}%`
  }

  // Helper function to determine change type
  const getChangeType = (changePercent: number | null, isNegativeGood: boolean = false): 'positive' | 'negative' => {
    if (changePercent === null || changePercent === 0) return 'positive'
    const isPositive = changePercent > 0
    // For failed verifications, negative change is good
    return isNegativeGood ? (isPositive ? 'negative' : 'positive') : (isPositive ? 'positive' : 'negative')
  }

  const stats = [
    {
      title: 'Total Verifications',
      value: data?.total_verifications?.count ?? '-',
      change: formatChange(data?.total_verifications?.change_percent ?? null),
      changeType: getChangeType(data?.total_verifications?.change_percent ?? null),
      description: 'From last month'
    },
    {
      title: 'Successful Verifications',
      value: data?.successful_verifications?.count ?? '-',
      change: formatChange(data?.successful_verifications?.change_percent ?? null),
      changeType: getChangeType(data?.successful_verifications?.change_percent ?? null),
      description: 'From last month'
    },
    {
      title: 'Failed Verifications',
      value: data?.failed_verifications?.count ?? '-',
      change: formatChange(data?.failed_verifications?.change_percent ?? null),
      changeType: getChangeType(data?.failed_verifications?.change_percent ?? null, true),
      description: 'From last month'
    },
    {
      title: 'Monthly Spend',
      value: data?.monthly_spend?.amount ? `\u20b9${data.monthly_spend.amount.toFixed(2)}` : '-',
      change: formatChange(data?.monthly_spend?.change_percent ?? null),
      changeType: getChangeType(data?.monthly_spend?.change_percent ?? null),
      description: 'From last month'
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
          <div className="col-span-2 lg:col-span-4 p-4 text-sm text-red-600">
            {typeof error === 'string' ? error : 'An error occurred while loading statistics'}
          </div>
        ) : null}
        {!loading && !error && stats.map((stat, index) => (
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
              ${index === stats.length - 1 ? 'border-r-0' : ''}
              ${index === stats.length - 2 ? 'lg:border-r-0' : ''}
            `}
          >
            {index !== stats.length - 1 && index !== 0 && (
              <div className="hidden lg:block absolute h-full right-0 w-px bg-[#e7e8ea]" />
            )}
            {index < stats.length - 2 && (
              <div className="block lg:hidden absolute left-6 right-6 bottom-0 h-px bg-[#e7e8ea]" />
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
                    <p className={`font-bold leading-[1.4] relative text-[10px] sm:text-[12px] text-nowrap whitespace-pre ${
                      stat.changeType === 'positive' ? 'text-[#09de13]' : 'text-[#ff0000]'
                    }`}>
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
