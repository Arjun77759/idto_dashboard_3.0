import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { useUsageVolumeTimeseries } from '@/hooks/useUsageVolumeTimeseries'
import { useMemo } from 'react'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'
import { differenceInMonths, format } from 'date-fns'
import type { UsageVolumeTimeseriesFilters } from '@/api/usageApi'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'

const VerificationVolumeChart = () => {
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

  const { data, loading, error } = useUsageVolumeTimeseries(monthsBack, apiFilters)

  // Log current filter state for debugging
  console.log('VerificationVolumeChart filters:', filters, 'monthsBack:', monthsBack)

  // Format month labels to shorter version (e.g., "July 2025" -> "Jul '25")
  const formatMonth = (monthYear: string) => {
    try {
      const [month] = monthYear.split(' ')
      const shortMonth = month.substring(0, 3)
      return `${shortMonth}`
    } catch {
      return monthYear
    }
  }

  // Calculate date range from data for badge display
  const dateRange = useMemo(() => {
    if (data.length === 0) return 'Jan 2025 - Aug 2025'
    const firstMonth = data[0].month
    const lastMonth = data[data.length - 1].month
    
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
  }, [data])

  const chartOptions = useMemo(() => {
    const months = data.map(point => formatMonth(point.month))
    const counts = data.map(point => point.count)

    return {
      grid: {
        left: -20,
        right: 24,
        top: 10,
        bottom: 20,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#e7e8ea',
        borderWidth: 1,
        textStyle: {
          color: '#616675',
          fontSize: 12
        },
        formatter: (params: any) => {
          const [point] = params
          if (!point) return ''
          return `
            <div>
              <div style="font-size: 11px; color: #9296a0">${point.axisValue}</div>
              <div style="font-weight:600;color:#111827">${point.data} verifications</div>
            </div>
          `
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#00A370'
          }
        },
        extraCssText: 'border-radius:8px;padding:8px 10px;'
      },
      xAxis: {
        type: 'category',
        data: months,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#616675',
          fontSize: 12,
          margin: 16
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#f0f0f0',
            type: 'solid'
          }
        }
      },
      yAxis: {
        type: 'value',
        show: false,
        min: (value: { min: number }) => Math.max(0, value.min - 20)
      },
      series: [
        {
          type: 'line',
          data: counts,
          smooth: false,
          showSymbol: false,
          lineStyle: {
            width: 2.5,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#0019FF' },
              { offset: 0.5, color: '#00C0A7' },
              { offset: 1, color: '#00A370' }
            ])
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 163, 112, 0.25)' },
              { offset: 1, color: 'rgba(0, 25, 255, 0)' }
            ])
          }
        },
        {
          type: 'scatter',
          data: counts,
          symbol: 'circle',
          symbolSize: 12,
          itemStyle: {
            color: '#ffffff',
            shadowBlur: 18,
            shadowColor: 'rgba(0, 25, 255, 0.35)'
          },
          zlevel: 2
        },
        {
          type: 'scatter',
          data: counts,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#00A370' },
              { offset: 1, color: '#0019FF' }
            ]),
            borderColor: '#ffffff',
            borderWidth: 0
          },
          zlevel: 3
        },
        {
          type: 'scatter',
          data: counts,
          symbol: 'circle',
          symbolSize: 2.5,
          itemStyle: {
            color: '#ffffff'
          },
          zlevel: 4
        }
      ]
    }
  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="flex-1"
    >
      <Card className="h-[245px] w-full flex-1 min-w-[280px] rounded-2xl border-[#e7e8ea]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-[#616675] tracking-[-0.12px]">
              Verification Volume over Time
            </h3>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-0 h-auto text-xs text-[#9296a0] font-medium tracking-[-0.12px] border-0 bg-transparent">
            <span>{dateRange}</span>
            <Calendar className="h-4 w-4" />
          </Badge>
        </CardHeader>
        <CardContent className="h-[202px] p-0 px-6 pb-6 relative top-5">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-full h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-red-600 px-2 text-center">
                {typeof error === 'string' ? error : 'Failed to load chart data'}
              </div>
            </div>
          ) : (
            <ReactECharts
              option={chartOptions}
              notMerge
              lazyUpdate
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default VerificationVolumeChart
