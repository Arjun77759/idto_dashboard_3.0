import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { useUsageVolumeTimeseries } from '@/hooks/useUsageVolumeTimeseries'
import { Skeleton } from '@/components/ui/skeleton'

const ChartSection = () => {
  const { data, loading, error } = useUsageVolumeTimeseries('month')

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
            <div className="text-sm text-red-600 px-2">{error}</div>
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
                className='text-[#616675] text-xs'
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
              />
              <Line
                type="monotone"
                dataKey="volume"
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

export default ChartSection
