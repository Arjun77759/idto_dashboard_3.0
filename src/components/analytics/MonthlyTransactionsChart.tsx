import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Calendar } from 'lucide-react'
import { useUsageVolumeTimeseries } from '@/hooks/useUsageVolumeTimeseries'
import { useMemo } from 'react'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'
import { differenceInMonths, format } from 'date-fns'
import type { UsageVolumeTimeseriesFilters } from '@/api/usageApi'

const MonthlyTransactionsChart = () => {
  const { filters } = useAnalyticsFilters()
  
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

  // Format month labels to shorter version (e.g., "July 2025" -> "Jul '25")
  const formatMonth = (monthYear: string) => {
    try {
      const [month, year] = monthYear.split(' ')
      const shortMonth = month.substring(0, 3) // First 3 letters
      const shortYear = year.substring(2) // Last 2 digits
      return `${shortMonth} '${shortYear}`
    } catch {
      return monthYear
    }
  }

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
            <div className="flex items-center justify-center h-full relative left-10 w-[90%]">
              <div className="w-full h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-red-600 px-2 text-center">
                {typeof error === 'string' ? error : 'Failed to load chart data'}
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3AC828" />
                  <stop offset="100%" stopColor="#8a95ff" />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f0f0f0" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#949494', fontFamily: 'Roboto', fontWeight: 500 }}
                tickFormatter={formatMonth}
                interval={0}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#949494', fontFamily: 'Roboto', fontWeight: 500 }}
                domain={[0, 1000]}
                ticks={[200, 400, 600, 800, 1000]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e7e8ea',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#616675'
                }}
                labelStyle={{ color: '#616675', fontSize: '12px' }}
                formatter={(value: number) => [`${value}`, 'Transactions']}
              />
              <Bar 
                dataKey="transactions" 
                fill="url(#barGradient)"
                radius={[0, 0, 0, 0]}
                maxBarSize={6}
              />
            </BarChart>
          </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default MonthlyTransactionsChart
