import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUsageVolumeTimeseries } from '@/hooks/useUsageVolumeTimeseries'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useMemo } from 'react'

const ChartSection = () => {
  const { data, loading, error } = useUsageVolumeTimeseries(5)

  // Format month labels to shorter version (e.g., "July 2025" -> "Jul '25")
  const formatMonth = (monthYear: string) => {
    try {
      const [month] = monthYear.split(' ')
      const shortMonth = month.substring(0, 3) // First 3 letters
      return `${shortMonth}`
    } catch {
      return monthYear
    }
  }

  const chartOptions = useMemo(() => {
    const months = data.map(point => formatMonth(point.month))
    const counts = data.map(point => point.count)

    return {
      grid: {
        left: -30,
        right: 20,
        top: 10,
        bottom: 20,
        containLabel: true,
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
          fontSize: 11,
          rotate: -15,
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
          type:'line',
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
      transition={{ duration: 0.3, delay: 0.4 }}
      className="min-w-[300px] w-[411px] h-full max-w-full"
    >
      <Card className="h-full rounded-2xl border-[#e7e8ea]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-[#616675] tracking-[-0.12px]">
              Verification Volume over Time
            </h3>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-0 h-auto text-xs text-[#9296a0] font-medium tracking-[-0.12px] border-0 bg-transparent">
            <span>Last 6-12 months</span>
            <Calendar className="h-4 w-4" />
          </Badge>
        </CardHeader>
        <CardContent className="h-[220px] p-0 px-6 pb-6 relative top-5">
          {loading ? (
            <div className="w-full h-full flex items-center gap-4">
              <Skeleton className="h-[180px] w-full" />
            </div>
          ) : error ? (
            <div className="text-sm text-red-600 px-2">
              {typeof error === 'string' ? error : 'Failed to load chart data'}
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

export default ChartSection
