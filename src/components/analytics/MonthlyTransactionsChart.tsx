import type { UsageVolumeTimeseriesFilters } from '@/api/usageApi'
import AnimatedSkeleton from '@/components/AnimatedSkeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'
import { useUsageVolumeTimeseries } from '@/hooks/useUsageVolumeTimeseries'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

// Month names in order for always showing Jan ... Dec
const MONTH_ORDER = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Used for tick label formatting
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const chartConfig = {
  transactions: {
    label: 'Transactions',
    color: '#3AC828'
  }
} satisfies ChartConfig

const formatMonthLabel = (monthYear: string) => {
  // Expects label like 'January 2024'
  try {
    const [month, year] = monthYear.split(' ')
    const idx = MONTH_ORDER.findIndex(m => m === month)
    const shortMonth = idx !== -1 ? MONTH_SHORT[idx] : month.substring(0, 3)
    const shortYear = year?.substring(2)
    return `${shortMonth}`
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

// Helper: Returns array ["Month YYYY", ...] for every month in full year indicated by 'year'
function getFullYearMonthLabels(year: number): string[] {
  return MONTH_ORDER.map(month => `${month} ${year}`)
}

const MonthlyTransactionsChart = () => {
  const { filters } = useAnalyticsFilters()
  const axisGradientX = 'axisGradientX'
  const axisGradientY = 'axisGradientY'

  // Determine the year to show: Use filter if provided, otherwise current year
  const { year, monthLabels } = useMemo(() => {
    // If both from/to in filter and within the same year, use that year
    // If from/to are in different years, fallback to current year (or expand logic as needed)
    let displayYear: number
    if (filters.dateRange?.from) {
      displayYear = filters.dateRange.from.getFullYear()
    } else {
      displayYear = new Date().getFullYear()
    }
    return {
      year: displayYear,
      monthLabels: getFullYearMonthLabels(displayYear)
    }
  }, [filters.dateRange])

  // Always request the full year to backend
  // Compute start_date = Jan 1, end_date = Dec 31 of the year to show
  const monthsBack = 12
  const apiFilters = useMemo<UsageVolumeTimeseriesFilters | undefined>(() => {
    const hasFilters = filters.region !== 'all' ||
      filters.verificationType !== 'all' ||
      filters.deviceType !== 'desktop'

    // Always set year range
    const start = new Date(year, 0, 1)
    const end = new Date(year, 11, 31)

    return {
      start_date: format(start, 'yyyy-MM-dd'),
      end_date: format(end, 'yyyy-MM-dd'),
      region: filters.region !== 'all' ? filters.region : undefined,
      api_name: filters.verificationType !== 'all' ? filters.verificationType : undefined,
      device_type: filters.deviceType !== 'desktop' ? filters.deviceType : undefined
    }
  }, [filters.region, filters.verificationType, filters.deviceType, year])

  const { data: volumeData, loading, error } = useUsageVolumeTimeseries(monthsBack, apiFilters)

  // Map: { "January 2024" => count, ... }
  const volumeDataMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const item of volumeData) {
      map[item.month] = item.count
    }
    return map
  }, [volumeData])

  // Always show every month for the year. Fill in 0 if missing.
  const chartData = useMemo(() => {
    return monthLabels.map(label => ({
      month: label,
      transactions: volumeDataMap[label] ?? 0,
    }))
  }, [monthLabels, volumeDataMap])

  // The date range badge should say for example: "Jan 2024 - Dec 2024"
  const dateRange = useMemo(() => {
    if (monthLabels.length === 0) return '---'
    const formatShort = (monthYear: string) => {
      try {
        const [month, year] = monthYear.split(' ')
        const idx = MONTH_ORDER.findIndex(m => m === month)
        const shortMonth = idx !== -1 ? MONTH_SHORT[idx] : month.substring(0, 3)
        return `${shortMonth}`
      } catch {
        return monthYear
      }
    }
    return `${formatShort(monthLabels[0])} - ${formatShort(monthLabels[monthLabels.length - 1])}`
  }, [monthLabels])

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
                    <stop offset="0%" stopColor="#54EEBE" />
                    <stop offset="100%" stopColor="#8a95ff" />
                  </linearGradient>
                  <linearGradient id={axisGradientX} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#54EEBE" />
                    <stop offset="100%" stopColor="#8A95FF" />
                  </linearGradient>
                  <linearGradient id={axisGradientY} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#54EEBE" />
                    <stop offset="100%" stopColor="#8A95FF" />
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
                  axisLine={true}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#949494', fontFamily: 'Roboto', fontWeight: 500 }}
                  interval={0}
                  tickFormatter={formatMonthLabel}
                  minTickGap={0}
                  stroke="#54EEBE"
                  allowDataOverflow={false}
                // No need for domain, chartData always Jan ... Dec now
                />
                <YAxis
                  axisLine={true}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#949494', fontFamily: 'Roboto', fontWeight: 500 }}
                  domain={[0, domainMax]}
                  ticks={ticks}
                  stroke="#54EEBE"
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  content={<CustomTooltip />}
                />
                <Bar
                  dataKey="transactions"
                  fill="url(#barGradient)"
                  maxBarSize={15}
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
