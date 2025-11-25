import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AnimatedSkeleton from '@/components/AnimatedSkeleton'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { TooltipProps } from 'recharts'
import { Calendar } from 'lucide-react'
import { useUsageVolumeTimeseries } from '@/hooks/useUsageVolumeTimeseries'
import { useMemo } from 'react'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'
import { differenceInMonths, format } from 'date-fns'
import type { UsageVolumeTimeseriesFilters } from '@/api/usageApi'

const chartConfig = {
  transactions: {
    label: 'Transactions',
    color: '#3AC828'
  }
} satisfies ChartConfig

const formatMonthLabel = (monthYear: string) => {
  try {
    const [month, year] = monthYear.split(' ')
    const shortMonth = month.substring(0, 3)
    const shortYear = year.substring(2)
    return `${shortMonth} '${shortYear}`
  } catch {
    return monthYear
  }
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null

  const formattedLabel =
    typeof label === 'string' ? formatMonthLabel(label) : label
  const value = Number(payload[0].value ?? 0)

  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 min-w-[160px]">
      <p className="font-medium text-popover-foreground mb-2 text-sm">
        {formattedLabel}
      </p>
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: 'var(--color-transactions)' }}
        />
        <span className="text-xs font-medium text-muted-foreground">
          Transactions
        </span>
        <span className="text-sm font-semibold text-popover-foreground ml-auto">
          {value.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

const MonthlyTransactionsChart = () => {
  const { filters } = useAnalyticsFilters()
  const axisGradientX = 'axisGradientX'
  const axisGradientY = 'axisGradientY'

  // Calculate months back from date range filter (default to 6 months as per requirements)
  const monthsBack = useMemo(() => {
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const months = differenceInMonths(filters.dateRange.to, filters.dateRange.from)
      return Math.max(1, Math.ceil(months))
    }
    return 6 // Default to 6 months as per requirements
  }, [filters.dateRange])

  // Prepare filters for API
  const apiFilters = useMemo<UsageVolumeTimeseriesFilters | undefined>(() => {
    const hasFilters = filters.region !== 'all' ||
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

  const { data: volumeData, loading, error } = useUsageVolumeTimeseries(monthsBack, apiFilters)

  // Log current filter state for debugging
  console.log('MonthlyTransactionsChart filters:', filters, 'monthsBack:', monthsBack)

  // Calculate date range from data for badge display
  const dateRange = useMemo(() => {
    if (volumeData.length === 0) return 'Jan 2025 - Aug 2025'
    const firstMonth = volumeData[0].month
    const lastMonth = volumeData[volumeData.length - 1].month

    // Format to short version (e.g., "July 2025" -> "Jul 2025")
    const formatShort = (monthYear: string) => {
      try {
        const [month, year] = monthYear.split(' ')
        const shortMonth = month.substring(0, 3)
        return `${shortMonth} ${year}`
      } catch {
        return monthYear
      }
    }

    return `${formatShort(firstMonth)} - ${formatShort(lastMonth)}`
  }, [volumeData])

  // Map volume data to transactions format
  const chartData = useMemo(() =>
    volumeData.map(item => ({
      month: item.month,
      transactions: item.count
    })),
    [volumeData]
  )

  const { domainMax, ticks } = useMemo(() => {
    if (!chartData.length) {
      return {
        domainMax: 1000,
        ticks: [200, 400, 600, 800, 1000]
      }
    }

    const values = chartData.map(item => item.transactions)
    const maxValue = Math.max(...values)
    const paddedMax = Math.ceil(maxValue / 100) * 100
    const safeMax = Math.max(200, paddedMax)
    const tickCount = 5
    const step = safeMax / tickCount
    const tickValues = Array.from({ length: tickCount }, (_, index) =>
      Math.round((index + 1) * step)
    )

    return {
      domainMax: safeMax,
      ticks: tickValues
    }
  }, [chartData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="flex-1"
    >
      <Card className="h-[245px] w-full flex-1 min-w-[280px] rounded-2xl border-[#e7e8ea]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-[#616675] tracking-[-0.12px]">
              Monthly Transactions
            </h3>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-0 h-auto text-xs text-[#9296a0] font-medium tracking-[-0.12px] border-0 bg-transparent">
            <span>{dateRange}</span>
            <Calendar className="h-4 w-4" />
          </Badge>
        </CardHeader>
        <CardContent className="h-[172px] p-0 relative -left-5 top-5">
          {loading ? (
            <div className="flex items-center justify-center h-full w-full px-6">
              <AnimatedSkeleton className="w-full h-[150px] rounded-2xl" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-red-600 px-2 text-center">
                {typeof error === 'string' ? error : 'Failed to load chart data'}
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
              <BarChart data={chartData} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3AC828" />
                    <stop offset="100%" stopColor="#8a95ff" />
                  </linearGradient>
                  <linearGradient id={axisGradientX} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#35c0c0" />
                    <stop offset="100%" stopColor="#7c6cf7" />
                  </linearGradient>
                  <linearGradient id={axisGradientY} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#35c0c0" />
                    <stop offset="100%" stopColor="#7c6cf7" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  horizontal
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={{ strokeWidth: 2, stroke: `url(#${axisGradientX})` }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#949494', fontFamily: 'Roboto', fontWeight: 500 }}
                  interval={0}
                  tickFormatter={formatMonthLabel}
                />
                <YAxis
                  axisLine={{ strokeWidth: 2, stroke: `url(#${axisGradientY})` }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#949494', fontFamily: 'Roboto', fontWeight: 500 }}
                  domain={[0, domainMax]}
                  ticks={ticks}
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  content={<CustomTooltip />}
                />
                <Bar
                  dataKey="transactions"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={10}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default MonthlyTransactionsChart
