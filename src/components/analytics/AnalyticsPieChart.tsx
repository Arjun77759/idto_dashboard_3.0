import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'
import { useUsageOverview } from '@/hooks/useUsageOverview'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

const AnalyticsPieChart = () => {
  const { filters } = useAnalyticsFilters()
  // TODO: Pass filters to API hook when backend supports filtering
  // const { data, loading, error } = useUsageOverview(filters)
  const { data, loading, error } = useUsageOverview()

  // Log current filter state for debugging
  console.log('AnalyticsPieChart filters:', filters)

  // Calculate status distribution percentages from API data
  const chartData = useMemo(() => {
    if (!data || !data.total_verifications || data.total_verifications.count === 0) {
      return [
        { name: 'Completed', value: 10, color: '#3AC828', gradientId: 'successGradient' },
        { name: 'Failed', value: 0, color: '#f7f7f8', gradientId: 'failedGradient' },
      ]
    }

    const total = data.total_verifications.count
    const success = data.successful_verifications?.count || 0
    const failed = data.failed_verifications?.count || 0

    const successPercentage = total > 0 ? Math.round((success / total) * 100) : 0
    const failedPercentage = total > 0 ? Math.round((failed / total) * 100) : 0

    return [
      { name: 'Completed', value: successPercentage, color: '#3AC828', gradientId: 'successGradient' },
      { name: 'Failed', value: failedPercentage, color: '#f7f7f8', gradientId: 'failedGradient' },
    ]
  }, [data])

  const completedValue = chartData.find(item => item.name === 'Completed')?.value ?? 0
  const failedValue = chartData.find(item => item.name === 'Failed')?.value ?? 0
  const visibleTotal = Math.max(1, completedValue + failedValue)

  const pieOptions = useMemo(() => ({
    animationDuration: 600,
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#e7e8ea',
      borderWidth: 1,
      textStyle: {
        color: '#616675',
        fontSize: 12,
      },
      formatter: (params: any) => {
        if (params?.data?.isPlaceholder) return ''
        return `
          <div style="font-size:11px;color:#9296a0;">${params.name}</div>
          <div style="font-size:13px;font-weight:600;color:#131b31;">${params.value}%</div>
        `
      },
      extraCssText: 'border-radius:8px;padding:8px 10px;',
    },
    series: [
      {
        name: 'Background',
        type: 'pie',
        startAngle: 180,
        radius: ['80%', '100%'],
        center: ['50%', '90%'],
        silent: true,
        label: { show: false },
        data: [
          {
            value: visibleTotal,
            name: 'Back',
            itemStyle: { color: '#f3f4f6', },
            tooltip: { show: false },
          },
          {
            value: visibleTotal,
            name: 'BackGap',
            itemStyle: { color: 'transparent' },
            tooltip: { show: false },
          },
        ],
        z: 1,
      },
      {
        name: 'Status',
        type: 'pie',
        startAngle: 180,
        radius: ['80%', '100%'],
        center: ['50%', '90%'],
        avoidLabelOverlap: true,
        label: { show: false },
        data: [
          {
            value: completedValue,
            name: 'Completed',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#3AC828' },
                { offset: 1, color: '#8A95FF' },
              ]),
            },
          },
          {
            value: failedValue,
            name: 'Failed',
            itemStyle: { color: '#f7f7f8' },
          },
          {
            value: visibleTotal,
            name: 'Placeholder',
            itemStyle: { color: 'transparent' },
            tooltip: { show: false },
            label: { show: false },
            emphasis: { disabled: true },
            isPlaceholder: true,
          },
        ],
        z: 2,
      },
    ],
  }), [completedValue, failedValue, visibleTotal])

  // Format percentage for display
  const formatPercentage = (value: number) => `${value}%`
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="h-[245px] w-full min-w-[280px] rounded-2xl border-[#e7e8ea]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-[#616675] tracking-[-0.12px]">
              Verification Status Distribution
            </h3>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[172px] p-0">
          {loading ? (
            <div className="w-32 h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-red-600 px-2 text-center">
                {typeof error === 'string' ? error : 'Failed to load chart data'}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <div className="relative w-full px-4">
                <ReactECharts
                  option={pieOptions}
                  notMerge
                  lazyUpdate
                  style={{ width: '100%', height: 200, marginTop: '-50px' }}
                  opts={{ renderer: 'svg' }}
                />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center translate-y-4">
                  <span className="text-[11px] opacity-0 font-medium text-[#616675] uppercase tracking-[0.6px]">
                    Completed
                  </span>
                  <span className="text-2xl font-semibold text-[#131b31] leading-tight">
                    {formatPercentage(completedValue)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AnalyticsPieChart
