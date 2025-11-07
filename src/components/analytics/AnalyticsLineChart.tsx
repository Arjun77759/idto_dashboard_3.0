import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Calendar } from 'lucide-react'
import { useUsageVolumeTimeseries } from '@/hooks/useUsageVolumeTimeseries'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'
import { useMemo } from 'react'
import { format, differenceInMonths } from 'date-fns'

const AnalyticsLineChart = () => {
  const { filters } = useAnalyticsFilters()
  
  // Calculate months back from date range filter (default to 6 months as per requirements)
  const monthsBack = useMemo(() => {
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const months = differenceInMonths(filters.dateRange.to, filters.dateRange.from)
      return Math.max(1, Math.ceil(months))
    }
    return 6 // Default to 6 months as per requirements
  }, [filters.dateRange])

  // TODO: Pass additional filters to API hook when backend supports filtering
  // const { data, loading, error } = useUsageVolumeTimeseries(monthsBack, filters)
  const { data, loading, error } = useUsageVolumeTimeseries(monthsBack)

  // Log current filter state for debugging
  console.log('AnalyticsLineChart filters:', filters, 'monthsBack:', monthsBack)

  // Format date range from filters for display
  const dateRangeLabel = useMemo(() => {
    if (filters.dateRange?.from && filters.dateRange?.to) {
      return `${format(filters.dateRange.from, 'MMM yyyy')} - ${format(filters.dateRange.to, 'MMM yyyy')}`
    }
    return 'Jan 2025 - Aug 2025' // Fallback
  }, [filters.dateRange])

  if (error) {
    console.error('Failed to load verification volume:', error)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
      className="flex-1"
    >
      <Card className="h-[245px] w-full min-w-[280px] rounded-2xl border-[#e7e8ea]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-[#616675] tracking-[-0.12px]">
                  Verification Volume over Time
            </h3>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-0 h-auto text-xs text-[#9296a0] font-medium tracking-[-0.12px] border-0 bg-transparent">
            <span>{dateRangeLabel}</span>
            <Calendar className="h-4 w-4" />
          </Badge>
        </CardHeader>
        <CardContent className="h-[220px] p-0 px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-full h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 15, left: 15, bottom: 20 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f0f0f0" 
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#616675' }}
                interval={0}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                hide
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
                formatter={(value: number) => [`${value}`, 'Volume']}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AnalyticsLineChart
