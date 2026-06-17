import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Timer, TrendingUp } from 'lucide-react'
import { useUsageOverview } from '@/hooks/useUsageOverview'
import { Skeleton } from '@/components/ui/skeleton'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useConfiguredApis } from '@/hooks/useConfiguredApis'
import { useOpenApiEndpoints } from '@/hooks/useOpenApiEndpoints'
import { useTransactions } from '@/hooks/useTransactions'

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
  const { data: configuredApis } = useConfiguredApis()
  const { data: apiEndpoints } = useOpenApiEndpoints()
  const { data: transactions } = useTransactions()

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

  const formatChange = (changePercent: number | null): string => {
    if (changePercent === null) return '+0.0%'
    const sign = changePercent >= 0 ? '+' : ''
    return `${sign}${changePercent.toFixed(1)}%`
  }

  const formatCount = (value: number | undefined) => {
    if (typeof value !== 'number') return '-'
    return value.toLocaleString('en-IN')
  }

  const totalVerifications = data?.total_verifications?.count ?? 0
  const successfulVerifications = data?.successful_verifications?.count ?? 0
  const successRate = totalVerifications > 0 ? `${((successfulVerifications / totalVerifications) * 100).toFixed(1)}%` : '0%'
  const latencyValues = transactions
    .map((transaction) => Number.parseFloat(String(transaction.turn_around_time || '').replace(/[^\d.]/g, '')))
    .filter((value) => Number.isFinite(value))
  const averageLatency = latencyValues.length
    ? `${Math.round(latencyValues.reduce((sum, value) => sum + value, 0) / latencyValues.length)} ms`
    : '-'
  const activeApis = configuredApis?.apis?.length ?? 0
  const totalApis = apiEndpoints?.length ?? 0
  const unusedApis = Math.max(totalApis - activeApis, 0)

  const stats = [
    {
      title: 'Verifications',
      value: formatCount(data?.total_verifications?.count),
      change: formatChange(data?.total_verifications?.change_percent ?? null),
      icon: ShieldCheck,
    },
    {
      title: 'Success rate',
      value: successRate,
      change: formatChange(data?.successful_verifications?.change_percent ?? null),
      icon: TrendingUp,
    },
    {
      title: 'Avg. latency',
      value: averageLatency,
      change: latencyValues.length ? 'Live avg.' : 'No data',
      icon: Timer,
    },
    {
      title: 'Active APIs',
      value: totalApis ? `${activeApis} / ${totalApis}` : `${activeApis}`,
      change: totalApis ? `${unusedApis} unused` : 'Catalog loading',
      icon: Activity,
    },
  ]

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
          Live traffic from your production workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? (
          Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="h-[148px] rounded-[22px] border border-[#e0e5eb] bg-white p-[21px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
              <Skeleton className="size-9 rounded-[14px]" />
              <Skeleton className="mt-5 h-8 w-24" />
              <Skeleton className="mt-2 h-4 w-32" />
            </article>
          ))
        ) : error ? (
          <div className="col-span-full rounded-[14px] border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {typeof error === 'string' ? error : 'An error occurred while loading statistics'}
          </div>
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article
                key={stat.title}
                className="h-[148px] rounded-[22px] border border-[#e0e5eb] bg-white p-[21px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-9 place-items-center rounded-[14px] bg-[#e8f3ff] text-[#0019ff]">
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
          })
        )}
      </div>
    </motion.section>
  )
}

export default StatsGrid
