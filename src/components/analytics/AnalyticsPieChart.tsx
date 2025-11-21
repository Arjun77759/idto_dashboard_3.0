import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useUsageOverview } from '@/hooks/useUsageOverview'
import { useMemo } from 'react'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'

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
        { name: 'Completed', value: 10, color: '#54eebe', gradientId: 'successGradient' },
        { name: 'Failed', value: 0, color: '#f7f7f8', gradientId: 'failedGradient' },
      ]
    }

    const total = data.total_verifications.count
    const success = data.successful_verifications?.count || 0
    const failed = data.failed_verifications?.count || 0

    const successPercentage = total > 0 ? Math.round((success / total) * 100) : 0
    const failedPercentage = total > 0 ? Math.round((failed / total) * 100) : 0

    return [
      { name: 'Completed', value: successPercentage, color: '#54eebe', gradientId: 'successGradient' },
      { name: 'Failed', value: failedPercentage, color: '#f7f7f8', gradientId: 'failedGradient' },
    ]
  }, [data])

  // Generate SVG path for semi-circle pie chart
  // ViewBox: 0 0 211 102, center at (105.5, 102), radius ~94
  // Semi-circle goes from top (0°) to bottom (180°)
  const generatePiePath = (startAngle: number, endAngle: number, radius: number = 94, centerX: number = 105.5, centerY: number = 102) => {
    const start = angleToPoint(startAngle, radius, centerX, centerY)
    const end = angleToPoint(endAngle, radius, centerX, centerY)
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    
    return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`
  }

  const angleToPoint = (angle: number, radius: number, centerX: number, centerY: number) => {
    // Convert angle to radians, starting from top (0° = top, 180° = bottom)
    const rad = (angle - 90) * (Math.PI / 180)
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad)
    }
  }

  // Calculate pie segments
  const pieSegments = useMemo(() => {
    if (!chartData || chartData.length === 0) return []
    
    let currentAngle = 0 // Start from top (0°)
    const segments = []
    
    // Process segments in order: Completed first, then Failed
    const sortedData = [...chartData].sort((a, b) => {
      // Completed comes first, then Failed
      if (a.name === 'Completed') return -1
      if (b.name === 'Completed') return 1
      return 0
    })
    
    for (const segment of sortedData) {
      if (segment.value === 0) continue
      
      const angle = (segment.value / 100) * 180 // Semi-circle is 180 degrees
      const startAngle = currentAngle
      const endAngle = currentAngle + angle
      
      segments.push({
        ...segment,
        startAngle,
        endAngle,
        path: generatePiePath(startAngle, endAngle)
      })
      
      currentAngle = endAngle
    }
    
    return segments
  }, [chartData])

  // Format percentage for display
  const formatPercentage = (value: number) => {
    return `${value}%`
  }
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
              <svg width="211" height="102" viewBox="0 0 211 102" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="successGradient" x1="105.5" y1="8" x2="105.5" y2="102" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#54EEBE" />
                    <stop offset="1" stopColor="#8A95FF" />
                  </linearGradient>
                </defs>
                {/* Background semi-circle - full 180 degree arc */}
                <path 
                  d="M 105.5 102 L 11.5 102 A 94 94 0 0 1 199.5 102 Z" 
                  fill="#f7f7f8" 
                />
                {/* Dynamic pie segments - rendered on top of background */}
                {pieSegments.map((segment, index) => {
                  if (segment.value === 0) return null
                  
                  // Use gradient for success, solid color for failed
                  const fill = segment.name === 'Completed' 
                    ? `url(#successGradient)` 
                    : segment.color
                  
                  return (
                    <path
                      key={`${segment.name}-${index}`}
                      d={segment.path}
                      fill={fill}
                    />
                  )
                })}
              </svg>
              
              {/* Legend */}
              <div className="flex flex-col gap-2 items-start w-full px-6">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: item.name === 'Completed' ? 'transparent' : item.color,
                          backgroundImage: item.name === 'Completed' ? 'linear-gradient(to bottom, #54EEBE, #8A95FF)' : 'none'
                        }}
                      />
                      <span className="text-[11px] text-[#616675] font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#131b31] font-semibold">
                      {formatPercentage(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AnalyticsPieChart
